# 🔒 Secure Document Publishing - Audit & Implementation Plan

**Date**: October 31, 2025  
**Status**: 📋 Ready for Implementation  
**Priority**: 🔥 High

---

## 🔍 **CURRENT STATE AUDIT**

### **Founders Portal** (`/portal/founders-only`)

**Status**: ✅ **OPERATIONAL** (Hardcoded Cards)

**Current Implementation:**
- **17 hardcoded QuickAccessCard** items in `apps/web/src/app/portal/founders-only/page.tsx`
- **Drag-and-drop ordering** with Firestore persistence
- **"Share to Investor Data Room"** toggle already exists! ✅
- Saves card order to Firestore: `founder_portal_settings` collection

**Secure Documents Using SecureDocumentViewer:**
1. ✅ `/portal/founders-only/investor-relations` (Firestore: `founder_documents`)
2. ✅ `/portal/founders-only/business-plan` (Firestore: `founder_documents`)
3. ✅ `/portal/founders-only/msb-registration` (Firestore: `founder_documents`)
4. ✅ `/portal/founders-only/shelter-research` (Firestore: `founder_documents`)
5. ✅ `/portal/founders-only/design-guide` (Firestore: `founder_documents`)
6. ✅ `/portal/founders-only/adyen-integration` (Firestore: `founder_documents`)
7. ✅ `/portal/founders-only/covenant-house-outreach` (Firestore: `founder_documents`)

**Public Document Links:**
- Platform Admin Guide → `/dashboard/platform-guide`
- Documentation Hub → `/docs`
- System Design → `/docs/system-design`
- Development Roadmap → `/docs/roadmap`
- Leadership Team → `/team`
- etc.

---

### **Investor Relations Data Room** (`/ir/dataroom`)

**Status**: ✅ **OPERATIONAL** (Hardcoded Array)

**Current Implementation:**
- **17 hardcoded INVESTOR_DOCUMENTS** array in `apps/web/src/app/ir/dataroom/page.tsx`
- **Drag-and-drop ordering** with Firestore persistence
- **Document viewer**: iframes pointing to Founders Portal pages
- **Access Control**: Only `investor` or `super_admin` roles

**Document Cards:**
```typescript
const INVESTOR_DOCUMENTS: InvestorDocument[] = [
  { id: 'adyen-integration', title: 'Adyen Integration Strategy', badge: 'Strategic', ... },
  { id: 'blockchain-architecture', title: 'Blockchain Architecture', badge: 'SmartFund™', ... },
  { id: 'business-plan', title: 'Business Plan', badge: 'Secure', ... },
  // ... 14 more hardcoded documents
];
```

**How It Works:**
- Cards link to `/ir/documents/[slug]`
- Document page loads iframe pointing to Founders Portal URL
- Uses `getFoundersPortalUrl()` mapping function

---

### **SecureDocumentViewer Component**

**Locations:**
1. `/components/portal/SecureDocumentViewer.tsx` (Main component)
2. `/components/SecureDocumentViewer.tsx` (Alternative version)

**Features:**
- Fetches from Firestore: `founder_documents` collection
- Renders markdown with `react-markdown` + `remark-gfm`
- Security notices and confidentiality warnings
- Metadata display (author, date, tags, version)
- Access control checks

---

## 🎯 **GAPS IDENTIFIED**

### **1. No Dynamic Publishing System**

**Problem:**
- Founders Portal cards are **hardcoded** in the component
- Investor Relations cards are **hardcoded** in the component
- No way to publish from Knowledge Base to these portals

**Impact:**
- Must manually edit code files to add new documents
- Can't dynamically control which documents appear where
- No integration with Knowledge Base system

---

### **2. Duplicate Data Entry Required**

**Problem:**
- Documents must exist in 3 places:
  1. `knowledge_documents` collection (for Knowledge Base)
  2. `founder_documents` collection (for SecureDocumentViewer)
  3. Hardcoded arrays (for portal cards)

**Impact:**
- Manual syncing required
- Risk of inconsistency
- Difficult to maintain

---

### **3. No Firestore Integration**

**Problem:**
- Cards are hardcoded, not queried from database
- Publishing toggle exists but doesn't query documents
- No backend API to manage published documents

**Impact:**
- Can't use existing Knowledge Base documents
- Must manually upload to `founder_documents`
- No unified content management

---

## 🚀 **PROPOSED SOLUTION**

