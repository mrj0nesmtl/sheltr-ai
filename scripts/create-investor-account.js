/**
 * Create Demo Investor Account
 * 
 * This script creates a demo investor account for testing the investor data room.
 * 
 * Usage: node scripts/create-investor-account.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function createInvestorAccount() {
  const investorData = {
    email: 'investor@sheltr-demo.com',
    password: 'Investor2025!',
    displayName: 'Demo Investor',
    firstName: 'Demo',
    lastName: 'Investor',
    role: 'investor',
  };

  try {
    console.log('🚀 Creating investor account...\n');

    // Step 1: Create Firebase Auth user
    console.log('Step 1: Creating Firebase Auth user...');
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email: investorData.email,
        password: investorData.password,
        displayName: investorData.displayName,
        emailVerified: true, // Auto-verify for demo
      });
      console.log(`✅ Auth user created: ${userRecord.uid}`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('⚠️  User already exists, fetching existing user...');
        userRecord = await auth.getUserByEmail(investorData.email);
        console.log(`✅ Found existing user: ${userRecord.uid}`);
      } else {
        throw error;
      }
    }

    // Step 2: Set custom claims
    console.log('\nStep 2: Setting custom claims...');
    await auth.setCustomUserClaims(userRecord.uid, {
      role: investorData.role,
    });
    console.log(`✅ Custom claims set: role = ${investorData.role}`);

    // Step 3: Create Firestore user document
    console.log('\nStep 3: Creating Firestore user document...');
    const userDoc = {
      email: investorData.email,
      displayName: investorData.displayName,
      firstName: investorData.firstName,
      lastName: investorData.lastName,
      role: investorData.role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      emailVerified: true,
    };

    await db.collection('users').doc(userRecord.uid).set(userDoc, { merge: true });
    console.log('✅ Firestore user document created');

    // Success summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ INVESTOR ACCOUNT CREATED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📋 Account Details:');
    console.log(`   Email:        ${investorData.email}`);
    console.log(`   Password:     ${investorData.password}`);
    console.log(`   Display Name: ${investorData.displayName}`);
    console.log(`   Role:         ${investorData.role}`);
    console.log(`   UID:          ${userRecord.uid}`);
    console.log('\n🔗 Login URL:');
    console.log(`   Local:        http://localhost:3000/ir`);
    console.log(`   Production:   https://sheltr-ai.web.app/ir`);
    console.log('\n📂 Data Room URL:');
    console.log(`   Local:        http://localhost:3000/ir/dataroom`);
    console.log(`   Production:   https://sheltr-ai.web.app/ir/dataroom`);
    console.log('\n' + '='.repeat(60));
    console.log('\n✨ You can now log in with these credentials!');
    console.log('');

  } catch (error) {
    console.error('\n❌ Error creating investor account:', error);
    process.exit(1);
  } finally {
    // Clean up
    await admin.app().delete();
  }
}

// Run the script
createInvestorAccount();

