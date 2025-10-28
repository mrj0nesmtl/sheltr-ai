/**
 * SHELTR Unified Notification Service
 * 
 * Created: October 21, 2025
 * Purpose: Simplified, role-based notification system with clean routing
 * 
 * This service replaces the fragmented notification logic with a unified
 * approach that routes notifications to the correct collection based on user role.
 */

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  orderBy, 
  limit as firestoreLimit,
  Timestamp,
  serverTimestamp,
  getDoc,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  AdminNotification,
  ShelterNotification,
  ParticipantNotification,
  DonorNotification,
  MessageNotification,
  UnifiedNotification,
  NotificationPriority,
  NotificationCategory,
  AdminNotificationType,
  ShelterNotificationType,
  ParticipantNotificationType,
  DonorNotificationType,
  MessageNotificationType
} from '@/types/notifications';

// ============================================================================
// NOTIFICATION CREATION FUNCTIONS
// ============================================================================

/**
 * Create an admin notification (Super Admin + Platform Admin)
 */
export async function createAdminNotification(data: {
  recipient_id: string;
  recipient_role: 'super_admin' | 'platform_admin';
  type: AdminNotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  data?: Record<string, any>;
  expires_at?: Timestamp;
}): Promise<string> {
  try {
    const notification: Omit<AdminNotification, 'id'> = {
      recipient_id: data.recipient_id,
      recipient_role: data.recipient_role,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || 'normal',
      category: data.category || getCategoryFromType(data.type),
      isRead: false,
      created_at: serverTimestamp() as Timestamp,
      ...(data.data && { data: data.data }),
      ...(data.expires_at && { expires_at: data.expires_at })
    };

    const docRef = await addDoc(collection(db, 'admin_notifications'), notification);
    console.log(`✅ Admin notification created: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating admin notification:', error);
    throw error;
  }
}

/**
 * Create a shelter notification (Shelter Admin only)
 */
export async function createShelterNotification(data: {
  shelter_id: string;
  tenant_id: string;
  recipient_id: string;
  type: ShelterNotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  data?: Record<string, any>;
}): Promise<string> {
  try {
    const notification: Omit<ShelterNotification, 'id'> = {
      shelter_id: data.shelter_id,
      tenant_id: data.tenant_id,
      recipient_id: data.recipient_id,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || 'normal',
      category: data.category || 'shelter',
      isRead: false,
      created_at: serverTimestamp() as Timestamp,
      ...(data.data && { data: data.data })
    };

    const docRef = await addDoc(collection(db, 'shelter_notifications'), notification);
    console.log(`✅ Shelter notification created: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating shelter notification:', error);
    throw error;
  }
}

/**
 * Create a participant notification
 */
export async function createParticipantNotification(data: {
  userId: string;
  type: ParticipantNotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  metadata?: Record<string, any>;
}): Promise<string> {
  try {
    const notification: Omit<ParticipantNotification, 'id'> = {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || 'normal',
      category: data.category || 'donation',
      isRead: false,
      created_at: serverTimestamp() as Timestamp,
      ...(data.metadata && { metadata: data.metadata })
    };

    const docRef = await addDoc(collection(db, 'participant_notifications'), notification);
    console.log(`✅ Participant notification created: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating participant notification:', error);
    throw error;
  }
}

/**
 * Create a donor notification
 */
export async function createDonorNotification(data: {
  userId: string;
  type: DonorNotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  metadata?: Record<string, any>;
}): Promise<string> {
  try {
    const notification: Omit<DonorNotification, 'id'> = {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || 'normal',
      category: data.category || 'transaction',
      isRead: false,
      created_at: serverTimestamp() as Timestamp,
      ...(data.metadata && { metadata: data.metadata })
    };

    const docRef = await addDoc(collection(db, 'donor_notifications'), notification);
    console.log(`✅ Donor notification created: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating donor notification:', error);
    throw error;
  }
}

/**
 * Create a message notification (internal messaging system)
 */
export async function createMessageNotification(data: {
  userId: string;
  type: MessageNotificationType;
  messageId: string;
  conversationId: string;
  fromUserId: string;
  fromUserDisplayName: string;
  fromUserShortcode: string;
  content: string;
  title: string;
  message: string;
}): Promise<string> {
  try {
    const notification: Omit<MessageNotification, 'id'> = {
      userId: data.userId,
      type: data.type,
      messageId: data.messageId,
      conversationId: data.conversationId,
      fromUserId: data.fromUserId,
      fromUserDisplayName: data.fromUserDisplayName,
      fromUserShortcode: data.fromUserShortcode,
      content: data.content,
      title: data.title,
      message: data.message,
      priority: 'normal',
      category: 'system',
      isRead: false,
      createdAt: serverTimestamp() as Timestamp,
      created_at: serverTimestamp() as Timestamp
    };

    const docRef = await addDoc(collection(db, 'message_notifications'), notification);
    console.log(`✅ Message notification created: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating message notification:', error);
    throw error;
  }
}

// ============================================================================
// NOTIFICATION RETRIEVAL FUNCTIONS
// ============================================================================

/**
 * Get admin notifications for a specific admin user
 */
export async function getAdminNotifications(
  userId: string,
  limit: number = 50,
  unreadOnly: boolean = false
): Promise<AdminNotification[]> {
  try {
    let q = query(
      collection(db, 'admin_notifications'),
      where('recipient_id', '==', userId),
      orderBy('created_at', 'desc'),
      firestoreLimit(limit)
    );

    if (unreadOnly) {
      q = query(
        collection(db, 'admin_notifications'),
        where('recipient_id', '==', userId),
        where('isRead', '==', false),
        orderBy('created_at', 'desc'),
        firestoreLimit(limit)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AdminNotification));
  } catch (error) {
    console.error('❌ Error getting admin notifications:', error);
    return [];
  }
}

/**
 * Get shelter notifications for a specific shelter admin
 */
export async function getShelterNotifications(
  recipientId: string,
  limit: number = 50,
  unreadOnly: boolean = false
): Promise<ShelterNotification[]> {
  try {
    let q = query(
      collection(db, 'shelter_notifications'),
      where('recipient_id', '==', recipientId),
      orderBy('created_at', 'desc'),
      firestoreLimit(limit)
    );

    if (unreadOnly) {
      q = query(
        collection(db, 'shelter_notifications'),
        where('recipient_id', '==', recipientId),
        where('isRead', '==', false),
        orderBy('created_at', 'desc'),
        firestoreLimit(limit)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ShelterNotification));
  } catch (error) {
    console.error('❌ Error getting shelter notifications:', error);
    return [];
  }
}

/**
 * Get participant notifications
 */
export async function getParticipantNotifications(
  userId: string,
  limit: number = 50,
  unreadOnly: boolean = false
): Promise<ParticipantNotification[]> {
  try {
    let q = query(
      collection(db, 'participant_notifications'),
      where('userId', '==', userId),
      orderBy('created_at', 'desc'),
      firestoreLimit(limit)
    );

    if (unreadOnly) {
      q = query(
        collection(db, 'participant_notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false),
        orderBy('created_at', 'desc'),
        firestoreLimit(limit)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ParticipantNotification));
  } catch (error) {
    console.error('❌ Error getting participant notifications:', error);
    return [];
  }
}

/**
 * Get donor notifications
 */
export async function getDonorNotifications(
  userId: string,
  limit: number = 50,
  unreadOnly: boolean = false
): Promise<DonorNotification[]> {
  try {
    let q = query(
      collection(db, 'donor_notifications'),
      where('userId', '==', userId),
      orderBy('created_at', 'desc'),
      firestoreLimit(limit)
    );

    if (unreadOnly) {
      q = query(
        collection(db, 'donor_notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false),
        orderBy('created_at', 'desc'),
        firestoreLimit(limit)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as DonorNotification));
  } catch (error) {
    console.error('❌ Error getting donor notifications:', error);
    return [];
  }
}

/**
 * Get message notifications
 */
export async function getMessageNotifications(
  userId: string,
  limit: number = 50,
  unreadOnly: boolean = false
): Promise<MessageNotification[]> {
  try {
    let q = query(
      collection(db, 'message_notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      firestoreLimit(limit)
    );

    if (unreadOnly) {
      q = query(
        collection(db, 'message_notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MessageNotification));
  } catch (error) {
    console.error('❌ Error getting message notifications:', error);
    return [];
  }
}

// ============================================================================
// NOTIFICATION UPDATE FUNCTIONS
// ============================================================================

/**
 * Mark notification as read (works for any collection)
 */
export async function markNotificationAsRead(
  notificationId: string,
  collectionName: string
): Promise<boolean> {
  try {
    const notificationRef = doc(db, collectionName, notificationId);
    await updateDoc(notificationRef, {
      isRead: true,
      readAt: serverTimestamp()
    });
    console.log(`✅ Notification marked as read: ${notificationId}`);
    return true;
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    return false;
  }
}

/**
 * Mark all notifications as read for a user in a specific collection
 */
export async function markAllNotificationsAsRead(
  userId: string,
  userRole: 'super_admin' | 'platform_admin' | 'admin' | 'participant' | 'donor'
): Promise<number> {
  try {
    const collectionName = getCollectionNameForRole(userRole);
    const userField = getUserFieldForCollection(collectionName);
    
    const q = query(
      collection(db, collectionName),
      where(userField, '==', userId),
      where('isRead', '==', false)
    );

    const snapshot = await getDocs(q);
    
    const updatePromises = snapshot.docs.map(docSnapshot => 
      updateDoc(doc(db, collectionName, docSnapshot.id), {
        isRead: true,
        readAt: serverTimestamp()
      })
    );

    await Promise.all(updatePromises);
    console.log(`✅ Marked ${snapshot.docs.length} notifications as read`);
    return snapshot.docs.length;
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    return 0;
  }
}

/**
 * Bulk mark notifications as read
 */
export async function bulkMarkNotificationsAsRead(
  notificationIds: string[],
  collectionName: string
): Promise<number> {
  try {
    const updatePromises = notificationIds.map(id => 
      updateDoc(doc(db, collectionName, id), {
        isRead: true,
        readAt: serverTimestamp()
      })
    );
    
    await Promise.all(updatePromises);
    console.log(`✅ Bulk marked ${notificationIds.length} notifications as read`);
    return notificationIds.length;
  } catch (error) {
    console.error('❌ Error bulk marking notifications as read:', error);
    return 0;
  }
}

/**
 * Bulk mark notifications as unread
 */
export async function bulkMarkNotificationsAsUnread(
  notificationIds: string[],
  collectionName: string
): Promise<number> {
  try {
    const updatePromises = notificationIds.map(id => 
      updateDoc(doc(db, collectionName, id), {
        isRead: false,
        readAt: null
      })
    );
    
    await Promise.all(updatePromises);
    console.log(`✅ Bulk marked ${notificationIds.length} notifications as unread`);
    return notificationIds.length;
  } catch (error) {
    console.error('❌ Error bulk marking notifications as unread:', error);
    return 0;
  }
}

/**
 * Bulk delete notifications
 */
export async function bulkDeleteNotifications(
  notificationIds: string[],
  collectionName: string
): Promise<number> {
  try {
    const deletePromises = notificationIds.map(id => 
      deleteDoc(doc(db, collectionName, id))
    );
    
    await Promise.all(deletePromises);
    console.log(`✅ Bulk deleted ${notificationIds.length} notifications`);
    return notificationIds.length;
  } catch (error) {
    console.error('❌ Error bulk deleting notifications:', error);
    return 0;
  }
}

/**
 * Clear ALL notifications system-wide (Super Admin only)
 * This will delete all notifications from all collections
 */
export async function clearAllNotificationsSystemWide(): Promise<{
  success: boolean;
  deletedCount: number;
  collections: string[];
  error?: string;
}> {
  try {
    const collections = [
      'admin_notifications',
      'shelter_notifications',
      'participant_notifications',
      'donor_notifications',
      'message_notifications'
    ];

    let totalDeleted = 0;
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      
      // Delete in batches to avoid hitting Firestore limits
      const deletePromises = snapshot.docs.map(docSnapshot => 
        deleteDoc(doc(db, collectionName, docSnapshot.id))
      );
      
      await Promise.all(deletePromises);
      totalDeleted += snapshot.docs.length;
      console.log(`✅ Cleared ${snapshot.docs.length} notifications from ${collectionName}`);
    }

    console.log(`🧹 Total notifications cleared: ${totalDeleted}`);
    return {
      success: true,
      deletedCount: totalDeleted,
      collections
    };
  } catch (error) {
    console.error('❌ Error clearing all notifications:', error);
    return {
      success: false,
      deletedCount: 0,
      collections: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// ============================================================================
// NOTIFICATION COUNT FUNCTIONS
// ============================================================================

/**
 * Get unread notification count for any user role
 */
export async function getUnreadNotificationCount(
  userId: string,
  userRole: 'super_admin' | 'platform_admin' | 'admin' | 'participant' | 'donor'
): Promise<number> {
  try {
    const collectionName = getCollectionNameForRole(userRole);
    const userField = getUserFieldForCollection(collectionName);
    
    const q = query(
      collection(db, collectionName),
      where(userField, '==', userId),
      where('isRead', '==', false)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.length;
  } catch (error) {
    console.error('❌ Error getting unread notification count:', error);
    return 0;
  }
}

/**
 * Get comprehensive notification counts for admin dashboard
 */
export async function getAdminDashboardCounts(): Promise<{
  adminNotifications: number;
  shelterNotifications: number;
  participantNotifications: number;
  donorNotifications: number;
  messageNotifications: number;
  contactInquiries: number;
  newsletterSignups: number;
}> {
  try {
    const [
      adminSnapshot,
      shelterSnapshot,
      participantSnapshot,
      donorSnapshot,
      messageSnapshot,
      contactSnapshot,
      newsletterSnapshot
    ] = await Promise.all([
      getDocs(query(collection(db, 'admin_notifications'), where('isRead', '==', false))),
      getDocs(query(collection(db, 'shelter_notifications'), where('isRead', '==', false))),
      getDocs(query(collection(db, 'participant_notifications'), where('isRead', '==', false))),
      getDocs(query(collection(db, 'donor_notifications'), where('isRead', '==', false))),
      getDocs(query(collection(db, 'message_notifications'), where('isRead', '==', false))),
      getDocs(query(collection(db, 'contact_inquiries'), where('status', '==', 'new'))),
      getDocs(query(collection(db, 'contact_inquiries'), where('inquiry_type', '==', 'newsletter_signup')))
    ]);

    return {
      adminNotifications: adminSnapshot.size,
      shelterNotifications: shelterSnapshot.size,
      participantNotifications: participantSnapshot.size,
      donorNotifications: donorSnapshot.size,
      messageNotifications: messageSnapshot.size,
      contactInquiries: contactSnapshot.size,
      newsletterSignups: newsletterSnapshot.size
    };
  } catch (error) {
    console.error('❌ Error getting admin dashboard counts:', error);
    return {
      adminNotifications: 0,
      shelterNotifications: 0,
      participantNotifications: 0,
      donorNotifications: 0,
      messageNotifications: 0,
      contactInquiries: 0,
      newsletterSignups: 0
    };
  }
}

// ============================================================================
// REAL-TIME LISTENERS
// ============================================================================

/**
 * Subscribe to real-time notification updates
 */
export function subscribeToNotifications(
  userId: string,
  userRole: 'super_admin' | 'platform_admin' | 'admin' | 'participant' | 'donor',
  callback: (notifications: UnifiedNotification[]) => void
): () => void {
  const collectionName = getCollectionNameForRole(userRole);
  const userField = getUserFieldForCollection(collectionName);

  // Store notifications from both sources
  let roleNotifications: UnifiedNotification[] = [];
  let messageNotifications: UnifiedNotification[] = [];

  // Subscribe to role-specific notifications
  const q1 = query(
    collection(db, collectionName),
    where(userField, '==', userId),
    orderBy('created_at', 'desc'),
    firestoreLimit(50)
  );

  const unsubscribe1 = onSnapshot(q1, (snapshot: QuerySnapshot<DocumentData>) => {
    roleNotifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UnifiedNotification));
    
    // Merge and sort all notifications
    const allNotifications = [...roleNotifications, ...messageNotifications];
    allNotifications.sort((a, b) => {
      const aTime = a.created_at || (a as any).createdAt;
      const bTime = b.created_at || (b as any).createdAt;
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
    
    callback(allNotifications);
  });

  // Subscribe to message notifications
  const q2 = query(
    collection(db, 'message_notifications'),
    where('userId', '==', userId),
    orderBy('created_at', 'desc'),
    firestoreLimit(50)
  );

  const unsubscribe2 = onSnapshot(q2, (snapshot: QuerySnapshot<DocumentData>) => {
    messageNotifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UnifiedNotification));
    
    // Merge and sort all notifications
    const allNotifications = [...roleNotifications, ...messageNotifications];
    allNotifications.sort((a, b) => {
      const aTime = a.created_at || (a as any).createdAt;
      const bTime = b.created_at || (b as any).createdAt;
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
    
    callback(allNotifications);
  });

  // Return unsubscribe function that cleans up both listeners
  return () => {
    unsubscribe1();
    unsubscribe2();
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get collection name based on user role
 */
function getCollectionNameForRole(
  role: 'super_admin' | 'platform_admin' | 'admin' | 'participant' | 'donor'
): string {
  switch (role) {
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
}

/**
 * Get user field name for querying based on collection
 */
function getUserFieldForCollection(collectionName: string): string {
  switch (collectionName) {
    case 'admin_notifications':
    case 'shelter_notifications':
      return 'recipient_id';
    case 'participant_notifications':
    case 'donor_notifications':
      return 'userId';
    case 'message_notifications':
      return 'userId';
    default:
      return 'userId';
  }
}

/**
 * Get notification category from type
 */
function getCategoryFromType(type: string): NotificationCategory {
  if (type.includes('contact')) return 'contact';
  if (type.includes('newsletter')) return 'newsletter';
  if (type.includes('application')) return 'application';
  if (type.includes('security') || type.includes('fraud')) return 'security';
  if (type.includes('donation')) return 'donation';
  if (type.includes('participant')) return 'participant';
  if (type.includes('shelter')) return 'shelter';
  return 'system';
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: Timestamp | Date | string | undefined | null): string {
  // Handle undefined/null timestamps
  if (!timestamp) {
    return 'Recently';
  }
  
  // Convert to Date object, handling multiple formats
  let date: Date;
  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return 'Recently';
  }
  
  // Validate date is valid
  if (!date || isNaN(date.getTime())) {
    return 'Recently';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

