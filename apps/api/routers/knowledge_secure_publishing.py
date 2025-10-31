"""
API endpoints for secure document publishing to Founders Portal and Investor Relations.

Access Control:
- Founders Portal: super_admin and platform_admin
- Investor Relations: super_admin, platform_admin, and investor
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
import logging

from services.firebase_service import FirebaseService
from models.secure_publishing import (
    SecurePublishingSettings,
    PublishToFoundersRequest,
    PublishToIRRequest,
    SecureDocumentCard,
    SecureDocumentFull,
    generate_secure_slug,
    BADGE_PRESETS
)
from middleware.auth_middleware import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize Firebase
firebase_service = FirebaseService()
db = firebase_service.db


# ====================
# ACCESS CONTROL
# ====================

def require_founders_access(user: dict = Depends(get_current_user)) -> dict:
    """Require super_admin or platform_admin role for Founders Portal."""
    if user.get('role') not in ['super_admin', 'platform_admin']:
        raise HTTPException(
            status_code=403,
            detail="Access denied: Founders Portal access requires super_admin or platform_admin role"
        )
    return user


def require_ir_access(user: dict = Depends(get_current_user)) -> dict:
    """Require investor, super_admin, or platform_admin role for Investor Relations."""
    if user.get('role') not in ['investor', 'super_admin', 'platform_admin']:
        raise HTTPException(
            status_code=403,
            detail="Access denied: Investor Relations access requires investor, super_admin, or platform_admin role"
        )
    return user


# ====================
# FOUNDERS PORTAL ENDPOINTS
# ====================

@router.get("/founders-portal", response_model=List[SecureDocumentCard])
async def get_founders_portal_documents(
    user: dict = Depends(require_founders_access)
):
    """
    Get all documents published to Founders Portal.
    
    Access: super_admin, platform_admin
    """
    try:
        logger.info(f"📚 Fetching Founders Portal documents for user: {user.get('email')}")
        
        # Query knowledge_documents where published_to_founders = true
        docs_ref = db.collection('knowledge_documents')
        query = docs_ref.where('published_to_founders', '==', True)
        
        docs = query.stream()
        documents = []
        
        for doc in docs:
            data = doc.to_dict()
            documents.append(SecureDocumentCard(
                id=doc.id,
                title=data.get('title', 'Untitled'),
                description=data.get('founders_description') or data.get('description', ''),
                secure_slug=data.get('secure_slug', generate_secure_slug(data.get('title', ''))),
                badge=data.get('secure_badge', 'Secure'),
                badge_color=data.get('secure_badge_color', 'red'),
                icon=data.get('secure_icon', 'FileText'),
                category=data.get('category', 'Uncategorized'),
                updated_at=data.get('updated_at', datetime.now()),
                word_count=data.get('word_count'),
                permission_level=data.get('permission_level', 'private'),
                visibility_scope=data.get('visibility_scope', 'organization')
            ))
        
        logger.info(f"✅ Found {len(documents)} Founders Portal documents")
        return documents
        
    except Exception as e:
        logger.error(f"❌ Error fetching Founders Portal documents: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch documents: {str(e)}")


@router.post("/founders-portal/{document_id}/publish")
async def publish_to_founders(
    document_id: str,
    request: PublishToFoundersRequest,
    user: dict = Depends(require_founders_access)
):
    """
    Publish or unpublish a document to Founders Portal.
    
    Access: super_admin, platform_admin
    """
    try:
        logger.info(f"{'📤 Publishing' if request.published else '📥 Unpublishing'} document {document_id} to Founders Portal")
        
        # Get document
        doc_ref = db.collection('knowledge_documents').document(document_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")
        
        doc_data = doc.to_dict()
        
        # Verify document is not public (secure documents only)
        permission = doc_data.get('permission_level', 'public')
        if permission == 'public':
            raise HTTPException(
                status_code=400,
                detail="Public documents cannot be published to Founders Portal. Please set a secure permission level (founders, platform_admin, super_admin, etc.) first."
            )
        
        # Build update data
        updates = {
            'published_to_founders': request.published,
            'updated_at': datetime.now()
        }
        
        # If publishing, add/update secure settings
        if request.published and request.settings:
            updates.update({
                'secure_slug': request.settings.secure_slug,
                'secure_badge': request.settings.secure_badge or 'Secure',
                'secure_badge_color': request.settings.secure_badge_color or 'red',
                'secure_icon': request.settings.secure_icon or 'FileText',
                'founders_description': request.settings.founders_description,
                'source_directory': request.settings.source_directory,
                'visibility_scope': 'organization'
            })
            
            # Check for slug uniqueness
            if not await check_slug_available(request.settings.secure_slug, document_id):
                raise HTTPException(
                    status_code=400,
                    detail=f"Slug '{request.settings.secure_slug}' is already in use"
                )
        
        # Update document
        doc_ref.update(updates)
        
        logger.info(f"✅ Document {document_id} {'published to' if request.published else 'unpublished from'} Founders Portal")
        
        return {
            "success": True,
            "message": f"Document {'published to' if request.published else 'unpublished from'} Founders Portal",
            "document_id": document_id,
            "published": request.published
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error publishing to Founders Portal: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to publish: {str(e)}")


# ====================
# INVESTOR RELATIONS ENDPOINTS
# ====================

@router.get("/investor-relations", response_model=List[SecureDocumentCard])
async def get_ir_documents(
    user: dict = Depends(require_ir_access)
):
    """
    Get all documents published to Investor Relations.
    
    Access: investor, super_admin, platform_admin
    """
    try:
        logger.info(f"💼 Fetching Investor Relations documents for user: {user.get('email')}")
        
        # Query knowledge_documents where published_to_ir = true
        docs_ref = db.collection('knowledge_documents')
        query = docs_ref.where('published_to_ir', '==', True)
        
        docs = query.stream()
        documents = []
        
        for doc in docs:
            data = doc.to_dict()
            documents.append(SecureDocumentCard(
                id=doc.id,
                title=data.get('title', 'Untitled'),
                description=data.get('ir_description') or data.get('description', ''),
                secure_slug=data.get('secure_slug', generate_secure_slug(data.get('title', ''))),
                badge=data.get('secure_badge', 'Pre-Seed'),
                badge_color=data.get('secure_badge_color', 'purple'),
                icon=data.get('secure_icon', 'TrendingUp'),
                category=data.get('category', 'Investment'),
                updated_at=data.get('updated_at', datetime.now()),
                word_count=data.get('word_count'),
                permission_level=data.get('permission_level', 'private'),
                visibility_scope=data.get('visibility_scope', 'organization')
            ))
        
        logger.info(f"✅ Found {len(documents)} Investor Relations documents")
        return documents
        
    except Exception as e:
        logger.error(f"❌ Error fetching IR documents: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch documents: {str(e)}")


@router.post("/investor-relations/{document_id}/publish")
async def publish_to_ir(
    document_id: str,
    request: PublishToIRRequest,
    user: dict = Depends(require_founders_access)  # Only admins can publish to IR
):
    """
    Publish or unpublish a document to Investor Relations.
    
    Access: super_admin, platform_admin (only admins can publish)
    """
    try:
        logger.info(f"{'📤 Publishing' if request.published else '📥 Unpublishing'} document {document_id} to Investor Relations")
        
        # Get document
        doc_ref = db.collection('knowledge_documents').document(document_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")
        
        doc_data = doc.to_dict()
        
        # Verify document is not public (secure documents only)
        permission = doc_data.get('permission_level', 'public')
        if permission == 'public':
            raise HTTPException(
                status_code=400,
                detail="Public documents cannot be published to Investor Relations. Please set a secure permission level (founders, platform_admin, super_admin, etc.) first."
            )
        
        # Build update data
        updates = {
            'published_to_ir': request.published,
            'updated_at': datetime.now()
        }
        
        # If publishing, add/update secure settings
        if request.published and request.settings:
            updates.update({
                'secure_slug': request.settings.secure_slug,
                'secure_badge': request.settings.secure_badge or 'Pre-Seed',
                'secure_badge_color': request.settings.secure_badge_color or 'purple',
                'secure_icon': request.settings.secure_icon or 'TrendingUp',
                'ir_description': request.settings.ir_description,
                'source_directory': request.settings.source_directory,
                'visibility_scope': 'organization'
            })
            
            # Check for slug uniqueness
            if not await check_slug_available(request.settings.secure_slug, document_id):
                raise HTTPException(
                    status_code=400,
                    detail=f"Slug '{request.settings.secure_slug}' is already in use"
                )
        
        # Update document
        doc_ref.update(updates)
        
        logger.info(f"✅ Document {document_id} {'published to' if request.published else 'unpublished from'} Investor Relations")
        
        return {
            "success": True,
            "message": f"Document {'published to' if request.published else 'unpublished from'} Investor Relations",
            "document_id": document_id,
            "published": request.published
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error publishing to Investor Relations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to publish: {str(e)}")


# ====================
# SECURE DOCUMENT VIEWER ENDPOINTS
# ====================

@router.get("/secure/{slug}", response_model=SecureDocumentFull)
async def get_secure_document_by_slug(
    slug: str,
    user: dict = Depends(get_current_user)
):
    """
    Get a secure document by its slug.
    
    Access control is enforced based on published_to_founders and published_to_ir fields.
    """
    try:
        logger.info(f"🔍 Fetching secure document by slug: {slug}")
        
        # Query by secure_slug
        docs_ref = db.collection('knowledge_documents')
        query = docs_ref.where('secure_slug', '==', slug).limit(1)
        docs = list(query.stream())
        
        if not docs:
            raise HTTPException(status_code=404, detail="Document not found")
        
        doc = docs[0]
        data = doc.to_dict()
        
        # Access control check
        user_role = user.get('role')
        published_to_founders = data.get('published_to_founders', False)
        published_to_ir = data.get('published_to_ir', False)
        
        # Check access based on role and publishing status
        has_access = False
        
        if user_role in ['super_admin', 'platform_admin']:
            # Admins can access all secure docs
            has_access = True
        elif user_role == 'investor':
            # Investors can only access IR docs
            has_access = published_to_ir
        else:
            # Other roles have no access to secure docs
            has_access = False
        
        if not has_access:
            raise HTTPException(
                status_code=403,
                detail="Access denied: You do not have permission to view this document"
            )
        
        # Return full document
        return SecureDocumentFull(
            id=doc.id,
            title=data.get('title', 'Untitled'),
            content=data.get('content', ''),
            secure_slug=data.get('secure_slug', slug),
            description=data.get('description', ''),
            category=data.get('category', 'Uncategorized'),
            tags=data.get('tags', []),
            published_to_founders=published_to_founders,
            published_to_ir=published_to_ir,
            badge=data.get('secure_badge', 'Secure'),
            badge_color=data.get('secure_badge_color', 'red'),
            icon=data.get('secure_icon', 'FileText'),
            created_at=data.get('created_at', datetime.now()),
            updated_at=data.get('updated_at', datetime.now()),
            synced_at=data.get('synced_at'),
            permission_level=data.get('permission_level', 'private'),
            visibility_scope=data.get('visibility_scope', 'organization'),
            word_count=data.get('word_count'),
            view_count=data.get('view_count', 0)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching secure document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch document: {str(e)}")


# ====================
# UTILITY ENDPOINTS
# ====================

@router.get("/check-secure-slug/{slug}")
async def check_secure_slug_availability(
    slug: str,
    exclude_id: Optional[str] = None,
    user: dict = Depends(require_founders_access)
):
    """
    Check if a secure slug is available.
    
    Args:
        slug: The slug to check
        exclude_id: Optional document ID to exclude from the check (for updates)
    """
    try:
        is_available = await check_slug_available(slug, exclude_id)
        
        return {
            "slug": slug,
            "available": is_available,
            "message": "Slug is available" if is_available else "Slug is already in use"
        }
        
    except Exception as e:
        logger.error(f"❌ Error checking slug availability: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to check slug: {str(e)}")


@router.get("/badge-presets")
async def get_badge_presets(user: dict = Depends(require_founders_access)):
    """Get available badge presets for UI selection."""
    return {"presets": BADGE_PRESETS}


# ====================
# HELPER FUNCTIONS
# ====================

async def check_slug_available(slug: str, exclude_id: Optional[str] = None) -> bool:
    """Check if a secure slug is available (not already in use)."""
    docs_ref = db.collection('knowledge_documents')
    query = docs_ref.where('secure_slug', '==', slug)
    
    docs = list(query.stream())
    
    # If no documents found, slug is available
    if not docs:
        return True
    
    # If exclude_id provided and the only match is that document, slug is available
    if exclude_id and len(docs) == 1 and docs[0].id == exclude_id:
        return True
    
    # Otherwise, slug is taken
    return False

