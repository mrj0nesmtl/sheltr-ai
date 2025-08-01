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

// Test users configuration
const testUsers = [
  {
    email: 'sarah.manager@sheltr.com',
    role: 'admin', 
    firstName: 'Sarah',
    lastName: 'Manager',
    status: 'active',
    profileComplete: true,
    organizationId: 'downtown-hope-shelter',
    organizationName: 'Downtown Hope Shelter'
  },
  {
    email: 'david.donor@example.com',
    role: 'donor',
    firstName: 'David', 
    lastName: 'Donor',
    status: 'active',
    profileComplete: true,
    totalDonated: 2500,
    donationCount: 8
  },
  {
    email: 'participant@example.com',
    role: 'participant',
    firstName: 'Michael',
    lastName: 'Rodriguez', 
    status: 'active',
    profileComplete: false,
    organizationId: 'downtown-hope-shelter',
    checkInDate: '2023-11-15',
    participantId: 'PART-001-2024'
  },
  {
    email: 'donor@example.com', // Fix the existing misassigned user
    role: 'donor',
    firstName: 'Jane',
    lastName: 'Supporter',
    status: 'active',
    profileComplete: false,
    totalDonated: 500,
    donationCount: 3
  }
];

async function setupTestUsers() {
  try {
    console.log('👥 Setting up test users...\n');
    
    // Get current users
    const usersSnapshot = await db.collection('users').get();
    const existingUsers = {};
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.email) {
        existingUsers[userData.email] = {
          id: doc.id,
          data: userData
        };
      }
    });
    
    console.log(`📊 Found ${Object.keys(existingUsers).length} existing users`);
    
    // Process each test user
    for (const testUser of testUsers) {
      console.log(`\n🔍 Processing: ${testUser.email}`);
      
      const existingUser = existingUsers[testUser.email];
      const now = new Date().toISOString();
      
      // Base user data
      const userData = {
        email: testUser.email,
        role: testUser.role,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        status: testUser.status,
        profileComplete: testUser.profileComplete,
        lastLoginAt: now,
        updatedAt: now
      };
      
      // Add role-specific data
      if (testUser.role === 'admin') {
        userData.organizationId = testUser.organizationId;
        userData.organizationName = testUser.organizationName;
        userData.permissions = ['shelter_management', 'participant_management', 'service_management'];
      } else if (testUser.role === 'donor') {
        userData.donorProfile = {
          totalDonated: testUser.totalDonated || 0,
          donationCount: testUser.donationCount || 0,
          firstDonation: '2023-06-15',
          lastDonation: now,
          preferredCause: 'housing',
          communicationPreference: 'email'
        };
      } else if (testUser.role === 'participant') {
        userData.participantProfile = {
          participantId: testUser.participantId,
          checkInDate: testUser.checkInDate,
          organizationId: testUser.organizationId,
          bedAssignment: 'B-24',
          caseWorker: 'Sarah Johnson',
          servicesEnrolled: ['counseling', 'job_training'],
          goalProgress: 65,
          emergencyContacts: [
            {
              name: 'Maria Rodriguez',
              relationship: 'Sister', 
              phone: '(555) 987-6543'
            }
          ]
        };
      }
      
      if (existingUser) {
        // Update existing user
        console.log(`   📝 Updating existing user (ID: ${existingUser.id})`);
        console.log(`   🔄 Role change: ${existingUser.data.role || 'N/A'} → ${testUser.role}`);
        
        // Preserve creation date if it exists
        if (existingUser.data.createdAt) {
          userData.createdAt = existingUser.data.createdAt;
        } else {
          userData.createdAt = now;
        }
        
        await db.collection('users').doc(existingUser.id).set(userData, { merge: true });
        console.log(`   ✅ Updated successfully`);
        
      } else {
        // Create new user
        console.log(`   🆕 Creating new user`);
        userData.createdAt = now;
        
        const docRef = await db.collection('users').add(userData);
        console.log(`   ✅ Created with ID: ${docRef.id}`);
      }
    }
    
    console.log('\n🎉 Test user setup complete!');
    
    // Show final summary
    console.log('\n📋 Final User Summary:');
    const finalSnapshot = await db.collection('users').get();
    const roleCount = {};
    
    finalSnapshot.forEach(doc => {
      const userData = doc.data();
      const role = userData.role || 'undefined';
      roleCount[role] = (roleCount[role] || 0) + 1;
      
      if (testUsers.some(tu => tu.email === userData.email)) {
        console.log(`   ✅ ${userData.email} (${userData.role}) - ${userData.firstName} ${userData.lastName}`);
      }
    });
    
    console.log('\n📊 Users by Role:');
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} users`);
    });
    
  } catch (error) {
    console.error('❌ Error setting up test users:', error.message);
  } finally {
    process.exit(0);
  }
}

// Run the setup
setupTestUsers(); 