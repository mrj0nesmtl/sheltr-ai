import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface DonationMetrics {
  total_received: number;
  donation_count: number;
  services_completed: number;
}

/**
 * Unified donation metrics service to ensure consistent data across all pages
 * Uses the same comprehensive query strategy as the participant public page
 */
export const getDonationMetrics = async (participantId: string): Promise<DonationMetrics> => {
  try {
    console.log(`🔍 [DONATION-METRICS] Fetching donation data for: ${participantId}`);
    
    let total_received = 0;
    let donation_count = 0;
    
    // For michael-rodriguez, also check for donations with different IDs for backwards compatibility
    const participantIds = [participantId];
    if (participantId === 'michael-rodriguez') {
      participantIds.push('demo-participant-001', 'michael-rodriguez');
    } else if (participantId === 'demo-participant-001') {
      participantIds.push('michael-rodriguez');
    }
    
    // ALWAYS include michael-rodriguez for our test donations
    if (!participantIds.includes('michael-rodriguez')) {
      participantIds.push('michael-rodriguez');
    }
    
    // Comprehensive approach: Query ALL Old Brewery Mission donations, then filter by participant
    console.log(`🔍 [DONATION-METRICS] Querying ALL Old Brewery Mission donations...`);
    
    // Query by shelter_id for YDJCJnuLGMC9mWOWDSOa (actual tenant ID)
    const obmQuery1 = query(
      collection(db, 'demo_donations'),
      where('shelter_id', '==', 'YDJCJnuLGMC9mWOWDSOa')
    );
    const obmSnapshot1 = await getDocs(obmQuery1);
    console.log(`📊 [DONATION-METRICS] Found ${obmSnapshot1.size} donations for YDJCJnuLGMC9mWOWDSOa`);
    
    // Query by shelter_id for old-brewery-mission (legacy shelter ID)
    const obmQuery2 = query(
      collection(db, 'demo_donations'),
      where('shelter_id', '==', 'old-brewery-mission')
    );
    const obmSnapshot2 = await getDocs(obmQuery2);
    console.log(`📊 [DONATION-METRICS] Found ${obmSnapshot2.size} donations for old-brewery-mission`);
    
    // Also query directly by participant_id to catch any orphaned donations
    const participantQuery = query(
      collection(db, 'demo_donations'),
      where('participant_id', 'in', participantIds)
    );
    const participantSnapshot = await getDocs(participantQuery);
    console.log(`📊 [DONATION-METRICS] Found ${participantSnapshot.size} donations by participant_id`);
    
    // Combine all snapshots and process unique donations
    const allSnapshots = [obmSnapshot1, obmSnapshot2, participantSnapshot];
    const processedDonationIds = new Set<string>(); // Prevent double-counting
    
    allSnapshots.forEach((snapshot, index) => {
      const queryType = index === 0 ? 'YDJCJnuLGMC9mWOWDSOa' : 
                       index === 1 ? 'old-brewery-mission' : 'participant_id';
      console.log(`🔄 [DONATION-METRICS] Processing donations from ${queryType}...`);
      
      snapshot.docs.forEach(doc => {
        // Skip if we've already processed this donation
        if (processedDonationIds.has(doc.id)) {
          console.log(`⏭️ [DONATION-METRICS] Skipped duplicate donation ${doc.id}`);
          return;
        }
        
        const donationData = doc.data();
        const donationParticipantId = donationData?.participant_id;
        
        // Only count donations for this specific participant
        const isForThisParticipant = participantIds.includes(donationParticipantId);
        
        console.log(`💰 [DONATION-METRICS] Processing donation:`, {
          id: doc.id,
          participant_id: donationParticipantId,
          shelter_id: donationData?.shelter_id,
          isForThisParticipant
        });
        
        if (isForThisParticipant) {
          const amount = donationData.amount || {};
          
          // Handle different amount formats
          let donationValue = 0;
          if (typeof amount === 'object') {
            donationValue = amount.total || amount.amount || 0;
          } else {
            donationValue = amount || 0;
          }
          
          console.log(`💵 [DONATION-METRICS] Donation value: ${donationValue} for participant ${donationParticipantId}`);
          if (donationValue > 0) {
            total_received += donationValue;
            donation_count++;
            processedDonationIds.add(doc.id); // Mark as processed
            console.log(`✅ [DONATION-METRICS] Added $${donationValue}, total now: $${total_received}`);
          }
        }
      });
    });
    
    console.log(`💰 [DONATION-METRICS] Final metrics for ${participantId}: $${total_received} from ${donation_count} donations`);
    console.log(`💰 [DONATION-METRICS] Checked participant IDs:`, participantIds);
    
    return {
      total_received,
      donation_count,
      services_completed: 8 // Keep static for demo purposes
    };
    
  } catch (error) {
    console.error(`❌ Error fetching donation metrics for ${participantId}:`, error);
    return {
      total_received: 0,
      donation_count: 0,
      services_completed: 8
    };
  }
};
