const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function analyzeFirestore() {
  console.log('🔍 SHELTR-AI Firestore Database Analysis');
  console.log('==========================================\n');

  try {
    // Analyze all root collections
    const collections = await db.listCollections();
    
    console.log('📊 ROOT COLLECTIONS FOUND:');
    console.log('---------------------------');
    collections.forEach(collection => {
      console.log(`- ${collection.id}`);
    });
    console.log('\n');

    // Detailed analysis of each collection
    for (const collection of collections) {
      await analyzeCollection(collection.id);
    }

  } catch (error) {
    console.error('❌ Error analyzing Firestore:', error);
  }
}

async function analyzeCollection(collectionName, parentPath = '') {
  const fullPath = parentPath ? `${parentPath}/${collectionName}` : collectionName;
  console.log(`📁 COLLECTION: ${fullPath}`);
  console.log('━'.repeat(50));

  try {
    const snapshot = await db.collection(fullPath).get();
    
    if (snapshot.empty) {
      console.log('   📭 Collection is empty\n');
      return;
    }

    console.log(`   📄 Documents found: ${snapshot.size}`);
    
    let documentCount = 0;
    for (const doc of snapshot.docs) {
      documentCount++;
      
      if (documentCount <= 5) { // Show details for first 5 docs
        console.log(`\n   📄 Document ID: ${doc.id}`);
        const data = doc.data();
        
        // Show field structure (not full data for privacy)
        const fields = Object.keys(data);
        console.log(`      Fields: [${fields.join(', ')}]`);
        
        // Show data types
        const fieldTypes = fields.map(field => {
          const value = data[field];
          let type = typeof value;
          if (value && typeof value === 'object') {
            if (value.constructor && value.constructor.name === 'Timestamp') {
              type = 'Timestamp';
            } else if (Array.isArray(value)) {
              type = 'Array';
            } else {
              type = 'Object';
            }
          }
          return `${field}: ${type}`;
        });
        console.log(`      Types: {${fieldTypes.join(', ')}}`);
        
        // Check for suspicious patterns
        if (doc.id.length > 20 && /^[a-zA-Z0-9]+$/.test(doc.id)) {
          console.log(`      ⚠️  SUSPICIOUS: Auto-generated ID pattern detected`);
        }
        
        if (fields.includes('platform') || fields.includes('shelter-')) {
          console.log(`      🔍 NOTABLE: Contains platform/shelter references`);
        }
      }
      
      // Check for subcollections
      const subcollections = await doc.ref.listCollections();
      if (subcollections.length > 0) {
        console.log(`\n   📁 Subcollections in ${doc.id}:`);
        for (const subcol of subcollections) {
          console.log(`      - ${subcol.id}`);
          
          // Recursively analyze subcollections
          await analyzeCollection(subcol.id, `${fullPath}/${doc.id}`);
        }
      }
    }
    
    if (documentCount > 5) {
      console.log(`   ... and ${documentCount - 5} more documents`);
    }
    
    console.log('\n');
    
  } catch (error) {
    console.error(`   ❌ Error analyzing collection ${fullPath}:`, error.message);
    console.log('\n');
  }
}

// Special analysis for the concerning tenants structure
async function analyzeTenantsProblem() {
  console.log('🚨 DETAILED TENANTS ANALYSIS');
  console.log('============================\n');
  
  try {
    const tenantsSnapshot = await db.collection('tenants').get();
    
    console.log('🔍 Root-level tenant documents:');
    tenantsSnapshot.docs.forEach(doc => {
      console.log(`   - ${doc.id}: ${JSON.stringify(doc.data(), null, 2).substring(0, 200)}...`);
    });
    
    console.log('\n🔍 Expected structure should be:');
    console.log('   tenants/{tenantId}/platform/shelters/{shelterId}');
    console.log('   NOT: tenants/{randomId} with platform data inside\n');
    
  } catch (error) {
    console.error('❌ Error in tenants analysis:', error);
  }
}

// Run the analysis
analyzeFirestore()
  .then(() => analyzeTenantsProblem())
  .then(() => {
    console.log('✅ Analysis complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }); 