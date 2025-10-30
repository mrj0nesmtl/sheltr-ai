# Shelter-Specific Email Signup & Branding System

**Version:** 1.0  
**Created:** October 4, 2025  
**Status:** 🚧 In Progress

---

## 📋 Overview

This document outlines the implementation of a **tenant-isolated email signup system** where each shelter can capture leads directly from their public page, with notifications flowing to their shelter admin dashboard.

Additionally, this system will support **white-label branding** where shelter admins can upload:
- Their own logo
- Profile images
- Custom branding for dashboards and public pages

---

## 🎯 Goals

1. **Shelter-Specific Lead Capture**: Each shelter's public page has an email signup form
2. **Tenant Isolation**: Email signups are tied to specific `shelter_id`
3. **Admin Notifications**: Shelter admins see their shelter's signups in notifications dashboard
4. **Contact Forms**: Similar system for contact inquiries from public pages
5. **White-Label Branding**: Shelters can upload logos and profile images
6. **Security**: Proper Firestore rules to prevent cross-tenant data access

---

## 🗄️ Database Schema

### Collection: `shelter_email_signups`

```typescript
interface ShelterEmailSignup {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  shelter_id: string;          // Links to shelter
  shelter_name: string;         // Denormalized for easy display
  source: 'public_page' | 'embedded_form' | 'manual';
  page: 'shelter_public_page';
  signup_date: Timestamp;
  createdAt: Timestamp;
  status: 'active' | 'pending' | 'unsubscribed';
  interests?: string[];         // What services they're interested in
  message?: string;             // Optional message from user
  ip_address?: string;          // For spam prevention
  user_agent?: string;
  metadata?: {
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}
```

### Collection: `shelter_contact_inquiries`

```typescript
interface ShelterContactInquiry {
  id?: string;
  shelter_id: string;
  shelter_name: string;
  sender_email: string;
  sender_name: string;
  sender_phone?: string;
  subject: string;
  message: string;
  inquiry_type: 'general' | 'services' | 'volunteer' | 'donation' | 'partnership';
  source: 'public_page';
  priority: 'low' | 'normal' | 'high';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  responded: boolean;
  response_notes?: string;
  created_at: Timestamp;
  createdAt: Timestamp;
  resolved_at?: Timestamp;
  resolved_by?: string;  // User ID of admin who resolved
}
```

### Collection: `users` (Updated for Branding)

```typescript
interface User {
  // ... existing fields ...
  profileImageUrl?: string;      // User's profile picture
  profileImagePath?: string;     // Storage path for cleanup
}
```

### Collection: `tenants` (Updated for Branding)

```typescript
interface Tenant {
  // ... existing fields ...
  logoUrl?: string;              // Shelter's logo
  logoPath?: string;             // Storage path for cleanup
  brandColor?: string;           // Primary brand color (hex)
  secondaryColor?: string;       // Secondary brand color (hex)
}
```

---

## 🔒 Firestore Security Rules

```javascript
// Shelter Email Signups
match /shelter_email_signups/{signupId} {
  // Public can create signups (for public page forms)
  allow create: if request.resource.data.keys().hasAll(['email', 'shelter_id', 'source']);
  
  // Shelter Admin can read their own shelter's signups
  allow read: if isAuthenticated() && 
    (isSuperAdmin() || isPlatformAdmin() || 
     (isAdmin() && resource.data.shelter_id == getUserShelterId()));
  
  // Admins can update status (mark as contacted, unsubscribed, etc.)
  allow update: if isAuthenticated() && 
    (isSuperAdmin() || isPlatformAdmin() || 
     (isAdmin() && resource.data.shelter_id == getUserShelterId()));
  
  // Only Super Admin can delete
  allow delete: if isSuperAdmin();
}

// Shelter Contact Inquiries
match /shelter_contact_inquiries/{inquiryId} {
  // Public can create inquiries
  allow create: if request.resource.data.keys().hasAll(['email', 'shelter_id', 'message']);
  
  // Shelter Admin can read their own shelter's inquiries
  allow read: if isAuthenticated() && 
    (isSuperAdmin() || isPlatformAdmin() || 
     (isAdmin() && resource.data.shelter_id == getUserShelterId()));
  
  // Admins can update (respond, change status)
  allow update: if isAuthenticated() && 
    (isSuperAdmin() || isPlatformAdmin() || 
     (isAdmin() && resource.data.shelter_id == getUserShelterId()));
  
  // Only Super Admin can delete
  allow delete: if isSuperAdmin();
}

// User Profile Images
match /users/{userId}/profile/{imageId} {
  // Users can upload their own profile images
  allow write: if request.auth.uid == userId;
  allow read: if true; // Profile images are public
}

// Shelter Logos
match /shelters/{shelterId}/branding/{file} {
  // Shelter admins can upload their shelter's logo
  allow write: if isAuthenticated() && 
    (isSuperAdmin() || isPlatformAdmin() || 
     (isAdmin() && getUserShelterId() == shelterId));
  allow read: if true; // Logos are public
}
```

---

## 🔧 Implementation Steps

### ✅ **Step 1: Update Notification Service**

Create new functions in `notificationService.ts`:

