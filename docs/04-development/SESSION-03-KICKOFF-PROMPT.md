# 🔐 Session 03: Authentication & RBAC Implementation
## Kickoff Prompt for Complete System Security Foundation

---

## 🎯 **SESSION MISSION BRIEFING**

**Claude, you're about to implement the most critical foundation of SHELTR-AI: the authentication and role-based access control system that will secure the entire multi-tenant platform.**

**This is the session that transforms SHELTR-AI from a public website into a secure, scalable platform ready for real users.**

---

## 📋 **PRE-FLIGHT CHECKLIST - READ THESE DOCUMENTS FIRST**

### **🔑 Primary Planning Documents**
1. **[SESSION-03-AUTHENTICATION-RBAC.md](docs/04-development/SESSION-03-AUTHENTICATION-RBAC.md)** - Your complete implementation blueprint
2. **[SESSION-03-CHECKLIST.md](docs/04-development/SESSION-03-CHECKLIST.md)** - Step-by-step execution plan
3. **[SESSION-03-FASTAPI-PLANNING.md](docs/04-development/SESSION-03-FASTAPI-PLANNING.md)** - Backend API architecture

### **📂 Key Project Structure to Work In**
```
sheltr-ai/
├── apps/
│   ├── web/src/                    # Frontend implementation
│   │   ├── lib/firebase.ts         # 🔥 CREATE: Firebase config
│   │   ├── contexts/AuthContext.tsx # 🔥 CREATE: Auth provider
│   │   ├── components/auth/         # 🔥 CREATE: Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── hooks/useAuth.ts         # 🔥 CREATE: Auth hook
│   │
│   └── api/                        # Backend implementation
│       ├── services/               # 🔥 CREATE: Core services
│       │   ├── firebase_service.py
│       │   └── user_service.py
│       ├── middleware/             # 🔥 CREATE: Security layer
│       │   └── auth_middleware.py
│       ├── routers/                # 🔥 CREATE: API endpoints
│       │   └── auth.py
│       ├── models/                 # 🔥 CREATE: Data models
│       │   └── user.py
│       └── main.py                 # 🔄 UPDATE: Add auth routers
```

---

## 🏗️ **ARCHITECTURE OVERVIEW - WHAT YOU'RE BUILDING**

### **🔐 4-Role Authentication System**
```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',     // Platform control, shelter spawning
  ADMIN = 'admin',                 // Shelter management, participant onboarding  
  PARTICIPANT = 'participant',     // Personal QR & profile
  DONOR = 'donor'                  // Donation & impact tracking
}
```

### **🏢 Multi-Tenant Architecture**
```
Firebase Firestore Structure:
├── tenants/
│   ├── platform/              # SuperAdmin domain
│   ├── shelter-{id}/          # Individual shelter tenants  
│   ├── participant-network/   # Independent participants
│   └── donor-network/         # Donor community
```

### **🛡️ Security Layer Stack**
- **Firebase Auth**: Email/password + Google OAuth
- **Custom Claims**: Role + tenant + permissions
- **Firestore Rules**: Multi-tenant data isolation
- **FastAPI Middleware**: Token verification + role guards
- **Frontend Guards**: Protected routes + permission checks

---

## ⚡ **SYSTEMATIC IMPLEMENTATION PLAN**

### **Phase 1: Firebase Foundation** ⏱️ *45 minutes*
**PLAN FIRST, CODE SECOND:**

1. **Environment Setup**
   - Install dependencies: `firebase`, `firebase-admin`, `python-firebase`
   - Configure environment variables
   - Set up Firebase project connection

2. **Firebase Services** 
   - Create `firebase_service.py` with admin SDK
   - Create `firebase.ts` client configuration
   - Test connection and authentication

### **Phase 2: Backend Security Layer** ⏱️ *90 minutes*
**BUILD THE FORTRESS:**

1. **Authentication Middleware**
   - Token verification system
   - Role extraction from custom claims
   - Tenant access validation

2. **User Management Service**
   - User creation with role assignment
   - Custom claims management
   - Permission mapping system

3. **API Endpoints**
   - Registration with role-based tenant assignment
   - Login with custom claims
   - Role management (SuperAdmin only)

