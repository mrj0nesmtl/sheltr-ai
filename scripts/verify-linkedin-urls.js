/**
 * Verify LinkedIn URLs were added successfully
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../apps/api/service-account-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function verifyLinkedInUrls() {
  console.log('🔍 VERIFYING LINKEDIN URLS\n');
  console.log('================================================================================\n');
  
  try {
    const snapshot = await db.collection('team_members').get();
    
    let withLinkedIn = 0;
    let withWebsite = 0;
    let withoutLinks = 0;
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const name = data.name || data.displayName || 'Unknown';
      
      if (data.linkedIn) {
        console.log(`✅ ${name}`);
        console.log(`   LinkedIn: ${data.linkedIn}`);
        withLinkedIn++;
      } else if (data.website) {
        console.log(`✅ ${name}`);
        console.log(`   Website: ${data.website}`);
        withWebsite++;
      } else {
        console.log(`⚠️  ${name}`);
        console.log(`   No LinkedIn or Website`);
        withoutLinks++;
      }
      console.log('');
    });
    
    console.log('================================================================================\n');
    console.log('📊 SUMMARY:\n');
    console.log(`   LinkedIn profiles: ${withLinkedIn}`);
    console.log(`   Website links: ${withWebsite}`);
    console.log(`   No links: ${withoutLinks}`);
    console.log(`   Total team members: ${snapshot.size}\n`);
    console.log('================================================================================\n');
    
    if (withLinkedIn + withWebsite > 0) {
      console.log('✅ LinkedIn/Website icons will now appear on the team page!');
      console.log('🌐 Visit: http://localhost:3000/team\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

verifyLinkedInUrls();

