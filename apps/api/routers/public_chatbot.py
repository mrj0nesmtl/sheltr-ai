"""
Public Chatbot API Routes for SHELTR-AI
Provides AI-powered chatbot endpoints for anonymous/public users
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
import logging
import json
from collections import defaultdict

from services.chatbot.orchestrator import chatbot_orchestrator, ChatResponse
from services.analytics_service import analytics_service

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/chatbot", tags=["Public Chatbot"])

# Rate limiting storage (in production, use Redis)
rate_limit_store = defaultdict(list)
RATE_LIMIT_REQUESTS = 10  # requests per window
RATE_LIMIT_WINDOW = 300   # 5 minutes in seconds

# Request/Response Models
class PublicChatMessage(BaseModel):
    """Public chat message request model"""
    message: str
    user_id: str  # Anonymous session ID
    user_role: str = "public"
    conversation_context: Optional[Dict[str, Any]] = None

class PublicChatResponse(BaseModel):
    """Public chat message response model"""
    success: bool
    response: str
    actions: List[Dict[str, Any]] = []
    follow_up: Optional[str] = None
    escalation_triggered: bool = False
    agent_used: Optional[str] = None
    conversation_id: str
    timestamp: str
    rate_limit_remaining: int

def check_rate_limit(user_id: str, request: Request) -> tuple[bool, int]:
    """Check if user is within rate limits"""
    now = datetime.now()
    user_requests = rate_limit_store[user_id]
    
    # Remove old requests outside the window
    cutoff_time = now - timedelta(seconds=RATE_LIMIT_WINDOW)
    user_requests[:] = [req_time for req_time in user_requests if req_time > cutoff_time]
    
    # Check if user is within limit
    if len(user_requests) >= RATE_LIMIT_REQUESTS:
        return False, 0
    
    # Add current request
    user_requests.append(now)
    remaining = RATE_LIMIT_REQUESTS - len(user_requests)
    
    return True, remaining

@router.post(
    "/public",
    response_model=PublicChatResponse,
    summary="Public chatbot endpoint",
    description="AI-powered chatbot for anonymous/public users with rate limiting"
)
async def public_chat(message_data: PublicChatMessage, request: Request):
    """
    Process public chatbot messages with rate limiting and anonymous support
    """
    try:
        # Rate limiting check
        allowed, remaining = check_rate_limit(message_data.user_id, request)
        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Try again in a few minutes."
            )
        
        # Log public interaction (anonymized)
        client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
        logger.info(f"Public chat from {client_ip[:8]}... - Session: {message_data.user_id[:8]}...")
        
        # Enhanced context for public users
        enhanced_context = {
            "session_type": "public",
            "anonymous": True,
            "page": message_data.conversation_context.get("page", "/") if message_data.conversation_context else "/",
            "first_time_visitor": True,  # Could be enhanced with session tracking
            "rate_limited": False,
            "client_info": {
                "ip_hash": hash(client_ip) % 10000,  # Anonymized IP hash
                "user_agent": message_data.conversation_context.get("user_agent", "unknown") if message_data.conversation_context else "unknown"
            }
        }
        
        # Merge with provided context
        if message_data.conversation_context:
            enhanced_context.update(message_data.conversation_context)
        
        # Process message through orchestrator
        response = await chatbot_orchestrator.process_message(
            message=message_data.message,
            user_id=message_data.user_id,
            user_role="public",  # Force public role
            conversation_context=enhanced_context
        )
        
        # Add public-specific actions
        public_actions = []
        if response.actions:
            public_actions.extend(response.actions)
        
        # Add helpful public actions based on message content
        message_lower = message_data.message.lower()
        if any(word in message_lower for word in ["donate", "donation", "give", "help", "support"]):
            public_actions.extend([
                {"type": "link", "text": "Learn About Donations", "url": "/scan-give"},
                {"type": "link", "text": "View Impact", "url": "/impact"}
            ])
        elif any(word in message_lower for word in ["about", "what", "platform", "sheltr"]):
            public_actions.extend([
                {"type": "link", "text": "About SHELTR", "url": "/about"},
                {"type": "link", "text": "Our Team", "url": "/team"}
            ])
        elif any(word in message_lower for word in ["token", "blockchain", "crypto"]):
            public_actions.append(
                {"type": "link", "text": "SHELTR Tokenomics", "url": "/tokenomics"}
            )
        
        # Track analytics (anonymized)
        try:
            await analytics_service.track_event(
                event_type="public_chat_interaction",
                user_id=f"public_{hash(message_data.user_id) % 10000}",  # Anonymized
                data={
                    "message_length": len(message_data.message),
                    "page": enhanced_context.get("page", "/"),
                    "agent_used": response.agent_used,
                    "response_length": len(response.message),
                    "actions_provided": len(public_actions)
                }
            )
        except Exception as e:
            logger.warning(f"Analytics tracking failed for public chat: {e}")
        
        return PublicChatResponse(
            success=True,
            response=response.message,
            actions=public_actions,
            follow_up=response.follow_up,
            escalation_triggered=response.escalation_triggered,
            agent_used=response.agent_used or "public_support",
            conversation_id=f"public_{message_data.user_id}_{int(datetime.now().timestamp())}",
            timestamp=datetime.now().isoformat(),
            rate_limit_remaining=remaining
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Public chatbot error: {str(e)}")
        
        # Friendly fallback response
        fallback_responses = [
            "Hi! I'm the SHELTR AI Assistant. I can help you learn about our platform, how donations work, or answer questions about blockchain-powered charitable giving.",
            "Welcome to SHELTR! I'm here to help you understand how we're transforming charitable giving through technology. What would you like to know?",
            "Thanks for visiting SHELTR! I can explain our QR donation system, tokenomics, or how we empower people experiencing homelessness. How can I help?",
            "Hello! SHELTR uses blockchain technology to create transparent, direct impact for people in need. What questions do you have about our platform?"
        ]
        
        import random
        fallback_message = random.choice(fallback_responses)
        
        return PublicChatResponse(
            success=True,
            response=fallback_message,
            actions=[
                {"type": "link", "text": "Learn More", "url": "/about"},
                {"type": "link", "text": "How to Donate", "url": "/scan-give"},
                {"type": "link", "text": "View Documentation", "url": "/docs"}
            ],
            escalation_triggered=False,
            agent_used="fallback_public",
            conversation_id=f"fallback_{message_data.user_id}_{int(datetime.now().timestamp())}",
            timestamp=datetime.now().isoformat(),
            rate_limit_remaining=remaining if 'remaining' in locals() else RATE_LIMIT_REQUESTS
        )

@router.get(
    "/public/health",
    summary="Public chatbot health check",
    description="Check if public chatbot is operational"
)
async def public_chatbot_health():
    """Health check for public chatbot service"""
    return JSONResponse({
        "success": True,
        "status": "operational",
        "service": "public_chatbot",
        "rate_limit": {
            "requests_per_window": RATE_LIMIT_REQUESTS,
            "window_seconds": RATE_LIMIT_WINDOW
        },
        "features": {
            "anonymous_support": True,
            "rate_limiting": True,
            "analytics_tracking": True,
            "fallback_responses": True
        },
        "timestamp": datetime.now().isoformat()
    })
