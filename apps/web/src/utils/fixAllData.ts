// Master utility to fix all data inconsistencies
import { fixMichaelRodriguezData } from './fixMichaelData';
import { createDemoDonationData } from './createDemoDonations';

/**
 * Fix all identified data inconsistencies in one go
 * 1. Fix Michael Rodriguez participant data
 * 2. Create demo donation data
 * 3. Verify all fixes
 */
export async function fixAllDataInconsistencies() {
  console.log('🚀 Starting comprehensive data fix...');
  console.log('='.repeat(50));
  
  const results = {
    michaelFix: null,
    donationCreation: null,
    overall: false
  };
  
  try {
    // Step 1: Fix Michael Rodriguez data
    console.log('🔧 STEP 1: Fixing Michael Rodriguez participant data...');
    results.michaelFix = await fixMichaelRodriguezData();
    
    if (results.michaelFix.success) {
      console.log('✅ Michael Rodriguez data fixed successfully!');
    } else {
      console.error('❌ Failed to fix Michael Rodriguez data');
      return results;
    }
    
    // Step 2: Create demo donation data
    console.log('\n🎁 STEP 2: Creating demo donation data...');
    results.donationCreation = await createDemoDonationData();
    
    if (results.donationCreation.success) {
      console.log('✅ Demo donation data created successfully!');
    } else {
      console.error('❌ Failed to create demo donation data');
      return results;
    }
    
    // Step 3: Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL DATA FIXES COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    
    console.log('\n📊 SUMMARY:');
    console.log('✅ Michael Rodriguez data consistency: FIXED');
    console.log('   - tenant_id: old-brewery-mission');
    console.log('   - shelter_id: old-brewery-mission');
    console.log('   - participantProfile.organizationId: old-brewery-mission');
    
    console.log('\n✅ Demo donation data: CREATED');
    console.log(`   - Total donations: ${results.donationCreation.donationCount}`);
    console.log(`   - Total amount: $${results.donationCreation.totalAmount} CAD`);
    console.log('   - Jane Supporter → Michael Rodriguez');
    console.log('   - Anonymous donations included');
    
    console.log('\n🎯 READY FOR TESTING:');
    console.log('1. Super Admin dashboard - check platform metrics');
    console.log('2. Shelter Admin dashboard - verify Old Brewery Mission data');
    console.log('3. Participant dashboard - check Michael Rodriguez profile');
    console.log('4. Donor dashboard - check Jane Supporter donations');
    console.log('5. Scan-give flow - test donation updates');
    
    results.overall = true;
    return results;
    
  } catch (error) {
    console.error('❌ Error during comprehensive data fix:', error);
    results.overall = false;
    return results;
  }
}

// Export for console usage
if (typeof window !== 'undefined') {
  (window as any).fixAllDataInconsistencies = fixAllDataInconsistencies;
}
