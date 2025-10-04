# Donation System Implementation Plan

**Version:** 1.0  
**Created:** October 4, 2025  
**Status:** 🚧 In Progress

---

## 📋 Overview

SHELTR needs a unified donation system that handles **two distinct donation flows**:

1. **Participant Donations** (QR Code → Individual Support)
2. **Shelter Donations** (Public Page → Organization Support)

Currently, only participant donations work (in demo mode). We need to implement shelter donations and eventually transition both to real payment processing.

---

## 🎯 Current State

### ✅ What Works:
- **Participant QR Donations**: 
  - URL: `/donate?demo=true&participant=michael-rodriguez`
  - Shows participant profile
  - SmartProof™ 80-15-5 breakdown
  - Demo mode payment simulation
  - Records transaction in Firestore
  - Updates participant metrics

### ❌ What's Broken:
- **Shelter Direct Donations**:
  - URL: `/donate?shelter=old-brewery-mission`
  - Currently loads infinitely (no shelter handling logic)
  - No shelter profile display
  - No shelter-specific breakdown
  - No shelter donation recording

---

## 🏗️ Architecture Design

### Donation Flow Types

```
┌─────────────────────────────────────────────────────────────┐
│                    DONATION ENTRY POINTS                     │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐      ┌──────▼───────┐
        │  PARTICIPANT   │      │   SHELTER    │
        │   DONATION     │      │  DONATION    │
        └───────┬────────┘      └──────┬───────┘
                │                      │
        ┌───────▼────────┐      ┌──────▼───────┐
        │   80-15-5      │      │   100% to    │
        │  SmartProof™   │      │   Shelter    │
        │   Breakdown    │      │  Operations  │
        └───────┬────────┘      └──────┬───────┘
                │                      │
                └──────────┬───────────┘
                           │
                   ┌───────▼────────┐
                   │  PAYMENT PAGE  │
                   │  (Adyen/Demo)  │
                   └───────┬────────┘
                           │
                   ┌───────▼────────┐
                   │ FIRESTORE DB   │
                   │  + Analytics   │
                   └────────────────┘
```

---

## 📊 Data Models

### Participant Donation

```typescript
interface ParticipantDonation {
  id: string;
  type: 'participant';
  participant_id: string;
  participant_name: string;
  shelter_id?: string;
  shelter_name?: string;
  donor_id?: string;  // If logged in
  donor_email?: string;
  amount: number;
  breakdown: {
    participant_direct: number;  // 80%
    housing_fund: number;         // 15%
    platform_operations: number;  // 5%
  };
  payment_method: 'demo' | 'adyen' | 'stripe';
  payment_reference?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: Timestamp;
  metadata?: {
    qr_scanned: boolean;
    source: 'web' | 'mobile' | 'qr';
  };
}
```

### Shelter Donation

```typescript
interface ShelterDonation {
  id: string;
  type: 'shelter';
  shelter_id: string;
  shelter_name: string;
  donor_id?: string;  // If logged in
  donor_email?: string;
  amount: number;
  breakdown: {
    shelter_operations: number;  // 95%
    platform_fee: number;        // 5%
  };
  payment_method: 'demo' | 'adyen' | 'stripe';
  payment_reference?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: Timestamp;
  designated_purpose?: string; // e.g., "General Operations", "Emergency Supplies", "Housing Fund"
  metadata?: {
    source: 'web' | 'mobile';
    referrer?: string;
  };
}
```

---

## 🔧 Implementation Steps

### Phase 1: Shelter Donation UI (Immediate)

**File:** `/apps/web/src/app/donate/page.tsx`

#### Tasks:
- [x] Add `Shelter` interface
- [x] Add `shelterId` parameter handling
- [x] Add `donationType` detection
- [ ] Create `loadShelter()` function
- [ ] Create shelter donation UI component
- [ ] Add shelter-specific breakdown (95-5 model)
- [ ] Update page title and breadcrumbs based on type
- [ ] Add "Donate to [Shelter Name]" header

#### Shelter Loading Logic:

```typescript
const loadShelter = async () => {
  if (!shelterId) return;
  
  try {
    // Get shelter from tenant service
    const tenants = await tenantService.getAllShelterTenants();
    const matchingShelter = tenants.find(t => 
      t.id === shelterId || 
      t.name.toLowerCase().replace(/\s+/g, '-') === shelterId
    );
    
    if (matchingShelter) {
      setShelter({
        id: matchingShelter.id,
        name: matchingShelter.name,
        description: matchingShelter.address || 'Supporting individuals experiencing homelessness',
        address: matchingShelter.address || '',
        city: matchingShelter.city || '',
        province: matchingShelter.province || '',
        capacity: 300,
        services: [
          'Emergency Shelter',
          'Meals',
          'Case Management',
          'Housing Support'
        ]
      });
    }
  } catch (error) {
    console.error('Error loading shelter:', error);
  } finally {
    setLoading(false);
  }
};
```

