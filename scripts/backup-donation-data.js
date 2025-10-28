const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function backupAllDonationData() {
  console.log('💾 GLOBAL DONATION DATA BACKUP\n');
  console.log('================================================================================\n');
  console.log('📋 Creating backup of all donation data before reset...\n');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../backups');
  const backupFile = path.join(backupDir, `donation-backup-${timestamp}.json`);
  
  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('✅ Created backups directory\n');
  }

  try {
    const backup = {
      timestamp: new Date().toISOString(),
      collections: {}
    };

    // ============================================================================
    // 1. BACKUP DEMO_DONATIONS
    // ============================================================================
    console.log('📦 Step 1: Backing up demo_donations...');
    const demoDonationsSnapshot = await db.collection('demo_donations').get();
    backup.collections.demo_donations = demoDonationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || null,
      updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || null,
      completed_at: doc.data().completed_at?.toDate?.()?.toISOString() || null
    }));
    console.log(`   ✅ Backed up ${demoDonationsSnapshot.size} demo donations\n`);

    // ============================================================================
    // 2. BACKUP GLOBAL DONATIONS
    // ============================================================================
    console.log('📦 Step 2: Backing up global donations...');
    const globalDonationsSnapshot = await db.collection('donations').get();
    backup.collections.donations = globalDonationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || null,
      updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || null
    }));
    console.log(`   ✅ Backed up ${globalDonationsSnapshot.size} global donations\n`);

    // ============================================================================
    // 3. BACKUP TENANT DONATIONS
    // ============================================================================
    console.log('📦 Step 3: Backing up tenant donations...');
    const tenantDonationsSnapshot = await db.collection('tenants/YDJCJnuLGMC9mWOWDSOa/donations').get();
    backup.collections.tenant_donations = tenantDonationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || null,
      updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || null,
      completed_at: doc.data().completed_at?.toDate?.()?.toISOString() || null
    }));
    console.log(`   ✅ Backed up ${tenantDonationsSnapshot.size} tenant donations\n`);

    // ============================================================================
    // 4. BACKUP SHELTER OPERATIONS TRANSACTIONS
    // ============================================================================
    console.log('📦 Step 4: Backing up shelter operations transactions...');
    const shelterOpsSnapshot = await db.collection('shelter_operations_transactions').get();
    backup.collections.shelter_operations_transactions = shelterOpsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || null
    }));
    console.log(`   ✅ Backed up ${shelterOpsSnapshot.size} shelter operation transactions\n`);

    // ============================================================================
    // 5. BACKUP USER STATS
    // ============================================================================
    console.log('📦 Step 5: Backing up user donation stats...');
    const usersSnapshot = await db.collection('users').get();
    backup.collections.user_stats = [];
    
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      const userRole = userData.role;
      
      // Only backup users with donation-related stats
      if (userRole === 'participant' || userRole === 'donor' || 
          userRole === 'super_admin' || userRole === 'platform_admin') {
        backup.collections.user_stats.push({
          id: doc.id,
          email: userData.email,
          name: userData.name,
          role: userRole,
          total_received: userData.total_received || 0,
          donation_count: userData.donation_count || 0,
          housing_fund_balance: userData.housing_fund_balance || 0,
          totalDonated: userData.totalDonated || 0,
          updated_at: userData.updated_at?.toDate?.()?.toISOString() || null
        });
      }
    });
    console.log(`   ✅ Backed up stats for ${backup.collections.user_stats.length} users\n`);

    // ============================================================================
    // 6. BACKUP SHELTER STATS
    // ============================================================================
    console.log('📦 Step 6: Backing up shelter operations stats...');
    const sheltersSnapshot = await db.collection('shelters').get();
    backup.collections.shelter_stats = sheltersSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      total_operations_received: doc.data().total_operations_received || 0,
      operations_donation_count: doc.data().operations_donation_count || 0,
      total_donations_received: doc.data().total_donations_received || 0,
      updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || null
    }));
    console.log(`   ✅ Backed up stats for ${sheltersSnapshot.size} shelters\n`);

    // ============================================================================
    // 7. SAVE BACKUP FILE
    // ============================================================================
    console.log('💾 Step 7: Saving backup to file...');
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    const fileSize = (fs.statSync(backupFile).size / 1024).toFixed(2);
    console.log(`   ✅ Backup saved to: ${backupFile}`);
    console.log(`   📊 File size: ${fileSize} KB\n`);

    // ============================================================================
    // 8. SUMMARY
    // ============================================================================
    console.log('================================================================================\n');
    console.log('✅ BACKUP COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`   • Demo donations: ${backup.collections.demo_donations.length}`);
    console.log(`   • Global donations: ${backup.collections.donations.length}`);
    console.log(`   • Tenant donations: ${backup.collections.tenant_donations.length}`);
    console.log(`   • Shelter operations: ${backup.collections.shelter_operations_transactions.length}`);
    console.log(`   • User stats: ${backup.collections.user_stats.length}`);
    console.log(`   • Shelter stats: ${backup.collections.shelter_stats.length}\n`);
    console.log(`💾 Backup file: ${backupFile}\n`);
    console.log('🎯 You can now safely run the reset script!\n');
    console.log('📋 To restore from this backup, run: node scripts/restore-donation-data.js\n');
    console.log('================================================================================\n');

    return backupFile;

  } catch (error) {
    console.error('❌ Error during backup:', error);
    throw error;
  }
}

// Run backup
backupAllDonationData()
  .then(() => {
    console.log('🎉 Backup process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Backup process failed:', error);
    process.exit(1);
  });

