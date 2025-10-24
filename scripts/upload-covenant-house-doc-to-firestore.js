const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../apps/api/service-account-key.json');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function uploadCovenantHouseDocument() {
  const docPath = path.join(__dirname, '../.local-secure-docs/backup-20251023-020011/covenant-house-canada-outreach.md');
  const documentId = 'covenant-house-canada-outreach';

  try {
    console.log('📄 Reading Covenant House proposal document...');
    const content = fs.readFileSync(docPath, 'utf8');
    console.log(`✅ Read ${content.length} characters`);

    console.log('📤 Uploading to Firestore...');
    await db.collection('founder_documents').doc(documentId).set({
      title: 'Covenant House Canada Partnership Proposal',
      slug: documentId,
      content: content,
      category: 'partnership',
      type: 'secure',
      tags: ['covenant-house', 'partnership', 'canada', 'youth', 'pilot', 'outreach'],
      metadata: {
        displayTitle: 'Covenant House Canada Partnership Proposal',
        description: 'Executive outreach document for SHELTR + Covenant House pilot project 2026-2027 targeting youth homelessness innovation',
        author: 'SHELTR Leadership Team',
        confidentialityLevel: 'founder',
        color: 'pink',
        targetOrganization: 'Covenant House Canada',
        proposedTimeline: '2026-2027',
        pilotCities: ['Toronto', 'Vancouver'],
      },
      version: '1.0',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Covenant House proposal uploaded successfully!');
    console.log(`📍 Document ID: ${documentId}`);
    console.log(`📂 Collection: founder_documents`);
    console.log(`🔗 Access at: /portal/founders-only/covenant-house-outreach`);

  } catch (error) {
    console.error('❌ Error uploading Covenant House document:', error);
  }
}

uploadCovenantHouseDocument();