```typescript
// Get shelter-specific email signups
export async function getShelterEmailSignups(
  shelterId: string, 
  maxResults: number = 50
): Promise<ShelterEmailSignup[]> {
  const signupsQuery = query(
    collection(db, 'shelter_email_signups'),
    where('shelter_id', '==', shelterId),
    orderBy('signup_date', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(signupsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShelterEmailSignup));
}

// Get shelter-specific contact inquiries
export async function getShelterContactInquiries(
  shelterId: string, 
  maxResults: number = 50
): Promise<ShelterContactInquiry[]> {
  const inquiriesQuery = query(
    collection(db, 'shelter_contact_inquiries'),
    where('shelter_id', '==', shelterId),
    orderBy('created_at', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(inquiriesQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShelterContactInquiry));
}

// Update getShelterNotificationCounts to include these
```

### **Step 2: Add Email Signup Form to Public Page**

File: `apps/web/src/app/[slug]/ShelterPageClient.tsx`

Add a new section before the footer:

```tsx
{/* Email Signup Section */}
<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
  <CardContent className="p-8">
    <div className="max-w-2xl mx-auto text-center">
      <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
      <p className="text-muted-foreground mb-6">
        Get updates about our services, programs, and how you can help.
      </p>
      <form onSubmit={handleEmailSignup} className="flex gap-2">
        <Input
          type="email"
          placeholder="Your email address"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      {signupMessage && (
        <p className="mt-4 text-sm text-green-600">{signupMessage}</p>
      )}
    </div>
  </CardContent>
</Card>
```

### **Step 3: Update Notifications Dashboard**

File: `apps/web/src/app/dashboard/notifications/page.tsx`

- Restore the "Email" tab for Shelter Admins
- Update to show `shelter_email_signups` instead of platform-wide `newsletter_signups`
- Add "Contact Inquiries" tab showing `shelter_contact_inquiries`

### **Step 4: Add Profile Image Upload**

File: `apps/web/src/app/dashboard/shelter-admin/settings/page.tsx`

Add a new section in the "General Info" tab:

```tsx
{/* Profile Image Section */}
<div className="space-y-4">
  <Label>Profile Image</Label>
  <div className="flex items-center gap-4">
    <Avatar className="h-20 w-20">
      <AvatarImage src={user?.profileImageUrl} />
      <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
    </Avatar>
    <div>
      <Input
        type="file"
        accept="image/*"
        onChange={handleProfileImageUpload}
        className="hidden"
        ref={profileImageInputRef}
      />
      <Button onClick={() => profileImageInputRef.current?.click()}>
        Upload New Image
      </Button>
    </div>
  </div>
</div>

{/* Shelter Logo Section */}
<div className="space-y-4">
  <Label>Shelter Logo</Label>
  <p className="text-sm text-muted-foreground">
    This logo will appear on your public page and in the dashboard.
  </p>
  <div className="flex items-center gap-4">
    {shelterLogo && (
      <Image src={shelterLogo} alt="Shelter Logo" width={100} height={100} />
    )}
    <div>
      <Input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
        ref={logoInputRef}
      />
      <Button onClick={() => logoInputRef.current?.click()}>
        Upload Logo
      </Button>
    </div>
  </div>
</div>
```

---

## 📊 Composite Indexes Required

```json
{
  "collectionGroup": "shelter_email_signups",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "shelter_id", "order": "ASCENDING" },
    { "fieldPath": "signup_date", "order": "DESCENDING" }
  ]
},
{
  "collectionGroup": "shelter_contact_inquiries",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "shelter_id", "order": "ASCENDING" },
    { "fieldPath": "created_at", "order": "DESCENDING" }
  ]
}
```

---

## 🧪 Testing Checklist

- [ ] Create email signup from public page
- [ ] Verify signup appears in shelter admin notifications dashboard
- [ ] Verify signup does NOT appear in other shelters' dashboards
- [ ] Submit contact form from public page
- [ ] Verify inquiry appears in shelter admin notifications
- [ ] Upload profile image as shelter admin
- [ ] Upload shelter logo
- [ ] Verify logo appears on public page
- [ ] Verify logo appears in dashboard sidebar
- [ ] Test security rules (try to access other shelter's data)

---

## 📝 Next Steps

1. Implement email signup service functions
2. Add email signup form to public page
3. Update notifications dashboard to show shelter-specific signups
4. Add contact form to public page
5. Implement profile image upload
6. Implement shelter logo upload
7. Update dashboard to use shelter logo
8. Update public page to use shelter logo
9. Deploy Firestore security rules
10. Deploy composite indexes
11. Test end-to-end

---

## 🎨 UI/UX Considerations

### Email Signup Form
- Should be prominent but not intrusive
- Include privacy notice
- Show success message
- Option to select interests (checkboxes for services)
- Optional phone number field

### Contact Form
- Fields: Name, Email, Phone (optional), Subject, Message
- Inquiry type dropdown
- Character limit on message (500-1000 chars)
- Spam protection (honeypot field)

### Profile Images
- Max file size: 2MB
- Supported formats: JPG, PNG, WebP
- Auto-resize to 300x300px
- Circular crop option

### Shelter Logos
- Max file size: 1MB
- Supported formats: PNG, SVG (preferred)
- Recommended size: 400x400px
- Transparent background support

---

## 🔐 Security Considerations

1. **Rate Limiting**: Implement rate limiting on public forms to prevent spam
2. **Email Validation**: Server-side email validation
3. **CAPTCHA**: Consider adding reCAPTCHA for public forms
4. **File Upload Security**: 
   - Validate file types
   - Scan for malware
   - Limit file sizes
   - Use Firebase Storage security rules

---

**End of Document**

