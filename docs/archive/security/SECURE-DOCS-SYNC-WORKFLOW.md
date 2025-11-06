# 🔒 Secure Document Sync Workflow

**Complete guide for syncing local documents to production**

---

## 📋 **THE COMPLETE FLOW:**

```
Local Files → Firestore → Knowledge Base → Embeddings → Portals
   (.local-secure-docs)     (database)      (dashboard)     (AI Chat)   (Founders/IR)
```

---

## 🎯 **THE 3-BUTTON WORKFLOW**

### **Button 1: Sync Secure Documents** (Pink Button)
**Location**: Knowledge Dashboard → Secure Document Sync panel

**What it does**:
1. ✅ Reads files from `.local-secure-docs/`
2. ✅ Uploads to Firestore `knowledge_documents` collection
3. ✅ **SMART MERGE**: Updates content, preserves your configurations
4. ✅ Sets `embedding_status: 'pending'` for new docs

**Files Synced**:
- ✅ `founders/` → Founders Portal docs
- ✅ `payment-rails/` → Payment system docs
- ✅ `platform-admin/` → Admin-only docs
- ✅ `shelter-research/` → Shelter research docs

**Files EXCLUDED** (automatically):
- ❌ `drafts/` → Not synced (local workspace)
- ❌ `backup-*/` → Not synced (backup only)
- ❌ `welcome-letters/` → Not synced (sidebar only, not KB)
- ❌ `*-credentials.md` → Not synced (sensitive)
- ❌ `README.md` → Not synced (navigation only)

