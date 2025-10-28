/**
 * Check Jane Supporter's donation data across all collections
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../apps/api/service-account-key.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkJaneDonations() {
  console.log('🔍 CHECKING JANE SUPPORTER DONATION DATA\n');
  console.log('================================================================================\n');
  
  const janeEmail = 'donor@example.com';
  const janeUID = 'rWM6e8zfa5UoRVe5tHe6cldQkh32';
  
  try {
    // 1. Check user document
    console.log('1️⃣ Checking users collection:\n');
    const userDoc = await db.collection('users').doc(janeUID).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log(`   ✅ User Document Found:`);
      console.log(`      Name: ${userData.displayName || userData.name}`);
      console.log(`      Email: ${userData.email}`);
      console.log(`      Role: ${userData.role}`);
      console.log(`      Total Donated (if tracked): ${userData.totalDonated || 'Not set'}`);
      console.log(`      Donation Count (if tracked): ${userData.donationCount || 'Not set'}\n`);
    } else {
      console.log(`   ❌ No user document found\n`);
    }
    
    // 2. Check demo_donations collection
    console.log('2️⃣ Checking demo_donations collection:\n');
    const demoDonationsQuery = await db.collection('demo_donations').get();
    const janeDemoDonations = [];
    
    demoDonationsQuery.forEach(doc => {
      const donation = doc.data();
      const donorInfo = donation.donor_info || {};
      if (donorInfo.email === janeEmail || donorInfo.donor_id === janeUID) {
        janeDemoDonations.push({ id: doc.id, ...donation });
      }
    });
    
    if (janeDemoDonations.length > 0) {
      console.log(`   ✅ Found ${janeDemoDonations.length} demo donations:\n`);
      janeDemoDonations.forEach((donation, idx) => {
        console.log(`   Donation ${idx + 1}:`);
        console.log(`      ID: ${donation.id}`);
        console.log(`      Amount: $${donation.amount?.total || 'Unknown'}`);
        console.log(`      Status: ${donation.status}`);
        console.log(`      Participant: ${donation.participant_id}`);
        console.log(`      Created: ${donation.created_at?.toDate?.() || donation.created_at || 'Unknown'}\n`);
      });
    } else {
      console.log(`   ❌ No demo donations found for Jane\n`);
    }
    
    // 3. Check tenants/YDJCJnuLGMC9mWOWDSOa/donations
    console.log('3️⃣ Checking tenants/YDJCJnuLGMC9mWOWDSOa/donations:\n');
    try {
      const tenantDonationsQuery = await db.collection('tenants/YDJCJnuLGMC9mWOWDSOa/donations')
        .where('donor_id', '==', janeUID)
        .get();
      
      if (!tenantDonationsQuery.empty) {
        console.log(`   ✅ Found ${tenantDonationsQuery.size} tenant donations:\n`);
        tenantDonationsQuery.forEach((doc, idx) => {
          const donation = doc.data();
          console.log(`   Donation ${idx + 1}:`);
          console.log(`      ID: ${doc.id}`);
          console.log(`      Amount: $${donation.amount?.total || donation.amount || 'Unknown'}`);
          console.log(`      Shelter: ${donation.shelter_name || 'Unknown'}`);
          console.log(`      Status: ${donation.status}\n`);
        });
      } else {
        console.log(`   ❌ No tenant donations found for Jane\n`);
      }
    } catch (error) {
      console.log(`   ⚠️  Could not query tenant donations: ${error.message}\n`);
    }
    
    // 4. Check global donations collection
    console.log('4️⃣ Checking global donations collection:\n');
    const globalDonationsQuery = await db.collection('donations')
      .where('donor_id', '==', janeUID)
      .get();
    
    if (!globalDonationsQuery.empty) {
      console.log(`   ✅ Found ${globalDonationsQuery.size} global donations:\n`);
      globalDonationsQuery.forEach((doc, idx) => {
        const donation = doc.data();
        console.log(`   Donation ${idx + 1}:`);
        console.log(`      ID: ${doc.id}`);
        console.log(`      Amount: $${donation.amount || 'Unknown'}`);
        console.log(`      Status: ${donation.status}\n`);
      });
    } else {
      console.log(`   ❌ No global donations found for Jane\n`);
    }
    
    console.log('================================================================================\n');
    console.log('📊 SUMMARY:\n');
    console.log(`   Demo Donations: ${janeDemoDonations.length}`);
    console.log(`   Total Amount: $${janeDemoDonations.reduce((sum, d) => sum + (d.amount?.total || 0), 0)}`);
    console.log('\n================================================================================\n');
    
    // 5. Recommendations
    console.log('💡 RECOMMENDATIONS:\n');
    if (janeDemoDonations.length > 0) {
      console.log('   ✅ Jane has donations in demo_donations collection');
      console.log('   ⚠️  Frontend is querying tenants/YDJCJnuLGMC9mWOWDSOa/donations');
      console.log('   🔧 FIX: Update platformMetrics.ts to query demo_donations collection');
      console.log('   🔧 FIX: Add donor_id field to demo_donations when created\n');
    } else {
      console.log('   ❌ No donations found for Jane in any collection');
      console.log('   🔧 FIX: Ensure demo donation flow saves donor_id correctly\n');
    }
    
  } catch (error) {
    console.error('❌ Error checking Jane donations:', error);
  }
  
  process.exit(0);
}

checkJaneDonations();

