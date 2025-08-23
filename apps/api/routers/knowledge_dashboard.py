"""
Knowledge Dashboard Router for SHELTR-AI
Handles knowledge document management and dashboard data
"""

from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from typing import List, Dict, Any
from services.knowledge_dashboard_service import KnowledgeDashboardService
from middleware.auth_middleware import get_current_user, require_super_admin
from firebase_admin import firestore
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/knowledge-dashboard", tags=["knowledge-dashboard"])

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
    title: str = Form(...),
    content: str = Form(...),
    category: str = Form(...),
    tags: str = Form(""),
    status: str = Form("active"),
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Update an existing knowledge document (Super Admin only)"""
    
    try:
        knowledge_service = KnowledgeDashboardService()
        
        # Parse tags
        tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()] if tags else []
        
        updates = {
            'title': title,
            'content': content,
            'category': category,
            'tags': tag_list,
            'status': status
        }
        
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
        
        return {
            "success": True,
            "results": results,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error syncing GitHub files: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