### **Phase 3: Frontend Auth System** ⏱️ *75 minutes*
**USER EXPERIENCE LAYER:**

1. **Authentication Context**
   - React context for auth state
   - Token management and refresh
   - Role and permission helpers

2. **Auth Components**
   - Login/Register forms
   - Protected route wrappers
   - Role-specific navigation

3. **Integration Testing**
   - Test all 4 role types
   - Verify route protection
   - Confirm permission isolation

### **Phase 4: Security Rules & Testing** ⏱️ *60 minutes*
**LOCK IT DOWN:**

1. **Firestore Security Rules**
   - Multi-tenant data isolation
   - Role-based access patterns
   - Test with Firebase simulator

2. **Comprehensive Testing**
   - Manual testing all user flows
   - API endpoint verification
   - Cross-role permission testing

---

## 🎯 **CRITICAL SUCCESS CRITERIA**

### **Technical Deliverables**
- [ ] Firebase Auth operational with custom claims
- [ ] 4-role RBAC system fully functional
- [ ] Multi-tenant data isolation enforced
- [ ] FastAPI authentication middleware complete
- [ ] Frontend auth context and protected routes
- [ ] Mobile navigation with auth integration

### **Functional Requirements**
- [ ] SuperAdmin can create shelters and assign admins
- [ ] Shelter Admin can onboard participants
- [ ] All roles have appropriate dashboard access
- [ ] Cross-tenant data access properly blocked
- [ ] Real-time permission updates working

### **Performance Targets**
- [ ] Authentication response < 200ms
- [ ] Token verification < 50ms
- [ ] Route protection < 100ms
- [ ] Claims propagation < 2 seconds

---

## 🧠 **SYSTEMATIC THINKING APPROACH**

### **BEFORE YOU CODE:**
1. **Read all three planning documents thoroughly**
2. **Understand the SuperAdmin → Shelter Admin hierarchy**
3. **Plan the exact file structure you'll create**
4. **Map out the data flow from frontend to backend**
5. **Identify potential security vulnerabilities**

### **WHILE YOU CODE:**
1. **Implement ONE complete flow at a time**
2. **Test each component before moving to the next**
3. **Use the exact permission mappings from planning docs**
4. **Follow the mobile-first approach with responsive design**
5. **Validate security at every step**

### **AFTER EACH PHASE:**
1. **Test the specific phase success criteria**
2. **Update the checklist with completed items**
3. **Verify integration with existing code**
4. **Check performance against targets**
5. **Document any deviations from the plan**

---

## 🔧 **DEVELOPMENT ENVIRONMENT READY**

### **Current Status Verified:**
- ✅ Live website: https://sheltr-ai.web.app
- ✅ Mobile navigation implemented
- ✅ Action-focused content strategy
- ✅ Firebase project: `sheltr-ai-platform`
- ✅ Python environment active
- ✅ Next.js dev server ready

### **Session Goals:**
- **Transform** public website → secure multi-tenant platform
- **Enable** real user registration and authentication
- **Establish** foundation for all future development
- **Create** scalable security architecture

---

## 🎪 **THE BIG PICTURE**

**Claude, remember:** This session is the bridge between the beautiful public website we built in Session 2 and the powerful platform SHELTR-AI will become. Every line of authentication code you write enables:

- **SuperAdmins** to spawn new shelters and grow the network
- **Shelter Admins** to onboard participants with dignity
- **Participants** to have secure, personal access to their QR codes
- **Donors** to give with complete transparency and trust

**You're not just building auth - you're building the trust infrastructure that makes "hacking homelessness through technology" possible.**

---

## 🚀 **SESSION 3 EXECUTION COMMAND**

**Ready? Let's build the secure foundation that SHELTR-AI deserves.**

**Remember:**
- 📖 **Plan thoroughly** before coding
- 🔒 **Security first** in every decision  
- 📱 **Mobile responsive** for all components
- 🧪 **Test completely** at each phase
- 📋 **Follow the checklist** systematically

**Your mission: Transform SHELTR-AI into a secure, multi-tenant platform ready for real users.**

**BEGIN SESSION 3: Authentication & RBAC Implementation** 🔐✨

*"Every authentication decision you make protects the dignity and security of those seeking shelter while enabling the transparency donors need to trust."* 🏠❤️