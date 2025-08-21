# 🔌 SHELTR API Documentation - Current Implementation

**FastAPI Backend for Shelter Management Platform**

*Base URL: `http://localhost:8000` (Development) | `https://sheltr-api-714964620823.us-central1.run.app` (Production)*  
*Authentication: Firebase ID tokens* ✅ **OPERATIONAL**  
*Current Version: 2.1.0*  
*Live Frontend: https://sheltr-ai.web.app* ✅ **AUTHENTICATION ACTIVE**

**🎯 Last Updated**: Current Session (December 2024)  
**📊 Current Status**: Production-ready with 6 operational routers  
**🔗 Data Integration**: Connected to clean Firestore structure  
**🚀 Deployment**: Google Cloud Run (Containerized)

---

## 🚀 Quick Start

### Authentication

All API requests require Firebase ID token authentication:

```bash
# Example authenticated request
curl -X GET \
  'http://localhost:8000/auth/profile' \
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

## 🏗️ Data Architecture (Session 9 Implementation)

### Clean Database Structure

Our API connects to the **clean Firestore structure** implemented in Session 9:

```
/shelters/{shelter-id}     ← Root-level shelter collection
/users/{user-id}           ← Universal user management  
/services/{service-id}     ← Service management
```

### User-Shelter Associations

Data isolation is achieved through **user-shelter linking**:
- `shelter_id`: Links users to specific shelters ("old-brewery-mission")
- `tenant_id`: Provides tenant isolation ("shelter-old-brewery-mission")
- `role`: Determines access level ("super_admin", "admin", "participant", "donor")

---

## 🎯 Four-Role System (Operational)

### Role-Based Access Control ✅ **LIVE**

| Role | Access Level | Current Status | Test Account |
|------|--------------|----------------|--------------|
| **Super Admin** | Platform-wide access | ✅ **Joel's Dashboard Active** | `joel.yaffe@gmail.com` |
| **Shelter Admin** | Shelter-specific data | ✅ **Old Brewery Mission Active** | `shelteradmin@example.com` |
| **Participant** | Personal profile + shelter data | ✅ **Real Shelter Association** | `participant@example.com` |
| **Donor** | Donation tracking | 🔄 **Ready for Session 10** | `donor@example.com` |

---

## 📚 API Endpoints (Session 9 Implementation)

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

- `GET /demo/donations/participant/{participant_id}` - Get demo participant info
- `POST /demo/donations/create-session` - Create Adyen payment session
- `POST /demo/donations/finalize/{payment_id}` - Finalize payment with details
- `POST /demo/donations/webhook` - Adyen webhook handler
- `GET /demo/donations/stats/{participant_id}` - Get demo participant statistics

---

## 🔒 Authentication & Security (Session 9 Implementation)

### Firebase ID Token Authentication ✅ **OPERATIONAL**

```bash
# Real authentication flow
curl -X GET 'http://localhost:8000/auth/profile' \
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
]
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

## 🏥 Health & Status (Session 9 Implementation)

### Root Health Check

```http
GET /
```

```json
{
  "success": true,
  "message": "SHELTR-AI API is running",
  "version": "2.0.0",
  "status": "healthy",
  "services": {
    "authentication": "✅ operational",
    "database": "✅ operational", 
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
  "version": "2.0.0",
  "environment": "development",
  "services": {
    "api": "✅ operational",
    "firebase_auth": "✅ operational",
    "firestore": "✅ operational",
    "storage": "✅ operational"
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

**Live Swagger UI** with SHELTR-AI branding at `http://localhost:8000/docs`

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
POST /demo/donations/create-session
Content-Type: application/json

{
  "participant_id": "alex-thompson-demo",
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
      "id": "alex-thompson-demo",
      "name": "Alex Thompson",
      "story": "Former chef working toward housing goals",
      "progress": {
        "housing": 75,
        "employment": 60,
        "financial_stability": 40
      }
    }
  }
}
```

---

## 🚨 Error Handling (Session 9 Implementation)

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
- **Database**: Firebase Firestore with clean structure
- **Authentication**: Firebase Auth with custom claims
- **Frontend Integration**: CORS-enabled for https://sheltr-ai.web.app
- **Container Registry**: Google Container Registry (gcr.io/sheltr-ai/sheltr-api)
- **Auto-scaling**: 0-10 instances based on demand

---

## 📊 Current Implementation Status

### ✅ **Completed (Current Session)**
- **6 Operational Routers**: Auth, Analytics, Chatbot, Services, Users, Demo Donations
- **Firebase Integration**: Complete authentication and Firestore connectivity
- **Role-Based Access**: 4-role system (Super Admin, Admin, Participant, Donor)
- **Data Connectivity**: Real database integration with clean structure
- **Adyen Demo**: Working QR donation system with payment processing
- **Production Deployment**: Google Cloud Run containerized deployment
- **Enhanced Chatbot**: RAG-powered intelligent responses with knowledge base
- **Security Improvements**: Cryptographically secure session management
- **Tokenomics Updates**: Updated allocation strategies and documentation

### 🔄 **Next Session Priorities**
- **Inventory Management API**: Resource tracking endpoints
- **Appointment System API**: Service booking and calendar endpoints  
- **Enhanced Analytics**: More detailed reporting endpoints
- **Real Donation Processing**: Production payment system integration

---

## 🛠️ Tools & Resources

### Development Tools
- **Interactive API Docs**: `http://localhost:8000/docs` (Swagger UI)
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`
- **Health Monitoring**: `http://localhost:8000/health`

### Frontend Integration
- **CORS Configured**: For Next.js development and production
- **Performance Monitoring**: Request timing headers
- **Error Handling**: Standardized error responses
- **Authentication**: Firebase ID token validation

### Testing & Validation
- **Role-Based Testing**: 4 test accounts for each user role
- **Real Data**: Connected to Session 9 clean database structure
- **Production Ready**: Deployed and operational backend

---

**This FastAPI backend powers the SHELTR-AI platform with clean architecture, real data connectivity, and production-ready shelter management capabilities.** 🏠✨ 