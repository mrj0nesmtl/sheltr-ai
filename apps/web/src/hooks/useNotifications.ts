/**
 * SHELTR useNotifications Hook
 * 
 * Custom React hook for managing notifications with real-time updates
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { UnifiedNotification } from '@/types/notifications';
import {
  getAdminNotifications,
  getShelterNotifications,
  getParticipantNotifications,
  getDonorNotifications,
  getMessageNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  subscribeToNotifications
} from '@/services/unifiedNotificationService';

interface UseNotificationsReturn {
  notifications: UnifiedNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user role
  const userRole = user?.role as 'super_admin' | 'platform_admin' | 'admin' | 'participant' | 'donor' | undefined;

  // Get collection name based on role
  const getCollectionName = useCallback(() => {
    if (!userRole) return 'admin_notifications';
    
    switch (userRole) {
      case 'super_admin':
      case 'platform_admin':
        return 'admin_notifications';
      case 'admin':
        return 'shelter_notifications';
      case 'participant':
        return 'participant_notifications';
      case 'donor':
        return 'donor_notifications';
      default:
        return 'admin_notifications';
    }
  }, [userRole]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.uid || !userRole) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let notifs: UnifiedNotification[] = [];

      switch (userRole) {
        case 'super_admin':
        case 'platform_admin':
          notifs = await getAdminNotifications(user.uid);
          break;
        case 'admin':
          notifs = await getShelterNotifications(user.uid);
          break;
        case 'participant':
          notifs = await getParticipantNotifications(user.uid);
          break;
        case 'donor':
          notifs = await getDonorNotifications(user.uid);
          break;
      }

      // Also fetch message notifications (for all roles)
      const messageNotifs = await getMessageNotifications(user.uid);
      notifs = [...notifs, ...messageNotifs];

      // Sort by created_at
      notifs.sort((a, b) => {
        const aTime = a.created_at || a.createdAt;
        const bTime = b.created_at || b.createdAt;
        if (!aTime || !bTime) return 0;
        
        // Convert to milliseconds, handling different timestamp formats
        const aMillis = typeof aTime === 'string' 
          ? new Date(aTime).getTime() 
          : aTime.toMillis ? aTime.toMillis() : aTime.getTime();
        const bMillis = typeof bTime === 'string' 
          ? new Date(bTime).getTime() 
          : bTime.toMillis ? bTime.toMillis() : bTime.getTime();
        
        return bMillis - aMillis;
      });

      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [user?.uid, userRole]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    if (!userRole) return;

    try {
      const collectionName = getCollectionName();
      await markNotificationAsRead(id, collectionName);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [userRole, getCollectionName]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.uid || !userRole) return;

    try {
      await markAllNotificationsAsRead(user.uid, userRole);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [user?.uid, userRole]);

  // Refresh notifications
  const refresh = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up real-time listener
  useEffect(() => {
    if (!user?.uid || !userRole) return;

    const unsubscribe = subscribeToNotifications(user.uid, userRole, (notifs) => {
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    });

    return () => unsubscribe();
  }, [user?.uid, userRole]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh
  };
}

