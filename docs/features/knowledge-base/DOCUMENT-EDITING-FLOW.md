# 📝 Knowledge Base Document Editing Flow

**Last Updated**: November 25, 2025  
**Version**: 2.0  
**Author**: SHELTR-AI Platform Team

---

## 🎯 **Overview**

This document explains how document editing works in the SHELTR-AI Knowledge Base, including the relationship between local files, GitHub, Firestore, and the UI editor.

---

## 📊 **Architecture: One-Way Sync**

### **Current System Design**

```
┌─────────────────────────────────────────────────────────────────┐
│                     SOURCE OF TRUTH                              │
│                                                                  │
│  1️⃣  GitHub Repository (docs/)                                  │
│      • Public documentation                                      │
│      • Read-only for sync                                       │
│                                                                  │
│  2️⃣  Local .local-secure-docs/                                  │
│      • Private secure documents                                  │
│      • Platform admin, founders, etc.                           │
│                                                                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ ONE-WAY SYNC ⬇️
                 │ (GitHub API / Local Sync Script)
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                     FIREBASE FIRESTORE                           │
│              knowledge_documents collection                      │
│                                                                  │
│  • Enhanced copies with embeddings                              │
│  • AI-accessible for RAG                                        │
│  • Can be edited in UI                                          │
│  • Tracks: created_at, updated_at, updated_by                   │
│                                                                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ READ/WRITE ⬍➔
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                    UI DASHBOARD EDITOR                           │
│           /dashboard/knowledge/edit/                             │
│                                                                  │
│  • View and edit documents                                      │
│  • Click "Save & Regenerate"                                    │
│  • Changes saved ONLY to Firestore                              │
│  • Embeddings regenerated for AI                                │
│  • NOT synced back to source files                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **How Document Editing Works**

### **When You Click "Save & Regenerate"**

1. ✅ **Changes saved to Firestore** (`knowledge_documents`)
2. ✅ **`updated_at`** timestamp updated (Firestore server timestamp)
3. ✅ **`updated_by`** field set to current user's email
4. ✅ **`updated_by_name`** field set to user's display name
5. ✅ **Embeddings regenerated** for AI semantic search
6. ✅ **Change tracked** in `document_changes` collection
7. ❌ **NOT pushed back to GitHub** (read-only token)
8. ❌ **NOT pushed back to `.local-secure-docs/`**

---

## 📅 **Timestamp Tracking**

The edit page now displays two key timestamps:

### **1. Last Synced** 
- 📅 **When**: Original import from GitHub or local secure docs
- 📂 **Field**: `created_at`
- 🎨 **Color**: Default (white/gray)
- 📝 **Meaning**: When the file was first added to the knowledge base

### **2. Last Edited**
- 📅 **When**: Most recent edit via UI "Save & Regenerate"
- 📂 **Field**: `updated_at`
- 🎨 **Color**: Amber (orange highlight)
- 📝 **Meaning**: When someone made changes in the dashboard
- 👤 **Shows**: User badge with who edited it

### **Example Display**

```
┌─────────────────────────────────────────────┐
│  Document Info                               │
├─────────────────────────────────────────────┤
│  Last Synced:   Nov 24, 2025, 3:45 PM      │
│  Last Edited:   Nov 25, 2025, 10:20 PM     │
│                 [🛡️ Joel Yaffe]             │
│  Source:        [🔒 Secure Docs]            │
└─────────────────────────────────────────────┘
```

---

## ⚠️ **What Happens on Next Sync?**

### **GitHub Documents**
- ✅ If GitHub file **hasn't changed** → UI edits preserved
- ⚠️ If GitHub file **has changed** → **GitHub wins**, UI edits overwritten
- 💡 **Recommendation**: Edit source files in GitHub, then re-sync

### **Secure Documents**
- ✅ If local file **hasn't changed** → UI edits preserved
- ⚠️ If local file **has changed** → **Local file wins**, UI edits overwritten
- 💡 **Recommendation**: Edit source files in `.local-secure-docs/`, then re-sync

---

## 🔐 **GitHub Token Permissions**

Your current GitHub token has **READ-ONLY** access:

```
Permissions:
✅ repo:status       - Read repository status
✅ public_repo       - Read public repositories
❌ repo (write)      - NOT granted
❌ push              - Cannot push changes
```

### **Why Read-Only?**

1. **Security**: Prevents accidental overwrites to main branch
2. **Control**: All permanent changes go through your IDE/Git workflow
3. **Audit**: GitHub shows proper commit history from your account
4. **Simplicity**: No need to handle merge conflicts or PR creation

---

## 🎯 **Best Practices**

### **For Quick Fixes** (UI Edits)
Use the dashboard editor when:
- ✅ Fixing typos or grammar
- ✅ Updating metadata (tags, categories)
- ✅ Adjusting permissions
- ✅ Testing content changes
- ⚠️ **Note**: Changes will be overwritten on next sync if source file changes

### **For Permanent Changes** (Source Files)
Edit the source files when:
- ✅ Major content updates
- ✅ New sections or features
- ✅ Structural changes
- ✅ Want changes in Git history
- ✅ Working with team on same document

---

## 🚀 **Future Enhancements**

### **Potential Two-Way Sync** (Not Implemented)

If you want UI edits to push back to source files, we'd need:

1. **GitHub Integration**:
   - Upgrade token to write permissions
   - Implement PR creation for UI edits
   - Handle merge conflicts
   - Add review workflow

2. **Local Secure Docs**:
   - Create background service
   - Watch for Firestore changes
   - Write back to local files
   - Handle file locking

3. **Conflict Resolution**:
   - Detect concurrent edits
   - Merge strategies
   - Version history
   - Rollback capability

**Complexity**: High  
**Priority**: Low (current one-way sync meets needs)

---

## 📊 **Change Tracking System**

### **Where Changes Are Tracked**

1. **Firestore Fields** (on document):
   - `updated_at`: Server timestamp
   - `updated_by`: User email
   - `updated_by_name`: Display name

2. **Change History Collection**:
   - `document_changes` → Individual change records
   - Tracks: content, metadata, publishing, sharing changes
   - Used by "Recent Changes" sidebar

3. **UI Display**:
   - "Document Info" card shows timestamps
   - "Change Tracking" card shows recent edits
   - User badges show who made changes

---

## 🔧 **Technical Implementation**

### **Files Modified (Session 25)**

1. **`apps/web/src/app/dashboard/knowledge/edit/page.tsx`**
   - Added `updated_by` and `updated_by_name` to save
   - Added timestamp display section
   - Added user badge for last editor

2. **`scripts/sync-secure-documents.js`**
   - Set `is_live: true` so docs show as "Published"

3. **`apps/web/src/components/knowledge/ChangeTracker.tsx`**
   - Existing component (already working)
   - Displays recent change history

---

## 📝 **FAQ**

### **Q: Why don't my UI edits sync back to GitHub?**
**A**: By design. GitHub is the source of truth. Edit files there for permanent changes.

### **Q: What if I make a UI edit and someone else edits the source file?**
**A**: Next sync will overwrite your UI edits. Edit source files for important changes.

### **Q: How do I see who edited a document?**
**A**: Open the document in edit mode. Look at "Document Info" → "Last Edited" → User badge.

### **Q: Can I prevent my UI edits from being overwritten?**
**A**: No, but you can:
   1. Copy your UI edits
   2. Edit the source file
   3. Re-sync to update Firestore

### **Q: What happens if I edit a document that doesn't exist in GitHub/local?**
**A**: It's safe! That document exists only in Firestore and won't be affected by syncs.

---

## ✅ **Summary**

| Action | GitHub Docs | Secure Docs | Firestore |
|--------|-------------|-------------|-----------|
| **Sync** | GitHub → Firestore | Local → Firestore | ✅ Updated |
| **UI Edit** | ❌ Not pushed back | ❌ Not pushed back | ✅ Saved |
| **Next Sync** | Overwrites UI edits | Overwrites UI edits | Updates from source |
| **Permanent Change** | Edit in GitHub | Edit locally | Auto-synced |

---

**🎉 Happy Editing!**

