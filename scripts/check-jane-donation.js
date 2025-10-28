const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function findDonation() {
  console.log('🔍 Searching for Jane Supporter donation to Michael Rodriguez...\n');
  
  // Check demo_donations collection
  console.log('📂 Checking demo_donations collection:');
  const demoSnapshot = await db.collection('demo_donations')
    .orderBy('created_at', 'desc')
    .limit(5)
    .get();
  
  console.log(`Found ${demoSnapshot.size} recent donations in demo_donations:`);
  demoSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- ID: ${doc.id}`);
    console.log(`  Donor: ${data.donor_name || data.donor_id}`);
    console.log(`  Participant: ${data.participant_name || data.participant_id}`);
    console.log(`  Amount: $${data.total_amount || data.amount}`);
    console.log(`  Status: ${data.status}`);
    console.log(`  Created: ${data.created_at?.toDate ? data.created_at.toDate() : 'N/A'}`);
    console.log('');
  });
  
  // Check tenants/.../donations collection
  console.log('📂 Checking tenants/YDJCJnuLGMC9mWOWDSOa/donations collection:');
  const tenantSnapshot = await db.collection('tenants/YDJCJnuLGMC9mWOWDSOa/donations')
    .orderBy('created_at', 'desc')
    .limit(5)
    .get();
  
  console.log(`Found ${tenantSnapshot.size} recent donations in tenant collection:`);
  tenantSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- ID: ${doc.id}`);
    console.log(`  Donor: ${data.donor_name || data.donor_id}`);
    console.log(`  Participant: ${data.participant_name || data.participant_id}`);
    console.log(`  Amount: $${data.total_amount || data.amount}`);
    console.log(`  Status: ${data.status}`);
    console.log(`  Created: ${data.created_at?.toDate ? data.created_at.toDate() : 'N/A'}`);
    console.log('');
  });
  
  // Get Jane's user ID
  console.log('👤 Finding Jane Supporter user ID:');
  const janeSnapshot = await db.collection('users')
    .where('email', '==', 'donor@example.com')
    .limit(1)
    .get();
  
  if (!janeSnapshot.empty) {
    const janeDoc = janeSnapshot.docs[0];
    console.log(`Jane's ID: ${janeDoc.id}`);
    console.log(`Jane's name: ${janeDoc.data().displayName}`);
    console.log(`Jane's stats: totalDonated = $${janeDoc.data().totalDonated || 0}`);
  } else {
    console.log('❌ Jane Supporter not found!');
  }
  
  // Get Michael's user ID
  console.log('\n👤 Finding Michael Rodriguez user ID:');
  const michaelSnapshot = await db.collection('users')
    .where('displayName', '==', 'Michael Rodriguez')
    .limit(1)
    .get();
  
  if (!michaelSnapshot.empty) {
    const michaelDoc = michaelSnapshot.docs[0];
    console.log(`Michael's ID: ${michaelDoc.id}`);
    console.log(`Michael's stats: totalReceived = $${michaelDoc.data().totalReceived || 0}`);
  } else {
    console.log('❌ Michael Rodriguez not found!');
  }
  
  process.exit(0);
}

findDonation().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

