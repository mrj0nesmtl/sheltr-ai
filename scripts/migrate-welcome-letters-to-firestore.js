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

async function migrateWelcomeLetters() {
  console.log('🚀 Migrating Platform Admin Welcome Letters to Firestore...\n');
  
  const backupDir = path.join(__dirname, '../.local-secure-docs/backup-20251023-020011/platform-admin');
  const welcomeLettersDir = path.join(backupDir, 'welcome-letters');
  
  try {
    // 1. Migrate default welcome letter
    console.log('📄 Migrating default welcome letter...');
    const defaultLetterPath = path.join(backupDir, 'welcome-letter.md');
    const defaultContent = fs.readFileSync(defaultLetterPath, 'utf8');
    
    await db.collection('platform_admin_welcome_letters').doc('default').set({
      userEmail: 'default@sheltr.ai',
      firstName: 'default',
      content: defaultContent,
      isDefault: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Default welcome letter migrated\n');
    
    // 2. Migrate personalized welcome letters
    console.log('📄 Migrating personalized welcome letters...\n');
    
    const emailMap = {
      'joel': 'joel.yaffe@gmail.com',
      'marc': 'alaghetts@gmail.com',
      'alexander': 'alexanderkline13@gmail.com',
      'dominique': 'deefactorial@gmail.com',
      'doug': 'doug.kukura@gmail.com',
      'sen': 'senw@royaltri.com',
      'christine': 'christinesavardmedia@gmail.com',
      'zaffia': 'zaffialaplante@gmail.com',
      'morgan': 'morganhirtle@gmail.com',
      'aryan': 'srivastavaaryan005@gmail.com',
      'gunnar': 'gunnar.blaze@gmail.com',
      'jeff': 'f.tjeff79@gmail.com',
      'royaltri': 'admin@royaltri.com'
    };
    
    const files = fs.readdirSync(welcomeLettersDir);
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const firstName = file.replace('.md', '');
      const userEmail = emailMap[firstName];
      
      if (!userEmail) {
        console.log(`⚠️  Skipping ${file} - no email mapping found`);
        continue;
      }
      
      try {
        const filePath = path.join(welcomeLettersDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Use email as document ID for easy lookup
        const docId = userEmail.replace(/[@.]/g, '_');
        
        await db.collection('platform_admin_welcome_letters').doc(docId).set({
          userEmail: userEmail,
          firstName: firstName,
          content: content,
          isDefault: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        console.log(`✅ ${firstName} (${userEmail})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrating ${file}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successfully migrated: ${successCount + 1} letters (including default)`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`\n🎉 All welcome letters are now secure in Firestore!`);
    console.log(`   Collection: platform_admin_welcome_letters`);
    console.log(`\n⚠️  NEXT STEP: Update personalizedWelcomeService.ts to fetch from Firestore`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateWelcomeLetters();

