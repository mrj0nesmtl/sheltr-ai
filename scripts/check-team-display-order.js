/**
 * Check Team Display Order
 * Verifies the displayOrder field in the team_members collection
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../apps/api/service-account-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkTeamDisplayOrder() {
  console.log('🔍 CHECKING TEAM DISPLAY ORDER\n');
  console.log('================================================================================\n');
  
  try {
    const teamMembersSnapshot = await db.collection('team_members')
      .get();
    
    if (teamMembersSnapshot.empty) {
      console.log('⚠️  No team members found in collection');
      return;
    }
    
    console.log(`Found ${teamMembersSnapshot.size} team members:\n`);
    
    teamMembersSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      const displayOrder = data.displayOrder !== undefined ? data.displayOrder : 'NOT SET';
      const name = data.name || data.displayName || 'Unknown';
      const role = data.role || 'Unknown';
      const jobTitle = data.jobTitle || 'No job title';
      
      console.log(`${index + 1}. ${name}`);
      console.log(`   Role: ${role}`);
      console.log(`   Job Title: ${jobTitle}`);
      console.log(`   Display Order: ${displayOrder}`);
      console.log(`   Email: ${data.email}`);
      console.log('');
    });
    
    console.log('================================================================================\n');
    
    // Check for members without displayOrder
    const withoutOrder = teamMembersSnapshot.docs.filter(doc => doc.data().displayOrder === undefined);
    if (withoutOrder.length > 0) {
      console.log(`⚠️  ${withoutOrder.length} members don't have displayOrder set:`);
      withoutOrder.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${data.name || data.displayName} (${data.email})`);
      });
      console.log('');
    } else {
      console.log('✅ All team members have displayOrder set!\n');
    }
    
  } catch (error) {
    console.error('❌ Error checking team display order:', error);
  }
  
  process.exit(0);
}

checkTeamDisplayOrder();

