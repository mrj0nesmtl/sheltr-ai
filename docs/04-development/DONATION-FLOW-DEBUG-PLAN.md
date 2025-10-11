# 🚨 DONATION FLOW DEBUG PLAN - Session 22.16
**Priority: CRITICAL - Core Payment Rails & Metrics Sync**

## 🎯 OBJECTIVE
Fix donation flow so ALL metrics update correctly across:
- Participant dashboards & public profiles
- Donor dashboards & wallets  
- Shelter admin dashboards
- Public scan-give popup displays

## 📊 CURRENT STATE ASSESSMENT

### ✅ What's Working
1. **Jane Supporter (Donor)** - Donations ARE being tracked in her dashboard/wallet
2. **Donation Creation** - Records ARE being created in Firestore
3. **Backend API** - Payment session endpoint is functional
4. **Success Pages** - Flow completes and shows success screen

### ❌ What's Broken
1. **Michael Rodriguez (Participant)** 
   - Dashboard shows $0 total received
   - Wallet shows $0 balance
   - Public profile shows $0 donations
   - Scan-give popup shows $0 total received

2. **Donation Duplication Issue**
   - Jane's last $50 donation appears TWICE in her transaction list (same date: 2025-10-11)

3. **Shelter Metrics Not Updating**
   - Old Brewery Mission dashboard not reflecting donations
   - Public shelter page not showing updated metrics

## 🔍 ROOT CAUSE ANALYSIS

### Critical Issues Identified:

#### 1️⃣ **MULTIPLE DONATION COLLECTIONS CAUSING CHAOS**
```
Current Mess:
├── demo_donations (used by backend API)
├── tenants/YDJCJnuLGMC9mWOWDSOa/donations (used by success page)
└── Various services querying different collections
```

**Problem**: Different parts of the system write to different collections!
- `donate` page → calls backend API → writes to `demo_donations`
- Success page → writes AGAIN to `tenants/.../donations`
- Services query different collections for metrics

**Result**: Double entries, inconsistent data, $0 metrics everywhere

#### 2️⃣ **PARTICIPANT ID MISMATCH**
```typescript
// Success page uses Firebase UID:
participant_id: 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1'

// But backend API might use slug:
participant_id: 'michael-rodriguez'

// Queries look for one but find the other
```

#### 3️⃣ **USER STATS NOT UPDATING ATOMICALLY**
- Donations are created BUT user documents (`users/{uid}`) are not updated
- Fields like `total_received`, `donation_count`, `totalDonated` remain at 0
- Dashboards read from user documents, not donation collections

#### 4️⃣ **BACKEND WEBHOOK NOT ACTUALLY PROCESSING**
- The webhook simulation endpoint exists but may not be called
- `process_demo_webhook_notification` has donor stats update code but it's not executing
- No atomic updates to user documents after donation success

## 🛠️ COMPREHENSIVE FIX STRATEGY

### Phase 1: SIMPLIFY & CENTRALIZE (Priority 1) 🔥

#### Step 1.1: Single Source of Truth
**Decision**: Use `demo_donations` collection ONLY for all beta testing
- ✅ Simpler architecture
- ✅ Easier to debug
- ✅ Clear migration path to production

**Action Items**:
1. Remove all writes to `tenants/.../donations` from frontend
2. Update ALL services to query `demo_donations` collection
3. Update Firestore rules to allow reads from `demo_donations`

#### Step 1.2: Standardize Participant ID Format
**Decision**: ALWAYS use Firebase UID (`dFJNlIh2g4R8vAvxvIvWZtwu8zw1`), never slugs
- Store slug separately as `participant_slug` field
- Update all queries to use UID

**Action Items**:
1. Audit all donation creation code
2. Ensure `participant_id` = Firebase UID
3. Add `participant_slug` field for reference
4. Update participant lookup logic

#### Step 1.3: Atomic User Stats Updates
**Decision**: Update user documents atomically when donations succeed

