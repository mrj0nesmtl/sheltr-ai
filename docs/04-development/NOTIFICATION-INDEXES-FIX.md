# 🔧 Firestore Indexes Fix for Donor & Participant Notifications

**Date**: October 21, 2025  
**Status**: ✅ **DEPLOYED**

---

## 🐛 **Problem**

User reported console errors when viewing donor/participant notification dashboards:

```
Error getting donor notifications: FirebaseError: 
The query requires an index. You can create it here:
https://console.firebase.google.com/...
```

---

## 🔍 **Root Cause**

The notification queries use compound indexes:

```typescript
// Query in getDonorNotifications()
query(
  collection(db, 'donor_notifications'),
  where('userId', '==', userId),
  orderBy('created_at', 'desc'),
  limit(50)
);
```

This requires a **composite index** on:
- `userId` (ASCENDING)
- `created_at` (DESCENDING)

**The issue**: `firestore.indexes.json` had indexes for:
- ✅ `admin_notifications` (line 195-201)
- ❌ **Missing**: `donor_notifications`
- ❌ **Missing**: `participant_notifications`

---

## ✅ **Solution**

Added 4 new composite indexes to `firestore.indexes.json`:

### **1. Donor Notifications - Basic Query**
```json
{
  "collectionGroup": "donor_notifications",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "userId", "order": "ASCENDING"},
    {"fieldPath": "created_at", "order": "DESCENDING"}
  ]
}
```

### **2. Donor Notifications - Unread Filter**
```json
{
  "collectionGroup": "donor_notifications",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "userId", "order": "ASCENDING"},
    {"fieldPath": "isRead", "order": "ASCENDING"},
    {"fieldPath": "created_at", "order": "DESCENDING"}
  ]
}
```

### **3. Participant Notifications - Basic Query**
```json
{
  "collectionGroup": "participant_notifications",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "userId", "order": "ASCENDING"},
    {"fieldPath": "created_at", "order": "DESCENDING"}
  ]
}
```

### **4. Participant Notifications - Unread Filter**
```json
{
  "collectionGroup": "participant_notifications",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "userId", "order": "ASCENDING"},
    {"fieldPath": "isRead", "order": "ASCENDING"},
    {"fieldPath": "created_at", "order": "DESCENDING"}
  ]
}
```

---

## 📦 **Deployment**

```bash
firebase deploy --only firestore:indexes
```

**Result**:
```
✔  firestore: deployed indexes in firestore.indexes.json successfully for (default) database
✔  Deploy complete!
```

---

## ⏳ **Index Build Time**

Firestore indexes can take **several minutes to build** depending on collection size:

- **Empty collections**: ~1 minute
- **Small collections (< 1000 docs)**: ~2-5 minutes
- **Large collections (> 10,000 docs)**: ~10-30 minutes

