const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sheltr-ai.firebaseio.com"
  });
}

const db = admin.firestore();

const setAllAdminsPublic = async () => {
  console.log('🔓 Setting all Platform Administrators to public visibility...\n');

  try {
    // Get all Platform Admin and Super Admin users
    const usersSnapshot = await db.collection('users')
      .where('role', 'in', ['platform_admin', 'super_admin'])
      .get();

    console.log(`📊 Found ${usersSnapshot.size} administrators\n`);

    let updateCount = 0;
    const batch = db.batch();

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;

      console.log(`👤 Processing: ${userData.displayName || userData.email}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Current visibility: ${userData.profileVisibility || '(not set)'}`);

      // Update the user document to set profileVisibility to 'public'
      batch.update(db.collection('users').doc(userId), {
        profileVisibility: 'public',
        showContactInfo: true,  // Also show contact info by default
        showExperience: true,   // Show experience by default
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`   ✅ Queued: Set to public with contact/experience visible\n`);
      updateCount++;
    }

    // Commit the batch update
    if (updateCount > 0) {
      await batch.commit();
      console.log('='.repeat(60));
      console.log(`🎉 SUCCESS! Updated ${updateCount} administrator profiles`);
      console.log('='.repeat(60));
      console.log('\n✅ All Platform Administrators are now visible on the team page!');
      console.log('✅ Contact information is visible');
      console.log('✅ Experience details are visible');
      console.log('\n🔗 Visit: http://localhost:3000/team to see all team members');
    } else {
      console.log('⚠️  No profiles needed updating');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error updating profiles:', error);
    process.exit(1);
  }
};

setAllAdminsPublic();

