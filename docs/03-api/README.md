# 🔌 SHELTR API Documentation - Current Implementation & Status

**FastAPI Backend for Shelter Management Platform**

*Base URL: `http://localhost:8000` (Development) | `https://sheltr-api-714964620823.us-central1.run.app` (Production)*  
*Authentication: Firebase ID tokens* ✅ **OPERATIONAL**  
*Current Version: 2.16.0*  
*Live Frontend: https://sheltr-ai.web.app* ✅ **AUTHENTICATION ACTIVE**

**🎯 Last Updated**: August 29, 2025  
**📊 Current Status**: Production-ready multi-tenant platform with real data connectivity  
**🔗 Data Integration**: Fully operational with comprehensive dashboard integration  
**✅ Platform Status**: Multi-tenant architecture complete, ready for beta launch  

---

## 🎉 Recent Major Achievements (Sessions 13.1-13.2)

### **🏗️ MULTI-TENANT PLATFORM TRANSFORMATION COMPLETE**
- **✅ Multi-Tenant Architecture**: Successfully migrated from single-tenant to true multi-tenant platform with 10 shelter tenants
- **✅ Real Data Connectivity Revolution**: Transformed all Super Admin dashboards from mock data to live multi-tenant Firestore integration
- **✅ Financial Oversight with Interactive Charts**: Beautiful SmartFund analytics with transaction volume & frequency visualization
- **✅ Michael Rodriguez Demo Integration**: Complete participant profile with $267 real donation tracking across Old Brewery Mission
- **✅ Tenant Service Architecture**: Production-ready `tenantService.ts` for multi-tenant operations and data isolation

### **🧭 USER-AWARENESS NAVIGATION REVOLUTION**
- **✅ Intelligent Role-Based Routing**: Complete implementation across all 6 major public pages
- **✅ Professional Branding**: SHELTR wordmark integration enhancing brand recognition
- **✅ Seamless User Experience**: Welcome messages and dashboard links for logged-in users
- **✅ Mobile-First Navigation**: Consistent user-awareness pattern across desktop and mobile interfaces
- **✅ Production-Ready UX**: Professional user experience ready for beta launch

---

## 🚀 Quick Start

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

## 🏗️ Data Architecture (Current Implementation)

### **Production-Ready Multi-Tenant Database Structure**

Our API connects to the **fully operational multi-tenant Firestore structure**:

