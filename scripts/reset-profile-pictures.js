/**
 * Reset Profile Pictures for Alexander and Doug
 * Remove the LinkedIn scraped URLs so they fall back to initials
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../apps/api/service-account-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const { FieldValue } = admin.firestore;

// Users to reset
const usersToReset = [
  'alexanderkline13@gmail.com',
  'doug.kukura@gmail.com'
];

async function resetProfilePictures() {
  console.log('🔄 RESETTING PROFILE PICTURES FOR ALEXANDER & DOUG\n');
  console.log('================================================================================\n');
  
  let resetCount = 0;
  
  for (const email of usersToReset) {
    console.log(`👤 Processing: ${email}`);
    
    try {
      // Find user by email
      const usersSnapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (usersSnapshot.empty) {
        console.log(`   ❌ User not found`);
        continue;
      }
      
      const userId = usersSnapshot.docs[0].id;
      
      // Remove profilePicture from users collection
      await db.collection('users').doc(userId).update({
        profilePicture: FieldValue.delete(),
        'adminProfile.profilePicture': FieldValue.delete()
      });
      console.log(`   ✅ Removed from users/${userId}`);
      
      // Remove from admin_profiles
      const adminProfileDoc = await db.collection('admin_profiles').doc(userId).get();
      if (adminProfileDoc.exists) {
        await db.collection('admin_profiles').doc(userId).update({
          profilePicture: FieldValue.delete()
        });
        console.log(`   ✅ Removed from admin_profiles/${userId}`);
      }
      
      // Remove from team_members
      const teamMemberDoc = await db.collection('team_members').doc(userId).get();
      if (teamMemberDoc.exists) {
        await db.collection('team_members').doc(userId).update({
          profilePicture: FieldValue.delete()
        });
        console.log(`   ✅ Removed from team_members/${userId}`);
      }
      
      console.log(`   🎉 Successfully reset profile picture for ${email}\n`);
      resetCount++;
      
    } catch (error) {
      console.error(`   ❌ Error resetting ${email}:`, error.message);
    }
  }
  
  console.log('================================================================================\n');
  console.log('📊 SUMMARY:\n');
  console.log(`   ✅ Successfully reset: ${resetCount}`);
  console.log(`   📋 Total processed: ${usersToReset.length}\n`);
  console.log('================================================================================\n');
  console.log('✅ Profile pictures reset! They will now display initials.\n');
  
  process.exit(0);
}

resetProfilePictures();

