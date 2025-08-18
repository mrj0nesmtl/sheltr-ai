#!/usr/bin/env python3
"""
Simplified SHELTR Knowledge Base Document Ingestion
Stores documents directly in Firestore without Firebase Storage
"""

import os
import asyncio
import sys
from pathlib import Path
from dotenv import load_dotenv
import logging
from datetime import datetime
import hashlib

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import services
from services.document_processor import document_processor
from services.embeddings_service import embeddings_service

class SimpleDocumentIngestor:
    """Simplified document ingestion that stores in Firestore only"""
    
    def __init__(self):
        self.base_path = Path("/Users/mrjones/Github/Projects/sheltr-ai")
        
        # Document categories
        self.documents = {
            'SHELTR': {
                'access_level': 'public',
                'category': 'sheltr',
                'files': [
                    'README.md',
                    'docs/01-overview/hacking_homelessness.md',
                    'docs/01-overview/README.md'
                ]
            },
            'PLATFORM': {
                'access_level': 'internal', 
                'category': 'platform',
                'files': [
                    'SECURITY.md',
                    'docs/04-development/dev-roadmap.md',
                    'docs/02-architecture/website-architecture.md',
                    'docs/02-architecture/system-design.md'
                ]
            },
            'USER GUIDES': {
                'access_level': 'public',
                'category': 'user_guides', 
                'files': [
                    'docs/06-user-guides/shelter-admin-guide.md',
                    'docs/06-user-guides/participant-guide.md',
                    'docs/06-user-guides/donor-guide.md'
                ]
            }
        }
    
    async def ingest_document_simple(self, file_path: Path, category: str, access_level: str):
        """Simple ingestion that bypasses Firebase Storage"""
        try:
            print(f"   📄 Processing: {file_path.name}")
            
            # Process document text
            result = await document_processor.process_document(str(file_path))
            if not result['success']:
                return {'success': False, 'error': result['error']}
            
            # Generate document ID
            doc_id = hashlib.md5(str(file_path).encode()).hexdigest()
            
            # Prepare document metadata
            doc_metadata = {
                'id': doc_id,
                'title': file_path.name,
                'file_path': str(file_path),
                'content': result['content'],
                'summary': result['summary'],
                'word_count': result['word_count'],
                'category': category,
                'access_level': access_level,
                'language': result.get('language', 'en'),
                'created_at': datetime.utcnow(),
                'file_size': file_path.stat().st_size,
                'source': 'sheltr_docs'
            }
            
            # Generate embeddings directly
            embeddings_result = await embeddings_service.process_document_embeddings(
                document_id=doc_id,
                content=result['content'],
                metadata=doc_metadata
            )
            
            if embeddings_result['success']:
                print(f"   ✅ Success: {embeddings_result['chunks_created']} chunks")
                return {
                    'success': True,
                    'chunks_created': embeddings_result['chunks_created'],
                    'embeddings_generated': embeddings_result['chunks_created']
                }
            else:
                return {'success': False, 'error': embeddings_result['error']}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    async def ingest_all_documents(self):
        """Ingest all documents with simplified approach"""
        total_files = sum(len(category['files']) for category in self.documents.values())
        processed = 0
        failed = 0
        
        print(f"🚀 Starting Simplified SHELTR Knowledge Base Ingestion")
        print(f"📚 Total documents to process: {total_files}")
        print("=" * 60)
        
        for category_name, category_info in self.documents.items():
            print(f"\n📂 Processing category: {category_name}")
            print(f"   Access Level: {category_info['access_level']}")
            print(f"   Category: {category_info['category']}")
            
            for file_path in category_info['files']:
                full_path = self.base_path / file_path
                
                if not full_path.exists():
                    print(f"   ❌ File not found: {file_path}")
                    failed += 1
                    continue
                
                result = await self.ingest_document_simple(
                    full_path, 
                    category_info['category'], 
                    category_info['access_level']
                )
                
                if result['success']:
                    print(f"   ✅ Success: {result['chunks_created']} chunks created")
                    processed += 1
                else:
                    print(f"   ❌ Failed: {result.get('error', 'Unknown error')}")
                    failed += 1
        
        print("\n" + "=" * 60)
        print(f"🎉 Ingestion Complete!")
        print(f"✅ Processed: {processed}/{total_files}")
        print(f"❌ Failed: {failed}/{total_files}")
        
        if processed > 0:
            print(f"\n🔍 Testing knowledge search...")
            await self.test_search()
    
    async def test_search(self):
        """Test the knowledge base search"""
        test_queries = [
            "What is SHELTR?",
            "How do users access the platform?", 
            "What are the user roles?"
        ]
        
        for query in test_queries:
            try:
                results = await embeddings_service.semantic_search(
                    query=query,
                    user_role="super_admin",
                    limit=2
                )
                
                if results['success'] and results['results']:
                    print(f"✅ '{query}': Found {len(results['results'])} results")
                else:
                    print(f"⚠️  '{query}': No results found")
            except Exception as e:
                print(f"❌ Error testing '{query}': {str(e)}")

async def main():
    """Main execution"""
    try:
        print("🏠 SHELTR Knowledge Base - Simplified Ingestion")
        print("===============================================")
        
        # Initialize Firebase via our services
        from firebase_admin import firestore
        import firebase_admin
        
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
            print("✅ Firebase initialized")
        
        ingestor = SimpleDocumentIngestor()
        await ingestor.ingest_all_documents()
        
    except Exception as e:
        logger.error(f"Ingestion failed: {str(e)}")
        print(f"❌ Failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
