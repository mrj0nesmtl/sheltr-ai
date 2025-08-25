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

// Simple cache to avoid repeated lookups
const profilePicCache = new Map<string, { url: string | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

        // Check cache first
        const cached = profilePicCache.get(userId);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
          setProfilePicUrl(cached.url);
          setError(cached.url === null);
          setLoading(false);
          return;
        }

        // Try different possible file extensions and paths
        const possiblePaths = [
          `profiles/${userId}/avatar.jpg`,
          `profiles/${userId}/avatar.jpeg`,
          `profiles/${userId}/avatar.png`,
          `profiles/${userId}/avatar.webp`,
          // Also check if uploaded with different naming
          `profiles/${userId}/profile.jpg`,
          `profiles/${userId}/profile.jpeg`,
          `profiles/${userId}/profile.png`,
          `profiles/${userId}/profile.webp`
        ];

        let foundUrl = null;

        // Try each possible path with metadata check first to avoid 403 errors
        for (const path of possiblePaths) {
          try {
            const storageRef = ref(storage, path);
            
            // First check if file exists by getting metadata (more efficient)
            await getMetadata(storageRef);
            
            // If metadata succeeds, file exists - now get download URL
            const url = await getDownloadURL(storageRef);
            foundUrl = url;
            console.log(`✅ Found profile picture at: ${path}`);
            break; // Stop searching once we find one
          } catch (pathError: any) {
            // Only log actual errors, not "file not found" cases
            if (pathError.code !== 'storage/object-not-found') {
              console.log(`❌ Error accessing ${path}:`, pathError.code);
            }
            // Continue to next path silently for file-not-found errors
          }
        }

        // Cache the result (whether found or not)
        profilePicCache.set(userId, {
          url: foundUrl,
          timestamp: Date.now()
        });

        if (foundUrl) {
          setProfilePicUrl(foundUrl);
        } else {
          console.log(`📷 No profile picture found for user: ${userId}`);
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
            console.log('❌ Failed to load profile image');
            setError(true);
            setProfilePicUrl(null);
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
