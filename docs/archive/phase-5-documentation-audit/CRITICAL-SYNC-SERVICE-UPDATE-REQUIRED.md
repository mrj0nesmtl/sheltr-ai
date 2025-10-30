# 🚨 CRITICAL: GitHub Sync Service Update Required

**Date**: October 30, 2025  
**Priority**: 🔴 **BLOCKING** - Must be updated before folder reorganization

---

## ⚠️ THE ISSUE

The GitHub sync service (`apps/api/services/github_service.py`) has **HARDCODED FOLDER MAPPINGS** that rely on the numbered prefix structure (01-, 02-, etc.).

### **Current Code (Lines 391-402)**
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

**Impact**: If we rename folders before updating this code, the GitHub sync will break!

---

## ✅ REQUIRED FIX

### **File**: `apps/api/services/github_service.py`
### **Function**: `_determine_category_from_path()`
### **Lines**: 384-406

### **New Category Mapping (After Reorganization)**
```python
def _determine_category_from_path(self, file_path: str) -> str:
    """Determine category based on file path"""
    path_parts = file_path.split('/')
    
    if len(path_parts) > 1:
        folder = path_parts[0]
        
        category_mapping = {
            # New structure (no numbered prefixes)
            'overview': 'Platform',
            'architecture': 'Architecture',
            'ecosystem': 'Products',
            'tokenomics': 'Tokenomics',
            'api': 'API',
            'integrations': 'Integrations',
            'guides': 'Guides',
            'features': 'Features',
            'operations': 'Operations',
            'reference': 'Reference',
            'resources': 'Resources',
            'archive': 'Archive',
            
            # Legacy support (for transition period)
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
        
        return category_mapping.get(folder, 'Documentation')
    
    return 'Documentation'
```

**Note**: Include BOTH old and new mappings during transition, remove old ones after verification.

---

## 🔍 OTHER FILES TO CHECK

### **Public Docs Hub**
**File**: `apps/web/src/app/docs/page.tsx`
**Lines**: 71-634
**Issue**: Hardcoded GitHub links to numbered folders

**Example (Line 81)**:
```typescript
downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/01-overview/hacking_homelessness.md"
```

**Required**: Update ALL GitHub links to new paths

### **Hardcoded Initial Sync**
**File**: `apps/api/routers/knowledge.py`
**Lines**: 349-366
**Issue**: Hardcoded file paths with numbered prefixes

**Example**:
```python
'/Users/mrjones/Github/Projects/sheltr-ai/docs/01-overview/hacking_homelessness.md',
'/Users/mrjones/Github/Projects/sheltr-ai/docs/02-architecture/website-architecture.md',
# ... etc
```

**Required**: Update to new folder paths

---

## 📋 UPDATE CHECKLIST

### **Phase 1: Update Code FIRST (Before renaming folders)**
- [ ] Update `github_service.py` - category mappings
- [ ] Update `knowledge.py` - hardcoded file paths
- [ ] Add legacy support for old folder names
- [ ] Test sync still works with OLD structure

### **Phase 2: Rename Folders**
- [ ] Rename folders (remove numbered prefixes)
- [ ] Verify sync still works (legacy mappings)
- [ ] Test knowledge base sync

### **Phase 3: Update Frontend**
- [ ] Update `apps/web/src/app/docs/page.tsx` - all GitHub links
- [ ] Update any other pages with doc links
- [ ] Test all documentation pages

### **Phase 4: Clean Up**
- [ ] Remove legacy folder mappings
- [ ] Test everything still works
- [ ] Monitor for issues

---

## 🎯 RECOMMENDED APPROACH

### **Strategy: Dual Support During Transition**

1. **Update code FIRST** to support BOTH old and new folder names
2. **Rename folders** in docs/
3. **Verify everything works** with new names
4. **Update frontend links** to new GitHub URLs
5. **Remove legacy support** after verification (1-2 weeks)

This ensures **zero downtime** and allows rollback if needed.

---

## 📊 FILES REQUIRING UPDATES

| File | Lines | Updates Required | Priority |
|------|-------|------------------|----------|
| `apps/api/services/github_service.py` | 384-406 | Category mappings | 🔴 Critical |
| `apps/api/services/github_service.py` | 408-430 | Tag extraction | 🟡 Medium |
| `apps/api/routers/knowledge.py` | 349-366 | Hardcoded paths | 🔴 Critical |
| `apps/web/src/app/docs/page.tsx` | 71-634 | All GitHub links | 🔴 Critical |
| Any other doc-linking pages | TBD | GitHub URLs | 🟡 Medium |

---

## ⏰ TIMELINE

1. **Code updates**: 30 minutes
2. **Testing with old structure**: 15 minutes
3. **Folder renaming**: 10 minutes
4. **Testing with new structure**: 15 minutes
5. **Frontend link updates**: 45 minutes
6. **Final testing**: 30 minutes

**Total**: ~2.5 hours for code-related updates

---

## 🚨 WARNING

**DO NOT** rename folders before updating the sync service code, or the GitHub sync feature will break!

**Correct Order**:
1. ✅ Update code to support new folder names
2. ✅ Test code with old folder structure
3. ✅ Rename folders
4. ✅ Test sync with new structure
5. ✅ Update frontend links
6. ✅ Remove legacy support

---

**Status**: Documented - Ready for implementation  
**Blocking**: Folder reorganization (Phase 3)  
**Next Action**: Update github_service.py with dual mapping support

