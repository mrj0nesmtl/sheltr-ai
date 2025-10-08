'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SecureDocumentService, SecureDocument } from '@/services/secureDocumentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, Shield, FileText, ExternalLink, Search, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function ShelterResearchHubPage() {
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<SecureDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<SecureDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user has Founders Portal access
  const isAuthorizedUser = user && (
    user.role === 'super_admin' || 
    user.role === 'platform_admin'
  );

  useEffect(() => {
    const loadDocuments = async () => {
      // WAIT for auth to finish loading before checking authorization
      if (authLoading) {
        return;
      }

      if (!user || !isAuthorizedUser) {
        setError('Access denied - Founders Portal access required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Try to get all founder documents
        // The service may fail if Firestore indexes aren't ready yet
        const allDocs = await SecureDocumentService.getAllFounderDocuments();
        
        // Filter for shelter-research category
        const shelterDocs = allDocs.filter(doc => doc.category === 'shelter-research');
        
        // Sort by title (which contains the slug)
        shelterDocs.sort((a, b) => a.title.localeCompare(b.title));
        
        setDocuments(shelterDocs);
        setFilteredDocuments(shelterDocs);
      } catch (err: any) {
        console.error('Error loading shelter research documents:', err);
        
        // Check if it's an index error
        if (err.message && err.message.includes('index')) {
          setError('Firestore indexes are being created. This usually takes 5-10 minutes. Please refresh the page in a few minutes.');
        } else {
          setError(err.message || 'Failed to load research documents');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user, isAuthorizedUser, authLoading]);

  // Filter documents based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(doc => {
        const displayTitle = doc.metadata?.displayTitle || doc.title;
        const description = doc.metadata?.description || '';
        const searchLower = searchTerm.toLowerCase();
        
        return (
          displayTitle.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower) ||
          doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      });
      setFilteredDocuments(filtered);
    }
  }, [searchTerm, documents]);

  // Color mapping for cards
  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'purple':
        return {
          border: 'border-purple-200 dark:border-purple-800',
          icon: 'text-purple-600',
          badge: 'bg-purple-600 text-white',
          button: 'border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
        };
      case 'blue':
        return {
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600',
          badge: 'bg-blue-600 text-white',
          button: 'border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        };
      case 'red':
        return {
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600',
          badge: 'bg-red-600 text-white',
          button: 'border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
        };
      case 'green':
        return {
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-600',
          badge: 'bg-green-600 text-white',
          button: 'border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
        };
      default:
        return {
          border: 'border-gray-200 dark:border-gray-800',
          icon: 'text-gray-600',
          badge: 'bg-gray-600 text-white',
          button: 'border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20'
        };
    }
  };

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
                  Please log in to access shelter research documents.
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
                  Only users with Founders Portal access (Super Admin and Platform Administrators) can access shelter research.
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
            <p className="text-muted-foreground">Loading shelter research documents...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isIndexError = error.includes('index') || error.includes('Index');
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className={isIndexError ? 'border-amber-200 dark:border-amber-800' : 'border-red-200 dark:border-red-800'}>
          <CardContent className="p-6">
            <div className={`flex items-center gap-3 ${isIndexError ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
              <AlertTriangle className="h-5 w-5" />
              <div className="flex-1">
                <h3 className="font-semibold">
                  {isIndexError ? 'Firestore Indexes Building' : 'Error Loading Documents'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
                
                {isIndexError && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-sm mb-2">What's happening?</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Firebase is building composite indexes for the research hub</li>
                      <li>This is a one-time setup that usually takes 5-10 minutes</li>
                      <li>You can monitor progress in the Firebase Console</li>
                      <li>Once complete, the page will work perfectly</li>
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        size="sm"
                        className="border-amber-600 text-amber-600 hover:bg-amber-50"
                      >
                        Refresh Page
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <a
                          href="https://console.firebase.google.com/project/sheltr-ai/firestore/indexes"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Check Index Status
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temporary Access: Direct Links While Indexes Build */}
        {isIndexError && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Direct Document Access</CardTitle>
              <p className="text-sm text-muted-foreground">
                While indexes are building, you can access documents directly using these links:
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/secure-docs/shelter-research/general-research">
                    <FileText className="h-4 w-4 mr-2 text-purple-600" />
                    General Research & HMIS Overview
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/secure-docs/shelter-research/shelters-state-by-state">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    US State-by-State Shelter Analysis
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/secure-docs/shelter-research/top-shelters-canada">
                    <FileText className="h-4 w-4 mr-2 text-red-600" />
                    Top Homeless Shelters in Canada
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/secure-docs/shelter-research/unique-shelter-programs">
                    <FileText className="h-4 w-4 mr-2 text-green-600" />
                    Unique & Innovative Shelter Programs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/portal" className="hover:text-foreground transition-colors">
          Portal
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/portal/founders-only" className="hover:text-foreground transition-colors">
          Founders Only
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Shelter Research Hub</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Shelter Research Hub</h1>
            <p className="text-muted-foreground">
              Comprehensive research on homeless shelters, HMIS systems, and innovative programs
            </p>
          </div>
        </div>

        {/* Stats and Search */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {documents.length} {documents.length === 1 ? 'Document' : 'Documents'}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Shield className="h-3 w-3 mr-1" />
              Secure Access
            </Badge>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search research documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Documents Found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'No research documents available'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredDocuments.map((doc) => {
            const displayTitle = doc.metadata?.displayTitle || doc.title;
            const description = doc.metadata?.description || 'Research document';
            const color = doc.metadata?.color;
            const colors = getColorClasses(color);
            const slug = doc.title; // title contains the slug

            return (
              <Card
                key={doc.id}
                className={`hover:shadow-lg transition-all cursor-pointer ${colors.border}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <FileText className={`h-8 w-8 ${colors.icon}`} />
                    <Badge className={colors.badge}>
                      Research
                    </Badge>
                  </div>
                  <CardTitle className={colors.icon}>
                    {displayTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {description}
                  </p>

                  {/* Tags */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doc.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>Version {doc.version}</span>
                    <span>{Math.ceil((doc.content?.length || 0) / 1000)}K characters</span>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className={`w-full border-2 ${colors.button}`}
                  >
                    <Link
                      href={`/secure-docs/shelter-research/${slug}`}
                      className="flex items-center justify-center gap-2 no-underline"
                    >
                      View Document
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 p-6 bg-muted/30 rounded-lg border">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">Access & Privacy</h3>
            <p className="text-sm text-muted-foreground">
              These research documents are accessible only to Super Administrators and Platform Administrators. 
              All content is sourced from publicly available information. Future versions may be curated and 
              added to the knowledge base for broader platform use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

