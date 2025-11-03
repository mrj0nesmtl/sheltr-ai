#!/usr/bin/env node

/**
 * Debug Script: Check Published Documents in Firestore
 * 
 * This script queries the knowledge_documents collection for documents
 * that are published to the Founders Portal.
 */

require('dotenv').config({ path: 'apps/api/.env' });
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkPublishedDocs() {
  try {
    console.log('\n🔥 Querying Firestore for published documents...\n');
    
    // Query for documents published to Founders Portal
    const snapshot = await db.collection('knowledge_documents')
      .where('published_to_founders', '==', true)
      .get();
    
    console.log(`📊 Found ${snapshot.size} documents published to Founders Portal\n`);
    
    if (snapshot.empty) {
      console.log('⚠️  No documents found! This is why the card isn\'t showing up.\n');
      console.log('Checking for "Hacking Homelessness" document...\n');
      
      // Search for the document by title
      const allDocs = await db.collection('knowledge_documents')
        .where('title', '==', 'Hacking Homelessness - Better to Solve than Manage.')
        .get();
      
      if (!allDocs.empty) {
        allDocs.forEach(doc => {
          const data = doc.data();
          console.log(`✅ Found document: ${doc.id}`);
          console.log(`   Title: ${data.title}`);
          console.log(`   Published to Founders: ${data.published_to_founders || false}`);
          console.log(`   Published to IR: ${data.published_to_ir || false}`);
          console.log(`   Permission Level: ${data.permission_level || 'N/A'}`);
          console.log(`   Secure Slug: ${data.secure_slug || 'N/A'}`);
          console.log(`   Hub Slug: ${data.hub_slug || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('❌ Document not found in Firestore at all!');
      }
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`📄 Document ID: ${doc.id}`);
        console.log(`   Title: ${data.title}`);
        console.log(`   Permission Level: ${data.permission_level || 'public'}`);
        console.log(`   Secure Slug: ${data.secure_slug || 'N/A'}`);
        console.log(`   Hub Slug: ${data.hub_slug || 'N/A'}`);
        console.log(`   Founders Description: ${data.founders_description || 'N/A'}`);
        console.log(`   Badge: ${data.secure_badge || 'N/A'}`);
        console.log(`   Badge Color: ${data.secure_badge_color || 'N/A'}`);
        console.log('');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error querying Firestore:', error);
    process.exit(1);
  }
}

checkPublishedDocs();

