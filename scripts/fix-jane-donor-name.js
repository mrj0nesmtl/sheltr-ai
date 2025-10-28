/**
 * Fix Jane Supporter's display name in Firestore
 * UID: rWM6e8zfa5UoRVe5tHe6cldQkh32
 * Email: donor@example.com
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../apps/api/service-account-key.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fixJaneDonorName() {
  console.log('🔧 FIXING JANE SUPPORTER\'S DISPLAY NAME\n');
  console.log('================================================================================\n');
  
  const userId = 'rWM6e8zfa5UoRVe5tHe6cldQkh32';
  const correctName = 'Jane Supporter';
  
  try {
    // Get current user data
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    
    const currentData = userDoc.data();
    console.log('📋 Current User Data:\n');
    console.log(`   UID: ${userId}`);
    console.log(`   Email: ${currentData?.email}`);
    console.log(`   Current displayName: "${currentData?.displayName}"`);
    console.log(`   Current name: "${currentData?.name}"`);
    console.log(`   Current firstName: "${currentData?.firstName}"`);
    console.log(`   Current lastName: "${currentData?.lastName}"`);
    console.log(`   Role: ${currentData?.role}\n`);
    
    // Update user document with correct name
    await userRef.update({
      displayName: correctName,
      name: correctName,
      firstName: 'Jane',
      lastName: 'Supporter'
    });
    
    console.log('✅ Updated Firestore user document\n');
    
    // Also update Firebase Auth displayName
    try {
      await admin.auth().updateUser(userId, {
        displayName: correctName
      });
      console.log('✅ Updated Firebase Auth displayName\n');
    } catch (authError) {
      console.log('⚠️  Could not update Firebase Auth (this is OK if auth record doesn\'t exist)\n');
    }
    
    // Verify the update
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();
    
    console.log('================================================================================\n');
    console.log('✅ VERIFICATION - Updated User Data:\n');
    console.log(`   UID: ${userId}`);
    console.log(`   Email: ${updatedData?.email}`);
    console.log(`   displayName: "${updatedData?.displayName}"`);
    console.log(`   name: "${updatedData?.name}"`);
    console.log(`   firstName: "${updatedData?.firstName}"`);
    console.log(`   lastName: "${updatedData?.lastName}"`);
    console.log(`   Role: ${updatedData?.role}\n`);
    console.log('================================================================================\n');
    console.log('🎉 SUCCESS! Jane Supporter\'s name has been corrected.\n');
    console.log('Please log out and log back in to see the change on the homepage.\n');
    
  } catch (error) {
    console.error('❌ Error fixing name:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

fixJaneDonorName();