```
/shelters/{shelter-id}           ← Root-level shelter collection (✅ 10 Montreal shelters)
/users/{user-id}                 ← Universal user management (✅ Multi-tenant ready)
/services/{service-id}           ← Service management (✅ Shelter-specific)
/demo_donations/{donation-id}     ← Real donation tracking (✅ $1,534 total platform)
/tenants/{tenant-id}             ← Multi-tenant structure (✅ 10 shelter tenants)
/demo_participants/{participant-id} ← Participant profiles (✅ Michael Rodriguez active)
/newsletter_signups/{signup-id}   ← Newsletter management (✅ Real data)
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

---

## 🎯 Four-Role System (Fully Operational)

### Role-Based Access Control ✅ **LIVE & TESTED**

| Role | Access Level | Current Status | Test Account |
|------|--------------|----------------|--------------|
| **Super Admin** | Platform-wide access | ✅ **Joel's Dashboard Active** | `joel.yaffe@gmail.com` |
| **Shelter Admin** | Shelter-specific data | ✅ **Old Brewery Mission Active** | `shelteradmin@example.com` |
| **Participant** | Personal profile + shelter data | ✅ **Real Shelter Association** | `participant@example.com` |
| **Donor** | Donation tracking | ✅ **Ready for Session 14** | `donor@example.com` |

---

## 📚 API Endpoints (Current Implementation)

### 🔐 Authentication (`/auth`)
**Router**: `routers/auth.py` - User registration, login, and role management

- `POST /auth/register` - Register new user with role-based tenant assignment
- `POST /auth/login` - User authentication with Firebase ID tokens
- `GET /auth/profile` - Get current user profile (requires auth)
- `PUT /auth/profile` - Update user profile (requires auth)
- `GET /auth/users` - List users (admin/super_admin only)
- `PUT /auth/role/{user_id}` - Update user role (super_admin only)
- `DELETE /auth/user/{user_id}` - Delete user (super_admin only)

### 📊 Analytics (`/analytics`)
**Router**: `routers/analytics.py` - Platform and shelter analytics

- `GET /analytics/platform` - Platform-wide metrics (super_admin only)
- `GET /analytics/shelter/{shelter_id}` - Shelter-specific analytics (admin access)
- `GET /analytics/user/{user_id}` - User activity analytics
- `POST /analytics/report` - Generate custom analytics report

### 💬 Chatbot (`/chatbot`)
**Router**: `routers/chatbot.py` - AI-powered chat assistance

- `POST /chatbot/message` - Send message to chatbot
- `GET /chatbot/history/{user_id}` - Get chat history
- `DELETE /chatbot/history/{user_id}` - Clear chat history

### 🛠️ Services (`/services`)
**Router**: `routers/services.py` - Shelter service management

- `GET /services/` - List services (filtered by user's shelter)
- `POST /services/` - Create new service (admin access)
- `GET /services/{service_id}` - Get service details
- `PUT /services/{service_id}` - Update service (admin access)
- `DELETE /services/{service_id}` - Delete service (admin access)

### 👥 Users (`/users`)
**Router**: `routers/users.py` - User profile and management

- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update current user profile
- `GET /users/{user_id}` - Get specific user profile (admin access)
- `PUT /users/{user_id}` - Update specific user profile (admin access)

### 🎭 Demo Donations (`/demo/donations`)
**Router**: `routers/demo_donations.py` - Adyen-powered QR donation demo

- `GET /demo/donations/` - List all demo donations
- `GET /demo/donations/participant/{participant_id}` - Get demo participant info
- `POST /demo/donations/payment-session` - Create Adyen payment session
- `POST /demo/donations/simulate-success/{donation_id}` - Simulate successful payment
- `POST /demo/donations/webhook` - Adyen webhook handler
- `GET /demo/donations/stats/{participant_id}` - Get demo participant statistics

### 📚 Knowledge Base (`/knowledge`)
**Router**: `routers/knowledge.py` - Document management for Super Admins

- `GET /knowledge/` - List all knowledge base documents
- `POST /knowledge/upload` - Upload new document
- `GET /knowledge/{document_id}` - Get document details
- `PUT /knowledge/{document_id}` - Update document
- `DELETE /knowledge/{document_id}` - Delete document
- `GET /knowledge/status` - Get knowledge base status

---

## 🔒 Authentication & Security (Current Implementation)

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

### Middleware Stack

```python
# Performance monitoring
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    # Adds X-Process-Time header
    # Logs slow requests (>1.0s)

