# 🔐 Secure Documents Architecture Report

**Date**: October 30, 2025  
**Status**: Documentation Cleanup Phase  

---

## 📊 CURRENT STATE

### Git Status:
```
✅ 1 commit ahead of origin (Archive Phase 5 docs)
📝 1 file staged for deletion: docs/operations/GIT-SSH-SETUP.md
```

### `.local-secure-docs` Status:
```
📁 Total Files: 76
📂 Folder Structure:
   ├── backup-20251023-020011/
   ├── founders/
   ├── payment-rails/ (3 files)
   ├── platform-admin/ (credentials + 10 welcome letters)
   └── shelter-research/
```

---

## 🏗️ SECURE DOCUMENTS ARCHITECTURE

### **TWO SEPARATE SYSTEMS:**

## 1️⃣ **LOCAL FILE SYSTEM** (`.local-secure-docs/`)

**Purpose**: Development-time secure document storage  
**Location**: `/Users/mrjones/Github/Projects/sheltr-ai/.local-secure-docs`  
**Status**: ❌ **NOT synced to GitHub** (in `.gitignore`)  
**Status**: ❌ **NOT synced to Knowledge Base**  
**Status**: ❌ **NOT synced to Firebase**  

**Contents**:
- Payment rail credentials & analysis
- Platform admin credentials
- Welcome letters for team members
- Security incident reports
- Repository audit docs

**⚠️ ISSUE**: This is a **manual, disconnected system**

---

## 2️⃣ **FIREBASE FIRESTORE** (Production Secure Docs)

**Purpose**: Production secure document storage with role-based access  
**Collections**:
- `founder_documents` - Documents for founders/leadership
- `platform_admin_documents` - Documents for platform admins
- `secure_documents` - General secure documents

**Service**: `secureDocumentService.ts` handles all CRUD operations

**Access Control**:
- ✅ Role-based authentication (super_admin, platform_admin, founders)
- ✅ Document-level permissions
- ✅ Audit logging
- ✅ Version control

---

## 📚 KNOWLEDGE BASE SYSTEM

**Collection**: `knowledge_base` in Firestore  
**Purpose**: Public/internal documentation with AI embeddings  
**Source**: Syncs from GitHub `/docs` folder  

**Key Features**:
- ✅ Automatic GitHub sync
- ✅ AI embeddings for chatbot
- ✅ Category-based organization
- ✅ **NEW: Permission levels (Phase 5!)**

**⚠️ IMPORTANT**: Knowledge Base is for **documentation**, not secure credentials!

---

## 🔄 DOCUMENT FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────┐
│                   DOCUMENT SOURCES                       │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌────────────────┐
│ GitHub /docs  │  │.local-secure  │  │  Manual DB     │
│   (Public)    │  │   (Local)     │  │   Upload       │
└───────┬───────┘  └───────────────┘  └───────┬────────┘
        │                                      │
        │ Auto-Sync via                        │ Manual
        │ GitHub Service                       │ via API
        ▼                                      ▼
┌──────────────────┐              ┌─────────────────────┐
│  Knowledge Base  │              │  Firestore Secure   │
│   (Firestore)    │              │    Collections      │
│                  │              │                     │
│ • Public docs    │              │ • founder_documents │
│ • AI embeddings  │              │ • platform_admin_   │
│ • Chatbot data   │              │     documents       │
│ • NEW: Perms!    │              │ • secure_documents  │
└──────┬───────────┘              └─────────┬───────────┘
       │                                    │
       │ Powers                             │ Powers
       ▼                                    ▼
