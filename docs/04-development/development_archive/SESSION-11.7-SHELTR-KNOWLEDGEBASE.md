# SESSION 11.7 - SHELTR KNOWLEDGE BASE & FIREBASE EMBEDDINGS
**Date**: August 16, 2025  
**Session Type**: Mini-Session (Post-Session 11.6)  
**Objective**: Implement comprehensive knowledge base system with Firebase embeddings and admin management  

---

## 🎯 **SESSION OBJECTIVES**

### **Primary Goals**
1. **📚 Knowledge Base Architecture** - Design and implement document storage and retrieval system
2. **🔍 Vector Search Integration** - Firebase-based embedding storage and semantic search
3. **👨‍💼 Admin Management Interface** - Document upload, tagging, and knowledge management
4. **🔒 Security & Access Control** - Role-based document access and storage isolation

### **Success Criteria**
- ✅ Document upload and processing pipeline operational
- ✅ Vector embeddings generated and stored in Firebase
- ✅ Semantic search returning relevant knowledge
- ✅ Admin interfaces for knowledge management
- ✅ Secure document access based on user roles
- ✅ RAG (Retrieval-Augmented Generation) integration with chatbot

---

## 🏗️ **KNOWLEDGE BASE ARCHITECTURE**

### **📊 Document Storage Strategy**

#### **Firebase Storage Structure**
```
gs://sheltr-ai-project.appspot.com/
├── knowledge-base/
│   ├── public/                    # World-readable documents
│   │   ├── policies/              # Platform policies, terms
│   │   ├── guides/                # User guides, help docs
│   │   ├── faqs/                  # Frequently asked questions
│   │   └── resources/             # Public resource directories
│   ├── internal/                  # Admin/staff only documents
│   │   ├── procedures/            # Internal procedures
│   │   ├── training/              # Staff training materials
│   │   ├── compliance/            # Regulatory documents
│   │   └── reports/               # Internal reports
│   ├── shelter-specific/          # Shelter-specific knowledge
│   │   ├── {shelter-id}/          # Per-shelter documents
│   │   │   ├── policies/          # Shelter-specific policies
│   │   │   ├── procedures/        # Shelter procedures
│   │   │   ├── resources/         # Local resources
│   │   │   └── contacts/          # Emergency contacts
│   └── embeddings/                # System-only vector storage
│       ├── chunks/                # Document chunks
│       ├── vectors/               # Embedding vectors
│       └── metadata/              # Document metadata
├── uploads/                       # Temporary upload area
│   ├── processing/                # Files being processed
│   └── failed/                    # Failed processing attempts
└── processed/                     # Successfully processed files
    ├── documents/                 # Final document storage
    ├── summaries/                 # Auto-generated summaries
    └── extracted-text/            # Extracted text content
```

#### **Firestore Knowledge Schema**
```typescript
// Collection: knowledge_documents
interface KnowledgeDocument {
  id: string;                      // Auto-generated document ID
  title: string;                   // Document title
  description?: string;            // Optional description
  file_path: string;               // Firebase Storage path
  file_type: string;               // PDF, DOCX, TXT, MD
  file_size: number;               // File size in bytes
  access_level: 'public' | 'internal' | 'shelter-specific';
  shelter_id?: string;             // Required for shelter-specific docs
  tags: string[];                  // Searchable tags
  categories: string[];            // Document categories
  uploaded_by: string;             // User UID who uploaded
  uploaded_at: Timestamp;         // Upload timestamp
  updated_at: Timestamp;          // Last update timestamp
  processed: boolean;              // Processing status
  processing_error?: string;       // Error message if processing failed
  embedding_count: number;         // Number of chunks/embeddings
  summary?: string;                // Auto-generated summary
  metadata: {
    page_count?: number;           // For PDFs
    word_count?: number;           // For text documents
    language?: string;             // Detected language
    source_url?: string;           // If imported from URL
  };
}

// Collection: knowledge_chunks  
interface KnowledgeChunk {
  id: string;                      // Auto-generated chunk ID
  document_id: string;             // Reference to parent document
  chunk_index: number;             // Order within document
  content: string;                 // Text content of chunk
  embedding: number[];             // Vector embedding (1536 dimensions)
  page_number?: number;            // Page number for PDFs
  heading?: string;                // Section heading if detected
  token_count: number;             // Number of tokens in chunk
  created_at: Timestamp;          // Processing timestamp
}

// Collection: knowledge_categories
interface KnowledgeCategory {
  id: string;                      // Category ID
  name: string;                    // Display name
  description: string;             // Category description
  parent_id?: string;              // For hierarchical categories
  access_level: 'public' | 'internal' | 'shelter-specific';
  created_by: string;              // Creator UID
  created_at: Timestamp;
}
```