### **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE BASE                            │
│                  (101 Active Documents)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Publishing Toggles
                         ▼
        ┌────────────────┴────────────────┐
        │                                  │
        ▼                                  ▼
┌───────────────────┐          ┌──────────────────────┐
│  DOCS HUB         │          │  SECURE PORTALS      │
│  (Public)         │          │  (Super Admin Only)  │
│                   │          │                      │
│  • /docs          │          │  • Founders Portal   │
│  • permission:    │          │  • Investor Relations│
│    public         │          │  • permission:       │
│  • Dynamic [slug] │          │    private           │
└───────────────────┘          └──────────────────────┘
```

---

## 📋 **IMPLEMENTATION PLAN**

### **Phase 1: Backend API** 🔧

#### **1.1: Update Document Schema**

Add to `knowledge_documents` collection:

```typescript
// New fields for secure publishing
published_to_founders: boolean;      // Publish to Founders Portal
published_to_ir: boolean;           // Publish to Investor Relations
secure_slug?: string;               // URL-safe slug for secure docs
secure_badge?: string;              // Badge text (e.g., "Strategic", "Legal")
secure_badge_color?: string;        // Badge color class
secure_icon?: string;               // Icon type
founders_description?: string;      // Custom description for Founders Portal
ir_description?: string;            // Custom description for IR
```

#### **1.2: Create Backend Endpoints**

**File**: `apps/api/routers/knowledge_secure_publishing.py`

```python
# GET /api/v1/knowledge/founders-portal
# Returns all documents where published_to_founders = true

# GET /api/v1/knowledge/investor-relations
# Returns all documents where published_to_ir = true

# POST /api/v1/knowledge/{document_id}/publish-to-founders
# Toggle publishing to Founders Portal

# POST /api/v1/knowledge/{document_id}/publish-to-ir
# Toggle publishing to Investor Relations

# GET /api/v1/knowledge/secure/{slug}
# Get secure document by slug
```

#### **1.3: Update Pydantic Models**

**File**: `apps/api/models/secure_publishing.py`

```python
class SecurePublishingSettings(BaseModel):
    published_to_founders: bool
    published_to_ir: bool
    secure_slug: str
    secure_badge: Optional[str]
    secure_badge_color: Optional[str]
    secure_icon: Optional[str]
    founders_description: Optional[str]
    ir_description: Optional[str]

class PublishToFoundersRequest(BaseModel):
    published: bool
    settings: SecurePublishingSettings

class PublishToIRRequest(BaseModel):
    published: bool
    settings: SecurePublishingSettings
```

---

### **Phase 2: Frontend UI Components** 🎨

#### **2.1: Secure Document Publisher Component**

**File**: `apps/web/src/components/knowledge/SecureDocumentPublisher.tsx`

**Features:**
- ✅ "Publish to Founders Portal" toggle
- ✅ "Publish to Investor Relations" toggle
- ✅ Secure slug input with validation
- ✅ Badge selection dropdown
- ✅ Icon picker
- ✅ Custom description fields
- ✅ Preview card
- ✅ "View Live" button

**UI Layout:**
```typescript
┌─────────────────────────────────────────────────────────┐
│  🔒 Secure Document Publishing                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  👔 Founders Portal                                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [Toggle] Publish to Founders Portal              │   │
│  │                                                   │   │
│  │ Slug: [secure-document-slug]        ✓ Available  │   │
│  │ Badge: [Strategic ▼]  Color: [Blue ▼]           │   │
│  │ Icon: [FileText ▼]                               │   │
│  │ Description: [Custom description for founders]   │   │
│  │                                                   │   │
│  │ [Preview Card]  [View Live in Founders Portal]   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  💼 Investor Relations                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [Toggle] Publish to Investor Relations           │   │
│  │                                                   │   │
│  │ Badge: [Pre-Seed ▼]  Color: [Purple ▼]          │   │
│  │ Description: [Custom description for investors]  │   │
│  │                                                   │   │
│  │ [Preview Card]  [View Live in Data Room]         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [Save Publishing Settings]                              │
└─────────────────────────────────────────────────────────┘
```

#### **2.2: Integrate into Knowledge Base Edit Page**

**File**: `apps/web/src/app/dashboard/knowledge/edit/page.tsx`

Add below `DocsHubPublisher` component:

```typescript
{/* Secure Document Publishing - Founders & IR */}
{permissionSettings.permission_level === 'private' && (
  <SecureDocumentPublisher
    documentId={documentId}
    onSave={handleSecurePublishingSave}
  />
)}
```

**Conditional Rendering:**
- Only show if `permission_level === 'private'` or `'role_based'`
- Hide if `permission_level === 'public'` (use Docs Hub instead)

#### **2.3: Update Knowledge Base Cards**

**File**: `apps/web/src/app/dashboard/knowledge/page.tsx`

Add new publishing badges (we already have Docs Hub badge):

```typescript
{/* Publishing Badges */}
<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
  {(doc as any).published_to_hub && (
    <Badge variant="outline" className="border-blue-400 text-blue-600">
      <Book className="h-3 w-3 mr-1" />
      Docs Hub
    </Badge>
  )}
  {(doc as any).published_to_founders && (
    <Badge variant="outline" className="border-purple-400 text-purple-600">
      <Briefcase className="h-3 w-3 mr-1" />
      Founders
    </Badge>
  )}
  {(doc as any).published_to_ir && (
    <Badge variant="outline" className="border-green-400 text-green-600">
      <TrendingUp className="h-3 w-3 mr-1" />
      IR
    </Badge>
  )}
