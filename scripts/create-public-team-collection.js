/**
 * Create a PUBLIC team_members collection for the team page
 * This collection is world-readable and contains only public profile data
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

async function createPublicTeamCollection() {
  console.log('\n🌍 CREATING PUBLIC TEAM_MEMBERS COLLECTION\n');
  console.log('='.repeat(80));

  try {
    // Get all Platform Admins
    const usersRef = db.collection('users');
    const platformAdmins = await usersRef.where('role', '==', 'platform_admin').get();
    const superAdmins = await usersRef.where('role', '==', 'super_admin').get();

    const allAdmins = [...platformAdmins.docs, ...superAdmins.docs];

    console.log(`\n📊 Found ${allAdmins.length} team members (${platformAdmins.size} Platform Admins + ${superAdmins.size} Super Admins)\n`);

    let created = 0;
    let skipped = 0;

    for (const userDoc of allAdmins) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const adminProfile = userData.adminProfile || {};

      // Skip if profile is not public
      if (userData.profileVisibility === 'private' || userData.profileVisibility === 'team') {
        console.log(`⏭️  Skipping ${userData.name || userData.email} (not public)`);
        skipped++;
        continue;
      }

      console.log(`👤 Creating public profile for: ${userData.name || userData.email}`);

      // Create public team member document
      const publicProfile = {
        // Basic Info (always public for team page)
        id: userId,
        name: userData.name || `${userData.firstName} ${userData.lastName}`.trim(),
        displayName: userData.displayName || userData.name || `${userData.firstName} ${userData.lastName}`.trim(),
        email: userData.email,
        
        // Professional Info
        jobTitle: adminProfile.jobTitle || 'Platform Administrator',
        department: adminProfile.department || 'General',
        specialization: adminProfile.specialization || '',
        bio: adminProfile.bio || '',
        
        // Profile Picture
        profilePicture: userData.profilePicture || '',
        
        // Professional Details
        expertise: adminProfile.expertise || [],
        yearsOfExperience: adminProfile.yearsOfExperience || 0,
        
        // Contact (only if showContactInfo is true)
        phone: (userData.showContactInfo !== false) ? (userData.phone || '') : '',
        linkedIn: (userData.showContactInfo !== false) ? (adminProfile.linkedIn || '') : '',
        twitter: (userData.showContactInfo !== false) ? (adminProfile.twitter || '') : '',
        website: (userData.showContactInfo !== false) ? (adminProfile.website || '') : '',
        
        // Experience details (only if showExperience is true)
        education: (userData.showExperience !== false) ? (adminProfile.education || []) : [],
        certifications: (userData.showExperience !== false) ? (adminProfile.certifications || []) : [],
        
        // Metadata
        role: userData.role,
        joinDate: adminProfile.joinDate || (userData.createdAt && userData.createdAt.toDate ? userData.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        profileComplete: adminProfile.profileComplete || false,
        isFoundingMember: userData.isFoundingMember || false,
        
        // Sync timestamp
        lastSynced: admin.firestore.FieldValue.serverTimestamp()
      };
      
      // Only add displayOrder if it exists
      if (adminProfile.displayOrder !== undefined) {
        publicProfile.displayOrder = adminProfile.displayOrder;
      }

      // Write to public team_members collection
      await db.collection('team_members').doc(userId).set(publicProfile);
      
      created++;
      console.log(`   ✅ Public profile created`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 SUMMARY:');
    console.log(`   Total Admins: ${allAdmins.length}`);
    console.log(`   Public Profiles Created: ${created} ✅`);
    console.log(`   Skipped (private): ${skipped}`);
    console.log('');
    console.log('🌍 Public team_members collection created!');
    console.log('   Now update Firestore rules to allow public read access.');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

createPublicTeamCollection();

