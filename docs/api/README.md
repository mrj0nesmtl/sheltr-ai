# 🔌 API Documentation - Current Implementation & Status

**FastAPI Backend for SHELTR Platform**

*Base URL: `http://localhost:8000` (Development) | `https://sheltr-api-714964620823.us-central1.run.app` (Production)*  
*Authentication: Firebase ID tokens* ✅ **OPERATIONAL**  
*Current Version: 2.53.3*  
*Live Frontend: https://sheltr-ai.web.app* ✅ **AUTHENTICATION ACTIVE**

**🎯 Last Updated**: October 16, 2025  
**📊 Current Status**: Production-ready multi-tenant platform with AI agent system  
**🔗 Data Integration**: Fully operational with comprehensive dashboard integration  
**✅ Platform Status**: Multi-tenant architecture complete, AI systems operational

---

## 🎉 **Recent Major Achievements (v2.53.x)**

### **🤖 AI AGENT SYSTEM COMPLETE**
- **✅ Multi-Agent Chatbot**: 5 specialized agents with distinct personalities
- **✅ Knowledge Base**: 107 documents, 1,059 chunks, 209,212 words indexed
- **✅ RAG Integration**: Semantic search with OpenAI embeddings (1536 dims)
- **✅ FAQ System**: 86 FAQs with <1s response time
- **✅ MCP Tools**: Authenticated users can execute platform actions
- **✅ Production Ready**: Deployed and operational

### **📚 KNOWLEDGE BASE REVOLUTION**
- **✅ GitHub Sync**: Real-time synchronization with progress tracking
- **✅ Auto-Embeddings**: Automatic regeneration on document updates
- **✅ Quality Scoring**: 100/100 optimization for all documents
- **✅ Clear KB Access**: Super Admin-only database clearing
- **✅ Comprehensive Docs**: Complete edit/delete flow documentation

### **🏗️ MULTI-TENANT PLATFORM**
- **✅ 10 Shelter Tenants**: Montreal shelters with data isolation
- **✅ Real Data**: $1,534 total donations, $76.7 platform revenue
- **✅ Michael Rodriguez**: Demo participant with $267 real donations
- **✅ Tenant Service**: Production-ready multi-tenant operations

---

## 🚀 **Quick Start**

### Authentication

All API requests require Firebase ID token authentication:

```bash
# Example authenticated request
curl -X GET \
  'https://sheltr-api-714964620823.us-central1.run.app/auth/profile' \
  -H 'Authorization: Bearer <firebase-id-token>' \
  -H 'Content-Type: application/json'
```

### Standard API Response Format

```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation completed successfully",
  "timestamp": 1691827200.0
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "HTTPException",
  "message": "Detailed error message",
  "status_code": 400
}
```

---

## 🏗️ **Data Architecture (Current Implementation)**

### **Production-Ready Multi-Tenant Database Structure**

Our API connects to the **fully operational multi-tenant Firestore structure**:

```
/shelters/{shelter-id}              ← Root-level shelter collection (✅ 10 Montreal shelters)
/users/{user-id}                    ← Universal user management (✅ Multi-tenant ready)
/services/{service-id}              ← Service management (✅ Shelter-specific)
/demo_donations/{donation-id}       ← Real donation tracking (✅ $1,534 total platform)
/tenants/{tenant-id}                ← Multi-tenant structure (✅ 10 shelter tenants)
/demo_participants/{participant-id} ← Participant profiles (✅ Michael Rodriguez active)
/newsletter_signups/{signup-id}     ← Newsletter management (✅ Real data)
/knowledge_documents/{document-id}  ← Knowledge base docs (✅ 107 documents)
/knowledge_chunks/{chunk-id}        ← Embeddings for RAG (✅ 1,059 chunks)
/chat_sessions/{session-id}         ← Dashboard chat sessions (✅ Persistent)
/chat_messages/{message-id}         ← Chat message history (✅ Stored)
```

### **User-Shelter Associations (Operational)**

Data isolation is achieved through **user-shelter linking**:
- `shelter_id`: Links users to specific shelters ("old-brewery-mission")
- `tenant_id`: Provides tenant isolation ("shelter-old-brewery-mission")
- `role`: Determines access level ("super_admin", "admin", "participant", "donor")

