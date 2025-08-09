#!/usr/bin/env node

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

async function analyzeMigrationComplexity() {
  console.log('🏗️ DATABASE RESTRUCTURE ANALYSIS');
  console.log('=================================\n');

  try {
    // Current messy structure analysis
    console.log('1. CURRENT STRUCTURE ANALYSIS:');
    const messyPath = 'tenants/Vc48fjy0cajJrstbLQRr/platform/shelters/data';
    const messyShelters = await db.collection('tenants')
      .doc('Vc48fjy0cajJrstbLQRr')
      .collection('platform')
      .doc('shelters')
      .collection('data')
      .get();
    
    console.log(`   📊 Found ${messyShelters.size} shelters in messy structure`);
    console.log(`   📍 Path: ${messyPath}`);
    console.log(`   🚨 Issues: 4 levels deep, tenant-specific, hard to query`);

    // Check if clean structure already exists
    console.log('\n2. CHECKING FOR EXISTING CLEAN STRUCTURE:');
    const cleanShelters = await db.collection('shelters').get();
    console.log(`   📊 Found ${cleanShelters.size} shelters in clean /shelters collection`);
    
    if (cleanShelters.size > 0) {
      console.log('   ⚠️  Clean structure already exists - need to compare data');
    }

    // Check current user structure
    console.log('\n3. USER STRUCTURE ANALYSIS:');
    const users = await db.collection('users').get();
    let usersWithShelterIds = 0;
    let usersWithTenantIds = 0;
    
    users.docs.forEach(doc => {
      const user = doc.data();
      if (user.shelter_id) usersWithShelterIds++;
      if (user.tenant_id) usersWithTenantIds++;
    });
    
    console.log(`   👥 Total users: ${users.size}`);
    console.log(`   🏠 Users with shelter_id: ${usersWithShelterIds}`);
    console.log(`   🏢 Users with tenant_id: ${usersWithTenantIds}`);

    // Migration complexity assessment
    console.log('\n4. MIGRATION COMPLEXITY:');
    console.log('   🟢 LOW COMPLEXITY:');
    console.log('      - Only 10 shelters to move');
    console.log('      - Simple data structure (name, address, capacity)');
    console.log('      - No complex relationships yet');
    console.log('   🟡 MEDIUM COMPLEXITY:');
    console.log('      - Need to update dashboard queries');
    console.log('      - Update user associations');
    console.log('   🔴 RISKS:');
    console.log('      - Must not break existing services collection');
    console.log('      - Preserve user authentication');

    console.log('\n5. RECOMMENDED CLEAN STRUCTURE:');
    console.log(`
   📁 /shelters                    # Root collection
   ├── {shelter-id}               # Clean UUID or slug
   │   ├── name: string
   │   ├── address: string  
   │   ├── city: string
   │   ├── province: string
   │   ├── capacity: number
   │   ├── status: 'active' | 'inactive'
   │   ├── contact: { phone, email }
   │   └── created_at: timestamp

   📁 /users                      # Enhanced structure
   ├── {user-id}
   │   ├── shelter_id: string     # Direct reference
   │   ├── role: string
   │   └── ... existing fields

   📁 /services                   # Already exists, enhance
   ├── {service-id}
   │   ├── shelter_id: string     # For filtering
   │   └── ... existing fields
    `);

    console.log('\n6. MIGRATION STRATEGY:');
    console.log('   ✅ STEP 1: Create clean /shelters collection');
    console.log('   ✅ STEP 2: Migrate 10 Montreal shelters');
    console.log('   ✅ STEP 3: Link test users to one shelter');
    console.log('   ✅ STEP 4: Update dashboard queries');
    console.log('   ✅ STEP 5: Clean up old messy structure');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

analyzeMigrationComplexity();
