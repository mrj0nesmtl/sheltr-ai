#!/usr/bin/env node

const admin = require('firebase-admin');

try {
  // Initialize Firebase Admin SDK using application default credentials
  admin.initializeApp({
    projectId: 'sheltr-ai',
    databaseURL: 'https://sheltr-ai-default-rtdb.firebaseio.com'
  });
} catch (error) {
  console.error('❌ Error initializing Firebase:', error.message);
  console.log('💡 Make sure you are logged in with: firebase login');
  process.exit(1);
}

const db = admin.firestore();

async function queryUsers() {
  try {
    console.log('🔍 Querying Firebase users collection...\n');
    
    // Get all users from the users collection
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('❌ No users found in the database.');
      return;
    }
    
    console.log(`✅ Found ${usersSnapshot.size} users:\n`);
    console.log('='.repeat(80));
    
    usersSnapshot.forEach((doc, index) => {
      const userData = doc.data();
      console.log(`${index + 1}. User ID: ${doc.id}`);
      console.log(`   Email: ${userData.email || 'N/A'}`);
      console.log(`   Role: ${userData.role || 'N/A'}`);
      console.log(`   Name: ${userData.firstName || ''} ${userData.lastName || ''}`);
      console.log(`   Status: ${userData.status || 'N/A'}`);
      console.log(`   Created: ${userData.createdAt || 'N/A'}`);
      console.log(`   Last Login: ${userData.lastLoginAt || 'N/A'}`);
      console.log(`   Profile Complete: ${userData.profileComplete || false}`);
      console.log('   ---');
    });
    
    // Summary by role
    const roleCount = {};
    usersSnapshot.forEach(doc => {
      const role = doc.data().role || 'undefined';
      roleCount[role] = (roleCount[role] || 0) + 1;
    });
    
    console.log('\n📊 Summary by Role:');
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} users`);
    });
    
  } catch (error) {
    console.error('❌ Error querying users:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 Tip: Make sure you have Firestore read permissions.');
      console.log('   Try: firebase login');
    }
  } finally {
    // Close the connection
    process.exit(0);
  }
}

// Run the query
queryUsers(); 