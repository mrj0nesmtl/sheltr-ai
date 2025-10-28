#!/usr/bin/env node

const admin = require('firebase-admin');

try {
  admin.initializeApp({
    projectId: 'sheltr-ai',
    databaseURL: 'https://sheltr-ai-default-rtdb.firebaseio.com'
  });
} catch (error) {
  console.error('❌ Error initializing Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function fixSenWongRole() {
  try {
    console.log('🔧 Fixing Sen Wong\'s role from platform_administrator to platform_admin...\n');
    
    const email = 'senw@royaltri.com';
    const uid = 'Fzf0QeEcpmRKjSfgfx7SSIqNom52';
    
    // Update role in users collection
    await db.collection('users').doc(uid).update({
      role: 'platform_admin',
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Updated role in users collection');
    
    // Update role in platform_administrators collection (if it exists)
    try {
      await db.collection('platform_administrators').doc(uid).update({
        role: 'platform_admin',
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Updated role in platform_administrators collection');
    } catch (error) {
      console.log('ℹ️  platform_administrators collection update not needed');
    }
    
    // Verify the update
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log('\n🎉 SUCCESS! Sen Wong\'s role updated');
      console.log('=' * 50);
      console.log(`📧 Email: ${userData.email}`);
      console.log(`👤 Name: ${userData.displayName}`);
      console.log(`🔑 Role: ${userData.role}`);
      console.log(`🆔 UID: ${uid}`);
      console.log('=' * 50);
      console.log('🔄 Sen Wong should now see the full platform admin dashboard!');
      console.log('💡 May need to refresh the browser or clear cache');
    }
    
  } catch (error) {
    console.error(`❌ Error fixing Sen Wong's role: ${error.message}`);
    throw error;
  }
}

// Run the function
fixSenWongRole().then(() => {
  console.log('\n✅ Role fix completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error(`\n❌ Role fix failed: ${error.message}`);
  process.exit(1);
});
