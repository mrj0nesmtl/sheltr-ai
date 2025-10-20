'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PodModelImage {
  url: string;
  alt: string;
}

interface PodModelImages {
  modelA: PodModelImage;
  modelB: PodModelImage;
  mobi: PodModelImage;
  loading: boolean;
}

const defaultImages: Omit<PodModelImages, 'loading'> = {
  modelA: {
    url: '/images/sheltr_units/sleeper-1.jpeg',
    alt: 'SHELTR Model A - One-Person Unit'
  },
  modelB: {
    url: '/images/sheltr_units/sleeper-2.jpeg',
    alt: 'SHELTR Model B - Two-Person Unit'
  },
  mobi: {
    url: '/images/sheltr_units/bike-1.jpeg',
    alt: 'SHELTR MOBI Electric Bike'
  }
};

/**
 * Custom hook to fetch pod model images from Firestore gallery
 * Falls back to default images if not found
 */
export function usePodModelImages(): PodModelImages {
  const [images, setImages] = useState<Omit<PodModelImages, 'loading'>>(defaultImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodModelImages = async () => {
      try {
        const galleryRef = collection(db, 'gallery_images');
        
        // Fetch all images with podModel field set
        const q = query(
          galleryRef,
          where('isPublic', '==', true)
        );

        const snapshot = await getDocs(q);
        const newImages = { ...defaultImages };

        snapshot.forEach((doc) => {
          const data = doc.data();
          const podModel = data.podModel;

          if (podModel === 'model-a' && data.src) {
            newImages.modelA = {
              url: data.src,
              alt: data.title || 'SHELTR Model A - One-Person Unit'
            };
          } else if (podModel === 'model-b' && data.src) {
            newImages.modelB = {
              url: data.src,
              alt: data.title || 'SHELTR Model B - Two-Person Unit'
            };
          } else if (podModel === 'mobi' && data.src) {
            newImages.mobi = {
              url: data.src,
              alt: data.title || 'SHELTR MOBI Electric Bike'
            };
          }
        });

        setImages(newImages);
      } catch (error) {
        console.error('Error fetching pod model images:', error);
        // Keep default images on error
      } finally {
        setLoading(false);
      }
    };

    fetchPodModelImages();
  }, []);

  return {
    ...images,
    loading
  };
}

