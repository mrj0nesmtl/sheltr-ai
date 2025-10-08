# 🌳 SHELTR Project Tree Reference

*Generated on: Tue Oct  7 23:13:58 EDT 2025*
*Last Updated: 2025-10-07*

## 📋 Quick Navigation

- [🏗️ Architecture Overview](#️-architecture-overview)
- [🧠 Knowledge Base System](#-knowledge-base-system)
- [💬 Chat & AI System](#-chat--ai-system)
- [🔔 Messaging & Notifications](#-messaging--notifications)
- [👥 User Management & Auth](#-user-management--auth)
- [🏠 Shelter Management](#-shelter-management)
- [💰 Financial & Payments](#-financial--payments)
- [📊 Analytics & Reporting](#-analytics--reporting)
- [🎨 Gallery & Media](#-gallery--media)
- [🔐 Security & Compliance](#-security--compliance)
- [🌐 Public Pages & Solutions](#-public-pages--solutions)
- [📚 Documentation Hub](#-documentation-hub)
- [⚙️ Configuration & Deploy](#️-configuration--deploy)
- [🔧 Development Tools](#-development-tools)
- [⛓️ Blockchain & Smart Contracts](#️-blockchain--smart-contracts)

---

## 🏗️ Architecture Overview

### Core Applications
```
apps/
├── web/                          # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                  # App Router Pages & Layouts
│   │   │   ├── dashboard/        # Protected Dashboard Routes
│   │   │   ├── docs/             # Documentation Pages
│   │   │   ├── portal/           # Founders Portal
│   │   │   ├── solutions/        # Public Solution Pages
│   │   │   └── auth/             # Authentication Pages
│   │   ├── components/           # React Components
│   │   │   ├── ui/               # Shadcn UI Components
│   │   │   ├── auth/             # Authentication Components
│   │   │   └── layout/           # Layout Components
│   │   ├── lib/                  # Utility Libraries
│   │   ├── services/             # API Services
│   │   └── contexts/             # React Contexts
│   ├── public/                   # Static Assets & Documents
│   └── package.json              # Frontend Dependencies
├── api/                          # Python FastAPI Backend
│   ├── routers/                  # API Route Handlers
│   ├── services/                 # Business Logic Services
│   ├── models/                   # Data Models
│   ├── scripts/                  # Database Scripts
│   └── requirements.txt          # Python Dependencies
└── images/                       # Brand Assets & Media
    ├── backgrounds/              # Background Images
    └── sheltr_units/             # Product Images
```

### Key Configuration Files
```
firebase.json                     # Firebase Hosting & CSP Config
firestore.rules                   # Database Security Rules
storage.rules                     # File Storage Security Rules
cloudbuild.yaml                   # Google Cloud Build Config
deploy.sh                         # Main Deployment Script
functions/                        # Firebase Cloud Functions
sheltr-tokens/                    # Blockchain Smart Contracts
```

---

## 🧠 Knowledge Base System

### Frontend Components
```
apps/web/src/app/dashboard/knowledge/
├── page.tsx                      # Main Knowledge Base Dashboard
└── components/
    ├── KnowledgeBaseManager.tsx  # KB Management Interface
    ├── DocumentUpload.tsx        # File Upload Component
    ├── DocumentPreview.tsx       # Document Viewer
    └── SearchFilters.tsx         # Advanced Search UI
```

### Services & Logic
```
apps/web/src/services/
├── knowledgeService.ts           # KB CRUD Operations
├── searchService.ts              # Document Search Logic
└── fileUploadService.ts          # File Processing

apps/web/src/lib/
├── documentProcessor.ts          # Document Parsing
└── embeddingsService.ts          # AI Embeddings
```

### Backend Scripts
```
apps/api/scripts/
├── bulk-docs-uploader.py         # Batch Document Upload
├── kb-document-migrator.py       # KB Migration Tools
└── kb-folder-structure-creator.py # KB Organization
```

### Database Collections
```
Firestore: /knowledge_base/       # Document Metadata
Firestore: /document_embeddings/  # AI Search Vectors
Storage: /documents/              # File Storage
```

---

## 💬 Chat & AI System

### Chat Interface
```
apps/web/src/app/dashboard/chatbots/
├── page.tsx                      # Chatbot Control Dashboard
└── components/
    ├── ChatbotManager.tsx        # Agent Configuration
    ├── ConversationView.tsx      # Chat Interface
    ├── AgentSettings.tsx         # AI Model Settings
    └── ChatHistory.tsx           # Conversation Logs
```

### AI Services
```
apps/web/src/services/
├── chatService.ts                # Chat API Integration
├── aiModelService.ts             # OpenAI/Anthropic Integration
└── conversationService.ts       # Chat History Management

apps/web/src/lib/
├── aiPrompts.ts                  # System Prompts
├── chatUtils.ts                  # Chat Utilities
└── modelConfigurations.ts       # AI Model Configs
```

### Backend Integration
```
apps/api/scripts/
├── initialize-chatbot-agents.js  # Setup Chat Agents
└── test-ai-integration.py        # AI Testing Scripts
```

### Database Collections
```
Firestore: /chatbots/             # Bot Configurations
Firestore: /conversations/        # Chat Sessions
Firestore: /ai_responses/         # Response Cache
```

---

## 🔔 Messaging & Notifications

### Messaging Dashboard
```
apps/web/src/app/dashboard/messages/
├── page.tsx                      # Main Messages Dashboard
└── components/
    ├── MessageComposer.tsx       # Message Creation Interface
    ├── ConversationList.tsx      # Message Threads
    ├── MessageThread.tsx         # Individual Conversations
    └── MessageSearch.tsx         # Message Search & Filters
```

### Notification System
```
apps/web/src/app/dashboard/notifications/
├── page.tsx                      # Notifications Dashboard
└── components/
    ├── NotificationCenter.tsx    # Main Notification Hub
    ├── NotificationBell.tsx      # Header Notification Icon
    ├── NotificationCard.tsx      # Individual Notification
    └── NotificationSettings.tsx  # User Preferences
```

### Services & Logic
```
apps/web/src/services/
├── messageService.ts             # Internal Messaging CRUD
├── notificationService.ts        # Notification Management
├── automationService.ts          # Message Automation
└── mcpIntegrationService.ts      # MCP Chatbot Integration

apps/web/src/lib/
├── messageTypes.ts               # Message Type Definitions
├── notificationTypes.ts          # Notification Types
└── shortcodeService.ts           # User Shortcode Management
```

### Database Collections
```
Firestore: /internal_messages/    # Internal Messages
Firestore: /message_conversations/ # Message Threads
Firestore: /notifications/        # User Notifications
Firestore: /user_shortcodes/      # User Shortcode Mappings
Firestore: /automation_workflows/ # Message Automation Rules
```

---

## 👥 User Management & Auth

### User Management Dashboard
```
apps/web/src/app/dashboard/users/
├── page.tsx                      # User Management Dashboard
└── components/
    ├── UserTable.tsx             # User Listing
    ├── UserProfile.tsx           # Profile Management
    ├── RoleManager.tsx           # Role Assignment
    └── UserMap.tsx               # Geographic User View
```

### Profile Management
```
apps/web/src/app/dashboard/
├── platform-admin/profile/       # Platform Admin Profiles
├── super-admin/profile/          # Super Admin Profiles
└── settings/                     # User Settings
```

### Authentication System
```
apps/web/src/app/
├── login/page.tsx                # Login Page
├── register/page.tsx             # Registration
├── auth/action/page.tsx          # Auth Actions
└── portal/page.tsx               # Founders Portal Login

apps/web/src/components/auth/
├── AuthForm.tsx                  # Authentication Forms
├── GoogleAuthButton.tsx          # OAuth Integration
├── NDAModal.tsx                  # NDA Agreement Modal
└── ProtectedRoute.tsx            # Route Protection
```

### Services & Context
```
apps/web/src/services/
├── authService.ts                # Authentication Logic
├── userService.ts                # User CRUD Operations
├── roleService.ts                # Role Management
└── profileSyncService.ts         # Profile Synchronization

apps/web/src/contexts/
├── AuthContext.tsx               # Authentication Context
└── UserContext.tsx               # User State Management

apps/web/src/lib/
├── auth.ts                       # Auth Utilities
└── userValidation.ts             # Form Validation
```

### Database Collections
```
Firestore: /users/                # User Profiles
Firestore: /admin_profiles/       # Admin Profile Data
Firestore: /user_roles/           # Role Assignments
Firestore: /nda_signatures/       # NDA Agreement Records
```

---

## 🏠 Shelter Management

### Shelter Dashboard
```
apps/web/src/app/dashboard/shelter-admin/
├── page.tsx                      # Shelter Overview
├── participants/page.tsx         # Participant Management
├── resources/page.tsx            # Resource Management
├── reports/page.tsx              # Shelter Reports
└── settings/page.tsx             # Shelter Settings
```

### Shelter Components
```
apps/web/src/components/
├── ShelterMap.tsx                # Shelter Location Map
├── ShelterNetworkMap.tsx         # Network Overview Map
├── ParticipantTable.tsx          # Participant Listing
└── ResourceManager.tsx           # Resource Tracking
```

### Shelter Services
```
apps/web/src/services/
├── shelterService.ts             # Shelter CRUD
├── participantService.ts         # Participant Management
├── resourceService.ts            # Resource Tracking
├── mapDataService.ts             # Map Data Integration
└── geocodingService.ts           # Address to Coordinates
```

### Database Collections
```
Firestore: /shelters/             # Shelter Information
Firestore: /participants/         # Participant Records
Firestore: /shelter_resources/    # Resource Inventory
Firestore: /shelter_reports/      # Operational Reports
```

---

## 💰 Financial & Payments

### Financial Dashboard
```
apps/web/src/app/dashboard/financial/
├── page.tsx                      # Financial Overview
└── components/
    ├── TransactionTable.tsx      # Transaction History
    ├── RevenueChart.tsx          # Revenue Analytics
    ├── FraudDetection.tsx        # Security Monitoring
    └── PaymentProcessor.tsx      # Payment Integration
```

### Financial Services
```
apps/web/src/services/
├── paymentService.ts             # Payment Processing
├── transactionService.ts        # Transaction Management
├── donationService.ts            # Donation Processing
└── fraudDetectionService.ts     # Security Monitoring

apps/web/src/lib/
├── paymentValidation.ts          # Payment Validation
└── financialUtils.ts             # Financial Calculations
```

### Database Collections
```
Firestore: /transactions/         # Transaction Records
Firestore: /donations/            # Donation Tracking
Firestore: /payment_methods/      # User Payment Info
Firestore: /financial_reports/    # Financial Analytics
```

---

## 📊 Analytics & Reporting

### Analytics Dashboard
```
apps/web/src/app/dashboard/analytics/
├── page.tsx                      # Analytics Overview
└── components/
    ├── MetricsGrid.tsx           # Key Performance Indicators
    ├── UsageCharts.tsx           # Usage Analytics
    ├── GeographicInsights.tsx    # Location-based Analytics
    └── CustomReports.tsx         # Report Generation
```

### Analytics Services
```
apps/web/src/services/
├── analyticsService.ts           # Analytics Data Processing
├── metricsService.ts             # Metrics Calculation
└── reportingService.ts           # Report Generation

apps/web/src/lib/
├── chartConfig.ts                # Chart Configurations
└── analyticsUtils.ts             # Analytics Utilities
```

### Database Collections
```
Firestore: /analytics_events/     # User Events Tracking
Firestore: /system_metrics/       # System Performance
Firestore: /usage_statistics/     # Usage Analytics
```

---

## 🎨 Gallery & Media

### Gallery Management
```
apps/web/src/app/dashboard/gallery/
├── page.tsx                      # Gallery Management Dashboard
└── components/
    ├── MediaUpload.tsx           # File Upload Component
    ├── MediaGrid.tsx             # Media Grid Display
    ├── MediaCard.tsx             # Individual Media Cards
    └── MediaViewer.tsx           # Lightbox Media Viewer
```

### Public Gallery
```
apps/web/src/app/gallery/
├── page.tsx                      # Public Gallery Page
└── components/
    ├── GalleryHero.tsx           # Gallery Hero Section
    ├── MediaLightbox.tsx         # Public Media Lightbox
    └── GalleryFilters.tsx        # Category Filters
```

### Founders Gallery
```
apps/web/src/components/
├── FoundersGallery.tsx           # Founders-Only Gallery
└── SecureMediaViewer.tsx         # Secure Media Display
```

### Media Services
```
apps/web/src/services/
├── galleryService.ts             # Gallery CRUD Operations
├── fileStorageService.ts         # Firebase Storage Integration
└── mediaProcessingService.ts     # Image/Video Processing

apps/web/src/lib/
├── mediaUtils.ts                 # Media Utility Functions
└── imageOptimization.ts          # Image Processing Utils
```

### Database Collections
```
Firestore: /gallery_images/       # Media Metadata
Storage: /gallery/                # Media Files
Storage: /thumbnails/             # Video Thumbnails
```

---

## 🔐 Security & Compliance

### Security Dashboard
```
apps/web/src/app/dashboard/security/
├── page.tsx                      # Security Overview
└── components/
    ├── SecurityMetrics.tsx       # Security Monitoring
    ├── ComplianceReports.tsx     # Compliance Tracking
    ├── AuditLogs.tsx             # Security Audit Logs
    └── ThreatDetection.tsx       # Threat Monitoring
```

### Security Services
```
apps/web/src/services/
├── securityService.ts            # Security Operations
├── auditService.ts               # Audit Logging
└── complianceService.ts          # Compliance Monitoring

apps/web/src/lib/
├── security.ts                   # Security Utilities
├── encryption.ts                 # Data Encryption
└── validation.ts                 # Input Validation
```

### Configuration
```
firestore.rules                   # Database Security Rules
storage.rules                     # File Storage Security
firebase.json                     # CSP and Security Headers
```

---

## 🌐 Public Pages & Solutions

### Solution Pages
```
apps/web/src/app/solutions/
├── page.tsx                      # Solutions Overview
├── donors/page.tsx               # Donor Solutions
├── participants/page.tsx         # Participant Solutions
├── organizations/page.tsx        # Organization Solutions
└── government/page.tsx           # Government Solutions
```

### Public Information Pages
```
apps/web/src/app/
├── about/page.tsx                # About SHELTR
├── team/page.tsx                 # Team Page
├── impact/page.tsx               # Impact Stories
├── tokenomics/page.tsx           # Tokenomics Overview
├── contact/page.tsx              # Contact Information
├── privacy/page.tsx              # Privacy Policy
└── terms/page.tsx                # Terms of Service
```

### Specialized Pages
```
apps/web/src/app/
├── scan-give/page.tsx            # QR Code Donation System
├── donate/page.tsx               # Donation Page
├── shelters/page.tsx             # Shelter Directory
├── investor-relations/page.tsx   # Investor Information
└── model/page.tsx                # Business Model
```

### Portal System
```
apps/web/src/app/portal/
├── page.tsx                      # Portal Login
├── founders-only/page.tsx        # Founders Portal
└── investor-relations/page.tsx   # Investor Portal
```

---

## 🎨 UI Components & Layout

### Core Components
```
apps/web/src/components/
├── ui/                           # Shadcn UI Components
│   ├── button.tsx                # Button Component
│   ├── card.tsx                  # Card Component
│   ├── dialog.tsx                # Modal Component
│   └── ...                       # Other UI Components
├── layout/
│   ├── Header.tsx                # Main Header
│   ├── Sidebar.tsx               # Navigation Sidebar
│   ├── Footer.tsx                # Footer Component
│   └── Layout.tsx                # Main Layout Wrapper
└── common/
    ├── LoadingSpinner.tsx        # Loading States
    ├── ErrorBoundary.tsx         # Error Handling
    └── ConfirmDialog.tsx         # Confirmation Dialogs
```

### Styling
```
apps/web/src/
├── globals.css                   # Global Styles
└── components.json               # Shadcn Configuration
```

---

## ⚙️ Configuration & Deploy

### Deployment
```
deploy.sh                         # Main Deployment Script
cloudbuild.yaml                   # Google Cloud Build
firebase.json                     # Firebase Configuration
```

### Environment
```
.env.local                        # Local Environment Variables
apps/web/.env.production          # Production Config
apps/api/.env                     # Backend Environment
```

### Development Scripts
```
start-dev.sh                      # Start Development Server
stop-dev.sh                       # Stop Development Server
sync-macbook.sh                   # Sync Development Environment
```

---

## 📚 Documentation Hub

### Online Documentation
```
apps/web/src/app/docs/
├── page.tsx                      # Documentation Hub
├── roadmap/page.tsx              # Development Roadmap
├── whitepaper/page.tsx           # Technical Whitepaper
├── blockchain/page.tsx           # Blockchain Architecture
├── payment-rails/page.tsx        # Payment Architecture
├── system-design/page.tsx        # System Design
├── hacking-homelessness/page.tsx # Theory of Change
├── functionality-matrix/page.tsx # Feature Matrix
├── mcp-integration/page.tsx      # MCP Integration Guide
├── chatbot-architecture/page.tsx # AI Chatbot Architecture
└── user-guides/                  # User Documentation
    ├── donor-guide/page.tsx      # Donor Guide
    ├── participant-guide/page.tsx # Participant Guide
    └── shelter-admin-guide/page.tsx # Shelter Admin Guide
```

### Documentation Source Files
```
docs/
├── 01-overview/                  # Project Overview
│   ├── hacking_homelessness.md  # Theory of Change Document
│   └── README.md                 # Overview Index
├── 02-architecture/              # System Architecture
│   ├── system-design.md          # System Design Document
│   ├── whitepaper_final.md       # Technical Whitepaper
│   ├── website-architecture.md   # Website Architecture
│   ├── PROJECT-TREE.md           # This Document
│   ├── payment-rails/            # Payment Architecture
│   ├── tokenomics/               # Tokenomics Documentation
│   ├── technical/                # Technical Specifications
│   └── ecosystem/                # Ecosystem Documentation
├── 03-api/                       # API Documentation
├── 04-development/               # Development Guides
│   ├── dev-roadmap.md            # Development Roadmap
│   ├── COMPLETE-FUNCTIONALITY-MATRIX-UPDATED.md
│   ├── MCP-INTEGRATION-GUIDE.md  # MCP Integration
│   ├── CHATBOT-AGENT-ARCHITECTURE.md
│   └── development_archive/      # Archived Development Docs
├── 05-deployment/                # Deployment Guides
├── 06-user-guides/               # User Documentation
├── 07-reference/                 # Technical Reference
├── 08-integrations/              # Integration Guides
├── 09-migration/                 # Migration Documentation
└── 10-resources/                 # Additional Resources
```

### Secure Documentation
```
apps/web/src/app/secure-docs/
├── business-plan/page.tsx        # Secure Business Plan Viewer
└── components/
    ├── SecureDocumentViewer.tsx  # Secure Document Display
    └── DocumentEditor.tsx        # Secure Document Editor

Firestore: /founder_documents/    # Secure Founder Documents
Firestore: /platform_admin_documents/ # Admin Documents
```

### Project Files
```
README.md                         # Main Project README
CHANGELOG.md                      # Version History
CONTRIBUTING.md                   # Contribution Guidelines
LICENSE.md                        # License Information
SECURITY.md                       # Security Policy
```

---

## 🔧 Development Tools

### Scripts
```
scripts/
├── analyze-firestore.js          # Database Analysis
├── bulk-docs-uploader.py         # Document Upload
├── create-super-admin.js         # Admin User Creation
├── initialize-chatbot-agents.js  # Chatbot Setup
├── migrate-database.js           # Database Migration
└── setup-test-users.js           # Test Data Creation
```

### Backend Scripts
```
apps/api/scripts/
├── check_profile_pictures.py     # Profile Picture Audit
├── check_specific_avatar.py      # Avatar Debugging
└── database_management.py        # Database Utilities
```

### Development Tools
```
.gitignore                        # Git Ignore Rules
.gitmodules                       # Git Submodules
sheltr-ai.code-workspace          # VS Code Workspace
```

---

## ⛓️ Blockchain & Smart Contracts

### Smart Contract Architecture
```
sheltr-tokens/
├── src/                          # Smart Contract Source
│   ├── SHELTRPaymentDistributor.sol # Payment Distribution
│   ├── SHELTRStablecoin.sol      # SHELTR Stablecoin Token
│   ├── AdyenPayoutIntegration.sol # Adyen Integration
│   ├── CoinbaseStakingIntegration.sol # Coinbase Staking
│   └── interfaces/               # Contract Interfaces
├── script/                       # Deployment Scripts
│   ├── DeployPaymentDistributor.s.sol
│   ├── DeployStablecoin.s.sol
│   └── DeployIntegrations.s.sol
├── test/                         # Contract Tests
└── docs/                         # Blockchain Documentation
    ├── README.md                 # Smart Contract Overview
    ├── SHELTR-TOKENOMICS-STRATEGY.md
    └── TECHNICAL-IMPLEMENTATION-GUIDE.md
```

### Blockchain Integration
```
apps/web/src/services/
├── blockchainService.ts          # Blockchain Integration
├── coinbaseService.ts            # Coinbase Base Integration
└── contractService.ts            # Smart Contract Interaction

apps/web/src/lib/
├── web3Utils.ts                  # Web3 Utilities
└── contractABI.ts                # Contract ABI Definitions
```

### Configuration
```
foundry.toml                      # Foundry Configuration
foundry.lock                      # Dependency Lock File
lib/                              # OpenZeppelin Dependencies
```

---

## 🏷️ Quick Reference Tags

**Need to work on Knowledge Base?** → Look at:
- `apps/web/src/app/dashboard/knowledge/`
- `apps/web/src/services/knowledgeService.ts`
- `apps/api/scripts/kb-*`

**Need to work on Chat System?** → Look at:
- `apps/web/src/app/dashboard/chatbots/`
- `apps/web/src/services/chatService.ts`
- `apps/web/src/lib/aiPrompts.ts`

**Need to work on Messaging & Notifications?** → Look at:
- `apps/web/src/app/dashboard/messages/`
- `apps/web/src/app/dashboard/notifications/`
- `apps/web/src/services/messageService.ts`
- `apps/web/src/services/notificationService.ts`

**Need to work on Gallery & Media?** → Look at:
- `apps/web/src/app/dashboard/gallery/`
- `apps/web/src/app/gallery/`
- `apps/web/src/services/galleryService.ts`
- `apps/web/src/components/FoundersGallery.tsx`

**Need to work on User Management & Auth?** → Look at:
- `apps/web/src/app/dashboard/users/`
- `apps/web/src/services/userService.ts`
- `apps/web/src/components/auth/`
- `apps/web/src/contexts/AuthContext.tsx`

**Need to work on Documentation?** → Look at:
- `apps/web/src/app/docs/`
- `docs/` (source files)
- `apps/web/src/app/secure-docs/`

**Need to work on Public Pages?** → Look at:
- `apps/web/src/app/solutions/`
- `apps/web/src/app/about/`, `apps/web/src/app/team/`
- `apps/web/src/app/portal/`

**Need to work on Blockchain?** → Look at:
- `sheltr-tokens/src/`
- `apps/web/src/services/blockchainService.ts`
- `apps/web/src/services/coinbaseService.ts`

**Need to work on Security?** → Look at:
- `firestore.rules`, `storage.rules`
- `apps/web/src/app/dashboard/security/`
- `apps/web/src/services/securityService.ts`
- `apps/web/src/components/auth/NDAModal.tsx`

---

*🌳 Tree generated by: `./scripts/generate-project-tree.sh`*
*📅 Keep this reference updated by running the script regularly!*