**Files to Fix**:
```
apps/web/src/app/donation/success/page.tsx
  - Add atomic update to Michael's user doc
  - Add atomic update to Jane's user doc
  - Use runTransaction for consistency

apps/api/routers/demo_donations.py
  - Ensure webhook updates BOTH donor & participant
  - Use atomic increment operations
```

**Fields to Update**:
```typescript
// Participant (users/{participantUid})
{
  total_received: increment(directAmount), // 80% of donation
  donation_count: increment(1),
  housing_fund_balance: increment(housingAmount), // 15%
  updated_at: serverTimestamp()
}

// Donor (users/{donorUid})
{
  totalDonated: increment(totalAmount),
  donation_count: increment(1),
  lastDonationDate: serverTimestamp(),
  updated_at: serverTimestamp()
}

// Shelter (shelters/{shelterId} or tenants/{tenantId})
{
  operations_revenue: increment(operationsAmount), // 5%
  totalDonations: increment(totalAmount),
  donorCount: increment(1), // if unique donor
  updated_at: serverTimestamp()
}
```

### Phase 2: FIX DONATION FLOW (Priority 1) 🔥

#### Files Requiring Changes:

##### 1. `/donate` Page Flow
```typescript
// File: apps/web/src/app/donate/page.tsx

handleDonate() {
  // ✅ Already passing donor_info correctly
  // ❌ Need to ensure participant_id is Firebase UID
  
  FIX:
  - Look up participant by slug FIRST
  - Get Firebase UID
  - Send UID to backend, not slug
}
```

##### 2. Success Page Flow
```typescript
// File: apps/web/src/app/donation/success/page.tsx

useEffect() {
  // ❌ Currently writes to tenants/.../donations
  // ❌ Only updates participant stats, not donor stats
  
  FIX:
  1. REMOVE direct Firestore writes
  2. Call backend webhook to process donation
  3. Let backend handle ALL updates atomically
  
  OR:
  
  1. Write to demo_donations ONLY
  2. Atomically update participant user doc
  3. Atomically update donor user doc
  4. Update shelter doc
}
```

##### 3. Backend Webhook
```typescript
// File: apps/api/routers/demo_donations.py

process_demo_webhook_notification() {
  // ✅ Already has update_donor_stats
  // ❌ Need to ensure it's called
  // ❌ Need to add update_participant_stats
  // ❌ Need to add update_shelter_stats
  
  FIX:
  1. Get donation by reference
  2. Update participant stats atomically
  3. Update donor stats atomically
  4. Update shelter stats atomically
  5. Mark donation as processed
}
```

##### 4. Donation Metrics Service
```typescript
// File: apps/web/src/services/donationMetricsService.ts

getDonationMetrics() {
  // ❌ Queries tenants/.../donations
  // ❌ Complex participant ID matching logic
  
  FIX:
  1. Query demo_donations ONLY
  2. Use Firebase UID for participant_id
  3. Simplify query logic
  
  OR BETTER:
  
  1. Read directly from user document
  2. Fall back to donation query if needed
  3. Cache results
}
```

##### 5. Participant Public Profile
```typescript
// File: apps/web/src/app/participant/[id]/ParticipantProfileClient.tsx

fetchParticipantDonations() {
  // ❌ Uses donationMetricsService which queries wrong collection
  
  FIX:
  1. Read from user document FIRST
  2. Display total_received and donation_count from user doc
  3. Only query donations for transaction history
}
```

##### 6. Donor Dashboard & Wallet
```typescript
// Files: 
// - apps/web/src/app/dashboard/donor/page.tsx
// - apps/web/src/app/dashboard/donor/wallet/page.tsx

FIX:
1. Read from user document for totals
2. Query demo_donations for transaction history
3. Ensure correct donor_id field in queries
```

