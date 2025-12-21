# Profile Enhancement Plan
**Date:** November 13, 2025  
**Status:** Planning Phase  
**Priority:** High

---

## 📋 Overview

Comprehensive plan to enhance the Super Admin Profile dashboard based on user feedback and requirements.

---

## 🎯 Requirements

### 1. **Consolidate Profile & Professional Tabs** ✅
**Current State:**
- 4 tabs: Profile, Professional, Privacy, Preferences
- Profile tab: Basic info, contact, profile picture
- Professional tab: Job title, department, expertise, social links

**Proposed Change:**
- Merge Profile + Professional → Single "Profile & Bio" tab
- Result: 3 tabs total (Profile & Bio, Privacy, Preferences)

**Benefits:**
- Less clicking between tabs
- All personal/professional info in one place
- More intuitive UX

---

### 2. **Image Gallery for Team Bio Pages** 🔴 **MISSING**
**What We Discussed:**
- Allow team members to upload multiple photos for their bio page
- Display these in a gallery on `/team/[slug]` pages
- Manage images (upload, reorder, caption, delete) from profile dashboard

**Current State:**
- ❌ **NOT IMPLEMENTED** - Only profile picture upload exists
- Profile picture is used as avatar across the system
- No image gallery feature found in codebase

**What Needs to Be Built:**
1. **Images Tab** (new 4th tab in profile dashboard)
   - Upload multiple images
   - Drag-and-drop reordering
   - Add captions
   - Delete images
   - Set featured images

2. **Storage Structure:**
   ```
   Firebase Storage:
   /users/{userId}/
     - profile-picture.jpg (main avatar)
     - bio-images/
       - image-1.jpg
       - image-2.jpg
       - image-3.jpg
   ```

3. **Firestore Schema:**
   ```typescript
   users/{userId}/bio/images: [
     {
       id: string,
       url: string,
       caption: string,
       order: number,
       uploadedAt: timestamp,
       isFeatured: boolean
     }
   ]
   ```

4. **Team Bio Page Integration:**
   - Display gallery on `/team/joel-yaffe`
   - Lightbox for full-size viewing
   - Responsive grid layout

---

### 3. **Email Address Change Implications** ⚠️
**Current Behavior:**
- Email field in profile is editable
- Unclear if this changes Firebase Auth email or just display email

**Investigation Needed:**
1. **What does changing email do?**
   - Is it just a "public display email"?
   - Does it trigger Firebase Auth email change?
   - Does it require re-authentication?
   - Does it affect login credentials?

2. **Recommended Approach:**
   ```typescript
   Profile Fields:
   - authEmail (read-only, from Firebase Auth)
   - publicEmail (editable, for display/contact)
   
   UI:
   - Show "Login Email: joel.yaffe@gmail.com" (locked)
   - Show "Public Email: [editable]" (can be different)
   - Add tooltip: "This is your public contact email, not your login"
   ```

3. **Security Considerations:**
   - Changing Firebase Auth email requires re-authentication
   - Should be a separate, protected flow
   - Require password confirmation
   - Send verification to new email

---

### 4. **Delete Profile Pictures & Images** 🔴 **BROKEN**
**Current State:**
- Delete functionality exists in many dashboards
- User reports: "a lot of the delete features across many dashboards are not working"

**Specific Issues:**
1. **Profile Picture Delete:**
   - Can upload new profile picture
   - ❌ Cannot delete current profile picture
   - ❌ No "Remove Picture" button

2. **Bio Images Delete:**
   - ❌ Feature doesn't exist yet (see #2 above)

3. **Other Dashboard Deletes:**
   - Need to audit all delete functions across platform
   - Common issue: Frontend button exists but backend fails
   - Possible causes:
     - Firebase Storage rules
     - Missing delete handlers
     - Incorrect file paths
     - Permission issues

**Required Fixes:**
1. **Profile Picture Delete:**
   ```typescript
   // Add delete function
   const deleteProfilePicture = async () => {
     // 1. Delete from Firebase Storage
     await deleteObject(ref(storage, `profiles/${userId}/profile-picture.jpg`));
     
     // 2. Update Firestore
     await updateDoc(doc(db, 'users', userId), {
       profilePicture: null
     });
     
     // 3. Clear cache
     await clearProfilePictureCache(userId);
   };
   ```

