# 🧪 DONATION FLOW TESTING GUIDE
**Clean Slate Testing - Session 22.16**
**Date**: October 11, 2025

---

## ✅ **PRE-TEST CHECKLIST**

### Data Reset Complete ✅
- ✅ `demo_donations`: 0 donations
- ✅ `demo_analytics`: 0 events  
- ✅ Michael: $0 total_received, $0 housing_fund, 0 donations
- ✅ Jane: $0 totalDonated, 0 donations
- ✅ Old Brewery Mission: $0 operations_revenue

### Critical Fixes Applied ✅
- ✅ **Success page duplicate prevention**: Added `useRef` to prevent double creation
- ✅ **Participant dashboard fix**: Now reads from user docs instead of querying collections
- ✅ **Donation metrics service**: Queries `demo_donations` with Firebase UIDs
- ✅ **Backend UID mapping**: Maps slugs to UIDs in payment sessions

---

## 🧪 **TEST FLOW #1: Single $100 Donation**

### Steps:
1. **Login as Jane Supporter**
   - Email: `donor@example.com`
   - Navigate to: `http://localhost:3000/donate?demo=true&participant=michael-rodriguez`

2. **Make $100 Donation**
   - Select $100
   - Click "Donate $100"
   - Wait for success page

3. **Verify on Success Page** ✅
   - Total Donation: $100
   - Direct to Michael: $80 (80%)
   - Housing Fund: $15 (15%)
   - Operations: $5 (5%)

### Expected Results:

#### Jane's Dashboard (`/dashboard/donor`)
- ✅ Total Donated: **$100** (not $200!)
- ✅ Donation Count: **1** (not 2!)
- ✅ Transaction history shows: **1 donation of $100**

#### Michael's Dashboard (`/dashboard/participant`)
- ✅ Total Received: **$80** (direct amount, 80%)
- ✅ Donation Count: **1**
- ✅ Housing Fund Balance: **$15** (15%)

#### Michael's Public Profile (`/participant/michael-rodriguez`)
- ✅ Impact So Far: **$80** (not $100!)
- ✅ Donations: **1**
- ✅ Housing Fund Progress: **$15 saved**

#### Old Brewery Mission Dashboard
- ✅ Operations Revenue: **$5** (5%)

#### Firestore Verification
- ✅ `demo_donations`: **1 donation** (not 2!)
- ✅ `users/dFJNlIh2g4R8vAvxvIvWZtwu8zw1`:
  - `total_received`: **80**
  - `housing_fund_balance`: **15**
  - `donation_count`: **1**
- ✅ `users/rWM6e8zfa5UoRVe5tHe6cldQkh32`:
  - `totalDonated`: **100**
  - `donation_count`: **1**

---

## 🧪 **TEST FLOW #2: Second $50 Donation**

### Steps:
1. **Still logged in as Jane**
2. **Navigate to donate page again**
3. **Make $50 Donation**
4. **Verify cumulative totals**

### Expected Results:

#### Jane's Dashboard
- ✅ Total Donated: **$150** ($100 + $50)
- ✅ Donation Count: **2**

#### Michael's Dashboard
- ✅ Total Received: **$120** ($80 + $40)
- ✅ Housing Fund: **$22.50** ($15 + $7.50)
- ✅ Donation Count: **2**

#### Michael's Public Profile
- ✅ Impact So Far: **$120**
- ✅ Donations: **2**

---

## 🧪 **TEST FLOW #3: Console Verification**

### Check Browser Console:
```
✅ Should see:
🎯 Automatically creating demo donation with SmartFund distribution...
📝 Creating demo donation with SmartFund: {...}
✅ Demo donation created with ID: [id]
✅ Updated participant stats: {participantId: ..., direct: 80, housing: 15}
✅ Updated donor stats: {donor: ..., amount: 100}
✅ Updated Old Brewery Mission operations: {operations: 5}

❌ Should NOT see:
- Duplicate "Creating demo donation" messages
- Any error messages
- Multiple donation IDs for same donation
```

---

## 🐛 **KNOWN ISSUES FIXED**

