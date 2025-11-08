# 📚 SHELTR Documentation - Complete Table of Contents

**Comprehensive navigation for all SHELTR platform documentation**

*Last Updated: November 7, 2025 - Documentation Restructured & Optimized*

[![Structure](https://img.shields.io/badge/structure-enterprise%20grade-success.svg)]()
[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)]()
[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)]()

---

## 🎯 Quick Navigation by Role

| **Role** | **Start Here** | **Key Documents** | **Priority** |
|----------|----------------|-------------------|--------------|
| 💼 **Executives** | [Overview](#-overview) | Platform Overview, Business Model, Roadmap | 🔴 High |
| 💰 **Investors** | [Overview](#-overview) | Platform Overview, IR Data Room, Tokenomics | 🔴 High |
| 💻 **Developers** | [Development](#-development) | Setup Guide, API Reference, Architecture | 🔴 High |
| 🏗️ **Architects** | [Architecture](#️-architecture) | System Design, Payment Rails, Blockchain | 🟡 Medium |
| 🎨 **Designers** | [Reference](#-reference) | Design System, UI Components, User Journeys | 🟡 Medium |
| 🧪 **QA Engineers** | [QA Testing](#-qa-testing) | Testing Guides, Business Logic Tests | 🟡 Medium |
| 🚀 **DevOps** | [Operations](#️-operations) | Deployment, Monitoring, Security | 🟡 Medium |
| 👥 **End Users** | [User Guides](#-user-guides) | Role-specific tutorials, journeys | 🟢 Low |

---

## 📂 Complete Directory Structure

### 🌟 [Overview](overview/) - Platform Vision & Mission
**Status**: ✅ Current | **Documents**: 4 | **Priority**: 🔴 High

Essential platform introduction and strategic vision

```
overview/
├── platform-overview.md          # Comprehensive platform introduction
├── hacking_homelessness.md       # Theory of change - MUST READ
├── CHANGELOG.md                  # Platform version history
└── A MillionDollarMurray.pdf     # Research foundation document
```

**Key Documents**:
- 🎯 **[Platform Overview](overview/platform-overview.md)** - Complete executive summary (v2.90.0)
  - Mission & vision
  - SmartFund 80-15-5 distribution model
  - 5-role ecosystem (Super Admin, Platform Admin, Shelter Admin, Participant, Donor)
  - Technical stack & architecture
  - Real-world impact metrics
  
- 📖 **[Hacking Homelessness](overview/hacking_homelessness.md)** - Revolutionary approach
  - Theory of change
  - Malcolm Gladwell philosophy
  - "Better to solve than manage"
  
- 📋 **[Changelog](overview/CHANGELOG.md)** - Version history
  - v2.90.0: Qualified Investor Access Management
  - v2.89.0: External Docs Linking
  - v2.86.0: Complete RAG System

---

### 🏗️ [Architecture](architecture/) - System Design & Infrastructure
**Status**: ✅ Current | **Documents**: 15+ | **Priority**: 🔴 High

Complete technical architecture and infrastructure specifications

```
architecture/
├── architechture-summary.md      # High-level architecture overview
├── platform/                     # Core platform architecture
│   ├── system-design.md          # Multi-tenant SaaS design
│   ├── website-architecture.md   # Complete site structure
│   └── ecosystem.md              # Platform ecosystem
├── payment-rails/                # Payment infrastructure
│   ├── README.md
│   ├── unified-payment-architecture.md
│   ├── adyen-integration.md
│   ├── production-deployment.md
│   └── qr-demo-.md
└── technical/                    # Blockchain & technical specs
    ├── blockchain.md
    ├── base_stable_coin.md
    ├── tokenomics.md
    └── whitepaper_final.md
```

**Key Documents**:
- 🏗️ **[System Design](architecture/platform/system-design.md)** - Core architecture
  - Multi-tenant SaaS architecture
  - Firebase + FastAPI stack
  - 5-role RBAC system
  - Real-time data synchronization
  
- 🌐 **[Website Architecture](architecture/platform/website-architecture.md)** - Site structure
  - Complete page hierarchy
  - Component architecture
  - Routing structure
  
- 💳 **[Payment Rails](architecture/payment-rails/unified-payment-architecture.md)** - Payment architecture
  - Adyen for Platforms integration
  - SmartFund 80-15-5 distribution
  - Virtual debit card issuance
  - 16-week implementation roadmap
  
- ⛓️ **[Blockchain](architecture/technical/blockchain.md)** - Blockchain specs
  - Base (Ethereum L2) architecture
  - SHELTR single-token system
  - Smart contract specifications
  
- 📄 **[Whitepaper](architecture/technical/whitepaper_final.md)** - Official technical whitepaper

---

### 🔌 [API](api/) - RESTful API Documentation
**Status**: ✅ Current | **Documents**: 3 | **Priority**: 🔴 High

Complete API reference and database schemas

```
api/
├── api summary.md                # API overview & quick reference
├── database-schema.md            # Firestore collection structure
└── firestore-setup.md            # Firebase configuration guide
```

**Key Documents**:
- 🔌 **[API Summary](api/api%20summary.md)** - Complete API reference
  - Authentication endpoints
  - User management
  - Document CRUD
  - Qualified investor APIs
  - 50+ documented endpoints
  
- 🗄️ **[Database Schema](api/database-schema.md)** - Firestore structure
  - Collection schemas
  - Document interfaces
  - Relationships & indexes
  - Security rules
  
- 🔥 **[Firestore Setup](api/firestore-setup.md)** - Configuration guide
  - Firebase project setup
  - Security rules
  - Indexes and queries

---

### 💻 [Development](development/) - Development Guides & Workflows
**Status**: ✅ Current | **Documents**: 180+ | **Priority**: 🔴 High

Developer guides, workflows, and implementation histories

```
development/
├── development-summary.md        # Development overview
├── roadmap.md                    # 180-day launch timeline
└── completed-work/               # Implementation histories
    ├── agent-development/        # AI chatbot development (21 docs)
    ├── blog-system/              # Blog CMS implementation (7 docs)
    ├── calendar-booking/         # Google Calendar integration (3 docs)
    ├── dashboard-ui/             # Dashboard enhancements (12 docs)
    ├── data-migration/           # Database migrations (9 docs)
    ├── dataroom/                 # IR Data Room (5 docs)
    ├── doc-hub/                  # Documentation hub (27 docs)
    ├── donations/                # Donation system (4 docs)
    ├── infrastructure/           # Infrastructure updates (9 docs)
    ├── knowledge-rag/            # RAG system (15 docs)
    ├── mcp/                      # MCP integration (1 doc)
    ├── notifications/            # Notification system (19 docs)
    ├── portal/                   # Founders Portal (6 docs)
    └── ui/                       # UI enhancements (4 docs)
```

**Key Documents**:
- 🗺️ **[Development Roadmap](development/roadmap.md)** - Launch timeline
  - Phase 1: Foundation (2026)
  - Phase 2: Expansion (2027)
  - Phase 3: Global Scale (2027+)
  - Feature priorities
  
- 📝 **[Development Summary](development/development-summary.md)** - Overview
  - Development workflow
  - Git conventions
  - Code standards
  
- ✅ **[Completed Work](development/completed-work/)** - Implementation histories
  - 180+ detailed implementation documents
  - Feature-by-feature breakdown
  - Lessons learned
  - Best practices

---

### ✨ [Features](features/) - Feature-Specific Documentation
**Status**: ✅ Current | **Documents**: 35+ | **Priority**: 🔴 High

Detailed documentation for each platform feature

```
features/
├── feature-documentation.md      # Feature overview
├── functionality-matrix.md       # Complete feature matrix
├── automations/                  # Automation system
│   └── automation-dashboard-system.md
├── blog-system/                  # Content management (2 docs)
│   ├── BLOG-PRODUCTION-STATUS.md
│   └── BLOG-SYSTEM-COMPLETE.md
├── chatbot/                      # AI Agent System (4 docs)
│   ├── SHELTR-AGENT-ARCHITECTURE.md
│   ├── MCP-INTEGRATION-GUIDE.md
│   ├── AGENT-QUICK-REFERENCE.md
│   └── CHATBOT-FEATURES-ROADMAP.md
├── dochub/                       # Documentation publisher (3 docs)
│   ├── DOCS-HUB-PUBLISHER.md
│   ├── DOCUMENT-VISIBILITY-PERMISSIONS-GUIDE.md
│   └── DUAL-REPOSITORY-SIDEBAR-PLAN.md
├── knowledge-base/               # RAG & Document Management (14 docs)
│   ├── README.md                 # Comprehensive KB overview
│   ├── KNOWLEDGE-BASE-STRATEGY.md
│   ├── KNOWLEDGE-BASE-SYNC-SYSTEM.md
│   └── ...
├── messaging/                    # Internal messaging (2 docs)
│   ├── internal-messaging-system.md
│   └── messaging-automation-implementation.md
└── notifications/                # Real-time notifications (2 docs)
    ├── NOTIFICATION-ARCHITECTURE.md
    └── NOTIFICATION-METRICS-GUIDE.md
```

**Key Documents**:
- 🧠 **[Knowledge Base README](features/knowledge-base/README.md)** - Comprehensive overview
  - 75+ documents in RAG system
  - Automated GitHub sync
  - OpenAI GPT-4 Turbo integration
  - Dual-tier chat (FAQ <1s / RAG 2-4s)
  - MCP integration for developers
  - 56% GCP cost reduction
  
- 🤖 **[SHELTR Agent Architecture](features/chatbot/SHELTR-AGENT-ARCHITECTURE.md)** - AI system
  - Multi-agent system design
  - Context-aware responses
  - Model Context Protocol integration
  
- 🔌 **[MCP Integration Guide](features/chatbot/MCP-INTEGRATION-GUIDE.md)** - Developer AI
  - Real-time documentation access
  - AI-assisted development
  - Context loading
  
- 📝 **[Blog System](features/blog-system/BLOG-SYSTEM-COMPLETE.md)** - CMS
  - Production-ready content management
  - SEO optimization
  - Social sharing
  
- 🔔 **[Notification Architecture](features/notifications/NOTIFICATION-ARCHITECTURE.md)** - Real-time system
  - Cross-dashboard notifications
  - Real-time updates
  - Role-based filtering

---

### 🌍 [Ecosystem](ecosystem/) - SHELTR Ecosystem Components
**Status**: 🔄 Planned | **Documents**: 7 | **Priority**: 🟡 Medium

Hardware and infrastructure innovations

```
ecosystem/
├── ecosystem-summary.md          # Ecosystem overview
├── pods/                         # Portable emergency housing (4 docs)
│   ├── pods-system.md
│   ├── pod-design.md
│   ├── pod-security.md
│   └── pod-roadmap.md
├── mobi/                         # Mobility solutions (1 doc)
│   └── mobi-ebike.md
└── drones/                       # Delivery infrastructure (1 doc)
    └── drone-system.md
```

**Key Documents**:
- 🏠 **[PODS System](ecosystem/pods/pods-system.md)** - Emergency housing
- 🚴 **[MOBI E-Bikes](ecosystem/mobi/mobi-ebike.md)** - Mobility solutions
- 🚁 **[Drone System](ecosystem/drones/drone-system.md)** - Delivery infrastructure

---

### 🔐 [Security](security/) - Security & Compliance
**Status**: ✅ Current | **Documents**: 8 | **Priority**: 🔴 High

Enterprise security documentation and protocols

```
security/
├── security.md                   # Security best practices
├── ACCESS-MANAGEMENT-PLAN.md     # RBAC implementation
├── SECURE-DOCUMENTS-ARCHITECTURE-REPORT.md
├── SECURE-DOCS-SYNC-WORKFLOW.md
├── SECURE-SYNC-IMPLEMENTATION-PLAN.md
├── SECURE-SYNC-SETUP.md
├── SECURITY-INCIDENT-RESPONSE.md
└── SESSION-NOV-03-PUBLIC-DOCS-IN-SECURE-PORTALS.md
```

**Key Documents**:
- 🔒 **[Security Overview](security/security.md)** - Best practices
  - SOC 2 Type II compliance
  - PCI DSS Level 1
  - Firebase security rules
  - Encryption standards
  
- 🛡️ **[Access Management](security/ACCESS-MANAGEMENT-PLAN.md)** - RBAC
  - 5-role system
  - Custom claims
  - Permission matrix
  
- 📁 **[Secure Documents](security/SECURE-DOCUMENTS-ARCHITECTURE-REPORT.md)** - Document security
  - Multi-destination publishing
  - Role-based access
  - Audit logging
  
- 🚨 **[Incident Response](security/SECURITY-INCIDENT-RESPONSE.md)** - Security incidents

---

### 🛠️ [Implementation](implementation/) - Implementation Guides
**Status**: ✅ Current | **Documents**: 3 | **Priority**: 🟡 Medium

Practical implementation and optimization guides

```
implementation/
├── gcp-cost-optimization.md      # 56% GCP cost reduction
├── GEMINI-COST-ANALYSIS.md       # AI cost analysis
└── SEO-KEYWORDS-STRATEGY.md      # Search optimization
```

**Key Documents**:
- 💰 **[GCP Cost Optimization](implementation/gcp-cost-optimization.md)** - Cost reduction
  - Firestore caching strategy
  - HTTP cache headers
  - 56% cost reduction ($54/month savings)
  
- 🤖 **[Gemini Cost Analysis](implementation/GEMINI-COST-ANALYSIS.md)** - AI costs
- 🔍 **[SEO Strategy](implementation/SEO-KEYWORDS-STRATEGY.md)** - Search optimization

---

### 🔗 [Integrations](integrations/) - Third-Party Integrations
**Status**: ✅ Current | **Documents**: 2 | **Priority**: 🟡 Medium

External service integration guides

```
integrations/
├── integrations-summary.md       # Integrations overview
└── firebase-integration.md       # Firebase services setup
```

**Key Documents**:
- 📊 **[Integrations Summary](integrations/integrations-summary.md)** - Overview
- 🔥 **[Firebase Integration](integrations/firebase-integration.md)** - Firebase setup
  - Authentication
  - Firestore
  - Cloud Functions
  - Storage
  - Hosting

---

### ⚙️ [Operations](operations/) - Deployment & Operations
**Status**: ✅ Current | **Documents**: 4 | **Priority**: 🔴 High

Production deployment, monitoring, and operations

```
operations/
├── prod-deployment.md            # Production deployment guide
├── firebase-hosting.md           # Firebase hosting setup
├── google-cloud-run.md           # Container deployment
└── monitoring.md                 # System health monitoring
```

**Key Documents**:
- 🚀 **[Production Deployment](operations/prod-deployment.md)** - Deployment procedures
  - Firebase hosting
  - Cloud Functions deployment
  - Environment variables
  - Rollback procedures
  
- 🔥 **[Firebase Hosting](operations/firebase-hosting.md)** - Firebase deployment
- ☁️ **[Cloud Run](operations/google-cloud-run.md)** - Container deployment
- 📊 **[Monitoring](operations/monitoring.md)** - System monitoring
  - Uptime monitoring
  - Performance metrics
  - Error tracking

---

### 🧪 [QA Testing](qa-testing/) - Testing & Quality Assurance
**Status**: ✅ Current | **Documents**: 3 | **Priority**: 🟡 Medium

Comprehensive testing guides and procedures

```
qa-testing/
├── DASHBOARD-TESTING-GUIDE.md    # Dashboard QA procedures
├── BUSINESS-LOGIC-TESTING.md     # Logic validation tests
└── DONATION-FLOW-TESTING-GUIDE.md # Payment flow testing
```

**Key Documents**:
- 🧪 **[Dashboard Testing](qa-testing/DASHBOARD-TESTING-GUIDE.md)** - QA procedures
  - Role-based testing
  - Dashboard validation
  - Data consistency checks
  
- 💼 **[Business Logic Testing](qa-testing/BUSINESS-LOGIC-TESTING.md)** - Logic tests
- 💳 **[Donation Flow Testing](qa-testing/DONATION-FLOW-TESTING-GUIDE.md)** - Payment testing

---

### 👥 [User Guides](user-guides/) - End-User Documentation
**Status**: ✅ Current | **Documents**: 8 | **Priority**: 🟡 Medium

Role-specific guides and user journeys

```
user-guides/
├── README.md                     # User guides hub
├── user-journeys.md              # Complete user flows
├── donor-guide.md                # For donors & supporters
├── donor-contributor-journey.md  # Donor journey map
├── participant-guide.md          # For service recipients
├── shelter-admin-guide.md        # For shelter staff
├── shelter-organizations-journey.md # Shelter journey
└── government-partners-journey.md # Government partners
```

**Key Documents**:
- 📖 **[User Guides Overview](user-guides/README.md)** - Navigation hub
- 💝 **[Donor Guide](user-guides/donor-guide.md)** - Complete donor experience
- 👤 **[Participant Guide](user-guides/participant-guide.md)** - Service recipient guide
- 🏢 **[Shelter Admin Guide](user-guides/shelter-admin-guide.md)** - Administrative guide
- 🗺️ **[User Journeys](user-guides/user-journeys.md)** - Complete user flows

---

### 📚 [Reference](reference/) - Technical Reference
**Status**: ✅ Current | **Documents**: 5 | **Priority**: 🟡 Medium

Technical specifications and reference materials

```
reference/
├── README.md                     # Reference hub
├── api-reference.md              # Complete API documentation
├── database-schema.md            # Data structure reference
├── design-system.md              # UI/UX guidelines
└── PROJECT-TREE.md               # Complete codebase map
```

**Key Documents**:
- 🔌 **[API Reference](reference/api-reference.md)** - API documentation
- 🗄️ **[Database Schema](reference/database-schema.md)** - Data structures
- 🎨 **[Design System](reference/design-system.md)** - UI/UX guidelines
- 🌳 **[Project Tree](reference/PROJECT-TREE.md)** - Codebase navigation
  - Complete file structure
  - Component locations
  - Service organization
  - Quick reference tags

---

### 📦 [Resources](resources/) - Additional Resources
**Status**: ✅ Current | **Documents**: 10+ | **Priority**: 🟢 Low

Supporting resources, templates, and research

```
resources/
├── README.md                     # Resources hub
├── research/                     # Research materials
│   ├── general-research.md
│   ├── shelters_state_by_state.md
│   ├── important_homeless_shelters_canada.md
│   └── unique_shelter_programs.md
└── templates/                    # Document templates
    ├── README.md
    ├── bug-report.md
    └── feature-request.md
```

**Key Documents**:
- 🔍 **[Research](resources/research/)** - Background research
- 📋 **[Templates](resources/templates/)** - Document templates

---

### 📦 [Archive](archive/) - Historical Documentation
**Status**: 📦 Archived | **Documents**: 180+ | **Priority**: 🟢 Low

Archived documentation and development session logs

```
archive/
├── archive-summary.md            # Archive overview
├── sessions/                     # Development sessions
│   ├── 2025-Q3/                  # Sessions 2-13 (46 docs)
│   └── 2025-Q4/                  # Sessions 14-24 (13 docs)
└── migrations/                   # Migration history
    └── README.md
```

**Key Documents**:
- 📚 **[Archive Summary](archive/archive-summary.md)** - Historical overview
- 📝 **[Session Logs](archive/sessions/)** - Development documentation
  - Quarterly organization
  - Implementation histories
  - Decision records

---

## 🔍 Navigation Paths

### By Topic

#### Platform & Architecture
- **Vision & Mission**: [overview/](overview/)
- **System Design**: [architecture/platform/system-design.md](architecture/platform/system-design.md)
- **Website Architecture**: [architecture/platform/website-architecture.md](architecture/platform/website-architecture.md)
- **Payment Infrastructure**: [architecture/payment-rails/](architecture/payment-rails/)
- **Blockchain & Tokenomics**: [architecture/technical/](architecture/technical/)

#### Development & Features
- **Development Guide**: [development/](development/)
- **AI Chatbot**: [features/chatbot/](features/chatbot/)
- **Knowledge Base**: [features/knowledge-base/](features/knowledge-base/)
- **Notifications**: [features/notifications/](features/notifications/)
- **Blog System**: [features/blog-system/](features/blog-system/)

#### Integration & Operations
- **API Documentation**: [api/](api/)
- **Integrations**: [integrations/](integrations/)
- **Operations**: [operations/](operations/)
- **Security**: [security/](security/)

#### User Experience
- **User Guides**: [user-guides/](user-guides/)
- **Design System**: [reference/design-system.md](reference/design-system.md)
- **User Journeys**: [user-guides/user-journeys.md](user-guides/user-journeys.md)

---

## 🚀 Getting Started Paths

### For New Team Members
1. Read [Platform Overview](overview/platform-overview.md)
2. Review [Hacking Homelessness](overview/hacking_homelessness.md)
3. Check [System Design](architecture/platform/system-design.md)
4. Review [Development Roadmap](development/roadmap.md)

### For Developers
1. [System Design](architecture/platform/system-design.md)
2. [API Reference](api/api%20summary.md)
3. [Development Summary](development/development-summary.md)
4. [Project Tree](reference/PROJECT-TREE.md)

### For Investors
1. [Platform Overview](overview/platform-overview.md)
2. [Development Roadmap](development/roadmap.md)
3. [Tokenomics](architecture/technical/tokenomics.md)
4. [Knowledge Base Overview](features/knowledge-base/README.md)

### For End Users
1. [User Journeys](user-guides/user-journeys.md)
2. [Donor Guide](user-guides/donor-guide.md)
3. [Participant Guide](user-guides/participant-guide.md)
4. [Shelter Admin Guide](user-guides/shelter-admin-guide.md)

---

## 📊 Documentation Statistics

| **Category** | **Folders** | **Documents** | **Status** |
|--------------|-------------|---------------|------------|
| **Overview** | 1 | 4 | ✅ Current |
| **Architecture** | 3 | 15+ | ✅ Current |
| **API** | 1 | 3 | ✅ Current |
| **Development** | 1 + 15 sub | 180+ | ✅ Current |
| **Features** | 7 | 35+ | ✅ Current |
| **Ecosystem** | 3 | 7 | 🔄 Planned |
| **Security** | 1 | 8 | ✅ Current |
| **Implementation** | 1 | 3 | ✅ Current |
| **Integrations** | 1 | 2 | ✅ Current |
| **Operations** | 1 | 4 | ✅ Current |
| **QA Testing** | 1 | 3 | ✅ Current |
| **User Guides** | 1 | 8 | ✅ Current |
| **Reference** | 1 | 5 | ✅ Current |
| **Resources** | 2 | 10+ | ✅ Current |
| **Archive** | 3 | 180+ | 📦 Archived |
| **TOTAL** | **14** | **450+** | ✅ Organized |

---

## 🔗 External Resources

### Live Platform
- 🌐 **Platform**: https://sheltr-ai.web.app
- 📚 **Public Docs**: https://sheltr-ai.web.app/docs
- 🔐 **Founders Portal**: https://sheltr-ai.web.app/portal/founders-only
- 💰 **IR Data Room**: https://sheltr-ai.web.app/ir/dataroom
- 🤖 **AI Chatbot**: Available on every page (bottom-right)

### Development
- 💻 **GitHub**: https://github.com/mrj0nesmtl/sheltr-ai
- 📊 **Knowledge Base**: https://sheltr-ai.web.app/dashboard/knowledge
- 🔌 **API Docs**: https://sheltr-ai.web.app/docs/api

---

## 📈 Recent Major Updates

### November 2025 - Documentation Restructuring
- ✅ **Cleaned Structure**: Organized into 14 clear sections
- ✅ **Summary Files**: Added overview/summary in each major section
- ✅ **Completed Work**: Archived 180+ implementation documents by feature
- ✅ **Session Organization**: Quarterly logs (Q3/Q4 2025)
- ✅ **Enhanced Navigation**: New README and Table of Contents
- ✅ **Knowledge Base**: Comprehensive investor-ready overview

### November 2025 - Platform Features
- ✅ **Qualified Investor Portal**: Dual authentication with IR Data Room
- ✅ **Calendar Integration**: Google Calendar for investor/partnership meetings
- ✅ **Dynamic Document Loading**: Firestore-based with toggle filtering
- ✅ **Revenue Projections**: Added to Founders Portal and IR Data Room

### October 2025 - Knowledge Base Revolution
- ✅ **GitHub Sync**: Automated document synchronization
- ✅ **RAG System**: 75+ documents with GPT-4 Turbo integration
- ✅ **Cost Optimization**: 56% GCP cost reduction via caching
- ✅ **MCP Integration**: AI-assisted development with full context

---

## 💬 Documentation Support

**Need help navigating the documentation?**

- 🤖 **AI Chatbot**: Ask SHELTR's AI on any page (bottom-right corner)
- 📧 **Email**: joel@arcanaconcept.com
- 🔍 **Search**: Knowledge Base Dashboard at `/dashboard/knowledge`
- 📖 **Main Guide**: [README.md](README.md)
- 🌳 **Codebase Map**: [PROJECT-TREE.md](reference/PROJECT-TREE.md)

---

## 📝 Related Navigation Documents

- 📖 [Main README](README.md) - Documentation hub overview
- 🌳 [Project Tree](reference/PROJECT-TREE.md) - Complete codebase navigation
- 📊 [Changelog](overview/CHANGELOG.md) - Platform version history
- 📚 [Archive Summary](archive/archive-summary.md) - Historical documentation

---

**Version**: 3.0.0 - Restructured Documentation  
**Last Updated**: November 7, 2025  
**Status**: ✅ Production Ready  
**Next Review**: November 14, 2025

---

<p align="center">
  <strong>Complete, organized, enterprise-grade documentation</strong><br>
  <em>Professional documentation structure for SHELTR platform v2.90.0</em>
</p>
