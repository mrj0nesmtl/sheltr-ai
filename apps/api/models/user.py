"""
User Models for SHELTR-AI API
Pydantic models for user management requests and responses
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class UserRole(str, Enum):
    """User roles for RBAC system"""
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    PARTICIPANT = "participant"
    DONOR = "donor"

class UserCreate(BaseModel):
    """Model for user creation request"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password (minimum 8 characters)")
    first_name: str = Field(..., min_length=1, max_length=50, description="User first name")
    last_name: str = Field(..., min_length=1, max_length=50, description="User last name")
    role: UserRole = Field(..., description="User role in the system")
    shelter_id: Optional[str] = Field(None, description="Shelter ID for admin/participant roles")
    phone: Optional[str] = Field(None, description="User phone number")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "admin@shelter123.org",
                "password": "securepassword123",
                "first_name": "Jane",
                "last_name": "Smith",
                "role": "admin",
                "shelter_id": "shelter-123",
                "phone": "+1-555-0123"
            }
        }

class UserLogin(BaseModel):
    """Model for user login request"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@sheltr.ai",
                "password": "userpassword"
            }
        }

class UserResponse(BaseModel):
    """Model for user information response"""
    uid: str = Field(..., description="Firebase user ID")
    email: str = Field(..., description="User email address")
    first_name: str = Field(..., description="User first name")
    last_name: str = Field(..., description="User last name")
    display_name: Optional[str] = Field(None, description="User display name")
    role: UserRole = Field(..., description="User role")
    tenant_id: str = Field(..., description="Tenant ID for multi-tenant isolation")
    shelter_id: Optional[str] = Field(None, description="Associated shelter ID")
    permissions: List[str] = Field(default_factory=list, description="User permissions")
    email_verified: bool = Field(default=False, description="Email verification status")
    phone: Optional[str] = Field(None, description="User phone number")
    created_at: datetime = Field(..., description="Account creation timestamp")
    last_login: Optional[datetime] = Field(None, description="Last login timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "uid": "firebase-user-id-123",
                "email": "admin@shelter123.org",
                "first_name": "Jane",
                "last_name": "Smith",
                "display_name": "Jane Smith",
                "role": "admin",
                "tenant_id": "shelter-123",
                "shelter_id": "shelter-123",
                "permissions": ["shelter:manage", "participants:create"],
                "email_verified": True,
                "phone": "+1-555-0123",
                "created_at": "2025-07-24T12:00:00Z",
                "last_login": "2025-07-24T15:30:00Z"
            }
        }

class UserProfileUpdate(BaseModel):
    """Model for user profile update request"""
    first_name: Optional[str] = Field(None, min_length=1, max_length=50, description="User first name")
    last_name: Optional[str] = Field(None, min_length=1, max_length=50, description="User last name")
    phone: Optional[str] = Field(None, description="User phone number")
    display_name: Optional[str] = Field(None, description="User display name")
    
    class Config:
        json_schema_extra = {
            "example": {
                "first_name": "Jane",
                "last_name": "Doe",
                "phone": "+1-555-0124",
                "display_name": "Jane Doe"
            }
        }

class RoleUpdate(BaseModel):
    """Model for user role update request (super admin only)"""
    role: UserRole = Field(..., description="New role to assign")
    shelter_id: Optional[str] = Field(None, description="Shelter ID for admin/participant roles")
    
    class Config:
        json_schema_extra = {
            "example": {
                "role": "admin",
                "shelter_id": "shelter-456"
            }
        }

class UserListResponse(BaseModel):
    """Model for user list response"""
    users: List[UserResponse] = Field(..., description="List of users")
    total: int = Field(..., description="Total number of users")
    page: int = Field(..., description="Current page number")
    per_page: int = Field(..., description="Number of users per page")
    
    class Config:
        json_schema_extra = {
            "example": {
                "users": [],
                "total": 25,
                "page": 1,
                "per_page": 10
            }
        }

class AuthResponse(BaseModel):
    """Model for authentication response"""
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Response message")
    user: Optional[UserResponse] = Field(None, description="User information")
    token: Optional[str] = Field(None, description="Firebase ID token")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Authentication successful",
                "user": {
                    "uid": "firebase-user-id-123",
                    "email": "user@sheltr.ai",
                    "role": "donor"
                },
                "token": "firebase-id-token-here"
            }
        }

class StandardResponse(BaseModel):
    """Model for standard API response"""
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Response message")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional response data")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Operation completed successfully",
                "data": {}
            }
        }

class ErrorResponse(BaseModel):
    """Model for error response"""
    success: bool = Field(default=False, description="Operation success status")
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": "ValidationError",
                "message": "Invalid input data",
                "details": {
                    "field": "email",
                    "issue": "Invalid email format"
                }
            }
        }

class UserPreferences(BaseModel):
    """Model for user preferences"""
    theme: Optional[str] = Field("light", description="UI theme preference")
    language: Optional[str] = Field("en", description="Language preference")
    notifications: Optional[Dict[str, bool]] = Field(default_factory=dict, description="Notification preferences")
    dashboard_layout: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Dashboard layout preferences")
    
    class Config:
        json_schema_extra = {
            "example": {
                "theme": "dark",
                "language": "en",
                "notifications": {
                    "email": True,
                    "push": False,
                    "sms": True
                },
                "dashboard_layout": {
                    "sidebar_collapsed": False,
                    "widgets_order": ["stats", "recent_activity", "notifications"]
                }
            }
        }

class UserStats(BaseModel):
    """Model for user statistics"""
    total_logins: int = Field(default=0, description="Total number of logins")
    last_login_ip: Optional[str] = Field(None, description="Last login IP address")
    account_age_days: int = Field(default=0, description="Account age in days")
    role_specific_stats: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Role-specific statistics")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_logins": 42,
                "last_login_ip": "192.168.1.100",
                "account_age_days": 30,
                "role_specific_stats": {
                    "donations_made": 5,
                    "total_donated": 150.00
                }
            }
        } 