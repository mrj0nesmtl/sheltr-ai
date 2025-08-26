import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Utility to create test donations for Old Brewery Mission
 * SESSION 13: Testing the scan-give donation connection
 */
export async function createTestDonationForOBM(amount: number = 50, donorName: string = 'Test Donor') {
  try {
    console.log(`💰 Creating test donation for Old Brewery Mission: $${amount}`);
    
    const donationData = {
      participant_id: 'michael-rodriguez',
      shelter_id: 'YDJCJnuLGMC9mWOWDSOa', // Old Brewery Mission tenant ID
      amount: {
        total: amount,
        currency: 'USD'
      },
      donor_info: {
        name: donorName,
        email: `${donorName.toLowerCase().replace(' ', '.')}@example.com`
      },
      status: 'completed',
      payment_data: {
        adyen_reference: `TEST-${Date.now()}`,
        status: 'completed'
      },
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      demo: true,
      source: 'scan-give-test'
    };
    
    const docRef = await addDoc(collection(db, 'demo_donations'), donationData);
    console.log(`✅ Test donation created with ID: ${docRef.id}`);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating test donation:', error);
    throw error;
  }
}

/**
 * Quick function to add test donations for demo purposes
 */
export async function addSampleDonationsForOBM() {
  try {
    console.log('🎯 Adding sample donations for Old Brewery Mission...');
    
    const donations = [
      { amount: 25, donor: 'Sarah Johnson' },
      { amount: 100, donor: 'Mike Chen' },
      { amount: 50, donor: 'Emily Davis' }
    ];
    
    const results = [];
    for (const donation of donations) {
      const id = await createTestDonationForOBM(donation.amount, donation.donor);
      results.push(id);
    }
    
    console.log(`✅ Created ${results.length} test donations for Old Brewery Mission`);
    return results;
  } catch (error) {
    console.error('❌ Error adding sample donations:', error);
    throw error;
  }
}

// Add to window object for easy console access
if (typeof window !== 'undefined') {
  (window as any).createTestDonationForOBM = createTestDonationForOBM;
  (window as any).addSampleDonationsForOBM = addSampleDonationsForOBM;
}
