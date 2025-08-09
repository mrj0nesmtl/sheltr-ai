#!/usr/bin/env node

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

async function debugUserShelter() {
  console.log('🔍 DEBUGGING SHELTER ADMIN ASSOCIATION');
  console.log('======================================\n');
  
  try {
    // Get all users to find shelteradmin
    const usersSnapshot = await db.collection('users').get();
    
    console.log('👥 ALL USERS:');
    usersSnapshot.docs.forEach(doc => {
      const user = doc.data();
      if (user.email === 'shelteradmin@example.com') {
        console.log(`\n🎯 FOUND SHELTER ADMIN:`);
        console.log(`   UID: ${doc.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   shelter_id: ${user.shelter_id || 'NOT SET'}`);
        console.log(`   tenant_id: ${user.tenant_id || 'NOT SET'}`);
        console.log(`   shelter_role: ${user.shelter_role || 'NOT SET'}`);
        console.log(`   Status: ${user.status}`);
      }
    });
    
    // Get all shelters
    console.log(`\n\n🏠 ALL SHELTERS:`);
    const sheltersSnapshot = await db.collection('shelters').get();
    sheltersSnapshot.docs.forEach((doc, index) => {
      const shelter = doc.data();
      console.log(`\n   ${index + 1}. ID: ${doc.id}`);
      console.log(`      Name: ${shelter.name}`);
      console.log(`      Status: ${shelter.status}`);
      console.log(`      Primary Admin: ${shelter.primary_admin?.email || 'None'}`);
    });
    
    // Find Old Brewery Mission specifically
    const oldBrewery = sheltersSnapshot.docs.find(doc => 
      doc.data().name.includes('Old Brewery Mission')
    );
    
    if (oldBrewery) {
      console.log(`\n\n🎯 OLD BREWERY MISSION DETAILS:`);
      const shelterData = oldBrewery.data();
      console.log(`   ID: ${oldBrewery.id}`);
      console.log(`   Name: ${shelterData.name}`);
      console.log(`   Status: ${shelterData.status}`);
      console.log(`   Primary Admin Email: ${shelterData.primary_admin?.email || 'None'}`);
      console.log(`   Primary Admin User ID: ${shelterData.primary_admin?.user_id || 'None'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

debugUserShelter();