</div>
```

---

### **Phase 3: Dynamic Portal Pages** 🔄

#### **3.1: Update Founders Portal**

**File**: `apps/web/src/app/portal/founders-only/page.tsx`

**Replace hardcoded cards with dynamic query:**

```typescript
// BEFORE (Hardcoded)
const initialCards: QuickAccessCard[] = [
  { id: 'investor-relations', title: '...', ... },
  { id: 'business-plan', title: '...', ... },
  // ... 15 more hardcoded cards
];

// AFTER (Dynamic)
useEffect(() => {
  const loadPublishedDocuments = async () => {
    const response = await fetch('/api/v1/knowledge/founders-portal');
    const docs = await response.json();
    
    const dynamicCards = docs.map(doc => ({
      id: doc.secure_slug,
      title: doc.title,
      description: doc.founders_description || doc.description,
      badge: doc.secure_badge,
      badgeColor: doc.secure_badge_color,
      icon: getIconComponent(doc.secure_icon),
      href: `/portal/founders-only/${doc.secure_slug}`,
      // ... map other fields
    }));
    
    setCards(dynamicCards);
  };
  
  loadPublishedDocuments();
}, []);
```

#### **3.2: Update Investor Data Room**

**File**: `apps/web/src/app/ir/dataroom/page.tsx`

**Replace hardcoded array with dynamic query:**

```typescript
// BEFORE (Hardcoded)
const INVESTOR_DOCUMENTS: InvestorDocument[] = [
  { id: 'adyen-integration', title: '...', ... },
  // ... 16 more hardcoded documents
];

// AFTER (Dynamic)
useEffect(() => {
  const loadIRDocuments = async () => {
    const response = await fetch('/api/v1/knowledge/investor-relations');
    const docs = await response.json();
    
    const dynamicDocs = docs.map(doc => ({
      id: doc.secure_slug,
      title: doc.title,
      description: doc.ir_description || doc.description,
      badge: doc.secure_badge,
      badgeColor: doc.secure_badge_color,
      // ... map other fields
    }));
    
    setDocuments(dynamicDocs);
  };
  
  loadIRDocuments();
}, []);
```

#### **3.3: Create Dynamic Secure Document Viewer Route**

**File**: `apps/web/src/app/portal/founders-only/[secure-slug]/page.tsx`

```typescript
'use client';

import { useParams } from 'next/navigation';
import SecureDocumentViewer from '@/components/portal/SecureDocumentViewer';

export default function DynamicSecureDocPage() {
  const params = useParams();
  const slug = params['secure-slug'] as string;

  return (
    <SecureDocumentViewer
      documentSlug={slug}
      category="founders"
      backLink="/portal/founders-only"
    />
  );
}
```

**Note**: This will serve as fallback for any `/portal/founders-only/[slug]` routes not already hardcoded.

---

### **Phase 4: Firestore Sync** 🔥

#### **4.1: Update SecureDocumentViewer to Query Knowledge Base**

**File**: `apps/web/src/components/portal/SecureDocumentViewer.tsx`

**Current**: Queries `founder_documents` collection  
**New**: Query `knowledge_documents` collection with filters

```typescript
// BEFORE
const docRef = doc(db, 'founder_documents', documentSlug);

