# Dual Repository Sidebar Implementation Plan

## 🎯 **Objective**
Integrate Firebase secure documents into the Knowledge Base sidebar alongside GitHub documents, with clear visual separation and labeling.

---

## 📊 **Current State**

### **Existing Structure:**
- Single folder tree showing GitHub-sourced documents
- Categories: Platform, Architecture, Features, Operations, etc.
- All documents pulled from GitHub repository

### **What We're Adding:**
- Firebase secure documents from `.local-secure-docs/`
- Separate visual section for secure docs
- Clear repository labels (GitHub / Firebase)
- Distinct icons for secure vs public documents

---

## 🏗️ **Architecture Design**

### **1. Data Model Updates**

```typescript
export interface FolderNode {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'document' | 'repository';
  source?: 'github' | 'firebase';  // NEW
  children?: FolderNode[];
  documentCount?: number;
  isExpanded?: boolean;
  icon?: string;  // NEW - for custom icons
  badge?: string;  // NEW - for security badges
}
```

### **2. Folder Tree Structure**

```
📂 Folders
├── 🐙 GitHub Repository (42 documents)
│   ├── 📋 Platform (3)
│   ├── 🏗️ Architecture (18)
│   ├── ✨ Features (15)
│   └── ...
└── 🔥 Firebase Secure Docs (7 documents)
    ├── 🔒 Founders (7)
    ├── 💳 Payment Rails (3)
    ├── ⚙️ Platform Admin (15)
    └── 🏢 Shelter Research (X)
```

---

## 🔧 **Implementation Steps**

### **Phase 1: Backend - Source Tracking** ✅ Already Done
- `synced_from_github` field exists
- `source_directory` field exists for Firebase docs
- Documents already tagged with source

### **Phase 2: Frontend Data Model**
1. Update `FolderNode` interface in `FolderTree.tsx`
2. Add `source` and `repository` properties
3. Create `buildRepositoryTree()` helper function

### **Phase 3: Tree Building Logic**
1. Modify `buildFolderTree()` to accept source parameter
2. Create wrapper function to build both trees
3. Merge into dual-repository structure

### **Phase 4: Visual Differentiation**
1. Add repository-level nodes (GitHub, Firebase)
2. Different icons for secure vs public folders
3. Security badges on secure documents
4. Color coding (green for GitHub, orange for Firebase)

### **Phase 5: Integration**
1. Update Knowledge Base page to use new structure
2. Handle filtering by repository
3. Update document selection logic
4. Test and polish UI

---

## 🎨 **Visual Design**

### **Repository Headers:**
```tsx
GitHub Repository
├── Icon: <Github className="h-4 w-4 text-green-500" />
├── Badge: "Public Docs"
└── Count: Badge showing total documents

Firebase Secure Docs
├── Icon: <Shield className="h-4 w-4 text-orange-500" />
├── Badge: "Secure"
└── Count: Badge showing total documents
```

### **Folder Icons by Source:**
- **GitHub Folders:** Standard blue folder icons
- **Firebase Folders:** Orange folder with shield icon
- **Secure Documents:** Lock icon prefix

### **Document Badges:**
- **Public:** Globe icon (🌍)
- **Founders:** Briefcase icon (💼)
- **Platform Admin:** Cog icon (⚙️)
- **Payment Rails:** Credit card icon (💳)
- **Shelter Research:** Building icon (🏢)

---

## 🔒 **Security Considerations**

### **Access Control:**
- Only show Firebase folders if user has appropriate role
- Filter secure documents by permission level
- Hide entire Firebase section if user is public/donor

### **Visibility Rules:**
```typescript
const showFirebaseSection = 
  userRole === 'super_admin' ||
  userRole === 'platform_admin' ||
  userRole === 'founders' ||
  userRole === 'shelter_admin';
```

---

## 📝 **API Changes Required**

### **Document Response Enhancement:**
```typescript
interface KnowledgeDocument {
  // ... existing fields
  synced_from_github: boolean;
  source_directory?: string;
  repository_source: 'github' | 'firebase';  // NEW - computed field
}
```

### **Stats Update:**
```typescript
interface KnowledgeStats {
  // ... existing fields
  github_documents: number;  // NEW
  firebase_documents: number;  // NEW
}
```

---

## 🧪 **Testing Checklist**

- [ ] GitHub section shows all public documents
- [ ] Firebase section shows secure documents
- [ ] Repository labels are clear and visible
- [ ] Folder tree starts collapsed
- [ ] Expanding one repository doesn't expand the other
- [ ] Document counts are accurate
- [ ] Security badges display correctly
- [ ] Access control hides Firebase section for unauthorized users
- [ ] Search works across both repositories
- [ ] Category filters work correctly

---

## 📦 **Files to Modify**

1. `apps/web/src/components/knowledge/FolderTree.tsx`
   - Update `FolderNode` interface
   - Add `source` property
   - Create `buildDualRepositoryTree()` function
   - Add repository-level rendering

2. `apps/web/src/app/dashboard/knowledge/page.tsx`
   - Update tree building to separate by source
   - Add repository filtering
   - Update document selection logic

3. `apps/web/src/services/knowledgeDashboardService.ts`
   - Add `repository_source` to document interface
   - Update stats to include source counts

4. `apps/api/routers/knowledge_dashboard.py`
   - Add computed `repository_source` field to responses
   - Update stats endpoint to include source breakdown

---

## 🎯 **Success Criteria**

1. ✅ Users can clearly distinguish GitHub vs Firebase docs
2. ✅ Secure documents are visually distinct
3. ✅ Folder tree is less overwhelming (collapsed by default)
4. ✅ Access control works correctly
5. ✅ Document counts are accurate
6. ✅ Navigation is intuitive

---

## 🚀 **Rollout Plan**

### **Phase A: Basic Dual Structure** (This Session)
- Implement repository-level grouping
- Add GitHub/Firebase labels
- Update folder tree component

### **Phase B: Visual Polish** (Next Session)
- Add security badges
- Implement color coding
- Add custom icons per secure category

### **Phase C: Advanced Features** (Future)
- Repository-specific search
- Quick toggle between repositories
- Advanced filtering by source

---

**Status:** 📋 Planning Complete → Ready for Implementation  
**Estimated Time:** 30-45 minutes  
**Priority:** High (User Experience Improvement)

