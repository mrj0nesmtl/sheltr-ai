#!/usr/bin/env node

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

async function migrateWithAdminReferences() {
  console.log('🏗️ ENHANCED MIGRATION: SHELTERS WITH ADMIN REFERENCES');
  console.log('====================================================\n');

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

    // STEP 2: Enhanced shelter structure with admin references
    console.log('\n🏗️ STEP 2: Creating enhanced shelter structure...');
    console.log('\n📋 ENHANCED SHELTER SCHEMA:');
    console.log(`
   📁 /shelters/{shelter-id}
   ├── Basic Info:
   │   ├── name: string
   │   ├── address: string
   │   ├── city: string
   │   ├── province: string
   │   ├── capacity: number
   │   └── status: 'active' | 'pending' | 'inactive'
   │
   ├── Admin Management:
   │   ├── primary_admin: {
   │   │   ├── user_id: string
   │   │   ├── email: string
   │   │   ├── name: string
   │   │   ├── assigned_at: timestamp
   │   │   └── assigned_by: string (super_admin_id)
   │   }
   │   ├── admin_history: [
   │   │   { user_id, email, assigned_at, removed_at, reason }
   │   │ ]
   │   └── pending_admin_requests: [
   │       { user_id, email, requested_at, status }
   │   ]
   │
   ├── Contact & Metadata:
   │   ├── contact: { phone, email, website }
   │   ├── created_at: timestamp
   │   ├── updated_at: timestamp
   │   └── verification_status: 'verified' | 'pending' | 'unverified'
    `);

    // Select test shelter and prepare admin assignment
    const testShelterData = messyShelters.docs.find(doc => 
      doc.data().name.includes('Old Brewery Mission')
    ) || messyShelters.docs[0];
    
    const testShelterInfo = testShelterData.data();
    const cleanId = testShelterInfo.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    console.log(`\n🏠 Selected test shelter: ${testShelterInfo.name}`);
    console.log(`   Clean ID: ${cleanId}`);

    // STEP 3: Find test admin user for assignment
    console.log('\n👤 STEP 3: Finding test admin user...');
    const usersSnapshot = await db.collection('users').get();
    const testAdmin = usersSnapshot.docs.find(doc => 
      doc.data().email === 'shelteradmin@example.com'
    );

    if (!testAdmin) {
      throw new Error('Test admin user not found!');
    }

    const adminData = testAdmin.data();
    console.log(`   Found admin: ${adminData.firstName} ${adminData.lastName} (${adminData.email})`);

    // STEP 4: Create enhanced shelter documents with admin references
    console.log('\n🏗️ STEP 4: Creating shelters with admin references...');
    
    const batch = db.batch();
    const migratedShelters = [];

    for (const [index, doc] of messyShelters.docs.entries()) {
      const oldData = doc.data();
      
      const shelterId = oldData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Enhanced shelter structure
      const enhancedShelter = {
        // Basic Info
        id: shelterId,
        name: oldData.name,
        address: oldData.address,
        city: extractCity(oldData.address),
        province: extractProvince(oldData.address),
        capacity: oldData.capacity || 0,
        status: shelterId === cleanId ? 'active' : 'pending', // Test shelter is active
        
        // Admin Management
        primary_admin: shelterId === cleanId ? {
          user_id: testAdmin.id,
          email: adminData.email,
          name: `${adminData.firstName} ${adminData.lastName}`,
          assigned_at: admin.firestore.FieldValue.serverTimestamp(),
          assigned_by: 'system_migration'
        } : null,
        
        admin_history: [],
        pending_admin_requests: shelterId === cleanId ? [] : [
          {
            status: 'awaiting_assignment',
            requested_at: new Date(),
            note: 'Migrated shelter awaiting admin assignment'
          }
        ],
        
        // Contact & Metadata
        contact: {
          phone: oldData.phone || null,
          email: oldData.email || null,
          website: null
        },
        
        verification_status: shelterId === cleanId ? 'verified' : 'pending',
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
        
        // Migration tracking
        migration_info: {
          migrated_from: `tenants/Vc48fjy0cajJrstbLQRr/platform/shelters/data/${doc.id}`,
          original_id: doc.id,
          migrated_at: admin.firestore.FieldValue.serverTimestamp()
        }
      };

      // Add to batch
      const newShelterRef = db.collection('shelters').doc(shelterId);
      batch.set(newShelterRef, enhancedShelter);
      
      migratedShelters.push({
        oldId: doc.id,
        newId: shelterId,
        name: oldData.name,
        capacity: oldData.capacity,
        hasAdmin: shelterId === cleanId
      });

      const adminStatus = shelterId === cleanId ? '👤 WITH ADMIN' : '⏳ AWAITING ADMIN';
      console.log(`   ${index + 1}. ${oldData.name} → /shelters/${shelterId} ${adminStatus}`);
    }

    // Commit shelter creation
    await batch.commit();
    console.log(`   ✅ Successfully created ${migratedShelters.length} enhanced shelters!`);

    // STEP 5: Update user references
    console.log('\n👥 STEP 5: Updating user references...');
    
    const userBatch = db.batch();
    
    // Update test admin
    userBatch.update(testAdmin.ref, {
      shelter_id: cleanId,
      tenant_id: `shelter-${cleanId}`,
      shelter_role: 'primary_admin',
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`   👤 Updated admin: ${adminData.email} → ${cleanId}`);

    // Update test participant
    const testParticipant = usersSnapshot.docs.find(doc => 
      doc.data().email === 'participant@example.com'
    );
    
    if (testParticipant) {
      userBatch.update(testParticipant.ref, {
        shelter_id: cleanId,
        tenant_id: `shelter-${cleanId}`,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`   👤 Updated participant: participant@example.com → ${cleanId}`);
    }

    await userBatch.commit();

    // STEP 6: Update services
    console.log('\n🔧 STEP 6: Updating services with shelter references...');
    const servicesSnapshot = await db.collection('services').get();
    const servicesBatch = db.batch();
    let servicesUpdated = 0;

    servicesSnapshot.docs.forEach(doc => {
      const service = doc.data();
      
      if (service.tenant_id && service.tenant_id.includes('demo-shelter')) {
        servicesBatch.update(doc.ref, {
          shelter_id: cleanId,
          tenant_id: `shelter-${cleanId}`,
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
        servicesUpdated++;
      }
    });

    if (servicesUpdated > 0) {
      await servicesBatch.commit();
      console.log(`   ✅ Updated ${servicesUpdated} services`);
    }

    // STEP 7: Verification and summary
    console.log('\n✅ STEP 7: Migration verification...');
    const newSheltersCount = await db.collection('shelters').get();
    const activeShelters = newSheltersCount.docs.filter(doc => doc.data().status === 'active').length;
    const pendingShelters = newSheltersCount.docs.filter(doc => doc.data().status === 'pending').length;
    
    console.log(`   📊 Total shelters: ${newSheltersCount.size}`);
    console.log(`   ✅ Active (with admin): ${activeShelters}`);
    console.log(`   ⏳ Pending (awaiting admin): ${pendingShelters}`);

    console.log('\n🎉 ENHANCED MIGRATION COMPLETE!');
    console.log('================================');
    console.log('✅ Industry-standard shelter structure');
    console.log('✅ Admin assignment system ready');
    console.log('✅ Onboarding workflow foundation');
    console.log('✅ Test environment: 1 admin + 1 participant + 1 shelter');
    
    console.log('\n🚀 ONBOARDING WORKFLOW READY:');
    console.log('1. New admin registers → creates pending shelter request');
    console.log('2. Super admin reviews/approves → assigns admin to shelter');  
    console.log('3. Shelter becomes active → admin gets full access');
    console.log('4. Admin can manage their shelter participants/services');

    console.log('\n📋 NEXT STEPS:');
    console.log('1. Update dashboard queries to use new structure');
    console.log('2. Test shelter admin sees only their shelter data');
    console.log('3. Replace hardcoded numbers with real counts');

  } catch (error) {
    console.error('❌ Enhanced migration failed:', error.message);
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

migrateWithAdminReferences();
