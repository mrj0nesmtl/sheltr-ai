/**
 * Restore original team profile data from hardcoded mappings
 * This data was lost when we created empty admin_profiles
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

// Original hardcoded profile data from platformAdminProfileService.ts
const profileData = {
  'alexanderkline13@gmail.com': {
    jobTitle: 'Platform Administrator',
    department: 'Operations',
    specialization: 'Operations, Partnerships',
    isFoundingMember: false
  },
  'zaffialaplante@gmail.com': {
    jobTitle: 'Platform Administrator',
    department: 'Operations',
    specialization: 'Public Relations, Onboarding, Partnerships',
    isFoundingMember: true
  },
  'alaghetts@gmail.com': {
    jobTitle: 'Platform Administrator',
    department: 'Engineering',
    specialization: 'Product Design & Engineering',
    isFoundingMember: true
  },
  'deefactorial@gmail.com': {
    jobTitle: 'Platform Administrator',
    department: 'Engineering',
    specialization: 'Blockchain Engineer, AI Team',
    isFoundingMember: true
  },
  'doug.kukura@gmail.com': {
    jobTitle: 'Platform Administrator',
    department: 'Analytics',
    specialization: 'DeFi, Payments, Partnerships',
    isFoundingMember: true
  },
  'gunnar.blaze@gmail.com': {
    jobTitle: 'Platform Administrator',
    department: 'Leadership',
    specialization: 'Co-Founder',
    isFoundingMember: true
  },
  'f.tjeff79@gmail.com': {
    jobTitle: 'Platform Administrator',
    department: 'Engineering',
    specialization: 'Blockchain Advisor, Networking',
    isFoundingMember: true
  },
  'christinesavardmedia@gmail.com': {
    jobTitle: 'Platform Administrator',
    department: 'Marketing',
    specialization: 'Marketing, Outreach, Onboarding',
    isFoundingMember: false
  },
  'morganhirtle@gmail.com': {
    jobTitle: 'Platform Administrator',
    department: 'Support',
    specialization: 'Participant Support Services, EcoSystem',
    isFoundingMember: false
  },
  'srivastavaaryan005@gmail.com': {
    jobTitle: 'Platform Administrator',
    department: 'Analytics',
    specialization: 'Data Analyst',
    isFoundingMember: false
  },
  'admin@royaltri.com': {
    jobTitle: 'Platform Administrator',
    department: 'Marketing',
    specialization: 'Brand, Marketing, Publicity',
    isFoundingMember: false
  },
  'senw@royaltri.com': {
    jobTitle: 'Platform Administrator',
    department: 'Marketing',
    specialization: 'Brand, Marketing, Publicity',
    isFoundingMember: false
  },
  'joel.yaffe@gmail.com': {
    jobTitle: 'CTO, Co-Founder',
    department: 'Leadership',
    specialization: 'Visionary Leadership & Strategic Direction',
    bio: 'Founder and CEO of SHELTR-AI, pioneering innovative solutions to revolutionize homelessness services through cutting-edge technology and compassionate action.',
    isFoundingMember: true,
    yearsOfExperience: 25
  }
};

async function restoreProfileData() {
  console.log('\n🔄 RESTORING ORIGINAL TEAM PROFILE DATA\n');
  console.log('='.repeat(80));

  try {
    let updated = 0;
    let notFound = 0;

    for (const [email, data] of Object.entries(profileData)) {
      console.log(`\n👤 Restoring: ${email}`);

      // Find user by email
      const usersRef = db.collection('users');
      const userQuery = await usersRef.where('email', '==', email).get();

      if (userQuery.empty) {
        console.log(`   ⚠️  User not found`);
        notFound++;
        continue;
      }

      const userId = userQuery.docs[0].id;

      // Update team_members collection
      await db.collection('team_members').doc(userId).update({
        jobTitle: data.jobTitle,
        department: data.department,
        specialization: data.specialization,
        isFoundingMember: data.isFoundingMember,
        bio: data.bio || '',
        yearsOfExperience: data.yearsOfExperience || 0,
        lastSynced: admin.firestore.FieldValue.serverTimestamp()
      });

      updated++;
      console.log(`   ✅ Restored: ${data.jobTitle} • ${data.specialization}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 SUMMARY:');
    console.log(`   Updated: ${updated} ✅`);
    console.log(`   Not Found: ${notFound}`);
    console.log('');
    console.log('✅ Original team profile data restored!');
    console.log('   Refresh the team page to see the changes.');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

restoreProfileData();

