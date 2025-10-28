#!/usr/bin/env node

/**
 * Initialize New Notification Collections
 * 
 * Creates:
 * 1. shelter_notifications collection
 * 2. donor_notifications collection
 * 
 * With proper schemas and sample test documents
 */

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

/**
 * Create shelter_notifications collection
 */
async function createShelterNotificationsCollection() {
  console.log('\n📦 Creating shelter_notifications collection...\n');
  
  // Sample shelter notification (for testing)
  const sampleShelterNotification = {
    type: 'system_message',
    title: 'Notification System Initialized',
    message: 'The SHELTR notification system has been successfully set up for your shelter.',
    priority: 'normal',
    category: 'system',
    shelter_id: 'test-shelter',
    tenant_id: 'test-tenant',
    recipient_id: 'placeholder', // Will be replaced with real shelter admin IDs
    isRead: false,
    created_at: admin.firestore.Timestamp.now(),
    data: {
      initialization_date: new Date().toISOString(),
      version: '2.0',
      features: ['participant_inquiries', 'donation_alerts', 'approval_requests']
    }
  };
  
  const docRef = await db.collection('shelter_notifications').add(sampleShelterNotification);
  console.log(`  ✅ Sample shelter notification created: ${docRef.id}`);
  
  return docRef.id;
}

/**
 * Create donor_notifications collection
 */
async function createDonorNotificationsCollection() {
  console.log('\n📦 Creating donor_notifications collection...\n');
  
  // Sample donor notification (for testing)
  const sampleDonorNotification = {
    type: 'system_message',
    title: 'Welcome to SHELTR Donor Notifications',
    message: 'You\'ll receive updates about your donations, tax receipts, and impact stories here.',
    priority: 'normal',
    category: 'system',
    userId: 'placeholder', // Will be replaced with real donor IDs
    isRead: false,
    created_at: admin.firestore.Timestamp.now(),
    metadata: {
      initialization_date: new Date().toISOString(),
      version: '2.0',
      features: ['donation_confirmations', 'receipt_generation', 'impact_updates', 'tax_documents']
    }
  };
  
  const docRef = await db.collection('donor_notifications').add(sampleDonorNotification);
  console.log(`  ✅ Sample donor notification created: ${docRef.id}`);
  
  return docRef.id;
}

/**
 * Verify collection creation
 */
async function verifyCollections() {
  console.log('\n🔍 Verifying new collections...\n');
  
  const collections = ['shelter_notifications', 'donor_notifications'];
  const results = {};
  
  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).count().get();
    const count = snapshot.data().count;
    results[collectionName] = count;
    console.log(`  ${collectionName}: ${count} documents`);
  }
  
  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔔 SHELTR NOTIFICATION COLLECTIONS INITIALIZATION');
  console.log('================================================');
  console.log('Date: October 21, 2025\n');
  
  try {
    // Create collections
    const shelterId = await createShelterNotificationsCollection();
    const donorId = await createDonorNotificationsCollection();
    
    // Verify
    const results = await verifyCollections();
    
    console.log('\n✅ INITIALIZATION COMPLETE!');
    console.log('================================================\n');
    console.log('📊 Summary:');
    console.log(`  - shelter_notifications: ${results.shelter_notifications} document(s)`);
    console.log(`  - donor_notifications: ${results.donor_notifications} document(s)`);
    console.log('\n📋 Next Steps:');
    console.log('  1. Update Firestore security rules');
    console.log('  2. Update notification services');
    console.log('  3. Create UI components');
    console.log('  4. Wire up public touchpoints\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

main();

