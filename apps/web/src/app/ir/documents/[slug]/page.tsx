'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowLeft, FileText, Calendar, User, Tag, AlertTriangle, Shield } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface DocumentData {
  title: string;
  slug: string;
  content: string;
  category: string;
  type: string;
  tags: string[];
  metadata?: {
    description?: string;
    author?: string;
    displayTitle?: string;
    confidentialityLevel?: string;
    [key: string]: any;
  };
  createdAt?: any;
  updatedAt?: any;
  version?: string | number;
  isInvestorDataRoom?: boolean;
}

export default function InvestorDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const documentSlug = params.slug as string;

  // Authorization check
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/ir');
      } else if (user.role !== 'investor') {
        toast.error('Access denied: Investor credentials required');
        router.push('/dashboard');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, authLoading, router]);

  // Load document
  useEffect(() => {
    const loadDocument = async () => {
      if (!isAuthorized) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log('🔍 Loading document:', documentSlug);

        // Check if this document is shared to investor data room
        const checkDoc = doc(db, 'secure_documents', documentSlug);
        const checkSnap = await getDoc(checkDoc);
        
        if (!checkSnap.exists() || !checkSnap.data().isInvestorDataRoom) {
          setError('This document is not available in the investor data room');
          return;
        }

        // For pages that exist as React components, we'll embed them in an iframe
        // to keep the /ir/documents/ URL structure
        const reactPages = [
          'investor-relations',
          'business-plan',
          'covenant-house-outreach',
          'design-guide',
          'msb-registration',
          'adyen-integration',
          'implementation-readiness',
          'platform-admin-guide'
        ];

        if (reactPages.includes(documentSlug)) {
          console.log('📄 Loading React page in iframe:', documentSlug);
          // Set a special flag to render iframe
          setDocument({
            title: checkSnap.data().title || 'Document',
            slug: documentSlug,
            content: '', // Will use iframe instead
            category: checkSnap.data().category || 'Investment Document',
            type: 'iframe',
            tags: checkSnap.data().tags || [],
            metadata: {
              displayTitle: checkSnap.data().title,
              description: checkSnap.data().description,
              iframeSrc: `/portal/founders-only/${documentSlug}`
            },
            isInvestorDataRoom: true
          });
          setIsLoading(false);
          return;
        }

        // For other documents, try to load from Firestore
        let docRef = doc(db, 'secure_documents', documentSlug);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentData;
          
          // Verify this document is shared to investor data room
          if (!data.isInvestorDataRoom) {
            setError('This document is not available in the investor data room');
            return;
          }
          
          // Check if it has content
          if (!data.content) {
            console.log('⚠️  Document has no content, trying founder_documents...');
            // Try founder_documents as fallback
            const founderDocRef = doc(db, 'founder_documents', documentSlug);
            const founderDocSnap = await getDoc(founderDocRef);
            
            if (founderDocSnap.exists()) {
              setDocument({ ...data, content: founderDocSnap.data().content });
            } else {
              setError('Document content not found');
            }
          } else {
            setDocument(data);
          }
        } else {
          // Try founder_documents collection as fallback
          docRef = doc(db, 'founder_documents', documentSlug);
          docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as DocumentData;
            setDocument(data);
          } else {
            // Try querying by slug field
            const { collection: firestoreCollection, query: firestoreQuery, where, getDocs } = await import('firebase/firestore');
            const q = firestoreQuery(
              firestoreCollection(db, 'secure_documents'),
              where('slug', '==', documentSlug),
              where('isInvestorDataRoom', '==', true)
            );
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const data = querySnapshot.docs[0].data() as DocumentData;
              setDocument(data);
            } else {
              setError('Document not found or not available');
            }
          }
        }
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Failed to load document. Please check your permissions.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [documentSlug, isAuthorized, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="ml-2">
              <strong>Error:</strong> {error || 'Document not found'}
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Link href="/ir/dataroom">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Data Room
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <Link href="/ir/dataroom">
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="whitespace-nowrap">Data Room</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>/</span>
                <span className="whitespace-nowrap">Investment Documents</span>
                <span>/</span>
                <span className="font-medium text-foreground whitespace-nowrap">{document.category || 'Document'}</span>
              </div>
            </div>
            <Badge className="bg-blue-600 text-white flex-shrink-0">
              <Shield className="h-3 w-3 mr-1" />
              Investor Access
            </Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Document Header */}
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <Badge className="bg-blue-600 text-white mb-2">
                    {document.category || 'Confidential'}
                  </Badge>
                  <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">
                    {document.metadata?.displayTitle || document.title}
                  </CardTitle>
                </div>
              </div>
            </div>
            
            {document.metadata?.description && (
              <CardDescription className="text-base">
                {document.metadata.description}
              </CardDescription>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
              {document.metadata?.author && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{document.metadata.author}</span>
                </div>
              )}
              {document.updatedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {new Date(document.updatedAt.seconds * 1000).toLocaleDateString()}</span>
                </div>
              )}
              {document.version && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Version {document.version}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Confidentiality Notice */}
        <Alert className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            <strong>Confidential Information:</strong> This document contains proprietary information. 
            Unauthorized sharing or distribution is strictly prohibited.
          </AlertDescription>
        </Alert>

        {/* Document Content */}
        {document.type === 'iframe' && document.metadata?.iframeSrc ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <iframe
                src={document.metadata.iframeSrc}
                className="w-full border-0"
                style={{ minHeight: '800px', height: '100vh' }}
                title={document.title}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none pt-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {document.content}
              </ReactMarkdown>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center">
          <Link href="/ir/dataroom">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Data Room
            </Button>
          </Link>
          
          {document.metadata?.confidentialityLevel && (
            <Badge variant="outline" className="text-xs">
              {document.metadata.confidentialityLevel}
            </Badge>
          )}
        </div>
      </main>
    </div>
  );
}

