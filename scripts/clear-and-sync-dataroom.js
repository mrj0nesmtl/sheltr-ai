/**
 * Clear and Sync Investor Data Room
 * 
 * Step 1: Clear all documents from secure_documents collection
 * Step 2: Sync only the approved documents with full content
 */

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Documents to share with investor data room
const investorDataRoomDocuments = [
  'adyen-integration',
  'blockchain-architecture',
  'business-plan',
  'covenant-house-outreach',
  'development-roadmap',
  'github-repository',
  'investor-relations',
  'leadership-team',
  'msb-registration',
  'proposed-payment-rails',
  'platform-admin-guide',
  'shelter-research',
  'system-design',
  'technical-whitepaper'
];

// Card metadata for each document
const cardMetadata = {
  'adyen-integration': {
    title: 'Adyen Integration Strategy',
    description: 'Comprehensive analysis of Adyen for Platforms (Balanced Model) with 16-week implementation roadmap for SmartFund™ 80-15-5 distribution',
    badgeText: 'Strategic',
    badgeClass: 'bg-blue-500 text-white',
    titleColor: 'text-blue-500',
    buttonText: 'View Strategy',
    buttonClass: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
    href: '/portal/founders-only/adyen-integration',
    borderClass: 'border-blue-200',
    category: 'secure',
  },
  'blockchain-architecture': {
    title: 'Blockchain Architecture',
    description: 'Single-token stable fund ecosystem with enterprise payment infrastructure and guaranteed returns',
    badgeText: 'SmartFund™',
    badgeClass: 'bg-orange-600 text-white',
    titleColor: 'text-orange-600',
    buttonText: 'View Blockchain',
    buttonClass: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50',
    href: '/tokenomics',
    borderClass: 'border-orange-200',
    category: 'public',
  },
  'business-plan': {
    title: 'Business Plan',
    description: 'Professional VC-worthy business plan with market analysis, financial projections, and exit strategy',
    badgeText: 'Secure',
    badgeClass: 'bg-red-600 text-white',
    titleColor: 'text-red-600',
    buttonText: 'View Business Plan',
    buttonClass: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
    href: '/portal/founders-only/business-plan',
    borderClass: 'border-red-200',
    category: 'secure',
  },
  'covenant-house-outreach': {
    title: 'Covenant House Proposal',
    description: 'Executive partnership proposal for Covenant House Canada 2026-2027 youth homelessness innovation pilot',
    badgeText: 'Partnership',
    badgeClass: 'bg-pink-600 text-white',
    titleColor: 'text-pink-600',
    buttonText: 'View Proposal',
    buttonClass: 'border-2 border-pink-600 text-pink-600 hover:bg-pink-50',
    href: '/portal/founders-only/covenant-house-outreach',
    borderClass: 'border-pink-200',
    category: 'secure',
  },
  'development-roadmap': {
    title: 'Development Roadmap',
    description: '60-day public launch timeline with client onboarding strategy and AI achievements',
    badgeText: 'Launch Plan',
    badgeClass: 'bg-orange-500 text-white',
    titleColor: 'text-orange-500',
    buttonText: 'View Roadmap',
    buttonClass: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50',
    href: '/portal/founders-only/development-roadmap',
    borderClass: 'border-orange-200',
    category: 'secure',
  },
  'github-repository': {
    title: 'GitHub Repository',
    description: 'Complete source code, smart contracts, and development history',
    badgeText: 'Source Code',
    badgeClass: 'bg-purple-600 text-white',
    titleColor: 'text-purple-600',
    buttonText: 'View Repository',
    buttonClass: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
    href: 'https://github.com/mrj0nesmtl/sheltr-ai',
    borderClass: 'border-purple-200',
    category: 'public',
  },
  'investor-relations': {
    title: 'Investor Relations',
    description: 'Pre-seed funding information, financial projections, and investment terms',
    badgeText: 'Pre-Seed',
    badgeClass: 'bg-blue-600 text-white',
    titleColor: 'text-blue-600',
    buttonText: 'View Details',
    buttonClass: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    href: '/portal/founders-only/investor-relations',
    borderClass: 'border-blue-200',
    category: 'secure',
  },
  'leadership-team': {
    title: 'Leadership Team',
    description: 'Meet the SHELTR leadership team, founders, and key contributors driving our mission',
    badgeText: 'Team',
    badgeClass: 'bg-indigo-600 text-white',
    titleColor: 'text-indigo-600',
    buttonText: 'View Team',
    buttonClass: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    href: '/portal/founders-only/leadership-team',
    borderClass: 'border-indigo-200',
    category: 'public',
  },
  'msb-registration': {
    title: 'MSB Registration Guide',
    description: 'Canadian regulatory compliance guide for crypto-enabled donation platforms - FINTRAC MSB requirements and incorporation',
    badgeText: 'Legal',
    badgeClass: 'bg-red-600 text-white',
    titleColor: 'text-red-600',
    buttonText: 'View Legal Guide',
    buttonClass: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
    href: '/portal/founders-only/msb-registration',
    borderClass: 'border-red-200',
    category: 'secure',
  },
  'proposed-payment-rails': {
    title: 'Proposed Payment Rails',
    description: 'Adyen + Coinbase integration architecture with single-token stable fund model',
    badgeText: 'Enterprise',
    badgeClass: 'bg-green-600 text-white',
    titleColor: 'text-green-600',
    buttonText: 'View Architecture',
    buttonClass: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
    href: '/docs/payment-rails',
    borderClass: 'border-green-200',
    category: 'public',
  },
  'platform-admin-guide': {
    title: 'Platform Administrator Guide',
    description: 'Complete operational guide for Platform Administrators - user management, security monitoring, and strategic oversight',
    badgeText: 'Essential',
    badgeClass: 'bg-purple-600 text-white',
    titleColor: 'text-purple-600',
    buttonText: 'View Admin Guide',
    buttonClass: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
    href: '/portal/founders-only/platform-admin-guide',
    borderClass: 'border-purple-200',
    category: 'platform',
  },
  'shelter-research': {
    title: 'Shelter Research Hub',
    description: 'Comprehensive research on homeless shelters, HMIS systems, state-by-state analysis, and innovative programs across North America',
    badgeText: 'Research',
    badgeClass: 'bg-teal-600 text-white',
    titleColor: 'text-teal-600',
    buttonText: 'Browse Research',
    buttonClass: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50',
    href: '/secure-docs/shelter-research',
    borderClass: 'border-teal-200',
    category: 'public',
  },
  'system-design': {
    title: 'System Design Architecture',
    description: 'Multi-tenant SaaS architecture with enterprise payment infrastructure, visual flow diagrams, and comprehensive system integration blueprints',
    badgeText: 'Architecture',
    badgeClass: 'bg-slate-600 text-white',
    titleColor: 'text-slate-600',
    buttonText: 'View Architecture',
    buttonClass: 'border-2 border-slate-600 text-slate-600 hover:bg-slate-50',
    href: '/portal/founders-only/system-design',
    borderClass: 'border-slate-200',
    category: 'secure',
  },
  'technical-whitepaper': {
    title: 'Technical White Paper',
    description: 'Revolutionary enterprise-grade platform with single-token architecture and blockchain transparency',
    badgeText: 'v2.0',
    badgeClass: 'bg-emerald-600 text-white',
    titleColor: 'text-emerald-600',
    buttonText: 'Read Whitepaper',
    buttonClass: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
    href: '/whitepaper',
    borderClass: 'border-emerald-200',
    category: 'public',
  }
};