### **🔍 Vector Search Architecture**

#### **Embedding Generation Strategy**
```python
# apps/api/services/embedding_service.py

import openai
from typing import List, Dict, Any, Optional
import numpy as np
from firebase_admin import firestore
import logging

class EmbeddingService:
    """Service for generating and managing document embeddings"""
    
    def __init__(self):
        self.openai_client = openai.AsyncOpenAI()
        self.db = firestore.client()
        self.embedding_model = "text-embedding-3-small"  # Cost-effective
        self.chunk_size = 1000  # Tokens per chunk
        self.chunk_overlap = 200  # Overlap between chunks
        
    async def generate_embeddings(
        self, 
        document_id: str, 
        text_content: str,
        metadata: Dict[str, Any]
    ) -> List[str]:
        """Generate embeddings for a document and store in Firestore"""
        
        # Split text into chunks
        chunks = await self._split_into_chunks(text_content)
        chunk_ids = []
        
        for i, chunk in enumerate(chunks):
            try:
                # Generate embedding for chunk
                embedding_response = await self.openai_client.embeddings.create(
                    model=self.embedding_model,
                    input=chunk['content']
                )
                
                embedding_vector = embedding_response.data[0].embedding
                
                # Store chunk and embedding in Firestore
                chunk_data = {
                    'document_id': document_id,
                    'chunk_index': i,
                    'content': chunk['content'],
                    'embedding': embedding_vector,
                    'page_number': chunk.get('page_number'),
                    'heading': chunk.get('heading'),
                    'token_count': len(chunk['content'].split()),
                    'created_at': firestore.SERVER_TIMESTAMP
                }
                
                chunk_ref = self.db.collection('knowledge_chunks').add(chunk_data)
                chunk_ids.append(chunk_ref[1].id)
                
            except Exception as e:
                logging.error(f"Failed to generate embedding for chunk {i}: {str(e)}")
                continue
        
        return chunk_ids
    
    async def semantic_search(
        self, 
        query: str, 
        user_role: str,
        shelter_id: Optional[str] = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Perform semantic search across knowledge base"""
        
        # Generate query embedding
        query_embedding = await self._generate_query_embedding(query)
        
        # Get all chunks (in production, use vector database)
        chunks_ref = self.db.collection('knowledge_chunks')
        chunks = chunks_ref.stream()
        
        # Calculate similarities
        similarities = []
        for chunk in chunks:
            chunk_data = chunk.to_dict()
            
            # Check access permissions
            document_id = chunk_data['document_id']
            if not await self._check_access_permission(document_id, user_role, shelter_id):
                continue
                
            # Calculate cosine similarity
            similarity = self._cosine_similarity(
                query_embedding, 
                chunk_data['embedding']
            )
            
            similarities.append({
                'chunk_id': chunk.id,
                'document_id': document_id,
                'content': chunk_data['content'],
                'similarity': similarity,
                'page_number': chunk_data.get('page_number'),
                'heading': chunk_data.get('heading')
            })
        
        # Sort by similarity and return top results
        similarities.sort(key=lambda x: x['similarity'], reverse=True)
        return similarities[:limit]
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        np_vec1 = np.array(vec1)
        np_vec2 = np.array(vec2)
        
        dot_product = np.dot(np_vec1, np_vec2)
        magnitude1 = np.linalg.norm(np_vec1)
        magnitude2 = np.linalg.norm(np_vec2)
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
            
        return dot_product / (magnitude1 * magnitude2)
```

---

## 🛠️ **DOCUMENT PROCESSING PIPELINE**

### **📄 File Processing Service**

