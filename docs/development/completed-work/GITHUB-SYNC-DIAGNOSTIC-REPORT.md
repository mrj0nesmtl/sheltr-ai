# 🔍 GitHub Documentation Sync Diagnostic Report
**Generated**: November 24, 2025  
**Issue**: Knowledge Base sync showing "0 New, 0 Modified, 68 Deleted" with no updates detected

---

## 🚨 ROOT CAUSE IDENTIFIED

### **Critical Issue: GitHub Token Authentication Failure**

**Error**: `401 Unauthorized` from GitHub API

```
ERROR:services.github_service:GitHub API error: 401 - {
  "documentation_url": "https://docs.github.com/rest",
INFO:services.github_service:Scan complete: 0 new, 0 modified, 68 deleted
```

**Diagnosis**: The GitHub Personal Access Token (PAT) configured in `.env` is **expired or invalid**.

**Current Token** (from `apps/api/.env`):
```
GITHUB_TOKEN=ghp_[REDACTED_EXPIRED_TOKEN]
GITHUB_OWNER=mrj0nesmtl
GITHUB_REPO=sheltr-ai
GITHUB_DOCS_PATH=docs
```

---

## 📊 What Is Being Synced (When Authentication Works)

### **Sync Configuration**
- **Repository**: `mrj0nesmtl/sheltr-ai`
- **Base Path**: `docs/` directory
- **File Types**: Markdown files (`.md`, `.markdown`)
- **Target**: Firestore `knowledge_base` collection

### **Included Directories** ✅
The sync service scans ALL subdirectories under `docs/` except those explicitly excluded:

1. **API Documentation** (`docs/api/`)
   - API reference, database schema, Firestore setup

2. **Architecture** (`docs/architecture/`)
   - Platform architecture
   - Payment rails documentation
   - Technical specifications

3. **Development** (`docs/development/`)
   - Roadmap
   - Development guides
   - **EXCLUDES**: `docs/development/completed-work/` (archived)

4. **Ecosystem** (`docs/ecosystem/`)
   - Drones, MOBI, Pods documentation

5. **Features** (`docs/features/`)
   - Blog system, chatbot, donations, knowledge base, messaging, notifications
   - Functionality matrix

6. **Implementation** (`docs/implementation/`)
   - Cost optimization, Gemini analysis, SEO strategy

7. **Integrations** (`docs/integrations/`)
   - Firebase integration docs

8. **Operations** (`docs/operations/`)
   - Firebase hosting, Google Cloud Run, monitoring, deployment

9. **Overview** (`docs/overview/`)
   - CHANGELOG, platform overview, Million-Dollar Murray PDF

10. **Plans** (`docs/plans/`)
    - Profile enhancement plans

11. **QA Testing** (`docs/qa-testing/`)
    - Business logic testing, dashboard testing, donation flow testing

12. **Reference** (`docs/reference/`)
    - API reference, database schema, design system, project tree

13. **Resources** (`docs/resources/`)
    - Research papers, templates

14. **Security** (`docs/security/`)
    - Security documentation

15. **Team** (`docs/team/`)
    - Team member bios and profiles

16. **User Guides** (`docs/user-guides/`)
    - Donor guide, shelter guide, participant guide, admin guide

---

### **Excluded Directories** ⏭️
These directories are **automatically skipped** during sync:

```python
exact_skip_paths = [
    'docs/archive',                           # Full archive folder
    'docs/development/completed-work',        # Completed work archive
]

skip_patterns = [
    'archive',
    'backup',
    'development_archive',
    'legacy-migration-archived',
    'migration',
    '09-migration',
    'archived',
    'temp',
    'tmp',
    '.git',
    'node_modules',
    '__pycache__'
]
```

**Example Excluded Paths**:
- `docs/archive/` (59 session files)
- `docs/development/completed-work/` (159 completed task files)

---

### **Excluded Files** 🚫
Individual files that are **automatically filtered out**:

1. **README Files** (15+ files)
   - Pattern: `README.md`, `README.MARKDOWN` (case-insensitive)
   - Reason: Navigation summaries with hyperlinks, not substantive documentation
   - Examples:
     - `docs/README.md`
     - `docs/api/README.md`
     - `docs/architecture/README.md`
     - `docs/reference/README.md`
     - (and 11 more)

