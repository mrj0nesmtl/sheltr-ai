/**
 * Nuclear Option: Clear ALL Documents from IR Data Room
 * 
 * Purpose: Set published_to_ir: false for ALL documents in knowledge_documents
 * 
 * ⚠️  WARNING: This will wipe the IR Data Room completely!
 * 
 * Run with: node scripts/clear-all-ir-docs.js
 */

const admin = require('firebase-admin');
const path = require('path');
const readline = require('readline');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Create readline interface for confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askConfirmation(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function clearAllIRDocuments() {
  console.log('\n🚨 NUCLEAR OPTION: CLEAR ALL IR DATA ROOM DOCUMENTS\n');
  console.log('=' .repeat(60));
  console.log('\n⚠️  WARNING: This will:');
  console.log('   • Set published_to_ir: false for ALL documents');
  console.log('   • Wipe the IR Data Room completely');
  console.log('   • Cannot be undone (but you can re-toggle documents later)\n');
  
  try {
    // Step 1: Count documents
    const irDocsSnapshot = await db.collection('knowledge_documents')
      .where('published_to_ir', '==', true)
      .get();
    
    console.log(`📊 Found ${irDocsSnapshot.size} documents with published_to_ir: true\n`);
    
    if (irDocsSnapshot.empty) {
      console.log('✅ No documents to clear. IR Data Room is already empty.\n');
      rl.close();
      await admin.app().delete();
      return;
    }
    
    // Step 2: Ask for confirmation
    const confirmed = await askConfirmation(
      `\n❓ Are you sure you want to clear ${irDocsSnapshot.size} documents? (type 'yes' to confirm): `
    );
    
    if (!confirmed) {
      console.log('\n❌ Operation cancelled. No changes made.\n');
      rl.close();
      await admin.app().delete();
      return;
    }
    
    // Step 3: Clear all documents
    console.log('\n🗑️  Clearing IR Data Room...\n');
    
    const batch = db.batch();
    let count = 0;
    
    irDocsSnapshot.forEach((doc) => {
      const docRef = db.collection('knowledge_documents').doc(doc.id);
      batch.update(docRef, {
        published_to_ir: false,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      count++;
      console.log(`   ✓ Cleared: ${doc.data().title || doc.id}`);
    });
    
    await batch.commit();
    
    console.log(`\n✅ SUCCESS: Cleared ${count} documents from IR Data Room`);
    console.log('   All published_to_ir flags set to false\n');
    
    // Step 4: Verify
    const verifySnapshot = await db.collection('knowledge_documents')
      .where('published_to_ir', '==', true)
      .get();
    
    console.log(`📊 Verification: ${verifySnapshot.size} documents remaining with published_to_ir: true`);
    
    if (verifySnapshot.size === 0) {
      console.log('✅ IR Data Room is now completely empty!\n');
    } else {
      console.log('⚠️  Warning: Some documents still have published_to_ir: true\n');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    rl.close();
    await admin.app().delete();
    console.log('✅ Script complete. Firebase connection closed.\n');
  }
}

// Run the script
clearAllIRDocuments();
