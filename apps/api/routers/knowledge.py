"""
Knowledge Base API Routes for SHELTR-AI
Provides document management, search, and RAG capabilities
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from datetime import datetime
import logging

from services.knowledge_service import knowledge_service
from middleware.auth_middleware import get_current_user, require_admin_or_super

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])
security = HTTPBearer()

# Request/Response Models
class DocumentUploadRequest(BaseModel):
    """Document upload request model"""
    title: Optional[str] = None
    description: Optional[str] = None
    access_level: str = 'public'
    categories: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    shelter_id: Optional[str] = None

class SearchRequest(BaseModel):
    """Knowledge search request model"""
    query: str
    categories: Optional[List[str]] = None
    limit: int = 5

class KnowledgeResponse(BaseModel):
    """Standard knowledge response model"""
    success: bool
    data: Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    timestamp: str

class DocumentResponse(BaseModel):
    """Document response model"""
    success: bool
    document_id: Optional[str] = None
    title: Optional[str] = None
    message: Optional[str] = None
    timestamp: str

class SearchResponse(BaseModel):
    """Search response model"""
    success: bool
    query: str
    results: List[Dict[str, Any]]
    total_found: int
    search_time_seconds: float
    timestamp: str

# Knowledge Search Endpoints

@router.post(
    "/search",
    response_model=SearchResponse,
    summary="Search knowledge base",
    description="Perform semantic search across SHELTR knowledge base with role-based access"
)
async def search_knowledge(
    search_request: SearchRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Search the SHELTR knowledge base using semantic search.
    Returns relevant documents and chunks based on user role and access permissions.
    """
    try:
        user_role = current_user.get('role', 'participant')
        shelter_id = current_user.get('shelter_id')
        
        logger.info(f"Knowledge search by {user_role}: '{search_request.query}'")
        
        # Perform search
        search_results = await knowledge_service.search_knowledge(
            query=search_request.query,
            user_role=user_role,
            categories=search_request.categories,
            shelter_id=shelter_id,
            limit=search_request.limit
        )
        
        return SearchResponse(
            success=True,
            query=search_request.query,
            results=search_results.get('results', []),
            total_found=search_results.get('total_found', 0),
            search_time_seconds=search_results.get('search_time_seconds', 0),
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Knowledge search failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )

