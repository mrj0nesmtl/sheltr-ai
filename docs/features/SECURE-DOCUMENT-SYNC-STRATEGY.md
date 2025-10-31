# 🔐 Secure Document Sync Strategy

**Date**: October 31, 2025  
**Status**: 🚀 Implementation Ready  
**Priority**: 🔥 High

---

## 📁 **LOCAL STRUCTURE AUDIT**

### **`.local-secure-docs/` Directory Structure**

```
.local-secure-docs/
├── founders/                    # ✅ SYNC TO FIREBASE
│   ├── business-plan.md
│   ├── covenant-house-canada-outreach.md
│   ├── msb-registration-canada.md
│   ├── royaltri-design-guide.md
│   ├── sheltr-budget-2026.csv
│   ├── the-sheltr-journey-blog-post-draft.md
│   ├── the-sheltr-journey-blog-post-v2.md
│   └── the-sheltr-journey-blog-post-with-frontmatter.md
│
├── payment-rails/               # ✅ SYNC TO FIREBASE
│   ├── ADYEN-INTEGRATION-STRATEGIC-ANALYSIS.md
│   ├── IMPLEMENTATION-READINESS-SUMMARY.md
│   └── README.md
│
├── platform-admin/              # ✅ SYNC TO FIREBASE
│   ├── intro-to-sheltr.md
│   ├── platform-admin-credentials.md
│   ├── shelter-director-outreach-template.md
│   └── welcome-letters/         # ✅ SYNC ALL 14 LETTERS
│       ├── alexander.md
│       ├── aryan.md
│       ├── christine.md
│       ├── dominique.md
│       ├── doug.md
│       ├── gunnar.md
│       ├── jeff.md
│       ├── joel.md
│       ├── marc.md
│       ├── morgan.md
│       ├── royaltri_prod.md
│       ├── royaltri.md
│       ├── sen.md
│       └── zaffia.md
│
├── shelter-research/            # ✅ SYNC TO FIREBASE (OPTIONAL)
│   ├── general-research.md
│   ├── shelters_state_by_state.md
│   ├── top_homeless_shelters_canada.md
│   └── unique_shelter_programs_ for_homelessness.md
│
├── drafts/                      # ❌ DO NOT SYNC (work in progress)
│   └── README.md
│
├── backup-20251023-020011/      # ❌ DO NOT SYNC (old backup)
│
└── [Root markdown files]        # ❌ DO NOT SYNC (cleanup/security docs)
    ├── CLEANUP-SUMMARY.md
    ├── FORENSIC-ANALYSIS-CLEANUP-PLAN.md
    ├── GIT-HISTORY-CLEANUP-COMPLETE.md
    ├── README.md
    ├── REPOSITORY-SECURITY-AUDIT.md
    ├── SECURE-DOCUMENTS-ARCHITECTURE-REPORT.md
    └── SECURITY-INCIDENT-RESPONSE.md
```

---

## 📊 **SYNC INVENTORY**

### **Documents to Sync (28 files)**

