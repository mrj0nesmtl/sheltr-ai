"""
SHELTR-AI RAG (Retrieval-Augmented Generation) Orchestrator
Integrates knowledge base search with intelligent chatbot responses
"""

import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

# SHELTR services
from services.knowledge_service import knowledge_service
from services.openai_service import openai_service
from services.chatbot.orchestrator import ChatResponse, Intent, IntentCategory, UrgencyLevel

logger = logging.getLogger(__name__)

class RAGOrchestrator:
    """Retrieval-Augmented Generation for enhanced chatbot responses"""
    
    def __init__(self):
        self.knowledge_service = knowledge_service
        self.openai_service = openai_service
        
        # RAG configuration
        self.knowledge_search_limit = 3
        self.similarity_threshold = 0.7
        self.max_knowledge_tokens = 1500
    
    async def generate_knowledge_enhanced_response(
        self,
        user_message: str,
        user_role: str,
        conversation_context: Dict[str, Any],
        agent_type: str,
        intent: Intent
    ) -> ChatResponse:
        """Generate response using RAG with knowledge base"""
        
        try:
            logger.info(f"Generating RAG response for {agent_type} agent")
            
            # 1. Search knowledge base for relevant information
            knowledge_results = await self._search_relevant_knowledge(
                query=user_message,
                user_role=user_role,
                agent_type=agent_type,
                intent=intent,
                shelter_id=conversation_context.get('shelter_id')
            )
            
            # 2. Prepare enhanced context with retrieved knowledge
            enhanced_context = await self._prepare_rag_context(
                user_message=user_message,
                knowledge_results=knowledge_results,
                conversation_context=conversation_context,
                intent=intent
            )
            
            # 3. Generate AI response with knowledge context
            ai_response = await self._generate_rag_response(
                user_message=user_message,
                enhanced_context=enhanced_context,
                agent_type=agent_type,
                intent=intent
            )
            
            # 4. Generate contextual actions
            actions = await self._generate_knowledge_actions(
                knowledge_results, intent, agent_type
            )
            
            # 5. Generate source citations
            citations = self._generate_citations(knowledge_results)
            
            # 6. Determine escalation
            escalation_triggered = (
                intent.requires_escalation or 
                intent.urgency == UrgencyLevel.CRITICAL or
                agent_type == "emergency"
            )
            
            return ChatResponse(
                message=ai_response,
                actions=actions,
                follow_up=await self._generate_rag_follow_up(knowledge_results, intent),
                escalation_triggered=escalation_triggered,
                agent_used=f"{agent_type}_rag",
                metadata={
                    'knowledge_sources': citations,
                    'sources_used': len(knowledge_results.get('results', [])),
                    'search_time': knowledge_results.get('search_time_seconds', 0),
                    'knowledge_available': len(knowledge_results.get('results', [])) > 0
                }
            )
            
        except Exception as e:
            logger.error(f"RAG response generation failed: {str(e)}")
            # Fallback to standard AI response without knowledge
            return await self._generate_fallback_response(
                user_message, user_role, conversation_context, agent_type, intent
            )
    
    async def _search_relevant_knowledge(
        self,
        query: str,
        user_role: str,
        agent_type: str,
        intent: Intent,
        shelter_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Search for relevant knowledge based on query and context"""
        
        try:
            # Determine relevant categories based on agent type and intent
            categories = self._get_relevant_categories(agent_type, intent)
            
            # Enhance query with context for better search
            enhanced_query = await self._enhance_search_query(query, agent_type, intent)
            
            # Perform knowledge search (direct embeddings search to bypass auth)
            try:
                from services.embeddings_service import embeddings_service
                knowledge_results = await embeddings_service.semantic_search(
                    query=enhanced_query,
                    user_role=user_role,
                    limit=self.knowledge_search_limit
                )
            except Exception as e:
                logger.warning(f"Direct embeddings search failed, trying knowledge service: {e}")
                knowledge_results = await self.knowledge_service.search_knowledge(
                    query=enhanced_query,
                    user_role=user_role,
                    categories=categories,
                    shelter_id=shelter_id,
                    limit=self.knowledge_search_limit
                )
            
            # Normalize knowledge_results to dict format if needed
            if isinstance(knowledge_results, list):
                knowledge_results = {
                    'query': enhanced_query,
                    'results': knowledge_results,
                    'total_found': len(knowledge_results)
                }
            
            total_results = knowledge_results.get('total_found', len(knowledge_results.get('results', [])))
            logger.info(f"Knowledge search returned {total_results} results")
            return knowledge_results
            
        except Exception as e:
            logger.error(f"Knowledge search failed: {str(e)}")
            return {'query': query, 'results': [], 'total_found': 0}
    
    def _get_relevant_categories(self, agent_type: str, intent: Intent) -> Optional[List[str]]:
        """Determine relevant document categories based on agent and intent"""
        
        category_mapping = {
            'emergency': ['user_guides', 'sheltr'],
            'participant_support': ['user_guides', 'sheltr', 'platform'],
            'donor_relations': ['user_guides', 'tokenomics', 'sheltr'],
            'shelter_operations': ['user_guides', 'platform', 'sheltr'],
            'technical_support': ['platform', 'user_guides']
        }
        
        # Get base categories for agent
        categories = category_mapping.get(agent_type, ['sheltr'])
        
        # Add intent-specific categories
        if intent.category == IntentCategory.INFORMATION:
            if 'blockchain' in intent.entities.get('query', '').lower():
                categories.append('tokenomics')
            elif 'donation' in intent.entities.get('query', '').lower():
                categories.extend(['tokenomics', 'user_guides'])
        
        return categories
    
    async def _enhance_search_query(self, query: str, agent_type: str, intent: Intent) -> str:
        """Enhance search query with context for better results"""
        
        # Add agent-specific context
        query_enhancements = {
            'emergency': 'crisis support emergency homeless',
            'participant_support': 'participant services shelter booking',
            'donor_relations': 'donation SmartFund impact transparency',
            'shelter_operations': 'admin management operations shelter',
            'technical_support': 'platform technical help troubleshooting'
        }
        
        enhancement = query_enhancements.get(agent_type, '')
        
        # Add intent-specific terms
        if intent.category == IntentCategory.ACTION:
            enhancement += ' how to guide steps'
        elif intent.category == IntentCategory.INFORMATION:
            enhancement += ' information details about'
        
        # Combine query with enhancements
        enhanced_query = f"{query} {enhancement}".strip()
        logger.debug(f"Enhanced query: '{enhanced_query}'")
        
        return enhanced_query
    
    async def _prepare_rag_context(
        self,
        user_message: str,
        knowledge_results: Dict[str, Any],
        conversation_context: Dict[str, Any],
        intent: Intent
    ) -> Dict[str, Any]:
        """Prepare enhanced context for RAG response generation"""
        
        # Format knowledge results for AI context
        knowledge_context = self._format_knowledge_context(knowledge_results)
        
        # Prepare conversation context
        conversation_history = conversation_context.get('conversation_history', [])
        
        return {
            'user_message': user_message,
            'knowledge_context': knowledge_context,
            'conversation_history': conversation_history[-3:],  # Last 3 exchanges
            'intent': {
                'category': intent.category.value,
                'subcategory': intent.subcategory,
                'confidence': intent.confidence,
                'urgency': intent.urgency.value
            },
            'knowledge_available': len(knowledge_results.get('results', [])) > 0,
            'sources_count': len(knowledge_results.get('results', []))
        }
    
    def _format_knowledge_context(self, knowledge_results: Dict[str, Any]) -> str:
        """Format knowledge results for AI context"""
        
        results = knowledge_results.get('results', [])
        
        if not results:
            return "No specific knowledge base information found for this query."
        
        context_parts = []
        for i, result in enumerate(results, 1):
            similarity_score = result.get('similarity', 0)
            
            # Only include high-confidence results
            if similarity_score >= self.similarity_threshold:
                context_parts.append(f"""
                Knowledge Source {i}:
                Document: {result.get('document_title', 'Unknown')}
                Category: {result.get('document_category', 'general')}
                Content: {result.get('content', '')[:500]}...
                Relevance: {similarity_score:.2f}
                """)
        
        if not context_parts:
            return "No high-confidence knowledge matches found."
        
        return "\n".join(context_parts)
    
    async def _generate_rag_response(
        self,
        user_message: str,
        enhanced_context: Dict[str, Any],
        agent_type: str,
        intent: Intent
    ) -> str:
        """Generate AI response using RAG with knowledge context"""
        
        # Build RAG prompt
        rag_prompt = self._build_rag_prompt(
            user_message=user_message,
            enhanced_context=enhanced_context,
            agent_type=agent_type,
            intent=intent
        )
        
        # Get agent-specific system prompt
        from services.chatbot.prompts import get_enhanced_prompt
        system_prompt = get_enhanced_prompt(agent_type, {
            'rag_mode': True,
            'knowledge_available': enhanced_context['knowledge_available']
        })
        
        # Generate response
        ai_response = await self.openai_service.generate_response(
            message=rag_prompt,
            context=enhanced_context,
            system_prompt=system_prompt
        )
        
        return ai_response
    
    def _build_rag_prompt(
        self,
        user_message: str,
        enhanced_context: Dict[str, Any],
        agent_type: str,
        intent: Intent
    ) -> str:
        """Build comprehensive RAG prompt with knowledge context"""
        
        knowledge_context = enhanced_context['knowledge_context']
        conversation_history = enhanced_context.get('conversation_history', [])
        
        # Format conversation history
        history_text = ""
        for exchange in conversation_history:
            if 'user_message' in exchange and 'bot_response' in exchange:
                history_text += f"User: {exchange['user_message']}\n"
                history_text += f"Assistant: {exchange['bot_response']}\n\n"
        
        prompt = f"""
        Based on the SHELTR knowledge base information below, please provide a helpful and accurate response to the user's question.
        
        RETRIEVED KNOWLEDGE FROM SHELTR DATABASE:
        {knowledge_context}
        
        USER'S CURRENT QUESTION: {user_message}
        
        CONVERSATION HISTORY:
        {history_text}
        
        CONTEXT:
        - You are SHELTR's {agent_type.replace('_', ' ').title()} Agent
        - Intent: {intent.category.value} ({intent.subcategory})
        - Urgency: {intent.urgency.value}
        
        Please provide a response that:
        1. Directly addresses the user's question using the retrieved knowledge when relevant
        2. Maintains your role as a {agent_type.replace('_', ' ')} agent
        3. Provides specific, actionable information from SHELTR's documentation
        4. Cites sources when using specific information (e.g., "According to SHELTR's guide...")
        5. Is helpful, accurate, and relevant to homeless services
        6. Offers next steps or follow-up actions when appropriate
        
        If the retrieved knowledge doesn't contain relevant information for this specific question, provide a general helpful response based on your agent role and SHELTR's mission.
        """
        
        return prompt.strip()
    
    async def _generate_knowledge_actions(
        self,
        knowledge_results: Dict[str, Any],
        intent: Intent,
        agent_type: str
    ) -> List[Dict[str, Any]]:
        """Generate contextual actions based on knowledge results"""
        
        actions = []
        results = knowledge_results.get('results', [])
        
        # Add knowledge-specific actions
        if results:
            # Add "View Full Document" actions for relevant documents
            seen_documents = set()
            for result in results[:2]:  # Top 2 results
                doc_title = result.get('document_title', '')
                doc_id = result.get('document_id', '')
                
                if doc_id and doc_id not in seen_documents:
                    actions.append({
                        'type': 'view_document',
                        'label': f"View: {doc_title[:30]}...",
                        'data': {
                            'document_id': doc_id,
                            'title': doc_title
                        }
                    })
                    seen_documents.add(doc_id)
            
            # Add search action for more information
            actions.append({
                'type': 'search_more',
                'label': 'Search for More Information',
                'data': {
                    'query': knowledge_results.get('query', ''),
                    'suggested_categories': self._get_relevant_categories(agent_type, intent)
                }
            })
        
        # Add standard agent actions
        if agent_type == "emergency":
            actions.extend([
                {
                    'type': 'emergency_call',
                    'label': 'Call 911 Now',
                    'data': {'phone': '911'}
                },
                {
                    'type': 'crisis_hotline',
                    'label': 'Crisis Text Line',
                    'data': {'phone': '741741', 'message': 'HOME'}
                }
            ])
        elif agent_type == "participant_support":
            actions.append({
                'type': 'find_services',
                'label': 'Find Local Services',
                'data': {'action': 'services'}
            })
        elif agent_type == "donor_relations":
            actions.append({
                'type': 'view_impact',
                'label': 'View Donation Impact',
                'data': {'action': 'impact'}
            })
        
        return actions
    
    def _generate_citations(self, knowledge_results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate source citations for knowledge-based responses"""
        
        citations = []
        results = knowledge_results.get('results', [])
        
        for result in results:
            if result.get('similarity', 0) >= self.similarity_threshold:
                citations.append({
                    'document_title': result.get('document_title', 'Unknown'),
                    'document_category': result.get('document_category', 'general'),
                    'similarity_score': result.get('similarity', 0),
                    'chunk_index': result.get('chunk_index', 0),
                    'document_id': result.get('document_id', '')
                })
        
        return citations
    
    async def _generate_rag_follow_up(
        self,
        knowledge_results: Dict[str, Any],
        intent: Intent
    ) -> Optional[str]:
        """Generate contextual follow-up based on knowledge results"""
        
        results = knowledge_results.get('results', [])
        
        if not results:
            return "Would you like me to search for more general information about SHELTR services?"
        
        # Generate context-specific follow-ups
        if intent.category == IntentCategory.INFORMATION:
            return "Would you like me to provide more detailed information from SHELTR's documentation?"
        elif intent.category == IntentCategory.ACTION:
            return "Would you like step-by-step guidance for completing this action?"
        else:
            return "Is there anything else from SHELTR's knowledge base I can help you with?"
    
    async def _generate_fallback_response(
        self,
        user_message: str,
        user_role: str,
        conversation_context: Dict[str, Any],
        agent_type: str,
        intent: Intent
    ) -> ChatResponse:
        """Generate fallback response when RAG fails"""
        
        # Import the standard orchestrator for fallback
        from services.chatbot.orchestrator import chatbot_orchestrator
        
        return await chatbot_orchestrator._generate_ai_response(
            intent=intent,
            context=conversation_context,
            agent=agent_type
        )

# Create singleton instance
rag_orchestrator = RAGOrchestrator()
