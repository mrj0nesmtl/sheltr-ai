'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PositionMigrationService } from '@/utils/migratePositionData';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function MigratePositionsPage() {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');

  // Only allow Super Admins
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              This migration tool is only available to Super Administrators.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const runMigration = async () => {
    setIsRunning(true);
    setStatus('running');
    setResults([]);

    try {
      // Capture console logs
      const originalLog = console.log;
      const logs: string[] = [];
      
      console.log = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logs.push(message);
        setResults(prev => [...prev, message]);
        originalLog(...args);
      };

      await PositionMigrationService.migratePositionData();
      
      // Restore console.log
      console.log = originalLog;
      
      setStatus('completed');
    } catch (error) {
      console.error('Migration failed:', error);
      setResults(prev => [...prev, `❌ Migration failed: ${error}`]);
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const verifyMigration = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Capture console logs for verification
      const originalLog = console.log;
      const logs: string[] = [];
      
      console.log = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logs.push(message);
        setResults(prev => [...prev, message]);
        originalLog(...args);
      };

      await PositionMigrationService.verifyMigration();
      
      // Restore console.log
      console.log = originalLog;
      
    } catch (error) {
      console.error('Verification failed:', error);
      setResults(prev => [...prev, `❌ Verification failed: ${error}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-600" />
            <CardTitle>Position Data Migration</CardTitle>
          </div>
          <CardDescription>
            Sync hardcoded platform admin position descriptions from user management 
            directory into the actual user database records. This will fix the team 
            page data inconsistencies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={runMigration} 
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              <span>Run Migration</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={verifyMigration} 
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Verify Results</span>
            </Button>
            
            {status === 'completed' && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Migration Completed
              </Badge>
            )}
            
            {status === 'error' && (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Migration Failed
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p><strong>What this migration does:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Takes hardcoded position descriptions from user management directory</li>
              <li>Parses them into structured data (jobTitle, department, specialization)</li>
              <li>Injects the data into user database adminProfile records</li>
              <li>Sets Joel Yaffe's title to "CTO, Founder" as requested</li>
              <li>Makes all profiles public for team page display</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Migration Results</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Expected Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>Joel Yaffe:</strong> CTO, Founder → Leadership → Chief Technology Officer & Co-Founder</div>
            <div><strong>Alexander Kline:</strong> Operations, Partnerships → Operations</div>
            <div><strong>Doug Kukura:</strong> DeFi, Payments, Partnerships → DeFi & Payments</div>
            <div><strong>Marc Reichel:</strong> Product Design & Engineering → Engineering</div>
            <div><strong>And 8 more Platform Administrators...</strong></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
