# 🔒 Agent Prompt: Security Vulnerabilities & Dependency Updates

**Date**: November 25, 2025  
**Priority**: HIGH  
**Estimated Time**: 2-3 hours  
**Agent Type**: Security & Maintenance

---

## 🎯 **Mission Objective**

Address GitHub security vulnerabilities and process pending dependency updates for the SHELTR-AI platform. This is a critical maintenance task to ensure platform security and stability.

---

## 📋 **Task Overview**

### **Primary Tasks**

1. **Security Vulnerabilities** (5 detected)
   - 1 HIGH severity
   - 4 MODERATE severity
   - Review Dependabot alerts: https://github.com/mrj0nesmtl/sheltr-ai/security/dependabot

2. **Pull Requests** (~30 pending)
   - Mostly minor dependency updates
   - Review, test, and merge safe updates
   - Batch similar updates where possible

---

## 🔍 **Step-by-Step Instructions**

### **Phase 1: Security Assessment (30 mins)**

1. **Review Dependabot Alerts**
   ```bash
   # Navigate to GitHub Security tab
   https://github.com/mrj0nesmtl/sheltr-ai/security/dependabot
   ```

2. **Categorize Vulnerabilities**
   - HIGH: Immediate action required
   - MODERATE: Review and prioritize
   - Document each vulnerability:
     - Package name
     - Current version
     - Fixed version
     - CVE details
     - Impact on SHELTR platform

3. **Create Vulnerability Report**
   - File: `docs/security/VULNERABILITY-REPORT-NOV-2025.md`
   - Include: CVE IDs, severity, affected packages, remediation steps

---

### **Phase 2: Dependency Analysis (45 mins)**

1. **Review Pull Requests**
   ```bash
   # List all open PRs
   gh pr list --limit 50
   ```

2. **Categorize PRs**
   - **Critical Security Fixes**: Merge immediately
   - **Minor Updates**: Safe to batch
   - **Major Updates**: Requires testing
   - **Breaking Changes**: Requires careful review

3. **Check for Conflicts**
   - Identify PRs that conflict with each other
   - Determine merge order
   - Note any that require manual intervention

---

### **Phase 3: Security Fixes (60 mins)**

1. **Address HIGH Severity First**
   ```bash
   # For each HIGH severity vulnerability
   npm update [package-name]@[safe-version]
   # OR
   pip install --upgrade [package-name]==[safe-version]
   ```

2. **Test After Each Fix**
   ```bash
   # Frontend tests
   cd apps/web
   npm run build
   npm run lint
   
   # Backend tests
   cd apps/api
   source .venv/bin/activate
   pip install -r requirements.txt
   pytest tests/ -v
   ```

3. **Verify No Breaking Changes**
   - Start dev environment: `./start-dev.sh`
   - Test critical features:
     - ✅ Authentication (login/logout)
     - ✅ Donations (make donation, recurring gifts)
     - ✅ Chatbot (public & dashboard)
     - ✅ Knowledge Base (sync, search)
     - ✅ Tax Receipts (generate PDF)

---

### **Phase 4: Dependency Updates (45 mins)**

1. **Batch Safe Updates**
   ```bash
   # Frontend dependencies
   cd apps/web
   npm update --save
   
   # Backend dependencies
   cd apps/api
   pip list --outdated
   pip install --upgrade [safe-packages]
   ```

2. **Update Lock Files**
   ```bash
   # Frontend
   npm install
   
   # Backend
   pip freeze > requirements.txt
   ```

3. **Test Comprehensive Build**
   ```bash
   # Full build test
   npm run build
   
   # Backend health check
   curl http://localhost:8000/health
   ```

---

### **Phase 5: Pull Request Management (30 mins)**

1. **Merge Strategy**
   - **Auto-merge safe PRs**: Minor version bumps, no breaking changes
   - **Manual review**: Major version bumps, breaking changes
   - **Close outdated**: PRs superseded by newer updates

2. **Merge Commands**
   ```bash
   # Review PR
   gh pr view [PR-NUMBER]
   
   # Merge if safe
   gh pr merge [PR-NUMBER] --squash --delete-branch
   
   # Close if outdated
   gh pr close [PR-NUMBER] --comment "Superseded by newer update"
   ```

3. **Batch Merge Similar PRs**
   - Group by package ecosystem (npm, pip, etc.)
   - Merge in logical batches
   - Test after each batch

---

## 🧪 **Testing Checklist**

After each major change, verify:

### **Frontend (Next.js)**
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Donations flow works
- [ ] Tax receipts generate
- [ ] Chatbot responds

