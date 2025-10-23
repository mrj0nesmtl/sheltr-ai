'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SecureDocumentService } from '@/services/secureDocumentService';
import SecureDocumentViewer from '@/components/SecureDocumentViewer';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Loader2, Shield } from 'lucide-react';

export default function MSBRegistrationGuidePage() {
  const { user, loading: authLoading } = useAuth();
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has Founders Portal access (Super Admin or Platform Admin)
  const isAuthorizedUser = user && (
    user.role === 'super_admin' || 
    user.role === 'platform_admin'
  );

  // DEBUG: Log user info
  useEffect(() => {
    console.log('🔍 [MSB Page] Auth State:', {
      authLoading,
      hasUser: !!user,
      userRole: user?.role,
      isAuthorizedUser
    });
  }, [user, authLoading, isAuthorizedUser]);

  useEffect(() => {
    const findMSBGuide = async () => {
      // WAIT for auth to finish loading before checking authorization
      if (authLoading) {
        console.log('⏳ [MSB Page] Waiting for auth to load...');
        return;
      }

      if (!user || !isAuthorizedUser) {
        console.error('❌ [MSB Page] Access denied:', {
          hasUser: !!user,
          userRole: user?.role,
          isAuthorizedUser
        });
        setError('Access denied - Founders Portal access required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const document = await SecureDocumentService.getDocumentBySlug(
          'founder_documents',
          'legal-compliance',
          'msb-registration-canada'
        );

        if (document) {
          setDocumentId(document.id);
        } else {
          setError('MSB registration guide not found. Please ensure it has been migrated to secure storage.');
        }
      } catch (err: any) {
        console.error('Error finding MSB guide:', err);
        setError(err.message || 'Failed to load MSB registration guide');
      } finally {
        setLoading(false);
      }
    };

    findMSBGuide();
  }, [user, isAuthorizedUser, authLoading]);

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

  if (!isAuthorizedUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <Shield className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Access Denied</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Only users with Founders Portal access (Super Admin and Platform Administrators) can access the MSB registration guide.
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
            <p className="text-muted-foreground">Loading MSB registration guide...</p>
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
                  {error || 'MSB registration guide could not be loaded.'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please ensure the document has been migrated to secure storage.
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

