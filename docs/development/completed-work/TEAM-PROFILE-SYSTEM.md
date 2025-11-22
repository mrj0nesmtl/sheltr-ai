# SHELTR Team Profile Management System

## 📋 System Overview

The SHELTR platform has a sophisticated profile management system that allows team members to control their public-facing information while maintaining editorial control over long-form biographies.

---

## ✅ What Team Members CAN Control

When a team member logs into their dashboard, they have full control over:

### Profile Dashboard Locations:
- **Super Admin**: `/dashboard/super-admin/profile`
- **Platform Admin**: `/dashboard/platform-admin/profile`

### Editable Fields:

#### 1. **Profile Picture** 🖼️
- Upload custom profile photo
- Replaces default/placeholder image
- Syncs automatically to:
  - Team card on `/team`
  - Individual bio page hero
  - All platform references

#### 2. **Basic Information** 👤
- First Name
- Last Name
- Display Name
- Public Contact Email
- Phone Number

#### 3. **Role Information** 💼
- Job Title
- Department
- Specialization
- Years of Experience

#### 4. **Professional Bio** 📝
- Short description (1-2 paragraphs)
- Appears on team card (if enabled)
- Separate from long-form biography

#### 5. **Contact & Social Links** 🔗
- LinkedIn Profile
- Twitter Profile
- Personal Website
- Instagram (if applicable)
- Substack (if applicable)

#### 6. **Areas of Expertise** 🎯
- Add/remove skill tags
- Displayed as badges on team card
- Shows top 3 + count on card
- Full list on bio page

---

## 🔄 Automatic Data Synchronization

### Data Flow:

```
Team Member Edits Profile
         ↓
   users collection
   (Firestore - Source of Truth)
         ↓
   [Automatic Sync Triggered]
         ↓
   team_members collection
   (Public-facing data)
         ↓
   Updates Appear On:
   - /team (team card)
   - /team/[slug] (bio page)
```

### What Updates Automatically:

✅ **Team Card** (`/team`)
- Profile picture
- Name and display name
- Job title and specialization
- Department
- Expertise badges (top 3)
- Years of experience
- Social media icons
- "View Full Bio" link

✅ **Individual Bio Page** (`/team/[slug]`)
- Hero section (name, title, tagline, photo)
- Social links in hero
- Experience sidebar card
- Expertise badges sidebar
- Career highlights (if added via backend)

### Sync Mechanism:

The system uses **`PlatformAdminProfileService.syncToPublicTeamCollectionWithProfile()`** which:
1. Listens for profile updates in dashboard
2. Automatically copies data to `team_members` collection
3. Ensures public pages always show current data
4. Handles privacy settings (public/private profiles)

---

## ❌ What Does NOT Update Automatically

### Long-Form Biography:

The detailed markdown biography on individual bio pages (`/team/[slug]`) is **NOT** editable from the dashboard.

**Why?**
- Requires careful writing and editorial review
- Uses markdown formatting for rich content
- Maintains consistent narrative quality
- Allows super admin editorial control

**How to Update:**
1. Edit markdown file in `docs/team/[name]-bio.md`
2. Run update script: `node scripts/add-[name]-bio.js`
3. Or update directly in Firestore: `users.bio.fullBio` field

**Future Enhancement:**
Could add a rich text editor in dashboard for `fullBio` field, but current approach ensures quality control.

---

## 🗂️ Data Structure

### users Collection (Source of Truth)

```javascript
{
  uid: "user123",
  displayName: "Jane Doe",
  email: "jane@sheltr.ai",
  profilePicture: "https://...",
  role: "platform_admin",
  slug: "jane-doe",
  
  bio: {
    title: "Marketing, Outreach, Onboarding",
    subtitle: "Marketing & Communications Specialist",
    tagline: "Creating campaigns that connect...",
    summary: "Short bio for team card (1-2 paragraphs)",
    fullBio: "Long-form markdown biography for bio page",
    
    yearsOfExperience: 15,
    department: "Marketing",
    location: "Victoria, BC, Canada",
    
    expertise: [
      "Marketing Strategy",
      "Brand Development",
      "Content Creation",
      // ... more skills
    ],
    
    careerHighlights: [
      {
        title: "Position Title",
        organization: "Company Name",
        period: "2020 - Present",
        description: "What they did...",
        achievements: ["Achievement 1", "Achievement 2"]
      }
    ],
    
    socialLinks: {
      email: "jane@sheltr.ai",
      linkedIn: "https://linkedin.com/in/janedoe",
      twitter: "https://twitter.com/janedoe",
      website: "https://janedoe.com"
    },
    
    showOnTeamPage: true
  }
}
```