**What Gets Preserved** (won't be overwritten):
- 🔒 `published_to_founders` toggle
- 🔒 `published_to_ir` toggle
- 🔒 Custom badge colors (red, blue, etc.)
- 🔒 Custom badge text
- 🔒 Custom descriptions
- 🔒 View counts
- 🔒 Embedding status

**What Gets Updated** (from your local files):
- ✏️ Content (markdown body)
- ✏️ Title (from frontmatter)
- ✏️ Tags (from frontmatter)
- ✏️ Word count (recalculated)

---

### **Button 2: Generate Embeddings** (Appears after sync)
**Location**: Same panel, appears after successful sync

**What it does**:
1. ✅ Finds all docs with `embedding_status: 'pending'`
2. ✅ Processes content into AI-ready chunks
3. ✅ Generates OpenAI embeddings (vectors)
4. ✅ Stores in Firestore for chatbot
5. ✅ Updates `embedding_status: 'completed'`

**This enables**:
- 🤖 AI Chatbot can answer questions about your docs
- 🔍 Semantic search in Knowledge Base
- 📊 RAG (Retrieval-Augmented Generation)

---

### **Button 3: Scan for Changes** (GitHub sync)
**Location**: Knowledge Dashboard → GitHub Documentation Sync panel

**What it does**:
1. ✅ Scans your GitHub `docs/` folder
2. ✅ Syncs public documentation
3. ✅ Auto-generates embeddings
4. ✅ Updates Knowledge Base

**This is SEPARATE from secure docs!**
- Public GitHub docs → Knowledge Base
- Secure local docs → Knowledge Base
- Both work together in the same dashboard

---

## 🚀 **STEP-BY-STEP INSTRUCTIONS**

### **Step 1: Edit Your Local Documents**

```bash
# Work in your local secure docs folder
cd .local-secure-docs/

# Edit existing docs or create new ones
code founders/business-plan.md
code founders/sheltr-prerevenue-projections.csv

# Keep drafts in the drafts/ folder until ready
code drafts/my-new-idea.md

# When ready, move to destination folder
mv drafts/my-new-idea.md founders/my-new-idea.md
```

---

### **Step 2: Go to Knowledge Dashboard**

Navigate to: `http://localhost:3000/dashboard/knowledge`

**You'll see TWO sync panels:**

#### **Panel 1: GitHub Documentation Sync** (Green)
- For public docs from GitHub `docs/` folder
- "Scan for Changes" button

#### **Panel 2: Secure Document Sync** (Red/Orange)
- For private docs from `.local-secure-docs/`
- **This is the one you want!**

---

### **Step 3: Click "Sync Secure Documents"** (Pink Button)

**What happens:**
1. Backend calls `POST /api/v1/secure-docs/sync`
2. Runs `scripts/sync-secure-documents.js`
3. Reads your `.local-secure-docs/` folder
4. Uploads to Firestore with smart merge
5. Shows success message with stats

**Expected output:**
```
✅ Successfully synced 12 secure documents
   📄 founders: 5 files
   📄 payment-rails: 3 files
   📄 platform-admin: 3 files
   📄 shelter-research: 1 file
   
   Created: 2 new documents
   Updated: 10 existing documents
```

**IMPORTANT**: Your production configurations are SAFE!
- Custom badges: ✅ Preserved
- Portal toggles: ✅ Preserved
- Descriptions: ✅ Preserved
- Only content is updated: ✅ Smart merge

---

### **Step 4: Click "Generate Embeddings"**

**After sync succeeds, a second button appears!**

Click it to process AI embeddings for chatbot.

**What happens:**
1. Backend calls `POST /api/v1/secure-docs/generate-embeddings`
2. Finds docs with `embedding_status: 'pending'`
3. Chunks content into semantic segments
4. Generates OpenAI embeddings
5. Stores for RAG/chatbot

**Expected output:**
```
✅ Generated embeddings for 8 documents
   🧠 Processed: 8 documents
   ❌ Failed: 0 documents
   📊 Total chunks: 145
```

---

### **Step 5: View in Knowledge Base**

**Now your docs are in the Knowledge Base!**

1. Click "Hide Folders" to see document cards
2. Your secure docs appear with red/orange borders
3. Click "Edit" to configure:
   - Custom badge colors
   - Portal publishing toggles
   - Descriptions for Founders/IR
   - Custom slugs

---

### **Step 6: Publish to Portals (Optional)**

**To make docs visible in Founders Portal or IR Data Room:**

1. Click "Edit" on a document
2. Scroll to "Secure Document Publishing" panel
3. Toggle "Published to Founders Portal" ✅
4. Toggle "Published to Investor Relations" ✅
5. Add custom descriptions
6. Click "Save Publishing Settings"

**Your doc now appears in:**
- ✅ Founders Portal (`/portal/founders-only`)
- ✅ IR Data Room (`/ir/dataroom`)
- ✅ Knowledge Base (for you/admins)
- ✅ AI Chatbot (can answer questions)

---

## 🔄 **WHEN TO RE-SYNC:**

### **Re-run Button 1 (Sync) when:**
- ✅ You've edited local document content
- ✅ You've added new documents
- ✅ You've updated CSV files
- ✅ You want to refresh production content

**DON'T worry about:**
- ❌ Losing custom badges
- ❌ Losing portal toggles
- ❌ Losing descriptions
- ❌ Breaking production configs

**Smart merge protects everything!** 🛡️

---

### **Re-run Button 2 (Embeddings) when:**
- ✅ After syncing new documents
- ✅ After major content updates
- ✅ If embeddings failed initially
- ✅ If chatbot isn't finding updated content

---

## 📊 **MONITORING YOUR SYNC:**

### **Check Sync Status:**
```typescript
// In Knowledge Dashboard, look for:
- "X files in .local-secure-docs/"
- "Last synced: timestamp"
- "Embedding status: completed/pending"
```

### **Check Document Status:**
```typescript
// In document edit page:
- View Count
- Embedding Status
- Published To: Founders ✅ / IR ✅
- Last Updated: timestamp
```

---

## 🚨 **TROUBLESHOOTING:**

### **"No documents found to sync"**
**Cause**: No `.md` files in sync folders
**Fix**: Check `.local-secure-docs/founders/` etc. have `.md` files

---

### **"Sync failed: Firebase credentials not found"**
**Cause**: Missing service account key
**Fix**: 
```bash
# Check file exists:
ls apps/api/service-account-key.json

# Or set environment variables:
# .env.local or apps/api/.env
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

---

### **"Embedding generation failed"**
**Cause**: OpenAI API key missing or invalid
**Fix**: 
```bash
# Set in apps/api/.env:
OPENAI_API_KEY=sk-...
```

---

### **"Document not appearing in portal"**
**Cause**: Not published yet
**Fix**: 
1. Edit document in Knowledge Base
2. Toggle "Published to Founders Portal" ✅
3. Save settings
4. Refresh portal page

---

## 🎯 **SUMMARY:**

**The 3-Button Super Admin Flow:**

```
1️⃣ Edit local files in .local-secure-docs/
   ↓
2️⃣ Click "Sync Secure Documents" (pink button)
   ↓  Updates content, preserves your configs
   ↓
3️⃣ Click "Generate Embeddings" (appears after sync)
   ↓  Processes for AI chatbot
   ↓
4️⃣ Configure in Knowledge Base (optional)
   ↓  Set badges, toggles, descriptions
   ↓
5️⃣ View in Founders Portal / IR Data Room
   ✅ Documents live and searchable!
```

---

## 📞 **SUPPORT:**

**Questions?**
- Check terminal output for sync logs
- Check browser console for errors
- View `docs/operations/` for detailed docs

**Still stuck?**
- Review `.local-secure-docs/README.md`
- Check Firebase console for documents
- Verify service account permissions

---

**Keep your secure docs synced!** 🔒✨

