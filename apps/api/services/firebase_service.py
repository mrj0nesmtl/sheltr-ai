"""
Firebase Admin Service for SHELTR-AI
Handles authentication, custom claims, and Firestore operations
"""

import os
import json
import time
from typing import Dict, Any, Optional, List
import firebase_admin
from firebase_admin import credentials, auth, firestore
from pydantic import BaseModel
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class UserRole(str, Enum):
    """User roles for RBAC system"""
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    PARTICIPANT = "participant"
    DONOR = "donor"

class CustomClaims(BaseModel):
    """Custom claims structure for Firebase Auth"""
    role: UserRole
    tenant_id: str
    permissions: List[str]
    shelter_id: Optional[str] = None

class FirebaseService:
    """Firebase Admin SDK service for backend operations"""
    
    def __init__(self):
        """Initialize Firebase Admin SDK with improved error handling"""
        if not firebase_admin._apps:
            # Try to load from service account file first
            service_account_path = "service-account-key.json"
            
            if os.path.exists(service_account_path):
                try:
                    # Load and validate service account key
                    with open(service_account_path, 'r') as f:
                        service_account_data = json.load(f)
                    
                    # Fix common private key formatting issues
                    if 'private_key' in service_account_data:
                        private_key = service_account_data['private_key']
                        
                        # Fix double-escaped newlines
                        if '\\\\n' in private_key:
                            private_key = private_key.replace('\\\\n', '\\n')
                            service_account_data['private_key'] = private_key
                            logger.info("Fixed double-escaped newlines in private key")
                        
                        # Ensure proper formatting
                        if not private_key.endswith('\\n-----END PRIVATE KEY-----'):
                            if not private_key.endswith('-----END PRIVATE KEY-----'):
                                private_key += '\\n-----END PRIVATE KEY-----'
                                service_account_data['private_key'] = private_key
                                logger.info("Added missing END marker to private key")
                    
                    cred = credentials.Certificate(service_account_data)
                    
                    # Initialize with storage bucket
                    storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET", "sheltr-ai.firebasestorage.app")
                    firebase_admin.initialize_app(cred, {
                        'storageBucket': storage_bucket
                    })
                    logger.info(f"✅ Firebase initialized successfully with service account file and storage bucket: {storage_bucket}")
                    
                except Exception as e:
                    logger.error(f"❌ Failed to initialize Firebase with service account file: {e}")
                    raise Exception(f"Firebase service account initialization failed: {str(e)}")
            else:
                # Fall back to environment variables
                service_account_info = {
                    "type": "service_account",
                    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                    "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace('\\n', '\n'),
                    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
                    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
                }
                
                if all(service_account_info.values()):
                    try:
                        cred = credentials.Certificate(service_account_info)
                        
                        # Initialize with storage bucket
                        storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET", "sheltr-ai.firebasestorage.app")
                        firebase_admin.initialize_app(cred, {
                            'storageBucket': storage_bucket
                        })
                        logger.info(f"✅ Firebase initialized successfully with environment variables and storage bucket: {storage_bucket}")
                    except Exception as e:
                        logger.error(f"❌ Failed to initialize Firebase with environment variables: {e}")
                        raise Exception(f"Firebase environment initialization failed: {str(e)}")
                else:
                    # Try Application Default Credentials (for Cloud Run)
                    try:
                        # Use default credentials when running on Google Cloud
                        storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET", "sheltr-ai.firebasestorage.app")
                        firebase_admin.initialize_app(options={
                            'storageBucket': storage_bucket
                        })
                        logger.info(f"✅ Firebase initialized with Application Default Credentials and storage bucket: {storage_bucket}")
                    except Exception as e:
                        logger.error(f"❌ Failed to initialize Firebase with default credentials: {e}")
                        raise Exception("Firebase credentials not found. Please set up service account key.")
        
        self.auth = auth
        self.db = firestore.client()
        logger.info("🔥 Firebase service ready")
    
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify Firebase ID token and return decoded claims
        
        Args:
            token: Firebase ID token
            
        Returns:
            Decoded token with custom claims
            
        Raises:
            auth.InvalidIdTokenError: If token is invalid
        """
        try:
            decoded_token = self.auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            raise auth.InvalidIdTokenError(f"Invalid token: {str(e)}")
    
    async def set_custom_claims(self, uid: str, claims: CustomClaims) -> None:
        """
        Set custom claims for a user
        
        Args:
            uid: User ID
            claims: Custom claims to set
        """
        claims_dict = {
            "role": claims.role.value,
            "tenant_id": claims.tenant_id,
            "permissions": claims.permissions
        }
        
        if claims.shelter_id:
            claims_dict["shelter_id"] = claims.shelter_id
        
        self.auth.set_custom_user_claims(uid, claims_dict)
    
    async def get_user_claims(self, uid: str) -> Dict[str, Any]:
        """
        Get custom claims for a user
        
        Args:
            uid: User ID
            
        Returns:
            User's custom claims
        """
        user = self.auth.get_user(uid)
        return user.custom_claims or {}
    
    async def create_user(self, email: str, password: str, display_name: str = None) -> auth.UserRecord:
        """
        Create a new Firebase user
        
        Args:
            email: User email
            password: User password
            display_name: User display name
            
        Returns:
            Created user record
        """
        user_data = {
            "email": email,
            "password": password,
            "email_verified": False
        }
        
        if display_name:
            user_data["display_name"] = display_name
        
        return self.auth.create_user(**user_data)
    
    async def update_user_role(self, uid: str, new_role: UserRole, tenant_id: str, permissions: List[str]) -> None:
        """
        Update user role and permissions
        
        Args:
            uid: User ID
            new_role: New role to assign
            tenant_id: Tenant ID for multi-tenant isolation
            permissions: List of permissions for the role
        """
        claims = CustomClaims(
            role=new_role,
            tenant_id=tenant_id,
            permissions=permissions
        )
        
        await self.set_custom_claims(uid, claims)
    
    def get_role_permissions(self, role: UserRole) -> List[str]:
        """
        Get permissions for a specific role
        
        Args:
            role: User role
            
        Returns:
            List of permissions for the role
        """
        permissions_map = {
            UserRole.SUPER_ADMIN: [
                "system:read", "system:write", "users:manage", 
                "analytics:view", "security:monitor", "tenants:manage",
                "shelters:create", "shelters:assign_admin", "participants:verify_global"
            ],
            UserRole.ADMIN: [
                "shelter:manage", "participants:create", "participants:manage", 
                "participants:onboard", "resources:manage", "analytics:view", 
                "documents:upload", "qr:generate"
            ],
            UserRole.PARTICIPANT: [
                "profile:read", "profile:write", "services:access",
                "qr:generate", "donations:view"
            ],
            UserRole.DONOR: [
                "donations:create", "profile:read", "profile:write",
                "impact:view", "history:view"
            ]
        }
        
        return permissions_map.get(role, [])
    
    def get_tenant_id_for_role(self, role: UserRole, shelter_id: Optional[str] = None) -> str:
        """
        Get appropriate tenant ID based on role
        
        Args:
            role: User role
            shelter_id: Shelter ID for admin/participant roles
            
        Returns:
            Tenant ID for multi-tenant isolation
        """
        if role == UserRole.SUPER_ADMIN:
            return "platform"
        elif role == UserRole.ADMIN:
            return f"shelter-{shelter_id}" if shelter_id else "platform"
        elif role == UserRole.PARTICIPANT:
            return f"shelter-{shelter_id}" if shelter_id else "participant-network"
        elif role == UserRole.DONOR:
            return "donor-network"
        else:
            return "platform"
    
    async def create_user_profile(self, uid: str, user_data: Dict[str, Any], tenant_id: str) -> None:
        """
        Create user profile in Firestore with tenant isolation
        
        Args:
            uid: User ID
            user_data: User profile data
            tenant_id: Tenant ID for data isolation
        """
        # Add metadata
        user_data.update({
            "uid": uid,
            "created_at": firestore.SERVER_TIMESTAMP,
            "last_login": None,
            "tenant_id": tenant_id
        })
        
        # Store in tenant-specific collection
        collection_path = f"tenants/{tenant_id}/users"
        self.db.collection(collection_path).document(uid).set(user_data)
    
    async def get_user_profile(self, uid: str, tenant_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user profile from Firestore
        
        Args:
            uid: User ID
            tenant_id: Tenant ID
            
        Returns:
            User profile data or None if not found
        """
        collection_path = f"tenants/{tenant_id}/users"
        doc = self.db.collection(collection_path).document(uid).get()
        
        if doc.exists:
            return doc.to_dict()
        return None

# Singleton instance
firebase_service = FirebaseService() 