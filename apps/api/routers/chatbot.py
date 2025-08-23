"""
Chatbot API Routes for SHELTR-AI
Provides AI-powered chatbot endpoints with role-based responses
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from datetime import datetime
import logging
import json
import os

from services.chatbot.orchestrator import chatbot_orchestrator, ChatResponse
from middleware.auth_middleware import get_current_user
from services.analytics_service import analytics_service

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/chatbot", tags=["Chatbot"])
security = HTTPBearer()

# Request/Response Models
class ChatMessage(BaseModel):
    """Chat message request model"""
    message: str
    conversation_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class ChatMessageResponse(BaseModel):
    """Chat message response model"""
    success: bool
    response: str
    actions: List[Dict[str, Any]] = []
    follow_up: Optional[str] = None
    escalation_triggered: bool = False
    agent_used: Optional[str] = None
    conversation_id: str
    timestamp: str

class ConversationHistory(BaseModel):
    """Conversation history response model"""
    success: bool
    conversation_id: str
    messages: List[Dict[str, Any]]
    user_role: str
    created_at: str

# WebSocket connection manager
class ConnectionManager:
    """Manages WebSocket connections for real-time chat"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept a WebSocket connection"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logger.info(f"WebSocket connected for user {user_id}")
    
    def disconnect(self, user_id: str):
        """Remove a WebSocket connection"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logger.info(f"WebSocket disconnected for user {user_id}")
    
    async def send_personal_message(self, message: str, user_id: str):
        """Send a message to a specific user"""
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_text(message)

# Global connection manager instance
manager = ConnectionManager()

@router.post(
    "/message",
    response_model=ChatMessageResponse,
    summary="Send chat message",
    description="Send a message to the AI chatbot and receive a response"
)
async def send_message(
    chat_message: ChatMessage,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Send a message to the chatbot and receive an intelligent response
    based on the user's role and message intent.
    """
    try:
        user_id = current_user.get('uid')
        user_role = current_user.get('role', 'participant')
        user_email = current_user.get('email', 'unknown')
        
        logger.info(f"Chat message from {user_role} user {user_email}: {chat_message.message[:50]}...")
        
        # Process the message through the orchestrator
        response = await chatbot_orchestrator.process_message(
            message=chat_message.message,
            user_id=user_id,
            user_role=user_role,
            conversation_context=chat_message.context
        )
        
        # Track the interaction for analytics
        await analytics_service.track_event(
            event_type="chatbot_interaction",
            user_id=user_id,
            metadata={
                "message_length": len(chat_message.message),
                "agent_used": response.agent_used,
                "escalation_triggered": response.escalation_triggered,
                "user_role": user_role
            }
        )
        
        # Get conversation ID from context or generate new one
        conversation_id = chat_message.conversation_id or f"{user_id}_{datetime.now().timestamp()}"
        
        return ChatMessageResponse(
            success=True,
            response=response.message,
            actions=response.actions,
            follow_up=response.follow_up,
            escalation_triggered=response.escalation_triggered,
            agent_used=response.agent_used,
            conversation_id=conversation_id,
            timestamp=response.timestamp
        )
        
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process chat message: {str(e)}"
        )

