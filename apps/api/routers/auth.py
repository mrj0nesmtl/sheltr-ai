"""
Authentication API Routes for SHELTR-AI
Handles user registration, login, role management, and profile operations
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer
from services.firebase_service import firebase_service, UserRole, CustomClaims
from middleware.auth_middleware import (
    get_current_user, require_super_admin, require_admin_or_super,
    auth_middleware
)
from models.user import (
    UserCreate, UserLogin, UserResponse, UserProfileUpdate, RoleUpdate,
    AuthResponse, StandardResponse, ErrorResponse, UserListResponse
)
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user",
    description="Create a new user account with role-based access control"
)
async def register_user(user_data: UserCreate):
    """
    Register a new user with role-based tenant assignment
    
    This endpoint creates a new Firebase user, sets custom claims based on role,
    and creates a user profile in the appropriate tenant collection.
    """
    try:
        # Determine tenant ID based on role
        tenant_id = firebase_service.get_tenant_id_for_role(
            user_data.role, 
            user_data.shelter_id
        )
        
        # Get role permissions
        permissions = firebase_service.get_role_permissions(user_data.role)
        
        # Create Firebase user
        display_name = f"{user_data.first_name} {user_data.last_name}"
        firebase_user = await firebase_service.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=display_name
        )
        
        # Set custom claims
        claims = CustomClaims(
            role=user_data.role,
            tenant_id=tenant_id,
            permissions=permissions,
            shelter_id=user_data.shelter_id
        )
        
        await firebase_service.set_custom_claims(firebase_user.uid, claims)
        
        # Create user profile in Firestore
        profile_data = {
            "email": user_data.email,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "display_name": display_name,
            "role": user_data.role.value,
            "shelter_id": user_data.shelter_id,
            "phone": user_data.phone,
            "permissions": permissions,
            "email_verified": False
        }
        
        await firebase_service.create_user_profile(
            firebase_user.uid, 
            profile_data, 
            tenant_id
        )
        
        # Create user response
        user_response = UserResponse(
            uid=firebase_user.uid,
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            display_name=display_name,
            role=user_data.role,
            tenant_id=tenant_id,
            shelter_id=user_data.shelter_id,
            permissions=permissions,
            email_verified=False,
            phone=user_data.phone,
            created_at=datetime.utcnow(),
            last_login=None
        )
        
        logger.info(f"User registered successfully: {user_data.email} with role {user_data.role}")
        
        return AuthResponse(
            success=True,
            message="User registered successfully",
            user=user_response
        )
        
    except Exception as e:
        logger.error(f"Registration failed for {user_data.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
    description="Get current authenticated user information with custom claims"
)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current user information including role and permissions
    """
    try:
        # Get user profile from Firestore
        user_profile = await firebase_service.get_user_profile(
            current_user['uid'], 
            current_user['tenant_id']
        )
        
        if not user_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        # Convert to response model
        user_response = UserResponse(
            uid=current_user['uid'],
            email=current_user['email'],
            first_name=user_profile.get('first_name', ''),
            last_name=user_profile.get('last_name', ''),
            display_name=user_profile.get('display_name'),
            role=UserRole(current_user['role']),
            tenant_id=current_user['tenant_id'],
            shelter_id=current_user.get('shelter_id'),
            permissions=current_user.get('permissions', []),
            email_verified=current_user.get('email_verified', False),
            phone=user_profile.get('phone'),
            created_at=user_profile.get('created_at', datetime.utcnow()),
            last_login=user_profile.get('last_login')
        )
        
        return user_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get user info for {current_user['uid']}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user information"
        )

