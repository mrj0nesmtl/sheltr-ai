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

async function createSuperAdminProfile() {
  try {
    console.log('🔐 Creating super admin profile for joel.yaffe@gmail.com...\n');
    
    const superAdminEmail = 'joel.yaffe@gmail.com';
    const now = new Date().toISOString();
    
    // Check if profile already exists
    const usersSnapshot = await db.collection('users').where('email', '==', superAdminEmail).get();
    
    if (!usersSnapshot.empty) {
      console.log('✅ Super admin profile already exists!');
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        console.log(`   📧 Email: ${userData.email}`);
        console.log(`   👤 Name: ${userData.firstName} ${userData.lastName}`);
        console.log(`   🏷️  Role: ${userData.role}`);
        console.log(`   📄 Document ID: ${doc.id}`);
      });
      return;
    }
    
    // Create super admin profile
    const superAdminData = {
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
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    };
    
    // Add to Firestore
    const docRef = await db.collection('users').add(superAdminData);
    console.log(`✅ Super admin profile created with ID: ${docRef.id}`);
    
    console.log('\n📋 Profile Details:');
    console.log(`   📧 Email: ${superAdminData.email}`);
    console.log(`   👤 Name: ${superAdminData.firstName} ${superAdminData.lastName}`);
    console.log(`   🏷️  Role: ${superAdminData.role}`);
    console.log(`   🏢 Organization: ${superAdminData.organization}`);
    console.log(`   💼 Title: ${superAdminData.title}`);
    console.log(`   🔑 Permissions: ${superAdminData.permissions.length} permissions`);
    
    console.log('\n🎉 Super admin setup complete! You can now log in with Google.');
    
  } catch (error) {
    console.error('❌ Error creating super admin profile:', error.message);
  } finally {
    process.exit(0);
  }
}

// Run the setup
createSuperAdminProfile();
