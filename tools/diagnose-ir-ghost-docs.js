/**
 * Diagnostic Script: Find Ghost Documents in IR Data Room
 * 
 * Purpose: Identify documents that are:
 * 1. Published to IR Data Room (published_to_ir: true)
 * 2. NOT visible in Founder Portal's 21 cards
 * 
 * Run with: node scripts/diagnose-ir-ghost-docs.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function diagnoseGhostDocuments() {
  console.log('\n🔍 DIAGNOSING IR DATA ROOM GHOST DOCUMENTS\n');
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Get all documents with published_to_ir: true
    console.log('\n📊 Step 1: Querying knowledge_documents for published_to_ir: true...\n');
    
    const irDocsSnapshot = await db.collection('knowledge_documents')
      .where('published_to_ir', '==', true)
      .where('status', '==', 'active')
      .get();
    
    console.log(`✅ Found ${irDocsSnapshot.size} documents with published_to_ir: true\n`);
    
    if (irDocsSnapshot.empty) {
      console.log('✅ SUCCESS: No documents are published to IR Data Room!');
      console.log('   The IR Data Room should be empty.\n');
      return;
    }
    
    // Step 2: List all ghost documents
    console.log('📋 Ghost Documents Found:\n');
    console.log('=' .repeat(60));
    
    const ghostDocs = [];
    
    irDocsSnapshot.forEach((doc) => {
      const data = doc.data();
      ghostDocs.push({
        id: doc.id,
        title: data.title || 'Untitled',
        badge: data.secure_badge || data.badge || 'N/A',
        published_to_founders: data.published_to_founders || false,
        published_to_ir: data.published_to_ir || false,
        source: data.source || 'unknown',
        created_at: data.created_at?.toDate?.() || 'unknown',
      });
      
      console.log(`\n📄 Document ID: ${doc.id}`);
      console.log(`   Title: ${data.title || 'Untitled'}`);
      console.log(`   Badge: ${data.secure_badge || data.badge || 'N/A'}`);
      console.log(`   Published to Founders: ${data.published_to_founders || false}`);
      console.log(`   Published to IR: ${data.published_to_ir || false}`);
      console.log(`   Source: ${data.source || 'unknown'}`);
      console.log(`   Created: ${data.created_at?.toDate?.() || 'unknown'}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log(`\n🎯 SUMMARY: ${ghostDocs.length} ghost documents found\n`);
    
    // Step 3: Offer solution
    console.log('💡 SOLUTION OPTIONS:\n');
    console.log('Option 1: Manual Cleanup (Recommended)');
    console.log('   - Review each document above');
    console.log('   - Decide which to keep vs delete');
    console.log('   - Use Firestore Console to delete unwanted docs\n');
    
    console.log('Option 2: Automated Cleanup (Nuclear Option)');
    console.log('   - Run: node scripts/clear-all-ir-docs.js');
    console.log('   - Sets ALL published_to_ir to false');
    console.log('   - Wipes IR Data Room completely\n');
    
    console.log('Option 3: Selective Cleanup');
    console.log('   - Edit this script to add doc IDs to delete');
    console.log('   - Uncomment the deletion code below\n');
    
    // Uncomment to enable automated deletion
    // console.log('\n⚠️  AUTOMATED DELETION DISABLED');
    // console.log('   To enable, uncomment the deletion code in this script\n');
    
    /*
    // DELETION CODE (UNCOMMENT TO ENABLE)
    const docsToDelete = [
      // Add document IDs here, e.g.:
      // 'document-id-1',
      // 'document-id-2',
    ];
    
    if (docsToDelete.length > 0) {
      console.log(`\n🗑️  Deleting ${docsToDelete.length} documents...\n`);
      
      const batch = db.batch();
      docsToDelete.forEach(docId => {
        const docRef = db.collection('knowledge_documents').doc(docId);
        batch.update(docRef, {
          published_to_ir: false,
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await batch.commit();
      console.log('✅ Deletion complete!\n');
    }
    */
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    // Close Firebase connection
    await admin.app().delete();
    console.log('\n✅ Diagnostic complete. Firebase connection closed.\n');
  }
}

// Run the diagnostic
diagnoseGhostDocuments();
