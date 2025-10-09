# 📊 Notification Dashboard Metrics Guide

**Date:** October 9, 2025  
**Purpose:** Comprehensive guide to all notification metrics in the admin dashboard

---

## 📍 Dashboard Location

**Path:** `/dashboard/notifications`  
**Access:** Super Admin, Platform Admin, Shelter Admin

---

## 🎯 Metric Cards Overview

### 1. **Shelter Email Signups** 

**What It Tracks:**  
Individual shelter page email signups. When a visitor goes to a specific shelter's public page (e.g., `/old-brewery-mission`) and signs up for updates.

**Collection:** `shelter_email_signups`  
**Triggered By:**  
- Visitor enters email on individual shelter public page
- Stored in `apps/web/src/app/[slug]/ShelterPageClient.tsx`
- Service: `notificationService.createShelterEmailSignup()`

**Who Gets Notified:**  
- ❌ **CURRENTLY BROKEN** - No notifications are sent
- 🔴 **NEEDS FIX** - Should notify:
  - Shelter Admin (for their shelter)
  - Platform Admins
  - Super Admins

**Data Fields:**
```typescript
{
  email: string;
  name?: string;
  phone?: string;
  shelter_id: string;
  shelter_name: string;
  interests?: string[];
  message?: string;
  signup_date: Timestamp;
  source: 'public_page';
  page: 'shelter_public_page';
}
```

**Admin View:**  
- Total signups: All shelter email signups across all shelters
- New this week: Signups from the last 7 days

---

### 2. **Newsletter Subscribers**

**What It Tracks:**  
Platform-wide newsletter signups from various pages (landing, about, team, docs, etc.).

**Collection:** `contact_inquiries` (unified)  
**Filter:** `inquiry_type === 'newsletter_signup'`

**Triggered By:**  
- Newsletter signup component on landing page
- Newsletter signup component on about page
- Newsletter signup component on team page
- Docs page newsletter CTA
- Any other page with newsletter signup

**Service:** `UnifiedInquiryService.createNewsletterSignup()`  
**Component:** `apps/web/src/components/NewsletterSignup.tsx`

