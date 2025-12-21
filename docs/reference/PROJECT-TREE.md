# 🌳 SHELTR Project Tree Reference

*Generated on: Sat Dec 20 20:46:28 EST 2025*
*Last Updated: 2025-12-20*

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
│   └── main.py                   # FastAPI Application Entry
└── functions/                    # Firebase Cloud Functions
    ├── src/                      # TypeScript Functions
    └── package.json              # Functions Dependencies
```


## 🧠 Knowledge Base System

Complete RAG system with AI embeddings and document management

```
Directory structure for apps/web/src/app/dashboard/knowledge
```


## 💬 Chat & AI System

Multi-agent chatbot system with MCP integration

```
Directory structure for apps/web/src/app/dashboard/chatbot
```


## 🔔 Messaging & Notifications

Internal messaging system with real-time notifications

```
Directory structure for apps/web/src/app/dashboard/messages
```


## 👥 User Management & Auth

User profiles, authentication, and role management

```
Directory structure for apps/web/src/app/dashboard/users
```


## 🏠 Shelter Management

Multi-tenant shelter administration

```
Directory structure for apps/web/src/app/dashboard/shelters
```


## 💰 Financial & Payments

Donation tracking and financial reporting

```
Directory structure for apps/web/src/app/dashboard/donations
```


## 📊 Analytics & Reporting

Real-time analytics and impact metrics

```
Directory structure for apps/web/src/app/dashboard/analytics
```


## 🎨 Gallery & Media

Image gallery management system

```
Directory structure for apps/web/src/app/dashboard/gallery
```


## 🔐 Security & Compliance

Backend API routes and security

```
Directory structure for apps/api/routers
```


## 🌐 Public Pages & Solutions

Public-facing pages and landing pages

```
Directory structure for apps/web/src/app/(public)
```


## 📚 Documentation Hub

Complete project documentation

```
Directory structure for docs
```


## ⚙️ Configuration & Deploy

Root configuration files

```
Directory structure for .
```


## 🔧 Development Tools

Utility scripts and tools

```
Directory structure for scripts
```


## ⛓️ Blockchain & Smart Contracts

Token contracts and blockchain integration

```
Directory structure for sheltr-tokens
```


---

## 📊 Project Statistics

- **TypeScript Files**: 19144
- **Python Files**: 25453
- **Documentation Files**: 220
- **Component Files**: 99
- **API Routes**: 18
- **Scripts**: 2041

---

## 🔄 Update Instructions

To regenerate this file, run:

```bash
./scripts/generate-project-tree.sh
```

**Note**: Requires `tree` command. Install with:
- macOS: `brew install tree`
- Linux: `sudo apt-get install tree`

---

*This file is auto-generated. Do not edit manually.*
*Last generated: Sat Dec 20 20:46:28 EST 2025*
