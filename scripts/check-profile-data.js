/**
 * Check what data is actually in the admin_profiles
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

async function checkProfileData() {
  console.log('\n🔍 CHECKING ADMIN PROFILE DATA QUALITY\n');
  console.log('='.repeat(80));

  try {
    const adminProfilesRef = db.collection('admin_profiles');
    const snapshot = await adminProfilesRef.get();

    console.log(`\n📊 Found ${snapshot.size} admin profiles\n`);

    const profiles = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      profiles.push({
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        email: data.email,
        jobTitle: data.jobTitle,
        department: data.department,
        bio: data.bio,
        profileVisibility: data.profileVisibility
      });
    });

    // Display each profile
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.displayName || 'NO NAME'}`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   First: "${profile.firstName || 'EMPTY'}"`);
      console.log(`   Last: "${profile.lastName || 'EMPTY'}"`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Job Title: "${profile.jobTitle || 'EMPTY'}"`);
      console.log(`   Department: "${profile.department || 'EMPTY'}"`);
      console.log(`   Bio: "${profile.bio ? profile.bio.substring(0, 50) : 'EMPTY'}"`);
      console.log(`   Visibility: ${profile.profileVisibility}`);
      
      // Check for problems
      const problems = [];
      if (!profile.firstName) problems.push('Missing firstName');
      if (!profile.lastName) problems.push('Missing lastName');
      if (!profile.displayName) problems.push('Missing displayName');
      if (!profile.jobTitle) problems.push('Empty jobTitle');
      if (!profile.bio) problems.push('Empty bio');
      
      if (problems.length > 0) {
        console.log(`   ⚠️  ISSUES: ${problems.join(', ')}`);
      } else {
        console.log(`   ✅ Complete profile`);
      }
      console.log('');
    });

    // Check for profiles that might be filtered out
    const hasNames = profiles.filter(p => p.firstName && p.lastName).length;
    const hasDisplayNames = profiles.filter(p => p.displayName).length;
    const isPublic = profiles.filter(p => p.profileVisibility === 'public').length;

    console.log('='.repeat(80));
    console.log('\n📈 DATA QUALITY SUMMARY:');
    console.log(`   Total Profiles: ${profiles.length}`);
    console.log(`   With First & Last Name: ${hasNames}`);
    console.log(`   With Display Name: ${hasDisplayNames}`);
    console.log(`   Public Visibility: ${isPublic}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkProfileData();

