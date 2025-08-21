"""
Knowledge Dashboard Service for SHELTR-AI
Handles knowledge document management, Firebase Storage integration, and embeddings
"""

import os
import re
from datetime import datetime
from typing import List, Dict, Optional, Any
from firebase_admin import firestore, storage
import logging

logger = logging.getLogger(__name__)

class KnowledgeDashboardService:
    """Service for managing knowledge documents and dashboard data"""
    
    def __init__(self):
        self.db = firestore.client()
        self.storage_client = storage.client()
        self.bucket = self.storage_client.bucket('sheltr-ai.firebasestorage.app')
    
    async def get_knowledge_documents(self) -> List[Dict[str, Any]]:
        """Get all knowledge documents from Firebase Storage and Firestore"""
        try:
            documents = []
            
            # Get documents from Firestore knowledge_documents collection
            firestore_docs = self.db.collection('knowledge_documents').stream()
            
            for doc in firestore_docs:
                doc_data = doc.to_dict()
                doc_data['id'] = doc.id
                
                # Get additional metadata from knowledge_chunks if available
                chunks_query = self.db.collection('knowledge_chunks').where('document_id', '==', doc.id)
                chunks = list(chunks_query.stream())
                doc_data['chunk_count'] = len(chunks)
                
                # Calculate word count from content
                content = doc_data.get('content', '')
                doc_data['word_count'] = len(content.split()) if content else 0
                
                # Get file size from Firebase Storage if available
                file_path = doc_data.get('file_path', '')
                if file_path:
                    try:
                        blob = self.bucket.blob(file_path)
                        if blob.exists():
                            doc_data['file_size'] = blob.size
                        else:
                            doc_data['file_size'] = len(content.encode('utf-8'))  # Fallback to content size
                    except Exception as e:
                        logger.warning(f"Could not get file size for {file_path}: {e}")
                        doc_data['file_size'] = len(content.encode('utf-8'))
                else:
                    doc_data['file_size'] = len(content.encode('utf-8'))
                
                documents.append(doc_data)
            
            # If no Firestore documents, try to get from Firebase Storage directly
            if not documents:
                documents = await self._get_documents_from_storage()
            
            return documents
            
        except Exception as e:
            logger.error(f"Failed to get knowledge documents: {str(e)}")
            # Fallback to storage-only approach
            return await self._get_documents_from_storage()
    
    async def _get_documents_from_storage(self) -> List[Dict[str, Any]]:
        """Get documents directly from Firebase Storage knowledge-base/public folder"""
        try:
            documents = []
            
            # List all files in the knowledge-base/public folder
            blobs = self.bucket.list_blobs(prefix='knowledge-base/public/')
            
            for blob in blobs:
                if blob.name.endswith('.md') or blob.name.endswith('.txt'):
                    # Download and read the file content
                    content = blob.download_as_text()
                    
                    # Extract title from filename or first line
                    filename = os.path.basename(blob.name)
                    title = filename.replace('.md', '').replace('.txt', '').replace('-', ' ').replace('_', ' ').title()
                    
                    # Try to extract title from first line if it's a markdown heading
                    lines = content.split('\n')
                    for line in lines:
                        if line.strip().startswith('# '):
                            title = line.strip()[2:].strip()
                            break
                    
                    # Create document object
                    doc = {
                        'id': blob.name.replace('/', '_').replace('.', '_'),
                        'title': title,
                        'content': content,
                        'file_path': blob.name,
                        'file_type': 'markdown' if blob.name.endswith('.md') else 'text',
                        'file_size': blob.size,
                        'category': self._categorize_document(filename, content),
                        'tags': self._extract_tags(filename, content),
                        'status': 'active',
                        'embedding_status': 'pending',  # Will need to check chunks collection
                        'created_at': blob.time_created.isoformat() if blob.time_created else datetime.now().isoformat(),
                        'updated_at': blob.updated.isoformat() if blob.updated else datetime.now().isoformat(),
                        'created_by': 'System Import',
                        'view_count': 0,
                        'chunk_count': 0,
                        'word_count': len(content.split())
                    }
                    
                    # Check if embeddings exist
                    chunks_query = self.db.collection('knowledge_chunks').where('document_id', '==', doc['id'])
                    chunks = list(chunks_query.stream())
                    if chunks:
                        doc['chunk_count'] = len(chunks)
                        doc['embedding_status'] = 'completed'
                    
                    documents.append(doc)
            
            return documents
            
        except Exception as e:
            logger.error(f"Failed to get documents from storage: {str(e)}")
            return []
    
    def _categorize_document(self, filename: str, content: str) -> str:
        """Categorize document based on filename and content"""
        filename_lower = filename.lower()
        content_lower = content.lower()
        
        if 'tokenomics' in filename_lower or 'token' in content_lower:
            return 'Tokenomics'
        elif 'blockchain' in filename_lower or 'blockchain' in content_lower:
            return 'Technology'
        elif 'whitepaper' in filename_lower or 'white paper' in content_lower:
            return 'Documentation'
        elif 'guide' in filename_lower or 'guide' in content_lower:
            return 'Documentation'
        elif 'hacking' in filename_lower or 'homelessness' in content_lower:
            return 'Platform'
        elif 'system' in filename_lower or 'design' in content_lower:
            return 'Platform'
        elif 'readme' in filename_lower:
            return 'Documentation'
        else:
            return 'Platform'
    
    def _extract_tags(self, filename: str, content: str) -> List[str]:
        """Extract tags from filename and content"""
        tags = []
        filename_lower = filename.lower()
        content_lower = content.lower()
        
        # Extract tags from filename
        if 'tokenomics' in filename_lower:
            tags.extend(['tokenomics', 'tokens', 'economics'])
        if 'blockchain' in filename_lower:
            tags.extend(['blockchain', 'technology'])
        if 'whitepaper' in filename_lower:
            tags.extend(['whitepaper', 'documentation'])
        if 'guide' in filename_lower:
            tags.extend(['guide', 'documentation'])
        if 'hacking' in filename_lower:
            tags.extend(['homelessness', 'social-impact'])
        if 'system' in filename_lower:
            tags.extend(['system', 'architecture'])
        
        # Extract common terms from content
        content_words = content_lower.split()
        common_terms = ['blockchain', 'homelessness', 'donations', 'transparency', 'technology', 'platform', 'shelter', 'participant', 'donor']
        
        for term in common_terms:
            if term in content_words and term not in tags:
                tags.append(term)
        
        return tags[:5]  # Limit to 5 tags
    
    async def get_knowledge_stats(self) -> Dict[str, Any]:
        """Get knowledge base statistics"""
        try:
            documents = await self.get_knowledge_documents()
            
            total_documents = len(documents)
            total_size = sum(doc.get('file_size', 0) for doc in documents)
            active_documents = len([doc for doc in documents if doc.get('status') == 'active'])
            pending_embeddings = len([doc for doc in documents if doc.get('embedding_status') == 'pending'])
            total_chunks = sum(doc.get('chunk_count', 0) for doc in documents)
            total_words = sum(doc.get('word_count', 0) for doc in documents)
            
            # Get unique categories
            categories = set(doc.get('category', 'Uncategorized') for doc in documents)
            categories_count = len(categories)
            
            return {
                'total_documents': total_documents,
                'total_size': total_size,
                'active_documents': active_documents,
                'pending_embeddings': pending_embeddings,
                'total_chunks': total_chunks,
                'total_words': total_words,
                'categories_count': categories_count,
                'last_updated': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get knowledge stats: {str(e)}")
            return {
                'total_documents': 0,
                'total_size': 0,
                'active_documents': 0,
                'pending_embeddings': 0,
                'total_chunks': 0,
                'total_words': 0,
                'categories_count': 0,
                'last_updated': datetime.now().isoformat()
            }
    
    async def create_knowledge_document(self, document_data: Dict[str, Any]) -> str:
        """Create a new knowledge document"""
        try:
            # Add to Firestore
            doc_ref = self.db.collection('knowledge_documents').add({
                'title': document_data['title'],
                'content': document_data['content'],
                'category': document_data['category'],
                'tags': document_data.get('tags', []),
                'status': document_data.get('status', 'active'),
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP,
                'created_by': document_data.get('created_by', 'Super Admin'),
                'view_count': 0,
                'file_path': f"knowledge-base/public/{document_data['title'].lower().replace(' ', '-')}.md"
            })
            
            # Upload to Firebase Storage
            file_path = f"knowledge-base/public/{document_data['title'].lower().replace(' ', '-')}.md"
            blob = self.bucket.blob(file_path)
            blob.upload_from_string(document_data['content'], content_type='text/markdown')
            
            logger.info(f"Created knowledge document: {doc_ref[1].id}")
            return doc_ref[1].id
            
        except Exception as e:
            logger.error(f"Failed to create knowledge document: {str(e)}")
            raise
    
    async def update_knowledge_document(self, document_id: str, updates: Dict[str, Any]) -> bool:
        """Update an existing knowledge document"""
        try:
            # Update in Firestore
            doc_ref = self.db.collection('knowledge_documents').document(document_id)
            doc_ref.update({
                **updates,
                'updated_at': firestore.SERVER_TIMESTAMP
            })
            
            # Update in Firebase Storage if content changed
            if 'content' in updates:
                doc = doc_ref.get()
                if doc.exists:
                    file_path = doc.to_dict().get('file_path', f"knowledge-base/public/{updates.get('title', 'document')}.md")
                    blob = self.bucket.blob(file_path)
                    blob.upload_from_string(updates['content'], content_type='text/markdown')
            
            logger.info(f"Updated knowledge document: {document_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update knowledge document: {str(e)}")
            return False
    
    async def delete_knowledge_document(self, document_id: str) -> bool:
        """Delete a knowledge document"""
        try:
            # Get document details
            doc = self.db.collection('knowledge_documents').document(document_id).get()
            if doc.exists:
                file_path = doc.to_dict().get('file_path', '')
                
                # Delete from Firebase Storage
                if file_path:
                    blob = self.bucket.blob(file_path)
                    if blob.exists():
                        blob.delete()
                
                # Delete chunks
                chunks_query = self.db.collection('knowledge_chunks').where('document_id', '==', document_id)
                chunks = list(chunks_query.stream())
                for chunk in chunks:
                    chunk.reference.delete()
                
                # Delete from Firestore
                doc.reference.delete()
            
            logger.info(f"Deleted knowledge document: {document_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete knowledge document: {str(e)}")
            return False
