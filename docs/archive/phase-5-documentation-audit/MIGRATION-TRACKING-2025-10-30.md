# 📋 DOCUMENTATION MIGRATION TRACKING

**Date Started**: October 30, 2025  
**Migration Branch**: `docs/major-reorganization-2025-10-30`  
**Status**: 🟡 **IN PROGRESS**

---

## 🎯 DECISIONS MADE

### **Decision 1: Payment Rails Documentation**
✅ **APPROVED**: Split approach
- Public: Architecture and implementation guides → `docs/integrations/payment-rails/`
- Secure: Credentials, API keys, production details → `.local-secure-docs/payment-rails/`

### **Decision 2: Session Logs**
✅ **APPROVED**: Option B with modifications
- **Archive**: Session logs that don't contain core feature documentation
- **Keep Active**: Technical documentation about core features and dashboard functionality
- **Criteria**: If it trains the chatbot on platform functionality = KEEP ACTIVE

### **Decision 3: Empty Placeholder Folders**
✅ **APPROVED**: Option A
- Remove empty folders until content is ready
- Cleaner, more professional structure

---

## 🗂️ NEW FOLDER STRUCTURE (APPROVED)

```
docs/
├── README.md                          # Complete navigation guide (REWRITE REQUIRED)
├── TABLE_OF_CONTENTS.md              # TO EVALUATE: Merge with README or keep separate?
│
├── overview/                          # Project introduction & mission
├── architecture/                      # System design & technical architecture  
├── ecosystem/                         # SHELTR products (Pods, MOBI, Drones)
├── tokenomics/                        # Token economics & blockchain
├── api/                              # API documentation & schemas
├── integrations/                      # Third-party integrations
├── guides/                           # Current development & user guides
│   ├── development/                  # Dev setup, standards, testing
│   ├── users/                        # User guides (donor, participant, admin)
│   └── platform-admin/               # Platform admin documentation
├── features/                         # Feature-specific documentation
│   ├── chatbot/                      # AI chatbot system
│   ├── knowledge-base/               # Knowledge management
│   ├── notifications/                # Notification system
│   ├── blog-system/                  # Blog implementation
│   └── founders-portal/              # Founders portal
├── operations/                       # Deployment & operations
│   ├── deployment/                   # Deployment guides
│   ├── monitoring/                   # System monitoring
│   └── security/                     # Security policies
├── reference/                        # Technical reference materials
└── archive/                          # Historical documentation
    ├── sessions/                     # Development session logs
    │   ├── 2025-Q3/
    │   └── 2025-Q4/
    ├── completed-features/           # Feature implementation summaries
    └── migrations/                   # Database migration docs
```

---

## 📊 MIGRATION PHASES

### ✅ **Phase 0: Preparation** (CURRENT)
- [x] Create migration tracking document
- [x] Document approved decisions
- [x] Design new folder structure
- [ ] Create migration branch
- [ ] Review GitHub sync service dependencies
- [ ] Backup current structure

### ⏳ **Phase 1: Archive Historical Content**
- [ ] Analyze 180 files in `04-development/` for chatbot training value
- [ ] Archive non-essential session logs → `archive/sessions/`
- [ ] Archive completed feature summaries → `archive/completed-features/`
- [ ] Keep core feature documentation active
- [ ] Update archive README with organization

### ⏳ **Phase 2: Eliminate Duplicates**
- [ ] Consolidate tokenomics documentation
- [ ] Merge blockchain documentation
- [ ] Split payment rails (public vs secure)
- [ ] Remove all duplicate files
- [ ] Update links to consolidated versions

### ⏳ **Phase 3: Folder Reorganization**
- [ ] Create new folder structure
- [ ] Remove numbered prefixes (01-, 02-, etc.)
- [ ] Move files to new locations
- [ ] Create README.md for each folder
- [ ] Update all relative links in markdown files

### ⏳ **Phase 4: Platform Integration Updates**
- [ ] Review GitHub sync service (`apps/api/services/github_service.py`)
- [ ] Update folder mappings in sync service
- [ ] Redesign public docs hub (`apps/web/src/app/docs/page.tsx`)
- [ ] Update founders portal document links
- [ ] Update tokenomics page links
- [ ] Update IR data room document paths
- [ ] Add category filtering and search to docs hub

### ⏳ **Phase 5: Documentation Enhancement**
- [ ] Rewrite `docs/README.md` with proper hyperlinks
- [ ] Evaluate TABLE_OF_CONTENTS.md (merge or keep separate)
- [ ] Identify missing industry-standard documentation
- [ ] Create missing documentation
- [ ] Add permission controls to knowledge base sync
- [ ] Implement automated secure document workflow

### ⏳ **Phase 6: Testing & Validation**
- [ ] Test all public documentation pages
- [ ] Test knowledge base sync with new structure
- [ ] Verify founders portal documents load
- [ ] Check IR data room document access
- [ ] Validate all internal markdown links
- [ ] Test category filtering and search
- [ ] Verify chatbot can access training documentation

