#!/usr/bin/env python3
"""
Knowledge Base Document Migrator
Migrates documents from flat structure to organized folder structure
"""

import json
import os
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, storage
from datetime import datetime

def migrate_documents():
    """Migrate documents to new folder structure"""
    
    # Initialize Firebase (if not already initialized)
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    
    db = firestore.client()
    bucket = storage.bucket('sheltr-ai.firebasestorage.app')
    
    # Define migration mapping
    migration_mapping = {
        # Current path -> New path
        'knowledge-base/public/system-design.md': 'knowledge-base/02-architecture/system-design.md',
        'knowledge-base/public/hacking_homelessness.md': 'knowledge-base/01-overview/hacking_homelessness.md',
        'knowledge-base/public/README.md': 'knowledge-base/01-overview/README.md',
        'knowledge-base/public/donor-guide.md': 'knowledge-base/06-user-guides/donor-guide.md',
        'knowledge-base/public/whitepaper_final.md': 'knowledge-base/02-architecture/whitepaper_final.md',
        'knowledge-base/public/shelter-admin-guide.md': 'knowledge-base/06-user-guides/shelter-admin-guide.md',
        'knowledge-base/public/sheltr-tokenomics.md': 'knowledge-base/02-architecture/tokenomics/sheltr-tokenomics.md',
        'knowledge-base/public/blockchain.md': 'knowledge-base/02-architecture/technical/blockchain.md',
        'knowledge-base/public/participant-guide.md': 'knowledge-base/06-user-guides/participant-guide.md',
    }
    
    print("🔄 Starting document migration...")
    
    # Get all current documents
    docs_ref = db.collection('knowledge_documents')
    docs = docs_ref.stream()
    
    migration_results = []
    
    for doc in docs:
        doc_data = doc.to_dict()
        doc_id = doc.id
        current_path = doc_data.get('file_path', '')
        
        if current_path in migration_mapping:
            new_path = migration_mapping[current_path]
            
            try:
                # Copy file to new location
                source_blob = bucket.blob(current_path)
                if source_blob.exists():
                    # Copy to new location
                    new_blob = bucket.copy_blob(source_blob, bucket, new_path)
                    
                    # Update Firestore document
                    doc_data['file_path'] = new_path
                    doc_data['updated_at'] = datetime.now()
                    doc_data['migration_date'] = datetime.now()
                    doc_data['original_path'] = current_path
                    
                    docs_ref.document(doc_id).update(doc_data)
                    
                    print(f"✅ Migrated: {current_path} -> {new_path}")
                    migration_results.append({
                        'doc_id': doc_id,
                        'title': doc_data.get('title', 'Unknown'),
                        'old_path': current_path,
                        'new_path': new_path,
                        'status': 'success'
                    })
                    
                    # Delete old file after successful migration
                    source_blob.delete()
                    print(f"🗑️  Deleted old file: {current_path}")
                    
                else:
                    print(f"⚠️  Source file not found: {current_path}")
                    migration_results.append({
                        'doc_id': doc_id,
                        'title': doc_data.get('title', 'Unknown'),
                        'old_path': current_path,
                        'new_path': new_path,
                        'status': 'source_not_found'
                    })
                    
            except Exception as e:
                print(f"❌ Error migrating {current_path}: {e}")
                migration_results.append({
                    'doc_id': doc_id,
                    'title': doc_data.get('title', 'Unknown'),
                    'old_path': current_path,
                    'new_path': new_path,
                    'status': 'error',
                    'error': str(e)
                })
        else:
            print(f"ℹ️  No migration mapping for: {current_path}")
            migration_results.append({
                'doc_id': doc_id,
                'title': doc_data.get('title', 'Unknown'),
                'old_path': current_path,
                'new_path': 'no_mapping',
                'status': 'no_mapping'
            })
    
    # Save migration results
    results_file = f"migration_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(results_file, 'w') as f:
        json.dump(migration_results, f, indent=2, default=str)
    
    # Print summary
    successful = len([r for r in migration_results if r['status'] == 'success'])
    total = len(migration_results)
    
    print(f"\n📊 Migration Summary:")
    print(f"✅ Successful migrations: {successful}")
    print(f"📊 Total documents processed: {total}")
    print(f"📄 Results saved to: {results_file}")
    
    return migration_results

if __name__ == "__main__":
    migrate_documents()