async function clearAndSyncDataRoom() {
  console.log('🧹 STEP 1: Clearing Investor Data Room...\n');

  try {
    // Get all documents from secure_documents
    const snapshot = await db.collection('secure_documents').get();
    
    if (snapshot.empty) {
      console.log('   ℹ️  No documents to clear\n');
    } else {
      console.log(`   Found ${snapshot.size} documents to clear`);
      
      // Delete in batches
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      
      console.log(`   ✅ Cleared ${snapshot.size} documents from secure_documents\n`);
    }
  } catch (error) {
    console.error('   ❌ Error clearing documents:', error.message);
    process.exit(1);
  }

  console.log('============================================================\n');
  console.log('📦 STEP 2: Syncing Investor Data Room Documents...\n');
  console.log(`📋 Documents to sync: ${investorDataRoomDocuments.length}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const docId of investorDataRoomDocuments) {
    try {
      console.log(`📄 Processing: ${docId}...`);

      // Get card metadata
      const metadata = cardMetadata[docId];
      if (!metadata) {
        console.log(`   ⚠️  No metadata found for ${docId}, skipping...`);
        errorCount++;
        continue;
      }

      // Try to get document content from founder_documents
      const founderDocRef = db.collection('founder_documents').doc(docId);
      const founderDocSnap = await founderDocRef.get();

      // Prepare the document data for secure_documents
      const secureDocData = {
        id: docId,
        ...metadata,
        isInvestorDataRoom: true,
        updatedAt: new Date().toISOString(),
      };

      // If document exists in founder_documents, copy the content
      if (founderDocSnap.exists) {
        const founderData = founderDocSnap.data();
        
        // Only add fields that are not undefined
        const contentData = {
          content: founderData.content,
          slug: founderData.slug || docId,
          type: founderData.type || 'secure',
          tags: founderData.tags || [],
          metadata: founderData.metadata || {},
        };
        
        // Add optional fields only if they exist
        if (founderData.version !== undefined) {
          contentData.version = founderData.version;
        }
        if (founderData.author !== undefined) {
          contentData.author = founderData.author;
        }
        
        Object.assign(secureDocData, contentData);
        console.log(`   ✅ Copied content from founder_documents`);
      } else {
        console.log(`   ℹ️  No content in founder_documents (external link or React page)`);
      }

      // Write to secure_documents
      const secureDocRef = db.collection('secure_documents').doc(docId);
      await secureDocRef.set(secureDocData);

      console.log(`   ✅ Synced to secure_documents\n`);
      successCount++;

    } catch (error) {
      console.error(`   ❌ Error processing ${docId}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n============================================================');
  console.log('📊 FINAL SUMMARY');
  console.log('============================================================');
  console.log(`✅ Successfully synced: ${successCount} documents`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('============================================================\n');

  console.log('🎉 Investor Data Room is now ready!');
  console.log('📍 View at: http://localhost:3000/ir/dataroom');
  console.log('📍 Founders Portal: http://localhost:3000/portal/founders-only\n');
  console.log('💡 Note: Toggles in Founders Portal will now reflect the synced state\n');

  process.exit(0);
}

clearAndSyncDataRoom().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