**Data Fields:**
```typescript
{
  email: string;
  name?: string;
  inquiry_type: 'newsletter_signup';
  source: 'landing_page' | 'about_page' | 'team_page' | 'docs_page_cta' | ...;
  status: 'new' | 'in_progress' | 'closed';
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

**Admin View:**  
- Total subscribers: All active newsletter subscribers (status !== 'closed')
- New this week: Signups from the last 7 days

**Migration Status:**  
- ✅ **MIGRATED** to unified collection
- Old `newsletter_signups` collection is deprecated
- Migration script: `scripts/migrate-newsletter-to-unified.js`

---

### 3. **Pending Applications**

**What It Tracks:**  
- **For Platform Admins:** Shelter admin registration requests waiting for approval
- **For Shelter Admins:** Participant registration requests for their shelter

**Collection:** `shelter_applications` (for shelter admin requests)  
**Status:** `pending_review`

**Triggered By:**  
- Shelter Admin completes registration form
- Shelter Admin submits application for platform access

**Data Fields:**
```typescript
{
  adminUserId: string;
  shelterId: string;
  shelterName: string;
  status: 'pending_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  requiresReview: boolean;
}
```

**Admin View:**  
- Total pending: Currently awaiting review
- Context: "Shelter admin requests" for Platform Admins

---

### 4. **Contact Inquiries**

**What It Tracks:**  
All contact form submissions, partnership requests, support tickets, and general inquiries.

**Collection:** `contact_inquiries` (unified)  
**Filter:** `inquiry_type !== 'newsletter_signup'` (excludes newsletters)

**Inquiry Types:**
- `contact_form` - General contact page submissions
- `partnership_waitlist` - Shelter partnership requests
- `investor_inquiry` - Investment interest
- `support_request` - Technical support
- `app_notification` - Mobile app launch notifications
- `feedback` - User feedback
- `bug_report` - Bug reports
- `feature_request` - Feature suggestions

**Triggered By:**  
- Contact page form (`/contact`)
- Shelter partnership waitlist (`/shelters`)
- Mobile app teaser (`/scan-give`)
- Investor relations pages
- Support requests

**Service:** `UnifiedInquiryService.createContactInquiry()`

**Data Fields:**
```typescript
{
  email: string;
  name?: string;
  organization?: string;
  subject?: string;
  message?: string;
  inquiry_type: InquiryType;
  source: string; // e.g., 'contact_page', 'shelters_page_waitlist'
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'new' | 'in_progress' | 'responded' | 'closed';
  responded: boolean;
  created_at: Timestamp;
}
```

**Admin View:**  
- Total inquiries: All contact inquiries (excluding newsletters)
- New this week: Inquiries from the last 7 days
- Replied badge: Shows how many have been responded to

---

### 5. **Security Notifications**

**What It Tracks:**  
System alerts, fraud alerts, and security-related admin notifications.

**Collection:** `admin_notifications`  
**Filter:** `type === 'fraud_alert' OR type === 'system_alert'`

**Triggered By:**  
- Suspicious donation patterns
- Multiple failed login attempts
- Unusual platform activity
- Data breach attempts
- System health issues

**Data Fields:**
```typescript
{
  type: 'fraud_alert' | 'system_alert';
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  recipient_id: string;
  is_read: boolean;
  read: boolean;
  created_at: Timestamp;
}
```

**Admin View:**  
- Total alerts: All security/fraud alerts
- Unread: Shows count with pulsing red dot
- "All secure": Displayed when no unread alerts

---

### 6. **Participant Signups** ✨ NEW

**What It Tracks:**  
New participant registrations across all shelters on the platform.

**Collection:** `users`  
**Filter:** `role === 'participant'`

**Triggered By:**  
- Participant registration form
- Shelter Admin registering a participant
- Self-service participant signup

**Data Fields:**
```typescript
{
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'participant';
  shelter_id: string;
  tenant_id: string;
  status: 'new' | 'active' | 'inactive';
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

**Admin View:**  
- Total participants: All participants on the platform
- New this week: Participants registered in the last 7 days

**Visibility:** Only Super Admin and Platform Admin (hidden for Shelter Admins)

---

## 🛠️ Toolbar Filters

The notification dashboard includes a tabbed toolbar for filtering:

### Tabs:
1. **All Notifications** - Shows all notification types in one view
2. **Security** - Only security and fraud alerts
3. **Admin** - General admin notifications
4. **Contact** - Contact inquiries and support requests
5. **Email** - Shelter email signups
6. **Newsletter** - Newsletter subscribers
7. **Apps** - Pending applications (shelter admin requests)

---

## 🔄 Data Flow Architecture

### Newsletter Signups
```
User submits email
↓
UnifiedInquiryService.createNewsletterSignup()
↓
Stored in contact_inquiries (inquiry_type: newsletter_signup)
↓
Admin notification created in admin_notifications
↓
Dashboard metric updated (real-time)
```

### Shelter Email Signups
```
User submits email on shelter page
↓
notificationService.createShelterEmailSignup()
↓
Stored in shelter_email_signups
↓
❌ BROKEN: No admin notification created
↓
Dashboard metric updated (real-time)
```

### Contact Inquiries
```
User submits contact form
↓
UnifiedInquiryService.createContactInquiry()
↓
Stored in contact_inquiries
↓
Admin notification created in admin_notifications
↓
Dashboard metric updated (real-time)
```

---

## 🚨 Known Issues & Fixes Needed

### 1. **Shelter Email Signups - No Notifications** 🔴 CRITICAL
**Issue:** `createShelterEmailSignup()` stores data but never notifies admins  
**Impact:** Admins miss shelter signup notifications  
**File:** `apps/web/src/services/notificationService.ts` (lines 967-992)  
**Fix Required:**  
```typescript
// After storing signup, add:
await NotificationService.createNotification({
  recipient_id: shelterAdminId, // Shelter-specific admin
  type: 'shelter_email_signup',
  title: 'New Email Signup',
  message: `${email} signed up for updates at ${shelter_name}`,
  priority: 'normal',
  metadata: { shelter_id, email }
});
```

### 2. **Newsletter Count - Wrong Collection** ✅ FIXED
**Issue:** Dashboard was querying old `newsletter_signups` instead of unified `contact_inquiries`  
**Status:** Fixed in Session 22.14  
**Solution:** Switched imports from `newsletterService.ts` to `UnifiedInquiryService`

---

## 📈 Future Enhancements

### Planned Metrics:
- **Donor Signups** - Track new donor registrations
- **Shelter Applications** - Shelter partnership requests
- **Platform Revenue** - Financial metrics for Super Admins
- **User Engagement** - Active users, session duration, etc.

### Planned Features:
- CSV export for all metrics
- Email alerts for urgent notifications
- Real-time push notifications
- Notification history & search
- Bulk mark as read
- Priority tagging & assignment

---

## 🔗 Related Files

**Services:**
- `apps/web/src/services/unifiedInquiryService.ts` - Unified data collection
- `apps/web/src/services/notificationService.ts` - Notification logic
- `apps/web/src/services/newsletterService.ts` - (DEPRECATED - use UnifiedInquiryService)

**Components:**
- `apps/web/src/components/NewsletterSignup.tsx` - Newsletter signup component
- `apps/web/src/app/contact/page.tsx` - Contact form
- `apps/web/src/app/[slug]/ShelterPageClient.tsx` - Individual shelter pages

**Dashboards:**
- `apps/web/src/app/dashboard/notifications/page.tsx` - Main notifications dashboard

**Migration:**
- `scripts/migrate-newsletter-to-unified.js` - Newsletter migration script

---

## ✅ Metric Verification Checklist

Run this checklist to verify all metrics are working correctly:

- [ ] Newsletter signup on landing page → Count increases
- [ ] Newsletter signup on about page → Count increases
- [ ] Docs page newsletter CTA → Count increases
- [ ] Shelter email signup → Count increases + Admin notified ❌ (BROKEN)
- [ ] Contact form submission → Count increases + Admin notified
- [ ] Partnership waitlist signup → Count increases
- [ ] Mobile app notification signup → Count increases
- [ ] Participant registration → Count increases
- [ ] Security alert triggered → Count increases + Pulsing indicator
- [ ] Shelter admin application → Pending count increases

---

**Last Updated:** October 9, 2025  
**Maintainer:** Joel Yaffe (Super Admin)  
**Status:** 🟡 Mostly Working - 1 Critical Bug (Shelter Email Notifications)

