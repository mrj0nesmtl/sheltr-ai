# Gallery Hero Image Multi-Page Selector

**Version:** 1.0.0  
**Last Updated:** October 19, 2025  
**Status:** ✅ Complete

---

## 📋 **Overview**

The Gallery Dashboard now features a modern, visual multi-page hero image selector that allows administrators to assign a single image as the hero/OG image for multiple public pages simultaneously.

---

## 🎨 **New Features**

### **Visual Grid Selector**

Instead of individual checkboxes for each page, we now have:

1. **📱 Visual Grid Layout** - 2-3 column responsive grid
2. **🎯 Icon-Based Selection** - Each page has a unique emoji icon
3. **✅ Visual Feedback** - Selected pages show checkmark badge
4. **🎨 Hover States** - Interactive hover effects
5. **📊 Counter Badge** - Shows total selected pages
6. **⚡ Quick Actions** - "Select All" and "Clear All" buttons

---

## 🖼️ **Supported Pages (15 Total)**

| Page | Icon | Path | Description |
|------|------|------|-------------|
| **Landing Page** | 🏠 | `/` | Main homepage |
| **About** | 📖 | `/about` | About SHELTR |
| **Team** | 👥 | `/team` | Team page |
| **Gallery** | 🖼️ | `/gallery` | Image gallery |
| **Solutions** | 💡 | `/solutions` | Solutions overview |
| **For Donors** | ❤️ | `/solutions/donors` | Donor solutions |
| **For Participants** | 🤝 | `/solutions/participants` | Participant solutions |
| **For Organizations** | 🏢 | `/solutions/organizations` | Organization solutions |
| **PODS** | 🏘️ | `/pods` | SHELTR PODS |
| **MOBI Bikes** | 🚲 | `/pods/mobi` | MOBI bikes |
| **Drones** | 🚁 | `/drones` | Drone delivery |
| **Impact Stories** | ⭐ | `/impact` | Impact page |
| **Scan & Give** | 📱 | `/scan-give` | QR donation demo |
| **Donate** | 💝 | `/donate` | Donation page |
| **Contact** | 📧 | `/contact` | Contact page |

---

## 💻 **How to Use**

### **Step 1: Open Gallery Dashboard**

Navigate to `/dashboard/gallery`

### **Step 2: Edit an Image**

1. Click the **Edit** button on any image
2. Scroll to the **"Set as Hero Image for Pages"** section

### **Step 3: Select Pages**

**Option A: Click Individual Pages**
- Click on any page card to toggle selection
- Selected pages show a blue border and checkmark
- Click again to deselect

**Option B: Use Quick Actions**
- Click **"Select All"** to select all 15 pages
- Click **"Clear All"** to deselect all pages

### **Step 4: Save**

Click **"Save Changes"** to apply the hero image to selected pages

---

## 🎯 **Visual Design**

### **Unselected Page**
```
┌─────────────┐
│     🏠      │  ← Emoji icon
│             │
│ Landing Page│  ← Page label
└─────────────┘
```

### **Selected Page**
```
┌─────────────┐
│     🏠    ✓ │  ← Checkmark badge
│             │
│ Landing Page│  ← Page label
└─────────────┘
  Blue border
  Blue background
```

### **Counter Badge**
Shows total selected pages in real-time:
```
Set as Hero Image for Pages    [5 selected]
```

---

## 🔧 **Technical Implementation**

### **Data Structure**

Each image now has a `heroPages` array:

```typescript
interface GalleryMedia {
  // ... other fields
  heroPages?: string[]; // Array of page paths
}
```

Example:
```typescript
{
  id: "image-123",
  title: "SHELTR POD Exterior",
  heroPages: [
    "/",
    "/pods",
    "/solutions",
    "/about"
  ]
}
```

### **Page Configuration**

Pages are defined in the `PUBLIC_PAGES` constant:

```typescript
const PUBLIC_PAGES = [
  { id: 'landing', label: 'Landing Page', path: '/', icon: '🏠' },
  { id: 'about', label: 'About', path: '/about', icon: '📖' },
  // ... more pages
];
```

---

## 📊 **Badge Display**

### **On Image Cards**