### Issue #1: Duplicate Donations ✅ FIXED
**Problem**: Success page `useEffect` ran twice, creating 2 donations
**Solution**: Added `useRef` to track if donation was already created
**File**: `apps/web/src/app/donation/success/page.tsx`
**Lines**: 17, 40

### Issue #2: Participant Dashboard Showing $0 ✅ FIXED
**Problem**: Dashboard queried collections instead of reading user docs
**Solution**: Now reads from `users/{uid}` document (single fast query)
**File**: `apps/web/src/app/dashboard/participant/page.tsx`
**Lines**: 152-223

### Issue #3: Wrong Amounts Displayed ✅ FIXED
**Problem**: Showing total ($100) instead of direct amount ($80)
**Solution**: All queries now use DIRECT amounts (80% from breakdown)
**Files**: 
- `donationMetricsService.ts` (lines 50-57)
- `donation/success/page.tsx` (line 112)

---

## 📊 **FIRESTORE STRUCTURE VALIDATION**

### Correct Donation Document:
```json
{
  "participant_id": "dFJNlIh2g4R8vAvxvIvWZtwu8zw1",  // Firebase UID ✅
  "participant_slug": "michael-rodriguez",           // Slug for reference ✅
  "donor_id": "rWM6e8zfa5UoRVe5tHe6cldQkh32",       // Firebase UID ✅
  "amount": {
    "total": 100,
    "breakdown": {
      "direct": 80,      // 80% to participant ✅
      "housing": 15,     // 15% to housing fund ✅
      "operations": 5    // 5% to shelter ✅
    }
  },
  "status": "completed",
  "created_at": "[timestamp]"
}
```

### Correct User Document (Participant):
```json
{
  "uid": "dFJNlIh2g4R8vAvxvIvWZtwu8zw1",
  "total_received": 80,        // DIRECT amount only ✅
  "housing_fund_balance": 15,  // 15% ✅
  "donation_count": 1,         // Increments ✅
  "updated_at": "[timestamp]"
}
```

### Correct User Document (Donor):
```json
{
  "uid": "rWM6e8zfa5UoRVe5tHe6cldQkh32",
  "totalDonated": 100,       // FULL amount ✅
  "donation_count": 1,       // Increments ✅
  "updated_at": "[timestamp]"
}
```

---

## ✅ **SUCCESS CRITERIA**

All of these must be TRUE for the test to pass:

- [ ] Jane donates $100 → Michael shows **+$80** (not $100)
- [ ] Jane's dashboard shows **$100** totalDonated (not $200)
- [ ] Michael's dashboard shows **$80** total_received (not $0, not $100)
- [ ] Michael's public profile matches dashboard
- [ ] Scan-give popup shows correct totals
- [ ] Old Brewery Mission shows **$5** operations
- [ ] **ONLY 1 donation** created in `demo_donations` (not 2)
- [ ] **NO console errors**
- [ ] All metrics update **instantly** (within 1 second)

---

## 🔧 **TROUBLESHOOTING**

### If Michael's Dashboard Shows $0:
1. Check browser console for errors
2. Verify user document updated: 
   ```
   Firebase Console → users/dFJNlIh2g4R8vAvxvIvWZtwu8zw1
   ```
3. Hard refresh page (Cmd+Shift+R)
4. Check Network tab for failed queries

### If Duplicate Donations Created:
1. Check console for duplicate "Creating demo donation" messages
2. Verify `useRef` is working (should only see message once)
3. Check `demo_donations` collection count

### If Wrong Amounts Shown:
1. Verify donation has `amount.breakdown` field
2. Check if DIRECT amount (80%) is being used
3. Verify user doc has correct `total_received` value

---

## 📝 **TESTING NOTES**

**Tester**: ___________________
**Date**: ___________________
**Test Result**: ⬜ PASS  ⬜ FAIL

**Issues Found**:
- 
-
-

**Console Logs**:
```

```

**Screenshots Attached**: ⬜ Yes  ⬜ No

---

**Created**: Session 22.16
**Last Updated**: October 11, 2025
**Status**: Ready for QA Testing

