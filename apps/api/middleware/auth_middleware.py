"""
Authentication Middleware for SHELTR-AI FastAPI
Handles token verification, role-based access control, and tenant isolation
"""

from typing import Optional, Dict, Any, List
from fastapi import HTTPException, Depends, Header, status
from services.firebase_service import firebase_service, UserRole

class AuthMiddleware:
    """Authentication middleware for FastAPI"""
    
    def __init__(self):
        self.firebase = firebase_service
    
    async def get_current_user(
        self, 
        authorization: Optional[str] = Header(None, alias="Authorization")
    ) -> Dict[str, Any]:
        """
        Extract and verify Firebase ID token from Authorization header
        
        Args:
            authorization: Authorization header with Bearer token
            
        Returns:
            Decoded user information with custom claims
            
        Raises:
            HTTPException: If token is invalid or missing
        """
        if not authorization:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header is required",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format. Use 'Bearer <token>'",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        token = authorization.split("Bearer ")[1]
        
        try:
            decoded_token = await self.firebase.verify_token(token)
            
            # Extract user information and custom claims
            user_info = {
                'uid': decoded_token['uid'],
                'email': decoded_token.get('email'),
                'email_verified': decoded_token.get('email_verified', False),
                'role': decoded_token.get('role'),
                'tenant_id': decoded_token.get('tenant_id'),
                'permissions': decoded_token.get('permissions', []),
                'shelter_id': decoded_token.get('shelter_id')
            }
            
            return user_info
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid or expired token: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    def require_role(self, required_role: UserRole):
        """
        Dependency factory for role-based access control
        
        Args:
            required_role: Required user role
            
        Returns:
            Dependency function that checks user role
        """
        async def role_checker(current_user: Dict[str, Any] = Depends(self.get_current_user)):
            user_role = current_user.get('role')
            
            # Super admin has access to everything
            if user_role == UserRole.SUPER_ADMIN.value:
                return current_user
            
            # Check if user has the required role
            if user_role != required_role.value:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access denied. Required role: {required_role.value}, your role: {user_role}"
                )
            
            return current_user
        
        return role_checker
    
    def require_permission(self, required_permission: str):
        """
        Dependency factory for permission-based access control
        
        Args:
            required_permission: Required permission
            
        Returns:
            Dependency function that checks user permission
        """
        async def permission_checker(current_user: Dict[str, Any] = Depends(self.get_current_user)):
            user_permissions = current_user.get('permissions', [])
            user_role = current_user.get('role')
            
            # Super admin has all permissions
            if user_role == UserRole.SUPER_ADMIN.value:
                return current_user
            
            # Check if user has the required permission
            if required_permission not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access denied. Required permission: {required_permission}"
                )
            
            return current_user
        
        return permission_checker
    
    def require_tenant_access(self, tenant_id: str):
        """
        Dependency factory for tenant-based access control
        
        Args:
            tenant_id: Required tenant ID
            
        Returns:
            Dependency function that checks tenant access
        """
        async def tenant_checker(current_user: Dict[str, Any] = Depends(self.get_current_user)):
            user_tenant_id = current_user.get('tenant_id')
            user_role = current_user.get('role')
            
            # Super admin has access to all tenants
            if user_role == UserRole.SUPER_ADMIN.value:
                return current_user
            
            # Check if user has access to the required tenant
            if user_tenant_id != tenant_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access denied. You don't have access to tenant: {tenant_id}"
                )
            
            return current_user
        
        return tenant_checker
    
    def require_shelter_access(self, shelter_id: str):
        """
        Dependency factory for shelter-specific access control
        
        Args:
            shelter_id: Required shelter ID
            
        Returns:
            Dependency function that checks shelter access
        """
        async def shelter_checker(current_user: Dict[str, Any] = Depends(self.get_current_user)):
            user_shelter_id = current_user.get('shelter_id')
            user_role = current_user.get('role')
            user_tenant_id = current_user.get('tenant_id')
            
            # Super admin has access to all shelters
            if user_role == UserRole.SUPER_ADMIN.value:
                return current_user
            
            # Admin and participant users must be associated with the shelter
            if user_role in [UserRole.ADMIN.value, UserRole.PARTICIPANT.value]:
                if user_shelter_id != shelter_id and user_tenant_id != f"shelter-{shelter_id}":
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Access denied. You don't have access to shelter: {shelter_id}"
                    )
            
            return current_user
        
        return shelter_checker

# Create singleton instance
auth_middleware = AuthMiddleware()

# Convenience dependency functions
async def get_current_user(current_user: Dict[str, Any] = Depends(auth_middleware.get_current_user)):
    """Get current authenticated user"""
    return current_user

def require_super_admin():
    """Require super admin role"""
    return auth_middleware.require_role(UserRole.SUPER_ADMIN)

def require_admin():
    """Require admin role"""
    return auth_middleware.require_role(UserRole.ADMIN)

def require_participant():
    """Require participant role"""
    return auth_middleware.require_role(UserRole.PARTICIPANT)

def require_donor():
    """Require donor role"""
    return auth_middleware.require_role(UserRole.DONOR)

def require_admin_or_super():
    """Require admin or super admin role"""
    async def admin_or_super_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user.get('role')
        
        if user_role not in [UserRole.ADMIN.value, UserRole.SUPER_ADMIN.value]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Admin or Super Admin role required."
            )
        
        return current_user
    
    return admin_or_super_checker 