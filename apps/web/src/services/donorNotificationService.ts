/**
 * Donor Notification Service
 * Handles notifications for donors - donation confirmations, receipts, transaction updates
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
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface DonorNotification {
  id?: string;
  userId: string; // donor user ID
  type: 'donation_confirmation' | 'donation_receipt' | 'transaction_update' | 'system_message' | 'tax_document_ready';
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high';
  isRead: boolean;
  createdAt: Timestamp;
  readAt?: Timestamp;
  
  // Donation-specific data
  donationId?: string;
  amount?: number;
  participantName?: string;
  shelterName?: string;
  transactionId?: string;
  receiptUrl?: string;
}

export interface DonorNotificationCounts {
  total: number;
  unread: number;
  recentDonations: number; // last 7 days
}

/**
 * Create a donation confirmation notification for a donor
 */
export async function createDonationConfirmationNotification(
  userId: string,
  donationData: {
    donationId: string;
    amount: number;
    participantName?: string;
    shelterName?: string;
    transactionId: string;
  }
): Promise<string> {
  try {
    console.log('💰 Creating donation confirmation notification for donor:', userId);
    
    const participantInfo = donationData.participantName 
      ? `to ${donationData.participantName}` 
      : donationData.shelterName 
        ? `to ${donationData.shelterName}`
        : '';
    
    const notificationData: Omit<DonorNotification, 'id'> = {
      userId,
      type: 'donation_confirmation',
      title: 'Donation Confirmed',
      message: `Your donation of $${donationData.amount.toFixed(2)} ${participantInfo} has been confirmed. Transaction ID: ${donationData.transactionId}`,
      priority: 'high',
      isRead: false,
      createdAt: serverTimestamp() as Timestamp,
      donationId: donationData.donationId,
      amount: donationData.amount,
      participantName: donationData.participantName,
      shelterName: donationData.shelterName,
      transactionId: donationData.transactionId
    };

    const docRef = await addDoc(collection(db, 'donor_notifications'), notificationData);
    console.log('✅ Donation confirmation notification created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating donation confirmation notification:', error);
    throw error;
  }
}

/**
 * Create a donation receipt notification for a donor
 */
export async function createDonationReceiptNotification(
  userId: string,
  donationData: {
    donationId: string;
    amount: number;
    receiptUrl: string;
    transactionId: string;
  }
): Promise<string> {
  try {
    console.log('📄 Creating donation receipt notification for donor:', userId);
    
    const notificationData: Omit<DonorNotification, 'id'> = {
      userId,
      type: 'donation_receipt',
      title: 'Donation Receipt Ready',
      message: `Your donation receipt for $${donationData.amount.toFixed(2)} is now available for download.`,
      priority: 'normal',
      isRead: false,
      createdAt: serverTimestamp() as Timestamp,
      donationId: donationData.donationId,
      amount: donationData.amount,
      transactionId: donationData.transactionId,
      receiptUrl: donationData.receiptUrl
    };

    const docRef = await addDoc(collection(db, 'donor_notifications'), notificationData);
    console.log('✅ Donation receipt notification created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating donation receipt notification:', error);
    throw error;
  }
}

/**
 * Create a transaction update notification for a donor
 */
export async function createTransactionUpdateNotification(
  userId: string,
  updateData: {
    donationId: string;
    transactionId: string;
    status: string;
    message: string;
  }
): Promise<string> {
  try {
    console.log('🔄 Creating transaction update notification for donor:', userId);
    
    const notificationData: Omit<DonorNotification, 'id'> = {
      userId,
      type: 'transaction_update',
      title: 'Transaction Update',
      message: updateData.message,
      priority: 'normal',
      isRead: false,
      createdAt: serverTimestamp() as Timestamp,
      donationId: updateData.donationId,
      transactionId: updateData.transactionId
    };

    const docRef = await addDoc(collection(db, 'donor_notifications'), notificationData);
    console.log('✅ Transaction update notification created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating transaction update notification:', error);
    throw error;
  }
}

/**
 * Create a system message notification for a donor
 */
export async function createDonorSystemMessage(
  userId: string,
  messageData: {
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'high';
  }
): Promise<string> {
  try {
    console.log('📢 Creating system message for donor:', userId);
    
    const notificationData: Omit<DonorNotification, 'id'> = {
      userId,
      type: 'system_message',
      title: messageData.title,
      message: messageData.message,
      priority: messageData.priority || 'normal',
      isRead: false,
      createdAt: serverTimestamp() as Timestamp
    };

    const docRef = await addDoc(collection(db, 'donor_notifications'), notificationData);
    console.log('✅ System message created for donor:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating system message for donor:', error);
    throw error;
  }
}

/**
 * Get all notifications for a donor
 */
export async function getDonorNotifications(
  userId: string,
  maxResults: number = 20
): Promise<DonorNotification[]> {
  try {
    console.log('🔍 Getting donor notifications for userId:', userId);
    
    const q = query(
      collection(db, 'donor_notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    const notifications: DonorNotification[] = [];

    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      } as DonorNotification);
    });

    console.log(`✅ Found ${notifications.length} donor notifications`);
    return notifications;
  } catch (error) {
    console.error('❌ Error getting donor notifications:', error);
    return [];
  }
}

/**
 * Get unread notification counts for a donor
 */
export async function getDonorNotificationCounts(userId: string): Promise<DonorNotificationCounts> {
  try {
    console.log('📊 Getting donor notification counts for userId:', userId);
    
    // Get all notifications
    const allNotificationsQuery = query(
      collection(db, 'donor_notifications'),
      where('userId', '==', userId)
    );
    const allSnapshot = await getDocs(allNotificationsQuery);
    const total = allSnapshot.size;
    
    // Count unread
    let unread = 0;
    allSnapshot.forEach(doc => {
      if (!doc.data().isRead) {
        unread++;
      }
    });
    
    // Count recent donations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);
    
    let recentDonations = 0;
    allSnapshot.forEach(doc => {
      const data = doc.data();
      if (
        data.type === 'donation_confirmation' &&
        data.createdAt &&
        data.createdAt.toDate() > sevenDaysAgo
      ) {
        recentDonations++;
      }
    });
    
    const counts = {
      total,
      unread,
      recentDonations
    };
    
    console.log('✅ Donor notification counts:', counts);
    return counts;
  } catch (error) {
    console.error('❌ Error getting donor notification counts:', error);
    return {
      total: 0,
      unread: 0,
      recentDonations: 0
    };
  }
}

/**
 * Mark a donor notification as read
 */
export async function markDonorNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'donor_notifications', notificationId), {
      isRead: true,
      readAt: serverTimestamp()
    });
    console.log('✅ Donor notification marked as read:', notificationId);
    return true;
  } catch (error) {
    console.error('❌ Error marking donor notification as read:', error);
    return false;
  }
}

/**
 * Mark all donor notifications as read
 */
export async function markAllDonorNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    console.log('📖 Marking all donor notifications as read for userId:', userId);
    
    const q = query(
      collection(db, 'donor_notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map(docSnapshot =>
      updateDoc(doc(db, 'donor_notifications', docSnapshot.id), {
        isRead: true,
        readAt: serverTimestamp()
      })
    );
    
    await Promise.all(updatePromises);
    console.log(`✅ Marked ${querySnapshot.size} notifications as read`);
    return true;
  } catch (error) {
    console.error('❌ Error marking all donor notifications as read:', error);
    return false;
  }
}

