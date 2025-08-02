"""
Analytics API Routes for SHELTR-AI
Provides real-time metrics and analytics endpoints
"""

from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer
from services.analytics_service import analytics_service
from middleware.auth_middleware import (
    get_current_user, require_super_admin, require_admin_or_super
)
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/analytics", tags=["Analytics"])
security = HTTPBearer()

# Response Models
class AnalyticsResponse(BaseModel):
    """Standard analytics response model"""
    success: bool
    data: Dict[str, Any]
    timestamp: str
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    timestamp: str

@router.get(
    "/test-platform",
    response_model=AnalyticsResponse,
    summary="Get platform analytics (no auth)",
    description="Get comprehensive platform analytics for local development"
)
async def get_test_platform_analytics():
    """
    Get platform analytics without authentication for local development
    """
    try:
        logger.info("Testing platform analytics (no auth)")
        
        metrics = await analytics_service.get_platform_metrics()
        
        return AnalyticsResponse(
            success=True,
            data=metrics,
            timestamp=datetime.now().isoformat(),
            message="Platform analytics retrieved successfully (test mode)"
        )
        
    except Exception as e:
        logger.error(f"Error getting test platform analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve platform analytics: {str(e)}"
        )

@router.get(
    "/platform",
    response_model=AnalyticsResponse,
    summary="Get platform analytics",
    description="Get comprehensive platform analytics (Super Admin only)"
)
async def get_platform_analytics(
    current_user: Dict[str, Any] = Depends(require_super_admin())
):
    """
    Get comprehensive platform analytics including:
    - User metrics and growth
    - Donation statistics
    - Shelter network status
    - System health metrics
    - Growth trends
    """
    try:
        logger.info(f"Super Admin {current_user.get('email')} requested platform analytics")
        
        metrics = await analytics_service.get_platform_metrics()
        
        return AnalyticsResponse(
            success=True,
            data=metrics,
            timestamp=datetime.now().isoformat(),
            message="Platform analytics retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Error getting platform analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve platform analytics: {str(e)}"
        )

@router.get(
    "/shelter/{shelter_id}",
    response_model=AnalyticsResponse,
    summary="Get shelter analytics",
    description="Get analytics for a specific shelter (Admin+ access)"
)
async def get_shelter_analytics(
    shelter_id: str,
    current_user: Dict[str, Any] = Depends(require_admin_or_super())
):
    """
    Get analytics for a specific shelter including:
    - Participant metrics
    - Service statistics
    - Occupancy data
    - Donation information
    """
    try:
        logger.info(f"User {current_user.get('email')} requested analytics for shelter {shelter_id}")
        
        # TODO: Add permission check to ensure admin can only access their shelter
        metrics = await analytics_service.get_shelter_analytics(shelter_id)
        
        return AnalyticsResponse(
            success=True,
            data=metrics,
            timestamp=datetime.now().isoformat(),
            message=f"Shelter {shelter_id} analytics retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Error getting shelter analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve shelter analytics: {str(e)}"
        )

@router.get(
    "/realtime",
    response_model=AnalyticsResponse,
    summary="Get real-time metrics",
    description="Get real-time platform metrics (Super Admin only)"
)
async def get_realtime_metrics(
    current_user: Dict[str, Any] = Depends(require_super_admin())
):
    """
    Get real-time platform metrics for dashboard displays
    """
    try:
        logger.info(f"Super Admin {current_user.get('email')} requested real-time metrics")
        
        metrics = await analytics_service.get_platform_metrics()
        
        # Extract real-time relevant data
        realtime_data = {
            "users": {
                "total": metrics.get("users", {}).get("total", 0),
                "active_today": metrics.get("users", {}).get("active_today", 0),
                "by_role": metrics.get("users", {}).get("by_role", {})
            },
            "donations": {
                "today_amount": metrics.get("donations", {}).get("today_amount", 0),
                "today_count": metrics.get("donations", {}).get("today_count", 0),
                "total_amount": metrics.get("donations", {}).get("total_amount", 0)
            },
            "shelters": {
                "total": metrics.get("shelters", {}).get("total_shelters", 0),
                "occupancy_rate": metrics.get("shelters", {}).get("occupancy_rate", 0)
            },
            "system": metrics.get("system", {}),
            "last_updated": datetime.now().isoformat()
        }
        
        return AnalyticsResponse(
            success=True,
            data=realtime_data,
            timestamp=datetime.now().isoformat(),
            message="Real-time metrics retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Error getting real-time metrics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve real-time metrics: {str(e)}"
        )

