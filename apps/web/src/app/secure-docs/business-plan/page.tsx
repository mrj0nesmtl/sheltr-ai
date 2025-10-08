'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SecureDocumentService } from '@/services/secureDocumentService';
import SecureDocumentViewer from '@/components/SecureDocumentViewer';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Loader2, Shield } from 'lucide-react';

export default function BusinessPlanPage() {
  const { user, loading: authLoading } = useAuth();
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authorized founder
  const isAuthorizedFounder = user?.email && [
    'joel.yaffe@gmail.com',
    'alexanderkline13@gmail.com', 
    'alaghetts@gmail.com',
    'doug.kukura@gmail.com',
    'morganhirtle@gmail.com'
  ].includes(user.email);

  useEffect(() => {
    const findBusinessPlan = async () => {
      // WAIT for auth to finish loading before checking authorization
      if (authLoading) {
        return;
      }

      if (!user || !isAuthorizedFounder) {
        setError('Access denied - founders only');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Try to find the business plan document by slug
        const document = await SecureDocumentService.getDocumentBySlug(
          'founder_documents',
          'business-plan',
          'sheltr-business-plan'
        );

        if (document) {
          setDocumentId(document.id);
        } else {
          setError('Business plan not found. Please run the migration first.');
        }
      } catch (err: any) {
        console.error('Error finding business plan:', err);
        setError(err.message || 'Failed to load business plan');
      } finally {
        setLoading(false);
      }
    };

    findBusinessPlan();
  }, [user, isAuthorizedFounder, authLoading]);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Authentication Required</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Please log in to access secure documents.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorizedFounder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <Shield className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Access Denied</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Only authorized founders can access the business plan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-muted-foreground">Loading business plan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !documentId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Document Not Found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {error || 'Business plan document could not be loaded.'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <a href="/admin/migrate-secure-docs" className="text-blue-600 hover:underline">
                    Run the migration tool
                  </a> to move the business plan to secure storage.
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
      <SecureDocumentViewer 
        documentId={documentId}
        collection="founder_documents"
        className="max-w-6xl mx-auto"
      />
    </div>
  );
}
