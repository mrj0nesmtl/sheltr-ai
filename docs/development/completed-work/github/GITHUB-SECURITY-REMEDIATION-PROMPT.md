# GitHub Security Remediation - Comprehensive Prompt

**Date**: December 11, 2025  
**Project**: SHELTR-AI  
**Repository**: https://github.com/mrj0nesmtl/sheltr-ai

---

## 📊 Current Security Status

### Summary
- **27 Pull Requests** - Pending review and processing
- **10 Dependabot Alerts** - Vulnerability patches available
- **4 Code Scanning Alerts** - Security issues detected by CodeQL
- **30 Secret Scanning Alerts** - CLOSED (previously resolved)

---

## 🎯 Comprehensive Remediation Prompt

**FOR NEW AI AGENT SESSION:**

```
I need your expert assistance to systematically address all security issues in the SHELTR-AI GitHub repository. This is a production-grade TypeScript/Node.js/Next.js/Python project with Firebase integration.

## CONTEXT

Repository: https://github.com/mrj0nesmtl/sheltr-ai
Tech Stack:
- Frontend: Next.js 15.5.7, React, TypeScript
- Backend: Python FastAPI, Firebase Admin SDK
- Infrastructure: Firebase Hosting, Google Cloud Run
- Security: Firebase Auth, Firestore Security Rules

## CURRENT ISSUES TO RESOLVE

### 1. DEPENDABOT ALERTS (10 Total)

**High Priority (3):**
1. node-forge: ASN.1 Unbounded Recursion (#34)
   - Package: node-forge (npm)
   - Location: functions/package-lock.json
   - Severity: HIGH
   - Opened: Last week

2. node-forge: Interpretation Conflict vulnerability via ASN.1 Validator Desynchronization (#36)
   - Package: node-forge (npm)
   - Location: functions/package-lock.json
   - Severity: HIGH
   - Opened: Last week

3. glob CLI: Command injection via -c/--cmd executes matches with shell:true (#32)
   - Package: glob (npm)
   - Location: functions/package-lock.json
   - Severity: HIGH (Development)
   - Opened: 2 weeks ago

**Moderate Priority (4):**
4. mdast-util-to-hast: unsanitized class attribute (#39)
   - Package: mdast-util-to-hast (npm)
   - Location: apps/web/apps/web/package-lock.json
   - Severity: MODERATE
   - Opened: 2 days ago

5. node-forge: ASN.1 OID Integer Truncation (#35)
   - Package: node-forge (npm)
   - Location: functions/package-lock.json
   - Severity: MODERATE
   - Opened: Last week

6. js-yaml: prototype pollution in merge (<<) (#31)
   - Package: js-yaml (npm)
   - Location: functions/package-lock.json
   - Severity: MODERATE (Development)
   - Opened: 2 weeks ago

7. js-yaml: prototype pollution in merge (<<) (#28)
   - Package: js-yaml (npm)
   - Location: functions/package-lock.json
   - Severity: MODERATE (Development)
   - Opened: 2 weeks ago

**Low Priority (3):**
8-10. Additional auth0/node-jws HMAC Signature vulnerabilities
   - Multiple instances in different package-lock.json files
   - Severity: HIGH
   - Opened: Last week

### 2. CODE SCANNING ALERTS (4 Total)

1. **DOM text reinterpreted as HTML** (HIGH) - #186
   - Tool: CodeQL
   - File: apps/.../gallery/page.tsx :270
   - Opened: Oct 2

2. **DOM text reinterpreted as HTML** (HIGH) - #184
   - Tool: CodeQL
   - File: apps/.../gallery/page.tsx :162
   - Opened: Sep 29

3. **Clear-text logging of sensitive information** (HIGH) - #202
   - Tool: CodeQL
   - File: apps/.../routers/knowledge_docs_hub.py :187
   - Opened: Last week

4. **Replacement of a substring with itself** (MEDIUM) - #183
   - Tool: CodeQL
   - File: apps/.../platform-admin-welcome/page.tsx :165
   - Opened: Sep 25

### 3. PULL REQUESTS (27 Total)

**Recent Dependency Updates (Dependabot):**
- js-yaml: 3.14.1 → 3.14.2 (functions & apps/web)
- @google-cloud/firestore: 7.11.6 → 8.0.0 (functions)
- es-toolkit: 1.39.10 → 1.41.0 (apps/web)
- @typescript-eslint/eslint-plugin: 8.43.0 → 8.46.2 (functions)
- firebase-functions: 6.4.0 → 6.6.0 (functions)
- @typescript-eslint/parser: 8.43.0 → 8.46.2 (functions)
- react-day-picker: 9.11.0 → 9.11.1 (apps/web)
- @eslint/object-schema: 2.1.6 → 2.1.7 (apps/web)
- next: 15.5.3 → 15.5.6 (apps/web)
- axe-core: 4.10.3 → 4.11.0 (apps/web)
- rehype-rewrite: 4.0.2 → 4.0.3 (apps/web)
- tapable: 2.2.3 → 2.3.0 (apps/web)
- twilio: 9.7.2 → 9.8.4 (apps/api)
- pillow: 10.3.0 → 12.0.0 (apps/api)
- python-dotenv: 1.0.0 → 1.1.1 (apps/api)
- sqlalchemy: 2.0.43 → 2.0.44 (apps/api)
- fastapi: 0.104.1 → 0.119.1 (apps/api)
- detect-libc: 2.1.0 → 2.1.2 (apps/web)
- google-cloud-storage: 3.3.0 → 3.4.1 (apps/api)

## YOUR TASK

Please systematically address these issues following this approach:

### Phase 1: Assessment & Planning (15 minutes)
1. Analyze all Dependabot alerts and categorize by:
   - Direct vs transitive dependencies
   - Production vs development dependencies
   - Breaking vs non-breaking changes
   - Security impact severity

2. Review all Code Scanning alerts and identify:
   - Root causes
   - Potential security implications
   - Required code changes
   - Testing requirements

3. Evaluate Pull Requests and determine:
   - Safe to merge immediately
   - Requires testing
   - May introduce breaking changes
   - Conflicts with other PRs

### Phase 2: Execution Strategy

**For Dependabot Alerts:**
- Update package-lock.json files directly where possible
- For breaking changes, update package.json and regenerate locks
- Test critical paths after each update
- Prioritize HIGH severity issues first

**For Code Scanning Alerts:**
- Fix XSS vulnerabilities in gallery/page.tsx (sanitize HTML output)
- Remove sensitive logging in knowledge_docs_hub.py
- Fix string replacement logic in platform-admin-welcome/page.tsx
- Add security comments explaining fixes

**For Pull Requests:**
- Merge non-breaking dependency updates in batches
- Test breaking changes (firestore 8.0.0, next 15.5.6, fastapi 0.119.1) individually
- Run full test suite after merging
- Update CHANGELOG.md with all merged PRs

### Phase 3: Verification & Documentation

1. **Testing Requirements:**
   - Run `npm run build` in apps/web
   - Run `npm run build` in functions
   - Test Python backend: `cd apps/api && python -m pytest`
   - Manual testing of critical features:
     * Authentication flow
     * Chatbot functionality
     * Knowledge base operations
     * Donation processing
     * Tax receipt generation

2. **Documentation Updates:**
   - Update CHANGELOG.md with all security fixes
   - Create SESSION-27-SECURITY-REMEDIATION.md in docs/development/
   - Update SECURITY.md with new security measures
   - Document any breaking changes in migration guide

3. **Git Workflow:**
   - Create feature branch: `security/github-alerts-remediation`
   - Commit changes in logical groups:
     * "fix: resolve node-forge vulnerabilities"
     * "fix: address CodeQL XSS alerts"
     * "chore: merge dependabot PRs for non-breaking updates"
     * "feat: upgrade to firestore 8.0.0 and next 15.5.6"
   - Use conventional commits format
   - Push and create PR for review

### Phase 4: Post-Remediation

1. **Verification Checklist:**
   - [ ] All HIGH severity Dependabot alerts resolved
   - [ ] All Code Scanning alerts addressed
   - [ ] All safe PRs merged
   - [ ] Breaking change PRs tested and documented
   - [ ] Production build successful
   - [ ] All tests passing
   - [ ] CHANGELOG.md updated
   - [ ] Security documentation updated

2. **Monitoring:**
   - Enable GitHub Dependabot auto-merge for patch updates
   - Configure CodeQL to run on all PRs
   - Set up notifications for new security alerts
   - Schedule monthly security review

## IMPORTANT CONSTRAINTS

1. **DO NOT:**
   - Disable security features to "fix" alerts
   - Skip testing after dependency updates
   - Merge PRs without reviewing changes
   - Remove security rules or validations
   - Commit sensitive information

2. **DO:**
   - Test thoroughly after each change
   - Document breaking changes
   - Follow semantic versioning
   - Use conventional commit messages
   - Keep dependencies up to date
   - Maintain backward compatibility where possible

3. **SPECIAL CONSIDERATIONS:**
   - This is a PRODUCTION system handling real donations
   - Firebase integration requires careful testing
   - Python backend must remain compatible with Cloud Run
   - Next.js static export mode must be preserved
   - All security rules (Firestore, Storage) must remain intact

## SUCCESS CRITERIA

- ✅ Zero HIGH severity Dependabot alerts
- ✅ Zero Code Scanning alerts
- ✅ All safe PRs merged
- ✅ Production build passes
- ✅ All tests green
- ✅ Documentation complete
- ✅ No regressions in functionality

## ADDITIONAL RESOURCES

- Project Documentation: `/docs/`
- Security Policy: `/SECURITY.md`
- Deployment Guide: `/deploy.sh`
- Development Setup: `/start-dev.sh`
- Firebase Config: `/firestore.rules`, `/storage.rules`

Please proceed systematically, providing updates after each phase. If you encounter any issues or need clarification, ask before proceeding.
```

