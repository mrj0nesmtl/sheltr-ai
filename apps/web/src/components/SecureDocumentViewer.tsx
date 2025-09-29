'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SecureDocumentService, SecureDocument } from '@/services/secureDocumentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar, 
  User, 
  Tag, 
  AlertTriangle, 
  Loader2,
  Lock,
  Eye,
  Download
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SecureDocumentViewerProps {
  documentId: string;
  collection: 'founder_documents' | 'platform_admin_documents';
  className?: string;
}

export default function SecureDocumentViewer({ 
  documentId, 
  collection, 
  className = '' 
}: SecureDocumentViewerProps) {
  const { user } = useAuth();
  const [document, setDocument] = useState<SecureDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!user) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let doc: SecureDocument | null = null;
        
        if (collection === 'founder_documents') {
          doc = await SecureDocumentService.getFounderDocument(documentId);
        } else {
          doc = await SecureDocumentService.getPlatformAdminDocument(documentId);
        }

        if (!doc) {
          setError('Document not found or access denied');
        } else {
          setDocument(doc);
        }
      } catch (err: any) {
        console.error('Error fetching secure document:', err);
        setError(err.message || 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, collection, user]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getConfidentialityColor = (level?: string) => {
    switch (level) {
      case 'founder':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'platform_admin':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'internal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading secure document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Access Denied</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Document Not Found</h3>
            <p className="text-sm text-muted-foreground">
              The requested document could not be found or you don't have permission to view it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Document Header */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                <CardTitle className="text-2xl">{document.title}</CardTitle>
              </div>
              
              {document.metadata?.description && (
                <p className="text-muted-foreground">{document.metadata.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={getConfidentialityColor(document.metadata?.confidentialityLevel)}>
                {document.metadata?.confidentialityLevel?.toUpperCase() || 'CONFIDENTIAL'}
              </Badge>
              <Badge variant="outline">
                v{document.version}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Document Metadata */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">{formatDate(document.updatedAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Author</p>
                <p className="text-muted-foreground">
                  {document.metadata?.author || 'SHELTR Team'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Category</p>
                <p className="text-muted-foreground">{document.category}</p>
              </div>
            </div>
          </div>
          
          {document.tags && document.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Tags:</span>
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Warning */}
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                Confidential Document
              </p>
              <p className="text-amber-700 dark:text-amber-300 mt-1">
                This document contains sensitive information. Do not share, copy, or distribute 
                without explicit authorization. Access is logged for security purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Content */}
      <Card>
        <CardContent className="p-6">
          {document.type === 'markdown' ? (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom link handling for security
                  a: ({ href, children, ...props }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  // Custom code block styling
                  code: ({ children, className, ...props }) => (
                    <code 
                      className={`${className} bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm`}
                      {...props}
                    >
                      {children}
                    </code>
                  ),
                  // Custom pre block styling
                  pre: ({ children, ...props }) => (
                    <pre 
                      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"
                      {...props}
                    >
                      {children}
                    </pre>
                  )
                }}
              >
                {document.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-wrap font-mono text-sm">
              {document.content}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Document ID: <code className="bg-muted px-1 py-0.5 rounded">{document.id}</code>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View History
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
