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

const fixMSBSlug = async () => {
  console.log('🔧 FIXING MSB DOCUMENT SLUG\n');
  console.log('================================================================================\n');

  try {
    // Find the MSB document
    const query = await db.collection('founder_documents')
      .where('title', '==', 'msb-registration-canada')
      .get();

    if (query.empty) {
      console.log('❌ Document not found!');
      process.exit(1);
    }

    const doc = query.docs[0];
    const data = doc.data();
    
    console.log('📋 Current Document Data:\n');
    console.log(`   Document ID: ${doc.id}`);
    console.log(`   Title: ${data.title}`);
    console.log(`   Slug: ${data.slug || '❌ MISSING'}`);
    console.log(`   Category: ${data.category}`);
    console.log(`   Display Title: ${data.metadata?.displayTitle}\n`);

    // Add slug field
    await doc.ref.update({
      slug: 'msb-registration-canada',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Added slug field to document\n');

    // Verify the update
    const updatedDoc = await doc.ref.get();
    const updatedData = updatedDoc.data();

    console.log('================================================================================\n');
    console.log('✅ VERIFICATION - Updated Document Data:\n');
    console.log(`   Document ID: ${updatedDoc.id}`);
    console.log(`   Title: ${updatedData.title}`);
    console.log(`   Slug: ${updatedData.slug}`);
    console.log(`   Category: ${updatedData.category}`);
    console.log(`   Display Title: ${updatedData.metadata?.displayTitle}\n`);

    console.log('================================================================================\n');
    console.log('🎉 SUCCESS! MSB document now has slug field.\n');
    console.log('🔗 Production URL: https://sheltr-ai.web.app/secure-docs/msb-registration-canada\n');
    console.log('Please refresh the page to see the document.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing MSB slug:', error);
    process.exit(1);
  }
};

fixMSBSlug();

