// Temporary script to create test users directly via Firebase Client SDK
// Run this in browser console after logging in as super admin

import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export const testUsers = [
  {
    email: 'shelteradmin@example.com',
    password: 'sheltr123',
    firstName: 'Sarah',
    lastName: 'Manager',
    role: 'admin',
    shelterId: 'downtown-hope-shelter'
  },
  {
    email: 'donor@example.com',
    password: 'sheltr123',
    firstName: 'Michael',
    lastName: 'Donor',
    role: 'donor'
  },
  {
    email: 'participant@example.com',
    password: 'sheltr123',
    firstName: 'Alex',
    lastName: 'Rodriguez',
    role: 'participant',
    shelterId: 'downtown-hope-shelter'
  }
];

export async function createTestUser(userData: typeof testUsers[0]) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    await updateProfile(userCredential.user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });
    
    console.log(`✅ Created user: ${userData.email}`);
    return userCredential.user;
  } catch (error) {
    console.error(`❌ Failed to create user ${userData.email}:`, error);
    throw error;
  }
}

// Function to create all test users
export async function createAllTestUsers() {
  for (const userData of testUsers) {
    try {
      await createTestUser(userData);
    } catch (error) {
      console.error(`Failed to create ${userData.email}:`, error);
    }
  }
} 