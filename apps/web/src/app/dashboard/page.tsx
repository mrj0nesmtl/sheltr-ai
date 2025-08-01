"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { DashboardRouter } from '@/components/auth/DashboardRouter';
import { doc, getDoc } from 'firebase/firestore';
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
        <Button onClick={debugUserData} variant="outline" size="sm">
          Check Firestore Data
        </Button>
      </div>

      <DashboardRouter>
        <div className="text-center py-8">
          <p className="text-gray-500">Redirecting to your role-specific dashboard...</p>
        </div>
      </DashboardRouter>
    </div>
  );
} 