@router.get(
    "/conversation/{conversation_id}",
    response_model=ConversationHistory,
    summary="Get conversation history",
    description="Retrieve the conversation history for a specific conversation"
)
async def get_conversation_history(
    conversation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get the conversation history for a specific conversation ID.
    Users can only access their own conversations.
    """
    try:
        user_id = current_user.get('uid')
        
        # Verify the conversation belongs to the current user
        if not conversation_id.startswith(user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You can only view your own conversations."
            )
        
        # Get conversation context from orchestrator
        context = await chatbot_orchestrator._get_conversation_context(
            user_id, 
            current_user.get('role', 'participant')
        )
        
        return ConversationHistory(
            success=True,
            conversation_id=conversation_id,
            messages=context.message_history,
            user_role=context.user_role,
            created_at=context.created_at.isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve conversation history: {str(e)}"
        )

@router.get(
    "/agents",
    summary="Get available agents",
    description="Get information about available chatbot agents"
)
async def get_available_agents(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get information about available chatbot agents and their capabilities.
    """
    try:
        user_role = current_user.get('role', 'participant')
        
        agents = {
            "emergency": {
                "name": "Emergency Response Agent",
                "description": "Handles crisis situations and urgent needs",
                "capabilities": ["Crisis intervention", "Emergency escalation", "24/7 availability"],
                "available_to": ["all"]
            },
            "participant_support": {
                "name": "Participant Support Agent", 
                "description": "Assists participants with services and resources",
                "capabilities": ["Service booking", "Resource navigation", "Profile management"],
                "available_to": ["participant"]
            },
            "donor_relations": {
                "name": "Donor Relations Agent",
                "description": "Helps donors with donations and impact tracking",
                "capabilities": ["Donation processing", "Impact reports", "Tax documentation"],
                "available_to": ["donor"]
            },
            "shelter_operations": {
                "name": "Shelter Operations Agent",
                "description": "Assists shelter admins with operations",
                "capabilities": ["Participant management", "Resource allocation", "Reporting"],
                "available_to": ["admin", "super_admin"]
            },
            "technical_support": {
                "name": "Technical Support Agent",
                "description": "Helps with technical issues and platform navigation",
                "capabilities": ["Troubleshooting", "Account assistance", "Platform guidance"],
                "available_to": ["all"]
            }
        }
        
        # Filter agents based on user role
        available_agents = {}
        for agent_id, agent_info in agents.items():
            if "all" in agent_info["available_to"] or user_role in agent_info["available_to"]:
                available_agents[agent_id] = agent_info
        
        return {
            "success": True,
            "agents": available_agents,
            "user_role": user_role,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting available agents: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve available agents: {str(e)}"
        )

@router.post(
    "/feedback",
    summary="Submit chatbot feedback",
    description="Submit feedback about chatbot interactions"
)
async def submit_feedback(
    conversation_id: str,
    rating: int,  # 1-5 scale
    feedback: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Submit feedback about a chatbot conversation to improve the system.
    """
    try:
        user_id = current_user.get('uid')
        
        # Validate rating
        if not 1 <= rating <= 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rating must be between 1 and 5"
            )
        
        # Track feedback for analytics
        await analytics_service.track_event(
            event_type="chatbot_feedback",
            user_id=user_id,
            metadata={
                "conversation_id": conversation_id,
                "rating": rating,
                "feedback": feedback,
                "user_role": current_user.get('role')
            }
        )
        
        logger.info(f"Chatbot feedback received from {user_id}: {rating}/5")
        
        return {
            "success": True,
            "message": "Feedback submitted successfully",
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting feedback: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit feedback: {str(e)}"
        )

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint for real-time chat functionality.
    """
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Extract message and user info
            message = message_data.get("message", "")
            user_role = message_data.get("user_role", "participant")
            
            logger.info(f"WebSocket message from {user_id}: {message[:50]}...")
            
            # Process through chatbot orchestrator
            response = await chatbot_orchestrator.process_message(
                message=message,
                user_id=user_id,
                user_role=user_role
            )
            
            # Send response back to client
            response_data = {
                "type": "bot_response",
                "message": response.message,
                "actions": response.actions,
                "follow_up": response.follow_up,
                "escalation_triggered": response.escalation_triggered,
                "agent_used": response.agent_used,
                "timestamp": response.timestamp
            }
            
            await manager.send_personal_message(
                json.dumps(response_data), 
                user_id
            )
            
            # Track interaction
            await analytics_service.track_event(
                event_type="websocket_chat",
                user_id=user_id,
                metadata={
                    "message_length": len(message),
                    "agent_used": response.agent_used,
                    "websocket": True
                }
            )
            
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        logger.info(f"WebSocket disconnected for user {user_id}")
    except Exception as e:
        logger.error(f"WebSocket error for user {user_id}: {str(e)}")
        manager.disconnect(user_id)

@router.post(
    "/test-message",
    summary="Test chatbot message (no auth)",
    description="Test chatbot functionality without authentication for local development"
)
async def test_send_message(chat_message: ChatMessage):
    """
    Test chatbot message without authentication for local development
    """
    try:
        # Mock user for testing
        mock_user = {
            'uid': 'test_user',
            'email': 'test@example.com',
            'role': 'super_admin'
        }
        
        user_id = mock_user.get('uid')
        user_role = mock_user.get('role', 'participant')
        user_email = mock_user.get('email', 'unknown')
        
        logger.info(f"TEST: Chat message from {user_role} user {user_email}: {chat_message.message[:50]}...")
        
        # Process the message through the orchestrator
        response = await chatbot_orchestrator.process_message(
            message=chat_message.message,
            user_id=user_id,
            user_role=user_role,
            conversation_context=chat_message.context
        )
        
        # Get conversation ID from context or generate new one
        conversation_id = chat_message.conversation_id or f"{user_id}_{datetime.now().timestamp()}"
        
        return ChatMessageResponse(
            success=True,
            response=response.message,
            actions=response.actions,
            follow_up=response.follow_up,
            escalation_triggered=response.escalation_triggered,
            agent_used=response.agent_used,
            conversation_id=conversation_id,
            timestamp=response.timestamp
        )
        
    except Exception as e:
        logger.error(f"Error processing test chat message: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process chat message: {str(e)}"
        )

@router.get(
    "/health",
    summary="Chatbot health check",
    description="Check the health and status of the chatbot system including AI capabilities"
)
async def chatbot_health():
    """
    Lightweight health check for the chatbot system - no expensive AI calls.
    """
    try:
        # Just check if services are importable and basic status
        from services.openai_service import openai_service
        
        # Quick status check without API calls
        openai_configured = bool(os.getenv("OPENAI_API_KEY"))
        
        return {
            "success": True,
            "status": "operational",
            "orchestrator": "active",
            "ai_service": {
                "configured": openai_configured,
                "status": "ready" if openai_configured else "not_configured"
            },
            "active_connections": len(manager.active_connections),
            "features": {
                "intelligent_responses": openai_configured,
                "context_awareness": openai_configured,
                "role_based_agents": True,
                "emergency_escalation": True,
                "websocket_support": True
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Chatbot health check failed: {str(e)}")
        return {
            "success": False,
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        } 