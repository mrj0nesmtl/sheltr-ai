# NDA Sign-In Troubleshooting Guide

**Version:** 1.0.0  
**Last Updated:** October 19, 2025  
**Status:** ✅ Active

---

## 🔍 **Problem: Platform Admin Stuck at NDA Popup**

### **Symptoms**
- Platform Administrator logs in successfully
- NDA popup appears
- User signs the NDA
- Error message appears or NDA popup keeps reappearing
- Cannot access dashboard

---

## 🎯 **Root Cause**

The issue occurs when a Platform Administrator's **Firebase Auth custom claims** don't match their **Firestore user document**.

### **How NDA Validation Works**

1. **Frontend Check** (`apps/web/src/app/dashboard/layout.tsx`):
   ```typescript
   const hasSigned = await NDAService.hasUserSignedNDA(user.uid);
   ```

2. **Firestore Query** (`apps/web/src/services/ndaService.ts`):
   ```typescript
   const userDoc = await getDoc(doc(db, 'nda_agreements', userId));
   return userDoc.exists();
   ```

3. **Firestore Security Rules** (`firestore.rules`):
   ```javascript
   match /nda_agreements/{userId} {
     // Read: Super Admin can read all NDAs, Platform Admins can read their own
     allow read: if isSuperAdmin() || (isPlatformAdmin() && userId == request.auth.uid);
     
     // Write: Platform Admins can sign their own NDA, Super Admin can manage all
     allow write: if isSuperAdmin() || (isPlatformAdmin() && userId == request.auth.uid);
   }
   ```

4. **Role Check Function**:
   ```javascript
   function isPlatformAdmin() {
     return isAuthenticated() && getUserRole() == 'platform_admin';
   }
   
   function getUserRole() {
     return request.auth.token.role; // ⚠️ Checks CUSTOM CLAIMS, not Firestore document
   }
   ```

### **The Problem**
- ✅ User document in Firestore: `role: "platform_admin"`
- ❌ Firebase Auth custom claims: **EMPTY** or **MISSING**
- ❌ Security rules **DENY** access because custom claims don't have `platform_admin` role
- ❌ Frontend cannot read NDA document → assumes NDA not signed → shows popup again

---

## 🔧 **Solution: Fix Custom Claims**

### **Step 1: Verify the Issue**

Use Firebase MCP to check the user's Auth record:

```bash
# In Cursor, use Firebase MCP tool:
mcp_firebase_auth_get_users(uids=["USER_UID_HERE"])
```

**Look for:**
- ❌ `customAttributes: null` or missing → **PROBLEM**
- ✅ `customAttributes: '{"role": "platform_admin", "tenant": "sheltr-platform"}'` → **GOOD**

### **Step 2: Run the Fix Script**

```bash
cd apps/api
python3 scripts/fix_sen_wong_claims.py
```

**Or create a custom script for any user:**

```python
#!/usr/bin/env python3
from firebase_admin import auth, initialize_app, credentials

# Initialize Firebase
cred = credentials.Certificate('service-account-key.json')
initialize_app(cred)

# Set custom claims
USER_UID = "USER_UID_HERE"
USER_EMAIL = "user@email.com"

auth.set_custom_user_claims(USER_UID, {
    'role': 'platform_admin',
    'tenant': 'sheltr-platform'
})

print(f"✅ Fixed custom claims for {USER_EMAIL}")
```

### **Step 3: User Must Refresh Their Session**

⚠️ **CRITICAL:** Custom claims are cached in the user's Firebase Auth token. The user **MUST**:

1. **Log out completely** from the SHELTR dashboard
2. **Clear browser cache and cookies** (or use incognito/private mode)
3. **Log back in**
4. The NDA popup should **NOT** appear anymore

---

## 📊 **Verification Checklist**

After running the fix script, verify:

- [ ] Firebase Auth custom claims show `role: platform_admin`
- [ ] User logs out and clears cache
- [ ] User logs back in
- [ ] NDA popup does NOT appear
- [ ] User can access dashboard normally
- [ ] User's Firestore document shows `ndaSigned: true`
- [ ] NDA document exists in `nda_agreements/{userId}`

