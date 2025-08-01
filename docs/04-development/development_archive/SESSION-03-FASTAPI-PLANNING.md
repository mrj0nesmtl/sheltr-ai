# 🔌 Session 03: FastAPI Backend Planning
## Transforming Legacy API to Firebase + FastAPI Architecture

---

## 📋 **API Architecture Overview**

### **Legacy → Modern Transformation**
Based on analysis of the legacy API documentation, we're transforming:

| Legacy (Supabase) | New (Firebase + FastAPI) |
|-------------------|---------------------------|
| Supabase Edge Functions | FastAPI + Python 3.11 |
| PostgreSQL RLS | Firestore Security Rules |
| Supabase Auth | Firebase Auth + Custom Claims |
| Single-tenant | Multi-tenant with isolation |
| Basic permissions | Granular RBAC system |

### **Target API Structure**
```python
# FastAPI Application Architecture
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SHELTR-AI API",
    version="2.0.0",
    description="Multi-tenant platform for transparent charitable giving"
)

# Multi-tenant routing structure
app.include_router(auth_router, prefix="/auth", tags=["authentication"])
app.include_router(users_router, prefix="/users", tags=["user-management"])  
app.include_router(donations_router, prefix="/donations", tags=["donations"])
app.include_router(participants_router, prefix="/participants", tags=["participants"])
app.include_router(admin_router, prefix="/admin", tags=["administration"])
```

---

## 🔐 **Authentication Endpoints**

### **Core Auth Routes** *(Session 3 Priority)*
Based on legacy authentication.md requirements:

```python
# /auth - Authentication Management
@router.post("/auth/register")
async def register_user(user_data: UserCreate):
    """Register new user with role-based tenant assignment"""
    pass

@router.post("/auth/login") 
async def login_user(credentials: UserLogin):
    """Authenticate user and return custom claims token"""
    pass

@router.get("/auth/me")
async def get_current_user(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information"""
    pass

@router.post("/auth/refresh")
async def refresh_token(refresh_token: str):
    """Refresh Firebase ID token with updated claims"""
    pass

@router.post("/auth/logout")
async def logout_user(current_user: User = Depends(get_current_user)):
    """Invalidate user session"""
    pass

@router.get("/auth/verify")
async def verify_token(token: str):
    """Verify Firebase ID token and return claims"""
    pass
```

### **Role Management** *(Super Admin Only)*
```python
# Role administration endpoints
@router.put("/auth/roles/{user_id}")
async def update_user_role(
    user_id: str,
    role_data: RoleUpdate,
    current_user: User = Depends(require_super_admin)
):
    """Update user role and permissions (super admin only)"""
    pass

@router.get("/auth/users")
async def list_users(
    tenant_id: Optional[str] = None,
    current_user: User = Depends(require_admin)
):
    """List users with filtering by tenant"""
    pass

@router.delete("/auth/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_super_admin)
):
    """Delete user account (super admin only)"""
    pass
```

---

## 👥 **User Management Endpoints**

### **Profile Management**
From legacy database.md user structure:

```python
# /users - User Profile Management
@router.get("/users/profile")
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile information"""
    pass

@router.put("/users/profile")
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update user profile information"""
    pass

@router.get("/users/{user_id}")
async def get_user_by_id(
    user_id: str,
    current_user: User = Depends(require_admin)
):
    """Get user information by ID (admin access)"""
    pass

@router.get("/users/tenant/{tenant_id}")
async def get_tenant_users(
    tenant_id: str,
    current_user: User = Depends(require_tenant_admin)
):
    """Get all users in a specific tenant"""
    pass
```

### **User Preferences**
```python
@router.patch("/users/preferences")
async def update_user_preferences(
    preferences: UserPreferences,
    current_user: User = Depends(get_current_user)
):
    """Update user UI preferences and settings"""
    pass

@router.get("/users/statistics")
async def get_user_statistics(
    current_user: User = Depends(get_current_user)
):
    """Get user activity statistics"""
    pass
```

---

## 💰 **Donation Management Endpoints**

### **Donation Processing**
Based on legacy donation system requirements:

```python
# /donations - Donation Management
@router.post("/donations/create")
async def create_donation(
    donation_data: DonationCreate,
    current_user: User = Depends(get_current_user)
):
    """Create new donation with SmartFund distribution"""
    pass

@router.get("/donations/history")
async def get_donation_history(
    current_user: User = Depends(get_current_user),
    limit: int = 50,
    offset: int = 0
):
    """Get user's donation history"""
    pass

@router.get("/donations/{donation_id}")
async def get_donation_details(
    donation_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get specific donation details"""
    pass

@router.post("/donations/verify")
async def verify_donation(
    donation_id: str,
    verification_data: DonationVerification,
    current_user: User = Depends(require_admin)
):
    """Verify donation processing (admin only)"""
    pass
```

