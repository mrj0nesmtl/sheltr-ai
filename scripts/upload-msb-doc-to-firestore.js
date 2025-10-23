const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function uploadMSBDocument() {
  try {
    console.log('📄 Reading MSB Registration document...');
    
    // Read the markdown file
    const filePath = path.join(__dirname, '../.local-secure-docs/backup-20251023-020011/msb-registration-canada.md');
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`✅ Read ${content.length} characters`);
    
    // Create the document data
    const documentData = {
      title: 'MSB Registration Guide - Canada',
      slug: 'msb-registration-canada',
      content: content,
      category: 'legal',
      type: 'secure',
      tags: ['legal', 'compliance', 'canada', 'fintrac', 'msb', 'cryptocurrency'],
      metadata: {
        displayTitle: 'Money Services Business (MSB) Registration Guide',
        description: 'Canadian regulatory compliance guide for crypto-enabled donation platforms - FINTRAC MSB requirements and incorporation',
        author: 'SHELTR Legal Team',
        confidentialityLevel: 'founder',
        color: 'red'
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      version: '1.0'
    };
    
    console.log('📤 Uploading to Firestore...');
    
    // Upload to Firestore
    await db.collection('founder_documents').doc('msb-registration-canada').set(documentData);
    
    console.log('✅ MSB Registration document uploaded successfully!');
    console.log('📍 Document ID: msb-registration-canada');
    console.log('📂 Collection: founder_documents');
    console.log('🔗 Access at: /portal/founders-only/msb-registration');
    
  } catch (error) {
    console.error('❌ Error uploading document:', error);
    process.exit(1);
  }
}

// Run the upload
uploadMSBDocument()
  .then(() => {
    console.log('\n✅ Upload complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Upload failed:', error);
    process.exit(1);
  });

