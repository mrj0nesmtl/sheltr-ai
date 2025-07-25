const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

async function backupCurrentData() {
  console.log('📦 BACKING UP CURRENT DATA');
  console.log('===========================\n');

  const backup = {
    timestamp: new Date().toISOString(),
    collections: {}
  };

  try {
    // Backup current shelter data
    console.log('🏠 Backing up shelters from tenants/platform/shelters/...');
    const sheltersSnapshot = await db.collection('tenants/platform/shelters').get();
    backup.collections.shelters = sheltersSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data(),
      path: doc.ref.path
    }));
    console.log(`   ✅ Backed up ${backup.collections.shelters.length} shelters`);

    // Backup tenant documents
    console.log('🏢 Backing up tenant documents...');
    const tenantsSnapshot = await db.collection('tenants').get();
    backup.collections.tenants = [];
    
    for (const doc of tenantsSnapshot.docs) {
      const tenantData = {
        id: doc.id,
        data: doc.data(),
        path: doc.ref.path,
        subcollections: []
      };
      
      // Check for subcollections
      const subcols = await doc.ref.listCollections();
      for (const subcol of subcols) {
        const subDocs = await subcol.get();
        tenantData.subcollections.push({
          name: subcol.id,
          documents: subDocs.docs.map(subDoc => ({
            id: subDoc.id,
            data: subDoc.data(),
            path: subDoc.ref.path
          }))
        });
      }
      
      backup.collections.tenants.push(tenantData);
    }
    console.log(`   ✅ Backed up ${backup.collections.tenants.length} tenants`);

    // Save backup to file
    const backupFile = `./backup-${Date.now()}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`   ✅ Backup saved to: ${backupFile}\n`);
    
    return backup;
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

async function migrateShelters(backup) {
  console.log('🚚 MIGRATING SHELTER DATA');
  console.log('==========================\n');

  try {
    // Choose the primary tenant (first one that's not just "platform")
    const primaryTenant = backup.collections.tenants.find(t => 
      t.id !== 'platform' && t.data.type === 'platform'
    );
    
    if (!primaryTenant) {
      throw new Error('No valid primary tenant found');
    }

    const primaryTenantId = primaryTenant.id;
    console.log(`🎯 Using primary tenant: ${primaryTenantId}`);

    // Create the proper structure: tenants/{tenantId}/platform/{metadata}
    console.log('📁 Creating proper tenant structure...');
    
    // Add platform metadata document
    const platformMetadata = {
      name: 'SHELTR Platform',
      type: 'shelter_management',
      version: '1.0.0',
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      settings: {
        features: ['shelter_mapping', 'user_management', 'analytics'],
        region: 'montreal',
        timezone: 'America/Montreal'
      }
    };

    await db.collection(`tenants/${primaryTenantId}/platform`).doc('metadata').set(platformMetadata);
    console.log('   ✅ Created platform metadata');

    // Migrate each shelter to the new location
    console.log('\n🏠 Migrating shelter documents...');
    let migrated = 0;
    
    for (const shelter of backup.collections.shelters) {
      const newPath = `tenants/${primaryTenantId}/platform/shelters`;
      
      // Add migration metadata to shelter data
      const shelterData = {
        ...shelter.data,
        _migration: {
          migratedAt: admin.firestore.Timestamp.now(),
          originalPath: shelter.path,
          newPath: `${newPath}/${shelter.id}`
        }
      };

      await db.doc(`${newPath}/${shelter.id}`).set(shelterData);
      console.log(`   ✅ Migrated: ${shelter.data.name || shelter.id}`);
      migrated++;
    }

    console.log(`\n✅ Successfully migrated ${migrated} shelters to proper structure`);
    return { primaryTenantId, migrated };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function verifyMigration(primaryTenantId) {
  console.log('\n🔍 VERIFYING MIGRATION');
  console.log('=======================\n');

  try {
    // Verify new structure exists
    const newSheltersSnapshot = await db.collectionGroup('shelters').where('_migration.newPath', '>=', `tenants/${primaryTenantId}/platform/shelters/`).get();
    console.log(`✅ Found ${newSheltersSnapshot.size} shelters in new location`);

    // Verify platform metadata
    const platformMetadata = await db.doc(`tenants/${primaryTenantId}/platform/metadata`).get();
    if (platformMetadata.exists) {
      console.log('✅ Platform metadata created successfully');
    }

    // List all shelters with their new paths
    console.log('\n📋 Shelter inventory in new structure:');
    newSheltersSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${doc.id}: ${data.name || 'Unnamed'}`);
    });

    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error);
    return false;
  }
}

async function cleanupOldStructure() {
  console.log('\n🧹 CLEANING UP OLD STRUCTURE');
  console.log('==============================\n');

  try {
    // Note: We'll be cautious and NOT auto-delete the old structure
    // Instead, we'll provide manual cleanup instructions
    
    console.log('⚠️  Manual cleanup required:');
    console.log('   1. Verify application works with new structure');
    console.log('   2. Test all shelter-related functionality');
    console.log('   3. Once confirmed, manually delete: tenants/platform/*');
    console.log('   4. Keep backup file safe until fully tested');
    
    return true;
  } catch (error) {
    console.error('❌ Cleanup preparation failed:', error);
    return false;
  }
}

// Main migration process
async function runMigration() {
  console.log('🚀 SHELTR-AI DATABASE MIGRATION');
  console.log('=================================\n');
  
  try {
    // Step 1: Backup
    const backup = await backupCurrentData();
    
    // Step 2: Migrate
    const { primaryTenantId, migrated } = await migrateShelters(backup);
    
    // Step 3: Verify
    const verified = await verifyMigration(primaryTenantId);
    
    // Step 4: Cleanup instructions
    await cleanupOldStructure();
    
    if (verified) {
      console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!');
      console.log('====================================');
      console.log(`✅ Primary Tenant ID: ${primaryTenantId}`);
      console.log(`✅ Shelters migrated: ${migrated}`);
      console.log(`✅ New shelter path: tenants/${primaryTenantId}/platform/shelters/`);
      console.log('\n🔄 Next steps:');
      console.log('   1. Update frontend queries to use new path');
      console.log('   2. Test shelter map functionality');
      console.log('   3. Verify all shelter data is accessible');
      
      // Write the new path to a config file for frontend
      const config = {
        tenantId: primaryTenantId,
        sheltersPath: `tenants/${primaryTenantId}/platform/shelters`,
        migratedAt: new Date().toISOString()
      };
      
      fs.writeFileSync('./migration-config.json', JSON.stringify(config, null, 2));
      console.log('   📁 Created migration-config.json for frontend reference');
      
    } else {
      console.log('\n❌ MIGRATION VERIFICATION FAILED');
      console.log('Please check the logs and backup data');
    }
    
  } catch (error) {
    console.error('\n💥 MIGRATION FAILED:', error);
    console.log('\n🔄 Recovery options:');
    console.log('   1. Check backup file for data recovery');
    console.log('   2. Verify Firebase permissions');
    console.log('   3. Contact support if data appears lost');
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('\n✅ Migration script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Migration script failed:', error);
    process.exit(1);
  }); 