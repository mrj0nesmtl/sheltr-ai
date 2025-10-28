#!/usr/bin/env node

/**
 * Debug Donor & Participant Notifications
 * 
 * This script checks:
 * 1. Firebase indexes status
 * 2. Notification documents in Firestore
 * 3. User UIDs for Jane and Michael
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

async function debugNotifications() {
  console.log('🔍 DEBUGGING DONOR & PARTICIPANT NOTIFICATIONS');
  console.log('='.repeat(60));
  console.log('');

  // 1. Get Jane Supporter's UID
  console.log('1️⃣ Finding Jane Supporter (Donor)...');
  try {
    const janeQuery = await db.collection('users')
      .where('email', '==', 'donor@example.com')
      .limit(1)
      .get();
    
    if (janeQuery.empty) {
      console.log('❌ Jane Supporter not found');
    } else {
      const janeDoc = janeQuery.docs[0];
      const janeData = janeDoc.data();
      console.log('✅ Jane Supporter found:');
      console.log(`   UID: ${janeDoc.id}`);
      console.log(`   Email: ${janeData.email}`);
      console.log(`   Role: ${janeData.role}`);
      console.log('');

      // Check Jane's notifications
      console.log('2️⃣ Checking Jane\'s donor notifications...');
      const janeNotifications = await db.collection('donor_notifications')
        .where('userId', '==', janeDoc.id)
        .orderBy('created_at', 'desc')
        .limit(10)
        .get();
      
      console.log(`   Found ${janeNotifications.size} notifications`);
      if (!janeNotifications.empty) {
        janeNotifications.forEach(doc => {
          const data = doc.data();
          console.log(`   - ${doc.id}:`);
          console.log(`     Title: ${data.title}`);
          console.log(`     Type: ${data.type}`);
          console.log(`     Read: ${data.isRead}`);
          console.log(`     Created: ${data.created_at?.toDate()}`);
        });
      } else {
        console.log('   ⚠️ No notifications found for Jane');
      }
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error querying Jane:', error.message);
    if (error.code === 9) {
      console.log('   ⚠️ INDEX MISSING OR STILL BUILDING');
      console.log('   Visit: https://console.firebase.google.com/project/sheltr-ai/firestore/indexes');
    }
  }

  // 3. Get Michael Rodriguez's UID
  console.log('3️⃣ Finding Michael Rodriguez (Participant)...');
  try {
    const michaelQuery = await db.collection('users')
      .where('email', '==', 'participant@example.com')
      .limit(1)
      .get();
    
    if (michaelQuery.empty) {
      console.log('❌ Michael Rodriguez not found');
    } else {
      const michaelDoc = michaelQuery.docs[0];
      const michaelData = michaelDoc.data();
      console.log('✅ Michael Rodriguez found:');
      console.log(`   UID: ${michaelDoc.id}`);
      console.log(`   Email: ${michaelData.email}`);
      console.log(`   Role: ${michaelData.role}`);
      console.log('');

      // Check Michael's notifications
      console.log('4️⃣ Checking Michael\'s participant notifications...');
      const michaelNotifications = await db.collection('participant_notifications')
        .where('userId', '==', michaelDoc.id)
        .orderBy('created_at', 'desc')
        .limit(10)
        .get();
      
      console.log(`   Found ${michaelNotifications.size} notifications`);
      if (!michaelNotifications.empty) {
        michaelNotifications.forEach(doc => {
          const data = doc.data();
          console.log(`   - ${doc.id}:`);
          console.log(`     Title: ${data.title}`);
          console.log(`     Type: ${data.type}`);
          console.log(`     Read: ${data.isRead}`);
          console.log(`     Created: ${data.created_at?.toDate()}`);
        });
      } else {
        console.log('   ⚠️ No notifications found for Michael');
      }
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error querying Michael:', error.message);
    if (error.code === 9) {
      console.log('   ⚠️ INDEX MISSING OR STILL BUILDING');
      console.log('   Visit: https://console.firebase.google.com/project/sheltr-ai/firestore/indexes');
    }
  }

  // 5. Check recent demo donations
  console.log('5️⃣ Checking recent demo donations...');
  try {
    const recentDonations = await db.collection('demo_donations')
      .orderBy('created_at', 'desc')
      .limit(5)
      .get();
    
    console.log(`   Found ${recentDonations.size} recent donations`);
    if (!recentDonations.empty) {
      recentDonations.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${doc.id}:`);
        console.log(`     Amount: $${data.amount?.total || 'N/A'}`);
        console.log(`     Donor: ${data.donor_info?.name || 'Unknown'} (${data.donor_id})`);
        console.log(`     Participant: ${data.participant_name || 'Unknown'} (${data.participant_id})`);
        console.log(`     Created: ${data.created_at?.toDate() || 'Unknown'}`);
      });
    }
    console.log('');
  } catch (error) {
    console.error('❌ Error querying donations:', error.message);
  }

  // 6. Check all donor_notifications (regardless of userId)
  console.log('6️⃣ Checking ALL donor notifications...');
  try {
    const allDonorNotifications = await db.collection('donor_notifications')
      .limit(5)
      .get();
    
    console.log(`   Found ${allDonorNotifications.size} total donor notifications`);
    if (!allDonorNotifications.empty) {
      allDonorNotifications.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${doc.id}:`);
        console.log(`     UserId: ${data.userId}`);
        console.log(`     Title: ${data.title}`);
        console.log(`     Created: ${data.created_at?.toDate() || 'Unknown'}`);
      });
    } else {
      console.log('   ⚠️ NO donor notifications exist at all');
    }
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // 7. Check all participant_notifications (regardless of userId)
  console.log('7️⃣ Checking ALL participant notifications...');
  try {
    const allParticipantNotifications = await db.collection('participant_notifications')
      .limit(5)
      .get();
    
    console.log(`   Found ${allParticipantNotifications.size} total participant notifications`);
    if (!allParticipantNotifications.empty) {
      allParticipantNotifications.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${doc.id}:`);
        console.log(`     UserId: ${data.userId}`);
        console.log(`     Title: ${data.title}`);
        console.log(`     Created: ${data.created_at?.toDate() || 'Unknown'}`);
      });
    } else {
      console.log('   ⚠️ NO participant notifications exist at all');
    }
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('='.repeat(60));
  console.log('✅ Debug complete!');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('   1. If "INDEX MISSING" error: Wait 2-5 more minutes for indexes to build');
  console.log('   2. If NO notifications exist: Notifications are not being created');
  console.log('   3. If notifications exist but wrong userId: Fix the UID in notification creation');
  console.log('');
}

debugNotifications()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

