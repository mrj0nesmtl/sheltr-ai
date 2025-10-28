// Check Gallery Video URLs in Firestore
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../apps/api/service-account-key.json'))
  });
}

const db = admin.firestore();

async function checkGalleryUrls() {
  console.log('🔍 Checking Gallery URLs...\n');
  
  try {
    const galleryRef = db.collection('gallery_images');
    const snapshot = await galleryRef.get();
    
    if (snapshot.empty) {
      console.log('⚠️  No items found in gallery collection');
      return;
    }
    
    console.log(`📊 Found ${snapshot.size} item(s) in gallery:\n`);
    
    const videos = [];
    const images = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const item = {
        id: doc.id,
        title: data.title || 'Untitled',
        mediaType: data.mediaType || 'unknown',
        src: data.src,
        thumbnailUrl: data.thumbnailUrl,
        duration: data.duration,
        isPublic: data.isPublic,
        category: data.category
      };
      
      if (data.mediaType === 'video' || data.src?.includes('.mp4') || data.src?.includes('.MP4')) {
        videos.push(item);
      } else {
        images.push(item);
      }
    });
    
    if (videos.length > 0) {
      console.log(`📹 Videos (${videos.length}):\n`);
      videos.forEach(v => {
        console.log(`  Title: ${v.title}`);
        console.log(`  MediaType: ${v.mediaType}`);
        console.log(`  URL: ${v.src}`);
        console.log(`  Thumbnail: ${v.thumbnailUrl || 'N/A'}`);
        console.log(`  Duration: ${v.duration || 'N/A'}s`);
        console.log('');
      });
    } else {
      console.log('⚠️  No videos found\n');
    }
    
    console.log(`🖼️  Images: ${images.length}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkGalleryUrls().then(() => process.exit(0));

