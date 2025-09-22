# 🌳 SHELTR Project Tree Reference

*Generated on: Sun Sep 21 21:15:37 EDT 2025*
*Last Updated: 2025-09-21*

## 📋 Quick Navigation

- [🏗️ Architecture Overview](#️-architecture-overview)
- [🧠 Knowledge Base System](#-knowledge-base-system)
- [💬 Chat & AI System](#-chat--ai-system)
- [🔔 Notifications System](#-notifications-system)
- [👥 User Management](#-user-management)
- [🏠 Shelter Management](#-shelter-management)
- [💰 Financial & Payments](#-financial--payments)
- [📊 Analytics & Reporting](#-analytics--reporting)
- [🔐 Security & Auth](#-security--auth)
- [🎨 UI Components](#-ui-components)
- [⚙️ Configuration & Deploy](#️-configuration--deploy)
- [📚 Documentation](#-documentation)
- [🔧 Development Tools](#-development-tools)

---

## 🏗️ Architecture Overview

### Core Applications
```
apps/
├── web/                          # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                  # App Router Pages
│   │   ├── components/           # React Components
│   │   ├── lib/                  # Utility Libraries
│   │   └── services/             # API Services
│   ├── public/                   # Static Assets
│   └── package.json              # Frontend Dependencies
├── api/                          # Python Backend API
│   ├── scripts/                  # Database Scripts
│   ├── requirements.txt          # Python Dependencies
│   └── service-account-key.json  # Firebase Service Account
└── images/                       # Brand Assets & Icons
```

### Key Configuration Files
```
firebase.json                     # Firebase Hosting & CSP Config
firestore.rules                   # Database Security Rules
storage.rules                     # File Storage Security
cloudbuild.yaml                   # Google Cloud Build Config
deploy.sh                         # Deployment Script
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

## 🔔 Notifications System

### Notification Components
```
apps/web/src/components/
├── NotificationCenter.tsx        # Main Notification Hub
├── NotificationBell.tsx          # Header Notification Icon
├── NotificationCard.tsx          # Individual Notification
└── NotificationSettings.tsx      # User Preferences
```

### Notification Services
```
apps/web/src/services/
├── notificationService.ts        # Notification CRUD
├── pushNotificationService.ts    # Browser Push Notifications
└── emailNotificationService.ts   # Email Integration
```

### Types & Utils
```
apps/web/src/lib/
├── notificationTypes.ts          # Notification Type Definitions
└── notificationUtils.ts          # Utility Functions
```

### Database Collections
```
Firestore: /notifications/        # User Notifications
Firestore: /notification_settings/ # User Preferences
```

---

## 👥 User Management

### User Interface
```
apps/web/src/app/dashboard/users/
├── page.tsx                      # User Management Dashboard
└── components/
    ├── UserTable.tsx             # User Listing
    ├── UserProfile.tsx           # Profile Management
    ├── RoleManager.tsx           # Role Assignment
    └── UserMap.tsx               # Geographic User View
```

### Authentication
```
apps/web/src/app/(auth)/
├── login/page.tsx                # Login Page
├── register/page.tsx             # Registration
└── components/
    ├── AuthForm.tsx              # Auth Forms
    └── GoogleAuthButton.tsx      # OAuth Integration
```

### User Services
```
apps/web/src/services/
├── authService.ts                # Authentication Logic
├── userService.ts                # User CRUD Operations
└── roleService.ts                # Role Management

apps/web/src/lib/
├── auth.ts                       # Auth Utilities
└── userValidation.ts             # Form Validation
```

### Database Collections
```
Firestore: /users/                # User Profiles
Firestore: /user_roles/           # Role Assignments
Firestore: /user_sessions/        # Session Management
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

## 🔐 Security & Auth

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

## 🎨 UI Components

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

## 📚 Documentation

### Main Documentation
```
docs/
├── 01-overview/                  # Project Overview
├── 02-architecture/              # System Architecture
├── 03-api/                       # API Documentation
├── 04-development/               # Development Guides
│   ├── SESSION-13-BUSINESS-LOGIC-TESTING.md
│   ├── SESSION-13-1-SUPER-ADMIN-TESTING.md
│   ├── SESSION-13-2-SHELTER-ADMIN-TESTING.md
│   ├── SESSION-13-3-PARTICIPANT-TESTING.md
│   └── SESSION-13-4-DONOR-TESTING.md
├── 05-deployment/                # Deployment Guides
├── 06-user-guides/               # User Documentation
└── 07-reference/                 # Technical Reference
```

### Project Files
```
README.md                         # Main Project README
CHANGELOG.md                      # Version History
CONTRIBUTING.md                   # Contribution Guidelines
LICENSE.md                        # License Information
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

## 🏷️ Quick Reference Tags

**Need to work on Knowledge Base?** → Look at:
- `apps/web/src/app/dashboard/knowledge/`
- `apps/web/src/services/knowledgeService.ts`
- `apps/api/scripts/kb-*`

**Need to work on Chat System?** → Look at:
- `apps/web/src/app/dashboard/chatbots/`
- `apps/web/src/services/chatService.ts`
- `apps/web/src/lib/aiPrompts.ts`

**Need to work on Notifications?** → Look at:
- `apps/web/src/components/NotificationCenter.tsx`
- `apps/web/src/services/notificationService.ts`

**Need to work on User Management?** → Look at:
- `apps/web/src/app/dashboard/users/`
- `apps/web/src/services/userService.ts`
- `apps/web/src/app/(auth)/`

**Need to work on Security?** → Look at:
- `firestore.rules`, `storage.rules`
- `apps/web/src/app/dashboard/security/`
- `apps/web/src/services/securityService.ts`

---

*🌳 Tree generated by: `./scripts/generate-project-tree.sh`*
*📅 Keep this reference updated by running the script regularly!*