#### **Multi-format Document Handler**
```python
# apps/api/services/document_processor.py

import PyPDF2
import docx
import markdown
from typing import Dict, List, Any, Optional
import re
import logging

class DocumentProcessor:
    """Process various document formats for knowledge base ingestion"""
    
    def __init__(self):
        self.supported_formats = {
            '.pdf': self._process_pdf,
            '.docx': self._process_docx,
            '.doc': self._process_doc,
            '.txt': self._process_text,
            '.md': self._process_markdown,
            '.html': self._process_html
        }
    
    async def process_document(
        self, 
        file_path: str, 
        file_type: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process document and extract text content"""
        
        try:
            # Determine processing method
            processor = self.supported_formats.get(file_type.lower())
            if not processor:
                raise ValueError(f"Unsupported file type: {file_type}")
            
            # Extract text content
            content_data = await processor(file_path)
            
            # Generate summary
            summary = await self._generate_summary(content_data['text'])
            
            # Detect language
            language = await self._detect_language(content_data['text'])
            
            return {
                'text_content': content_data['text'],
                'page_count': content_data.get('page_count', 1),
                'word_count': len(content_data['text'].split()),
                'summary': summary,
                'language': language,
                'headings': content_data.get('headings', []),
                'metadata': content_data.get('metadata', {})
            }
            
        except Exception as e:
            logging.error(f"Document processing failed: {str(e)}")
            raise
    
    async def _process_pdf(self, file_path: str) -> Dict[str, Any]:
        """Extract text from PDF file"""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text_content = ""
            page_count = len(pdf_reader.pages)
            
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                text_content += f"\n--- Page {page_num + 1} ---\n{page_text}"
            
            return {
                'text': text_content.strip(),
                'page_count': page_count,
                'metadata': {'source': 'pdf_extraction'}
            }
    
    async def _process_docx(self, file_path: str) -> Dict[str, Any]:
        """Extract text from Word document"""
        doc = docx.Document(file_path)
        text_content = ""
        headings = []
        
        for paragraph in doc.paragraphs:
            if paragraph.style.name.startswith('Heading'):
                headings.append({
                    'level': int(paragraph.style.name[-1]) if paragraph.style.name[-1].isdigit() else 1,
                    'text': paragraph.text,
                    'position': len(text_content)
                })
            text_content += paragraph.text + "\n"
        
        return {
            'text': text_content.strip(),
            'headings': headings,
            'metadata': {'source': 'docx_extraction'}
        }
    
    async def _generate_summary(self, text: str, max_length: int = 200) -> str:
        """Generate document summary using OpenAI"""
        if len(text) < 100:
            return text[:max_length]
        
        try:
            from services.openai_service import OpenAIService
            openai_service = OpenAIService()
            
            summary_prompt = f"""
            Please provide a concise summary of the following document in 2-3 sentences.
            Focus on the main purpose and key information.
            
            Document text:
            {text[:2000]}...
            """
            
            summary = await openai_service.generate_response(
                message=summary_prompt,
                context={'task': 'summarization'},
                system_prompt="You are a document summarization assistant. Provide clear, concise summaries."
            )
            
            return summary[:max_length]
            
        except Exception as e:
            logging.error(f"Summary generation failed: {str(e)}")
            # Fallback to first paragraph
            sentences = text.split('.')[:3]
            return '.'.join(sentences)[:max_length] + '...'
```

### **🔄 Processing Workflow**

#### **Document Upload & Processing Pipeline**
```python
# apps/api/services/knowledge_service.py

class KnowledgeService:
    """Main service for knowledge base management"""
    
    def __init__(self):
        self.document_processor = DocumentProcessor()
        self.embedding_service = EmbeddingService()
        self.storage_client = storage.Client()
        self.db = firestore.client()
    
    async def ingest_document(
        self,
        file_data: bytes,
        filename: str,
        metadata: Dict[str, Any],
        uploaded_by: str
    ) -> str:
        """Complete document ingestion pipeline"""
        
        document_id = None
        try:
            # 1. Validate file and metadata
            await self._validate_upload(file_data, filename, metadata)
            
            # 2. Upload to Firebase Storage
            file_path = await self._upload_to_storage(file_data, filename, metadata)
            
            # 3. Create Firestore document record
            document_id = await self._create_document_record(
                filename, file_path, metadata, uploaded_by
            )
            
            # 4. Process document content
            processing_result = await self.document_processor.process_document(
                file_path, 
                metadata['file_type'],
                metadata
            )
            
            # 5. Generate embeddings
            chunk_ids = await self.embedding_service.generate_embeddings(
                document_id,
                processing_result['text_content'],
                processing_result['metadata']
            )
            
            # 6. Update document record with processing results
            await self._update_document_record(document_id, processing_result, chunk_ids)
            
            logging.info(f"Document {filename} successfully ingested with {len(chunk_ids)} chunks")
            return document_id
            
        except Exception as e:
            logging.error(f"Document ingestion failed: {str(e)}")
            
            # Cleanup on failure
            if document_id:
                await self._cleanup_failed_ingestion(document_id)
            
            raise
    
    async def search_knowledge(
        self,
        query: str,
        user_role: str,
        shelter_id: Optional[str] = None,
        categories: Optional[List[str]] = None,
        limit: int = 5
    ) -> Dict[str, Any]:
        """Search knowledge base with semantic understanding"""
        
        # Perform semantic search
        search_results = await self.embedding_service.semantic_search(
            query, user_role, shelter_id, limit
        )
        
        # Enrich results with document metadata
        enriched_results = []
        for result in search_results:
            doc_ref = self.db.collection('knowledge_documents').document(result['document_id'])
            doc_data = doc_ref.get().to_dict()
            
            enriched_results.append({
                'content': result['content'],
                'similarity_score': result['similarity'],
                'document_title': doc_data.get('title', 'Untitled'),
                'document_category': doc_data.get('categories', []),
                'page_number': result.get('page_number'),
                'heading': result.get('heading'),
                'source_path': doc_data.get('file_path')
            })
        
        return {
            'query': query,
            'results': enriched_results,
            'total_found': len(enriched_results),
            'search_time': time.time()  # Add timing info
        }
```

