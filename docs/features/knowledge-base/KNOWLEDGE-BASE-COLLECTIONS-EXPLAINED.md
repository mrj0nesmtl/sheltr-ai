# 🗄️ Knowledge Base Collections Explained

**Last Updated**: December 22, 2024  
**Feature**: Data Structure & Firestore Schema  
**Status**: Active

---

## Overview

The Knowledge Base uses two primary Firestore collections to store and manage documentation: `knowledge_documents` for document metadata and content, and `knowledge_chunks` for AI-processable text segments. This document explains the structure, relationships, and usage of these collections.

---

## Collection Architecture

### High-Level Structure

```
Firestore Database
├── knowledge_documents (collection)
│   ├── {document_id} (document)
│   │   ├── title: string
│   │   ├── content: string
│   │   ├── file_path: string
│   │   ├── embedding_status: string
│   │   └── ... (metadata fields)
│   └── ...
│
└── knowledge_chunks (collection)
    ├── {chunk_id} (document)
    │   ├── document_id: string (reference)
    │   ├── content: string
    │   ├── embedding: array[1536]
    │   └── ... (metadata fields)
    └── ...
```

---

## knowledge_documents Collection

### Purpose
Stores complete document metadata, content, and management information.

### Schema

```typescript
interface KnowledgeDocument {
  // Identifiers
  id: string;                          // Firestore document ID
  
  // Content
  title: string;                       // Document title
  content: string;                     // Full markdown content
  description?: string;                // Optional summary
  
  // File Information
  file_path: string;                   // Relative path in repo
  file_type: string;                   // 'markdown', 'pdf', etc.
  file_size: number;                   // Size in bytes
  
  // Categorization
  category: string;                    // 'Platform', 'Ecosystem', etc.
  tags: string[];                      // AI-generated tags
  
  // Status & Processing
  status: 'active' | 'processing' | 'inactive';
  embedding_status: 'pending' | 'processing' | 'completed' | 'failed';
  processed: boolean;                  // Has been fully processed
  
  // Metrics
  chunk_count: number;                 // Number of chunks
  word_count: number;                  // Total words
  view_count: number;                  // Times viewed
  embedding_count: number;             // Number of embeddings
  
  // Timestamps
  created_at: string;                  // ISO 8601 timestamp
  updated_at: string;                  // ISO 8601 timestamp
  last_embedding_update?: string;      // Last embedding generation
  
  // Ownership
  created_by: string;                  // User email or 'System'
  uploaded_by?: string;                // Original uploader
  
  // Secure Document Fields
  source_directory?: string;           // For secure docs
  permission_level?: string;           // 'public', 'authenticated', etc.
  is_private: boolean;                 // Access restriction flag
  synced_from_github: boolean;         // Source indicator
  
  // Publishing Flags (Secure Docs)
  published_to_founders?: boolean;
  published_to_ir?: boolean;
  published_to_hub?: boolean;
  
  // GitHub Integration
  github_path?: string;                // Path in GitHub repo
  github_sha?: string;                 // Git commit hash
  github_url?: string;                 // Direct GitHub link
}
```

### Field Details

**Identifiers**:
- `id`: Auto-generated Firestore document ID, used for all references

**Content Fields**:
- `title`: Extracted from first H1 heading or filename
- `content`: Full markdown text, stored as string
- `description`: Optional summary for search results

**File Information**:
- `file_path`: Relative path like `docs/features/knowledge-base.md`
- `file_type`: Usually 'markdown', supports 'pdf', 'txt'
- `file_size`: Calculated from content length

**Categorization**:
- `category`: High-level grouping (Platform, Ecosystem, API, etc.)
- `tags`: AI-generated keywords for search and filtering

**Status Fields**:
- `status`: Document lifecycle state
  - `active`: Available for search and chatbot
  - `processing`: Currently being processed
  - `inactive`: Hidden from search
