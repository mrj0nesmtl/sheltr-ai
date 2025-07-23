# 🔐 Session 03: Authentication & RBAC Implementation
## Building the Foundation for Multi-Tenant Security

---

## 🎯 **SESSION MISSION**: Implement Firebase Auth + 4-Role RBAC System

**Objective**: Transform legacy Supabase authentication into Firebase Auth with custom claims  
**Duration**: 3-4 hours focused development  
**Deliverable**: Complete authentication system with role-based access control  

---

## 📋 **Session Overview**

### **What We're Building**
Based on legacy RBAC documentation, we're implementing a sophisticated 4-role authentication system:

```typescript
// Target Authentication Architecture
interface AuthSystem {
  provider: 'Firebase Auth',
  customClaims: 'Multi-tenant RBAC',
  roles: ['super_admin', 'admin', 'participant', 'donor'],
  tenantIsolation: 'Firestore Security Rules',
  realTime: 'Live permission updates'
}
```

### **Legacy System Analysis**
From reviewing the legacy documents, we identified these critical requirements:

#### **🔄 From Legacy Supabase**
```sql
-- Old Supabase RLS approach
CREATE POLICY "role_based_access" ON participants
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

#### **🔥 To Firebase Custom Claims**
```typescript
// New Firebase custom claims approach
const customClaims = {
  role: 'admin',
  tenant_id: 'shelter-123',
  permissions: ['participants:read', 'participants:write'],
  shelter_id: 'shelter-123'
};
```

---

## 🏗️ **Architecture Design**

### **1. Firebase Auth Configuration**
```typescript
// Firebase Auth setup with custom claims
interface FirebaseAuthConfig {
  project: 'sheltr-ai-platform',
  providers: ['email', 'google'],
  customClaims: {
    role: UserRole,
    tenant_id: string,
    permissions: string[],
    shelter_id?: string
  },
  tokenRefresh: 'automatic',
  sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
}

enum UserRole {
  SUPER_ADMIN = 'super_admin',     // Platform administration  
  ADMIN = 'admin',                 // Shelter management
  PARTICIPANT = 'participant',     // Service recipients
  DONOR = 'donor'                  // Donation contributors
}
```

### **2. Multi-Tenant Role Matrix**
Based on legacy RBAC.md, here's our role system:

| Role | Tenant Access | Key Permissions | Dashboard |
|------|---------------|----------------|-----------|
| **super_admin** | `platform` | System-wide control | SuperAdmin Dashboard |
| **admin** | `shelter-{id}` | Shelter management | Shelter Admin Dashboard |
| **participant** | `shelter-{id}` or `participant-network` | Personal QR & profile | Participant Dashboard |
| **donor** | `donor-network` | Donation & impact tracking | Donor Dashboard |

### **3. Firestore Security Rules**
```javascript
// Multi-tenant security rules based on legacy requirements
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tenant-based data isolation
    match /tenants/{tenantId}/{collection}/{document=**} {
      allow read, write: if request.auth != null
        && request.auth.token.tenant_id == tenantId
        && hasValidRole(request.auth.token.role, tenantId);
    }
    
    // Platform admin access
    match /system/{document=**} {
      allow read, write: if request.auth != null
        && request.auth.token.role == 'super_admin'
        && request.auth.token.tenant_id == 'platform';
    }
    
    function hasValidRole(role, tenantId) {
      return role in ['super_admin', 'admin', 'participant', 'donor']
        && exists(/databases/$(database)/documents/tenants/$(tenantId)/users/$(request.auth.uid));
    }
  }
}
```

---

## 🛠️ **Implementation Plan**

### **Phase 1: Firebase Auth Setup** ⏱️ *45 minutes*

#### **1.1 Firebase Configuration**
```bash
# Install Firebase dependencies
cd apps/web
npm install firebase firebase-admin

# Install FastAPI Firebase integration
cd ../api  
pip install firebase-admin python-firebase
```

#### **1.2 Environment Configuration**
```typescript
// apps/web/src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

