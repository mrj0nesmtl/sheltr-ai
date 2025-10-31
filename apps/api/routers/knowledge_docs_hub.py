"""
Docs Hub API Endpoints
Handles publishing knowledge base documents to the public documentation hub
"""

from typing import List
from fastapi import APIRouter, HTTPException, status
from datetime import datetime
import logging

from services.firebase_service import firebase_service
from models.docs_hub import (
    DocsHubCard,
    DocsHubDocument,
    PublishToHubRequest,
    generate_slug,
    extract_description,
    extract_audience_from_content,
    extract_topics_from_content,
    get_category_icon
)
from models.permissions import DocumentPermission

logger = logging.getLogger(__name__)

# Create sub-router for docs hub endpoints
router = APIRouter()


@router.get("/docs-hub", response_model=List[DocsHubCard])
async def get_docs_hub_documents():
    """
    Get all documents published to the public documentation hub
    
    Returns list of cards for the /docs page
    No authentication required (public endpoint)
    """
    try:
        db = firebase_service.db
        
        # Query for published public documents
        docs_query = db.collection('knowledge_documents') \
            .where('permission_level', '==', DocumentPermission.PUBLIC.value) \
            .where('published_to_hub', '==', True) \
            .stream()
        
        cards = []
        
        for doc_ref in docs_query:
            doc_data = doc_ref.to_dict()
            doc_id = doc_ref.id
            
            # Transform to hub card format
            card = DocsHubCard(
                id=doc_id,
                title=doc_data.get('title', 'Untitled'),
                description=doc_data.get('hub_description') or extract_description(doc_data.get('content', '')),
                category=doc_data.get('hub_category', 'core'),
                badge=doc_data.get('hub_badge', 'Technical'),
                link=f"/docs/{doc_data.get('hub_slug', generate_slug(doc_data.get('title', '')))}",
                github_link=f"https://github.com/mrj0nesmtl/sheltr-ai/blob/main/{doc_data.get('github_path', '')}" if doc_data.get('github_path') else None,
                updated=doc_data.get('updated_at', datetime.now()).strftime("%B %d, %Y") if isinstance(doc_data.get('updated_at'), datetime) else "Recently",
                audience=doc_data.get('hub_audience') or extract_audience_from_content(doc_data.get('content', '')),
                topics=doc_data.get('hub_topics') or extract_topics_from_content(doc_data.get('content', ''), doc_data.get('tags', [])),
                icon=doc_data.get('hub_icon') or get_category_icon(doc_data.get('category', 'Documentation')),
                order=doc_data.get('hub_order', 999)
            )
            
            cards.append(card)
        
        # Sort by order
        cards.sort(key=lambda x: x.order)
        
        logger.info(f"✅ Retrieved {len(cards)} published docs hub cards")
        return cards
        
    except Exception as e:
        logger.error(f"❌ Failed to get docs hub documents: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve docs hub documents: {str(e)}"
        )


@router.get("/docs-hub/{slug}", response_model=DocsHubDocument)
async def get_docs_hub_document_by_slug(slug: str):
    """
    Get a specific published document by its slug
    
    Used for individual document pages at /docs/[slug]
    No authentication required (public endpoint)
    """
    try:
        db = firebase_service.db
        
        # Query for document with this slug
        docs_query = db.collection('knowledge_documents') \
            .where('hub_slug', '==', slug) \
            .where('permission_level', '==', DocumentPermission.PUBLIC.value) \
            .where('published_to_hub', '==', True) \
            .limit(1) \
            .stream()
        
        doc_list = list(docs_query)
        
        if not doc_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document with slug '{slug}' not found or not published"
            )
        
        doc_ref = doc_list[0]
        doc_data = doc_ref.to_dict()
        doc_id = doc_ref.id
        
        # Increment view count
        try:
            current_count = doc_data.get('view_count', 0)
            db.collection('knowledge_documents').document(doc_id).update({
                'view_count': current_count + 1
            })
        except Exception as e:
            logger.warning(f"Failed to increment view count: {str(e)}")
        
        # Transform to full document
        document = DocsHubDocument(
            id=doc_id,
            title=doc_data.get('title', 'Untitled'),
            content=doc_data.get('content', ''),
            category=doc_data.get('hub_category', 'core'),
            badge=doc_data.get('hub_badge', 'Technical'),
            slug=slug,
            github_path=doc_data.get('github_path'),
            updated_at=doc_data.get('updated_at', datetime.now()),
            audience=doc_data.get('hub_audience') or extract_audience_from_content(doc_data.get('content', '')),
            topics=doc_data.get('hub_topics') or extract_topics_from_content(doc_data.get('content', ''), doc_data.get('tags', [])),
            view_count=doc_data.get('view_count', 0) + 1
        )
        
        logger.info(f"✅ Retrieved document '{slug}' for public viewing")
        return document
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to get document by slug: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve document: {str(e)}"
        )


