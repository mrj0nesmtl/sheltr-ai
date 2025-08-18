#!/usr/bin/env python3
"""
SHELTR Knowledge Base Document Ingestion Script
Ingests all 16 core SHELTR documents into the knowledge base
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

# Import our services after env vars are loaded
from services.knowledge_service import knowledge_service

class SheltrDocumentIngestor:
    """Ingest SHELTR documents with proper categorization and access control"""
    
    def __init__(self):
        self.base_path = Path("/Users/mrjones/Github/Projects/sheltr-ai")
        
        # Document categories and access levels
        self.documents = {
            'SHELTR': {
                'access_level': 'public',
                'category': 'sheltr',
                'files': [
                    'README.md',
                    'docs/01-overview/A MillionDollarMurray.pdf',
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
                    'docs/02-architecture/system-design.md',
                    'docs/03-api/database-schema.md',
                    'docs/03-api/firestore-setup.md',
                    'docs/03-api/README.md',
                    'docs/02-architecture/payment-rails/adyen-integration.md'
                ]
            },
            'TOKENOMICS & BLOCKCHAIN': {
                'access_level': 'internal',
                'category': 'tokenomics',
                'files': [
                    'sheltr-tokens/README.md',
                    'docs/02-architecture/whitepaper_final.md',
                    'docs/02-architecture/tokenomics/sheltr-tokenomics.md',
                    'docs/02-architecture/technical/blockchain.md'
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
    
    async def ingest_all_documents(self):
        """Ingest all SHELTR documents into the knowledge base"""
        total_files = sum(len(category['files']) for category in self.documents.values())
        processed = 0
        failed = 0
        
        print(f"🚀 Starting SHELTR Knowledge Base Ingestion")
        print(f"📚 Total documents to process: {total_files}")
        print("=" * 60)
        
        for category_name, category_info in self.documents.items():
            print(f"\n📂 Processing category: {category_name}")
            print(f"   Access Level: {category_info['access_level']}")
            print(f"   Category: {category_info['category']}")
            
            for file_path in category_info['files']:
                full_path = self.base_path / file_path
                
                try:
                    if not full_path.exists():
                        print(f"   ❌ File not found: {file_path}")
                        failed += 1
                        continue
                    
                    print(f"   📄 Processing: {file_path}")
                    
                    # Ingest document
                    result = await knowledge_service.ingest_document(
                        file_path=str(full_path),
                        title=full_path.name,
                        categories=[category_info['category']],
                        access_level=category_info['access_level'],
                        tags=[category_name.lower(), category_info['category']]
                    )
                    
                    if result['success']:
                        print(f"   ✅ Success: {result['chunks_created']} chunks, {result['embeddings_generated']} embeddings")
                        processed += 1
                    else:
                        print(f"   ❌ Failed: {result.get('error', 'Unknown error')}")
                        failed += 1
                        
                except Exception as e:
                    print(f"   ❌ Error processing {file_path}: {str(e)}")
                    failed += 1
        
        print("\n" + "=" * 60)
        print(f"🎉 Ingestion Complete!")
        print(f"✅ Processed: {processed}/{total_files}")
        print(f"❌ Failed: {failed}/{total_files}")
        
        if processed > 0:
            print(f"\n🔍 Testing knowledge search...")
            await self.test_knowledge_search()
    
    async def test_knowledge_search(self):
        """Test the knowledge base with sample queries"""
        test_queries = [
            "What is SHELTR?",
            "How does the token system work?",
            "What are the user roles?",
            "How do participants use the platform?"
        ]
        
        for query in test_queries:
            try:
                results = await knowledge_service.search_knowledge(
                    query=query,
                    user_role="super_admin",
                    limit=3
                )
                
                if results['success'] and results['results']:
                    print(f"✅ '{query}': Found {len(results['results'])} relevant documents")
                else:
                    print(f"⚠️  '{query}': No results found")
                    
            except Exception as e:
                print(f"❌ Error testing '{query}': {str(e)}")

async def main():
    """Main execution function"""
    try:
        print("🏠 SHELTR Knowledge Base Ingestion")
        print("=================================")
        
        # Initialize Firebase service (like FastAPI does)
        try:
            from services.firebase_service import firebase_service
            logger.info("✅ Firebase service initialized for document ingestion")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Firebase service: {e}")
            print(f"❌ Firebase initialization failed: {e}")
            print("💡 Make sure Firebase credentials are properly configured")
            return
        
        ingestor = SheltrDocumentIngestor()
        await ingestor.ingest_all_documents()
        
    except Exception as e:
        logger.error(f"Ingestion failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
