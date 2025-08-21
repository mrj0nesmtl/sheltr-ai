"""
Knowledge Dashboard Router for SHELTR-AI
Handles knowledge document management and dashboard data
"""

from fastapi import APIRouter, Depends, HTTPException, Form
from typing import List, Dict, Any
from services.knowledge_dashboard_service import KnowledgeDashboardService
from middleware.auth_middleware import get_current_user, require_super_admin
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
