# 🔍 Demo Donation Flow Analysis
## Jane Supporter → Michael Rodriguez ($200 Donation)

**Date**: October 7, 2025  
**Scenario**: Jane Supporter donates $200 to Michael Rodriguez (onboarded from Old Brewery Mission)

---

## 📊 Expected SmartFund™ Distribution

| Recipient | Amount | Percentage | Notes |
|-----------|--------|------------|-------|
| Michael Rodriguez (Direct) | $160 | 80% | Loaded to virtual card |
| Michael's Housing Fund | $30 | 15% | Emergency housing deposit |
| Old Brewery Mission | $10 | 5% | Shelter operations (Michael is affiliated) |
| **TOTAL** | **$200** | **100%** | |

---

## 🔄 Current Backend Flow

### **1. Payment Session Creation**
**File**: `apps/api/routers/demo_donations.py` → `create_payment_session()`
**Lines**: 173-220

```python
# Creates donation record in Firestore
donation_data = {
    "id": donation_id,
    "participant_id": request.participant_id,  # Michael's ID
    "amount": {"total": request.amount, "currency": "USD"},
    "status": "pending",
    "created_at": datetime.now(timezone.utc)
}

# Saved to: demo_donations/{donation_id}
```

**✅ WORKS**: Creates payment session successfully

---

### **2. Payment Processing (Demo Mode)**
**File**: `apps/api/routers/demo_donations.py` → `simulate_donation_success()`
**Lines**: 50-97

```python
# Simulates successful payment
# Triggers webhook notification processing
await process_demo_webhook_notification(mock_notification)
```

**✅ WORKS**: Simulates payment success

---

### **3. SmartFund Distribution Calculation**
**File**: `apps/api/services/adyen_service.py` → `process_smartfund_distribution()`
**Lines**: 232-268

```python
# Current implementation (PROBLEM HERE!)
distribution = {
    "total": total_amount,
    "direct": round(total_amount * 0.80, 2),      # $160 to participant
    "housing": round(total_amount * 0.15, 2),     # $30 to housing fund
    "operations": round(total_amount * 0.05, 2),  # $10 to operations
    "currency": "USD"
}
```

**❌ ISSUE**: Always labeled as "operations" - **doesn't check for shelter affiliation!**

**🔧 NEEDS**: 
- Check if participant has `shelter_id`
- If yes, route 5% to shelter
- If no, route 5% to platform operations

---

### **4. Donation Record Update**
**File**: `apps/api/routers/demo_donations.py` → `update_donation_on_success()`
**Lines**: 283-311

```python
doc.reference.update({
    "status": "completed",
    "smartfund_distribution": distribution,  # Stores the distribution
    "completed_at": datetime.now(timezone.utc)
})
```

**✅ WORKS**: Updates donation record with distribution details

---

### **5. Participant Stats Update**
**File**: `apps/api/services/demo_participant_service.py` → `update_participant_from_donation()`
**Lines**: 408-477

```python
# Updates participant's total_received and donation_count
doc_ref.update({
    "total_received": new_total,          # Adds $200 to total
    "donation_count": new_count,          # Increments count
    "updated_at": datetime.now(timezone.utc)
})
```

**✅ WORKS**: Updates Michael's stats

**❌ ISSUE**: Updates with **total donation ($200)**, not **direct amount ($160)**

**🔧 NEEDS**: Should update `total_received` with `distribution["direct"]` ($160), not total ($200)

---

## 🗄️ Database Collections Updated

### **1. `demo_donations` Collection**
```javascript
{
  id: "uuid",
  participant_id: "michael-rodriguez-id",
  amount: { total: 200, currency: "USD" },
  status: "completed",
  smartfund_distribution: {
    total: 200,
    direct: 160,
    housing: 30,
    operations: 10  // ❌ Should be "shelter" when affiliated
  },
  completed_at: "2025-10-07T..."
}
```

### **2. `demo_participants` or `users` Collection**
```javascript
{
  id: "michael-rodriguez-id",
  firstName: "Michael",
  lastName: "Rodriguez",
  shelter_id: "old-brewery-mission",  // ✅ HAS SHELTER
  shelter_name: "Old Brewery Mission",
  total_received: 200,  // ❌ Should be 160 (direct only)
  donation_count: 1,
  updated_at: "2025-10-07T..."
}
```

### **3. `shelters` Collection** (NOT CURRENTLY UPDATED)
```javascript
// ❌ MISSING: Old Brewery Mission should receive:
{
  id: "old-brewery-mission",
  name: "Old Brewery Mission",
  total_operations_received: 10,  // 5% from this donation
  donation_count: 1,
  updated_at: "2025-10-07T..."
}
```

---

## 🎯 Dashboard Updates Required

### **Jane Supporter (Donor Dashboard)**
**Location**: `/dashboard/donor`

**✅ Currently Updates:**
- Total Donated: $200
- SHELTR Rewards: 0 tokens
- People Helped: 1 (Michael)

**Should Show:**
- Donation history with SmartFund breakdown
- Impact: $160 direct to Michael, $30 to housing, $10 to Old Brewery Mission

---

### **Michael Rodriguez (Participant Dashboard)**
**Location**: `/dashboard/participant`

**✅ Currently Updates:**
- Total Received: $200 ❌ (Should be $160)
- Donation Count: 1 ✅
- Housing Fund Progress: +$30 ✅

**Should Show:**
- $0 → $160 (direct support)
- $0 → $30 (housing fund)
- Donations: 0 → 1

---

### **Old Brewery Mission (Shelter Admin Dashboard)**
**Location**: `/dashboard/shelter-admin`

