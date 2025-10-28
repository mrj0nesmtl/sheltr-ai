#!/usr/bin/env node

/**
 * Find Sarah Manager's account and verify it's assigned to Old Brewery Mission
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
try {
  const serviceAccountPath = path.join(__dirname, '../apps/api/service-account-key.json');
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin initialized\n');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function findSarahManager() {
  console.log('🔍 FINDING SARAH MANAGER\n');
  
  try {
    // Search for users with "Sarah" in displayName
    const usersSnapshot = await db.collection('users')
      .where('role', '==', 'admin')
      .get();
    
    console.log(`Found ${usersSnapshot.size} admin users. Searching for Sarah...`);
    
    let sarahFound = false;
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.displayName?.includes('Sarah') || userData.email?.includes('sarah')) {
        sarahFound = true;
        console.log('\n✅ Found Sarah Manager:');
        console.log(`   UID: ${doc.id}`);
        console.log(`   Email: ${userData.email}`);
        console.log(`   Display Name: ${userData.displayName}`);
        console.log(`   Role: ${userData.role}`);
        console.log(`   Shelter ID: ${userData.shelter_id || 'NOT SET ❌'}`);
        
        if (userData.shelter_id !== 'old-brewery-mission') {
          console.log('\n⚠️ WARNING: Sarah is NOT assigned to Old Brewery Mission!');
          console.log(`   Current shelter: ${userData.shelter_id || 'none'}`);
          console.log(`   Expected: old-brewery-mission`);
        } else {
          console.log('\n✅ Sarah is correctly assigned to Old Brewery Mission!');
        }
      }
    });
    
    if (!sarahFound) {
      console.log('\n❌ Sarah Manager not found in database');
      console.log('\nShowing all admin users:');
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        console.log(`\n   - ${userData.displayName || userData.email}`);
        console.log(`     UID: ${doc.id}`);
        console.log(`     Email: ${userData.email}`);
        console.log(`     Shelter: ${userData.shelter_id || 'none'}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

findSarahManager()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