@router.post(
    "/track",
    summary="Track analytics event",
    description="Track an analytics event"
)
async def track_event(
    event_type: str,
    metadata: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Track an analytics event for monitoring and metrics
    """
    try:
        user_id = current_user.get('uid', 'anonymous')
        logger.info(f"Tracking event {event_type} for user {user_id}")
        
        success = await analytics_service.track_event(event_type, user_id, metadata)
        
        if success:
            return {
                "success": True,
                "message": "Event tracked successfully",
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to track event"
            )
            
    except Exception as e:
        logger.error(f"Error tracking event: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to track event: {str(e)}"
        )

@router.get(
    "/reports/{report_type}",
    response_model=AnalyticsResponse,
    summary="Generate analytics report",
    description="Generate a comprehensive analytics report (Admin+ access)"
)
async def generate_report(
    report_type: str,
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    current_user: Dict[str, Any] = Depends(require_admin_or_super())
):
    """
    Generate analytics reports including:
    - platform_summary: Overall platform performance
    - shelter_performance: Shelter network analysis
    - donor_impact: Donor engagement and impact metrics
    """
    try:
        logger.info(f"User {current_user.get('email')} requested {report_type} report")
        
        # Default date range: last 30 days
        if not start_date:
            start_date = (datetime.now() - timedelta(days=30)).date().isoformat()
        if not end_date:
            end_date = datetime.now().date().isoformat()
        
        start_dt = datetime.fromisoformat(start_date)
        end_dt = datetime.fromisoformat(end_date)
        
        report = await analytics_service.generate_report(report_type, start_dt, end_dt)
        
        return AnalyticsResponse(
            success=True,
            data=report,
            timestamp=datetime.now().isoformat(),
            message=f"Report {report_type} generated successfully"
        )
        
    except ValueError as e:
        logger.error(f"Invalid date format: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    except Exception as e:
        logger.error(f"Error generating report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}"
        )

@router.get(
    "/dashboard",
    response_model=AnalyticsResponse,
    summary="Get dashboard data",
    description="Get analytics data optimized for dashboard display"
)
async def get_dashboard_analytics(
    user_role: Optional[str] = Query(None, description="Filter by user role"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get analytics data optimized for dashboard display based on user role
    """
    try:
        user_email = current_user.get('email', 'unknown')
        logger.info(f"User {user_email} requested dashboard analytics")
        
        # Get appropriate analytics based on user role
        current_role = current_user.get('role', 'participant')
        
        if current_role == 'super_admin':
            # Super admin gets full platform metrics
            metrics = await analytics_service.get_platform_metrics()
        elif current_role == 'admin':
            # Shelter admin gets shelter-specific metrics
            # TODO: Get shelter_id from user profile
            shelter_id = current_user.get('shelter_id', 'default-shelter')
            metrics = await analytics_service.get_shelter_analytics(shelter_id)
        else:
            # Participants and donors get limited metrics
            metrics = {
                "user_stats": {
                    "role": current_role,
                    "profile_complete": current_user.get('profile_complete', False)
                },
                "platform_health": "operational"
            }
        
        return AnalyticsResponse(
            success=True,
            data=metrics,
            timestamp=datetime.now().isoformat(),
            message="Dashboard analytics retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Error getting dashboard analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve dashboard analytics: {str(e)}"
        ) 