# Dashboard Social Media Integration Guide

## Overview
This guide shows how to integrate the `SocialMediaEmbedForm` component into the Gallery Dashboard to enable adding TikTok/X/YouTube videos by URL.

## Files Created
1. ✅ `/lib/socialMediaParser.ts` - URL parser utility
2. ✅ `/components/SocialMediaEmbedForm.tsx` - Embed form component
3. ✅ `/scripts/migrate-angels-videos.ts` - Migration script

## Integration Steps for `/app/dashboard/gallery/page.tsx`

### Step 1: Add Imports (Top of File)

```typescript
// Add to existing imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialMediaEmbedForm, type EmbedFormData } from '@/components/SocialMediaEmbedForm';
import { parseSocialMediaUrl } from '@/lib/socialMediaParser';
```

### Step 2: Add State for Tab Selection (Around line 200 with other state)

```typescript
// Add new state
const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');
```

### Step 3: Add Handler for Social Media Embeds (After `handleFileSelection` function)

```typescript
/**
 * Handle social media embed submission
 */
const handleSocialMediaEmbed = async (embedData: EmbedFormData) => {
  if (!user) return;

  setUploading(true);
  try {
    // Create Firestore document for embed
    const docRef = await addDoc(collection(db, 'gallery_media'), {
      // Basic info
      title: embedData.title,
      description: embedData.description,
      category: embedData.category,
      tags: embedData.tags,
      date: new Date().toISOString().split('T')[0],
      
      // Media type
      mediaType: 'embed',
      src: embedData.embedUrl, // Store original URL
      
      // Social media embed fields
      embedUrl: embedData.embedUrl,
      embedType: embedData.embedType,
      embedId: embedData.embedId,
      embedUsername: embedData.embedUsername,
      
      // Angels page specific
      isAngelsVideo: embedData.isAngelsVideo,
      angelsOrder: embedData.angelsOrder,
      
      // Visibility flags
      isPublic: embedData.isPublic,
      isPrivate: false,
      isHero: false,
      isLandingHero: false,
      isFoundersGallery: false,
      isInvestorDataRoom: false,
      
      // Metadata
      aspectRatio: embedData.aspectRatio,
      width: embedData.aspectRatio === '9:16' ? 1080 : 1920,
      height: embedData.aspectRatio === '9:16' ? 1920 : 1080,
      
      // Timestamps
      uploadedBy: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: images.length, // Add to end
    });

    // Reload gallery
    await loadImages();
    
    // Close dialog and reset
    setUploadDialogOpen(false);
    setUploadMode('file');
    
    setAlert({
      type: 'success',
      message: `✅ ${embedData.embedType.toUpperCase()} video added successfully!${embedData.isAngelsVideo ? ' Added to Angels page.' : ''}`,
    });
  } catch (error) {
    console.error('Error adding social media embed:', error);
    setAlert({
      type: 'error',
      message: 'Failed to add video. Please try again.',
    });
  } finally {
    setUploading(false);
  }
};
```

### Step 4: Update Upload Dialog (Replace existing DialogContent around line 1062)

**Find this section:**
```typescript
<DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle>Upload New Media</DialogTitle>
  </DialogHeader>
  <div className="space-y-6 pb-24 sm:pb-6">
    {/* File Selection - Top Priority */}
    <div className="space-y-3">
      ...existing file upload UI...
    </div>
  </div>
</DialogContent>
```

**Replace with:**
```typescript
<DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle>Add New Media</DialogTitle>
  </DialogHeader>
  
  {/* Tabs for Upload Mode */}
  <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as 'file' | 'link')}>
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="file">Upload File</TabsTrigger>
      <TabsTrigger value="link">Link from Social Media</TabsTrigger>
    </TabsList>
    
    {/* File Upload Tab */}
    <TabsContent value="file" className="space-y-6 pb-24 sm:pb-6">
      {/* KEEP ALL EXISTING FILE UPLOAD UI HERE */}
      {/* This is the current content starting with "File Selection - Top Priority" */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Select Media File</label>
        {/* ... rest of existing file upload UI ... */}
      </div>
    </TabsContent>
    
    {/* Social Media Link Tab */}
    <TabsContent value="link" className="space-y-6 pb-24 sm:pb-6">
      <SocialMediaEmbedForm
        categories={categories}
        onSubmit={handleSocialMediaEmbed}
        onCancel={() => setUploadDialogOpen(false)}
      />
    </TabsContent>
  </Tabs>
</DialogContent>
```

