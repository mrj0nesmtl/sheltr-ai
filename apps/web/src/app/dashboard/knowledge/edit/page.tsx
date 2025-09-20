'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Save,
  RefreshCw,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Globe,
  Lock,
  Users,
  Target,
  Brain
} from 'lucide-react';
import { knowledgeDashboardService, KnowledgeDocument } from '@/services/knowledgeDashboardService';
import { useAuth } from '@/contexts/AuthContext';
import { ChangeTracker, useChangeTracker } from '@/components/knowledge/ChangeTracker';

export default function EditKnowledgeDocumentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  // Get document ID from search params
  const documentId = searchParams.get('id');

  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalFormData, setOriginalFormData] = useState<typeof formData | null>(null);

  // Change tracking
  const { trackChange } = useChangeTracker(
    documentId || '',
    document?.title || 'Unknown Document',
    document?.file_path
  );

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    status: 'active' as 'active' | 'archived' | 'processing' | 'draft',
    sharing_level: 'public' as 'public' | 'super_admin_only' | 'shelter_specific' | 'role_based',
    shared_with: [] as string[],
    access_roles: [] as string[],
    is_live: false,
    confidentiality_level: 'public' as 'public' | 'internal' | 'confidential' | 'restricted'
  });

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
      
      // Update form data
      const newFormData = {
        title: doc.title || '',
        content: doc.content || '',
        category: doc.category || '',
        tags: doc.tags || [],
        status: (doc.status as any) || 'active',
        sharing_level: (doc.sharing_level as any) || 'public',
        shared_with: doc.shared_with || [],
        access_roles: doc.access_roles || [],
        is_live: doc.is_live || false,
        confidentiality_level: (doc.confidentiality_level as any) || 'public'
      };
      
      setFormData(newFormData);
      setOriginalFormData(newFormData);
      
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

  const handleSave = async () => {
    if (!documentId || !user) return;

    try {
      setSaving(true);
      setError(null);

      await knowledgeDashboardService.updateKnowledgeDocument(documentId, formData);

      // Track changes if there are any
      if (originalFormData) {
        const changes: string[] = [];
        
        if (formData.title !== originalFormData.title) changes.push('title');
        if (formData.content !== originalFormData.content) changes.push('content');
        if (formData.category !== originalFormData.category) changes.push('category');
        if (JSON.stringify(formData.tags) !== JSON.stringify(originalFormData.tags)) changes.push('tags');
        if (formData.status !== originalFormData.status) changes.push('status');
        if (formData.sharing_level !== originalFormData.sharing_level) changes.push('sharing_level');
        if (formData.is_live !== originalFormData.is_live) changes.push('is_live');
        if (formData.confidentiality_level !== originalFormData.confidentiality_level) changes.push('confidentiality_level');

        if (changes.length > 0) {
          let changeType: 'content' | 'metadata' | 'publishing' | 'sharing' = 'metadata';
          
          if (changes.includes('content')) changeType = 'content';
          else if (changes.includes('is_live') || changes.includes('status')) changeType = 'publishing';
          else if (changes.includes('sharing_level') || changes.includes('confidentiality_level')) changeType = 'sharing';

          await trackChange(changes, changeType);
        }
      }

      // Update original form data
      setOriginalFormData({ ...formData });
      
      // Reload document to get updated stats
      await loadDocument();
      
    } catch (error) {
      console.error('Error saving document:', error);
      setError('Failed to save document. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          <h1 className="text-2xl font-bold">Edit Document</h1>
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
          <h1 className="text-2xl font-bold">Edit Document</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Document not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold">Edit Document</h1>
            <p className="text-muted-foreground">Make changes to your knowledge document</p>
          </div>
        </div>
        
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? 'Saving...' : 'Save & Regenerate'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Document title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Architecture">Architecture</SelectItem>
                      <SelectItem value="API">API</SelectItem>
                      <SelectItem value="User Guide">User Guide</SelectItem>
                      <SelectItem value="Reference">Reference</SelectItem>
                      <SelectItem value="Integration">Integration</SelectItem>
                      <SelectItem value="Deployment">Deployment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'active' | 'archived' | 'processing' | 'draft') => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">✅ Active</SelectItem>
                      <SelectItem value="draft">📝 Draft</SelectItem>
                      <SelectItem value="archived">📦 Archived</SelectItem>
                      <SelectItem value="processing">⏳ Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tags</label>
                  <Input
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                    placeholder="Enter tags separated by commas"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Enter document content (Markdown supported)"
                className="min-h-[400px] font-mono text-sm"
              />
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

          {/* Change Tracker */}
          <ChangeTracker />
        </div>
      </div>
    </div>
  );
}
