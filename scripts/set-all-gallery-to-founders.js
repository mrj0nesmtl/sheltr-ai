const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function setAllToFoundersGallery() {
  console.log('🚀 Setting ALL gallery items to isFoundersGallery=true...\n');
  
  try {
    const snapshot = await db.collection('gallery_images').get();
    
    if (snapshot.empty) {
      console.log('❌ No gallery items found!');
      process.exit(1);
    }
    
    console.log(`📊 Found ${snapshot.size} gallery items to update\n`);
    
    const batch = db.batch();
    let updateCount = 0;
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      
      // Only update if isFoundersGallery is not already true
      if (data.isFoundersGallery !== true) {
        batch.update(doc.ref, {
          isFoundersGallery: true
        });
        updateCount++;
        console.log(`✅ Queued: ${data.title || doc.id}`);
      } else {
        console.log(`⏭️  Skipped (already set): ${data.title || doc.id}`);
      }
    });
    
    if (updateCount > 0) {
      console.log(`\n💾 Committing ${updateCount} updates...`);
      await batch.commit();
      console.log(`\n✅ SUCCESS! Updated ${updateCount} gallery items!`);
      console.log(`\n🎉 All gallery items are now available in Founders Gallery!`);
      console.log(`   Visit: http://localhost:3000/portal/founders-only\n`);
    } else {
      console.log(`\n✅ No updates needed - all items already set!`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setAllToFoundersGallery();

