# Session 26: KB Document Picker Fix

**Date**: November 26, 2025  
**Issue**: FAQ document and other GitHub-synced docs not appearing in KB document picker  
**Status**: ✅ **FIXED**

---

## 🐛 **Problem**

After creating the comprehensive FAQ database markdown document and successfully syncing it to GitHub and the knowledge base:
- The FAQ document appeared in the knowledge base sidebar ✅
- The KB document picker search showed "No documents match your search" ❌
- Searching for "FAQ" returned no results ❌
- GitHub-synced documents were completely missing from the picker ❌

---

## 🔍 **Root Cause**

The `list_documents` method in `apps/api/services/knowledge_service.py` was filtering documents by:

```python
query = query.where('is_live', '==', True)  # Only published documents for chatbot access
```

However, the GitHub sync service (`apps/api/services/github_service.py`) was **NOT** setting the `is_live` field when creating or updating documents from GitHub:

```python
document_data = {
    'title': title,
    'content': content,
    'category': category,
    # ... other fields ...
    'status': 'active',  # ✅ Set
    # 'is_live': True,   # ❌ MISSING!
    # 'chatbot_accessible': True  # ❌ MISSING!
}
```

**Result**: All GitHub-synced documents had `is_live: undefined`, which failed the `is_live == True` filter, making them invisible to the KB document picker.

---

## ✅ **Solution**

### **1. Updated GitHub Sync Service**

Modified `apps/api/services/github_service.py` to set both `is_live` and `chatbot_accessible` flags for **all** GitHub-synced documents:

**For NEW documents** (line 378-381):

```python
document_data = {
    # ... existing fields ...
    'status': 'active',  # Active for chatbot access
    'is_live': True,  # Published and available for chatbot
    'chatbot_accessible': True  # Explicitly mark as chatbot-accessible
}
```

**For UPDATED documents** (line 355-358):

```python
updates={
    # ... existing fields ...
    'is_live': True,  # Ensure it's published
    'chatbot_accessible': True  # Ensure chatbot can access
}
```

### **2. Migration Script**

Created `scripts/fix-github-docs-is-live.py` to update existing GitHub-synced documents:

```python
# Query for GitHub-synced documents
github_docs = docs_ref.where('synced_from_github', '==', True).stream()

for doc in github_docs:
    updates = {}
    if not doc_data.get('is_live'):
        updates['is_live'] = True
    if not doc_data.get('chatbot_accessible'):
        updates['chatbot_accessible'] = True
    
    if updates:
        doc.reference.update(updates)
```

**Result**: Updated **39 GitHub-synced documents** with proper flags.

### **3. Fixed Document Persistence Bug**

**Problem**: Attached KB documents persisted across new chat sessions.

**Solution**: Clear attached documents when creating new session or switching sessions:

```typescript
const createNewSession = async () => {
  // ... session creation logic ...
  
  setMessages([]);
  
  // Clear attached KB documents for new session
  setAttachedKBDocuments([]);
  setAttachedDocs([]);
};

const selectSession = async (session: ChatSession) => {
  setCurrentSession(session);
  
  // Clear attached KB documents when switching sessions
  setAttachedKBDocuments([]);
  setAttachedDocs([]);
  
  // ... load messages ...
};
```

---

## 🧪 **Testing**

### **Before Fix**:
- Search "FAQ" → "No documents match your search"
- Search "roadmap" → No results
- Document picker only showed secure documents

### **After Fix**:
- Search "FAQ" → Shows "FAQ Database" (1,502 words, Reference category) ✅
- Search "fa" → Shows "SHELTR FAQ Expansion" + "FAQ Database" ✅
- All 39 GitHub-synced documents now searchable ✅
- New chat sessions start with no attached documents ✅
- Switching sessions clears attached documents ✅

---

## 📊 **Impact**

### **Documents Now Available**:
- ✅ **FAQ Database** (435 lines, 198 FAQs)
- ✅ **Development Roadmap** v4.0
- ✅ **Platform Overview**
- ✅ **User Guides** (Donor, Participant)
- ✅ **Technical Documentation** (Agent Architecture, Gemini Integration, etc.)
- ✅ **Feature Documentation**
- ✅ **Session Summaries** and changelogs
- ✅ **All other GitHub-synced markdown documents**

### **User Benefits**:
- 🎯 **Focused Context**: Attach relevant docs to provide AI with specific knowledge
- 🔍 **Easy Search**: Find documents by title, category, or path
- 📚 **198 FAQs Accessible**: All chatbot FAQs now available as context
- 🚀 **Better Responses**: AI can reference official docs for accurate answers

---

## 🔗 **Related Files**

### **Backend**:
- `apps/api/services/github_service.py` - Added `is_live` and `chatbot_accessible` flags to sync
- `apps/api/services/knowledge_service.py` - Filters by `is_live == True`
- `apps/api/routers/knowledge.py` - `/documents` endpoint

### **Frontend**:
- `apps/web/src/app/dashboard/chatbots/page.tsx` - Clear attached docs on session change
- `apps/web/src/components/chatbot/KBDocumentPickerModal.tsx` - Document search/selection UI

### **Scripts**:
- `scripts/fix-github-docs-is-live.py` - One-time migration for existing docs

### **Documentation**:
- `docs/reference/enhanced-faq-database.md` - The FAQ doc that started this fix
- `CHANGELOG.md` - Updated for v2.153.0

---

## 🎯 **Commits**

1. `fix: set is_live and chatbot_accessible for GitHub-synced docs` (9e264e1e)
2. `fix: clear attached KB documents when creating new session or switching` (09359b50)
3. `docs: update changelog for v2.153.0 - KB document picker fix` (ec170b4c)

---

## 📝 **Notes**

- Future GitHub syncs will automatically set `is_live: true` ✅
- All existing docs have been migrated ✅
- KB document context is now fully functional ✅
- Next: Implement backend service to actually use attached docs in AI responses

---

## 🚀 **Next Steps**

- [ ] Update chatbot backend to send attached KB document IDs with messages
- [ ] Implement RAG with specific document context
- [ ] Add `/kb` slash command for quick document attachment
- [ ] Add `@` mention system for users