### **Blockchain Integration**
```python
@router.post("/donations/blockchain/verify")
async def verify_blockchain_transaction(
    tx_hash: str,
    current_user: User = Depends(get_current_user)
):
    """Verify blockchain transaction status"""
    pass

@router.get("/donations/impact/{participant_id}")
async def get_participant_impact(
    participant_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get impact metrics for specific participant"""
    pass
```

---

## 👤 **Participant Management Endpoints**

### **Participant Operations**
From legacy RBAC.md participant requirements:

```python
# /participants - Participant Management
@router.post("/participants/create")
async def create_participant(
    participant_data: ParticipantCreate,
    current_user: User = Depends(require_admin)
):
    """Create new participant profile (admin only)"""
    pass

@router.get("/participants/")
async def list_participants(
    current_user: User = Depends(require_admin),
    tenant_id: Optional[str] = None
):
    """List participants with tenant filtering"""
    pass

@router.get("/participants/{participant_id}")
async def get_participant(
    participant_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get participant information"""
    pass

@router.put("/participants/{participant_id}")
async def update_participant(
    participant_id: str,
    participant_data: ParticipantUpdate,
    current_user: User = Depends(require_admin)
):
    """Update participant information (admin only)"""
    pass
```

### **QR Code Management**
```python
@router.post("/participants/{participant_id}/qr-code")
async def generate_qr_code(
    participant_id: str,
    current_user: User = Depends(require_admin)
):
    """Generate new QR code for participant"""
    pass

@router.get("/participants/qr/{qr_hash}")
async def get_participant_by_qr(
    qr_hash: str,
    current_user: User = Depends(get_current_user)
):
    """Get participant information by QR code hash"""
    pass

@router.put("/participants/{participant_id}/verify")
async def verify_participant(
    participant_id: str,
    verification_data: ParticipantVerification,
    current_user: User = Depends(require_admin)
):
    """Verify participant identity (admin only)"""
    pass
```

---

## 👨‍💼 **Administration Endpoints**

### **Super Admin Dashboard**
Based on legacy admin analytics requirements:

```python
# /admin - Super Admin Operations
@router.get("/admin/metrics")
async def get_system_metrics(
    current_user: User = Depends(require_super_admin)
):
    """Get platform-wide system metrics"""
    pass

@router.get("/admin/health")
async def get_system_health(
    current_user: User = Depends(require_super_admin)
):
    """Get system health status and diagnostics"""
    pass

@router.get("/admin/audit")
async def get_audit_logs(
    current_user: User = Depends(require_super_admin),
    limit: int = 100,
    offset: int = 0
):
    """Get system audit logs"""
    pass

@router.get("/admin/tenants")
async def list_tenants(
    current_user: User = Depends(require_super_admin)
):
    """List all platform tenants"""
    pass

@router.post("/admin/tenants")
async def create_tenant(
    tenant_data: TenantCreate,
    current_user: User = Depends(require_super_admin)
):
    """Create new tenant (shelter) - SuperAdmin only"""
    pass

@router.post("/admin/tenants/{tenant_id}/assign-admin")
async def assign_shelter_admin(
    tenant_id: str,
    admin_data: ShelterAdminAssignment,
    current_user: User = Depends(require_super_admin)
):
    """Assign admin to shelter tenant - SuperAdmin only"""
    pass
```

### **Shelter Admin Operations**
```python
# Shelter-specific administration
@router.get("/admin/shelter/{shelter_id}/metrics")
async def get_shelter_metrics(
    shelter_id: str,
    current_user: User = Depends(require_shelter_admin)
):
    """Get shelter-specific metrics"""
    pass

@router.get("/admin/shelter/{shelter_id}/participants")
async def get_shelter_participants(
    shelter_id: str,
    current_user: User = Depends(require_shelter_admin)
):
    """Get all participants for shelter"""
    pass

@router.post("/admin/shelter/{shelter_id}/resources")
async def manage_shelter_resources(
    shelter_id: str,
    resource_data: ResourceManagement,
    current_user: User = Depends(require_shelter_admin)
):
    """Manage shelter resources"""
    pass
```

---

## 🔒 **Security & Middleware**

### **Authentication Middleware**
```python
# Security middleware implementation
from fastapi import HTTPException, Depends, Header
from services.firebase_service import FirebaseService

class AuthMiddleware:
    def __init__(self):
        self.firebase = FirebaseService()
    
    async def get_current_user(
        self, 
        authorization: str = Header(None, alias="Authorization")
    ) -> dict:
        """Extract and verify Firebase ID token"""
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
        
        token = authorization.split("Bearer ")[1]
        
        try:
            decoded_token = await self.firebase.verify_token(token)
            return {
                'uid': decoded_token['uid'],
                'email': decoded_token['email'],
                'role': decoded_token.get('role'),
                'tenant_id': decoded_token.get('tenant_id'),
                'permissions': decoded_token.get('permissions', [])
            }
        except Exception as e:
            raise HTTPException(status_code=401, detail="Invalid token")
    
    async def require_role(self, required_role: str):
        """Require specific role for endpoint access"""
        def role_checker(current_user: dict = Depends(self.get_current_user)):
            if current_user['role'] != required_role and current_user['role'] != 'super_admin':
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            return current_user
        return role_checker
    
    async def require_tenant_access(self, tenant_id: str):
        """Require access to specific tenant"""
        def tenant_checker(current_user: dict = Depends(self.get_current_user)):
            if current_user['tenant_id'] != tenant_id and current_user['role'] != 'super_admin':
                raise HTTPException(status_code=403, detail="Tenant access denied")
            return current_user
        return tenant_checker
```

