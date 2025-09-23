/**
 * User Status Service
 * 
 * Manages real-time user online/offline status with Firestore persistence.
 * Features:
 * - Real-time status updates
 * - Automatic offline detection on page visibility changes
 * - Activity tracking
 * - Status colors and labels for UI
 * 
 * Status Types:
 * - online: User is actively using the platform (green)
 * - offline: User has left or closed the platform (gray)
 * - busy: User is online but doesn't want to be disturbed (orange)
 * - invisible: User appears offline to others but is actually online (gray)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, updateDoc, setDoc, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type UserStatus = 'online' | 'offline' | 'busy' | 'invisible';

export interface UserStatusData {
  status: UserStatus;
  lastSeen: Timestamp;
  lastActivity: Timestamp;
}

// Status colors for UI
export const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-orange-500',
  invisible: 'bg-gray-300'
} as const;

// Status labels for UI
export const statusLabels = {
  online: 'Online',
  offline: 'Offline', 
  busy: 'Busy',
  invisible: 'Invisible'
} as const;

/**
 * Hook to manage user online status
 */
export const useUserStatus = (userId: string) => {
  const [status, setStatus] = useState<UserStatus>('offline');
  const [isLoading, setIsLoading] = useState(true);
  const [manualStatus, setManualStatus] = useState<UserStatus | null>(null);

  // Update user status in Firestore
  const updateStatus = useCallback(async (newStatus: UserStatus) => {
    if (!userId) {
      console.warn('No userId provided to updateStatus');
      return;
    }
    
    try {
      console.log(`Updating status for user ${userId} to ${newStatus}`);
      
      // Use setDoc with merge to create document if it doesn't exist
      await setDoc(doc(db, 'user_status', userId), {
        status: newStatus,
        lastActivity: serverTimestamp(),
        ...(newStatus === 'offline' ? { lastSeen: serverTimestamp() } : {})
      }, { merge: true });
      
      console.log(`✅ Successfully updated status for user ${userId} to ${newStatus}`);
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      console.error('User ID:', userId);
      console.error('New Status:', newStatus);
      
      // Prevent infinite loops by not retrying on permission errors
      if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
        console.warn('⚠️ Stopping status updates due to permission errors');
        return;
      }
    }
  }, [userId]);

  // Manual status update (from user interaction)
  const updateManualStatus = useCallback(async (newStatus: UserStatus) => {
    console.log(`Manual status change to: ${newStatus}`);
    setManualStatus(newStatus);
    await updateStatus(newStatus);
  }, [updateStatus]);

  // Set user as online when component mounts
  useEffect(() => {
    if (!userId) {
      console.warn('No userId provided to useUserStatus');
      setIsLoading(false);
      return;
    }

    console.log(`Initializing user status for user: ${userId}`);
    
    // Set up real-time listener for status changes FIRST
    const unsubscribe = onSnapshot(
      doc(db, 'user_status', userId),
      (docSnapshot) => {
        console.log(`Status snapshot for user ${userId}:`, docSnapshot.exists(), docSnapshot.data());
        
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as UserStatusData;
          setStatus(data.status || 'offline');
          console.log(`Status loaded from Firestore: ${data.status}`);
        } else {
          // Document doesn't exist, create it with online status
          console.log(`No status document found for user ${userId}, creating one...`);
          updateStatus('online');
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('❌ Error listening to user status:', error);
        setIsLoading(false);
      }
    );

    // Initial status set to online (but listener will override if document exists)
    updateStatus('online');

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Only auto-set to offline if user hasn't manually set a status
        if (!manualStatus || manualStatus === 'online') {
          updateStatus('offline');
        }
      } else {
        // Only auto-set to online if user hasn't manually set a status or was offline
        if (!manualStatus || manualStatus === 'offline') {
          updateStatus('online');
        }
        // If user has manually set busy/invisible, keep that status
      }
    };

    // Handle beforeunload to set offline status
    const handleBeforeUnload = () => {
      setManualStatus(null); // Clear manual status when leaving
      updateStatus('offline');
    };

    // Activity tracking
    const handleActivity = () => {
      // Only update activity timestamp, don't change status
      if (status !== 'offline') {
        updateDoc(doc(db, 'user_status', userId), {
          lastActivity: serverTimestamp()
        }).catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      // Set offline when unmounting
      setManualStatus(null);
      updateStatus('offline');
    };
  }, [userId, status, manualStatus, updateStatus]);

  return {
    status,
    isLoading,
    updateStatus: updateManualStatus
  };
};

/**
 * Hook to get another user's status (for viewing other users)
 */
export const useOtherUserStatus = (userId: string) => {
  const [status, setStatus] = useState<UserStatus>('offline');
  const [isLoading, setIsLoading] = useState(true);
  const [lastSeen, setLastSeen] = useState<Timestamp | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'user_status', userId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as UserStatusData;
          setStatus(data.status || 'offline');
          setLastSeen(data.lastSeen || null);
        } else {
          setStatus('offline');
          setLastSeen(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error listening to user status:', error);
        setStatus('offline');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return {
    status,
    isLoading,
    lastSeen
  };
};
