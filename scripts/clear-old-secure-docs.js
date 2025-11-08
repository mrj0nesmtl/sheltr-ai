/**
 * Clear Old Secure Documents Collection
 * 
 * This script deletes ALL documents from the legacy `secure_documents` collection.
 * Run this BEFORE re-syncing secure documents to the new `knowledge_documents` collection.
 * 
 * Usage:
 *   node scripts/clear-old-secure-docs.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
let serviceAccount;
const possiblePaths = [
  path.join(__dirname, '../apps/api/service-account-key.json'),
  path.join(__dirname, '../service-account-key.json')
];

for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`✅ Using service account from: ${filePath}`);
    break;
  }
}

if (!serviceAccount) {
  console.error('❌ Service account file not found!');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearSecureDocumentsCollection() {
  console.log('\n🗑️  CLEARING OLD SECURE_DOCUMENTS COLLECTION\n');
  console.log('⚠️  This will DELETE ALL documents from the legacy secure_documents collection.');
  console.log('⚠️  These are old documents that need to be replaced with the new 7-folder structure.\n');

  try {
    // Get all documents from secure_documents collection
    const snapshot = await db.collection('secure_documents').get();
    
    if (snapshot.empty) {
      console.log('ℹ️  secure_documents collection is already empty. Nothing to delete.');
      return {
        success: true,
        deleted: 0,
        message: 'Collection already empty'
      };
    }

    console.log(`📊 Found ${snapshot.size} documents to delete\n`);
    
    // List documents before deletion
    console.log('📋 Documents to be deleted:');
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`   ${index + 1}. ${doc.id} - ${data.title || 'Untitled'}`);
    });
    
    console.log('\n⏳ Deleting documents...\n');
    
    // Delete all documents
    const batch = db.batch();
    let deleteCount = 0;
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      deleteCount++;
      
      if (deleteCount % 10 === 0) {
        console.log(`   ✅ Queued ${deleteCount}/${snapshot.size} documents for deletion`);
      }
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`\n✅ Successfully deleted ${deleteCount} documents from secure_documents collection!\n`);
    console.log('🎯 Next steps:');
    console.log('   1. Go to Knowledge Base Dashboard');
    console.log('   2. Click "Sync Secure Documents" (purple button)');
    console.log('   3. New documents will be synced with proper permissions and 7-folder structure\n');
    
    return {
      success: true,
      deleted: deleteCount,
      message: `Deleted ${deleteCount} old secure documents`
    };
    
  } catch (error) {
    console.error('❌ Error clearing secure_documents collection:', error);
    throw error;
  }
}

// Run the cleanup
clearSecureDocumentsCollection()
  .then(result => {
    console.log('✅ Cleanup complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  });

