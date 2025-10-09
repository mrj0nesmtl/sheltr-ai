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

/**
 * Shelter-specific email signup interface
 */
export interface ShelterEmailSignup {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  shelter_id: string;
  shelter_name: string;
  source: 'public_page' | 'embedded_form' | 'manual';
  page: 'shelter_public_page';
  signup_date: Timestamp;
  createdAt: Timestamp;
  status: 'active' | 'pending' | 'unsubscribed';
  interests?: string[];
  message?: string;
}

/**
 * Shelter-specific contact inquiry interface
 */
export interface ShelterContactInquiry {
  id?: string;
  shelter_id: string;
  shelter_name: string;
  sender_email: string;
  sender_name: string;
  sender_phone?: string;
  subject: string;
  message: string;
  inquiry_type: 'general' | 'services' | 'volunteer' | 'donation' | 'partnership';
  source: 'public_page';
  priority: 'low' | 'normal' | 'high';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  responded: boolean;
  response_notes?: string;
  created_at: Timestamp;
  createdAt: Timestamp;
  resolved_at?: Timestamp;
  resolved_by?: string;
}

/**
 * Extended notification counts for the admin dashboard
 * This aggregates ALL notification types across the platform
 */
export interface NotificationDashboardCounts {
  // Message Notifications
  totalNotifications: number;
  unreadMessages: number;
  unreadNotifications: number;
  
  // Email Signups
  totalEmailSignups: number;
  recentEmailSignups: number; // Last 7 days
  
  // Contact Inquiries
  contactInquiries: number;
  recentContactInquiries: number; // Last 7 days
  repliedContactInquiries: number;
  unrepliedContactInquiries: number;
  
  // Admin Notifications
  totalAdminNotifications: number;
  unreadAdminNotifications: number;
  securityAlerts: number;
  fraudAlerts: number;
  
  // Shelter Applications (future)
  pendingShelterapplications: number;
  
  // Active Users (from API)
  activeUsers: number;
}

export interface EmailSignup {
  id?: string;
  email: string;
  name?: string;
  source: string;
  page?: string;
  signup_date?: Timestamp;
  createdAt?: Timestamp;
  status: 'active' | 'pending' | 'unsubscribed';
}

export interface ContactInquiryNotification {
  id?: string;
  email?: string;
  sender_email?: string;
  name?: string;
  sender_name?: string;
  subject: string;
  message: string;
  inquiry_type: string;
  source: string;
  priority: 'low' | 'normal' | 'high';
  status: string;
  responded: boolean;
  created_at?: Timestamp;
  createdAt?: Timestamp;
  isRead?: boolean;
}

export interface AdminNotification {
  id?: string;
  type: string; // platform_admin_login, fraud_alert, system_alert, etc.
  title: string;
  message: string;
  content?: string; // for backward compatibility
  category?: string;
  priority: 'low' | 'normal' | 'medium' | 'high' | 'urgent';
  recipient_id?: string;
  recipient_role?: string;
  is_read?: boolean;
  read?: boolean; // some use 'read' instead of 'is_read'
  isRead?: boolean; // for backward compatibility
  created_at?: Timestamp;
  createdAt?: Timestamp;
  read_at?: Timestamp;
  expires_at?: Timestamp | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  target_roles?: string[];
  userId?: string; // for backward compatibility
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

      // Get unread admin notifications (for super_admin and platform_admin)
      const adminNotificationsQuery = query(
        collection(db, 'admin_notifications'),
        where('read', '==', false)
      );

      const adminNotificationsSnapshot = await getDocs(adminNotificationsQuery);
      const unreadAdminNotifications = adminNotificationsSnapshot.size;

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

      console.log(`✅ Notification counts: ${unreadMessages} unread messages, ${unreadAdminNotifications} unread admin notifications`);

