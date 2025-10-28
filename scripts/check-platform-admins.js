/**
 * Check all Platform Administrators in users collection
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

async function checkPlatformAdmins() {
  console.log('\n🔍 CHECKING PLATFORM ADMINS IN USERS COLLECTION\n');
  console.log('='.repeat(80));

  try {
    // Get all users with platform_admin role
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('role', '==', 'platform_admin').get();

    console.log(`\n📊 Found ${snapshot.size} Platform Admins in users collection\n`);

    const users = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        id: doc.id,
        email: data.email,
        name: data.name,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        profileVisibility: data.profileVisibility,
        hasAdminProfile: false // We'll check this
      });
    });

    // Check which users have admin_profiles
    for (const user of users) {
      const adminProfileRef = db.collection('admin_profiles').doc(user.id);
      const adminProfileDoc = await adminProfileRef.get();
      user.hasAdminProfile = adminProfileDoc.exists;
    }

    // Display each user
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || `${user.firstName} ${user.lastName}`}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Profile Visibility (in users): ${user.profileVisibility || 'undefined'}`);
      console.log(`   Has admin_profile: ${user.hasAdminProfile ? '✅ YES' : '❌ NO'}`);
      console.log('');
    });

    // Summary
    const withProfiles = users.filter(u => u.hasAdminProfile).length;
    const withoutProfiles = users.filter(u => !u.hasAdminProfile).length;

    console.log('='.repeat(80));
    console.log('\n📈 SUMMARY:');
    console.log(`   Total Platform Admins: ${users.length}`);
    console.log(`   With admin_profile: ${withProfiles}`);
    console.log(`   WITHOUT admin_profile: ${withoutProfiles} ⚠️`);
    console.log('');
    console.log('⚠️  ISSUE: Users without admin_profile will NOT appear on the team page!');
    console.log('   The team page pulls from admin_profiles, not users collection.');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkPlatformAdmins();

