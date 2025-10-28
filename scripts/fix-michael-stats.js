const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fixMichaelStats() {
  console.log('🔧 Fixing Michael Rodriguez stats...\n');
  
  const michaelId = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1';
  
  // Query donations with correct UID
  const donationsSnapshot = await db.collection('demo_donations')
    .where('participant_id', '==', michaelId)
    .where('status', '==', 'completed')
    .get();
  
  console.log(`Found ${donationsSnapshot.size} donations for Michael with correct UID`);
  
  let totalReceived = 0;
  let housingFundTotal = 0;
  let donationCount = 0;
  
  donationsSnapshot.forEach(doc => {
    const data = doc.data();
    const amount = data.amount?.total || 0;
    const housing = data.amount?.breakdown?.housing || (amount * 0.15);
    
    totalReceived += amount;
    housingFundTotal += housing;
    donationCount++;
    
    console.log(`  - Donation: $${amount} (Housing: $${housing})`);
  });
  
  console.log(`\n📊 Calculated totals:`);
  console.log(`  Total Received: $${totalReceived}`);
  console.log(`  Housing Fund: $${housingFundTotal}`);
  console.log(`  Donation Count: ${donationCount}`);
  
  // Update Michael's user document
  const michaelRef = db.collection('users').doc(michaelId);
  await michaelRef.update({
    total_received: totalReceived,
    housing_fund_balance: housingFundTotal,
    donation_count: donationCount,
    updated_at: admin.firestore.Timestamp.now()
  });
  
  console.log(`\n✅ Updated Michael's stats successfully!`);
  
  process.exit(0);
}

fixMichaelStats().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