### **Real Data Metrics (Live)**
- **Total Donations**: $1,534 (real platform metrics)
- **Platform Revenue**: $76.7 (5% platform fees)
- **Active Shelters**: 10 Montreal shelters
- **User Count**: 9 users, 1 participant, 6 admins
- **Demo Participant**: Michael Rodriguez with $267 real donations
- **Knowledge Base**: 107 documents, 1,059 chunks, 209,212 words

---

## 🎯 **Four-Role System (Fully Operational)**

### Role-Based Access Control ✅ **LIVE & TESTED**

| Role | Access Level | Current Status | Test Account |
|------|--------------|----------------|--------------|
| **Super Admin** | Platform-wide access + AI tools | ✅ **Joel's Dashboard Active** | `joel.yaffe@gmail.com` |
| **Platform Admin** | Multi-tenant management | ✅ **Analytics & Reports** | `platformadmin@example.com` |
| **Shelter Admin** | Shelter-specific data | ✅ **Old Brewery Mission Active** | `shelteradmin@example.com` |
| **Participant** | Personal profile + shelter data | ✅ **Real Shelter Association** | `participant@example.com` |
| **Donor** | Donation tracking | ✅ **Ready for Testing** | `donor@example.com` |

---

## 📚 **API Endpoints (Current Implementation)**

### 🔐 **Authentication** (`/auth`)
**Router**: `routers/auth.py` - User registration, login, and role management

- `POST /auth/register` - Register new user with role-based tenant assignment
- `POST /auth/login` - User authentication with Firebase ID tokens
- `GET /auth/profile` - Get current user profile (requires auth)
- `PUT /auth/profile` - Update user profile (requires auth)
- `GET /auth/users` - List users (admin/super_admin only)
- `PUT /auth/role/{user_id}` - Update user role (super_admin only)
- `DELETE /auth/user/{user_id}` - Delete user (super_admin only)

---

### 📊 **Analytics** (`/analytics`)
**Router**: `routers/analytics.py` - Platform and shelter analytics

- `GET /analytics/platform` - Platform-wide metrics (super_admin only)
- `GET /analytics/shelter/{shelter_id}` - Shelter-specific analytics (admin access)
- `GET /analytics/user/{user_id}` - User activity analytics
- `POST /analytics/report` - Generate custom analytics report

---

### 🤖 **Chatbot Systems** (Multiple Routers)

#### **Public Chatbot** (`/chatbot/public`)
**Router**: `routers/public_chatbot.py` - Anonymous public chatbot

- `POST /chatbot/public` - Send message to public chatbot
- `GET /chatbot/health` - Chatbot system health check

**Features:**
- FAQ-first strategy (86 FAQs, <1s response)
- Intent classification (emergency, information, action, support)
- Role detection (participant, donor, admin, public)
- Rate limiting (10 req/hour per IP)

---

#### **Authenticated Chatbot** (`/chatbot/authenticated`)
**Router**: `routers/authenticated_chatbot.py` - Logged-in user chatbot

- `POST /chatbot/authenticated` - Send message to authenticated chatbot

**Features:**
- Full knowledge base access (107 documents)
- MCP tool integration (analytics, queries, notifications)
- Role-based responses (super_admin, platform_admin, admin)
- Enhanced RAG (10 results vs 5 for public)
- Rate limiting (100 req/hour per user, 500 for super_admin)

---

#### **Chatbot Dashboard** (`/chatbot-dashboard`)
**Router**: `routers/chatbot_dashboard.py` - Agent management and chat sessions

- `GET /chatbot-dashboard/agents` - List available agents
- `GET /chatbot-dashboard/sessions` - Get user's chat sessions
- `POST /chatbot-dashboard/sessions` - Create new chat session
- `GET /chatbot-dashboard/sessions/{session_id}` - Get session details
- `POST /chatbot-dashboard/sessions/{session_id}/send` - Send message in session
- `DELETE /chatbot-dashboard/sessions/{session_id}` - Delete chat session
- `GET /chatbot-dashboard/sessions/{session_id}/messages` - Get session messages
- `POST /chatbot-dashboard/agents` - Save agent configuration (super_admin)

