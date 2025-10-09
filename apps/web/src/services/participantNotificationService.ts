/**
 * Participant Notification Service
 * Handles notifications for participants - donation receipts, service updates, system messages
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

export interface ParticipantNotification {
  id?: string;
  userId: string; // participant user ID
  type: 'donation_received' | 'service_update' | 'system_message' | 'goal_update' | 'appointment_reminder';
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high';
  isRead: boolean;
  createdAt: Timestamp;
  readAt?: Timestamp;
  
  // Donation-specific data
  donationId?: string;
  amount?: number;
  donorName?: string;
  
  // Service-specific data
  serviceId?: string;
  serviceName?: string;
  appointmentDate?: Timestamp;
}

export interface ParticipantNotificationCounts {
  total: number;
  unread: number;
  recentDonations: number; // last 7 days
  upcomingAppointments: number;
}

/**
 * Create a donation received notification for a participant
 */
export async function createDonationReceivedNotification(
  userId: string,
  donationData: {
    donationId: string;
    amount: number;
    donorName?: string;
    message?: string;
  }
): Promise<string> {
  try {
    console.log('💰 Creating donation received notification for participant:', userId);
    
    const donorInfo = donationData.donorName 
      ? `from ${donationData.donorName}` 
      : 'from an anonymous donor';
    
    const notificationData: Omit<ParticipantNotification, 'id'> = {
      userId,
      type: 'donation_received',
      title: 'Donation Received',
      message: donationData.message || `You received a donation of $${donationData.amount.toFixed(2)} ${donorInfo}.`,
      priority: 'high',
      isRead: false,
      createdAt: serverTimestamp() as Timestamp,
      donationId: donationData.donationId,
      amount: donationData.amount,
      donorName: donationData.donorName
    };

    const docRef = await addDoc(collection(db, 'participant_notifications'), notificationData);
    console.log('✅ Donation received notification created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating donation received notification:', error);
    throw error;
  }
}

/**
 * Create a service update notification for a participant
 */
export async function createServiceUpdateNotification(
  userId: string,
  serviceData: {
    serviceId: string;
    serviceName: string;
    message: string;
    priority?: 'low' | 'normal' | 'high';
  }
): Promise<string> {
  try {
    console.log('🏥 Creating service update notification for participant:', userId);
    
    const notificationData: Omit<ParticipantNotification, 'id'> = {
      userId,
      type: 'service_update',
      title: `Service Update: ${serviceData.serviceName}`,
      message: serviceData.message,
      priority: serviceData.priority || 'normal',
      isRead: false,
      createdAt: serverTimestamp() as Timestamp,
      serviceId: serviceData.serviceId,
      serviceName: serviceData.serviceName
    };

    const docRef = await addDoc(collection(db, 'participant_notifications'), notificationData);
    console.log('✅ Service update notification created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating service update notification:', error);
    throw error;
  }
}

/**
 * Create an appointment reminder notification for a participant
 */
export async function createAppointmentReminderNotification(
  userId: string,
  appointmentData: {
    serviceId: string;
    serviceName: string;
    appointmentDate: Date;
    message?: string;
  }
): Promise<string> {
  try {
    console.log('📅 Creating appointment reminder notification for participant:', userId);
    
    const defaultMessage = `Reminder: You have an appointment for ${appointmentData.serviceName} on ${appointmentData.appointmentDate.toLocaleDateString()}.`;
    
    const notificationData: Omit<ParticipantNotification, 'id'> = {
      userId,
      type: 'appointment_reminder',
      title: 'Appointment Reminder',
      message: appointmentData.message || defaultMessage,
      priority: 'high',
      isRead: false,
      createdAt: serverTimestamp() as Timestamp,
      serviceId: appointmentData.serviceId,
      serviceName: appointmentData.serviceName,
      appointmentDate: Timestamp.fromDate(appointmentData.appointmentDate)
    };

    const docRef = await addDoc(collection(db, 'participant_notifications'), notificationData);
    console.log('✅ Appointment reminder notification created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating appointment reminder notification:', error);
    throw error;
  }
}

/**
 * Create a goal update notification for a participant
 */
