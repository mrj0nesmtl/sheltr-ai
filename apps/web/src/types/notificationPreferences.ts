/**
 * SHELTR Notification Preferences Types
 * 
 * User-customizable notification settings
 */

import { Timestamp } from 'firebase/firestore';

export interface NotificationPreferences {
  userId: string;
  
  // Delivery methods
  inApp: boolean;
  push: boolean;
  email: boolean;
  
  // Email digest settings
  emailDigest: 'never' | 'daily' | 'weekly';
  emailDigestTime: string; // "08:00" (24-hour format)
  emailDigestDays?: number[]; // [1,2,3,4,5] for weekdays, [0,6] for weekends
  
  // Category preferences
  categories: {
    contact: boolean;
    newsletter: boolean;
    application: boolean;
    security: boolean;
    system: boolean;
    donation: boolean;
    service: boolean;
    appointment: boolean;
    goal: boolean;
    transaction: boolean;
    receipt: boolean;
    participant: boolean;
    shelter: boolean;
  };
  
  // Quiet hours (mute notifications during sleep)
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00" (24-hour format)
  quietHoursEnd: string; // "08:00" (24-hour format)
  quietHoursTimezone: string; // "America/New_York"
  
  // Priority filter (only show notifications at or above this level)
  minPriority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Sound notifications
  soundEnabled: boolean;
  soundVolume: number; // 0-100
  
  // Created/updated timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: Omit<NotificationPreferences, 'userId' | 'createdAt' | 'updatedAt'> = {
  // All delivery methods enabled by default
  inApp: true,
  push: false, // Requires explicit permission
  email: true,
  
  // Daily digest at 8am by default
  emailDigest: 'daily',
  emailDigestTime: '08:00',
  emailDigestDays: [1, 2, 3, 4, 5], // Weekdays
  
  // All categories enabled by default
  categories: {
    contact: true,
    newsletter: true,
    application: true,
    security: true,
    system: true,
    donation: true,
    service: true,
    appointment: true,
    goal: true,
    transaction: true,
    receipt: true,
    participant: true,
    shelter: true
  },
  
  // No quiet hours by default
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  quietHoursTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  
  // Show all priorities by default
  minPriority: 'low',
  
  // Sound enabled at 50% volume
  soundEnabled: true,
  soundVolume: 50
};

export interface NotificationPreferencesUpdate {
  userId: string;
  preferences: Partial<NotificationPreferences>;
}

