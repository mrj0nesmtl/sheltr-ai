const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function updateGalleryItems() {
  console.log('🔍 Checking gallery items for isFoundersGallery field...\n');
  
  try {
    // Get all gallery items
    const snapshot = await db.collection('gallery_images').get();
    
    if (snapshot.empty) {
      console.log('❌ No gallery items found!');
      process.exit(1);
    }
    
    console.log(`📊 Found ${snapshot.size} gallery items\n`);
    
    let itemsWithFlag = 0;
    let itemsWithoutFlag = 0;
    const itemsToUpdate = [];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`\n📄 ${doc.id}`);
      console.log(`   Title: ${data.title || 'Untitled'}`);
      console.log(`   Type: ${data.type || 'unknown'}`);
      console.log(`   isFoundersGallery: ${data.isFoundersGallery}`);
      console.log(`   showInFoundersGallery: ${data.showInFoundersGallery}`);
      
      if (data.isFoundersGallery === true) {
        itemsWithFlag++;
      } else {
        itemsWithoutFlag++;
        itemsToUpdate.push({
          id: doc.id,
          title: data.title || 'Untitled'
        });
      }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Items WITH isFoundersGallery=true: ${itemsWithFlag}`);
    console.log(`   ❌ Items WITHOUT isFoundersGallery=true: ${itemsWithoutFlag}`);
    
    if (itemsToUpdate.length > 0) {
      console.log(`\n🔧 Items that need isFoundersGallery flag:`);
      itemsToUpdate.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title} (${item.id})`);
      });
      
      console.log(`\n❓ Do you want to set isFoundersGallery=true for ALL ${itemsToUpdate.length} items?`);
      console.log(`   This script will update them automatically...`);
      console.log(`   Run: node scripts/set-all-gallery-to-founders.js\n`);
    } else {
      console.log(`\n✅ All gallery items already have isFoundersGallery=true!`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateGalleryItems();

