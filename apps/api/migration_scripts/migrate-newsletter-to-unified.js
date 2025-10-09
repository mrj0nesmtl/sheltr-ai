/**
 * Newsletter Migration Script
 * Migrates data from newsletter_signups to contact_inquiries (unified collection)
 * 
 * Usage: node apps/api/migration_scripts/migrate-newsletter-to-unified.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Migration configuration
const CONFIG = {
  SOURCE_COLLECTION: 'newsletter_signups',
  TARGET_COLLECTION: 'contact_inquiries',
  BACKUP_FILE: path.join(__dirname, '../../../migration-backup-newsletter.json'),
  DRY_RUN: process.argv.includes('--dry-run'),
  SKIP_BACKUP: process.argv.includes('--skip-backup'),
};

// Migration statistics
const stats = {
  total: 0,
  migrated: 0,
  skipped: 0,
  errors: 0,
  startTime: new Date()
};

/**
 * Backup existing newsletter_signups collection
 */
async function backupNewsletterSignups() {
  if (CONFIG.SKIP_BACKUP) {
    console.log('⏭️  Skipping backup (--skip-backup flag)');
    return true;
  }

  try {
    console.log('💾 Creating backup of newsletter_signups collection...');
    
    const snapshot = await db.collection(CONFIG.SOURCE_COLLECTION).get();
    const backup = [];
    
    snapshot.forEach(doc => {
      backup.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Save backup to file
    fs.writeFileSync(
      CONFIG.BACKUP_FILE,
      JSON.stringify(backup, null, 2),
      'utf-8'
    );
    
    console.log(`✅ Backup created: ${CONFIG.BACKUP_FILE}`);
    console.log(`📊 Backed up ${backup.length} documents`);
    
    return true;
  } catch (error) {
    console.error('❌ Backup failed:', error);
    return false;
  }
}

/**
 * Transform newsletter signup data to unified inquiry format
 */
function transformNewsletterSignup(doc) {
  const data = doc.data();
  const now = admin.firestore.Timestamp.now();
  
  return {
    // Core fields
    email: data.email,
    name: data.name || '',
    
    // Classification
    inquiry_type: 'newsletter_signup',
    source: `${data.source}_legacy` || 'newsletter_legacy',
    category: 'marketing',
    tags: ['newsletter', 'migrated', 'legacy'],
    
    // Priority & Status
    priority: 'low',
    status: data.status === 'unsubscribed' ? 'closed' : 'new',
    responded: false,
    
    // User Context
    is_authenticated: false,
    
    // Tracking Metadata
    user_agent: data.user_agent || null,
    ip_address: data.ip_address || null,
    
    // Timestamps
    created_at: data.subscribed_at || data.createdAt || now,
    updated_at: now,
    
    // Migration metadata
    migration: {
      migrated_from: 'newsletter_signups',
      original_id: doc.id,
      migrated_at: now,
      migration_script_version: '1.0.0'
    }
  };
}

/**
 * Check if email already exists in contact_inquiries
 */
async function emailExistsInTarget(email) {
  try {
    const snapshot = await db.collection(CONFIG.TARGET_COLLECTION)
      .where('email', '==', email)
      .where('inquiry_type', '==', 'newsletter_signup')
      .limit(1)
      .get();
    
    return !snapshot.empty;
  } catch (error) {
    console.error(`❌ Error checking email ${email}:`, error);
    return false;
  }
}

/**
 * Migrate a single newsletter signup document
 */
async function migrateDocument(doc) {
  const data = doc.data();
  const email = data.email;
  
  try {
    // Check if already migrated
    const exists = await emailExistsInTarget(email);
    
    if (exists) {
      console.log(`⏭️  Skipping ${email} (already exists in target)`);
      stats.skipped++;
      return true;
    }
    
    // Transform data
    const transformedData = transformNewsletterSignup(doc);
    
    if (CONFIG.DRY_RUN) {
      console.log(`🔍 [DRY RUN] Would migrate: ${email}`);
      console.log('   Transformed data:', JSON.stringify(transformedData, null, 2));
      stats.migrated++;
      return true;
    }
    
    // Write to target collection
    await db.collection(CONFIG.TARGET_COLLECTION).add(transformedData);
    
    console.log(`✅ Migrated: ${email}`);
    stats.migrated++;
    return true;
    
  } catch (error) {
    console.error(`❌ Error migrating ${email}:`, error);
    stats.errors++;
    return false;
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log('🚀 Starting Newsletter Migration to Unified Collection');
  console.log('━'.repeat(60));
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`📂 Source: ${CONFIG.SOURCE_COLLECTION}`);
  console.log(`📂 Target: ${CONFIG.TARGET_COLLECTION}`);
  console.log(`🔧 Mode: ${CONFIG.DRY_RUN ? 'DRY RUN (no changes will be made)' : 'LIVE MIGRATION'}`);
  console.log('━'.repeat(60));
  console.log('');
  
  // Step 1: Backup
  if (!CONFIG.DRY_RUN) {
    const backupSuccess = await backupNewsletterSignups();
    if (!backupSuccess) {
      console.error('❌ Backup failed. Aborting migration for safety.');
      process.exit(1);
    }
    console.log('');
  }
  
  // Step 2: Get all newsletter signups
  console.log('📋 Fetching newsletter signups...');
  const snapshot = await db.collection(CONFIG.SOURCE_COLLECTION).get();
  stats.total = snapshot.size;
  
  console.log(`📊 Found ${stats.total} newsletter signups to migrate`);
  console.log('');
  
  if (stats.total === 0) {
    console.log('✅ No documents to migrate. Exiting.');
    process.exit(0);
  }
  
  // Step 3: Migrate each document
  console.log('🔄 Starting migration...');
  console.log('');
  
  let current = 0;
  for (const doc of snapshot.docs) {
    current++;
    console.log(`[${current}/${stats.total}] Processing...`);
    await migrateDocument(doc);
  }
  
  // Step 4: Summary
  console.log('');
  console.log('━'.repeat(60));
  console.log('✅ Migration Complete!');
  console.log('━'.repeat(60));
  console.log(`📊 Total documents: ${stats.total}`);
  console.log(`✅ Successfully migrated: ${stats.migrated}`);
  console.log(`⏭️  Skipped (already exists): ${stats.skipped}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`⏱️  Duration: ${((new Date() - stats.startTime) / 1000).toFixed(2)}s`);
  console.log('');
  
  if (!CONFIG.DRY_RUN) {
    console.log('📁 Backup saved to:', CONFIG.BACKUP_FILE);
    console.log('');
    console.log('🔄 Next Steps:');
    console.log('1. Verify migrated data in contact_inquiries collection');
    console.log('2. Update NewsletterSignup.tsx to use UnifiedInquiryService');
    console.log('3. Test all newsletter signup touchpoints');
    console.log('4. Archive newsletter_signups collection (rename to newsletter_signups_legacy)');
    console.log('');
  } else {
    console.log('🔍 This was a DRY RUN - no changes were made');
    console.log('💡 Run without --dry-run flag to perform actual migration');
    console.log('');
  }
}

/**
 * Restore from backup (emergency rollback)
 */
async function restoreFromBackup() {
  try {
    console.log('⚠️  WARNING: This will restore from backup!');
    console.log('');
    
    if (!fs.existsSync(CONFIG.BACKUP_FILE)) {
      console.error(`❌ Backup file not found: ${CONFIG.BACKUP_FILE}`);
      process.exit(1);
    }
    
    const backup = JSON.parse(fs.readFileSync(CONFIG.BACKUP_FILE, 'utf-8'));
    console.log(`📂 Found backup with ${backup.length} documents`);
    
    let restored = 0;
    for (const doc of backup) {
      const { id, ...data } = doc;
      await db.collection(CONFIG.SOURCE_COLLECTION).doc(id).set(data);
      restored++;
      console.log(`✅ Restored ${restored}/${backup.length}`);
    }
    
    console.log('');
    console.log(`✅ Restored ${restored} documents from backup`);
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  }
}

// Main execution
(async () => {
  try {
    if (process.argv.includes('--restore')) {
      await restoreFromBackup();
    } else if (process.argv.includes('--help')) {
      console.log(`
Newsletter Migration Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage:
  node apps/api/migration_scripts/migrate-newsletter-to-unified.js [options]

Options:
  --dry-run        Run migration without making changes (recommended first)
  --skip-backup    Skip backup creation (NOT recommended)
  --restore        Restore from backup file
  --help           Show this help message

Examples:
  # Test migration without changes
  node apps/api/migration_scripts/migrate-newsletter-to-unified.js --dry-run

  # Run actual migration
  node apps/api/migration_scripts/migrate-newsletter-to-unified.js

  # Restore from backup (emergency)
  node apps/api/migration_scripts/migrate-newsletter-to-unified.js --restore

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    } else {
      await runMigration();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
})();

