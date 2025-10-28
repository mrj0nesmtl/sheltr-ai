const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function resetAllDonationData() {
  console.log('🧹 GLOBAL DONATION DATA RESET\n');
  console.log('================================================================================\n');
  console.log('⚠️  WARNING: This will delete ALL donation data and reset ALL user metrics!\n');
  console.log('📋 Collections to be cleared:');
  console.log('   1. demo_donations (legacy test donations)');
  console.log('   2. donations (global public donations)');
  console.log('   3. tenants/YDJCJnuLGMC9mWOWDSOa/donations (Old Brewery Mission donations)');
  console.log('   4. shelter_operations_transactions (shelter routing logs)');
  console.log('   5. Donation notifications (donor, participant, shelter)');
  console.log('   6. User donation stats (participants & donors)');
  console.log('   7. Shelter operations stats\n');
  console.log('================================================================================\n');

  try {
    let totalDeleted = 0;
    let totalUsersReset = 0;
    let totalSheltersReset = 0;
    let totalNotificationsDeleted = 0;

    // ============================================================================
    // 1. DELETE ALL DEMO_DONATIONS
    // ============================================================================
    console.log('🗑️  Step 1: Clearing demo_donations collection...\n');
    const demoDonationsSnapshot = await db.collection('demo_donations').get();
    console.log(`   Found ${demoDonationsSnapshot.size} documents in demo_donations`);
    
    const demoBatch = db.batch();
    demoDonationsSnapshot.docs.forEach(doc => {
      demoBatch.delete(doc.ref);
      totalDeleted++;
    });
    await demoBatch.commit();
    console.log(`   ✅ Deleted ${demoDonationsSnapshot.size} demo donations\n`);

    // ============================================================================
    // 2. DELETE ALL GLOBAL PUBLIC DONATIONS
    // ============================================================================
    console.log('🗑️  Step 2: Clearing global donations collection...\n');
    const globalDonationsSnapshot = await db.collection('donations').get();
    console.log(`   Found ${globalDonationsSnapshot.size} documents in global donations`);
    
    const globalBatch = db.batch();
    globalDonationsSnapshot.docs.forEach(doc => {
      globalBatch.delete(doc.ref);
      totalDeleted++;
    });
    await globalBatch.commit();
    console.log(`   ✅ Deleted ${globalDonationsSnapshot.size} global donations\n`);

    // ============================================================================
    // 3. DELETE ALL TENANT DONATIONS (Old Brewery Mission)
    // ============================================================================
    console.log('🗑️  Step 3: Clearing tenant donations collection...\n');
    const tenantDonationsSnapshot = await db.collection('tenants/YDJCJnuLGMC9mWOWDSOa/donations').get();
    console.log(`   Found ${tenantDonationsSnapshot.size} documents in tenant donations`);
    
    const tenantBatch = db.batch();
    tenantDonationsSnapshot.docs.forEach(doc => {
      tenantBatch.delete(doc.ref);
      totalDeleted++;
    });
    await tenantBatch.commit();
    console.log(`   ✅ Deleted ${tenantDonationsSnapshot.size} tenant donations\n`);

    // ============================================================================
    // 4. DELETE ALL SHELTER OPERATIONS TRANSACTIONS
    // ============================================================================
    console.log('🗑️  Step 4: Clearing shelter operations transactions...\n');
    const shelterOpsSnapshot = await db.collection('shelter_operations_transactions').get();
    console.log(`   Found ${shelterOpsSnapshot.size} documents in shelter operations`);
    
    const opsBatch = db.batch();
    shelterOpsSnapshot.docs.forEach(doc => {
      opsBatch.delete(doc.ref);
    });
    await opsBatch.commit();
    console.log(`   ✅ Deleted ${shelterOpsSnapshot.size} shelter operation transactions\n`);

    // ============================================================================
    // 5. DELETE ALL DONATION NOTIFICATIONS
    // ============================================================================
    console.log('🗑️  Step 5: Clearing donation notifications...\n');
    
    // Delete donor notifications with category 'donation'
    const donorNotificationsSnapshot = await db.collection('donor_notifications')
      .where('category', '==', 'donation')
      .get();
    console.log(`   Found ${donorNotificationsSnapshot.size} donor donation notifications`);
    
    const donorNotifBatch = db.batch();
    donorNotificationsSnapshot.docs.forEach(doc => {
      donorNotifBatch.delete(doc.ref);
      totalNotificationsDeleted++;
    });
    await donorNotifBatch.commit();
    console.log(`   ✅ Deleted ${donorNotificationsSnapshot.size} donor donation notifications`);
    
    // Delete participant notifications with category 'donation'
    const participantNotificationsSnapshot = await db.collection('participant_notifications')
      .where('category', '==', 'donation')
      .get();
    console.log(`   Found ${participantNotificationsSnapshot.size} participant donation notifications`);
    
    const participantNotifBatch = db.batch();
    participantNotificationsSnapshot.docs.forEach(doc => {
      participantNotifBatch.delete(doc.ref);
      totalNotificationsDeleted++;
    });
    await participantNotifBatch.commit();
    console.log(`   ✅ Deleted ${participantNotificationsSnapshot.size} participant donation notifications`);
    
    // Delete shelter notifications with category 'donation'
    const shelterNotificationsSnapshot = await db.collection('shelter_notifications')
      .where('category', '==', 'donation')
      .get();
    console.log(`   Found ${shelterNotificationsSnapshot.size} shelter donation notifications`);
    
    const shelterNotifBatch = db.batch();
    shelterNotificationsSnapshot.docs.forEach(doc => {
      shelterNotifBatch.delete(doc.ref);
      totalNotificationsDeleted++;
    });
    await shelterNotifBatch.commit();
    console.log(`   ✅ Deleted ${shelterNotificationsSnapshot.size} shelter donation notifications\n`);

    // ============================================================================
    // 6. RESET ALL USER DONATION STATS
    // ============================================================================
    console.log('🔄 Step 6: Resetting user donation stats...\n');
    const usersSnapshot = await db.collection('users').get();
    console.log(`   Found ${usersSnapshot.size} users to check\n`);
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userRole = userData.role;
      
      // Reset participant stats
      if (userRole === 'participant') {
        await userDoc.ref.update({
          total_received: 0,
          donation_count: 0,
          housing_fund_balance: 0,
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`   ✅ Reset participant: ${userData.name || userData.email}`);
        totalUsersReset++;
      }
      
      // Reset donor stats (including dual-role users like super_admin/platform_admin who can also donate)
      // Check if user has ANY donor-related stats, regardless of primary role
      const hasDonorStats = userData.totalDonated !== undefined || userData.hasOwnProperty('totalDonated');
      
      if (userRole === 'donor' || userRole === 'super_admin' || userRole === 'platform_admin' || hasDonorStats) {
        await userDoc.ref.update({
          totalDonated: 0,
          donation_count: 0,
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`   ✅ Reset donor stats for: ${userData.name || userData.email} (${userRole})`);
        totalUsersReset++;
      }
    }
    console.log(`\n   ✅ Reset ${totalUsersReset} user accounts\n`);

    // ============================================================================
    // 7. RESET ALL SHELTER OPERATIONS STATS
    // ============================================================================
    console.log('🔄 Step 7: Resetting shelter operations stats...\n');
    const sheltersSnapshot = await db.collection('shelters').get();
    console.log(`   Found ${sheltersSnapshot.size} shelters to check\n`);
    
    for (const shelterDoc of sheltersSnapshot.docs) {
      await shelterDoc.ref.update({
        total_operations_received: 0,
        operations_donation_count: 0,
        total_donations_received: 0,
        operations_revenue: 0,  // 🔧 ADDED: Reset wallet operations revenue
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      const shelterData = shelterDoc.data();
      console.log(`   ✅ Reset shelter: ${shelterData.name || shelterDoc.id}`);
      totalSheltersReset++;
    }
    console.log(`\n   ✅ Reset ${totalSheltersReset} shelters\n`);

    // ============================================================================
    // 8. SUMMARY
    // ============================================================================
    console.log('================================================================================\n');
    console.log('✅ GLOBAL RESET COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`   • Deleted donations: ${totalDeleted}`);
    console.log(`   • Deleted notifications: ${totalNotificationsDeleted}`);
    console.log(`   • Reset users: ${totalUsersReset}`);
    console.log(`   • Reset shelters: ${totalSheltersReset}\n`);
    console.log('🎯 All donation data has been cleared. You now have a clean slate!\n');
    console.log('📋 Next Steps - Multi-Browser Test Plan:');
    console.log('   1. Open 6 browsers, log in as different roles:');
    console.log('      • Browser 1: Super Admin (Joel Yaffe)');
    console.log('      • Browser 2: Platform Admin');
    console.log('      • Browser 3: Shelter Admin (Old Brewery Mission)');
    console.log('      • Browser 4: Donor (Jane Supporter)');
    console.log('      • Browser 5: Participant (Michael Rodriguez)');
    console.log('      • Browser 6: Public View (not logged in)\n');
    console.log('   2. Verify ALL dashboards show $0 for donations/donors/participants\n');
    console.log('   3. As Jane (Donor), make TWO donations:');
    console.log('      • Donation 1: $1,000 to Michael (Scan & Give)');
    console.log('        → SmartFund: $800 Michael, $150 Housing, $50 Platform');
    console.log('      • Donation 2: $1,000 to Old Brewery Mission (Direct)');
    console.log('        → Direct: $950 Shelter, $50 Platform\n');
    console.log('   4. Verify flow across ALL 6 browsers:');
    console.log('      • Jane: $2,000 total donated');
    console.log('      • Michael: $800 received + notifications');
    console.log('      • Shelter: $950 + $150 = $1,100 total + notifications');
    console.log('      • Admins: See all transactions + notifications');
    console.log('      • Public: Updated stats on public pages\n');
    console.log('================================================================================\n');

  } catch (error) {
    console.error('❌ Error during global reset:', error);
  }
}

resetAllDonationData();

