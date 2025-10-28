#!/usr/bin/env node

/**
 * Ensure Michael Rodriguez has a user document
 * Required for participant notifications to work
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

async function ensureMichaelUser() {
  console.log('🔧 Ensuring Michael Rodriguez has a user document...\n');
  
  const michaelUID = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1';
  
  try {
    // Check if user document exists
    const userDoc = await db.collection('users').doc(michaelUID).get();
    
    if (userDoc.exists) {
      console.log('✅ Michael Rodriguez user document already exists:');
      const data = userDoc.data();
      console.log(`   UID: ${michaelUID}`);
      console.log(`   Email: ${data.email}`);
      console.log(`   Role: ${data.role}`);
      console.log(`   Display Name: ${data.displayName || 'N/A'}`);
    } else {
      console.log('⚠️ Michael Rodriguez user document does NOT exist');
      console.log('📝 Creating user document...\n');
      
      // Create user document
      await db.collection('users').doc(michaelUID).set({
        uid: michaelUID,
        email: 'participant@example.com',
        displayName: 'Michael Rodriguez',
        firstName: 'Michael',
        lastName: 'Rodriguez',
        role: 'participant',
        status: 'active',
        shelter_id: 'old-brewery-mission',
        shelter_name: 'Old Brewery Mission',
        participant_slug: 'michael-rodriguez',
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
        
        // Participant-specific fields
        totalReceived: 1980,
        donation_count: 21,
        services_count: 8,
        
        // Profile
        bio: 'Working towards stable housing and career development',
        location: 'Montreal, QC',
        
        // Demo flag
        demo: true
      });
      
      console.log('✅ Created user document for Michael Rodriguez');
      console.log(`   UID: ${michaelUID}`);
      console.log(`   Email: participant@example.com`);
      console.log(`   Role: participant`);
    }
    
    console.log('\n✅ Michael Rodriguez is ready to receive notifications!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

ensureMichaelUser()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

