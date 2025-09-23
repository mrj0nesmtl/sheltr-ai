'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function StatusDebugger() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runDebugTest = async () => {
    if (!user?.uid) {
      setDebugInfo({ error: 'No user UID available' });
      return;
    }

    setTesting(true);
    const results: any = {
      userId: user.uid,
      userEmail: user.email,
      timestamp: new Date().toISOString()
    };

    try {
      // Test 1: Check if document exists
      const docRef = doc(db, 'user_status', user.uid);
      const docSnap = await getDoc(docRef);
      
      results.documentExists = docSnap.exists();
      results.currentData = docSnap.exists() ? docSnap.data() : null;

      // Test 2: Try to write a test status
      try {
        await setDoc(docRef, {
          status: 'online',
          lastActivity: serverTimestamp(),
          debugTest: true
        }, { merge: true });
        results.writeTest = 'SUCCESS';
      } catch (writeError) {
        results.writeTest = 'FAILED';
        results.writeError = writeError;
      }

      // Test 3: Read the document again to see if write worked
      const docSnapAfter = await getDoc(docRef);
      results.documentExistsAfterWrite = docSnapAfter.exists();
      results.dataAfterWrite = docSnapAfter.exists() ? docSnapAfter.data() : null;

    } catch (error) {
      results.error = error;
    }

    setDebugInfo(results);
    setTesting(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>User Status Debug Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDebugTest} disabled={testing}>
          {testing ? 'Testing...' : 'Run Debug Test'}
        </Button>
        
        {Object.keys(debugInfo).length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
