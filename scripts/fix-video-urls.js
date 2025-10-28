// Fix Video URLs - Remove tokens, use public ACLs instead
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../apps/api/service-account-key.json'))
  });
}

const db = admin.firestore();

async function fixVideoUrls() {
  console.log('🔧 Fixing Video URLs (removing tokens)...\n');
  
  try {
    const galleryRef = db.collection('gallery_images');
    const snapshot = await galleryRef.get();
    
    let videoCount = 0;
    let fixedCount = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Check if it's a video
      if (data.mediaType === 'video' || data.src?.includes('.mp4') || data.src?.includes('.MP4')) {
        videoCount++;
        
        // Remove token from main video URL
        const originalUrl = data.src;
        const urlWithoutToken = originalUrl.split('?')[0] + '?alt=media';
        
        // Remove token from thumbnail URL if it exists
        let thumbnailWithoutToken = data.thumbnailUrl;
        if (thumbnailWithoutToken) {
          thumbnailWithoutToken = thumbnailWithoutToken.split('?')[0] + '?alt=media';
        }
        
        console.log(`📹 ${data.title}`);
        console.log(`   Old URL: ${originalUrl}`);
        console.log(`   New URL: ${urlWithoutToken}`);
        
        // Update the document
        await doc.ref.update({
          src: urlWithoutToken,
          thumbnailUrl: thumbnailWithoutToken,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        fixedCount++;
        console.log(`   ✅ Updated!\n`);
      }
    }
    
    console.log(`\n✨ Fixed ${fixedCount} of ${videoCount} videos`);
    console.log('\n📝 Note: Videos now use public URLs without tokens.');
    console.log('   This works because we set public read ACLs on the files.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixVideoUrls().then(() => process.exit(0));