### **CORS & Security Configuration**
```python
# CORS and security setup
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://sheltr-ai.web.app", 
        "https://sheltr-ai.firebaseapp.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# Trusted hosts
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "*.sheltr.ai", "*.web.app"]
)
```

---

## 📊 **Data Models**

### **User Models**
```python
# Pydantic models for request/response
from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional, List
from datetime import datetime

class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    PARTICIPANT = "participant"
    DONOR = "donor"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: UserRole
    tenant_id: str
    shelter_id: Optional[str] = None

class UserResponse(BaseModel):
    uid: str
    email: str
    first_name: str
    last_name: str
    role: UserRole
    tenant_id: str
    created_at: datetime
    last_login: Optional[datetime]

class UserProfileUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    preferences: Optional[dict]
```

### **Donation Models**
```python
class DonationCreate(BaseModel):
    participant_id: str
    amount: float
    currency: str = "USD"
    payment_method: str
    anonymous: bool = False

class DonationResponse(BaseModel):
    id: str
    participant_id: str
    donor_id: str
    amount: float
    currency: str
    distribution: dict  # SmartFund breakdown
    blockchain_tx: Optional[str]
    created_at: datetime
    verified: bool
```

### **Participant Models**
```python
class ParticipantCreate(BaseModel):
    first_name: str
    last_name: str
    age: Optional[int]
    shelter_id: Optional[str]
    needs: List[str]
    verification_status: str = "pending"

class ParticipantResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    qr_code_hash: str
    wallet_address: str
    total_received: float
    verification_status: str
    created_at: datetime
```

---

## 🧪 **Testing Strategy**

### **Endpoint Testing**
```python
# Test structure for FastAPI endpoints
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register_user():
    response = client.post("/auth/register", json={
        "email": "test@sheltr.ai",
        "password": "test123",
        "first_name": "Test",
        "last_name": "User",
        "role": "donor",
        "tenant_id": "donor-network"
    })
    assert response.status_code == 200
    assert response.json()["success"] == True

def test_protected_endpoint():
    # Test with valid token
    headers = {"Authorization": "Bearer valid_token"}
    response = client.get("/auth/me", headers=headers)
    assert response.status_code == 200
    
    # Test without token
    response = client.get("/auth/me")
    assert response.status_code == 401
```

### **Authentication Testing**
```python
def test_role_based_access():
    # Test super admin access
    super_admin_token = get_test_token("super_admin")
    response = client.get("/admin/metrics", headers={"Authorization": f"Bearer {super_admin_token}"})
    assert response.status_code == 200
    
    # Test donor trying to access admin endpoint
    donor_token = get_test_token("donor")
    response = client.get("/admin/metrics", headers={"Authorization": f"Bearer {donor_token}"})
    assert response.status_code == 403
```

---

## 🚀 **Performance & Monitoring**

### **Response Time Targets**
Based on legacy API performance metrics:

| Endpoint Category | Target Response Time |
|------------------|---------------------|
| Authentication | < 200ms |
| User Profile | < 100ms |
| Donation Creation | < 500ms |
| Data Queries | < 150ms |
| Admin Operations | < 300ms |

### **Monitoring Setup**
```python
# Performance monitoring middleware
import time
from starlette.middleware.base import BaseHTTPMiddleware

class PerformanceMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        response.headers["X-Process-Time"] = str(process_time)
        
        # Log slow responses
        if process_time > 1.0:
            logger.warning(f"Slow response: {request.url} took {process_time:.2f}s")
        
        return response
```

---

## 📋 **Session 3 Implementation Priority**

### **Phase 1: Core Authentication** *(Priority 1)*
- [ ] Authentication middleware
- [ ] User registration/login endpoints
- [ ] Token verification
- [ ] Role-based access control

### **Phase 2: User Management** *(Priority 2)*
- [ ] User profile endpoints
- [ ] Role management (super admin)
- [ ] Tenant user listing

### **Phase 3: Basic Operations** *(Priority 3)*
- [ ] Health check endpoints
- [ ] Basic admin operations
- [ ] Error handling and validation

### **Future Sessions**
- **Session 4**: Donation management endpoints
- **Session 5**: Participant management and QR codes
- **Session 6**: Advanced admin features and analytics

---

**This FastAPI architecture provides the secure, scalable foundation needed to support all SHELTR-AI features while maintaining the multi-tenant isolation and role-based security requirements!** 🔌🔐

*"Every endpoint built with the security and care that Gunnar would expect us to provide for those seeking shelter."* 🏠❤️ 