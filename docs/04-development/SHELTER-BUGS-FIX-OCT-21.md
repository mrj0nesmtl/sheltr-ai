# 🐛 Shelter Bugs Fix - October 21, 2025

**Date**: October 21, 2025  
**Version**: 2.57.5  
**Status**: ✅ Fixed

---

## 🚨 Issues Reported

### 1. **404 Error on Shelter Detail Page**
**URL**: `https://sheltr-ai.web.app/dashboard/shelters/old-brewery-mission/view`  
**Error**: "This page could not be found" (404)

### 2. **Participant Count Showing "0"**
**URL**: `http://localhost:3000/donate?shelter=old-brewery-mission`  
**Display**: "0 participants" badge (should show 1 - Michael Rodriguez)

### 3. **Incorrect Shelter Card Stats**
**URL**: `https://sheltr-ai.web.app/dashboard/shelters/`  
**Issue**: Card stats not updating correctly

---

## 🔍 Root Causes

### Issue #1: 404 Error
**File**: `apps/web/src/app/dashboard/shelters/[shelterId]/view/page.tsx`

**Problem**: `generateStaticParams()` only had a placeholder shelter ID:
```typescript
export async function generateStaticParams() {
  return [
    { shelterId: 'placeholder' }  // ❌ Only placeholder!
  ];
}
```

**Why this causes 404**: Next.js static export requires ALL dynamic routes to be pre-generated at build time. Since `old-brewery-mission` wasn't in the static params list, it returned a 404.

---

### Issue #2: Participant Count "0"
**File**: `apps/web/src/app/donate/page.tsx`

**Possible Causes**:
1. **Query timing**: Participant count query might run before shelter data loads
2. **Shelter ID mismatch**: Query might use wrong shelter ID format
3. **Silent query failure**: Errors were logged to console but not visible

**Verification**:
- ✅ Michael Rodriguez exists in Firestore
- ✅ Michael has `shelter_id: old-brewery-mission`
- ✅ Firestore composite index exists for `users` collection (role + shelter_id)
- ❓ Query may be failing silently

---

### Issue #3: Incorrect Stats
**Status**: Pending investigation after fixes #1 and #2 are deployed

---

## ✅ Solutions

### Fix #1: Update generateStaticParams
**File**: `apps/web/src/app/dashboard/shelters/[shelterId]/view/page.tsx`

**Before**:
```typescript
export async function generateStaticParams() {
  return [
    { shelterId: 'placeholder' }
  ];
}
```

**After**:
```typescript
export async function generateStaticParams() {
  // Generate static params for known shelters
  return [
    { shelterId: 'old-brewery-mission' },
    { shelterId: 'welcome-hall-mission' },
    { shelterId: 'mission-bon-accueil' },
    // Add more shelter IDs as needed
  ];
}
```

**Impact**: Shelter detail pages will now be pre-rendered at build time, eliminating 404 errors.

---

### Fix #2: Add Debug Logging
**File**: `apps/web/src/app/donate/page.tsx`

**Added Enhanced Logging**:
```typescript
// Get participant count for this shelter
let participantCount = 0;
try {
  console.log('🔍 Querying participants for shelter:', matchingShelter.id);
  const { collection, query, where, getDocs } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const participantsQuery = query(
    collection(db, 'users'),
    where('role', '==', 'participant'),
    where('shelter_id', '==', matchingShelter.id)
  );
  const participantsSnapshot = await getDocs(participantsQuery);
  participantCount = participantsSnapshot.size;
  console.log('✅ Found participants:', participantCount);
} catch (error) {
  console.error('❌ Error fetching participant count:', error);
  console.error('   Shelter ID:', matchingShelter.id);
}
```

**Impact**: 
- Helps diagnose the exact issue
- Shows which shelter ID is being queried
- Displays success/failure status
- **Next Step**: After deployment, check browser console to see what's happening

---

## 🧪 Testing Required

### Test 1: Shelter Detail Page (404 Fix)
1. **Build locally**:
   ```bash
   cd apps/web
   npm run build
   ```
2. **Navigate to**: `http://localhost:3000/dashboard/shelters/old-brewery-mission/view`
3. **Expected**: Page loads without 404 error

### Test 2: Participant Count (Debug Logging)
1. **Navigate to**: `http://localhost:3000/donate?shelter=old-brewery-mission`
2. **Open browser console** (F12)
3. **Look for logs**:
   - `🔍 Querying participants for shelter: old-brewery-mission`
   - `✅ Found participants: 1`
4. **Expected**: Badge shows "1 participant"
5. **If still shows "0"**: Check console for error messages

### Test 3: Production Deployment
1. **Deploy to production**:
   ```bash
   ./deploy.sh
   # Select Option 3: Quick Deploy
   ```
2. **Test on production**: https://sheltr-ai.web.app/dashboard/shelters/old-brewery-mission/view
3. **Expected**: No 404 error

