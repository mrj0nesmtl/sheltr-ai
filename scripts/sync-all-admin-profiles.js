/**
 * Sync all Platform Administrators to create admin_profiles
 * This ensures all Platform Admins appear on the team page
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

async function syncAllAdminProfiles() {
  console.log('\n🔄 SYNCING ALL PLATFORM ADMIN PROFILES\n');
  console.log('='.repeat(80));

  try {
    // Get all users with platform_admin role
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('role', '==', 'platform_admin').get();

    console.log(`\n📊 Found ${snapshot.size} Platform Admins\n`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const doc of snapshot.docs) {
      const userId = doc.id;
      const userData = doc.data();

      console.log(`\n👤 Processing: ${userData.name || userData.email}`);

      // Check if admin_profile already exists
      const adminProfileRef = db.collection('admin_profiles').doc(userId);
      const adminProfileDoc = await adminProfileRef.get();

      if (adminProfileDoc.exists) {
        console.log('   ℹ️  Admin profile already exists, updating...');
        
        // Update existing profile
        await adminProfileRef.update({
          email: userData.email,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          displayName: userData.name || `${userData.firstName} ${userData.lastName}`.trim(),
          profileVisibility: userData.profileVisibility || 'public',
          showContactInfo: userData.showContactInfo !== undefined ? userData.showContactInfo : true,
          showExperience: userData.showExperience !== undefined ? userData.showExperience : true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        updated++;
        console.log('   ✅ Profile updated');
      } else {
        console.log('   🆕 Creating new admin profile...');
        
        // Create new admin profile
        const newProfile = {
          userId,
          email: userData.email,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          displayName: userData.name || `${userData.firstName} ${userData.lastName}`.trim(),
          
          // Job details (empty by default, can be filled in later)
          jobTitle: '',
          department: 'General',
          specialization: '',
          bio: '',
          location: '',
          timezone: '',
          
          // Professional info
          expertise: [],
          yearsOfExperience: 0,
          education: [],
          certifications: [],
          
          // Contact info
          phone: userData.phone || '',
          linkedIn: userData.linkedIn || '',
          twitter: userData.twitter || '',
          website: userData.website || '',
          
          // Privacy settings - DEFAULT TO PUBLIC
          profileVisibility: userData.profileVisibility || 'public',
          showContactInfo: userData.showContactInfo !== undefined ? userData.showContactInfo : true,
          showExperience: userData.showExperience !== undefined ? userData.showExperience : true,
          
          // Metadata
          joinDate: userData.createdAt && userData.createdAt.toDate ? userData.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          profileComplete: false,
          role: 'platform_admin',
          
          // Timestamps
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        await adminProfileRef.set(newProfile);
        
        created++;
        console.log('   ✅ Profile created');
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 SYNC SUMMARY:');
    console.log(`   Total Processed: ${snapshot.size}`);
    console.log(`   Created: ${created} 🆕`);
    console.log(`   Updated: ${updated} 🔄`);
    console.log(`   Skipped: ${skipped}`);
    console.log('');
    console.log('✅ All Platform Admins should now appear on the team page!');
    console.log('   Visit: https://sheltr-ai.web.app/team or http://localhost:3000/team');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

syncAllAdminProfiles();