**Status Check**: Visit [Firebase Console → Firestore → Indexes](https://console.firebase.google.com/project/sheltr-ai/firestore/indexes)

**Expected Status**:
- ⏳ **Building**: Index is being created (yellow indicator)
- ✅ **Enabled**: Index is ready to use (green indicator)

---

## 🧪 **Testing After Index Build**

Once indexes show **"Enabled"** status:

### **1. Test Donor Dashboard**

```
URL: http://localhost:3000/dashboard/donor/notifications
Expected: No console errors
Expected: Notifications load successfully
```

### **2. Test Participant Dashboard**

```
URL: http://localhost:3000/dashboard/participant/notifications
Expected: No console errors
Expected: Notifications load successfully
```

### **3. Console Verification**

**Before** ❌:
```
Error getting donor notifications: FirebaseError: The query requires an index
```

**After** ✅:
```
✅ Fetched 5 donor notifications
✅ Unread count: 2
```

---

## 📋 **Query Patterns Supported**

These indexes support the following query patterns:

### **All Notifications for User**
```typescript
collection('donor_notifications')
  .where('userId', '==', 'user-123')
  .orderBy('created_at', 'desc')
  .limit(50)
```

### **Unread Notifications for User**
```typescript
collection('donor_notifications')
  .where('userId', '==', 'user-123')
  .where('isRead', '==', false)
  .orderBy('created_at', 'desc')
  .limit(50)
```

### **Read Notifications for User**
```typescript
collection('donor_notifications')
  .where('userId', '==', 'user-123')
  .where('isRead', '==', true)
  .orderBy('created_at', 'desc')
  .limit(50)
```

---

## 🔒 **Security Rules Status**

Firestore rules for these collections are **already correct**:

### **Donor Notifications** (firestore.rules lines 965-985)
```javascript
match /donor_notifications/{notificationId} {
  // Read: Donors can read their own, admins can read all
  allow read: if isAuthenticated() && (
    (isDonor() && resource.data.userId == request.auth.uid) ||
    isSuperAdmin() || isPlatformAdmin() || isAdmin()
  );
  
  // Update: Donors can mark their own as read
  allow update: if isDonor() && resource.data.userId == request.auth.uid;
  
  // Create: System creates (admins can create for testing)
  allow create: if isSuperAdmin() || isPlatformAdmin() || isAdmin();
  
  // List/Query: Donors can query their own, admins can query all
  allow list: if isAuthenticated() && (isDonor() || isSuperAdmin() || isPlatformAdmin() || isAdmin());
}
```

### **Participant Notifications** (firestore.rules lines 990-1010)
```javascript
match /participant_notifications/{notificationId} {
  // Read: Participants can read their own, admins can read all
  allow read: if isAuthenticated() && (
    (isParticipant() && resource.data.userId == request.auth.uid) ||
    isSuperAdmin() || isPlatformAdmin() || isAdmin()
  );
  
  // Update: Participants can mark their own as read
  allow update: if isParticipant() && resource.data.userId == request.auth.uid;
  
  // Create: System creates (admins can create for testing)
  allow create: if isSuperAdmin() || isPlatformAdmin() || isAdmin();
  
  // List/Query: Participants can query their own, admins can query all
  allow list: if isAuthenticated() && (isParticipant() || isSuperAdmin() || isPlatformAdmin() || isAdmin());
}
```

---

## 📊 **Index Status Monitoring**

### **Check Index Status**

1. Visit: https://console.firebase.google.com/project/sheltr-ai/firestore/indexes
2. Look for:
   - `donor_notifications` (2 indexes)
   - `participant_notifications` (2 indexes)
3. Wait for **"Enabled"** status (green checkmark)

### **Estimated Build Times**

| **Collection** | **Documents** | **Estimated Time** |
|---------------|---------------|-------------------|
| `donor_notifications` | 0-10 | ~1-2 minutes |
| `participant_notifications` | 0-10 | ~1-2 minutes |

---

## ✅ **Verification Checklist**

- [x] Indexes added to `firestore.indexes.json`
- [x] Indexes deployed to Firebase
- [ ] **Wait for indexes to finish building** (check Firebase Console)
- [ ] Test donor dashboard (no console errors)
- [ ] Test participant dashboard (no console errors)
- [ ] Make test donation and verify notifications appear

---

## 🚀 **Next Steps**

1. **Wait 2-5 minutes** for indexes to build
2. **Refresh your browser** at:
   - `http://localhost:3000/dashboard/donor/notifications`
   - `http://localhost:3000/dashboard/participant/notifications`
3. **Make a test donation** from Jane to Michael
4. **Verify both dashboards show notifications**

---

**Commit**: `feat: add Firestore indexes for donor and participant notifications` (5d79dffe)

**Related Files**:
- `firestore.indexes.json` (UPDATED - added 4 indexes)
- `firestore.rules` (NO CHANGES - already correct)
- `apps/web/src/services/unifiedNotificationService.ts` (NO CHANGES - queries are correct)


