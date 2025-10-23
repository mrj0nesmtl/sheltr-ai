const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkGallery() {
  console.log('🔍 Checking gallery collection...\n');
  
  const snapshot = await db.collection('gallery').limit(5).get();
  console.log(`📊 Total gallery items found: ${snapshot.size}\n`);
  
  snapshot.docs.forEach((doc, index) => {
    const data = doc.data();
    console.log(`--- Item ${index + 1} ---`);
    console.log('Document ID:', doc.id);
    console.log('Title:', data.title || 'No title');
    console.log('Type:', data.type || 'No type');
    console.log('isFoundersGallery:', data.isFoundersGallery);
    console.log('showInFoundersGallery:', data.showInFoundersGallery);
    console.log('All fields:', Object.keys(data).join(', '));
    console.log('');
  });
  
  // Check for items with isFoundersGallery = true
  const foundersQuery = await db.collection('gallery')
    .where('isFoundersGallery', '==', true)
    .get();
  console.log(`✅ Items with isFoundersGallery=true: ${foundersQuery.size}`);
  
  process.exit(0);
}

checkGallery().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

