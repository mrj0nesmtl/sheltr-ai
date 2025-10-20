# Dynamic Hero Images Implementation

**Date**: October 20, 2025  
**Status**: ✅ Implemented for `/drones` - Rolling out to all pages

## Overview

The gallery dashboard now allows administrators to select multiple public pages for each image to serve as a hero/OG image. This document explains how to implement dynamic hero image loading on public pages.

## Architecture

### 1. Gallery Management (`/dashboard/gallery/`)
- Administrators can select which pages use an image as hero via multi-select grid
- Images store `heroPages: string[]` array in Firestore (`gallery_media` collection)
- Example: `heroPages: ['/drones', '/about', '/impact']`

### 2. Server-Side Metadata (SEO/OG Tags)
- **File**: `apps/web/src/lib/heroImages.ts`
- **Function**: `getHeroImageWithFallback(pagePath: string)`
- Used in `layout.tsx` files with `generateMetadata()` for Open Graph tags
- Queries Firestore for images where `heroPages` array contains the page path

### 3. Client-Side Hero Display
- **File**: `apps/web/src/hooks/useHeroImage.ts`
- **Hook**: `useHeroImage(pagePath: string, fallbackUrl: string)`
- Used in page components to dynamically load hero background images
- Provides loading state and error handling

## Implementation Guide

### Step 1: Update Layout File (for OG/SEO)

```typescript
// apps/web/src/app/[page]/layout.tsx
import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/your-page-path');

  return {
    title: 'Your Page Title - SHELTR',
    description: 'Your page description...',
    openGraph: {
      title: 'Your OG Title',
      description: 'Your OG description...',
      url: 'https://sheltr-ai.web.app/your-page-path',
      siteName: 'SHELTR',
      images: [
        {
          url: heroImage.url,
          width: heroImage.width,
          height: heroImage.height,
          alt: heroImage.alt,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Your Twitter Title',
      description: 'Your Twitter description...',
      images: [heroImage.url],
    },
  };
}

export default function YourPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### Step 2: Update Page Component (for Hero Display)

```typescript
// apps/web/src/app/[page]/page.tsx
'use client';

import { useHeroImage } from '@/hooks/useHeroImage';
// ... other imports

export default function YourPage() {
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/your-page-path', '/images/fallback.jpg');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image - NOW DYNAMIC! */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" 
          style={{backgroundImage: `url(${heroImage.url})`}}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Hero Content */}
        <div className="relative">
          {/* Your hero content here */}
        </div>
      </section>
    </div>
  );
}
```

## Pages Requiring Implementation

### ✅ Completed
- `/drones` - Drones page

### 🔄 Pending Implementation
- `/` - Landing Page
- `/about` - About SHELTR
- `/team` - Team Page
- `/solutions` - Solutions Overview
- `/solutions/donors` - For Donors
- `/solutions/participants` - For Participants
- `/solutions/organizations` - For Organizations
- `/pods` - SHELTR Pod Overview
- `/mobi` - MOBI Bikes
- `/impact` - Impact Stories
- `/scan-give` - Scan & Give
- `/donate` - Donation Page
- `/contact` - Contact Form

## Firestore Query

The system queries `gallery_images` collection:

```javascript
const q = query(
  galleryRef,
  where('heroPages', 'array-contains', pagePath),
  where('isPublic', '==', true),
  orderBy('order', 'asc'),
  limit(1)
);
```

### Required Firestore Index

This query requires a composite index in Firestore:

**Collection:** `gallery_images`  
**Fields indexed:**
- `heroPages` (Array)
- `isPublic` (Ascending)
- `order` (Ascending)
- `__name__` (Ascending)

**Query scope:** Collection

Firebase will automatically create this index when the query is first executed. The index typically takes 1-3 minutes to build.

## Benefits

1. **Dynamic Management**: Admins can change hero images without code changes
2. **Multi-Page Support**: One image can be hero for multiple pages
3. **SEO Optimized**: Server-side metadata generation for social sharing
4. **Fallback Support**: Gracefully falls back to default images
5. **Real-time Updates**: Client-side hook updates when gallery changes

## Testing Checklist

- [ ] Hero image displays on page load
- [ ] Open Graph tags show correct image when sharing
- [ ] Twitter Card shows correct image
- [ ] Fallback works when no hero image selected
- [ ] Multiple pages can use same hero image
- [ ] Gallery badge shows "HERO (X)" count correctly

## Troubleshooting

### Hero image not displaying
1. Check Firestore: Does image have `/your-path` in `heroPages` array?
2. Check `isPublic: true` on the image
3. Check browser console for Firestore errors
4. Verify fallback image path is correct

### OG tags not updating
1. Clear social media cache (Facebook Debugger, Twitter Card Validator)
2. Verify `generateMetadata()` is async function
3. Check server logs for Firestore connection issues

### Image loads slowly
1. Optimize image size in gallery (should be ~200KB max)
2. Consider adding loading skeleton in hero section
3. Use `loading` state from `useHeroImage` hook

## Next Steps

1. ✅ Test drones page implementation
2. Roll out to remaining 13 public pages
3. Create batch update script (optional)
4. Document for team in platform admin guide

