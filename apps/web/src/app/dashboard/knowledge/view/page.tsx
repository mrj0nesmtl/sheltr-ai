'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Edit,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  AlertTriangle,
  Globe,
  Lock,
  Users,
  Shield,
  Brain
} from 'lucide-react';
import { knowledgeDashboardService, KnowledgeDocument } from '@/services/knowledgeDashboardService';

export default function ViewKnowledgeDocumentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get document ID from search params
  const documentId = searchParams.get('id');

  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setError('Document ID is required. Please navigate from the knowledge base dashboard.');
      setLoading(false);
      return;
    }
    
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    if (!documentId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await knowledgeDashboardService.getKnowledgeDocument(documentId);
      const doc = response.data;
      
      setDocument(doc);
    } catch (error: unknown) {
      console.error('Error loading document:', error);
      
      const errorMessage = (error as Error)?.message || '';
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        setError(`Document with ID "${documentId}" was not found. It may have been deleted or you may not have permission to access it.`);
      } else if (errorMessage.includes('403') || errorMessage.includes('unauthorized')) {
        setError('You do not have permission to view this document.');
      } else {
        setError('Failed to load document. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSharingBadge = (doc: KnowledgeDocument) => {
    const sharingLevel = doc.sharing_level || 'public';
    switch (sharingLevel) {
      case 'super_admin_only':
        return { color: 'bg-red-500', text: 'Super Admin Only', icon: Lock };
      case 'shelter_specific':
        return { color: 'bg-blue-500', text: 'Shelter Specific', icon: Users };
      case 'role_based':
        return { color: 'bg-purple-500', text: 'Role Based', icon: Target };
      default:
        return { color: 'bg-green-500', text: 'Public', icon: Globe };
    }
  };

  const getConfidentialityBadge = (level?: string) => {
    const confidentialityLevel = level || 'public';
    switch (confidentialityLevel) {
      case 'internal':
        return { color: 'bg-blue-100 text-blue-800', text: 'Internal', icon: Users };
      case 'confidential':
        return { color: 'bg-orange-100 text-orange-800', text: 'Confidential', icon: Lock };
      case 'restricted':
        return { color: 'bg-red-100 text-red-800', text: 'Restricted', icon: AlertTriangle };
      default:
        return { color: 'bg-green-100 text-green-800', text: 'Public', icon: Globe };
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg">Loading document...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/knowledge')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">View Document</h1>
        </div>
        
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <XCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">Error Loading Document</h3>
                <p className="text-red-700 dark:text-red-200 mt-1">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={loadDocument}
                  className="mt-3"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/knowledge')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">View Document</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Document not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sharingBadge = getSharingBadge(document);
  const confidentialityBadge = getConfidentialityBadge(document.confidentiality_level);
  const SharingIcon = sharingBadge.icon;
  const ConfidentialityIcon = confidentialityBadge.icon;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/knowledge')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <p className="text-muted-foreground">Knowledge Base Document</p>
          </div>
        </div>
        
        <Button 
          onClick={() => router.push(`/dashboard/knowledge/edit?id=${documentId}`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Document
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Document Details */}
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <div className="mt-1">
                    <Badge variant="outline">{document.category}</Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={document.status === 'active' ? 'default' : 'secondary'}>
                      {document.status === 'active' && '✅ Active'}
                      {document.status === 'archived' && '📦 Archived'}
                      {document.status === 'processing' && '⏳ Processing'}
                      {!['active', 'archived', 'processing'].includes(document.status) && `📝 ${document.status}`}
                    </Badge>
                  </div>
                </div>
              </div>

              {document.tags && document.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
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

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg overflow-auto">
                  {document.content || 'No content available.'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">File Path</label>
                <p className="text-sm bg-muted p-2 rounded mt-1 font-mono break-all">
                  {document.file_path || 'No file path'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {formatFileSize(document.file_size || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Size</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {document.word_count || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Words</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-pink-600">
                    {document.chunk_count || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Chunks</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">
                    {document.view_count || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Quality Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  100/100
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  Excellent
                </Badge>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access & Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Access & Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Publishing Status</label>
                <div className="mt-1">
                  <Badge variant={document.is_live ? 'default' : 'secondary'}>
                    {document.is_live ? '🟢 Published' : '🔴 Draft'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Access Level</label>
                <div className="mt-1">
                  <Badge className={`${sharingBadge.color} text-white`}>
                    <SharingIcon className="h-3 w-3 mr-1" />
                    {sharingBadge.text}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Confidentiality</label>
                <div className="mt-1">
                  <Badge className={confidentialityBadge.color}>
                    <ConfidentialityIcon className="h-3 w-3 mr-1" />
                    {confidentialityBadge.text}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