Images show a gradient badge with the count:

```
[HERO (5)]  ← Shows on image card
```

- **Gradient:** Yellow to Orange
- **Count:** Number of pages using this image
- **Hover:** Brightens on hover

---

## ✨ **Benefits**

### **Before (Old System)**

❌ Only 2 pages supported (Gallery, Landing)  
❌ Individual checkboxes (not scalable)  
❌ No visual feedback  
❌ Hard to see what's selected  
❌ No bulk actions

### **After (New System)**

✅ 15 pages supported  
✅ Visual grid layout  
✅ Clear selection state  
✅ Easy to scan and select  
✅ Bulk select/clear actions  
✅ Real-time counter  
✅ Responsive design  
✅ Touch-friendly

---

## 📱 **Responsive Design**

### **Mobile (< 640px)**
- 2 columns
- Larger touch targets
- Scrollable grid

### **Tablet (640px - 1024px)**
- 3 columns
- Balanced layout

### **Desktop (> 1024px)**
- 3 columns
- Optimal spacing

---

## 🎨 **Styling Details**

### **Colors**

**Unselected:**
- Border: `border-border`
- Background: Transparent
- Hover: `border-primary/50` + `bg-accent`

**Selected:**
- Border: `border-primary` (2px)
- Background: `bg-primary/10`
- Shadow: `shadow-sm`
- Checkmark: `bg-primary` circle

### **Typography**

- Icon: `text-2xl`
- Label: `text-xs font-medium`
- Counter: `text-xs` in badge

---

## 🔄 **Migration from Old System**

### **Backward Compatibility**

The old `isHero` and `isLandingHero` fields are maintained for backward compatibility but are now deprecated in favor of `heroPages`.

### **Migration Logic**

When loading existing images:
- If `isHero === true` → Add `/gallery` to `heroPages`
- If `isLandingHero === true` → Add `/` to `heroPages`

---

## 🚀 **Future Enhancements**

### **Potential Additions**

1. **Search/Filter** - Filter pages by name
2. **Categories** - Group pages by category
3. **Preview** - Show how image looks on each page
4. **Bulk Edit** - Apply to multiple images at once
5. **Templates** - Save common page combinations
6. **Analytics** - Track which pages get most views

---

## 📝 **Usage Examples**

### **Example 1: PODS Hero Image**

Select pages related to PODS:
- ✅ Landing Page (`/`)
- ✅ PODS (`/pods`)
- ✅ Solutions (`/solutions`)
- ✅ About (`/about`)

### **Example 2: Donation Campaign**

Select donation-related pages:
- ✅ Scan & Give (`/scan-give`)
- ✅ Donate (`/donate`)
- ✅ For Donors (`/solutions/donors`)
- ✅ Impact Stories (`/impact`)

### **Example 3: Universal Hero**

Use "Select All" for a general SHELTR image:
- ✅ All 15 pages selected

---

## 🐛 **Troubleshooting**

### **Issue: Pages not showing selected**

**Solution:** Ensure `heroPages` array is initialized:
```typescript
heroPages: image.heroPages || []
```

### **Issue: Checkmark not appearing**

**Solution:** Verify Check icon is imported:
```typescript
import { Check } from 'lucide-react';
```

### **Issue: Grid not responsive**

**Solution:** Check Tailwind classes:
```typescript
className="grid grid-cols-2 sm:grid-cols-3 gap-2"
```

---

## 📚 **Related Documentation**

- **Open Graph Implementation:** `docs/04-development/OPEN-GRAPH-IMPLEMENTATION.md`
- **Hero Images Guide:** `HERO-IMAGES-NEEDED.md`
- **Gallery Service:** `apps/web/src/services/galleryService.ts`

---

## ✅ **Checklist for Use**

When setting hero images:

- [ ] Image has SHELTR branding/logo
- [ ] Image is 1200 x 630 pixels
- [ ] Image is optimized (< 1MB)
- [ ] Select appropriate pages
- [ ] Save changes
- [ ] Deploy to production
- [ ] Test sharing links

---

**Document Status:** ✅ Complete  
**Feature Status:** ✅ Live in Production  
**Last Updated:** October 19, 2025

