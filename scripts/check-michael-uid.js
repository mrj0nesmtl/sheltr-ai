#!/usr/bin/env node

/**
 * Check Michael Rodriguez's actual UID vs what's in donations
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

const db = admin.firestore();

async function checkMichaelUID() {
  console.log('🔍 CHECKING MICHAEL RODRIGUEZ UID MISMATCH\n');
  
  try {
    // 1. Check what UID is logged in (from Firebase Auth)
    console.log('1️⃣ Checking Firebase Auth for Michael Rodriguez...');
    let authUsers = [];
    let pageToken;
    do {
      const listResult = await admin.auth().listUsers(1000, pageToken);
      authUsers = authUsers.concat(listResult.users);
      pageToken = listResult.pageToken;
    } while (pageToken);
    
    const michaelAuth = authUsers.find(u => 
      u.displayName?.toLowerCase().includes('michael') && 
      u.displayName?.toLowerCase().includes('rodriguez')
    );
    
    if (michaelAuth) {
      console.log(`✅ Found in Auth:`);
      console.log(`   UID: ${michaelAuth.uid}`);
      console.log(`   Email: ${michaelAuth.email}`);
      console.log(`   Display Name: ${michaelAuth.displayName}`);
    } else {
      console.log('❌ Not found in Firebase Auth');
    }
    
    // 2. Check Firestore users collection
    console.log('\n2️⃣ Checking Firestore users collection...');
    const usersSnapshot = await db.collection('users')
      .where('displayName', '>=', 'Michael')
      .where('displayName', '<=', 'Michael\uf8ff')
      .get();
    
    if (!usersSnapshot.empty) {
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.displayName?.toLowerCase().includes('rodriguez')) {
          console.log(`✅ Found in Firestore users:`);
          console.log(`   UID: ${doc.id}`);
          console.log(`   Email: ${data.email}`);
          console.log(`   Display Name: ${data.displayName}`);
          console.log(`   Role: ${data.role}`);
        }
      });
    } else {
      console.log('❌ Not found in Firestore users collection');
    }
    
    // 3. Check what UID is in recent donations
    console.log('\n3️⃣ Checking UID in recent donations...');
    const donationsSnapshot = await db.collection('donations')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    
    const participantUIDs = new Set();
    donationsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.participantName?.toLowerCase().includes('michael')) {
        participantUIDs.add(data.participantId);
        console.log(`   Donation ${doc.id}:`);
        console.log(`      Participant UID: ${data.participantId}`);
        console.log(`      Participant Name: ${data.participantName}`);
      }
    });
    
    // 4. Check participant_notifications collection
    console.log('\n4️⃣ Checking participant_notifications collection...');
    const notifSnapshot = await db.collection('participant_notifications').get();
    console.log(`   Total participant notifications: ${notifSnapshot.size}`);
    
    if (notifSnapshot.size > 0) {
      notifSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${doc.id}:`);
        console.log(`       userId: ${data.userId}`);
        console.log(`       title: ${data.title}`);
      });
    }
    
    // 5. Summary
    console.log('\n📋 SUMMARY:');
    console.log('============================================================');
    if (michaelAuth && participantUIDs.size > 0) {
      const donationUID = Array.from(participantUIDs)[0];
      if (michaelAuth.uid === donationUID) {
        console.log('✅ UIDs MATCH - Notifications should work');
      } else {
        console.log('❌ UID MISMATCH FOUND!');
        console.log(`   Auth UID: ${michaelAuth.uid}`);
        console.log(`   Donation UID: ${donationUID}`);
        console.log('   This is why notifications aren\'t showing!');
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

checkMichaelUID()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

