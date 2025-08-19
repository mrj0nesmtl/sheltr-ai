#!/usr/bin/env node

const admin = require('firebase-admin');

try {
  admin.initializeApp({
    projectId: 'sheltr-ai',
    databaseURL: 'https://sheltr-ai-default-rtdb.firebaseio.com'
  });
} catch (error) {
  console.error('❌ Error initializing Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function fixSuperAdminUID() {
  try {
    console.log('🔧 Fixing super admin profile UID mapping...\n');
    
    const superAdminEmail = 'joel.yaffe@gmail.com';
    
    // 1. Get the Firebase Auth user by email to find the UID
    console.log('🔍 Finding Firebase Auth user...');
    const userRecord = await admin.auth().getUserByEmail(superAdminEmail);
    console.log(`✅ Found Firebase Auth user with UID: ${userRecord.uid}`);
    
    // 2. Check if a profile exists with the UID as document ID
    const uidProfileRef = db.collection('users').doc(userRecord.uid);
    const uidProfileDoc = await uidProfileRef.get();
    
    if (uidProfileDoc.exists) {
      console.log('✅ Profile already exists with correct UID as document ID!');
      const userData = uidProfileDoc.data();
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   👤 Name: ${userData.firstName} ${userData.lastName}`);
      console.log(`   🏷️  Role: ${userData.role}`);
      return;
    }
    
    // 3. Look for profile by email
    console.log('🔍 Looking for existing profile by email...');
    const emailQuery = await db.collection('users').where('email', '==', superAdminEmail).get();
    
    if (emailQuery.empty) {
      console.log('❌ No profile found by email. Creating new one...');
      
      // Create new profile with UID as document ID
      const superAdminData = {
        uid: userRecord.uid,
        email: superAdminEmail,
        firstName: 'Joel',
        lastName: 'Yaffe',
        displayName: 'Joel Yaffe',
        role: 'super_admin',
        status: 'active',
        profileComplete: true,
        title: 'CTO and Developer',
        organization: 'Arcana Concept',
        position: 'Co-Founder',
        permissions: [
          'platform:manage',
          'users:manage',
          'shelters:manage',
          'donations:manage',
          'analytics:view',
          'system:admin'
        ],
        tenant_id: 'platform',
        shelter_id: null,
        phone: null,
        email_verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null
      };
      
      await uidProfileRef.set(superAdminData);
      console.log(`✅ Created new profile with UID: ${userRecord.uid}`);
      
    } else {
      console.log('📋 Found existing profile by email. Copying to UID document...');
      
      const existingDoc = emailQuery.docs[0];
      const existingData = existingDoc.data();
      
      // Update the data to include UID
      existingData.uid = userRecord.uid;
      existingData.updatedAt = new Date().toISOString();
      
      // Create new document with UID as ID
      await uidProfileRef.set(existingData);
      console.log(`✅ Copied profile to UID document: ${userRecord.uid}`);
      
      // Delete old document (optional - comment out if you want to keep it)
      await existingDoc.ref.delete();
      console.log(`🗑️  Deleted old document: ${existingDoc.id}`);
    }
    
    console.log('\n📋 Final Profile Details:');
    const finalDoc = await uidProfileRef.get();
    const finalData = finalDoc.data();
    console.log(`   📄 Document ID: ${finalDoc.id}`);
    console.log(`   🆔 UID: ${finalData.uid}`);
    console.log(`   📧 Email: ${finalData.email}`);
    console.log(`   👤 Name: ${finalData.firstName} ${finalData.lastName}`);
    console.log(`   🏷️  Role: ${finalData.role}`);
    
    console.log('\n🎉 Super admin UID mapping fixed! You can now log in with Google.');
    
  } catch (error) {
    console.error('❌ Error fixing super admin UID:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.log('\n💡 This means you need to sign in with Google at least once to create the Firebase Auth user.');
      console.log('   Try signing in with Google first, then run this script again.');
    }
  } finally {
    process.exit(0);
  }
}

// Run the fix
fixSuperAdminUID();
