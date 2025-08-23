#!/usr/bin/env python3
"""
Trigger Pending Embeddings for Knowledge Base Documents
This script finds documents with pending embeddings and generates them.
"""

import firebase_admin
from firebase_admin import firestore, storage
import os
import sys
import asyncio
from datetime import datetime
import logging
from dotenv import load_dotenv

# Load environment variables from .env file (same as main.py)
load_dotenv()

# Add the API directory to the path
sys.path.append('/Users/mrjones/Github/Projects/sheltr-ai/apps/api')

from services.embeddings_service import EmbeddingsService
from services.openai_service import openai_service

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmbeddingProcessor:
    """Process pending embeddings for knowledge documents"""
    
    def __init__(self):
        self.db = firestore.client()
        self.bucket = storage.bucket('sheltr-ai.firebasestorage.app')
        self.embeddings_service = EmbeddingsService()
    
    async def check_openai_availability(self):
        """Check if OpenAI service is available"""
        if not openai_service.is_available():
            logger.error("❌ OpenAI API key not configured!")
            logger.info("💡 To enable embeddings, set OPENAI_API_KEY environment variable")
            return False
        
        logger.info("✅ OpenAI service available")
        return True
    
    async def find_pending_embeddings(self):
        """Find documents that need embeddings generated"""
        
        logger.info("🔍 Finding documents with pending embeddings...")
        
        # Get all knowledge documents
        docs_ref = self.db.collection('knowledge_documents')
        all_docs = list(docs_ref.stream())
        
        pending_docs = []
        
        for doc in all_docs:
            doc_data = doc.to_dict()
            document_id = doc.id
            
            # Check if document has embeddings
            chunks_query = self.db.collection('knowledge_chunks').where('document_id', '==', document_id)
            existing_chunks = list(chunks_query.stream())
            
            embedding_status = doc_data.get('embedding_status', 'pending')
            
            if len(existing_chunks) == 0 or embedding_status == 'pending':
                pending_docs.append({
                    'id': document_id,
                    'title': doc_data.get('title', 'Untitled'),
                    'file_path': doc_data.get('file_path', ''),
                    'content': doc_data.get('content', ''),
                    'existing_chunks': len(existing_chunks)
                })
        
        logger.info(f"📊 Found {len(pending_docs)} documents with pending embeddings")
        return pending_docs
    
    async def generate_embeddings_for_document(self, doc_info):
        """Generate embeddings for a single document"""
        
        document_id = doc_info['id']
        title = doc_info['title']
        content = doc_info['content']
        
        logger.info(f"🧠 Generating embeddings for: {title}")
        
        try:
            # If content is empty, try to get it from storage
            if not content and doc_info['file_path']:
                try:
                    blob = self.bucket.blob(doc_info['file_path'])
                    if blob.exists():
                        content = blob.download_as_text()
                        logger.info(f"📄 Retrieved content from storage: {len(content)} characters")
                except Exception as e:
                    logger.warning(f"⚠️  Could not retrieve content from storage: {e}")
            
            if not content:
                logger.warning(f"⚠️  No content available for {title}, skipping...")
                return False
            
            # Delete existing chunks if any
            if doc_info['existing_chunks'] > 0:
                chunks_query = self.db.collection('knowledge_chunks').where('document_id', '==', document_id)
                existing_chunks = list(chunks_query.stream())
                
                logger.info(f"🗑️  Deleting {len(existing_chunks)} existing chunks")
                for chunk in existing_chunks:
                    chunk.reference.delete()
            
            # Generate new embeddings
            metadata = {
                'document_id': document_id,
                'title': title,
                'category': 'Platform',  # Default category
                'access_level': 'public'
            }
            
            chunk_ids = await self.embeddings_service.process_document_embeddings(
                document_id=document_id,
                content=content,
                metadata=metadata
            )
            
            # Update document with embedding status
            doc_ref = self.db.collection('knowledge_documents').document(document_id)
            doc_ref.update({
                'embedding_count': len(chunk_ids),
                'processed': True,
                'embedding_status': 'completed',
                'embeddings_updated_at': firestore.SERVER_TIMESTAMP
            })
            
            logger.info(f"✅ Generated {len(chunk_ids)} embeddings for: {title}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to generate embeddings for {title}: {e}")
            
            # Update document to show embedding failed
            doc_ref = self.db.collection('knowledge_documents').document(document_id)
            doc_ref.update({
                'embedding_status': 'failed',
                'processed': False,
                'embedding_error': str(e)
            })
            return False
    
    async def process_all_pending(self):
        """Process all documents with pending embeddings"""
        
        logger.info("🚀 Starting embedding generation process...")
        
        # Check OpenAI availability
        if not await self.check_openai_availability():
            logger.info("💡 Embeddings will be marked as pending until OpenAI API key is configured")
            return
        
        # Find pending documents
        pending_docs = await self.find_pending_embeddings()
        
        if not pending_docs:
            logger.info("🎉 No pending embeddings found! All documents are up to date.")
            return
        
        # Process each document
        success_count = 0
        for i, doc_info in enumerate(pending_docs, 1):
            logger.info(f"\n📄 Processing {i}/{len(pending_docs)}: {doc_info['title']}")
            
            if await self.generate_embeddings_for_document(doc_info):
                success_count += 1
            
            # Small delay between documents to avoid rate limits
            if i < len(pending_docs):
                await asyncio.sleep(2)
        
        logger.info(f"\n🎉 Embedding generation complete!")
        logger.info(f"✅ Successfully processed: {success_count}/{len(pending_docs)} documents")
        logger.info(f"❌ Failed: {len(pending_docs) - success_count}/{len(pending_docs)} documents")
    
    async def show_status(self):
        """Show current embedding status"""
        
        logger.info("📊 Knowledge Base Embedding Status")
        logger.info("=" * 50)
        
        # Get all documents
        docs_ref = self.db.collection('knowledge_documents')
        all_docs = list(docs_ref.stream())
        
        total_docs = len(all_docs)
        completed_docs = 0
        pending_docs = 0
        failed_docs = 0
        total_chunks = 0
        
        for doc in all_docs:
            doc_data = doc.to_dict()
            document_id = doc.id
            
            # Check chunks
            chunks_query = self.db.collection('knowledge_chunks').where('document_id', '==', document_id)
            chunks = list(chunks_query.stream())
            chunk_count = len(chunks)
            total_chunks += chunk_count
            
            embedding_status = doc_data.get('embedding_status', 'pending')
            
            if chunk_count > 0 and embedding_status == 'completed':
                completed_docs += 1
            elif embedding_status == 'failed':
                failed_docs += 1
            else:
                pending_docs += 1
        
        logger.info(f"📚 Total Documents: {total_docs}")
        logger.info(f"✅ Completed Embeddings: {completed_docs}")
        logger.info(f"⏳ Pending Embeddings: {pending_docs}")
        logger.info(f"❌ Failed Embeddings: {failed_docs}")
        logger.info(f"🧠 Total Embedding Chunks: {total_chunks}")
        logger.info(f"🤖 Chatbot Ready: {'Yes' if pending_docs == 0 else 'Partial'}")

async def main():
    """Main function with command line interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Process Knowledge Base Embeddings')
    parser.add_argument('--status', '-s', action='store_true', help='Show embedding status')
    parser.add_argument('--process', '-p', action='store_true', help='Process all pending embeddings')
    parser.add_argument('--check-openai', '-c', action='store_true', help='Check OpenAI availability')
    
    args = parser.parse_args()
    
    processor = EmbeddingProcessor()
    
    if args.check_openai:
        await processor.check_openai_availability()
    elif args.status:
        await processor.show_status()
    elif args.process:
        await processor.process_all_pending()
    else:
        print("Usage examples:")
        print("  python3 trigger_pending_embeddings.py --status")
        print("  python3 trigger_pending_embeddings.py --process")
        print("  python3 trigger_pending_embeddings.py --check-openai")

if __name__ == "__main__":
    asyncio.run(main())
