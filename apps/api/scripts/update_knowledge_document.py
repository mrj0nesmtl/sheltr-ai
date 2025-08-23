#!/usr/bin/env python3
"""
Update Knowledge Base Documents with Embedding Regeneration
This script allows you to update KB documents from local markdown files
and regenerate their embeddings for the chatbot system.
"""

import firebase_admin
from firebase_admin import firestore, storage
import os
import sys
import asyncio
from datetime import datetime
import logging

# Add the API directory to the path
sys.path.append('/Users/mrjones/Github/Projects/sheltr-ai/apps/api')

from services.embeddings_service import EmbeddingsService
from services.knowledge_dashboard_service import KnowledgeDashboardService

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class KnowledgeUpdater:
    """Update knowledge documents from local files with embedding regeneration"""
    
    def __init__(self):
        self.db = firestore.client()
        self.bucket = storage.bucket('sheltr-ai.firebasestorage.app')
        self.embeddings_service = EmbeddingsService()
        self.dashboard_service = KnowledgeDashboardService()
    
    async def update_document_from_file(self, local_file_path: str, document_id: str = None):
        """Update a knowledge document from a local markdown file"""
        
        if not os.path.exists(local_file_path):
            logger.error(f"File not found: {local_file_path}")
            return False
        
        filename = os.path.basename(local_file_path)
        logger.info(f"📄 Updating document from: {filename}")
        
        # Read the file content
        try:
            with open(local_file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            logger.error(f"Failed to read file {local_file_path}: {e}")
            return False
        
        # Extract title from first line if it's a markdown heading
        title = filename.replace('.md', '').replace('-', ' ').replace('_', ' ').title()
        lines = content.split('\n')
        for line in lines:
            if line.strip().startswith('# '):
                title = line.strip()[2:].strip()
                break
        
        # Find existing document by filename or title
        if not document_id:
            document_id = await self._find_document_by_filename(filename, title)
        
        if not document_id:
            logger.error(f"Could not find existing document for {filename}")
            logger.info("Available documents:")
            await self._list_available_documents()
            return False
        
        logger.info(f"🔄 Updating document ID: {document_id}")
        
        # Update the document content
        updates = {
            'title': title,
            'content': content,
            'updated_at': firestore.SERVER_TIMESTAMP,
            'file_size': len(content.encode('utf-8')),
            'word_count': len(content.split())
        }
        
        try:
            # Update Firestore document
            doc_ref = self.db.collection('knowledge_documents').document(document_id)
            doc_ref.update(updates)
            
            # Update Firebase Storage
            storage_path = f"knowledge-base/public/{filename}"
            blob = self.bucket.blob(storage_path)
            blob.upload_from_string(content, content_type='text/markdown')
            
            logger.info(f"✅ Updated document content and storage")
            
            # Regenerate embeddings
            await self._regenerate_embeddings(document_id, content, title)
            
            logger.info(f"🎉 Successfully updated {title}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update document: {e}")
            return False
    
    async def _find_document_by_filename(self, filename: str, title: str) -> str:
        """Find document ID by filename or title"""
        
        # Try to find by file_path first
        docs = self.db.collection('knowledge_documents').where('file_path', '==', f'knowledge-base/public/{filename}').stream()
        for doc in docs:
            logger.info(f"Found document by file path: {doc.id}")
            return doc.id
        
        # Try to find by title
        docs = self.db.collection('knowledge_documents').where('title', '==', title).stream()
        for doc in docs:
            logger.info(f"Found document by title: {doc.id}")
            return doc.id
        
        # Try partial title match
        all_docs = self.db.collection('knowledge_documents').stream()
        for doc in all_docs:
            data = doc.to_dict()
            doc_title = data.get('title', '').lower()
            if filename.lower().replace('.md', '').replace('-', ' ').replace('_', ' ') in doc_title:
                logger.info(f"Found document by partial match: {doc.id} - {data.get('title')}")
                return doc.id
        
        return None
    
    async def _regenerate_embeddings(self, document_id: str, content: str, title: str):
        """Regenerate embeddings for updated document"""
        
        logger.info(f"🧠 Regenerating embeddings for: {title}")
        
        try:
            # Delete existing chunks
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
            
            # Update document with new chunk count
            doc_ref = self.db.collection('knowledge_documents').document(document_id)
            doc_ref.update({
                'embedding_count': len(chunk_ids),
                'processed': True,
                'embedding_status': 'completed'
            })
            
            logger.info(f"✅ Generated {len(chunk_ids)} new embedding chunks")
            
        except Exception as e:
            logger.error(f"Failed to regenerate embeddings: {e}")
            # Update document to show embedding failed
            doc_ref = self.db.collection('knowledge_documents').document(document_id)
            doc_ref.update({
                'embedding_status': 'failed',
                'processed': False
            })
    
    async def _list_available_documents(self):
        """List all available documents for reference"""
        docs = self.db.collection('knowledge_documents').stream()
        
        print("\n📋 Available documents:")
        for doc in docs:
            data = doc.to_dict()
            title = data.get('title', 'Untitled')
            file_path = data.get('file_path', 'No path')
            print(f"   ID: {doc.id}")
            print(f"   Title: {title}")
            print(f"   Path: {file_path}")
            print()
    
    async def update_all_from_directory(self, directory_path: str):
        """Update all markdown files from a directory"""
        
        if not os.path.exists(directory_path):
            logger.error(f"Directory not found: {directory_path}")
            return
        
        md_files = [f for f in os.listdir(directory_path) if f.endswith('.md')]
        logger.info(f"📁 Found {len(md_files)} markdown files in {directory_path}")
        
        success_count = 0
        for filename in md_files:
            file_path = os.path.join(directory_path, filename)
            logger.info(f"\n🔄 Processing: {filename}")
            
            if await self.update_document_from_file(file_path):
                success_count += 1
            else:
                logger.warning(f"⚠️  Failed to update: {filename}")
        
        logger.info(f"\n🎉 Updated {success_count}/{len(md_files)} documents successfully")

async def main():
    """Main function with command line interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Update SHELTR Knowledge Base Documents')
    parser.add_argument('--file', '-f', help='Update single file')
    parser.add_argument('--directory', '-d', help='Update all .md files from directory')
    parser.add_argument('--document-id', help='Specific document ID to update (optional)')
    parser.add_argument('--list', '-l', action='store_true', help='List all available documents')
    
    args = parser.parse_args()
    
    updater = KnowledgeUpdater()
    
    if args.list:
        await updater._list_available_documents()
        return
    
    if args.file:
        success = await updater.update_document_from_file(args.file, args.document_id)
        if success:
            logger.info("✅ Document updated successfully!")
        else:
            logger.error("❌ Document update failed!")
    
    elif args.directory:
        await updater.update_all_from_directory(args.directory)
    
    else:
        print("Usage examples:")
        print("  python3 update_knowledge_document.py --file /path/to/document.md")
        print("  python3 update_knowledge_document.py --directory /path/to/docs/")
        print("  python3 update_knowledge_document.py --list")
        print("  python3 update_knowledge_document.py --file document.md --document-id abc123")

if __name__ == "__main__":
    asyncio.run(main())
