# ✏️ Knowledge Base Edit/Delete Flow

**Last Updated**: December 22, 2024  
**Feature**: Document Management Operations  
**Status**: Active

---

## Overview

The Knowledge Base Edit/Delete Flow describes the processes and user interfaces for modifying and removing documents from the SHELTR Knowledge Base. This includes both frontend operations and backend workflows.

---

## Edit Operations

### Editing GitHub Documents

**Method 1: Edit in Repository**
```
1. Navigate to GitHub repository
   ↓
2. Locate file in docs/ folder
   ↓
3. Click "Edit" button (pencil icon)
   ↓
4. Make changes in GitHub editor
   ↓
5. Commit changes with message
   ↓
6. Push to main branch
   ↓
7. In SHELTR Dashboard:
   - Go to Knowledge Base
   - Click "Scan for Changes"
   - Review detected modifications
   - Click "Sync Files"
   ↓
8. System updates document and regenerates embeddings
   ↓
9. Changes live in ~30 seconds
```

**Method 2: Local Edit + Push**
```
1. Clone repository locally
   ↓
2. Edit markdown file
   ↓
3. Commit: git commit -m "Update: description"
   ↓
4. Push: git push origin main
   ↓
5. Sync in SHELTR Dashboard (same as above)
```

### Editing Secure Documents

**Process**:
```
1. Locate file in .local-secure-docs/
   ↓
2. Open in text editor
   ↓
3. Make changes
   ↓
4. Save file
   ↓
5. In SHELTR Dashboard:
   - Go to Knowledge Base
   - Open "Secure Document Sync"
   - Click "Sync Secure Documents"
   ↓
6. System detects modification
   ↓
7. Updates Firestore and regenerates embeddings
   ↓
8. Changes live in ~30 seconds
```

### Edit via Dashboard (Future Feature)

**Planned UI** (Q1 2025):
```
1. Navigate to document in Knowledge Base
   ↓
2. Click "Edit" button
   ↓
3. Edit in WYSIWYG editor
   ↓
4. Click "Save"
   ↓
5. System:
   - Updates Firestore
   - Regenerates embeddings
   - Optionally commits to GitHub
   ↓
6. Changes live immediately
```

---

## Delete Operations

### Delete GitHub Documents

**Method 1: Delete from Repository**
```
1. Delete file from GitHub repository
   ↓
2. Commit deletion
   ↓
3. Push to main branch
   ↓
4. In SHELTR Dashboard:
   - Go to Knowledge Base
   - Click "Scan for Changes"
   - Review "Files Deleted from GitHub" section
   ↓
5. Option A: Delete individually
   - Click trash icon next to file
   - Confirm deletion
   ↓
6. Option B: Bulk delete
   - Click "Delete All (X)" button
   - Confirm deletion
   ↓
7. System removes from Firestore and deletes chunks
   ↓
8. Metrics update immediately
```

**Method 2: Delete via Dashboard**
```
1. Navigate to document card
   ↓
2. Click "Delete" button (trash icon)
   ↓
3. Confirm deletion dialog
   ↓
4. System:
   - Deletes all chunks
   - Deletes document from Firestore
   - Invalidates cache
   ↓
5. Document removed immediately
```

### Delete Secure Documents

**Process**:
```
1. Remove file from .local-secure-docs/
   OR
   Move to .local-secure-docs/drafts/
   ↓
2. In SHELTR Dashboard:
   - Open "Secure Document Sync"
   - Click "Sync Secure Documents"
   ↓
3. System detects file removal
   ↓
4. Document remains in Firestore (orphaned)
   ↓
5. Click "Clean Up Orphaned Docs"
   ↓
6. Confirm cleanup
   ↓
7. System removes orphaned documents
   ↓
8. Metrics update after page refresh
```

### Cleanup Orphaned Documents

**Purpose**: Remove documents with no content or file path

**Process**:
```
1. Navigate to Knowledge Base Dashboard
   ↓
2. Open "Secure Document Sync" accordion
   ↓
3. Click "Clean Up Orphaned Docs" button
   ↓
4. System scans for orphaned documents:
   - No content AND no file_path
   - OR empty content (0 bytes)
   ↓
5. Confirmation dialog shows:
   "⚠️ This will permanently delete documents 
    with no content and no file path. Continue?"
   ↓
6. Click "OK" to confirm
   ↓
7. System deletes orphaned documents:
   - Removes from Firestore
   - Deletes associated chunks
   - Invalidates cache
   ↓
8. Success alert shows:
   "✅ Cleanup complete!
    Deleted: X orphaned documents
    Errors: Y"
   ↓
9. Metrics update after page refresh
```

