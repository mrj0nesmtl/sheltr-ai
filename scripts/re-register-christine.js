const admin = require('firebase-admin');
const crypto = require('crypto');

// Initialize Firebase Admin SDK
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sheltr-ai.firebaseio.com"
  });
}

const db = admin.firestore();

// Generate secure random password using cryptographically secure random number generator
function generateSecurePassword(length = 16) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  // Helper function to get secure random index
  function getSecureRandomIndex(max) {
    const randomBytes = crypto.randomBytes(4);
    const randomValue = randomBytes.readUInt32BE(0);
    return randomValue % max;
  }
  
  let password = '';
  password += uppercase[getSecureRandomIndex(uppercase.length)];
  password += lowercase[getSecureRandomIndex(lowercase.length)];
  password += numbers[getSecureRandomIndex(numbers.length)];
  password += symbols[getSecureRandomIndex(symbols.length)];
  
  for (let i = password.length; i < length; i++) {
    password += allChars[getSecureRandomIndex(allChars.length)];
  }
  
  // Shuffle password securely using Fisher-Yates algorithm
  const passwordArray = password.split('');
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = getSecureRandomIndex(i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  
  return passwordArray.join('');
}

const reRegisterChristine = async () => {
  console.log('✅ Initialized Firebase Admin SDK\n');
  console.log('🔍 CHECKING FOR OLD CHRISTINE SAVARD DATA');
  console.log('='.repeat(60));

  const oldUID = 'jbomi8vgTnaeanrOxhjbMH9zXOw2';
  const email = 'christinesavardmedia@gmail.com';

  try {
    // Check if old UID exists in Firebase Auth
    console.log(`\n🔎 Checking Firebase Auth for old UID: ${oldUID}`);
    try {
      const oldUser = await admin.auth().getUser(oldUID);
      console.log(`❌ OLD UID STILL EXISTS IN AUTH!`);
      console.log(`   Email: ${oldUser.email}`);
      console.log(`   Created: ${new Date(oldUser.metadata.creationTime).toISOString()}`);
      console.log(`\n⚠️  RECOMMENDATION: Delete this user from Firebase Console first!`);
      return;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`✅ Old UID not found in Auth (good!)`);
      } else {
        throw error;
      }
    }

    // Check for old UID in Firestore users collection
    console.log(`\n🔎 Checking Firestore 'users' collection for old UID...`);
    const oldUserDoc = await db.collection('users').doc(oldUID).get();
    if (oldUserDoc.exists) {
      console.log(`❌ OLD UID STILL EXISTS IN FIRESTORE!`);
      console.log(`   Data:`, oldUserDoc.data());
      console.log(`\n⚠️  RECOMMENDATION: Delete this document first!`);
      return;
    } else {
      console.log(`✅ Old UID not found in Firestore users (good!)`);
    }

    // Check for email in Firebase Auth
    console.log(`\n🔎 Checking if email exists in Firebase Auth...`);
    try {
      const existingUser = await admin.auth().getUserByEmail(email);
      console.log(`⚠️  Email already exists in Auth!`);
      console.log(`   UID: ${existingUser.uid}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Created: ${new Date(existingUser.metadata.creationTime).toISOString()}`);
      console.log(`\n🤔 This might be the donor account she created by mistake.`);
      console.log(`   Recommendation: Delete this from Firebase Console first!`);
      return;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`✅ Email not found in Auth (ready for registration!)`);
      } else {
        throw error;
      }
    }

    // All clear! Proceed with registration
    console.log('\n' + '='.repeat(60));
    console.log('🚀 RE-REGISTERING CHRISTINE SAVARD AS PLATFORM ADMINISTRATOR');
    console.log('='.repeat(60));

    const newPassword = generateSecurePassword(16);

    console.log(`\n👤 Creating Platform Admin: Christine Savard`);
    console.log(`   Email: ${email}`);

    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email: email,
      password: newPassword,
      displayName: 'Christine Savard',
      emailVerified: false
    });

    console.log(`   ✅ Created Firebase Auth user: ${userRecord.uid}`);

    // Create Firestore user document
    const userData = {
      email: email,
      displayName: 'Christine Savard',
      firstName: 'Christine',
      lastName: 'Savard',
      name: 'Christine Savard',
      role: 'platform_admin',
      roles: ['platform_admin', 'donor'],
      tenant_id: 'platform',
      permissions: [
        'platform_overview',
        'user_management',
        'shelter_management',
        'financial_oversight',
        'analytics_access',
        'notification_management',
        'platform_settings',
        'security_monitoring',
        'knowledge_base_access',
        'contact_inquiries'
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: null,
      profilePicture: null,
      bio: 'Marketing, Outreach & Shelter Partnerships Specialist',
      title: 'Director of Shelter Partnerships & Grants',
      organization: 'SHELTR',
      ndaRequired: true,
      ndaSigned: false,
      specialization: 'shelter-outreach-grants-fundraising'
    };

    await db.collection('users').doc(userRecord.uid).set(userData);
    console.log(`   ✅ Created Firestore user document`);

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'platform_admin',
      tenant_id: 'platform',
      permissions: userData.permissions
    });
    console.log(`   ✅ Set custom claims`);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 SUCCESS! Christine Savard re-registered as Platform Administrator');
    console.log('='.repeat(60));
    console.log(`\n📧 Email: ${email}`);
    // Security: Do not log passwords in plain text
    console.log(`🔑 Password: [REDACTED - Check secure output below]`);
    console.log(`👤 UID: ${userRecord.uid}`);
    console.log(`🎯 Role: platform_admin`);
    console.log(`🏢 Specialization: Shelter Outreach & Grants`);
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  IMPORTANT: This password will only be displayed once!');
    console.log('   Please share it securely with Christine and ask her to change it on first login.');
    console.log('   Login URL: https://sheltr-ai.web.app/login');
    // Output password to stderr (less likely to be logged) with clear warning
    console.error('\n🔐 SECURE PASSWORD OUTPUT (DO NOT LOG):');
    console.error(`   Password: ${newPassword}`);
    console.error('   ⚠️  This is sensitive information - handle with care!');
    console.log('   Founders Portal: https://sheltr-ai.web.app/portal');
    console.log('\n✨ COMPLETED! Christine Savard re-registered successfully.');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during re-registration:', error);
    process.exit(1);
  }
};

reRegisterChristine();

