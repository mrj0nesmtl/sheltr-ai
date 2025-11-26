# 🔧 Secure Docs Sync - Complete Fix Plan

**Date**: November 25, 2025  
**Priority**: CRITICAL  
**Status**: 🚨 **REQUIRES IMMEDIATE ACTION**

---

## 🐛 **Issues Identified**

### **1. Sync Script Not Recursive**
- **Problem**: `fs.readdirSync()` only reads immediate directory
- **Impact**: Leadership subfolders not syncing (onboarding/, strategy/, team-bios/, welcome-letters/)
- **Files Missing**: ~30 files in leadership subfolders

### **2. No CSV File Support**
- **Problem**: Script only filters for `.md` files
- **Impact**: CSV files in operations/ and founders/ not syncing
- **Files Missing**:
  - `operations/sheltr-prerevenue-projections.csv`
  - `operations/budget-2026.csv`
  - `founders/revenue-projections.csv`

### **3. Vault Still in Firestore**
- **Problem**: Old vault documents from before exclusion still in database
- **Impact**: Vault folder showing in KB tree with 1 doc
- **Solution**: Clear secure docs, then re-sync

### **4. Credential File in Dataroom**
- **Problem**: `ir-creds-secure.md` in dataroom (should be in vault)
- **Impact**: Sensitive credentials exposed in KB
- **Solution**: Move to vault locally, clear dataroom from Firestore

---

## ✅ **Solution Steps**

### **Step 1: Fix Sync Script (Add Recursion + CSV Support)**

Update `scripts/sync-secure-documents.js`:

```javascript
// BEFORE (Line 456):
const allFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));

// AFTER:
const allFiles = getAllFilesRecursively(dirPath).filter(f => 
  f.endsWith('.md') || f.endsWith('.csv')
);

// ADD NEW HELPER FUNCTION:
function getAllFilesRecursively(dirPath, arrayOfFiles = [], baseDir = dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFilesRecursively(filePath, arrayOfFiles, baseDir);
    } else {
      // Store relative path from base directory
      const relativePath = path.relative(baseDir, filePath);
      arrayOfFiles.push(relativePath);
    }
  });
  
  return arrayOfFiles;
}
```

### **Step 2: Update File Processing for Subfolders**

The sync needs to:
1. Handle relative paths (e.g., `team-bios/joel-yaffe-bio.md`)
2. Create proper `file_path` in Firestore (e.g., `secure-docs/leadership/team-bios/joel-yaffe-bio.md`)
3. Upload to correct Storage path (e.g., `secure-docs/leadership/team-bios/joel-yaffe-bio.md`)

### **Step 3: Add CSV File Handling**

```javascript
// Add CSV parsing logic
function parseCSVContent(content) {
  const lines = content.split('\n');
  const headers = lines[0];
  const rowCount = lines.length - 1;
  
  return {
    headers,
    rowCount,
    preview: lines.slice(0, 5).join('\n')
  };
}

// Update document creation to handle CSV
if (filename.endsWith('.csv')) {
  const csvData = parseCSVContent(fileContent);
  documentData.content_type = 'csv';
  documentData.csv_headers = csvData.headers;
  documentData.csv_row_count = csvData.rowCount;
  documentData.content_preview = csvData.preview;
}
```

### **Step 4: Move Credential File to Vault**

```bash
# Move file locally
mv .local-secure-docs/dataroom/ir-creds-secure.md .local-secure-docs/vault/

# Add to .gitignore if not already there
echo ".local-secure-docs/vault/" >> .gitignore
```

### **Step 5: Clear Secure Docs from Firestore**

**Option A: Use Dashboard UI**
1. Go to Knowledge Base
2. Click "Clear Knowledge Base"
3. Select "Clear Secure Docs Only"
4. Confirm

**Option B: Use Backend Script**
```bash
cd apps/api
source .venv/bin/activate
python scripts/wipe-secure-docs-kb.py
```

### **Step 6: Re-Sync with Fixed Script**

**Option A: Use Dashboard UI**
1. Go to Knowledge Base
2. Click "Sync Secure Documents"
3. Wait for completion
4. Verify embeddings generated

**Option B: Use Command Line**
```bash
cd /Users/mrjones/Github/Projects/sheltr-ai
NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/sync-secure-documents.js
```

---

## 📊 **Expected Results After Fix**

