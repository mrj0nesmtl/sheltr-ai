'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, User, Database, CheckCircle } from 'lucide-react';

export default function DebugJoelPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Only allow Super Admins
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              This debug tool is only available to Super Administrators.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const log = (message: string) => {
    console.log(message);
    setResults(prev => [...prev, message]);
  };

  const debugJoelProfile = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      log('🔍 Starting Joel profile debug...');
      
      // 1. Check if Joel exists by email
      log('📧 Searching for Joel by email: joel.yaffe@gmail.com');
      const emailQuery = query(
        collection(db, 'users'), 
        where('email', '==', 'joel.yaffe@gmail.com')
      );
      const emailSnapshot = await getDocs(emailQuery);
      
      if (emailSnapshot.empty) {
        log('❌ No user found with email: joel.yaffe@gmail.com');
        
        // 2. Check current logged-in user (you)
        if (user?.uid) {
          log(`🔍 Checking current user UID: ${user.uid}`);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            log('✅ Current user document found:');
            log(`   Email: ${userData.email}`);
            log(`   DisplayName: ${userData.displayName}`);
            log(`   Role: ${userData.role}`);
            log(`   AdminProfile: ${JSON.stringify(userData.adminProfile || {}, null, 2)}`);
            
            // 3. If this is Joel's account, update it
            if (userData.email === 'joel.yaffe@gmail.com' || 
                userData.displayName?.includes('Joel') || 
                user.email === 'joel.yaffe@gmail.com') {
              
              log('🎯 This appears to be Joel\'s account! Updating profile...');
              
              const joelUpdateData = {
                email: 'joel.yaffe@gmail.com', // Ensure email is correct
                displayName: 'Joel Yaffe',
                adminProfile: {
                  ...userData.adminProfile,
                  firstName: 'Joel',
                  lastName: 'Yaffe',
                  displayName: 'Joel Yaffe',
                  email: 'joel.yaffe@gmail.com',
                  jobTitle: 'CTO, Founder',
                  department: 'Leadership',
                  specialization: 'Chief Technology Officer & Co-Founder',
                  bio: userData.adminProfile?.bio || 'Founder and CTO of SHELTR-AI, pioneering innovative solutions to revolutionize homelessness services through cutting-edge technology and compassionate action.',
                  profileComplete: true,
                  profileVisibility: 'public',
                  displayOrder: -1,
                  lastUpdated: new Date(),
                  updatedBy: 'debug-script'
                },
                updated_at: new Date()
              };
              
              await updateDoc(doc(db, 'users', user.uid), joelUpdateData);
              log('✅ Joel\'s profile updated successfully!');
              
            } else {
              log('❌ Current user is not Joel');
            }
          } else {
            log('❌ Current user document not found');
          }
        }
      } else {
        log('✅ Found user with email joel.yaffe@gmail.com');
        const joelDoc = emailSnapshot.docs[0];
        const joelData = joelDoc.data();
        
        log('📄 Joel\'s current data:');
        log(`   UID: ${joelDoc.id}`);
        log(`   Email: ${joelData.email}`);
        log(`   DisplayName: ${joelData.displayName}`);
        log(`   Role: ${joelData.role}`);
        log(`   AdminProfile: ${JSON.stringify(joelData.adminProfile || {}, null, 2)}`);
      }
      
      // 4. Search for any user with Joel in the name
      log('🔍 Searching for users with "Joel" in displayName...');
      const nameQuery = query(
        collection(db, 'users'),
        where('displayName', '>=', 'Joel'),
        where('displayName', '<=', 'Joel\uf8ff')
      );
      const nameSnapshot = await getDocs(nameQuery);
      
      if (!nameSnapshot.empty) {
        log(`✅ Found ${nameSnapshot.docs.length} users with "Joel" in name:`);
        nameSnapshot.docs.forEach(doc => {
          const data = doc.data();
          log(`   - ${doc.id}: ${data.email} (${data.displayName})`);
        });
      } else {
        log('❌ No users found with "Joel" in displayName');
      }
      
    } catch (error) {
      log(`❌ Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-6 w-6 text-blue-600" />
            <CardTitle>Debug Joel's Profile</CardTitle>
          </div>
          <CardDescription>
            Find and fix Joel's user record in the database to make the team page work correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={debugJoelProfile} 
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Debug Joel's Profile</span>
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
