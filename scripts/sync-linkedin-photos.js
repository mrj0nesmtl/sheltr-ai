/**
 * Sync LinkedIn Profile Photos (Fallback for users without uploaded photos)
 * Fetches profile pictures from LinkedIn public profiles using Open Graph meta tags
 */

const admin = require('firebase-admin');
const path = require('path');
const https = require('https');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../apps/api/service-account-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Team members with LinkedIn URLs (excluding those with uploaded photos)
const linkedInProfiles = {
  'alaghetts@gmail.com': 'https://www.linkedin.com/in/marc-reichel-6177b73b/',
  'morganhirtle@gmail.com': 'https://www.linkedin.com/in/uxmo/',
  'alexanderkline13@gmail.com': 'https://www.linkedin.com/in/alexander-kline-futurist-/',
  'doug.kukura@gmail.com': 'https://www.linkedin.com/in/doug-kukura-67043426/',
  'deefactorial@gmail.com': 'https://www.linkedin.com/in/dominique-legault/',
  'christinesavardmedia@gmail.com': 'https://www.linkedin.com/in/christinesavard/',
  'senw@royaltri.com': 'https://www.linkedin.com/in/senwong/',
  'srivastavaaryan005@gmail.com': 'https://www.linkedin.com/in/aryan-srivastava-63607624a/'
};

/**
 * Fetch Open Graph image from LinkedIn profile
 */
async function fetchLinkedInProfileImage(linkedInUrl) {
  return new Promise((resolve, reject) => {
    console.log(`   🔍 Fetching: ${linkedInUrl}`);
    
    https.get(linkedInUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Extract og:image meta tag
        const ogImageMatch = data.match(/<meta property="og:image" content="([^"]+)"/);
        
        if (ogImageMatch && ogImageMatch[1]) {
          const imageUrl = ogImageMatch[1];
          console.log(`   ✅ Found image: ${imageUrl.substring(0, 80)}...`);
          resolve(imageUrl);
        } else {
          console.log(`   ⚠️  No og:image found`);
          resolve(null);
        }
      });
    }).on('error', (err) => {
      console.log(`   ❌ Error fetching: ${err.message}`);
      resolve(null);
    });
  });
}

async function syncLinkedInPhotos() {
  console.log('📸 SYNCING LINKEDIN PROFILE PHOTOS (FALLBACK ONLY)\n');
  console.log('================================================================================\n');
  console.log('Strategy: Only sync users WITHOUT existing profile pictures');
  console.log('Joel (Super Admin) will be skipped - has uploaded photo\n');
  console.log('================================================================================\n');
  
  let synced = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const [email, linkedInUrl] of Object.entries(linkedInProfiles)) {
    console.log(`\n👤 Processing: ${email}`);
    
    try {
      // Find user by email
      const usersSnapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (usersSnapshot.empty) {
        console.log(`   ❌ User not found`);
        failed++;
        continue;
      }
      
      const userDoc = usersSnapshot.docs[0];
      const userId = userDoc.id;
      const userData = userDoc.data();
      
      // Check if user already has a profile picture
      if (userData.profilePicture) {
        console.log(`   ⏭️  SKIPPED - Already has profile picture: ${userData.profilePicture}`);
        skipped++;
        continue;
      }
      
      // Fetch LinkedIn profile image
      const linkedInPhotoUrl = await fetchLinkedInProfileImage(linkedInUrl);
      
      if (!linkedInPhotoUrl) {
        console.log(`   ❌ Failed to fetch LinkedIn photo`);
        failed++;
        continue;
      }
      
      // Update users collection
      await db.collection('users').doc(userId).update({
        profilePicture: linkedInPhotoUrl,
        'adminProfile.profilePicture': linkedInPhotoUrl
      });
      console.log(`   ✅ Updated users/${userId}`);
      
      // Update admin_profiles collection
      const adminProfileDoc = await db.collection('admin_profiles').doc(userId).get();
      if (adminProfileDoc.exists) {
        await db.collection('admin_profiles').doc(userId).update({
          profilePicture: linkedInPhotoUrl
        });
        console.log(`   ✅ Updated admin_profiles/${userId}`);
      }
      
      // Update team_members collection
      const teamMemberDoc = await db.collection('team_members').doc(userId).get();
      if (teamMemberDoc.exists) {
        await db.collection('team_members').doc(userId).update({
          profilePicture: linkedInPhotoUrl
        });
        console.log(`   ✅ Updated team_members/${userId}`);
      }
      
      synced++;
      console.log(`   🎉 Successfully synced LinkedIn photo for ${email}`);
      
      // Rate limiting - be nice to LinkedIn
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`   ❌ Error processing ${email}:`, error.message);
      failed++;
    }
  }
  
  console.log('\n================================================================================\n');
  console.log('📊 SUMMARY:\n');
  console.log(`   ✅ Successfully synced: ${synced}`);
  console.log(`   ⏭️  Skipped (has photo): ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📋 Total processed: ${Object.keys(linkedInProfiles).length}\n`);
  console.log('================================================================================\n');
  
  if (synced > 0) {
    console.log('✅ LinkedIn photos synced! Team page will now display LinkedIn profile pictures.\n');
    console.log('🌐 Visit: http://localhost:3000/team\n');
  }
  
  process.exit(0);
}

syncLinkedInPhotos();

