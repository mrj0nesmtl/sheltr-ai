# 🔐 Session 03: Authentication & RBAC Checklist
## Implementing Firebase Auth + Multi-Tenant RBAC System

---

## 🎯 **MISSION**: Complete Authentication Foundation

**Target**: Fully functional 4-role authentication system with multi-tenant isolation  
**Duration**: 3-4 hours focused development  
**Success**: Users can register, login, and access role-appropriate features

---

## 📋 **Pre-Session Setup** (10 minutes)

### **Environment Check**
- [ ] **Firebase Project Ready**: `sheltr-ai-platform` configured
- [ ] **Python Environment Active**: `(.venv)` running in terminal
- [ ] **Next.js Dev Server**: `npm run dev` operational at http://localhost:3000
- [ ] **Git Status Clean**: All Session 02 work committed and pushed
- [ ] **Legacy Docs Reviewed**: RBAC.md, API.md, auth.md analyzed

### **Quick Verification**
```bash
# Verify current environment
cd /Users/mrjones/Github/Projects/sheltr-ai
source apps/api/.venv/bin/activate  # Activate Python environment
cd apps/web && npm run dev          # Verify frontend running
firebase --version                  # Confirm Firebase CLI available
```

---

## ⚡ **Session Timeline** (3-4 hours)

### **Phase 1: Firebase Authentication Setup** ⏱️ *45 min*

#### **1.1 Firebase Dependencies** *(10 min)*
```bash
# Frontend Firebase setup
cd apps/web
npm install firebase
npm install firebase-admin  # For admin operations

# Backend Firebase integration
cd ../api
pip install firebase-admin
pip install python-firebase
```

#### **1.2 Firebase Project Configuration** *(20 min)*
- [ ] **Service Account**: Download `service-account-key.json` from Firebase Console
- [ ] **Environment Variables**: Set up `.env.local` for web app
- [ ] **Admin SDK Init**: Configure Firebase Admin in FastAPI
- [ ] **Web SDK Init**: Configure Firebase client in Next.js

#### **1.3 Authentication Providers** *(15 min)*
- [ ] **Email/Password**: Enable in Firebase Auth console
- [ ] **Google Sign-In**: Configure OAuth provider
- [ ] **Authentication Settings**: Set up password policies

### **Phase 2: Multi-Tenant RBAC System** ⏱️ *90 min*

#### **2.1 Custom Claims Architecture** *(30 min)*
Based on legacy RBAC.md requirements:

```typescript
// Target custom claims structure
interface CustomClaims {
  role: 'super_admin' | 'admin' | 'participant' | 'donor';
  tenant_id: string;  // e.g., 'platform', 'shelter-123', 'participant-network'
  permissions: string[];  // Role-specific permissions array
  shelter_id?: string;    // For admin users
}
```

- [ ] **Role Definitions**: Implement 4-role enum system
- [ ] **Permission Mapping**: Create role → permissions mapping
- [ ] **Tenant Assignment**: Design tenant isolation strategy
- [ ] **Claims Service**: Build custom claims management

#### **2.2 Firestore Security Rules** *(30 min)*
- [ ] **Tenant Isolation**: Multi-tenant data separation rules
- [ ] **Role Validation**: Permission-based access control
- [ ] **Path Protection**: Secure document access patterns
- [ ] **Security Testing**: Validate rules with Firebase simulator

#### **2.3 User Management Service** *(30 min)*
- [ ] **User Registration**: Role-based account creation
- [ ] **Profile Creation**: Tenant-specific user profiles
- [ ] **Role Assignment**: Automatic custom claims setting
- [ ] **Tenant Provisioning**: Multi-tenant user organization

### **Phase 3: Frontend Authentication** ⏱️ *75 min*

#### **3.1 Authentication Context** *(30 min)*
- [ ] **Auth Provider**: React context for auth state
- [ ] **Custom Hooks**: `useAuth` hook with role checking
- [ ] **Token Management**: Automatic token refresh
- [ ] **Claims Integration**: Real-time custom claims updates

#### **3.2 Protected Routes** *(25 min)*
Based on legacy navigation matrix:

- [ ] **Route Guards**: Role-based route protection
- [ ] **Permission Checks**: Granular permission validation
- [ ] **Redirect Logic**: Unauthorized access handling
- [ ] **Loading States**: Proper loading/error states

#### **3.3 Auth Components** *(20 min)*
- [ ] **Login Form**: Email/password authentication
- [ ] **Registration Form**: Role-specific registration
- [ ] **Auth Status**: Current user display
- [ ] **Logout Function**: Secure session termination

### **Phase 4: FastAPI Backend Integration** ⏱️ *90 min*

#### **4.1 Authentication Middleware** *(40 min)*
From legacy API.md patterns:

- [ ] **Token Verification**: Firebase ID token validation
- [ ] **Claims Extraction**: Custom claims from tokens
- [ ] **Role Guards**: Role-based endpoint protection
- [ ] **Tenant Validation**: Multi-tenant access control

#### **4.2 User Management Endpoints** *(30 min)*
- [ ] **POST /auth/register**: User registration with roles
- [ ] **GET /auth/me**: Current user information
- [ ] **PUT /auth/roles/:id**: Role management (super admin)
- [ ] **GET /auth/verify**: Token verification endpoint

#### **4.3 API Security** *(20 min)*
- [ ] **CORS Configuration**: Cross-origin security
- [ ] **Rate Limiting**: Request throttling
- [ ] **Request Validation**: Input sanitization
- [ ] **Error Handling**: Secure error responses

---

## 🗂️ **File Structure & Implementation**

