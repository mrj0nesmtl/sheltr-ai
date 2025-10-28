const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sheltr-ai.firebaseio.com"
  });
}

const db = admin.firestore();

const fixChristineName = async () => {
  console.log('🔧 Fixing Christine Savard name fields...\n');

  const christineUID = 'v072TC5ZJ7X6A0CRtAGR1kWuNKF2';
  const email = 'christinesavardmedia@gmail.com';

  try {
    // Get Christine's user document
    const userDoc = await db.collection('users').doc(christineUID).get();
    
    if (!userDoc.exists) {
      console.log('❌ Christine\'s user document not found!');
      return;
    }

    const userData = userDoc.data();
    console.log('📄 Current user data:');
    console.log(`   displayName: ${userData.displayName}`);
    console.log(`   firstName: ${userData.firstName || '(missing)'}`);
    console.log(`   lastName: ${userData.lastName || '(missing)'}`);
    console.log(`   name: ${userData.name || '(missing)'}`);
    
    // Update with firstName and lastName
    await db.collection('users').doc(christineUID).update({
      firstName: 'Christine',
      lastName: 'Savard',
      name: 'Christine Savard', // Also add full name field
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('\n✅ Successfully updated Christine\'s name fields!');
    console.log('   firstName: Christine');
    console.log('   lastName: Savard');
    console.log('   name: Christine Savard');
    console.log('\n💡 Her name should now display properly in the user dashboard!');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error updating Christine\'s name:', error);
    process.exit(1);
  }
};

fixChristineName();

