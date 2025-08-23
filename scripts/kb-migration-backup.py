#!/usr/bin/env python3
"""
Knowledge Base Migration - Backup Script
Backs up current Firebase Storage knowledge base before reorganization
"""

import json
import os
from datetime import datetime
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, storage

def backup_knowledge_base():
    """Backup current knowledge base documents and metadata"""
    
    # Initialize Firebase (if not already initialized)
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    
    db = firestore.client()
    bucket = storage.bucket('sheltr-ai.firebasestorage.app')
    
    # Create backup directory
    backup_dir = Path(f"backups/kb-backup-{datetime.now().strftime('%Y%m%d_%H%M%S')}")
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"🔄 Starting Knowledge Base backup to {backup_dir}")
    
    # Backup Firestore documents metadata
    docs_ref = db.collection('knowledge_documents')
    docs = docs_ref.stream()
    
    documents_metadata = []
    for doc in docs:
        doc_data = doc.to_dict()
        doc_data['id'] = doc.id
        documents_metadata.append(doc_data)
        print(f"📄 Backing up metadata for: {doc_data.get('title', 'Unknown')}")
    
    # Save metadata to JSON
    with open(backup_dir / 'documents_metadata.json', 'w') as f:
        json.dump(documents_metadata, f, indent=2, default=str)
    
    # Backup actual files from Firebase Storage
    files_dir = backup_dir / 'files'
    files_dir.mkdir(exist_ok=True)
    
    for doc_meta in documents_metadata:
        file_path = doc_meta.get('file_path', '')
        if file_path:
            try:
                blob = bucket.blob(file_path)
                if blob.exists():
                    # Create local directory structure
                    local_path = files_dir / file_path
                    local_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    # Download file
                    blob.download_to_filename(str(local_path))
                    print(f"📥 Downloaded: {file_path}")
                else:
                    print(f"⚠️  File not found in storage: {file_path}")
            except Exception as e:
                print(f"❌ Error downloading {file_path}: {e}")
    
    # Create backup summary
    summary = {
        'backup_date': datetime.now().isoformat(),
        'total_documents': len(documents_metadata),
        'backup_location': str(backup_dir),
        'documents': [
            {
                'id': doc['id'],
                'title': doc.get('title', 'Unknown'),
                'path': doc.get('file_path', ''),
                'created_at': doc.get('created_at', '')
            }
            for doc in documents_metadata
        ]
    }
    
    with open(backup_dir / 'backup_summary.json', 'w') as f:
        json.dump(summary, f, indent=2, default=str)
    
    print(f"✅ Backup completed successfully!")
    print(f"📊 Total documents backed up: {len(documents_metadata)}")
    print(f"📁 Backup location: {backup_dir}")
    
    return backup_dir

if __name__ == "__main__":
    backup_knowledge_base()
