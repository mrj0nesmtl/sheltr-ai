# 📝 SHELTR Changelog Capsule - Recent Changes

**Last Updated**: December 15, 2025  
**Coverage**: Most recent 30 days of development  
**Purpose**: AI-accessible summary of recent platform changes for authenticated administrators

> **Note**: This is a condensed version of the full CHANGELOG.md (15,000+ lines). The full changelog is excluded from AI embeddings to reduce costs. This capsule is regenerated regularly to keep the AI informed of recent changes.

---

## 🎯 Quick Stats (Last 30 Days)

- **Versions Released**: 2.158.0 → 2.140.0 (19 releases)
- **Major Features**: 12 new features
- **Bug Fixes**: 30+ critical fixes
- **Security Updates**: **SESSION 27 + Dependency Updates** 🔒
- **Documentation**: 25+ docs updated/created
- **MCP Servers**: 8 integrated (GitHub, Firebase, Google Cloud, Shadcn, Playwright, Context7)

---

## [2.158.0] - 2025-12-15 (Dependency Updates & Google Cloud MCP Integration) 🔄☁️

### 🎯 **Session Highlights**
- **Google Cloud MCP**: Installed 3 official Google Cloud MCP servers for enhanced automation
- **Dependency Updates**: Merged 16 safe patch/minor updates across web, functions, and API
- **Security Maintained**: Zero vulnerabilities in all workspaces
- **Deployment**: Full production deployment successful

### ☁️ **Google Cloud MCP Integration**
- Installed `@google-cloud/gcloud-mcp` for natural language gcloud commands
- Installed `@google-cloud/observability-mcp` for logs, metrics, traces
- Installed `@google-cloud/storage-mcp` for GCS management
- Enhanced automation alongside GitHub, Firebase, Shadcn, Playwright MCP servers