#### **1.3 Admin SDK Setup**
```python
# apps/api/services/firebase_service.py
import firebase_admin
from firebase_admin import credentials, auth, firestore

class FirebaseService:
    def __init__(self):
        if not firebase_admin._apps:
            cred = credentials.Certificate("path/to/service-account.json")
            firebase_admin.initialize_app(cred)
        
        self.auth = auth
        self.db = firestore.client()
    
    async def set_custom_claims(self, uid: str, claims: dict):
        """Set custom claims for user authentication"""
        await self.auth.set_custom_user_claims(uid, claims)
    
    async def verify_token(self, token: str):
        """Verify Firebase ID token and return claims"""
        decoded_token = await self.auth.verify_id_token(token)
        return decoded_token
```

### **Phase 2: Authentication Middleware** ⏱️ *60 minutes*

#### **2.1 FastAPI Authentication Middleware**
```python
# apps/api/middleware/auth_middleware.py
from fastapi import HTTPException, Depends, Header
from services.firebase_service import FirebaseService

class AuthMiddleware:
    def __init__(self):
        self.firebase = FirebaseService()
    
    async def get_current_user(
        self, 
        authorization: str = Header(None, alias="Authorization")
    ):
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
        def role_checker(current_user: dict = Depends(self.get_current_user)):
            if current_user['role'] != required_role:
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            return current_user
        return role_checker
    
    async def require_tenant_access(self, tenant_id: str):
        def tenant_checker(current_user: dict = Depends(self.get_current_user)):
            if current_user['tenant_id'] != tenant_id and current_user['role'] != 'super_admin':
                raise HTTPException(status_code=403, detail="Tenant access denied")
            return current_user
        return tenant_checker
```

#### **2.2 Frontend Auth Context**
```typescript
// apps/web/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthUser extends User {
  role?: string;
  tenantId?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get custom claims
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const customClaims = idTokenResult.claims;
        
        setUser({
          ...firebaseUser,
          role: customClaims.role as string,
          tenantId: customClaims.tenant_id as string,
          permissions: customClaims.permissions as string[]
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || user?.role === 'super_admin';
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role || user?.role === 'super_admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      hasPermission,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### **Phase 3: Role Management System** ⏱️ *75 minutes*

#### **3.1 User Registration with Role Assignment**
```python
# apps/api/services/user_service.py
from enum import Enum
from pydantic import BaseModel

class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"  
    PARTICIPANT = "participant"
    DONOR = "donor"

class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    role: UserRole
    tenant_id: str
    shelter_id: Optional[str] = None

class UserService:
    def __init__(self):
        self.firebase = FirebaseService()
    
    async def create_user(self, user_data: UserCreate):
        # Create Firebase user
        firebase_user = await self.firebase.auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=f"{user_data.first_name} {user_data.last_name}"
        )
        
        # Set custom claims based on role
        custom_claims = {
            'role': user_data.role.value,
            'tenant_id': user_data.tenant_id,
            'permissions': self._get_role_permissions(user_data.role)
        }
        
        if user_data.shelter_id:
            custom_claims['shelter_id'] = user_data.shelter_id
        
        await self.firebase.set_custom_claims(firebase_user.uid, custom_claims)
        
        # Create user profile in Firestore
        user_profile = {
            'uid': firebase_user.uid,
            'email': user_data.email,
            'first_name': user_data.first_name,
            'last_name': user_data.last_name,
            'role': user_data.role.value,
            'tenant_id': user_data.tenant_id,
            'created_at': firestore.SERVER_TIMESTAMP,
            'last_login': None
        }
        
        # Store in tenant-specific collection
        collection_path = f"tenants/{user_data.tenant_id}/users"
        await self.firebase.db.collection(collection_path).document(firebase_user.uid).set(user_profile)
        
        return firebase_user
    
    def _get_role_permissions(self, role: UserRole) -> List[str]:
        """Get permissions based on role (from legacy RBAC requirements)"""
        permissions_map = {
            UserRole.SUPER_ADMIN: [
                'system:read', 'system:write', 'users:manage', 
                'analytics:view', 'security:monitor', 'tenants:manage'
            ],
            UserRole.ADMIN: [
                'shelter:manage', 'participants:manage', 'resources:manage',
                'analytics:view', 'documents:upload'
            ],
            UserRole.PARTICIPANT: [
                'profile:read', 'profile:write', 'services:access',
                'qr:generate', 'donations:view'
            ],
            UserRole.DONOR: [
                'donations:create', 'profile:read', 'profile:write',
                'impact:view', 'history:view'
            ]
        }
        return permissions_map.get(role, [])
