const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// This script exports gallery items from production and imports them to development

console.log('🔄 Gallery Sync Tool - Production → Development\n');

// Initialize production Firebase (using service account)
const productionServiceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(productionServiceAccount),
    projectId: productionServiceAccount.project_id
  });
}

const db = admin.firestore();

async function exportGalleryItems() {
  console.log('📥 Step 1: Exporting gallery items from Firestore...\n');
  
  try {
    const snapshot = await db.collection('gallery').get();
    
    if (snapshot.empty) {
      console.log('⚠️  No gallery items found in Firestore collection.');
      console.log('   This might mean:');
      console.log('   1. You\'re connected to the wrong Firebase project');
      console.log('   2. Gallery items haven\'t been uploaded yet');
      console.log('   3. The collection name is different\n');
      return [];
    }
    
    const items = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to ISO strings for JSON export
        uploadedAt: data.uploadedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });
    
    console.log(`✅ Found ${items.length} gallery items\n`);
    
    // Show items with isFoundersGallery flag
    const foundersItems = items.filter(item => item.isFoundersGallery === true);
    console.log(`📊 Items marked for Founders Gallery: ${foundersItems.length}`);
    
    if (foundersItems.length > 0) {
      console.log('\n🎯 Founders Gallery Items:');
      foundersItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title || 'Untitled'} (${item.type || 'unknown'})`);
      });
    }
    
    // Save to backup file
    const backupPath = path.join(__dirname, '../.local-secure-docs/gallery-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(items, null, 2));
    console.log(`\n💾 Backup saved to: ${backupPath}`);
    
    return items;
  } catch (error) {
    console.error('❌ Error exporting gallery items:', error);
    throw error;
  }
}

async function showCurrentProject() {
  console.log('🔍 Current Firebase Project Info:\n');
  console.log(`   Project ID: ${productionServiceAccount.project_id}`);
  console.log(`   Client Email: ${productionServiceAccount.client_email}\n`);
}

async function main() {
  try {
    await showCurrentProject();
    const items = await exportGalleryItems();
    
    if (items.length === 0) {
      console.log('\n⚠️  No items to sync. Exiting.\n');
      process.exit(0);
    }
    
    console.log('\n✅ Export Complete!\n');
    console.log('📋 Next Steps:');
    console.log('   1. The gallery items have been backed up to .local-secure-docs/gallery-backup.json');
    console.log('   2. If you need to import to a different Firebase project:');
    console.log('      - Update your service account key');
    console.log('      - Run the import script');
    console.log('   3. Or upload gallery items manually via /dashboard/gallery\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
}

main();