### team_members Collection (Public-Facing)

```javascript
{
  id: "user123",
  name: "Jane Doe",
  displayName: "Jane Doe",
  email: "jane@sheltr.ai",
  jobTitle: "Marketing, Outreach, Onboarding",
  specialization: "Marketing & Communications Specialist",
  department: "Marketing",
  bio: "Short bio for team card",
  profilePicture: "https://...",
  
  expertise: ["Marketing Strategy", "Brand Development", ...],
  yearsOfExperience: 15,
  
  // Contact info
  linkedIn: "https://linkedin.com/in/janedoe",
  twitter: "https://twitter.com/janedoe",
  website: "https://janedoe.com",
  
  // Metadata
  role: "platform_admin",
  slug: "jane-doe",
  showOnTeamPage: true,
  isFoundingMember: false,
  displayOrder: 5,
  lastSynced: "2025-11-22T08:00:00Z"
}
```

---

## 🔒 Super Admin Backend Control

As Super Admin, you can always:

### Via Firestore Console:
1. Edit any field in `users` or `team_members` collections
2. Update `fullBio` for long-form biographies
3. Modify `careerHighlights` array
4. Change `displayOrder` for team card sorting
5. Toggle `showOnTeamPage` for visibility

### Via Scripts:
- `scripts/add-[name]-bio.js` - Add/update full bio
- `scripts/sync-all-team-expertise.js` - Sync expertise data
- `scripts/verify-team-bios.js` - Verify data consistency
- `scripts/check-team-data-consistency.js` - Audit data

### Manual Sync Trigger:
If data gets out of sync, you can trigger a manual sync by:
1. Logging in as the user
2. Making any small edit to their profile
3. Saving (triggers automatic sync)

Or run: `PlatformAdminProfileService.syncToPublicTeamCollectionWithProfile(userId, profile)`

---

## 🎨 Team Card Display Logic

### Current Display (After Consistency Fix):

**All Team Cards Now Show:**
- ✅ Profile picture
- ✅ Name and display name
- ✅ Job title (colored, clickable)
- ✅ Department badge
- ✅ Expertise badges (top 3 + count)
- ✅ Years of experience
- ✅ Social media icons
- ✅ "View Full Bio" link (if slug exists)

**Removed:**
- ❌ Bio text (moved to individual pages only)

### Code Reference:

```typescript
// apps/web/src/app/team/page.tsx
<CardContent className="space-y-4">
  {/* Expertise */}
  {member.expertise.length > 0 && (
    <div className="space-y-2">
      <div className="flex items-center text-xs text-muted-foreground">
        <Award className="h-3 w-3 mr-1" />
        Expertise
      </div>
      <div className="flex flex-wrap gap-1">
        {member.expertise.slice(0, 3).map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
        {member.expertise.length > 3 && (
          <Badge variant="secondary" className="text-xs">
            +{member.expertise.length - 3} more
          </Badge>
        )}
      </div>
    </div>
  )}
  
  {/* Experience */}
  {member.yearsOfExperience > 0 && member.name !== 'Joel Yaffe' && (
    <div className="flex items-center justify-center text-xs text-muted-foreground">
      <Calendar className="h-3 w-3 mr-1" />
      {member.yearsOfExperience} years experience
    </div>
  )}
</CardContent>
```

---

## 🚀 Adding New Team Members

### Process:

1. **Create User Account** (via Firebase Auth or admin panel)
2. **Create Bio Markdown** in `docs/team/[name]-bio.md`
3. **Run Bio Script**: `node scripts/add-[name]-bio.js`
4. **Update Static Params** in `apps/web/src/app/team/[slug]/page.tsx`:
   ```typescript
   export function generateStaticParams() {
     return [
       { slug: 'joel-yaffe' },
       { slug: 'new-member' }, // Add here
       // ...
     ];
   }
   ```
