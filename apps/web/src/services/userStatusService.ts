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

import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Use refs to access current values in event handlers
  const statusRef = useRef<UserStatus>('offline');
  const manualStatusRef = useRef<UserStatus | null>(null);
  
  // Update refs when state changes
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  
  useEffect(() => {
    manualStatusRef.current = manualStatus;
  }, [manualStatus]);

  // Update user status in Firestore
  const updateStatus = useCallback(async (newStatus: UserStatus) => {
    if (!userId) return;
    
    try {
      // Use setDoc with merge to create document if it doesn't exist
      await setDoc(doc(db, 'user_status', userId), {
        status: newStatus,
        lastActivity: serverTimestamp(),
        ...(newStatus === 'offline' ? { lastSeen: serverTimestamp() } : {})
      }, { merge: true });
    } catch (error) {
      // Only log errors if they're not permission-related (to avoid console spam)
      if (error instanceof Error && !error.message?.includes('Missing or insufficient permissions')) {
        console.error('❌ Error updating user status:', error);
      }
    }
  }, [userId]);

  // Manual status update (from user interaction)
  const updateManualStatus = useCallback(async (newStatus: UserStatus) => {
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

    // Flag to track if this is the initial load
    let isInitialLoad = true;
    
    // Set up real-time listener for status changes FIRST
    const unsubscribe = onSnapshot(
      doc(db, 'user_status', userId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as UserStatusData;
          
          if (isInitialLoad) {
            // On initial load (login/refresh), always set to online unless user was manually set to busy/invisible
            const previousStatus = data.status || 'offline';
            if (previousStatus === 'busy' || previousStatus === 'invisible') {
              // Preserve manual status settings
              setStatus(previousStatus);
              setManualStatus(previousStatus);
            } else {
              // Set to online for offline/online users
              updateStatus('online');
            }
            isInitialLoad = false;
          } else {
            // Not initial load - just update the status normally
            setStatus(data.status || 'offline');
          }
        } else {
          // Document doesn't exist, create it with online status
          updateStatus('online');
          isInitialLoad = false;
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('❌ Error listening to user status:', error);
        setIsLoading(false);
      }
    );

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      const currentStatus = statusRef.current;
      const currentManualStatus = manualStatusRef.current;
      
      if (document.hidden) {
        // Only auto-set to offline if user hasn't manually set busy or invisible
        if (!currentManualStatus || (currentManualStatus !== 'busy' && currentManualStatus !== 'invisible')) {
          updateStatus('offline');
        }
      } else {
        // Only auto-set to online if user was offline (not if they were busy/invisible)
        if (currentStatus === 'offline' && (!currentManualStatus || currentManualStatus === 'offline')) {
          updateStatus('online');
        }
      }
    };

    // Handle beforeunload to set offline status
    const handleBeforeUnload = () => {
      setManualStatus(null); // Clear manual status when leaving
      updateStatus('offline');
    };

    // Activity tracking
    const handleActivity = () => {
      const currentStatus = statusRef.current;
      // Only update activity timestamp, don't change status
      if (currentStatus !== 'offline') {
        updateDoc(doc(db, 'user_status', userId), {
          lastActivity: serverTimestamp()
        }).catch((error) => {
          // Silently handle permission errors to avoid console spam
          if (!error.message?.includes('Missing or insufficient permissions')) {
            console.error('Activity update error:', error);
          }
        });
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
  }, [userId, updateStatus]);

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
