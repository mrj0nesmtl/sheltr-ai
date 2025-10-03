# GitHub Documentation Sync - System Analysis

**Date:** October 3, 2025  
**Status:** ✅ Ready for Production Use  
**Current KB Stats:** 57 documents, 311 chunks, 10 categories

---

## 🔍 System Overview

The GitHub Documentation Sync system automatically synchronizes documentation files from your GitHub repository (`mrj0nesmtl/sheltr-ai`) to the SHELTR Knowledge Base, enabling the AI chatbot to provide accurate, up-to-date answers.

---

## 📋 How It Works

### **1. Scan for Changes**

When you click **"Scan for Changes"**, the system:

1. **Fetches all `.md` files** from `github.com/mrj0nesmtl/sheltr-ai/docs/`
2. **Recursively scans subdirectories** (with exclusions - see below)
3. **Compares GitHub files** against existing Knowledge Base documents
4. **Categorizes changes** into:
   - **NEW**: Files in GitHub but not in KB
   - **MODIFIED**: Files in GitHub with different file size than KB
   - **DELETED**: Files in KB but no longer in GitHub
   - **UNCHANGED**: Files that match exactly

### **2. File Comparison Logic**

**Location:** `apps/api/services/github_service.py:56-106`

```python
# Key Logic:
- GitHub Path: docs/02-architecture/ecosystem/pods-system.md
- KB Stored Path: knowledge-base/public/02-architecture/ecosystem/pods-system.md
- Comparison: File size (simple but effective)
- Future Enhancement: SHA hash comparison for accuracy
```

**File Matching:**
- Strips `knowledge-base/public/` prefix from KB paths
- Compares remaining path to GitHub repo paths
- Size difference = MODIFIED file

### **3. Automatic Directory Exclusions**

**Location:** `apps/api/services/github_service.py:184-214`

The following directories are **automatically skipped** during sync:

```python
skip_patterns = [
    'archive',
    'backup', 
    'development_archive',
    'legacy-migration-archived',
    'migration',
    'archived',
    'old',
    'deprecated',
    'temp',
    'temporary',
    '.git',
    'node_modules',
    '__pycache__'
]
```

**Why?** To prevent:
- Outdated/deprecated docs from confusing the chatbot
- Duplicate content from archived folders
- Development/testing files from polluting production KB

### **4. Sync Process**

When you click **"Sync X Files"**, for each file:

1. **Fetch Content:** Downloads raw markdown from GitHub
2. **Extract Metadata:**
   - **Title:** First `# Heading` in file, or filename as fallback
   - **Category:** Determined from folder structure
   - **Tags:** Extracted from path and filename
3. **Update or Create:**
   - **Existing files:** Updates content, metadata, marks embeddings as pending
   - **New files:** Creates new KB document
4. **Generate Embeddings:**
   - Chunks the document into semantic segments
   - Generates vector embeddings for AI search
   - Stores chunks in `knowledge_chunks` collection
5. **Update Status:** Marks document as `processed` and `embedding_status: completed`

---

## 🗂️ Category Mapping

**Location:** `apps/api/services/github_service.py:382-404`

```python
category_mapping = {
    '01-overview': 'Platform',
    '02-architecture': 'Architecture',
    '03-api': 'API',
    '04-development': 'Development',
    '05-deployment': 'Deployment',
    '06-user-guides': 'User Guides',
    '07-reference': 'Reference',
    '08-integrations': 'Integrations',
    '09-migration': 'Migration',
    '10-resources': 'Resources'
}
```

**Example:**
- File: `02-architecture/ecosystem/pods-system.md`
- Category: `Architecture`

---

## ⚠️ Important Behaviors

### **What Happens with Name Changes?**

**Scenario 1: File Renamed**
```
Old: docs/pod-design.md
New: docs/pods-system.md
```

**Result:**
- `pod-design.md` appears in **DELETED** (KB still has it)
- `pods-system.md` appears in **NEW** (GitHub has it)
- **User Action Required:** Sync the new file, manually delete the old one

**Why:** The system uses file paths as identifiers. A renamed file is treated as delete + create.

**Scenario 2: File Moved to Different Folder**
```
Old: docs/ecosystem/pod-design.md
New: docs/02-architecture/ecosystem/pod-design.md
```

**Result:**
- Old path appears in **DELETED**
- New path appears in **NEW**
- **Same behavior as rename**

### **What Happens with Deleted Files?**

**Scenario: You delete a file from GitHub**

**Result:**
- File appears in **DELETED** list during scan
- **IMPORTANT:** Sync does NOT auto-delete KB documents
- **User Action Required:** Manually delete from KB dashboard