### **Backend (FastAPI)**
- [ ] `pytest` passes all tests
- [ ] API health endpoint responds
- [ ] Chatbot endpoints work
- [ ] Knowledge base endpoints work
- [ ] Firebase connections stable
- [ ] Gemini API responds
- [ ] OpenAI API responds (embeddings)

### **Integration**
- [ ] Frontend connects to backend
- [ ] Public chatbot works
- [ ] Dashboard chatbot works
- [ ] Knowledge base sync works
- [ ] Secure docs sync works
- [ ] Tax receipt generation works

---

## 📦 **Package Ecosystems**

### **Frontend (apps/web)**
- **Package Manager**: npm
- **Key Dependencies**:
  - `next` (Next.js framework)
  - `react`, `react-dom`
  - `firebase` (Firebase SDK)
  - `jspdf` (PDF generation)
  - `@radix-ui/*` (UI components)
  - `tailwindcss` (Styling)

### **Backend (apps/api)**
- **Package Manager**: pip
- **Key Dependencies**:
  - `fastapi` (API framework)
  - `firebase-admin` (Firebase Admin SDK)
  - `openai` (OpenAI API)
  - `google-generativeai` (Gemini API)
  - `pydantic` (Data validation)
  - `pytest` (Testing)

---

## 🚨 **Known Issues & Warnings**

### **DO NOT UPDATE** (Breaking Changes)
- ❌ **Next.js 15.x → 16.x**: Wait for stable release
- ❌ **React 18.x → 19.x**: Major breaking changes
- ❌ **Firebase 10.x → 11.x**: Check compatibility first

### **Safe to Update**
- ✅ **Patch versions** (e.g., 1.2.3 → 1.2.4)
- ✅ **Minor versions** (e.g., 1.2.0 → 1.3.0) - with testing
- ✅ **Security patches** (always)

### **Requires Manual Review**
- ⚠️ **Major versions** (e.g., 1.x → 2.x)
- ⚠️ **Breaking changes** noted in changelog
- ⚠️ **Peer dependency conflicts**

---

## 📝 **Documentation Requirements**

### **1. Create Security Report**
File: `docs/security/VULNERABILITY-REPORT-NOV-2025.md`

```markdown
# Security Vulnerability Report - November 2025

## Summary
- Total vulnerabilities: 5
- HIGH: 1
- MODERATE: 4
- Status: [RESOLVED/IN PROGRESS/PENDING]

## Vulnerabilities

### HIGH Severity
1. **[CVE-ID]** - [Package Name]
   - Current Version: X.X.X
   - Fixed Version: X.X.X
   - Impact: [Description]
   - Remediation: [Steps taken]
   - Status: [RESOLVED/PENDING]

### MODERATE Severity
[Repeat for each vulnerability]

## Testing Results
[Document test results after fixes]

## Recommendations
[Future prevention strategies]
```

### **2. Create Dependency Update Log**
File: `docs/development/DEPENDENCY-UPDATES-NOV-2025.md`

```markdown
# Dependency Updates - November 2025

## Frontend Updates
| Package | Old Version | New Version | Type | Status |
|---------|-------------|-------------|------|--------|
| next    | 15.5.3      | 15.5.4      | Patch| ✅     |

## Backend Updates
| Package | Old Version | New Version | Type | Status |
|---------|-------------|-------------|------|--------|
| fastapi | 0.104.1     | 0.105.0     | Minor| ✅     |

## Pull Requests Merged
- #123: Bump next from 15.5.3 to 15.5.4
- #124: Bump fastapi from 0.104.1 to 0.105.0

## Pull Requests Closed
- #100: Superseded by #123

## Testing Notes
[Document any issues encountered during testing]
```

### **3. Update CHANGELOG.md**
Add entry for this maintenance session:

```markdown
## v2.149.0 - 2025-11-25 (Security & Dependency Updates)

### 🔒 Security
- Fixed HIGH severity vulnerability in [package]
- Fixed 4 MODERATE severity vulnerabilities
- Updated all security-critical dependencies

### 📦 Dependencies
- Updated [X] frontend packages
- Updated [X] backend packages
- Merged [X] Dependabot PRs
- Closed [X] outdated PRs

### ✅ Testing
- All tests passing
- No breaking changes
- Platform stability verified
```

---

## 🔄 **Git Workflow**

### **Branch Strategy**
```bash
# Create feature branch
git checkout -b security/nov-2025-updates

# Make changes, commit frequently
git add -A
git commit -m "fix: update [package] to resolve CVE-XXXX"

# Push to remote
git push origin security/nov-2025-updates

# Create PR
gh pr create --title "Security & Dependency Updates - Nov 2025" \
             --body "Addresses 5 security vulnerabilities and updates 30+ dependencies"
```

