"""
SHELTR-AI Knowledge Base Permissions System
Defines access levels and permission checking for documents
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class DocumentPermission(str, Enum):
    """
    Document permission levels for granular access control
    
    Hierarchy (least to most restrictive):
    PUBLIC < AUTHENTICATED < DONOR < PARTICIPANT < SHELTER_ADMIN < PLATFORM_ADMIN < FOUNDERS < SUPER_ADMIN
    """
    PUBLIC = "public"                      # Anyone can view (no authentication required)
    AUTHENTICATED = "authenticated"         # Any logged-in user
    DONOR = "donor"                        # Donors only
    PARTICIPANT = "participant"            # Participants only
    SHELTER_ADMIN = "shelter_admin"        # Shelter administrators
    PLATFORM_ADMIN = "platform_admin"      # Platform administrators
    FOUNDERS = "founders"                  # Founders only
    SUPER_ADMIN = "super_admin"            # Super administrators only
    
class UserRole(str, Enum):
    """Standard user roles in SHELTR platform"""
    GUEST = "guest"
    PARTICIPANT = "participant"
    DONOR = "donor"
    SHELTER_ADMIN = "shelter_admin"
    PLATFORM_ADMIN = "platform_admin"
    FOUNDER = "founder"
    SUPER_ADMIN = "super_admin"

# Permission hierarchy - higher roles inherit lower role permissions
PERMISSION_HIERARCHY = {
    UserRole.GUEST: [DocumentPermission.PUBLIC],
    UserRole.PARTICIPANT: [DocumentPermission.PUBLIC, DocumentPermission.AUTHENTICATED, DocumentPermission.PARTICIPANT],
    UserRole.DONOR: [DocumentPermission.PUBLIC, DocumentPermission.AUTHENTICATED, DocumentPermission.DONOR],
    UserRole.SHELTER_ADMIN: [
        DocumentPermission.PUBLIC, 
        DocumentPermission.AUTHENTICATED, 
        DocumentPermission.DONOR,
        DocumentPermission.PARTICIPANT,
        DocumentPermission.SHELTER_ADMIN
    ],
    UserRole.PLATFORM_ADMIN: [
        DocumentPermission.PUBLIC, 
        DocumentPermission.AUTHENTICATED, 
        DocumentPermission.DONOR,
        DocumentPermission.PARTICIPANT,
        DocumentPermission.SHELTER_ADMIN,
        DocumentPermission.PLATFORM_ADMIN
    ],
    UserRole.FOUNDER: [
        DocumentPermission.PUBLIC, 
        DocumentPermission.AUTHENTICATED, 
        DocumentPermission.DONOR,
        DocumentPermission.PARTICIPANT,
        DocumentPermission.SHELTER_ADMIN,
        DocumentPermission.PLATFORM_ADMIN,
        DocumentPermission.FOUNDERS
    ],
    UserRole.SUPER_ADMIN: [
        DocumentPermission.PUBLIC, 
        DocumentPermission.AUTHENTICATED, 
        DocumentPermission.DONOR,
        DocumentPermission.PARTICIPANT,
        DocumentPermission.SHELTER_ADMIN,
        DocumentPermission.PLATFORM_ADMIN,
        DocumentPermission.FOUNDERS,
        DocumentPermission.SUPER_ADMIN
    ]
}

class DocumentPermissionConfig(BaseModel):
    """Complete permission configuration for a document"""
    permission_level: DocumentPermission = DocumentPermission.PUBLIC
    allowed_roles: List[str] = []
    is_private: bool = False
    created_by: Optional[str] = None
    synced_from_github: bool = False
    github_path: Optional[str] = None
    visibility_scope: Optional[str] = None  # 'global', 'shelter', 'organization'
    
    class Config:
        use_enum_values = True

def check_document_permission(
    document_permission: DocumentPermission,
    user_role: str,
    user_id: Optional[str] = None,
    document_created_by: Optional[str] = None,
    allowed_roles: Optional[List[str]] = None,
    is_private: bool = False
) -> bool:
    """
    Check if a user has permission to access a document
    
    Args:
        document_permission: Required permission level for the document
        user_role: Current user's role
        user_id: Current user's ID
        document_created_by: ID of user who created the document
        allowed_roles: Additional roles explicitly allowed
        is_private: Whether the document is marked private
        
    Returns:
        bool: True if user has permission, False otherwise
    """
    
    # Public documents are accessible to everyone (unless marked private)
    if document_permission == DocumentPermission.PUBLIC and not is_private:
        return True
    
    # No user role provided (guest/unauthenticated)
    if not user_role:
        return False
    
    # Convert string role to UserRole enum
    try:
        user_role_enum = UserRole(user_role.lower())
    except ValueError:
        return False
    
    # Super admins see everything
    if user_role_enum == UserRole.SUPER_ADMIN:
        return True
    
    # Document owner always has access (unless super restricted)
    if user_id and document_created_by and user_id == document_created_by:
        return True
    
    # Check if user is in explicitly allowed roles
    if allowed_roles and user_role in allowed_roles:
        return True
    
    # Check permission hierarchy
    user_permissions = PERMISSION_HIERARCHY.get(user_role_enum, [])
    return document_permission in user_permissions

def determine_permission_from_path(file_path: str) -> DocumentPermission:
    """
    Automatically determine permission level based on file path
    
    Args:
        file_path: Path to the document
        
    Returns:
        DocumentPermission: Recommended permission level
    """
    file_path_lower = file_path.lower()
    
    # Secure/private folders
    if any(keyword in file_path_lower for keyword in ['secure', 'private', 'confidential', 'internal']):
        if 'founder' in file_path_lower:
            return DocumentPermission.FOUNDERS
        elif 'admin' in file_path_lower:
            return DocumentPermission.PLATFORM_ADMIN
        else:
            return DocumentPermission.SHELTER_ADMIN
    
    # Public documentation
    if any(keyword in file_path_lower for keyword in ['public', 'docs', 'readme', 'guide']):
        return DocumentPermission.PUBLIC
    
    # User-specific documentation
    if 'participant' in file_path_lower:
        return DocumentPermission.PARTICIPANT
    elif 'donor' in file_path_lower:
        return DocumentPermission.DONOR
    elif 'shelter' in file_path_lower:
        return DocumentPermission.SHELTER_ADMIN
    
    # Default to authenticated
    return DocumentPermission.AUTHENTICATED

def get_permission_display_info(permission: DocumentPermission) -> Dict[str, Any]:
    """
    Get display information for a permission level
    
    Args:
        permission: Permission level
        
    Returns:
        dict: Display information including color, icon, label
    """
    permission_info = {
        DocumentPermission.PUBLIC: {
            'label': 'Public',
            'description': 'Anyone can view',
            'color': 'green',
            'icon': 'globe'
        },
        DocumentPermission.AUTHENTICATED: {
            'label': 'Authenticated Users',
            'description': 'Any logged-in user',
            'color': 'blue',
            'icon': 'users'
        },
        DocumentPermission.DONOR: {
            'label': 'Donors Only',
            'description': 'Accessible to donors',
            'color': 'purple',
            'icon': 'heart'
        },
        DocumentPermission.PARTICIPANT: {
            'label': 'Participants Only',
            'description': 'Accessible to participants',
            'color': 'teal',
            'icon': 'user'
        },
        DocumentPermission.SHELTER_ADMIN: {
            'label': 'Shelter Administrators',
            'description': 'Shelter admin access only',
            'color': 'orange',
            'icon': 'building'
        },
        DocumentPermission.PLATFORM_ADMIN: {
            'label': 'Platform Administrators',
            'description': 'Platform admin access only',
            'color': 'red',
            'icon': 'shield'
        },
        DocumentPermission.FOUNDERS: {
            'label': 'Founders Only',
            'description': 'Founders and leadership only',
            'color': 'amber',
            'icon': 'crown'
        },
        DocumentPermission.SUPER_ADMIN: {
            'label': 'Super Administrators',
            'description': 'Highest level access',
            'color': 'gray',
            'icon': 'lock'
        }
    }
    
    return permission_info.get(permission, permission_info[DocumentPermission.PUBLIC])

# Export all permission utilities
__all__ = [
    'DocumentPermission',
    'UserRole',
    'DocumentPermissionConfig',
    'PERMISSION_HIERARCHY',
    'check_document_permission',
    'determine_permission_from_path',
    'get_permission_display_info'
]

