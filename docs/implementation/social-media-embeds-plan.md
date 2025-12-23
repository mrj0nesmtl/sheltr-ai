# Social Media Video Embedding - Implementation Plan

## Overview
Add support for embedding TikTok and X (Twitter) videos in both the Gallery and Angels sections, manageable through the dashboard without code changes.

## Current State
- **Angels Page**: Hardcoded array of 12 TikTok videos in `/angels/page.tsx`
- **Gallery**: Supports image/video uploads only, no social media embeds
- **Dashboard**: No UI for managing Angels videos

## Proposed Changes

### 1. Database Schema Updates (`GalleryMedia` interface)

```typescript
interface GalleryMedia {
  // ... existing fields ...
  
  // NEW: Social Media Embed Support
  embedUrl?: string; // Full social media URL (TikTok, X, YouTube)
  embedType?: 'tiktok' | 'twitter' | 'youtube' | null;
  embedId?: string; // Extracted video ID for embedding
  
  // NEW: Angels Page Support
  isAngelsVideo?: boolean; // Show in Angels "Because the System is Broken" section
  angelsOrder?: number; // Display order in Angels carousel
  
  // EXISTING: mediaType extended
  mediaType: 'image' | 'video' | 'embed'; // Add 'embed' type
}
```

### 2. Dashboard Enhancements

#### A. Gallery Upload Modal
- Add **"Link from Social Media"** tab alongside "Upload File"
- Fields:
  - Social Media URL input (validates TikTok/X/YouTube)
  - Auto-detect platform and extract video ID
  - Title (required)
  - Description (optional)
  - Tags (optional)
  - Category selection
  - Toggle: "Add to Angels Page"
  - Display order (if Angels enabled)

#### B. New "Angels Videos" Section
- Dedicated tab/section in dashboard
- Grid view of all Angels videos
- Drag-and-drop reordering
- Quick actions: Edit, Delete, Preview
- Add new button (opens same modal)

### 3. Video Link Parser Utility

```typescript
// /lib/socialMediaParser.ts
export function parseSocialMediaUrl(url: string): {
  platform: 'tiktok' | 'twitter' | 'youtube' | null;
  videoId: string | null;
  embedUrl: string | null;
}
```

**Supported Formats:**
- TikTok: `https://www.tiktok.com/@username/video/7539670401589218582`
  - Extracts: `7539670401589218582`
  - Embed: `https://www.tiktok.com/embed/v2/7539670401589218582`

- X/Twitter: `https://x.com/i/status/2002615185954201693`
  - Extracts: `2002615185954201693`
  - Embed: `https://platform.twitter.com/embed/Tweet.html?id=2002615185954201693`

- YouTube: `https://www.youtube.com/watch?v=VIDEO_ID`
  - Extracts: `VIDEO_ID`
  - Embed: `https://www.youtube.com/embed/VIDEO_ID`

### 4. Angels Page Updates

**Current Implementation:**
```typescript
const tiktokVideos = [ /* hardcoded array */ ];
```

**New Implementation:**
```typescript
// Load from Firestore
useEffect(() => {
  const loadAngelsVideos = async () => {
    const q = query(
      collection(db, 'gallery_media'),
      where('isAngelsVideo', '==', true),
      orderBy('angelsOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    setVideos(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  };
  loadAngelsVideos();
}, []);
```

