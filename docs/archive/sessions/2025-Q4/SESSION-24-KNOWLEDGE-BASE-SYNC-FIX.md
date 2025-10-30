# Session 24: Knowledge Base Production Sync Fix

**Date:** October 15, 2025  
**Duration:** ~45 minutes  
**Status:** ✅ COMPLETE  
**Version:** v2.53.0

---

## 🎯 **OBJECTIVE**

Fix production knowledge base sync showing "0 New files" after clearing, while localhost correctly showed "105 New files".

---

## 🚨 **THE PROBLEM**

### **Reported Issue:**
After clicking "Clear KB" in production, the scan showed:
```
❌ 0 New, 0 Modified, 0 Deleted, 0 Unchanged
```

Localhost showed correctly:
```
✅ 105 New, 0 Modified, 0 Deleted, 0 Unchanged
```

### **Additional Discovery:**
User noticed in Firebase Console:
- ❌ `knowledge_documents` collection was gone (expected)
- ❌ `knowledge_chunks` collection still had data (orphaned)

---

## 🔍 **ROOT CAUSE ANALYSIS**

### **Issue #1: Backend Not Deployed**
- Frontend was deployed (has "Clear KB" button)
- Backend API was NOT deployed with recent changes
- GitHub environment variables were missing in Cloud Run

### **Issue #2: Incomplete Clear Operation**
```python
# OLD CODE (v2.52.0) - INCOMPLETE
# Only deleted knowledge_documents
docs = kb_service.db.collection('knowledge_documents').stream()
for doc in docs:
    doc.reference.delete()

# ❌ MISSING: Did not delete knowledge_chunks!
```

**Result:** Orphaned embeddings in `knowledge_chunks` collection after clear.

---

## 🔧 **FIXES IMPLEMENTED**

### **Fix #1: Add GitHub Token to Backend Deployment**

**File:** `deploy.sh` (line 120)

**Before:**
```bash
--set-env-vars="GOOGLE_CLOUD_PROJECT=sheltr-ai,...,FRONTEND_URL=https://sheltr-ai.web.app"
```

**After:**
```bash
--set-env-vars="GOOGLE_CLOUD_PROJECT=sheltr-ai,...,FRONTEND_URL=https://sheltr-ai.web.app,GITHUB_TOKEN=ghp_xxx,GITHUB_OWNER=mrj0nesmtl,GITHUB_REPO=sheltr-ai,GITHUB_DOCS_PATH=docs"
```

**Why:**
- GitHub scan requires `GITHUB_TOKEN` to fetch repo files
- Was missing in Cloud Run environment variables
- Localhost had it in `.env` file (worked fine)

---

### **Fix #2: Delete knowledge_chunks in Clear Operation**

**File:** `apps/api/routers/knowledge_dashboard.py` (line 408-413)

**Before:**
```python
# Delete from Firestore
docs = kb_service.db.collection('knowledge_documents').stream()
for doc in docs:
    doc.reference.delete()
```

**After:**
```python
# Delete from Firestore - knowledge_documents
docs = kb_service.db.collection('knowledge_documents').stream()
firestore_deleted = 0
for doc in docs:
    doc.reference.delete()
    firestore_deleted += 1

# Delete from Firestore - knowledge_chunks (embeddings)
chunks = kb_service.db.collection('knowledge_chunks').stream()
chunks_deleted = 0
for chunk in chunks:
    chunk.reference.delete()
    chunks_deleted += 1

logger.info(f"Knowledge base cleared - {deleted_count} storage files, {firestore_deleted} Firestore docs, {chunks_deleted} chunks")
```

**Why:**
- `knowledge_chunks` stores OpenAI embeddings
- Must be deleted alongside documents for clean slate
- Orphaned chunks cause data inconsistencies

---

## 📊 **FIRESTORE COLLECTIONS EXPLAINED**

### **`knowledge_documents`**
- Document metadata (title, category, tags)
- Full text content
- Firebase Storage file paths
- ~105 documents for SHELTR

### **`knowledge_chunks`**
- OpenAI embedding vectors (1536 dimensions)
- Text chunks (~500-1000 chars each)
- Document references
- ~500-1000 chunks total (5-10 per document)

