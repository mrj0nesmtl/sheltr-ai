"""
Admin Router for SHELTR-AI API
Handles user management for Leadership, Platform Admins, and Qualified Investors
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
import secrets
import string

from middleware.auth_middleware import get_current_user
from services.firebase_service import firebase_service
from firebase_admin import auth

router = APIRouter(prefix="/admin", tags=["admin"])

# ==================== Utility Functions ====================

def generate_secure_password(length: int = 12) -> str:
    """
    Generate a secure random password
    Format: 10 random chars + 'Temp!' suffix
    Example: 47DfYcXDTemp!
    """
    # Use secrets for cryptographically strong random generation
    chars = string.ascii_letters + string.digits
    random_part = ''.join(secrets.choice(chars) for _ in range(10))
    return f"{random_part}Temp!"

def check_admin_permissions(current_user: Dict[str, Any]) -> None:
    """
    Verify user has admin permissions (super_admin or leadership)
    """
    user_role = current_user.get('role')
    if user_role not in ['super_admin', 'leadership']:
        raise HTTPException(
            status_code=403,
            detail="Access denied. Only Super Admins and Leadership can perform this action."
        )

# ==================== Pydantic Models ====================

class InvestorMetadata(BaseModel):
    """Metadata for qualified investor"""
    # Contact Information
    email: EmailStr
    phone: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    
    # Investment Details
    company: Optional[str] = None
    investment_range: Optional[str] = None  # e.g., "$1M - $5M"
    check_size: Optional[str] = None
    accreditation_status: str = "pending"  # verified, pending, not_verified
    
    # Location & Context
    location: Optional[str] = None
    source: Optional[str] = None  # linkedin, referral, direct, event, other
    referral_source: Optional[str] = None
    
    # Access & Notes
    dataroom_access_level: str = "full"  # full, limited
    notes: Optional[str] = None
    initial_contact_date: Optional[str] = None

class CreateQualifiedInvestorRequest(BaseModel):
    """Request model for creating a qualified investor"""
    display_name: str
    email: EmailStr
    metadata: InvestorMetadata

class QualifiedInvestorResponse(BaseModel):
    """Response model after creating investor"""
    uid: str
    email: str
    display_name: str
    generated_password: str  # Only returned on creation
    metadata: Dict[str, Any]
    status: str

class InvestorListItem(BaseModel):
    """Model for investor list item"""
    uid: str
    email: str
    display_name: str
    company: Optional[str]
    investment_range: Optional[str]
    accreditation_status: str
    access_level: str
    created_at: str
    status: str

class UpdateInvestorRequest(BaseModel):
    """Request model for updating investor"""
    metadata: Optional[InvestorMetadata] = None
    status: Optional[str] = None  # active, inactive

# ==================== Qualified Investor Endpoints ====================

@router.post("/qualified-investors", response_model=QualifiedInvestorResponse)
async def create_qualified_investor(
    request: CreateQualifiedInvestorRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create a new qualified investor account
    
    Permissions: super_admin, leadership
    
    Returns the generated password (displayed once)
    """
    try:
        # Check permissions
        check_admin_permissions(current_user)
        
        # Generate secure password
        generated_password = generate_secure_password()
        
        # Create Firebase Auth user
        try:
            user_record = auth.create_user(
                email=request.email,
                password=generated_password,
                display_name=request.display_name,
                email_verified=True  # Pre-verified by admin
            )
        except auth.EmailAlreadyExistsError:
            raise HTTPException(
                status_code=400,
                detail=f"User with email {request.email} already exists"
            )
        
        # Set custom claims for role
        auth.set_custom_user_claims(user_record.uid, {
            'role': 'qualified_investor'
        })
        
        # Prepare Firestore document
        investor_doc = {
            'uid': user_record.uid,
            'email': request.email,
            'displayName': request.display_name,
            'role': 'qualified_investor',
            'status': 'active',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'created_by': current_user.get('uid'),
            
            # Investor metadata
            'investor_metadata': {
                **request.metadata.dict(),
                'access_granted_date': datetime.utcnow().isoformat(),
                'initial_contact_date': request.metadata.initial_contact_date or datetime.utcnow().isoformat()
            }
        }
        
        # Save to Firestore
        firebase_service.db.collection('users').document(user_record.uid).set(investor_doc)
        
        # Log admin action
        firebase_service.db.collection('audit_logs').add({
            'action': 'create_qualified_investor',
            'actor_uid': current_user.get('uid'),
            'actor_email': current_user.get('email'),
            'target_uid': user_record.uid,
            'target_email': request.email,
            'timestamp': datetime.utcnow().isoformat(),
            'details': {
                'display_name': request.display_name,
                'company': request.metadata.company,
                'investment_range': request.metadata.investment_range
            }
        })
        
        return QualifiedInvestorResponse(
            uid=user_record.uid,
            email=request.email,
            display_name=request.display_name,
            generated_password=generated_password,  # Return password ONCE
            metadata=investor_doc['investor_metadata'],
            status='active'
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create qualified investor: {str(e)}"
        )

