#!/usr/bin/env node

/**
 * Fix Demo Donations Participant IDs
 * 
 * This script migrates participant_id values from slugs to Firebase UIDs
 * for consistency across the donation flow.
 * 
 * Run: node scripts/fix-demo-donation-participant-ids.js
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

// Mapping of known slugs to Firebase UIDs
const PARTICIPANT_MAPPING = {
  'michael-rodriguez': 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1',
  'demo-participant-001': 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1'
};

async function fixDemoDonationParticipantIds() {
  console.log('🔧 Starting demo_donations participant_id migration...\n');

  try {
    // Get all demo donations
    const donationsSnapshot = await db.collection('demo_donations').get();
    console.log(`📊 Found ${donationsSnapshot.size} total donations in demo_donations\n`);

    let fixed = 0;
    let alreadyCorrect = 0;
    let batch = db.batch();
    let batchCount = 0;

    for (const doc of donationsSnapshot.docs) {
      const data = doc.data();
      const participantId = data.participant_id;

      // Check if participant_id needs mapping
      if (PARTICIPANT_MAPPING[participantId]) {
        const correctUid = PARTICIPANT_MAPPING[participantId];
        console.log(`✏️  Fixing donation ${doc.id}:`);
        console.log(`   Old: participant_id="${participantId}"`);
        console.log(`   New: participant_id="${correctUid}", participant_slug="${participantId}"`);

        // Update the donation
        batch.update(doc.ref, {
          participant_id: correctUid,
          participant_slug: participantId,
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        fixed++;
        batchCount++;

        // Commit batch every 500 operations (Firestore limit)
        if (batchCount >= 500) {
          await batch.commit();
          console.log(`   ✅ Committed batch of ${batchCount} updates\n`);
          batch = db.batch();
          batchCount = 0;
        }
      } else if (participantId && participantId.length > 20) {
        // Already a Firebase UID (UIDs are typically 28 characters)
        alreadyCorrect++;
        console.log(`✓  Donation ${doc.id} already has correct UID: ${participantId}`);
      } else {
        console.log(`⚠️  Donation ${doc.id} has unknown participant_id: ${participantId}`);
      }
    }

    // Commit remaining batch
    if (batchCount > 0) {
      await batch.commit();
      console.log(`\n✅ Committed final batch of ${batchCount} updates`);
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✏️  Fixed: ${fixed} donations`);
    console.log(`   ✓  Already correct: ${alreadyCorrect} donations`);
    console.log(`   📈 Total processed: ${donationsSnapshot.size} donations`);

    // Now recalculate Michael's stats from donations
    console.log('\n💰 Recalculating participant stats from donations...');
    await recalculateParticipantStats();

    console.log('\n✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

async function recalculateParticipantStats() {
  const michaelUid = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1';

  // Query all completed donations for Michael
  const donationsSnapshot = await db.collection('demo_donations')
    .where('participant_id', '==', michaelUid)
    .where('status', '==', 'completed')
    .get();

  console.log(`   Found ${donationsSnapshot.size} completed donations for Michael`);

  let totalReceived = 0;
  let housingFundBalance = 0;
  let donationCount = 0;

  donationsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    const amount = data.amount || {};
    const breakdown = amount.breakdown || {};

    // Sum up DIRECT amounts (80%)
    const direct = breakdown.direct || Math.round(amount.total * 0.80 * 100) / 100;
    const housing = breakdown.housing || Math.round(amount.total * 0.15 * 100) / 100;

    totalReceived += direct;
    housingFundBalance += housing;
    donationCount++;

    console.log(`   + $${direct} (direct), $${housing} (housing) from donation ${doc.id}`);
  });

  // Update Michael's user document
  const michaelRef = db.collection('users').doc(michaelUid);
  await michaelRef.update({
    total_received: totalReceived,
    housing_fund_balance: housingFundBalance,
    donation_count: donationCount,
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`\n   ✅ Updated Michael's stats:`);
  console.log(`      total_received: $${totalReceived}`);
  console.log(`      housing_fund_balance: $${housingFundBalance}`);
  console.log(`      donation_count: ${donationCount}`);
}

// Run the migration
fixDemoDonationParticipantIds();

