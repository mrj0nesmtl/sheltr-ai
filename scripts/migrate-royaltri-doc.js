/**
 * Migrate Royaltri Design Guide to Secure Firestore Storage
 * 
 * This script moves the royaltri-design-guide.md file into Firestore
 * as a secure document accessible via the SecureDocumentViewer
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateRoyaltriDoc() {
  try {
    console.log('🎨 Starting Royaltri Design Guide migration...\n');

    // Read the markdown file
    const docPath = path.join(__dirname, '../docs/06-user-guides/royaltri-design-guide.md');
    console.log(`📄 Reading document from: ${docPath}`);
    
    const content = fs.readFileSync(docPath, 'utf8');
    console.log(`✅ Document loaded: ${content.length} characters\n`);

    // Document metadata - matches SecureDocumentService interface
    const documentData = {
      title: 'royaltri-design-guide', // Using slug as title so getDocumentBySlug() works
      category: 'design-guide',
      type: 'markdown',
      content: content,
      isActive: true, // Required by SecureDocumentService
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'migration-script',
      lastModifiedBy: 'migration-script',
      version: 1,
      tags: ['design', 'branding', 'ui-ux', 'royaltri', 'design-system'],
      metadata: {
        description: 'Comprehensive brand and design system guide for Royaltri agency design review',
        author: 'SHELTR Team',
        confidentialityLevel: 'founder',
        displayTitle: 'SHELTR Brand & Design System Overview',
        preparedFor: 'Royaltri Agency',
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
      .where('title', '==', 'royaltri-design-guide')
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
    console.log('\n🔗 Access URL: /secure-docs/royaltri-design-guide');
    console.log('\n✅ Sen Wong (senw@royaltri.com) now has access!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateRoyaltriDoc();

