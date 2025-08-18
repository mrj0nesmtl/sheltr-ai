"""
SHELTR-AI Knowledge Management Service
Complete knowledge base management with document ingestion, search, and administration
"""

import os
import shutil
import logging
from typing import Dict, List, Any, Optional, Union
from datetime import datetime
from pathlib import Path
import tempfile

# Firebase imports
from firebase_admin import firestore, storage
from fastapi import UploadFile

# SHELTR services
from services.document_processor import document_processor
from services.embeddings_service import embeddings_service

logger = logging.getLogger(__name__)

class KnowledgeService:
    """Main service for comprehensive knowledge base management"""
    
    def __init__(self):
        self.document_processor = document_processor
        self.embeddings_service = embeddings_service
        # Firebase clients (lazy initialization)
        self._db = None
        self._storage_bucket = None
        
        # Storage paths
        self.storage_paths = {
            'public': 'knowledge-base/public/',
            'internal': 'knowledge-base/internal/',
            'shelter-specific': 'knowledge-base/shelter-specific/',
            'uploads': 'knowledge-base/uploads/',
            'processed': 'knowledge-base/processed/'
        }
    
    @property
    def db(self):
        """Lazy initialization of Firestore client"""
        if self._db is None:
            self._db = firestore.client()
        return self._db
    
    @property
    def storage_bucket(self):
        """Lazy initialization of Firebase storage bucket"""
        if self._storage_bucket is None:
            bucket_name = os.getenv("FIREBASE_STORAGE_BUCKET", "sheltr-ai.firebasestorage.app")
            self._storage_bucket = storage.bucket(bucket_name)
        return self._storage_bucket
    
    async def ingest_document(
        self,
        file_path: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
        access_level: str = 'public',
        categories: Optional[List[str]] = None,
        tags: Optional[List[str]] = None,
        shelter_id: Optional[str] = None,
        uploaded_by: str = 'system'
    ) -> str:
        """Complete document ingestion pipeline"""
        
        document_id = None
        try:
            logger.info(f"Starting ingestion of {file_path}")
            
            # 1. Validate inputs
            await self._validate_ingestion_params(file_path, access_level, shelter_id)
            
            # 2. Process document content
            processing_result = await self.document_processor.process_document(file_path)
            
            # 3. Upload to Firebase Storage
            storage_path = await self._upload_to_storage(file_path, access_level, shelter_id)
            
            # 4. Create Firestore document record
            document_data = {
                'title': title or processing_result['file_info']['stem'],
                'description': description or processing_result['summary'],
                'file_path': storage_path,
                'file_name': processing_result['file_info']['name'],
                'file_type': processing_result['file_info']['extension'],
                'file_size': processing_result['file_info']['size'],
                'access_level': access_level,
                'shelter_id': shelter_id,
                'category': processing_result['category'],
                'tags': tags or [],
                'categories': categories or [processing_result['category']],
                'uploaded_by': uploaded_by,
                'uploaded_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP,
                'processed': False,
                'processing_error': None,
                'embedding_count': 0,
                'summary': processing_result['summary'],
                'word_count': processing_result['word_count'],
                'content_hash': processing_result['content_hash'],
                'language': processing_result['language'],
                'metadata': {
                    **processing_result['metadata'],
                    'original_path': file_path,
                    'processing_version': '1.0.0'
                }
            }
            
            doc_ref = self.db.collection('knowledge_documents').add(document_data)
            document_id = doc_ref[1].id
            
            logger.info(f"Created document record {document_id}")
            
            # 5. Generate embeddings
            chunk_ids = await self.embeddings_service.process_document_embeddings(
                document_id=document_id,
                content=processing_result['content'],
                metadata={
                    'document_id': document_id,
                    'title': document_data['title'],
                    'category': document_data['category'],
                    'access_level': access_level,
                    'shelter_id': shelter_id
                }
            )
            
            # 6. Update document record with processing results
            await self._update_document_record(document_id, len(chunk_ids))
            
            logger.info(f"Successfully ingested {file_path} as document {document_id} with {len(chunk_ids)} chunks")
            return {
                'success': True,
                'document_id': document_id,
                'chunks_created': len(chunk_ids),
                'embeddings_generated': len(chunk_ids),
                'storage_path': storage_path,
                'categories': categories or [],
                'access_level': access_level
            }
            
        except Exception as e:
            logger.error(f"Document ingestion failed for {file_path}: {str(e)}")
            
            # Cleanup on failure
            if document_id:
                await self._cleanup_failed_ingestion(document_id)
            
            return {
                'success': False,
                'error': str(e),
                'document_id': None,
                'chunks_created': 0,
                'embeddings_generated': 0
            }
    
    async def ingest_from_upload(
        self,
        file: UploadFile,
        title: Optional[str] = None,
        description: Optional[str] = None,
        access_level: str = 'public',
        categories: Optional[List[str]] = None,
        tags: Optional[List[str]] = None,
        shelter_id: Optional[str] = None,
        uploaded_by: str = 'user'
    ) -> str:
        """Ingest document from uploaded file"""
        
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name
        
        try:
            # Process the temporary file
            document_id = await self.ingest_document(
                file_path=temp_path,
                title=title or file.filename,
                description=description,
                access_level=access_level,
                categories=categories,
                tags=tags,
                shelter_id=shelter_id,
                uploaded_by=uploaded_by
            )
            
            return document_id
            
        finally:
            # Clean up temporary file
            os.unlink(temp_path)
    
    async def batch_ingest_documents(self, file_paths: List[str]) -> List[Dict[str, Any]]:
        """Ingest multiple documents from your specified list"""
        
        # Document categorization based on your list
        document_configs = {
            'README.md': {
                'title': 'SHELTR Platform Overview',
                'access_level': 'public',
                'categories': ['sheltr', 'overview']
            },
            'A MillionDollarMurray.pdf': {
                'title': 'Million Dollar Murray - Homelessness Analysis',
                'access_level': 'public',
                'categories': ['sheltr', 'research']
            },
            'hacking_homelessness.md': {
                'title': 'Hacking Homelessness Strategy',
                'access_level': 'public',
                'categories': ['sheltr', 'strategy']
            },
            'SECURITY.md': {
                'title': 'Platform Security Guidelines',
                'access_level': 'internal',
                'categories': ['platform', 'security']
            },
            'dev-roadmap.md': {
                'title': 'Development Roadmap',
                'access_level': 'internal',
                'categories': ['platform', 'development']
            },
            'website-architecture.md': {
                'title': 'Website Architecture Documentation',
                'access_level': 'internal',
                'categories': ['platform', 'architecture']
            },
            'system-design.md': {
                'title': 'System Design Documentation',
                'access_level': 'internal',
                'categories': ['platform', 'architecture']
            },
            'database-schema.md': {
                'title': 'Database Schema Documentation',
                'access_level': 'internal',
                'categories': ['platform', 'database']
            },
            'firestore-setup.md': {
                'title': 'Firestore Setup Guide',
                'access_level': 'internal',
                'categories': ['platform', 'database']
            },
            'adyen-integration.md': {
                'title': 'Adyen Payment Integration',
                'access_level': 'internal',
                'categories': ['platform', 'payments']
            },
            'whitepaper_final.md': {
                'title': 'SHELTR Whitepaper',
                'access_level': 'public',
                'categories': ['tokenomics', 'whitepaper']
            },
            'sheltr-tokenomics.md': {
                'title': 'SHELTR Tokenomics Model',
                'access_level': 'public',
                'categories': ['tokenomics', 'economics']
            },
            'blockchain.md': {
                'title': 'Blockchain Technical Implementation',
                'access_level': 'internal',
                'categories': ['tokenomics', 'technical']
            },
            'shelter-admin-guide.md': {
                'title': 'Shelter Administrator Guide',
                'access_level': 'public',
                'categories': ['user_guides', 'admin']
            },
            'participant-guide.md': {
                'title': 'Participant User Guide',
                'access_level': 'public',
                'categories': ['user_guides', 'participant']
            },
            'donor-guide.md': {
                'title': 'Donor User Guide',
                'access_level': 'public',
                'categories': ['user_guides', 'donor']
            }
        }
        
        results = []
        
        for file_path in file_paths:
            try:
                # Get filename from path
                filename = Path(file_path).name
                config = document_configs.get(filename, {
                    'title': filename,
                    'access_level': 'public',
                    'categories': ['general']
                })
                
                document_id = await self.ingest_document(
                    file_path=file_path,
                    title=config['title'],
                    access_level=config['access_level'],
                    categories=config['categories'],
                    uploaded_by='system_batch'
                )
                
                results.append({
                    'success': True,
                    'file_path': file_path,
                    'document_id': document_id,
                    'title': config['title']
                })
                
            except Exception as e:
                logger.error(f"Failed to ingest {file_path}: {str(e)}")
                results.append({
                    'success': False,
                    'file_path': file_path,
                    'error': str(e)
                })
        
        return results
    
    async def search_knowledge(
        self,
        query: str,
        user_role: str = 'participant',
        categories: Optional[List[str]] = None,
        shelter_id: Optional[str] = None,
        limit: int = 5
    ) -> Dict[str, Any]:
        """Search knowledge base with semantic understanding"""
        
        start_time = datetime.now()
        
        try:
            # Perform semantic search
            search_results = await self.embeddings_service.semantic_search(
                query=query,
                user_role=user_role,
                categories=categories,
                shelter_id=shelter_id,
                limit=limit
            )
            
            search_time = (datetime.now() - start_time).total_seconds()
            
            return {
                'query': query,
                'results': search_results,
                'total_found': len(search_results),
                'search_time_seconds': search_time,
                'user_role': user_role,
                'filters': {
                    'categories': categories,
                    'shelter_id': shelter_id
                },
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Knowledge search failed: {str(e)}")
            return {
                'query': query,
                'results': [],
                'total_found': 0,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    async def get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Get document by ID with metadata"""
        try:
            doc_ref = self.db.collection('knowledge_documents').document(document_id)
            doc_data = doc_ref.get()
            
            if doc_data.exists:
                return {
                    'id': document_id,
                    **doc_data.to_dict()
                }
            return None
        except Exception as e:
            logger.error(f"Failed to get document {document_id}: {str(e)}")
            return None
    
    async def list_documents(
        self,
        user_role: str = 'participant',
        shelter_id: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """List documents with access control"""
        try:
            query = self.db.collection('knowledge_documents')
            
            # Apply access level filter based on user role
            if user_role == 'participant' or user_role == 'donor':
                query = query.where('access_level', '==', 'public')
            elif user_role == 'admin':
                # Admin can see public and internal, plus their shelter-specific
                # Note: Firestore doesn't support complex OR queries, so we'll filter in memory
                pass
            
            # Apply category filter
            if category:
                query = query.where('category', '==', category)
            
            # Apply limit
            query = query.limit(limit)
            
            documents = []
            for doc in query.stream():
                doc_data = doc.to_dict()
                
                # Additional access control filtering
                if await self._check_document_access(doc_data, user_role, shelter_id):
                    documents.append({
                        'id': doc.id,
                        **doc_data
                    })
            
            return documents
            
        except Exception as e:
            logger.error(f"Failed to list documents: {str(e)}")
            return []
    
    async def delete_document(self, document_id: str) -> bool:
        """Delete document and all associated chunks"""
        try:
            # Delete chunks first
            chunks_query = self.db.collection('knowledge_chunks').where('document_id', '==', document_id)
            for chunk in chunks_query.stream():
                chunk.reference.delete()
            
            # Delete document
            self.db.collection('knowledge_documents').document(document_id).delete()
            
            logger.info(f"Deleted document {document_id} and associated chunks")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete document {document_id}: {str(e)}")
            return False
    
    async def get_knowledge_stats(self) -> Dict[str, Any]:
        """Get comprehensive knowledge base statistics"""
        try:
            # Get embedding stats
            embedding_stats = await self.embeddings_service.get_embedding_stats()
            
            # Get additional stats
            docs_ref = self.db.collection('knowledge_documents')
            
            # Access level breakdown
            access_levels = {'public': 0, 'internal': 0, 'shelter-specific': 0}
            total_size = 0
            
            for doc in docs_ref.stream():
                doc_data = doc.to_dict()
                access_level = doc_data.get('access_level', 'public')
                if access_level in access_levels:
                    access_levels[access_level] += 1
                total_size += doc_data.get('file_size', 0)
            
            return {
                **embedding_stats,
                'access_levels': access_levels,
                'total_storage_bytes': total_size,
                'total_storage_mb': round(total_size / (1024 * 1024), 2),
                'service_status': 'operational',
                'last_updated': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get knowledge stats: {str(e)}")
            return {'error': str(e)}
    
    # Private helper methods
    
    async def _validate_ingestion_params(
        self, 
        file_path: str, 
        access_level: str, 
        shelter_id: Optional[str]
    ):
        """Validate ingestion parameters"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if access_level not in ['public', 'internal', 'shelter-specific']:
            raise ValueError(f"Invalid access level: {access_level}")
        
        if access_level == 'shelter-specific' and not shelter_id:
            raise ValueError("shelter_id required for shelter-specific documents")
    
    async def _upload_to_storage(
        self, 
        file_path: str, 
        access_level: str, 
        shelter_id: Optional[str]
    ) -> str:
        """Upload file to Firebase Storage"""
        filename = Path(file_path).name
        
        # Determine storage path
        if access_level == 'shelter-specific':
            storage_path = f"{self.storage_paths['shelter-specific']}{shelter_id}/{filename}"
        else:
            storage_path = f"{self.storage_paths[access_level]}{filename}"
        
        # Upload file
        blob = self.storage_bucket.blob(storage_path)
        blob.upload_from_filename(file_path)
        
        logger.info(f"Uploaded {filename} to {storage_path}")
        return storage_path
    
    async def _update_document_record(self, document_id: str, embedding_count: int):
        """Update document record after successful processing"""
        self.db.collection('knowledge_documents').document(document_id).update({
            'processed': True,
            'embedding_count': embedding_count,
            'processing_error': None,
            'updated_at': firestore.SERVER_TIMESTAMP
        })
    
    async def _cleanup_failed_ingestion(self, document_id: str):
        """Clean up after failed ingestion"""
        try:
            # Delete document record
            self.db.collection('knowledge_documents').document(document_id).delete()
            
            # Delete any chunks that might have been created
            chunks_query = self.db.collection('knowledge_chunks').where('document_id', '==', document_id)
            for chunk in chunks_query.stream():
                chunk.reference.delete()
                
        except Exception as e:
            logger.error(f"Cleanup failed for document {document_id}: {str(e)}")
    
    async def _check_document_access(
        self, 
        doc_data: Dict[str, Any], 
        user_role: str, 
        shelter_id: Optional[str]
    ) -> bool:
        """Check if user has access to document"""
        access_level = doc_data.get('access_level', 'public')
        
        if access_level == 'public':
            return True
        elif access_level == 'internal':
            return user_role in ['admin', 'super_admin']
        elif access_level == 'shelter-specific':
            return (user_role in ['admin', 'super_admin'] and 
                    shelter_id == doc_data.get('shelter_id'))
        
        return False

# Create singleton instance
knowledge_service = KnowledgeService()
