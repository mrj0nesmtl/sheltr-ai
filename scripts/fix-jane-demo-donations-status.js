#!/usr/bin/env node

/**
 * Fix Jane Supporter's demo_donations status from pending to completed
 * 
 * Issue: All of Jane's donations in demo_donations collection have status: "pending"
 * This causes her donor dashboards to show $0 donated
 * 
 * Solution: Update all her donations to status: "completed"
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

const janeEmail = 'donor@example.com';
const janeUid = 'rWM6e8zfa5UoRVe5tHe6cldQkh32';

async function fixJaneDonations() {
  console.log('🔧 FIXING JANE SUPPORTER\'S DEMO DONATION STATUS\n');
  console.log('================================================================================\n');
  
  try {
    // Query all demo_donations with Jane's email or UID
    const demoDonationsSnapshot = await db.collection('demo_donations').get();
    
    let janeDonations = [];
    
    demoDonationsSnapshot.forEach(doc => {
      const donation = doc.data();
      const donorInfo = donation.donor_info || {};
      const isDonorMatch = donorInfo.donor_id === janeUid || 
                           donorInfo.email === janeEmail ||
                           donation.donor_id === janeUid;
      
      if (isDonorMatch && donation.status === 'pending') {
        janeDonations.push({ id: doc.id, data: donation });
      }
    });
    
    console.log(`📊 Found ${janeDonations.length} pending donations for Jane\n`);
    
    if (janeDonations.length === 0) {
      console.log('✅ No pending donations found. All donations are already completed!\n');
      return;
    }
    
    // Update each donation to completed
    const batch = db.batch();
    let totalAmount = 0;
    
    janeDonations.forEach(({ id, data }) => {
      const donationRef = db.collection('demo_donations').doc(id);
      batch.update(donationRef, {
        status: 'completed',
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      
      totalAmount += data.amount?.total || 0;
      console.log(`   ✅ ${id}: $${data.amount?.total || 0} → completed`);
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log('\n================================================================================\n');
    console.log('📋 SUMMARY:\n');
    console.log(`   ✅ Updated donations: ${janeDonations.length}`);
    console.log(`   💰 Total amount: $${totalAmount}`);
    console.log(`   👤 Donor: Jane Supporter (${janeEmail})`);
    console.log('\n================================================================================\n');
    console.log('🎉 SUCCESS! Jane\'s donations are now marked as completed.\n');
    console.log('🔄 Refresh her donor dashboard to see the updated metrics.\n');
    
  } catch (error) {
    console.error('❌ Error fixing Jane\'s donations:', error);
    process.exit(1);
  }
}

fixJaneDonations()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