**❌ NOT CURRENTLY UPDATED**

**Should Show:**
- Operations Revenue: $10
- Affiliated Participants: Michael Rodriguez
- Total Participant Donations: $200
- Our Share (5%): $10

---

### **Platform Admin/Super Admin Dashboard**
**Location**: `/dashboard`

**Partial Updates:**
- Total donations processed
- Platform metrics

**Should Track:**
- Total routed to shelters vs platform
- Per-shelter operations revenue
- SmartFund distribution analytics

---

## 🚨 Critical Issues to Fix

### **Issue #1: Shelter Routing Logic Missing**
**File**: `apps/api/services/adyen_service.py` → `process_smartfund_distribution()`

**Current**:
```python
distribution = {
    "operations": round(total_amount * 0.05, 2)  # Always "operations"
}
```

**Needs**:
```python
# Get participant's shelter_id
participant_data = await get_participant_data(participant_id)
shelter_id = participant_data.get("shelter_id")

if shelter_id:
    distribution = {
        "shelter_operations": round(total_amount * 0.05, 2),
        "shelter_id": shelter_id,
        "shelter_name": participant_data.get("shelter_name")
    }
else:
    distribution = {
        "platform_operations": round(total_amount * 0.05, 2)
    }
```

---

### **Issue #2: Participant `total_received` Incorrect**
**File**: `apps/api/services/demo_participant_service.py` → `update_participant_from_donation()`

**Current**:
```python
new_total = current_total + donation_amount  # Adds $200
```

**Should Be**:
```python
new_total = current_total + direct_amount  # Adds $160 (80%)
```

---

### **Issue #3: Shelter Stats Not Updated**
**Missing**: No service to update shelter's operations revenue

**Needs**:
```python
# New function in shelter_service.py
async def update_shelter_operations_revenue(
    shelter_id: str, 
    amount: float,
    participant_id: str,
    donation_id: str
):
    shelter_ref = db.collection('shelters').document(shelter_id)
    shelter_ref.update({
        "total_operations_received": firestore.Increment(amount),
        "operations_donation_count": firestore.Increment(1),
        "updated_at": datetime.now(timezone.utc)
    })
```

---

## ✅ Proposed Solution

### **1. Enhanced `process_smartfund_distribution()`**
```python
async def process_smartfund_distribution(
    self, 
    payment_notification: Dict[str, Any],
    participant_id: str  # NEW PARAMETER
) -> Dict[str, Any]:
    # Get participant data to check shelter affiliation
    participant_data = await self.get_participant_data(participant_id)
    shelter_id = participant_data.get("shelter_id")
    
    # Calculate base distribution
    total_amount = amount_value / 100
    direct = round(total_amount * 0.80, 2)
    housing = round(total_amount * 0.15, 2)
    operations = round(total_amount * 0.05, 2)
    
    distribution = {
        "total": total_amount,
        "direct": direct,
        "housing": housing,
        "currency": "USD"
    }
    
    # Route 5% based on shelter affiliation
    if shelter_id:
        distribution["shelter_operations"] = operations
        distribution["shelter_id"] = shelter_id
        distribution["shelter_name"] = participant_data.get("shelter_name")
        distribution["recipient_type"] = "shelter"
    else:
        distribution["platform_operations"] = operations
        distribution["recipient_type"] = "platform"
    
    return distribution
```

### **2. Update Shelter Stats**
```python
# In process_demo_webhook_notification()
if distribution.get("recipient_type") == "shelter":
    await shelter_service.update_operations_revenue(
        shelter_id=distribution["shelter_id"],
        amount=distribution["shelter_operations"],
        participant_id=participant_id,
        donation_id=donation_id
    )
```

### **3. Fix Participant Total Received**
```python
# In update_participant_from_donation()
new_total = current_total + distribution["direct"]  # Only direct amount
```

---

## 📈 Expected Result After Fixes

### **For $200 Donation to Michael:**

**Michael's Dashboard:**
- Total Received: $0 → $160 ✅
- Housing Fund: $0 → $30 ✅
- Donation Count: 0 → 1 ✅

**Old Brewery Mission Dashboard:**
- Operations Revenue: $0 → $10 ✅
- Participant Donations Facilitated: $200 ✅

**Jane's Donor Dashboard:**
- Total Donated: $200 ✅
- Impact Breakdown:
  - 80% ($160) → Michael
  - 15% ($30) → Housing Fund
  - 5% ($10) → Old Brewery Mission ✅

**Platform Admin Dashboard:**
- Total Donations: $200 ✅
- Routed to Shelters: $10 ✅
- Routed to Platform: $0 ✅

---

## 🎯 Implementation Priority

1. **HIGH**: Fix shelter routing logic in `adyen_service.py`
2. **HIGH**: Fix participant `total_received` calculation
3. **MEDIUM**: Add shelter operations revenue tracking
4. **MEDIUM**: Update all dashboard displays
5. **LOW**: Add analytics for shelter vs platform routing

---

## 🧪 Testing Checklist

- [ ] Jane donates $200 to Michael
- [ ] Distribution: $160 (Michael), $30 (Housing), $10 (Old Brewery Mission)
- [ ] Michael's dashboard shows $160 total_received
- [ ] Old Brewery Mission dashboard shows $10 operations revenue
- [ ] Jane's dashboard shows correct SmartFund breakdown
- [ ] Donation record stores correct distribution with shelter info
- [ ] Platform admin can see shelter routing analytics

---

**Status**: ⚠️ **Partially Implemented** - Core distribution works, shelter routing needs enhancement
**Next Steps**: Implement shelter affiliation check and routing logic