### **Firebase Secure Docs Tree**
```
🔥 Firebase Secure Docs
├── 📝 Blog-posts (3 docs)
├── 📊 Dataroom (2 docs) ← ir-creds-secure.md REMOVED
├── 💳 Fintec (3 docs)
├── 👑 Founders (5 docs) ← revenue-projections.csv ADDED
├── 🎯 Leadership (33 docs) ← SUBFOLDERS NOW SYNCED
│   ├── onboarding/ (1 doc)
│   │   ├── zaffia_onboarding_package.md
│   │   └── welcome-letters/ (13 docs)
│   ├── strategy/ (2 docs)
│   │   ├── corporate-structure-analysis-canada.md
│   │   └── fundraising-strategy-pilot-stage.md
│   └── team-bios/ (16 docs)
└── ⚙️ Operations (10 docs) ← CSV files ADDED
    ├── sheltr-prerevenue-projections.csv
    ├── budget-2026.csv
    └── ... (8 other .md files)
```

### **NOT in Tree**
- ❌ Vault (excluded from sync)
- ❌ Development (excluded from sync)
- ❌ Drafts (excluded from sync)
- ❌ Local (excluded from sync)

---

## 🧪 **Testing Checklist**

After implementing fixes:

### **1. Verify Local Files**
```bash
# Count files that should sync
find .local-secure-docs/blog-posts -type f \( -name "*.md" -o -name "*.csv" \) | wc -l
find .local-secure-docs/dataroom -type f \( -name "*.md" -o -name "*.csv" \) | wc -l
find .local-secure-docs/fintec -type f \( -name "*.md" -o -name "*.csv" \) | wc -l
find .local-secure-docs/founders -type f \( -name "*.md" -o -name "*.csv" \) | wc -l
find .local-secure-docs/leadership -type f \( -name "*.md" -o -name "*.csv" \) | wc -l
find .local-secure-docs/operations -type f \( -name "*.md" -o -name "*.csv" \) | wc -l
```

### **2. Run Fixed Sync Script**
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/sync-secure-documents.js
```

Expected output:
```
📁 Syncing leadership/ (33 files, X excluded)...
   ✨ Created: team-bios/joel-yaffe-bio.md (leadership)
   ✨ Created: onboarding/zaffia_onboarding_package.md (leadership)
   ✨ Created: strategy/fundraising-strategy-pilot-stage.md (leadership)
   ...
```

### **3. Verify Firestore**
Check `knowledge_documents` collection:
- [ ] Leadership docs have correct `file_path` (e.g., `secure-docs/leadership/team-bios/joel-yaffe-bio.md`)
- [ ] CSV files have `content_type: 'csv'`
- [ ] No vault documents present
- [ ] No credential files in dataroom

### **4. Verify Firebase Storage**
Check `secure-docs/` bucket:
- [ ] Files uploaded to correct paths with subfolders
- [ ] CSV files present
- [ ] No vault files

### **5. Verify Dashboard UI**
- [ ] Refresh Knowledge Base page
- [ ] Expand Leadership folder → see subfolders
- [ ] Expand Operations folder → see CSV files
- [ ] Vault NOT showing in tree
- [ ] Dataroom has 2 docs (not 3)

---

## 🚨 **Critical Actions Before Sync**

### **1. Move Credential File**
```bash
cd /Users/mrjones/Github/Projects/sheltr-ai
mv .local-secure-docs/dataroom/ir-creds-secure.md .local-secure-docs/vault/
```

### **2. Verify Vault Exclusion**
Check `scripts/sync-secure-documents.js`:
```javascript
// Should be commented out:
// 'vault': { ... }
```

### **3. Clear Old Secure Docs**
Use dashboard "Clear Secure Docs Only" button

---

## 📝 **Implementation Order**

1. ✅ Move `ir-creds-secure.md` to vault
2. ✅ Fix sync script (add recursion + CSV support)
3. ✅ Test sync script locally
4. ✅ Clear secure docs from Firestore (dashboard)
5. ✅ Run fixed sync script
6. ✅ Verify folder tree in dashboard
7. ✅ Generate embeddings
8. ✅ Test chatbot access (role-based)
9. ✅ Commit and push changes
10. ✅ Deploy to production

---

## 🎯 **Success Criteria**

- [ ] All leadership subfolders synced (33 files)
- [ ] All CSV files synced (3 files)
- [ ] Vault NOT in KB tree
- [ ] No credential files in dataroom
- [ ] Folder tree shows correct structure
- [ ] Embeddings generated for all docs
- [ ] Chatbot can access docs (role-based)
- [ ] No sync errors

---

**Ready to implement? Let's start with Step 1: Fix the sync script!**

