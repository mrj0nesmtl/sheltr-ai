/**
 * Migration Script: Angels TikTok Videos
 * Migrates hardcoded TikTok videos from angels/page.tsx to Firestore
 * 
 * Run with: npx ts-node scripts/migrate-angels-videos.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as path from 'path';

// Initialize Firebase Admin (only if not already initialized)
if (!getApps().length) {
  const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));
  
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

// Original 12 TikTok videos from angels/page.tsx
const tiktokVideos = [
  {
    id: '7539670401589218582',
    url: 'https://www.tiktok.com/@london_news_exposed/video/7539670401589218582',
    username: '@london_news_exposed',
    displayName: 'London News Exposed',
    description: 'Veteran homeless Phil speaks outside once of prison after being bailed',
    tags: ['#londonnewsexposed', '#homeless', '#veteran'],
  },
  {
    id: '7534020508094942494',
    url: 'https://www.tiktok.com/@hard.knock.gospel/video/7534020508094942494',
    username: '@hard.knock.gospel',
    displayName: 'Hard Knock Gospel',
    description: 'HOW TO MAKE A HOMELESS SHELTER - Survival tactics from someone who lived it',
    tags: ['#homelesspeople', '#lifehack', '#recovery'],
  },
  {
    id: '7524300608296324383',
    url: 'https://www.tiktok.com/@hard.knock.gospel/video/7524300608296324383',
    username: '@hard.knock.gospel',
    displayName: 'Hard Knock Gospel',
    description: 'Street rules that kept me safe and out of jail for a year on the streets',
    tags: ['#streetlife', '#homeless', '#recovery'],
  },
  {
    id: '7540096124321860878',
    url: 'https://www.tiktok.com/@truthonthestreets/video/7540096124321860878',
    username: '@truthonthestreets',
    displayName: 'Truth on the Streets',
    description: 'Real talk about life on the streets',
    tags: ['#homeless', '#truth'],
  },
  {
    id: '7538894385593797902',
    url: 'https://www.tiktok.com/@justknate/video/7538894385593797902',
    username: '@justknate',
    displayName: 'Just Knate',
    description: 'Helping those in need - one person at a time',
    tags: ['#teamjustus', '#kindness'],
  },
  {
    id: '7538923245353864478',
    url: 'https://www.tiktok.com/@pearlmania500/video/7538923245353864478',
    username: '@pearlmania500',
    displayName: 'Pearlmania500',
    description: 'Food has never cost more, and our tank budget has never been higher',
    tags: ['#economy', '#struggle'],
  },
  {
    id: '7538685893805149458',
    url: 'https://www.tiktok.com/@jonfromnova/video/7538685893805149458',
    username: '@jonfromnova',
    displayName: 'Jon from Nova',
    description: 'Ever thought about it? 💭 AI and society',
    tags: ['#ai', '#technology'],
  },
  {
    id: '7538847495368002838',
    url: 'https://www.tiktok.com/@officialmtclips/video/7538847495368002838',
    username: '@officialmtclips',
    displayName: 'Official MT Clips',
    description: 'Levels of wealth and money mindset',
    tags: ['#wealth', '#money', '#mindset'],
  },
  {
    id: '7537778081012911391',
    url: 'https://www.tiktok.com/@livenowfox/video/7537778081012911391',
    username: '@livenowfox',
    displayName: 'LiveNOW from FOX',
    description: 'Trump promises to remove homeless people from DC under threat of jail',
    tags: ['#politics', '#homeless'],
  },
  {
    id: '7537396358668406046',
    url: 'https://www.tiktok.com/@pearlmania500/video/7537396358668406046',
    username: '@pearlmania500',
    displayName: 'Pearlmania500',
    description: 'Congress abandoned organizations doing real work at home',
    tags: ['#politics', '#nonprofit'],
  },
  {
    id: '7536168186941623574',
    url: 'https://www.tiktok.com/@wateraid/video/7536168186941623574',
    username: '@wateraid',
    displayName: 'WaterAid',
    description: 'In Colombia: Bicycle parts pulley system + MrBeast = Clean water for 1,000 people',
    tags: ['#charity', '#innovation'],
  },
  {
    id: '7537678541589122318',
    url: 'https://www.tiktok.com/@mohbd97/video/7537678541589122318',
    username: '@mohbd97',
    displayName: 'Mohbd97',
    description: 'Breaking news and current events',
    tags: ['#news', '#current events'],
  },
];

async function migrateVideos() {
  console.log('🚀 Starting Angels TikTok Videos Migration...\n');

  const batch = db.batch();
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < tiktokVideos.length; i++) {
    const video = tiktokVideos[i];
    
    try {
      // Create Firestore document
      const docRef = db.collection('gallery_media').doc();
      
      const galleryMedia = {
        // Basic info
        title: `${video.displayName}: ${video.description.substring(0, 60)}${video.description.length > 60 ? '...' : ''}`,
        description: video.description,
        category: 'clips', // As requested
        tags: video.tags,
        date: new Date().toISOString().split('T')[0],
        
        // Media type
        mediaType: 'embed',
        src: video.url, // Store original URL
        
        // Social media embed fields
        embedUrl: video.url,
        embedType: 'tiktok',
        embedId: video.id,
        embedUsername: video.username,
        
        // Angels page specific
        isAngelsVideo: true,
        angelsOrder: i, // Preserve original order (0-11)
        
        // Visibility flags
        isPublic: true,
        isPrivate: false,
        isHero: false,
        isLandingHero: false,
        isFoundersGallery: false,
        isInvestorDataRoom: false,
        
        // Metadata
        aspectRatio: '9:16', // TikTok vertical format
        width: 1080,
        height: 1920,
        
        // Timestamps
        uploadedBy: 'system_migration',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        order: i, // General order field
      };
      
      batch.set(docRef, galleryMedia);
      
      console.log(`✅ [${i + 1}/12] Queued: ${video.displayName} (${video.id})`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ [${i + 1}/12] Failed: ${video.displayName}`, error);
      errorCount++;
    }
  }

  // Commit batch
  try {
    await batch.commit();
    console.log(`\n🎉 Migration Complete!`);
    console.log(`   ✅ Success: ${successCount} videos`);
    console.log(`   ❌ Errors: ${errorCount} videos`);
    console.log(`\n📍 Videos are now in Firestore collection: gallery_media`);
    console.log(`   - Category: "clips"`);
    console.log(`   - isAngelsVideo: true`);
    console.log(`   - angelsOrder: 0-11 (preserved)`);
  } catch (error) {
    console.error('\n❌ Batch commit failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateVideos()
  .then(() => {
    console.log('\n✨ Migration script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
