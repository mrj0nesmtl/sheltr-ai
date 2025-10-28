/**
 * Clear Investor Data Room Documents
 * 
 * This script clears all documents from the secure_documents collection
 * to reset the investor data room state.
 * 
 * Usage: node scripts/clear-investor-dataroom.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearInvestorDataRoom() {
  try {
    console.log('🧹 Clearing investor data room documents...\n');

    // Get all documents from secure_documents collection
    const snapshot = await db.collection('secure_documents').get();
    
    console.log(`Found ${snapshot.size} documents in secure_documents collection`);

    if (snapshot.size === 0) {
      console.log('✅ No documents to clear!');
      return;
    }

    // Delete all documents
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log(`✅ Deleted ${snapshot.size} documents from secure_documents collection`);
    console.log('\n' + '='.repeat(60));
    console.log('✅ INVESTOR DATA ROOM CLEARED!');
    console.log('='.repeat(60));
    console.log('\nYou can now toggle documents ON in the Founders Portal.');
    console.log('');

  } catch (error) {
    console.error('\n❌ Error clearing investor data room:', error);
    process.exit(1);
  } finally {
    // Clean up
    await admin.app().delete();
  }
}

// Run the script
clearInvestorDataRoom();

