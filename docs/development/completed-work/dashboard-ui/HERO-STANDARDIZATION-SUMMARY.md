# Hero Section Standardization ✨

**Date**: October 20, 2025  
**Status**: 🔄 In Progress (About & Drones completed, PODS and others pending)

## Overview

Standardizing all public page hero sections for visual consistency across the SHELTR platform.

## Goals

1. ✅ **Consistent Height**: All hero sections use `min-h-[80vh]` for uniform vertical space
2. ✅ **Beautiful Gradient**: Elegant gradient overlay that fades from dark to transparent
3. ✅ **Smooth Fade-Out**: Hero images fade out at the bottom instead of hard cutoff
4. ✅ **Dynamic Images**: All heroes pull from gallery dashboard
5. ✅ **Mobile Responsive**: Proper scaling on all devices

## New StandardHero Component

Created `/apps/web/src/components/StandardHero.tsx` with:

### Features

- **Consistent Sizing**: `min-h-[80vh]` with `flex items-center` for vertical centering
- **Gradient Overlay**: 
  ```javascript
  linear-gradient(to bottom, 
    rgba(0,0,0,0.7) 0%,    // Dark at top
    rgba(0,0,0,0.5) 50%,   // Medium in middle
    rgba(0,0,0,0.3) 80%,   // Light near bottom
    rgba(0,0,0,0) 100%     // Transparent at bottom (smooth fade-out!)
  )
  ```
- **Flexible Content**: Supports badges, titles with colored spans, subtitles, and custom children (CTAs)
- **Customizable**: Can override gradient and badge styles per page

### Usage Example

```typescript
<StandardHero
  imageUrl={heroImage.url}
  badgeText="BLOCKCHAIN SECURED"
  title={
    <>
      Transforming Donations into <span className="text-blue-400">Impact</span>
    </>
  }
  subtitle="Transparency for all. Impact for all."
>
  {/* Optional CTA buttons */}
  <div className="flex gap-4 justify-center mt-8">
    <Button>Learn More</Button>
  </div>
</StandardHero>
```

## Implementation Status

### ✅ Completed Pages

1. **`/about`** - About SHELTR
   - Before: `min-h-[80vh]` with `bg-black/60` solid overlay
   - After: `min-h-[80vh]` with smooth gradient fade-out
   - Badge: "BLOCKCHAIN SECURED"

2. **`/drones`** - Supply Drones
   - Before: `py-24` only (no min-height), `bg-black/50`, had `scale-105` zoom
   - After: `min-h-[80vh]` with smooth gradient, no zoom
   - Badge: "Future Release"

### 🔄 Pending Pages

3. **`/pods`** - SHELTR Pods (needs update)
4. **`/team`** - Team Page
5. **`/solutions`** - Solutions Overview
6. **`/solutions/donors`** - For Donors
7. **`/solutions/participants`** - For Participants
8. **`/solutions/organizations`** - For Organizations
9. **`/impact`** - Impact Stories
10. **`/scan-give`** - Scan & Give
11. **`/donate`** - Donation Page
12. **`/contact`** - Contact Form

## Before & After Comparison

### Old Inconsistencies

| Page | Height | Overlay | Issues |
|------|--------|---------|--------|
| About | `min-h-[80vh]` | `bg-black/60` | ✅ Good height, but solid overlay |
| Drones | `py-24` only | `bg-black/50` | ❌ Too short, lighter overlay, zoom effect |
| PODS | `py-24` only | `bg-black/60` | ❌ Too short, zoom effect |

### New Standard

| Element | Value | Purpose |
|---------|-------|---------|
| Height | `min-h-[80vh]` | Consistent vertical space across all pages |
| Alignment | `flex items-center` | Vertically center content |
| Gradient | `rgba(0,0,0,0.7) → transparent` | Smooth fade-out at bottom |
| Padding | `py-24` | Additional top/bottom spacing |
| Background | `cover center no-repeat` | Proper image display |

## Benefits

1. **Visual Consistency**: All pages look cohesive and professional
2. **Improved Readability**: Gradient ensures text is always legible
3. **Smooth Transitions**: Fade-out creates elegant flow into content
4. **Mobile Optimized**: `80vh` works great on all screen sizes
5. **Easy Maintenance**: Single component to update styling
6. **Dynamic Content**: Gallery dashboard controls all hero images

## Next Steps

1. Update remaining 10 pages to use `StandardHero` component
2. Test all pages on mobile devices
3. Ensure smooth scrolling behavior
4. Verify gradient looks good with all hero images
5. Document any page-specific customizations

## Technical Notes

### Gradient Customization

If a page needs a different gradient (e.g., lighter or darker):

```typescript
<StandardHero
  imageUrl={heroImage.url}
  title="Your Title"
  gradientOverlay="linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)"
/>
```

### Badge Variants

- `default` - Filled badge
- `secondary` - Subtle filled (used on About)
- `outline` - Border only (used on Drones)
- `destructive` - Red theme

### Custom Styling

```typescript
<StandardHero
  badgeVariant="outline"
  badgeClassName="border-2 border-blue-400 text-blue-400 px-4 py-2"
  // ...
/>
```

## Files Modified

- ✅ `apps/web/src/components/StandardHero.tsx` (new)
- ✅ `apps/web/src/app/about/page.tsx`
- ✅ `apps/web/src/app/drones/page.tsx`
- 🔄 `apps/web/src/app/pods/page.tsx` (pending)
- 🔄 10 more pages pending...

---

**🎨 Result**: Beautiful, consistent hero sections with smooth gradient fade-outs across the entire SHELTR platform!