| Directory | Files | Total |
|-----------|-------|-------|
| **founders/** | 8 markdown + 1 CSV | 9 files |
| **payment-rails/** | 3 markdown | 3 files |
| **platform-admin/** | 3 markdown + 14 welcome letters | 17 files |
| **shelter-research/** | 4 markdown (optional) | 4 files |
| **TOTAL** | | **28-33 files** |

---

## 🎯 **SYNC TARGETS**

### **Firebase Firestore Collection: `knowledge_documents`**

All documents will sync to the main Knowledge Base with appropriate permission levels:

```typescript
{
  // Standard fields
  id: string,
  title: string,
  content: string,
  category: string,
  
  // Permission & Access
  permission_level: 'private',           // All secure docs are private
  visibility_scope: 'organization',      // Internal only
  
  // Publishing destinations
  published_to_founders: boolean,        // Founders Portal
  published_to_ir: boolean,             // Investor Relations
  
  // Source tracking
  source_directory: string,              // 'founders', 'payment-rails', 'platform-admin'
  local_file_path: string,              // Original path
  
  // Metadata
  file_size: number,
  word_count: number,
  created_at: timestamp,
  updated_at: timestamp,
  synced_at: timestamp,
  
  // Secure doc fields
  secure_slug: string,
  secure_badge: string,
  secure_badge_color: string,
  founders_description: string,
  ir_description: string,
}
```

---

## 🔐 **ACCESS CONTROL MATRIX** (Updated!)

| Portal | Required Roles | Permission Level | Visibility Scope |
|--------|---------------|------------------|------------------|
| **Public Docs Hub** | Anyone | `public` | `global` |
| **Founders Portal** | `super_admin`, `platform_admin` | `private` | `organization` |
| **Investor Relations** | `investor`, `super_admin`, `platform_admin` | `private` | `organization` |

### **Role Hierarchy**

```
super_admin (Platform Founders)
    ↓ Full access to everything
platform_admin (Platform Team)
    ↓ Access to Founders + IR + All Dashboards
investor (External Investors)
    ↓ Access to IR Data Room only
shelter_admin (Shelter Operators)
    ↓ Access to shelter-specific data only
```

---

## 🗂️ **DIRECTORY MAPPING**

### **founders/ → Founders Portal**

**Target Portal**: Founders Portal (`/portal/founders-only`)  
**Access**: Super Admin, Platform Admin  
**Auto-publish**: Yes (all files)

| File | Title | Badge | Icon |
|------|-------|-------|------|
| `business-plan.md` | Business Plan | Secure | FileText |
| `covenant-house-canada-outreach.md` | Covenant House Proposal | Partnership | Briefcase |
| `msb-registration-canada.md` | MSB Registration Guide | Legal | Shield |
| `royaltri-design-guide.md` | Brand & Design Guide | Design | Palette |
| `sheltr-budget-2026.csv` | 2026 Budget | Financial | DollarSign |
| `the-sheltr-journey-blog-post-*.md` | Journey Blog Posts | Content | Edit |

---

### **payment-rails/ → Founders Portal + IR**

**Target Portals**: Founders Portal + Investor Relations  
**Access**: Super Admin, Platform Admin, Investors  
**Auto-publish**: Both portals

| File | Title | Badge | Icon |
|------|-------|-------|------|
| `ADYEN-INTEGRATION-STRATEGIC-ANALYSIS.md` | Adyen Integration Strategy | Strategic | TrendingUp |
| `IMPLEMENTATION-READINESS-SUMMARY.md` | Implementation Readiness | Launch Plan | Rocket |
| `README.md` | Payment Rails Overview | Overview | CreditCard |

---

### **platform-admin/ → Founders Portal Only**

**Target Portal**: Founders Portal  
**Access**: Super Admin, Platform Admin  
**Auto-publish**: Founders only (NOT investor-facing)

| File | Title | Badge | Icon |
|------|-------|-------|------|
| `intro-to-sheltr.md` | Intro to SHELTR | Onboarding | BookOpen |
| `platform-admin-credentials.md` | Admin Credentials | Security | Lock |
| `shelter-director-outreach-template.md` | Outreach Template | Templates | Mail |
| `welcome-letters/*.md` | Welcome Letters (14) | Onboarding | Users |

---

### **shelter-research/ → Optional (Public or Founders)**

**Options**:
1. **Public Docs Hub** (if research is public-facing)
2. **Founders Portal** (if research is internal only)

**Decision**: User choice based on content sensitivity

---

## 🔄 **SYNC WORKFLOW**

### **Manual Sync Script** (Recommended for Now)

**File**: `scripts/sync-secure-documents.js`

```javascript
/**
 * Sync .local-secure-docs to Firebase Firestore
 * 
 * Usage: node scripts/sync-secure-documents.js
 */

const directories = {
  founders: {
    targetPortal: 'founders',
    autoPublishToFounders: true,
    autoPublishToIR: false,
    defaultBadge: 'Secure',
    defaultBadgeColor: 'red',
  },
  'payment-rails': {
    targetPortal: 'both',
    autoPublishToFounders: true,
    autoPublishToIR: true,
    defaultBadge: 'Strategic',
    defaultBadgeColor: 'blue',
  },
  'platform-admin': {
    targetPortal: 'founders',
    autoPublishToFounders: true,
    autoPublishToIR: false,
    defaultBadge: 'Admin',
    defaultBadgeColor: 'purple',
  },
};