@router.get("/qualified-investors", response_model=List[InvestorListItem])
async def list_qualified_investors(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    List all qualified investors
    
    Permissions: super_admin, leadership, platform_admin
    """
    try:
        # Check permissions (allow platform_admin to view)
        user_role = current_user.get('role')
        if user_role not in ['super_admin', 'leadership', 'platform_admin']:
            raise HTTPException(
                status_code=403,
                detail="Access denied. Insufficient permissions."
            )
        
        # Query Firestore for qualified investors
        investors_ref = firebase_service.db.collection('users').where('role', '==', 'qualified_investor')
        investors = investors_ref.stream()
        
        result = []
        for doc in investors:
            data = doc.to_dict()
            metadata = data.get('investor_metadata', {})
            
            result.append(InvestorListItem(
                uid=data.get('uid'),
                email=data.get('email'),
                display_name=data.get('displayName', ''),
                company=metadata.get('company'),
                investment_range=metadata.get('investment_range'),
                accreditation_status=metadata.get('accreditation_status', 'pending'),
                access_level=metadata.get('dataroom_access_level', 'full'),
                created_at=data.get('created_at', ''),
                status=data.get('status', 'active')
            ))
        
        # Sort by created_at (newest first)
        result.sort(key=lambda x: x.created_at, reverse=True)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list qualified investors: {str(e)}"
        )

@router.patch("/qualified-investors/{uid}")
async def update_qualified_investor(
    uid: str,
    request: UpdateInvestorRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update qualified investor details
    
    Permissions: super_admin, leadership
    """
    try:
        # Check permissions
        check_admin_permissions(current_user)
        
        # Get existing investor
        investor_ref = firebase_service.db.collection('users').document(uid)
        investor_doc = investor_ref.get()
        
        if not investor_doc.exists:
            raise HTTPException(status_code=404, detail="Investor not found")
        
        investor_data = investor_doc.to_dict()
        if investor_data.get('role') != 'qualified_investor':
            raise HTTPException(status_code=400, detail="User is not a qualified investor")
        
        # Prepare update data
        update_data = {
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if request.metadata:
            existing_metadata = investor_data.get('investor_metadata', {})
            existing_metadata.update(request.metadata.dict(exclude_unset=True))
            update_data['investor_metadata'] = existing_metadata
        
        if request.status:
            update_data['status'] = request.status
        
        # Update Firestore
        investor_ref.update(update_data)
        
        # Log admin action
        firebase_service.db.collection('audit_logs').add({
            'action': 'update_qualified_investor',
            'actor_uid': current_user.get('uid'),
            'actor_email': current_user.get('email'),
            'target_uid': uid,
            'timestamp': datetime.utcnow().isoformat(),
            'changes': update_data
        })
        
        return {"success": True, "message": "Investor updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update qualified investor: {str(e)}"
        )

@router.delete("/qualified-investors/{uid}")
async def deactivate_qualified_investor(
    uid: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Deactivate (soft delete) a qualified investor
    
    Permissions: super_admin, leadership
    """
    try:
        # Check permissions
        check_admin_permissions(current_user)
        
        # Get existing investor
        investor_ref = firebase_service.db.collection('users').document(uid)
        investor_doc = investor_ref.get()
        
        if not investor_doc.exists:
            raise HTTPException(status_code=404, detail="Investor not found")
        
        investor_data = investor_doc.to_dict()
        if investor_data.get('role') != 'qualified_investor':
            raise HTTPException(status_code=400, detail="User is not a qualified investor")
        
        # Disable Firebase Auth account
        auth.update_user(uid, disabled=True)
        
        # Update Firestore status
        investor_ref.update({
            'status': 'inactive',
            'deactivated_at': datetime.utcnow().isoformat(),
            'deactivated_by': current_user.get('uid'),
            'updated_at': datetime.utcnow().isoformat()
        })
        
        # Log admin action
        firebase_service.db.collection('audit_logs').add({
            'action': 'deactivate_qualified_investor',
            'actor_uid': current_user.get('uid'),
            'actor_email': current_user.get('email'),
            'target_uid': uid,
            'target_email': investor_data.get('email'),
            'timestamp': datetime.utcnow().isoformat()
        })
        
        return {"success": True, "message": "Investor deactivated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to deactivate qualified investor: {str(e)}"
        )