**Why:** Safety measure to prevent accidental data loss

### **What About Modified Files?**

**Scenario: You edit a file in GitHub**

**Result:**
- File appears in **MODIFIED** list
- Syncing updates the existing KB document
- Old embeddings are replaced with new ones
- Document ID and path remain the same
- ✅ **Safe to sync automatically**

---

## 🔐 Security & Access

**API Endpoints:**
- `/api/v1/knowledge-dashboard/scan-github-changes` (POST)
- `/api/v1/knowledge-dashboard/sync-github-files` (POST)

**Authentication:**
- **Required:** Super Admin role only
- **Token:** Firebase Auth Bearer token
- **GitHub Token:** Configured in `.env` (not exposed to frontend)

**Environment Variables:**
```bash
GITHUB_TOKEN=ghp_YOUR_GITHUB_TOKEN_HERE
GITHUB_OWNER=mrj0nesmtl
GITHUB_REPO=sheltr-ai
GITHUB_DOCS_PATH=docs
```

---

## 📊 Current Knowledge Base State

**Before Sync:**
- 57 documents
- 311 chunks
- 10 categories

**Expected After Full Sync:**
- Will depend on scan results
- New files from recent updates (PODS, Drones, etc.)
- Updated content for modified files

---

## ✅ Pre-Sync Checklist

Before running the sync:

1. **Review Recent GitHub Changes:**
   ```bash
   git log --oneline --since="2 weeks ago" -- docs/
   ```

2. **Check for Major Renames:**
   - Did you rename any major documentation files?
   - Did you move files between folders?
   - **Action:** Plan to manually clean up old KB entries

3. **Verify GitHub Token:**
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
        https://api.github.com/repos/mrj0nesmtl/sheltr-ai/contents/docs
   ```

4. **Backup Knowledge Base (Optional):**
   - Export current KB state via dashboard
   - Can restore if sync goes wrong

5. **Test Scan First:**
   - Click "Scan for Changes"
   - Review what will be synced
   - **Don't sync everything blindly!**

---

## 🚀 Recommended Sync Strategy

### **Option A: Selective Sync (Recommended)**

1. Click **"Scan for Changes"**
2. Review the lists:
   - **NEW:** Sync all (safe)
   - **MODIFIED:** Sync all (safe - updates content)
   - **DELETED:** Review carefully, manually delete from KB if needed
3. Sync **NEW** and **MODIFIED** files only
4. Manually handle **DELETED** files

### **Option B: Full Sync (Advanced)**

1. Scan for changes
2. Sync ALL files (NEW + MODIFIED)
3. Manually clean up DELETED files
4. Verify chatbot responses after sync

---

## 🐛 Known Limitations

1. **File Size Comparison Only**
   - Uses file size to detect changes
   - May miss changes if size is identical
   - **Future:** Use SHA hash comparison

2. **No Auto-Delete**
   - Deleted GitHub files must be manually removed from KB
   - Safety feature to prevent accidental data loss

3. **No Merge Conflict Resolution**
   - If you edit a file in both GitHub and KB, last sync wins
   - **Best Practice:** Only edit in GitHub, not KB

4. **Embeddings Re-Generation**
   - Modified files get all embeddings regenerated
   - Can take time for large documents

---

## 🛠️ Troubleshooting

### **"Failed to scan for changes"**
- Check GitHub token validity
- Verify API server is running (`localhost:8000`)
- Check browser console for errors

### **"Some files failed to sync"**
- Check API logs: `apps/api/logs/`
- Common causes:
  - Invalid markdown syntax
  - Very large files (>1MB)
  - Network timeout

### **"Chatbot not using new docs"**
- Wait 1-2 minutes for embeddings to process
- Check document status in KB dashboard
- Verify `embedding_status: completed`

---

## 📝 Best Practices

1. **Sync Regularly:** Once a week or after major doc updates
2. **Review Before Sync:** Always scan first, don't blindly sync
3. **Clean Up Manually:** Handle renamed/moved files explicitly
4. **Test Chatbot:** Ask test questions after sync to verify
5. **Version Control:** Keep docs in sync with code releases

---

## 🎯 Conclusion

**The system is READY and SAFE to use!**

✅ **Automatic exclusions** prevent archive/backup pollution  
✅ **Selective sync** gives you control  
✅ **No auto-delete** prevents accidental data loss  
✅ **Embeddings regenerate** automatically for updated docs

**Next Step:** Run "Scan for Changes" and review the results before syncing!

---

**Questions?** Check the Knowledge Base dashboard for detailed logs and status updates.

