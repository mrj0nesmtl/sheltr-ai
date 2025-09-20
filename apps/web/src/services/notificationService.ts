import { collection, getDocs, query, orderBy, limit, where, Timestamp, addDoc, serverTimestamp, FieldValue, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// API base URL for notifications
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface EmailSignup {
  id: string;
  email: string;
  source: string;
  page: string;
  signup_date: Timestamp;
  user_agent?: string;
  status: string;
  created_at?: string;
}

export interface ContactInquiryNotification {
  id: string;
  inquiry_id: string;
  inquiry_type: string;
  sender_email: string;
  sender_name?: string;
  subject: string;
  priority: 'low' | 'normal' | 'high';
  source: string;
  status: 'new' | 'read' | 'responded';
  created_at: Timestamp;
  read_by?: string[];
}

export interface NotificationCounts {
  totalEmailSignups: number;
  recentEmailSignups: number;
  pendingShelterapplications: number;
  contactInquiries: number;
  recentContactInquiries: number;
  repliedContactInquiries: number;
  totalNotifications: number;
}

/**
 * Fetch recent email signups from newsletter_signups collection
 * SESSION 13: MULTI-TENANT - Prioritize REAL database data over mock data
 */
export const getRecentEmailSignups = async (limitCount: number = 10): Promise<EmailSignup[]> => {
  try {
    console.log('🔔 [SESSION 13] Fetching REAL email signups from newsletter_signups collection...');
    
    // PRIORITY 1: Real Firestore data from newsletter_signups collection
    const signupsRef = collection(db, 'newsletter_signups');
    const q = query(
      signupsRef,
      orderBy('signup_date', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const signups: EmailSignup[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      signups.push({
        id: doc.id,
        email: data.email,
        source: data.source || 'unknown',
        page: data.page || 'unknown',
        signup_date: data.signup_date,
        user_agent: data.user_agent,
        status: data.status || 'active',
        created_at: data.signup_date?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    console.log(`✅ [SESSION 13] Found ${signups.length} REAL email signups from newsletter_signups collection`);
    
    // If we have real data, return it
    if (signups.length > 0) {
      console.log('📧 Real email signups:', signups.map(s => ({ email: s.email, source: s.source, page: s.page })));
      return signups;
    }
    
    // FALLBACK: Only use mock data if no real signups exist
    console.log('⚠️ No real email signups found, checking API for backup data...');
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/analytics/test-platform`);
      if (response.ok) {
        const data = await response.json();
        const userData = data.data.users;
        const totalUsers = userData.total || 0;
        
        // Only generate minimal mock data if absolutely no real data exists
        if (totalUsers > 0) {
          console.log('🎭 Generating minimal fallback data (no real signups found)');
          const fallbackSignups: EmailSignup[] = [
            {
              id: 'fallback_1',
              email: 'demo@sheltr.ai',
              source: 'demo',
              page: 'fallback',
              signup_date: Timestamp.now(),
              user_agent: 'SHELTR Demo System',
              status: 'demo',
              created_at: new Date().toISOString()
            }
          ];
          
          return fallbackSignups;
        }
      }
    } catch (apiError) {
      console.warn('⚠️ API also failed, returning empty array:', apiError);
    }
    
    // Return empty array if no data available
    console.log('ℹ️ No email signups available (neither real nor fallback)');
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching email signups:', error);
    return [];
  }
};

/**
 * Get notification counts for Super Admin dashboard
 * SESSION 13: MULTI-TENANT - Use REAL database data first
 */
export const getNotificationCounts = async (): Promise<NotificationCounts> => {
  try {
    console.log('🔔 [SESSION 13] Fetching REAL notification counts from database...');
    
    // PRIORITY 1: Real Firestore data from actual collections
    console.log('🔔 Getting real data from newsletter_signups and applications...');
    
    // Get total email signups from real collection
    const signupsRef = collection(db, 'newsletter_signups');
    const totalSignupsSnapshot = await getDocs(signupsRef);
    const totalEmailSignups = totalSignupsSnapshot.size;
    
    // Get recent email signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSignupsQuery = query(
      signupsRef,
      where('signup_date', '>=', Timestamp.fromDate(sevenDaysAgo))
    );
    const recentSignupsSnapshot = await getDocs(recentSignupsQuery);
    const recentEmailSignups = recentSignupsSnapshot.size;
    
    // Get pending shelter applications from multi-tenant structure
    let pendingShelterapplications = 0;
    try {
      // Try global applications collection first
      const globalAppsRef = collection(db, 'global/platform_admin/applications');
      const globalAppsSnapshot = await getDocs(globalAppsRef);
      pendingShelterapplications += globalAppsSnapshot.size;
      
      // Also check legacy shelter_applications collection
      const legacyAppsRef = collection(db, 'shelter_applications');
      const pendingQuery = query(
        legacyAppsRef,
        where('status', '==', 'pending_review')
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      pendingShelterapplications += pendingSnapshot.size;
      
    } catch {
      console.log('ℹ️ No applications collections found yet');
    }
    
    // Get contact inquiry metrics from actual contact_inquiries collection
    let contactInquiries = 0;
    let recentContactInquiries = 0;
    let repliedContactInquiries = 0;
    try {
      const contactInquiriesRef = collection(db, 'contact_inquiries');
      
      // Get total contact inquiries
      const totalInquiriesSnapshot = await getDocs(contactInquiriesRef);
      contactInquiries = totalInquiriesSnapshot.size;
      
      // Get recent contact inquiries (last 7 days)
      const recentInquiriesQuery = query(
        contactInquiriesRef,
        where('created_at', '>=', Timestamp.fromDate(sevenDaysAgo))
      );
      const recentInquiriesSnapshot = await getDocs(recentInquiriesQuery);
      recentContactInquiries = recentInquiriesSnapshot.size;
      
      // Get replied contact inquiries
      const repliedInquiriesQuery = query(
        contactInquiriesRef,
        where('responded', '==', true)
      );
      const repliedInquiriesSnapshot = await getDocs(repliedInquiriesQuery);
      repliedContactInquiries = repliedInquiriesSnapshot.size;
      
    } catch {
      console.log('ℹ️ No contact_inquiries collection found yet');
    }
    
    const totalNotifications = recentEmailSignups + pendingShelterapplications + recentContactInquiries;
    
    const counts: NotificationCounts = {
      totalEmailSignups,
      recentEmailSignups,
      pendingShelterapplications,
      contactInquiries,
      recentContactInquiries,
      repliedContactInquiries,
      totalNotifications
    };
    
    console.log('✅ [SESSION 13] Real notification counts from database:', counts);
    console.log(`📧 Real signups: ${totalEmailSignups} total, ${recentEmailSignups} recent`);
    console.log(`📋 Pending applications: ${pendingShelterapplications}`);
    console.log(`💬 Contact inquiries: ${contactInquiries} total, ${recentContactInquiries} recent, ${repliedContactInquiries} replied`);
    
    // If we have some real data, return it
    if (totalEmailSignups > 0 || pendingShelterapplications > 0 || contactInquiries > 0) {
      return counts;
    }
    
    // FALLBACK: Only if absolutely no real data exists, use minimal mock data
    console.log('⚠️ No real notification data found, using minimal fallback...');
    
    return {
      totalEmailSignups: 0,
      recentEmailSignups: 0,
      pendingShelterapplications: 0,
      contactInquiries: 0,
      recentContactInquiries: 0,
      repliedContactInquiries: 0,
      totalNotifications: 0
    };
    
  } catch (error) {
    console.error('❌ Error fetching notification counts:', error);
    return {
      totalEmailSignups: 0,
      recentEmailSignups: 0,
      pendingShelterapplications: 0,
      contactInquiries: 0,
      recentContactInquiries: 0,
      repliedContactInquiries: 0,
      totalNotifications: 0
    };
  }
};

/**
 * Create a notification for contact inquiry
 */
export const createContactInquiryNotification = async (inquiryData: {
  inquiry_id: string;
  inquiry_type: string;
  sender_email: string;
  sender_name?: string;
  subject: string;
  priority: 'low' | 'normal' | 'high';
  source: string;
}): Promise<string> => {
  try {
    console.log('🔔 Creating contact inquiry notification:', inquiryData);
    
    const notification: Omit<ContactInquiryNotification, 'id'> = {
      inquiry_id: inquiryData.inquiry_id,
      inquiry_type: inquiryData.inquiry_type,
      sender_email: inquiryData.sender_email,
      sender_name: inquiryData.sender_name,
      subject: inquiryData.subject,
      priority: inquiryData.priority,
      source: inquiryData.source,
      status: 'new',
      created_at: serverTimestamp(),
      read_by: []
    };

    const docRef = await addDoc(collection(db, 'admin_notifications'), notification);
    console.log('✅ Contact inquiry notification created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating contact inquiry notification:', error);
    throw error;
  }
};

/**
 * Get recent contact inquiry notifications from actual contact_inquiries collection
 */
export const getRecentContactInquiries = async (limitCount: number = 10): Promise<ContactInquiryNotification[]> => {
  try {
    console.log('🔔 Fetching recent contact inquiries from contact_inquiries collection...');
    
    const contactInquiriesRef = collection(db, 'contact_inquiries');
    const q = query(
      contactInquiriesRef,
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const notifications: ContactInquiryNotification[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        inquiry_id: doc.id, // Use the document ID as inquiry_id
        inquiry_type: data.inquiry_type || 'contact_form',
        sender_email: data.email,
        sender_name: data.name,
        subject: data.subject || `${data.inquiry_type || 'Contact'} inquiry`,
        priority: data.priority || 'normal',
        source: data.source || 'contact_form',
        status: data.responded ? 'responded' : 'new',
        created_at: data.created_at,
        read_by: []
      });
    });
    
    console.log(`✅ Found ${notifications.length} contact inquiries from contact_inquiries collection`);
    return notifications;
  } catch (error) {
    console.error('❌ Error fetching contact inquiries:', error);
    return [];
  }
};

/**
 * Format relative time for notifications
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

export interface AdminNotification {
  id?: string;
  type: 'user_signup' | 'donation' | 'contact_inquiry' | 'system_alert' | 'github_sync_required' | 'fraud_alert';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  created_at: Timestamp | FieldValue;
  target_roles?: string[];
}

/**
 * Create a general admin notification
 */
const createAdminNotification = async (notification: Omit<AdminNotification, 'id' | 'read' | 'created_at'>): Promise<string> => {
  try {
    console.log('📢 Creating admin notification:', notification);

    const notificationData = {
      ...notification,
      read: false,
      created_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'admin_notifications'), notificationData);
    console.log('✅ Admin notification created with ID:', docRef.id);

    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating admin notification:', error);
    throw error;
  }
};

/**
 * Get recent admin notifications
 */
export const getAdminNotifications = async (limitCount: number = 20): Promise<AdminNotification[]> => {
  try {
    console.log('🔔 [ADMIN NOTIFICATIONS] Fetching admin notifications...');
    
    const notificationsRef = collection(db, 'admin_notifications');
    const q = query(
      notificationsRef,
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const notifications: AdminNotification[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        priority: data.priority,
        read: data.read || false,
        created_at: data.created_at,
        target_roles: data.target_roles || []
      });
    });
    
    console.log(`✅ [ADMIN NOTIFICATIONS] Found ${notifications.length} admin notifications`);
    return notifications;
    
  } catch (error) {
    console.error('❌ [ADMIN NOTIFICATIONS] Error fetching admin notifications:', error);
    return [];
  }
};

/**
 * Mark an admin notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    console.log(`🔔 [ADMIN NOTIFICATIONS] Marking notification ${notificationId} as read...`);
    
    const notificationRef = doc(db, 'admin_notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
      read_at: serverTimestamp()
    });
    
    console.log(`✅ [ADMIN NOTIFICATIONS] Notification ${notificationId} marked as read`);
    return true;
    
  } catch (error) {
    console.error(`❌ [ADMIN NOTIFICATIONS] Error marking notification ${notificationId} as read:`, error);
    return false;
  }
};

/**
 * Create a fraud alert notification for all administrators
 */
export const createFraudAlertNotification = async (fraudAlert: {
  id: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  details: string;
  timestamp: string;
  status: string;
}): Promise<string> => {
  try {
    console.log('🚨 [FRAUD ALERT] Creating fraud alert notification for all administrators...', fraudAlert);

    const priorityMap = {
      'low': 'medium' as const,
      'medium': 'high' as const, 
      'high': 'high' as const
    };

    const notification: Omit<AdminNotification, 'id' | 'read' | 'created_at'> = {
      type: 'fraud_alert',
      title: `🚨 Fraud Alert: ${fraudAlert.description}`,
      message: `${fraudAlert.details} - Alert Level: ${fraudAlert.level.toUpperCase()}`,
      data: {
        fraud_alert_id: fraudAlert.id,
        level: fraudAlert.level,
        description: fraudAlert.description,
        details: fraudAlert.details,
        timestamp: fraudAlert.timestamp,
        status: fraudAlert.status
      },
      priority: priorityMap[fraudAlert.level],
      target_roles: ['super_admin', 'platform_admin'] // Notify all administrators
    };

    const notificationId = await createAdminNotification(notification);
    
    console.log(`✅ [FRAUD ALERT] Fraud alert notification created with ID: ${notificationId}`);
    console.log(`🔔 [FRAUD ALERT] Notification sent to: super_admin, platform_admin`);
    
    return notificationId;
  } catch (error) {
    console.error('❌ [FRAUD ALERT] Error creating fraud alert notification:', error);
    throw error;
  }
};

// Export the service with the new functions
export const notificationService = {
  getNotificationCounts,
  getRecentContactInquiries,
  createContactInquiryNotification,
  createAdminNotification,
  createFraudAlertNotification,
  getAdminNotifications,
  markNotificationAsRead
};
