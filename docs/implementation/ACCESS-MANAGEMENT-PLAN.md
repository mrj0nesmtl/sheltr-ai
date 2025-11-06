# Access Management System - Implementation Plan

## 🎯 Goal
Create a comprehensive system for SHELTR leadership (Super Admins + Leadership) to manage access to:
1. **Team Portal** (`/portal/founders-only`) - For Leadership & Platform Admins
2. **IR Dataroom** (`/ir/dataroom`) - For Qualified Investors

---

## 📋 Overview

### New Dashboards
1. **`/dashboard/team-portal`** - Manage Platform Admin access
2. **`/dashboard/ir-dataroom`** - Manage Qualified Investor access

### Access Control
- **Who can access these dashboards**: Super Admins + Leadership (NEW) + Platform Admins (EXISTING)
- **New User Roles**: 
  - `leadership` (NEW) - Founders with Super Admin equivalent access
  - `qualified_investor` (NEW) - IR Dataroom access only, NO platform dashboard access

---

## 🗂️ Phase 1: Database Schema & User Roles

### User Roles (Firestore `users` collection)
```typescript
type UserRole = 
  | 'super_admin'        // Full system access + infrastructure control (EXISTING)
  | 'leadership'         // Full system access equivalent to super_admin (NEW - Founders)
  | 'platform_admin'     // Platform management, NO system settings access (EXISTING)
  | 'qualified_investor' // IR Dataroom access only (NEW)
  | 'shelter_admin'      // Shelter management (EXISTING)
  | 'participant'        // Platform participant (EXISTING)
  | 'donor'              // Donor access (EXISTING)
```

### 🔐 Access Level Matrix

| Feature/Route | Super Admin | Leadership | Platform Admin | Qualified Investor |
|--------------|-------------|------------|----------------|-------------------|
| **Dashboard** | ✅ Full | ✅ Full | ✅ Full | ❌ No Access |
| **Founders Portal** | ✅ | ✅ | ✅ | ❌ |
| **IR Dataroom** | ✅ | ✅ | ✅ | ✅ Only This |
| **System Settings** | ✅ Edit | ✅ Edit | 👁️ View Only (greyed out) | ❌ |
| **MCP Access** | ✅ | ✅ | ❌ | ❌ |
| **Create Platform Admins** | ✅ | ✅ | ❌ | ❌ |
| **Create Qualified Investors** | ✅ | ✅ | ✅ | ❌ |
| **Team Portal Dashboard** | ✅ | ✅ | ✅ View Only | ❌ |
| **IR Dataroom Dashboard** | ✅ | ✅ | ✅ | ❌ |

### 🛡️ System Settings Access Control

**URL**: `/dashboard/settings`

**Access Tabs** (5 total):
1. General
2. Security
3. Notifications
4. Integrations
5. Super Admin

**Access Rules**:
- **Super Admin**: ✅ Full edit access to all tabs
- **Leadership**: ✅ Full edit access to all tabs
- **Platform Admin**: 
  - ✅ Can VIEW all tabs
  - ❌ CANNOT edit (all inputs, toggles, forms are **greyed out/disabled**)
  - ❌ CANNOT take platform offline
  - ❌ CANNOT modify platform configuration
  - UI shows "View Only" badge
- **All Others**: ❌ No access to System Settings page