### ⏳ **Phase 7: Deployment**
- [ ] Merge migration branch to main
- [ ] Deploy to production
- [ ] Monitor for broken links
- [ ] Update external documentation links
- [ ] Announce new structure to team
- [ ] Update onboarding materials

---

## 📝 FILES TO ANALYZE (04-development/)

### **Category A: Core Feature Documentation (KEEP ACTIVE)**
Files that document core platform features and dashboard functionality for chatbot training:

- [ ] SHELTR-AGENT-ARCHITECTURE.md (932 lines - CRITICAL for chatbot)
- [ ] CHATBOT-FEATURES-ROADMAP.md
- [ ] MCP-INTEGRATION-GUIDE.md
- [ ] KNOWLEDGE-BASE-UPDATE-GUIDE.md
- [ ] KNOWLEDGE-BASE-EDIT-DELETE-FLOW.md
- [ ] KNOWLEDGE-BASE-SYNC-SYSTEM.md
- [ ] COMPLETE-FUNCTIONALITY-MATRIX-UPDATED.md
- [ ] dev-roadmap.md
- [ ] BUSINESS-LOGIC-TESTING.md
- [ ] NOTIFICATION-ARCHITECTURE-EXPLAINED.md
- [ ] NOTIFICATION-METRICS-GUIDE.md

### **Category B: Session Logs (EVALUATE for training value)**
52 session files - need to determine which have core feature documentation:

- [ ] SESSION-01 through SESSION-24 (need review)
- [ ] Keep sessions that document core features
- [ ] Archive sessions that are just status updates

### **Category C: Completed Features (ARCHIVE)**
Implementation summaries for completed work:

- [ ] *-COMPLETE.md files (28 files)
- [ ] *-FIX*.md files (35 files)
- [ ] Debug and troubleshooting guides for resolved issues

### **Category D: Implementation Guides (EVALUATE)**
Current implementation documentation:

- [ ] Blog system docs
- [ ] Donation flow docs
- [ ] Notification system docs
- [ ] Founders portal docs
- [ ] Investment relations docs
- [ ] Gallery implementation docs

---

## 🔍 SPECIAL REVIEW ITEMS

### **1. GitHub Sync Service Dependencies**
**File**: `apps/api/services/github_service.py`
**Need to check**: Folder path mappings, category detection logic

### **2. Public Docs Hub Redesign**
**File**: `apps/web/src/app/docs/page.tsx`
**Need to implement**:
- Category filtering
- Search functionality
- Better visual organization
- Updated GitHub links

### **3. README vs TABLE_OF_CONTENTS**
**Question**: Why do we have both?
**Options**:
- Merge into single README.md with TOC section
- Keep README as quick start, TOC as comprehensive index
- Make README user-facing, TOC developer-facing

### **4. Secure Document Workflow**
**Current**: Manual Firestore uploads
**Desired**: Automated sync from GitHub with permissions
**Implementation needed**: Yes

---

## 📈 METRICS TRACKING

### **File Count Changes**
- **Before**: 242 active markdown files
- **Target**: ~100-120 active files
- **Archived**: TBD (target: 120-140 files)
- **After**: TBD

### **Folder Structure**
- **Before**: 10 numbered folders (01- through 10-)
- **After**: 10 semantic folders (no numbers)

### **Duplicates Eliminated**
- **Before**: 8+ duplicate files identified
- **After**: 0 duplicates

### **Platform Touchpoints Updated**
- [ ] Public docs hub (localhost:3000/docs)
- [ ] Knowledge base dashboard (localhost:3000/dashboard/knowledge)
- [ ] Founders portal (localhost:3000/portal/founders-only)
- [ ] IR data room (localhost:3000/ir/dataroom)
- [ ] Tokenomics page (localhost:3000/tokenomics)
- [ ] GitHub repository links

---

## 🚨 ISSUES & BLOCKERS

### **Active Issues**
*None yet - will track as they arise*

### **Questions for Resolution**
1. README.md vs TABLE_OF_CONTENTS.md - merge or keep separate?
2. Which session logs contain critical feature documentation?
3. Should ecosystem docs be separate folder or under architecture?

---

## ✅ COMPLETED TASKS

- [x] Forensic documentation audit
- [x] Generate comprehensive audit report
- [x] Get user approval on structure
- [x] Create migration tracking document
- [x] Define new folder structure

---

## 📋 NEXT IMMEDIATE ACTIONS

1. Create migration branch
2. Review GitHub sync service for dependencies
3. Analyze 04-development/ files for chatbot training value
4. Begin archival process
5. Create new folder structure

---

**Last Updated**: October 30, 2025 - Migration tracking initiated  
**Current Phase**: Phase 0 - Preparation  
**Status**: 🟡 IN PROGRESS