2. **MacBook Setup Guides** (2 files)
   - Pattern: `*macbook-setup*.md`, `*quick-macbook-sync*.md`
   - Reason: Local development setup only, not relevant for knowledge base
   - Examples:
     - `docs/development/MACBOOK-SETUP-GUIDE.md`
     - `docs/development/QUICK-MACBOOK-SYNC.md`

---

## 🔄 How the Sync Process Works

### **Step 1: GitHub API Authentication**
```python
headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'SHELTR-AI-Knowledge-Sync/1.0',
    'Authorization': f'token {GITHUB_TOKEN}'  # ❌ CURRENTLY FAILING HERE
}
```

### **Step 2: Recursive Directory Scan**
- Starts at `docs/` directory
- Recursively scans all subdirectories
- Applies exclusion filters (directories and files)

### **Step 3: File Comparison**
```python
# Compare GitHub files vs Firestore knowledge_base collection
# Categorize as:
# - NEW: File exists in GitHub, not in Firestore
# - MODIFIED: File exists in both, but size differs
# - UNCHANGED: File exists in both with same size
# - DELETED: File exists in Firestore, not in GitHub
```

### **Step 4: Change Detection**
**Current Result** (with authentication failure):
- ✅ **0 New**: No new files detected (can't read GitHub)
- ⚠️ **0 Modified**: No modifications detected (can't read GitHub)
- ❌ **68 Deleted**: Firestore has 68 files that appear "deleted" because GitHub returns empty list

**Why 68 Deleted?**
- GitHub API returns **empty list** due to 401 error
- Sync service compares Firestore (68 files) vs GitHub (0 files)
- Assumes 68 files were deleted from GitHub
- **These files are NOT actually deleted!**

---

## 📈 Expected File Counts (When Working)

Based on the codebase structure:

| Category | Approx. File Count | Status |
|----------|-------------------|--------|
| **API Docs** | 3 | Should sync |
| **Architecture** | 12 | Should sync |
| **Development** | 2 | Should sync (excluding completed-work) |
| **Ecosystem** | 6 | Should sync |
| **Features** | 8 | Should sync |
| **Implementation** | 3 | Should sync |
| **Integrations** | 2 | Should sync |
| **Operations** | 4 | Should sync |
| **Overview** | 3-4 | Should sync |
| **Plans** | 1 | Should sync |
| **QA Testing** | 3 | Should sync |
| **Reference** | 4 | Should sync |
| **Resources** | 7 | Should sync (research + templates) |
| **Security** | 1 | Should sync |
| **Team** | 14 | Should sync |
| **User Guides** | 7 | Should sync |
| **TOTAL** | **~80-90 files** | ✅ Expected |

**Note**: The exact count varies as documentation is added/updated. The 68 files currently in Firestore represents a previous successful sync.

---

## 🛠️ SOLUTION: Generate New GitHub Token

### **Step 1: Create New Personal Access Token**

1. **Go to GitHub Settings**:
   - Navigate to https://github.com/settings/tokens
   - Or: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**:
   - Click "Generate new token" → "Generate new token (classic)"
   - **Note**: `SHELTR-AI Knowledge Base Sync`
   - **Expiration**: 90 days (or "No expiration" if preferred)
   - **Scopes Required**:
     - ✅ `repo` (Full control of private repositories)
       - Includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
     - ✅ `read:org` (Read org and team membership, read org projects)

3. **Copy Token**:
   - Copy the generated token immediately (it won't be shown again)
   - Format: `ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### **Step 2: Update Environment Variable**

1. **Edit `.env` file**:
   ```bash
   cd /Users/mrjones/Github/Projects/sheltr-ai/apps/api
   nano .env  # or use your preferred editor
   ```

2. **Replace old token** on line 29:
   ```bash
   # Before:
   GITHUB_TOKEN=ghp_[OLD_EXPIRED_TOKEN]
   
   # After:
   GITHUB_TOKEN=ghp_YOUR_NEW_TOKEN_HERE
   ```

3. **Save and exit**

### **Step 3: Restart Backend Server**

```bash
# Stop the current backend server
cd /Users/mrjones/Github/Projects/sheltr-ai
./stop-dev.sh

# Restart with new token
./start-dev.sh
```

### **Step 4: Test the Sync**

1. Navigate to: http://localhost:3000/dashboard/knowledge
2. Click "Scan for Changes"
3. **Expected Result**:
   - ✅ Shows actual new/modified files
   - ✅ No 401 errors in backend logs
   - ✅ Files successfully sync to knowledge base

---

## 🔍 Verify Token is Working

### **Check Backend Logs**:
```bash
tail -f /Users/mrjones/Github/Projects/sheltr-ai/logs/backend.log | grep -i github
```

### **Look for**:
```
✅ GOOD:
INFO:services.github_service:Scanning GitHub repository: mrj0nesmtl/sheltr-ai
INFO:services.github_service:Found 85 markdown files in repository
INFO:services.github_service:Scan complete: 17 new, 5 modified, 0 deleted

❌ BAD:
ERROR:services.github_service:GitHub API error: 401
```

---

## 📝 Recent Changes That Would Sync

Based on tonight's session, these files **should** appear as new/modified once the token is fixed:

### **Recently Modified Files** (Last Session):
1. `apps/web/src/services/taxReceiptService.ts` - Tax receipt PDF generation
2. `apps/web/src/components/donor/TaxDocumentsModal.tsx` - Tax documents UI
3. `apps/web/src/components/donor/RecurringGiftModal.tsx` - Recurring gift modal fixes
4. `apps/web/src/components/donor/MakeNewDonationModal.tsx` - Donation flow updates
5. `apps/web/src/app/about/page.tsx` - SmartFund models section
6. `apps/web/src/services/platformMetrics.ts` - Metrics and recurring gifts
7. `firestore.rules` - Recurring gifts permissions

**Note**: These are code files, NOT documentation. They won't sync to the knowledge base unless there are corresponding `.md` files in the `docs/` directory.

### **Documentation Files to Check**:
- `CHANGELOG.md` (root) - Should sync if we document these changes
- `docs/features/feature-documentation.md` - May need updates for recurring gifts
- `docs/qa-testing/DONATION-FLOW-TESTING-GUIDE.md` - May need updates

---

## 🎯 Action Items

### **Immediate (Tonight)**:
1. ✅ Diagnose sync issue (COMPLETED - 401 error identified)
2. 🔧 **Generate new GitHub token** (REQUIRED)
3. 🔧 **Update `.env` file** (REQUIRED)
4. 🔧 **Restart backend server** (REQUIRED)
5. ✅ Test sync functionality

### **Short-Term (This Week)**:
1. Document tonight's bug fixes in `docs/` if not already done
2. Update `CHANGELOG.md` with detailed changes
3. Verify all 80-90 expected files are synced
4. Set calendar reminder for token expiration (if using 90-day expiration)

### **Long-Term (Best Practices)**:
1. Consider using GitHub App authentication instead of PAT for better security
2. Add token expiration monitoring/alerting
3. Document token renewal process in operations docs
4. Consider rotating tokens every 90 days

---

## 📊 Summary

### **Problem**:
- GitHub sync showing "no changes" despite recent work
- 68 files appearing as "deleted" (false positive)

### **Root Cause**:
- Expired/invalid GitHub Personal Access Token
- 401 Unauthorized from GitHub API
- Sync service can't read repository, returns empty list

### **Impact**:
- Knowledge Base not receiving documentation updates
- AI chatbot using outdated information
- Search results may be stale

### **Solution**:
- Generate new GitHub token with `repo` and `read:org` scopes
- Update `GITHUB_TOKEN` in `apps/api/.env`
- Restart backend server
- Re-run sync

### **Expected Outcome After Fix**:
- ✅ ~80-90 files successfully synced from `docs/` directory
- ✅ AI chatbot has access to latest documentation
- ✅ Knowledge Base search returns current information
- ✅ Automatic embeddings generated for all synced files

---

**Report Generated By**: AI Diagnostic System  
**Next Review**: After token renewal and successful sync test

