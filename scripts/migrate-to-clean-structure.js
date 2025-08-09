#!/usr/bin/env node

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

async function migrateToCleanStructure() {
  console.log('🚀 MIGRATING TO CLEAN DATABASE STRUCTURE');
  console.log('========================================\n');

  try {
    // STEP 1: Read Montreal shelters from messy structure
    console.log('📖 STEP 1: Reading Montreal shelters from messy structure...');
    const messyShelters = await db.collection('tenants')
      .doc('Vc48fjy0cajJrstbLQRr')
      .collection('platform')
      .doc('shelters')
      .collection('data')
      .get();

    console.log(`   Found ${messyShelters.size} shelters to migrate`);

    // STEP 2: Create clean shelter documents
    console.log('\n🏗️ STEP 2: Creating clean /shelters collection...');
    
    const batch = db.batch();
    const migratedShelters = [];

    messyShelters.docs.forEach((doc, index) => {
      const oldData = doc.data();
      
      // Create clean shelter ID (remove any special characters from name)
      const cleanId = oldData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Enhanced shelter structure
      const cleanShelter = {
        id: cleanId,
        name: oldData.name,
        address: oldData.address,
        city: extractCity(oldData.address),
        province: extractProvince(oldData.address),
        capacity: oldData.capacity || 0,
        status: 'active',
        contact: {
          phone: oldData.phone || null,
          email: oldData.email || null
        },
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        migrated_from: `tenants/Vc48fjy0cajJrstbLQRr/platform/shelters/data/${doc.id}`,
        original_id: doc.id
      };

      // Add to batch
      const newShelterRef = db.collection('shelters').doc(cleanId);
      batch.set(newShelterRef, cleanShelter);
      
      migratedShelters.push({
        oldId: doc.id,
        newId: cleanId,
        name: oldData.name,
        capacity: oldData.capacity
      });

      console.log(`   ${index + 1}. ${oldData.name} → /shelters/${cleanId}`);
    });

    // Commit the batch
    await batch.commit();
    console.log(`   ✅ Successfully migrated ${migratedShelters.length} shelters!`);

    // STEP 3: Select one shelter for testing and link test users
    console.log('\n👥 STEP 3: Linking test users to shelter...');
    
    // Use Old Brewery Mission (largest capacity) for testing
    const testShelter = migratedShelters.find(s => s.name.includes('Old Brewery Mission')) || migratedShelters[0];
    console.log(`   🏠 Selected test shelter: ${testShelter.name} (ID: ${testShelter.newId})`);

    // Update test admin user
    const adminUpdate = {
      shelter_id: testShelter.newId,
      tenant_id: `shelter-${testShelter.newId}`,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    // Update test participant user  
    const participantUpdate = {
      shelter_id: testShelter.newId,
      tenant_id: `shelter-${testShelter.newId}`,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    // Find and update the test users
    const usersSnapshot = await db.collection('users').get();
    let adminUpdated = false;
    let participantUpdated = false;

    const userBatch = db.batch();

    usersSnapshot.docs.forEach(doc => {
      const user = doc.data();
      
      if (user.email === 'shelteradmin@example.com' && !adminUpdated) {
        userBatch.update(doc.ref, adminUpdate);
        adminUpdated = true;
        console.log(`   👤 Linked admin: ${user.email} → ${testShelter.name}`);
      }
      
      if (user.email === 'participant@example.com' && !participantUpdated) {
        userBatch.update(doc.ref, participantUpdate);
        participantUpdated = true;
        console.log(`   👤 Linked participant: ${user.email} → ${testShelter.name}`);
      }
    });

    await userBatch.commit();

    // STEP 4: Update services to reference clean shelter IDs
    console.log('\n🔧 STEP 4: Updating services collection...');
    const servicesSnapshot = await db.collection('services').get();
    const servicesBatch = db.batch();
    let servicesUpdated = 0;

    servicesSnapshot.docs.forEach(doc => {
      const service = doc.data();
      
      // If service has old tenant_id format, update to new shelter_id
      if (service.tenant_id && service.tenant_id.includes('demo-shelter')) {
        servicesBatch.update(doc.ref, {
          shelter_id: testShelter.newId,
          tenant_id: `shelter-${testShelter.newId}`,
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
        servicesUpdated++;
      }
    });

    if (servicesUpdated > 0) {
      await servicesBatch.commit();
      console.log(`   ✅ Updated ${servicesUpdated} services with clean shelter references`);
    } else {
      console.log(`   ℹ️  No services needed updating`);
    }

    // STEP 5: Verification
    console.log('\n✅ STEP 5: Migration verification...');
    const newSheltersCount = await db.collection('shelters').get();
    console.log(`   📊 Clean shelters collection: ${newSheltersCount.size} documents`);
    
    const linkedUsers = await db.collection('users')
      .where('shelter_id', '==', testShelter.newId)
      .get();
    console.log(`   👥 Users linked to test shelter: ${linkedUsers.size}`);

    console.log('\n🎉 MIGRATION COMPLETE!');
    console.log('======================');
    console.log(`✅ Migrated: ${migratedShelters.length} shelters`);
    console.log(`✅ Test shelter: ${testShelter.name}`);
    console.log(`✅ Linked users: Admin + Participant`);
    console.log(`✅ Updated services: ${servicesUpdated}`);
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Update dashboard queries to use /shelters collection');
    console.log('2. Test shelter admin dashboard shows only their data');
    console.log('3. Clean up old messy tenant structure (optional)');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

// Helper functions
function extractCity(address) {
  if (!address) return 'Montreal';
  const parts = address.split(',');
  return parts.length >= 2 ? parts[1].trim() : 'Montreal';
}

function extractProvince(address) {
  if (!address) return 'QC';
  const parts = address.split(',');
  if (parts.length >= 3) {
    const provincePattern = /\b(QC|Quebec)\b/i;
    const match = parts[2].match(provincePattern);
    return match ? 'QC' : 'QC';
  }
  return 'QC';
}

migrateToCleanStructure();
