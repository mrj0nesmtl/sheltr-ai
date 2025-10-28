/**
 * Verify team_members collection has data
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'apps', 'api', 'service-account-key.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function verifyTeamCollection() {
  console.log('\n🔍 VERIFYING TEAM_MEMBERS COLLECTION\n');
  console.log('='.repeat(80));

  try {
    const teamMembersRef = db.collection('team_members');
    const snapshot = await teamMembersRef.get();

    console.log(`\n📊 Found ${snapshot.size} documents in team_members collection\n`);

    if (snapshot.empty) {
      console.log('❌ Collection is EMPTY!');
      console.log('   Run: node scripts/create-public-team-collection.js');
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`✅ ${data.name || data.email} - ${data.jobTitle || 'No title'}`);
      });
    }

    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

verifyTeamCollection();

