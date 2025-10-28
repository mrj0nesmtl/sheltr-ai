#!/usr/bin/env node

/**
 * Reset Demo Donations & User Stats
 * 
 * This script completely wipes demo_donations and resets all user stats to zero
 * for a clean testing environment.
 * 
 * Run: node scripts/reset-demo-donations.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../apps/api/service-account-key.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

async function resetDemoDonations() {
  console.log('🧹 Starting demo donations & user stats reset...\n');

  try {
    // Step 1: Delete all demo_donations
    console.log('📦 Deleting all donations from demo_donations collection...');
    const donationsSnapshot = await db.collection('demo_donations').get();
    console.log(`   Found ${donationsSnapshot.size} donations to delete`);

    let batch = db.batch();
    let count = 0;

    for (const doc of donationsSnapshot.docs) {
      batch.delete(doc.ref);
      count++;

      if (count >= 500) {
        await batch.commit();
        console.log(`   ✅ Deleted batch of ${count} donations`);
        batch = db.batch();
        count = 0;
      }
    }

    if (count > 0) {
      await batch.commit();
      console.log(`   ✅ Deleted final batch of ${count} donations`);
    }

    console.log(`\n✅ Deleted ${donationsSnapshot.size} total donations from demo_donations\n`);

    // Step 2: Delete demo_analytics (optional but keeps things clean)
    console.log('📊 Deleting demo analytics events...');
    const analyticsSnapshot = await db.collection('demo_analytics')
      .where('demo', '==', true)
      .get();
    console.log(`   Found ${analyticsSnapshot.size} analytics events to delete`);

    batch = db.batch();
    count = 0;

    for (const doc of analyticsSnapshot.docs) {
      batch.delete(doc.ref);
      count++;

      if (count >= 500) {
        await batch.commit();
        console.log(`   ✅ Deleted batch of ${count} analytics events`);
        batch = db.batch();
        count = 0;
      }
    }

    if (count > 0) {
      await batch.commit();
      console.log(`   ✅ Deleted final batch of ${count} analytics events`);
    }

    console.log(`\n✅ Deleted ${analyticsSnapshot.size} total analytics events\n`);

    // Step 3: Reset Michael's stats
    console.log('👤 Resetting Michael Rodriguez stats...');
    const michaelUid = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1';
    const michaelRef = db.collection('users').doc(michaelUid);
    await michaelRef.update({
      total_received: 0,
      housing_fund_balance: 0,
      donation_count: 0,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('   ✅ Michael\'s stats reset to $0\n');

    // Step 3: Reset Jane's stats
    console.log('👤 Resetting Jane Supporter stats...');
    const janeUid = 'rWM6e8zfa5UoRVe5tHe6cldQkh32';
    const janeRef = db.collection('users').doc(janeUid);
    await janeRef.update({
      totalDonated: 0,
      donation_count: 0,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('   ✅ Jane\'s stats reset to $0\n');

    // Step 4: Reset shelter stats (optional)
    console.log('🏠 Resetting Old Brewery Mission stats...');
    const shelterRef = db.collection('shelters').doc('old-brewery-mission');
    await shelterRef.update({
      operations_revenue: 0,
      total_donations_received: 0,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('   ✅ Shelter stats reset to $0\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ RESET COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Current State:');
    console.log('   • demo_donations: 0 donations');
    console.log('   • Michael: $0 total_received, $0 housing_fund');
    console.log('   • Jane: $0 totalDonated');
    console.log('   • Old Brewery Mission: $0 operations_revenue');
    console.log('\n🎯 Ready for clean testing!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Reset failed:', error);
    process.exit(1);
  }
}

// Run the reset
resetDemoDonations();

