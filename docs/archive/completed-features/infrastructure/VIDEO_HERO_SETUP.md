# 🎥 Video Hero Setup Guide

## Overview
The homepage hero section now supports both **images** and **videos** as background media. Videos will autoplay, loop, and play muted for a seamless background experience.

## How to Set Up a Video Hero

### 1. Upload Your Video
1. Go to **Gallery Management Dashboard** (`/dashboard/gallery`)
2. Click **"Upload Media"**
3. Select your compressed landscape video (recommended: 8 seconds, MP4 format)
4. Upload the video

### 2. Configure for Homepage
1. After upload, click **Edit** on your video
2. In the **Hero Pages** section:
   - Add `/` (homepage) to the hero pages array
   - Or toggle "Homepage" if available
3. Make sure **"Public"** is toggled ON
4. Set the **Order** (lower numbers appear first)
5. Click **Save**

### 3. Video Requirements
- **Format**: MP4 (H.264 codec recommended)
- **Orientation**: Landscape (16:9 ratio ideal)
- **Duration**: 8 seconds (or any short loop)
- **Size**: Well-compressed (aim for under 5MB for fast loading)
- **Resolution**: 1920x1080 recommended (Full HD)

## Technical Details

### Files Modified
1. **`apps/web/src/hooks/useHeroImage.ts`**
   - Added `mediaType` and `type` fields to `HeroImageData` interface
   - Detects video vs image based on `mediaType` or MIME type
   - Returns video metadata when applicable

2. **`apps/web/src/components/StandardHero.tsx`**
   - Added video rendering with `<video>` element
   - Supports `autoPlay`, `loop`, `muted`, and `playsInline` attributes
   - Falls back to image if video fails to load
   - Maintains same gradient overlay for text readability

3. **`apps/web/src/app/page.tsx`**
   - Passes `mediaType` and `videoType` props to `StandardHero`
   - Automatically uses video when detected from gallery

### Video Element Features
```tsx
<video
  autoPlay      // Starts playing automatically
  loop          // Loops indefinitely
  muted         // Muted for autoplay compliance
  playsInline   // Plays inline on mobile (no fullscreen)
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src={videoUrl} type="video/mp4" />
</video>
```

### Firestore Schema
Your video document in `gallery_images` should have:
```typescript
{
  src: "https://storage.googleapis.com/your-video.mp4",
  title: "Homepage Hero Video",
  mediaType: "video",  // or type: "video/mp4"
  type: "video/mp4",
  heroPages: ["/"],
  isPublic: true,
  order: 0,
  width: 1920,
  height: 1080
}
```

## Testing
1. Upload a video via Gallery Management
2. Configure it for homepage (`/`)
3. Visit homepage - video should autoplay and loop
4. Check mobile - video should play inline without fullscreen

## Fallback Behavior
- If video fails to load → falls back to image
- If no hero media found → uses default fallback image
- Gradient overlay always applied for text readability

## Browser Compatibility
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (requires `playsInline` for mobile)
- ✅ Mobile browsers: Autoplay works when muted

## Performance Tips
1. **Compress your video**: Use tools like HandBrake or FFmpeg
2. **Optimize codec**: H.264 is widely supported and efficient
3. **Consider poster image**: Add a poster attribute for loading state
4. **Test on mobile**: Ensure smooth playback on slower connections

## Example FFmpeg Compression Command
```bash
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 2M -b:a 128k -s 1920x1080 output.mp4
```

---

**Ready to go!** 🚀 Just upload your video through the Gallery Management dashboard and toggle it for the homepage.
