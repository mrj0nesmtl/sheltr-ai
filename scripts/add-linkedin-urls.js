/**
 * Add LinkedIn URLs to Team Members
 * Updates users, admin_profiles, and team_members collections
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../apps/api/service-account-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// LinkedIn URLs mapped by email
const linkedInUrls = {
  'joel.yaffe@gmail.com': 'https://www.linkedin.com/in/joelyaffe/',
  'alaghetts@gmail.com': 'https://www.linkedin.com/in/marc-reichel-6177b73b/',
  'morganhirtle@gmail.com': 'https://www.linkedin.com/in/uxmo/',
  'alexanderkline13@gmail.com': 'https://www.linkedin.com/in/alexander-kline-futurist-/',
  'doug.kukura@gmail.com': 'https://www.linkedin.com/in/doug-kukura-67043426/',
  'deefactorial@gmail.com': 'https://www.linkedin.com/in/dominique-legault/',
  'christinesavardmedia@gmail.com': 'https://www.linkedin.com/in/christinesavard/',
  'senw@royaltri.com': 'https://www.linkedin.com/in/senwong/',
  'srivastavaaryan005@gmail.com': 'https://www.linkedin.com/in/aryan-srivastava-63607624a/',
  'admin@royaltri.com': 'https://www.royaltri.com/en/'  // Website for Royaltri Admin
};

async function addLinkedInUrls() {
  console.log('🔗 ADDING LINKEDIN URLS TO TEAM MEMBERS\n');
  console.log('================================================================================\n');
  
  try {
    let updateCount = 0;
    let notFoundCount = 0;
    
    for (const [email, linkedInUrl] of Object.entries(linkedInUrls)) {
      console.log(`👤 Processing: ${email}`);
      
      // Find user by email
      const usersSnapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (usersSnapshot.empty) {
        console.log(`   ❌ User not found: ${email}\n`);
        notFoundCount++;
        continue;
      }
      
      const userDoc = usersSnapshot.docs[0];
      const userId = userDoc.id;
      const userData = userDoc.data();
      
      // Determine if this is a LinkedIn URL or a website URL
      const isLinkedIn = linkedInUrl.includes('linkedin.com');
      const isWebsite = !isLinkedIn;
      
      const updateData = {};
      
      if (isLinkedIn) {
        updateData.linkedIn = linkedInUrl;
        console.log(`   🔗 LinkedIn: ${linkedInUrl}`);
      } else {
        updateData.website = linkedInUrl;
        console.log(`   🌐 Website: ${linkedInUrl}`);
      }
      
      // 1. Update users collection
      await db.collection('users').doc(userId).update(updateData);
      console.log(`   ✅ Updated users/${userId}`);
      
      // 2. Update nested adminProfile in users collection
      const adminProfileUpdate = {};
      if (isLinkedIn) {
        adminProfileUpdate['adminProfile.linkedIn'] = linkedInUrl;
      } else {
        adminProfileUpdate['adminProfile.website'] = linkedInUrl;
      }
      await db.collection('users').doc(userId).update(adminProfileUpdate);
      console.log(`   ✅ Updated users/${userId}/adminProfile`);
      
      // 3. Update admin_profiles collection (if exists)
      const adminProfileDoc = await db.collection('admin_profiles').doc(userId).get();
      if (adminProfileDoc.exists) {
        await db.collection('admin_profiles').doc(userId).update(updateData);
        console.log(`   ✅ Updated admin_profiles/${userId}`);
      }
      
      // 4. Update team_members collection (for public team page)
      const teamMemberDoc = await db.collection('team_members').doc(userId).get();
      if (teamMemberDoc.exists) {
        await db.collection('team_members').doc(userId).update(updateData);
        console.log(`   ✅ Updated team_members/${userId}`);
      } else {
        console.log(`   ⚠️  No team_members document found for ${userId}`);
      }
      
      updateCount++;
      console.log(`   🎉 Successfully updated all collections for ${email}\n`);
    }
    
    console.log('================================================================================\n');
    console.log('📊 SUMMARY:\n');
    console.log(`   ✅ Successfully updated: ${updateCount}`);
    console.log(`   ❌ Not found: ${notFoundCount}`);
    console.log(`   📋 Total processed: ${Object.keys(linkedInUrls).length}\n`);
    console.log('================================================================================\n');
    console.log('✅ LinkedIn URLs added! The team page will now display LinkedIn icons.\n');
    
  } catch (error) {
    console.error('❌ Error adding LinkedIn URLs:', error);
  }
  
  process.exit(0);
}

addLinkedInUrls();