### Phase 2: Shelter Donation Processing

#### Tasks:
- [ ] Create API endpoint: `POST /api/donations/shelter`
- [ ] Implement Firestore `shelter_donations` collection
- [ ] Update shelter metrics on donation
- [ ] Send confirmation email
- [ ] Create shelter donation receipt

### Phase 3: Real Payment Integration

#### Tasks:
- [ ] Integrate Adyen Checkout API
- [ ] Create payment sessions
- [ ] Handle payment callbacks
- [ ] Implement webhook listeners
- [ ] Add payment status tracking
- [ ] Implement refund logic

### Phase 4: QR Code Real Payments

#### Tasks:
- [ ] Update QR codes to point to real payment flow
- [ ] Remove demo mode flags
- [ ] Add payment method selection (card, Apple Pay, Google Pay)
- [ ] Implement instant notifications to participants
- [ ] Add donation receipts via email

---

## 💰 Breakdown Models

### Participant Donations (SmartProof™ 80-15-5)

```
$100 Donation Breakdown:
├─ $80  → Participant Direct Support (80%)
├─ $15  → Housing Fund (15%)
└─ $5   → Platform Operations (5%)
```

### Shelter Donations (Direct Support 95-5)

```
$100 Donation Breakdown:
├─ $95  → Shelter Operations (95%)
└─ $5   → Platform Fee (5%)
```

---

## 🗄️ Database Collections

### 1. `participant_donations`
- Tracks all participant-specific donations
- Links to `participants` collection
- Used for participant dashboards and goals

### 2. `shelter_donations`
- Tracks all shelter-direct donations
- Links to `tenants` collection
- Used for shelter admin dashboards

### 3. `donation_analytics` (Unified)
- Aggregates both types for platform analytics
- Powers Super Admin dashboard
- Monthly/yearly reports

---

## 🎨 UI Components Needed

### Shelter Donation Card

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center gap-3">
      <Building className="h-8 w-8" />
      <div>
        <CardTitle>{shelter.name}</CardTitle>
        <CardDescription>{shelter.city}, {shelter.province}</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground mb-4">{shelter.description}</p>
    
    {/* Services */}
    <div className="flex flex-wrap gap-2 mb-4">
      {shelter.services.map(service => (
        <Badge key={service} variant="secondary">{service}</Badge>
      ))}
    </div>
    
    {/* Capacity */}
    <div className="bg-muted rounded-lg p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Shelter Capacity</span>
        <span className="font-bold">{shelter.capacity} beds</span>
      </div>
    </div>
  </CardContent>
</Card>
```

### Shelter Breakdown Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Donation Breakdown</CardTitle>
    <CardDescription>Direct support to shelter operations</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
        <span className="font-medium">Shelter Operations</span>
        <span className="text-xl font-bold text-green-600">95%</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
        <span className="font-medium">Platform Fee</span>
        <span className="text-xl font-bold text-blue-600">5%</span>
      </div>
    </div>
    
    {/* Amount Breakdown */}
    <div className="mt-4 pt-4 border-t space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">To Shelter</span>
        <span className="font-medium">${(selectedAmount * 0.95).toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Platform Fee</span>
        <span className="font-medium">${(selectedAmount * 0.05).toFixed(2)}</span>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 🧪 Testing Plan

### Test URLs:

1. **Participant Donation (Current)**:
   - `http://localhost:3000/donate?demo=true&participant=michael-rodriguez`
   - Should show Michael's profile
   - Should show 80-15-5 breakdown

2. **Shelter Donation (New)**:
   - `http://localhost:3000/donate?shelter=old-brewery-mission`
   - Should show shelter profile
   - Should show 95-5 breakdown

3. **Shelter Donation with ID**:
   - `http://localhost:3000/donate?shelter=YDJCJnuLGMC9mWOWDSOa`
   - Should work with shelter ID

### Test Scenarios:

- [ ] Load shelter donation page
- [ ] Select donation amount
- [ ] See correct breakdown (95-5)
- [ ] Process demo donation
- [ ] Verify Firestore record
- [ ] Check shelter metrics update
- [ ] Test logged-in donor
- [ ] Test anonymous donor

---

## 🚀 Deployment Checklist

- [ ] Update Firestore security rules for `shelter_donations`
- [ ] Deploy composite indexes
- [ ] Update API endpoints
- [ ] Test in production
- [ ] Update documentation
- [ ] Train shelter admins on viewing donations

---

## 📝 Next Steps

**Immediate (Tonight):**
1. Finish `/donate` page to handle shelter donations
2. Create shelter donation UI
3. Test demo flow end-to-end

**Short Term (This Week):**
4. Implement shelter donation recording
5. Update shelter dashboards to show donations
6. Create donation receipts

**Long Term (Next Sprint):**
7. Integrate Adyen for real payments
8. Remove demo flags
9. Go live with real transactions

---

**End of Document**

