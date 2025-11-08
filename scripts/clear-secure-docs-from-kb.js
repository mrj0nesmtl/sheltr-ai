/**
 * Clear Secure Documents from Knowledge Base
 * Removes all documents from knowledge_documents where source_directory is set
 * This clears all secure documents synced from .local-secure-docs
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

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
  console.error('❌ Service account file not found');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearSecureDocs() {
  console.log('🗑️  Starting to clear secure documents from knowledge_documents collection...\n');

  try {
    // Query documents where source_directory is set (secure docs)
    const snapshot = await db.collection('knowledge_documents')
      .where('source_directory', '!=', null)
      .get();

    if (snapshot.empty) {
      console.log('✅ No secure documents found in knowledge_documents collection.');
      return;
    }

    console.log(`📝 Found ${snapshot.size} secure documents to delete:\n`);

    const batch = db.batch();
    let count = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${data.title} (source: ${data.source_directory})`);
      batch.delete(doc.ref);
      count++;
    });

    // Commit the batch delete
    await batch.commit();

    console.log(`\n✅ Successfully deleted ${count} secure documents from knowledge_documents.`);
    console.log('🔄 You can now re-run the secure document sync to sync only the 3 active directories.');

  } catch (error) {
    console.error('❌ Error clearing secure documents:', error);
    process.exit(1);
  }
}

clearSecureDocs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });

