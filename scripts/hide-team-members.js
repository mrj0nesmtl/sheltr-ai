/**
 * Hide specific team members from the public team page
 * Sets showOnTeamPage: false for Royaltri Admin and Jeff Bernardini
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: './apps/api/.env' });
require('dotenv').config({ path: './.env.local' });

// Initialize Firebase Admin
let serviceAccount;
try {
  // Try loading from environment variable first
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    // Fallback to service account file
    serviceAccount = require('../apps/api/service-account-key.json');
  }
} catch (error) {
  console.error('❌ Error loading service account:', error.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Members to hide from the public team page
 */
const MEMBERS_TO_HIDE = [
  'Royaltri Admin',
  'Jeff Bernardini'
];

async function hideTeamMembers() {
  try {
    console.log('🔍 Searching for team members to hide...\n');
    
    const teamMembersRef = db.collection('team_members');
    const snapshot = await teamMembersRef.get();
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const memberName of MEMBERS_TO_HIDE) {
      console.log(`📝 Processing: ${memberName}`);
      
      // Find member by name
      const memberDocs = snapshot.docs.filter(doc => {
        const data = doc.data();
        return data.name === memberName || data.displayName === memberName;
      });
      
      if (memberDocs.length === 0) {
        console.log(`   ⚠️  Not found: ${memberName}`);
        notFoundCount++;
        continue;
      }
      
      // Update each matching document
      for (const doc of memberDocs) {
        const data = doc.data();
        console.log(`   ✅ Found: ${data.displayName || data.name} (${doc.id})`);
        console.log(`   📊 Current role: ${data.role}`);
        console.log(`   📊 Current showOnTeamPage: ${data.showOnTeamPage !== undefined ? data.showOnTeamPage : 'undefined (defaults to true)'}`);
        
        // Update the document
        await doc.ref.update({
          showOnTeamPage: false,
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`   🚫 Set showOnTeamPage: false`);
        console.log(`   ✨ Member hidden from public team page\n`);
        updatedCount++;
      }
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Update Complete!`);
    console.log(`   Updated: ${updatedCount} members`);
    console.log(`   Not found: ${notFoundCount} members`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (updatedCount > 0) {
      console.log('📌 These members will no longer appear on the public team page.');
      console.log('📌 They can still access the platform as admins.');
      console.log('📌 To show them again, set showOnTeamPage: true in their profile.\n');
    }
    
  } catch (error) {
    console.error('❌ Error hiding team members:', error);
    process.exit(1);
  }
}

// Run the script
hideTeamMembers()
  .then(() => {
    console.log('✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