**Embedding Logic:**
```typescript
{videos.map((video) => (
  video.mediaType === 'embed' && video.embedType === 'tiktok' ? (
    <iframe src={`https://www.tiktok.com/embed/v2/${video.embedId}`} />
  ) : video.embedType === 'twitter' ? (
    <iframe src={`https://platform.twitter.com/embed/Tweet.html?id=${video.embedId}`} />
  ) : null
))}
```

### 5. Migration Strategy

**Option A: One-time Migration Script**
```typescript
// scripts/migrate-angels-videos.ts
// Converts hardcoded tiktokVideos array to Firestore documents
```

**Option B: Manual Entry**
- Admin uses new dashboard UI to add existing 12 TikTok URLs
- Preserves order and metadata
- Allows cleaning/updating descriptions

### 6. User Workflow

#### Adding a TikTok/X Video to Angels:
1. Go to `/dashboard/gallery`
2. Click "Add Media" → "Link from Social Media" tab
3. Paste TikTok or X URL
4. System auto-fills:
   - Platform type
   - Video ID
   - Embed URL
5. Admin fills:
   - Title
   - Description (optional)
   - Tags (optional)
6. Toggle "Add to Angels Page" ON
7. Set display order
8. Click "Save"
9. Video immediately appears on `/angels` page

#### Adding a Video Link to Gallery:
- Same as above, but skip "Add to Angels" toggle
- Video appears in `/gallery` with embed player

### 7. UI Components Needed

**New Components:**
1. `SocialMediaLinkInput.tsx`
   - URL input with validation
   - Real-time platform detection
   - Preview of embed

2. `AngelsVideoManager.tsx`
   - Grid of Angels videos
   - Drag-drop reordering
   - Bulk actions

3. `EmbedPlayer.tsx`
   - Universal player for TikTok/X/YouTube
   - Fallback handling
   - Responsive aspect ratios

### 8. Backend Considerations

**Firestore Rules:**
```javascript
// Allow admins to manage Angels videos
match /gallery_media/{docId} {
  allow read: if true; // Public
  allow write: if request.auth.token.role == 'super_admin';
}
```

**Storage:**
- No file storage needed for embeds
- Thumbnails could be generated/cached (optional)

### 9. Testing Checklist

- [ ] Parse TikTok URLs correctly
- [ ] Parse X/Twitter URLs correctly
- [ ] Embeds display correctly on Angels page
- [ ] Mobile carousel works with embeds
- [ ] Desktop grid works with embeds
- [ ] Dashboard CRUD operations work
- [ ] Reordering persists correctly
- [ ] Public gallery embeds work
- [ ] Fallback for failed embeds
- [ ] No broken hardcoded references

### 10. Benefits

✅ **No Code Changes Needed**: Add videos through dashboard
✅ **Multi-Platform**: TikTok, X, YouTube support
✅ **Dual Use**: Same system for Angels AND Gallery
✅ **Flexible**: Reorder, edit, delete without deployment
✅ **Scalable**: Add unlimited videos
✅ **Maintainable**: Centralized in Firestore

---

## Implementation Priority

### Phase 1: Core Functionality (MVP)
1. Add embed fields to GalleryMedia interface ✅
2. Create social media URL parser utility ✅
3. Update dashboard upload modal with link input ✅
4. Update Angels page to load from Firestore ✅

### Phase 2: Enhanced Management
5. Add Angels video management section ✅
6. Implement drag-drop reordering ✅
7. Add bulk operations ✅

### Phase 3: Migration & Testing
8. Migrate existing 12 TikTok videos ✅
9. Full testing across devices ✅
10. Documentation for admins ✅

---

## Estimated Effort
- **Phase 1**: ~3-4 hours (core functionality)
- **Phase 2**: ~2-3 hours (enhanced UI)
- **Phase 3**: ~1-2 hours (migration & testing)
- **Total**: ~6-9 hours

---

## Questions to Resolve

1. **Migration**: Auto-migrate or manual entry?
2. **Default Category**: What category for Angels videos? Create "angels" category?
3. **Thumbnails**: Auto-generate or use platform's?
4. **Moderation**: Any approval workflow needed?
5. **Limits**: Max videos per page? Storage limits?

---

## Ready to Proceed?

This plan provides a complete solution for embedding social media videos without hardcoding. The system will be:
- **User-friendly**: Dashboard UI for all operations
- **Flexible**: Works for Angels AND Gallery
- **Maintainable**: No code changes to add videos
- **Scalable**: Unlimited videos, multi-platform

**Next Step**: Approve plan and I'll begin implementation! 🚀
