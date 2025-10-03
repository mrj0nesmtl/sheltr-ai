/**
 * Knowledge Base Clean Slate Script
 * 
 * This script DELETES ALL documents and chunks from the Knowledge Base.
 * USE WITH CAUTION - This is irreversible!
 * 
 * Usage: node scripts/delete-knowledge-base.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../apps/api/service-account-key.json'))
  });
}

const db = admin.firestore();

async function deleteKnowledgeBase() {
  console.log('🗑️  Knowledge Base Clean Slate Operation');
  console.log('==========================================\n');
  
  try {
    // Step 1: Get all knowledge documents
    console.log('📊 Step 1: Counting documents...');
    const docsSnapshot = await db.collection('knowledge_documents').get();
    const docCount = docsSnapshot.size;
    console.log(`   Found ${docCount} documents\n`);
    
    // Step 2: Get all knowledge chunks
    console.log('📊 Step 2: Counting chunks...');
    const chunksSnapshot = await db.collection('knowledge_chunks').get();
    const chunkCount = chunksSnapshot.size;
    console.log(`   Found ${chunkCount} chunks\n`);
    
    if (docCount === 0 && chunkCount === 0) {
      console.log('✅ Knowledge Base is already empty!');
      return;
    }
    
    // Confirm deletion
    console.log('⚠️  WARNING: This will DELETE:');
    console.log(`   - ${docCount} documents from knowledge_documents`);
    console.log(`   - ${chunkCount} chunks from knowledge_chunks`);
    console.log('   - All embeddings and metadata');
    console.log('\n   This action is IRREVERSIBLE!\n');
    
    // In automated mode, proceed without confirmation
    // If you want manual confirmation, comment out the next line and add readline
    const proceed = true;
    
    if (!proceed) {
      console.log('❌ Deletion cancelled.');
      return;
    }
    
    // Step 3: Delete all documents
    console.log('🗑️  Step 3: Deleting documents...');
    const docBatch = db.batch();
    let docDeleteCount = 0;
    
    for (const doc of docsSnapshot.docs) {
      docBatch.delete(doc.ref);
      docDeleteCount++;
      
      // Firestore batch limit is 500
      if (docDeleteCount % 500 === 0) {
        await docBatch.commit();
        console.log(`   Deleted ${docDeleteCount}/${docCount} documents...`);
      }
    }
    
    if (docDeleteCount % 500 !== 0) {
      await docBatch.commit();
    }
    console.log(`   ✅ Deleted ${docDeleteCount} documents\n`);
    
    // Step 4: Delete all chunks
    console.log('🗑️  Step 4: Deleting chunks...');
    const chunkBatch = db.batch();
    let chunkDeleteCount = 0;
    
    for (const chunk of chunksSnapshot.docs) {
      chunkBatch.delete(chunk.ref);
      chunkDeleteCount++;
      
      // Firestore batch limit is 500
      if (chunkDeleteCount % 500 === 0) {
        await chunkBatch.commit();
        console.log(`   Deleted ${chunkDeleteCount}/${chunkCount} chunks...`);
      }
    }
    
    if (chunkDeleteCount % 500 !== 0) {
      await chunkBatch.commit();
    }
    console.log(`   ✅ Deleted ${chunkDeleteCount} chunks\n`);
    
    // Step 5: Verify deletion
    console.log('🔍 Step 5: Verifying deletion...');
    const verifyDocs = await db.collection('knowledge_documents').get();
    const verifyChunks = await db.collection('knowledge_chunks').get();
    
    if (verifyDocs.empty && verifyChunks.empty) {
      console.log('   ✅ Knowledge Base is now empty!\n');
      console.log('==========================================');
      console.log('✨ Clean slate complete!');
      console.log('\n📝 Next Steps:');
      console.log('1. Restart your API server (to clear caches)');
      console.log('2. Go to http://localhost:3000/dashboard/knowledge');
      console.log('3. Click "Scan for Changes"');
      console.log('4. Review the scan results');
      console.log('5. Click "Sync X Files" to rebuild KB');
      console.log('\n⏱️  Embedding generation will take 10-15 minutes');
      console.log('==========================================\n');
    } else {
      console.log(`   ⚠️  Warning: ${verifyDocs.size} docs and ${verifyChunks.size} chunks still remain`);
    }
    
  } catch (error) {
    console.error('❌ Error during deletion:', error);
    process.exit(1);
  }
}

// Run the script
deleteKnowledgeBase().then(() => process.exit(0));

