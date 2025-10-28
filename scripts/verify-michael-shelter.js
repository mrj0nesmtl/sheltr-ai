#!/usr/bin/env node

/**
 * Verify Michael Rodriguez has shelter_id and find shelter admins
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
const michaelUID = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1';

async function verifyMichaelShelter() {
  console.log('🔍 VERIFYING MICHAEL RODRIGUEZ SHELTER SETUP\n');
  
  try {
    // 1. Get Michael's user document
    console.log('1️⃣ Checking Michael\'s user document...');
    const michaelDoc = await db.collection('users').doc(michaelUID).get();
    
    if (!michaelDoc.exists) {
      console.log('❌ Michael\'s user document NOT found');
      return;
    }
    
    const michaelData = michaelDoc.data();
    console.log('✅ Michael Rodriguez found:');
    console.log(`   UID: ${michaelDoc.id}`);
    console.log(`   Email: ${michaelData.email}`);
    console.log(`   Role: ${michaelData.role}`);
    console.log(`   Shelter ID: ${michaelData.shelter_id || 'NOT SET ❌'}`);
    
    if (!michaelData.shelter_id) {
      console.log('\n⚠️ WARNING: Michael has NO shelter_id!');
      console.log('   Shelter admins will NOT receive donation notifications');
      console.log('\n📋 To fix this, run:');
      console.log('   node scripts/assign-michael-to-shelter.js');
      return;
    }
    
    const shelterId = michaelData.shelter_id;
    
    // 2. Get shelter details
    console.log(`\n2️⃣ Getting shelter details for: ${shelterId}...`);
    const shelterDoc = await db.collection('shelters').doc(shelterId).get();
    
    if (shelterDoc.exists) {
      const shelterData = shelterDoc.data();
      console.log('✅ Shelter found:');
      console.log(`   Name: ${shelterData.name}`);
      console.log(`   Location: ${shelterData.location}`);
      console.log(`   Status: ${shelterData.status}`);
    } else {
      console.log(`❌ Shelter NOT found: ${shelterId}`);
    }
    
    // 3. Find shelter admins
    console.log(`\n3️⃣ Finding shelter admins for: ${shelterId}...`);
    const adminsSnapshot = await db.collection('users')
      .where('shelter_id', '==', shelterId)
      .where('role', '==', 'admin')
      .get();
    
    console.log(`✅ Found ${adminsSnapshot.size} shelter admin(s):`);
    
    if (adminsSnapshot.empty) {
      console.log('   ⚠️ NO shelter admins found!');
      console.log('   Donation notifications will NOT be sent to any shelter admin');
    } else {
      adminsSnapshot.forEach(doc => {
        const adminData = doc.data();
        console.log(`   - ${adminData.displayName || adminData.email} (${doc.id})`);
        console.log(`     Email: ${adminData.email}`);
        console.log(`     Role: ${adminData.role}`);
      });
    }
    
    // 4. Test notification query
    console.log(`\n4️⃣ Testing shelter_notifications query...`);
    const notificationsSnapshot = await db.collection('shelter_notifications')
      .orderBy('created_at', 'desc')
      .limit(5)
      .get();
    
    console.log(`✅ Found ${notificationsSnapshot.size} total shelter notifications`);
    
    if (!notificationsSnapshot.empty) {
      console.log('\n   Recent notifications:');
      notificationsSnapshot.forEach(doc => {
        const notif = doc.data();
        console.log(`   - ${notif.title}`);
        console.log(`     Recipient: ${notif.recipient_id}`);
        console.log(`     Category: ${notif.category}`);
      });
    }
    
    console.log('\n✅ SETUP VERIFIED!');
    console.log('\n📋 Summary:');
    console.log(`   - Michael Rodriguez: ${michaelUID}`);
    console.log(`   - Shelter: ${shelterId}`);
    console.log(`   - Shelter Admins: ${adminsSnapshot.size}`);
    console.log(`   - Total Shelter Notifications: ${notificationsSnapshot.size}`);
    
    console.log('\n🧪 Next steps:');
    console.log('   1. Make a test donation to Michael Rodriguez');
    console.log('   2. Check shelter admin dashboard for new notification');
    console.log('   3. Verify notification appears in real-time');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

verifyMichaelShelter()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

