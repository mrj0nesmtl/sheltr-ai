'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowLeft, FileText, Calendar, User, Tag, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface SecureDocumentViewerProps {
  documentSlug: string;
  category?: string;
  backLink?: string;
  backLinkText?: string;
}

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
}

export default function SecureDocumentViewer({ 
  documentSlug, 
  category,
  backLink = '/portal/founders-only',
  backLinkText
}: SecureDocumentViewerProps) {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmbedded, setIsEmbedded] = useState(false);

  // Check if embedded in iframe (from investor data room)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setIsEmbedded(urlParams.get('embed') === 'true');
    }
  }, []);

  // Determine back link text based on context
  const getBackLinkText = () => {
    if (backLinkText) return backLinkText;
    return isEmbedded ? 'Back to Research Hub' : 'Back to Portal';
  };

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First, try to get document by ID directly
        const docRef = doc(db, 'founder_documents', documentSlug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentData;
          setDocument(data);
        } else {
          // If not found by ID, try querying by slug field
          const { collection: firestoreCollection, query: firestoreQuery, where, getDocs } = await import('firebase/firestore');
          const q = firestoreQuery(
            firestoreCollection(db, 'founder_documents'),
            where('slug', '==', documentSlug)
          );
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data() as DocumentData;
            setDocument(data);
          } else {
            setError('Document not found');
          }
        }
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Failed to load document');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [documentSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading secure document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="max-w-md w-full border-red-200 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle>Document Not Found</CardTitle>
            </div>
            <CardDescription>
              {error || 'The requested document could not be found or you do not have permission to access it.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={backLink}>
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {getBackLinkText()}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayTitle = document.metadata?.displayTitle || document.title;
  const description = document.metadata?.description || '';
  const author = document.metadata?.author || 'SHELTR Team';
  const confidentialityLevel = document.metadata?.confidentialityLevel || 'founder';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header - Hidden when embedded */}
      {!isEmbedded && (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-0 sm:h-16 gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <Link href="/" className="text-xl sm:text-2xl font-bold">
                  SHELTR
                </Link>
                <Badge className="bg-red-600 text-white text-xs whitespace-nowrap">
                  <Lock className="h-3 w-3 mr-1" />
                  {confidentialityLevel === 'founder' ? 'Founders Only' : 'Confidential'}
                </Badge>
              </div>
              
              <Link href={backLink} className="flex-shrink-0">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{getBackLinkText()}</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Document Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-purple-600" />
            <Badge className="bg-purple-600 text-white">{category || document.category}</Badge>
            {document.version && (
              <Badge variant="outline">v{document.version}</Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{displayTitle}</h1>
          
          {description && (
            <p className="text-xl text-muted-foreground mb-6">{description}</p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
            )}
            {document.updatedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Updated {document.updatedAt.toDate?.()?.toLocaleDateString() || 'Recently'}
                </span>
              </div>
            )}
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <div className="flex gap-1">
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <Alert className="mb-8 border-red-500 bg-red-50 dark:bg-red-900/20">
          <Lock className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            <strong>Confidential Document:</strong> This document contains proprietary and confidential information. 
            Unauthorized distribution or sharing is strictly prohibited.
          </AlertDescription>
        </Alert>

        {/* Document Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                  h4: ({ ...props }) => <h4 className="text-lg font-semibold mt-3 mb-2" {...props} />,
                  p: ({ ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                  li: ({ ...props }) => <li className="ml-4" {...props} />,
                  a: ({ ...props }) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
                  code: ({ inline, ...props }: any) =>
                    inline ? (
                      <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm" {...props} />
                    ) : (
                      <code className="block bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto" {...props} />
                    ),
                  table: ({ ...props }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
                    </div>
                  ),
                  th: ({ ...props }) => <th className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-semibold text-left" {...props} />,
                  td: ({ ...props }) => <td className="px-4 py-2 border-t border-gray-200 dark:border-gray-700" {...props} />,
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-purple-600 pl-4 italic my-4 text-muted-foreground" {...props} />
                  ),
                }}
              >
                {document.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <Link href={backLink}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {getBackLinkText()}
            </Button>
          </Link>
          
          <div className="text-sm text-muted-foreground">
            Document ID: {document.slug}
          </div>
        </div>

        {/* Confidentiality Footer */}
        <Card className="mt-8 bg-slate-900 text-white border-slate-700">
          <CardContent className="py-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Confidential Information</h4>
                <p className="text-sm text-slate-300">
                  All information in this document is confidential and proprietary to SHELTR-AI. 
                  Unauthorized sharing or distribution is strictly prohibited. Access is logged for security and compliance purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

