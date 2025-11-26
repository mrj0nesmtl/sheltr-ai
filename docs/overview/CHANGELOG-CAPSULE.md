# 📝 SHELTR Changelog Capsule - Recent Changes

**Last Updated**: November 26, 2025  
**Coverage**: Most recent 30 days of development  
**Purpose**: AI-accessible summary of recent platform changes for authenticated administrators

> **Note**: This is a condensed version of the full CHANGELOG.md (14,000+ lines). The full changelog is excluded from AI embeddings to reduce costs. This capsule is regenerated regularly to keep the AI informed of recent changes.

---

## 🎯 Quick Stats (Last 30 Days)

- **Versions Released**: 2.153.0 → 2.140.0 (14 releases)
- **Major Features**: 8 new features
- **Bug Fixes**: 25+ critical fixes
- **Security Updates**: 3 major security enhancements
- **Documentation**: 15+ new docs created

---

## [2.153.0] - 2025-11-26 (KB Document Picker & Chatbot Context) 🤖📚

### ✨ **New Features**
- **KB Document Search**: GitHub-synced documents (including FAQ Database) now appear in the chatbot's KB document picker for attaching context to conversations.
- **Document Attachment**: Users can search and attach knowledge base documents to provide focused context for AI responses.

### 🐛 **Bug Fixes**
- **KB Document Visibility**: Fixed issue where GitHub-synced documents weren't appearing in the KB document picker. All GitHub docs now have `is_live: true` and `chatbot_accessible: true` set automatically during sync.
- **Document Persistence Bug**: Fixed issue where attached KB documents persisted across new chat sessions. Documents now clear when creating a new session or switching between sessions.

### ⚙️ **Improvements**
- **GitHub Sync Enhancement**: Updated `github_service.py` to automatically set `is_live: true` and `chatbot_accessible: true` for all synced documents (both new and updates).
- **Migration Script**: Created `scripts/fix-github-docs-is-live.py` to update 39 existing GitHub-synced documents with proper flags.
- **Session Management**: Enhanced `createNewSession()` and `selectSession()` functions to clear attached KB documents, ensuring clean slate for each conversation.

---

## [2.152.0] - 2025-11-26 (FAQ Document & Change Tracking Fix) 📚🔧

### ✨ **New Features**
- **Enhanced FAQ Database Document**: Created comprehensive markdown documentation (`docs/reference/enhanced-faq-database.md`) containing all 198 FAQs from the chatbot system, organized by category with editing guidelines for team review and updates.

### 🐛 **Bug Fixes**
- **Sidebar Tree Refresh**: Fixed issue where newly synced documents (like the FAQ doc) weren't appearing in the knowledge base sidebar tree after GitHub sync. Implemented force refresh mechanism with cache-busting timestamps.
- **Change Tracking Permissions**: Fixed Firestore permissions error when saving knowledge documents. Added missing security rules for the `document_changes` collection to allow change tracking to work properly.

### ⚙️ **Improvements**
- **Cache-Busting for Sync**: Added `forceRefresh` parameter to `loadKnowledgeData()` that appends timestamp to API calls to bypass browser cache after sync operations.
- **Sync Callbacks**: Enhanced both `GitHubSyncPanel` and `SecureDocumentSync` components to trigger force refresh after successful sync completion.
- **Firestore Rules**: Added comprehensive security rules for `document_changes` collection allowing authenticated users to create change records and admins to read/update them.

---

## [2.150.0] - 2025-11-25 (File Update Request System) 📬🔔

### ✨ **New Features**
- **Request File Update button**: New button in content editor to request source file changes
- **Clarification banners**: Explains what can/can't be edited in the UI
- **Request modal**: Beautiful modal for submitting update requests with request type, priority, summary, and details
- **Persistent requests**: Stored in Firestore `file_update_requests` collection
- **Admin notifications**: Super admins notified of new requests
- **Status tracking**: Pending → In Progress → Completed/Rejected workflow

### 🔐 **Security Updates**
- **Firestore Rules**: New collection rules for `file_update_requests` with role-based access

---

## [2.149.0] - 2025-11-25 (Document Editing Tracking & Publishing Status Fix) 📝⏰

### ✨ **New Features**
- **Last Synced timestamp**: Shows when document was originally imported from GitHub/local files
- **Last Edited timestamp**: Shows when document was last edited in the UI (amber highlight)
- **User attribution**: Display user badge showing who made the last edit
- **Source badge**: Shows whether document is from GitHub or Secure Docs

### 🐛 **Bug Fixes**
- **Fixed "Draft" badge issue**: Secure documents now show "🟢 Published" instead of "🔴 Draft"
- **Updated sync script**: Set `is_live: true` for all secure documents
- **Batch updated 42 documents**: Changed existing secure docs to `is_live: true` in Firestore

---

## [2.148.0] - 2025-11-25 (Secure Documents Cleanup & Role-Based AI Access) 🧹🔐

