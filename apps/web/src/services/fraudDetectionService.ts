import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createFraudAlertNotification } from '@/services/notificationService';

export interface FraudAlert {
  id?: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  details: string;
  timestamp: string;
  status: 'investigating' | 'resolved' | 'auto_blocked';
  metadata?: {
    user_id?: string;
    transaction_id?: string;
    ip_address?: string;
    amount?: number;
    pattern_type?: string;
  };
}

/**
 * Create a new fraud alert and automatically notify all administrators
 */
export const createFraudAlert = async (alertData: Omit<FraudAlert, 'id' | 'timestamp'>): Promise<string> => {
  try {
    console.log('🚨 [FRAUD DETECTION] Creating new fraud alert...', alertData);

    // Create timestamp
    const timestamp = new Date().toLocaleString();
    
    // Prepare the alert data for Firestore
    const fraudAlertForFirestore = {
      ...alertData,
      timestamp,
      created_at: serverTimestamp()
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'fraud_alerts'), fraudAlertForFirestore);
    const alertId = docRef.id;
    
    console.log(`✅ [FRAUD DETECTION] Fraud alert created with ID: ${alertId}`);

    // Create the complete alert object for notification
    const completeAlert: FraudAlert = {
      id: alertId,
      ...alertData,
      timestamp
    };

    // Automatically send notification to all administrators
    try {
      const notificationId = await createFraudAlertNotification({
        id: alertId,
        level: completeAlert.level,
        description: completeAlert.description,
        details: completeAlert.details,
        timestamp: completeAlert.timestamp,
        status: completeAlert.status
      });
      console.log(`🔔 [FRAUD DETECTION] Admin notification sent with ID: ${notificationId}`);
    } catch (notificationError) {
      console.error('❌ [FRAUD DETECTION] Failed to send admin notification:', notificationError);
      // Don't fail the alert creation if notification fails
    }

    return alertId;
  } catch (error) {
    console.error('❌ [FRAUD DETECTION] Error creating fraud alert:', error);
    throw error;
  }
};

/**
 * Simulate fraud detection patterns (for demo/testing purposes)
 */
export const simulateFraudDetection = {
  /**
   * Detect unusual donation patterns
   */
  checkDonationVelocity: async (userId: string, amount: number, _timeWindow: number = 5): Promise<void> => {
    // In a real system, this would check donation history
    // For demo purposes, we'll create an alert if amount > $400
    if (amount > 400) {
      await createFraudAlert({
        level: 'high',
        description: 'Unusual donation pattern detected',
        details: `User attempting $${amount} donation - exceeds velocity threshold`,
        status: 'investigating',
        metadata: {
          user_id: userId,
          amount: amount,
          pattern_type: 'velocity_check'
        }
      });
    }
  },

  /**
   * Detect multiple donations from same IP
   */
  checkIPVelocity: async (ipAddress: string, donationCount: number): Promise<void> => {
    if (donationCount > 3) {
      await createFraudAlert({
        level: 'medium',
        description: 'Velocity check triggered',
        details: `Same IP address (${ipAddress}) making ${donationCount} donations across multiple participants`,
        status: 'investigating',
        metadata: {
          ip_address: ipAddress,
          pattern_type: 'ip_velocity'
        }
      });
    }
  },

  /**
   * Detect card verification failures
   */
  checkCardVerification: async (transactionId: string, failureReason: string): Promise<void> => {
    await createFraudAlert({
      level: 'low',
      description: 'Card verification failed',
      details: `${failureReason} on transaction ${transactionId}`,
      status: 'auto_blocked',
      metadata: {
        transaction_id: transactionId,
        pattern_type: 'card_verification'
      }
    });
  },

  /**
   * Detect suspicious user behavior
   */
  checkSuspiciousActivity: async (userId: string, activityType: string, details: string): Promise<void> => {
    await createFraudAlert({
      level: 'medium',
      description: `Suspicious ${activityType} detected`,
      details: details,
      status: 'investigating',
      metadata: {
        user_id: userId,
        pattern_type: activityType
      }
    });
  }
};

/**
 * Test function to create a demo fraud alert (for testing notifications)
 */
export const createTestFraudAlert = async (): Promise<string> => {
  console.log('🧪 [FRAUD DETECTION] Creating test fraud alert for notification testing...');
  
  return await createFraudAlert({
    level: 'high',
    description: '[TEST] Suspicious donation pattern detected',
    details: 'Test alert: Multiple large donations from new account - automatically generated for testing admin notifications',
    status: 'investigating',
    metadata: {
      user_id: 'test_user_123',
      amount: 500,
      pattern_type: 'test_alert'
    }
  });
};

export const fraudDetectionService = {
  createFraudAlert,
  simulateFraudDetection,
  createTestFraudAlert
};