# Global exception handling
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    # Standardized error responses
```

---

## 🏥 Health & Status (Current Implementation)

### Root Health Check

```http
GET /
```

```json
{
  "success": true,
  "message": "SHELTR-AI API is running",
  "version": "2.16.0",
  "status": "healthy",
  "services": {
    "authentication": "✅ operational",
    "database": "✅ multi-tenant ready", 
    "multi_tenant": "✅ operational"
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
  "version": "2.16.0",
  "environment": "production",
  "services": {
    "api": "✅ operational",
    "firebase_auth": "✅ operational",
    "firestore": "✅ multi-tenant ready",
    "storage": "✅ organized"
  },
  "metrics": {
    "uptime": 1691827200.0,
    "memory_usage": "unknown",
    "response_time": "< 50ms"
  }
}
```

### Interactive API Documentation

```http
GET /docs
```

**Live Swagger UI** with SHELTR-AI branding at `https://sheltr-api-714964620823.us-central1.run.app/docs`

### OpenAPI Schema

```http
GET /openapi.json
```

Complete OpenAPI 3.0 specification for all endpoints.

---

## 📝 Request/Response Examples (Real Implementation)

### User Registration

```http
POST /auth/register
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "participant",
  "shelter_id": "old-brewery-mission"
}
```

```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "user_uuid_789",
      "email": "newuser@example.com",
      "role": "participant",
      "shelter_id": "old-brewery-mission",
      "tenant_id": "shelter-old-brewery-mission"
    },
    "custom_claims": {
      "role": "participant",
      "shelter_id": "old-brewery-mission",
      "tenant_id": "shelter-old-brewery-mission"
    }
  },
  "message": "User registered successfully"
}
```

### Get User Profile

```http
GET /auth/profile
Authorization: Bearer <firebase-id-token>
```

```json
{
  "success": true,
  "data": {
    "uid": "user_uuid_123",
    "email": "shelteradmin@example.com",
    "first_name": "Admin",
    "last_name": "User", 
    "role": "admin",
    "shelter_id": "old-brewery-mission",
    "tenant_id": "shelter-old-brewery-mission",
    "status": "active",
    "created_at": "2025-08-09T...",
    "last_active": "2025-08-09T..."
  }
}
```

### Demo Donation (Adyen Integration)

```http
POST /demo/donations/payment-session
Content-Type: application/json

{
  "participant_id": "demo-participant-001",
  "amount": 25.0,
  "donor_info": {
    "name": "Anonymous Donor"
  }
}
```

```json
{
  "success": true,
  "data": {
    "session_id": "CS_123456789",
    "session_data": "eyJjb3VudHJ5Q29kZSI6IkNBIiw...",
    "payment_id": "payment_uuid_456",
    "participant": {
      "id": "demo-participant-001",
      "name": "Michael Rodriguez",
      "story": "Dedicated community member working towards housing stability",
      "progress": {
        "housing": 68,
        "employment": 55,
        "financial_stability": 42
      }
    }
  }
}
```

### Simulate Successful Payment

```http
POST /demo/donations/simulate-success/{donation_id}
Content-Type: application/json

{
  "status": "completed",
  "amount": 100.00
}
```

```json
{
  "success": true,
  "data": {
    "donation_id": "donation_uuid_123",
    "status": "completed",
    "participant_updated": true,
    "wallet_updated": true
  },
  "message": "Payment simulation completed successfully"
}
```

---

## 🚨 Error Handling (Current Implementation)

### Standard Error Response

```json
{
  "success": false,
  "error": "HTTPException",
  "message": "User not found or access denied",
  "status_code": 404
}
```

### Global Exception Handling

```python
# HTTP exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": "HTTPException", 
            "message": exc.detail,
            "status_code": exc.status_code
        }
    )

# Internal server errors
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "InternalServerError",
            "message": "An internal server error occurred",
            "status_code": 500
        }
    )
```

### Common Error Scenarios

| Error | HTTP Status | Description | Example |
|-------|-------------|-------------|---------|
| **Authentication Failed** | 401 | Invalid Firebase ID token | Missing or expired token |
| **Authorization Failed** | 403 | Insufficient role permissions | Participant trying to access admin endpoint |
| **Resource Not Found** | 404 | Requested resource doesn't exist | User profile not found |
| **Validation Error** | 422 | Invalid request data | Missing required fields |
| **Service Unavailable** | 503 | External service down | Adyen service not configured |

---

## 🚀 Development & Deployment

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

# Optional (Adyen demo)
ADYEN_API_KEY=your_adyen_key
ADYEN_MERCHANT_ACCOUNT=your_merchant_account
```

### Production Deployment

- **Backend**: FastAPI on Google Cloud Run (Containerized)
- **Database**: Firebase Firestore with multi-tenant architecture
- **Authentication**: Firebase Auth with custom claims
- **Frontend Integration**: CORS-enabled for https://sheltr-ai.web.app
- **Container Registry**: Google Container Registry (gcr.io/sheltr-ai/sheltr-api)
- **Auto-scaling**: 0-10 instances based on demand

---

## 📊 Current Implementation Status

### ✅ **Completed (Sessions 13.1-13.2)**
- **Multi-Tenant Architecture**: Complete with 10 shelter tenants and data isolation
- **Real Data Connectivity**: All Super Admin dashboards connected to live Firestore data
- **Financial Analytics**: Complete SmartFund tracking with $76.7 platform revenue
- **Michael Rodriguez Demo**: Fully integrated participant profile with $267 real donations
- **User-Awareness Navigation**: Complete implementation across all 6 major public pages
- **Professional Branding**: SHELTR wordmark integration enhancing brand recognition
- **Production Deployment**: Google Cloud Run containerized deployment
- **Security Improvements**: All CodeQL security warnings resolved
- **Dependabot Updates**: 24 pull requests reviewed and ready for merge

### 🎯 **Current Priorities (Session 14+)**
- **Beta Launch Preparation**: Final testing and validation for public beta
- **Advanced Analytics**: Enhanced reporting and business intelligence features
- **Mobile App Development**: Native iOS and Android applications
- **Blockchain Integration**: Smart contract deployment and token distribution
- **International Expansion**: Multi-language support and global deployment

### 📋 **Platform Readiness Metrics**
- **Multi-Tenant Operations**: 100% functional with 10 shelter tenants
- **Real Data Integration**: 100% of Super Admin dashboards connected
- **User Experience**: Professional navigation and branding complete
- **Security**: All critical vulnerabilities resolved
- **Performance**: Optimized queries and efficient data loading

---

## 🛠️ Tools & Resources

### Development Tools
- **Interactive API Docs**: `https://sheltr-api-714964620823.us-central1.run.app/docs` (Swagger UI)
- **OpenAPI Schema**: `https://sheltr-api-714964620823.us-central1.run.app/openapi.json`
- **Health Monitoring**: `https://sheltr-api-714964620823.us-central1.run.app/health`

### Frontend Integration
- **CORS Configured**: For Next.js development and production
- **Performance Monitoring**: Request timing headers
- **Error Handling**: Standardized error responses
- **Authentication**: Firebase ID token validation

### Testing & Validation
- **Role-Based Testing**: 4 test accounts for each user role
- **Real Data**: Connected to multi-tenant database structure
- **Production Ready**: Deployed and operational backend

### Multi-Tenant Architecture
- **TenantService**: Complete `tenantService.ts` for cross-tenant operations
- **Data Isolation**: Proper shelter-specific data access controls
- **Scalable Infrastructure**: Ready for unlimited shelter onboarding
- **Security Rules**: Comprehensive Firestore security with RBAC

---

## 🚀 Session 14+ Roadmap

### **Phase 1: Beta Launch Preparation**
- **Final Testing**: Comprehensive role-based testing across all user types
- **Performance Optimization**: Advanced caching and query optimization
- **Security Audit**: Final security review and penetration testing
- **Documentation**: Complete user guides and API documentation

### **Phase 2: Advanced Features**
- **Mobile Applications**: Native iOS and Android app development
- **Blockchain Integration**: Smart contract deployment and token distribution
- **AI Enhancement**: Advanced analytics and predictive modeling
- **International Support**: Multi-language and multi-currency support

### **Phase 3: Enterprise Features**
- **White-Label Platform**: Licensing system for other organizations
- **Advanced Analytics**: Business intelligence and reporting tools
- **API Marketplace**: Third-party integrations and partnerships
- **Global Deployment**: International expansion and localization

---

**This FastAPI backend powers the SHELTR-AI multi-tenant platform and is ready for beta launch with comprehensive real data connectivity and professional user experience.** 🚀✨ 