// AFTER
const q = query(
  collection(db, 'knowledge_documents'),
  where('secure_slug', '==', documentSlug),
  where('published_to_founders', '==', true)
);
```

**Benefits:**
- Single source of truth
- No duplicate documents
- Auto-syncs with Knowledge Base

#### **4.2: Migration Script**

**File**: `scripts/migrate-secure-documents.js`

Migrate existing `founder_documents` to `knowledge_documents`:

```javascript
// 1. Query all documents from founder_documents
// 2. For each document:
//    - Check if exists in knowledge_documents
//    - If exists, update with secure publishing fields
//    - If not, create new document
// 3. Update permission_level to 'private'
// 4. Set published_to_founders = true
```

---

## 📊 **IMPLEMENTATION TIMELINE**

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| **Phase 1** | Backend API (3 endpoints, models, tests) | 4-6 hours |
| **Phase 2** | UI Components (SecureDocumentPublisher, badges) | 6-8 hours |
| **Phase 3** | Dynamic Portal Pages (Founders + IR refactor) | 4-6 hours |
| **Phase 4** | Firestore Sync (Migration, SecureDocViewer update) | 3-4 hours |
| **Testing** | End-to-end testing, permissions, UI flow | 2-3 hours |
| **TOTAL** | **19-27 hours** (2-3 days) |

---

## ✅ **BENEFITS**

### **1. Unified Content Management**
- Single source of truth: `knowledge_documents`
- No duplicate data entry
- Consistent across all portals

### **2. Dynamic Publishing**
- Publish/unpublish with one click
- No code changes required
- Real-time updates

### **3. Better Access Control**
- Leverage existing permission system
- Clear visibility of where docs are published
- Publishing badges in Knowledge Base dashboard

### **4. Maintainability**
- No hardcoded arrays
- Database-driven
- Easy to add new documents

---

## 🔐 **SECURITY CONSIDERATIONS**

### **Access Control Matrix**

| Portal | Required Role | Permission Level | Visibility Scope |
|--------|--------------|------------------|------------------|
| **Docs Hub** | `public` | `public` | `global` |
| **Founders Portal** | `super_admin` | `private` or `role_based` | `organization` |
| **Investor Relations** | `investor` or `super_admin` | `private` | `organization` |

### **Backend Validation**

```python
# Publishing to Founders Portal
if not (doc.permission_level == 'private' or doc.permission_level == 'role_based'):
    raise HTTPException(400, "Only private/role-based docs can be published to Founders Portal")

# Publishing to Investor Relations
if doc.permission_level != 'private':
    raise HTTPException(400, "Only private docs can be published to Investor Relations")
```

---

## 📝 **MIGRATION CHECKLIST**

### **Existing Documents to Migrate**

From `founder_documents` collection:
- [ ] investor-relations
- [ ] business-plan
- [ ] msb-registration
- [ ] shelter-research
- [ ] design-guide
- [ ] adyen-integration
- [ ] covenant-house-outreach

### **Post-Migration**

- [ ] Verify all documents accessible
- [ ] Test publishing toggle
- [ ] Verify IR data room links
- [ ] Test access control (super_admin only)
- [ ] Verify drag-and-drop ordering still works
- [ ] Test "Share to Investor Data Room" toggle

---

## 🚀 **QUICK START**

### **For Immediate Implementation**

1. **Start with Backend**:
   ```bash
   # Create new router
   touch apps/api/routers/knowledge_secure_publishing.py
   touch apps/api/models/secure_publishing.py
   ```

2. **Create UI Component**:
   ```bash
   # Create SecureDocumentPublisher component
   touch apps/web/src/components/knowledge/SecureDocumentPublisher.tsx
   ```

3. **Test with One Document**:
   - Pick a test document from Knowledge Base
   - Add `published_to_founders: true`
   - Verify it appears in Founders Portal query

4. **Iterate & Expand**:
   - Add IR publishing
   - Build full UI component
   - Migrate existing documents

---

## 📞 **NEXT STEPS**

1. ✅ **Approve architecture** (this plan)
2. 🔧 **Phase 1**: Build backend API
3. 🎨 **Phase 2**: Build UI component
4. 🔄 **Phase 3**: Refactor portal pages
5. 🔥 **Phase 4**: Migrate existing docs
6. ✅ **Test** end-to-end
7. 🚀 **Deploy** to production

---

*Last Updated: October 31, 2025*  
*Version: 1.0*  
*Status: Ready for Implementation*

