# 📊 Investor Data Room Portal - Setup Complete

**Date:** October 27, 2025  
**Version:** 1.0.0  
**Status:** ✅ Phase 1 Complete (Authentication & Foundation)

---

## 🎯 **Overview**

The **Investor Data Room** is a secure, separate portal for authorized investors to access confidential investment materials, financial projections, and strategic documents. It operates independently from the Founders Portal with its own authentication and access control.

---

## ✅ **What's Been Completed (Phase 1)**

### 1. **Authentication System**

✅ **Login Page:** `/ir`
- Custom investor login interface
- Email/password authentication
- Role-based redirect (investors only)
- Professional SHELTR branding
- Contact information for access requests

✅ **Demo Investor Account Created:**
```
Email:    investor@sheltr-demo.com
Password: Investor2025!
Role:     investor
UID:      IZZC8bZTFZRuMt8vj9MfEfEkQmr1
```

### 2. **Data Room Main Page**

✅ **Data Room:** `/ir/dataroom`
- Secure main portal page
- Dynamic content loading from Firestore
- Displays documents marked for investors
- Gallery section for media/presentations
- Logout functionality
- Professional, clean interface

### 3. **Firestore Security Rules**

✅ **New `investor` Role Added:**
- `isInvestor()` helper function
- Access control for `secure_documents` collection
- Access control for `gallery_images` collection
- Investors can only read documents/media marked with `isInvestorDataRoom: true`

✅ **Rules Deployed to Production**

### 4. **File Structure**

```
apps/web/src/app/
├── ir/
│   ├── page.tsx                    # Login page
│   └── dataroom/
│       └── page.tsx                # Main data room page
```

---

## 🚧 **Remaining Work (Phase 2)**

### **TODO #5: Add Toggle Switches to Founders Portal**

**Goal:** Allow Super Admins/Platform Admins to control which cards appear in the investor data room.

**Implementation:**
1. Add a toggle switch to each card on `/portal/founders-only`
2. Toggle label: "Share to Investor Data Room"
3. On toggle, update Firestore document with `isInvestorDataRoom: true/false`
4. Visual indicator (badge/icon) showing which cards are shared

**Files to Modify:**
- `apps/web/src/app/portal/founders-only/page.tsx`

---

### **TODO #6: Update Firestore `secure_documents` Collection**

**Goal:** Ensure all existing secure documents have the `isInvestorDataRoom` field.

**Implementation:**
1. Create migration script to add `isInvestorDataRoom: false` to all existing documents
2. Run script on production Firestore
3. Verify all documents have the field

**Script Location:**
- `scripts/migrate-investor-dataroom-field.js` (to be created)

---

### **TODO #7: Create SecureDocumentViewer for Investor Data Room**

**Goal:** Allow investors to view individual documents (like Business Plan, Investor Relations, etc.)

**Implementation:**
1. Create `/ir/dataroom/[slug]/page.tsx` for individual document viewing
2. Use similar logic to `SecureDocumentViewer` component
3. Fetch document from Firestore based on slug
4. Render markdown content
5. Add breadcrumb navigation

**Files to Create:**
- `apps/web/src/app/ir/dataroom/[slug]/page.tsx`

---

### **TODO #8: Update Middleware to Protect `/ir` Routes**

**Goal:** Ensure only authenticated investors can access `/ir/dataroom` routes.

**Implementation:**
1. Update `middleware.ts` to check for investor role on `/ir/dataroom/*` routes
2. Redirect non-investors to `/ir` login page
3. Allow public access to `/ir` (login page)

**Files to Modify:**
- `apps/web/middleware.ts`

---

## 🧪 **Testing the Current Setup**

### **Step 1: Test Login**

1. Navigate to: `http://localhost:3000/ir` (or production: `https://sheltr-ai.web.app/ir`)
2. Enter credentials:
   - Email: `investor@sheltr-demo.com`
   - Password: `Investor2025!`
3. Click "Access Data Room"
4. Should redirect to `/ir/dataroom`

### **Step 2: Test Data Room (Currently Empty)**

