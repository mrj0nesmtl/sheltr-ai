#!/usr/bin/env node

const admin = require('firebase-admin');

// Initialize Firebase Admin with explicit project
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

async function findMontrealShelters() {
  console.log('🔍 SEARCHING FOR MONTREAL SHELTERS');
  console.log('==================================\n');

  try {
    // Explore the tenant structure based on your screenshots
    console.log('1. Exploring tenants collection:');
    const tenantsSnapshot = await db.collection('tenants').get();
    
    for (const tenantDoc of tenantsSnapshot.docs) {
      console.log(`\n📋 TENANT: ${tenantDoc.id}`);
      const tenantData = tenantDoc.data();
      console.log(`   Name: ${tenantData.name}`);
      console.log(`   Type: ${tenantData.type}`);
      
      // Check platform subcollection
      try {
        const platformSnapshot = await tenantDoc.ref.collection('platform').get();
        console.log(`   Platform docs: ${platformSnapshot.size}`);
        
        for (const platformDoc of platformSnapshot.docs) {
          console.log(`\n   🏢 Platform: ${platformDoc.id}`);
          
          // Check shelters subcollection
          try {
            const sheltersSnapshot = await platformDoc.ref.collection('shelters').get();
            console.log(`      Shelters: ${sheltersSnapshot.size}`);
            
            for (const shelterDoc of sheltersSnapshot.docs) {
              console.log(`\n      🏠 Shelter: ${shelterDoc.id}`);
              
              // Check data subcollection - this is where Montreal shelters should be
              try {
                const dataSnapshot = await shelterDoc.ref.collection('data').get();
                console.log(`         Data documents: ${dataSnapshot.size}`);
                
                if (dataSnapshot.size > 0) {
                  console.log(`\n         📊 SHELTER DATA FOUND:`);
                  console.log('         ' + '='.repeat(50));
                  
                  dataSnapshot.docs.forEach((dataDoc, index) => {
                    const shelter = dataDoc.data();
                    console.log(`\n         ${index + 1}. ID: ${dataDoc.id}`);
                    console.log(`            Name: ${shelter.name || 'N/A'}`);
                    console.log(`            Address: ${shelter.address || 'N/A'}`);
                    console.log(`            City: ${shelter.city || 'N/A'}`);
                    console.log(`            Province: ${shelter.province || 'N/A'}`);
                    console.log(`            Phone: ${shelter.phone || 'N/A'}`);
                    console.log(`            Status: ${shelter.status || 'N/A'}`);
                    console.log(`            Capacity: ${shelter.capacity || 'N/A'}`);
                    
                    // Check if this is Montreal data
                    if (shelter.city && shelter.city.toLowerCase().includes('montreal')) {
                      console.log(`            🇨🇦 MONTREAL SHELTER CONFIRMED!`);
                    }
                  });
                }
              } catch (error) {
                console.log(`         ❌ Error accessing data: ${error.message}`);
              }
            }
          } catch (error) {
            console.log(`      ❌ Error accessing shelters: ${error.message}`);
          }
        }
      } catch (error) {
        console.log(`   ❌ Error accessing platform: ${error.message}`);
      }
    }

    // Also check for any collection groups that might contain shelter data
    console.log('\n\n2. Using collection group queries to find shelter data:');
    try {
      const allShelterData = await db.collectionGroup('data').get();
      console.log(`\nFound ${allShelterData.size} documents in 'data' collections across all paths`);
      
      allShelterData.docs.forEach((doc, index) => {
        const data = doc.data();
        if (data.name && data.address) {
          console.log(`${index + 1}. ${data.name} - ${data.city || 'Unknown city'}`);
          console.log(`   Path: ${doc.ref.path}`);
        }
      });
    } catch (error) {
      console.log(`❌ Error with collection group: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    process.exit(0);
  }
}

findMontrealShelters();
