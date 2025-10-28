/**
 * Check Platform Admin visibility settings
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

async function checkAdminVisibility() {
  console.log('\n🔍 CHECKING PLATFORM ADMIN VISIBILITY SETTINGS\n');
  console.log('='.repeat(80));

  try {
    // Get all admin profiles
    const adminProfilesRef = db.collection('admin_profiles');
    const snapshot = await adminProfilesRef.get();

    console.log(`\n📊 Found ${snapshot.size} admin profiles\n`);

    const profiles = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      profiles.push({
        id: doc.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        profileVisibility: data.profileVisibility,
        showContactInfo: data.showContactInfo,
        showExperience: data.showExperience,
        role: data.role
      });
    });

    // Display each profile
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.firstName} ${profile.lastName}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Role: ${profile.role || 'Not set'}`);
      console.log(`   Profile Visibility: ${profile.profileVisibility || 'undefined (should default to public)'}`);
      console.log(`   Show Contact Info: ${profile.showContactInfo !== undefined ? profile.showContactInfo : 'undefined'}`);
      console.log(`   Show Experience: ${profile.showExperience !== undefined ? profile.showExperience : 'undefined'}`);
      console.log('');
    });

    // Summary
    const publicCount = profiles.filter(p => p.profileVisibility === 'public').length;
    const undefinedCount = profiles.filter(p => !p.profileVisibility).length;
    const privateCount = profiles.filter(p => p.profileVisibility === 'private' || p.profileVisibility === 'team').length;

    console.log('='.repeat(80));
    console.log('\n📈 SUMMARY:');
    console.log(`   Total Profiles: ${profiles.length}`);
    console.log(`   Public: ${publicCount}`);
    console.log(`   Undefined (defaults to public): ${undefinedCount}`);
    console.log(`   Private/Team: ${privateCount}`);
    console.log(`   Expected on Team Page: ${publicCount + undefinedCount}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkAdminVisibility();

