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

async function deleteUserByEmail(email) {
  try {
    console.log(`🗑️  Deleting user: ${email}\n`);
    
    // Find all users with this email
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();
    
    if (usersSnapshot.empty) {
      console.log(`❌ No user found with email: ${email}`);
      return;
    }
    
    console.log(`📊 Found ${usersSnapshot.size} record(s) for ${email}:`);
    
    // Show what we're about to delete
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      console.log(`   🔍 ID: ${doc.id}`);
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   👤 Role: ${userData.role}`);
      console.log(`   🏷️  Name: ${userData.firstName} ${userData.lastName}`);
      console.log(`   ---`);
    });
    
    // Confirm deletion
    console.log(`\n⚠️  This will permanently delete ${usersSnapshot.size} record(s).`);
    console.log('🔄 Proceeding with deletion in 2 seconds...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Delete all matching records
    const batch = db.batch();
    usersSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`✅ Successfully deleted ${usersSnapshot.size} record(s) for ${email}`);
    
    // Show final count
    const finalSnapshot = await db.collection('users').get();
    console.log(`📊 Total users remaining: ${finalSnapshot.size}`);
    
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
  } finally {
    process.exit(0);
  }
}

// Get email from command line argument
const emailToDelete = process.argv[2];

if (!emailToDelete) {
  console.log('❌ Please provide an email address to delete');
  console.log('Usage: node delete-user.js <email>');
  console.log('Example: node delete-user.js david.donor@example.com');
  process.exit(1);
}

// Run the deletion
deleteUserByEmail(emailToDelete); 