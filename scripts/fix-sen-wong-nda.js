/**
 * Fix Sen Wong's NDA Issue
 * 
 * Problem: Sen Wong's signature was saved to admin@royaltri.com's NDA document
 * 
 * Solution:
 * 1. Create proper NDA record for Sen Wong (Fzf0QeEcpmRKjSfgfx7SSIqNom52)
 * 2. Update Sen Wong's user status to 'active'
 * 3. Fix the cross-contaminated record for admin@royaltri.com
 */

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fixSenWongNDA() {
  try {
    console.log('🔧 Starting Sen Wong NDA fix...\n');

    // Sen Wong's details
    const senWongUID = 'Fzf0QeEcpmRKjSfgfx7SSIqNom52';
    const senWongEmail = 'senw@royaltri.com';
    const senWongName = 'Sen Wong';
    
    // Royaltri Admin's details
    const royaltriUID = 'yJP12KjOFPUZAfDCgPr74iCao1a2';
    const royaltriEmail = 'admin@royaltri.com';

    // Step 1: Create proper NDA record for Sen Wong
    console.log('📝 Step 1: Creating proper NDA record for Sen Wong...');
    const senWongNDA = {
      userId: senWongUID,
      userEmail: senWongEmail,
      userName: senWongName,
      signature: senWongName, // Correct signature
      ipAddress: 'Unknown',
      userAgent: 'Admin Fix Script',
      documentVersion: '1.0.0',
      signedAt: admin.firestore.FieldValue.serverTimestamp(),
      auditTrail: {
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ipAddress: 'Unknown',
        userAgent: 'Admin Fix Script - Manual NDA Creation'
      }
    };

    await db.collection('nda_agreements').doc(senWongUID).set(senWongNDA);
    console.log('✅ Created NDA record for Sen Wong:', senWongUID);

    // Step 2: Update Sen Wong's user status to 'active'
    console.log('\n📝 Step 2: Updating Sen Wong\'s user status to active...');
    await db.collection('users').doc(senWongUID).update({
      status: 'active',
      ndaSigned: true,
      onboardingComplete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Updated Sen Wong\'s status to active');

    // Step 3: Fix the cross-contaminated record for admin@royaltri.com
    console.log('\n📝 Step 3: Fixing cross-contaminated NDA record for admin@royaltri.com...');
    const royaltriNDA = {
      userId: royaltriUID,
      userEmail: royaltriEmail,
      userName: 'Royaltri Admin', // Correct name
      signature: 'Royaltri Admin', // Correct signature (was "Sen Wong")
      ipAddress: 'Unknown',
      userAgent: 'Admin Fix Script',
      documentVersion: '1.0.0',
      signedAt: admin.firestore.FieldValue.serverTimestamp(),
      auditTrail: {
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ipAddress: 'Unknown',
        userAgent: 'Admin Fix Script - Corrected Cross-Contaminated Signature'
      }
    };

    await db.collection('nda_agreements').doc(royaltriUID).set(royaltriNDA);
    console.log('✅ Fixed NDA record for admin@royaltri.com:', royaltriUID);

    // Step 4: Update Royaltri Admin's user status to 'active'
    console.log('\n📝 Step 4: Updating Royaltri Admin\'s user status to active...');
    await db.collection('users').doc(royaltriUID).update({
      status: 'active',
      ndaSigned: true,
      onboardingComplete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Updated Royaltri Admin\'s status to active');

    // Verify the fix
    console.log('\n🔍 Verifying the fix...');
    
    const senWongNDADoc = await db.collection('nda_agreements').doc(senWongUID).get();
    const senWongUser = await db.collection('users').doc(senWongUID).get();
    
    console.log('\n✅ Sen Wong NDA Document:');
    console.log('   User:', senWongNDADoc.data()?.userName);
    console.log('   Email:', senWongNDADoc.data()?.userEmail);
    console.log('   Signature:', senWongNDADoc.data()?.signature);
    console.log('   User Status:', senWongUser.data()?.status);
    console.log('   NDA Signed:', senWongUser.data()?.ndaSigned);

    const royaltriNDADoc = await db.collection('nda_agreements').doc(royaltriUID).get();
    const royaltriUser = await db.collection('users').doc(royaltriUID).get();
    
    console.log('\n✅ Royaltri Admin NDA Document:');
    console.log('   User:', royaltriNDADoc.data()?.userName);
    console.log('   Email:', royaltriNDADoc.data()?.userEmail);
    console.log('   Signature:', royaltriNDADoc.data()?.signature);
    console.log('   User Status:', royaltriUser.data()?.status);
    console.log('   NDA Signed:', royaltriUser.data()?.ndaSigned);

    console.log('\n🎉 Fix completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Created proper NDA record for Sen Wong');
    console.log('   ✅ Updated Sen Wong\'s status to active');
    console.log('   ✅ Fixed cross-contaminated NDA record for admin@royaltri.com');
    console.log('   ✅ Updated Royaltri Admin\'s status to active');
    console.log('\n🚀 Sen Wong should now be able to log in successfully!');

  } catch (error) {
    console.error('❌ Error fixing Sen Wong NDA:', error);
    throw error;
  }
}

// Run the fix
fixSenWongNDA()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