### **Commit Message Format**
```bash
# Security fixes
git commit -m "fix: update [package] to resolve CVE-XXXX"

# Dependency updates
git commit -m "chore: update [package] from X.X.X to X.X.X"

# Batch updates
git commit -m "chore: update frontend dependencies (patch versions)"

# Documentation
git commit -m "docs: add security vulnerability report"
```

---

## 🎯 **Success Criteria**

### **Must Complete**
- [ ] All HIGH severity vulnerabilities resolved
- [ ] All MODERATE severity vulnerabilities resolved
- [ ] Security report created and committed
- [ ] Dependency update log created
- [ ] CHANGELOG.md updated
- [ ] All tests passing
- [ ] Dev environment starts successfully
- [ ] Production build succeeds

### **Should Complete**
- [ ] At least 20 PRs merged or closed
- [ ] Lock files updated
- [ ] No new vulnerabilities introduced
- [ ] No breaking changes

### **Nice to Have**
- [ ] All 30 PRs processed
- [ ] Automated dependency update workflow created
- [ ] Security scanning integrated into CI/CD

---

## 🚀 **Deployment Strategy**

### **After All Updates**
1. **Test Locally**
   ```bash
   ./start-dev.sh
   # Verify all features work
   ```

2. **Deploy to Production**
   ```bash
   ./deploy.sh
   # Select option 3: Quick re-deploy (front + back)
   ```

3. **Monitor Production**
   - Check Cloud Run logs
   - Verify API health: https://sheltr-api-714964620823.us-central1.run.app/health
   - Test public chatbot: https://sheltr-ai.web.app
   - Monitor error rates in Firebase Console

---

## 📞 **Contact & Resources**

### **GitHub Resources**
- Security Alerts: https://github.com/mrj0nesmtl/sheltr-ai/security/dependabot
- Pull Requests: https://github.com/mrj0nesmtl/sheltr-ai/pulls
- Actions: https://github.com/mrj0nesmtl/sheltr-ai/actions

### **Documentation**
- Development Summary: `docs/development/development-summary.md`
- Security Policy: `docs/security/security.md`
- Deployment Guide: `docs/operations/prod-deployment.md`

### **Project Context**
- **Tech Stack**: Next.js, FastAPI, Firebase, Gemini AI, OpenAI
- **Current Version**: v2.148.0
- **Last Major Update**: Session 25 (Secure Docs Cleanup)
- **Production URL**: https://sheltr-ai.web.app
- **API URL**: https://sheltr-api-714964620823.us-central1.run.app

---

## 💡 **Tips for Success**

1. **Start with HIGH severity** - Address critical vulnerabilities first
2. **Test incrementally** - Don't batch too many updates at once
3. **Read changelogs** - Check for breaking changes before updating
4. **Keep notes** - Document any issues or unexpected behavior
5. **Ask for help** - If unsure about a major update, flag it for review
6. **Backup first** - Ensure git is clean before starting
7. **Monitor logs** - Watch for errors after each update
8. **Be conservative** - When in doubt, don't update (especially major versions)

---

## ⚠️ **Red Flags - Stop and Review**

If you encounter any of these, STOP and document:
- ❌ Tests failing after update
- ❌ Build errors that can't be quickly resolved
- ❌ Breaking changes in major dependencies
- ❌ Peer dependency conflicts
- ❌ API endpoints returning errors
- ❌ Frontend not connecting to backend
- ❌ Firebase authentication failing
- ❌ Chatbot not responding

---

## 📊 **Expected Outcomes**

### **Before**
- 5 security vulnerabilities (1 HIGH, 4 MODERATE)
- ~30 pending pull requests
- Outdated dependencies
- Potential security risks

### **After**
- ✅ 0 security vulnerabilities
- ✅ All safe PRs merged
- ✅ Dependencies up to date
- ✅ Security report documented
- ✅ Platform stable and tested
- ✅ Production deployed successfully

---

**Good luck! Remember: Security first, stability second, features third.** 🔒🚀

---

## 🤖 **Agent Initialization Checklist**

Before starting, ensure you have:
- [ ] Access to GitHub repository
- [ ] Access to Dependabot alerts
- [ ] Local development environment running
- [ ] Git clean working directory
- [ ] Understanding of SHELTR platform architecture
- [ ] This prompt document open for reference

**Ready to begin? Start with Phase 1: Security Assessment!**

