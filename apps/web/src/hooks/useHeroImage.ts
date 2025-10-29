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
        
        // Query gallery_images collection for images with this page in heroPages array
        const galleryRef = collection(db, 'gallery_images');
        const q = query(
          galleryRef,
          where('heroPages', 'array-contains', pagePath),
          where('isPublic', '==', true),
          orderBy('order', 'asc'),
          limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();

          // Determine if this is a video or image
          const mediaType = data.mediaType || data.type?.startsWith('video') ? 'video' : 'image';

          setHeroImage({
            url: data.src || data.url || fallbackUrl,
            alt: data.title || `SHELTR ${pagePath.replace('/', '')} hero ${mediaType}`,
            width: data.width || 1920,
            height: data.height || 1080,
            mediaType: mediaType,
            type: data.type || (mediaType === 'video' ? 'video/mp4' : 'image/jpeg'),
          });
        } else {
          console.log(`No hero media found for page: ${pagePath}, using fallback`);
          setHeroImage({
            url: fallbackUrl,
            alt: `SHELTR ${pagePath.replace('/', '')} hero image`,
            mediaType: 'image',
          });
        }
      } catch (err) {
        console.error(`Error fetching hero media for ${pagePath}:`, err);
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

