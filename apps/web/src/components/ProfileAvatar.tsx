'use client';

import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, getMetadata } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { UserCog } from 'lucide-react';

interface ProfileAvatarProps {
  userId: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Enhanced cache to avoid repeated lookups and failed checks
const profilePicCache = new Map<string, { 
  url: string | null; 
  timestamp: number; 
  checked: boolean; // Track if we've already done a full check
}>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes (longer cache for "not found" results)
const FAILED_CHECK_CACHE_DURATION = 60 * 60 * 1000; // 1 hour for failed checks

// Helper function to pre-mark users as having no avatar (useful for bulk operations)
export const markUserAsNoAvatar = (userId: string) => {
  profilePicCache.set(userId, {
    url: null,
    timestamp: Date.now(),
    checked: true
  });
};

export function ProfileAvatar({ userId, size = 'medium', className = '' }: ProfileAvatarProps) {
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Size configurations
  const sizeConfig = {
    small: { container: 'h-8 w-8', icon: 'h-4 w-4' },
    medium: { container: 'h-10 w-10', icon: 'h-5 w-5' },
    large: { container: 'h-16 w-16', icon: 'h-8 w-8' }
  };

  const { container, icon } = sizeConfig[size];

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        // Check cache first with smarter duration handling
        const cached = profilePicCache.get(userId);
        if (cached) {
          const age = Date.now() - cached.timestamp;
          const cacheLimit = cached.url === null ? FAILED_CHECK_CACHE_DURATION : CACHE_DURATION;
          
          if (age < cacheLimit) {
            setProfilePicUrl(cached.url);
            setError(cached.url === null);
            setLoading(false);
            return;
          }
        }

        // Reduced list - only check most common formats to minimize requests
        const possiblePaths = [
          `profiles/${userId}/avatar.jpg`,
          `profiles/${userId}/avatar.png`,
          `profiles/${userId}/profile.jpg` // Only one fallback naming convention
        ];

        let foundUrl = null;

        // Try each possible path efficiently
        for (const path of possiblePaths) {
          try {
            const storageRef = ref(storage, path);
            
            // First check if file exists by getting metadata (more efficient)
            await getMetadata(storageRef);
            
            // If metadata succeeds, file exists - now get download URL
            const url = await getDownloadURL(storageRef);
            foundUrl = url;
            break; // Stop searching once we find one
          } catch (pathError: any) {
            // Silently continue for expected "not found" errors
            // Only log unexpected errors in development
            if (pathError.code !== 'storage/object-not-found' && process.env.NODE_ENV === 'development') {
              console.warn(`Profile avatar access error for ${path}:`, pathError.code);
            }
          }
        }

        // Cache the result (whether found or not) with checked flag
        profilePicCache.set(userId, {
          url: foundUrl,
          timestamp: Date.now(),
          checked: true
        });

        if (foundUrl) {
          setProfilePicUrl(foundUrl);
        } else {
          // Silently handle missing avatars - this is expected behavior
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching profile picture:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePicture();
  }, [userId]);

  // Show loading state
  if (loading) {
    return (
      <div 
        className={`${container} rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse ${className}`}
      >
        <UserCog className={`${icon} text-white`} />
      </div>
    );
  }

  // Show profile picture if available
  if (profilePicUrl && !error) {
    return (
      <div className={`${container} rounded-full overflow-hidden shadow-lg ${className}`}>
        <img
          src={profilePicUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={() => {
            // Silently handle image load failures
            setError(true);
            setProfilePicUrl(null);
            // Update cache to mark as failed
            profilePicCache.set(userId, {
              url: null,
              timestamp: Date.now(),
              checked: true
            });
          }}
        />
      </div>
    );
  }

  // Fallback to default gradient avatar
  return (
    <div 
      className={`${container} rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg ${className}`}
    >
      <UserCog className={`${icon} text-white`} />
    </div>
  );
}