@router.post("/{document_id}/publish-to-hub")
async def publish_document_to_hub(
    document_id: str,
    request: PublishToHubRequest
):
    """
    Publish or update a document's hub metadata
    
    This endpoint updates the hub-related fields for a document.
    Requires the document to have 'public' permission level.
    """
    try:
        db = firebase_service.db
        doc_ref = db.collection('knowledge_documents').document(document_id)
        
        # Get document
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document {document_id} not found"
            )
        
        doc_data = doc.to_dict()
        
        # DEBUG: Log all permission-related fields
        logger.info(f"🔍 PERMISSION DEBUG for document {document_id}:")
        logger.info(f"  permission_level: {doc_data.get('permission_level')}")
        logger.info(f"  access_level: {doc_data.get('access_level')}")
        logger.info(f"  sharing_level: {doc_data.get('sharing_level')}")
        logger.info(f"  confidentiality_level: {doc_data.get('confidentiality_level')}")
        logger.info(f"  is_private: {doc_data.get('is_private')}")
        logger.info(f"  All fields: {list(doc_data.keys())}")
        
        # Verify document is public (check multiple possible field names for backward compatibility)
        permission = doc_data.get('permission_level') or doc_data.get('access_level') or doc_data.get('sharing_level')
        confidentiality = doc_data.get('confidentiality_level')
        is_private = doc_data.get('is_private')
        
        # Check if document is public using any of the permission fields
        is_public = (
            permission == 'public' or 
            permission == DocumentPermission.PUBLIC.value or
            confidentiality == 'public' or
            is_private == False  # If explicitly marked as not private
        )
        
        if not is_public:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only public documents can be published to the docs hub. Current permission: {permission or confidentiality or 'not set'}, is_private: {is_private}. Please set permission level to 'public' in the Document Permissions section and save before publishing."
            )
        
        # Generate slug if not provided
        slug = request.hub_slug or generate_slug(doc_data.get('title', 'untitled'))
        
        # Check if slug is already in use (by a different document)
        if slug:
            existing_docs = db.collection('knowledge_documents') \
                .where('hub_slug', '==', slug) \
                .stream()
            
            for existing in existing_docs:
                if existing.id != document_id:
                    # Slug collision - append document ID
                    slug = f"{slug}-{document_id[:8]}"
                    break
        
        # Build update data
        update_data = {
            'published_to_hub': request.published_to_hub,
            'hub_category': request.hub_category,
            'hub_badge': request.hub_badge,
            'hub_order': request.hub_order,
            'hub_slug': slug,
            'hub_updated_at': datetime.now()
        }
        
        # Optional fields
        if request.hub_description:
            update_data['hub_description'] = request.hub_description
        if request.hub_audience:
            update_data['hub_audience'] = request.hub_audience
        if request.hub_topics:
            update_data['hub_topics'] = request.hub_topics
        if request.hub_icon:
            update_data['hub_icon'] = request.hub_icon
        
        # Update document
        doc_ref.update(update_data)
        
        action = "published to" if request.published_to_hub else "unpublished from"
        logger.info(f"✅ Document '{doc_data.get('title')}' {action} docs hub")
        
        return {
            "success": True,
            "message": f"Document {action} docs hub successfully",
            "data": {
                "document_id": document_id,
                "slug": slug,
                "published": request.published_to_hub,
                "link": f"/docs/{slug}" if request.published_to_hub else None
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to publish document to hub: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to publish document: {str(e)}"
        )


@router.get("/docs-hub/check-slug/{slug}")
async def check_slug_availability(slug: str):
    """
    Check if a slug is available
    Returns true if available, false if already in use
    """
    try:
        db = firebase_service.db
        
        docs = db.collection('knowledge_documents') \
            .where('hub_slug', '==', slug) \
            .limit(1) \
            .stream()
        
        in_use = len(list(docs)) > 0
        
        return {
            "success": True,
            "slug": slug,
            "available": not in_use,
            "message": "Slug is available" if not in_use else "Slug is already in use"
        }
        
    except Exception as e:
        logger.error(f"Failed to check slug availability: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check slug: {str(e)}"
        )

