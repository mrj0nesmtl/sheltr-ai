# Knowledge Base Edit & Delete Flow - Complete Explanation

**Version:** 1.0.0  
**Last Updated:** October 16, 2025  
**Status:** ⚠️ IMPORTANT - READ BEFORE EDITING/DELETING DOCS

---

## 🚨 **CRITICAL UNDERSTANDING**

### **The Knowledge Base Dashboard UI is NOT connected to GitHub**

When you edit or delete documents from the Knowledge Base Dashboard UI (`/dashboard/knowledge`), you are **ONLY** modifying:
1. ✅ Firebase Storage (the file itself)
2. ✅ Firestore `knowledge_documents` collection (metadata)
3. ✅ Firestore `knowledge_chunks` collection (embeddings)

You are **NOT** modifying:
- ❌ Your local GitHub repository
- ❌ The remote GitHub repository
- ❌ Your IDE files

---

## 📊 **The Two Separate Worlds**

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR DEVELOPMENT WORKFLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐      ┌──────────┐      ┌──────────────┐         │
│  │   IDE    │ ───> │  GitHub  │ ───> │   Firebase   │         │
│  │  (Edit)  │      │  (Push)  │      │   (Sync)     │         │
│  └──────────┘      └──────────┘      └──────────────┘         │
│       │                  │                    │                 │
│       │                  │                    │                 │
│   Source of            Version              Knowledge          │
│     Truth              Control                Base              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              KNOWLEDGE BASE DASHBOARD UI WORKFLOW                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐     │
│  │  Dashboard   │ ───> │   Firebase   │  ╳   │  GitHub  │     │
│  │   UI Edit    │      │   Storage    │      │ (No Sync)│     │
│  └──────────────┘      └──────────────┘      └──────────┘     │
│                                │                                │
│                                ├─> Firestore (metadata)         │
│                                └─> knowledge_chunks (embeddings)│
│                                                                  │
│  ⚠️ DOES NOT SYNC BACK TO GITHUB!                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **What Happens When You EDIT a Document in the UI**

### **Scenario: You click "Edit" on a document in `/dashboard/knowledge`**

#### **Step 1: Edit Page Opens**
```typescript
// Frontend loads document from Firestore
GET /api/v1/knowledge-dashboard/documents/{document_id}
```

#### **Step 2: You Make Changes**
- Edit title, content, category, tags, privacy settings
- Changes are local in your browser

#### **Step 3: You Click "Save"**
```typescript
// Frontend sends update to backend
PUT /api/v1/knowledge-dashboard/documents/{document_id}
```

#### **Step 4: Backend Updates (3 places)**

```python
# apps/api/services/knowledge_dashboard_service.py
async def update_knowledge_document(document_id, updates):
    
    # 1️⃣ Update Firestore metadata
    doc_ref.update({
        **updates,
        'updated_at': firestore.SERVER_TIMESTAMP
    })
    
    # 2️⃣ Update Firebase Storage file (if content changed)
    if 'content' in updates:
        blob = bucket.blob(file_path)
        blob.upload_from_string(updates['content'])
    
    # 3️⃣ Regenerate embeddings (if content changed)
    if 'content' in updates:
        # Delete old chunks
        old_chunks = knowledge_chunks.where('document_id', '==', document_id)
        for chunk in old_chunks:
            chunk.delete()
        
        # Generate new embeddings
        new_chunks = await embeddings_service.process_document(content)
```

#### **What Gets Updated:**
- ✅ Firebase Storage: `/knowledge-base/public/docs/.../*.md` (the file)
- ✅ Firestore `knowledge_documents`: Metadata (title, category, tags, etc.)
- ✅ Firestore `knowledge_chunks`: New embeddings for RAG search

#### **What Does NOT Get Updated:**
- ❌ Your local repository: `docs/04-development/.../*.md`
- ❌ GitHub repository: `github.com/mrj0nesmtl/sheltr-ai/docs/...`
- ❌ Your IDE files

---

## 🗑️ **What Happens When You DELETE a Document in the UI**

### **Scenario: You click "Delete" on a document in `/dashboard/knowledge`**

#### **Step 1: Confirmation Dialog**
```typescript
// Frontend shows confirmation
"Are you sure you want to delete this document?"
```

#### **Step 2: You Confirm**
```typescript
// Frontend sends delete request
DELETE /api/v1/knowledge-dashboard/documents/{document_id}
```

#### **Step 3: Backend Deletes (3 places)**

