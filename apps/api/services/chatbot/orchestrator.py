"""
SHELTR-AI Chatbot Orchestrator
Master agent that routes user inquiries to specialized AI agents
Enhanced with OpenAI intelligence for contextual responses
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import logging
import json
import re
from enum import Enum

# Import OpenAI service and prompts
from services.openai_service import openai_service
from services.chatbot.prompts import get_enhanced_prompt, SYSTEM_PROMPTS

logger = logging.getLogger(__name__)

class IntentCategory(Enum):
    """Intent categories for message classification"""
    EMERGENCY = "emergency"
    INFORMATION = "information"
    ACTION = "action"
    SUPPORT = "support"
    NAVIGATION = "navigation"

class UrgencyLevel(Enum):
    """Urgency levels for prioritizing responses"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Intent:
    """Represents a classified user intent"""
    def __init__(
        self,
        category: IntentCategory,
        subcategory: str,
        confidence: float,
        entities: Dict[str, Any],
        urgency: UrgencyLevel = UrgencyLevel.MEDIUM,
        requires_escalation: bool = False
    ):
        self.category = category
        self.subcategory = subcategory
        self.confidence = confidence
        self.entities = entities
        self.urgency = urgency
        self.requires_escalation = requires_escalation

class ChatResponse:
    """Standardized chatbot response"""
    def __init__(
        self,
        message: str,
        actions: List[Dict[str, Any]] = None,
        follow_up: Optional[str] = None,
        escalation_triggered: bool = False,
        agent_used: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.actions = actions or []
        self.follow_up = follow_up
        self.escalation_triggered = escalation_triggered
        self.agent_used = agent_used
        self.metadata = metadata or {}
        self.timestamp = datetime.now().isoformat()

class IntentClassifier:
    """Classifies user messages into intents"""
    
    def __init__(self):
        self.emergency_patterns = [
            r"\b(emergency|crisis|urgent|help\s+now|danger|suicide|harm)\b",
            r"\b(haven't\s+eaten|no\s+food|starving|hungry)\b",
            r"\b(need\s+shelter\s+tonight|nowhere\s+to\s+go|homeless)\b",
            r"\b(hurt|injured|sick|medical\s+emergency)\b",
            r"\b(threat|violence|abuse|scared)\b"
        ]
        
        self.service_patterns = [
            r"\b(book|reserve|schedule|appointment)\b.*\b(meal|food|bed|shower|counseling)\b",
            r"\b(available\s+services|what\s+services|help\s+with)\b",
            r"\b(sign\s+up|register\s+for|join)\b.*\b(program|service)\b"
        ]
        
        self.information_patterns = [
            r"\b(what\s+is|how\s+does|where\s+can|when\s+do)\b",
            r"\b(information|details|about|explain)\b",
            r"\b(hours|location|address|contact)\b"
        ]
        
        self.support_patterns = [
            r"\b(problem|issue|error|not\s+working|broken)\b",
            r"\b(help\s+with|assistance|support)\b",
            r"\b(account|login|password|access)\b"
        ]
    
    async def classify(self, message: str, user_role: str) -> Intent:
        """Classify a user message into an intent"""
        try:
            message_lower = message.lower()
            
            # Check for emergency patterns first
            for pattern in self.emergency_patterns:
                if re.search(pattern, message_lower):
                    return Intent(
                        category=IntentCategory.EMERGENCY,
                        subcategory="crisis_intervention",
                        confidence=0.95,
                        entities={"original_message": message},
                        urgency=UrgencyLevel.CRITICAL,
                        requires_escalation=True
                    )
            
            # Check for service booking patterns
            for pattern in self.service_patterns:
                if re.search(pattern, message_lower):
                    service_type = self._extract_service_type(message_lower)
                    return Intent(
                        category=IntentCategory.ACTION,
                        subcategory="service_booking",
                        confidence=0.85,
                        entities={"service_type": service_type, "user_role": user_role},
                        urgency=UrgencyLevel.MEDIUM
                    )
            
            # Check for information requests
            for pattern in self.information_patterns:
                if re.search(pattern, message_lower):
                    return Intent(
                        category=IntentCategory.INFORMATION,
                        subcategory="general_inquiry",
                        confidence=0.80,
                        entities={"query_type": "information", "user_role": user_role},
                        urgency=UrgencyLevel.LOW
                    )
            
            # Check for support requests
            for pattern in self.support_patterns:
                if re.search(pattern, message_lower):
                    return Intent(
                        category=IntentCategory.SUPPORT,
                        subcategory="technical_support",
                        confidence=0.75,
                        entities={"issue_type": "technical", "user_role": user_role},
                        urgency=UrgencyLevel.MEDIUM
                    )
            
            # Default: general information
            return Intent(
                category=IntentCategory.INFORMATION,
                subcategory="general",
                confidence=0.60,
                entities={"query": message, "user_role": user_role},
                urgency=UrgencyLevel.LOW
            )
            
        except Exception as e:
            logger.error(f"Error classifying intent: {str(e)}")
            return Intent(
                category=IntentCategory.SUPPORT,
                subcategory="error",
                confidence=0.50,
                entities={"error": str(e)},
                urgency=UrgencyLevel.MEDIUM
            )
    
    def _extract_service_type(self, message: str) -> Optional[str]:
        """Extract service type from message"""
        service_keywords = {
            "meal": ["meal", "food", "eat", "hungry", "breakfast", "lunch", "dinner"],
            "shelter": ["bed", "sleep", "night", "shelter", "room"],
            "shower": ["shower", "wash", "clean", "hygiene"],
            "counseling": ["counseling", "therapy", "mental", "talk", "support"],
            "medical": ["medical", "doctor", "nurse", "health", "sick"],
            "job": ["job", "work", "employment", "career", "training"]
        }
        
        for service, keywords in service_keywords.items():
            if any(keyword in message for keyword in keywords):
                return service
        
        return None

class AgentRouter:
    """Routes intents to appropriate specialized agents"""
    
    def __init__(self):
        self.agents = {}
        # Agents will be registered here
    
    def select_agent(self, intent: Intent, user_role: str) -> str:
        """Select the appropriate agent for handling the intent"""
        
        # Emergency situations always go to emergency agent
        if intent.category == IntentCategory.EMERGENCY or intent.urgency == UrgencyLevel.CRITICAL:
            return "emergency"
        
        # Route based on user role and intent category
        if user_role == "participant":
            if intent.category == IntentCategory.ACTION:
                return "participant_support"
            elif intent.category == IntentCategory.INFORMATION:
                return "participant_support"
            else:
                return "participant_support"
        
        elif user_role == "donor":
            if intent.category == IntentCategory.ACTION:
                return "donor_relations"
            elif intent.category == IntentCategory.INFORMATION:
                return "donor_relations"
            else:
                return "donor_relations"
        
        elif user_role in ["admin", "super_admin"]:
            if intent.category == IntentCategory.ACTION:
                return "shelter_operations"
            elif intent.category == IntentCategory.INFORMATION:
                return "shelter_operations"
            else:
                return "shelter_operations"
        
        # Default to technical support
        return "technical_support"

class ConversationContext:
    """Maintains conversation state and history"""
    
    def __init__(self, user_id: str, user_role: str):
        self.user_id = user_id
        self.user_role = user_role
        self.conversation_id = f"{user_id}_{datetime.now().timestamp()}"
        self.message_history = []
        self.current_intent = None
        self.active_agent = None
        self.escalation_level = 0
        self.metadata = {}
        self.created_at = datetime.now()
    
    def add_message(self, message: str, response: ChatResponse, intent: Intent):
        """Add a message exchange to the conversation history"""
        self.message_history.append({
            "timestamp": datetime.now().isoformat(),
            "user_message": message,
            "bot_response": response.message,
            "intent": {
                "category": intent.category.value,
                "subcategory": intent.subcategory,
                "confidence": intent.confidence
            },
            "agent": response.agent_used,
            "escalation": response.escalation_triggered
        })
        
        # Keep only last 20 messages for performance
        if len(self.message_history) > 20:
            self.message_history = self.message_history[-20:]
    
    def get_recent_context(self, num_messages: int = 5) -> List[Dict]:
        """Get recent conversation context"""
        return self.message_history[-num_messages:] if self.message_history else []

class ChatbotOrchestrator:
    """Master orchestrator for the chatbot system"""
    
    def __init__(self):
        self.intent_classifier = IntentClassifier()
        self.agent_router = AgentRouter()
        self.active_conversations = {}  # In production, use Redis
        
        logger.info("🤖 Chatbot Orchestrator initialized")
    
    async def process_message(
        self,
        message: str,
        user_id: str,
        user_role: str,
        conversation_context: Optional[Dict] = None
    ) -> ChatResponse:
        """Process a user message and generate appropriate response"""
        try:
            # Get or create conversation context
            context = await self._get_conversation_context(user_id, user_role)
            
            # Classify the intent
            intent = await self.intent_classifier.classify(message, user_role)
            context.current_intent = intent
            
            # Log the interaction
            logger.info(f"Processing message from {user_role} user {user_id}: {intent.category.value}")
            
            # Route to appropriate agent
            selected_agent = self.agent_router.select_agent(intent, user_role)
            context.active_agent = selected_agent
            
            # Generate response based on agent and intent
            response = await self._generate_response(intent, context, selected_agent)
            
            # Update conversation history
            context.add_message(message, response, intent)
            
            # Handle escalation if needed
            if intent.requires_escalation or intent.urgency == UrgencyLevel.CRITICAL:
                await self._handle_escalation(context, intent)
                response.escalation_triggered = True
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            return ChatResponse(
                message="I'm sorry, I encountered an error while processing your message. Please try again or contact support if the issue persists.",
                agent_used="error_handler"
            )
    
    async def _get_conversation_context(self, user_id: str, user_role: str) -> ConversationContext:
        """Get or create conversation context for a user"""
        if user_id not in self.active_conversations:
            self.active_conversations[user_id] = ConversationContext(user_id, user_role)
        
        return self.active_conversations[user_id]
    
    async def _generate_response(
        self, 
        intent: Intent, 
        context: ConversationContext, 
        agent: str
    ) -> ChatResponse:
        """Generate AI-enhanced response based on intent and selected agent"""
        
        try:
            # Check if OpenAI is available for intelligent responses
            if openai_service.is_available():
                return await self._generate_ai_response(intent, context, agent)
            else:
                # Fallback to pattern-based responses
                logger.warning("OpenAI unavailable, using fallback responses")
                return await self._generate_fallback_response(intent, context, agent)
                
        except Exception as e:
            logger.error(f"AI response generation failed: {str(e)}")
            # Always fallback gracefully
            return await self._generate_fallback_response(intent, context, agent)
    
    async def _generate_ai_response(
        self, 
        intent: Intent, 
        context: ConversationContext, 
        agent: str
    ) -> ChatResponse:
        """Generate intelligent AI response with RAG knowledge enhancement"""
        
        try:
            # Get the last user message
            current_message = ""
            if context.message_history:
                current_message = context.message_history[-1].get("user_message", "")
            
            # Prepare context for AI/RAG
            conversation_context = {
                "user_role": context.user_role,
                "conversation_history": context.get_recent_context(3),
                "urgency_level": intent.urgency.value,
                "first_time_user": len(context.message_history) == 0,
                "escalated": context.escalation_level > 0,
                "emergency_detected": intent.category == IntentCategory.EMERGENCY,
                "mobile_user": False,  # TODO: Detect from request headers
                "shelter_id": getattr(context, 'shelter_id', None)
            }
            
            # Try RAG-enhanced response first
            try:
                # Import RAG orchestrator (lazy import to avoid circular imports)
                from services.chatbot.rag_orchestrator import rag_orchestrator
                
                # Generate RAG-enhanced response
                rag_response = await rag_orchestrator.generate_knowledge_enhanced_response(
                    user_message=current_message,
                    user_role=context.user_role,
                    conversation_context=conversation_context,
                    agent_type=agent,
                    intent=intent
                )
                
                logger.info(f"RAG response generated with {rag_response.metadata.get('sources_used', 0)} knowledge sources")
                return rag_response
                
            except Exception as rag_error:
                logger.warning(f"RAG response failed, falling back to standard AI: {str(rag_error)}")
                
                # Fallback to standard AI response
                ai_context = {
                    "user_role": context.user_role,
                    "intent_category": intent.category.value,
                    "intent_subcategory": intent.subcategory,
                    "conversation_history": context.get_recent_context(3),
                    "urgency_level": intent.urgency.value,
                    "first_time_user": len(context.message_history) == 0,
                    "escalated": context.escalation_level > 0,
                    "emergency_detected": intent.category == IntentCategory.EMERGENCY,
                    "mobile_user": False
                }
                
                # Get enhanced system prompt for this agent
                system_prompt = get_enhanced_prompt(agent, ai_context)
                
                # Generate AI response
                ai_response = await openai_service.generate_response(
                    message=current_message,
                    context=ai_context,
                    system_prompt=system_prompt
                )
                
                # Generate contextual actions based on agent and intent
                actions = await self._generate_contextual_actions(intent, context, agent)
                
                # Determine if escalation is needed
                escalation_triggered = (
                    intent.requires_escalation or 
                    intent.urgency == UrgencyLevel.CRITICAL or
                    agent == "emergency"
                )
                
                return ChatResponse(
                    message=ai_response,
                    actions=actions,
                    agent_used=f"{agent}_ai_fallback",
                    escalation_triggered=escalation_triggered,
                    follow_up=await self._generate_follow_up(intent, ai_context),
                    metadata={'rag_failed': True, 'fallback_used': True}
                )
            
        except Exception as e:
            logger.error(f"AI response generation failed: {str(e)}")
            raise
    
    async def _generate_fallback_response(
        self, 
        intent: Intent, 
        context: ConversationContext, 
        agent: str
    ) -> ChatResponse:
        """Generate fallback pattern-based responses when AI is unavailable"""
        
        if agent == "emergency":
            return await self._handle_emergency_response(intent, context)
        elif agent == "participant_support":
            return await self._handle_participant_support(intent, context)
        elif agent == "donor_relations":
            return await self._handle_donor_relations(intent, context)
        elif agent == "shelter_operations":
            return await self._handle_shelter_operations(intent, context)
        else:
            return await self._handle_technical_support(intent, context)
    
    async def _handle_emergency_response(self, intent: Intent, context: ConversationContext) -> ChatResponse:
        """Handle emergency situations with immediate escalation"""
        return ChatResponse(
            message="🚨 I understand this is urgent. I'm immediately connecting you with emergency support. If you're in immediate danger, please call 911 or your local emergency services right away.",
            actions=[
                {
                    "type": "emergency_call",
                    "label": "Call 911 Now",
                    "data": {"phone": "911"}
                },
                {
                    "type": "crisis_hotline",
                    "label": "Crisis Text Line",
                    "data": {"phone": "741741", "message": "HOME"}
                },
                {
                    "type": "escalate_human",
                    "label": "Connect to Support Staff",
                    "data": {"priority": "critical"}
                }
            ],
            escalation_triggered=True,
            agent_used="emergency"
        )
    
    async def _handle_participant_support(self, intent: Intent, context: ConversationContext) -> ChatResponse:
        """Handle participant-specific requests"""
        if intent.subcategory == "service_booking":
            service_type = intent.entities.get("service_type", "service")
            return ChatResponse(
                message=f"I can help you book a {service_type}. Let me show you the available options at nearby shelters.",
                actions=[
                    {
                        "type": "view_services",
                        "label": f"View Available {service_type.title()} Services",
                        "data": {"service_type": service_type}
                    },
                    {
                        "type": "find_shelter",
                        "label": "Find Nearest Shelter",
                        "data": {"service_needed": service_type}
                    }
                ],
                follow_up="Would you like me to help you book one of these services?",
                agent_used="participant_support"
            )
        else:
            return ChatResponse(
                message="I'm here to help you with services, booking appointments, and navigating available resources. What do you need assistance with today?",
                actions=[
                    {
                        "type": "view_profile",
                        "label": "View My Profile",
                        "data": {"action": "profile"}
                    },
                    {
                        "type": "browse_services",
                        "label": "Browse Available Services",
                        "data": {"action": "services"}
                    },
                    {
                        "type": "contact_support",
                        "label": "Contact Human Support",
                        "data": {"action": "support"}
                    }
                ],
                agent_used="participant_support"
            )
    
    async def _handle_donor_relations(self, intent: Intent, context: ConversationContext) -> ChatResponse:
        """Handle donor-specific requests"""
        return ChatResponse(
            message="I'm here to help you with donations, impact tracking, and understanding how your contributions make a difference. How can I assist you today?",
            actions=[
                {
                    "type": "make_donation",
                    "label": "Make a Donation",
                    "data": {"action": "donate"}
                },
                {
                    "type": "view_impact",
                    "label": "View My Impact",
                    "data": {"action": "impact"}
                },
                {
                    "type": "tax_documents",
                    "label": "Get Tax Documents",
                    "data": {"action": "tax_docs"}
                }
            ],
            agent_used="donor_relations"
        )
    
    async def _handle_shelter_operations(self, intent: Intent, context: ConversationContext) -> ChatResponse:
        """Handle shelter admin requests"""
        return ChatResponse(
            message="I can help you with shelter operations, participant management, and administrative tasks. What do you need assistance with?",
            actions=[
                {
                    "type": "manage_participants",
                    "label": "Manage Participants",
                    "data": {"action": "participants"}
                },
                {
                    "type": "view_reports",
                    "label": "View Reports",
                    "data": {"action": "reports"}
                },
                {
                    "type": "resource_management",
                    "label": "Manage Resources",
                    "data": {"action": "resources"}
                }
            ],
            agent_used="shelter_operations"
        )
    
    async def _handle_technical_support(self, intent: Intent, context: ConversationContext) -> ChatResponse:
        """Handle technical support requests"""
        return ChatResponse(
            message="I can help you with technical issues, account problems, and platform navigation. Please describe the issue you're experiencing.",
            actions=[
                {
                    "type": "troubleshoot",
                    "label": "Start Troubleshooting",
                    "data": {"action": "troubleshoot"}
                },
                {
                    "type": "contact_tech_support",
                    "label": "Contact Technical Support",
                    "data": {"action": "tech_support"}
                }
            ],
            agent_used="technical_support"
        )
    
    async def _generate_contextual_actions(
        self, 
        intent: Intent, 
        context: ConversationContext, 
        agent: str
    ) -> List[Dict[str, Any]]:
        """Generate contextual actions based on agent, intent, and user context"""
        
        actions = []
        
        if agent == "emergency":
            actions = [
                {
                    "type": "emergency_call",
                    "label": "Call 911 Now",
                    "data": {"phone": "911"}
                },
                {
                    "type": "crisis_hotline", 
                    "label": "Crisis Text Line",
                    "data": {"phone": "741741", "message": "HOME"}
                },
                {
                    "type": "escalate_human",
                    "label": "Connect to Support Staff",
                    "data": {"priority": "critical"}
                }
            ]
        elif agent == "participant_support":
            if intent.subcategory == "service_booking":
                service_type = intent.entities.get("service_type", "service")
                actions = [
                    {
                        "type": "view_services",
                        "label": f"View Available {service_type.title()} Services",
                        "data": {"service_type": service_type}
                    },
                    {
                        "type": "find_shelter",
                        "label": "Find Nearest Shelter",
                        "data": {"service_needed": service_type}
                    }
                ]
            else:
                actions = [
                    {
                        "type": "view_profile",
                        "label": "View My Profile",
                        "data": {"action": "profile"}
                    },
                    {
                        "type": "browse_services",
                        "label": "Browse Available Services", 
                        "data": {"action": "services"}
                    }
                ]
        elif agent == "donor_relations":
            actions = [
                {
                    "type": "make_donation",
                    "label": "Make a Donation",
                    "data": {"action": "donate"}
                },
                {
                    "type": "view_impact",
                    "label": "View My Impact",
                    "data": {"action": "impact"}
                },
                {
                    "type": "tax_documents",
                    "label": "Get Tax Documents",
                    "data": {"action": "tax_docs"}
                }
            ]
        elif agent == "shelter_operations":
            actions = [
                {
                    "type": "manage_participants",
                    "label": "Manage Participants",
                    "data": {"action": "participants"}
                },
                {
                    "type": "view_reports",
                    "label": "View Reports", 
                    "data": {"action": "reports"}
                },
                {
                    "type": "resource_management",
                    "label": "Manage Resources",
                    "data": {"action": "resources"}
                }
            ]
        else:  # technical_support
            actions = [
                {
                    "type": "troubleshoot",
                    "label": "Start Troubleshooting",
                    "data": {"action": "troubleshoot"}
                },
                {
                    "type": "contact_tech_support",
                    "label": "Contact Technical Support",
                    "data": {"action": "tech_support"}
                }
            ]
        
        return actions
    
    async def _generate_follow_up(
        self, 
        intent: Intent, 
        ai_context: Dict[str, Any]
    ) -> Optional[str]:
        """Generate appropriate follow-up questions or suggestions"""
        
        # Don't generate follow-ups for emergency situations
        if intent.category == IntentCategory.EMERGENCY:
            return None
        
        # Generate contextual follow-ups based on intent
        if intent.category == IntentCategory.ACTION:
            if intent.subcategory == "service_booking":
                return "Would you like me to help you book one of these services?"
            return "Is there anything else I can help you with today?"
        elif intent.category == IntentCategory.INFORMATION:
            return "Do you have any other questions I can help answer?"
        elif intent.category == IntentCategory.SUPPORT:
            return "Was this helpful? Let me know if you need additional assistance."
        
        return "How else can I assist you today?"

    async def _handle_escalation(self, context: ConversationContext, intent: Intent):
        """Handle escalation to human support"""
        context.escalation_level += 1
        
        # Log escalation for monitoring
        logger.warning(f"Escalation triggered for user {context.user_id}: {intent.category.value}")
        
        # In production, this would:
        # 1. Create a support ticket
        # 2. Notify human support staff
        # 3. Update conversation priority

# Create singleton instance
chatbot_orchestrator = ChatbotOrchestrator() 