---

## 👨‍💼 **ADMIN MANAGEMENT INTERFACE**

### **📊 Knowledge Management Dashboard**

#### **React Components for Admin Interface**
```typescript
// apps/web/src/components/admin/KnowledgeManagement.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, Filter, Trash2, Edit } from 'lucide-react';

interface KnowledgeDocument {
  id: string;
  title: string;
  description?: string;
  access_level: 'public' | 'internal' | 'shelter-specific';
  tags: string[];
  categories: string[];
  uploaded_at: string;
  file_size: number;
  embedding_count: number;
}

export function KnowledgeManagement() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Knowledge Base Management</h2>
        <Button onClick={() => setUploadModalOpen(true)} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="policies">Policies</option>
              <option value="procedures">Procedures</option>
              <option value="training">Training</option>
              <option value="resources">Resources</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <DocumentUploadModal
          onClose={() => setUploadModalOpen(false)}
          onSuccess={() => {
            setUploadModalOpen(false);
            // Refresh documents list
          }}
        />
      )}
    </div>
  );
}

function DocumentCard({ document }: { document: KnowledgeDocument }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{document.title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">
          {document.description || 'No description available'}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {document.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{document.embedding_count} chunks</span>
          <span>{Math.round(document.file_size / 1024)}KB</span>
        </div>
        
        <Badge 
          variant={document.access_level === 'public' ? 'default' : 'secondary'}
          className="mt-2"
        >
          {document.access_level}
        </Badge>
      </CardContent>
    </Card>
  );
}
```

#### **Document Upload Component**
```typescript
// apps/web/src/components/admin/DocumentUploadModal.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';

interface DocumentUploadModalProps {
  onClose: () => void;
  onSuccess: (documentId: string) => void;
}

export function DocumentUploadModal({ onClose, onSuccess }: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    access_level: 'internal' as 'public' | 'internal' | 'shelter-specific',
    categories: [] as string[],
    tags: [] as string[]
  });
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onSuccess(result.document_id);
    } catch (error) {
      console.error('Upload error:', error);
      // Handle error display
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Document</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <Label htmlFor="file">Document File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={metadata.title}
              onChange={(e) => setMetadata({...metadata, title: e.target.value})}
              placeholder="Document title"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={metadata.description}
              onChange={(e) => setMetadata({...metadata, description: e.target.value})}
              placeholder="Brief description of the document"
              rows={3}
            />
          </div>

          {/* Access Level */}
          <div>
            <Label htmlFor="access_level">Access Level</Label>
            <Select
              value={metadata.access_level}
              onValueChange={(value) => setMetadata({...metadata, access_level: value as any})}
            >
              <option value="public">Public</option>
              <option value="internal">Internal Only</option>
              <option value="shelter-specific">Shelter Specific</option>
            </Select>
          </div>

          {/* Categories */}
          <div>
            <Label htmlFor="categories">Categories</Label>
            <Input
              id="categories"
              placeholder="policies, procedures, training (comma-separated)"
              onChange={(e) => setMetadata({
                ...metadata, 
                categories: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
              })}
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="emergency, shelter, donation (comma-separated)"
              onChange={(e) => setMetadata({
                ...metadata, 
                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              })}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || !metadata.title || uploading}
            className="flex-1"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔗 **RAG INTEGRATION WITH CHATBOT**

### **🤖 Enhanced Chatbot with Knowledge Retrieval**

#### **RAG-Enhanced Response Generation**
```python
# apps/api/services/chatbot/rag_orchestrator.py