export async function createGoalUpdateNotification(
  userId: string,
  goalData: {
    goalId: string;
    message: string;
    priority?: 'low' | 'normal' | 'high';
  }
): Promise<string> {
  try {
    console.log('🎯 Creating goal update notification for participant:', userId);
    
    const notificationData: Omit<ParticipantNotification, 'id'> = {
      userId,
      type: 'goal_update',
      title: 'Goal Update',
      message: goalData.message,
      priority: goalData.priority || 'normal',
      isRead: false,
      createdAt: serverTimestamp() as Timestamp
    };

    const docRef = await addDoc(collection(db, 'participant_notifications'), notificationData);
    console.log('✅ Goal update notification created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating goal update notification:', error);
    throw error;
  }
}

/**
 * Create a system message notification for a participant
 */
export async function createParticipantSystemMessage(
  userId: string,
  messageData: {
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'high';
  }
): Promise<string> {
  try {
    console.log('📢 Creating system message for participant:', userId);
    
    const notificationData: Omit<ParticipantNotification, 'id'> = {
      userId,
      type: 'system_message',
      title: messageData.title,
      message: messageData.message,
      priority: messageData.priority || 'normal',
      isRead: false,
      createdAt: serverTimestamp() as Timestamp
    };

    const docRef = await addDoc(collection(db, 'participant_notifications'), notificationData);
    console.log('✅ System message created for participant:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating system message for participant:', error);
    throw error;
  }
}

/**
 * Get all notifications for a participant
 */
export async function getParticipantNotifications(
  userId: string,
  maxResults: number = 20
): Promise<ParticipantNotification[]> {
  try {
    console.log('🔍 Getting participant notifications for userId:', userId);
    
    const q = query(
      collection(db, 'participant_notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    const notifications: ParticipantNotification[] = [];

    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      } as ParticipantNotification);
    });

    console.log(`✅ Found ${notifications.length} participant notifications`);
    return notifications;
  } catch (error) {
    console.error('❌ Error getting participant notifications:', error);
    return [];
  }
}

/**
 * Get unread notification counts for a participant
 */
export async function getParticipantNotificationCounts(userId: string): Promise<ParticipantNotificationCounts> {
  try {
    console.log('📊 Getting participant notification counts for userId:', userId);
    
    // Get all notifications
    const allNotificationsQuery = query(
      collection(db, 'participant_notifications'),
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
    
    // Calculate dates for recent/upcoming checks
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    // Count recent donations (last 7 days)
    let recentDonations = 0;
    let upcomingAppointments = 0;
    
    allSnapshot.forEach(doc => {
      const data = doc.data();
      
      // Recent donations
      if (
        data.type === 'donation_received' &&
        data.createdAt &&
        data.createdAt.toDate() > sevenDaysAgo
      ) {
        recentDonations++;
      }
      
      // Upcoming appointments (next 7 days)
      if (
        data.type === 'appointment_reminder' &&
        data.appointmentDate &&
        data.appointmentDate.toDate() <= sevenDaysFromNow &&
        data.appointmentDate.toDate() > new Date()
      ) {
        upcomingAppointments++;
      }
    });
    
    const counts = {
      total,
      unread,
      recentDonations,
      upcomingAppointments
    };
    
    console.log('✅ Participant notification counts:', counts);
    return counts;
  } catch (error) {
    console.error('❌ Error getting participant notification counts:', error);
    return {
      total: 0,
      unread: 0,
      recentDonations: 0,
      upcomingAppointments: 0
    };
  }
}

/**
 * Mark a participant notification as read
 */
export async function markParticipantNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'participant_notifications', notificationId), {
      isRead: true,
      readAt: serverTimestamp()
    });
    console.log('✅ Participant notification marked as read:', notificationId);
    return true;
  } catch (error) {
    console.error('❌ Error marking participant notification as read:', error);
    return false;
  }
}

/**
 * Mark all participant notifications as read
 */
export async function markAllParticipantNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    console.log('📖 Marking all participant notifications as read for userId:', userId);
    
    const q = query(
      collection(db, 'participant_notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map(docSnapshot =>
      updateDoc(doc(db, 'participant_notifications', docSnapshot.id), {
        isRead: true,
        readAt: serverTimestamp()
      })
    );
    
    await Promise.all(updatePromises);
    console.log(`✅ Marked ${querySnapshot.size} notifications as read`);
    return true;
  } catch (error) {
    console.error('❌ Error marking all participant notifications as read:', error);
    return false;
  }
}

