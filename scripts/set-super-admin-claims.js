const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sheltr-ai.firebaseio.com"
  });
}

const setSuperAdminClaims = async () => {
  console.log('🔧 SETTING SUPER ADMIN CUSTOM CLAIMS\n');
  console.log('================================================================================\n');

  try {
    const superAdminEmail = 'joel.yaffe@gmail.com';

    // Get the user by email
    const userRecord = await admin.auth().getUserByEmail(superAdminEmail);
    console.log(`📋 Found user: ${userRecord.email}`);
    console.log(`   UID: ${userRecord.uid}`);

    // Check current custom claims
    const currentClaims = userRecord.customClaims || {};
    console.log(`   Current custom claims:`, currentClaims);

    // Set custom claims
    const newClaims = {
      role: 'super_admin',
      permissions: ['all'],
      tenant_id: 'platform',
    };

    console.log(`\n🔐 Setting new custom claims:`, newClaims);

    await admin.auth().setCustomUserClaims(userRecord.uid, newClaims);

    console.log('✅ Custom claims set successfully!\n');

    // Verify the claims
    const updatedUserRecord = await admin.auth().getUser(userRecord.uid);
    console.log('================================================================================\n');
    console.log('✅ VERIFICATION - Updated Custom Claims:\n');
    console.log(JSON.stringify(updatedUserRecord.customClaims, null, 2));
    console.log('\n================================================================================\n');
    console.log('🎉 SUCCESS! Joel\'s Firebase Auth account now has super_admin claims.\n');
    console.log('⚠️  IMPORTANT: You must LOG OUT and LOG BACK IN for changes to take effect!\n');
    console.log('   1. Log out of https://sheltr-ai.web.app');
    console.log('   2. Clear browser cache (or use incognito)');
    console.log('   3. Log back in with joel.yaffe@gmail.com');
    console.log('   4. Try accessing secure documents again\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting custom claims:', error);
    process.exit(1);
  }
};

setSuperAdminClaims();