```python
# apps/api/services/knowledge_dashboard_service.py
async def delete_knowledge_document(document_id):
    
    # Get document details
    doc = knowledge_documents.document(document_id).get()
    file_path = doc.to_dict().get('file_path')
    
    # 1️⃣ Delete from Firebase Storage
    blob = bucket.blob(file_path)
    if blob.exists():
        blob.delete()  # File is GONE from Firebase Storage
    
    # 2️⃣ Delete all embedding chunks
    chunks = knowledge_chunks.where('document_id', '==', document_id)
    for chunk in chunks:
        chunk.reference.delete()  # All embeddings DELETED
    
    # 3️⃣ Delete from Firestore
    doc.reference.delete()  # Metadata DELETED
```

#### **What Gets Deleted:**
- ✅ Firebase Storage: File is **permanently deleted**
- ✅ Firestore `knowledge_documents`: Metadata is **permanently deleted**
- ✅ Firestore `knowledge_chunks`: All embeddings are **permanently deleted**

#### **What Does NOT Get Deleted:**
- ❌ Your local repository: File still exists in `docs/...`
- ❌ GitHub repository: File still exists on GitHub
- ❌ Your IDE: File is still there

---

## ⚠️ **THE PROBLEM: Sync Conflicts**

### **Scenario: You delete a doc in the UI, then sync from GitHub**

```
1. You delete "DOUBLE-AGENT-CALL-BUG-FIX.md" from Knowledge Base UI
   └─> Firebase Storage: DELETED ✓
   └─> Firestore: DELETED ✓
   └─> knowledge_chunks: DELETED ✓

2. File still exists in GitHub repo

3. You click "Scan for Changes" in GitHub Sync panel
   └─> Backend scans GitHub repo
   └─> Finds "DOUBLE-AGENT-CALL-BUG-FIX.md" in GitHub
   └─> Compares to Firebase Storage
   └─> Result: "1 New file detected" (because it's missing from Firebase)

4. You click "Sync Files"
   └─> Backend downloads file from GitHub
   └─> Uploads to Firebase Storage
   └─> Creates Firestore document
   └─> Generates embeddings
   └─> Result: FILE IS BACK! 😱
```

### **The Opposite Problem: You edit in UI, then sync from GitHub**

```
1. You edit "SHELTR-AGENT-ARCHITECTURE.md" in Knowledge Base UI
   └─> Firebase Storage: Updated with your changes ✓
   └─> Firestore: Updated metadata ✓
   └─> knowledge_chunks: New embeddings ✓

2. Original file still exists in GitHub (unchanged)

3. You click "Scan for Changes" in GitHub Sync panel
   └─> Backend compares GitHub file hash to Firebase file hash
   └─> Detects difference
   └─> Result: "1 Modified file detected"

4. You click "Sync Files"
   └─> Backend downloads ORIGINAL file from GitHub
   └─> Overwrites Firebase Storage
   └─> Updates Firestore
   └─> Regenerates embeddings
   └─> Result: YOUR EDITS ARE LOST! 😱
```

---

## ✅ **RECOMMENDED WORKFLOW**

### **Option 1: GitHub as Source of Truth (RECOMMENDED)**

This is the **safest and most reliable** approach:

```
1. Edit files in your IDE (VS Code, Cursor, etc.)
   └─> Make changes to docs/04-development/*.md

2. Commit and push to GitHub
   └─> git add docs/04-development/MY-FILE.md
   └─> git commit -m "docs: Update MY-FILE"
   └─> git push origin main

3. Sync from Knowledge Base Dashboard
   └─> Go to /dashboard/knowledge
   └─> Click "Scan for Changes"
   └─> Review detected changes
   └─> Click "Sync Files"
   └─> Embeddings regenerate automatically

4. Test chatbot with updated knowledge
   └─> Ask questions to verify new content is accessible
```

**Advantages:**
- ✅ Version control (Git history)
- ✅ Collaboration (multiple developers)
- ✅ Backup (GitHub is backed up)
- ✅ Code review (Pull requests)
- ✅ Rollback (Git revert)

**Disadvantages:**
- ⏱️ Requires IDE + Git + GitHub Sync (3 steps)

---

### **Option 2: UI Editing for Quick Fixes (USE WITH CAUTION)**

Only use this for **minor, non-critical edits** that you don't need to track in Git:

```
1. Edit in Knowledge Base Dashboard UI
   └─> Go to /dashboard/knowledge
   └─> Click "Edit" on document
   └─> Make small changes (typo fix, formatting)
   └─> Click "Save"

2. ⚠️ IMPORTANT: Update GitHub to match
   └─> Copy the edited content
   └─> Open file in your IDE
   └─> Paste the content
   └─> Commit and push to GitHub

3. Verify sync status
   └─> Click "Scan for Changes"
   └─> Should show "0 changes" (everything in sync)
```

**Advantages:**
- ⚡ Fast for quick fixes
- 🖥️ No IDE required
- 📱 Can edit from any device

**Disadvantages:**
- ⚠️ No version control
- ⚠️ Risk of sync conflicts
- ⚠️ Must manually sync back to GitHub
- ⚠️ No collaboration features

