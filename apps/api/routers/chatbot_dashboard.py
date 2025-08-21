"""
Chatbot Dashboard Router for SHELTR-AI
Handles chat sessions, messages, and agent configurations
"""

from fastapi import APIRouter, Depends, HTTPException, Form
from typing import List, Dict, Any
from services.chatbot_dashboard_service import ChatbotDashboardService
from middleware.auth_middleware import get_current_user, require_super_admin
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chatbot-dashboard", tags=["chatbot-dashboard"])

@router.get("/sessions")
async def get_chat_sessions(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get all chat sessions for the current user"""
    
    try:
        chatbot_service = ChatbotDashboardService()
        sessions = await chatbot_service.get_chat_sessions(current_user['uid'])
        
        return {
            "success": True,
            "data": {
                "sessions": sessions
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get chat sessions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve chat sessions")

@router.post("/sessions")
async def create_chat_session(
    title: str = Form(...),
    agent_type: str = Form(...),
    model: str = Form(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new chat session"""
    
    try:
        chatbot_service = ChatbotDashboardService()
        session_id = await chatbot_service.create_chat_session(
            user_id=current_user['uid'],
            title=title,
            agent_type=agent_type,
            model=model
        )
        
        return {
            "success": True,
            "data": {
                "session_id": session_id,
                "message": "Chat session created successfully"
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to create chat session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create chat session: {str(e)}")

@router.get("/sessions/{session_id}/messages")
async def get_chat_messages(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get all messages for a chat session"""
    
    try:
        chatbot_service = ChatbotDashboardService()
        messages = await chatbot_service.get_chat_messages(session_id)
        
        return {
            "success": True,
            "data": {
                "messages": messages
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get chat messages: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve chat messages")

@router.post("/sessions/{session_id}/send")
async def send_message(
    session_id: str,
    message: str = Form(...),
    agent_config: str = Form(...),  # JSON string of agent configuration
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Send a message and get AI response"""
    
    try:
        import json
        agent_config_dict = json.loads(agent_config)
        
        chatbot_service = ChatbotDashboardService()
        response = await chatbot_service.send_message(session_id, message, agent_config_dict)
        
        if response['success']:
            return response
        else:
            raise HTTPException(status_code=500, detail=response['error'])
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid agent configuration format")
    except Exception as e:
        logger.error(f"Failed to send message: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")

@router.get("/agents")
async def get_agent_configurations(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get all agent configurations"""
    
    try:
        chatbot_service = ChatbotDashboardService()
        agents = await chatbot_service.get_agent_configurations()
        
        return {
            "success": True,
            "data": {
                "agents": agents
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get agent configurations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve agent configurations")

@router.post("/agents")
async def save_agent_configuration(
    agent_data: str = Form(...),  # JSON string of agent data
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Save or update agent configuration (Super Admin only)"""
    
    try:
        import json
        agent_dict = json.loads(agent_data)
        
        chatbot_service = ChatbotDashboardService()
        agent_id = await chatbot_service.save_agent_configuration(agent_dict)
        
        return {
            "success": True,
            "data": {
                "agent_id": agent_id,
                "message": "Agent configuration saved successfully"
            }
        }
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid agent data format")
    except Exception as e:
        logger.error(f"Failed to save agent configuration: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save agent configuration: {str(e)}")

@router.delete("/sessions/{session_id}")
async def delete_chat_session(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Delete a chat session and all its messages"""
    
    try:
        chatbot_service = ChatbotDashboardService()
        success = await chatbot_service.delete_chat_session(session_id)
        
        if success:
            return {
                "success": True,
                "data": {
                    "message": "Chat session deleted successfully"
                }
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to delete chat session")
        
    except Exception as e:
        logger.error(f"Failed to delete chat session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete chat session: {str(e)}")

@router.put("/sessions/{session_id}/title")
async def update_session_title(
    session_id: str,
    title: str = Form(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update chat session title"""
    
    try:
        chatbot_service = ChatbotDashboardService()
        success = await chatbot_service.update_session_title(session_id, title)
        
        if success:
            return {
                "success": True,
                "data": {
                    "message": "Session title updated successfully"
                }
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to update session title")
        
    except Exception as e:
        logger.error(f"Failed to update session title: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update session title: {str(e)}")

@router.get("/analytics")
async def get_chat_analytics(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get chat analytics for the current user"""
    
    try:
        chatbot_service = ChatbotDashboardService()
        analytics = await chatbot_service.get_chat_analytics(current_user['uid'])
        
        return {
            "success": True,
            "data": analytics
        }
        
    except Exception as e:
        logger.error(f"Failed to get chat analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve chat analytics")
