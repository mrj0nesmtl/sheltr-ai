#!/usr/bin/env node

/**
 * Fix Michael Rodriguez's Firebase Auth custom claims
 * Add "participant" role so he can query his own notifications
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
try {
  const serviceAccountPath = path.join(__dirname, '../apps/api/service-account-key.json');
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin initialized\n');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

const michaelUID = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1';

async function fixMichaelCustomClaims() {
  console.log('🔧 Fixing Michael Rodriguez Firebase Auth Custom Claims\n');
  
  try {
    // 1. Get current user from Auth
    const user = await admin.auth().getUser(michaelUID);
    console.log('1️⃣ Current Auth User:');
    console.log(`   UID: ${user.uid}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Display Name: ${user.displayName}`);
    console.log(`   Custom Claims: ${JSON.stringify(user.customClaims || {}, null, 2)}`);
    
    // 2. Set custom claims
    console.log('\n2️⃣ Setting custom claims...');
    const customClaims = {
      role: 'participant',
      tenant: 'sheltr-platform'
    };
    
    await admin.auth().setCustomUserClaims(user.uid, customClaims);
    console.log('✅ Custom claims set successfully');
    
    // 3. Verify claims were set
    const updatedUser = await admin.auth().getUser(michaelUID);
    console.log('\n3️⃣ Updated Auth User:');
    console.log(`   Custom Claims: ${JSON.stringify(updatedUser.customClaims || {}, null, 2)}`);
    
    console.log('\n✅ SUCCESS! Michael Rodriguez can now:');
    console.log('   - Query his own participant_notifications');
    console.log('   - Read his own notifications');
    console.log('   - Access participant dashboard features');
    console.log('\n⚠️  IMPORTANT: Michael needs to:');
    console.log('   1. Log out completely');
    console.log('   2. Clear browser cache/cookies');
    console.log('   3. Log back in');
    console.log('   4. Go to: http://localhost:3000/dashboard/participant/notifications');
    console.log('   5. Should see test notification!');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

fixMichaelCustomClaims()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

