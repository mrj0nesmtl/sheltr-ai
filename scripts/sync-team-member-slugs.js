/**
 * Sync team member slugs from users collection to team_members collection
 * This ensures public access to bio page links without authentication
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

async function syncTeamMemberSlugs() {
  try {
    console.log('🔄 Starting team member slug sync...\n');
    
    // Get all team members
    const teamMembersSnapshot = await db.collection('team_members').get();
    console.log(`📋 Found ${teamMembersSnapshot.size} team members\n`);
    
    let synced = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const teamMemberDoc of teamMembersSnapshot.docs) {
      const memberId = teamMemberDoc.id;
      const memberData = teamMemberDoc.data();
      const memberName = memberData.name || memberData.displayName || memberId;
      
      try {
        // Get corresponding user document
        const userDoc = await db.collection('users').doc(memberId).get();
        
        if (!userDoc.exists) {
          console.log(`⚠️  ${memberName}: No user document found`);
          skipped++;
          continue;
        }
        
        const userData = userDoc.data();
        const slug = userData.slug;
        const showOnTeamPage = userData.bio?.showOnTeamPage;
        const profilePicture = userData.profilePicture;
        
        // Check if slug exists and bio is set to show on team page
        if (slug && showOnTeamPage) {
          // Update team_members document with slug and profile picture
          await db.collection('team_members').doc(memberId).update({
            slug: slug,
            profilePicture: profilePicture || admin.firestore.FieldValue.delete(),
            updated_at: admin.firestore.FieldValue.serverTimestamp()
          });
          
          console.log(`✅ ${memberName}: Synced slug "${slug}" and profile picture`);
          synced++;
        } else if (!slug) {
          console.log(`⏭️  ${memberName}: No slug in user document`);
          skipped++;
        } else if (!showOnTeamPage) {
          console.log(`⏭️  ${memberName}: Bio not set to show on team page`);
          skipped++;
        }
        
      } catch (error) {
        console.error(`❌ ${memberName}: Error syncing - ${error.message}`);
        errors++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Sync Summary:');
    console.log(`   ✅ Synced: ${synced}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('='.repeat(60));
    
    if (synced > 0) {
      console.log('\n✨ Team member slugs synced successfully!');
      console.log('   Public users can now see "View Full Bio" links.');
    }
    
  } catch (error) {
    console.error('❌ Fatal error during sync:', error);
    process.exit(1);
  }
}

// Run the sync
syncTeamMemberSlugs()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