from services.knowledge_service import KnowledgeService
from services.openai_service import OpenAIService

class RAGOrchestrator:
    """Retrieval-Augmented Generation for chatbot responses"""
    
    def __init__(self):
        self.knowledge_service = KnowledgeService()
        self.openai_service = OpenAIService()
        
    async def generate_knowledge_enhanced_response(
        self,
        user_message: str,
        user_role: str,
        conversation_context: Dict[str, Any],
        agent_type: str
    ) -> ChatResponse:
        """Generate response using RAG with knowledge base"""
        
        try:
            # 1. Search knowledge base for relevant information
            knowledge_results = await self.knowledge_service.search_knowledge(
                query=user_message,
                user_role=user_role,
                shelter_id=conversation_context.get('shelter_id'),
                limit=3
            )
            
            # 2. Prepare context with retrieved knowledge
            knowledge_context = self._prepare_knowledge_context(knowledge_results)
            
            # 3. Generate AI response with knowledge context
            enhanced_prompt = self._build_rag_prompt(
                user_message=user_message,
                knowledge_context=knowledge_context,
                agent_type=agent_type,
                conversation_history=conversation_context.get('recent_messages', [])
            )
            
            ai_response = await self.openai_service.generate_response(
                message=enhanced_prompt,
                context=conversation_context,
                system_prompt=self._get_rag_system_prompt(agent_type)
            )
            
            # 4. Generate source citations
            citations = self._generate_citations(knowledge_results)
            
            return ChatResponse(
                message=ai_response,
                actions=await self._generate_knowledge_actions(knowledge_results),
                follow_up=None,
                escalation_triggered=False,
                agent_used=f"{agent_type}_rag",
                metadata={
                    'knowledge_sources': citations,
                    'sources_used': len(knowledge_results['results'])
                }
            )
            
        except Exception as e:
            logging.error(f"RAG response generation failed: {str(e)}")
            # Fallback to standard AI response without knowledge
            return await self._generate_fallback_response(
                user_message, user_role, conversation_context, agent_type
            )
    
    def _prepare_knowledge_context(self, knowledge_results: Dict[str, Any]) -> str:
        """Format knowledge results for AI context"""
        if not knowledge_results['results']:
            return "No specific knowledge base information found for this query."
        
        context_parts = []
        for i, result in enumerate(knowledge_results['results'][:3], 1):
            context_parts.append(f"""
            Knowledge Source {i}:
            Document: {result['document_title']}
            Content: {result['content'][:500]}...
            Relevance: {result['similarity_score']:.2f}
            """)
        
        return "\n".join(context_parts)
    
    def _build_rag_prompt(
        self,
        user_message: str,
        knowledge_context: str,
        agent_type: str,
        conversation_history: List[Dict]
    ) -> str:
        """Build prompt that includes retrieved knowledge"""
        
        return f"""
        Based on the following knowledge from SHELTR's database, please provide a helpful response to the user's question.
        
        RETRIEVED KNOWLEDGE:
        {knowledge_context}
        
        USER'S QUESTION: {user_message}
        
        CONVERSATION HISTORY:
        {self._format_conversation_history(conversation_history)}
        
        Please provide a response that:
        1. Directly addresses the user's question
        2. Uses the retrieved knowledge when relevant
        3. Maintains the {agent_type} agent role
        4. Cites sources when using specific information
        5. Is helpful and actionable
        
        If the retrieved knowledge doesn't contain relevant information, provide a general helpful response based on your role as a {agent_type} agent.
        """
