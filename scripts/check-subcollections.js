const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkSubcollections() {
  console.log('🔍 CHECKING TENANT SUBCOLLECTIONS');
  console.log('=================================\n');

  try {
    const tenantsSnapshot = await db.collection('tenants').get();
    
    for (const tenantDoc of tenantsSnapshot.docs) {
      console.log(`📁 Tenant: ${tenantDoc.id}`);
      console.log(`   Data: ${JSON.stringify(tenantDoc.data(), null, 2).substring(0, 100)}...`);
      
      // Check for subcollections
      const subcollections = await tenantDoc.ref.listCollections();
      
      if (subcollections.length > 0) {
        console.log(`   📂 Subcollections found:`);
        
        for (const subcol of subcollections) {
          console.log(`      - ${subcol.id}`);
          
          // Get documents in subcollection
          const subDocs = await subcol.get();
          console.log(`        Documents: ${subDocs.size}`);
          
          if (subcol.id === 'platform') {
            console.log(`        🔍 PLATFORM SUBCOLLECTION DETAILS:`);
            
            for (const platformDoc of subDocs.docs) {
              console.log(`           📄 Doc: ${platformDoc.id}`);
              
              // Check for further subcollections (like shelters)
              const platformSubcols = await platformDoc.ref.listCollections();
              if (platformSubcols.length > 0) {
                console.log(`              📂 Platform subcollections:`);
                
                for (const platSubcol of platformSubcols) {
                  console.log(`                 - ${platSubcol.id}`);
                  const platSubDocs = await platSubcol.get();
                  console.log(`                   Documents: ${platSubDocs.size}`);
                  
                  if (platSubcol.id === 'shelters') {
                    console.log(`                   🏠 SHELTER DOCUMENTS:`);
                    for (const shelterDoc of platSubDocs.docs) {
                      const shelterData = shelterDoc.data();
                      console.log(`                      - ${shelterDoc.id}: ${shelterData.name || 'Unnamed'}`);
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        console.log(`   📭 No subcollections found`);
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Also check if there are any documents at the root level that shouldn't be there
async function checkRootStructure() {
  console.log('🚨 ROOT LEVEL STRUCTURE CHECK');
  console.log('=============================\n');
  
  try {
    // Check if there's a 'shelters' collection at root level
    const rootShelters = await db.collection('shelters').get();
    if (!rootShelters.empty) {
      console.log(`⚠️  Found ${rootShelters.size} documents in root 'shelters' collection`);
      console.log('   This might be the correct location, or they might need to be moved');
      
      rootShelters.docs.slice(0, 3).forEach(doc => {
        const data = doc.data();
        console.log(`   - ${doc.id}: ${data.name || 'Unnamed'} (${data.type || 'No type'})`);
      });
    } else {
      console.log('✅ No root-level shelters collection found');
    }
    
    // Check for platform collection at root
    const rootPlatform = await db.collection('platform').get();
    if (!rootPlatform.empty) {
      console.log(`⚠️  Found ${rootPlatform.size} documents in root 'platform' collection`);
      
      for (const doc of rootPlatform.docs) {
        console.log(`   - ${doc.id}`);
        
        // Check for subcollections in platform
        const platformSubcols = await doc.ref.listCollections();
        if (platformSubcols.length > 0) {
          console.log(`     Subcollections: ${platformSubcols.map(c => c.id).join(', ')}`);
          
          // Check shelters subcollection specifically
          if (platformSubcols.some(c => c.id === 'shelters')) {
            const sheltersInPlatform = await db.collection(`platform/${doc.id}/shelters`).get();
            console.log(`     📍 Found ${sheltersInPlatform.size} shelters in platform/${doc.id}/shelters`);
          }
        }
      }
    } else {
      console.log('✅ No root-level platform collection found');
    }
    
  } catch (error) {
    console.error('❌ Error checking root structure:', error);
  }
}

// Run the checks
checkSubcollections()
  .then(() => checkRootStructure())
  .then(() => {
    console.log('\n✅ Subcollection analysis complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }); 