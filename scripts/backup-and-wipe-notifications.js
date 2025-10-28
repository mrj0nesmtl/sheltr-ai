#!/usr/bin/env node

/**
 * SHELTR Notification Database Cleanup Script
 * 
 * This script:
 * 1. Exports current notification counts for backup
 * 2. Deletes all documents from notification collections
 * 3. Prepares for fresh notification system
 * 
 * Date: October 21, 2025
 * Session: Notification System Overhaul
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

// Collections to clean
const COLLECTIONS_TO_WIPE = [
  'admin_notifications',
  'participant_notifications',
  'message_notifications'
];

// Optional: Collections to archive but not delete
const COLLECTIONS_TO_KEEP = [
  'contact_inquiries',
  'newsletter_signups'
];

/**
 * Get count of documents in a collection
 */
async function getCollectionCount(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).count().get();
    return snapshot.data().count;
  } catch (error) {
    console.error(`Error counting ${collectionName}:`, error.message);
    return 0;
  }
}

/**
 * Delete all documents in a collection (in batches)
 */
async function deleteCollection(collectionName) {
  const collectionRef = db.collection(collectionName);
  const batchSize = 500;
  let deletedCount = 0;

  try {
    let query = collectionRef.limit(batchSize);

    return new Promise((resolve, reject) => {
      deleteQueryBatch(query, batchSize, deletedCount, resolve, reject);
    });
  } catch (error) {
    console.error(`Error deleting ${collectionName}:`, error.message);
    throw error;
  }
}

function deleteQueryBatch(query, batchSize, deletedCount, resolve, reject) {
  query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return deletedCount;
      }

      // Delete documents in a batch
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        deletedCount += snapshot.size;
        
        if (snapshot.size === 0) {
          resolve(deletedCount);
        } else {
          // Recurse on the next process tick, to avoid exploding the stack
          process.nextTick(() => {
            deleteQueryBatch(query, batchSize, deletedCount, resolve, reject);
          });
        }
      });
    })
    .catch(reject);
}

/**
 * Export backup data
 */
async function exportBackup() {
  const backup = {
    timestamp: new Date().toISOString(),
    date: 'October 21, 2025',
    reason: 'Notification System Overhaul - Clean Slate',
    collections: {}
  };

  console.log('\n📊 COLLECTING BACKUP DATA...\n');

  for (const collectionName of COLLECTIONS_TO_WIPE) {
    const count = await getCollectionCount(collectionName);
    backup.collections[collectionName] = {
      document_count: count,
      status: 'TO BE WIPED'
    };
    console.log(`  ${collectionName}: ${count} documents`);
  }

  for (const collectionName of COLLECTIONS_TO_KEEP) {
    const count = await getCollectionCount(collectionName);
    backup.collections[collectionName] = {
      document_count: count,
      status: 'KEEPING (NOT DELETED)'
    };
    console.log(`  ${collectionName}: ${count} documents (KEEPING)`);
  }

  // Save backup manifest
  const backupPath = path.join(__dirname, '../backups', `notification-backup-${Date.now()}.json`);
  
  // Ensure backups directory exists
  const backupsDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`\n✅ Backup manifest saved: ${backupPath}`);

  return backup;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔔 SHELTR NOTIFICATION DATABASE CLEANUP');
  console.log('=====================================');
  console.log('Date: October 21, 2025');
  console.log('Purpose: Notification System Overhaul\n');

  try {
    // Step 1: Export backup
    const backup = await exportBackup();

    // Step 2: Confirm deletion
    console.log('\n⚠️  WARNING: About to delete all documents from:');
    COLLECTIONS_TO_WIPE.forEach(col => {
      console.log(`  - ${col} (${backup.collections[col].document_count} documents)`);
    });
    console.log('\n⏳ Starting deletion in 3 seconds...\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 3: Delete collections
    console.log('🗑️  DELETING COLLECTIONS...\n');
    
    for (const collectionName of COLLECTIONS_TO_WIPE) {
      process.stdout.write(`  Deleting ${collectionName}... `);
      const deletedCount = await deleteCollection(collectionName);
      console.log(`✅ ${deletedCount} documents deleted`);
    }

    // Step 4: Verify deletion
    console.log('\n🔍 VERIFYING DELETION...\n');
    for (const collectionName of COLLECTIONS_TO_WIPE) {
      const count = await getCollectionCount(collectionName);
      console.log(`  ${collectionName}: ${count} documents remaining`);
    }

    console.log('\n✅ DATABASE CLEANUP COMPLETE!');
    console.log('=====================================');
    console.log('\n📋 NEXT STEPS:');
    console.log('  1. Create shelter_notifications collection');
    console.log('  2. Create donor_notifications collection');
    console.log('  3. Update notification services');
    console.log('  4. Redesign dashboard UI\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

// Run the script
main();