### 🎯 **Major Refactor**
- **Cleaned `.local-secure-docs` structure**: Removed 25+ duplicate files, old backups, and nested folders
- **New clean structure**: 8 top-level folders (max 4 levels deep)
  - `founders/` - Founders Only
  - `leadership/` - Leadership + Founders
  - `operations/` - Platform Admin+
  - `fintec/` - Platform Admin+
  - `dataroom/` - Investors
  - `development/` - Platform Admin
  - `drafts/` - Platform Admin
  - `vault/` - Super Admin Only
- **Role-Based AI Access**: Enabled chatbot access for all secure docs with role-based filtering
- **Embeddings generation**: Auto-generate embeddings for all secure docs

### 🔐 **Security Enhancements**
- **Firebase Storage Rules**: Added 9 new rules with role-based access
- **Firestore Rules**: Updated `knowledge_documents` rules with comprehensive comments

---

## [2.147.0] - 2025-11-25 (Strategic Planning Documentation) 📊💰

### 📚 Documentation Added
- **Corporate Structure Analysis**: `docs/strategy/corporate-structure-analysis-canada.md`
  - Comprehensive analysis of 6 Canadian corporate structure options
  - Recommendation: Hybrid structure (For-Profit + Foundation)
  - SHELTR Fit Score: 9/10
- **Fundraising Strategy**: `docs/strategy/fundraising-strategy-pilot-stage.md`
  - Complete strategy for $250K seed round
  - 12-month runway calculation
  - Blended approach: 50% grants, 30% impact investors, 20% angels
  - 40+ specific targets with fit scores

---

## [2.146.0] - 2025-11-24 (Critical Security Fix - Gemini API Key Rotation) 🔐🔄

### 🚨 Critical Security Fix
- **Gemini API Key Leaked and Rotated**
  - Google flagged key as leaked (403 error)
  - Rotated via Google AI Studio
  - Added website restrictions (7 authorized domains)
  - Added API restrictions (3 specific APIs)
  - Stored in Google Cloud Secret Manager
  - Updated Cloud Run and local environments

### 🔒 Security Improvements
- **Website Restrictions**: 7 authorized domains (production + dev)
- **API Restrictions**: Generative Language API, Vertex AI API, Firebase AI Logic API
- **Cost Savings**: Restored Gemini usage, saving 10x vs OpenAI

---

## [2.145.0] - 2025-11-24 (RAG Performance & "Thinking" Indicator) 🧠⚡

### ✨ **New Features**
- **"Thinking" Indicator**: Shows when RAG is processing complex queries
- **Performance Optimization**: Increased timeouts for semantic search (10s) and RAG (15s)

### 🐛 **Bug Fixes**
- **RAG Timeout Issues**: Fixed production RAG failures by increasing master timeout to 15 seconds
- **Semantic Search Bottleneck**: Identified 41-second search time, proposed optimization strategies

---

## [2.144.0] - 2025-11-24 (Gemini Production Deployment) 🚀🤖

### ✨ **New Features**
- **Gemini in Production**: Successfully deployed Gemini 2.5 Flash to production
- **Public Chatbot Default**: Public chat widget now uses Gemini by default
- **Cost Optimization**: 10x cost reduction for chat operations

### 🐛 **Bug Fixes**
- **Environment Variables**: Fixed `GEMINI_API_KEY` in Google Cloud Secret Manager and Cloud Run
- **API Key Configuration**: Verified all production environments have correct keys

---

## [2.143.0] - 2025-11-23 (Gemini Dashboard Integration) 🤖💬

### ✨ **New Features**
- **Gemini Models in Dashboard**: Added `gemini-2.5-flash` and `gemini-2.5-flash-lite` to model dropdown
- **Multi-Agent Gemini Support**: All 5 agents now support Gemini models
- **Chat History Preservation**: Fixed issue where chat history was lost after Gemini integration

### 🐛 **Bug Fixes**
- **FAQ Integration**: Fixed dashboard chatbot to check FAQ before RAG
- **Authentication**: Fixed `user.getIdToken()` error by using `getCurrentToken()` from AuthContext
- **Backend Dependencies**: Installed `google-generativeai` package

---

## [2.142.0] - 2025-11-23 (Firebase AI Logic Setup) 🔥🤖

### ✨ **New Features**
- **Firebase AI Logic Integration**: Integrated Google's Gemini models via Firebase
- **Hybrid Approach**: Gemini for chat, OpenAI for embeddings
- **Data Locality**: Keep data and processing within Firebase for reduced latency

### 📚 **Documentation**
- **Setup Guide**: `docs/development/completed-work/SESSION-NOV-24-FIREBASE-AI-LOGIC-SETUP.md`
- **Critical Finding**: Firebase AI Logic does NOT support embeddings generation
- **Recommendation**: Use Gemini for chat, keep OpenAI for embeddings

---

## [2.141.0] - 2025-11-23 (Knowledge Base Enhancements) 📚🔍

### ✨ **New Features**
- **GitHub Token Update**: New token with proper permissions for repository scanning
- **Team Bio Security**: Moved team bio markdown files from public `docs/team/` to secure `.local-secure-docs/platform-admin/team-bios/`
- **Knowledge Base Stats Refresh**: Fixed "16 pending embeddings" stuck metric by invalidating cache after GitHub sync