```

### **🔍 Knowledge-Aware Intent Classification**

#### **Enhanced Intent Detection**
```python
# Enhanced intent classifier with knowledge context
class KnowledgeAwareIntentClassifier:
    
    async def classify_with_knowledge(
        self,
        message: str,
        user_role: str,
        knowledge_context: Optional[Dict] = None
    ) -> Intent:
        """Classify intent using both message and available knowledge"""
        
        # First, get basic intent classification
        base_intent = await self.classify(message, user_role)
        
        # If we have relevant knowledge, refine the classification
        if knowledge_context and knowledge_context.get('results'):
            enhanced_classification = await self._enhance_with_knowledge(
                message, base_intent, knowledge_context
            )
            return enhanced_classification
        
        return base_intent
    
    async def _enhance_with_knowledge(
        self,
        message: str,
        base_intent: Intent,
        knowledge_context: Dict
    ) -> Intent:
        """Use knowledge context to refine intent classification"""
        
        # Analyze knowledge results to determine if this is a specific question
        # that can be answered from documentation
        knowledge_coverage = self._analyze_knowledge_coverage(message, knowledge_context)
        
        if knowledge_coverage > 0.8:  # High coverage
            # This can likely be answered from knowledge base
            return Intent(
                category=IntentCategory.INFORMATION,
                subcategory="knowledge_based_inquiry",
                confidence=min(base_intent.confidence + 0.1, 0.95),
                entities={
                    **base_intent.entities,
                    "knowledge_available": True,
                    "knowledge_coverage": knowledge_coverage
                },
                urgency=base_intent.urgency
            )
        
        return base_intent
```

---

## 📋 **IMPLEMENTATION ROADMAP**

### **Phase 1: Foundation (Days 1-2)**
- [ ] **Firebase Storage Setup** - Configure storage buckets and security rules
- [ ] **Firestore Schema** - Create collections for documents, chunks, and categories
- [ ] **Basic Upload API** - Document upload endpoint with basic processing
- [ ] **File Processing** - PDF and text extraction capabilities
- [ ] **Admin Interface Skeleton** - Basic upload and list functionality

### **Phase 2: Embeddings & Search (Days 3-4)**
- [ ] **Embedding Service** - OpenAI embeddings generation and storage
- [ ] **Vector Search** - Semantic search implementation
- [ ] **Search API** - Knowledge search endpoints
- [ ] **Search Interface** - Admin search and management UI
- [ ] **Access Control** - Role-based document access

### **Phase 3: RAG Integration (Days 5-6)**
- [ ] **RAG Orchestrator** - Retrieval-augmented generation service
- [ ] **Chatbot Integration** - Connect knowledge base to chatbot responses
- [ ] **Citation System** - Source attribution for knowledge-based responses
- [ ] **Enhanced UI** - Knowledge management dashboard
- [ ] **Performance Optimization** - Caching and efficient retrieval

### **Phase 4: Advanced Features (Days 7-8)**
- [ ] **Advanced Processing** - Support for DOCX, HTML, and other formats
- [ ] **Auto-categorization** - AI-powered document categorization
- [ ] **Knowledge Graphs** - Relationship mapping between documents
- [ ] **Analytics Dashboard** - Knowledge usage and effectiveness metrics
- [ ] **Bulk Operations** - Batch upload and processing

---

## 🔒 **SECURITY & COMPLIANCE**

### **🛡️ Access Control Matrix**

| Role | Public Documents | Internal Documents | Shelter-Specific | Upload | Manage | Delete |
|------|------------------|-------------------|------------------|---------|---------|---------|
| **Participant** | ✅ Read | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Donor** | ✅ Read | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Admin** | ✅ Read | ✅ Read | ✅ Read (own shelter) | ✅ (shelter docs) | ✅ (shelter docs) | ✅ (shelter docs) |
| **Super Admin** | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |

### **🔐 Firebase Security Rules**
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public documents - readable by all authenticated users
    match /knowledge-base/public/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'super_admin' || 
         request.auth.token.role == 'admin');
    }
    
    // Internal documents - admin and super_admin only
    match /knowledge-base/internal/{allPaths=**} {
      allow read, write: if request.auth != null && 
        (request.auth.token.role == 'super_admin' || 
         request.auth.token.role == 'admin');
    }
    
    // Shelter-specific documents
    match /knowledge-base/shelter-specific/{shelterId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        (request.auth.token.role == 'super_admin' || 
         (request.auth.token.role == 'admin' && 
          request.auth.token.shelter_id == shelterId));
    }
    
    // Embeddings - system only
    match /knowledge-base/embeddings/{allPaths=**} {
      allow read, write: if false; // System access only
    }
  }
}
```

---

**🔄 Next Steps**: Complete knowledge base implementation and testing, then integrate with Session 12 technical perfection goals.