      return {
        unreadMessages,
        unreadNotifications: unreadMessages + unreadAdminNotifications,
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
 * Get recent email signups from shelter_email_signups collection (shelter-specific email captures from public pages)
 * NOTE: This is different from newsletter_signups which is platform-wide newsletter subscriptions
 */
export async function getRecentEmailSignups(maxResults: number = 10): Promise<EmailSignup[]> {
  try {
    console.log('📧 Getting recent shelter email signups from shelter_email_signups collection...');
    
    const q = query(
      collection(db, 'shelter_email_signups'),
      orderBy('signup_date', 'desc'),
      limit(maxResults)
    );
    
    const querySnapshot = await getDocs(q);
    const signups: EmailSignup[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      signups.push({
        id: doc.id,
        email: data.email,
        name: data.name || data.attribution || undefined,
        source: data.source || 'shelter_page',
        page: data.shelter_name || 'unknown',
        signup_date: data.signup_date,
        status: data.status || 'active',
        createdAt: data.signup_date || data.created_at
      } as EmailSignup);
    });
    
    console.log(`✅ Found ${signups.length} shelter email signups`);
    return signups;
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
export async function getRecentContactInquiries(maxResults: number = 10): Promise<ContactInquiryNotification[]> {
  try {
    console.log('📞 Getting recent contact inquiries...');
    
    const q = query(
      collection(db, 'contact_inquiries'),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
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
 * Get admin notifications from the admin_notifications collection
 * This queries ONLY admin notifications (not message notifications)
 */
export async function getAdminNotifications(userId: string, maxResults: number = 20): Promise<AdminNotification[]> {
  try {
    console.log('🔔 Getting admin notifications for userId:', userId);
    
    // Query admin_notifications collection for this user
    const q = query(
      collection(db, 'admin_notifications'),
      where('recipient_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    const adminNotifications: AdminNotification[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      adminNotifications.push({
        id: doc.id,
        type: data.type,
        title: data.title,
        message: data.message,
        content: data.message, // for backward compatibility
        category: data.category,
        priority: data.priority || 'normal',
        recipient_id: data.recipient_id,
        recipient_role: data.recipient_role,
        is_read: data.is_read,
        read: data.read,
        isRead: data.is_read || data.read || false,
        created_at: data.created_at,
        createdAt: data.created_at,
        read_at: data.read_at,
        expires_at: data.expires_at,
        data: data.data,
        target_roles: data.target_roles
      });
    });
    
    console.log(`✅ Found ${adminNotifications.length} admin notifications`);
    return adminNotifications;
  } catch (error) {
    console.error('❌ Error getting admin notifications:', error);
    return [];
  }
}

/**
 * Get unified notification dashboard counts
 * Aggregates ALL notification types for the admin dashboard
 */
export async function getNotificationDashboardCounts(
  userId: string,
  userRole: string
): Promise<NotificationDashboardCounts> {
  try {
    console.log('📊 Getting dashboard notification counts for userId:', userId, 'role:', userRole);
    
    // Calculate date for "last 7 days"
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);
    
    // 1. Get message notification counts
    const messageNotificationsQuery = query(
      collection(db, 'message_notifications'),
      where('userId', '==', userId)
    );
    const messageNotificationsSnapshot = await getDocs(messageNotificationsQuery);
    const totalNotifications = messageNotificationsSnapshot.size;
    const unreadMessages = messageNotificationsSnapshot.docs.filter(
      doc => !doc.data().isRead && (doc.data().type === 'message_received' || doc.data().type === 'message_replied')
    ).length;
    
    // 2. Get shelter email signups (shelter-specific email captures, not newsletter)
    const emailSignupsQuery = query(collection(db, 'shelter_email_signups'));
    const emailSignupsSnapshot = await getDocs(emailSignupsQuery);
    const totalEmailSignups = emailSignupsSnapshot.size;
    
    // Count recent signups (last 7 days)
    const recentEmailSignups = emailSignupsSnapshot.docs.filter(doc => {
      const signupDate = doc.data().signup_date;
      if (!signupDate) return false;
      return signupDate.toDate() > sevenDaysAgo;
    }).length;
    
    // 3. Get contact inquiries
    const contactInquiriesQuery = query(collection(db, 'contact_inquiries'));
    const contactInquiriesSnapshot = await getDocs(contactInquiriesQuery);
    const contactInquiries = contactInquiriesSnapshot.size;
    
    // Count recent inquiries (last 7 days)
    const recentContactInquiries = contactInquiriesSnapshot.docs.filter(doc => {
      const createdAt = doc.data().created_at;
      if (!createdAt) return false;
      return createdAt.toDate() > sevenDaysAgo;
    }).length;
    
    // Count replied vs unreplied
    const repliedContactInquiries = contactInquiriesSnapshot.docs.filter(
      doc => doc.data().responded === true
    ).length;
    const unrepliedContactInquiries = contactInquiriesSnapshot.docs.filter(
      doc => doc.data().responded === false || doc.data().responded === undefined
    ).length;
    
    // 4. Get admin notifications
    const adminNotificationsQuery = query(
      collection(db, 'admin_notifications'),
      where('recipient_id', '==', userId)
    );
    const adminNotificationsSnapshot = await getDocs(adminNotificationsQuery);
    const totalAdminNotifications = adminNotificationsSnapshot.size;
    const unreadAdminNotifications = adminNotificationsSnapshot.docs.filter(
      doc => !doc.data().is_read && !doc.data().read
    ).length;
    
    // Count security and fraud alerts
    const securityAlerts = adminNotificationsSnapshot.docs.filter(
      doc => doc.data().type === 'system_alert'
    ).length;
    const fraudAlerts = adminNotificationsSnapshot.docs.filter(
      doc => doc.data().type === 'fraud_alert'
    ).length;
    
    // 5. Shelter applications (placeholder - collection doesn't exist yet)
    const pendingShelterapplications = 0;
    
    // 6. Active users (placeholder - will be fetched from API separately)
    const activeUsers = 0;
    
    const counts: NotificationDashboardCounts = {
      totalNotifications,
      unreadMessages,
      unreadNotifications: unreadMessages + unreadAdminNotifications,
      totalEmailSignups,
      recentEmailSignups,
      contactInquiries,
      recentContactInquiries,
      repliedContactInquiries,
      unrepliedContactInquiries,
      totalAdminNotifications,
      unreadAdminNotifications,
      securityAlerts,
      fraudAlerts,
      pendingShelterapplications,
      activeUsers
    };
    
    console.log('✅ Dashboard notification counts:', counts);
    return counts;
    
  } catch (error) {
    console.error('❌ Error getting notification dashboard counts:', error);
    // Return zeros on error
    return {
      totalNotifications: 0,
      unreadMessages: 0,
      unreadNotifications: 0,
      totalEmailSignups: 0,
      recentEmailSignups: 0,
      contactInquiries: 0,
      recentContactInquiries: 0,
      repliedContactInquiries: 0,
      unrepliedContactInquiries: 0,
      totalAdminNotifications: 0,
      unreadAdminNotifications: 0,
      securityAlerts: 0,
      fraudAlerts: 0,
      pendingShelterapplications: 0,
      activeUsers: 0
    };
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
    const notificationData = {
      type: 'fraud_alert',
      title: `Fraud Alert: ${alertData.level.toUpperCase()}`,
      message: alertData.description,
      details: alertData.details,
      is_read: false,
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

/**
 * Get shelter-specific notification dashboard counts
 * For Shelter Administrators - shows only data relevant to their shelter
 */
export async function getShelterNotificationCounts(userId: string, shelterId: string): Promise<NotificationDashboardCounts> {
  try {
    console.log('🏠 Getting shelter-specific notification counts for:', shelterId);
    
    // Get unread message notifications for this user
    const messageNotificationsQuery = query(
      collection(db, 'message_notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const messageNotificationsSnapshot = await getDocs(messageNotificationsQuery);
    const unreadMessages = messageNotificationsSnapshot.size;
    
    // Get admin notifications for this user
    const adminNotificationsQuery = query(
      collection(db, 'admin_notifications'),
      where('recipient_id', '==', userId),
      where('is_read', '==', false)
    );
    const adminNotificationsSnapshot = await getDocs(adminNotificationsQuery);
    const unreadAdminNotifications = adminNotificationsSnapshot.size;
    
    // Get total admin notifications
    const totalAdminNotificationsQuery = query(
      collection(db, 'admin_notifications'),
      where('recipient_id', '==', userId)
    );
    const totalAdminNotificationsSnapshot = await getDocs(totalAdminNotificationsQuery);
    const totalAdminNotifications = totalAdminNotificationsSnapshot.size;
    
    // Count security/fraud alerts
    let securityAlerts = 0;
    let fraudAlerts = 0;
    adminNotificationsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.type === 'security_alert') securityAlerts++;
      if (data.type === 'fraud_alert') fraudAlerts++;
    });
    
    // Get shelter-specific participant counts
    const participantsQuery = query(
      collection(db, 'users'),
      where('shelter_id', '==', shelterId),
      where('role', '==', 'participant')
    );
    const participantsSnapshot = await getDocs(participantsQuery);
    const totalParticipants = participantsSnapshot.size;
    
    // Count pending participant applications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);
    
    let pendingParticipants = 0;
    let recentParticipants = 0;
    participantsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'pending' || data.status === 'pending_approval') {
        pendingParticipants++;
      }
      if (data.createdAt && data.createdAt >= sevenDaysAgoTimestamp) {
        recentParticipants++;
      }
    });
    
    // Get active participants (logged in last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const oneDayAgoTimestamp = Timestamp.fromDate(oneDayAgo);
    
    let activeParticipants = 0;
    participantsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.lastLoginAt && data.lastLoginAt >= oneDayAgoTimestamp) {
        activeParticipants++;
      }
    });
    
