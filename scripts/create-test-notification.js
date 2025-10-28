#!/usr/bin/env node

/**
 * Manually create a test notification to verify:
 * 1. Firestore rules allow creation
 * 2. Indexes are working
 * 3. Notifications can be queried
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

async function createTestNotifications() {
  console.log('🧪 Creating test notifications...\n');
  
  const janeUID = 'rWM6e8zfa5UoRVe5tHe6cldQkh32';
  const michaelUID = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1';
  
  try {
    // 1. Create donor notification for Jane
    console.log('1️⃣ Creating donor notification for Jane...');
    const donorNotificationRef = await db.collection('donor_notifications').add({
      userId: janeUID,
      type: 'donation_confirmation',
      title: 'Test Donation Confirmed! 🎉',
      message: 'Your $25 test donation to Michael Rodriguez has been confirmed.',
      priority: 'high',
      category: 'transaction',
      isRead: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        donation_id: 'test-donation-123',
        amount: 25,
        participant_name: 'Michael Rodriguez'
      }
    });
    console.log('✅ Donor notification created:', donorNotificationRef.id);
    
    // 2. Create participant notification for Michael
    console.log('\n2️⃣ Creating participant notification for Michael...');
    const participantNotificationRef = await db.collection('participant_notifications').add({
      userId: michaelUID,
      type: 'donation_received',
      title: 'Test Donation Received! 💰',
      message: 'You received a $25 test donation from Jane Supporter.',
      priority: 'high',
      category: 'donation',
      isRead: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        donation_id: 'test-donation-123',
        donor_name: 'Jane Supporter',
        amount: 25
      }
    });
    console.log('✅ Participant notification created:', participantNotificationRef.id);
    
    // 3. Try to query them back
    console.log('\n3️⃣ Querying notifications back...');
    
    const janeNotifications = await db.collection('donor_notifications')
      .where('userId', '==', janeUID)
      .orderBy('created_at', 'desc')
      .limit(5)
      .get();
    console.log(`✅ Found ${janeNotifications.size} notifications for Jane`);
    
    const michaelNotifications = await db.collection('participant_notifications')
      .where('userId', '==', michaelUID)
      .orderBy('created_at', 'desc')
      .limit(5)
      .get();
    console.log(`✅ Found ${michaelNotifications.size} notifications for Michael`);
    
    console.log('\n✅ Test notifications created successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Refresh Jane\'s dashboard: http://localhost:3000/dashboard/donor/notifications');
    console.log('   2. Refresh Michael\'s dashboard: http://localhost:3000/dashboard/participant/notifications');
    console.log('   3. You should see the test notifications');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error.code === 9) {
      console.log('\n⚠️ INDEX STILL BUILDING - Wait 2-5 more minutes');
      console.log('   Visit: https://console.firebase.google.com/project/sheltr-ai/firestore/indexes');
    } else if (error.code === 7) {
      console.log('\n⚠️ PERMISSION DENIED - Check Firestore rules');
    }
    process.exit(1);
  }
}

createTestNotifications()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

