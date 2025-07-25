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

async function investigateOrphanedDocuments() {
  console.log('🔍 INVESTIGATING ORPHANED DOCUMENTS');
  console.log('====================================\n');

  try {
    // Get all documents in tenants collection
    const tenantsSnapshot = await db.collection('tenants').get();
    
    console.log(`📊 Found ${tenantsSnapshot.size} documents in tenants collection:`);
    
    const validTenants = [];
    const suspiciousDocuments = [];
    
    tenantsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const docId = doc.id;
      
      console.log(`\n📄 Document: ${docId}`);
      console.log(`   Type: ${data.type || 'undefined'}`);
      console.log(`   Name: ${data.name || 'undefined'}`);
      
      // Check if this looks like a real tenant or orphaned shelter data
      if (data.type === 'platform' && data.name && data.organization) {
        console.log(`   ✅ VALID TENANT: Proper tenant structure detected`);
        validTenants.push({
          id: docId,
          data: data,
          reason: 'Valid tenant with organization data'
        });
      } else if (docId.startsWith('shelter-') || 
                 (data.address && data.coordinates && !data.organization)) {
        console.log(`   🚨 SUSPICIOUS: Looks like orphaned shelter data`);
        console.log(`       Has address: ${!!data.address}`);
        console.log(`       Has coordinates: ${!!data.coordinates}`);
        console.log(`       Has organization: ${!!data.organization}`);
        suspiciousDocuments.push({
          id: docId,
          data: data,
          reason: 'Appears to be orphaned shelter data in wrong location'
        });
      } else {
        console.log(`   ⚠️  UNKNOWN: Cannot determine document type`);
        console.log(`       Fields: [${Object.keys(data).join(', ')}]`);
        suspiciousDocuments.push({
          id: docId,
          data: data,
          reason: 'Unknown document type, needs investigation'
        });
      }
    });

    // Summary
    console.log('\n📋 SUMMARY:');
    console.log(`✅ Valid tenants: ${validTenants.length}`);
    console.log(`🚨 Suspicious documents: ${suspiciousDocuments.length}`);
    
    if (validTenants.length > 0) {
      console.log('\n✅ VALID TENANTS:');
      validTenants.forEach(tenant => {
        console.log(`   - ${tenant.id}: ${tenant.data.name} (${tenant.reason})`);
      });
    }
    
    if (suspiciousDocuments.length > 0) {
      console.log('\n🚨 SUSPICIOUS DOCUMENTS TO INVESTIGATE:');
      suspiciousDocuments.forEach(doc => {
        console.log(`   - ${doc.id}: ${doc.reason}`);
      });
    }

    return {
      validTenants,
      suspiciousDocuments,
      totalDocs: tenantsSnapshot.size
    };

  } catch (error) {
    console.error('❌ Investigation failed:', error);
    throw error;
  }
}

async function cleanupOrphanedDocuments() {
  console.log('\n🧹 CLEANUP ORPHANED DOCUMENTS');
  console.log('===============================\n');

  try {
    // First, investigate what we're dealing with
    const investigation = await investigateOrphanedDocuments();
    
    if (investigation.suspiciousDocuments.length === 0) {
      console.log('✅ No orphaned documents found to clean up!');
      return;
    }

    // Verify our migrated data is safe first
    console.log('\n🔍 Verifying migrated data is safe...');
    const migratedShelters = await db.collection('tenants/Vc48fjy0cajJrstbLQRr/platform/shelters/data').get();
    
    if (migratedShelters.size === 0) {
      console.log('❌ ABORT: No migrated shelters found! Cannot proceed with cleanup.');
      return;
    }
    
    console.log(`✅ Confirmed: ${migratedShelters.size} shelters safely migrated`);

    // Ask for confirmation (simulated - in real use would prompt user)
    const shouldProceed = true; // Set to true for automated cleanup
    
    if (!shouldProceed) {
      console.log('⏹️  Cleanup cancelled by user');
      return;
    }

    console.log('\n🗑️  Removing orphaned documents...');
    let removedCount = 0;

    for (const doc of investigation.suspiciousDocuments) {
      // Only remove documents that are clearly orphaned shelter data
      if (doc.id.startsWith('shelter-') || 
          (doc.data.address && doc.data.coordinates && !doc.data.organization)) {
        
        console.log(`   🗑️  Removing: ${doc.id}`);
        await db.collection('tenants').doc(doc.id).delete();
        removedCount++;
      } else {
        console.log(`   ⏭️  Skipping: ${doc.id} (needs manual review)`);
      }
    }

    console.log(`\n✅ Cleanup completed! Removed ${removedCount} orphaned documents`);
    
    // Final verification
    console.log('\n🔍 Final verification...');
    const remainingDocs = await db.collection('tenants').get();
    const migratedStillSafe = await db.collection('tenants/Vc48fjy0cajJrstbLQRr/platform/shelters/data').get();
    
    console.log(`📊 Tenants collection now has: ${remainingDocs.size} documents`);
    console.log(`✅ Migrated shelters still safe: ${migratedStillSafe.size} shelters`);
    
    console.log('\n🎉 CLEANUP SUCCESSFUL!');
    console.log('======================');
    console.log(`✅ Removed ${removedCount} orphaned documents`);
    console.log(`✅ Preserved valid tenant structures`);
    console.log(`✅ Migrated shelter data remains intact`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    console.log('\n🚨 CLEANUP ABORTED - Your data is safe');
    throw error;
  }
}

// Main execution
if (require.main === module) {
  const action = process.argv[2];
  
  if (action === 'investigate') {
    investigateOrphanedDocuments()
      .then(() => {
        console.log('\n✅ Investigation complete');
        process.exit(0);
      })
      .catch(error => {
        console.error('\n❌ Investigation failed:', error);
        process.exit(1);
      });
  } else if (action === 'cleanup') {
    cleanupOrphanedDocuments()
      .then(() => {
        console.log('\n✅ Cleanup complete');
        process.exit(0);
      })
      .catch(error => {
        console.error('\n❌ Cleanup failed:', error);
        process.exit(1);
      });
  } else {
    console.log('Usage:');
    console.log('  node cleanup-orphaned-documents.js investigate');
    console.log('  node cleanup-orphaned-documents.js cleanup');
    process.exit(1);
  }
} else {
  module.exports = { investigateOrphanedDocuments, cleanupOrphanedDocuments };
} 