```

#### **3.2 Protected Route Components**
```typescript
// apps/web/src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = '/login'
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (requiredRole && !user.hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !user.hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Role-specific route components
export const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="super_admin">{children}</ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

export const ParticipantRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="participant">{children}</ProtectedRoute>
);

export const DonorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="donor">{children}</ProtectedRoute>
);
```

### **Phase 4: API Endpoints** ⏱️ *60 minutes*

#### **4.1 Authentication Endpoints**
```python
# apps/api/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from services.user_service import UserService, UserCreate
from middleware.auth_middleware import AuthMiddleware

router = APIRouter(prefix="/auth", tags=["authentication"])
user_service = UserService()
auth_middleware = AuthMiddleware()

@router.post("/register")
async def register_user(user_data: UserCreate):
    """Register new user with role-based access"""
    try:
        user = await user_service.create_user(user_data)
        return {
            "success": True,
            "message": "User created successfully",
            "user_id": user.uid
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_current_user(current_user: dict = Depends(auth_middleware.get_current_user)):
    """Get current user information"""
    return {
        "success": True,
        "user": current_user
    }

@router.put("/roles/{user_id}")
async def update_user_role(
    user_id: str,
    new_role: str,
    current_user: dict = Depends(auth_middleware.require_role("super_admin"))
):
    """Update user role (super admin only)"""
    try:
        # Update custom claims
        custom_claims = await user_service.get_user_claims(user_id)
        custom_claims['role'] = new_role
        custom_claims['permissions'] = user_service._get_role_permissions(new_role)
        
        await user_service.firebase.set_custom_claims(user_id, custom_claims)
        
        return {
            "success": True,
            "message": f"User role updated to {new_role}"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

---

## ✅ **Session Success Criteria**

### **Technical Deliverables**
- [ ] Firebase Auth configured and operational
- [ ] Custom claims system working for all 4 roles  
- [ ] FastAPI authentication middleware implemented
- [ ] Firestore security rules deployed
- [ ] Frontend auth context and protected routes
- [ ] User registration with role assignment
- [ ] Basic authentication API endpoints

### **Functional Requirements**
- [ ] Users can register and login
- [ ] Role-based dashboard access working
- [ ] Multi-tenant data isolation enforced
- [ ] Permissions checked on all protected routes
- [ ] Real-time custom claims updates
- [ ] Secure token verification on backend

### **Performance Targets**
- [ ] Authentication response time < 200ms
- [ ] Token verification < 50ms  
- [ ] Role resolution < 100ms
- [ ] Page load with auth check < 500ms

---

## 🔧 **Development Tools & Testing**

### **Testing Strategy**
```bash
# Unit tests for auth functions
npm run test:auth

# Integration tests for API endpoints  
pytest apps/api/tests/test_auth.py

# End-to-end auth flow tests
npm run test:e2e:auth
```

### **Debug Tools**
```typescript
// Debug auth state in browser console
window.authDebug = {
  user: user,
  claims: user?.getIdTokenResult(),
  permissions: user?.permissions,
  tenant: user?.tenantId
};
```

---

## 🚀 **Post-Session Next Steps**

After Session 3 completion, we'll be ready for:
- **Session 4**: Dashboard development with role-based UI
- **Session 5**: API endpoint expansion and data management
- **Session 6**: Real-time features and notifications

---

**Session 3 will establish the security foundation that everything else builds on. With proper authentication and RBAC, we can safely develop all the advanced features!** 🔐✨ 