---

## 🐛 **Common Issues**

### **Issue 1: NDA Popup Still Appears After Fix**

**Cause:** User didn't refresh their auth token  
**Solution:** 
1. User must **log out completely**
2. Clear browser cache/cookies
3. Log back in (this fetches new token with updated claims)

### **Issue 2: "Permission Denied" Error**

**Cause:** Custom claims not set correctly  
**Solution:**
1. Verify custom claims using Firebase MCP
2. Ensure `role: "platform_admin"` is present
3. Ensure `tenant: "sheltr-platform"` is present

### **Issue 3: Script Fails with Network Error**

**Cause:** Sandbox restrictions blocking network access  
**Solution:**
```bash
# Run with network permissions
python3 scripts/fix_sen_wong_claims.py --allow-network
```

---

## 🔐 **Security Notes**

1. **Custom Claims vs Firestore Document**:
   - Firestore document (`users/{userId}`) = User profile data
   - Custom claims (`auth.token`) = Security/authorization data
   - **Security rules check custom claims ONLY**

2. **Why Two Sources?**:
   - Custom claims are **cryptographically signed** by Firebase
   - Cannot be tampered with client-side
   - Firestore documents can be read/modified (with proper rules)
   - Custom claims are the **source of truth** for security

3. **When to Update Custom Claims**:
   - User role changes (e.g., donor → platform_admin)
   - User tenant changes
   - User permissions change
   - **Always update BOTH** Firestore document AND custom claims

---

## 📝 **Related Files**

- **Frontend NDA Check**: `apps/web/src/app/dashboard/layout.tsx` (lines 590-640)
- **NDA Service**: `apps/web/src/services/ndaService.ts`
- **NDA Modal**: `apps/web/src/components/auth/NDAModal.tsx`
- **Security Rules**: `firestore.rules` (lines 698-710)
- **Fix Script**: `apps/api/scripts/fix_sen_wong_claims.py`

---

## 🎯 **Sen Wong Case Study**

**Date:** October 19, 2025  
**User:** Sen Wong (`senw@royaltri.com`)  
**UID:** `Fzf0QeEcpmRKjSfgfx7SSIqNom52`

**Problem:**
- ✅ NDA document existed in Firestore
- ✅ User document showed `ndaSigned: true`
- ❌ Custom claims were **EMPTY**
- ❌ Could not access dashboard (NDA popup loop)

**Solution:**
1. Ran `fix_sen_wong_claims.py` script
2. Set custom claims: `{"role": "platform_admin", "tenant": "sheltr-platform"}`
3. Verified claims updated successfully
4. Instructed Sen to log out, clear cache, and log back in

**Result:** ✅ **FIXED** - Sen can now access dashboard without NDA popup

---

## 🚀 **Prevention**

To prevent this issue in the future:

1. **User Creation Script** should set custom claims:
   ```python
   # When creating new platform admin
   auth.create_user(email=email, password=password)
   auth.set_custom_user_claims(uid, {'role': 'platform_admin', 'tenant': 'sheltr-platform'})
   ```

2. **Admin Dashboard** should have a "Sync Custom Claims" button:
   - Reads user's Firestore document role
   - Updates Firebase Auth custom claims to match
   - Useful for bulk fixes

3. **Monitoring**: Add logging to detect custom claims mismatches:
   ```python
   if user_doc.role != auth_user.custom_claims.get('role'):
       logger.warning(f"Custom claims mismatch for {user_id}")
   ```

---

## 📞 **Support**

If this guide doesn't resolve the issue:

1. Check Firebase Console → Authentication → Users → Custom Claims
2. Check Firestore Console → `nda_agreements` collection
3. Check browser console for specific error messages
4. Contact Super Admin with:
   - User email
   - User UID
   - Screenshot of error
   - Browser console logs

---

**Document Status:** ✅ Active  
**Tested On:** Production (October 19, 2025)  
**Success Rate:** 100% (1/1 cases resolved)

