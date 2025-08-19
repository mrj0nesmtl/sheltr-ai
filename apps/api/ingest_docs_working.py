#!/usr/bin/env python3
"""
SHELTR Knowledge Base Document Ingestion - Working Version
Properly initializes Firebase and ingests documents
"""

import os
import asyncio
import sys
from pathlib import Path
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def ingest_sheltr_documents():
    """Ingest SHELTR documents with proper Firebase initialization"""
    
    try:
        print("🏠 SHELTR Knowledge Base Document Ingestion")
        print("===========================================")
        
        # Initialize Firebase first
        import firebase_admin
        from firebase_admin import credentials, storage
        
        if not firebase_admin._apps:
            storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET", "sheltr-ai.firebasestorage.app")
            firebase_admin.initialize_app(options={
                'storageBucket': storage_bucket
            })
            print(f"✅ Firebase initialized with bucket: {storage_bucket}")
        
        # Now import our services after Firebase is initialized
        from services.knowledge_service import knowledge_service
        
        # Document list
        documents = [
            {
                'path': '/Users/mrjones/Github/Projects/sheltr-ai/README.md',
                'title': 'SHELTR Platform Overview',
                'categories': ['sheltr', 'platform'],
                'access_level': 'public',
                'tags': ['overview', 'main']
            },
            {
                'path': '/Users/mrjones/Github/Projects/sheltr-ai/docs/01-overview/hacking_homelessness.md',
                'title': 'Hacking Homelessness Strategy',
                'categories': ['sheltr', 'strategy'],
                'access_level': 'public',
                'tags': ['homelessness', 'strategy']
            },
            {
                'path': '/Users/mrjones/Github/Projects/sheltr-ai/docs/01-overview/README.md',
                'title': 'SHELTR Overview Documentation',
                'categories': ['sheltr', 'documentation'],
                'access_level': 'public',
                'tags': ['overview', 'docs']
            },
            {
                'path': '/Users/mrjones/Github/Projects/sheltr-ai/docs/06-user-guides/participant-guide.md',
                'title': 'Participant User Guide',
                'categories': ['user_guides', 'participants'],
                'access_level': 'public',
                'tags': ['guide', 'participants']
            },
            {
                'path': '/Users/mrjones/Github/Projects/sheltr-ai/docs/06-user-guides/donor-guide.md',
                'title': 'Donor User Guide',
                'categories': ['user_guides', 'donors'],
                'access_level': 'public',
                'tags': ['guide', 'donors']
            },
            {
                'path': '/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/tokenomics/sheltr-tokenomics.md',
                'title': 'SHELTR Tokenomics and SmartFund Model',
                'categories': ['tokenomics', 'smartfund', 'blockchain'],
                'access_level': 'public',
                'tags': ['tokenomics', 'smartfund', 'donation', 'distribution']
            },
            {
                'path': '/Users/mrjones/Github/Projects/sheltr-ai/docs/06-user-guides/shelter-admin-guide.md',
                'title': 'Shelter Admin Guide',
                'categories': ['user_guides', 'admins'],
                'access_level': 'public',
                'tags': ['guide', 'admin', 'shelter']
            },
            {
                'path': '/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/system-design.md',
                'title': 'SHELTR System Design and Architecture',
                'categories': ['architecture', 'technical'],
                'access_level': 'public',
                'tags': ['architecture', 'design', 'technical']
            },
            {
                'path': '/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/whitepaper_final.md',
                'title': 'SHELTR White Paper',
                'categories': ['whitepaper', 'technical'],
                'access_level': 'public',
                'tags': ['whitepaper', 'blockchain', 'technical']
            },
            {
                'path': '/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/technical/blockchain.md',
                'title': 'SHELTR Blockchain Technical Documentation',
                'categories': ['blockchain', 'technical'],
                'access_level': 'public',
                'tags': ['blockchain', 'smart-contracts', 'technical']
            }
        ]
        
        print(f"📚 Processing {len(documents)} documents")
        print("=" * 50)
        
        processed = 0
        failed = 0
        
        for doc in documents:
            try:
                print(f"\n📄 Processing: {Path(doc['path']).name}")
                
                if not Path(doc['path']).exists():
                    print(f"   ❌ File not found: {doc['path']}")
                    failed += 1
                    continue
                
                result = await knowledge_service.ingest_document(
                    file_path=doc['path'],
                    title=doc['title'],
                    categories=doc['categories'],
                    access_level=doc['access_level'],
                    tags=doc['tags']
                )
                
                if result['success']:
                    print(f"   ✅ Success: {result['chunks_created']} chunks, {result['embeddings_generated']} embeddings")
                    processed += 1
                else:
                    print(f"   ❌ Failed: {result.get('error', 'Unknown error')}")
                    failed += 1
                    
            except Exception as e:
                print(f"   ❌ Error: {str(e)}")
                failed += 1
        
        print("\n" + "=" * 50)
        print(f"🎉 Ingestion Complete!")
        print(f"✅ Processed: {processed}/{len(documents)}")
        print(f"❌ Failed: {failed}/{len(documents)}")
        
        if processed > 0:
            print(f"\n🔍 Testing knowledge search...")
            await test_knowledge_search()
        
    except Exception as e:
        logger.error(f"Ingestion failed: {str(e)}")
        print(f"❌ Critical error: {str(e)}")
        sys.exit(1)

async def test_knowledge_search():
    """Test knowledge search functionality"""
    from services.knowledge_service import knowledge_service
    
    test_queries = [
        "What is SHELTR?",
        "How do participants use the platform?",
        "What is the donation process?"
    ]
    
    for query in test_queries:
        try:
            results = await knowledge_service.search_knowledge(
                query=query,
                user_role="super_admin",
                limit=2
            )
            
            if results['success'] and results['results']:
                print(f"✅ '{query}': Found {len(results['results'])} results")
                for result in results['results']:
                    print(f"     📄 {result.get('title', 'Unknown')} (score: {result.get('similarity_score', 0):.3f})")
            else:
                print(f"⚠️  '{query}': No results found")
                
        except Exception as e:
            print(f"❌ Error testing '{query}': {str(e)}")

if __name__ == "__main__":
    asyncio.run(ingest_sheltr_documents())
