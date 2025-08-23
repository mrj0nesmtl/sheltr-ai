# 📚 Knowledge Base Update Guide

**How to update SHELTR-AI Knowledge Base documents with embedding regeneration**

The Knowledge Base is critical for chatbot instruction. When you update documents, embeddings must be regenerated for the chatbots to use the latest information.

## 🎯 **Current System Overview**

### **Storage Structure:**
- **Firebase Storage**: `knowledge-base/public/` (9 markdown files)
- **Firestore Collection**: `knowledge_documents` (9 document records)
- **Embeddings**: `knowledge_chunks` (62+ embedding chunks for chatbot RAG)

### **Available Documents:**
1. `README.md` → SHELTR Platform Overview
2. `blockchain.md` → SHELTR Blockchain Technical Documentation  
3. `donor-guide.md` → Donor User Guide
4. `hacking_homelessness.md` → Hacking Homelessness Strategy
5. `participant-guide.md` → Participant User Guide
6. `shelter-admin-guide.md` → Shelter Admin Guide
7. `sheltr-tokenomics.md` → SHELTR Tokenomics and SmartFund Model
8. `system-design.md` → SHELTR System Design and Architecture
9. `whitepaper_final.md` → SHELTR White Paper

---

## 🔄 **Update Methods**

### **Method 1: Script-Based Update (Recommended)**

**Use this for bulk updates or when you have local markdown files.**

#### **Prerequisites:**
```bash
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/api
```

#### **Commands:**

**List available documents:**
```bash
python3 scripts/update_knowledge_document.py --list
```

**Update single document:**
```bash
python3 scripts/update_knowledge_document.py --file /path/to/updated-document.md
```

**Update specific document by ID:**
```bash
python3 scripts/update_knowledge_document.py --file /path/to/document.md --document-id 6HHoaWQMyp7U4i7TnGKy
```

**Update all documents from directory:**
```bash
python3 scripts/update_knowledge_document.py --directory /path/to/docs/folder/
```

#### **What the script does:**
1. ✅ **Reads** the local markdown file
2. ✅ **Finds** the corresponding document in Firestore
3. ✅ **Updates** Firestore document record
4. ✅ **Updates** Firebase Storage file
5. ✅ **Deletes** old embedding chunks
6. ✅ **Regenerates** new embeddings for chatbot RAG
7. ✅ **Updates** chunk count and embedding status

---

### **Method 2: UI-Based Update**

**Use this for individual document updates through the dashboard.**

#### **Steps:**
1. **Login** as Super Admin to `localhost:3000/dashboard/knowledge`
2. **Find** the document you want to update
3. **Click** the "Edit" button on the document card
4. **Update** the content in the text editor
5. **Save** - embeddings will be regenerated automatically

#### **File Upload Update (New Feature):**
1. **Go to** Knowledge Base dashboard
2. **Click** "Update from File" button (if available)
3. **Select** your updated markdown file
4. **Choose** the document to replace
5. **Upload** - embeddings regenerated automatically

---

### **Method 3: Direct File Replacement**

**⚠️ Advanced users only - requires manual embedding regeneration**

#### **Steps:**
1. **Replace** file in Firebase Storage: `knowledge-base/public/filename.md`
2. **Update** Firestore document record manually
3. **Run** embedding regeneration script:
   ```bash
   python3 scripts/regenerate_embeddings.py --document-id [ID]
   ```

---

## 🧠 **Embedding Regeneration**

**Why embeddings matter:**
- Chatbots use embeddings for **semantic search** and **RAG (Retrieval-Augmented Generation)**
- When document content changes, old embeddings become **outdated**
- **New embeddings** ensure chatbots have access to **latest information**

**Automatic regeneration happens when:**
- ✅ Using the update script
- ✅ Using UI update with file upload
- ✅ Using the new API endpoint

**Manual regeneration needed when:**
- ❌ Directly editing files in Firebase Storage
- ❌ Manually updating Firestore documents
- ❌ Importing documents via other methods

---

## 📁 **Recommended Workflow**

### **For Regular Updates:**

1. **Edit** your markdown files locally in your preferred editor
2. **Save** them to a local directory (e.g., `~/sheltr-docs/`)
3. **Run** the update script:
   ```bash
   python3 scripts/update_knowledge_document.py --directory ~/sheltr-docs/
   ```
4. **Verify** in the Knowledge Base dashboard that embeddings were regenerated
5. **Test** chatbot responses to ensure new information is available

### **For Single Document Updates:**

1. **Edit** the specific markdown file
2. **Update** using the script:
   ```bash
   python3 scripts/update_knowledge_document.py --file ~/sheltr-docs/system-design.md
   ```
3. **Check** the dashboard for updated chunk count

---

## 🔧 **API Endpoints**

**For developers integrating updates:**

### **Update Document Content:**
```http
PUT /api/v1/knowledge-dashboard/documents/{document_id}
Content-Type: multipart/form-data

title: Updated Title
content: Updated markdown content
category: Platform
tags: tag1, tag2
status: active
```

### **Update from File Upload:**
```http
PUT /api/v1/knowledge-dashboard/documents/{document_id}/upload
Content-Type: multipart/form-data

file: [markdown file]
title: Optional title override
category: Optional category
tags: Optional tags
```

**Both endpoints automatically regenerate embeddings.**

---

## ✅ **Verification Checklist**

After updating documents, verify:

- [ ] **Document updated** in Knowledge Base dashboard
- [ ] **File updated** in Firebase Storage
- [ ] **Embedding count** increased/updated
- [ ] **Embedding status** shows "completed"
- [ ] **Chatbot responses** reflect new information
- [ ] **No errors** in backend logs

---

## 🚨 **Troubleshooting**

### **Common Issues:**

**Document not found:**
- Run `--list` to see available documents
- Check filename matches exactly
- Verify document ID if using specific ID

**Embedding generation failed:**
- Check OpenAI API key configuration
- Verify document content is valid
- Check backend logs for errors

**File upload fails:**
- Ensure you're logged in as Super Admin
- Check file format (must be .md)
- Verify API endpoints are working

**Chatbot not using new information:**
- Wait 1-2 minutes for embedding propagation
- Restart chatbot service if needed
- Check embedding status in dashboard

---

## 📊 **Monitoring**

**Dashboard Metrics:**
- **Total Documents**: Should remain at 9
- **Active Documents**: Should be 9
- **Total Chunks**: Will increase/decrease based on content
- **Pending Embeddings**: Should be 0 after updates

**Backend Logs:**
```bash
# Monitor update process
tail -f logs/api.log | grep "knowledge"

# Check embedding generation
tail -f logs/api.log | grep "embedding"
```

---

## 🎯 **Best Practices**

1. **Always use the script** for reliable updates
2. **Test locally** before updating production documents
3. **Keep backups** of original documents
4. **Monitor embedding counts** after updates
5. **Verify chatbot responses** after major updates
6. **Update related documents** together for consistency
7. **Use descriptive commit messages** when updating docs

---

**Need help?** Check the backend logs or contact the development team for assistance with knowledge base updates.
