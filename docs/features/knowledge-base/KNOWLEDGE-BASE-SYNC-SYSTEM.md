# 🔄 Knowledge Base Sync System

**Last Updated**: December 22, 2024  
**Feature**: GitHub Integration & Synchronization  
**Status**: Active

---

## Overview

The Knowledge Base Sync System provides automated synchronization between GitHub documentation repositories and the SHELTR Knowledge Base. This enables version-controlled documentation management with automatic AI embedding generation.

---

## Architecture

### Components

**1. GitHub Sync Service**
- Scans GitHub repository for markdown files
- Detects new, modified, and deleted documents
- Handles authentication and rate limiting
- Manages file content retrieval

**2. Firestore Integration**
- Stores document metadata and content
- Tracks sync status and timestamps
- Maintains embedding status
- Manages document relationships

**3. Embedding Service**
- Generates AI embeddings for semantic search
- Processes documents in chunks
- Auto-generates tags using GPT-4
- Tracks processing status

**4. Cache Management**
- Invalidates caches after sync
- Ensures metrics accuracy
- Optimizes performance
- Reduces Firestore queries

---

## Sync Types

### 1. GitHub Documentation Sync

**Purpose**: Sync public documentation from GitHub repository

**Source**: `docs/` folder in main repository

**Excluded Directories**:
- `docs/archive/` - Historical documents
- `docs/resources/templates/` - Template files
- `.local-secure-docs/` - Private documents

**Process**:
1. Scan GitHub repository for markdown files
2. Compare with existing Knowledge Base documents
3. Detect changes (new, modified, deleted)
4. Display sync preview
5. User confirms sync
6. Import/update documents in Firestore
7. Generate embeddings for new/modified docs
8. Invalidate cache for fresh metrics

**Permissions**: Authenticated users (Admin+)

### 2. Secure Document Sync

**Purpose**: Sync internal documents from local directory

**Source**: `.local-secure-docs/` folder

**Included Directories**:
- `blog-posts/` - Admin+ access
- `dataroom/` - Investors only
- `fintec/` - Admin+ access
- `founders/` - Founders only
- `leadership/` - Leadership+ access
- `operations/` - Admin+ access

**Excluded Directories**:
- `drafts/` - Work in progress
- `vault/` - Highly sensitive
- `development/` - Dev notes
- `local/` - Personal files

**Process**:
1. Scan local secure docs directory
2. Read file metadata and content
3. Assign permissions based on folder
4. Upload to Firestore with role-based access
5. Upload files to Firebase Storage
6. Generate embeddings
7. Invalidate cache

**Permissions**: Super Admin only

---

## Sync Workflow

### GitHub Sync Flow

```
1. User clicks "Scan for Changes"
   ↓
2. System queries GitHub API
   ↓
3. Compares with Firestore documents
   ↓
4. Displays: X new, Y modified, Z deleted
   ↓
5. User clicks "Sync X Files"
   ↓
6. System processes each file:
   - Creates/updates Firestore document
   - Generates embeddings (10-30s per doc)
   - Updates status to 'completed'
   ↓
7. Invalidates cache (documents + stats)
   ↓
8. Shows success message with stats
```

### Secure Sync Flow

```
1. User clicks "Sync Secure Documents"
   ↓
2. System scans .local-secure-docs/
   ↓
3. Processes each file:
   - Reads content
   - Determines permission level
   - Creates/updates Firestore
   - Uploads to Storage
   ↓
4. Auto-triggers embedding generation
   ↓
5. Processes pending documents:
   - Generates embeddings
   - Updates status
   ↓
6. Invalidates cache
   ↓
7. Shows sync results (created/updated/errors)
```

---

## File Detection

### Change Detection Logic

**New Files**:
- File exists in GitHub but not in Firestore
- Identified by `file_path` comparison

**Modified Files**:
- File exists in both locations
- Content hash differs
- `updated_at` timestamp comparison

**Deleted Files**:
- File exists in Firestore but not in GitHub
- Requires manual deletion confirmation
- Shows in dedicated "Deleted Files" section

### Content Hashing
- Uses MD5 hash for change detection
- Compares GitHub content vs Firestore content
- Triggers re-embedding on modification

