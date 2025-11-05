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
  XCircle,
  BookOpen,
  Globe,
  Lock
} from 'lucide-react';
import { knowledgeDashboardService, KnowledgeDocument } from '@/services/knowledgeDashboardService';
import { docsHubService } from '@/services/docsHubService';
import { securePublishingService } from '@/services/securePublishingService';
import { useAuth } from '@/contexts/AuthContext';
import { ChangeTracker, useChangeTracker } from '@/components/knowledge/ChangeTracker';
import { 
  PermissionManager, 
  type PermissionSettings, 
  type PermissionLevel, 
  PermissionBadge, 
  DocsHubPublisher, 
  type DocsHubSettings,
  SecureDocumentPublisher,
  type SecurePublishingSettings
} from '@/components/knowledge';

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
    confidentiality_level: 'public' as 'public' | 'internal' | 'confidential' | 'restricted',
    permission_level: 'public' as PermissionLevel,
    is_private: false
  });

  // Permission settings state
  const [permissionSettings, setPermissionSettings] = useState<PermissionSettings>({
    permission_level: 'public',
    is_private: false,
    visibility_scope: 'global'
  });

  // Docs Hub settings state
  const [docsHubSettings, setDocsHubSettings] = useState<DocsHubSettings>({
    published_to_hub: false,
    hub_category: 'core',
    hub_badge: 'Technical',
    hub_order: 999,
    hub_slug: '',
    hub_description: undefined,
    hub_audience: undefined,
    hub_topics: undefined,
    hub_icon: undefined,
    external_link: undefined,
    use_external_link: false
  });

  // Secure Publishing settings state
  const [securePublishingSettings, setSecurePublishingSettings] = useState<SecurePublishingSettings>({
    published_to_founders: false,
    published_to_ir: false,
    secure_slug: '',
    secure_badge: 'Confidential',
    secure_badge_color: 'blue',
    secure_icon: 'shield',
    founders_description: '',
    ir_description: '',
    source_directory: '',
    local_file_path: ''
  });

  useEffect(() => {
    if (!documentId) {
      setError('Document ID is required. Please navigate from the knowledge base dashboard.');
      setLoading(false);
      return;
    }
    
    loadDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        status: doc.status || 'active',
        sharing_level: doc.sharing_level || 'public',
        shared_with: doc.shared_with || [],
        access_roles: doc.access_roles || [],
        is_live: doc.is_live || false,
        confidentiality_level: doc.confidentiality_level || 'public',
        permission_level: (doc.permission_level as PermissionLevel) || 'public',
        is_private: doc.is_private || false
      };
      
      // Update permission settings
      setPermissionSettings({
        permission_level: (doc.permission_level as PermissionLevel) || 'public',
        is_private: doc.is_private || false,
        visibility_scope: doc.visibility_scope || 'global',
        synced_from_github: doc.synced_from_github,
        github_path: doc.github_path
      });

      // Update docs hub settings
      setDocsHubSettings({
        published_to_hub: doc.published_to_hub || false,
        hub_category: doc.hub_category || 'core',
        hub_badge: doc.hub_badge || 'Technical',
        hub_order: doc.hub_order || 999,
        hub_slug: doc.hub_slug || '',
        hub_description: doc.hub_description,
        hub_audience: Array.isArray(doc.hub_audience) ? doc.hub_audience : undefined,
        hub_topics: Array.isArray(doc.hub_topics) ? doc.hub_topics : undefined,
        hub_icon: doc.hub_icon,
        external_link: doc.external_link,
        use_external_link: doc.use_external_link || false
      });

      // Update secure publishing settings
      setSecurePublishingSettings({
        published_to_founders: doc.published_to_founders || false,
        published_to_ir: doc.published_to_ir || false,
        secure_slug: doc.secure_slug || securePublishingService.generateSlug(doc.title),
        secure_badge: doc.secure_badge || 'Confidential',
        secure_badge_color: doc.secure_badge_color || 'blue',
        secure_icon: doc.secure_icon || 'shield',
        founders_description: doc.founders_description || '',
        ir_description: doc.ir_description || '',
        source_directory: doc.source_directory || '',
        local_file_path: doc.local_file_path || ''
      });
      
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

      // Merge formData with permissionSettings to save everything together
      const dataToSave = {
        ...formData,
        ...permissionSettings  // Include permission fields!
      };

      await knowledgeDashboardService.updateKnowledgeDocument(documentId, dataToSave);

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

          await trackChange(changeType, changes.map(field => ({ field, old_value: null, new_value: null })));
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
              <div className="space-y-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                
                {/* Document Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Badge */}
                  <Badge variant="outline" className="border-blue-400 text-blue-600 dark:text-blue-400">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {formData.category || 'No Category'}
                  </Badge>
                  
                  {/* Status Badge */}
                  <Badge className={
                    formData.status === 'active' ? 'bg-green-600' :
                    formData.status === 'draft' ? 'bg-yellow-600' :
                    formData.status === 'archived' ? 'bg-gray-600' :
                    'bg-orange-600'
                  }>
                    {formData.status === 'active' && '✅'}
                    {formData.status === 'draft' && '📝'}
                    {formData.status === 'archived' && '📦'}
                    {formData.status === 'processing' && '⏳'}
                    {' '}
                    {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                  </Badge>
                  
                  {/* Permission Badge */}
                  <PermissionBadge 
                    permission={permissionSettings.permission_level as PermissionLevel}
                    size="sm"
                  />
                  
                  {/* Private Indicator */}
                  {permissionSettings.is_private && (
                    <Badge variant="outline" className="border-red-500 text-red-600 dark:text-red-400">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                  
                  {/* GitHub Sync Indicator */}
                  {permissionSettings.synced_from_github && (
                    <Badge variant="outline" className="border-purple-500 text-purple-600 dark:text-purple-400">
                      <Globe className="h-3 w-3 mr-1" />
                      GitHub
                    </Badge>
                  )}
                </div>
              </div>
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
                      <SelectValue placeholder="Select category">
                        {formData.category && (
                          <span className="flex items-center gap-2">
                            {formData.category === 'Platform' && '📋'}
                            {formData.category === 'Architecture' && '🏗️'}
                            {formData.category === 'API' && '🔌'}
                            {formData.category === 'Features' && '✨'}
                            {formData.category === 'Development' && '📱'}
                            {formData.category === 'Deployment' && '🚀'}
                            {formData.category === 'Operations' && '⚙️'}
                            {formData.category === 'User Guides' && '👥'}
                            {formData.category === 'Guides' && '📖'}
                            {formData.category === 'Reference' && '📚'}
                            {formData.category === 'Integrations' && '🔗'}
                            {formData.category === 'Products' && '🌐'}
                            {formData.category === 'Resources' && '🎯'}
                            {formData.category === 'Archive' && '📦'}
                            {formData.category === 'Documentation' && '📄'}
                            {' '}{formData.category}
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Platform">📋 Platform</SelectItem>
                      <SelectItem value="Architecture">🏗️ Architecture</SelectItem>
                      <SelectItem value="API">🔌 API</SelectItem>
                      <SelectItem value="Features">✨ Features</SelectItem>
                      <SelectItem value="Development">📱 Development</SelectItem>
                      <SelectItem value="Deployment">🚀 Deployment</SelectItem>
                      <SelectItem value="Operations">⚙️ Operations</SelectItem>
                      <SelectItem value="User Guides">👥 User Guides</SelectItem>
                      <SelectItem value="Guides">📖 Guides</SelectItem>
                      <SelectItem value="Reference">📚 Reference</SelectItem>
                      <SelectItem value="Integrations">🔗 Integrations</SelectItem>
                      <SelectItem value="Products">🌐 Products</SelectItem>
                      <SelectItem value="Resources">🎯 Resources</SelectItem>
                      <SelectItem value="Archive">📦 Archive</SelectItem>
                      <SelectItem value="Documentation">📄 Documentation</SelectItem>
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

          {/* Permission Manager - MOVED TO TOP! */}
          <div id="permissions-section">
            <PermissionManager
              documentId={documentId || undefined}
              currentSettings={permissionSettings}
              onSave={async (settings) => {
                setPermissionSettings(settings);
                setFormData({
                  ...formData,
                  permission_level: settings.permission_level,
                  is_private: settings.is_private
                });
                
                // Save to backend immediately
                if (documentId) {
                  await knowledgeDashboardService.updateKnowledgeDocument(documentId, {
                    permission_level: settings.permission_level,
                    is_private: settings.is_private,
                    visibility_scope: settings.visibility_scope
                  });
                  
                  // Track the change
                  await trackChange('sharing', [
                    { field: 'permission_level', old_value: null, new_value: settings.permission_level },
                    { field: 'is_private', old_value: null, new_value: settings.is_private }
                  ]);
                }
              }}
              showGitHubInfo={permissionSettings.synced_from_github}
              isLoading={loading || saving}
            />
          </div>

          {/* Docs Hub Publisher - NEW FEATURE! */}
          <DocsHubPublisher
            documentId={documentId || undefined}
            documentTitle={formData.title}
            currentSettings={docsHubSettings}
            permissionLevel={permissionSettings.permission_level}
            onSave={async (settings) => {
              try {
                // Save via API
                if (documentId) {
                  await docsHubService.publishDocument(documentId, settings);
                  
                  // Update local state
                  setDocsHubSettings(settings);
                  
                  // Track the change
                  await trackChange('publishing', [
                    { field: 'published_to_hub', old_value: null, new_value: settings.published_to_hub }
                  ]);
                }
              } catch (error) {
                console.error('Failed to publish document:', error);
                throw error;
              }
            }}
            isLoading={loading || saving}
          />

          {/* Secure Document Publisher - For Founders Portal & Investor Relations */}
          {/* Note: Always show this panel regardless of permission level (v2.88.0) */}
          {/* Public documents can now be published to secure portals - portals have their own auth */}
          <SecureDocumentPublisher
            documentId={documentId || ''}
            documentTitle={formData.title}
            initialSettings={securePublishingSettings}
            onSave={async (settings) => {
              try {
                // Update local state
                setSecurePublishingSettings(settings);
                
                // Save to backend (the component handles the publishing API calls)
                if (documentId) {
                  await knowledgeDashboardService.updateKnowledgeDocument(documentId, {
                    published_to_founders: settings.published_to_founders,
                    published_to_ir: settings.published_to_ir,
                    secure_slug: settings.secure_slug,
                    secure_badge: settings.secure_badge,
                    secure_badge_color: settings.secure_badge_color,
                    secure_icon: settings.secure_icon,
                    founders_description: settings.founders_description,
                    ir_description: settings.ir_description,
                    source_directory: settings.source_directory,
                    local_file_path: settings.local_file_path
                  });
                  
                  // Track the change
                  await trackChange('publishing', [
                    { field: 'published_to_founders', old_value: null, new_value: settings.published_to_founders },
                    { field: 'published_to_ir', old_value: null, new_value: settings.published_to_ir }
                  ]);
                }
              } catch (error) {
                console.error('Failed to save secure publishing settings:', error);
                throw error;
              }
            }}
          />

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

          {/* Permission Warning & Actions - BOTTOM */}
          <Card className="border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Security Check Required
                    </h3>
                    <p className="text-amber-800 dark:text-amber-200 mt-2">
                      Before saving, please verify your document permissions are correct. 
                      This controls who can access and view this document.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-amber-800">
                    <span className="text-sm font-medium">Current Permission:</span>
                    <Badge className={
                      permissionSettings.permission_level === 'public' ? 'bg-green-600' :
                      permissionSettings.permission_level === 'founders' ? 'bg-amber-600' :
                      permissionSettings.permission_level === 'super_admin' ? 'bg-gray-600' :
                      'bg-blue-600'
                    }>
                      {permissionSettings.permission_level === 'public' && '🌐 Public'}
                      {permissionSettings.permission_level === 'authenticated' && '👥 Authenticated'}
                      {permissionSettings.permission_level === 'donor' && '❤️ Donors'}
                      {permissionSettings.permission_level === 'participant' && '👤 Participants'}
                      {permissionSettings.permission_level === 'shelter_admin' && '🏢 Shelter Admin'}
                      {permissionSettings.permission_level === 'platform_admin' && '🛡️ Platform Admin'}
                      {permissionSettings.permission_level === 'founders' && '👑 Founders'}
                      {permissionSettings.permission_level === 'super_admin' && '🔒 Super Admin'}
                    </Badge>
                    {permissionSettings.is_private && (
                      <Badge variant="outline" className="border-red-500 text-red-600">
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const permissionsSection = window.document.getElementById('permissions-section');
                          permissionsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="flex items-center gap-2 border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/40"
                    >
                      <Shield className="h-4 w-4" />
                      Review Permissions
                    </Button>
                    
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save & Regenerate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
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

          {/* Change Tracker */}
          <ChangeTracker 
            documentId={documentId || ''}
            documentTitle={document?.title || 'Unknown Document'}
            documentPath={document?.file_path}
          />
        </div>
      </div>
    </div>
  );
}