---

## User Interface

### Document Card Actions

**Card Layout**:
```
┌─────────────────────────────────────┐
│ 📄 Document Title                   │
│                                     │
│ Quality Score: 85/100               │
│ ████████████░░░░░░░                 │
│                                     │
│ Category: Platform                  │
│ Status: active | embedding: ✓       │
│                                     │
│ 1,234 words | 8 chunks | 42 views  │
│                                     │
│ Last updated: Dec 22, 2025          │
│                                     │
│ [👁 View] [✏️ Edit] [🗑️ Delete]     │
└─────────────────────────────────────┘
```

**Button Actions**:
- **View**: Opens document in read-only modal
- **Edit**: Opens edit interface (future feature)
- **Delete**: Triggers deletion confirmation

### Deletion Confirmation Dialog

**Standard Delete**:
```
┌─────────────────────────────────────┐
│ ⚠️  Confirm Deletion                │
│                                     │
│ Are you sure you want to delete:    │
│ "Document Title"                    │
│                                     │
│ This action cannot be undone.       │
│                                     │
│ [Cancel]              [Delete] ❌   │
└─────────────────────────────────────┘
```

**Bulk Delete**:
```
┌─────────────────────────────────────┐
│ ⚠️  Confirm Bulk Deletion           │
│                                     │
│ Delete 5 documents from GitHub?     │
│                                     │
│ Files to be deleted:                │
│ • docs/old-feature.md               │
│ • docs/deprecated-api.md            │
│ • docs/outdated-guide.md            │
│ • ... and 2 more                    │
│                                     │
│ This action cannot be undone.       │
│                                     │
│ [Cancel]        [Delete All] ❌     │
└─────────────────────────────────────┘
```

**Cleanup Orphaned**:
```
┌─────────────────────────────────────┐
│ ⚠️  Clean Up Orphaned Documents     │
│                                     │
│ This will permanently delete        │
│ documents with no content and       │
│ no file path.                       │
│                                     │
│ Continue?                           │
│                                     │
│ [Cancel]              [OK] ✓        │
└─────────────────────────────────────┘
```

---

## Backend Workflows

### Edit Workflow

```typescript
async function updateDocument(documentId: string, updates: Partial<KnowledgeDocument>) {
  // 1. Update document in Firestore
  await firestore
    .collection('knowledge_documents')
    .doc(documentId)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
      embedding_status: 'pending'
    });
  
  // 2. Delete old chunks
  const oldChunks = await firestore
    .collection('knowledge_chunks')
    .where('document_id', '==', documentId)
    .get();
  
  const deletePromises = oldChunks.docs.map(doc => doc.ref.delete());
  await Promise.all(deletePromises);
  
  // 3. Generate new embeddings
  const chunks = await generateEmbeddings(documentId, updates.content);
  
  // 4. Update document status
  await firestore
    .collection('knowledge_documents')
    .doc(documentId)
    .update({
      embedding_status: 'completed',
      chunk_count: chunks.length,
      embedding_count: chunks.length
    });
  
  // 5. Invalidate cache
  cache.invalidate('knowledge_documents_all');
  cache.invalidate('knowledge_stats');
  
  return { success: true, chunks: chunks.length };
}
```

### Delete Workflow

```typescript
async function deleteDocument(documentId: string) {
  // 1. Delete all chunks
  const chunks = await firestore
    .collection('knowledge_chunks')
    .where('document_id', '==', documentId)
    .get();
  
  const deleteChunks = chunks.docs.map(doc => doc.ref.delete());
  await Promise.all(deleteChunks);
  
  // 2. Delete document
  await firestore
    .collection('knowledge_documents')
    .doc(documentId)
    .delete();
  
  // 3. Invalidate cache
  cache.invalidate('knowledge_documents_all');
  cache.invalidate('knowledge_stats');
  
  return { 
    success: true, 
    deleted_chunks: chunks.size,
    deleted_document: documentId 
  };
}
```

### Bulk Delete Workflow