##### 7. Participant Dashboard & Wallet
```typescript
// Files:
// - apps/web/src/app/dashboard/participant/page.tsx
// - apps/web/src/app/dashboard/participant/wallet/page.tsx

FIX:
1. Read from user document for totals
2. Query demo_donations for transaction history
3. Use Firebase UID, not slug
```

### Phase 3: FIRESTORE RULES (Priority 1) 🔥

```javascript
// File: firestore.rules

// Add rules for demo_donations collection
match /demo_donations/{donationId} {
  // Allow authenticated users to read their own donations
  allow read: if request.auth != null && (
    resource.data.donor_id == request.auth.uid ||
    resource.data.participant_id == request.auth.uid
  );
  
  // Allow backend to write
  allow write: if request.auth.token.admin == true;
  
  // Allow participants to read donations where they are recipient
  allow list: if request.auth != null && 
    request.auth.uid in resource.data.participant_id;
  
  // Allow donors to read their donations
  allow list: if request.auth != null && 
    request.auth.uid == resource.data.donor_id;
}
```

### Phase 4: DATA CLEANUP (Priority 2)

#### Script to Clean & Migrate Data
```javascript
// File: scripts/clean-demo-donations.js

/**
 * 1. Query all donations from tenants/.../donations
 * 2. Migrate to demo_donations if not already there
 * 3. Standardize participant_id to Firebase UID
 * 4. Recalculate user stats from donations
 * 5. Update user documents atomically
 */
```

## 🧪 TESTING CHECKLIST

### Test Flow 1: Scan & Give (Anonymous/Logged Out)
1. Navigate to `/scan-give`
2. Click "Simulate Donation"
3. Enter $25
4. Complete flow
5. **Verify**:
   - ✅ Donation in `demo_donations`
   - ✅ Michael's user doc updated (+$20 to total_received)
   - ✅ Michael's public profile shows $20
   - ✅ Scan-give popup shows updated total
   - ✅ Shelter doc updated (+$1.25 operations)

### Test Flow 2: Scan & Give (Logged In as Jane)
1. Login as Jane Supporter
2. Navigate to `/scan-give` OR `/donate?demo=true&participant=michael-rodriguez`
3. Donate $100
4. **Verify**:
   - ✅ Donation in `demo_donations` with donor_id: Jane's UID
   - ✅ Michael's stats: +$80
   - ✅ Jane's stats: +$100 totalDonated
   - ✅ Shelter stats: +$5 operations
   - ✅ Jane's dashboard shows 1 new donation
   - ✅ Michael's dashboard shows 1 new donation
   - ✅ NO DUPLICATES in transaction history

### Test Flow 3: Direct Shelter Donation
1. Navigate to `/donate?shelter=old-brewery-mission`
2. Donate $50
3. **Verify**:
   - ✅ Donation in `demo_donations`
   - ✅ Shelter doc updated
   - ✅ No participant stats updated (direct donation)

### Test Flow 4: Donor Dashboard Donation
1. Login as Jane
2. Go to `/dashboard/donor/donations`
3. Click "Make New Donation"
4. Complete flow
5. **Verify**:
   - ✅ All metrics sync correctly

## 📁 FILES REQUIRING UPDATES

### Critical Priority 🔥
1. `apps/web/src/app/donation/success/page.tsx` - Fix donation creation & user updates
2. `apps/api/routers/demo_donations.py` - Fix webhook processing
3. `apps/web/src/services/donationMetricsService.ts` - Query correct collection
4. `apps/web/src/app/donate/page.tsx` - Ensure UID sent, not slug
5. `firestore.rules` - Add demo_donations rules

### High Priority ⚠️
6. `apps/web/src/app/participant/[id]/ParticipantProfileClient.tsx` - Read from user doc
7. `apps/web/src/app/dashboard/participant/page.tsx` - Fix metrics display
8. `apps/web/src/app/dashboard/participant/wallet/page.tsx` - Fix wallet display
9. `apps/web/src/app/dashboard/donor/page.tsx` - Verify donor stats
10. `apps/web/src/app/dashboard/donor/wallet/page.tsx` - Verify wallet display