### ⬆️ **Dependency Updates (16 Merged)**
- Functions: eslint, @typescript-eslint/* updates
- Web: Redux Toolkit, Radix UI, ESLint, Tailwind, Lucide React updates
- API: pandas, google-auth, mkdocs, asyncpg, sqlalchemy, black updates
- Actions: actions/checkout 5 → 6

### 🔒 **Security & Deferred Updates**
- Zero vulnerabilities maintained (npm audit clean)
- 4 CodeQL alerts awaiting GitHub re-scan (already fixed in Session 27)
- Deferred 4 major version updates for testing: firebase-functions 7.x, numpy 2.x, fastapi 0.124.x, pytest-asyncio 1.3.x

---

## [2.157.0] - 2025-12-12 (Documentation Hub Overhaul & Ecosystem Refinement) 📚🏗️

### 🎯 **Session Highlights**
- **Documentation Hub**: Fixed all 10 GitHub links on `/docs` page
- **Ecosystem Overhaul**: Simplified to POD Model A + Basecamp + Drones (2027)
- **Shelter Ledger**: Amplified blockchain transparency and public accountability
- **Security Patch**: Next.js 15.5.7 → 15.5.9 (HIGH + MODERATE vulnerabilities fixed)

### 📚 **Documentation Updates**
- Fixed GitHub links for: Hacking Homelessness, Platform Overview, White Paper, System Design, Roadmap, Donor Guide, Participant Guide, Agent Architecture, Blockchain, Tokenomics
- Updated Hacking Homelessness thesis to v3.0.0 - QR-Scan-to-POD Ecosystem
- Enhanced Shelter Ledger documentation with complete track & trace specifications
- Removed MOBI bikes, added Basecamp infrastructure
- Updated POD pricing to $7,500 (single-SKU Model A)

### ⛓️ **Shelter Ledger Enhancements**
- Public accountability system for all donations and payouts
- Real-time blockchain verification with public API access
- Automatic participant wallet creation with housing fund tracking
- Complete audit trail for regulatory compliance
- Zero crypto exposure for participants (Adyen virtual cards)

### 🔒 **Security**
- Next.js critical security patch (DoS + Source Code Exposure vulnerabilities)
- All documentation properly linked to GitHub source files

---

## [2.156.0] - 2025-12-11 (Security Remediation - Session 27 COMPLETE) 🔒✅

### 🎉 **ZERO VULNERABILITIES ACHIEVED**
- **Dependabot**: 10 → **0** alerts (100% remediation)
- **npm audit**: Multiple vulnerabilities → **0** across all workspaces
- **CodeQL**: 4 alerts fixed (pending GitHub re-scan)
- **Secret Scanning**: 30 historical alerts (no active secrets)

### 🔒 **Security Fixes**
- **CodeQL XSS Vulnerabilities**: Fixed 3 HIGH severity XSS issues
  - Added HTML escaping to markdown renderer in `platform-admin-welcome/page.tsx`
  - Added security comments documenting XSS protection in `gallery/page.tsx`
  - All user-generated content sanitized with `sanitizeUrl()`, `sanitizeForAttribute()`, `sanitizeForDisplay()`
- **Sensitive Logging**: Fixed MEDIUM severity issue in Python backend
  - Removed logging of sensitive document field values in `knowledge_docs_hub.py`
  - Now only logs non-sensitive permission metadata and field names
- **Dependabot Alerts**: Resolved ALL 10 vulnerability alerts
  - `node-forge` (HIGH), `jws` (HIGH), `mdast-util-to-hast` (MODERATE)

### ⬆️ **Dependency Updates (27 PRs Handled)**
- **Merged**: 20 safe patch/minor updates
- **Closed**: 7 PRs (4 risky major updates + 3 obsolete)
- **Upgraded**: @google-cloud/firestore 7.11.6 → 8.0.0 (tested & verified)

### 🛠️ **CI/CD Improvements**
- Fixed `.github/workflows/security.yml` reliability issues
- Improved TruffleHog, Docker scan, and npm audit configurations

### 📊 **Final Security Status**
- **Dependabot**: **0 active** ✅
- **npm audit**: **0 vulnerabilities** ✅
- **Production Builds**: All passing ✅

---

## [2.155.0] - 2025-12-11 (GitHub Security Preparation) 🔒🛡️

### ✨ **New Features**
- **GitHub MCP Server**: Installed official GitHub Model Context Protocol server for AI-powered repository management
- **Security Remediation Framework**: Created comprehensive documentation for systematic security resolution

### 📚 **Documentation**
- **`docs/security/GITHUB-SECURITY-REMEDIATION-PROMPT.md`**: 400+ line security remediation guide
- **`docs/security/GITHUB-MCP-SERVER-GUIDE.md`**: Quick reference for GitHub MCP usage

### 🔒 **Security**
- **Secret Scanning**: Removed hardcoded Firebase API key from test file
- **Environment Variables**: Updated to use `.env.local` for secure config

---

## [2.154.0] - 2025-11-26 (Changelog Capsule for AI Access) 📝🤖

### ✨ **New Features**
- **Changelog Capsule**: Created condensed changelog for AI-accessible queries
- **Cost Optimization**: Full changelog excluded from embeddings, capsule provides recent context

---

## [2.153.0] - 2025-11-26 (KB Document Picker & Chatbot Context) 🤖📚

### ✨ **New Features**
- **KB Document Search**: GitHub-synced documents now appear in chatbot's document picker
- **Document Attachment**: Users can attach knowledge base documents for focused AI responses

### 🐛 **Bug Fixes**
- **KB Document Visibility**: Fixed GitHub-synced docs not appearing in picker
- **Document Persistence**: Fixed attached docs persisting across sessions

---

## [2.152.0] - 2025-11-26 (FAQ Document & Change Tracking Fix) 📚🔧

### ✨ **New Features**
- **Enhanced FAQ Database**: Created comprehensive markdown doc with all 198 FAQs

### 🐛 **Bug Fixes**
- **Sidebar Tree Refresh**: Fixed newly synced docs not appearing after sync
- **Change Tracking Permissions**: Fixed Firestore permissions for document changes

---

## [2.150.0] - 2025-11-25 (File Update Request System) 📬🔔

### ✨ **New Features**
- **Request File Update Button**: New workflow for requesting source file changes
- **Request Modal**: Beautiful modal for submitting update requests
- **Admin Notifications**: Super admins notified of new requests
- **Status Tracking**: Pending → In Progress → Completed/Rejected workflow

### 🔐 **Security Updates**
- **Firestore Rules**: New collection rules for `file_update_requests`

---

## [2.149.0] - 2025-11-25 (Document Editing Tracking & Publishing Status Fix) 📝⏰

### ✨ **New Features**
- **Last Synced Timestamp**: Shows when document was imported
- **Last Edited Timestamp**: Shows when document was edited in UI
- **User Attribution**: Display user badge for last edit
- **Source Badge**: Shows GitHub vs Secure Docs origin

### 🐛 **Bug Fixes**
- **Fixed "Draft" Badge**: Secure documents now show "🟢 Published"
- **Batch Updated 42 Documents**: Changed existing docs to `is_live: true`

---

## [2.148.0] - 2025-11-25 (Secure Documents Cleanup & Role-Based AI Access) 🧹🔐

### 🎯 **Major Refactor**
- **Cleaned `.local-secure-docs`**: Removed 25+ duplicate files
- **New Structure**: 8 top-level folders (founders, leadership, operations, etc.)
- **Role-Based AI Access**: Enabled chatbot access with role filtering
- **Embeddings Generation**: Auto-generate for all secure docs

### 🔐 **Security Enhancements**
- **Firebase Storage Rules**: Added 9 new rules with role-based access
- **Firestore Rules**: Updated with comprehensive comments

---

## [2.147.0] - 2025-11-25 (Strategic Planning Documentation) 📊💰

### 📚 **Documentation Added**
- **Corporate Structure Analysis**: 6 Canadian options analyzed
- **Fundraising Strategy**: $250K seed round strategy with 12-month runway

---

## [2.146.0] - 2025-11-24 (Critical Security Fix - Gemini API Key Rotation) 🔐🔄

### 🚨 **Critical Security Fix**
- **Gemini API Key Leaked and Rotated**
  - Google flagged key (403 error)
  - Rotated via Google AI Studio
  - Added website restrictions (7 domains)
  - Added API restrictions (3 APIs)
  - Stored in Secret Manager

---

## [2.145.0] - 2025-11-24 (RAG Performance & "Thinking" Indicator) 🧠⚡

### ✨ **New Features**
- **"Thinking" Indicator**: Shows when RAG is processing
- **Performance Optimization**: Increased timeouts for semantic search

---

## [2.144.0] - 2025-11-24 (Gemini Production Deployment) 🚀🤖

### ✨ **New Features**
- **Gemini in Production**: Deployed Gemini 2.5 Flash
- **Public Chatbot Default**: Uses Gemini for 10x cost reduction

---

## [2.143.0] - 2025-11-23 (Gemini Dashboard Integration) 🤖💬

### ✨ **New Features**
- **Gemini Models in Dashboard**: Added to model dropdown
- **Multi-Agent Support**: All 5 agents support Gemini

---

## [2.142.0] - 2025-11-23 (Firebase AI Logic Setup) 🔥🤖

### ✨ **New Features**
- **Firebase AI Logic Integration**: Google's Gemini via Firebase
- **Hybrid Approach**: Gemini for chat, OpenAI for embeddings

---

## [2.141.0] - 2025-11-23 (Knowledge Base Enhancements) 📚🔍

### ✨ **New Features**
- **GitHub Token Update**: New token with proper permissions
- **Team Bio Security**: Moved to secure docs
- **Stats Refresh Fix**: Fixed stuck "16 pending" metric

---

## [2.140.0] - 2025-11-22 (Tax Receipt & Recurring Gift Enhancements) 📄💚

### ✨ **New Features**
- **Professional Tax Receipt PDFs**: CRA-compliant with SHELTR logo
- **2025 Tax Year Support**: Dynamic year in dropdown
- **Recurring Gift Badge**: Green badge for recurring donations

---

## 🎯 Key Achievements (Last 30 Days)

### **Security** 🔐 **SESSION 27 - MAJOR MILESTONE**
- ✅ **ZERO Dependabot Vulnerabilities** (down from 10)
- ✅ **ZERO npm audit Issues** (all workspaces clean)
- ✅ Fixed ALL XSS vulnerabilities with comprehensive sanitization
- ✅ Removed sensitive logging from Python backend
- ✅ Merged 20 dependency update PRs
- ✅ Upgraded @google-cloud/firestore to 8.0.0
- ✅ Fixed security workflow reliability issues
- ✅ Rotated leaked Gemini API key with restrictions

### **AI & Chatbot** 🤖
- ✅ Integrated Firebase AI Logic (Gemini 2.5 Flash)
- ✅ Deployed Gemini to production (10x cost savings)
- ✅ Added "thinking" indicator for RAG queries
- ✅ Made 39 GitHub docs chatbot-accessible
- ✅ KB document picker for context attachment

### **Knowledge Base** 📚
- ✅ Created comprehensive FAQ database (198 FAQs)
- ✅ Fixed sidebar tree refresh after sync
- ✅ Implemented file update request system
- ✅ Enhanced document editing tracking
- ✅ Cleaned secure docs structure

### **Donor Experience** 💚
- ✅ Professional tax receipt PDFs with CRA compliance
- ✅ Recurring gift enhancements
- ✅ Tax document regeneration feature

### **Infrastructure** 🏗️
- ✅ Enterprise-grade security posture achieved
- ✅ Improved CI/CD workflows
- ✅ Strategic planning documentation

---

## 🔮 Upcoming Features (Next Sprint)

- [ ] Adyen payment integration for live transactions
- [ ] Enhanced analytics for chatbot performance
- [ ] Vector database for faster semantic search
- [ ] Mobile app development continuation

---

## 📊 Platform Metrics (Current)

- **Security Status**: **ZERO VULNERABILITIES** ✅
- **Knowledge Documents**: 119 total (54 GitHub, 65 Secure)
- **FAQs**: 198 active FAQs across 12 categories
- **Chatbot Agents**: 5 specialized agents
- **AI Models**: 6 models (GPT-4o, Claude, Gemini, etc.)
- **Embeddings**: 1,200+ knowledge chunks indexed

---

## 🔗 Related Documentation

- **Full Changelog**: `CHANGELOG.md` (14,000+ lines)
- **Security Policy**: `SECURITY.md` (updated with Session 27 achievements)
- **Development Summary**: `docs/development/development-summary.md`
- **Session 27 Details**: `docs/development/SESSION-27-SECURITY-REMEDIATION.md`

---

## 📝 Regeneration Schedule

This capsule should be regenerated:
- **Weekly**: During active development sprints
- **Bi-weekly**: During maintenance periods
- **After Major Releases**: Immediately after version bumps
- **On Demand**: When significant changes accumulate

**Last Regenerated**: December 11, 2025 (Session 27 Complete)  
**Next Scheduled**: December 18, 2025  
**Major Update**: Session 27 Security Remediation - Zero Vulnerabilities Achieved

---

*This is an AI-accessible summary. For complete details, refer to the full CHANGELOG.md file.*
