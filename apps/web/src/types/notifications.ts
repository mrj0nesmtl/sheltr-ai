/**
 * SHELTR Unified Notification Type Definitions
 * 
 * Created: October 21, 2025
 * Purpose: Clean, role-based notification system with clear routing
 */

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// NOTIFICATION PRIORITIES
// ============================================================================

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

// ============================================================================
// NOTIFICATION CATEGORIES
// ============================================================================

export type NotificationCategory = 
  | 'contact'
  | 'newsletter'
  | 'application'
  | 'security'
  | 'system'
  | 'donation'
  | 'service'
  | 'appointment'
  | 'goal'
  | 'transaction'
  | 'receipt'
  | 'participant'
  | 'shelter';

// ============================================================================
// BASE NOTIFICATION INTERFACE
// ============================================================================

export interface BaseNotification {
  id?: string;
  type: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  isRead: boolean;
  readAt?: Timestamp;
  created_at: Timestamp;
  expires_at?: Timestamp;
  metadata?: Record<string, any>;
}

// ============================================================================
// ADMIN NOTIFICATIONS (Super Admin + Platform Admin)
// ============================================================================

export type AdminNotificationType = 
  | 'contact_inquiry'
  | 'newsletter_signup'
  | 'shelter_application'
  | 'participant_signup'
  | 'security_alert'
  | 'fraud_alert'
  | 'system_alert'
  | 'system_error';

export interface AdminNotification extends BaseNotification {
  type: AdminNotificationType;
  recipient_id: string;
  recipient_role: 'super_admin' | 'platform_admin';
  data?: {
    source?: string;
    inquiry_type?: string;
    email?: string;
    name?: string;
    organization?: string;
    ip_address?: string;
    user_agent?: string;
    [key: string]: any;
  };
}

// ============================================================================
// SHELTER NOTIFICATIONS (Shelter Admin only)
// ============================================================================

export type ShelterNotificationType = 
  | 'participant_inquiry'
  | 'shelter_page_inquiry'
  | 'participant_approval'
  | 'donation_to_shelter'
  | 'participant_update'
  | 'system_message';

export interface ShelterNotification extends BaseNotification {
  type: ShelterNotificationType;
  shelter_id: string;
  tenant_id: string;
  recipient_id: string;
  data?: {
    participant_id?: string;
    participant_name?: string;
    donation_id?: string;
    donation_amount?: number;
    email?: string;
    inquiry_type?: string;
    [key: string]: any;
  };
}

// ============================================================================
// PARTICIPANT NOTIFICATIONS (Homeless individuals)
// ============================================================================

export type ParticipantNotificationType = 
  | 'donation_received'
  | 'service_update'
  | 'appointment_reminder'
  | 'goal_update'
  | 'system_message'
  | 'card_activated'
  | 'housing_fund_update';

export interface ParticipantNotification extends BaseNotification {
  type: ParticipantNotificationType;
  userId: string;
  metadata?: {
    donation_id?: string;
    donor_name?: string;
    amount?: number;
    direct_amount?: number;
    housing_amount?: number;
    service_id?: string;
    appointment_id?: string;
    goal_id?: string;
    [key: string]: any;
  };
}

// ============================================================================
// DONOR NOTIFICATIONS
// ============================================================================

export type DonorNotificationType = 
  | 'donation_confirmation'
  | 'receipt_available'
  | 'transaction_update'
  | 'tax_document_ready'
  | 'impact_update'
  | 'recurring_donation_processed'
  | 'payment_method_expiring'
  | 'system_message';

export interface DonorNotification extends BaseNotification {
  type: DonorNotificationType;
  userId: string;
  metadata?: {
    donation_id?: string;
    amount?: number;
    participant_name?: string;
    receipt_url?: string;
    tax_year?: string;
    transaction_id?: string;
    impact_story_id?: string;
    [key: string]: any;
  };
}

// ============================================================================
// MESSAGE NOTIFICATIONS (All roles - internal messaging)
// ============================================================================

export type MessageNotificationType = 
  | 'message_sent'
  | 'message_received'
  | 'mention'
  | 'thread_update';

export interface MessageNotification extends BaseNotification {
  type: MessageNotificationType;
  userId: string;
  messageId: string;
  conversationId: string;
  fromUserId: string;
  fromUserDisplayName: string;
  fromUserShortcode: string;
  content: string;
  createdAt: Timestamp;
}

// ============================================================================
// UNIFIED NOTIFICATION TYPE
// ============================================================================

export type UnifiedNotification = 
  | AdminNotification
  | ShelterNotification
  | ParticipantNotification
  | DonorNotification
  | MessageNotification;

// ============================================================================
// NOTIFICATION BADGE COLORS
// ============================================================================

export const NOTIFICATION_BADGE_COLORS: Record<NotificationCategory, string> = {
  contact: 'bg-blue-500',
  newsletter: 'bg-green-500',
  application: 'bg-purple-500',
  security: 'bg-red-500',
  system: 'bg-gray-500',
  donation: 'bg-yellow-500',
  service: 'bg-cyan-500',
  appointment: 'bg-pink-500',
  goal: 'bg-indigo-500',
  transaction: 'bg-orange-500',
  receipt: 'bg-teal-500',
  participant: 'bg-violet-500',
  shelter: 'bg-emerald-500'
};

// ============================================================================
// NOTIFICATION PRIORITY COLORS
// ============================================================================

export const NOTIFICATION_PRIORITY_COLORS: Record<NotificationPriority, string> = {
  low: 'text-gray-400',
  normal: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-500 animate-pulse'
};

// ============================================================================
// NOTIFICATION ICONS (Lucide React)
// ============================================================================

export const NOTIFICATION_ICONS: Record<NotificationCategory, string> = {
  contact: 'MessageSquare',
  newsletter: 'Mail',
  application: 'FileText',
  security: 'Shield',
  system: 'Settings',
  donation: 'DollarSign',
  service: 'Wrench',
  appointment: 'Calendar',
  goal: 'Target',
  transaction: 'CreditCard',
  receipt: 'Receipt',
  participant: 'Users',
  shelter: 'Home'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getNotificationBadgeColor(category: NotificationCategory): string {
  return NOTIFICATION_BADGE_COLORS[category] || 'bg-gray-500';
}

export function getNotificationPriorityColor(priority: NotificationPriority): string {
  return NOTIFICATION_PRIORITY_COLORS[priority] || 'text-gray-400';
}

export function getNotificationIcon(category: NotificationCategory): string {
  return NOTIFICATION_ICONS[category] || 'Bell';
}

// ============================================================================
// NOTIFICATION COLLECTION NAMES
// ============================================================================

export const NOTIFICATION_COLLECTIONS = {
  ADMIN: 'admin_notifications',
  SHELTER: 'shelter_notifications',
  PARTICIPANT: 'participant_notifications',
  DONOR: 'donor_notifications',
  MESSAGE: 'message_notifications'
} as const;