1. After logging in, you should see:
   - Header with SHELTR logo
   - "Investor Data Room" title
   - Welcome alert message
   - Empty state message: "No Content Available"
2. This is expected because no documents have been marked for the investor data room yet

### **Step 3: Test Logout**

1. Click "Logout" button in header
2. Should redirect back to `/ir` login page

---

## 📋 **Next Steps for User**

### **Immediate Actions:**

1. **Test the login flow:**
   ```bash
   # Start dev server
   npm run start-dev
   
   # Navigate to http://localhost:3000/ir
   # Login with investor@sheltr-demo.com / Investor2025!
   ```

2. **Deploy to production:**
   ```bash
   ./deploy.sh
   # Select option 1 (Frontend only)
   ```

3. **Verify investor account in Firebase Console:**
   - Go to Firebase Console > Authentication
   - Find user: `investor@sheltr-demo.com`
   - Verify custom claim: `role: investor`

### **Phase 2 Implementation:**

Once you've tested Phase 1, I'll implement:
1. Toggle switches on Founders Portal cards
2. Firestore migration for existing documents
3. Individual document viewer for investors
4. Middleware protection

---

## 🔐 **Security Model**

### **Access Control Matrix**

| Resource | Super Admin | Platform Admin | Investor | Public |
|----------|-------------|----------------|----------|--------|
| `/ir` (login) | ✅ | ✅ | ✅ | ✅ |
| `/ir/dataroom` | ✅ | ✅ | ✅ (role check) | ❌ |
| `secure_documents` (all) | ✅ Read/Write | ✅ Read/Write | ❌ | ❌ |
| `secure_documents` (marked for investors) | ✅ | ✅ | ✅ Read Only | ❌ |
| `gallery_images` (marked for investors) | ✅ | ✅ | ✅ Read Only | ❌ |

### **Firestore Rules Summary**

```javascript
// Investors can only read documents marked for them
match /secure_documents/{documentId} {
  allow read: if isSuperAdmin() || 
                 isPlatformAdmin() ||
                 (isInvestor() && resource.data.isInvestorDataRoom == true);
}

// Investors can only see gallery items marked for them
match /gallery_images/{imageId} {
  allow read: if resource.data.isPublic == true || 
                 isSuperAdmin() || 
                 isPlatformAdmin() ||
                 (isInvestor() && resource.data.isInvestorDataRoom == true);
}
```

---

## 📝 **Key Design Decisions**

### **Why Separate Portals?**

1. **Security Isolation:** Founders may have sensitive internal documents not meant for investors
2. **Controlled Sharing:** Granular control over what investors can see
3. **Professional Presentation:** Dedicated investor-focused interface
4. **Audit Trail:** Separate authentication logs for investor access

### **Why Toggle System?**

1. **Flexibility:** Easy to add/remove documents from investor view
2. **No Duplication:** Same documents, different visibility flags
3. **Centralized Management:** Manage all content from Founders Portal
4. **Version Control:** Changes to documents automatically reflect in both portals

---

## 🚀 **Deployment Checklist**

- [x] Investor login page created (`/ir`)
- [x] Data room main page created (`/ir/dataroom`)
- [x] Firestore rules updated with investor role
- [x] Demo investor account created
- [x] Rules deployed to production
- [ ] Toggle switches added to Founders Portal (Phase 2)
- [ ] Firestore migration completed (Phase 2)
- [ ] Individual document viewer created (Phase 2)
- [ ] Middleware protection added (Phase 2)
- [ ] Frontend deployed to production
- [ ] End-to-end testing completed

---

## 📞 **Support & Access**

**For Investor Access Requests:**
- Email: `joel@arcanaconcept.com`
- Subject: "SHELTR Investor Data Room Access Request"

**Demo Account (Testing Only):**
- Email: `investor@sheltr-demo.com`
- Password: `Investor2025!`
- **⚠️ Do not share demo credentials with actual investors**

---

## ✅ **Phase 1 Status: COMPLETE**

All foundation work is complete and ready for testing. Once you've verified the login flow and empty data room, we can proceed with Phase 2 to add the toggle system and document sharing functionality.

**Ready to test!** 🎉

