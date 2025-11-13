/**
 * Sync profile picture from users collection to team_members collection
 * Fixes profile picture mismatch between dashboard and team page
 */

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function syncProfilePicture(userId) {
  try {
    console.log(`🔄 Syncing profile picture for user: ${userId}\n`);
    
    // Get user document (source of truth for profile picture)
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log('❌ User document not found');
      return false;
    }
    
    const userData = userDoc.data();
    const profilePicture = userData.profilePicture || '';
    const displayName = userData.displayName || `${userData.firstName} ${userData.lastName}`;
    
    console.log('📸 Profile Picture URL from users collection:');
    console.log(`   ${profilePicture || '(none)'}\n`);
    
    // Get team_members document
    const teamMemberDoc = await db.collection('team_members').doc(userId).get();
    
    if (!teamMemberDoc.exists) {
      console.log('⚠️  No team_members document found');
      console.log('   Creating team_members entry...');
      
      await db.collection('team_members').doc(userId).set({
        profilePicture: profilePicture,
        name: displayName,
        displayName: displayName,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      console.log('✅ Created team_members document with profile picture\n');
    } else {
      const teamMemberData = teamMemberDoc.data();
      const currentTeamPicture = teamMemberData.profilePicture || '';
      
      console.log('📸 Current Profile Picture in team_members:');
      console.log(`   ${currentTeamPicture || '(none)'}\n`);
      
      if (currentTeamPicture === profilePicture) {
        console.log('✅ Profile pictures already match - no sync needed\n');
        return true;
      }
      
      // Update team_members with correct profile picture
      await db.collection('team_members').doc(userId).update({
        profilePicture: profilePicture,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('✅ Successfully synced profile picture to team_members\n');
    }
    
    // Also sync slug if it exists
    const slug = userData.slug;
    if (slug && userData.bio?.showOnTeamPage) {
      await db.collection('team_members').doc(userId).update({
        slug: slug
      });
      console.log(`✅ Also synced slug: "${slug}"\n`);
    }
    
    console.log('=' .repeat(60));
    console.log('✨ Profile picture sync complete!');
    console.log('   Dashboard and Team page should now show the same picture.');
    console.log('=' .repeat(60));
    
    return true;
  } catch (error) {
    console.error('❌ Error syncing profile picture:', error);
    return false;
  }
}

// Get userId from command line or use default
const userId = process.argv[2];

if (!userId) {
  console.error('❌ Error: Please provide a user ID');
  console.log('\nUsage: node sync-profile-picture.js <userId>');
  console.log('Example: node sync-profile-picture.js abc123xyz\n');
  process.exit(1);
}

// Run the sync
syncProfilePicture(userId)
  .then((success) => {
    if (success) {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    } else {
      console.log('\n⚠️  Script completed with warnings');
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

