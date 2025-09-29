'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { migrateBusinessPlanClient } from '@/utils/migrateBusinessPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Database, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function MigrateSecureDocsPage() {
  const { user } = useAuth();
  const [migrationStatus, setMigrationStatus] = useState<{
    businessPlan: 'pending' | 'running' | 'completed' | 'error';
    welcomeLetters: 'pending' | 'running' | 'completed' | 'error';
  }>({
    businessPlan: 'pending',
    welcomeLetters: 'pending'
  });
  const [results, setResults] = useState<{
    businessPlanId?: string;
    errors: string[];
    logs: string[];
  }>({
    errors: [],
    logs: []
  });

  // Check if user is authorized founder
  const isAuthorizedFounder = user?.email && [
    'joel.yaffe@gmail.com',
    'alexanderkline13@gmail.com', 
    'alaghetts@gmail.com',
    'doug.kukura@gmail.com',
    'morganhirtle@gmail.com'
  ].includes(user.email);

  // Debug logging (can be removed after testing)
  // console.log('Debug - User object:', user);
  // console.log('Debug - User email:', user?.email);
  // console.log('Debug - Is authorized founder:', isAuthorizedFounder);

  const addLog = (message: string) => {
    setResults(prev => ({
      ...prev,
      logs: [...prev.logs, `${new Date().toLocaleTimeString()}: ${message}`]
    }));
  };

  const addError = (error: string) => {
    setResults(prev => ({
      ...prev,
      errors: [...prev.errors, error]
    }));
  };

  const migrateBusinessPlan = async () => {
    if (!user?.uid) {
      addError('User not authenticated');
      return;
    }

    try {
      setMigrationStatus(prev => ({ ...prev, businessPlan: 'running' }));
      addLog('Starting business plan migration...');

      const documentId = await migrateBusinessPlanClient(user.uid);
      
      setResults(prev => ({ ...prev, businessPlanId: documentId }));
      setMigrationStatus(prev => ({ ...prev, businessPlan: 'completed' }));
      addLog(`Business plan migrated successfully with ID: ${documentId}`);
    } catch (error: any) {
      console.error('Migration error:', error);
      addError(`Business plan migration failed: ${error.message}`);
      setMigrationStatus(prev => ({ ...prev, businessPlan: 'error' }));
    }
  };

  const migrateWelcomeLetters = async () => {
    // TODO: Implement welcome letters migration
    addLog('Welcome letters migration not yet implemented');
    setMigrationStatus(prev => ({ ...prev, welcomeLetters: 'completed' }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Database className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  // Also check if user is Super Admin as fallback
  const isSuperAdmin = user?.role === 'super_admin';
  
  if (!isAuthorizedFounder && !isSuperAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <Shield className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Access Denied</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Only authorized founders can access the secure document migration tools.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Secure Document Migration</CardTitle>
                <p className="text-muted-foreground">
                  Migrate sensitive documents from public files to secure Firestore collections
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Security Warning */}
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-800 dark:text-amber-200">
                  Security Migration Notice
                </p>
                <p className="text-amber-700 dark:text-amber-300 mt-1">
                  This process will move sensitive documents from publicly accessible files to secure 
                  Firestore collections with proper authentication and authorization. Only run this 
                  migration once per document.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Migration Tasks */}
        <div className="grid gap-4">
          {/* Business Plan Migration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(migrationStatus.businessPlan)}
                  <div>
                    <CardTitle className="text-lg">Business Plan Migration</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Migrate SHELTR Business Plan to secure Firestore collection
                    </p>
                  </div>
                </div>
                {getStatusBadge(migrationStatus.businessPlan)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium">Source: <code>/docs/founders/sheltr-business-plan.md</code></p>
                    <p className="text-muted-foreground">Target: <code>founder_documents</code> collection</p>
                  </div>
                  <Button 
                    onClick={migrateBusinessPlan}
                    disabled={migrationStatus.businessPlan === 'running' || migrationStatus.businessPlan === 'completed'}
                    className="flex items-center gap-2"
                  >
                    {migrationStatus.businessPlan === 'running' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Migrating...
                      </>
                    ) : migrationStatus.businessPlan === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4" />
                        Migrate
                      </>
                    )}
                  </Button>
                </div>
                
                {results.businessPlanId && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Success!</strong> Document ID: <code>{results.businessPlanId}</code>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Welcome Letters Migration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(migrationStatus.welcomeLetters)}
                  <div>
                    <CardTitle className="text-lg">Welcome Letters Migration</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Migrate personalized welcome letters to secure collection
                    </p>
                  </div>
                </div>
                {getStatusBadge(migrationStatus.welcomeLetters)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium">Source: <code>/docs/platform-admin/welcome-letters/</code></p>
                    <p className="text-muted-foreground">Target: <code>platform_admin_documents</code> collection</p>
                  </div>
                  <Button 
                    onClick={migrateWelcomeLetters}
                    disabled={migrationStatus.welcomeLetters === 'running' || migrationStatus.welcomeLetters === 'completed'}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {migrationStatus.welcomeLetters === 'running' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Migrating...
                      </>
                    ) : migrationStatus.welcomeLetters === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4" />
                        Migrate (Coming Soon)
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Migration Logs */}
        {(results.logs.length > 0 || results.errors.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Migration Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                    {log}
                  </div>
                ))}
                {results.errors.map((error, index) => (
                  <div key={index} className="text-sm font-mono bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-2 rounded border border-red-200 dark:border-red-800">
                    ERROR: {error}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>After successful migration:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Update founders portal links to use secure document viewers</li>
                <li>Test document access with different user roles</li>
                <li>Remove public sensitive files from the repository</li>
                <li>Update .gitignore to prevent future sensitive file commits</li>
                <li>Deploy Firestore security rules to production</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
