/**
 * Check User Profile Structure for LinkedIn and Social Links
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../apps/api/service-account-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkUserProfileStructure() {
  console.log('🔍 CHECKING USER PROFILE STRUCTURE FOR SOCIAL LINKS\n');
  console.log('================================================================================\n');
  
  try {
    // Get Joel's user document as reference
    const usersSnapshot = await db.collection('users')
      .where('email', '==', 'joel.yaffe@gmail.com')
      .limit(1)
      .get();
    
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      
      console.log('📋 User Document Structure (joel.yaffe@gmail.com):\n');
      console.log('Document ID:', userDoc.id);
      console.log('Email:', userData.email);
      console.log('Name:', userData.name);
      console.log('\n🔗 Social/Contact Fields:\n');
      console.log('  linkedIn:', userData.linkedIn || 'NOT SET');
      console.log('  twitter:', userData.twitter || 'NOT SET');
      console.log('  website:', userData.website || 'NOT SET');
      console.log('  phone:', userData.phone || 'NOT SET');
      
      if (userData.adminProfile) {
        console.log('\n📋 Nested adminProfile Fields:\n');
        console.log('  linkedIn:', userData.adminProfile.linkedIn || 'NOT SET');
        console.log('  twitter:', userData.adminProfile.twitter || 'NOT SET');
        console.log('  website:', userData.adminProfile.website || 'NOT SET');
      }
      
      console.log('\n================================================================================');
      
      // Also check team_members collection
      console.log('\n🔍 CHECKING TEAM_MEMBERS COLLECTION STRUCTURE\n');
      console.log('================================================================================\n');
      
      const teamMemberSnapshot = await db.collection('team_members').doc(userDoc.id).get();
      
      if (teamMemberSnapshot.exists) {
        const teamData = teamMemberSnapshot.data();
        console.log('📋 Team Member Document Structure:\n');
        console.log('  linkedIn:', teamData.linkedIn || 'NOT SET');
        console.log('  twitter:', teamData.twitter || 'NOT SET');
        console.log('  website:', teamData.website || 'NOT SET');
        console.log('  phone:', teamData.phone || 'NOT SET');
      } else {
        console.log('❌ No team_members document found for this user');
      }
      
      console.log('\n================================================================================\n');
      
    } else {
      console.log('❌ Joel\'s user document not found');
    }
    
    // Check admin_profiles collection
    console.log('\n🔍 CHECKING ADMIN_PROFILES COLLECTION\n');
    console.log('================================================================================\n');
    
    const adminProfilesSnapshot = await db.collection('admin_profiles')
      .limit(1)
      .get();
    
    if (!adminProfilesSnapshot.empty) {
      const adminDoc = adminProfilesSnapshot.docs[0];
      const adminData = adminDoc.data();
      
      console.log('📋 Admin Profile Document Structure (sample):\n');
      console.log('Email:', adminData.email);
      console.log('  linkedIn:', adminData.linkedIn || 'NOT SET');
      console.log('  twitter:', adminData.twitter || 'NOT SET');
      console.log('  website:', adminData.website || 'NOT SET');
      
      console.log('\n✅ SUMMARY:\n');
      console.log('Social links can be stored in:');
      console.log('  1. users/{userId} - Direct fields');
      console.log('  2. users/{userId}.adminProfile - Nested object');
      console.log('  3. admin_profiles/{userId} - Separate collection');
      console.log('  4. team_members/{userId} - Public collection (for team page)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

checkUserProfileStructure();

