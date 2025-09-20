'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Brain,
  Sparkles
} from 'lucide-react';
import { knowledgeDashboardService, KnowledgeDocument } from '@/services/knowledgeDashboardService';
import { useAuth } from '@/contexts/AuthContext';
import { ChangeTracker, useChangeTracker } from '@/components/knowledge/ChangeTracker';

export default function EditKnowledgeDocument() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const documentId = params.id as string;

  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalFormData, setOriginalFormData] = useState<typeof formData | null>(null);

  // Change tracking
  const { trackChange } = useChangeTracker(
    documentId,
    document?.title || 'Unknown Document',
    document?.file_path
  );

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    status: 'active' as 'active' | 'draft' | 'archived' | 'processing',
    sharing_level: 'public' as 'public' | 'shelter_specific' | 'super_admin_only' | 'role_based',
    shared_with: [] as string[],
    access_roles: [] as string[],
    is_live: false,
    confidentiality_level: 'public' as 'public' | 'internal' | 'confidential' | 'restricted'
  });

  useEffect(() => {
    loadDocument();
  }, [documentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDocument = async () => {
    try {
      setLoading(true);
      const response = await knowledgeDashboardService.getKnowledgeDocument(documentId);
      const doc = response.data;
      
      setDocument(doc);
      const initialFormData = {
        title: doc.title,
        content: doc.content,
        category: doc.category,
        tags: doc.tags || [],
        status: doc.status,
        sharing_level: doc.sharing_level || 'public',
        shared_with: doc.shared_with || [],
        access_roles: doc.access_roles || [],
        is_live: doc.is_live || false,
        confidentiality_level: doc.confidentiality_level || 'public'
      };
      setFormData(initialFormData);
      setOriginalFormData(initialFormData);
    } catch (error) {
      console.error('Error loading document:', error);
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Track changes before saving
      if (originalFormData && user) {
        const changes: { field: string; old_value: unknown; new_value: unknown }[] = [];
        
        // Compare form data with original
        (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => {
          const oldValue = originalFormData[key];
          const newValue = formData[key];
          
          // Handle array comparison
          if (Array.isArray(oldValue) && Array.isArray(newValue)) {
            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
              changes.push({ field: String(key), old_value: oldValue, new_value: newValue });
            }
          } else if (oldValue !== newValue) {
            changes.push({ field: String(key), old_value: oldValue, new_value: newValue });
          }
        });

        // Track changes if any exist
        if (changes.length > 0) {
          // Determine change type
          const contentFields = ['title', 'content', 'category'];
          const publishingFields = ['is_live', 'status'];
          const sharingFields = ['sharing_level', 'shared_with', 'access_roles', 'confidentiality_level'];
          
          let changeType: 'content' | 'metadata' | 'publishing' | 'sharing' = 'metadata';
          
          if (changes.some(c => contentFields.includes(c.field))) {
            changeType = 'content';
          } else if (changes.some(c => publishingFields.includes(c.field))) {
            changeType = 'publishing';
          } else if (changes.some(c => sharingFields.includes(c.field))) {
            changeType = 'sharing';
          }

          await trackChange(changeType, changes);
        }
      }
      
      await knowledgeDashboardService.updateKnowledgeDocument(documentId, formData);
      
      // Update original form data to new values
      setOriginalFormData({ ...formData });
      
      // Show success and redirect back
      router.push('/dashboard/knowledge');
    } catch (error) {
      console.error('Error saving document:', error);
      setError('Failed to save document');
    } finally {
      setSaving(false);
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

  const getQualityBadge = (score: number) => {
    if (score >= 90) return { color: 'bg-green-500', text: 'Excellent', icon: Sparkles };
    if (score >= 70) return { color: 'bg-blue-500', text: 'Good', icon: CheckCircle };
    if (score >= 50) return { color: 'bg-yellow-500', text: 'Fair', icon: AlertTriangle };
    return { color: 'bg-red-500', text: 'Poor', icon: XCircle };
  };

  const getEmbeddingStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <XCircle className="h-4 w-4 text-red-500" />;
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-2xl font-semibold mb-4">Error Loading Document</h3>
          <p className="text-muted-foreground mb-8">{error || 'Document not found'}</p>
          <Button onClick={() => router.push('/dashboard/knowledge')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </div>
      </div>
    );
  }

  const qualityScore = getQualityScore(document);
  const qualityBadge = getQualityBadge(qualityScore);
  const QualityIcon = qualityBadge.icon;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/knowledge')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Knowledge Base
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Edit Document
            </h1>
            <p className="text-muted-foreground">Make changes to your knowledge document</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={document.embedding_status === 'completed' ? 'default' : 'secondary'}>
            {getEmbeddingStatusIcon(document.embedding_status)}
            <span className="ml-1">{document.embedding_status}</span>
          </Badge>
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save & Regenerate'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <XCircle className="h-4 w-4" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

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
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter document title"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Platform">📋 Platform</SelectItem>
                      <SelectItem value="Architecture">🏗️ Architecture</SelectItem>
                      <SelectItem value="API">🔌 API</SelectItem>
                      <SelectItem value="Development">💻 Development</SelectItem>
                      <SelectItem value="Deployment">🚀 Deployment</SelectItem>
                      <SelectItem value="User Guides">👥 User Guides</SelectItem>
                      <SelectItem value="Reference">📚 Reference</SelectItem>
                      <SelectItem value="Integrations">🔗 Integrations</SelectItem>
                      <SelectItem value="Migration">📦 Migration</SelectItem>
                      <SelectItem value="Resources">🎯 Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'draft' | 'archived' | 'processing') => setFormData({...formData, status: value})}>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.status === 'active' && "✅ Document is ready for publication"}
                    {formData.status === 'draft' && "📝 Document is in draft mode - not published to AI chatbot"}
                    {formData.status === 'archived' && "📦 Document is archived and not available"}
                    {formData.status === 'processing' && "⏳ Document is being processed"}
                  </p>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Sharing & Publishing Controls
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Control who can access this document and whether it&apos;s available to AI chatbots
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Publishing Status */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">AI Chatbot Access</span>
                  </div>
                  <Badge variant={formData.is_live ? "default" : "secondary"} className={formData.is_live ? "bg-green-500" : ""}>
                    {formData.is_live ? "🟢 Published" : "🔴 Draft"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_live"
                    checked={formData.is_live}
                    onChange={(e) => {
                      const isLive = e.target.checked;
                      setFormData({
                        ...formData, 
                        is_live: isLive,
                        // Auto-sync status: if publishing, set to active; if unpublishing and currently active, set to draft
                        status: isLive ? 'active' : (formData.status === 'active' ? 'draft' : formData.status)
                      });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_live" className="text-sm">
                    <span className="font-medium">Publish to AI Chatbot</span>
                    <p className="text-xs text-muted-foreground">
                      {formData.is_live 
                        ? "✅ This document is available to AI chatbots and can be referenced in responses"
                        : "❌ This document is in draft mode and not available to AI chatbots"
                      }
                    </p>
                  </label>
                </div>
              </div>

              {/* Access Level Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Access Level
                  </label>
                  <Select 
                    value={formData.sharing_level} 
                    onValueChange={(value: 'public' | 'super_admin_only' | 'shelter_specific' | 'role_based') => setFormData({...formData, sharing_level: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-green-500" />
                          <span>Public - All Users</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="super_admin_only">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-red-500" />
                          <span>Super Admin Only</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="shelter_specific">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span>Shelter Specific</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="role_based">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-500" />
                          <span>Role Based Access</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.sharing_level === 'public' && "Available to all platform users"}
                    {formData.sharing_level === 'super_admin_only' && "Only Super Admins can access"}
                    {formData.sharing_level === 'shelter_specific' && "Only specified shelters can access"}
                    {formData.sharing_level === 'role_based' && "Access based on user roles"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Confidentiality Level
                  </label>
                  <Select 
                    value={formData.confidentiality_level} 
                    onValueChange={(value: 'public' | 'internal' | 'confidential' | 'restricted') => setFormData({...formData, confidentiality_level: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-green-500" />
                          <span>Public Information</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="internal">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>Internal Use Only</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="confidential">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-orange-500" />
                          <span>Confidential</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="restricted">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Restricted Access</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.confidentiality_level === 'public' && "No confidentiality restrictions"}
                    {formData.confidentiality_level === 'internal' && "Internal platform information"}
                    {formData.confidentiality_level === 'confidential' && "Sensitive information - limited access"}
                    {formData.confidentiality_level === 'restricted' && "Highly restricted - minimal access"}
                  </p>
                </div>
              </div>

              {formData.sharing_level === 'shelter_specific' && (
                <div>
                  <label className="text-sm font-medium">Share with Specific Shelters</label>
                  <Input
                    value={formData.shared_with.join(', ')}
                    onChange={(e) => setFormData({...formData, shared_with: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                    placeholder="Enter shelter IDs separated by commas"
                    className="mt-1"
                  />
                </div>
              )}
              
              {formData.sharing_level === 'role_based' && (
                <div>
                  <label className="text-sm font-medium">Access Roles</label>
                  <Input
                    value={formData.access_roles.join(', ')}
                    onChange={(e) => setFormData({...formData, access_roles: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                    placeholder="Enter roles: super_admin, shelter_admin, participant"
                    className="mt-1"
                  />
                </div>
              )}

              {/* Important Notice */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Important Notice</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                      Saving changes will regenerate embeddings and update the AI chatbot&apos;s knowledge base. This process may take a few minutes to complete.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium">Content *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Enter document content (Markdown supported)"
                  rows={20}
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Supports Markdown formatting. Changes will regenerate embeddings for the AI chatbot.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Important Notice</p>
              <p className="text-yellow-700">
                Saving changes will regenerate embeddings and update the AI chatbot&apos;s knowledge base. 
                This process may take a few minutes to complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
