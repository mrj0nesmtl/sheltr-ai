from fastapi import APIRouter, HTTPException, Depends, status, Request
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
import logging
import time

from middleware.auth_middleware import get_current_user
from services.chatbot.orchestrator import ChatbotOrchestrator
from services.mcp_service import mcp_service, MCPToolRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chatbot", tags=["Authenticated Chatbot"])

# Initialize orchestrator
orchestrator = ChatbotOrchestrator()

class AuthenticatedChatMessage(BaseModel):
    message: str = Field(..., description="User message")
    user_id: str = Field(..., description="User identifier")
    user_role: str = Field(..., description="User role (super_admin, platform_admin, etc.)")
    conversation_context: Optional[Dict[str, Any]] = Field(None, description="Additional context")

class AuthenticatedChatResponse(BaseModel):
    success: bool = Field(..., description="Response success status")
    response: str = Field(..., description="AI response message")
    conversation_id: str = Field(..., description="Conversation identifier")
    actions: List[Dict[str, Any]] = Field(default_factory=list, description="Suggested actions")
    follow_up: Optional[str] = Field(None, description="Follow-up question")
    mcp_tool_used: Optional[str] = Field(None, description="MCP tool that was executed")
    role_restricted: bool = Field(default=False, description="Whether response was restricted due to role")
    timestamp: str = Field(..., description="Response timestamp")

# Rate limiting for authenticated users (more generous than public)
RATE_LIMIT_REQUESTS = 100  # 100 requests per hour for authenticated users
RATE_LIMIT_WINDOW = 3600  # 1 hour

user_request_history: Dict[str, List[float]] = {}

def check_authenticated_rate_limit(user_id: str, request: Request) -> tuple[bool, int]:
    """Check rate limit for authenticated users"""
    current_time = time.time()
    
    if user_id not in user_request_history:
        user_request_history[user_id] = []
    
    # Clean old requests outside the window
    user_requests = user_request_history[user_id]
    user_requests[:] = [req_time for req_time in user_requests 
                       if current_time - req_time < RATE_LIMIT_WINDOW]
    
    # Check if limit exceeded
    if len(user_requests) >= RATE_LIMIT_REQUESTS:
        remaining = 0
        return False, remaining
    
    # Add current request
    user_requests.append(current_time)
    remaining = RATE_LIMIT_REQUESTS - len(user_requests)
    
    return True, remaining

def detect_mcp_intent(message: str, user_role: str) -> Optional[str]:
    """Detect if message should trigger MCP tools"""
    message_lower = message.lower()
    
    # Analytics queries
    if any(word in message_lower for word in ['analytics', 'report', 'metrics', 'statistics', 'data']):
        if user_role in ['super_admin', 'platform_admin', 'admin']:
            return 'generate_impact_report'
    
    # Platform status queries
    if any(word in message_lower for word in ['status', 'health', 'platform', 'system']):
        if user_role in ['super_admin', 'platform_admin']:
            return 'query_platform_data'
    
    # Shelter capacity queries
    if any(word in message_lower for word in ['capacity', 'beds', 'occupancy', 'shelter']):
        if user_role in ['super_admin', 'platform_admin', 'admin']:
            return 'update_shelter_capacity'
    
    # Donation processing
    if any(word in message_lower for word in ['donation', 'donate', 'process payment']):
        return 'process_donation'
    
    # Emergency situations
    if any(word in message_lower for word in ['emergency', 'crisis', 'urgent', 'help needed']):
        return 'emergency_escalation'
    
    # Knowledge base searches
    if any(word in message_lower for word in ['search', 'find', 'documentation', 'docs']):
        return 'search_knowledge_base'
    
    return None

async def try_mcp_execution(message: str, user_role: str, user_id: str) -> Optional[Dict[str, Any]]:
    """Attempt to execute MCP tool if appropriate"""
    try:
        mcp_tool = detect_mcp_intent(message, user_role)
        if not mcp_tool:
            return None
        
        # Create MCP request based on detected intent
        mcp_request = MCPToolRequest(
            tool_name=mcp_tool,
            parameters=extract_parameters_from_message(message, mcp_tool),
            user_id=user_id
        )
        
        # Execute MCP tool
        mcp_response = await mcp_service.execute_tool(mcp_request)
        
        if mcp_response.success:
            return {
                'tool_used': mcp_tool,
                'result': mcp_response.message,
                'data': mcp_response.data
            }
        else:
            logger.warning(f"MCP tool {mcp_tool} failed: {mcp_response.message}")
            return None
            
    except Exception as e:
        logger.error(f"MCP execution error: {e}")
        return None

def extract_parameters_from_message(message: str, tool_name: str) -> Dict[str, Any]:
    """Extract parameters from user message for MCP tools"""
    params = {}
    message_lower = message.lower()
    
    if tool_name == 'generate_impact_report':
        # Extract time period
        if 'week' in message_lower:
            params['period'] = 'weekly'
        elif 'month' in message_lower:
            params['period'] = 'monthly'
        elif 'day' in message_lower or 'today' in message_lower:
            params['period'] = 'daily'
        else:
            params['period'] = 'weekly'  # default
    
    elif tool_name == 'query_platform_data':
        params['query'] = message
        params['data_sources'] = ['users', 'donations', 'shelters']
    
    elif tool_name == 'search_knowledge_base':
        params['query'] = message
        params['max_results'] = 5
        params['include_metadata'] = True
    
    elif tool_name == 'emergency_escalation':
        params['emergency_type'] = 'general'
        params['location'] = 'unknown'
        params['severity'] = 'medium'
    
    return params

@router.post(
    "/authenticated",
    response_model=AuthenticatedChatResponse,
    summary="Authenticated chatbot with MCP integration",
    description="AI-powered chatbot for authenticated users with MCP tool access based on role"
)
async def authenticated_chat(
    message_data: AuthenticatedChatMessage, 
    request: Request,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Process authenticated chatbot messages with MCP integration and role-based access
    """
    try:
        # Rate limiting check
        allowed, remaining = check_authenticated_rate_limit(message_data.user_id, request)
        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later."
            )
        
        # Log authenticated interaction
        logger.info(f"Authenticated chat from {current_user.get('email', 'unknown')} - Role: {message_data.user_role}")
        
        # Try MCP execution first
        mcp_result = await try_mcp_execution(
            message_data.message, 
            message_data.user_role, 
            message_data.user_id
        )
        
        if mcp_result:
            # MCP tool was executed successfully
            response_text = f"✅ {mcp_result['result']}"
            if mcp_result.get('data'):
                # Format data nicely for user
                data_summary = format_mcp_data(mcp_result['data'])
                if data_summary:
                    response_text += f"\n\n📊 {data_summary}"
            
            return AuthenticatedChatResponse(
                success=True,
                response=response_text,
                conversation_id=f"auth_{message_data.user_id}_{int(time.time())}",
                mcp_tool_used=mcp_result['tool_used'],
                role_restricted=False,
                timestamp=time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())
            )
        
        # Fall back to regular orchestrator
        enhanced_context = {
            "session_type": "authenticated",
            "anonymous": False,
            "mcp_enabled": True,
            "role_permissions": get_role_permissions(message_data.user_role),
            **(message_data.conversation_context or {})
        }
        
        # Process through orchestrator
        orchestrator_response = await orchestrator.process_message(
            message=message_data.message,
            user_id=message_data.user_id,
            user_role=message_data.user_role,
            conversation_context=enhanced_context
        )
        
        return AuthenticatedChatResponse(
            success=True,
            response=orchestrator_response.message,
            conversation_id=orchestrator_response.conversation_id,
            actions=orchestrator_response.actions or [],
            follow_up=orchestrator_response.follow_up,
            mcp_tool_used=None,
            role_restricted=False,
            timestamp=time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authenticated chatbot error: {e}", exc_info=True)
        
        return AuthenticatedChatResponse(
            success=False,
            response=f"I apologize, but I'm having trouble processing your request right now. As a {message_data.user_role}, you have access to advanced MCP features, but there seems to be a temporary issue. Please try again in a moment.",
            conversation_id=f"error_{message_data.user_id}_{int(time.time())}",
            role_restricted=False,
            timestamp=time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())
        )

def get_role_permissions(user_role: str) -> List[str]:
    """Get permissions for user role"""
    permissions = {
        'super_admin': ['all_mcp_tools', 'analytics', 'system_management', 'shelter_operations', 'emergency_protocols'],
        'platform_admin': ['analytics', 'user_management', 'shelter_operations', 'knowledge_base'],
        'admin': ['shelter_operations', 'participant_management', 'capacity_updates'],
        'participant': ['status_updates', 'qr_generation', 'service_access'],
        'donor': ['donation_tracking', 'impact_reports', 'receipt_generation'],
        'authenticated': ['basic_queries', 'knowledge_base']
    }
    
    return permissions.get(user_role, permissions['authenticated'])

def format_mcp_data(data: Dict[str, Any]) -> Optional[str]:
    """Format MCP tool response data for user display"""
    if not data:
        return None
    
    # Format different types of data
    if 'transaction_id' in data:
        return f"Transaction ID: {data['transaction_id']}"
    
    if 'shelter_id' in data:
        return f"Shelter ID: {data['shelter_id']}"
    
    if 'results' in data and isinstance(data['results'], list):
        return f"Found {len(data['results'])} results"
    
    return "Operation completed successfully"
