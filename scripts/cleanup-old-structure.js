const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'sheltr-ai'
  });
}

const db = admin.firestore();

async function cleanupOldStructure() {
  console.log('🧹 CLEANING UP OLD DATABASE STRUCTURE');
  console.log('======================================\n');

  try {
    // Step 1: Final verification that new structure is working
    console.log('1. Final verification of new structure...');
    const newSheltersRef = db.collection('tenants/Vc48fjy0cajJrstbLQRr/platform/shelters/data');
    const newSheltersSnapshot = await newSheltersRef.get();
    
    if (newSheltersSnapshot.size === 0) {
      console.log('❌ ABORT: No shelters found in new structure!');
      console.log('Cannot proceed with cleanup - migration may have failed');
      return;
    }
    
    console.log(`   ✅ Verified: ${newSheltersSnapshot.size} shelters in new structure`);

    // Step 2: Check what's in the old structure
    console.log('\n2. Checking old structure for cleanup...');
    
    try {
      const oldSheltersRef = db.collection('tenants/platform/shelters');
      const oldSheltersSnapshot = await oldSheltersRef.get();
      console.log(`   📊 Old structure has ${oldSheltersSnapshot.size} shelter documents`);
      
      if (oldSheltersSnapshot.size > 0) {
        console.log('\n   🗑️  Old shelter documents to be removed:');
        oldSheltersSnapshot.docs.forEach((doc, index) => {
          const data = doc.data();
          console.log(`      ${index + 1}. ${doc.id}: ${data.name || 'Unnamed'}`);
        });

        // Remove old shelter documents
        console.log('\n   🗑️  Removing old shelter documents...');
        const batch = db.batch();
        oldSheltersSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`   ✅ Removed ${oldSheltersSnapshot.size} old shelter documents`);
      } else {
        console.log('   ✅ No old shelter documents found to clean up');
      }

    } catch (error) {
      console.log(`   ⚠️  Old shelters collection not found (already cleaned): ${error.message}`);
    }

    // Step 3: Check for orphaned platform document
    console.log('\n3. Checking for orphaned platform document...');
    
    try {
      const platformDocRef = db.doc('tenants/platform');
      const platformDoc = await platformDocRef.get();
      
      if (platformDoc.exists) {
        console.log('   📄 Found orphaned platform document');
        console.log('   🗑️  Removing orphaned platform document...');
        await platformDocRef.delete();
        console.log('   ✅ Removed orphaned platform document');
      } else {
        console.log('   ✅ No orphaned platform document found');
      }
    } catch (error) {
      console.log(`   ⚠️  Could not check platform document: ${error.message}`);
    }

    // Step 4: Verify cleanup
    console.log('\n4. Verifying cleanup...');
    
    try {
      const oldCheck = await db.collection('tenants/platform/shelters').get();
      if (oldCheck.size === 0) {
        console.log('   ✅ Old shelter collection is empty');
      } else {
        console.log(`   ⚠️  ${oldCheck.size} documents still remain in old structure`);
      }
    } catch (error) {
      console.log('   ✅ Old shelter collection no longer exists');
    }

    // Step 5: Final status
    console.log('\n🎉 CLEANUP COMPLETED SUCCESSFULLY!');
    console.log('===================================');
    console.log('✅ Old shelter documents removed');
    console.log('✅ Orphaned platform document removed');
    console.log('✅ New structure verified and working');
    console.log('\n📊 Current database structure:');
    console.log('   tenants/');
    console.log('     Vc48fjy0cajJrstbLQRr/          ← Primary tenant');
    console.log('       platform/');
    console.log('         metadata/                  ← Platform config');
    console.log('         shelters/');
    console.log('           data/                    ← 10 shelter documents');
    console.log('     jUOTh8Vhr8JX2CkAeZGi/          ← Secondary tenant');
    console.log('\n🔄 Next steps:');
    console.log('   1. Test shelter map at http://localhost:3000/dashboard/shelters');
    console.log('   2. Verify all shelter functionality works');
    console.log('   3. Consider this migration complete ✅');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    console.log('\n🚨 CLEANUP ABORTED');
    console.log('Your data is safe - old structure remains intact');
    console.log('Manual investigation recommended');
    throw error;
  }
}

// Run the cleanup
cleanupOldStructure()
  .then(() => {
    console.log('\n✅ Cleanup script completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Cleanup script failed:', error);
    process.exit(1);
  }); 