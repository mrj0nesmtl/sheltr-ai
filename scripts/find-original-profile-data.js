/**
 * Find where the original profile data is stored
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

async function findOriginalData() {
  console.log('\n🔍 SEARCHING FOR ORIGINAL PROFILE DATA\n');
  console.log('='.repeat(80));

  try {
    // Check a few known users to see where their data is
    const testEmails = [
      'gunnar.blaze@gmail.com',
      'doug.kukura@gmail.com',
      'alexanderkline13@gmail.com'
    ];

    for (const email of testEmails) {
      console.log(`\n👤 Checking: ${email}`);
      
      // Get from users collection
      const usersRef = db.collection('users');
      const userQuery = await usersRef.where('email', '==', email).get();
      
      if (!userQuery.empty) {
        const userId = userQuery.docs[0].id;
        const userData = userQuery.docs[0].data();
        
        console.log('📄 users collection:');
        console.log(`   Job Title: ${userData.jobTitle || 'NONE'}`);
        console.log(`   Department: ${userData.department || 'NONE'}`);
        console.log(`   Bio: ${userData.bio ? userData.bio.substring(0, 50) + '...' : 'NONE'}`);
        console.log(`   adminProfile.jobTitle: ${userData.adminProfile?.jobTitle || 'NONE'}`);
        console.log(`   adminProfile.department: ${userData.adminProfile?.department || 'NONE'}`);
        
        // Check admin_profiles collection
        const adminProfileRef = db.collection('admin_profiles').doc(userId);
        const adminProfileDoc = await adminProfileRef.get();
        
        if (adminProfileDoc.exists) {
          const adminProfileData = adminProfileDoc.data();
          console.log('📋 admin_profiles collection:');
          console.log(`   Job Title: ${adminProfileData.jobTitle || 'NONE'}`);
          console.log(`   Department: ${adminProfileData.department || 'NONE'}`);
          console.log(`   Bio: ${adminProfileData.bio ? adminProfileData.bio.substring(0, 50) + '...' : 'NONE'}`);
        }
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n💡 Check the screenshot from earlier - what data was showing?');
    console.log('   We need to restore that original data!');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

findOriginalData();