- `embedding_status`: AI processing state
  - `pending`: Awaiting embedding generation
  - `processing`: Currently generating embeddings
  - `completed`: Embeddings ready
  - `failed`: Error during generation

**Metrics**:
- `chunk_count`: Number of text segments (typically 5-20)
- `word_count`: Total words in document
- `view_count`: User views (future feature)
- `embedding_count`: Same as chunk_count (redundant tracking)

**Permission Fields**:
- `permission_level`: Controls access
  - `public`: Anyone can access
  - `authenticated`: Logged-in users only
  - `admin`: Admin+ only
  - `super_admin`: Super Admin only
  - `founders`: Founders role only
  - `investors`: Investors role only
  - `leadership`: Leadership+ only

---

## knowledge_chunks Collection

### Purpose
Stores text segments with AI embeddings for semantic search and RAG.

### Schema

```typescript
interface KnowledgeChunk {
  // Identifiers
  id: string;                          // Firestore document ID
  document_id: string;                 // Reference to parent document
  
  // Content
  content: string;                     // Text segment (500-1000 words)
  chunk_index: number;                 // Order in document (0-based)
  
  // Embedding
  embedding: number[];                 // Vector (1536 dimensions)
  embedding_model: string;             // 'text-embedding-ada-002'
  
  // Metadata (copied from parent)
  title: string;                       // Parent document title
  category: string;                    // Parent document category
  file_path: string;                   // Parent document path
  tags: string[];                      // Parent document tags
  
  // Timestamps
  created_at: string;                  // ISO 8601 timestamp
  updated_at: string;                  // ISO 8601 timestamp
  
  // Permissions (copied from parent)
  permission_level?: string;           // Access control
  is_private: boolean;                 // Access restriction
}
```

### Field Details

**Identifiers**:
- `id`: Auto-generated chunk ID
- `document_id`: Links chunk to parent document

**Content**:
- `content`: Text segment, typically 500-1000 words
- `chunk_index`: Position in document (0 = first chunk)

**Embedding**:
- `embedding`: 1536-dimensional vector from OpenAI
- `embedding_model`: Model used (currently text-embedding-ada-002)

**Metadata**:
- Copied from parent document for efficient querying
- Avoids need to join collections during search

---

## Relationships

### Document → Chunks (One-to-Many)

```
knowledge_documents/{doc_id}
    ↓ (has many)
knowledge_chunks (where document_id == doc_id)
```

**Query Example**:
```javascript
// Get all chunks for a document
const chunks = await firestore
  .collection('knowledge_chunks')
  .where('document_id', '==', documentId)
  .orderBy('chunk_index', 'asc')
  .get();
```

### Orphaned Documents
Documents with `chunk_count == 0` are considered orphaned and may have:
- Empty content
- Failed embedding generation
- Pending processing

---

## Indexes

### Required Firestore Indexes

**knowledge_documents**:
```
- status (ascending)
- embedding_status (ascending)
- category (ascending)
- created_at (descending)
- permission_level (ascending)
```

**knowledge_chunks**:
```
- document_id (ascending)
- chunk_index (ascending)
- permission_level (ascending)
- category (ascending)
```

**Composite Indexes**:
```
- collection: knowledge_documents
  fields: [status (asc), embedding_status (asc)]

- collection: knowledge_chunks
  fields: [document_id (asc), chunk_index (asc)]

- collection: knowledge_chunks
  fields: [permission_level (asc), category (asc)]
```

---

## Query Patterns

### Common Queries

**1. Get All Active Documents**
```javascript
const docs = await firestore
  .collection('knowledge_documents')
  .where('status', '==', 'active')
  .orderBy('created_at', 'desc')
  .get();
```

**2. Get Documents with Pending Embeddings**
```javascript
const pending = await firestore
  .collection('knowledge_documents')
  .where('embedding_status', '==', 'pending')
  .get();
```

**3. Search Chunks by Embedding Similarity**
```javascript
// Performed by RAG system using vector similarity
// Not a direct Firestore query - uses embedding comparison
```

