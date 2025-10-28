/**
 * Check Team Job Titles
 * See what job titles are stored in team_members
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../apps/api/service-account-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkTeamJobTitles() {
  console.log('🔍 CHECKING TEAM JOB TITLES\n');
  
  try {
    const snapshot = await db.collection('team_members').get();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log('Name:', data.name);
      console.log('Email:', data.email);
      console.log('Job Title:', data.jobTitle);
      console.log('Specialization:', data.specialization);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

checkTeamJobTitles();

