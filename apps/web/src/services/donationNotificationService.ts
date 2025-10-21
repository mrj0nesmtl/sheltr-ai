/**
 * SHELTR Donation Notification Service
 * 
 * Centralized service for creating donation-related notifications
 * for donors, participants, AND shelter admins
 * 
 * Version: 2.57.2
 * Date: October 21, 2025
 */

import { 
  createDonorNotification, 
  createParticipantNotification,
  createShelterNotification 
} from './unifiedNotificationService';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Create notifications for a completed donation
 * Creates notifications for donor, participant, AND shelter admins
 */
export async function notifyDonationComplete(data: {
  donationId: string;
  donorId: string;
  donorName: string;
  participantId: string;
  participantName: string;
  totalAmount: number;
  directAmount: number;
  housingAmount: number;
  shelterAmount: number;
}): Promise<{ donorNotificationId: string; participantNotificationId: string; shelterNotificationIds?: string[] }> {
  console.log('🔔 Creating donation notifications:', {
    donor: data.donorName,
    participant: data.participantName,
    amount: data.totalAmount
  });

  try {
    // Create notification for DONOR
    const donorNotificationId = await createDonorNotification({
      userId: data.donorId,
      type: 'donation_confirmation',
      title: 'Donation Confirmed! 🎉',
      message: `Your $${data.totalAmount.toFixed(2)} donation to ${data.participantName} has been confirmed. Thank you for your support!`,
      priority: 'high',
      category: 'transaction',
      metadata: {
        donation_id: data.donationId,
        amount: data.totalAmount,
        participant_name: data.participantName,
        direct_amount: data.directAmount,
        housing_amount: data.housingAmount,
        shelter_amount: data.shelterAmount
      }
    });

    console.log('✅ Donor notification created:', donorNotificationId);

    // Create notification for PARTICIPANT
    const participantNotificationId = await createParticipantNotification({
      userId: data.participantId,
      type: 'donation_received',
      title: 'New Donation Received! 💰',
      message: `You received a $${data.totalAmount.toFixed(2)} donation from ${data.donorName}. $${data.directAmount.toFixed(2)} added to your account.`,
      priority: 'high',
      category: 'donation',
      metadata: {
        donation_id: data.donationId,
        donor_name: data.donorName,
        amount: data.totalAmount,
        direct_amount: data.directAmount,
        housing_amount: data.housingAmount
      }
    });

    console.log('✅ Participant notification created:', participantNotificationId);

    // Get participant's shelter_id to notify shelter admins
    let shelterNotificationIds: string[] = [];
    try {
      const participantDoc = await getDoc(doc(db, 'users', data.participantId));
      const participantData = participantDoc.data();
      const shelterId = participantData?.shelter_id;

      if (shelterId) {
        console.log(`🏠 Found shelter_id for participant: ${shelterId}`);
        
        // Find all admins for this shelter
        const adminsQuery = query(
          collection(db, 'users'),
          where('shelter_id', '==', shelterId),
          where('role', '==', 'admin')
        );
        
        const adminsSnapshot = await getDocs(adminsQuery);
        console.log(`👥 Found ${adminsSnapshot.size} shelter admin(s) for shelter: ${shelterId}`);

        // Create notification for each shelter admin
        for (const adminDoc of adminsSnapshot.docs) {
          const adminId = adminDoc.id;
          const shelterNotificationId = await createShelterNotification({
            recipient_id: adminId,
            type: 'donation_alert',
            title: 'New Donation to Your Shelter! 💰',
            message: `${data.participantName} received a $${data.totalAmount.toFixed(2)} donation. Your shelter receives $${data.shelterAmount.toFixed(2)} in operations support.`,
            priority: 'high',
            category: 'donation',
            data: {
              donation_id: data.donationId,
              donor_name: data.donorName,
              participant_id: data.participantId,
              participant_name: data.participantName,
              total_amount: data.totalAmount,
              shelter_amount: data.shelterAmount
            }
          });
          
          shelterNotificationIds.push(shelterNotificationId);
          console.log(`✅ Shelter admin notification created for ${adminId}:`, shelterNotificationId);
        }
      } else {
        console.warn(`⚠️ No shelter_id found for participant: ${data.participantId}`);
      }
    } catch (shelterError) {
      console.error('❌ Error creating shelter admin notifications (non-blocking):', shelterError);
      // Don't fail the entire function if shelter notifications fail
    }

    return {
      donorNotificationId,
      participantNotificationId,
      shelterNotificationIds: shelterNotificationIds.length > 0 ? shelterNotificationIds : undefined
    };
  } catch (error) {
    console.error('❌ Error creating donation notifications:', error);
    throw error;
  }
}

/**
 * Create notification for donation receipt
 */
export async function notifyDonationReceipt(data: {
  donorId: string;
  donationId: string;
  amount: number;
  receiptUrl: string;
  transactionId: string;
}): Promise<string> {
  return await createDonorNotification({
    userId: data.donorId,
    type: 'donation_receipt',
    title: 'Donation Receipt Ready 📄',
    message: `Your donation receipt for $${data.amount.toFixed(2)} is now available for download.`,
    priority: 'normal',
    category: 'transaction',
    metadata: {
      donation_id: data.donationId,
      amount: data.amount,
      receipt_url: data.receiptUrl,
      transaction_id: data.transactionId
    }
  });
}

/**
 * Create notification for tax summary
 */
export async function notifyTaxSummary(data: {
  donorId: string;
  taxYear: string;
  totalAmount: number;
  receiptUrl: string;
}): Promise<string> {
  return await createDonorNotification({
    userId: data.donorId,
    type: 'tax_summary',
    title: `${data.taxYear} Tax Summary Ready 📊`,
    message: `Your ${data.taxYear} donation tax summary is ready. Total: $${data.totalAmount.toFixed(2)}`,
    priority: 'high',
    category: 'tax',
    metadata: {
      tax_year: data.taxYear,
      amount: data.totalAmount,
      receipt_url: data.receiptUrl
    }
  });
}

/**
 * Create notification for participant service milestone
 */
export async function notifyServiceMilestone(data: {
  participantId: string;
  serviceType: string;
  milestone: string;
  message: string;
}): Promise<string> {
  return await createParticipantNotification({
    userId: data.participantId,
    type: 'service_update',
    title: `Service Milestone: ${data.milestone} 🎯`,
    message: data.message,
    priority: 'normal',
    category: 'service',
    metadata: {
      service_type: data.serviceType,
      milestone: data.milestone
    }
  });
}

/**
 * Create notification for participant goal achievement
 */
export async function notifyGoalAchievement(data: {
  participantId: string;
  goalTitle: string;
  goalId: string;
}): Promise<string> {
  return await createParticipantNotification({
    userId: data.participantId,
    type: 'goal_achieved',
    title: 'Goal Achieved! 🏆',
    message: `Congratulations! You've achieved your goal: "${data.goalTitle}"`,
    priority: 'high',
    category: 'milestone',
    metadata: {
      goal_id: data.goalId,
      goal_title: data.goalTitle
    }
  });
}

