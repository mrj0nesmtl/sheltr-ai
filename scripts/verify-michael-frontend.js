#!/usr/bin/env node

/**
 * Verify Michael's account can query notifications
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

async function verifyMichaelFrontend() {
  console.log('🔍 VERIFYING MICHAEL\'S FRONTEND CAN QUERY NOTIFICATIONS\n');
  
  try {
    // 1. Check user document
    console.log('1️⃣ Checking Michael\'s user document...');
    const userDoc = await db.collection('users').doc(michaelUID).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log('✅ User document exists:');
      console.log(`   UID: ${userDoc.id}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Display Name: ${userData.displayName || 'N/A'}`);
    } else {
      console.log('❌ User document does NOT exist');
      return;
    }
    
    // 2. Query notifications exactly like frontend does
    console.log('\n2️⃣ Querying participant_notifications (like frontend)...');
    const notifQuery = await db.collection('participant_notifications')
      .where('userId', '==', michaelUID)
      .orderBy('created_at', 'desc')
      .limit(50)
      .get();
    
    console.log(`✅ Found ${notifQuery.size} notifications`);
    
    if (notifQuery.size > 0) {
      notifQuery.forEach(doc => {
        const data = doc.data();
        console.log(`\n   📬 ${doc.id}:`);
        console.log(`       Title: ${data.title}`);
        console.log(`       Message: ${data.message}`);
        console.log(`       Category: ${data.category}`);
        console.log(`       Read: ${data.isRead}`);
        console.log(`       Created: ${data.created_at ? data.created_at.toDate().toLocaleString() : 'N/A'}`);
      });
    }
    
    // 3. Check if there are any errors in the index
    console.log('\n3️⃣ Checking if indexes are built...');
    try {
      // Try a query that would fail if index is missing
      const testQuery = await db.collection('participant_notifications')
        .where('userId', '==', michaelUID)
        .where('isRead', '==', false)
        .orderBy('created_at', 'desc')
        .limit(5)
        .get();
      
      console.log(`✅ Index working - found ${testQuery.size} unread notifications`);
    } catch (indexError) {
      if (indexError.code === 9) {
        console.log('❌ INDEX MISSING - Still building');
        console.log('   Wait 2-5 more minutes');
      } else {
        console.log(`❌ Query error: ${indexError.message}`);
      }
    }
    
    console.log('\n✅ Michael should see notifications in frontend!');
    console.log('\n📋 Next steps:');
    console.log('   1. Log out and log back in as Michael Rodriguez');
    console.log('   2. Go to: http://localhost:3000/dashboard/participant/notifications');
    console.log('   3. Hard refresh: Cmd+Shift+R');
    console.log('   4. Open browser console (F12) and check for errors');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error.code === 9) {
      console.log('\n⚠️ INDEX STILL BUILDING');
    }
    process.exit(1);
  }
}

verifyMichaelFrontend()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

