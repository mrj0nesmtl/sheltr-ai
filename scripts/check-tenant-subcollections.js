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

async function checkTenantSubcollections() {
  console.log('🔍 CHECKING TENANT SUBCOLLECTIONS');
  console.log('==================================\n');

  try {
    // Get all tenant documents
    const tenantsSnapshot = await db.collection('tenants').get();
    
    for (const tenantDoc of tenantsSnapshot.docs) {
      console.log(`🏢 TENANT: ${tenantDoc.id}`);
      console.log(`   Name: ${tenantDoc.data().name}`);
      
      // Get all subcollections for this tenant
      const subcollections = await tenantDoc.ref.listCollections();
      
      if (subcollections.length === 0) {
        console.log('   📭 No subcollections found\n');
        continue;
      }
      
      console.log(`   📂 Subcollections (${subcollections.length}):`);
      
      for (const subcol of subcollections) {
        console.log(`      📁 ${subcol.id}/`);
        
        // Get documents in this subcollection
        const subDocs = await subcol.get();
        console.log(`         Documents: ${subDocs.size}`);
        
        // Show first few document IDs
        const docIds = subDocs.docs.slice(0, 5).map(doc => doc.id);
        if (docIds.length > 0) {
          console.log(`         Sample IDs: ${docIds.join(', ')}`);
          if (subDocs.size > 5) {
            console.log(`         ... and ${subDocs.size - 5} more`);
          }
        }
        
        // For platform subcollection, dive deeper
        if (subcol.id === 'platform') {
          console.log('\n      🔍 PLATFORM SUBCOLLECTION DETAILS:');
          
          for (const platformDoc of subDocs.docs) {
            console.log(`         📄 ${platformDoc.id}`);
            
            // Check for further subcollections
            const platformSubcols = await platformDoc.ref.listCollections();
            if (platformSubcols.length > 0) {
              for (const platSubcol of platformSubcols) {
                console.log(`            📁 ${platSubcol.id}/`);
                const platDocs = await platSubcol.get();
                console.log(`               Documents: ${platDocs.size}`);
                
                if (platSubcol.id === 'data') {
                  console.log('               🏠 SHELTER DATA:');
                  platDocs.docs.slice(0, 3).forEach(doc => {
                    const data = doc.data();
                    console.log(`                  - ${doc.id}: ${data.name || 'Unnamed'}`);
                  });
                  if (platDocs.size > 3) {
                    console.log(`                  ... and ${platDocs.size - 3} more shelters`);
                  }
                }
              }
            }
          }
        }
        
        console.log('');
      }
      
      console.log('');
    }

    // Also check what you might be seeing in the console
    console.log('🔍 WHAT YOU MIGHT BE SEEING IN FIREBASE CONSOLE:');
    console.log('=================================================\n');
    
    console.log('The Firebase Console UI sometimes shows nested paths in a flattened way.');
    console.log('When you navigate to tenants > [tenant-id], you might see:');
    console.log('');
    console.log('What the console shows     |  Actual Firestore path');
    console.log('---------------------------|--------------------------------');
    console.log('shelter-downtown-hope...   |  tenants/[id]/platform/shelters/data/shelter-downtown-hope...');
    console.log('shelter-old-brewery...     |  tenants/[id]/platform/shelters/data/shelter-old-brewery...');
    console.log('');
    console.log('These are NOT root-level documents in the tenants collection.');
    console.log('They are properly nested subcollection documents.');

  } catch (error) {
    console.error('❌ Error checking subcollections:', error);
    throw error;
  }
}

// Run the check
checkTenantSubcollections()
  .then(() => {
    console.log('\n✅ Tenant subcollection check complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Check failed:', error);
    process.exit(1);
  }); 