2. **Add Delete Button:**
   - Next to "Change Avatar" button
   - Confirmation dialog: "Are you sure?"
   - Show default avatar after deletion

3. **Audit All Delete Functions:**
   - Create list of all delete features
   - Test each one
   - Fix broken ones
   - Document working state

---

## 🗂️ Implementation Plan

### **Phase 1: Tab Consolidation** (4-6 hours)
**Priority:** High  
**Complexity:** Low-Medium

**Scope:** Apply to ALL user roles with profile pages

**User Roles to Update:**
1. ✅ **Super Admin** - `/dashboard/super-admin/profile`
2. ✅ **Platform Admin** - `/dashboard/platform-admin/profile`
3. ✅ **Participant** - `/dashboard/participant/profile`
4. ⚠️ **Donor** - Check if profile page exists
5. ⚠️ **Shelter Admin** - Check if profile page exists

**Tasks:**
1. ✅ Audit all profile pages across user roles
2. ✅ Merge Profile + Professional tabs (where applicable)
3. ✅ Reorganize form fields
4. ✅ Update tab navigation (4 → 3 tabs)
5. ✅ Ensure consistent UX across all roles
6. ✅ Test all fields save correctly for each role
7. ✅ Update documentation

**Files to Modify:**
- `apps/web/src/app/dashboard/super-admin/profile/page.tsx`
- `apps/web/src/app/dashboard/platform-admin/profile/page.tsx`
- `apps/web/src/app/dashboard/participant/profile/page.tsx`
- Check for donor/shelter admin profile pages

---

### **Phase 2: Email Field Clarification** (2-4 hours)
**Priority:** High  
**Complexity:** Low-Medium

**Scope:** Apply to ALL user roles with profile pages

**Tasks:**
1. ✅ Investigate current email behavior across all roles
2. ✅ Split into `authEmail` (read-only) and `publicEmail` (editable)
3. ✅ Add clear labels and tooltips
4. ✅ Update UI to show both fields for all roles
5. ✅ Test email changes don't affect login for any role
6. ✅ Update Firestore schema if needed

**Files to Modify:**
- `apps/web/src/app/dashboard/super-admin/profile/page.tsx`
- `apps/web/src/app/dashboard/platform-admin/profile/page.tsx`
- `apps/web/src/app/dashboard/participant/profile/page.tsx`
- `apps/web/src/services/systemSettingsService.ts`
- `apps/web/src/services/platformAdminProfileService.ts` (if exists)
- `apps/web/src/services/participantProfileService.ts` (if exists)

---

### **Phase 3: Profile Picture Delete** (3-5 hours)
**Priority:** High  
**Complexity:** Medium

**Scope:** Apply to ALL user roles with profile pages

**Tasks:**
1. ✅ Create universal `deleteProfilePicture` function in fileStorageService
2. ✅ Add "Delete Picture" button to UI for all roles
3. ✅ Add confirmation dialog with role-appropriate messaging
4. ✅ Update Firebase Storage rules if needed
5. ✅ Test deletion works correctly for each role
6. ✅ Verify default avatar shows after delete for each role
7. ✅ Ensure team page sync works after deletion

**Files to Modify:**
- `apps/web/src/app/dashboard/super-admin/profile/page.tsx`
- `apps/web/src/app/dashboard/platform-admin/profile/page.tsx`
- `apps/web/src/app/dashboard/participant/profile/page.tsx`
- `apps/web/src/services/fileStorageService.ts` (create universal delete function)
- `apps/web/src/components/ProfileAvatar.tsx` (handle null profilePicture)
- `firestore.rules` (if needed)

---

### **Phase 4: Image Gallery System** (8-12 hours)
**Priority:** Medium  
**Complexity:** High

**Tasks:**
1. ✅ Design Firestore schema for bio images
2. ✅ Create image upload service
3. ✅ Build "Images" tab in profile dashboard
4. ✅ Implement drag-and-drop reordering
5. ✅ Add caption editing
6. ✅ Add delete functionality
7. ✅ Integrate gallery into `/team/[slug]` pages
8. ✅ Add lightbox for full-size viewing
9. ✅ Test on mobile/tablet
10. ✅ Update documentation