---

### **Option 3: UI Deletion (NOT RECOMMENDED)**

**DO NOT DELETE DOCUMENTS FROM THE UI** unless you also delete them from GitHub:

```
❌ BAD WORKFLOW:
1. Delete doc from Knowledge Base UI
2. File still in GitHub
3. Next sync brings it back
4. Confusion and wasted time

✅ CORRECT WORKFLOW:
1. Delete file from your IDE
2. Commit and push deletion to GitHub
3. Sync from Knowledge Base Dashboard
4. Backend detects deletion and removes from Firebase
```

---

## 🔧 **Technical Implementation Details**

### **Edit Flow (Backend)**

```python
# apps/api/routers/knowledge_dashboard.py
@router.put("/documents/{document_id}")
async def update_knowledge_document(
    document_id: str,
    updates: Dict[str, Any],
    current_user: Dict = Depends(require_super_admin)
):
    # Updates Firebase Storage + Firestore + knowledge_chunks
    # DOES NOT touch GitHub
```

### **Delete Flow (Backend)**

```python
# apps/api/routers/knowledge_dashboard.py
@router.delete("/documents/{document_id}")
async def delete_knowledge_document(
    document_id: str,
    current_user: Dict = Depends(require_super_admin)
):
    # Deletes from Firebase Storage + Firestore + knowledge_chunks
    # DOES NOT touch GitHub
```

### **GitHub Sync Flow (Backend)**

```python
# apps/api/routers/knowledge_dashboard.py
@router.post("/scan-github-changes")
async def scan_github_changes():
    # 1. Fetch all files from GitHub repo (docs/ directory)
    # 2. Compare to Firebase Storage files
    # 3. Detect: new, modified, deleted files
    # 4. Return change summary

@router.post("/sync-github-files")
async def sync_github_files(files: List[str]):
    # 1. Download files from GitHub
    # 2. Upload to Firebase Storage
    # 3. Create/update Firestore documents
    # 4. Generate embeddings (knowledge_chunks)
    # 5. Return sync results
```

---

## 📋 **Best Practices Summary**

### **DO:**
- ✅ Edit files in your IDE
- ✅ Commit and push to GitHub
- ✅ Use GitHub Sync to update Knowledge Base
- ✅ Test chatbot after syncing
- ✅ Keep GitHub as source of truth

### **DON'T:**
- ❌ Delete files from UI without deleting from GitHub
- ❌ Make major edits in UI without syncing back to GitHub
- ❌ Assume UI edits are backed up (they're not in Git)
- ❌ Edit the same file in both places simultaneously

---

## 🆘 **Troubleshooting**

### **Problem: "I edited a doc in the UI, but it got overwritten by GitHub sync"**

**Solution:**
1. Before syncing, copy your UI edits
2. After sync completes, re-apply your edits in your IDE
3. Commit and push to GitHub
4. Sync again (should show 0 changes)

---

### **Problem: "I deleted a doc in the UI, but it keeps coming back"**

**Solution:**
1. Delete the file from your local repository
2. Commit: `git rm docs/path/to/file.md`
3. Push: `git push origin main`
4. Sync from Knowledge Base Dashboard
5. Backend will detect deletion and remove from Firebase

---

### **Problem: "My edits in IDE aren't showing up in chatbot"**

**Solution:**
1. Verify you pushed to GitHub: `git log --oneline -5`
2. Go to `/dashboard/knowledge`
3. Click "Scan for Changes"
4. Verify your file shows as "Modified"
5. Click "Sync Files"
6. Wait for embeddings to regenerate (1-2 minutes)
7. Test chatbot again

---

## 🎯 **Quick Reference**

| Action | Where to Do It | What Gets Updated |
|--------|---------------|-------------------|
| **Edit Document** | IDE → GitHub → Sync | GitHub ✓, Firebase ✓, Embeddings ✓ |
| **Delete Document** | IDE → GitHub → Sync | GitHub ✓, Firebase ✓, Embeddings ✓ |
| **Quick Typo Fix** | UI → Manual GitHub sync | Firebase ✓, Embeddings ✓, GitHub ❌ |
| **View Document** | UI or IDE | Nothing (read-only) |
| **Search Documents** | UI or Chatbot | Nothing (read-only) |

---

## 📚 **Related Documentation**

- [Knowledge Base Update Guide](./KNOWLEDGE-BASE-UPDATE-GUIDE.md)
- [SHELTR Agent Architecture](./SHELTR-AGENT-ARCHITECTURE.md)
- [GitHub Sync System](./development_archive/KNOWLEDGE-BASE-SYNC-SYSTEM.md)

---

**Last Updated:** October 16, 2025  
**Version:** 1.0.0  
**Status:** ⚠️ CRITICAL - Read before editing/deleting docs

