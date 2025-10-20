/**
 * Hero Image Management
 * Fetches hero images from Firestore gallery based on page paths
 */

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export interface HeroImageData {
  url: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Get hero image for a specific page path from Firestore gallery
 * @param pagePath - The page path (e.g., '/drones', '/about')
 * @returns Hero image data or null if not found
 */
export async function getHeroImageForPage(pagePath: string): Promise<HeroImageData | null> {
  try {
    // Query gallery_media collection for images with this page in heroPages array
    const galleryRef = collection(db, 'gallery_media');
    const q = query(
      galleryRef,
      where('heroPages', 'array-contains', pagePath),
      where('isPublic', '==', true),
      orderBy('order', 'asc'),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(`No hero image found for page: ${pagePath}`);
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      url: data.src || data.url || '',
      alt: data.title || `SHELTR ${pagePath.replace('/', '')} hero image`,
      width: data.width || 1200,
      height: data.height || 630,
    };
  } catch (error) {
    console.error(`Error fetching hero image for ${pagePath}:`, error);
    return null;
  }
}

/**
 * Get fallback hero image (default OG image)
 */
export function getFallbackHeroImage(): HeroImageData {
  return {
    url: '/og-image.jpg',
    alt: 'SHELTR - Blockchain-powered platform for direct participant empowerment',
    width: 1200,
    height: 630,
  };
}

/**
 * Get hero image with fallback
 * @param pagePath - The page path
 * @returns Hero image data (from gallery or fallback)
 */
export async function getHeroImageWithFallback(pagePath: string): Promise<HeroImageData> {
  const heroImage = await getHeroImageForPage(pagePath);
  return heroImage || getFallbackHeroImage();
}

