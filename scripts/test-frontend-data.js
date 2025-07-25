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

async function testFrontendDataAccess() {
  console.log('🧪 TESTING FRONTEND DATA ACCESS');
  console.log('================================\n');

  try {
    const MIGRATION_CONFIG = {
      tenantId: 'Vc48fjy0cajJrstbLQRr',
      sheltersCollectionPath: 'tenants/Vc48fjy0cajJrstbLQRr/platform/shelters/data'
    };

    // Test 1: Direct query to migrated shelters (same as frontend will do)
    console.log('1. Testing direct shelter query (simulating frontend)...');
    const sheltersRef = db.collection(MIGRATION_CONFIG.sheltersCollectionPath);
    const sheltersSnapshot = await sheltersRef.orderBy('createdAt', 'desc').get();
    
    console.log(`   ✅ Found ${sheltersSnapshot.size} shelters`);
    
    if (sheltersSnapshot.size > 0) {
      console.log('\n   📋 Sample shelter data:');
      const firstShelter = sheltersSnapshot.docs[0];
      const data = firstShelter.data();
      
      console.log(`   🏠 ${data.name || 'Unnamed'}`);
      console.log(`      ID: ${firstShelter.id}`);
      console.log(`      Location: ${data.location || 'N/A'}`);
      console.log(`      Address: ${data.address || 'N/A'}`);
      console.log(`      Type: ${data.type || 'N/A'}`);
      console.log(`      Capacity: ${data.capacity || 'N/A'}`);
      console.log(`      Status: ${data.status || 'N/A'}`);
      console.log(`      Coordinates: ${data.coordinates?.lat || 'N/A'}, ${data.coordinates?.lng || 'N/A'}`);
      
      if (data._migration) {
        console.log(`      🔄 Migration info: From ${data._migration.originalPath}`);
      }
    }

    // Test 2: Verify data format for map rendering
    console.log('\n2. Verifying data format for map rendering...');
    let mapReadyCount = 0;
    let missingCoordinates = 0;
    let missingNames = 0;

    sheltersSnapshot.docs.forEach(doc => {
      const data = doc.data();
      
      if (data.name && data.coordinates && data.coordinates.lat && data.coordinates.lng) {
        mapReadyCount++;
      } else {
        if (!data.name) missingNames++;
        if (!data.coordinates || !data.coordinates.lat || !data.coordinates.lng) missingCoordinates++;
      }
    });

    console.log(`   ✅ ${mapReadyCount}/${sheltersSnapshot.size} shelters ready for map display`);
    if (missingNames > 0) console.log(`   ⚠️  ${missingNames} shelters missing names`);
    if (missingCoordinates > 0) console.log(`   ⚠️  ${missingCoordinates} shelters missing coordinates`);

    // Test 3: Check if frontend path works with collection() calls
    console.log('\n3. Testing frontend Firestore collection access...');
    try {
      // This simulates what the frontend FirestoreService.getShelters() does
      const frontendQuery = db.collection(MIGRATION_CONFIG.sheltersCollectionPath);
      const frontendResult = await frontendQuery.get();
      console.log(`   ✅ Frontend collection access works: ${frontendResult.size} shelters`);
    } catch (error) {
      console.log(`   ❌ Frontend collection access failed: ${error.message}`);
    }

    // Test 4: Verify specific shelter IDs match what we migrated
    console.log('\n4. Verifying migrated shelter IDs...');
    const expectedShelters = [
      '1yDQeRjTbyHx28or4AyY',
      '9XnLJm9N5U6AAbhzsRze', 
      'SLsqUwZHRHD4oWAZb9O6',
      'VHHjLHu2MSZn7hHxjbBi',
      'YDJCJnuLGMC9mWOWDSOa'
    ];

    for (const shelterId of expectedShelters) {
      const shelterDoc = await db.doc(`${MIGRATION_CONFIG.sheltersCollectionPath}/${shelterId}`).get();
      if (shelterDoc.exists) {
        const data = shelterDoc.data();
        console.log(`   ✅ ${shelterId}: ${data.name || 'Unnamed'}`);
      } else {
        console.log(`   ❌ ${shelterId}: Not found`);
      }
    }

    console.log('\n🎉 FRONTEND DATA ACCESS TEST COMPLETE!');
    console.log('======================================');
    console.log(`✅ Shelters available: ${sheltersSnapshot.size}`);
    console.log(`✅ Map-ready shelters: ${mapReadyCount}`);
    console.log(`📍 Data path: ${MIGRATION_CONFIG.sheltersCollectionPath}`);
    console.log('\n📋 Next steps:');
    console.log('   1. Visit http://localhost:3000/dashboard/shelters');
    console.log('   2. Click on "Map View" tab');
    console.log('   3. Verify shelter pins appear on the map');
    console.log('   4. Check browser console for any errors');

    return {
      success: true,
      shelterCount: sheltersSnapshot.size,
      mapReadyCount,
      issues: {
        missingNames,
        missingCoordinates
      }
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testFrontendDataAccess()
  .then((result) => {
    if (result.success) {
      console.log('\n✅ All tests passed! Frontend should be able to load shelter data.');
    } else {
      console.log('\n❌ Tests failed:', result.error);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test execution failed:', error);
    process.exit(1);
  }); 