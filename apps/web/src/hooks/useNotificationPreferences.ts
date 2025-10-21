/**
 * SHELTR useNotificationPreferences Hook
 * 
 * Custom React hook for managing notification preferences
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { NotificationPreferences } from '@/types/notificationPreferences';
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  toggleCategoryPreference
} from '@/services/notificationPreferencesService';

interface UseNotificationPreferencesReturn {
  preferences: NotificationPreferences | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (updates: Partial<NotificationPreferences>) => Promise<void>;
  toggleCategory: (category: string, enabled: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotificationPreferences(): UseNotificationPreferencesReturn {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch preferences
  const fetchPreferences = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const prefs = await getNotificationPreferences(user.uid);
      setPreferences(prefs);
    } catch (err) {
      console.error('Error fetching preferences:', err);
      setError('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<NotificationPreferences>) => {
    if (!user?.uid) return;

    try {
      setError(null);
      await saveNotificationPreferences(user.uid, updates);
      
      // Update local state
      setPreferences(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences');
      throw err;
    }
  }, [user?.uid]);

  // Toggle category
  const toggleCategory = useCallback(async (category: string, enabled: boolean) => {
    if (!user?.uid) return;

    try {
      setError(null);
      await toggleCategoryPreference(user.uid, category, enabled);
      
      // Update local state
      setPreferences(prev => {
        if (!prev) return null;
        return {
          ...prev,
          categories: {
            ...prev.categories,
            [category]: enabled
          }
        };
      });
    } catch (err) {
      console.error('Error toggling category:', err);
      setError('Failed to toggle category');
      throw err;
    }
  }, [user?.uid]);

  // Refresh preferences
  const refresh = useCallback(async () => {
    await fetchPreferences();
  }, [fetchPreferences]);

  // Initial fetch
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    toggleCategory,
    refresh
  };
}

