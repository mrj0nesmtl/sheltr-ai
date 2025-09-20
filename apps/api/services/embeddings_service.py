"""
SHELTR-AI Embeddings Service
Generates and manages document embeddings using OpenAI and Firebase
"""

import os
import time
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import asyncio
import numpy as np

# Firebase imports
from firebase_admin import firestore, storage

# OpenAI and processing imports
from services.openai_service import openai_service
import tiktoken

logger = logging.getLogger(__name__)

class EmbeddingsService:
    """Service for generating and managing document embeddings with Firebase storage"""
    
    def __init__(self):
        """Initialize embeddings service with Firebase and OpenAI"""
        # Firebase clients (lazy initialization)
        self._db = None
        self._storage_bucket = None
        
        # OpenAI embeddings configuration - OPTIMIZED FOR QUALITY
        self.embedding_model = "text-embedding-3-small"  # Cost-effective, good quality
        self.max_chunk_size = 800   # Smaller chunks for better granularity
        self.chunk_overlap = 150    # Optimized overlap for better context
        self.max_chunks_per_doc = 75  # Allow more chunks for comprehensive coverage
        
        # Token encoding
        try:
            self.encoding = tiktoken.encoding_for_model("gpt-4o-mini")
        except KeyError:
            self.encoding = tiktoken.get_encoding("cl100k_base")
    
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
    
    async def process_document_embeddings(
        self, 
        document_id: str,
        content: str,
        metadata: Dict[str, Any]
    ) -> List[str]:
        """Generate embeddings for a document and store in Firestore"""
        
        try:
            if not openai_service.is_available():
                raise Exception("OpenAI service not available for embedding generation")
            
            logger.info(f"Generating embeddings for document {document_id}")
            
            # QUALITY ENHANCEMENT: Enhance document metadata and content
            enhanced_metadata = await self._enhance_document_quality(content, metadata)
            enhanced_content = enhanced_metadata.get('enhanced_content', content)
            
            logger.info(f"Document enhanced - Word count: {enhanced_metadata.get('word_count', 0)}, Tags: {len(enhanced_metadata.get('tags', []))}")
            
            # Split enhanced content into chunks
            chunks = await self._split_into_chunks(enhanced_content, enhanced_metadata)
            
            if len(chunks) > self.max_chunks_per_doc:
                logger.warning(f"Document {document_id} has {len(chunks)} chunks, limiting to {self.max_chunks_per_doc}")
                chunks = chunks[:self.max_chunks_per_doc]
            
            chunk_ids = []
            
            # Process chunks in batches to avoid rate limits
            batch_size = 5
            for i in range(0, len(chunks), batch_size):
                batch = chunks[i:i + batch_size]
                batch_results = await self._process_chunk_batch(document_id, batch, i)
                chunk_ids.extend(batch_results)
                
                # Small delay between batches
                if i + batch_size < len(chunks):
                    await asyncio.sleep(1)
            
            logger.info(f"Generated {len(chunk_ids)} embeddings for document {document_id}")
            return chunk_ids
            
        except Exception as e:
            logger.error(f"Failed to generate embeddings for document {document_id}: {str(e)}")
            raise
    
    async def _split_into_chunks(self, content: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Split content into overlapping chunks"""
        
        # Split by paragraphs first, then by sentences if needed
        paragraphs = content.split('\n\n')
        chunks = []
        current_chunk = ""
        current_tokens = 0
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue
            
            paragraph_tokens = self._count_tokens(paragraph)
            
            # If paragraph itself is too long, split by sentences
            if paragraph_tokens > self.max_chunk_size:
                sentences = self._split_by_sentences(paragraph)
                for sentence in sentences:
                    sentence_tokens = self._count_tokens(sentence)
                    
                    if current_tokens + sentence_tokens > self.max_chunk_size and current_chunk:
                        # Save current chunk
                        chunks.append(self._create_chunk(current_chunk, len(chunks), metadata))
                        
                        # Start new chunk with overlap
                        overlap_text = self._get_overlap_text(current_chunk)
                        current_chunk = overlap_text + " " + sentence
                        current_tokens = self._count_tokens(current_chunk)
                    else:
                        current_chunk += " " + sentence if current_chunk else sentence
                        current_tokens += sentence_tokens
            else:
                # Regular paragraph processing
                if current_tokens + paragraph_tokens > self.max_chunk_size and current_chunk:
                    # Save current chunk
                    chunks.append(self._create_chunk(current_chunk, len(chunks), metadata))
                    
                    # Start new chunk with overlap
                    overlap_text = self._get_overlap_text(current_chunk)
                    current_chunk = overlap_text + "\n\n" + paragraph
                    current_tokens = self._count_tokens(current_chunk)
                else:
                    current_chunk += "\n\n" + paragraph if current_chunk else paragraph
                    current_tokens += paragraph_tokens
        
        # Add final chunk if not empty
        if current_chunk.strip():
            chunks.append(self._create_chunk(current_chunk, len(chunks), metadata))
        
        logger.info(f"Split content into {len(chunks)} chunks")
        return chunks
    
    def _create_chunk(self, content: str, index: int, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Create a chunk object with metadata"""
        return {
            'content': content.strip(),
            'chunk_index': index,
            'token_count': self._count_tokens(content),
            'char_count': len(content),
            'metadata': metadata
        }
    
    def _split_by_sentences(self, text: str) -> List[str]:
        """Split text by sentences"""
        # Simple sentence splitting
        import re
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    def _get_overlap_text(self, text: str, target_tokens: int = None) -> str:
        """Get overlap text from end of chunk"""
        if target_tokens is None:
            target_tokens = self.chunk_overlap
        
        words = text.split()
        overlap_words = []
        overlap_tokens = 0
        
        # Take words from the end until we reach target tokens
        for word in reversed(words):
            word_tokens = self._count_tokens(word)
            if overlap_tokens + word_tokens > target_tokens:
                break
            overlap_words.insert(0, word)
            overlap_tokens += word_tokens
        
        return " ".join(overlap_words)
    
    async def _process_chunk_batch(
        self, 
        document_id: str, 
        chunks: List[Dict[str, Any]], 
        batch_start_index: int
    ) -> List[str]:
        """Process a batch of chunks for embedding generation"""
        
        chunk_ids = []
        
        for i, chunk in enumerate(chunks):
            try:
                # Generate embedding
                embedding_response = await openai_service.client.embeddings.create(
                    model=self.embedding_model,
                    input=chunk['content']
                )
                
                embedding_vector = embedding_response.data[0].embedding
                
                # Store chunk in Firestore
                chunk_data = {
                    'document_id': document_id,
                    'chunk_index': batch_start_index + i,
                    'content': chunk['content'],
                    'embedding': embedding_vector,
                    'token_count': chunk['token_count'],
                    'char_count': chunk['char_count'],
                    'created_at': firestore.SERVER_TIMESTAMP,
                    'metadata': chunk['metadata']
                }
                
                # Add to Firestore
                chunk_ref = self.db.collection('knowledge_chunks').add(chunk_data)
                chunk_id = chunk_ref[1].id
                chunk_ids.append(chunk_id)
                
                logger.debug(f"Generated embedding for chunk {chunk_id}")
                
            except Exception as e:
                logger.error(f"Failed to process chunk {i} for document {document_id}: {str(e)}")
                continue
        
        return chunk_ids
    
    async def semantic_search(
        self, 
        query: str,
        user_role: str = "participant",
        categories: Optional[List[str]] = None,
        shelter_id: Optional[str] = None,
        limit: int = 5,
        similarity_threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """Perform semantic search across knowledge base"""
        
        try:
            if not openai_service.is_available():
                return []
            
            # Generate query embedding
            query_embedding = await self._generate_query_embedding(query)
            
            # Build Firestore query with filters
            chunks_query = self.db.collection('knowledge_chunks')
            
            # Apply category filter if specified
            if categories:
                # We'll filter in memory since Firestore doesn't support array_contains_any with embeddings
                pass
            
            # Get all chunks (in production, consider pagination)
            chunks = chunks_query.limit(500).stream()  # Limit for performance
            
            # Calculate similarities
            similarities = []
            for chunk_doc in chunks:
                chunk_data = chunk_doc.to_dict()
                
                # Get document metadata for access control
                document_id = chunk_data['document_id']
                
                # Check access permissions
                if not await self._check_access_permission(document_id, user_role, shelter_id):
                    continue
                
                # Apply category filter
                if categories:
                    doc_category = await self._get_document_category(document_id)
                    if doc_category not in categories:
                        continue
                
                # Calculate cosine similarity
                similarity = self._cosine_similarity(
                    query_embedding, 
                    chunk_data['embedding']
                )
                
                if similarity >= similarity_threshold:
                    similarities.append({
                        'chunk_id': chunk_doc.id,
                        'document_id': document_id,
                        'content': chunk_data['content'],
                        'similarity': similarity,
                        'chunk_index': chunk_data.get('chunk_index', 0),
                        'metadata': chunk_data.get('metadata', {})
                    })
            
            # Sort by similarity and return top results
            similarities.sort(key=lambda x: x['similarity'], reverse=True)
            
            # Enrich with document metadata
            enriched_results = await self._enrich_search_results(similarities[:limit])
            
            logger.info(f"Semantic search for '{query}' returned {len(enriched_results)} results")
            return enriched_results
            
        except Exception as e:
            logger.error(f"Semantic search failed: {str(e)}")
            return []
    
    async def _generate_query_embedding(self, query: str) -> List[float]:
        """Generate embedding for search query"""
        try:
            response = await openai_service.client.embeddings.create(
                model=self.embedding_model,
                input=query
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Query embedding generation failed: {str(e)}")
            raise
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        try:
            np_vec1 = np.array(vec1)
            np_vec2 = np.array(vec2)
            
            dot_product = np.dot(np_vec1, np_vec2)
            magnitude1 = np.linalg.norm(np_vec1)
            magnitude2 = np.linalg.norm(np_vec2)
            
            if magnitude1 == 0 or magnitude2 == 0:
                return 0.0
                
            return float(dot_product / (magnitude1 * magnitude2))
        except Exception as e:
            logger.error(f"Cosine similarity calculation failed: {str(e)}")
            return 0.0
    
    async def _check_access_permission(
        self, 
        document_id: str, 
        user_role: str, 
        shelter_id: Optional[str]
    ) -> bool:
        """Check if user has access to document"""
        try:
            # Get document metadata
            doc_ref = self.db.collection('knowledge_documents').document(document_id)
            doc_data = doc_ref.get()
            
            if not doc_data.exists:
                return False
            
            doc_dict = doc_data.to_dict()
            access_level = doc_dict.get('access_level', 'public')
            
            # Access control logic
            if access_level == 'public':
                return True
            elif access_level == 'internal':
                return user_role in ['admin', 'super_admin']
            elif access_level == 'shelter-specific':
                return (user_role in ['admin', 'super_admin'] and 
                        shelter_id == doc_dict.get('shelter_id'))
            
            return False
            
        except Exception as e:
            logger.error(f"Access permission check failed: {str(e)}")
            return False
    
    async def _get_document_category(self, document_id: str) -> str:
        """Get document category"""
        try:
            doc_ref = self.db.collection('knowledge_documents').document(document_id)
            doc_data = doc_ref.get()
            
            if doc_data.exists:
                return doc_data.to_dict().get('category', 'general')
            return 'general'
        except Exception:
            return 'general'
    
    async def _enrich_search_results(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Enrich search results with document metadata"""
        enriched = []
        
        for result in results:
            try:
                # Get document details
                doc_ref = self.db.collection('knowledge_documents').document(result['document_id'])
                doc_data = doc_ref.get()
                
                if doc_data.exists:
                    doc_dict = doc_data.to_dict()
                    enriched.append({
                        **result,
                        'document_title': doc_dict.get('title', 'Untitled'),
                        'document_category': doc_dict.get('category', 'general'),
                        'document_summary': doc_dict.get('summary', ''),
                        'document_path': doc_dict.get('file_path', ''),
                        'access_level': doc_dict.get('access_level', 'public')
                    })
                else:
                    enriched.append(result)
                    
            except Exception as e:
                logger.error(f"Failed to enrich result: {str(e)}")
                enriched.append(result)
        
        return enriched
    
    def _count_tokens(self, text: str) -> int:
        """Count tokens in text"""
        try:
            return len(self.encoding.encode(text))
        except Exception:
            # Fallback to word count
            return len(text.split())
    
    async def _generate_smart_tags(self, content: str, title: str, category: str = "") -> List[str]:
        """Generate relevant tags using AI analysis"""
        try:
            # Truncate content for analysis (first 1000 chars)
            content_sample = content[:1000] if len(content) > 1000 else content
            
            prompt = f"""Analyze this SHELTR-AI documentation and generate 3-5 relevant tags.
            
Title: {title}
Category: {category}
Content: {content_sample}

Generate tags that would help users find this document. Focus on:
- Technical topics (API, Firebase, React, etc.)
- User roles (admin, participant, donor, etc.) 
- Features (authentication, dashboard, etc.)
- Document types (guide, reference, tutorial, etc.)

Return ONLY the tags as a comma-separated list, no explanations."""

            response = await openai_service.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=60,
                temperature=0.3
            )
            
            tags_text = response.choices[0].message.content.strip()
            tags = [tag.strip().lower() for tag in tags_text.split(',') if tag.strip()]
            
            # Ensure we have at least some tags
            if not tags:
                # Fallback tags based on category and title
                fallback_tags = []
                if category:
                    fallback_tags.append(category.lower())
                if 'api' in title.lower():
                    fallback_tags.append('api')
                if 'guide' in title.lower():
                    fallback_tags.append('guide')
                if 'dashboard' in title.lower():
                    fallback_tags.append('dashboard')
                tags = fallback_tags[:3] if fallback_tags else ['documentation']
            
            logger.info(f"Generated {len(tags)} tags for document: {', '.join(tags)}")
            return tags[:5]  # Limit to 5 tags max
            
        except Exception as e:
            logger.error(f"Failed to generate smart tags: {str(e)}")
            # Return basic fallback tags
            fallback_tags = []
            if category:
                fallback_tags.append(category.lower())
            fallback_tags.append('documentation')
            return fallback_tags[:2]
    
    async def _enhance_document_quality(self, content: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Enhance document metadata for better quality scores"""
        try:
            enhanced_metadata = metadata.copy()
            
            # Generate tags if missing
            if not enhanced_metadata.get('tags') or len(enhanced_metadata.get('tags', [])) == 0:
                title = enhanced_metadata.get('title', '')
                category = enhanced_metadata.get('category', '')
                enhanced_metadata['tags'] = await self._generate_smart_tags(content, title, category)
                logger.info(f"Generated tags for document: {enhanced_metadata['tags']}")
            
            # Enhance content if too short (less than 100 words)
            word_count = len(content.split())
            if word_count < 100:
                try:
                    # Generate a brief summary to add context
                    summary_prompt = f"""Write a brief 2-3 sentence summary of this SHELTR-AI documentation:

Title: {enhanced_metadata.get('title', '')}
Content: {content[:500]}

Summary:"""
                    
                    response = await openai_service.client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=[{"role": "user", "content": summary_prompt}],
                        max_tokens=100,
                        temperature=0.3
                    )
                    
                    summary = response.choices[0].message.content.strip()
                    enhanced_content = content + f"\n\n## Document Summary\n{summary}"
                    enhanced_metadata['enhanced_content'] = enhanced_content
                    enhanced_metadata['word_count'] = len(enhanced_content.split())
                    logger.info(f"Enhanced short document from {word_count} to {enhanced_metadata['word_count']} words")
                    
                except Exception as e:
                    logger.warning(f"Failed to enhance short content: {str(e)}")
                    enhanced_metadata['enhanced_content'] = content
                    enhanced_metadata['word_count'] = word_count
            else:
                enhanced_metadata['enhanced_content'] = content
                enhanced_metadata['word_count'] = word_count
            
            return enhanced_metadata
            
        except Exception as e:
            logger.error(f"Failed to enhance document quality: {str(e)}")
            # Return original metadata with basic enhancements
            enhanced_metadata = metadata.copy()
            enhanced_metadata['enhanced_content'] = content
            enhanced_metadata['word_count'] = len(content.split())
            if not enhanced_metadata.get('tags'):
                enhanced_metadata['tags'] = ['documentation']
            return enhanced_metadata
    
    async def get_embedding_stats(self) -> Dict[str, Any]:
        """Get statistics about stored embeddings"""
        try:
            # Count documents
            docs_ref = self.db.collection('knowledge_documents')
            docs_count = len(list(docs_ref.stream()))
            
            # Count chunks
            chunks_ref = self.db.collection('knowledge_chunks')
            chunks_count = len(list(chunks_ref.stream()))
            
            # Category breakdown
            categories = {}
            for doc in docs_ref.stream():
                doc_data = doc.to_dict()
                category = doc_data.get('category', 'general')
                categories[category] = categories.get(category, 0) + 1
            
            return {
                'total_documents': docs_count,
                'total_chunks': chunks_count,
                'average_chunks_per_doc': chunks_count / docs_count if docs_count > 0 else 0,
                'categories': categories,
                'embedding_model': self.embedding_model,
                'last_updated': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get embedding stats: {str(e)}")
            return {}

# Create singleton instance
embeddings_service = EmbeddingsService()
