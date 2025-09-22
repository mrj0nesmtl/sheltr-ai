import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  date: string;
  isPublic: boolean;
  isPrivate: boolean; // Hide from public gallery (internal use only)
  isHero: boolean; // Hero image for gallery page
  isLandingHero: boolean; // Hero image for landing page
  order: number;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
  // Image metadata
  width?: number;
  height?: number;
  aspectRatio?: string;
  fileSize?: number;
}

export class GalleryService {
  /**
   * Get the current gallery hero image
   */
  static async getGalleryHeroImage(): Promise<GalleryImage | null> {
    try {
      const q = query(
        collection(db, 'gallery_images'),
        where('isHero', '==', true),
        where('isPublic', '==', true),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as GalleryImage;
      
    } catch (error) {
      console.error('Error fetching gallery hero image:', error);
      return null;
    }
  }

  /**
   * Get the current landing page hero image
   */
  static async getLandingHeroImage(): Promise<GalleryImage | null> {
    try {
      const q = query(
        collection(db, 'gallery_images'),
        where('isLandingHero', '==', true),
        where('isPublic', '==', true),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as GalleryImage;
      
    } catch (error) {
      console.error('Error fetching landing hero image:', error);
      return null;
    }
  }

  /**
   * Get all public gallery images ordered by their order field
   */
  static async getPublicGalleryImages(): Promise<GalleryImage[]> {
    try {
      const q = query(
        collection(db, 'gallery_images'),
        where('isPublic', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const images: GalleryImage[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only include images that are not marked as private
        if (!data.isPrivate) {
          images.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as GalleryImage);
        }
      });
      
      // Sort by order field
      images.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return images;
      
    } catch (error) {
      console.error('Error fetching public gallery images:', error);
      return [];
    }
  }

  /**
   * Get images by category
   */
  static async getImagesByCategory(category: string): Promise<GalleryImage[]> {
    try {
      const q = query(
        collection(db, 'gallery_images'),
        where('isPublic', '==', true),
        where('category', '==', category)
      );
      
      const querySnapshot = await getDocs(q);
      const images: GalleryImage[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        images.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as GalleryImage);
      });
      
      // Sort by order field
      images.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return images;
      
    } catch (error) {
      console.error(`Error fetching images for category ${category}:`, error);
      return [];
    }
  }
}
