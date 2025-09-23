// Add Test Donation Utility - Run in Browser Console
// Open browser console and copy-paste this entire script

console.log('🧪 Loading Test Donation Utility...');

async function addTestDonationToOBM() {
  try {
    console.log('🔥 Starting test donation creation...');
    
    // Import Firebase functions dynamically
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
    const { db } = await import('/src/lib/firebase.js');
    
    const donationData = {
      participant_id: 'michael-rodriguez',
      shelter_id: 'YDJCJnuLGMC9mWOWDSOa', // Old Brewery Mission tenant ID
      recipient_id: 'YDJCJnuLGMC9mWOWDSOa', // Ensure both fields for compatibility
      amount: { 
        total: 100, 
        currency: 'USD' 
      },
      donor_info: { 
        name: 'Console Test User', 
        email: 'test.user@console.com' 
      },
      status: 'completed',
      payment_data: { 
        adyen_reference: `CONSOLE-TEST-${Date.now()}`, 
        status: 'completed' 
      },
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      demo: true,
      source: 'console-test-utility'
    };
    
    console.log('📝 Creating donation in tenant collection...');
    const docRef = await addDoc(collection(db, 'tenants/YDJCJnuLGMC9mWOWDSOa/donations'), donationData);
    console.log('✅ Tenant donation created with ID:', docRef.id);
    
    console.log('🎉 SUCCESS! Test donation created in proper tenant structure!');
    console.log('🔄 Now refresh your dashboard pages to see the $100 donation appear!');
    
    return { tenantId: docRef.id };
    
  } catch (error) {
    console.error('❌ Error creating test donations:', error);
    throw error;
  }
}

// Auto-execute
console.log('🚀 Ready to add test donation! Executing now...');
addTestDonationToOBM()
  .then(result => {
    console.log('🎉 All done!', result);
    alert('✅ Test donation added successfully! Refresh your dashboards to see the $100 donation.');
  })
  .catch(error => {
    console.error('💥 Failed:', error);
    alert(`❌ Failed to add test donation: ${error.message}`);
  });
