'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Download,
  ArrowLeft,
  Edit,
  Home,
  ChevronRight,
  Clock,
  UserCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SecureDocumentViewerProps {
  documentId: string;
  collection: 'founder_documents' | 'platform_admin_documents';
  className?: string;
  showNavigation?: boolean;
  onEdit?: () => void;
}

export default function SecureDocumentViewer({ 
  documentId, 
  collection, 
  className = '',
  showNavigation = true,
  onEdit
}: SecureDocumentViewerProps) {
  const { user } = useAuth();
  const router = useRouter();
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

  const canEdit = () => {
    if (!user?.email) return false;
    
    // Check if user is authorized founder
    const authorizedEmails = [
      'joel.yaffe@gmail.com',
      'alexanderkline13@gmail.com', 
      'alaghetts@gmail.com',
      'doug.kukura@gmail.com',
      'morganhirtle@gmail.com'
    ];
    
    return authorizedEmails.includes(user.email) || user.role === 'super_admin';
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      // Default edit navigation
      router.push(`/admin/edit-secure-document/${collection}/${documentId}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const BreadcrumbNavigation = () => (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.push('/')}
        className="hover:bg-muted p-1 h-auto"
      >
        <Home className="h-4 w-4" />
      </Button>
      <ChevronRight className="h-4 w-4" />
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.push('/portal')}
        className="hover:bg-muted px-2 py-1 h-auto"
      >
        Portal
      </Button>
      <ChevronRight className="h-4 w-4" />
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.push('/portal/founders-only')}
        className="hover:bg-muted px-2 py-1 h-auto"
      >
        Founders Only
      </Button>
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-foreground">
        {document?.title || 'Document'}
      </span>
    </div>
  );

  const TopNavigation = () => (
    <div className="flex items-center justify-between mb-6">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      {canEdit() && (
        <Button 
          onClick={handleEdit}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Edit className="h-4 w-4" />
          Edit Document
        </Button>
      )}
    </div>
  );

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
    <div className={`max-w-6xl mx-auto space-y-6 ${className}`}>
      {/* Navigation */}
      {showNavigation && (
        <>
          <BreadcrumbNavigation />
          <TopNavigation />
        </>
      )}

      {/* Enhanced Document Header */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {document.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      FOUNDER
                    </Badge>
                    <Badge variant="outline" className="border-blue-200">
                      v{document.version}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {document.metadata?.description && (
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {document.metadata.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={`${getConfidentialityColor(document.metadata?.confidentialityLevel)} text-sm px-3 py-1`}>
                {document.metadata?.confidentialityLevel?.toUpperCase() || 'CONFIDENTIAL'}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Document Metadata */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Document Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Last Updated</p>
                <p className="text-sm text-muted-foreground">{formatDate(document.updatedAt)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Last Edited By</p>
                <p className="text-sm text-muted-foreground">
                  {document.createdBy || document.metadata?.author || 'SHELTR Founding Team'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Original Author</p>
                <p className="text-sm text-muted-foreground">
                  {document.metadata?.author || 'SHELTR Founding Team'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Tag className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Category</p>
                <p className="text-sm text-muted-foreground">{document.category}</p>
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

      {/* Enhanced Document Content */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Document Content
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {document.type?.toUpperCase() || 'MARKDOWN'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {document.content.length.toLocaleString()} characters
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {document.type === 'markdown' ? (
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Enhanced heading styling
                  h1: ({ children, ...props }) => (
                    <h1 className="text-4xl font-bold mb-6 pb-3 border-b-2 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100" {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-3xl font-semibold mb-4 mt-8 text-blue-800 dark:text-blue-200" {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-2xl font-semibold mb-3 mt-6 text-blue-700 dark:text-blue-300" {...props}>
                      {children}
                    </h3>
                  ),
                  h4: ({ children, ...props }) => (
                    <h4 className="text-xl font-semibold mb-2 mt-4 text-blue-600 dark:text-blue-400" {...props}>
                      {children}
                    </h4>
                  ),
                  // Enhanced paragraph styling
                  p: ({ children, ...props }) => (
                    <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
                      {children}
                    </p>
                  ),
                  // Enhanced list styling
                  ul: ({ children, ...props }) => (
                    <ul className="mb-4 space-y-2 list-disc pl-6" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="mb-4 space-y-2 list-decimal pl-6" {...props}>
                      {children}
                    </ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li className="text-gray-700 dark:text-gray-300" {...props}>
                      {children}
                    </li>
                  ),
                  // Enhanced link styling
                  a: ({ href, children, ...props }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline decoration-2 underline-offset-2 hover:decoration-4 transition-all"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  // Enhanced code styling
                  code: ({ children, className, ...props }) => (
                    <code 
                      className={`${className} bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-sm font-mono border border-blue-200 dark:border-blue-800`}
                      {...props}
                    >
                      {children}
                    </code>
                  ),
                  // Enhanced pre block styling
                  pre: ({ children, ...props }) => (
                    <pre 
                      className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-700 shadow-lg"
                      {...props}
                    >
                      {children}
                    </pre>
                  ),
                  // Enhanced blockquote styling
                  blockquote: ({ children, ...props }) => (
                    <blockquote 
                      className="border-l-4 border-blue-500 pl-6 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-blue-800 dark:text-blue-200"
                      {...props}
                    >
                      {children}
                    </blockquote>
                  ),
                  // Enhanced table styling
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg" {...props}>
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children, ...props }) => (
                    <th className="bg-blue-50 dark:bg-blue-900/30 border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-blue-900 dark:text-blue-100" {...props}>
                      {children}
                    </th>
                  ),
                  td: ({ children, ...props }) => (
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300" {...props}>
                      {children}
                    </td>
                  )
                }}
              >
                {document.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
              {document.content}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Document Actions */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Document ID:</span>{' '}
                <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                  {document.id}
                </code>
              </div>
              <div className="text-xs text-muted-foreground">
                Created: {formatDate(document.createdAt)} • 
                Version: {document.version} • 
                Type: {document.type?.toUpperCase() || 'MARKDOWN'}
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {canEdit() && (
                <Button 
                  onClick={handleEdit}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Document
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Version History
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Security Notice */}
      <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-red-800 dark:text-red-200">
            <Lock className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Confidential Document Access</p>
              <p className="text-red-700 dark:text-red-300">
                This document is confidential and protected. Your access has been logged. 
                Please ensure you log out after viewing and do not share this content without authorization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