**New Files:**
- `apps/web/src/components/profile/ImageGalleryManager.tsx`
- `apps/web/src/components/profile/ImageUploader.tsx`
- `apps/web/src/components/team/BioImageGallery.tsx`
- `apps/web/src/services/bioImageService.ts`

**Files to Modify:**
- `apps/web/src/app/dashboard/super-admin/profile/page.tsx`
- `apps/web/src/app/team/[slug]/client.tsx`
- `firestore.rules`

---

### **Phase 5: Delete Function Audit** (4-6 hours)
**Priority:** Medium  
**Complexity:** Medium

**Tasks:**
1. ✅ Create list of all delete features across platform
2. ✅ Test each delete function
3. ✅ Document broken ones
4. ✅ Fix broken delete handlers
5. ✅ Update Firebase Storage rules if needed
6. ✅ Add error handling and user feedback
7. ✅ Create testing checklist

**Areas to Audit:**
- Gallery Management (delete images)
- Knowledge Base (delete documents)
- Blog Management (delete posts)
- User Management (delete users)
- Shelter Management (delete shelters)
- Contact Inquiries (delete inquiries)
- Notifications (delete notifications)

---

## 📊 Estimated Timeline

| Phase | Priority | Time | Status |
|-------|----------|------|--------|
| Phase 1: Tab Consolidation | High | 2-3 hours | ⏳ Ready |
| Phase 2: Email Clarification | High | 1-2 hours | ⏳ Ready |
| Phase 3: Profile Picture Delete | High | 2-3 hours | ⏳ Ready |
| Phase 4: Image Gallery | Medium | 8-12 hours | 📋 Planned |
| Phase 5: Delete Audit | Medium | 4-6 hours | 📋 Planned |
| **Total** | | **17-26 hours** | |

---

## 🎯 Quick Wins (Do First)

1. **Tab Consolidation** - Easy, immediate UX improvement
2. **Email Clarification** - Prevents user confusion
3. **Profile Picture Delete** - Fills obvious gap in functionality

---

## 🔮 Future Enhancements

- **Profile History:** Track changes over time
- **Profile Templates:** Pre-fill common fields
- **Bulk Image Upload:** Upload multiple images at once
- **Image Editing:** Crop, rotate, filters
- **Video Support:** Upload intro videos for bio pages
- **Social Media Sync:** Auto-import profile data from LinkedIn

---

## 📝 Notes

### **Why Image Gallery Wasn't Implemented:**
Looking at the codebase and our conversation history, the image gallery feature was **discussed** but never actually **implemented**. The profile page currently only has:
- Profile picture upload (single image, used as avatar)
- No "Images" tab
- No bio image gallery management
- No gallery display on team bio pages

This is a **new feature** that needs to be built from scratch.

### **Email Field Confusion:**
The current implementation doesn't clearly distinguish between:
- **Authentication email** (Firebase Auth, used for login)
- **Public/display email** (shown on team page, used for contact)

This needs to be clarified to prevent users from accidentally changing their login credentials.

### **Delete Function Issues:**
The user reports widespread delete functionality problems. This suggests:
- Possible Firebase Storage rules issue
- Missing error handling
- Incorrect file path references
- Need for comprehensive audit

---

## ✅ Success Criteria

**Phase 1-3 (Quick Wins):**
- [ ] Profile & Professional tabs merged into one
- [ ] Email fields clearly labeled (auth vs public)
- [ ] Profile picture can be deleted
- [ ] Default avatar shows after deletion
- [ ] All changes sync to team pages

**Phase 4 (Image Gallery):**
- [ ] Can upload multiple images for bio
- [ ] Can reorder images via drag-and-drop
- [ ] Can add/edit captions
- [ ] Can delete individual images
- [ ] Gallery displays on `/team/[slug]` pages
- [ ] Lightbox works for full-size viewing

**Phase 5 (Delete Audit):**
- [ ] All delete functions tested
- [ ] Broken deletes documented
- [ ] Broken deletes fixed
- [ ] User feedback added for all deletes
- [ ] Testing checklist created

---

## 🚀 Ready to Start?

**Recommended Order:**
1. Start with Phase 1 (Tab Consolidation) - Quick win
2. Move to Phase 2 (Email Clarification) - Prevents confusion
3. Then Phase 3 (Profile Picture Delete) - Fills gap
4. Phase 4 & 5 can be done in parallel or as separate sessions

**Let me know which phase you'd like to tackle first!**

