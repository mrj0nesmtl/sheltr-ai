#!/usr/bin/env node

/**
 * Quick wipe of remaining notification collections
 */

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

async function quickDelete(collectionName) {
  const batch = db.batch();
  const snapshot = await db.collection(collectionName).limit(500).get();
  
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  return snapshot.docs.length;
}

async function main() {
  console.log('🗑️  Quick cleanup of remaining notifications...\n');
  
  const collections = ['participant_notifications', 'message_notifications'];
  
  for (const col of collections) {
    let total = 0;
    let deleted = 0;
    
    do {
      deleted = await quickDelete(col);
      total += deleted;
      if (deleted > 0) {
        process.stdout.write(`  ${col}: ${total} deleted...\r`);
      }
    } while (deleted > 0);
    
    console.log(`  ${col}: ${total} deleted ✅`);
  }
  
  console.log('\n✅ Cleanup complete!\n');
  process.exit(0);
}

main().catch(console.error);

