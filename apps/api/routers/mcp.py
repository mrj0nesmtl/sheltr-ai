"""
SHELTR-AI MCP Router
FastAPI router for Model Context Protocol endpoints
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from typing import Dict, Any, List, Optional
import logging

from services.mcp_service import (
    mcp_service, 
    MCPToolRequest, 
    MCPToolResponse, 
    MCPToolType
)
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/v1/mcp", tags=["MCP - Model Context Protocol"])
logger = logging.getLogger(__name__)

@router.get("/health")
async def mcp_health_check():
    """Health check for MCP service"""
    return {
        "status": "operational",
        "service": "SHELTR-AI MCP Service",
        "version": "1.0.0",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@router.get("/tools")
async def get_available_tools(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get list of available MCP tools for current user"""
    try:
        tools = mcp_service.get_available_tools()
        
        # Filter tools based on user role (optional enhancement)
        user_role = getattr(current_user, 'role', '').lower()
        
        return {
            "success": True,
            "data": tools,
            "user_role": user_role,
            "message": "Available MCP tools retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"❌ Error getting MCP tools: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve MCP tools: {str(e)}"
        )

@router.get("/workflows")
async def get_available_workflows(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get list of available MCP workflows for current user"""
    try:
        workflows = mcp_service.get_available_workflows()
        
        return {
            "success": True,
            "data": workflows,
            "message": "Available MCP workflows retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"❌ Error getting MCP workflows: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve MCP workflows: {str(e)}"
        )

@router.post("/tools/execute")
async def execute_mcp_tool(
    request: MCPToolRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> MCPToolResponse:
    """Execute a single MCP tool"""
    try:
        # Set user_id from authenticated user
        request.user_id = current_user.get('uid', current_user.get('user_id', ''))
        
        logger.info(f"🔧 Executing MCP tool '{request.tool_name}' for user {current_user.get('email', 'unknown')}")
        
        # Execute the tool
        response = await mcp_service.execute_tool(request)
        
        if response.success:
            logger.info(f"✅ MCP tool '{request.tool_name}' executed successfully")
        else:
            logger.warning(f"⚠️ MCP tool '{request.tool_name}' execution failed: {response.message}")
        
        return response
        
    except Exception as e:
        logger.error(f"❌ MCP tool execution error: {str(e)}")
        return MCPToolResponse(
            success=False,
            message=f"Tool execution failed: {str(e)}",
            metadata={"error_type": type(e).__name__}
        )

@router.post("/workflows/execute/{workflow_id}")
async def execute_mcp_workflow(
    workflow_id: str,
    parameters: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> List[MCPToolResponse]:
    """Execute a multi-step MCP workflow"""
    try:
        logger.info(f"🔄 Executing MCP workflow '{workflow_id}' for user {current_user.get('email', 'unknown')}")
        
        # Execute the workflow
        responses = await mcp_service.execute_workflow(
            workflow_id=workflow_id,
            parameters=parameters,
            user_id=current_user.get('uid', current_user.get('user_id', ''))
        )
        
        successful_steps = sum(1 for r in responses if r.success)
        logger.info(f"✅ MCP workflow '{workflow_id}' completed: {successful_steps}/{len(responses)} steps successful")
        
        return responses
        
    except Exception as e:
        logger.error(f"❌ MCP workflow execution error: {str(e)}")
        return [MCPToolResponse(
            success=False,
            message=f"Workflow execution failed: {str(e)}",
            metadata={"error_type": type(e).__name__}
        )]

@router.get("/tools/{tool_name}/schema")
async def get_tool_schema(
    tool_name: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get schema/documentation for a specific MCP tool"""
    try:
        tools = mcp_service.get_available_tools()
        
        if tool_name not in tools["tools"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tool '{tool_name}' not found"
            )
        
        tool_info = tools["tools"][tool_name]
        
        return {
            "success": True,
            "data": {
                "tool_name": tool_name,
                "tool_type": tool_info["type"],
                "description": tool_info["description"],
                "parameters": tool_info["parameters"],
                "example_request": {
                    "tool_name": tool_name,
                    "tool_type": tool_info["type"],
                    "parameters": {
                        param: f"example_{param}"
                        for param, config in tool_info["parameters"].items()
                        if config.get("required", False)
                    }
                }
            },
            "message": f"Schema for tool '{tool_name}' retrieved successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting tool schema: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve tool schema: {str(e)}"
        )

@router.get("/workflows/{workflow_id}/schema")
async def get_workflow_schema(
    workflow_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get schema/documentation for a specific MCP workflow"""
    try:
        if workflow_id not in mcp_service.workflows:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Workflow '{workflow_id}' not found"
            )
        
        workflow = mcp_service.workflows[workflow_id]
        
        return {
            "success": True,
            "data": {
                "workflow_id": workflow_id,
                "name": workflow.name,
                "description": workflow.description,
                "steps": [
                    {
                        "step_id": step.step_id,
                        "tool_name": step.tool_name,
                        "tool_type": step.tool_type,
                        "depends_on": step.depends_on,
                        "condition": step.condition
                    }
                    for step in workflow.steps
                ],
                "timeout_seconds": workflow.timeout_seconds
            },
            "message": f"Schema for workflow '{workflow_id}' retrieved successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting workflow schema: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve workflow schema: {str(e)}"
        )

# Enhanced endpoints for SHELTR-AI specific functionality

@router.post("/sheltr/emergency")
async def emergency_response_endpoint(
    emergency_data: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Quick emergency response endpoint"""
    try:
        # Create emergency tool request
        request = MCPToolRequest(
            tool_name="emergency_escalation",
            tool_type=MCPToolType.EMERGENCY_RESPONSE,
            parameters=emergency_data,
            user_id=current_user.get('uid', current_user.get('user_id', '')),
            context={"source": "emergency_endpoint"}
        )
        
        # Execute emergency response
        response = await mcp_service.execute_tool(request)
        
        # If successful, also trigger emergency workflow
        if response.success:
            workflow_responses = await mcp_service.execute_workflow(
                workflow_id="emergency_response",
                parameters=emergency_data,
                user_id=current_user.get('uid', current_user.get('user_id', ''))
            )
            
            return {
                "success": True,
                "emergency_response": response,
                "workflow_responses": workflow_responses,
                "message": "Emergency response initiated successfully"
            }
        
        return {
            "success": False,
            "emergency_response": response,
            "message": "Emergency response failed to initiate"
        }
        
    except Exception as e:
        logger.error(f"❌ Emergency response error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Emergency response failed: {str(e)}"
        )

@router.post("/sheltr/shelter/onboard")
async def shelter_onboarding_endpoint(
    shelter_data: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Quick shelter onboarding endpoint"""
    try:
        # Execute shelter onboarding workflow
        workflow_responses = await mcp_service.execute_workflow(
            workflow_id="shelter_onboarding",
            parameters=shelter_data,
            user_id=current_user.get('uid', current_user.get('user_id', ''))
        )
        
        successful_steps = sum(1 for r in workflow_responses if r.success)
        
        return {
            "success": successful_steps > 0,
            "workflow_responses": workflow_responses,
            "steps_completed": successful_steps,
            "total_steps": len(workflow_responses),
            "message": f"Shelter onboarding workflow completed: {successful_steps}/{len(workflow_responses)} steps successful"
        }
        
    except Exception as e:
        logger.error(f"❌ Shelter onboarding error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Shelter onboarding failed: {str(e)}"
        )

@router.post("/sheltr/query")
async def intelligent_query_endpoint(
    query_data: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Intelligent query endpoint for natural language data queries"""
    try:
        # Determine if this is a knowledge base query or platform data query
        query = query_data.get("query", "")
        query_type = query_data.get("type", "auto")  # auto, knowledge, platform_data
        
        if query_type == "auto":
            # Simple heuristic to determine query type
            knowledge_keywords = ["how", "what", "explain", "guide", "documentation", "help"]
            if any(keyword in query.lower() for keyword in knowledge_keywords):
                query_type = "knowledge"
            else:
                query_type = "platform_data"
        
        tool_name = "search_knowledge_base" if query_type == "knowledge" else "query_platform_data"
        tool_type = MCPToolType.KNOWLEDGE_QUERY if query_type == "knowledge" else MCPToolType.REPORTING_ANALYTICS
        
        # Create tool request
        request = MCPToolRequest(
            tool_name=tool_name,
            tool_type=tool_type,
            parameters=query_data,
            user_id=current_user.get('uid', current_user.get('user_id', '')),
            context={"source": "intelligent_query_endpoint"}
        )
        
        # Execute the query
        response = await mcp_service.execute_tool(request)
        
        return {
            "success": response.success,
            "query_type": query_type,
            "response": response,
            "message": f"Query processed successfully using {tool_name}"
        }
        
    except Exception as e:
        logger.error(f"❌ Intelligent query error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Query processing failed: {str(e)}"
        )

# Test endpoint for development
@router.post("/test/tool/{tool_name}")
async def test_mcp_tool(
    tool_name: str,
    test_parameters: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Test endpoint for MCP tools during development"""
    try:
        # Get tool info
        tools = mcp_service.get_available_tools()
        if tool_name not in tools["tools"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tool '{tool_name}' not found"
            )
        
        tool_info = tools["tools"][tool_name]
        
        # Create test request
        request = MCPToolRequest(
            tool_name=tool_name,
            tool_type=MCPToolType(tool_info["type"]),
            parameters=test_parameters,
            user_id=current_user.get('uid', current_user.get('user_id', '')),
            context={"source": "test_endpoint", "test_mode": True}
        )
        
        # Execute tool
        response = await mcp_service.execute_tool(request)
        
        return {
            "success": True,
            "test_mode": True,
            "tool_info": tool_info,
            "test_response": response,
            "message": f"Test execution of '{tool_name}' completed"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ MCP tool test error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Tool test failed: {str(e)}"
        )
