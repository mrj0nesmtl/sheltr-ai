# Shelter Statistics Fix - October 21, 2025

## 🎯 **OBJECTIVE**

Fix shelter statistics on the Shelter Network dashboard and add notifications component to shelter detail pages.

---

## 🔴 **PROBLEMS IDENTIFIED**

### Problem 1: Incorrect Notification Counts
- **Location**: `/dashboard/shelters` (Shelter Network page)
- **Issue**: Notification counts were querying `shelter_email_signups` instead of `shelter_notifications`
- **Impact**: Showed 0 notifications even though shelter notifications existed

### Problem 2: Missing Donor Counts
- **Location**: `/dashboard/shelters` (Shelter Network cards)
- **Issue**: `shelter.totalDonors` was not being calculated from actual donation data
- **Impact**: All shelters showed 0 donors despite having donations

### Problem 3: Missing Notifications Component
- **Location**: `/dashboard/shelters/[shelterId]/view` (Shelter detail page)
- **Issue**: No component displaying shelter-specific notifications
- **Impact**: No way to view notifications for individual shelters

---

## ✅ **SOLUTIONS IMPLEMENTED**

### 1. Fixed Notification Count Query

**File**: `apps/web/src/app/dashboard/shelters/page.tsx`

**Change**: Updated `loadNotificationCounts()` function to query the correct collection:

```typescript
// OLD (WRONG):
const signupsRef = collection(db, 'shelter_email_signups');

// NEW (CORRECT):
const notificationsRef = collection(db, 'shelter_notifications');
```

**Result**: Notification counts now accurately reflect shelter notifications from the unified notification system.

---

### 2. Added Donor Statistics Calculation

**File**: `apps/web/src/app/dashboard/shelters/page.tsx`

**New Function**: `calculateShelterDonorStats()`

```typescript
const calculateShelterDonorStats = async () => {
  try {
    console.log('🔄 Calculating shelter donor stats from donations...');
    
    // Get all donations
    const donationsRef = collection(db, 'donations');
    const donationsSnapshot = await getDocs(donationsRef);
    
    // Track unique donors and donation totals per shelter
    const shelterDonorCounts: Record<string, Set<string>> = {};
    const shelterDonationTotals: Record<string, number> = {};
    
    // Get all participants to map participant_id to shelter_id
    const participantsRef = collection(db, 'users');
    const participantsQuery = query(participantsRef, where('role', '==', 'participant'));
    const participantsSnapshot = await getDocs(participantsQuery);
    
    const participantToShelter: Record<string, string> = {};
    participantsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.shelter_id) {
        participantToShelter[doc.id] = data.shelter_id;
      }
    });
    
    // Process donations
    donationsSnapshot.forEach((doc) => {
      const donation = doc.data();
      const participantId = donation.participant_id || donation.participantId;
      const donorId = donation.donor_id || donation.donorId;
      const amount = donation.amount || 0;
      
      // Get shelter_id from participant
      const shelterId = participantId ? participantToShelter[participantId] : null;
      
      if (shelterId && donorId) {
        // Track unique donors
        if (!shelterDonorCounts[shelterId]) {
          shelterDonorCounts[shelterId] = new Set();
        }
        shelterDonorCounts[shelterId].add(donorId);
        
        // Track donation totals
        shelterDonationTotals[shelterId] = (shelterDonationTotals[shelterId] || 0) + amount;
      }
    });
    
    // Update shelters with calculated stats
    const updatedShelters = shelters.map(shelter => ({
      ...shelter,
      totalDonors: shelterDonorCounts[shelter.id]?.size || 0,
      totalDonations: shelterDonationTotals[shelter.id] || 0
    }));
    
    setShelters(updatedShelters);
    console.log('✅ Updated shelter donor and donation stats');
  } catch (error) {
    console.error('❌ Error calculating shelter donor stats:', error);
  }
};
```

**How it works**:
1. Fetches all donations from Firestore
2. Maps participants to their shelters
3. Counts unique donors per shelter
4. Calculates total donation amounts per shelter
5. Updates shelter state with calculated values

**Called in**:
```typescript
useEffect(() => {
  if (shelters.length > 0) {
    calculateShelterDonorStats();
  }
}, [shelters.length]);
```

---

### 3. Added Shelter Notifications Component

**File**: `apps/web/src/app/dashboard/shelters/[shelterId]/view/client-page.tsx`

**New Section**: Added notifications card after the Financial Overview section:

```typescript
{/* Shelter Notifications */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Bell className="h-5 w-5" />
      Recent Notifications
    </CardTitle>
    <CardDescription>
      Email signups, contact inquiries, and administrative alerts for this shelter
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {notificationCount === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No notifications yet</p>
          <p className="text-sm mt-1">
            Email signups and inquiries will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Email Signups</p>
                <p className="text-xs text-muted-foreground">From public shelter page</p>
              </div>
            </div>
            <Badge variant="outline">{notificationCount} total</Badge>
          </div>
          <Link href={`/dashboard/shelters/${shelterId}/notifications`}>
            <Button variant="outline" className="w-full mt-4">
              <Bell className="h-4 w-4 mr-2" />
              View All Notifications
            </Button>
          </Link>
        </div>
      )}
    </div>
  </CardContent>
</Card>
```

