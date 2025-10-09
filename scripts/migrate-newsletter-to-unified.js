/**
 * Migration Script: Newsletter Signups → Unified Contact Inquiries
 * 
 * This script migrates all existing newsletter signups from the 
 * newsletter_signups collection to the contact_inquiries collection
 * with proper tagging and metadata preservation.
 * 
 * Run with: node scripts/migrate-newsletter-to-unified.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../apps/api/service-account-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function migrateNewsletterSignups() {
  console.log('🚀 STARTING NEWSLETTER SIGNUPS MIGRATION\n');
  console.log('================================================================================\n');
  
  try {
    // 1. Get all newsletter signups
    console.log('📋 Step 1: Fetching all newsletter signups from newsletter_signups collection...\n');
    const newsletterSnapshot = await db.collection('newsletter_signups').get();
    console.log(`   Found ${newsletterSnapshot.size} newsletter signups to migrate\n`);
    
    if (newsletterSnapshot.empty) {
      console.log('ℹ️  No newsletter signups found. Nothing to migrate.');
      console.log('✅ Migration complete!\n');
      return;
    }
    
    let migrated = 0;
    let skipped = 0;
    let errors = 0;
    
    console.log('📋 Step 2: Migrating newsletter signups to contact_inquiries...\n');
    
    // 2. For each newsletter signup, create a contact_inquiry entry
    for (const doc of newsletterSnapshot.docs) {
      const data = doc.data();
      
      try {
        // Check if already migrated (duplicate check)
        const existingQuery = await db.collection('contact_inquiries')
          .where('inquiry_type', '==', 'newsletter_signup')
          .where('email', '==', (data.email || '').toLowerCase())
          .where('source', '==', `${data.source}_migrated`)
          .get();
        
        if (!existingQuery.empty) {
          console.log(`   ⏭️  Skipping ${data.email} - already migrated`);
          skipped++;
          continue;
        }
        
        // Create unified inquiry entry
        const unifiedInquiry = {
          // Core fields
          email: (data.email || '').toLowerCase(),
          name: data.name || '',
          
          // Classification
          inquiry_type: 'newsletter_signup',
          source: `${data.source}_migrated`, // Tag as migrated
          priority: 'low',
          
          // Status
          status: data.status === 'unsubscribed' ? 'closed' : 'new',
          responded: false,
          
          // Metadata
          user_agent: data.user_agent || null,
          page_url: null,
          referrer: null,
          
          // Timestamps (preserve original)
          created_at: data.subscribed_at || admin.firestore.Timestamp.now(),
          updated_at: admin.firestore.Timestamp.now(),
          
          // Migration metadata
          _migrated_from: 'newsletter_signups',
          _original_doc_id: doc.id,
          _migration_date: admin.firestore.Timestamp.now()
        };
        
        await db.collection('contact_inquiries').add(unifiedInquiry);
        console.log(`   ✅ Migrated: ${data.email} from ${data.source}`);
        migrated++;
        
      } catch (error) {
        console.error(`   ❌ Error migrating ${data.email}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n================================================================================\n');
    console.log('📊 MIGRATION SUMMARY:\n');
    console.log(`   ✅ Migrated: ${migrated} signups`);
    console.log(`   ⏭️  Skipped: ${skipped} duplicates`);
    console.log(`   ❌ Errors: ${errors} failed`);
    console.log(`   📁 Total: ${newsletterSnapshot.size} processed\n`);
    
    console.log('================================================================================\n');
    console.log('✅ MIGRATION COMPLETE!\n');
    console.log('⚠️  NEXT STEPS:\n');
    console.log('   1. Verify data in Firebase Console (contact_inquiries collection)');
    console.log('   2. Test UnifiedInquiryService.getAllNewsletterSignups()');
    console.log('   3. Test UnifiedInquiryService.getNewsletterCount()');
    console.log('   4. Test UnifiedInquiryService.exportNewsletterEmails()');
    console.log('   5. If all tests pass, proceed to Phase 3 (update components)\n');
    console.log('💡 TIP: You can re-run this script safely - it will skip duplicates.\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\n🔴 Error details:', error.message);
    console.error('\n⚠️  Migration aborted. Please fix the error and try again.\n');
    process.exit(1);
  }
}

// Run migration
migrateNewsletterSignups()
  .then(() => {
    console.log('🎉 Script execution completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('🔴 Fatal error:', error);
    process.exit(1);
  });