### Step 5: Update `loadImages` to Handle Embeds (Around line 300)

**Find the `loadImages` function and ensure it handles the new `mediaType: 'embed'`:**

```typescript
const loadImages = async () => {
  if (!user) return;
  
  setIsLoading(true);
  try {
    const q = query(collection(db, 'gallery_media'));
    const querySnapshot = await getDocs(q);
    
    const loadedImages: GalleryMedia[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure mediaType defaults correctly
        mediaType: data.mediaType || (data.embedUrl ? 'embed' : 'image'),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as GalleryMedia;
    });
    
    // Sort by order
    loadedImages.sort((a, b) => a.order - b.order);
    setImages(loadedImages);
  } catch (error) {
    console.error('Error loading images:', error);
    setAlert({ type: 'error', message: 'Failed to load gallery media' });
  } finally {
    setIsLoading(false);
  }
};
```

### Step 6: Update Edit Dialog to Handle Embeds (Around line 1420)

**In the Edit Dialog, add a read-only display for embed info:**

```typescript
{/* After the existing form fields in Edit Dialog, add: */}

{/* Embed Info Display - Read Only */}
{editingImage.mediaType === 'embed' && (
  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Embedded Video</h4>
    <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
      <p><strong>Platform:</strong> {editingImage.embedType?.toUpperCase()}</p>
      <p><strong>Video ID:</strong> {editingImage.embedId}</p>
      {editingImage.embedUsername && (
        <p><strong>Username:</strong> {editingImage.embedUsername}</p>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        ℹ️ Embed URL cannot be edited. Delete and re-add to change.
      </p>
    </div>
  </div>
)}
```

## Testing Checklist

After integration, test:

1. **Upload Modal**
   - [ ] "Upload File" tab works (existing functionality)
   - [ ] "Link from Social Media" tab appears
   - [ ] Switching between tabs works

2. **TikTok Links**
   - [ ] Paste TikTok URL → Auto-detects platform
   - [ ] Fill form → Submit → Appears in gallery
   - [ ] Toggle "Add to Angels" → Check Angels page

3. **X (Twitter) Links**
   - [ ] Paste X.com URL → Auto-detects
   - [ ] Submit → Appears in gallery

4. **YouTube Links**
   - [ ] Paste YouTube URL → Auto-detects
   - [ ] Submit → Appears in gallery

5. **Edit Functionality**
   - [ ] Edit embed item → Shows embed info
   - [ ] Can edit title, description, tags, category
   - [ ] Can toggle Angels visibility
   - [ ] Save works correctly

6. **Delete Functionality**
   - [ ] Can delete embed items
   - [ ] No storage cleanup needed (no files)

7. **Angels Page**
   - [ ] Videos with `isAngelsVideo: true` appear
   - [ ] Ordered by `angelsOrder`
   - [ ] Embeds display correctly

## Migration

Run the migration script to add existing 12 TikTok videos:

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai
npx ts-node scripts/migrate-angels-videos.ts
```

Expected output:
```
🚀 Starting Angels TikTok Videos Migration...

✅ [1/12] Queued: London News Exposed (7539670401589218582)
✅ [2/12] Queued: Hard Knock Gospel (7534020508094942494)
...
✅ [12/12] Queued: Mohbd97 (7537678541589122318)

🎉 Migration Complete!
   ✅ Success: 12 videos
   ❌ Errors: 0 videos

📍 Videos are now in Firestore collection: gallery_media
   - Category: "clips"
   - isAngelsVideo: true
   - angelsOrder: 0-11 (preserved)

✨ Migration script completed successfully!
```

## Next Steps

After dashboard integration:

1. **Update Angels Page** to load from Firestore (see next guide)
2. **Test adding new videos** through dashboard
3. **Verify Angels page** displays both migrated and new videos
4. **Update public Gallery** to handle embed rendering (if needed)

## Troubleshooting

**Issue: Tabs component not found**
```bash
# Install shadcn tabs component
npx shadcn-ui@latest add tabs
```

**Issue: Migration fails with "serviceAccountKey.json not found"**
- Ensure `serviceAccountKey.json` exists at project root
- Download from Firebase Console → Project Settings → Service Accounts

**Issue: Embeds not displaying on Angels page**
- Check Firestore query includes `isAngelsVideo: true`
- Verify `angelsOrder` field exists
- Check browser console for errors

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Firestore rules allow reads/writes
3. Check that user has `super_admin` or `platform_admin` role
