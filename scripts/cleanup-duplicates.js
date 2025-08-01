#!/usr/bin/env node

const admin = require('firebase-admin');

try {
  admin.initializeApp({
    projectId: 'sheltr-ai',
    databaseURL: 'https://sheltr-ai-default-rtdb.firebaseio.com'
  });
} catch (error) {
  console.error('❌ Error initializing Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function cleanupDuplicates() {
  try {
    console.log('🧹 Starting duplicate cleanup process...\n');
    
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    console.log(`📊 Found ${usersSnapshot.size} total user records`);
    
    // Group users by email
    const usersByEmail = {};
    const allUsers = [];
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const email = userData.email;
      
      if (!email) {
        console.log(`⚠️  User ${doc.id} has no email, skipping...`);
        return;
      }
      
      const userRecord = {
        id: doc.id,
        email: email,
        data: userData,
        createdAt: userData.createdAt || userData.lastLoginAt || new Date('2024-01-01')
      };
      
      allUsers.push(userRecord);
      
      if (!usersByEmail[email]) {
        usersByEmail[email] = [];
      }
      usersByEmail[email].push(userRecord);
    });
    
    // Find duplicates
    const duplicateEmails = Object.keys(usersByEmail).filter(email => usersByEmail[email].length > 1);
    console.log(`🔍 Found ${duplicateEmails.length} emails with duplicates:`);
    
    let totalToDelete = 0;
    const deletionPlan = [];
    
    for (const email of duplicateEmails) {
      const duplicates = usersByEmail[email];
      console.log(`\n📧 ${email}: ${duplicates.length} entries`);
      
      // Sort by creation date (keep the most recent)
      duplicates.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : 
                     typeof a.createdAt === 'string' ? new Date(a.createdAt) : 
                     new Date(a.createdAt?.toDate?.() || '2024-01-01');
        const dateB = b.createdAt instanceof Date ? b.createdAt : 
                     typeof b.createdAt === 'string' ? new Date(b.createdAt) : 
                     new Date(b.createdAt?.toDate?.() || '2024-01-01');
        return dateB - dateA; // Most recent first
      });
      
      const keepRecord = duplicates[0];
      const deleteRecords = duplicates.slice(1);
      
      console.log(`   ✅ Keep: ${keepRecord.id} (Role: ${keepRecord.data.role || 'N/A'})`);
      deleteRecords.forEach(record => {
        console.log(`   🗑️  Delete: ${record.id} (Role: ${record.data.role || 'N/A'})`);
        deletionPlan.push(record.id);
        totalToDelete++;
      });
    }
    
    console.log(`\n📋 Deletion Plan:`);
    console.log(`   - Keep: ${Object.keys(usersByEmail).length} unique emails`);
    console.log(`   - Delete: ${totalToDelete} duplicate records`);
    
    if (totalToDelete === 0) {
      console.log('✅ No duplicates to clean up!');
      return;
    }
    
    // Confirm deletion
    console.log('\n⚠️  This will permanently delete the duplicate records.');
    console.log('🔄 Proceeding with deletion in 3 seconds...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Delete duplicates in batches
    const batchSize = 10;
    let deleted = 0;
    
    for (let i = 0; i < deletionPlan.length; i += batchSize) {
      const batch = db.batch();
      const batchIds = deletionPlan.slice(i, i + batchSize);
      
      for (const docId of batchIds) {
        batch.delete(db.collection('users').doc(docId));
      }
      
      await batch.commit();
      deleted += batchIds.length;
      console.log(`🗑️  Deleted batch ${Math.ceil((i + 1) / batchSize)}: ${deleted}/${totalToDelete} records`);
    }
    
    console.log(`\n✅ Cleanup complete! Deleted ${deleted} duplicate records.`);
    
    // Show final summary
    const finalSnapshot = await db.collection('users').get();
    console.log(`📊 Final user count: ${finalSnapshot.size} users`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    process.exit(0);
  }
}

// Run the cleanup
cleanupDuplicates(); 