    // Get shelter-specific email signups
    const shelterEmailSignupsQuery = query(
      collection(db, 'shelter_email_signups'),
      where('shelter_id', '==', shelterId)
    );
    const shelterEmailSignupsSnapshot = await getDocs(shelterEmailSignupsQuery);
    const totalShelterEmailSignups = shelterEmailSignupsSnapshot.size;
    
    // Count recent signups (last 7 days)
    let recentShelterEmailSignups = 0;
    shelterEmailSignupsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.signup_date && data.signup_date >= sevenDaysAgoTimestamp) {
        recentShelterEmailSignups++;
      }
    });
    
    // Get shelter-specific contact inquiries
    const shelterContactInquiriesQuery = query(
      collection(db, 'shelter_contact_inquiries'),
      where('shelter_id', '==', shelterId)
    );
    const shelterContactInquiriesSnapshot = await getDocs(shelterContactInquiriesQuery);
    const totalShelterContactInquiries = shelterContactInquiriesSnapshot.size;
    
    // Count recent, replied, and unreplied inquiries
    let recentShelterContactInquiries = 0;
    let repliedShelterContactInquiries = 0;
    let unrepliedShelterContactInquiries = 0;
    shelterContactInquiriesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.created_at && data.created_at >= sevenDaysAgoTimestamp) {
        recentShelterContactInquiries++;
      }
      if (data.responded) {
        repliedShelterContactInquiries++;
      } else {
        unrepliedShelterContactInquiries++;
      }
    });
    
    console.log('✅ Shelter notification counts:', {
      unreadMessages,
      unreadAdminNotifications,
      totalAdminNotifications,
      totalParticipants,
      pendingParticipants,
      recentParticipants,
      activeParticipants,
      securityAlerts,
      fraudAlerts,
      totalShelterEmailSignups,
      recentShelterEmailSignups,
      totalShelterContactInquiries,
      recentShelterContactInquiries
    });
    
    return {
      // Message Notifications
      totalNotifications: unreadMessages + unreadAdminNotifications,
      unreadMessages,
      unreadNotifications: unreadAdminNotifications,
      
      // Email Signups (shelter-specific)
      totalEmailSignups: totalShelterEmailSignups,
      recentEmailSignups: recentShelterEmailSignups,
      
      // Contact Inquiries (shelter-specific)
      contactInquiries: totalShelterContactInquiries,
      recentContactInquiries: recentShelterContactInquiries,
      repliedContactInquiries: repliedShelterContactInquiries,
      unrepliedContactInquiries: unrepliedShelterContactInquiries,
      
      // Admin Notifications
      totalAdminNotifications,
      unreadAdminNotifications,
      securityAlerts,
      fraudAlerts,
      
      // Shelter Applications -> Participant Applications
      pendingShelterapplications: pendingParticipants,
      
      // Active Users -> Active Participants (last 24 hours)
      activeUsers: activeParticipants
    };
  } catch (error) {
    console.error('❌ Error getting shelter notification counts:', error);
    throw error;
  }
}

