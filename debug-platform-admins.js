// Debug script to test platform admin fetching
// Run this in browser console on the user management page

console.log('🔍 DEBUGGING PLATFORM ADMINS');

// Test the getPlatformAdmins function directly
async function testPlatformAdmins() {
  try {
    // Import the function (this might need to be done differently in browser)
    const { getPlatformAdmins } = await import('./apps/web/src/services/platformMetrics');
    
    console.log('📋 Calling getPlatformAdmins...');
    const admins = await getPlatformAdmins();
    
    console.log('✅ Results:');
    console.log(`Total admins: ${admins.length}`);
    
    admins.forEach(admin => {
      console.log(`👤 ${admin.firstName} ${admin.lastName} (${admin.email})`);
      console.log(`   Status: ${admin.status}`);
      console.log(`   UID: ${admin.uid}`);
    });
    
    // Find Gunnar specifically
    const gunnar = admins.find(admin => admin.email === 'gunnar.blaze@gmail.com');
    if (gunnar) {
      console.log('🎯 GUNNAR FOUND:');
      console.log(JSON.stringify(gunnar, null, 2));
    } else {
      console.log('❌ Gunnar not found in results');
    }
    
  } catch (error) {
    console.error('❌ Error testing platform admins:', error);
  }
}

testPlatformAdmins();