@router.get(
    "/search/{query}",
    response_model=SearchResponse,
    summary="Quick knowledge search",
    description="Quick GET-based search for simple queries"
)
async def quick_search(
    query: str,
    categories: Optional[str] = Query(None, description="Comma-separated categories"),
    limit: int = Query(5, description="Maximum results to return"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Quick search endpoint for simple queries"""
    try:
        category_list = categories.split(',') if categories else None
        
        search_request = SearchRequest(
            query=query,
            categories=category_list,
            limit=limit
        )
        
        return await search_knowledge(search_request, current_user)
        
    except Exception as e:
        logger.error(f"Quick search failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Quick search failed: {str(e)}"
        )

# Document Management Endpoints

@router.post(
    "/upload",
    response_model=DocumentResponse,
    summary="Upload document to knowledge base",
    description="Upload and process a document for the knowledge base (Admin/Super Admin only)"
)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    access_level: str = Form('public'),
    categories: str = Form(''),
    tags: str = Form(''),
    shelter_id: Optional[str] = Form(None),
    current_user: Dict[str, Any] = Depends(require_admin_or_super())
):
    """
    Upload a new document to the knowledge base.
    Supports PDF, DOCX, TXT, and Markdown files.
    """
    try:
        user_id = current_user.get('uid')
        user_role = current_user.get('role')
        
        logger.info(f"Document upload by {user_role} user {user_id}: {file.filename}")
        
        # Validate file type
        allowed_types = {'.pdf', '.docx', '.doc', '.txt', '.md', '.html'}
        file_extension = '.' + file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        
        if file_extension not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type: {file_extension}. Allowed: {', '.join(allowed_types)}"
            )
        
        # Parse categories and tags
        category_list = [c.strip() for c in categories.split(',') if c.strip()] if categories else []
        tag_list = [t.strip() for t in tags.split(',') if t.strip()] if tags else []
        
        # Validate access level and shelter_id
        if access_level == 'shelter-specific' and not shelter_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="shelter_id required for shelter-specific documents"
            )
        
        # Process upload
        document_id = await knowledge_service.ingest_from_upload(
            file=file,
            title=title or file.filename,
            description=description,
            access_level=access_level,
            categories=category_list,
            tags=tag_list,
            shelter_id=shelter_id,
            uploaded_by=user_id
        )
        
        logger.info(f"Successfully uploaded document {document_id}")
        
        return DocumentResponse(
            success=True,
            document_id=document_id,
            title=title or file.filename,
            message="Document uploaded and processed successfully",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Document upload failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )

@router.get(
    "/documents",
    response_model=KnowledgeResponse,
    summary="List documents",
    description="Get list of documents with access control"
)
async def list_documents(
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(50, description="Maximum documents to return"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """List documents in the knowledge base with proper access control"""
    try:
        user_role = current_user.get('role', 'participant')
        shelter_id = current_user.get('shelter_id')
        
        documents = await knowledge_service.list_documents(
            user_role=user_role,
            shelter_id=shelter_id,
            category=category,
            limit=limit
        )
        
        return KnowledgeResponse(
            success=True,
            data={
                'documents': documents,
                'total': len(documents),
                'category_filter': category,
                'user_role': user_role
            },
            message=f"Retrieved {len(documents)} documents",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Document listing failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list documents: {str(e)}"
        )

@router.get(
    "/documents/{document_id}",
    response_model=KnowledgeResponse,
    summary="Get document details",
    description="Get detailed information about a specific document"
)
async def get_document(
    document_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get detailed information about a specific document"""
    try:
        document = await knowledge_service.get_document(document_id)
        
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )
        
        # Check access (knowledge_service handles this in get_document)
        return KnowledgeResponse(
            success=True,
            data={'document': document},
            message="Document retrieved successfully",
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Document retrieval failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve document: {str(e)}"
        )

@router.delete(
    "/documents/{document_id}",
    response_model=KnowledgeResponse,
    summary="Delete document",
    description="Delete a document from the knowledge base (Admin/Super Admin only)"
)
async def delete_document(
    document_id: str,
    current_user: Dict[str, Any] = Depends(require_admin_or_super())
):
    """Delete a document from the knowledge base"""
    try:
        success = await knowledge_service.delete_document(document_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found or deletion failed"
            )
        
        return KnowledgeResponse(
            success=True,
            data={'document_id': document_id},
            message="Document deleted successfully",
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Document deletion failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete document: {str(e)}"
        )

# Batch Processing Endpoints

@router.post(
    "/batch-ingest",
    response_model=KnowledgeResponse,
    summary="Batch ingest SHELTR documents",
    description="Ingest predefined SHELTR documents (Super Admin only)"
)
async def batch_ingest_sheltr_documents(
    current_user: Dict[str, Any] = Depends(require_admin_or_super())
):
    """Batch ingest all SHELTR documents from the predefined list"""
    try:
        # Predefined document paths
        document_paths = [
            '/Users/mrjones/Github/Projects/sheltr-ai/README.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/01-overview/A MillionDollarMurray.pdf',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/01-overview/hacking_homelessness.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/01-overview/README.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/SECURITY.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/04-development/dev-roadmap.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/website-architecture.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/system-design.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/03-api/database-schema.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/03-api/firestore-setup.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/03-api/README.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/payment-rails/adyen-integration.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/sheltr-tokens/README.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/whitepaper_final.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/tokenomics/sheltr-tokenomics.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/technical/blockchain.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/06-user-guides/shelter-admin-guide.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/06-user-guides/participant-guide.md',
            '/Users/mrjones/Github/Projects/sheltr-ai/docs/06-user-guides/donor-guide.md'
        ]
        
        logger.info(f"Starting batch ingestion of {len(document_paths)} SHELTR documents")
        
        results = await knowledge_service.batch_ingest_documents(document_paths)
        
        # Count successes and failures
        successes = [r for r in results if r['success']]
        failures = [r for r in results if not r['success']]
        
        return KnowledgeResponse(
            success=True,
            data={
                'total_processed': len(results),
                'successes': len(successes),
                'failures': len(failures),
                'successful_documents': successes,
                'failed_documents': failures
            },
            message=f"Batch ingestion completed: {len(successes)} successful, {len(failures)} failed",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Batch ingestion failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch ingestion failed: {str(e)}"
        )

# Statistics and Health Endpoints

@router.get(
    "/stats",
    response_model=KnowledgeResponse,
    summary="Get knowledge base statistics",
    description="Get comprehensive statistics about the knowledge base"
)
async def get_knowledge_stats(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get knowledge base statistics"""
    try:
        stats = await knowledge_service.get_knowledge_stats()
        
        return KnowledgeResponse(
            success=True,
            data=stats,
            message="Knowledge base statistics retrieved successfully",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Stats retrieval failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve statistics: {str(e)}"
        )

@router.get(
    "/status",
    response_model=KnowledgeResponse,
    summary="Knowledge base status check",
    description="Check the status of the knowledge base system (alias for /health)"
)
async def knowledge_status():
    """Check knowledge base system status (alias for health endpoint)"""
    return await knowledge_health()

@router.get(
    "/health",
    response_model=KnowledgeResponse,
    summary="Knowledge base health check",
    description="Check the health status of the knowledge base system"
)
async def knowledge_health():
    """Check knowledge base system health"""
    try:
        stats = await knowledge_service.get_knowledge_stats()
        
        # Determine health status
        health_status = "healthy"
        issues = []
        
        if stats.get('total_documents', 0) == 0:
            issues.append("No documents in knowledge base")
            health_status = "warning"
        
        if stats.get('total_chunks', 0) == 0:
            issues.append("No embeddings generated")
            health_status = "warning"
        
        return KnowledgeResponse(
            success=True,
            data={
                'status': health_status,
                'issues': issues,
                'stats': stats
            },
            message=f"Knowledge base status: {health_status}",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return KnowledgeResponse(
            success=False,
            data={'status': 'error', 'error': str(e)},
            message="Health check failed",
            timestamp=datetime.now().isoformat()
        )
