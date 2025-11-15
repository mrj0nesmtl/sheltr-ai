const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkCoordinates() {
  const sheltersRef = db.collection('shelters');
  const snapshot = await sheltersRef.get();
  
  console.log('🗺️  Current Coordinates in Firestore:\n');
  
  for (const doc of snapshot.docs) {
    const shelter = doc.data();
    const publicConfigRef = db.collection('shelters').doc(doc.id).collection('public_config').doc('config');
    const configSnap = await publicConfigRef.get();
    
    console.log(`📍 ${shelter.name}`);
    console.log(`   Address: ${shelter.address}`);
    
    if (configSnap.exists && configSnap.data().coordinates) {
      const coords = configSnap.data().coordinates;
      console.log(`   ✅ Coordinates: (${coords.lat}, ${coords.lng})`);
      console.log(`   Source: ${coords.source || 'unknown'}\n`);
    } else {
      console.log(`   ❌ NO COORDINATES in public_config\n`);
    }
  }
  
  process.exit(0);
}

checkCoordinates();

