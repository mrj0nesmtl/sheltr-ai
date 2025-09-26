import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface MessageNotification {
  id?: string;
  userId: string;
  type: 'message_sent' | 'message_received' | 'message_read' | 'message_replied';
  messageId: string;
  conversationId: string;
  fromUserId: string;
  fromUserDisplayName: string;
  fromUserShortcode: string;
  content: string;
  isRead: boolean;
  createdAt: Timestamp;
  readAt?: Timestamp;
}

export interface NotificationSummary {
  unreadMessages: number;
  unreadNotifications: number;
  lastActivity?: Timestamp;
}

export interface NotificationCounts {
  unreadMessages: number;
  unreadNotifications: number;
}

export interface EmailSignup {
  id?: string;
  email: string;
  name?: string;
  source: string;
  createdAt: Timestamp;
  status: 'active' | 'pending' | 'unsubscribed';
}

export interface ContactInquiryNotification {
  id?: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  createdAt: Timestamp;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
}

export interface AdminNotification {
  id?: string;
  userId: string;
  type: 'system' | 'message' | 'inquiry' | 'alert';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: Timestamp;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export class NotificationService {
  /**
   * Create a notification for message events
   */
  static async createMessageNotification(
    userId: string,
    type: MessageNotification['type'],
    messageId: string,
    conversationId: string,
    fromUserId: string,
    fromUserDisplayName: string,
    fromUserShortcode: string,
    content: string
  ): Promise<boolean> {
    try {
      console.log(`🔔 Creating ${type} notification for user ${userId}`);
      
      const notificationData: Omit<MessageNotification, 'id'> = {
        userId,
        type,
        messageId,
        conversationId,
        fromUserId,
        fromUserDisplayName,
        fromUserShortcode,
        content: content.substring(0, 100), // Truncate for notification
        isRead: false,
        createdAt: serverTimestamp() as Timestamp
      };

      await addDoc(collection(db, 'message_notifications'), notificationData);
      console.log(`✅ ${type} notification created for user ${userId}`);
      return true;
      
    } catch (error) {
      console.error('❌ Error creating message notification:', error);
      return false;
    }
  }

  /**
   * Get unread notifications for a user
   */
  static async getUnreadNotifications(userId: string): Promise<MessageNotification[]> {
    try {
      if (!userId) {
        console.warn('⚠️ getUnreadNotifications called with undefined userId');
        return [];
      }
      
      console.log('🔍 Querying notifications for userId:', userId);
      
      const q = query(
        collection(db, 'message_notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const notifications: MessageNotification[] = [];

      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        } as MessageNotification);
      });

      return notifications;
    } catch (error) {
      console.error('❌ Error getting unread notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'message_notifications', notificationId), {
        isRead: true,
        readAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Get notification summary for a user (badge counts)
   */
  static async getNotificationSummary(userId: string): Promise<NotificationSummary> {
    try {
      if (!userId) {
        console.warn('⚠️ getNotificationSummary called with undefined userId');
        return {
          unreadMessages: 0,
          unreadNotifications: 0
        };
      }
      
      console.log('📊 Getting notification summary for userId:', userId);
      
      // Get unread message notifications
      const unreadQuery = query(
        collection(db, 'message_notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false),
        where('type', 'in', ['message_received', 'message_replied'])
      );

      const unreadSnapshot = await getDocs(unreadQuery);
      const unreadMessages = unreadSnapshot.size;

      // Get last activity
      const lastActivityQuery = query(
        collection(db, 'message_notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const lastActivitySnapshot = await getDocs(lastActivityQuery);
      let lastActivity: Timestamp | undefined;

      if (!lastActivitySnapshot.empty) {
        const lastDoc = lastActivitySnapshot.docs[0];
        lastActivity = lastDoc.data().createdAt;
      }

      return {
        unreadMessages,
        unreadNotifications: unreadMessages,
        lastActivity
      };

    } catch (error) {
      console.error('❌ Error getting notification summary:', error);
      return {
        unreadMessages: 0,
        unreadNotifications: 0
      };
    }
  }

  /**
   * Create automatic status notifications for message lifecycle
   */
  static async handleMessageStatusChange(
    messageId: string,
    conversationId: string,
    status: 'sent' | 'delivered' | 'read' | 'replied',
    fromUserId: string,
    toUserId: string,
    fromUserDisplayName: string,
    fromUserShortcode: string,
    content: string
  ): Promise<void> {
    try {
      console.log(`📊 Handling message status change: ${status}`);

      switch (status) {
        case 'sent':
          // Notify sender that message was sent successfully
          await this.createMessageNotification(
            fromUserId,
            'message_sent',
            messageId,
            conversationId,
            fromUserId,
            'System',
            'system',
            `Message sent to @${fromUserShortcode}`
          );
          break;

        case 'delivered':
          // Notify recipient of new message
          await this.createMessageNotification(
            toUserId,
            'message_received',
            messageId,
            conversationId,
            fromUserId,
            fromUserDisplayName,
            fromUserShortcode,
            content
          );
          break;

        case 'read':
          // This will be triggered when recipient opens the conversation
          console.log(`📖 Message ${messageId} marked as read`);
          break;

        case 'replied':
          // Notify original sender that recipient replied
          await this.createMessageNotification(
            fromUserId,
            'message_replied',
            messageId,
            conversationId,
            toUserId,
            fromUserDisplayName,
            fromUserShortcode,
            'Replied to your message'
          );
          break;
      }

    } catch (error) {
      console.error('❌ Error handling message status change:', error);
    }
  }
}

/**
 * Standalone function to get notification counts (for easier import)
 */
export async function getNotificationCounts(userId: string): Promise<NotificationCounts> {
  try {
    if (!userId) {
      console.warn('⚠️ getNotificationCounts called with undefined userId');
      return {
        unreadMessages: 0,
        unreadNotifications: 0
      };
    }
    
    console.log('🔢 Getting notification counts for userId:', userId);
    const summary = await NotificationService.getNotificationSummary(userId);
    console.log('✅ Notification counts result:', summary);
    
    return {
      unreadMessages: summary.unreadMessages,
      unreadNotifications: summary.unreadNotifications
    };
  } catch (error) {
    console.error('❌ Error getting notification counts:', error);
    return {
      unreadMessages: 0,
      unreadNotifications: 0
    };
  }
}

/**
 * Get recent email signups (placeholder for contact form integration)
 */
export async function getRecentEmailSignups(limit: number = 10): Promise<EmailSignup[]> {
  try {
    // This would query a contact_signups or similar collection
    // For now, return empty array as this is primarily for contact forms
    console.log('📧 Getting recent email signups (not implemented yet)');
    return [];
  } catch (error) {
    console.error('❌ Error getting recent email signups:', error);
    return [];
  }
}

/**
 * Create a contact inquiry notification (for contact forms)
 */
export async function createContactInquiryNotification(inquiryData: {
  email: string;
  name: string;
  subject: string;
  message: string;
  source?: string;
}): Promise<boolean> {
  try {
    console.log('📞 Creating contact inquiry notification:', inquiryData.email);
    
    const notificationData = {
      email: inquiryData.email,
      name: inquiryData.name,
      subject: inquiryData.subject,
      message: inquiryData.message,
      source: inquiryData.source || 'contact-form',
      createdAt: serverTimestamp(),
      isRead: false,
      priority: 'normal' as const
    };

    await addDoc(collection(db, 'contact_inquiries'), notificationData);
    console.log('✅ Contact inquiry notification created');
    return true;
    
  } catch (error) {
    console.error('❌ Error creating contact inquiry notification:', error);
    return false;
  }
}

/**
 * Get recent contact inquiries (for notifications dashboard)
 */
export async function getRecentContactInquiries(limit: number = 10): Promise<ContactInquiryNotification[]> {
  try {
    console.log('📞 Getting recent contact inquiries...');
    
    const q = query(
      collection(db, 'contact_inquiries'),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    const inquiries: ContactInquiryNotification[] = [];

    querySnapshot.forEach((doc) => {
      inquiries.push({
        id: doc.id,
        ...doc.data()
      } as ContactInquiryNotification);
    });

    console.log(`✅ Found ${inquiries.length} contact inquiries`);
    return inquiries;
  } catch (error) {
    console.error('❌ Error getting recent contact inquiries:', error);
    return [];
  }
}

/**
 * Get admin notifications
 */
export async function getAdminNotifications(userId: string, limit: number = 20): Promise<AdminNotification[]> {
  try {
    // This would query admin notifications or use the message notifications
    const messageNotifications = await NotificationService.getUnreadNotifications(userId);
    
    // Convert message notifications to admin notifications format
    const adminNotifications: AdminNotification[] = messageNotifications.map(msg => ({
      id: msg.id,
      userId: msg.userId,
      type: 'message' as const,
      title: `Message from ${msg.fromUserDisplayName}`,
      content: msg.content,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
      priority: msg.type === 'urgent' ? 'urgent' : 'normal'
    }));
    
    return adminNotifications.slice(0, limit);
  } catch (error) {
    console.error('❌ Error getting admin notifications:', error);
    return [];
  }
}

/**
 * Mark notification as read (wrapper function for easier import)
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    return await NotificationService.markNotificationAsRead(notificationId);
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    return false;
  }
}

/**
 * Format relative time for notifications
 */
export function formatRelativeTime(timestamp: Timestamp | Date): string {
  try {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch (error) {
    console.error('❌ Error formatting relative time:', error);
    return 'Unknown';
  }
}

/**
 * Creates a fraud alert notification for administrators
 */
export async function createFraudAlertNotification(alertData: {
  level: 'low' | 'medium' | 'high';
  description: string;
  details: string;
  userId?: string;
}): Promise<void> {
  try {
    const notificationData: AdminNotification = {
      id: '',
      type: 'fraud_alert',
      title: `Fraud Alert: ${alertData.level.toUpperCase()}`,
      message: alertData.description,
      details: alertData.details,
      isRead: false,
      createdAt: new Date(),
      priority: alertData.level === 'high' ? 'high' : alertData.level === 'medium' ? 'medium' : 'low',
      target_roles: ['super_admin', 'platform_admin']
    };

    // Create notification document
    await addDoc(collection(db, 'admin_notifications'), {
      ...notificationData,
      createdAt: serverTimestamp()
    });

    console.log('✅ Fraud alert notification created:', alertData.level);
  } catch (error) {
    console.error('❌ Error creating fraud alert notification:', error);
    throw error;
  }
}