**5 Specialized Agents:**
1. 🔵 **General Assistant** - General platform help
2. 🟢 **SHELTR Support** - Platform-specific expertise
3. 🟣 **Technical Expert** - Development & architecture
4. 🟠 **Business Analyst** - Strategy & analytics
5. 🩷 **Creative Writer** - Content & storytelling

---

### 📚 **Knowledge Base** (Multiple Routers)

#### **Knowledge Base** (`/knowledge`)
**Router**: `routers/knowledge.py` - Document management

- `GET /knowledge/` - List all knowledge base documents
- `POST /knowledge/upload` - Upload new document
- `GET /knowledge/{document_id}` - Get document details
- `PUT /knowledge/{document_id}` - Update document
- `DELETE /knowledge/{document_id}` - Delete document
- `GET /knowledge/status` - Get knowledge base status

---

#### **Knowledge Dashboard** (`/knowledge-dashboard`)
**Router**: `routers/knowledge_dashboard.py` - Advanced KB management (Super Admin)

- `GET /knowledge-dashboard/documents` - List all documents with stats
- `GET /knowledge-dashboard/documents/{document_id}` - Get document details
- `PUT /knowledge-dashboard/documents/{document_id}` - Update document
- `PUT /knowledge-dashboard/documents/{document_id}/upload` - Update from file
- `DELETE /knowledge-dashboard/documents/{document_id}` - Delete document
- `POST /knowledge-dashboard/scan-github-changes` - Scan GitHub for changes
- `POST /knowledge-dashboard/sync-github-files` - Sync files from GitHub
- `POST /knowledge-dashboard/clear-knowledge-base` - Clear all documents (super_admin)

**Features:**
- Real-time GitHub sync with progress tracking
- Automatic embedding regeneration
- Quality scoring (100/100 optimization)
- 107 documents, 1,059 chunks, 209,212 words
- Super Admin-only clear database function

---

### 🛠️ **Services** (`/services`)
**Router**: `routers/services.py` - Shelter service management

