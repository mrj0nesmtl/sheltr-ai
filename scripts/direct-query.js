const admin = require('firebase-admin');

// Initialize Firebase Admin with explicit project
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

async function directQuery() {
  console.log('🔍 DIRECT FIRESTORE QUERIES');
  console.log('============================\n');

  try {
    // Try to access the exact paths shown in the screenshots
    console.log('1. Checking /platform collection:');
    try {
      const platformSnapshot = await db.collection('platform').get();
      console.log(`   Found ${platformSnapshot.size} documents`);
      platformSnapshot.docs.forEach(doc => {
        console.log(`   - ${doc.id}: ${Object.keys(doc.data())}`);
      });
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    console.log('\n2. Checking /shelters collection:');
    try {
      const sheltersSnapshot = await db.collection('shelters').get();
      console.log(`   Found ${sheltersSnapshot.size} documents`);
      sheltersSnapshot.docs.slice(0, 5).forEach(doc => {
        const data = doc.data();
        console.log(`   - ${doc.id}: ${data.name || 'Unnamed'}`);
      });
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    console.log('\n3. Checking /platform/shelters subcollection:');
    try {
      const platformSheltersSnapshot = await db.collectionGroup('shelters').get();
      console.log(`   Found ${platformSheltersSnapshot.size} shelters across all paths`);
      platformSheltersSnapshot.docs.slice(0, 5).forEach(doc => {
        const data = doc.data();
        console.log(`   - ${doc.ref.path}: ${data.name || 'Unnamed'}`);
      });
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    console.log('\n4. Checking document IDs from screenshots:');
    
    // These are the document IDs visible in your screenshots
    const suspiciousIds = [
      'Vc48fjy0cajJrstbLQRr',
      'jUOTh8Vhr8JX2CkAeZGi', 
      'shelter-downtown-hope-center',
      'shelter-old-brewery-mission',
      'shelter-union-gospel-mission',
      '9XnLJm9N5U6AAbhzsRze',
      'SLsqUwZHRHD4oWAZb906'
    ];

    for (const id of suspiciousIds) {
      console.log(`\n   Searching for document ID: ${id}`);
      
      // Search in tenants
      try {
        const tenantDoc = await db.collection('tenants').doc(id).get();
        if (tenantDoc.exists) {
          console.log(`     ✅ Found in /tenants/${id}`);
          const subcols = await tenantDoc.ref.listCollections();
          if (subcols.length > 0) {
            console.log(`        Subcollections: ${subcols.map(c => c.id).join(', ')}`);
          }
        }
      } catch (error) {
        console.log(`     ❌ Error in tenants: ${error.message}`);
      }

      // Search in platform
      try {
        const platformDoc = await db.collection('platform').doc(id).get();
        if (platformDoc.exists) {
          console.log(`     ✅ Found in /platform/${id}`);
        }
      } catch (error) {
        // Expected if collection doesn't exist
      }

      // Search in shelters
      try {
        const shelterDoc = await db.collection('shelters').doc(id).get();
        if (shelterDoc.exists) {
          console.log(`     ✅ Found in /shelters/${id}`);
        }
      } catch (error) {
        // Expected if collection doesn't exist
      }
    }

    console.log('\n5. Using collection group query to find ALL documents:');
    try {
      // This will find documents in any collection with these names
      const allCollections = await db.getCollections();
      console.log(`   Root collections: ${allCollections.map(c => c.id).join(', ')}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

directQuery()
  .then(() => {
    console.log('\n✅ Direct query complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }); 