### User Document Structure
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  
  // Common fields
  created_at: Timestamp;
  updated_at: Timestamp;
  status: 'active' | 'inactive' | 'pending';
  created_by: string; // UID of admin who created this user
  
  // Leadership specific (NEW)
  leadership_metadata?: {
    is_founder: boolean;
    elevated_from: 'platform_admin' | 'direct_create';
    elevation_date: Timestamp;
    mcp_access_granted: boolean;
  };
  
  // Platform Admin specific (EXISTING)
  admin_permissions?: {
    can_manage_users: boolean;
    can_manage_content: boolean;
    can_view_analytics: boolean;
    can_access_founders_portal: boolean;
  };
  
  // Qualified Investor specific (NEW)
  investor_metadata?: {
    company?: string;
    investment_range?: string; // e.g., "$10K-$50K"
    accreditation_status?: 'verified' | 'pending' | 'not_verified';
    notes?: string;
    access_granted_date: Timestamp;
    dataroom_access_level?: 'full' | 'limited';
  };
}
```

---

## 🎨 Phase 2: Navigation & Sidebar Updates

### Sidebar Menu Items (for Super Admin + Leadership + Platform Admin)
Add after "Financial Oversight" in sidebar:

```typescript
// New menu items
{
  title: 'Team Portal',
  description: 'Manage platform admin access',
  icon: Shield,
  path: '/dashboard/team-portal',
  roles: ['super_admin', 'leadership', 'platform_admin']
},
{
  title: 'IR Dataroom',
  description: 'Manage investor access',
  icon: Building2,
  path: '/dashboard/ir-dataroom',
  roles: ['super_admin', 'leadership', 'platform_admin'],
  badge: 'Secure'
}
```

### System Settings Access Update
```typescript
// Modify System Settings route to handle view-only for Platform Admin
{
  title: 'System Settings',
  description: 'Configure system settings and integrations',
  icon: Settings,
  path: '/dashboard/settings',
  roles: ['super_admin', 'leadership', 'platform_admin'], // Platform Admin = view only
  badge: user.role === 'platform_admin' ? 'View Only' : undefined
}
```

---

## 🛠️ Phase 3: Backend API Endpoints

### API Routes to Create (FastAPI)

#### 1. Leadership Management (NEW)
```python
# Elevate Platform Admin to Leadership
POST /api/v1/admin/leadership/elevate
Body: {
  uid: string,  # Platform Admin UID to elevate
  is_founder: boolean,
  mcp_access: boolean
}

# Create New Leadership User (Direct)
POST /api/v1/admin/leadership
Body: {
  email: string,
  displayName: string,
  password: string,
  is_founder: boolean,
  mcp_access: boolean
}

# List Leadership Users
GET /api/v1/admin/leadership

# Demote Leadership to Platform Admin
POST /api/v1/admin/leadership/{uid}/demote

# Deactivate Leadership User
DELETE /api/v1/admin/leadership/{uid}
```

#### 2. Platform Admin Management (EXISTING - Update for Leadership compatibility)
```python
# Create Platform Admin
POST /api/v1/admin/platform-admins
Body: {
  email: string,
  displayName: string,
  password: string,
  permissions: AdminPermissions
}

# List Platform Admins (exclude Leadership)
GET /api/v1/admin/platform-admins

# Update Platform Admin
PATCH /api/v1/admin/platform-admins/{uid}

# Deactivate Platform Admin
DELETE /api/v1/admin/platform-admins/{uid}
```

#### 2. Qualified Investor Management
```python
# Create Qualified Investor
POST /api/v1/admin/qualified-investors
Body: {
  email: string,
  displayName: string,
  password: string,
  metadata: InvestorMetadata
}

# List Qualified Investors
GET /api/v1/admin/qualified-investors

# Update Qualified Investor
PATCH /api/v1/admin/qualified-investors/{uid}

# Deactivate Qualified Investor
DELETE /api/v1/admin/qualified-investors/{uid}
```

---

## 📦 Phase 4: Frontend Components

### `/dashboard/team-portal` Components

#### 1. **LeadershipDirectory.tsx** (NEW)
```typescript
// Features:
- Section header: "Leadership Team (Founders)"
- Data table with columns:
  - Name
  - Email
  - Role Badge (Founder/Leadership)
  - Created Date
  - Elevated From (Platform Admin or Direct)
  - MCP Access (Yes/No badge)
  - Status (Active/Inactive badge)
  - Actions (View, Demote to Platform Admin, Deactivate)