- `GET /services/` - List services (filtered by user's shelter)
- `POST /services/` - Create new service (admin access)
- `GET /services/{service_id}` - Get service details
- `PUT /services/{service_id}` - Update service (admin access)
- `DELETE /services/{service_id}` - Delete service (admin access)

---

### 👥 **Users** (`/users`)
**Router**: `routers/users.py` - User profile and management

- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update current user profile
- `GET /users/{user_id}` - Get specific user profile (admin access)
- `PUT /users/{user_id}` - Update specific user profile (admin access)

---

### 🎭 **Demo Donations** (`/demo/donations`)
**Router**: `routers/demo_donations.py` - Adyen-powered QR donation demo

- `GET /demo/donations/` - List all demo donations
- `GET /demo/donations/participant/{participant_id}` - Get demo participant info
- `POST /demo/donations/payment-session` - Create Adyen payment session
- `POST /demo/donations/simulate-success/{donation_id}` - Simulate successful payment
- `POST /demo/donations/webhook` - Adyen webhook handler
- `GET /demo/donations/stats/{participant_id}` - Get demo participant statistics

---

### 💰 **Donations** (`/donations`)
**Router**: `routers/donations.py` - Production donation system

- `POST /donations/` - Create new donation
- `GET /donations/` - List donations (filtered by role)
- `GET /donations/{donation_id}` - Get donation details
- `PUT /donations/{donation_id}` - Update donation status

---

### 📝 **Blog** (`/blog`)
**Router**: `routers/blog.py` - Blog post management

- `GET /blog/posts` - List blog posts
- `POST /blog/posts` - Create new blog post (admin)
- `GET /blog/posts/{post_id}` - Get blog post details
- `PUT /blog/posts/{post_id}` - Update blog post (admin)
- `DELETE /blog/posts/{post_id}` - Delete blog post (admin)

---

### 🔧 **MCP Tools** (`/mcp`)
**Router**: `routers/mcp.py` - Model Context Protocol tool execution

- `POST /mcp/execute` - Execute MCP tool (authenticated users)

**Available Tools:**
- `generate_impact_report` - Analytics generation (super_admin, platform_admin)
- `query_platform_data` - Firestore queries (super_admin, platform_admin, admin)
- `send_notification` - Send notifications (super_admin, platform_admin)
- `manage_user_account` - User management (super_admin only)

---

### 🔄 **Migration** (`/migration`)
**Router**: `routers/migration.py` - Data migration utilities

- `POST /migration/import` - Import data from external sources
- `GET /migration/status` - Get migration status

---

## 🔒 **Authentication & Security (Current Implementation)**

### Firebase ID Token Authentication ✅ **OPERATIONAL**

```bash
# Real authentication flow
curl -X GET 'https://sheltr-api-714964620823.us-central1.run.app/auth/profile' \
  -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...' \
  -H 'Content-Type: application/json'
```

### Custom Claims Structure (Real Implementation)

```json
{
  "uid": "user_uuid_123",
  "email": "shelteradmin@example.com",
  "role": "admin",
  "shelter_id": "old-brewery-mission",
  "tenant_id": "shelter-old-brewery-mission",
  "iat": 1691827200,
  "exp": 1691913600
}
```

**🎯 Live Examples**:
- **Joel**: `joel.yaffe@gmail.com` → `role: "super_admin"` (platform-wide access)
- **Shelter Admin**: `shelteradmin@example.com` → `role: "admin"`, `shelter_id: "old-brewery-mission"`
- **Participant**: `participant@example.com` → `role: "participant"`, `shelter_id: "old-brewery-mission"`

### CORS Configuration

```python
# Production CORS settings
allow_origins=[
    "http://localhost:3000",           # Next.js dev
    "https://sheltr-ai.web.app",      # Firebase hosting
    "https://api.sheltr.ai",          # Production API
],
```

---

## 🏥 **Health & Status (Current Implementation)**

### Root Health Check

```http
GET /
```

```json
{
  "success": true,
  "message": "SHELTR-AI API is running",
  "version": "2.53.3",
  "status": "healthy",
  "services": {
    "authentication": "✅ operational",
    "database": "✅ multi-tenant ready", 
    "multi_tenant": "✅ operational",
    "ai_agents": "✅ 5 agents active",
    "knowledge_base": "✅ 107 documents"
  }
}
```

### Detailed Health Check

```http
GET /health
```

```json
{
  "success": true,
  "timestamp": 1691827200.0,
  "status": "healthy",
  "version": "2.53.3",
  "environment": "production",
  "services": {
    "api": "✅ operational",
    "firebase_auth": "✅ operational",
    "firestore": "✅ multi-tenant ready",
    "storage": "✅ organized",
    "chatbot": "✅ 5 agents operational",
    "knowledge_base": "✅ 107 docs, 1,059 chunks"
  },
  "metrics": {
    "uptime": 1691827200.0,
    "memory_usage": "unknown",
    "response_time": "< 50ms"
  }
}
```

### Chatbot Health Check

```http
GET /chatbot/health
```

```json
{
  "status": "healthy",
  "public_endpoint": "operational",
  "authenticated_endpoint": "operational",
  "rag_available": true,
  "openai_service": "available",
  "services": {
    "orchestrator": "operational",
    "rag_orchestrator": "operational",
    "faq_service": "operational",
    "analytics": "operational"
  },
  "timestamp": 1691827200.0
}
```

### Interactive API Documentation

```http
GET /docs
```

**Live Swagger UI** with SHELTR-AI branding at `https://sheltr-api-714964620823.us-central1.run.app/docs`

---

## 📊 **Current Implementation Status**

### ✅ **Completed (v2.53.x)**
- **AI Agent System**: 5 specialized agents with distinct personalities
- **Knowledge Base**: 107 documents, 1,059 chunks, 209,212 words
- **RAG Integration**: Semantic search with OpenAI embeddings
- **FAQ System**: 86 FAQs with <1s response time
- **MCP Tools**: Authenticated tool execution
- **GitHub Sync**: Real-time documentation synchronization
- **Multi-Tenant Architecture**: 10 shelter tenants with data isolation
- **Real Data Connectivity**: All dashboards connected to live Firestore
- **Production Deployment**: Google Cloud Run containerized deployment
- **Security**: All CodeQL warnings resolved

### 🎯 **Current Priorities**
- **Beta Launch Preparation**: Final testing and validation
- **Advanced Analytics**: Enhanced reporting features
- **Mobile App Development**: Native iOS and Android apps
- **Blockchain Integration**: Smart contract deployment
- **International Expansion**: Multi-language support

### 📋 **Platform Readiness Metrics**
- **Multi-Tenant Operations**: 100% functional with 10 shelter tenants
- **AI Systems**: 95%+ accuracy with 5 specialized agents
- **Knowledge Base**: 107 documents with auto-sync
- **Real Data Integration**: 100% of dashboards connected
- **User Experience**: Professional navigation complete
- **Security**: All critical vulnerabilities resolved
- **Performance**: Optimized queries and efficient loading

---

## 🛠️ **Tools & Resources**

### Development Tools
- **Interactive API Docs**: `https://sheltr-api-714964620823.us-central1.run.app/docs` (Swagger UI)
- **OpenAPI Schema**: `https://sheltr-api-714964620823.us-central1.run.app/openapi.json`
- **Health Monitoring**: `https://sheltr-api-714964620823.us-central1.run.app/health`
- **Chatbot Health**: `https://sheltr-api-714964620823.us-central1.run.app/chatbot/health`

### Frontend Integration
- **CORS Configured**: For Next.js development and production
- **Performance Monitoring**: Request timing headers
- **Error Handling**: Standardized error responses
- **Authentication**: Firebase ID token validation

### Testing & Validation
- **Role-Based Testing**: 5 test accounts for each user role
- **Real Data**: Connected to multi-tenant database structure
- **Production Ready**: Deployed and operational backend
- **AI Testing**: 5 specialized agents with distinct personalities

---

## 🚀 **Development & Deployment**

### Local Development Setup

```bash
# 1. Start FastAPI development server
cd apps/api
python main.py

# 2. API available at
http://localhost:8000

# 3. Interactive docs at  
http://localhost:8000/docs

# 4. Health check
curl http://localhost:8000/health
```

### Environment Configuration

```python
# Required environment variables
FIREBASE_PROJECT_ID=sheltr-ai
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_service_account_email

# OpenAI (for AI agents)
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# GitHub (for knowledge base sync)
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=mrj0nesmtl
GITHUB_REPO=sheltr-ai
GITHUB_DOCS_PATH=docs

# Optional (Adyen demo)
ADYEN_API_KEY=your_adyen_key
ADYEN_MERCHANT_ACCOUNT=your_merchant_account
```

### Production Deployment

- **Backend**: FastAPI on Google Cloud Run (Containerized)
- **Database**: Firebase Firestore with multi-tenant architecture
- **Authentication**: Firebase Auth with custom claims
- **AI Services**: OpenAI GPT-4o-mini with embeddings
- **Knowledge Base**: Firebase Storage + Firestore with GitHub sync
- **Frontend Integration**: CORS-enabled for https://sheltr-ai.web.app
- **Container Registry**: Google Container Registry (gcr.io/sheltr-ai/sheltr-api)
- **Auto-scaling**: 0-10 instances based on demand

---

## 📚 **Related Documentation**

- [Development Guides](../04-development/README.md) - Development documentation
- [SHELTR Agent Architecture](../04-development/SHELTR-AGENT-ARCHITECTURE.md) - AI system guide
- [Knowledge Base Guide](../04-development/KNOWLEDGE-BASE-UPDATE-GUIDE.md) - KB management
- [MCP Integration](../04-development/MCP-INTEGRATION-GUIDE.md) - Tool execution
- [Architecture](../02-architecture/README.md) - System design & tokenomics
- [Deployment](../05-deployment/README.md) - Deployment guides

---

**This FastAPI backend powers the SHELTR multi-tenant platform with advanced AI agent systems, comprehensive knowledge base, and production-ready multi-tenant architecture.** 🚀✨

**Last Updated:** October 16, 2025  
**Version:** 2.53.3  
**Status:** ✅ Production Ready with AI Agents
