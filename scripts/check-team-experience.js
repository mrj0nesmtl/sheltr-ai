/**
 * Check Team Years of Experience
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../apps/api/service-account-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkTeamExperience() {
  console.log('🔍 CHECKING TEAM YEARS OF EXPERIENCE\n');
  
  try {
    const snapshot = await db.collection('team_members').get();
    
    let totalExperience = 0;
    let count = 0;
    
    console.log('Individual Experience:\n');
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const years = data.yearsOfExperience || 0;
      console.log(`${data.name}: ${years} years`);
      totalExperience += years;
      count++;
    });
    
    const average = count > 0 ? Math.round(totalExperience / count) : 0;
    
    console.log('\n================================================================================');
    console.log(`Total Team Members: ${count}`);
    console.log(`Total Combined Experience: ${totalExperience} years`);
    console.log(`Average Experience: ${average} years`);
    console.log('================================================================================\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

checkTeamExperience();

