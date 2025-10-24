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

async function uploadAdyenDocuments() {
  console.log('🚀 Uploading Adyen Integration Documents to Firestore...\n');

  let successCount = 0;
  let errorCount = 0;

  // Document 1: Adyen Integration Strategic Analysis
  try {
    console.log('📄 Uploading Adyen Integration Strategic Analysis...');
    const strategicAnalysisPath = path.join(__dirname, '../docs/02-architecture/payment-rails/ADYEN-INTEGRATION-STRATEGIC-ANALYSIS.md');
    const strategicAnalysisContent = fs.readFileSync(strategicAnalysisPath, 'utf8');
    
    await db.collection('founder_documents').doc('adyen-integration-strategic-analysis').set({
      title: 'Adyen Integration Strategic Analysis',
      slug: 'adyen-integration-strategic-analysis',
      content: strategicAnalysisContent,
      category: 'payment-rails',
      type: 'secure',
      tags: ['adyen', 'payment-processing', 'strategic-analysis', 'platforms', 'balanced-model', 'implementation'],
      metadata: {
        displayTitle: 'Adyen Integration Strategic Analysis & Implementation Plan',
        description: 'Comprehensive analysis of Adyen payment models with recommendation for Adyen for Platforms (Balanced Model). Includes 16-week implementation roadmap, cost analysis, and technical specifications for SmartFund™ 80-15-5 distribution.',
        author: 'Joel Yaffe + DK (CFO)',
        confidentialityLevel: 'founder',
        color: 'blue',
        version: '1.0.0',
        created: 'October 24, 2025',
        status: 'Pre-Implementation Strategic Review'
      },
      version: '1.0.0',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('✅ Adyen Integration Strategic Analysis uploaded successfully!');
    successCount++;
  } catch (error) {
    console.error('❌ Error uploading Adyen Integration Strategic Analysis:', error);
    errorCount++;
  }

  // Document 2: Implementation Readiness Summary
  try {
    console.log('\n📄 Uploading Implementation Readiness Summary...');
    const readinessSummaryPath = path.join(__dirname, '../docs/02-architecture/payment-rails/IMPLEMENTATION-READINESS-SUMMARY.md');
    const readinessSummaryContent = fs.readFileSync(readinessSummaryPath, 'utf8');
    
    await db.collection('founder_documents').doc('implementation-readiness-summary').set({
      title: 'Implementation Readiness Summary',
      slug: 'implementation-readiness-summary',
      content: readinessSummaryContent,
      category: 'payment-rails',
      type: 'secure',
      tags: ['implementation', 'roadmap', 'payment-rails', 'adyen', 'coinbase', 'smart-contracts', 'readiness'],
      metadata: {
        displayTitle: 'SHELTR Payment Rails - Implementation Readiness Summary',
        description: 'Executive summary of payment architecture implementation readiness. Includes complete payment flow, financial model, 16-week timeline, success metrics, and next steps for Adyen partnership discussions.',
        author: 'Joel Yaffe + DK (CFO)',
        confidentialityLevel: 'founder',
        color: 'green',
        version: '1.0.0',
        created: 'October 24, 2025',
        status: 'Ready for Implementation'
      },
      version: '1.0.0',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('✅ Implementation Readiness Summary uploaded successfully!');
    successCount++;
  } catch (error) {
    console.error('❌ Error uploading Implementation Readiness Summary:', error);
    errorCount++;
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successfully uploaded: ${successCount} documents`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`\n🎉 Adyen integration documents are now secure in Firestore!`);
  console.log(`   Collection: founder_documents`);
  console.log(`\n📋 Next Steps:`);
  console.log(`   1. Move local files to .local-secure-docs/`);
  console.log(`   2. Create secure viewing pages in Founders Portal`);
  console.log(`   3. Add cards to Founders Portal index`);
  console.log(`   4. Test authenticated access`);
}

uploadAdyenDocuments();