---

## Embedding Generation

### Process

**1. Document Enhancement**
- Extracts metadata (title, category, tags)
- Calculates word count
- Generates AI tags using GPT-4
- Splits into chunks (500-1000 words)

**2. Chunk Processing**
- Each chunk processed independently
- Generates embedding vector using OpenAI
- Stores in `knowledge_chunks` collection
- Links to parent document

**3. Status Updates**
- `embedding_status: 'pending'` → Initial state
- `embedding_status: 'processing'` → During generation
- `embedding_status: 'completed'` → Success
- `embedding_status: 'failed'` → Error occurred

### Performance
- Average: 2-5 seconds per document
- Parallel processing for multiple docs
- Progress indicators in UI
- Background processing supported

---

## Cache Management

### Cache Invalidation Strategy

**When to Invalidate**:
- After GitHub sync completes
- After secure document sync
- After embedding generation
- After document deletion
- After cleanup operations

**What Gets Invalidated**:
- `knowledge_documents_all` - Document list cache
- `knowledge_stats` - Metrics cache

**Cache TTL**: 1 hour (3600 seconds)

### Performance Impact
- First request after invalidation: 3-7 seconds
- Subsequent requests: <100ms (cached)
- Reduces Firestore queries by 60-80%

---

## Error Handling

### Common Errors

**GitHub API Rate Limit**
- **Limit**: 5000 requests/hour (authenticated)
- **Solution**: Wait for rate limit reset
- **Prevention**: Batch operations, cache results

**Authentication Failure**
- **Cause**: Invalid or expired GitHub token
- **Solution**: Re-authenticate, check token permissions

**Embedding Generation Failure**
- **Cause**: Empty content, API error, network issue
- **Solution**: Retry, check logs, verify content

**Firestore Permission Denied**
- **Cause**: Insufficient user permissions
- **Solution**: Verify role (Super Admin required)

---

## Monitoring & Logs

### Backend Logs

**Sync Events**:
```
INFO: Scanning GitHub repository: mrj0nesmtl/sheltr-ai
INFO: Found 84 markdown files in repository
INFO: Scan complete: 0 new, 1 modified, 0 deleted
INFO: Successfully synced overview/CHANGELOG-CAPSULE.md with 10 embeddings
INFO: 🔄 Cache invalidated - stats will refresh
```

**Embedding Events**:
```
INFO: Generating embeddings for document vDBvMJQLcLRSujEea81o
INFO: Document enhanced - Word count: 3315, Tags: 2
INFO: Split content into 10 chunks
INFO: Generated 10 embeddings for document
```

### Metrics to Monitor
- Sync duration (should be <10 seconds)
- Embedding generation time (2-5s per doc)
- Pending embeddings count (should be 0)
- Failed sync attempts
- Cache hit rate (should be >60%)

---

## Best Practices

### GitHub Sync
- Run sync after major documentation updates
- Review changes before confirming sync
- Monitor pending embeddings metric
- Delete obsolete files from GitHub first

### Secure Sync
- Organize files by permission level
- Use descriptive filenames
- Avoid empty or stub files
- Move drafts to excluded folder

### Performance
- Sync during off-peak hours for large updates
- Use batch operations when possible
- Monitor backend logs for errors
- Keep documents under 10,000 words

---

## Related Documentation

- [Update Guide](KNOWLEDGE-BASE-UPDATE-GUIDE.md) - Document management workflow
- [Strategy](KNOWLEDGE-BASE-STRATEGY.md) - Expansion and optimization
- [Collections Explained](KNOWLEDGE-BASE-COLLECTIONS-EXPLAINED.md) - Data structure
- [Edit/Delete Flow](KNOWLEDGE-BASE-EDIT-DELETE-FLOW.md) - Management operations

---

## Technical Details

**GitHub API**: REST API v3  
**Authentication**: Personal Access Token  
**Firestore Collections**: `knowledge_documents`, `knowledge_chunks`  
**Storage**: Firebase Cloud Storage  
**Embedding Model**: OpenAI text-embedding-ada-002  
**Cache**: In-memory with TTL