@router.put(
    "/profile",
    response_model=StandardResponse,
    summary="Update user profile",
    description="Update current user's profile information"
)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update user profile information
    """
    try:
        # Build update data (only include non-None values)
        update_data = {}
        
        if profile_data.first_name is not None:
            update_data['first_name'] = profile_data.first_name
        if profile_data.last_name is not None:
            update_data['last_name'] = profile_data.last_name
        if profile_data.phone is not None:
            update_data['phone'] = profile_data.phone
        if profile_data.display_name is not None:
            update_data['display_name'] = profile_data.display_name
        
        # Update display name if first/last name changed
        if 'first_name' in update_data or 'last_name' in update_data:
            # Get current profile to build full display name
            user_profile = await firebase_service.get_user_profile(
                current_user['uid'], 
                current_user['tenant_id']
            )
            
            first_name = update_data.get('first_name', user_profile.get('first_name', ''))
            last_name = update_data.get('last_name', user_profile.get('last_name', ''))
            update_data['display_name'] = f"{first_name} {last_name}"
        
        if update_data:
            # Update in Firestore
            collection_path = f"tenants/{current_user['tenant_id']}/users"
            firebase_service.db.collection(collection_path).document(current_user['uid']).update(update_data)
            
            logger.info(f"Profile updated for user {current_user['uid']}")
        
        return StandardResponse(
            success=True,
            message="Profile updated successfully",
            data={"updated_fields": list(update_data.keys())}
        )
        
    except Exception as e:
        logger.error(f"Failed to update profile for {current_user['uid']}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )

@router.put(
    "/roles/{user_id}",
    response_model=StandardResponse,
    summary="Update user role",
    description="Update user role and permissions (Super Admin only)"
)
async def update_user_role(
    user_id: str,
    role_data: RoleUpdate,
    current_user: dict = Depends(require_super_admin())
):
    """
    Update user role and permissions (Super Admin only)
    """
    try:
        # Determine new tenant ID based on role
        tenant_id = firebase_service.get_tenant_id_for_role(
            role_data.role,
            role_data.shelter_id
        )
        
        # Get new role permissions
        permissions = firebase_service.get_role_permissions(role_data.role)
        
        # Update custom claims
        await firebase_service.update_user_role(
            user_id,
            role_data.role,
            tenant_id,
            permissions
        )
        
        # Update user profile in Firestore
        # First, get current profile to move it if tenant changed
        current_claims = await firebase_service.get_user_claims(user_id)
        current_tenant_id = current_claims.get('tenant_id')
        
        if current_tenant_id and current_tenant_id != tenant_id:
            # Move user profile to new tenant
            old_collection = f"tenants/{current_tenant_id}/users"
            new_collection = f"tenants/{tenant_id}/users"
            
            # Get current profile
            old_doc = firebase_service.db.collection(old_collection).document(user_id).get()
            
            if old_doc.exists:
                profile_data = old_doc.to_dict()
                profile_data.update({
                    "role": role_data.role.value,
                    "tenant_id": tenant_id,
                    "shelter_id": role_data.shelter_id,
                    "permissions": permissions
                })
                
                # Create in new tenant
                firebase_service.db.collection(new_collection).document(user_id).set(profile_data)
                
                # Delete from old tenant
                firebase_service.db.collection(old_collection).document(user_id).delete()
        
        logger.info(f"Role updated for user {user_id} to {role_data.role} by {current_user['uid']}")
        
        return StandardResponse(
            success=True,
            message=f"User role updated to {role_data.role.value}",
            data={
                "user_id": user_id,
                "new_role": role_data.role.value,
                "new_tenant_id": tenant_id,
                "permissions": permissions
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to update role for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user role: {str(e)}"
        )

@router.get(
    "/users",
    response_model=UserListResponse,
    summary="List users",
    description="List users with optional filtering (Admin+ required)"
)
async def list_users(
    tenant_id: Optional[str] = Query(None, description="Filter by tenant ID"),
    role: Optional[UserRole] = Query(None, description="Filter by role"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: dict = Depends(require_admin_or_super())
):
    """
    List users with filtering and pagination
    """
    try:
        # Determine which tenants the user can access
        accessible_tenants = []
        
        if current_user['role'] == UserRole.SUPER_ADMIN.value:
            # Super admin can access all tenants
            if tenant_id:
                accessible_tenants = [tenant_id]
            else:
                # Get all tenants (for now, we'll limit to known patterns)
                accessible_tenants = [
                    'platform', 'donor-network', 'participant-network'
                ]
                # TODO: Add logic to get all shelter tenants
        else:
            # Regular admin can only access their own tenant
            accessible_tenants = [current_user['tenant_id']]
        
        users_list = []
        
        for tenant in accessible_tenants:
            collection_path = f"tenants/{tenant}/users"
            query = firebase_service.db.collection(collection_path)
            
            # Apply role filter if specified
            if role:
                query = query.where('role', '==', role.value)
            
            # Get users
            docs = query.stream()
            
            for doc in docs:
                user_data = doc.to_dict()
                if user_data:
                    user_response = UserResponse(
                        uid=user_data.get('uid', doc.id),
                        email=user_data.get('email', ''),
                        first_name=user_data.get('first_name', ''),
                        last_name=user_data.get('last_name', ''),
                        display_name=user_data.get('display_name'),
                        role=UserRole(user_data.get('role', 'participant')),
                        tenant_id=user_data.get('tenant_id', tenant),
                        shelter_id=user_data.get('shelter_id'),
                        permissions=user_data.get('permissions', []),
                        email_verified=user_data.get('email_verified', False),
                        phone=user_data.get('phone'),
                        created_at=user_data.get('created_at', datetime.utcnow()),
                        last_login=user_data.get('last_login')
                    )
                    users_list.append(user_response)
        
        # Apply pagination
        total = len(users_list)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_users = users_list[start_idx:end_idx]
        
        return UserListResponse(
            users=paginated_users,
            total=total,
            page=page,
            per_page=per_page
        )
        
    except Exception as e:
        logger.error(f"Failed to list users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve users list"
        )

@router.delete(
    "/users/{user_id}",
    response_model=StandardResponse,
    summary="Delete user",
    description="Delete user account (Super Admin only)"
)
async def delete_user(
    user_id: str,
    current_user: dict = Depends(require_super_admin())
):
    """
    Delete user account (Super Admin only)
    """
    try:
        # Get user claims to determine tenant
        user_claims = await firebase_service.get_user_claims(user_id)
        tenant_id = user_claims.get('tenant_id')
        
        if tenant_id:
            # Delete user profile from Firestore
            collection_path = f"tenants/{tenant_id}/users"
            firebase_service.db.collection(collection_path).document(user_id).delete()
        
        # Delete Firebase user
        firebase_service.auth.delete_user(user_id)
        
        logger.info(f"User {user_id} deleted by {current_user['uid']}")
        
        return StandardResponse(
            success=True,
            message="User deleted successfully",
            data={"user_id": user_id}
        )
        
    except Exception as e:
        logger.error(f"Failed to delete user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user: {str(e)}"
        )

@router.get(
    "/orphaned-users",
    response_model=StandardResponse,
    summary="Find orphaned Firebase Auth users",
    description="Find users in Firebase Auth that don't have Firestore profiles (Super Admin only)"
)
async def find_orphaned_users(
    current_user: dict = Depends(require_super_admin())
):
    """
    Find orphaned Firebase Auth users (users without Firestore profiles)
    """
    try:
        # Get all Firebase Auth users
        auth_users = []
        page_token = None
        
        while True:
            result = firebase_service.auth.list_users(page_token=page_token)
            auth_users.extend(result.users)
            
            if not result.has_next_page:
                break
            page_token = result.next_page_token
        
        # Check which users don't have Firestore profiles
        orphaned_users = []
        
        for auth_user in auth_users:
            # Check if user has profile in any tenant
            has_profile = False
            
            # Check common tenant locations
            tenant_paths = [
                f"tenants/platform/users",
                f"tenants/donor-network/users", 
                f"tenants/participant-network/users",
                f"users"  # Legacy location
            ]
            
            for tenant_path in tenant_paths:
                try:
                    doc = firebase_service.db.collection(tenant_path).document(auth_user.uid).get()
                    if doc.exists:
                        has_profile = True
                        break
                except:
                    continue
            
            if not has_profile:
                orphaned_users.append({
                    "uid": auth_user.uid,
                    "email": auth_user.email,
                    "display_name": auth_user.display_name,
                    "email_verified": auth_user.email_verified,
                    "creation_timestamp": auth_user.user_metadata.creation_timestamp.isoformat() if auth_user.user_metadata.creation_timestamp else None,
                    "last_sign_in_timestamp": auth_user.user_metadata.last_sign_in_timestamp.isoformat() if auth_user.user_metadata.last_sign_in_timestamp else None,
                    "provider_data": [{"provider_id": p.provider_id, "email": p.email} for p in auth_user.provider_data]
                })
        
        logger.info(f"Found {len(orphaned_users)} orphaned Firebase Auth users")
        
        return StandardResponse(
            success=True,
            message=f"Found {len(orphaned_users)} orphaned users",
            data={
                "orphaned_users": orphaned_users,
                "total_auth_users": len(auth_users),
                "orphaned_count": len(orphaned_users)
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to find orphaned users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to find orphaned users: {str(e)}"
        )

@router.delete(
    "/orphaned-users/{user_email}",
    response_model=StandardResponse,
    summary="Delete orphaned Firebase Auth user",
    description="Delete a user from Firebase Auth by email (Super Admin only)"
)
async def delete_orphaned_user(
    user_email: str,
    current_user: dict = Depends(require_super_admin())
):
    """
    Delete orphaned Firebase Auth user by email
    """
    try:
        # Get user by email
        auth_user = firebase_service.auth.get_user_by_email(user_email)
        
        # Verify user is actually orphaned (no Firestore profile)
        has_profile = False
        tenant_paths = [
            f"tenants/platform/users",
            f"tenants/donor-network/users", 
            f"tenants/participant-network/users",
            f"users"  # Legacy location
        ]
        
        for tenant_path in tenant_paths:
            try:
                doc = firebase_service.db.collection(tenant_path).document(auth_user.uid).get()
                if doc.exists:
                    has_profile = True
                    break
            except:
                continue
        
        if has_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not orphaned - has Firestore profile"
            )
        
        # Delete from Firebase Auth
        firebase_service.auth.delete_user(auth_user.uid)
        
        logger.info(f"Orphaned user {user_email} (UID: {auth_user.uid}) deleted by {current_user['uid']}")
        
        return StandardResponse(
            success=True,
            message=f"Orphaned user {user_email} deleted successfully",
            data={
                "deleted_user": {
                    "uid": auth_user.uid,
                    "email": user_email
                }
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to delete orphaned user {user_email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete orphaned user: {str(e)}"
        )

@router.post(
    "/verify-token",
    response_model=StandardResponse,
    summary="Verify token",
    description="Verify Firebase ID token and return claims"
)
async def verify_token(current_user: dict = Depends(get_current_user)):
    """
    Verify Firebase ID token and return claims. Handle special case for super admin Google OAuth.
    """
    try:
        # Special handling for Joel's super admin account
        if current_user.get('email') == "joel.yaffe@gmail.com" and not current_user.get('role'):
            logger.info("🔐 Super admin detected without claims - setting super admin claims")
            
            # Set super admin claims
            custom_claims = {
                "role": "super_admin",
                "tenant_id": "platform",
                "permissions": [
                    "platform:manage",
                    "users:manage",
                    "shelters:manage",
                    "donations:manage",
                    "analytics:view",
                    "system:admin"
                ],
                "shelter_id": None,
                "created_by": "system",
                "title": "CTO and Developer",
                "organization": "Arcana Concept",
                "position": "Co-Founder"
            }
            
            # Set the claims using Firebase Admin SDK
            await firebase_service.set_custom_claims(current_user['uid'], custom_claims)
            logger.info(f"✅ Super admin claims set for UID: {current_user['uid']}")
            
            # Update current_user dict with new claims
            current_user.update(custom_claims)
            
            return StandardResponse(
                success=True,
                message="Super admin token verified and claims updated",
                data={
                    "user": current_user,
                    "token_valid": True,
                    "claims_updated": True
                }
            )
        
        return StandardResponse(
            success=True,
            message="Token is valid",
            data={
                "user": current_user,
                "token_valid": True
            }
        )
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token verification failed: {str(e)}"
        ) 