---

## 📋 Pre-Session Checklist

Before starting the new AI session with this prompt:

- [x] GitHub MCP Server installed
- [x] Current git status clean
- [x] All recent changes committed
- [x] Comprehensive prompt prepared
- [ ] Ready to start new session

---

## 🔗 Useful Commands for New Session

```bash
# Check current security status
cd /Users/mrjones/Github/Projects/sheltr-ai
git status

# Create security remediation branch
git checkout -b security/github-alerts-remediation

# View Dependabot alerts
gh api /repos/mrj0nesmtl/sheltr-ai/dependabot/alerts

# View Code Scanning alerts
gh api /repos/mrj0nesmtl/sheltr-ai/code-scanning/alerts

# List open PRs
gh pr list

# Test builds
npm run build --workspace=apps/web
npm run build --workspace=functions
cd apps/api && python -m pytest
```

---

## 📝 Notes

- The GitHub MCP server has been installed globally
- This prompt is designed to be comprehensive yet actionable
- All security issues have been categorized by priority
- Testing requirements are clearly defined
- Documentation updates are specified
- Success criteria are measurable

**Next Step**: Copy this prompt into a new AI chat session and begin systematic remediation.

---

**Document Created**: December 11, 2025  
**Last Updated**: December 11, 2025  
**Status**: Ready for New Session