### **Frontend Files**
```
apps/web/src/
├── lib/
│   ├── firebase.ts              # Firebase configuration
│   └── auth.ts                  # Auth utilities
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx        # Login component
│   │   ├── RegisterForm.tsx     # Registration component
│   │   └── ProtectedRoute.tsx   # Route protection
│   └── ui/
│       └── AuthStatus.tsx       # Auth status display
└── hooks/
    └── useAuth.ts               # Authentication hook
```

### **Backend Files**
```
apps/api/
├── services/
│   ├── firebase_service.py      # Firebase admin integration
│   └── user_service.py          # User management
├── middleware/
│   └── auth_middleware.py       # Authentication middleware
├── routers/
│   └── auth.py                  # Authentication endpoints
└── models/
    └── user.py                  # User data models
```

---

## ✅ **Success Criteria Checklist**

### **Authentication Functionality**
- [ ] **User Registration**: New users can create accounts with roles
- [ ] **User Login**: Existing users can authenticate successfully  
- [ ] **Custom Claims**: Role and tenant information properly set
- [ ] **Token Refresh**: Automatic token renewal working
- [ ] **Logout**: Clean session termination

### **Role-Based Access Control**
- [ ] **Super Admin**: Full system access and user management
- [ ] **Admin**: Shelter-specific management capabilities
- [ ] **Participant**: Personal profile and QR code access
- [ ] **Donor**: Donation and impact tracking features
- [ ] **Cross-Role**: Proper permission isolation

### **Multi-Tenant Security**
- [ ] **Data Isolation**: Users only see their tenant data
- [ ] **Firestore Rules**: Security rules enforced properly
- [ ] **API Protection**: Endpoints validate tenant access
- [ ] **Route Protection**: Frontend routes secured by role

### **Technical Performance**
- [ ] **Auth Speed**: Login/registration under 2 seconds
- [ ] **Token Verification**: Backend validation under 50ms
- [ ] **Route Guards**: Page protection under 100ms
- [ ] **Claims Update**: Real-time role changes working

---

## 🧪 **Testing Checklist**

### **Manual Testing**
- [ ] **Register Super Admin**: Create platform administrator
- [ ] **Register Shelter Admin**: Create shelter manager
- [ ] **Register Participant**: Create service recipient
- [ ] **Register Donor**: Create donation contributor
- [ ] **Role Switching**: Verify different role experiences
- [ ] **Unauthorized Access**: Confirm protection working

### **API Testing**
```bash
# Test authentication endpoints
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sheltr.ai","password":"test123","role":"super_admin"}'

curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Frontend Testing**
- [ ] **Login Form**: Email/password authentication
- [ ] **Protected Routes**: Role-based navigation
- [ ] **Auth Context**: User state management
- [ ] **Error Handling**: Invalid credentials handling

---

## 🚨 **Troubleshooting Guide**

### **Common Issues**

#### **Firebase Configuration**
- **Error**: "Firebase project not found"
- **Solution**: Verify project ID in environment variables

#### **Custom Claims Not Working**
- **Error**: "Claims undefined in token"
- **Solution**: Check token refresh and claims propagation timing

#### **CORS Issues**
- **Error**: "Cross-origin request blocked"
- **Solution**: Configure CORS in FastAPI with proper origins

#### **Firestore Permission Denied**
- **Error**: "Missing or insufficient permissions"
- **Solution**: Verify security rules and user claims

### **Debug Tools**
```typescript
// Add to browser console for debugging
window.authDebug = {
  user: auth.currentUser,
  claims: await auth.currentUser?.getIdTokenResult(),
  token: await auth.currentUser?.getIdToken()
};
```

---

## 📊 **Session Progress Tracking**

### **Phase Completion**
- [ ] **Phase 1 Complete**: Firebase Auth configured (45 min)
- [ ] **Phase 2 Complete**: RBAC system implemented (90 min)
- [ ] **Phase 3 Complete**: Frontend auth integrated (75 min)
- [ ] **Phase 4 Complete**: Backend API secured (90 min)

### **Final Verification**
- [ ] **All Roles Working**: 4 role types can register and login
- [ ] **Multi-Tenant**: Proper data isolation enforced
- [ ] **API Security**: All endpoints properly protected
- [ ] **Frontend Protection**: Routes secured by role
- [ ] **Performance**: All timing targets met

---

## 🔜 **Session 04 Preparation**

### **What We'll Have After Session 3**
- ✅ **Complete Authentication System**: Firebase Auth with custom claims
- ✅ **4-Role RBAC**: Super admin, admin, participant, donor roles
- ✅ **Multi-Tenant Security**: Proper data isolation
- ✅ **Protected APIs**: Secure FastAPI endpoints
- ✅ **Frontend Auth**: React context and protected routes

### **Next Session Goals**
- **Dashboard Development**: Role-specific dashboard interfaces
- **User Management**: Admin tools for user administration
- **Tenant Management**: Multi-tenant configuration
- **API Expansion**: Core business logic endpoints

---

## 🎯 **Session Success Definition**

**🔐 Authentication & RBAC system is COMPLETE when:**

1. **Any user can register** with appropriate role assignment
2. **Role-based access** is enforced throughout the application
3. **Multi-tenant isolation** prevents cross-tenant data access
4. **API endpoints** are secured with proper authentication
5. **Frontend routes** redirect based on user permissions
6. **Performance targets** are met for all auth operations

**Ready for Session 4**: ✅ Dashboard development with secure, role-based foundation

---

**This session transforms SHELTR-AI from a public website into a secure, multi-tenant platform ready for real user onboarding!** 🚀🔐

*"Building the fortress that protects everyone while keeping the door open for those who need help."* 🏠❤️ 