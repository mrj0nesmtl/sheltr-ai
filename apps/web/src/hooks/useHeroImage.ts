/**
 * Client-side hook to fetch hero images from Firestore gallery
 */

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export interface HeroImageData {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  mediaType?: 'image' | 'video';
  type?: string; // Full MIME type (e.g., 'video/mp4', 'image/jpeg')
}

/**
 * Hook to fetch hero image for a specific page path
 * @param pagePath - The page path (e.g., '/drones', '/about')
 * @param fallbackUrl - Fallback image URL if no hero found
 * @returns Hero image data
 */
export function useHeroImage(pagePath: string, fallbackUrl: string = '/og-image.jpg'): {
  heroImage: HeroImageData;
  loading: boolean;
  error: Error | null;
} {
  const [heroImage, setHeroImage] = useState<HeroImageData>({
    url: fallbackUrl,
    alt: `SHELTR ${pagePath.replace('/', '')} hero image`,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        setLoading(true);
        
        // Query BOTH collections for hero images
        // 1. Check gallery_images (legacy)
        const galleryImagesRef = collection(db, 'gallery_images');
        const galleryImagesQuery = query(
          galleryImagesRef,
          where('heroPages', 'array-contains', pagePath),
          where('isPublic', '==', true),
          orderBy('order', 'asc'),
          limit(1)
        );

        // 2. Check gallery_media (new)
        const galleryMediaRef = collection(db, 'gallery_media');
        const galleryMediaQuery = query(
          galleryMediaRef,
          where('heroPages', 'array-contains', pagePath),
          where('isPublic', '==', true),
          orderBy('order', 'asc'),
          limit(1)
        );

        const [imagesSnapshot, mediaSnapshot] = await Promise.all([
          getDocs(galleryImagesQuery),
          getDocs(galleryMediaQuery)
        ]);

        console.log(`🔍 Hero search for ${pagePath}:`, {
          gallery_images: imagesSnapshot.size,
          gallery_media: mediaSnapshot.size
        });

        // Prefer gallery_media if found, otherwise use gallery_images
        const doc = !mediaSnapshot.empty ? mediaSnapshot.docs[0] : 
                    !imagesSnapshot.empty ? imagesSnapshot.docs[0] : null;

        if (doc) {
          const data = doc.data();
          const collection = !mediaSnapshot.empty ? 'gallery_media' : 'gallery_images';

          // Determine if this is a video or image
          const mediaType = data.mediaType || data.type?.startsWith('video') ? 'video' : 'image';

          console.log(`✅ Hero found in ${collection}:`, {
            src: data.src,
            url: data.url,
            title: data.title,
            mediaType
          });

          setHeroImage({
            url: data.src || data.url || fallbackUrl,
            alt: data.title || `SHELTR ${pagePath.replace('/', '')} hero ${mediaType}`,
            width: data.width || 1920,
            height: data.height || 1080,
            mediaType: mediaType,
            type: data.type || (mediaType === 'video' ? 'video/mp4' : 'image/jpeg'),
          });
        } else {
          console.log(`⚠️ No hero media found for page: ${pagePath}, using fallback`);
          setHeroImage({
            url: fallbackUrl,
            alt: `SHELTR ${pagePath.replace('/', '')} hero image`,
            mediaType: 'image',
          });
        }
      } catch (err) {
        console.error(`❌ Error fetching hero media for ${pagePath}:`, err);
        setError(err as Error);
        setHeroImage({
          url: fallbackUrl,
          alt: `SHELTR ${pagePath.replace('/', '')} hero image`,
          mediaType: 'image',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHeroImage();
  }, [pagePath, fallbackUrl]);

  return { heroImage, loading, error };
}

