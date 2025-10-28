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

const migrateMSBDocument = async () => {
  console.log('📜 Starting MSB Registration Guide migration...\n');

  try {
    // Read the document
    const docPath = path.join(__dirname, '../docs/10-resources/msb-registration-canada.md');
    console.log(`📄 Reading document from: ${docPath}`);
    
    const content = fs.readFileSync(docPath, 'utf8');
    console.log(`✅ Document loaded: ${content.length} characters\n`);

    // Document metadata - matches SecureDocumentService interface
    const documentData = {
      title: 'msb-registration-canada', // Using slug as title so getDocumentBySlug() works
      category: 'legal-compliance',
      type: 'markdown',
      content: content,
      isActive: true, // Required by SecureDocumentService
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'migration-script',
      lastModifiedBy: 'migration-script',
      version: 1,
      tags: ['legal', 'compliance', 'msb', 'fintrac', 'crypto', 'incorporation', 'regulatory'],
      metadata: {
        description: 'Comprehensive guide for MSB registration and incorporation in Canada for crypto-enabled donation platforms',
        author: 'SHELTR Legal Research Team',
        confidentialityLevel: 'founder',
        displayTitle: 'MSB Registration & Incorporation Guide for SHELTR',
        preparedFor: 'SHELTR Leadership Team',
        regulatoryFocus: 'FINTRAC MSB Requirements',
        jurisdiction: 'Canada (Federal, Ontario, Alberta)',
        authorizedUsers: [
          // Super Admin
          'joel.yaffe@gmail.com',
          // Platform Admins (all have Founders Portal access)
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
        ]
      }
    };

    // Check if document already exists (search by title which contains the slug)
    const existingQuery = await db.collection('founder_documents')
      .where('title', '==', 'msb-registration-canada')
      .get();

    if (!existingQuery.empty) {
      console.log('⚠️  Document already exists! Updating...');
      const docId = existingQuery.docs[0].id;
      await db.collection('founder_documents').doc(docId).update({
        ...documentData,
        createdAt: existingQuery.docs[0].data().createdAt, // Preserve original creation time
      });
      console.log(`✅ Updated existing document with ID: ${docId}`);
    } else {
      // Create new document
      const docRef = await db.collection('founder_documents').add(documentData);
      console.log(`✅ Created new document with ID: ${docRef.id}`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📊 Document Details:');
    console.log(`   Display Title: ${documentData.metadata.displayTitle}`);
    console.log(`   Slug/Title: ${documentData.title}`);
    console.log(`   Category: ${documentData.category}`);
    console.log(`   Content Length: ${content.length} characters`);
    console.log(`   Authorized Users: ${documentData.metadata.authorizedUsers.length} users`);
    console.log('\n🔗 Access URL: /secure-docs/msb-registration-canada');
    console.log('\n✅ All Founders Portal users now have access!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateMSBDocument();

