const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../apps/api/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sheltr-ai'
});

const db = admin.firestore();

// Migration configuration
const CONFIG = {
  SOURCE_COLLECTION: 'newsletter_signups',
  TARGET_COLLECTION: 'contact_inquiries',
  BACKUP_FILE: path.join(__dirname, '../migration-backup-newsletter.json'),
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

function transformNewsletterSignup(doc) {
  const data = doc.data();
  const now = admin.firestore.Timestamp.now();
  
  return {
    email: data.email,
    name: data.name || '',
    inquiry_type: 'newsletter_signup',
    source: `${data.source}_legacy` || 'newsletter_legacy',
    category: 'marketing',
    tags: ['newsletter', 'migrated', 'legacy'],
    priority: 'low',
    status: data.status === 'unsubscribed' ? 'closed' : 'new',
    responded: false,
    is_authenticated: false,
    user_agent: data.user_agent || null,
    ip_address: data.ip_address || null,
    created_at: data.subscribed_at || data.createdAt || now,
    updated_at: now,
    migration: {
      migrated_from: 'newsletter_signups',
      original_id: doc.id,
      migrated_at: now,
      migration_script_version: '1.0.0'
    }
  };
}

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

async function migrateDocument(doc) {
  const data = doc.data();
  const email = data.email;
  
  try {
    const exists = await emailExistsInTarget(email);
    
    if (exists) {
      console.log(`⏭️  Skipping ${email} (already exists)`);
      stats.skipped++;
      return true;
    }
    
    const transformedData = transformNewsletterSignup(doc);
    
    if (CONFIG.DRY_RUN) {
      console.log(`🔍 [DRY RUN] Would migrate: ${email}`);
      stats.migrated++;
      return true;
    }
    
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

async function runMigration() {
  console.log('🚀 Newsletter Migration to Unified Collection');
  console.log('━'.repeat(60));
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`📂 Source: ${CONFIG.SOURCE_COLLECTION}`);
  console.log(`📂 Target: ${CONFIG.TARGET_COLLECTION}`);
  console.log(`🔧 Mode: ${CONFIG.DRY_RUN ? 'DRY RUN' : 'LIVE MIGRATION'}`);
  console.log('━'.repeat(60));
  console.log('');
  
  if (!CONFIG.DRY_RUN) {
    const backupSuccess = await backupNewsletterSignups();
    if (!backupSuccess) {
      console.error('❌ Backup failed. Aborting.');
      process.exit(1);
    }
    console.log('');
  }
  
  console.log('📋 Fetching newsletter signups...');
  const snapshot = await db.collection(CONFIG.SOURCE_COLLECTION).get();
  stats.total = snapshot.size;
  
  console.log(`📊 Found ${stats.total} newsletter signups`);
  console.log('');
  
  if (stats.total === 0) {
    console.log('✅ No documents to migrate.');
    process.exit(0);
  }
  
  console.log('🔄 Starting migration...');
  console.log('');
  
  let current = 0;
  for (const doc of snapshot.docs) {
    current++;
    console.log(`[${current}/${stats.total}] Processing...`);
    await migrateDocument(doc);
  }
  
  console.log('');
  console.log('━'.repeat(60));
  console.log('✅ Migration Complete!');
  console.log('━'.repeat(60));
  console.log(`📊 Total: ${stats.total}`);
  console.log(`✅ Migrated: ${stats.migrated}`);
  console.log(`⏭️  Skipped: ${stats.skipped}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`⏱️  Duration: ${((new Date() - stats.startTime) / 1000).toFixed(2)}s`);
  console.log('');
  
  if (!CONFIG.DRY_RUN) {
    console.log('📁 Backup:', CONFIG.BACKUP_FILE);
  } else {
    console.log('🔍 DRY RUN - no changes made');
    console.log('💡 Run without --dry-run to migrate');
  }
}

(async () => {
  try {
    await runMigration();
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
})();
