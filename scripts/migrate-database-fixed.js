const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin (create new app to avoid conflicts)
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'sheltr-ai'
  });
}

const db = admin.firestore();

async function migrateSheltersSimple() {
  console.log('🚀 SIMPLIFIED SHELTER MIGRATION');
  console.log('================================\n');

  try {
    // Get current shelters from wrong location
    console.log('📋 Reading current shelters...');
    const currentShelters = await db.collectionGroup('shelters').get();
    
    console.log(`Found ${currentShelters.size} shelters to migrate`);
    
    // Choose primary tenant ID
    const primaryTenantId = 'Vc48fjy0cajJrstbLQRr';
    console.log(`🎯 Using primary tenant: ${primaryTenantId}\n`);

    // Create tenant document if it doesn't exist properly
    const tenantRef = db.collection('tenants').doc(primaryTenantId);
    const tenantDoc = await tenantRef.get();
    
    if (tenantDoc.exists) {
      console.log('✅ Tenant document exists');
    } else {
      console.log('📝 Creating tenant document...');
      await tenantRef.set({
        name: 'SHELTR Platform',
        type: 'platform',
        status: 'active',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
      });
    }

    // Create platform subcollection with metadata
    console.log('📁 Creating platform metadata...');
    const platformRef = db.collection('tenants').doc(primaryTenantId).collection('platform').doc('metadata');
    await platformRef.set({
      name: 'SHELTR Platform',
      version: '1.0.0',
      region: 'montreal',
      createdAt: admin.firestore.Timestamp.now(),
      settings: {
        features: ['shelter_mapping', 'user_management', 'analytics']
      }
    });

    // Migrate shelters to proper location
    console.log('\n🏠 Migrating shelters...');
    let migrated = 0;

    for (const shelterDoc of currentShelters.docs) {
      const shelterData = shelterDoc.data();
      const shelterId = shelterDoc.id;
      
      // Skip if this is already in the right location
      if (shelterDoc.ref.path.includes(`tenants/${primaryTenantId}/platform/shelters`)) {
        console.log(`   ⏭️  Skipping ${shelterData.name || shelterId} (already in correct location)`);
        continue;
      }

      // Create new shelter document in correct location
      const newShelterRef = db.collection('tenants')
        .doc(primaryTenantId)
        .collection('platform')
        .doc('shelters')  // This is the collection document
        .collection('data')  // Actual shelter data
        .doc(shelterId);

      // Add migration metadata
      const migratedData = {
        ...shelterData,
        _migration: {
          originalPath: shelterDoc.ref.path,
          migratedAt: admin.firestore.Timestamp.now(),
          migrationVersion: '1.0'
        }
      };

      await newShelterRef.set(migratedData);
      console.log(`   ✅ Migrated: ${shelterData.name || shelterId}`);
      migrated++;
    }

    console.log(`\n✅ Migration completed! Migrated ${migrated} shelters`);
    
    // Create config file for frontend
    const config = {
      tenantId: primaryTenantId,
      sheltersCollectionPath: `tenants/${primaryTenantId}/platform/shelters/data`,
      migratedAt: new Date().toISOString(),
      shelterCount: migrated
    };
    
    fs.writeFileSync('../migration-config.json', JSON.stringify(config, null, 2));
    console.log('📁 Created migration-config.json for frontend');

    // Verify migration
    console.log('\n🔍 Verifying migration...');
    const newShelters = await db.collection('tenants')
      .doc(primaryTenantId)
      .collection('platform')
      .doc('shelters')
      .collection('data')
      .get();
    
    console.log(`✅ Verification: Found ${newShelters.size} shelters in new location`);
    
    return config;

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateSheltersSimple()
  .then((config) => {
    console.log('\n🎉 MIGRATION SUCCESSFUL!');
    console.log('========================');
    console.log(`New path: ${config.sheltersCollectionPath}`);
    console.log(`Tenant ID: ${config.tenantId}`);
    console.log('\nNext: Update frontend to use new path');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }); 