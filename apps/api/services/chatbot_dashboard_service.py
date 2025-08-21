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
from services.chatbot.rag_orchestrator import RAGOrchestrator

logger = logging.getLogger(__name__)

class ChatbotDashboardService:
    """Service for managing chatbot dashboard functionality"""
    
    def __init__(self):
        self.db = firestore.client()
        self.openai_service = OpenAIService()
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
            
            # Get agent instructions
            instructions = agent_config.get('instructions', 'You are a helpful AI assistant.')
            
            # Use RAG orchestrator for enhanced responses
            enhanced_query = await self.rag_orchestrator.enhance_search_query(user_message)
            relevant_context = await self.rag_orchestrator.search_knowledge_base(enhanced_query)
            
            # Prepare system message with context
            system_message = f"{instructions}\n\nRelevant context: {relevant_context[:1000] if relevant_context else 'No specific context available.'}"
            
            # Generate AI response
            response = await self.openai_service.generate_response(
                messages=conversation_history,
                system_message=system_message,
                model=agent_config.get('model', 'gpt-4o-mini'),
                temperature=agent_config.get('temperature', 0.7),
                max_tokens=agent_config.get('max_tokens', 1000)
            )
            
            # Add assistant message to database
            metadata = {
                'model': agent_config.get('model'),
                'tokens_used': response.get('usage', {}).get('total_tokens', 0),
                'response_time': response.get('response_time', 0),
                'context_used': bool(relevant_context)
            }
            
            await self.add_chat_message(session_id, 'assistant', response['content'], metadata)
            
            return {
                'success': True,
                'data': {
                    'message': response['content'],
                    'metadata': metadata
                }
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
