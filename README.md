# 🏠 SHELTR
**Better to Solve than Manage.** 

The next generation platform for transparent charitable giving and homelessness support built on modern cloud infrastructure.

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![GitHub Stars](https://img.shields.io/github/stars/mrj0nesmtl/sheltr-ai?style=for-the-badge)](https://github.com/mrj0nesmtl/sheltr-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg?style=for-the-badge)](https://www.python.org/downloads/)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-August%204%2C%202025-brightgreen?style=for-the-badge)](https://github.com/mrj0nesmtl/sheltr-ai)

---

## 🎯 Mission

**Sheltr is Hacking homelessness.** SHELTR empowers direct, transparent charitable giving through QR-code enabled donations, blockchain verification, and AI-driven insights. Every donation follows our SmartFund™ distribution: 85% direct to participants, 10% to sustainable housing, 5% to participant's registered shelter operations.

## 🚀 Quick Start

- **New to SHELTR?** → Start with [Overview & Vision](docs/01-overview/README.md)
- **Want to develop?** → Check [Development Roadmap](docs/04-development/dev-roadmap.md)
- **Need API docs?** → Visit [API Documentation](docs/03-api/README.md)
- **User guidance?** → See [Complete User Guides](docs/06-user-guides/) (Participant, Admin, Donor)

---

## 📚 Documentation Sections

### 🌟 [01. Overview](docs/01-overview/)
- [Getting Started & Vision](docs/01-overview/README.md)
- [Mission: Hacking Homelessness](docs/01-overview/hacking_homelessness.md)
- [Documentation Strategy](docs/01-overview/SHELTR-AI-DOCS-PLAN.md)
- [Implementation Roadmap](docs/01-overview/SHELTR-AI-IMPLEMENTATION-PLAN.md)

### 🏗️ [02. Architecture](docs/02-architecture/)
- [System Design](docs/02-architecture/system-design.md)
- [Official Whitepaper](docs/02-architecture/whitepaper_final.md)
- [Blockchain Integration](docs/02-architecture/technical/blockchain.md)
- [SHELTR Tokenomics](docs/02-architecture/tokenomics/sheltr-tokenomics.md)

### 🔌 [03. API Documentation](docs/03-api/)
- [FastAPI Overview](docs/03-api/README.md)
- [Authentication Endpoints](docs/03-api/README.md#authentication)
- [User Management APIs](docs/03-api/README.md#user-management)
- [Donation System APIs](docs/03-api/README.md#donations)

### 👩‍💻 [04. Development](docs/04-development/)
- [Development Roadmap](docs/04-development/dev-roadmap.md)
- [Session 5.5: About & Solutions Redesign](docs/04-development/SESSION-05.5-ABOUT-SOLUTIONS-REDESIGN.md)
- [Session 6: Multi-Dashboard Development](docs/04-development/SESSION-06-MULTI-DASHBOARD-DEVELOPMENT.md)
- [Session 5: GitHub Security & Super Admin](docs/04-development/SESSION-05-GITHUB-SECURITY-SUPER-ADMIN.md)
- [Session 4: Super Admin Dashboard](docs/04-development/SESSION-04-SUPER-ADMIN-DASHBOARD.md)
- [Session 3: Authentication & RBAC](docs/04-development/SESSION-03-AUTHENTICATION-RBAC.md)

### 👥 [06. User Guides](docs/06-user-guides/)
- [Participant Guide](docs/06-user-guides/participant-guide.md) - Complete guide for homeless participants  
- [Shelter Administrator Guide](docs/06-user-guides/shelter-admin-guide.md) ✅ **NEW** - 400+ page comprehensive admin guide
- [Donor Guide](docs/06-user-guides/donor-guide.md) ✅ **NEW** - 450+ page donor platform guide
- SuperAdmin Guide *(Coming Soon)* - Platform administration and oversight

### 🔄 [09. Migration](docs/09-migration/)
- [Database Migration Complete](docs/09-migration/DATABASE_MIGRATION_COMPLETE.md)
- [Migration Strategy](docs/09-migration/DATABASE_MIGRATION_PLAN.md)
- [From Supabase Migration](docs/09-migration/from-supabase.md)

### 🤖 AI Agent Documentation
- [Claude Agent Briefing](docs/CLAUDE-AGENT-BRIEFING.md)
- [Agent Communication Protocols](docs/CLAUDE-AGENT-COMMUNICATION.md)

---

## 🎯 Four-Role System

SHELTR-AI operates on a comprehensive four-role user system designed for maximum flexibility and security:

| Role | Description | Access Level | Tenant Location | **🆕 New Features** |
|------|-------------|--------------|-----------------|-------------------|
| **👑 SuperAdmin** | SHELTR Founders & Platform Operators | Global system control | `tenants/platform/` | Advanced analytics, blockchain oversight |
| **👨‍💼 Admin** | Shelter Operators & Staff | Shelter management | `tenants/shelter-{id}/` | Multi-shelter dashboards, participant management |
| **👤 Participant** | Donation Recipients (Homeless Individuals) | Personal QR & donations | `tenants/shelter-{id}/participants/` or `tenants/participant-network/` | **🆕 Independent registration, QR code generation** |
| **💝 Donor** | People Making Donations | Donation & impact tracking | `tenants/donor-network/` | Real-time impact tracking, donation history |

### **🆕 Participant Independence**
Participants can now register **independently** of shelters, creating a more inclusive network:
- **Direct Registration**: QR code generation without shelter affiliation
- **Cross-Shelter Mobility**: Maintain identity across multiple locations
- **Personal Agency**: Own their donation profile and impact story

---

## 🪙 $SHELTR Token & Blockchain System

### **🆕 Enhanced Token Architecture**

We've expanded our blockchain integration with multiple token options and enhanced smart contract functionality:

#### **Token Architecture & ICO Timeline**
1. **🔵 SHELTR-S Stablecoin** - Price-stable donations with 1:1 USDC backing
2. **🟢 SHELTR Governance Token** - Platform governance with DeFi integration
   - **Pre-Seed**: September 2025 - $0.05/token ($150K raise for 3M tokens)
   - **Public ICO**: December 2025 - $0.10/token launch price
   - **3-Year Release**: 33% annually with progressive price targets
3. **🟡 Dual-Token System** - SHELTR-S for stability + SHELTR for governance + NFT certificates

#### **SmartFund™ Smart Contracts**
Every donation automatically distributes through audited smart contracts:

```solidity
// SmartFund™ Distribution
function processDonation(address participant, uint256 amount) external {
    uint256 toParticipant = (amount * 85) / 100;  // 85% direct
    uint256 toHousing = (amount * 10) / 100;      // 10% housing fund
    uint256 toShelterOps = (amount * 5) / 100;    // 5% shelter operations
    
    // Instant, transparent distribution
    token.transfer(participant, toParticipant);
    token.transfer(housingFund, toHousing);
    token.transfer(shelterOperations, toShelterOps);
}
```

#### **🆕 Blockchain Features**
- **🔍 Public Explorer**: Real-time transaction tracking
- **🏆 Impact NFTs**: Donation certificates and achievement badges
- **🗳️ DAO Governance**: Community-driven platform decisions
- **⚡ Layer 2**: Polygon integration for low-cost transactions
- **🛡️ Multi-sig**: Enhanced security for fund management

**→ [Complete Blockchain Documentation](docs/02-architecture/technical/blockchain.md)**

---

## 🛠️ Technology Stack

### **🆕 Updated Stack - SHELTR 2.0**

#### Frontend & Mobile
- **Web**: Next.js 15 + React 18 + TypeScript 5.0+
- **Mobile**: Expo SDK 50 + React Native
- **UI**: Tailwind CSS + Shadcn/UI + Radix UI
- **State**: Zustand + React Hook Form + Zod validation
- **Real-time**: Firebase SDK v9+ with real-time listeners

#### Backend & Database  
- **API**: FastAPI + Python 3.11 + Async/Await
- **Database**: Firebase Firestore (multi-tenant architecture)
- **Auth**: Firebase Authentication + custom claims + role-based access
- **Storage**: Firebase Storage + Google Cloud Storage
- **Queue**: Google Cloud Tasks + Pub/Sub

#### **🆕 Blockchain & AI**
- **Blockchain**: Ethereum + Polygon + Smart Contracts (Solidity)
- **Token**: Multi-option system (USDC/SHLTR/Hybrid)
- **AI**: OpenAI GPT-4 + LangChain + Custom analytics
- **ML**: Google Cloud AI for predictive insights

#### **🆕 Infrastructure & DevOps**
- **Hosting**: Firebase Hosting + Google Cloud Run (serverless)
- **Deployment**: Docker + GitHub Actions + automated testing  
- **Monitoring**: Google Cloud Monitoring + Sentry + custom dashboards
- **CDN**: Firebase CDN + Cloud Storage global distribution
- **Security**: Google Cloud Security Command Center + automated audits

#### **🆕 Development Tools**
- **IDE**: Cursor (Claude 4 Sonnet integration) + VS Code settings
- **Monorepo**: TurboRepo + shared packages + optimized builds
- **Testing**: Jest + Cypress + Playwright + Python pytest
- **Code Quality**: ESLint + Prettier + Black + MyPy + pre-commit hooks

---

## 🌟 Key Features

✅ **QR-Code Donations** - Instant scan-and-give system  
✅ **Blockchain Verification** - Transparent, immutable transactions  
✅ **Multi-Tenant SaaS** - Scalable shelter management  
✅ **AI-Powered Analytics** - Data-driven impact insights  
✅ **Mobile-First Design** - Native iOS/Android experience  
✅ **Real-Time Dashboards** - Live donation tracking  
✅ **SmartFund™ Distribution** - Automated 85/10/5 allocation  
✅ **Role-Based Access** - Four-tier permission system  

### **🆕 New Features in SHELTR-AI 2.0**
🆕 **Independent Participant Registration** - No shelter requirement  
🆕 **Firebase Real-time Sync** - Live updates across all platforms  
🆕 **Google Cloud Run Backend** - Serverless, auto-scaling API  
🆕 **Enhanced Blockchain Integration** - Multi-token support + NFTs  
🆕 **Advanced AI Analytics** - Predictive insights + impact modeling  
🆕 **Monorepo Architecture** - Streamlined development workflow  
🆕 **Docker Containerization** - Consistent deployment environments  
🆕 **Automated CI/CD** - GitHub Actions + automated testing  
✨ **LIVE AUTHENTICATION** - Complete 4-role RBAC system operational  
✨ **WORKING DASHBOARDS** - Role-specific interfaces with real data  

---

## 🚀 **Development Status & Roadmap**

### **🎯 Current Phase: SESSION 9 COMPLETE ✅ - Data Connectivity Revolution + Complete User Guide Suite**
- ✅ Repository structure and documentation
- ✅ Python virtual environment setup  
- ✅ FastAPI backend foundation
- ✅ Firebase project configuration
- ✅ **LIVE WEBSITE**: https://sheltr-ai.web.app
- ✅ **Complete UI**: All stakeholder pages, tokenomics, impact dashboard
- ✅ **Professional Design**: Shadcn UI with theme toggle
- ✅ **COMPLETE AUTHENTICATION**: 4-role RBAC system working
- ✅ **JOEL'S SUPER ADMIN**: Live dashboard with platform oversight
- ✅ **LIVE BUTTONS**: All website CTAs now functional
- ✅ **📱 MOBILE NAVIGATION**: Hamburger menu on all public pages
- ✅ **🎨 THEME-AWARE LOGOS**: Dynamic logo switching for light/dark modes
- ✅ **📄 GLOBAL FOOTER**: Standardized footer component across all pages
- ✅ **🧹 REPOSITORY CLEANUP**: Professional .gitignore and file organization
- ✅ **🏠 ABOUT PAGE REDESIGN**: Complete overhaul with forward-looking messaging
- ✅ **💫 IMPACT PAGE**: Internet Angels integration and future vision focus
- ✅ **📋 SOLUTIONS ENHANCEMENT**: Professional case studies and policy briefs
- ✅ **📚 DOCUMENTATION HUB**: Enhanced with new docs and fixed links
- ✅ **📱 MOBILE DASHBOARD POLISH**: All 7 dashboard pages redesigned for mobile perfection
- ✅ **💬 ENHANCED CHATBOT**: Pop-out windows, fullscreen mode, mobile optimization
- ✅ **🔧 THEME TOGGLE INTEGRATION**: Dashboard theme switching with perfect positioning
- ✅ **🚀 SERVICE BOOKING SYSTEM**: Complete backend API with FastAPI endpoints
- ✅ **📝 FORM PERSISTENCE**: Real-time data saving with Firebase integration
- ✅ **🐛 PRODUCTION BUILD FIXES**: All TypeScript errors resolved, deployment ready
- ✅ **🔗 SESSION 9: DATA CONNECTIVITY REVOLUTION**: Real database integration complete
- ✅ **🏠 OLD BREWERY MISSION LIVE**: 300-bed shelter with real participant tracking
- ✅ **📊 REAL-TIME DASHBOARDS**: All 6 dashboards connected to live Firestore data
- ✅ **👥 COMPLETE USER GUIDE SUITE**: 850+ pages across 3 comprehensive guides
- ✅ **🔧 DATABASE MIGRATION**: Clean architecture ready for engineering audits
- 🔄 Advanced API endpoints expansion
- ⏳ Blockchain integration phase

### **📅 Upcoming Milestones**
- **Week 3-4**: ✅ **COMPLETED EARLY** - Authentication system fully operational
- **Week 5-6**: ✅ **COMPLETED** - Session 5.5 About & Solutions redesign  
- **Week 7-8**: ✅ **COMPLETED** - Session 8 Core Business Logic + Mobile Dashboard Polish
- **Week 9-10**: ✅ **COMPLETED** - Session 9 Data Connectivity Revolution + Complete User Guides
- **Week 11-12**: Advanced API endpoints + File upload system + Donation processing
- **Week 13-14**: Blockchain integration + Smart contracts deployment
- **Week 15-16**: Production scaling + Stakeholder onboarding + Mobile app development

**→ [Complete Roadmap](docs/04-development/dev-roadmap.md)**

---

## 📞 Support & Community

### **For Users & Organizations**
- 📧 **General Support**: joel@arcanaconcept.com
- 🏠 **Shelter Partnerships**: joel@arcanaconcept.com  
- 📚 **User Guides**: [Complete User Documentation](docs/06-user-guides/) (Participant, Admin, Donor)
- 🔧 **Technical Support**: joel@arcanaconcept.com
- 🌐 **Website**: [sheltr-ai.web.app](https://sheltr-ai.web.app)

### **For Developers**
- 📖 **Documentation Hub**: [Complete Documentation](docs/TABLE_OF_CONTENTS.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/mrj0nesmtl/sheltr-ai/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/mrj0nesmtl/sheltr-ai/discussions)
- 🔧 **API Reference**: [FastAPI Docs](docs/03-api/README.md)
- 🏗️ **Development Guide**: [Development Roadmap](docs/04-development/dev-roadmap.md)

---

**📖 "Great documentation is the foundation of great software - and great impact."**

*Last Updated: January 25, 2025 - Updated Tokenomics: 85/10/5 Distribution + ICO Timeline*

**🌐 [Visit Live Site](https://sheltr-ai.web.app) | 🚀 [Get Started](docs/01-overview/README.md) | 🤝 [Contribute](CONTRIBUTING.md) | 💝 [Donate](https://sheltr-ai.web.app/scan-give) | 📖 [Documentation Hub](docs/TABLE_OF_CONTENTS.md)**