```typescript
async function bulkDeleteDocuments(githubPaths: string[]) {
  const results = {
    successful: [],
    failed: []
  };
  
  for (const path of githubPaths) {
    try {
      // Find document by github_path or file_path
      const doc = await findDocumentByPath(path);
      
      if (doc) {
        await deleteDocument(doc.id);
        results.successful.push(path);
      }
    } catch (error) {
      results.failed.push({ path, error: error.message });
    }
  }
  
  // Invalidate cache once after all deletions
  cache.invalidate('knowledge_documents_all');
  cache.invalidate('knowledge_stats');
  
  return results;
}
```

### Cleanup Orphaned Workflow

```typescript
async function cleanupOrphanedDocuments() {
  // Query all documents
  const allDocs = await firestore
    .collection('knowledge_documents')
    .get();
  
  const orphaned = [];
  const deleted = [];
  const errors = [];
  
  // Find orphaned documents
  for (const doc of allDocs.docs) {
    const data = doc.data();
    const content = data.content?.trim() || '';
    const filePath = data.file_path?.trim() || '';
    
    // Check if orphaned (no content AND no file_path)
    if (!content && !filePath) {
      orphaned.push({
        id: doc.id,
        title: data.title,
        embedding_status: data.embedding_status
      });
      
      try {
        await deleteDocument(doc.id);
        deleted.push(doc.id);
      } catch (error) {
        errors.push({ id: doc.id, error: error.message });
      }
    }
  }
  
  // Invalidate cache if any deletions
  if (deleted.length > 0) {
    cache.invalidate('knowledge_documents_all');
    cache.invalidate('knowledge_stats');
  }
  
  return {
    success: true,
    deleted: deleted.length,
    errors: errors.length,
    orphaned_documents: orphaned
  };
}
```

---

## Error Handling

### Common Errors

**Delete Button Not Working**:
- **Symptom**: Button click has no effect
- **Cause**: Permission issue, missing document ID, or frontend bug
- **Solution**: Check browser console, verify Super Admin role, use cleanup button

**Partial Deletion**:
- **Symptom**: Document deleted but chunks remain
- **Cause**: Transaction failure or network error
- **Solution**: Run cleanup orphaned docs, check backend logs

**Cache Not Invalidating**:
- **Symptom**: Metrics don't update after deletion
- **Cause**: Cache invalidation not triggered
- **Solution**: Hard refresh page (Cmd+Shift+R), check backend logs

**Permission Denied**:
- **Symptom**: "403 Forbidden" or "Permission denied"
- **Cause**: Insufficient user role
- **Solution**: Verify Super Admin role, check Firebase rules

---

## Permissions

### Role Requirements

**View Documents**:
- Public docs: Anyone
- Authenticated docs: Logged-in users
- Secure docs: Role-specific (Founders, Investors, etc.)

**Edit Documents**:
- GitHub docs: Super Admin (via sync)
- Secure docs: Super Admin (via sync)
- Dashboard edit: Super Admin (future)

**Delete Documents**:
- Individual delete: Super Admin
- Bulk delete: Super Admin
- Cleanup orphaned: Super Admin

---

## Best Practices

### Before Editing
- Review current content
- Check for dependencies (links to/from other docs)
- Plan changes carefully
- Test in staging if available

### Before Deleting
- Verify document is truly obsolete
- Check for references from other documents
- Consider archiving instead of deleting
- Backup if needed

### After Operations
- Verify changes in chatbot responses
- Check metrics dashboard
- Hard refresh to see updates
- Monitor backend logs for errors

---

## Related Documentation

- [Update Guide](KNOWLEDGE-BASE-UPDATE-GUIDE.md) - Document management workflow
- [Sync System](KNOWLEDGE-BASE-SYNC-SYSTEM.md) - GitHub integration
- [Strategy](KNOWLEDGE-BASE-STRATEGY.md) - Expansion and optimization
- [Collections Explained](KNOWLEDGE-BASE-COLLECTIONS-EXPLAINED.md) - Data structure

---

## Future Enhancements

**Planned Features** (Q1 2025):
- In-dashboard WYSIWYG editor
- Bulk edit operations
- Document versioning and rollback
- Soft delete with recovery
- Edit history tracking
- Approval workflows for changes
- Automated backup before deletion

---

## Support

For issues with edit/delete operations:
- Check backend logs: `tail -f logs/backend.log`
- Review frontend console for errors
- Verify Firebase permissions
- Contact platform administrator