### 🐛 **Bug Fixes**
- **GitHub Sync**: Fixed 401 Unauthorized error by updating expired GitHub token
- **Cache Invalidation**: Only invalidate `knowledge_stats` cache, preserve `knowledge_documents_all` for fast page loads
- **Embedding Metric**: Now refreshes immediately after sync completion

---

## [2.140.0] - 2025-11-22 (Tax Receipt & Recurring Gift Enhancements) 📄💚

### ✨ **New Features**
- **Professional Tax Receipt PDFs**: Generated with SHELTR logo, donor info, donation details, SmartFund breakdown, and CRA compliance text
- **2025 Tax Year Support**: Dynamically includes current year in tax document dropdown
- **Recurring Gift Badge**: Green "Recurring" badge for recurring donations in donor dashboard
- **Recurring Gift Modal**: Enhanced with participant selection, SmartFund split display, and scrollable design
- **Tax Document Regeneration**: "Regenerate" button to update tax receipts with latest donation data

### 🐛 **Bug Fixes**
- **SmartFund Split Calculation**: Fixed incorrect splits for shelter donations (now 95% shelter, 5% SHELTR)
- **Active Recurring Count**: Fixed metric showing 1 instead of 4 active recurring gifts
- **Duplicate Badges**: Removed duplicate recurring badges
- **Logo Rendering**: Fixed SHELTR wordmark not appearing in PDF (converted PNG to base64)
- **Donor Information**: Fixed "Valued Donor" showing instead of actual donor name

---

## 🎯 Key Achievements (Last 30 Days)

### **Security** 🔐
- ✅ Rotated leaked Gemini API key with proper restrictions
- ✅ Implemented role-based AI access for secure documents
- ✅ Added Firebase Storage rules for 9 secure folders
- ✅ Enhanced Firestore security rules with detailed comments

### **AI & Chatbot** 🤖
- ✅ Integrated Firebase AI Logic (Gemini 2.5 Flash)
- ✅ Deployed Gemini to production (10x cost savings)
- ✅ Fixed FAQ integration (instant responses)
- ✅ Added "thinking" indicator for RAG queries
- ✅ Made 39 GitHub docs chatbot-accessible

### **Knowledge Base** 📚
- ✅ Created comprehensive FAQ database document (198 FAQs)
- ✅ Fixed sidebar tree refresh after sync
- ✅ Implemented KB document picker for chatbot context
- ✅ Added file update request system
- ✅ Enhanced document editing tracking

### **Donor Experience** 💚
- ✅ Professional tax receipt PDFs with CRA compliance
- ✅ Recurring gift enhancements (calendar, frequency, participant selection)
- ✅ Fixed SmartFund split calculations (95/5 for shelters, 80/15/5 for participants)
- ✅ Tax document regeneration feature

### **Infrastructure** 🏗️
- ✅ Cleaned secure documents structure (8 folders, no duplicates)
- ✅ Migrated 42 secure documents to proper publishing status
- ✅ Updated GitHub sync to set `is_live` and `chatbot_accessible` flags
- ✅ Enhanced cache management for knowledge base stats

---

## 🔮 Upcoming Features (Next Sprint)

- [ ] Implement backend KB document context in AI responses
- [ ] Add `/kb` slash command for quick document attachment
- [ ] Add `@` mention system for users
- [ ] Vector database for faster semantic search
- [ ] Admin dashboard for file update requests
- [ ] Enhanced analytics for chatbot performance

---

## 📊 Platform Metrics (Current)

- **Knowledge Documents**: 119 total (54 GitHub, 65 Secure)
- **FAQs**: 198 active FAQs across 12 categories
- **Chatbot Agents**: 5 specialized agents (General, Business Analyst, Donor Relations, Shelter Outreach, Technical Support)
- **AI Models**: 6 models (GPT-4o, GPT-4o-mini, Claude 3.5 Sonnet, Gemini 2.5 Flash, Gemini 2.5 Flash Lite, o1-preview)
- **Embeddings**: 1,200+ knowledge chunks indexed
- **Active Users**: Platform Admins, Founders, Donors, Participants, Shelters

---

## 🔗 Related Documentation

- **Full Changelog**: `CHANGELOG.md` (14,000+ lines, excluded from AI embeddings)
- **Development Summary**: `docs/development/development-summary.md`
- **Feature Documentation**: `docs/features/feature-documentation.md`
- **Knowledge Architecture**: `docs/features/knowledge-base/knowledge-architechture.md`
- **Session Summaries**: `docs/development/SESSION-*.md`

---

## 📝 Regeneration Schedule

This capsule should be regenerated:
- **Weekly**: During active development sprints
- **Bi-weekly**: During maintenance periods
- **After Major Releases**: Immediately after version bumps (e.g., 2.x.0 → 3.0.0)
- **On Demand**: When significant changes accumulate

**Last Regenerated**: November 26, 2025  
**Next Scheduled**: December 3, 2025  
**Regeneration Script**: `scripts/generate-changelog-capsule.sh` (to be created)

---

*This is an AI-accessible summary. For complete details, refer to the full CHANGELOG.md file.*