// Sync process:
// 1. Scan each directory
// 2. Read markdown files
// 3. Generate slugs
// 4. Upload to Firestore with appropriate settings
// 5. Log results
```

---

### **Automated Sync (Future)**

**Option 1: File Watcher**
- Watch `.local-secure-docs/` for changes
- Auto-sync on file save
- Requires Node.js file watcher

**Option 2: Git Hook**
- Pre-commit hook syncs changed files
- Ensures Firestore is always up-to-date

**Option 3: Manual Button**
- "Sync Secure Documents" button in Founders Portal
- Triggers sync on-demand

---

## 🛡️ **SECURITY CONSIDERATIONS**

### **1. Local File Security**

**Current Setup**:
- ✅ `.local-secure-docs/` in `.gitignore`
- ✅ Never committed to repository
- ✅ Local-only storage

**Recommendations**:
- ✅ Encrypt `.local-secure-docs/` at rest (macOS FileVault)
- ✅ Backup to encrypted external drive
- ✅ Use `.cursorignore` to prevent accidental AI context inclusion

---

### **2. Firebase Security Rules**

**Firestore Rules** for `knowledge_documents`:

```javascript
match /knowledge_documents/{docId} {
  // Read: Check permission_level and user role
  allow read: if isAuthenticated() &&
    (
      // Public docs: anyone authenticated
      (resource.data.permission_level == 'public') ||
      
      // Private docs: super_admin or platform_admin only
      (resource.data.permission_level == 'private' && 
       (request.auth.token.role == 'super_admin' || 
        request.auth.token.role == 'platform_admin'))
    );
  
  // Write: Only super_admin and platform_admin
  allow write: if isAuthenticated() &&
    (request.auth.token.role == 'super_admin' || 
     request.auth.token.role == 'platform_admin');
}
```

---

### **3. Sync Safety**

**Pre-Sync Checks**:
- ✅ Validate user is `super_admin` or `platform_admin`
- ✅ Confirm no duplicate slugs
- ✅ Verify file integrity (checksums)
- ✅ Preview changes before applying

**Dry Run Mode**:
```bash
node scripts/sync-secure-documents.js --dry-run
# Shows what WOULD be synced without actually syncing
```

---

## 📋 **SYNC CHECKLIST**

### **Pre-Sync Preparation**

- [ ] Verify all markdown files are properly formatted
- [ ] Check for sensitive information (passwords, API keys)
- [ ] Ensure file names are descriptive
- [ ] Add frontmatter metadata if needed
- [ ] Review access control requirements

### **Sync Execution**

- [ ] Run dry-run first: `--dry-run`
- [ ] Review proposed changes
- [ ] Execute sync: `node scripts/sync-secure-documents.js`
- [ ] Verify documents in Firestore console
- [ ] Test access in Founders Portal
- [ ] Test access in Investor Relations

### **Post-Sync Validation**

- [ ] Verify document counts match
- [ ] Test permission enforcement
- [ ] Check publishing badges in Knowledge Base
- [ ] Verify secure slugs are URL-safe
- [ ] Test "View Live" buttons

---

## 🎯 **RECOMMENDED SYNC STRATEGY**

### **Phase 1: Initial Sync (One-Time)**

1. **Start with payment-rails/** (3 files, least sensitive)
   - Test the sync process
   - Verify publishing to both portals works
   - Validate access control

2. **Add founders/** (8 files)
   - Sync to Founders Portal only
   - Test SecureDocumentViewer rendering
   - Verify badge system

3. **Add platform-admin/** (17 files)
   - Sync welcome letters
   - Test bulk upload
   - Verify folder structure

4. **Optional: shelter-research/** (4 files)
   - Decide: Public or Founders?
   - Sync accordingly

---

### **Phase 2: Ongoing Maintenance**

**When to Sync**:
- ✅ After creating new secure documents
- ✅ After editing existing documents
- ✅ Before investor meetings (ensure IR is current)
- ✅ During platform admin onboarding

**Sync Frequency**:
- **Manual**: As needed (recommended for now)
- **Automated**: Future enhancement

---

## 🚀 **NEXT STEPS**

1. ✅ **Review this sync strategy** (approved by user)
2. 🔧 **Build Phase 1 Backend API** (in progress)
3. 🎨 **Build SecureDocumentPublisher UI** (Phase 2)
4. 📝 **Create sync script** (`sync-secure-documents.js`)
5. ✅ **Test with 1 document** from payment-rails
6. 🔄 **Full sync of all directories**
7. ✅ **Validate in production portals**

---

## 📊 **EXPECTED RESULTS**

### **After Sync**

**Founders Portal** (`/portal/founders-only`):
- ✅ 28 document cards (dynamically loaded)
- ✅ All founders/ documents
- ✅ All payment-rails/ documents
- ✅ All platform-admin/ documents

**Investor Relations** (`/ir/dataroom`):
- ✅ 3 document cards (payment-rails only)
- ✅ Adyen Integration Strategy
- ✅ Implementation Readiness
- ✅ Payment Rails Overview

**Knowledge Base** (`/dashboard/knowledge`):
- ✅ 28 new secure documents
- ✅ Publishing badges visible
- ✅ "Founders" and "IR" badges showing
- ✅ Permission level: Private

---

*Last Updated: October 31, 2025*  
*Version: 1.0*  
*Status: Ready for Implementation*

