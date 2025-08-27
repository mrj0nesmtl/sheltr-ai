import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Utility to create donations for Old Brewery Mission
 * 
 * DONATION TRACKING LOGIC:
 * - If donorId provided: Tracked donation to user account
 * - If no donorId: Anonymous donation (donor_id: 'anonymous')
 * 
 * SESSION 13: Scan-give donation connection with user tracking + anonymous support
 */
export async function createTestDonationForOBM(
  amount: number = 50, 
  donorName: string = 'Test Donor',
  donorId?: string,
  donorEmail?: string
) {
  try {
    console.log(`💰 Creating test donation for Old Brewery Mission: $${amount} (${donorId ? 'User ID: ' + donorId : 'Anonymous'})`);
    
    const donationData = {
      participant_id: 'michael-rodriguez',
      participant_name: 'Michael Rodriguez',
      shelter_id: 'YDJCJnuLGMC9mWOWDSOa', // Old Brewery Mission tenant ID
      shelter_name: 'Old Brewery Mission',
      amount: {
        total: amount,
        currency: 'USD'
      },
      donor_id: donorId || 'anonymous', // Track user ID if provided, otherwise anonymous
      donor_info: {
        name: donorId ? donorName : 'Anonymous Donor',
        email: donorId ? (donorEmail || `${donorName.toLowerCase().replace(/\s+/g, '.')}@example.com`) : 'anonymous@sheltr.ai'
      },
      status: 'completed',
      payment_data: {
        adyen_reference: `TEST-${Date.now()}`,
        status: 'completed'
      },
      type: 'one-time',
      purpose: 'General support',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      demo: true,
      source: donorId ? 'scan-give-logged-in' : 'scan-give-anonymous',
      anonymous: !donorId, // Mark as anonymous if no donor ID
      public: true // All scan-give donations are public
    };
    
    const docRef = await addDoc(collection(db, 'demo_donations'), donationData);
    console.log(`✅ Test donation created with ID: ${docRef.id}`, donorId ? `for user ${donorId}` : '(anonymous)');
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating test donation:', error);
    throw error;
  }
}

/**
 * Create a tracked donation for Jane Supporter (logged-in user)
 */
export async function createJaneDonation(amount: number = 100) {
  try {
    console.log(`👩 Creating tracked donation for Jane Supporter: $${amount}`);
    
    // Use Jane's Firebase Auth UID (you'll need to get this from the auth context)
    // For now, using a placeholder - this should be the actual user.uid from auth
    const janeUserId = 'jane-supporter-uid'; // This should come from Firebase Auth
    
    return await createTestDonationForOBM(
      amount,
      'Jane Supporter',
      janeUserId,
      'jane.supporter@example.com'
    );
  } catch (error) {
    console.error('❌ Error creating Jane donation:', error);
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
