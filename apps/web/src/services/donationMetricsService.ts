import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface DonationMetrics {
  total_received: number;
  donation_count: number;
  services_completed: number;
}

/**
 * Unified donation metrics service to ensure consistent data across all pages
 * FIXED: Now queries demo_donations collection for accurate beta testing metrics
 * Participant ID must be Firebase UID (e.g., dFJNlIh2g4R8vAvxvIvWZtwu8zw1)
 */
export const getDonationMetrics = async (participantIdOrSlug: string): Promise<DonationMetrics> => {
  try {
    console.log(`🔍 [DONATION-METRICS] Fetching donation data for: ${participantIdOrSlug}`);
    
    // Map slug to Firebase UID if needed (for backwards compatibility)
    let participantUid = participantIdOrSlug;
    if (participantIdOrSlug === 'michael-rodriguez' || participantIdOrSlug === 'demo-participant-001') {
      participantUid = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1'; // Michael's Firebase UID
      console.log(`🔄 [DONATION-METRICS] Mapped slug '${participantIdOrSlug}' to UID: ${participantUid}`);
    }
    
    // Query demo_donations collection with Firebase UID
    console.log(`🔍 [DONATION-METRICS] Querying demo_donations for participant: ${participantUid}`);
    const demoDonationsQuery = query(
      collection(db, 'demo_donations'),
      where('participant_id', '==', participantUid),
      where('status', '==', 'completed')
    );
    const demoDonationsSnapshot = await getDocs(demoDonationsQuery);
    console.log(`📊 [DONATION-METRICS] Found ${demoDonationsSnapshot.size} completed donations in demo_donations`);
    
    let total_received = 0;
    let donation_count = 0;
    
    // Process donations - sum up DIRECT amounts (80% of each donation)
    demoDonationsSnapshot.docs.forEach(doc => {
      const donationData = doc.data();
      const amount = donationData.amount || {};
      
      console.log(`💰 [DONATION-METRICS] Processing donation ${doc.id}:`, {
        participant_id: donationData.participant_id,
        amount: amount,
        breakdown: amount.breakdown
      });
      
      // Get DIRECT amount (80%) from breakdown, fallback to total if breakdown missing
      let donationValue = 0;
      if (amount.breakdown?.direct) {
        donationValue = amount.breakdown.direct; // Use 80% direct amount
      } else if (amount.total) {
        // Fallback: calculate 80% if breakdown missing
        donationValue = Math.round(amount.total * 0.80 * 100) / 100;
      }
      
      if (donationValue > 0) {
        total_received += donationValue;
        donation_count++;
        console.log(`✅ [DONATION-METRICS] Added $${donationValue} (direct amount), total now: $${total_received}`);
      }
    });
    
    console.log(`💰 [DONATION-METRICS] Final metrics for ${participantIdOrSlug}: $${total_received} from ${donation_count} donations`);
    
    return {
      total_received,
      donation_count,
      services_completed: 8 // Keep static for demo purposes
    };
    
  } catch (error) {
    console.error(`❌ Error fetching donation metrics for ${participantIdOrSlug}:`, error);
    return {
      total_received: 0,
      donation_count: 0,
      services_completed: 8
    };
  }
};