- Search/filter functionality
- Pagination
- Export to CSV
- Only visible to Super Admin + Leadership
```

#### 2. **PlatformAdminDirectory.tsx** (EXISTING - Enhanced)
```typescript
// Features:
- Section header: "Platform Administrators"
- Data table with columns:
  - Name
  - Email
  - Created Date
  - Status (Active/Inactive badge)
  - Created By
  - Actions (View, Edit, Elevate to Leadership, Deactivate)
- Search/filter functionality
- Pagination
- Export to CSV
- "Elevate to Leadership" button (Super Admin + Leadership only)
```

#### 3. **LeadershipElevationModal.tsx** (NEW)
```typescript
// Modal for elevating Platform Admin to Leadership
// Triggered from PlatformAdminDirectory actions
// Form fields:
- Display current user info (Name, Email, Current Role)
- ☐ Is Founder
- ☐ Grant MCP Access
- Confirmation warning: "This user will have full system access equivalent to Super Admin"
- Elevate button
```

#### 4. **PlatformAdminRegistration.tsx** (EXISTING)
```typescript
// Form fields:
- Display Name *
- Email Address *
- Password *
- Confirm Password *
- Permissions:
  - ☐ Can manage users
  - ☐ Can manage content
  - ☐ Can view analytics
  - ☐ Can access founders portal
- Send invitation email? ☐
- Submit button
```

---

### `/dashboard/ir-dataroom` Components

#### 1. **QualifiedInvestorDirectory.tsx**
```typescript
// Features:
- Data table with columns:
  - Name
  - Email
  - Company
  - Investment Range
  - Accreditation Status (badge)
  - Access Level
  - Created Date
  - Actions (View, Edit, Revoke Access)
- Search/filter functionality
- Filter by accreditation status
- Pagination
- Export to CSV
```

#### 2. **QualifiedInvestorRegistration.tsx**
```typescript
// Form fields:
- Display Name *
- Email Address *
- Password *
- Confirm Password *
- Company/Organization
- Investment Range (dropdown):
  - $1K - $10K
  - $10K - $50K
  - $50K - $100K
  - $100K - $250K
  - $250K+
- Accreditation Status (dropdown):
  - Verified
  - Pending
  - Not Verified
- Dataroom Access Level:
  - ○ Full Access
  - ○ Limited Access
- Notes (textarea)
- Send invitation email? ☐
- Submit button
```

---

## 🔐 Phase 5: Access Control & Route Protection

### Route Protection Logic

#### Update `/ir/dataroom` access check:
```typescript
// Current: any authenticated user
// New: Only qualified_investor + super_admin + leadership + platform_admin

if (!user) {
  redirect to /ir (login)
}

if (user.role === 'qualified_investor' || 
    user.role === 'super_admin' || 
    user.role === 'leadership' ||
    user.role === 'platform_admin') {
  // Grant access
} else {
  // Show "Access Denied" page
}
```

#### Update `/portal/founders-only` access check:
```typescript
// Only: super_admin, leadership, platform_admin, founders

if (user.role === 'super_admin' || 
    user.role === 'leadership' ||
    user.role === 'platform_admin' || 
    user.role === 'founder') {
  // Grant access
}
```

#### NEW: `/dashboard/settings` access and UI control:
```typescript
// Allow access but disable editing for Platform Admin

const canEditSystemSettings = 
  user.role === 'super_admin' || 
  user.role === 'leadership';

const canViewSystemSettings = 
  canEditSystemSettings || 
  user.role === 'platform_admin';

// In component:
<Input
  disabled={!canEditSystemSettings}
  className={!canEditSystemSettings ? 'opacity-50 cursor-not-allowed' : ''}
  // ... other props
/>

<Switch
  disabled={!canEditSystemSettings}
  // ... other props
/>

// Show view-only badge
{user.role === 'platform_admin' && (
  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
    View Only
  </Badge>
)}
```

#### NEW: Team Portal dashboard restrictions:
```typescript
// Platform Admin can VIEW but cannot CREATE/ELEVATE users

const canManageLeadership = 
  user.role === 'super_admin' || 
  user.role === 'leadership';

const canCreatePlatformAdmin = canManageLeadership;
const canElevateToleadership = canManageLeadership;

