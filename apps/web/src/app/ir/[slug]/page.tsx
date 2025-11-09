'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function IRIRDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { user, loading: authLoading } = useAuth();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Authorization check
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/ir');
      return;
    }

    // Check if user is authorized (investor or admin)
    const userWithClaims = user as any;
    const authorized = 
      user.role === 'super_admin' || 
      userWithClaims.qualified_investor === true || 
      userWithClaims.investor === true;

    if (!authorized) {
      router.push('/ir');
      return;
    }

    setIsAuthorized(true);
  }, [user, authLoading, router]);

  // Load document
  useEffect(() => {
    if (!isAuthorized || !slug) return;

    const loadDocument = async () => {
      try {
        // Query by hub_slug or secure_slug
        const docsQuery = query(
          collection(db, 'knowledge_documents'),
          where('published_to_ir', '==', true),
          where('status', '==', 'active')
        );
        
        const snapshot = await getDocs(docsQuery);
        
        // Find document matching slug
        const matchingDoc = snapshot.docs.find(doc => {
          const data = doc.data();
          return data.hub_slug === slug || data.secure_slug === slug || doc.id === slug;
        });

        if (matchingDoc) {
          setDocument({ id: matchingDoc.id, ...matchingDoc.data() });
        } else {
          console.error('Document not found:', slug);
        }
      } catch (error) {
        console.error('Error loading document:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [isAuthorized, slug]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/ir/dataroom" className="text-2xl font-bold hover:opacity-80 transition-opacity">
                SHELTR
              </Link>
              <Badge className="bg-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Investor Access
              </Badge>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Document Not Found</h1>
          <p className="text-muted-foreground mb-8">The document you're looking for could not be found.</p>
          <Button onClick={() => router.push('/ir/dataroom')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Data Room
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/ir/dataroom" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              SHELTR
            </Link>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Investor Access
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/ir/dataroom')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/ir" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Investor Relations
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/ir/dataroom" className="hover:text-foreground transition-colors">
              Data Room
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">{document.title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="max-w-5xl mx-auto">
          <CardContent className="p-8">
            {/* Document Header */}
            <div className="mb-8 pb-6 border-b">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{document.title}</h1>
                  {document.description && (
                    <p className="text-lg text-muted-foreground">{document.description}</p>
                  )}
                </div>
                {document.badge && (
                  <Badge variant="secondary">{document.badge}</Badge>
                )}
              </div>
            </div>

            {/* Document Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {document.content || document.markdown_content || 'No content available.'}
              </ReactMarkdown>
            </div>

            {/* Document Footer */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  {document.category && (
                    <span className="mr-4">Category: {document.category}</span>
                  )}
                  {document.permission_level && (
                    <Badge variant="outline">{document.permission_level}</Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/ir/dataroom')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Data Room
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

