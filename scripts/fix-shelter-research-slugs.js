const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const slugMapping = {
  'general-research': {
    slug: 'general-research',
    displayTitle: 'General Shelter Research & HMIS Overview'
  },
  'shelters-state-by-state': {
    slug: 'shelters-state-by-state',
    displayTitle: 'US State-by-State Shelter Analysis'
  },
  'top-shelters-canada': {
    slug: 'top-shelters-canada',
    displayTitle: 'Top Homeless Shelters in Canada'
  },
  'unique-shelter-programs': {
    slug: 'unique-shelter-programs',
    displayTitle: 'Unique & Innovative Shelter Programs'
  }
};

async function fixShelterResearchSlugs() {
  console.log('🔧 FIXING SHELTER RESEARCH DOCUMENT SLUGS\n');
  console.log('================================================================================\n');

  try {
    // Query all shelter research documents
    const querySnapshot = await db.collection('founder_documents')
      .where('category', '==', 'shelter-research')
      .get();

    console.log(`📋 Found ${querySnapshot.size} shelter research documents\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const doc of querySnapshot.docs) {
      const docId = doc.id;
      const data = doc.data();
      const currentTitle = data.title;

      console.log(`\n📄 Processing Document:`);
      console.log(`   Document ID: ${docId}`);
      console.log(`   Current Title: ${currentTitle}`);
      console.log(`   Current Slug: ${data.slug || '❌ MISSING'}`);
      console.log(`   Display Title: ${data.metadata?.displayTitle || 'N/A'}`);

      // Check if this title exists in our mapping
      if (slugMapping[currentTitle]) {
        const mapping = slugMapping[currentTitle];
        
        // Update document with slug field
        await doc.ref.update({
          slug: mapping.slug,
          title: mapping.slug, // Ensure title matches slug
          'metadata.displayTitle': mapping.displayTitle,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`   ✅ Updated with slug: ${mapping.slug}`);
        updatedCount++;
      } else {
        console.log(`   ⚠️  No mapping found for title: ${currentTitle}, skipping...`);
        skippedCount++;
      }
    }

    console.log('\n================================================================================\n');
    console.log('📊 SUMMARY:\n');
    console.log(`   ✅ Updated: ${updatedCount} documents`);
    console.log(`   ⚠️  Skipped: ${skippedCount} documents`);
    console.log(`   📁 Total: ${querySnapshot.size} documents processed\n`);

    console.log('🔗 Expected URLs:\n');
    Object.keys(slugMapping).forEach(slug => {
      console.log(`   • https://sheltr-ai.web.app/secure-docs/shelter-research/${slug}`);
    });

    console.log('\n================================================================================\n');
    console.log('✅ SLUG FIX COMPLETE!\n');
    console.log('🔄 Please test all document links in production.\n');

  } catch (error) {
    console.error('❌ Error fixing shelter research slugs:', error);
    process.exit(1);
  }

  process.exit(0);
}

fixShelterResearchSlugs();
