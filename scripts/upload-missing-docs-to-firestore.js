/**
 * Upload Missing Documents to Firestore
 * 
 * This script uploads documents from .local-secure-docs to Firestore
 * so they can be viewed in the investor data room.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../apps/api/service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = admin.firestore();

async function uploadDocuments() {
  console.log('🚀 Uploading Missing Documents to Firestore...\n');

  // Only upload documents that match the investor data room cards
  const documents = [
    {
      id: 'adyen-integration',
      filePath: '.local-secure-docs/payment-rails/ADYEN-INTEGRATION-STRATEGIC-ANALYSIS.md',
      title: 'Adyen Integration Strategy',
      displayTitle: 'Adyen Integration Strategic Analysis',
      description: 'Comprehensive analysis of Adyen for Platforms (Balanced Model) with 16-week implementation roadmap for SmartFund™ 80-15-5 distribution',
      category: 'Strategic',
      tags: ['adyen', 'payment-processing', 'strategic-analysis', 'platforms', 'balanced-model'],
      author: 'Joel Yaffe + DK (CFO)',
      version: '1.0.0'
    },
    {
      id: 'proposed-payment-rails',
      filePath: 'docs/02-architecture/payment-rails/sheltr-unified-payment-architecture.md',
      title: 'Proposed Payment Rails',
      displayTitle: 'SHELTR Unified Payment Architecture',
      description: 'Adyen + Coinbase integration architecture with single-token stable fund model',
      category: 'Enterprise',
      tags: ['payment-rails', 'architecture', 'stablecoin', 'smart-contracts', 'adyen'],
      author: 'SHELTR Team',
      version: '2.0.0'
    },
    {
      id: 'development-roadmap',
      filePath: 'docs/02-architecture/payment-rails/sheltr-demo-implementation.md',
      title: 'Development Roadmap',
      displayTitle: '60-Day Public Launch Timeline',
      description: '60-day public launch timeline with client onboarding strategy and AI achievements',
      category: 'Launch Plan',
      tags: ['roadmap', 'timeline', 'launch', 'implementation'],
      author: 'SHELTR Team',
      version: '1.0.0'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const doc of documents) {
    try {
      console.log(`📄 Uploading ${doc.title}...`);
      
      const fullPath = path.join(__dirname, '..', doc.filePath);
      
      if (!fs.existsSync(fullPath)) {
        console.error(`❌ File not found: ${fullPath}`);
        errorCount++;
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      
      await db.collection('founder_documents').doc(doc.id).set({
        title: doc.title,
        slug: doc.id,
        content: content,
        category: doc.category,
        type: 'secure',
        tags: doc.tags,
        metadata: {
          displayTitle: doc.displayTitle,
          description: doc.description,
          author: doc.author,
          confidentialityLevel: 'founder',
          version: doc.version,
          created: new Date().toLocaleDateString(),
          status: 'Active'
        },
        version: doc.version,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      console.log(`✅ ${doc.title} uploaded successfully!`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error uploading ${doc.title}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successfully uploaded: ${successCount} documents`);
  console.log(`   ❌ Errors: ${errorCount}`);
  
  if (successCount > 0) {
    console.log(`\n🎉 Documents are now available in Firestore!`);
    console.log(`   Collection: founder_documents`);
    console.log(`\n📋 Access via:`);
    console.log(`   - Founders Portal: /portal/founders-only/[document-id]`);
    console.log(`   - Investor Data Room: /ir/documents/[document-id]`);
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

uploadDocuments();