**4. Get Document with Chunks**
```javascript
// Get document
const doc = await firestore
  .collection('knowledge_documents')
  .doc(documentId)
  .get();

// Get chunks
const chunks = await firestore
  .collection('knowledge_chunks')
  .where('document_id', '==', documentId)
  .orderBy('chunk_index', 'asc')
  .get();
```

**5. Get Public Documents Only**
```javascript
const publicDocs = await firestore
  .collection('knowledge_documents')
  .where('permission_level', '==', 'public')
  .where('status', '==', 'active')
  .get();
```

---

## Data Flow

### Document Creation Flow

```
1. File detected (GitHub sync or Secure sync)
   ↓
2. Create document in knowledge_documents
   - status: 'processing'
   - embedding_status: 'pending'
   - content: full text
   ↓
3. Generate embeddings
   - Split content into chunks
   - Generate embedding for each chunk
   - Create documents in knowledge_chunks
   ↓
4. Update parent document
   - status: 'active'
   - embedding_status: 'completed'
   - chunk_count: number of chunks
   ↓
5. Invalidate cache
```

### Document Update Flow

```
1. Modified file detected
   ↓
2. Update document in knowledge_documents
   - content: new text
   - embedding_status: 'pending'
   - updated_at: current timestamp
   ↓
3. Delete old chunks
   - Remove all chunks with document_id
   ↓
4. Generate new embeddings
   - Create new chunks
   ↓
5. Update parent document
   - embedding_status: 'completed'
   - chunk_count: new count
   ↓
6. Invalidate cache
```

### Document Deletion Flow

```
1. Delete request received
   ↓
2. Delete all chunks
   - Query chunks by document_id
   - Delete each chunk
   ↓
3. Delete document
   - Remove from knowledge_documents
   ↓
4. Invalidate cache
```

---

## Storage Considerations

### Size Estimates

**Per Document** (average):
- Document metadata: ~2 KB
- Content: 5-50 KB
- Total per document: ~10-60 KB

**Per Chunk** (average):
- Chunk metadata: ~1 KB
- Content: 2-5 KB
- Embedding: ~6 KB (1536 floats × 4 bytes)
- Total per chunk: ~10 KB

**Scaling Example**:
- 500 documents × 50 KB = 25 MB
- 5000 chunks × 10 KB = 50 MB
- **Total: ~75 MB** for 500 documents

### Cost Implications

**Firestore Costs** (estimated):
- Storage: $0.18/GB/month → ~$0.01/month for 75 MB
- Reads: $0.06/100K → ~$3/month for 50K reads
- Writes: $0.18/100K → ~$1/month for 5K writes
- **Total: ~$5/month** for typical usage

---

## Best Practices

### Document Management
- Keep documents under 10,000 words
- Use clear, descriptive titles
- Assign appropriate categories
- Set correct permission levels
- Avoid empty documents

### Chunk Optimization
- Optimal chunk size: 500-1000 words
- Maintain context in chunks
- Avoid splitting mid-sentence
- Include relevant metadata

### Query Optimization
- Use indexed fields in queries
- Limit result sets
- Cache frequently accessed data
- Batch operations when possible

---

## Related Documentation

- [Update Guide](KNOWLEDGE-BASE-UPDATE-GUIDE.md) - Document management workflow
- [Sync System](KNOWLEDGE-BASE-SYNC-SYSTEM.md) - GitHub integration
- [Strategy](KNOWLEDGE-BASE-STRATEGY.md) - Expansion and optimization
- [Edit/Delete Flow](KNOWLEDGE-BASE-EDIT-DELETE-FLOW.md) - Management operations

---

## Technical References

**Firestore Documentation**: https://firebase.google.com/docs/firestore  
**OpenAI Embeddings**: https://platform.openai.com/docs/guides/embeddings  
**Vector Search**: Custom implementation using cosine similarity
