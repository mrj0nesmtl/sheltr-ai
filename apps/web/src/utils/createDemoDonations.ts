// Utility to create demo donation data for testing scan-give flow
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DemoDonation {
  donor_id: string;
  recipient_id: string;
  amount: number;
  currency: 'CAD';
  status: 'completed' | 'pending' | 'failed';
  donation_type: 'qr_scan' | 'direct' | 'platform';
  payment_method: 'demo_payment';
  donor_name?: string;
  recipient_name?: string;
  shelter_id?: string;
  message?: string;
}

/**
 * Create demo donation data for testing
 * - Jane Supporter (donor) → Michael Rodriguez (participant)
 * - Various amounts and dates for realistic testing
 */
export async function createDemoDonationData() {
  console.log('🎁 Creating demo donation data...');
  
  // User IDs
  const JANE_SUPPORTER_ID = 'rWM6e8zfa5UoRVe5tHe6cldQkh32'; // Jane Supporter (donor)
  const MICHAEL_RODRIGUEZ_ID = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1'; // Michael Rodriguez (participant)
  const SHELTER_ID = 'old-brewery-mission';
  
  try {
    // Demo donations to create
    const demoDonations: Omit<DemoDonation, 'created_at'>[] = [
      {
        donor_id: JANE_SUPPORTER_ID,
        recipient_id: MICHAEL_RODRIGUEZ_ID,
        amount: 25.00,
        currency: 'CAD',
        status: 'completed',
        donation_type: 'qr_scan',
        payment_method: 'demo_payment',
        donor_name: 'Jane Supporter',
        recipient_name: 'Michael Rodriguez',
        shelter_id: SHELTER_ID,
        message: 'Hope this helps! Stay strong. 💪'
      },
      {
        donor_id: JANE_SUPPORTER_ID,
        recipient_id: MICHAEL_RODRIGUEZ_ID,
        amount: 50.00,
        currency: 'CAD',
        status: 'completed',
        donation_type: 'qr_scan',
        payment_method: 'demo_payment',
        donor_name: 'Jane Supporter',
        recipient_name: 'Michael Rodriguez',
        shelter_id: SHELTER_ID,
        message: 'Thinking of you during the holidays'
      },
      {
        donor_id: 'anonymous',
        recipient_id: MICHAEL_RODRIGUEZ_ID,
        amount: 15.00,
        currency: 'CAD',
        status: 'completed',
        donation_type: 'qr_scan',
        payment_method: 'demo_payment',
        donor_name: 'Anonymous Supporter',
        recipient_name: 'Michael Rodriguez',
        shelter_id: SHELTER_ID,
        message: 'Someone believes in you!'
      },
      {
        donor_id: JANE_SUPPORTER_ID,
        recipient_id: MICHAEL_RODRIGUEZ_ID,
        amount: 35.00,
        currency: 'CAD',
        status: 'completed',
        donation_type: 'direct',
        payment_method: 'demo_payment',
        donor_name: 'Jane Supporter',
        recipient_name: 'Michael Rodriguez',
        shelter_id: SHELTER_ID,
        message: 'Keep working towards your goals!'
      }
    ];
    
    console.log(`📝 Creating ${demoDonations.length} demo donations...`);
    
    const donationIds: string[] = [];
    
    // Create each donation
    for (let i = 0; i < demoDonations.length; i++) {
      const donationData = {
        ...demoDonations[i],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        // Add some time variation (last 30 days)
        demo_date: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000))
      };
      
      const docRef = await addDoc(collection(db, 'demo_donations'), donationData);
      donationIds.push(docRef.id);
      
      console.log(`✅ Created donation ${i + 1}: $${donationData.amount} from ${donationData.donor_name}`);
    }
    
    // Update Michael Rodriguez's total donations
    console.log('📊 Updating Michael Rodriguez donation totals...');
    const totalAmount = demoDonations.reduce((sum, donation) => sum + donation.amount, 0);
    const donationCount = demoDonations.length;
    
    const michaelRef = doc(db, 'users', MICHAEL_RODRIGUEZ_ID);
    await updateDoc(michaelRef, {
      'participantProfile.totalDonationsReceived': totalAmount,
      'participantProfile.donationCount': donationCount,
      'participantProfile.lastDonationReceived': serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    // Update Jane Supporter's donation history
    console.log('📊 Updating Jane Supporter donation totals...');
    const janeRef = doc(db, 'users', JANE_SUPPORTER_ID);
    const janeDonations = demoDonations.filter(d => d.donor_id === JANE_SUPPORTER_ID);
    const janeTotalAmount = janeDonations.reduce((sum, donation) => sum + donation.amount, 0);
    
    await updateDoc(janeRef, {
      'donorProfile.totalDonated': janeTotalAmount + 375, // Add to existing total
      'donorProfile.donationCount': janeDonations.length + 5, // Add to existing count
      'donorProfile.lastDonation': serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    console.log('🎉 SUCCESS: Demo donation data created!');
    console.log(`📈 Total donations: ${donationCount}`);
    console.log(`💰 Total amount: $${totalAmount} CAD`);
    console.log(`🎯 Michael's total: $${totalAmount}`);
    console.log(`🎯 Jane's new total: $${janeTotalAmount + 375}`);
    console.log(`📋 Donation IDs:`, donationIds);
    
    return {
      success: true,
      donationIds,
      totalAmount,
      donationCount,
      message: 'Demo donations created successfully'
    };
    
  } catch (error) {
    console.error('❌ Error creating demo donations:', error);
    return {
      success: false,
      message: `Error: ${error}`
    };
  }
}

// Export for console usage
if (typeof window !== 'undefined') {
  (window as any).createDemoDonationData = createDemoDonationData;
}
