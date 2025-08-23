#!/usr/bin/env python3
"""
Bulk Documentation Uploader
Uploads missing documentation files to the new Knowledge Base structure
"""

import os
import sys
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, storage
from datetime import datetime
import hashlib

# Add the API directory to the Python path
sys.path.append(str(Path(__file__).parent.parent / 'apps' / 'api'))

def calculate_file_hash(file_path):
    """Calculate MD5 hash of a file"""
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def upload_documentation_files():
    """Upload missing documentation files to Knowledge Base"""
    
    # Initialize Firebase (if not already initialized)
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    
    db = firestore.client()
    bucket = storage.bucket('sheltr-ai.firebasestorage.app')
    
    # Define files to upload with their mappings
    docs_root = Path("docs")
    token_docs_root = Path("sheltr-tokens/docs")
    
    upload_mapping = [
        # Overview documents
        {
            'local_path': docs_root / '01-overview' / 'README.md',
            'kb_path': 'knowledge-base/01-overview/README.md',
            'title': 'SHELTR Platform Overview',
            'category': 'overview'
        },
        {
            'local_path': docs_root / '01-overview' / 'SHELTR-AI-DOCS-PLAN.md',
            'kb_path': 'knowledge-base/01-overview/SHELTR-AI-DOCS-PLAN.md',
            'title': 'SHELTR Documentation Plan',
            'category': 'overview'
        },
        {
            'local_path': docs_root / '01-overview' / 'SHELTR-AI-IMPLEMENTATION-PLAN.md',
            'kb_path': 'knowledge-base/01-overview/SHELTR-AI-IMPLEMENTATION-PLAN.md',
            'title': 'SHELTR Implementation Plan',
            'category': 'overview'
        },
        
        # Architecture documents
        {
            'local_path': docs_root / '02-architecture' / 'website-architecture.md',
            'kb_path': 'knowledge-base/02-architecture/website-architecture.md',
            'title': 'SHELTR Website Architecture',
            'category': 'architecture'
        },
        {
            'local_path': docs_root / '02-architecture' / 'payment-rails' / 'adyen-integration.md',
            'kb_path': 'knowledge-base/02-architecture/payment-rails/adyen-integration.md',
            'title': 'Adyen Payment Integration',
            'category': 'architecture'
        },
        {
            'local_path': docs_root / '02-architecture' / 'payment-rails' / 'production-deployment.md',
            'kb_path': 'knowledge-base/02-architecture/payment-rails/production-deployment.md',
            'title': 'Payment Rails Production Deployment',
            'category': 'architecture'
        },
        {
            'local_path': docs_root / '02-architecture' / 'payment-rails' / 'sheltr-demo-implementation.md',
            'kb_path': 'knowledge-base/02-architecture/payment-rails/sheltr-demo-implementation.md',
            'title': 'SHELTR Demo Implementation',
            'category': 'architecture'
        },
        
        # API documents
        {
            'local_path': docs_root / '03-api' / 'blog-schema.md',
            'kb_path': 'knowledge-base/03-api/blog-schema.md',
            'title': 'Blog Schema Documentation',
            'category': 'api'
        },
        {
            'local_path': docs_root / '03-api' / 'database-schema.md',
            'kb_path': 'knowledge-base/03-api/database-schema.md',
            'title': 'Database Schema Documentation',
            'category': 'api'
        },
        {
            'local_path': docs_root / '03-api' / 'firestore-setup.md',
            'kb_path': 'knowledge-base/03-api/firestore-setup.md',
            'title': 'Firestore Setup Guide',
            'category': 'api'
        },
        
        # Development documents (excluding session notes)
        {
            'local_path': docs_root / '04-development' / 'CHATBOT-AGENT-ARCHITECTURE.md',
            'kb_path': 'knowledge-base/04-development/CHATBOT-AGENT-ARCHITECTURE.md',
            'title': 'Chatbot Agent Architecture',
            'category': 'development'
        },
        {
            'local_path': docs_root / '04-development' / 'COMPLETE-FUNCTIONALITY-MATRIX.md',
            'kb_path': 'knowledge-base/04-development/COMPLETE-FUNCTIONALITY-MATRIX.md',
            'title': 'Complete Functionality Matrix',
            'category': 'development'
        },
        {
            'local_path': docs_root / '04-development' / 'USER-JOURNEYS.md',
            'kb_path': 'knowledge-base/04-development/USER-JOURNEYS.md',
            'title': 'User Journeys Documentation',
            'category': 'development'
        },
        
        # Migration documents
        {
            'local_path': docs_root / '09-migration' / 'DATABASE_MIGRATION_COMPLETE.md',
            'kb_path': 'knowledge-base/09-migration/DATABASE_MIGRATION_COMPLETE.md',
            'title': 'Database Migration Complete',
            'category': 'migration'
        },
        {
            'local_path': docs_root / '09-migration' / 'DATABASE_MIGRATION_PLAN.md',
            'kb_path': 'knowledge-base/09-migration/DATABASE_MIGRATION_PLAN.md',
            'title': 'Database Migration Plan',
            'category': 'migration'
        },
        {
            'local_path': docs_root / '09-migration' / 'from-supabase.md',
            'kb_path': 'knowledge-base/09-migration/from-supabase.md',
            'title': 'Migration from Supabase',
            'category': 'migration'
        },
        
        # Token documents
        {
            'local_path': token_docs_root / 'SHELTR-TOKENOMICS-STRATEGY.md',
            'kb_path': 'knowledge-base/02-architecture/tokenomics/SHELTR-TOKENOMICS-STRATEGY.md',
            'title': 'SHELTR Tokenomics Strategy',
            'category': 'architecture'
        },
        {
            'local_path': token_docs_root / 'TECHNICAL-IMPLEMENTATION-GUIDE.md',
            'kb_path': 'knowledge-base/02-architecture/tokenomics/TECHNICAL-IMPLEMENTATION-GUIDE.md',
            'title': 'Token Technical Implementation Guide',
            'category': 'architecture'
        },
    ]
    
    print("📤 Starting bulk documentation upload...")
    
    upload_results = []
    
    for doc_info in upload_mapping:
        local_path = Path(doc_info['local_path'])
        kb_path = doc_info['kb_path']
        title = doc_info['title']
        category = doc_info['category']
        
        if not local_path.exists():
            print(f"⚠️  File not found: {local_path}")
            upload_results.append({
                'title': title,
                'local_path': str(local_path),
                'kb_path': kb_path,
                'status': 'file_not_found'
            })
            continue
        
        try:
            # Check if document already exists in Firestore
            existing_docs = db.collection('knowledge_documents').where('file_path', '==', kb_path).stream()
            existing_doc = None
            for doc in existing_docs:
                existing_doc = doc
                break
            
            # Calculate file hash
            file_hash = calculate_file_hash(local_path)
            
            # Read file content
            with open(local_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Upload to Firebase Storage
            blob = bucket.blob(kb_path)
            blob.upload_from_string(content, content_type='text/markdown')
            
            # Prepare document data
            doc_data = {
                'title': title,
                'file_path': kb_path,
                'category': category,
                'file_size': len(content.encode('utf-8')),
                'file_hash': file_hash,
                'content_type': 'text/markdown',
                'updated_at': datetime.now(),
                'is_public': True,
                'tags': [category, 'documentation'],
                'upload_source': 'bulk_uploader'
            }
            
            if existing_doc:
                # Update existing document
                db.collection('knowledge_documents').document(existing_doc.id).update(doc_data)
                print(f"🔄 Updated: {title}")
                upload_results.append({
                    'title': title,
                    'local_path': str(local_path),
                    'kb_path': kb_path,
                    'status': 'updated',
                    'doc_id': existing_doc.id
                })
            else:
                # Create new document
                doc_data['created_at'] = datetime.now()
                doc_ref = db.collection('knowledge_documents').add(doc_data)
                print(f"✅ Uploaded: {title}")
                upload_results.append({
                    'title': title,
                    'local_path': str(local_path),
                    'kb_path': kb_path,
                    'status': 'uploaded',
                    'doc_id': doc_ref[1].id
                })
                
        except Exception as e:
            print(f"❌ Error uploading {title}: {e}")
            upload_results.append({
                'title': title,
                'local_path': str(local_path),
                'kb_path': kb_path,
                'status': 'error',
                'error': str(e)
            })
    
    # Summary
    uploaded = len([r for r in upload_results if r['status'] == 'uploaded'])
    updated = len([r for r in upload_results if r['status'] == 'updated'])
    errors = len([r for r in upload_results if r['status'] == 'error'])
    not_found = len([r for r in upload_results if r['status'] == 'file_not_found'])
    
    print(f"\n📊 Upload Summary:")
    print(f"✅ New uploads: {uploaded}")
    print(f"🔄 Updates: {updated}")
    print(f"❌ Errors: {errors}")
    print(f"⚠️  Files not found: {not_found}")
    print(f"📊 Total processed: {len(upload_results)}")
    
    return upload_results

if __name__ == "__main__":
    upload_documentation_files()