/**
 * Create a shelter-specific email signup
 * Notifies: Super Admins, Platform Admins, and the specific Shelter Admin
 */
export async function createShelterEmailSignup(data: {
  email: string;
  name?: string;
  phone?: string;
  shelter_id: string;
  shelter_name: string;
  interests?: string[];
  message?: string;
}): Promise<string> {
  try {
    const signupData: ShelterEmailSignup = {
      ...data,
      source: 'public_page',
      page: 'shelter_public_page',
      signup_date: Timestamp.now(),
      createdAt: Timestamp.now(),
      status: 'active'
    };

    const docRef = await addDoc(collection(db, 'shelter_email_signups'), signupData);
    console.log('✅ Shelter email signup created:', docRef.id);

    // 🔔 CREATE ADMIN NOTIFICATIONS
    try {
      // Get all Super Admins and Platform Admins
      const adminsQuery = query(
        collection(db, 'users'),
        where('role', 'in', ['super_admin', 'platform_admin'])
      );
      const adminsSnapshot = await getDocs(adminsQuery);

      // Get shelter-specific admin (if exists)
      const shelterAdminQuery = query(
        collection(db, 'users'),
        where('role', '==', 'admin'),
        where('shelter_id', '==', data.shelter_id)
      );
      const shelterAdminSnapshot = await getDocs(shelterAdminQuery);

      // Combine all admin IDs
      const adminIds = new Set<string>();
      adminsSnapshot.forEach(doc => adminIds.add(doc.id));
      shelterAdminSnapshot.forEach(doc => adminIds.add(doc.id));

      console.log(`📧 Notifying ${adminIds.size} administrators about shelter email signup`);

      // Create notification for each admin
      const notificationPromises = Array.from(adminIds).map(async (adminId) => {
        const notificationData = {
          type: 'shelter_email_signup',
          title: `New Email Signup: ${data.shelter_name}`,
          message: `${data.name || 'Someone'} (${data.email}) signed up for updates from ${data.shelter_name}`,
          priority: 'low' as const,
          recipient_id: adminId,
          category: 'email_signup',
          is_read: false,
          read: false,
          created_at: serverTimestamp(),
          data: {
            shelter_id: data.shelter_id,
            shelter_name: data.shelter_name,
            signup_email: data.email,
            signup_name: data.name,
            signup_id: docRef.id,
            source: 'shelter_public_page'
          }
        };

        return addDoc(collection(db, 'admin_notifications'), notificationData);
      });

      await Promise.all(notificationPromises);
      console.log(`✅ Created ${adminIds.size} admin notifications for shelter email signup`);

    } catch (notificationError) {
      console.error('⚠️ Error creating admin notifications (non-blocking):', notificationError);
      // Don't throw - notification failure shouldn't block signup creation
    }

    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating shelter email signup:', error);
    throw error;
  }
}

