"""
Knowledge Dashboard Router for SHELTR-AI
Handles knowledge document management and dashboard data
"""

from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from services.knowledge_dashboard_service import KnowledgeDashboardService
from middleware.auth_middleware import get_current_user, require_super_admin
from firebase_admin import firestore
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/knowledge-dashboard", tags=["knowledge-dashboard"])

class UpdateDocumentRequest(BaseModel):
    """Flexible update model - all fields optional for partial updates"""
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    sharing_level: Optional[str] = None
    shared_with: Optional[List[str]] = None
    access_roles: Optional[List[str]] = None
    is_live: Optional[bool] = None
    confidentiality_level: Optional[str] = None
    # Permission fields
    permission_level: Optional[str] = None
    is_private: Optional[bool] = None
    visibility_scope: Optional[str] = None

@router.get("/documents")
async def get_knowledge_documents(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get all knowledge documents"""
    
    try:
        knowledge_service = KnowledgeDashboardService()
        documents = await knowledge_service.get_knowledge_documents()
        
        return {
            "success": True,
            "data": {
                "documents": documents
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get knowledge documents: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve knowledge documents")

@router.get("/documents/{document_id}")
async def get_knowledge_document(
    document_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get a single knowledge document by ID"""
    
    try:
        knowledge_service = KnowledgeDashboardService()
        document = await knowledge_service.get_knowledge_document(document_id)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        return {
            "success": True,
            "data": document
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get knowledge document {document_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve knowledge document")

@router.get("/stats")
async def get_knowledge_stats(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get knowledge base statistics"""
    
    try:
        knowledge_service = KnowledgeDashboardService()
        stats = await knowledge_service.get_knowledge_stats()
        
        return {
            "success": True,
            "data": stats
        }
        
    except Exception as e:
        logger.error(f"Failed to get knowledge stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve knowledge statistics")

@router.get("/accessible-count")
async def get_accessible_document_count(
    user_role: str = Query("participant", description="User role for access control"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get count of documents and FAQs accessible to user based on role"""
    
    try:
        from services.knowledge_service import knowledge_service
        from services.faq_service import faq_service
        
        # Get accessible documents count
        documents = await knowledge_service.list_documents(
            user_role=user_role,
            limit=1000  # Get all to count
        )
        
        # Get FAQ count (FAQs are accessible to all authenticated users)
        faqs = faq_service.get_all_faqs()
        
        return {
            "success": True,
            "data": {
                "documents": len(documents),
                "faqs": len(faqs),
                "user_role": user_role
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get accessible document count: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve document count")

@router.post("/documents")
async def create_knowledge_document(
    title: str = Form(...),
    content: str = Form(...),
    category: str = Form(...),
    tags: str = Form(""),
    status: str = Form("active"),
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Create a new knowledge document (Super Admin only)"""
    
    try:
        knowledge_service = KnowledgeDashboardService()
        
        # Parse tags
        tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()] if tags else []
        
        document_data = {
            'title': title,
            'content': content,
            'category': category,
            'tags': tag_list,
            'status': status,
            'created_by': current_user.get('display_name') or current_user.get('email')
        }
        
        document_id = await knowledge_service.create_knowledge_document(document_data)
        
        return {
            "success": True,
            "data": {
                "document_id": document_id,
                "message": "Knowledge document created successfully"
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to create knowledge document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create knowledge document: {str(e)}")

@router.put("/documents/{document_id}")
async def update_knowledge_document(
    document_id: str,
    request: UpdateDocumentRequest,
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Update an existing knowledge document (Super Admin only)"""
    
    try:
        knowledge_service = KnowledgeDashboardService()
        
        # Only include fields that are not None (partial updates support)
        updates = {}
        if request.title is not None:
            updates['title'] = request.title
        if request.content is not None:
            updates['content'] = request.content
        if request.category is not None:
            updates['category'] = request.category
        if request.tags is not None:
            updates['tags'] = request.tags
        if request.status is not None:
            updates['status'] = request.status
        if request.sharing_level is not None:
            updates['sharing_level'] = request.sharing_level
        if request.shared_with is not None:
            updates['shared_with'] = request.shared_with
        if request.access_roles is not None:
            updates['access_roles'] = request.access_roles
        if request.is_live is not None:
            updates['is_live'] = request.is_live
        if request.confidentiality_level is not None:
            updates['confidentiality_level'] = request.confidentiality_level
        if request.permission_level is not None:
            updates['permission_level'] = request.permission_level
        if request.is_private is not None:
            updates['is_private'] = request.is_private
        if request.visibility_scope is not None:
            updates['visibility_scope'] = request.visibility_scope
        
        success = await knowledge_service.update_knowledge_document(document_id, updates)
        
        if success:
            return {
                "success": True,
                "data": {
                    "message": "Knowledge document updated successfully"
                }
            }
        else:
            raise HTTPException(status_code=404, detail="Document not found")
        
    except Exception as e:
        logger.error(f"Failed to update knowledge document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update knowledge document: {str(e)}")

@router.put("/documents/{document_id}/upload")
async def update_knowledge_document_from_file(
    document_id: str,
    file: UploadFile = File(...),
    title: str = Form(None),
    category: str = Form(None),
    tags: str = Form(""),
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Update knowledge document from file upload with embedding regeneration"""
    
    try:
        from services.knowledge_service import knowledge_service
        from services.embeddings_service import EmbeddingsService
        
        logger.info(f"Updating document {document_id} from file: {file.filename}")
        
        # Read file content
        content = await file.read()
        if isinstance(content, bytes):
            content = content.decode('utf-8')
        
        # Extract title from content if not provided
        if not title:
            lines = content.split('\n')
            for line in lines:
                if line.strip().startswith('# '):
                    title = line.strip()[2:].strip()
                    break
            if not title:
                title = file.filename.replace('.md', '').replace('-', ' ').replace('_', ' ').title()
        
        # Parse tags
        tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()] if tags else []
        
        # Update document
        knowledge_service = KnowledgeDashboardService()
        updates = {
            'title': title,
            'content': content,
            'category': category or 'Platform',
            'tags': tag_list,
            'file_size': len(content.encode('utf-8')),
            'word_count': len(content.split()),
            'updated_at': firestore.SERVER_TIMESTAMP
        }
        
        success = await knowledge_service.update_knowledge_document(document_id, updates)
        
        if not success:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Regenerate embeddings
        try:
            embeddings_service = EmbeddingsService()
            
            # Delete existing chunks
            chunks_query = knowledge_service.db.collection('knowledge_chunks').where('document_id', '==', document_id)
            existing_chunks = list(chunks_query.stream())
            
            logger.info(f"Deleting {len(existing_chunks)} existing chunks")
            for chunk in existing_chunks:
                chunk.reference.delete()
            
            # Generate new embeddings
            metadata = {
                'document_id': document_id,
                'title': title,
                'category': category or 'Platform',
                'access_level': 'public'
            }
            
            chunk_ids = await embeddings_service.process_document_embeddings(
                document_id=document_id,
                content=content,
                metadata=metadata
            )
            
            # Update document with new chunk count
            doc_ref = knowledge_service.db.collection('knowledge_documents').document(document_id)
            doc_ref.update({
                'embedding_count': len(chunk_ids),
                'processed': True,
                'embedding_status': 'completed'
            })
            
            logger.info(f"Generated {len(chunk_ids)} new embedding chunks")
            
        except Exception as e:
            logger.error(f"Failed to regenerate embeddings: {e}")
            # Update document to show embedding failed
            doc_ref = knowledge_service.db.collection('knowledge_documents').document(document_id)
            doc_ref.update({
                'embedding_status': 'failed',
                'processed': False
            })
        
        return {
            "success": True,
            "data": {
                "message": f"Knowledge document updated successfully with {len(chunk_ids) if 'chunk_ids' in locals() else 0} new embeddings"
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to update document from file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update document from file: {str(e)}")

@router.delete("/documents/{document_id}")
async def delete_knowledge_document(
    document_id: str,
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Delete a knowledge document (Super Admin only)"""
    
    try:
        knowledge_service = KnowledgeDashboardService()
        success = await knowledge_service.delete_knowledge_document(document_id)
        
        if success:
            return {
                "success": True,
                "data": {
                    "message": "Knowledge document deleted successfully"
                }
            }
        else:
            raise HTTPException(status_code=404, detail="Document not found")
        
    except Exception as e:
        logger.error(f"Failed to delete knowledge document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete knowledge document: {str(e)}")

@router.post("/scan-github-changes")
async def scan_github_changes(
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Scan GitHub repository for documentation changes"""
    try:
        from services.github_service import github_service
        
        logger.info("Starting GitHub repository scan for documentation changes")
        
        # Scan the repository for changes
        changes = await github_service.scan_repository_changes()
        
        total_changes = len(changes["new"]) + len(changes["modified"]) + len(changes["deleted"])
        
        return {
            "success": True,
            "changes": changes,
            "timestamp": datetime.utcnow().isoformat(),
            "message": f"GitHub scan completed - found {total_changes} changes"
        }
        
    except Exception as e:
        logger.error(f"Error scanning GitHub changes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync-github-files")
async def sync_github_files(
    request: Dict[str, List[str]],
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Sync selected files from GitHub to knowledge base"""
    try:
        from services.github_service import github_service
        
        files_to_sync = request.get("files", [])
        
        if not files_to_sync:
            raise HTTPException(status_code=400, detail="No files specified for sync")
        
        logger.info(f"Starting GitHub sync for {len(files_to_sync)} files")
        
        # Sync files from GitHub to knowledge base
        results = await github_service.sync_files_to_knowledge_base(files_to_sync)
        
        logger.info(f"GitHub sync completed: {results['successful']} successful, {results['failed']} failed")
        
        # Force refresh stats to reflect updated embeddings
        # This will temporarily fetch fresh documents from Firestore, then re-cache them
        from services.knowledge_dashboard_service import KnowledgeDashboardService
        kb_service = KnowledgeDashboardService()
        updated_stats = await kb_service.get_knowledge_stats(force_refresh=True)
        logger.info(f"📊 Stats refreshed after sync: {updated_stats.get('pending_embeddings', 0)} pending embeddings")
        
        return {
            "success": True,
            "results": results,
            "updated_stats": updated_stats,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error syncing GitHub files: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/clear-knowledge-base")
async def clear_knowledge_base(
    clear_type: str = "all",  # Options: "all", "github_only", "secure_only"
    current_user: Dict = Depends(get_current_user)
):
    """
    Clear documents from the knowledge base (Super Admin only)
    
    Args:
        clear_type: Type of documents to clear
            - "all": Clear everything (GitHub + Secure docs)
            - "github_only": Clear only GitHub-synced docs
            - "secure_only": Clear only secure documents
    """
    try:
        # Verify super admin access
        if current_user.get('role') != 'super_admin':
            raise HTTPException(status_code=403, detail="Super admin access required")
        
        logger.info(f"Clearing knowledge base (type: {clear_type}) - requested by {current_user.get('email')}")
        
        # Get knowledge service
        from services.knowledge_dashboard_service import KnowledgeDashboardService
        kb_service = KnowledgeDashboardService()
        
        # Get all documents
        all_documents = await kb_service.get_knowledge_documents()
        
        # Filter documents based on clear_type
        if clear_type == "github_only":
            documents = [doc for doc in all_documents if doc.get('synced_from_github') == True]
            logger.info(f"Found {len(documents)} GitHub-synced documents to clear (out of {len(all_documents)} total)")
        elif clear_type == "secure_only":
            # Secure docs have source_directory set to folder name (dataroom, fintec, founders, leadership, operations, etc.)
            # NOT '.local-secure-docs' - filter by checking if source_directory exists and is NOT empty
            secure_folders = ['dataroom', 'fintec', 'founders', 'leadership', 'operations', 'platform-admin', 'vault', 'blog-posts']
            documents = [doc for doc in all_documents if doc.get('source_directory') in secure_folders]
            logger.info(f"Found {len(documents)} secure documents to clear (out of {len(all_documents)} total)")
        else:  # "all"
            documents = all_documents
            logger.info(f"Found {len(documents)} documents to clear (ALL)")
        
        deleted_count = 0
        doc_ids_to_delete = []
        
        # Delete from Firebase Storage
        for doc in documents:
            try:
                doc_ids_to_delete.append(doc.get('id'))
                file_path = doc.get('file_path', '')
                if file_path:
                    blob = kb_service.bucket.blob(file_path)
                    if blob.exists():
                        blob.delete()
                        logger.info(f"Deleted storage file: {file_path}")
                deleted_count += 1
            except Exception as e:
                logger.warning(f"Error deleting storage file {file_path}: {str(e)}")
        
        # Delete from Firestore - knowledge_documents (only selected docs)
        firestore_deleted = 0
        for doc_id in doc_ids_to_delete:
            try:
                kb_service.db.collection('knowledge_documents').document(doc_id).delete()
                firestore_deleted += 1
            except Exception as e:
                logger.warning(f"Error deleting Firestore doc {doc_id}: {str(e)}")
        
        # Delete from Firestore - knowledge_chunks (only chunks for deleted docs)
        chunks_deleted = 0
        for doc_id in doc_ids_to_delete:
            try:
                chunks = kb_service.db.collection('knowledge_chunks').where('document_id', '==', doc_id).stream()
                for chunk in chunks:
                    chunk.reference.delete()
                    chunks_deleted += 1
            except Exception as e:
                logger.warning(f"Error deleting chunks for doc {doc_id}: {str(e)}")
        
        # ✅ INVALIDATE CACHE after clearing documents
        from services.cache_service import cache
        cache.invalidate('knowledge_documents_all')
        cache.invalidate('knowledge_stats')
        logger.info("🗑️  Cache invalidated after clearing knowledge base")
        
        logger.info(f"Knowledge base cleared ({clear_type}) - {deleted_count} storage files, {firestore_deleted} Firestore docs, {chunks_deleted} chunks")
        
        return {
            "success": True,
            "message": f"Knowledge base cleared successfully ({clear_type})",
            "clear_type": clear_type,
            "storage_files_deleted": deleted_count,
            "firestore_docs_deleted": firestore_deleted,
            "chunks_deleted": chunks_deleted
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error clearing knowledge base: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
