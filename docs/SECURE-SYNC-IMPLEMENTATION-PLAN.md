# 🔒 Secure Document Sync - Implementation Plan

**Date**: October 30, 2025  
**Status**: Planned (Phase 7)  
**Priority**: High  
**Estimated Time**: 4-6 hours  

---

## 🎯 **GOAL:**

Implement automated sync between `.local-secure-docs/` and Firebase, with:
- ✅ Automatic permission assignment
- ✅ Dashboard UI for sync management
- ✅ CLI tool for manual sync
- ✅ Drafts folder exclusion
- ✅ Integration with Founder Portal

---

## 📂 **FOLDER MAPPING:**

```
.local-secure-docs/
│
├── drafts/              → 🚫 NEVER SYNC (local only)
├── founders/            → 🔒 FOUNDERS permission
├── payment-rails/       → 🔒 SUPER_ADMIN permission
├── partners/            → 🔒 PLATFORM_ADMIN permission
└── backup-*/            → 🚫 NEVER SYNC (archives)
```

---

## 🏗️ **ARCHITECTURE:**

### **1. File System**
```
.local-secure-docs/founders/business-plan.md
↓
```

### **2. Firebase Storage**
```
gs://sheltr-ai.firebasestorage.app/secure-docs/founders/business-plan.md
↓
```

### **3. Firestore Metadata**
```javascript
secure_documents/doc123 {
  title: "Business Plan v3",
  local_path: ".local-secure-docs/founders/business-plan.md",
  firebase_path: "secure-docs/founders/business-plan.md",
  permission_level: "founders",
  is_private: true,
  synced_at: "2025-10-30T12:00:00Z",
  created_by: "joel@sheltr.com"
}
↓
```

### **4. Founder Portal**
```
http://localhost:3000/portal/founders-only
→ Shows synced documents with FOUNDERS permission
```

---

## 💻 **IMPLEMENTATION:**

### **Phase 1: Backend Service** (2 hours)

**File**: `apps/api/services/secure_docs_service.py`

```python
class SecureDocsService:
    """Sync secure documents to Firebase"""
    
    SYNC_FOLDERS = {
        'founders': DocumentPermission.FOUNDERS,
        'payment-rails': DocumentPermission.SUPER_ADMIN,
        'partners': DocumentPermission.PLATFORM_ADMIN
    }
    
    EXCLUDE_FOLDERS = ['drafts', 'backup-*']
    
    async def sync_document(self, local_path: str) -> Dict[str, Any]:
        """Sync single document to Firebase"""
        
        # 1. Read local file
        content = self._read_local_file(local_path)
        
        # 2. Determine permission from path
        permission = self._get_permission_from_path(local_path)
        
        # 3. Upload to Firebase Storage
        firebase_path = f"secure-docs/{local_path}"
        blob = self.bucket.blob(firebase_path)
        blob.upload_from_string(content)
        
        # 4. Create/update Firestore metadata
        doc_data = {
            'title': self._extract_title(content),
            'local_path': local_path,
            'firebase_path': firebase_path,
            'permission_level': permission.value,
            'is_private': True,
            'synced_at': datetime.utcnow(),
            'file_size': len(content.encode('utf-8')),
            'content': content
        }
        
        doc_id = await self._save_to_firestore(doc_data)
        
        return {'success': True, 'document_id': doc_id}
    
    async def sync_folder(self, folder_name: str) -> Dict[str, Any]:
        """Sync entire folder"""
        
        if folder_name in self.EXCLUDE_FOLDERS:
            raise ValueError(f"Folder '{folder_name}' is excluded from sync")
        
        local_folder = f".local-secure-docs/{folder_name}"
        files = glob.glob(f"{local_folder}/**/*.md", recursive=True)
        
        results = []
        for file_path in files:
            relative_path = file_path.replace(".local-secure-docs/", "")
            result = await self.sync_document(relative_path)
            results.append(result)
        
        return {
            'success': True,
            'synced_count': len(results),
            'files': results
        }
    
    async def get_sync_status(self) -> Dict[str, Any]:
        """Get sync status for all documents"""
        
        status = {
            'local_files': [],
            'synced_files': [],
            'pending_sync': [],
            'modified': []
        }
        
        # Check each sync folder
        for folder, permission in self.SYNC_FOLDERS.items():
            local_path = f".local-secure-docs/{folder}"
            
            if not os.path.exists(local_path):
                continue
            
            # Get local files
            local_files = glob.glob(f"{local_path}/**/*.md", recursive=True)
            
            for local_file in local_files:
                relative_path = local_file.replace(".local-secure-docs/", "")
                
                # Check if synced
                firestore_doc = await self._find_by_local_path(relative_path)
                
                if not firestore_doc:
                    status['pending_sync'].append(relative_path)
                else:
                    # Check if modified
                    local_mtime = os.path.getmtime(local_file)
                    synced_at = firestore_doc.get('synced_at')
                    
                    if local_mtime > synced_at.timestamp():
                        status['modified'].append(relative_path)
                    else:
                        status['synced_files'].append(relative_path)
        
        return status
```

---

### **Phase 2: API Endpoints** (1 hour)

