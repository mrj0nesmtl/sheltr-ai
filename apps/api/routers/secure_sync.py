"""
Secure Document Sync Router
Handles syncing of secure documents from .local-secure-docs to Firestore
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import subprocess
import os
import logging
from pathlib import Path
from firebase_admin import firestore

from middleware.auth_middleware import get_current_user, require_super_admin

router = APIRouter()
logger = logging.getLogger(__name__)

# Get project root directory
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
SYNC_SCRIPT_PATH = PROJECT_ROOT / "scripts" / "sync-secure-documents.js"
SECURE_DOCS_PATH = PROJECT_ROOT / ".local-secure-docs"


class SyncSecureDocsResponse(BaseModel):
    success: bool
    message: str
    stats: Dict[str, int]
    details: List[Dict[str, Any]]


class SyncStatus(BaseModel):
    is_syncing: bool
    last_sync: Optional[str]
    total_files: int
    synced_files: int


@router.post("/secure-docs/sync", response_model=SyncSecureDocsResponse)
async def sync_secure_documents(
    current_user: dict = Depends(require_super_admin())
):
    """
    Trigger sync of secure documents from .local-secure-docs to Firestore.
    Only accessible to Super Admins.
    """
    try:
        logger.info(f"🔒 Secure docs sync triggered by {current_user.get('email', 'unknown')}")
        
        # Check if .local-secure-docs directory exists
        if not SECURE_DOCS_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Secure documents directory not found: {SECURE_DOCS_PATH}"
            )
        
        # Check if sync script exists
        if not SYNC_SCRIPT_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Sync script not found: {SYNC_SCRIPT_PATH}"
            )
        
        # Count files to sync - ALL 8 secure directories (updated Nov 25, 2025)
        # Count files to sync (EXCLUDING: local, drafts, development, vault)
        blog_files = list((SECURE_DOCS_PATH / "blog-posts").glob("**/*.md")) if (SECURE_DOCS_PATH / "blog-posts").exists() else []
        dataroom_files = list((SECURE_DOCS_PATH / "dataroom").glob("**/*.md")) if (SECURE_DOCS_PATH / "dataroom").exists() else []
        # development_files - EXCLUDED (local development logs)
        # drafts_files - EXCLUDED (work-in-progress)
        # local_files - EXCLUDED (local-only files)
        # vault_files - EXCLUDED (credentials, too sensitive)
        fintec_files = list((SECURE_DOCS_PATH / "fintec").glob("**/*.md")) if (SECURE_DOCS_PATH / "fintec").exists() else []
        founders_files = list((SECURE_DOCS_PATH / "founders").glob("**/*.md")) if (SECURE_DOCS_PATH / "founders").exists() else []
        leadership_files = list((SECURE_DOCS_PATH / "leadership").glob("**/*.md")) if (SECURE_DOCS_PATH / "leadership").exists() else []
        operations_files = list((SECURE_DOCS_PATH / "operations").glob("**/*.md")) if (SECURE_DOCS_PATH / "operations").exists() else []
        admin_files = list((SECURE_DOCS_PATH / "platform-admin").glob("**/*.md")) if (SECURE_DOCS_PATH / "platform-admin").exists() else []
        
        total_files = len(blog_files) + len(dataroom_files) + len(fintec_files) + len(founders_files) + len(leadership_files) + len(operations_files) + len(admin_files)
        
        if total_files == 0:
            return SyncSecureDocsResponse(
                success=True,
                message="No secure documents found to sync",
                stats={
                    "total": 0,
                    "created": 0,
                    "updated": 0,
                    "errors": 0
                },
                details=[]
            )
        
        # Run the sync script
        logger.info(f"📄 Syncing {total_files} secure documents...")
        
        result = subprocess.run(
            ["node", str(SYNC_SCRIPT_PATH)],
            cwd=str(PROJECT_ROOT),
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode != 0:
            logger.error(f"❌ Sync failed: {result.stderr}")
            raise HTTPException(
                status_code=500,
                detail=f"Sync script failed: {result.stderr}"
            )
        
        # Parse output for stats (simple parsing)
        output = result.stdout
        created = output.count("✨ Created:")
        updated = output.count("✅ Updated:")
        errors = output.count("❌ Error")
        
        logger.info(f"✅ Sync complete: {created} created, {updated} updated, {errors} errors")
        
        return SyncSecureDocsResponse(
            success=True,
            message=f"Successfully synced {total_files} secure documents",
            stats={
                "total": total_files,
                "created": created,
                "updated": updated,
                "errors": errors
            },
            details=[
                # All 8 secure directories being synced
                {"directory": "blog-posts", "file_count": len(blog_files)},
                {"directory": "dataroom", "file_count": len(dataroom_files)},
                # development - EXCLUDED
                # drafts - EXCLUDED
                # local - EXCLUDED
                # vault - EXCLUDED
                {"directory": "fintec", "file_count": len(fintec_files)},
                {"directory": "founders", "file_count": len(founders_files)},
                {"directory": "leadership", "file_count": len(leadership_files)},
                {"directory": "operations", "file_count": len(operations_files)},
                {"directory": "platform-admin", "file_count": len(admin_files)}
            ]
        )
        
    except subprocess.TimeoutExpired:
        logger.error("❌ Sync timeout")
        raise HTTPException(
            status_code=504,
            detail="Sync operation timed out after 5 minutes"
        )
    except Exception as e:
        logger.error(f"❌ Sync error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync secure documents: {str(e)}"
        )


@router.get("/secure-docs/status", response_model=SyncStatus)
async def get_secure_sync_status(
    current_user: dict = Depends(get_current_user)
):
    """
    Get current status of secure document syncing.
    Shows file counts and last sync time.
    """
    try:
        # Count files in .local-secure-docs - ALL 8 secure directories
        total_files = 0
        if SECURE_DOCS_PATH.exists():
            # Only count files from synced directories (EXCLUDING: local, drafts, development, vault)
            for subdir in ["blog-posts", "dataroom", "fintec", "founders", "leadership", "operations", "platform-admin"]:
                subdir_path = SECURE_DOCS_PATH / subdir
                if subdir_path.exists():
                    total_files += len(list(subdir_path.glob("**/*.md")))
        
        # TODO: Query Firestore to get synced file count and last sync time
        # For now, return static data
        
        return SyncStatus(
            is_syncing=False,
            last_sync=None,
            total_files=total_files,
            synced_files=0
        )
        
    except Exception as e:
        logger.error(f"❌ Error getting sync status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get sync status: {str(e)}"
        )


@router.get("/secure-docs/directories")
async def list_secure_directories(
    current_user: dict = Depends(require_super_admin())
):
    """
    List secure document directories and their file counts.
    Only accessible to Super Admins.
    """
    try:
        if not SECURE_DOCS_PATH.exists():
            return {
                "exists": False,
                "path": str(SECURE_DOCS_PATH),
                "directories": []
            }
        
        directories = []
        # ALL 8 secure directories being synced
        # Only list synced directories (EXCLUDING: local, drafts, development, vault)
        for subdir in ["blog-posts", "dataroom", "fintec", "founders", "leadership", "operations", "platform-admin"]:
            subdir_path = SECURE_DOCS_PATH / subdir
            if subdir_path.exists():
                md_files = list(subdir_path.glob("**/*.md"))
                directories.append({
                    "name": subdir,
                    "path": str(subdir_path),
                    "file_count": len(md_files),
                    "files": [f.name for f in md_files[:10]]  # First 10 files
                })
        
        return {
            "exists": True,
            "path": str(SECURE_DOCS_PATH),
            "total_files": sum(d["file_count"] for d in directories),
            "directories": directories
        }
        
    except Exception as e:
        logger.error(f"❌ Error listing directories: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list directories: {str(e)}"
        )

@router.post("/secure-docs/generate-embeddings")
async def generate_embeddings_for_pending(
    current_user: dict = Depends(require_super_admin())
):
    """Generate embeddings for all documents with pending embedding status"""
    try:
        from services.knowledge_dashboard_service import KnowledgeDashboardService
        from services.embeddings_service import EmbeddingsService
        
        logger.info(f"🧠 Embedding generation triggered by {current_user.get('email', 'unknown')}")
        
        kb_service = KnowledgeDashboardService()
        embeddings_service = EmbeddingsService()
        
        # Query documents with pending embeddings
        pending_docs = kb_service.db.collection('knowledge_documents')\
            .where('embedding_status', '==', 'pending')\
            .stream()
        
        pending_list = list(pending_docs)
        
        if not pending_list:
            logger.info("✅ No documents with pending embeddings")
            return {
                "success": True,
                "processed": 0,
                "failed": 0,
                "message": "No documents with pending embeddings"
            }
        
        logger.info(f"📝 Found {len(pending_list)} documents with pending embeddings")
        
        processed = 0
        failed = 0
        
        # Process each pending document
        for doc in pending_list:
            doc_data = doc.to_dict()
            doc_id = doc.id
            
            try:
                title = doc_data.get('title', 'Untitled')
                content = doc_data.get('content', '')
                
                if not content:
                    logger.warning(f"⚠️  Skipping {doc_id} - no content")
                    continue
                
                logger.info(f"🔄 Processing embeddings for: {title}")
                
                # Generate embeddings
                metadata = {
                    'document_id': doc_id,
                    'title': title,
                    'category': doc_data.get('category', 'Platform'),
                    'permission_level': doc_data.get('permission_level', 'public'),
                    'source_directory': doc_data.get('source_directory', 'unknown')
                }
                
                chunk_ids = await embeddings_service.process_document_embeddings(
                    document_id=doc_id,
                    content=content,
                    metadata=metadata
                )
                
                # Update document with embedding status
                doc.reference.update({
                    'embedding_status': 'completed',
                    'embedding_count': len(chunk_ids),
                    'processed': True,
                    'last_embedding_update': firestore.SERVER_TIMESTAMP
                })
                
                processed += 1
                logger.info(f"✅ Generated {len(chunk_ids)} embeddings for: {title}")
                
            except Exception as e:
                failed += 1
                logger.error(f"❌ Failed to process {doc_id}: {str(e)}")
                
                # Mark as failed
                doc.reference.update({
                    'embedding_status': 'failed',
                    'embedding_error': str(e)
                })
        
        logger.info(f"🎉 Embedding generation complete: {processed} processed, {failed} failed")
        
        # Invalidate cache to ensure metrics update correctly
        from services.cache_service import cache
        cache.invalidate('knowledge_documents_all')
        cache.invalidate('knowledge_stats')
        logger.info(f"🔄 Cache invalidated - stats will refresh with updated embedding counts")
        
        return {
            "success": True,
            "processed": processed,
            "failed": failed,
            "total": len(pending_list),
            "message": f"Generated embeddings for {processed} documents"
        }
        
    except Exception as e:
        logger.error(f"❌ Error generating embeddings: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate embeddings: {str(e)}"
        )

