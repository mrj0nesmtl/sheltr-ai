"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { DashboardRouter } from '@/components/auth/DashboardRouter';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    console.log('🔍 Dashboard Debug - Current user:', user);
    console.log('🔍 Dashboard Debug - User role:', user?.role);
    console.log('🔍 Dashboard Debug - User UID:', user?.uid);
  }, [user]);

  const debugUserData = async () => {
    if (!user?.uid) {
      console.log('❌ No user UID available');
      return;
    }

    try {
      console.log('🔍 Manually checking Firestore for user:', user.uid);
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        console.log('✅ Firestore user document found:', data);
      } else {
        console.log('❌ No Firestore user document found for UID:', user.uid);
      }
    } catch (error) {
      console.error('❌ Error fetching user document:', error);
    }
  };

  const createMissingUserDoc = async () => {
    if (!user?.uid || !user?.email) {
      console.log('❌ No user data available for document creation');
      return;
    }

    try {
      console.log('🔧 Creating missing user document for:', user.email);
      
      // Determine role based on email
      let role = 'participant'; // default
      if (user.email === 'joel.yaffe@gmail.com') {
        role = 'super_admin';
      } else if (user.email === 'shelteradmin@example.com') {
        role = 'admin';
      } else if (user.email === 'donor@example.com') {
        role = 'donor';
      }

      const userDocData = {
        uid: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || 'User',
        lastName: user.displayName?.split(' ')[1] || 'Name',
        role: role,
        phone: '',
        shelterId: null,
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified || false,
        profileComplete: false,
        lastLoginAt: new Date().toISOString(),
        status: 'active'
      };

      await setDoc(doc(db, 'users', user.uid), userDocData);
      console.log('✅ User document created successfully:', userDocData);
      
      // Force page reload to re-fetch user data
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Error creating user document:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-4">Loading your dashboard...</p>
      
      {/* Debug section */}
      <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">🐛 Debug Info</h3>
        <p className="text-sm text-yellow-700 mb-2">
          User: {user?.email} | Role: {user?.role || 'undefined'} | UID: {user?.uid}
        </p>
        <div className="space-x-2">
          <Button onClick={debugUserData} variant="outline" size="sm">
            Check Firestore Data
          </Button>
          {user?.role === undefined && (
            <Button onClick={createMissingUserDoc} variant="secondary" size="sm">
              🔧 Create Missing User Doc
            </Button>
          )}
        </div>
      </div>

      <DashboardRouter>
        <div className="text-center py-8">
          <p className="text-gray-500">Redirecting to your role-specific dashboard...</p>
        </div>
      </DashboardRouter>
    </div>
  );
} 