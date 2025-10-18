"""
Chatbot Dashboard Service for SHELTR-AI
Handles chat sessions, messages, agent configurations, and multi-modal interactions
"""

import os
import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Optional, Any
from firebase_admin import firestore
import logging
from services.openai_service import OpenAIService
from services.anthropic_service import anthropic_service
from services.chatbot.rag_orchestrator import RAGOrchestrator

logger = logging.getLogger(__name__)

class ChatbotDashboardService:
    """Service for managing chatbot dashboard functionality"""
    
    def __init__(self):
        self.db = firestore.client()
        self.openai_service = OpenAIService()
        self.anthropic_service = anthropic_service
        self.rag_orchestrator = RAGOrchestrator()
    
    async def get_chat_sessions(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all chat sessions for a user"""
        try:
            sessions_ref = self.db.collection('chat_sessions').where('user_id', '==', user_id)
            sessions = []
            
            for doc in sessions_ref.stream():
                session_data = doc.to_dict()
                session_data['id'] = doc.id
                session_data['created_at'] = session_data.get('created_at').isoformat() if session_data.get('created_at') else None
                session_data['updated_at'] = session_data.get('updated_at').isoformat() if session_data.get('updated_at') else None
                
                # Get actual message count and last message from chat_messages collection
                messages = await self.get_chat_messages(doc.id)
                session_data['message_count'] = len(messages)
                
                # Get last message content
                if messages:
                    last_msg = messages[-1]  # Last message (sorted by timestamp)
                    session_data['last_message'] = last_msg.get('content', '')[:50] + ('...' if len(last_msg.get('content', '')) > 50 else '')
                else:
                    session_data['last_message'] = 'No messages yet'
                
                sessions.append(session_data)
            
            # Sort by updated_at descending
            sessions.sort(key=lambda x: x['updated_at'] or '', reverse=True)
            return sessions
            
        except Exception as e:
            logger.error(f"Failed to get chat sessions: {str(e)}")
            return []
    
    async def create_chat_session(self, user_id: str, title: str, agent_type: str, model: str) -> str:
        """Create a new chat session"""
        try:
            session_data = {
                'user_id': user_id,
                'title': title,
                'agent_type': agent_type,
                'model': model,
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc),
                'message_count': 0,
                'status': 'active'
            }
            
            doc_ref = self.db.collection('chat_sessions').add(session_data)
            return doc_ref[1].id
            
        except Exception as e:
            logger.error(f"Failed to create chat session: {str(e)}")
            raise Exception(f"Failed to create chat session: {str(e)}")
    
    async def get_chat_messages(self, session_id: str) -> List[Dict[str, Any]]:
        """Get all messages for a chat session"""
        try:
            messages_ref = self.db.collection('chat_messages').where('session_id', '==', session_id)
            messages = []
            
            for doc in messages_ref.stream():
                message_data = doc.to_dict()
                message_data['id'] = doc.id
                message_data['timestamp'] = message_data.get('timestamp').isoformat() if message_data.get('timestamp') else None
                messages.append(message_data)
            
            # Sort by timestamp ascending
            messages.sort(key=lambda x: x['timestamp'] or '')
            return messages
            
        except Exception as e:
            logger.error(f"Failed to get chat messages: {str(e)}")
            return []
    
    async def generate_session_title(self, first_user_message: str) -> str:
        """Generate a concise title for a chat session based on the first message"""
        try:
            # Use OpenAI to generate a short, descriptive title
            prompt = f"""Generate a very short (3-6 words) title for a chat conversation that starts with this message:

"{first_user_message[:200]}"

Requirements:
- Maximum 6 words
- Descriptive and specific
- No quotes or punctuation at the end
- Title case

Examples:
- "Virtual Debit Card Overview"
- "SHELTR Platform Introduction"
- "Participant Privacy Guidelines"

Title:"""
            
            title = await self.openai_service.generate_response(
                message=prompt,
                context={},
                system_prompt="You are a helpful assistant that generates concise, descriptive titles. Respond with ONLY the title, nothing else."
            )
            
            # Clean up the title
            title = title.strip().strip('"').strip("'")
            
            # Limit to 60 characters max
            if len(title) > 60:
                title = title[:57] + "..."
            
            return title
            
        except Exception as e:
            logger.error(f"Failed to generate session title: {str(e)}")
            # Fallback: Use first few words of message
            words = first_user_message.split()[:5]
            return ' '.join(words) + ('...' if len(first_user_message.split()) > 5 else '')
    
    async def add_chat_message(self, session_id: str, role: str, content: str, metadata: Optional[Dict] = None) -> str:
        """Add a new message to a chat session"""
        try:
            message_data = {
                'session_id': session_id,
                'role': role,
                'content': content,
                'timestamp': datetime.now(timezone.utc),
                'metadata': metadata or {}
            }
            
            doc_ref = self.db.collection('chat_messages').add(message_data)
            
            # Update session message count and timestamp
            session_ref = self.db.collection('chat_sessions').document(session_id)
            session_ref.update({
                'message_count': firestore.Increment(1),
                'updated_at': datetime.now(timezone.utc)
            })
            
            return doc_ref[1].id
            
        except Exception as e:
            logger.error(f"Failed to add chat message: {str(e)}")
            raise Exception(f"Failed to add chat message: {str(e)}")
    
    async def send_message(self, session_id: str, user_message: str, agent_config: Dict[str, Any]) -> Dict[str, Any]:
        """Send a message and get AI response"""
        try:
            # Add user message to database
            await self.add_chat_message(session_id, 'user', user_message)
            
            # Get conversation history for context
            messages = await self.get_chat_messages(session_id)
            
            # Auto-generate title if this is the first user message
            # Check if session has a generic title (starts with "New Chat")
            session_ref = self.db.collection('chat_sessions').document(session_id)
            session_data = session_ref.get().to_dict()
            
            generated_title = None  # Track if we generated a new title
            if session_data and session_data.get('title', '').startswith('New Chat'):
                # This is the first message, generate a better title
                logger.info(f"📝 Auto-generating title for session {session_id} from first message")
                new_title = await self.generate_session_title(user_message)
                session_ref.update({'title': new_title})
                generated_title = new_title  # Store for response
                logger.info(f"✅ Session title updated to: {new_title}")
            
            # Prepare conversation context
            conversation_history = []
            for msg in messages[-10:]:  # Last 10 messages for context
                conversation_history.append({
                    'role': msg['role'],
                    'content': msg['content']
                })
            
            # Add current user message
            conversation_history.append({
                'role': 'user',
                'content': user_message
            })
            
            # Get agent instructions and type
            instructions = agent_config.get('instructions', 'You are a helpful AI assistant.')
            agent_type = agent_config.get('id', 'general')  # Extract agent type from config
            logger.info(f"🤖 Using agent: {agent_type} for chatbot dashboard session {session_id}")
            
            # Search knowledge base (handles query enhancement internally)
            # NOTE: search_knowledge_base() calls _search_relevant_knowledge() 
            # which calls _enhance_search_query() internally, so we don't need to enhance separately
            relevant_context = await self.rag_orchestrator.search_knowledge_base(
                user_message,  # Pass original query, not pre-enhanced
                agent_type=agent_type
            )
            
            # Prepare system message with context
            system_message = f"""{instructions}

Relevant context: {relevant_context[:1000] if relevant_context else 'No specific context available.'}

IMPORTANT: Always provide complete, well-structured responses. Finish your thoughts completely rather than cutting off mid-sentence. Aim for comprehensive yet concise answers that fully address the user's question."""
            
            # Get model from agent config
            model = agent_config.get('model', 'gpt-4o-mini')
            provider = self._get_provider_from_model(model)
            
            logger.info(f"🤖 Using {provider} provider with model: {model}")
            
            # Generate AI response based on provider
            if provider == "anthropic":
                response = await self._generate_anthropic_response(
                    conversation_history=conversation_history,
                    system_prompt=system_message,
                    model=model
                )
            else:  # Default to OpenAI
                response = await self.openai_service.generate_response(
                    message=user_message,
                    context={'conversation_history': conversation_history},
                    system_prompt=system_message
                )
            
            # Add assistant message to database
            metadata = {
                'model': model,
                'provider': provider,
                'tokens_used': 0,  # Token tracking can be added later
                'context_used': bool(relevant_context)
            }
            
            await self.add_chat_message(session_id, 'assistant', response, metadata)
            
            # Prepare response data
            response_data = {
                'message': response,
                'metadata': metadata
            }
            
            # Include the generated title if one was created
            if generated_title:
                response_data['session_title'] = generated_title
                logger.info(f"📤 Returning new session title in response: {generated_title}")
            
            return {
                'success': True,
                'data': response_data
            }
            
        except Exception as e:
            logger.error(f"Failed to send message: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def get_agent_configurations(self) -> List[Dict[str, Any]]:
        """Get all agent configurations"""
        try:
            agents_ref = self.db.collection('agent_configurations')
            agents = []
            
            for doc in agents_ref.stream():
                agent_data = doc.to_dict()
                agent_data['id'] = doc.id
                agents.append(agent_data)
            
            return agents
            
        except Exception as e:
            logger.error(f"Failed to get agent configurations: {str(e)}")
            return []
    
    async def save_agent_configuration(self, agent_data: Dict[str, Any]) -> str:
        """Save or update agent configuration"""
        try:
            if 'id' in agent_data and agent_data['id']:
                # Update existing agent
                doc_ref = self.db.collection('agent_configurations').document(agent_data['id'])
                doc_ref.update(agent_data)
                return agent_data['id']
            else:
                # Create new agent
                agent_data['id'] = str(uuid.uuid4())
                agent_data['created_at'] = datetime.now(timezone.utc)
                agent_data['updated_at'] = datetime.now(timezone.utc)
                
                doc_ref = self.db.collection('agent_configurations').document(agent_data['id'])
                doc_ref.set(agent_data)
                return agent_data['id']
                
        except Exception as e:
            logger.error(f"Failed to save agent configuration: {str(e)}")
            raise Exception(f"Failed to save agent configuration: {str(e)}")
    
    async def delete_chat_session(self, session_id: str) -> bool:
        """Delete a chat session and all its messages"""
        try:
            # Delete all messages in the session
            messages_ref = self.db.collection('chat_messages').where('session_id', '==', session_id)
            for doc in messages_ref.stream():
                doc.reference.delete()
            
            # Delete the session
            self.db.collection('chat_sessions').document(session_id).delete()
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete chat session: {str(e)}")
            return False
    
    async def update_session_title(self, session_id: str, title: str) -> bool:
        """Update chat session title"""
        try:
            self.db.collection('chat_sessions').document(session_id).update({
                'title': title,
                'updated_at': datetime.now(timezone.utc)
            })
            return True
            
        except Exception as e:
            logger.error(f"Failed to update session title: {str(e)}")
            return False
    
    async def get_chat_analytics(self, user_id: str) -> Dict[str, Any]:
        """Get chat analytics for a user"""
        try:
            sessions = await self.get_chat_sessions(user_id)
            
            total_sessions = len(sessions)
            total_messages = sum(session.get('message_count', 0) for session in sessions)
            active_sessions = len([s for s in sessions if s.get('status') == 'active'])
            
            # Get message count by agent type
            agent_stats = {}
            for session in sessions:
                agent_type = session.get('agent_type', 'unknown')
                if agent_type not in agent_stats:
                    agent_stats[agent_type] = {'sessions': 0, 'messages': 0}
                agent_stats[agent_type]['sessions'] += 1
                agent_stats[agent_type]['messages'] += session.get('message_count', 0)
            
            return {
                'total_sessions': total_sessions,
                'total_messages': total_messages,
                'active_sessions': active_sessions,
                'agent_stats': agent_stats,
                'last_activity': sessions[0].get('updated_at') if sessions else None
            }
            
        except Exception as e:
            logger.error(f"Failed to get chat analytics: {str(e)}")
            return {
                'total_sessions': 0,
                'total_messages': 0,
                'active_sessions': 0,
                'agent_stats': {},
                'last_activity': None
            }
    
    def _get_provider_from_model(self, model: str) -> str:
        """Determine LLM provider from model name"""
        if model.startswith("claude"):
            return "anthropic"
        else:
            return "openai"
    
    async def _generate_anthropic_response(
        self,
        conversation_history: List[Dict[str, str]],
        system_prompt: str,
        model: str
    ) -> str:
        """Generate response using Anthropic Claude with fallback to OpenAI"""
        try:
            if not self.anthropic_service.is_available():
                logger.warning("⚠️ Anthropic service not available, falling back to OpenAI")
                return await self.openai_service.generate_response(
                    message=conversation_history[-1]['content'] if conversation_history else "",
                    context={'conversation_history': conversation_history[:-1]},
                    system_prompt=system_prompt
                )
            
            response = await self.anthropic_service.generate_chat_completion(
                messages=conversation_history,
                model=model,
                max_tokens=2000,
                temperature=0.7,
                system_prompt=system_prompt
            )
            
            logger.info(f"✅ Claude response generated successfully")
            return response
            
        except Exception as e:
            logger.error(f"❌ Anthropic generation failed: {str(e)}")
            logger.info("⚠️ Falling back to OpenAI due to Anthropic error")
            
            # Fallback to OpenAI
            try:
                return await self.openai_service.generate_response(
                    message=conversation_history[-1]['content'] if conversation_history else "",
                    context={'conversation_history': conversation_history[:-1]},
                    system_prompt=system_prompt
                )
            except Exception as fallback_error:
                logger.error(f"❌ OpenAI fallback also failed: {str(fallback_error)}")
                raise Exception("Both Anthropic and OpenAI services failed")