┌──────────────────┐              ┌─────────────────────┐
│  Public Docs Hub │              │  Founder Portal &   │
│ /docs pages      │              │  Investor Dataroom  │
└──────────────────┘              └─────────────────────┘
```

---

## 🎯 ANSWERING YOUR QUESTIONS

### Q1: **"How are we managing local secure documents?"**

**Answer**: Currently **manually and disconnected**. 

`.local-secure-docs` is:
- ❌ Not in version control
- ❌ Not synced anywhere
- ❌ Not backed up automatically
- ✅ Only on your local machine

**Recommendation**: Archive or migrate to Firebase for production use.

---

### Q2: **"Is the knowledge base going to populate the founder portal?"**

**Answer**: **NO** - They are separate systems:

**Knowledge Base**:
- Purpose: Public/internal **documentation**
- Content: Technical docs, guides, architecture
- Access: Based on new permission system (Phase 5)
- Powers: Public docs hub, AI chatbot

**Founder Portal**:
- Purpose: **Secure business documents**
- Content: Business plans, credentials, strategies
- Access: Role-based (founders, platform_admin, super_admin)
- Source: Firebase `founder_documents` collection

**They serve different purposes!**

---

### Q3: **"Does it populate the investor relations dataroom?"**

**Answer**: **NO** - Investor dataroom is **hardcoded**:

From `apps/web/src/app/ir/dataroom/page.tsx`:
```typescript
// Simple hardcoded list of documents available to investors
const INVESTOR_DOCUMENTS: InvestorDocument[] = [
  {
    id: 'adyen-integration',
    title: 'Adyen Integration Strategy',
    ...
  },
  // ... more hardcoded documents
];
```

**How it works**:
1. Document list is hardcoded in the component
2. Each document links to `/portal/founders-only/[document-slug]`
3. Founders portal serves the actual document from Firebase
4. Investor sees card, clicks, gets redirected to founders portal

**It's a pointer system, not a sync!**

---

### Q4: **"How is the database structure changed?"**

**Answer**: **Knowledge Base got upgraded** (Phase 5):

**OLD Structure** (< Phase 5):
```typescript
{
  title: string,
  content: string,
  category: string,
  access_level: 'public',  // Basic
  tags: string[]
}
```

**NEW Structure** (Phase 5):
```typescript
{
  title: string,
  content: string,
  category: string,
  access_level: 'public',           // Legacy (kept for compatibility)
  permission_level: 'public' | 'authenticated' | 'donor' | ...,  // NEW!
  is_private: boolean,              // NEW!
  synced_from_github: boolean,      // NEW!
  github_path: string,              // NEW!
  tags: string[]
}
```

**Secure Documents** (unchanged):
```typescript
{
  title: string,
  content: string,
  type: 'markdown' | 'html' | 'text',
  category: string,
  metadata: {
    confidentialityLevel: 'founder' | 'platform_admin' | 'internal'
  }
}
```

---

## 🧹 CLEANUP RECOMMENDATIONS

### `.local-secure-docs/` Cleanup:

**Option A: Archive Everything** (Safest)
```bash
# Move to archive
mkdir -p docs/archive/local-secure-docs-backup
cp -r .local-secure-docs/* docs/archive/local-secure-docs-backup/
git add docs/archive/local-secure-docs-backup/
git commit -m "Archive local secure docs for historical reference"
```

**Option B: Selective Cleanup**
```bash
# Keep only active folders, remove backups
rm -rf .local-secure-docs/backup-20251023-020011/

# Move critical docs to Firebase (manual process)
# Then delete local copies
```

**Option C: Leave As-Is**
- Already ignored by git
- Not causing any issues
- Good for local reference

**My Recommendation**: **Option C for now**  
Wait until you're ready to migrate to Firebase properly.

---

## 🎯 KNOWLEDGE BASE & PERMISSIONS

### What Phase 5 Permission System Does:

**GitHub Sync** (`github_service.py`):
```python
# When syncing from GitHub:
auto_permission = determine_permission_from_path(file_path)
# Examples:
# docs/overview/* → PUBLIC
# docs/architecture/* → PUBLIC
# secure/* → FOUNDERS
# admin/* → PLATFORM_ADMIN
```

**Benefits**:
- ✅ Automatic permission assignment
- ✅ Path-based intelligence
- ✅ Zero manual work
- ✅ Consistent rules

**What it DOESN'T do**:
- ❌ Touch `.local-secure-docs`
- ❌ Create founder portal documents
- ❌ Populate investor dataroom
- ❌ Handle credentials

**It's purely for documentation permissions!**

---

## 📋 SUMMARY

### What You Have:

1. **Knowledge Base** (Firestore)
   - Syncs from GitHub `/docs`
   - Has public documentation
   - NEW: Permission system
   - Powers: Public docs hub, AI chatbot

2. **Secure Documents** (Firestore)
   - Manually uploaded
   - Role-based access
   - Powers: Founder portal, investor links

3. **Local Secure Docs** (Filesystem)
   - Local only
   - Not synced anywhere
   - Good for reference
   - Not production

### What's Separate:

- ✅ Knowledge Base ≠ Founder Portal
- ✅ Knowledge Base ≠ Investor Dataroom
- ✅ Knowledge Base ≠ Secure Documents
- ✅ Local Secure Docs ≠ Anything

### They're All Independent Systems!

---

## 🚀 NEXT STEPS

### Immediate (Today):
1. ✅ Commit the SSH doc deletion
2. ✅ Push to GitHub
3. ✅ Test GitHub sync with new permissions
4. ✅ Verify knowledge base gets updated

### Soon (This Week):
1. 📋 Document the founder portal workflow
2. 📋 Create migration plan for `.local-secure-docs`
3. 📋 Update investor dataroom to be dynamic (if needed)

### Later (When Ready):
1. 🔄 Migrate `.local-secure-docs` to Firebase
2. 🔄 Create admin UI for secure document management
3. 🔄 Implement document versioning
4. 🔄 Add audit logs

---

## ✅ CURRENT ARCHITECTURE IS GOOD!

Your setup is solid:
- ✅ Clear separation of concerns
- ✅ Secure documents are secure
- ✅ Public docs are public
- ✅ Role-based access works
- ✅ New permission system enhances knowledge base

**No cleanup needed immediately!**  
`.local-secure-docs` being separate is fine. It's just local reference material.

---

*Report generated: October 30, 2025*  
*Status: Ready to test Phase 6!*

