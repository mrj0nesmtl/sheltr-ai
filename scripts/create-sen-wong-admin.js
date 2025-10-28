#!/usr/bin/env node

const admin = require('firebase-admin');
const crypto = require('crypto');

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

function generateSecurePassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function createSenWongAdmin() {
  try {
    console.log('🚀 Creating Platform Administrator account for Sen Wong...\n');
    
    const email = 'senw@royaltri.com';
    const displayName = 'Sen Wong';
    const password = generateSecurePassword();
    const now = new Date().toISOString();
    
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Display Name: ${displayName}`);
    
    let userRecord;
    let uid;
    
    // Try to create Firebase Auth user
    try {
      userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: displayName,
        emailVerified: true
      });
      uid = userRecord.uid;
      console.log(`✅ Firebase Auth user created with UID: ${uid}`);
    } catch (authError) {
      if (authError.code === 'auth/email-already-exists') {
        console.log(`⚠️  User with email ${email} already exists in Firebase Auth`);
        userRecord = await admin.auth().getUserByEmail(email);
        uid = userRecord.uid;
        console.log(`📝 Using existing UID: ${uid}`);
        
        // Update password for existing user
        await admin.auth().updateUser(uid, { password: password });
        console.log(`🔒 Password updated for existing user`);
      } else {
        throw authError;
      }
    }
    
    // Create comprehensive user document in Firestore
    const userData = {
      uid: uid,
      email: email,
      displayName: displayName,
      firstName: 'Sen',
      lastName: 'Wong',
      role: 'platform_administrator',
      title: 'SHELTR Associate',
      department: 'Marketing & Partnerships',
      responsibilities: [
        'Marketing strategy and execution',
        'Brand exposure and awareness',
        'Strategic partnerships',
        'Partnership development'
      ],
      permissions: {
        dashboard_access: true,
        user_management: true,
        analytics_access: true,
        financial_access: true,
        shelter_management: true,
        blog_management: true,
        knowledge_base_access: true,
        chatbot_management: true,
        platform_settings: true
      },
      profile: {
        bio: 'SHELTR Associate focused on marketing, brand exposure, and strategic partnerships',
        expertise: ['Marketing', 'Brand Management', 'Partnership Development'],
        location: 'Montreal, Canada',
        timezone: 'America/Toronto'
      },
      status: 'active',
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
      createdBy: 'system_admin',
      accountType: 'platform_administrator',
      tenant: 'sheltr-platform'
    };
    
    // Save to Firestore users collection
    await db.collection('users').doc(uid).set(userData);
    console.log(`✅ User document created in Firestore`);
    
    // Add to platform_administrators collection
    const adminData = {
      uid: uid,
      email: email,
      displayName: displayName,
      title: 'SHELTR Associate',
      department: 'Marketing & Partnerships',
      accessLevel: 'full',
      createdAt: now,
      isActive: true
    };
    
    await db.collection('platform_administrators').doc(uid).set(adminData);
    console.log(`✅ Platform administrator record created`);
    
    // Create user stats document
    const statsData = {
      uid: uid,
      loginCount: 0,
      lastLoginAt: null,
      accountCreatedAt: now,
      actionsPerformed: 0,
      dashboardAccess: 0
    };
    
    await db.collection('user_stats').doc(uid).set(statsData);
    console.log(`✅ User stats document created`);
    
    // Output credentials
    console.log(`\n🎉 SUCCESS! Platform Administrator account created for Sen Wong`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔒 Password: ${password}`);
    console.log(`🆔 UID: ${uid}`);
    console.log(`👤 Display Name: ${displayName}`);
    console.log(`🏢 Title: SHELTR Associate`);
    console.log(`📋 Department: Marketing & Partnerships`);
    console.log(`🌐 Dashboard: https://sheltr-ai.web.app/dashboard`);
    console.log(`${'='.repeat(60)}`);
    
    // Save credentials to file for reference
    const fs = require('fs');
    const credentialsData = {
      email: email,
      password: password,
      uid: uid,
      displayName: displayName,
      title: 'SHELTR Associate',
      department: 'Marketing & Partnerships',
      role: 'platform_administrator',
      created_at: now,
      dashboard_url: 'https://sheltr-ai.web.app/dashboard'
    };
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `scripts/sen-wong-credentials-${timestamp}.json`;
    fs.writeFileSync(filename, JSON.stringify(credentialsData, null, 2));
    
    console.log(`💾 Credentials saved to: ${filename}`);
    console.log(`⚠️  Please share these credentials securely with Sen Wong`);
    console.log(`🔒 Recommend changing password on first login`);
    
    return {
      success: true,
      uid: uid,
      email: email,
      password: password,
      displayName: displayName
    };
    
  } catch (error) {
    console.error(`❌ Error creating Sen Wong admin account: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
    return { success: false, error: error.message };
  }
}

// Run the function
createSenWongAdmin().then(result => {
  if (result.success) {
    console.log(`\n✅ Account creation completed successfully!`);
    process.exit(0);
  } else {
    console.log(`\n❌ Account creation failed: ${result.error}`);
    process.exit(1);
  }
}).catch(error => {
  console.error(`❌ Unexpected error: ${error.message}`);
  process.exit(1);
});
