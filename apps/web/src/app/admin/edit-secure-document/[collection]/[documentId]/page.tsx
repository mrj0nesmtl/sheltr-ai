'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SecureDocumentService, SecureDocument } from '@/services/secureDocumentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Home, 
  ChevronRight, 
  FileText,
  Clock,
  AlertTriangle,
  Loader2,
  Lock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export default function EditSecureDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const collection = params.collection as 'founder_documents' | 'platform_admin_documents';
  const documentId = params.documentId as string;

  const [document, setDocument] = useState<SecureDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

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
          setTitle(doc.title);
          setContent(doc.content);
          setDescription(doc.metadata?.description || '');
          setCategory(doc.category);
          setTags(doc.tags?.join(', ') || '');
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

  const handleAutoSave = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      handleSave(true);
    }, 30000); // Auto-save after 30 seconds of inactivity

    setAutoSaveTimer(timer);
    setSaveStatus('unsaved');
  };

  const handleContentChange = (value: string = '') => {
    setContent(value);
    handleAutoSave();
  };

  const handleSave = async (isAutoSave = false) => {
    if (!document || !canEdit()) return;

    try {
      setSaving(true);
      setSaveStatus('saving');

      const updatedDocument = {
        title,
        content,
        metadata: {
          ...document.metadata,
          description,
        },
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      };

      if (collection === 'founder_documents') {
        await SecureDocumentService.updateFounderDocument(documentId, updatedDocument, user.uid);
      } else {
        await SecureDocumentService.updatePlatformAdminDocument(documentId, updatedDocument, user.uid);
      }

      setSaveStatus('saved');
      setLastSaved(new Date());
      
      if (!isAutoSave) {
        // Show success message for manual saves
        console.log('Document saved successfully');
      }
    } catch (err: any) {
      console.error('Error saving document:', err);
      setSaveStatus('error');
      setError(err.message || 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    const viewerUrl = `/secure-docs/business-plan`; // You can make this dynamic based on document type
    router.push(viewerUrl);
  };

  const handlePreview = () => {
    const viewerUrl = `/secure-docs/business-plan`; // You can make this dynamic based on document type
    window.open(viewerUrl, '_blank');
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
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleBack}
        className="hover:bg-muted px-2 py-1 h-auto"
      >
        {document?.title || 'Document'}
      </Button>
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-foreground">Edit</span>
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
        Back to Document
      </Button>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={handlePreview}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button 
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? 'Saving...' : 'Save Document'}
        </Button>
      </div>
    </div>
  );

  const SaveStatusIndicator = () => (
    <div className="flex items-center gap-2 text-sm">
      {saveStatus === 'saved' && (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-green-600">
            Saved {lastSaved ? `at ${lastSaved.toLocaleTimeString()}` : ''}
          </span>
        </>
      )}
      {saveStatus === 'saving' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-blue-600">Saving...</span>
        </>
      )}
      {saveStatus === 'unsaved' && (
        <>
          <Clock className="h-4 w-4 text-amber-600" />
          <span className="text-amber-600">Unsaved changes</span>
        </>
      )}
      {saveStatus === 'error' && (
        <>
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-600">Save failed</span>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading document for editing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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

  if (!document || !canEdit()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Edit Permission Required</h3>
            <p className="text-sm text-muted-foreground">
              You don't have permission to edit this document.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Navigation */}
      <BreadcrumbNavigation />
      <TopNavigation />

      {/* Editor Header */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  Editing: {document.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    FOUNDER
                  </Badge>
                  <Badge variant="outline" className="border-blue-200">
                    v{document.version}
                  </Badge>
                  <SaveStatusIndicator />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Document Metadata Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Document Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  handleAutoSave();
                }}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  handleAutoSave();
                }}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                handleAutoSave();
              }}
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => {
                setTags(e.target.value);
                handleAutoSave();
              }}
              placeholder="business-plan, vc-ready, confidential"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Markdown Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Document Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[600px]">
            <MDEditor
              value={content}
              onChange={handleContentChange}
              preview="edit"
              height={600}
              data-color-mode="auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-red-800 dark:text-red-200">
            <Lock className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Secure Document Editing</p>
              <p className="text-red-700 dark:text-red-300">
                You are editing a confidential document. All changes are tracked and logged. 
                Auto-save is enabled every 30 seconds. Please ensure you save before closing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
