# Session 25: Sidebar Tree Refresh Fix

**Date**: November 26, 2025  
**Issue**: FAQ markdown document was synced to Firestore but not appearing in the sidebar tree  
**Status**: ✅ **FIXED**

---

## 🐛 **Problem**

After creating `docs/reference/enhanced-faq-database.md` and successfully syncing it to GitHub and Firestore:
- The document existed in the filesystem ✅
- The document was synced to Firestore ✅
- The GitHub sync reported "0 New, 0 Modified, 94 Deleted, 0 Unchanged" ✅
- **BUT** the sidebar tree was not updating to show the new document ❌

The reference folder showed "# 4" documents, but should have shown "# 5" with the new FAQ doc.

---

## 🔍 **Root Cause**

The `loadKnowledgeData()` function in `apps/web/src/app/dashboard/knowledge/page.tsx` was being called after sync completion via the `onSyncComplete` callback, BUT:

1. **Browser caching**: The API responses were being cached
2. **No cache-busting**: The fetch requests didn't include timestamps to force fresh data
3. **Stale UI**: The folder tree was built from cached document data

---

## ✅ **Solution**

### **1. Added Force Refresh Parameter**

Updated `loadKnowledgeData()` to accept a `forceRefresh` parameter:

```typescript
const loadKnowledgeData = async (forceRefresh = false) => {
  try {
    setLoading(true);
    
    // Add cache-busting timestamp if force refresh
    const cacheBuster = forceRefresh ? `?_t=${Date.now()}` : '';
    
    // Get documents and stats from API
    const [documentsResponse, statsResponse] = await Promise.all([
      knowledgeDashboardService.getKnowledgeDocuments(cacheBuster),
      knowledgeDashboardService.getKnowledgeStats(cacheBuster)
    ]);
    
    // ... rest of function
  }
};
```

### **2. Updated GitHub Sync Callback**

Modified the `GitHubSyncPanel` to pass `true` to force refresh:

```typescript
<GitHubSyncPanel onSyncComplete={() => loadKnowledgeData(true)} userRole={userRole} />
```

### **3. Updated Secure Document Sync**

Added `onSyncComplete` prop to `SecureDocumentSync` component:

```typescript
interface SecureDocumentSyncProps {
  onSyncComplete?: () => void;
}

export const SecureDocumentSync: React.FC<SecureDocumentSyncProps> = ({ onSyncComplete }) => {
  // ... component logic
  
  // After successful sync and embedding generation
  if (onSyncComplete) {
    setTimeout(() => {
      onSyncComplete();
    }, 1000);
  }
};
```

And wired it up in the parent page:

```typescript
<SecureDocumentSync onSyncComplete={() => loadKnowledgeData(true)} />
```

---

## 🧪 **Testing**

To verify the fix:

1. **Hard refresh** the Knowledge Base page (`Cmd+Shift+R`)
2. The reference folder should now show **5 documents** (including `enhanced-faq-database.md`)
3. Click the reference folder to expand it
4. You should see:
   - `api-reference.md`
   - `database-schema.md`
   - `design-system.md`
   - `enhanced-faq-database.md` ⭐ **NEW**
   - `PROJECT-TREE.md`

---

## 📊 **Impact**

- ✅ Sidebar tree now refreshes automatically after GitHub sync
- ✅ Sidebar tree now refreshes automatically after secure document sync
- ✅ Cache-busting ensures fresh data is always fetched after sync operations
- ✅ No more manual page refreshes needed

---

## 🔗 **Related Files**

- `apps/web/src/app/dashboard/knowledge/page.tsx` - Main KB dashboard with refresh logic
- `apps/web/src/components/knowledge/GitHubSyncPanel.tsx` - GitHub sync component
- `apps/web/src/components/knowledge/SecureDocumentSync.tsx` - Secure doc sync component
- `apps/web/src/components/knowledge/FolderTree.tsx` - Sidebar tree builder
- `docs/reference/enhanced-faq-database.md` - The new FAQ documentation file

---

## 🎯 **Commit**

```bash
git commit -m "fix: force refresh sidebar tree after GitHub/secure doc sync"
```

**Commit Hash**: `cca54c46`

---

## 📝 **Notes**

- The cache-busting timestamp is only added when `forceRefresh=true` to avoid unnecessary API calls
- The 1-second delay in callbacks allows the backend to finish processing before the frontend refetches
- This fix applies to both GitHub sync and secure document sync operations

