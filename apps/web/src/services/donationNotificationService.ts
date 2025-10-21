/**
 * SHELTR Donation Notification Service
 * 
 * Centralized service for creating donation-related notifications
 * for both donors and participants
 * 
 * Version: 2.57.1
 * Date: October 21, 2025
 */

import { createDonorNotification, createParticipantNotification } from './unifiedNotificationService';

/**
 * Create notifications for a completed donation
 * Creates notifications for BOTH donor and participant
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
}): Promise<{ donorNotificationId: string; participantNotificationId: string }> {
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

    return {
      donorNotificationId,
      participantNotificationId
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

