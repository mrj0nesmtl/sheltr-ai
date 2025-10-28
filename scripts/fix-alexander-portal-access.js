/**
 * Fix Alexander Kline Founders Portal Access
 * 
 * Issues to resolve:
 * 1. Account status: pending_nda → active
 * 2. Verify custom claims (role: platform_admin)
 * 3. Clear requirePasswordChange flag
 * 4. Ensure profile is complete
 */

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../apps/api/service-account-key.json'))
  });
}

const db = admin.firestore();

async function fixAlexanderPortalAccess() {
  console.log('🔧 Fixing Alexander Kline Founders Portal Access\n');
  console.log('==========================================\n');
  
  const userId = 'R4clxhAwBPP2KBwX7gDotjTcwzm1';
  const email = 'alexanderkline13@gmail.com';
  
  try {
    // Step 1: Check current Firebase Auth status
    console.log('📊 Step 1: Checking Firebase Auth...');
    const userRecord = await admin.auth().getUser(userId);
    console.log('   Email:', userRecord.email);
    console.log('   Disabled:', userRecord.disabled);
    console.log('   Email Verified:', userRecord.emailVerified);
    console.log('   Custom Claims:', JSON.stringify(userRecord.customClaims, null, 2));
    
    // Step 2: Verify role is set correctly
    const currentRole = userRecord.customClaims?.role;
    console.log('\n📊 Step 2: Verifying role...');
    console.log('   Current role:', currentRole);
    
    if (currentRole !== 'platform_admin' && currentRole !== 'super_admin') {
      console.log('   ⚠️  Role issue detected! Setting to platform_admin...');
      await admin.auth().setCustomUserClaims(userId, {
        ...userRecord.customClaims,
        role: 'platform_admin'
      });
      console.log('   ✅ Role updated to: platform_admin');
    } else {
      console.log('   ✅ Role is correct:', currentRole);
    }
    
    // Step 3: Check Firestore user document
    console.log('\n📊 Step 3: Checking Firestore document...');
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log('   ❌ User document not found!');
      return;
    }
    
    const userData = userDoc.data();
    console.log('   Status:', userData?.status);
    console.log('   Role:', userData?.role);
    console.log('   Require Password Change:', userData?.requirePasswordChange);
    console.log('   Profile Complete:', userData?.profileComplete);
    
    // Step 4: Update Firestore document
    console.log('\n🔧 Step 4: Updating Firestore document...');
    await db.collection('users').doc(userId).update({
      status: 'active',
      requirePasswordChange: false,
      profileComplete: true,
      emailVerified: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('   ✅ Firestore document updated!');
    
    // Step 5: Check founder access logs
    console.log('\n📊 Step 5: Checking recent founder access attempts...');
    const logsSnapshot = await db.collection('founder_access_logs')
      .where('email', '==', email)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();
    
    if (!logsSnapshot.empty) {
      console.log(`   Found ${logsSnapshot.size} recent attempts:`);
      logsSnapshot.docs.forEach((doc, index) => {
        const log = doc.data();
        console.log(`   ${index + 1}. ${log.success ? '✅' : '❌'} ${log.errorMessage || 'Success'} (${log.timestamp?.toDate?.()})`);
      });
    } else {
      console.log('   No recent access attempts found');
    }
    
    // Step 6: Final verification
    console.log('\n✅ Step 6: Final Verification');
    const updatedUserDoc = await db.collection('users').doc(userId).get();
    const updatedData = updatedUserDoc.data();
    const updatedAuthRecord = await admin.auth().getUser(userId);
    
    console.log('   Firebase Auth:');
    console.log('     - Disabled:', updatedAuthRecord.disabled);
    console.log('     - Email Verified:', updatedAuthRecord.emailVerified);
    console.log('     - Role:', updatedAuthRecord.customClaims?.role);
    
    console.log('   Firestore:');
    console.log('     - Status:', updatedData?.status);
    console.log('     - Require Password Change:', updatedData?.requirePasswordChange);
    console.log('     - Profile Complete:', updatedData?.profileComplete);
    
    console.log('\n==========================================');
    console.log('🎉 Alexander can now access the Founders Portal!');
    console.log('\n📝 Login Instructions for Alexander:');
    console.log('   1. Go to: https://sheltr-ai.web.app/portal/');
    console.log('   2. Enter email: alexanderkline13@gmail.com');
    console.log('   3. Enter password: (his existing password)');
    console.log('   4. Click "Access Founders Portal"');
    console.log('\n   OR');
    console.log('\n   1. Click "Continue with Google"');
    console.log('   2. Select his Gmail account');
    console.log('   3. Access granted automatically\n');
    
    console.log('⚠️  If still issues:');
    console.log('   1. Clear browser cache and cookies');
    console.log('   2. Try incognito/private window');
    console.log('   3. Try "Continue with Google" option');
    console.log('==========================================\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixAlexanderPortalAccess().then(() => process.exit(0));

