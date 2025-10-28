/**
 * Sync admin_profiles collection data back to users.adminProfile nested field
 * The team page pulls from users.adminProfile, not from the separate collection
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

async function syncAdminProfilesToUsers() {
  console.log('\n🔄 SYNCING ADMIN_PROFILES TO USERS.ADMINPROFILE\n');
  console.log('='.repeat(80));

  try {
    // Get all admin_profiles
    const adminProfilesRef = db.collection('admin_profiles');
    const snapshot = await adminProfilesRef.get();

    console.log(`\n📊 Found ${snapshot.size} admin profiles to sync\n`);

    let synced = 0;
    let errors = 0;

    for (const doc of snapshot.docs) {
      const profileId = doc.id;
      const profileData = doc.data();

      console.log(`👤 Syncing: ${profileData.displayName || profileData.email}`);

      try {
        // Update the users collection with the adminProfile nested object
        const userRef = db.collection('users').doc(profileId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          console.log(`   ⚠️  User document not found for ID: ${profileId}`);
          errors++;
          continue;
        }

        // Prepare the adminProfile nested object (only include defined values)
        const adminProfileData = {
          // Professional Information
          department: profileData.department || 'General',
          specialization: profileData.specialization || '',
          jobTitle: profileData.jobTitle || '',
          bio: profileData.bio || '',
          expertise: profileData.expertise || [],
          
          // Contact Information
          linkedIn: profileData.linkedIn || '',
          twitter: profileData.twitter || '',
          website: profileData.website || '',
          
          // Professional Details
          yearsOfExperience: profileData.yearsOfExperience || 0,
          education: profileData.education || [],
          certifications: profileData.certifications || [],
          
          // Privacy Settings
          profileVisibility: profileData.profileVisibility || 'public',
          showContactInfo: profileData.showContactInfo !== undefined ? profileData.showContactInfo : true,
          showExperience: profileData.showExperience !== undefined ? profileData.showExperience : true,
          
          // Platform Role
          accessLevel: 'platform_admin',
          joinDate: profileData.joinDate || new Date().toISOString().split('T')[0],
          permissions: profileData.permissions || [],
          dashboardAccess: profileData.dashboardAccess || [],
          
          // Metadata
          profileComplete: profileData.profileComplete || false,
        };
        
        // Only add displayOrder if it exists
        if (profileData.displayOrder !== undefined) {
          adminProfileData.displayOrder = profileData.displayOrder;
        }

        // Update the user document with the nested adminProfile
        await userRef.update({
          adminProfile: adminProfileData,
          profileVisibility: profileData.profileVisibility || 'public',
          showContactInfo: profileData.showContactInfo !== undefined ? profileData.showContactInfo : true,
          showExperience: profileData.showExperience !== undefined ? profileData.showExperience : true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        synced++;
        console.log(`   ✅ Synced to users.adminProfile`);

      } catch (error) {
        console.error(`   ❌ Error syncing ${profileData.email}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 SYNC SUMMARY:');
    console.log(`   Total Processed: ${snapshot.size}`);
    console.log(`   Successfully Synced: ${synced} ✅`);
    console.log(`   Errors: ${errors} ❌`);
    console.log('');
    console.log('✅ Admin profiles synced to users collection!');
    console.log('   The team page should now display all members.');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

syncAdminProfilesToUsers();