/**
 * Get shelter-specific email signups
 */
export async function getShelterEmailSignups(
  shelterId: string,
  maxResults: number = 50
): Promise<ShelterEmailSignup[]> {
  try {
    const signupsQuery = query(
      collection(db, 'shelter_email_signups'),
      where('shelter_id', '==', shelterId),
      orderBy('signup_date', 'desc'),
      limit(maxResults)
    );
    const snapshot = await getDocs(signupsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShelterEmailSignup));
  } catch (error) {
    console.error('❌ Error getting shelter email signups:', error);
    throw error;
  }
}

/**
 * Create a shelter-specific contact inquiry
 */
export async function createShelterContactInquiry(data: {
  shelter_id: string;
  shelter_name: string;
  sender_email: string;
  sender_name: string;
  sender_phone?: string;
  subject: string;
  message: string;
  inquiry_type: 'general' | 'services' | 'volunteer' | 'donation' | 'partnership';
}): Promise<string> {
  try {
    const inquiryData: ShelterContactInquiry = {
      ...data,
      source: 'public_page',
      priority: 'normal',
      status: 'new',
      responded: false,
      created_at: Timestamp.now(),
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'shelter_contact_inquiries'), inquiryData);
    console.log('✅ Shelter contact inquiry created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating shelter contact inquiry:', error);
    throw error;
  }
}

/**
 * Get shelter-specific contact inquiries
 */
export async function getShelterContactInquiries(
  shelterId: string,
  maxResults: number = 50
): Promise<ShelterContactInquiry[]> {
  try {
    const inquiriesQuery = query(
      collection(db, 'shelter_contact_inquiries'),
      where('shelter_id', '==', shelterId),
      orderBy('created_at', 'desc'),
      limit(maxResults)
    );
    const snapshot = await getDocs(inquiriesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShelterContactInquiry));
  } catch (error) {
    console.error('❌ Error getting shelter contact inquiries:', error);
    throw error;
  }
}