// In UI:
<Button 
  disabled={!canCreatePlatformAdmin}
  onClick={openCreateModal}
>
  + Create Platform Admin
</Button>

// Hide "Elevate to Leadership" button for Platform Admins
{canElevateToleadership && (
  <Button onClick={handleElevate}>
    Elevate to Leadership
  </Button>
)}
```

---

## 📧 Phase 6: User Experience Features

### Email Notifications
1. **Welcome Email** - Sent when new user is created
   - Login credentials
   - Access instructions
   - Support contact

2. **Password Reset** - Allow users to reset passwords
   - Forgot password link on login pages

### User Invitation Flow (Optional Future Enhancement)
1. Admin sends invitation (no password required)
2. User receives email with magic link
3. User clicks link → sets own password → gains access

---

## 🚀 Implementation Order

### **Step 1: Database & Types** (Easy)
- [ ] Add `leadership` to UserRole type
- [ ] Update user type definitions
- [ ] Add leadership_metadata interface
- [ ] Update Firestore security rules

### **Step 2: Navigation & Routes** (Easy)
- [ ] Update sidebar component with new menu items
- [ ] Add Leadership to role checks
- [ ] Create `/dashboard/team-portal/page.tsx`
- [ ] Create `/dashboard/ir-dataroom/page.tsx`
- [ ] Add route protection

### **Step 3: System Settings View-Only Mode** (Medium)
- [ ] Update `/dashboard/settings` page
- [ ] Disable all inputs/toggles for Platform Admin
- [ ] Add "View Only" badge
- [ ] Test all 5 tabs (General, Security, Notifications, Integrations, Super Admin)

### **Step 4: Leadership Components** (Medium)
- [ ] Create `LeadershipDirectory.tsx`
- [ ] Create `LeadershipElevationModal.tsx`
- [ ] Update `PlatformAdminDirectory.tsx` with elevation button
- [ ] Add MCP access toggle

### **Step 5: Directory Components** (Medium)
- [ ] Update `PlatformAdminDirectory.tsx` (filter out Leadership)
- [ ] Create `QualifiedInvestorDirectory.tsx`
- [ ] Fetch users from Firestore
- [ ] Display in tables

### **Step 6: Registration Components** (Medium)
- [ ] Update `PlatformAdminRegistration.tsx`
- [ ] Create `QualifiedInvestorRegistration.tsx`
- [ ] Form validation

### **Step 7: Backend API** (Medium-Hard)
- [ ] Create Leadership management endpoints
- [ ] Create Firebase Auth user creation endpoints
- [ ] Create Firestore user document management
- [ ] Add authentication & authorization checks
- [ ] Implement elevation/demotion logic

### **Step 8: Integration** (Easy-Medium)
- [ ] Connect frontend to backend
- [ ] Test leadership elevation flow
- [ ] Test user creation flow
- [ ] Test access control

### **Step 9: Access Control Updates** (Easy)
- [ ] Update `/ir/dataroom` route protection
- [ ] Update `/portal/founders-only` route protection
- [ ] Test all access scenarios
- [ ] Verify view-only mode works

---

## 🧪 Testing Scenarios

### Leadership Tests (NEW)
1. ✅ Super Admin can elevate Platform Admin to Leadership
2. ✅ Super Admin can create new Leadership user directly
3. ✅ Leadership can access all dashboards (same as Super Admin)
4. ✅ Leadership can access System Settings (full edit)
5. ✅ Leadership can access MCP (if granted)
6. ✅ Leadership can create Platform Admins
7. ✅ Leadership can create Qualified Investors
8. ✅ Leadership can access Founders Portal
9. ✅ Leadership can access IR Dataroom
10. ✅ Super Admin can demote Leadership to Platform Admin

### Platform Admin Tests (UPDATED)
1. ✅ Super Admin can create Platform Admin
2. ✅ Leadership can create Platform Admin
3. ❌ Platform Admin CANNOT create other Platform Admins
4. ✅ Platform Admin can access Founders Portal
5. ✅ Platform Admin can VIEW Team Portal dashboard
6. ✅ Platform Admin can create Qualified Investors
7. ✅ Platform Admin can VIEW IR Dataroom dashboard
8. ✅ Platform Admin can VIEW System Settings
9. ❌ Platform Admin CANNOT EDIT System Settings (all inputs disabled)
10. ❌ Platform Admin CANNOT take platform offline
11. ❌ Platform Admin CANNOT modify platform configuration
12. ❌ Platform Admin CANNOT access MCP
13. ✅ Platform Admin sees "View Only" badge on System Settings

### Qualified Investor Tests
1. ✅ Super Admin can create Qualified Investor
2. ✅ Leadership can create Qualified Investor
3. ✅ Platform Admin can create Qualified Investor
4. ✅ Qualified Investor can access `/ir/dataroom`
5. ❌ Qualified Investor CANNOT access `/dashboard/*`
6. ❌ Qualified Investor CANNOT access `/portal/founders-only`
7. ✅ Qualified Investor can only see dataroom content

---

## 🎨 UI/UX Mockup Notes

### Dashboard Layout
```
┌─────────────────────────────────────────────────┐
│ [Back to Dashboard]           Team Portal       │
├─────────────────────────────────────────────────┤
│                                                  │
│  Platform Administrator Management              │
│  ─────────────────────────────────────────      │
│                                                  │
│  📊 Active Admins: 5    📋 Total: 8            │
│                                                  │
│  [+ Register New Platform Admin]   [Search...] │
│                                                  │
│  ┌────────────────────────────────────────────┐│
│  │ Name         Email        Created  Status  ││
│  ├────────────────────────────────────────────┤│
│  │ Jane Doe     jane@...    Oct 15   Active  ││
│  │ John Smith   john@...    Oct 10   Active  ││
│  └────────────────────────────────────────────┘│
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 📝 Files to Create/Modify

### New Files
```
apps/web/src/app/dashboard/team-portal/page.tsx
apps/web/src/app/dashboard/ir-dataroom/page.tsx
apps/web/src/components/admin/LeadershipDirectory.tsx (NEW)
apps/web/src/components/admin/LeadershipElevationModal.tsx (NEW)
apps/web/src/components/admin/PlatformAdminDirectory.tsx
apps/web/src/components/admin/PlatformAdminRegistration.tsx
apps/web/src/components/admin/QualifiedInvestorDirectory.tsx
apps/web/src/components/admin/QualifiedInvestorRegistration.tsx
apps/web/src/services/leadershipService.ts (NEW)
apps/web/src/services/platformAdminService.ts
apps/web/src/services/qualifiedInvestorService.ts
apps/api/routes/admin/leadership.py (backend - NEW)
apps/api/routes/admin/platform_admins.py (backend)
apps/api/routes/admin/qualified_investors.py (backend)
```

### Files to Modify
```
apps/web/src/components/DashboardSidebar.tsx (add menu items, update role checks)
apps/web/src/app/dashboard/settings/page.tsx (add view-only mode for Platform Admin)
apps/web/src/app/ir/dataroom/page.tsx (update access control - add Leadership)
apps/web/src/app/portal/founders-only/page.tsx (update access control - add Leadership)
apps/web/src/types/user.ts (add 'leadership' role)
apps/web/src/contexts/AuthContext.tsx (handle Leadership role)
```

---

## ⚠️ Security Considerations

1. **Password Requirements**
   - Minimum 8 characters
   - Must include uppercase, lowercase, number, special char
   - Server-side validation

2. **Rate Limiting**
   - Limit user creation to prevent abuse
   - Max 10 new users per hour per admin

3. **Audit Logging**
   - Log all user creation events
   - Log all access grants/revocations
   - Store in Firestore `audit_logs` collection

4. **Email Verification** (Optional)
   - Send verification email before granting access
   - Require email confirmation

---

## 💰 Estimated Effort

| Phase | Complexity | Time Estimate |
|-------|-----------|---------------|
| 1. Database Schema | Easy | 1 hour |
| 2. Navigation & Sidebar | Easy | 1 hour |
| 3. Backend API | Medium | 4-6 hours |
| 4. Directory Components | Medium | 4 hours |
| 5. Registration Components | Medium | 4 hours |
| 6. Access Control | Easy | 2 hours |
| 7. Testing | Medium | 3 hours |

**Total: 19-22 hours**

---

## 🎯 Success Criteria

### Leadership Management
- [ ] Super Admin can elevate Platform Admin to Leadership
- [ ] Super Admin can create new Leadership user directly
- [ ] Leadership users have Super Admin equivalent access
- [ ] Leadership can edit System Settings
- [ ] Leadership can access MCP (if granted)
- [ ] Leadership can be demoted back to Platform Admin

### Platform Admin Management
- [ ] Super Admin + Leadership can register new Platform Admins
- [ ] Platform Admins can access Founders Portal
- [ ] Platform Admins can VIEW System Settings (all tabs)
- [ ] Platform Admins CANNOT EDIT System Settings (inputs/toggles disabled)
- [ ] Platform Admins see "View Only" badge on System Settings
- [ ] Platform Admins CANNOT create other Platform Admins
- [ ] Platform Admins CANNOT access MCP

### Qualified Investor Management
- [ ] Super Admin + Leadership + Platform Admin can register Qualified Investors
- [ ] Qualified Investors can ONLY access `/ir/dataroom`
- [ ] Qualified Investors CANNOT access any `/dashboard/*` routes
- [ ] Qualified Investors CANNOT access `/portal/founders-only`

### System Features
- [ ] All users are listed in respective directories
- [ ] Access can be revoked/deactivated
- [ ] Audit logs are created for all actions
- [ ] UI is clean, intuitive, and matches existing design
- [ ] All role checks are implemented correctly
- [ ] No security vulnerabilities in role elevation

---

## 📌 Questions for Clarification

1. **Password Management**: Should we send temporary passwords via email, or should admins set passwords manually?
2. **Email Service**: Do we have an email service configured (SendGrid, AWS SES, etc.)?
3. **Investor Metadata**: What additional fields do we need for Qualified Investors?
4. **Access Levels**: Should there be different "tiers" of dataroom access (e.g., some investors see more than others)?
5. **Approval Workflow**: Do new investors need approval before getting access, or is admin creation = instant access?

---

## 📊 Key Changes Summary

### What's NEW
1. **Leadership Role** - Founders with Super Admin equivalent access
2. **Qualified Investor Role** - IR Dataroom only access
3. **Leadership Elevation** - Convert Platform Admin → Leadership
4. **System Settings View-Only** - Platform Admins can view but not edit
5. **Team Portal Dashboard** - Manage Leadership & Platform Admins
6. **IR Dataroom Dashboard** - Manage Qualified Investors

### What's EXISTING (Updated)
1. **Platform Admin Role** - Already exists, now with restricted System Settings access
2. **IR Dataroom** - Already exists, now restricted to specific roles
3. **Founders Portal** - Already exists, now includes Leadership role

### Role Hierarchy
```
Super Admin (Highest)
    ↓
Leadership (NEW - Founders)
    ↓
Platform Admin (EXISTING - Now with view-only System Settings)
    ↓
Qualified Investor (NEW - IR Dataroom only)
```

### Critical Distinctions

| Feature | Super Admin | Leadership | Platform Admin |
|---------|-------------|------------|----------------|
| **System Settings** | ✅ Full Edit | ✅ Full Edit | 👁️ View Only |
| **Create Platform Admin** | ✅ | ✅ | ❌ |
| **Elevate to Leadership** | ✅ | ✅ | ❌ |
| **MCP Access** | ✅ Always | ✅ If Granted | ❌ Never |
| **Founders Portal** | ✅ | ✅ | ✅ |
| **IR Dataroom** | ✅ | ✅ | ✅ |

---

**Ready for your review and feedback!** 🚀

