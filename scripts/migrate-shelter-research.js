const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sheltr-ai.firebaseio.com"
  });
}

const db = admin.firestore();

// Document configurations
const documents = [
  {
    filename: 'general-research.md',
    slug: 'general-research',
    displayTitle: 'General Shelter Research & HMIS Overview',
    description: 'Comprehensive research on shelter operations, HMIS systems, best practices, and industry trends',
    color: 'purple'
  },
  {
    filename: 'shelters_state_by_state.md',
    slug: 'shelters-state-by-state',
    displayTitle: 'US State-by-State Shelter Analysis',
    description: 'Detailed breakdown of homeless shelters across all 50 US states',
    color: 'blue'
  },
  {
    filename: 'top_homeless_shelters_canada.md',
    slug: 'top-shelters-canada',
    displayTitle: 'Top Homeless Shelters in Canada',
    description: 'Leading Canadian shelters, programs, and innovative approaches to homelessness',
    color: 'red'
  },
  {
    filename: 'unique_shelter_programs_ for_homelessness.md',
    slug: 'unique-shelter-programs',
    displayTitle: 'Unique & Innovative Shelter Programs',
    description: 'Success stories and innovative approaches from shelters across North America',
    color: 'green'
  }
];

// All authorized users (Super Admin + Platform Admins)
const authorizedUsers = [
  'joel.yaffe@gmail.com',
  'alexanderkline13@gmail.com',
  'alaghetts@gmail.com',
  'doug.kukura@gmail.com',
  'morganhirtle@gmail.com',
  'deefactorial@gmail.com',
  'gunnar.blaze@gmail.com',
  'f.tjeff79@gmail.com',
  'zaffialaplante@gmail.com',
  'srivastavaaryan005@gmail.com',
  'senw@royaltri.com',
  'admin@royaltri.com'
];

const migrateShelterResearch = async () => {
  console.log('🏠 Starting Shelter Research migration...\n');

  const basePath = path.join(__dirname, '../apps/web/src/app/secure-docs/shelter-data');
  let successCount = 0;
  let updateCount = 0;
  let errorCount = 0;

  for (const doc of documents) {
    try {
      const filePath = path.join(basePath, doc.filename);
      console.log(`\n📄 Processing: ${doc.displayTitle}`);
      console.log(`   File: ${doc.filename}`);
      
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  File not found, skipping...`);
        errorCount++;
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`   ✅ Loaded: ${content.length} characters`);

      // Document metadata - matches SecureDocumentService interface
      const documentData = {
        title: doc.slug, // Using slug as title for getDocumentBySlug()
        category: 'shelter-research',
        type: 'markdown',
        content: content,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: 'migration-script',
        lastModifiedBy: 'migration-script',
        version: 1,
        tags: ['shelter', 'research', 'homeless', 'north-america', 'programs'],
        metadata: {
          description: doc.description,
          author: 'SHELTR Research Team',
          confidentialityLevel: 'founder',
          displayTitle: doc.displayTitle,
          color: doc.color,
          authorizedUsers: authorizedUsers
        }
      };

      // Check if document already exists
      const existingQuery = await db.collection('founder_documents')
        .where('title', '==', doc.slug)
        .get();

      if (!existingQuery.empty) {
        const docId = existingQuery.docs[0].id;
        await db.collection('founder_documents').doc(docId).update({
          ...documentData,
          createdAt: existingQuery.docs[0].data().createdAt, // Preserve original creation time
        });
        console.log(`   🔄 Updated existing document (ID: ${docId})`);
        updateCount++;
      } else {
        const docRef = await db.collection('founder_documents').add(documentData);
        console.log(`   ✅ Created new document (ID: ${docRef.id})`);
        successCount++;
      }

    } catch (error) {
      console.error(`   ❌ Error processing ${doc.filename}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Migration completed!');
  console.log('='.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Created: ${successCount} documents`);
  console.log(`   🔄 Updated: ${updateCount} documents`);
  console.log(`   ❌ Errors: ${errorCount} documents`);
  console.log(`   📁 Total: ${documents.length} documents processed`);
  console.log(`\n🔗 Access URLs:`);
  documents.forEach(doc => {
    console.log(`   • /secure-docs/shelter-research/${doc.slug}`);
  });
  console.log(`   • /secure-docs/shelter-research (hub page)`);
  console.log(`\n👥 Authorized Users: ${authorizedUsers.length} users`);
  console.log(`\n✅ All Platform Admins and Super Admin now have access!`);

  process.exit(0);
};

migrateShelterResearch().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});

