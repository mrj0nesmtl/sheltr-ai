# Secure Document Sync - File Exclusions

## 📋 **Overview**

The secure document sync script automatically excludes certain files from being ingested into the Knowledge Base while keeping them in Firebase secure storage.

---

## 🚫 **Excluded File Patterns**

### **1. Welcome Letters** (Dashboard Use Only)
**Why:** Used by dashboard sidebar, not for knowledge base/chat

**Patterns:**
- `*welcome*.md`
- `*welcome-letter*.md`
- `[role]-welcome.md` (e.g., `admin-welcome.md`)

**Location:** Remain in Firebase secure storage for dashboard access

**Count:** ~14 files

---

### **2. Credentials Files** (Too Sensitive)
**Why:** Contains passwords, API keys, sensitive credentials

**Patterns:**
- `*credentials*.md`
- `*password*.md`
- `platform-admin-credentials.md` (explicitly excluded)

**Location:** Stored in secure storage only, NOT in knowledge base

**Count:** 1 file (platform-admin-credentials.md)

---

### **3. Draft Documents** (Work in Progress)
**Why:** Not ready for knowledge base, blog posts in draft stage

**Patterns:**
- `*draft*.md`
- `*blog-post*.md`
- `the-sheltr-journey-blog-post*.md`

**Recommendation:** Move to `/drafts` folder or add `-draft` suffix

**Count:** 3 files (blog post versions)

---

## ✅ **What WILL Be Synced**

### **📁 founders/** (4 files)
✅ `business-plan.md`  
✅ `covenant-house-canada-outreach.md`  
✅ `msb-registration-canada.md`  
✅ `royaltri-design-guide.md`  
❌ `sheltr-budget-2026.csv` (not .md, ignored)  
❌ `the-sheltr-journey-blog-post-draft.md` (draft)  
❌ `the-sheltr-journey-blog-post-v2.md` (draft)  
❌ `the-sheltr-journey-blog-post-with-frontmatter.md` (draft)  

**Total: 4 documents synced**

---

### **📁 payment-rails/** (3 files)
✅ `ADYEN-INTEGRATION-STRATEGIC-ANALYSIS.md`  
✅ `IMPLEMENTATION-READINESS-SUMMARY.md`  
✅ `README.md`  

**Total: 3 documents synced**

---

### **📁 platform-admin/** (3 files)
✅ `intro-to-sheltr.md`  
✅ `shelter-director-outreach-template.md`  
❌ `platform-admin-credentials.md` (credentials - excluded)  
❌ `welcome-letters/` folder (all welcome letters excluded)  

**Total: 2 documents synced** (1 excluded for security)

---

### **📁 shelter-research/** (4 files)
✅ `general-research.md`  
✅ `shelters_state_by_state.md`  
✅ `top_homeless_shelters_canada.md`  
✅ `unique_shelter_programs_for_homelessness.md`  

**Note:** Some may duplicate public docs. This directory is for private research that won't be published publicly.

**Total: 4 documents synced**

---

## 📊 **Sync Summary**

| Directory | Total Files | Synced | Excluded | Reason |
|-----------|------------|--------|----------|--------|
| **founders/** | 8 | 4 | 4 | 3 drafts, 1 CSV |
| **payment-rails/** | 3 | 3 | 0 | - |
| **platform-admin/** | 15+ | 2 | 13+ | 1 credentials, 12+ welcome letters |
| **shelter-research/** | 4 | 4 | 0 | - |
| **TOTAL** | 30+ | **13** | 17+ | Safety first! |

---

## 🎯 **After Sync Completes**

### **You Should See in Knowledge Base:**

**🔥 Firebase Secure Docs (13 documents)**
- 💼 **Founders** (4)
  - Business Plan
  - Covenant House Outreach
  - MSB Registration Guide
  - Royaltri Design Guide
  
- 💳 **Payment Rails** (3)
  - Adyen Integration Analysis
  - Implementation Readiness
  - README
  
- ⚙️ **Platform Admin** (2)
  - Intro to SHELTR
  - Shelter Director Outreach Template
  
- 🏢 **Shelter Research** (4)
  - General Research
  - State by State Analysis
  - Top Canadian Shelters
  - Unique Shelter Programs

---

## 🔒 **What Stays in Firebase Storage Only**

✅ **Accessible by dashboards/portals**  
❌ **NOT in knowledge base**  
❌ **NOT searchable**  
❌ **NO embeddings**  
❌ **NOT accessible to chat**

**Files:**
- 14+ welcome letters (dashboard sidebar use)
- 1 credentials file (too sensitive)
- 3 blog post drafts (not ready)

---

## 💡 **Best Practices**

### **For Drafts:**
- Move to `.local-secure-docs/drafts/` folder (create if needed)
- Or add `-draft` suffix to filename
- Or add `draft` anywhere in filename

### **For Credentials:**
- Keep in `.local-secure-docs/platform-admin/`
- Ensure filename contains "credentials" or "password"
- Will auto-exclude from sync

### **For Private Research:**
- Use `shelter-research/` directory
- Even if similar to public docs, private version kept for internal use
- Won't be published to public docs hub

### **For Welcome Letters:**
- Keep in `.local-secure-docs/platform-admin/welcome-letters/`
- Auto-excluded, accessible by dashboards
- Each role gets personalized welcome

---

## 🚀 **Ready to Sync?**

**Checklist:**
- [x] Moved 3 blog posts to drafts or added `-draft` suffix
- [x] Confirmed `platform-admin-credentials.md` should be excluded
- [x] Understood shelter-research may duplicate public docs (intentional)
- [x] Reviewed what will be synced (13 files)
- [x] Ready to click "Sync Secure Documents" button!

**Next Steps:**
1. Click "🔥 Sync Secure Documents" in Knowledge Base UI
2. Wait for sync to complete (~30 seconds)
3. Expand "Firebase Secure Docs" folder to verify
4. Then run: `node scripts/migrate-founders-portal-cards.js`

---

**Updated:** October 31, 2025  
**Status:** ✅ Ready for Sync  
**Expected Files:** 13 documents across 4 categories

