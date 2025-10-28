const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fixGeneralResearchTitle() {
  console.log('🔧 FIXING GENERAL RESEARCH DOCUMENT TITLE\n');
  console.log('================================================================================\n');

  try {
    const docId = 'InJjr7N2XinWhAvvXyPz';
    const docRef = db.collection('founder_documents').doc(docId);
    
    // Get current data
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      console.log('❌ Document not found!');
      process.exit(1);
    }

    const currentData = docSnap.data();
    console.log('📋 Current Document Data:\n');
    console.log(`   Document ID: ${docId}`);
    console.log(`   Current Title: "${currentData.title}"`);
    console.log(`   Current Slug: "${currentData.slug || 'MISSING'}"`);
    console.log(`   Display Title: "${currentData.metadata?.displayTitle || 'N/A'}"`);
    console.log(`   Category: ${currentData.category}`);

    // Update with correct title and slug
    await docRef.update({
      title: 'general-research',
      slug: 'general-research',
      'metadata.displayTitle': 'General Shelter Research & HMIS Overview',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('\n✅ Updated document with correct title and slug\n');

    // Verify the update
    const updatedSnap = await docRef.get();
    const updatedData = updatedSnap.data();
    
    console.log('================================================================================\n');
    console.log('✅ VERIFICATION - Updated Document Data:\n');
    console.log(`   Document ID: ${docId}`);
    console.log(`   New Title: "${updatedData.title}"`);
    console.log(`   New Slug: "${updatedData.slug}"`);
    console.log(`   Display Title: "${updatedData.metadata?.displayTitle}"`);
    console.log(`   Category: ${updatedData.category}\n`);

    console.log('🔗 Expected URL:\n');
    console.log(`   • https://sheltr-ai.web.app/secure-docs/shelter-research/general-research\n`);
    console.log('================================================================================\n');
    console.log('🎉 SUCCESS! General Research document is now fixed.\n');
    console.log('🔄 Please test the link in production.\n');

  } catch (error) {
    console.error('❌ Error fixing General Research title:', error);
    process.exit(1);
  }

  process.exit(0);
}

fixGeneralResearchTitle();