**Features**:
- Displays notification count
- Shows empty state when no notifications
- Links to dedicated notifications page for the shelter
- Clean, consistent UI with other dashboard cards

---

## 📊 **UPDATED SHELTER CARD STATS**

### Before:
```
Participants: 1
Donors: 0 ❌
Donations: $2,900
Notifications: 0 ❌
```

### After:
```
Participants: 1
Donors: [calculated from donations] ✅
Donations: $2,900
Notifications: [from shelter_notifications] ✅
```

---

## 🧪 **TESTING CHECKLIST**

### Shelter Network Dashboard (`/dashboard/shelters`)
- [ ] Verify donor counts appear correctly for shelters with donations
- [ ] Verify notification counts reflect `shelter_notifications` collection
- [ ] Verify donation totals match actual donation amounts
- [ ] Check that Old Brewery Mission shows correct stats

### Shelter Detail Page (`/dashboard/shelters/[shelterId]/view`)
- [ ] Verify "Recent Notifications" card appears
- [ ] Verify notification count is displayed
- [ ] Verify "View All Notifications" button works
- [ ] Check empty state when no notifications

### Data Integrity
- [ ] Compare donor counts with actual unique donors in donations
- [ ] Verify notification counts match Firestore `shelter_notifications`
- [ ] Ensure participant counts haven't changed (should remain accurate)

---

## 📁 **FILES MODIFIED**

1. **`apps/web/src/app/dashboard/shelters/page.tsx`**
   - Fixed `loadNotificationCounts()` to use `shelter_notifications`
   - Added `calculateShelterDonorStats()` function
   - Added second `useEffect` to trigger donor stats calculation

2. **`apps/web/src/app/dashboard/shelters/[shelterId]/view/client-page.tsx`**
   - Added `Bell` icon import
   - Added "Recent Notifications" card component
   - Added link to dedicated notifications page

---

## 🔗 **RELATED SYSTEMS**

### Notification System
- Uses unified `shelter_notifications` collection
- Follows notification system overhaul architecture
- Compatible with notification preferences and filtering

### Donation System
- Reads from `donations` collection
- Maps donations to shelters via participant's `shelter_id`
- Tracks unique donors using Set data structure

### User Management
- Queries `users` collection for participant data
- Uses `shelter_id` field for shelter affiliation
- Role-based filtering (`role === 'participant'`)

---

## ⚠️ **KNOWN LIMITATIONS**

1. **Notification Count Accuracy**
   - Currently counts all notifications for shelter admins
   - Ideally should group by `shelter_id` directly
   - Requires shelter admin to have `shelter_id` in custom claims

2. **Performance**
   - `calculateShelterDonorStats()` queries all donations
   - May be slow with large datasets (1000+ donations)
   - Consider adding pagination or server-side aggregation

3. **Real-time Updates**
   - Stats are calculated on page load only
   - Not real-time (no snapshot listeners)
   - Requires page refresh to see new data

---

## 🚀 **FUTURE ENHANCEMENTS**

### Phase 1: Optimization
- [ ] Add Firestore indexes for shelter stats queries
- [ ] Implement server-side aggregation for donor counts
- [ ] Add caching layer for calculated statistics

### Phase 2: Real-time Updates
- [ ] Add snapshot listeners for live stat updates
- [ ] Implement real-time notification badges
- [ ] Add WebSocket support for instant updates

### Phase 3: Advanced Analytics
- [ ] Add donor retention metrics
- [ ] Track notification response rates
- [ ] Implement trending/growth indicators
- [ ] Add time-series charts for donations

---

## 📝 **COMMIT SUMMARY**

```bash
fix: shelter stats calculation and notifications

- Fix notification counts to use shelter_notifications collection
- Add donor statistics calculation from donations
- Add notifications component to shelter detail page
- Update shelter cards to show accurate donor counts
```

---

## ✅ **VALIDATION STEPS**

1. **Refresh Shelter Network Dashboard**
   ```
   http://localhost:3000/dashboard/shelters
   ```
   - Check Old Brewery Mission card
   - Verify donor count is no longer 0
   - Verify notification count reflects real data

2. **Open Shelter Detail Page**
   ```
   http://localhost:3000/dashboard/shelters/old-brewery-mission/view
   ```
   - Scroll to "Recent Notifications" section
   - Verify notification count appears
   - Click "View All Notifications" button

3. **Test with Multiple Shelters**
   - Verify stats vary between shelters
   - Check that shelters with no donations show 0
   - Ensure calculations don't double-count

---

## 📚 **RELATED DOCUMENTATION**

- [Notification System Overhaul](./NOTIFICATION-SYSTEM-OVERHAUL-COMPLETE.md)
- [Unified Notification Service](./NOTIFICATION-PHASE-2-COMPLETE.md)
- [Database Schema](../03-api/database-schema.md)
- [Shelter Network Guide](../07-reference/shelter-network-guide.md)

---

**Status**: ✅ Ready for Testing  
**Author**: Claude (Anthropic AI)  
**Date**: October 21, 2025, 4:40 PM EDT  
**Version**: 2.57.1