5. **Update Verification Script** in `scripts/verify-team-bios.js`
6. **Build & Deploy**: `npm run build && firebase deploy`

### Script Template:

See `scripts/add-christine-bio.js` or `scripts/add-sen-bio.js` for reference.

---

## 🔍 Verification & Debugging

### Check Data Consistency:
```bash
node scripts/check-team-data-consistency.js
```

### Verify All Bios:
```bash
node scripts/verify-team-bios.js
```

### Sync Expertise Data:
```bash
node scripts/sync-all-team-expertise.js
```

### Check Firestore Directly:
1. Firebase Console → Firestore Database
2. Navigate to `users` or `team_members` collection
3. Find user by UID
4. Inspect data structure

---

## 📊 Current Team Status

### Team Members with Full Bios:
1. ✅ Joel Yaffe (Founder & CEO)
2. ✅ Zaffia Laplante (Public Relations, Partnerships)
3. ✅ Alexander Kline (Operations, Partnerships)
4. ✅ Doug Kukura (DeFi, Payments, CFO)
5. ✅ Marc Reichel (Product Design & Engineering)
6. ✅ Morgan Hirtle (Participant Support, UX)
7. ✅ Dominique Legault (Blockchain Engineer, AI)
8. ✅ Christine Savard (Marketing, Outreach, Onboarding)
9. ✅ Sen Wong (Brand, Marketing, Publicity - Pro Bono via ROYALTRI)

### All Team Members Now Have:
- ✅ Profile pictures
- ✅ Expertise badges (consistent across all cards)
- ✅ Years of experience (consistent across all cards)
- ✅ Individual bio pages with full content
- ✅ Social media links
- ✅ Career highlights

---

## 🎯 Key Takeaways

### ✅ YES - Profile Updates Flow Automatically
When team members edit their profiles in the dashboard, changes appear immediately on:
- Team card
- Bio page metadata
- All public-facing pages

### ✅ YES - They Control Their Public Image
Team members have full control over:
- Profile picture
- Contact information
- Job title and specialization
- Expertise tags
- Social media links

### ❌ NO - Long-Form Bios Don't Auto-Update
The detailed markdown biographies require:
- Manual editing of markdown files
- Running update scripts
- Or direct Firestore updates

This is **by design** to maintain editorial quality.

### ✅ YES - You Have Backend Control
As Super Admin, you can always:
- Update any field via Firestore
- Run scripts to bulk update
- Manually trigger syncs
- Override any setting

---

## 🔮 Future Enhancements

### Potential Improvements:

1. **Rich Text Editor for Long-Form Bio**
   - Add WYSIWYG editor in dashboard
   - Allow team members to edit `fullBio`
   - Include markdown preview
   - Require super admin approval for changes

2. **Career Highlights Editor**
   - UI for adding/editing career highlights
   - Drag-and-drop reordering
   - Image upload for company logos

3. **Bio Page Customization**
   - Choose color themes
   - Add custom sections
   - Upload additional images

4. **Automatic Profile Picture Sync**
   - Fetch from LinkedIn/Gravatar
   - AI-powered background removal
   - Automatic cropping/resizing

5. **Profile Completion Gamification**
   - Progress bar for profile completion
   - Badges for complete profiles
   - Leaderboard for most complete profiles

---

## 📞 Support

### Questions About Profile System:
- Check this documentation first
- Run verification scripts
- Check Firestore console
- Review service code in `apps/web/src/services/`

### Need to Update a Profile:
- Team member: Use dashboard at `/dashboard/platform-admin/profile`
- Super admin: Use Firestore console or run scripts

### Data Out of Sync:
1. Run `node scripts/check-team-data-consistency.js`
2. Run `node scripts/sync-all-team-expertise.js`
3. Manually trigger sync via dashboard edit
4. Check Firestore security rules

---

**Last Updated**: November 22, 2025  
**System Version**: v2.123.0  
**Maintained By**: Super Admin (Joel Yaffe)