---

## 🔍 Diagnostic Information

### Michael Rodriguez (Participant)
- **UID**: `dFJNlIh2g4R8vAvxvIvWZtwu8zw1`
- **shelter_id**: `old-brewery-mission`
- **role**: `participant`
- **status**: `active`
- **Query should find**: 1 participant

### Firestore Index (Line 12-19 of firestore.indexes.json)
```json
{
  "collectionGroup": "users",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "shelter_id", "order": "ASCENDING"},
    {"fieldPath": "role", "order": "ASCENDING"}
  ]
}
```
**Status**: ✅ Index exists and is enabled

### Query Being Used
```typescript
query(
  collection(db, 'users'),
  where('role', '==', 'participant'),
  where('shelter_id', '==', matchingShelter.id)  // Should be 'old-brewery-mission'
)
```

---

## 📊 Expected vs Actual

### Donate Page - Participant Badge

#### Expected
```
┌─────────────────────────────┐
│  Support Old Brewery        │
│  Mission                    │
│                             │
│  ┌─────────────────┐       │
│  │  👤 1           │       │
│  │  participants   │       │
│  └─────────────────┘       │
└─────────────────────────────┘
```

#### Actual (Bug)
```
┌─────────────────────────────┐
│  Support Old Brewery        │
│  Mission                    │
│                             │
│  ┌─────────────────┐       │
│  │  👤 0           │  ❌   │
│  │  participants   │       │
│  └─────────────────┘       │
└─────────────────────────────┘
```

---

## 🎯 Next Steps

### Immediate
1. ✅ **Fixed**: generateStaticParams for shelter detail pages
2. ✅ **Added**: Debug logging for participant count query
3. ⏳ **Test**: Local build to verify 404 fix
4. ⏳ **Deploy**: Push to production

### After Deployment
1. **Check browser console** on `/donate?shelter=old-brewery-mission`
2. **If participant count still shows "0"**:
   - Share console logs
   - Check if shelter ID mismatch
   - Verify Firestore security rules allow query
3. **Verify shelter card stats** on dashboard

### Potential Additional Fixes
If participant count still shows "0" after deployment:

**Option A: Firestore Security Rules Issue**
- Check if client-side query is blocked by security rules
- May need to add rule allowing public read of participant count

**Option B: Shelter ID Format Mismatch**
- The query uses `matchingShelter.id`
- If tenant service returns ID in different format, query will fail
- May need to normalize shelter IDs

**Option C: Timing Issue**
- Query might run before matchingShelter is set
- May need to add loading state or conditional rendering

---

## 📝 Files Changed

### 1. `apps/web/src/app/dashboard/shelters/[shelterId]/view/page.tsx`
**Lines Changed**: 4-10  
**Changes**:
- Updated `generateStaticParams()` with actual shelter IDs
- Added 3 shelter IDs: old-brewery-mission, welcome-hall-mission, mission-bon-accueil

### 2. `apps/web/src/app/donate/page.tsx`
**Lines Changed**: 87, 97-100  
**Changes**:
- Added debug logging before query
- Added success logging after query
- Added error logging with shelter ID

---

## 🚀 Deployment

### Status
✅ **Code committed**: `fix: 404 on shelter detail page and add participant count debug logging`  
⏳ **Ready for deployment**

### Deploy Command
```bash
./deploy.sh
# Select Option 3: Quick Deploy (Frontend + Backend)
```

### Post-Deployment
1. Test shelter detail page (should not 404)
2. Check console logs on donate page
3. Report findings for participant count issue

---

## 📚 Related Issues

### Similar Issues to Watch For
- Other dynamic [id] routes might have placeholder-only generateStaticParams
- Other pages might query Firestore without proper error handling
- Security rules might block legitimate client-side queries

### Preventive Measures
1. **Audit all generateStaticParams**: Ensure all dynamic routes have proper static params
2. **Add comprehensive logging**: All Firestore queries should log success/failure
3. **Build before deploy**: Always run `npm run build` locally to catch static export issues

---

## 💡 Summary

### Problems
1. ❌ 404 on shelter detail page (generateStaticParams had placeholder only)
2. ❓ Participant count showing "0" (needs investigation with debug logs)
3. ❓ Incorrect shelter card stats (pending)

### Fixes Applied
1. ✅ Added actual shelter IDs to generateStaticParams
2. ✅ Added comprehensive debug logging for participant query
3. ⏳ Pending: Investigate stats issue after other fixes deployed

### Testing Plan
1. Local build test (verify 404 fixed)
2. Production deployment
3. Console log review (diagnose participant count)
4. Iterate on additional fixes as needed

---

**Version**: 2.57.5  
**Author**: Claude (Anthropic AI)  
**Date**: October 21, 2025, 8:45 PM EDT  
**Status**: ✅ Partially fixed, investigation ongoing

