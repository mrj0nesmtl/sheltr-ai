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
    current_user: dict = Depends(require_super_admin)
):
    """
    Trigger sync of secure documents from .local-secure-docs to Firestore.
    Only accessible to Super Admins.
    """
    try:
        logger.info(f"🔒 Secure docs sync triggered by {current_user.get('email')}")
        
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
        
        # Count files to sync
        founders_files = list((SECURE_DOCS_PATH / "founders").glob("*.md")) if (SECURE_DOCS_PATH / "founders").exists() else []
        payment_files = list((SECURE_DOCS_PATH / "payment-rails").glob("*.md")) if (SECURE_DOCS_PATH / "payment-rails").exists() else []
        admin_files = list((SECURE_DOCS_PATH / "platform-admin").glob("*.md")) if (SECURE_DOCS_PATH / "platform-admin").exists() else []
        shelter_files = list((SECURE_DOCS_PATH / "shelter-research").glob("*.md")) if (SECURE_DOCS_PATH / "shelter-research").exists() else []
        
        total_files = len(founders_files) + len(payment_files) + len(admin_files) + len(shelter_files)
        
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
                {"directory": "founders", "file_count": len(founders_files)},
                {"directory": "payment-rails", "file_count": len(payment_files)},
                {"directory": "platform-admin", "file_count": len(admin_files)},
                {"directory": "shelter-research", "file_count": len(shelter_files)}
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
        # Count files in .local-secure-docs
        total_files = 0
        if SECURE_DOCS_PATH.exists():
            for subdir in ["founders", "payment-rails", "platform-admin", "shelter-research"]:
                subdir_path = SECURE_DOCS_PATH / subdir
                if subdir_path.exists():
                    total_files += len(list(subdir_path.glob("*.md")))
        
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
    current_user: dict = Depends(require_super_admin)
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
        for subdir in ["founders", "payment-rails", "platform-admin", "shelter-research"]:
            subdir_path = SECURE_DOCS_PATH / subdir
            if subdir_path.exists():
                md_files = list(subdir_path.glob("*.md"))
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

