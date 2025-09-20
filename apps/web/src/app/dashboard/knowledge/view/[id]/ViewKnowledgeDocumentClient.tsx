'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  BookOpen,
  Globe,
  Lock,
  Users,
  Shield,
  Brain
} from 'lucide-react';
import { knowledgeDashboardService, KnowledgeDocument } from '@/services/knowledgeDashboardService';
import { useAuth } from '@/contexts/AuthContext';
import { ChangeTracker } from '@/components/knowledge/ChangeTracker';

export default function ViewKnowledgeDocumentClient() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const documentId = params.id as string;

  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocument();
  }, [documentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Handle placeholder route from static generation
      if (documentId === 'placeholder') {
        setError('Please select a document from the Knowledge Base to view.');
        return;
      }
      
      const response = await knowledgeDashboardService.getKnowledgeDocument(documentId);
      const doc = response.data;
      
      setDocument(doc);
    } catch (error: any) {
      console.error('Error loading document:', error);
      
      // Handle different types of errors
      if (error?.message?.includes('404') || error?.message?.includes('not found')) {
        setError(`Document with ID "${documentId}" was not found. It may have been deleted or you may not have permission to access it.`);
      } else if (error?.message?.includes('403') || error?.message?.includes('unauthorized')) {
        setError('You do not have permission to view this document.');
      } else {
        setError('Failed to load document. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getQualityScore = (doc: KnowledgeDocument) => {
    let score = 0;
    if (doc.chunk_count > 0) score += 30;
    if (doc.word_count > 100) score += 20;
    if (doc.embedding_status === 'completed') score += 30;
    if (doc.status === 'active') score += 10;
    if (doc.tags && doc.tags.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSharingBadge = (doc: KnowledgeDocument) => {
    const sharingLevel = doc.sharing_level || doc.access_level || 'public';
    switch (sharingLevel) {
      case 'super_admin_only':
        return { color: 'bg-red-500', text: 'Super Admin Only', icon: Lock };
      case 'shelter_specific':
        return { color: 'bg-blue-500', text: 'Shelter Specific', icon: Users };
      case 'role_based':
        return { color: 'bg-purple-500', text: 'Role Based', icon: Shield };
      default:
        return { color: 'bg-green-500', text: 'Public', icon: Globe };
    }
  };

  const getConfidentialityBadge = (level?: string) => {
    const confidentialityLevel = level || 'public';
    switch (confidentialityLevel) {
      case 'restricted':
        return { color: 'bg-red-100 text-red-800', text: 'Restricted', icon: Lock };
      case 'confidential':
        return { color: 'bg-orange-100 text-orange-800', text: 'Confidential', icon: Shield };
      case 'internal':
        return { color: 'bg-blue-100 text-blue-800', text: 'Internal', icon: Users };
      default:
        return { color: 'bg-green-100 text-green-800', text: 'Public', icon: Globe };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg">Loading document...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/knowledge')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Document Not Found</h1>
                <p className="text-muted-foreground">Unable to load the requested document</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Document Not Available</h2>
              <p className="text-muted-foreground mb-4 max-w-md">
                {error || 'The requested document could not be loaded.'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.push('/dashboard/knowledge')} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Knowledge Base
                </Button>
                <Button onClick={loadDocument} variant="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const qualityScore = getQualityScore(document);
  const QualityIcon = qualityScore >= 80 ? CheckCircle : qualityScore >= 60 ? AlertTriangle : XCircle;
  const qualityBadge = qualityScore >= 80 
    ? { color: 'bg-green-500', text: 'Excellent' }
    : qualityScore >= 60 
    ? { color: 'bg-yellow-500', text: 'Good' }
    : { color: 'bg-red-500', text: 'Needs Work' };

  const sharingBadge = getSharingBadge(document);
  const confidentialityBadge = getConfidentialityBadge(document.confidentiality_level);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
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
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => router.push(`/dashboard/knowledge/edit/${documentId}`)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Document
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Document Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Document Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Document Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">File Path</label>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono break-all">
                    {document.file_path || 'N/A'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">
                      {document.file_size ? formatFileSize(document.file_size) : '0 KB'}
                    </div>
                    <div className="text-xs text-muted-foreground">Size</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">
                      {document.word_count || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Words</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="font-bold text-lg text-purple-600">
                      {document.chunk_count || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Chunks</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="font-bold text-lg text-green-600">
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
                  <Target className="h-5 w-5 text-green-600" />
                  Quality Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <QualityIcon className="h-6 w-6" />
                    <span className="text-2xl font-bold">{qualityScore}/100</span>
                  </div>
                  <Badge className={`${qualityBadge.color} text-white`}>
                    {qualityBadge.text}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${qualityBadge.color}`}
                    style={{ width: `${qualityScore}%` }}
                  />
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
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Publishing Status</label>
                  <div className="mt-1">
                    <Badge variant={document.is_live ? "default" : "secondary"} className={document.is_live ? "bg-green-500" : ""}>
                      <Brain className="h-3 w-3 mr-1" />
                      {document.is_live ? "🟢 Published" : "🔴 Draft"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Access Level</label>
                  <div className="mt-1">
                    <Badge className={`${sharingBadge.color} text-white`}>
                      <sharingBadge.icon className="h-3 w-3 mr-1" />
                      {sharingBadge.text}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Confidentiality</label>
                  <div className="mt-1">
                    <Badge className={confidentialityBadge.color}>
                      <confidentialityBadge.icon className="h-3 w-3 mr-1" />
                      {confidentialityBadge.text}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Created</span>
                  <p className="text-xs mt-1">
                    {document.created_at ? new Date(document.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Last Updated</span>
                  <p className="text-xs mt-1">
                    {document.updated_at ? new Date(document.updated_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Created By</span>
                  <p className="text-xs mt-1">
                    {document.created_by || 'System'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Change Tracking */}
            <ChangeTracker
              documentId={documentId}
              documentTitle={document?.title || 'Unknown Document'}
              documentPath={document?.file_path}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Document Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Details</CardTitle>
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
                        {document.status === 'draft' && '📝 Draft'}
                        {document.status === 'archived' && '📦 Archived'}
                        {document.status === 'processing' && '⏳ Processing'}
                        {!['active', 'draft', 'archived', 'processing'].includes(document.status) && document.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {document.tags && document.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {document.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
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
                <CardTitle className="text-lg">Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                    {document.content || 'No content available.'}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