**File**: `apps/api/routers/secure_documents.py`

```python
@router.post("/sync-document")
async def sync_secure_document(
    local_path: str,
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Sync single document from .local-secure-docs/"""
    result = await secure_docs_service.sync_document(local_path)
    return KnowledgeResponse(success=True, data=result)

@router.post("/sync-folder")
async def sync_secure_folder(
    folder_name: str,
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Sync entire folder"""
    result = await secure_docs_service.sync_folder(folder_name)
    return KnowledgeResponse(success=True, data=result)

@router.get("/sync-status")
async def get_sync_status(
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Get sync status"""
    status = await secure_docs_service.get_sync_status()
    return KnowledgeResponse(success=True, data=status)
```

---

### **Phase 3: CLI Tool** (1 hour)

**File**: `scripts/sync-secure-docs.sh`

```bash
#!/bin/bash

# Sync secure documents to Firebase
API_URL="http://localhost:8000/api/v1/secure-documents"

# Get auth token
TOKEN=$(get-admin-token.sh)

# Parse arguments
DRY_RUN=false
TARGET=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      TARGET=$1
      shift
      ;;
  esac
done

if [ -z "$TARGET" ]; then
  echo "Usage: ./sync-secure-docs.sh [--dry-run] <path>"
  echo ""
  echo "Examples:"
  echo "  ./sync-secure-docs.sh founders/business-plan.md"
  echo "  ./sync-secure-docs.sh founders/"
  echo "  ./sync-secure-docs.sh --dry-run founders/"
  exit 1
fi

# Sync
if [[ "$TARGET" == */ ]]; then
  # Folder sync
  FOLDER=$(basename "$TARGET")
  
  if [ "$DRY_RUN" = true ]; then
    echo "🔍 DRY RUN: Would sync folder '$FOLDER'"
    curl -H "Authorization: Bearer $TOKEN" "$API_URL/sync-status"
  else
    echo "🔄 Syncing folder: $FOLDER"
    curl -X POST \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"folder_name\": \"$FOLDER\"}" \
      "$API_URL/sync-folder"
  fi
else
  # Single file sync
  if [ "$DRY_RUN" = true ]; then
    echo "🔍 DRY RUN: Would sync file '$TARGET'"
  else
    echo "🔄 Syncing file: $TARGET"
    curl -X POST \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"local_path\": \"$TARGET\"}" \
      "$API_URL/sync-document"
  fi
fi
```

---

### **Phase 4: Dashboard UI** (2 hours)

**Component**: Secure Documents Sync Panel

```typescript
// apps/web/src/components/secure/SecureDocsSyncPanel.tsx

export function SecureDocsSyncPanel() {
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const loadSyncStatus = async () => {
    const response = await fetch('/api/v1/secure-documents/sync-status');
    const data = await response.json();
    setSyncStatus(data.data);
  };
  
  const syncDocument = async (path: string) => {
    await fetch('/api/v1/secure-documents/sync-document', {
      method: 'POST',
      body: JSON.stringify({ local_path: path })
    });
    loadSyncStatus();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>🔒 Secure Documents Sync</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Pending Sync */}
        <Section title="Pending Sync" count={syncStatus?.pending_sync.length}>
          {syncStatus?.pending_sync.map(file => (
            <FileRow key={file} path={file} onSync={() => syncDocument(file)} />
          ))}
        </Section>
        
        {/* Modified */}
        <Section title="Modified (needs re-sync)" count={syncStatus?.modified.length}>
          {syncStatus?.modified.map(file => (
            <FileRow key={file} path={file} onSync={() => syncDocument(file)} />
          ))}
        </Section>
        
        {/* Synced */}
        <Section title="Synced" count={syncStatus?.synced_files.length}>
          {syncStatus?.synced_files.map(file => (
            <FileRow key={file} path={file} synced />
          ))}
        </Section>
      </CardContent>
    </Card>
  );
}
```

---

## ✅ **DELIVERABLES:**

1. ✅ Backend service for sync
2. ✅ API endpoints
3. ✅ CLI tool
4. ✅ Dashboard UI component
5. ✅ Integration with Founder Portal
6. ✅ Automatic permission assignment
7. ✅ Drafts folder exclusion

---

## 🧪 **TESTING PLAN:**

### **Test 1: Sync Single Document**
```bash
./scripts/sync-secure-docs.sh founders/business-plan.md
```
Expected: File uploaded, metadata created, visible in Founder Portal

### **Test 2: Sync Entire Folder**
```bash
./scripts/sync-secure-docs.sh founders/
```
Expected: All files synced, permissions auto-assigned

### **Test 3: Drafts Exclusion**
```bash
./scripts/sync-secure-docs.sh drafts/
```
Expected: Error - "Folder 'drafts' is excluded from sync"

### **Test 4: Dashboard UI**
- View sync status
- Click sync button
- Verify document appears in portal

---

## 📊 **SUCCESS METRICS:**

- ✅ Documents sync in < 5 seconds
- ✅ Permissions correctly assigned
- ✅ Drafts folder never synced
- ✅ UI shows sync status accurately
- ✅ Documents appear in Founder Portal

---

*Implementation scheduled after Phase 6 testing!* 🚀