**Both are required for chatbot RAG to work!**

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Update Deployment Script**
```bash
git add deploy.sh
git commit -m "Add GitHub env vars to backend deployment"
```

### **Step 2: Deploy Backend**
```bash
echo "2" | ./deploy.sh
# Output: ✅ Cloud Run deployment successful
```

### **Step 3: Update Clear Function**
```bash
git add apps/api/routers/knowledge_dashboard.py
git commit -m "Fix: Clear KB now deletes knowledge_chunks collection"
```

### **Step 4: Redeploy Backend**
```bash
echo "2" | ./deploy.sh
# Output: ✅ Cloud Run deployment successful
```

### **Step 5: Create Documentation**
```bash
git add docs/04-development/KNOWLEDGE-BASE-COLLECTIONS-EXPLAINED.md
git add CHANGELOG.md
git commit -m "v2.53.0: Knowledge Base sync fix - clear chunks + GitHub token"
```

---

## ✅ **VERIFICATION**

### **Production Scan (Before Fix):**
```
❌ 0 New, 0 Modified, 0 Deleted, 0 Unchanged
"All documentation is up to date!" (incorrect)
```

### **Production Scan (After Fix):**
```
✅ 105 New, 0 Modified, 0 Deleted, 0 Unchanged
"Files Ready to Sync:" (correct)
```

**Files include:**
- `01-overview/CHANGELOG.md`
- `01-overview/README.md`
- `01-overview/hacking_homelessness.md`
- `02-architecture/PROJECT-TREE.md`
- ... (101 more files)

---

## 📁 **FILES CHANGED**

1. **`deploy.sh`** - Added GitHub env vars to backend deployment
2. **`apps/api/routers/knowledge_dashboard.py`** - Updated Clear KB to delete chunks
3. **`docs/04-development/KNOWLEDGE-BASE-COLLECTIONS-EXPLAINED.md`** - New architecture guide
4. **`docs/04-development/SESSION-24-KNOWLEDGE-BASE-SYNC-FIX.md`** - This document
5. **`CHANGELOG.md`** - Updated with v2.53.0 release notes

---

## 🎓 **LESSONS LEARNED**

1. **Always deploy both frontend AND backend** when making full-stack changes
2. **Environment variables** must be set in deployment config, not just local `.env`
3. **Related collections** must be cleared together (documents + chunks)
4. **MCP Firebase tools** are excellent for inspecting production Firestore state
5. **Clear operations** should be comprehensive (Storage + ALL related collections)

---

## 🔮 **NEXT STEPS**

### **Immediate (User Action Required):**
1. ✅ Go to production: https://sheltr-ai.web.app/dashboard/knowledge/
2. ✅ Confirm scan shows: **105 New files**
3. ✅ Click **"Sync 105 Files"**
4. ✅ Wait ~2-3 minutes for embeddings generation
5. ✅ Test chatbot with knowledge base queries

### **Future Improvements:**
- [ ] Add progress indicator for Clear KB operation
- [ ] Show chunk count in KB dashboard
- [ ] Add "Verify Embeddings" health check
- [ ] Optimize chunking strategy for better RAG performance
- [ ] Add bulk delete for faster clear operations

---

## 📊 **SESSION STATISTICS**

- **Issues Identified:** 2 (missing env vars, incomplete clear)
- **Commits:** 3
- **Deployments:** 2 (backend only)
- **Files Changed:** 5
- **Lines Added:** ~350
- **Documentation Created:** 2 comprehensive guides
- **Time to Resolution:** ~45 minutes

---

## ✨ **SUCCESS CRITERIA**

- [x] Production scan detects 105 files (matches localhost)
- [x] Clear KB deletes both `knowledge_documents` and `knowledge_chunks`
- [x] Backend deployed with GitHub environment variables
- [x] Architecture documentation created
- [x] CHANGELOG updated
- [x] Ready for production sync

---

## 🚀 **PRODUCTION READY**

**Status:** ✅ **READY TO SYNC**

The production knowledge base is now correctly configured and ready for a full sync of 105 documentation files. Click "Sync 105 Files" to populate the knowledge base with fresh embeddings!

---

**Session Completed:** October 15, 2025  
**Next Action:** User clicks "Sync 105 Files" in production