### Medium Priority 📋
11. `apps/web/src/app/dashboard/shelter-admin/wallet/page.tsx` - Update shelter metrics
12. `apps/web/src/app/dashboard/shelters/[shelterId]/view/client-page.tsx` - Verify donations display
13. `scripts/clean-demo-donations.js` - Create cleanup script

## 🚀 EXECUTION PLAN

### Session 22.16 - Part 1 (Immediate)
1. ✅ Create this debug plan document
2. 🔥 Fix donation creation to use ONLY `demo_donations`
3. 🔥 Add atomic user stat updates to success page
4. 🔥 Update donationMetricsService to query `demo_donations`
5. 🔥 Update Firestore rules
6. 🧪 Test Flow 2 (logged in donation)

### Session 22.16 - Part 2 (Follow-up)
7. ⚠️ Update all dashboard components to read from user docs
8. ⚠️ Fix backend webhook to update all stats
9. 📋 Create data cleanup script
10. 🧪 Run full testing checklist
11. 📊 Verify all metrics sync across all dashboards

## 🎓 KEY LEARNINGS & SIMPLIFICATIONS

### Architectural Simplifications Needed:
1. **Single Collection for Demo**: `demo_donations` only
2. **User Doc as Source of Truth**: Store aggregated stats in user documents
3. **Atomic Updates**: Use Firestore transactions for consistency
4. **Standardized IDs**: Firebase UIDs everywhere, slugs for display only
5. **Backend Processing**: Let backend handle complex updates, frontend displays only

### Future Payment Rails (Production):
```
When Adyen is live:
├── Real donations → tenants/{tenantId}/donations
├── Demo donations → demo_donations (keep for testing)
└── Same user stat update logic for both
```

## 📞 MCP COMMANDS FOR DEBUGGING

```bash
# Check Michael's current stats
mcp_firebase_firestore_get_documents(paths=["users/dFJNlIh2g4R8vAvxvIvWZtwu8zw1"])

# Check Jane's current stats
mcp_firebase_firestore_get_documents(paths=["users/L8wZXmQJjhg7PyB7oIB9vGpE4Bh1"])

# Query all demo_donations
mcp_firebase_firestore_query_collection(
  collection_path="demo_donations",
  filters=[{"field": "status", "op": "EQUAL", "compare_value": {"string_value": "completed"}}],
  limit=50
)

# Check for duplicate donations (Jane's issue)
mcp_firebase_firestore_query_collection(
  collection_path="demo_donations",
  filters=[
    {"field": "donor_id", "op": "EQUAL", "compare_value": {"string_value": "L8wZXmQJjhg7PyB7oIB9vGpE4Bh1"}},
    {"field": "status", "op": "EQUAL", "compare_value": {"string_value": "completed"}}
  ],
  order={"orderBy": "created_at", "orderByDirection": "DESCENDING"},
  limit=20
)
```

## 🎯 SUCCESS CRITERIA

Before marking this session complete:
- [ ] Jane can donate $100 to Michael
- [ ] Michael's dashboard immediately shows +$80
- [ ] Michael's public profile shows +$80
- [ ] Scan-give popup shows updated total
- [ ] Jane's dashboard shows +$100 totalDonated
- [ ] Old Brewery Mission shows +$5 operations revenue
- [ ] NO duplicate donations in transaction history
- [ ] ALL metrics sync within 5 seconds
- [ ] Zero console errors during donation flow
- [ ] Firestore structure is clean and documented

---

**Created**: Session 22.15 → 22.16 Handoff
**Priority**: CRITICAL - Core Platform Functionality
**Estimated Effort**: 3-4 hours focused debugging
**Dependencies**: Firebase MCP, Firestore Admin SDK

