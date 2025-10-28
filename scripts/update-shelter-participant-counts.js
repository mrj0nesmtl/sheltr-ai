/**
 * Update Shelter Participant Counts
 * 
 * This script updates the `participants` field in shelter documents
 * by counting users with role='participant' and matching shelter_id
 * 
 * Usage: node scripts/update-shelter-participant-counts.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateParticipantCounts() {
  try {
    console.log('🔄 Starting participant count update...\n');

    // Get all shelters
    const sheltersSnapshot = await db.collection('shelters').get();
    
    if (sheltersSnapshot.empty) {
      console.log('❌ No shelters found in database');
      return;
    }

    console.log(`📊 Found ${sheltersSnapshot.size} shelter(s)\n`);

    // Process each shelter
    for (const shelterDoc of sheltersSnapshot.docs) {
      const shelterId = shelterDoc.id;
      const shelterData = shelterDoc.data();
      const shelterName = shelterData.name || 'Unknown';

      console.log(`🏠 Processing: ${shelterName} (${shelterId})`);

      // Count participants for this shelter
      // Query using the shelter's document ID (slug format)
      const participantsSnapshot = await db.collection('users')
        .where('role', '==', 'participant')
        .where('shelter_id', '==', shelterId) // Use the actual shelter ID
        .get();

      const count = participantsSnapshot.size;
      console.log(`   📈 Found ${count} participant(s)`);

      // List participants
      if (count > 0) {
        participantsSnapshot.forEach(doc => {
          const data = doc.data();
          console.log(`      - ${data.firstName} ${data.lastName} (${data.email || 'no email'})`);
        });
      }

      // Update shelter document with participant count
      await shelterDoc.ref.update({
        participants: count,
        participantsLastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`   ✅ Updated shelter document with count: ${count}\n`);
    }

    console.log('✅ All participant counts updated successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error updating participant counts:', error);
    process.exit(1);
  }
}

// Run the update
updateParticipantCounts();

