/**
 * SHELTR Notification Preferences Service
 * 
 * Manage user notification preferences in Firestore
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NotificationPreferences } from '@/types/notificationPreferences';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '@/types/notificationPreferences';

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences> {
  try {
    const prefRef = doc(db, 'notification_preferences', userId);
    const prefSnap = await getDoc(prefRef);

    if (prefSnap.exists()) {
      return {
        userId,
        ...prefSnap.data()
      } as NotificationPreferences;
    }

    // Return default preferences if none exist
    return {
      userId,
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
  } catch (error) {
    console.error('❌ Error getting notification preferences:', error);
    throw error;
  }
}

/**
 * Save user's notification preferences
 */
export async function saveNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<void> {
  try {
    const prefRef = doc(db, 'notification_preferences', userId);
    const existing = await getDoc(prefRef);

    if (existing.exists()) {
      // Update existing preferences
      await updateDoc(prefRef, {
        ...preferences,
        updatedAt: serverTimestamp()
      });
      console.log('✅ Notification preferences updated');
    } else {
      // Create new preferences document
      await setDoc(prefRef, {
        userId,
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        ...preferences,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('✅ Notification preferences created');
    }
  } catch (error) {
    console.error('❌ Error saving notification preferences:', error);
    throw error;
  }
}

/**
 * Update a specific preference field
 */
export async function updateNotificationPreference(
  userId: string,
  field: keyof NotificationPreferences,
  value: any
): Promise<void> {
  try {
    const prefRef = doc(db, 'notification_preferences', userId);
    await updateDoc(prefRef, {
      [field]: value,
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Notification preference updated: ${field}`);
  } catch (error) {
    console.error(`❌ Error updating notification preference ${field}:`, error);
    throw error;
  }
}

/**
 * Toggle a category preference
 */
export async function toggleCategoryPreference(
  userId: string,
  category: string,
  enabled: boolean
): Promise<void> {
  try {
    const prefRef = doc(db, 'notification_preferences', userId);
    await updateDoc(prefRef, {
      [`categories.${category}`]: enabled,
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Category ${category} ${enabled ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error(`❌ Error toggling category ${category}:`, error);
    throw error;
  }
}

/**
 * Check if notification should be shown based on preferences
 */
export function shouldShowNotification(
  notification: {
    category: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
  },
  preferences: NotificationPreferences
): boolean {
  // Check if category is enabled
  if (!preferences.categories[notification.category as keyof typeof preferences.categories]) {
    return false;
  }

  // Check priority threshold
  const priorityLevels = { low: 0, normal: 1, high: 2, urgent: 3 };
  const notificationLevel = priorityLevels[notification.priority];
  const minLevel = priorityLevels[preferences.minPriority];

  if (notificationLevel < minLevel) {
    return false;
  }

  // Check quiet hours
  if (preferences.quietHoursEnabled) {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const { quietHoursStart, quietHoursEnd } = preferences;
    
    // Handle quiet hours spanning midnight
    if (quietHoursStart > quietHoursEnd) {
      if (currentTime >= quietHoursStart || currentTime < quietHoursEnd) {
        return false;
      }
    } else {
      if (currentTime >= quietHoursStart && currentTime < quietHoursEnd) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if user should receive email digest
 */
export function shouldSendEmailDigest(
  preferences: NotificationPreferences,
  digestType: 'daily' | 'weekly'
): boolean {
  if (!preferences.email) return false;
  if (preferences.emailDigest === 'never') return false;
  if (preferences.emailDigest !== digestType) return false;

  // Check if today is a digest day (for daily digests)
  if (digestType === 'daily' && preferences.emailDigestDays) {
    const today = new Date().getDay(); // 0-6 (Sunday-Saturday)
    if (!preferences.emailDigestDays.includes(today)) {
      return false;
    }
  }

  return true;
}

