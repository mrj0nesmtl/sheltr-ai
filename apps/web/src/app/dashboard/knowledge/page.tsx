'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Search, 
  Brain, 
  RefreshCw,
  Database,
  Globe,
  Clock,
  Hash,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  Zap,
  BookOpen,
  Book,
  Briefcase,
  TrendingUp,
  Target,
  FileText as FileTextIcon,
  Copy,
  Maximize2,
  Minimize2,
  Shield,
  Users,
  Lock,
  AlertTriangle,
  Folder,
  Sparkles
} from 'lucide-react';
import { knowledgeDashboardService, KnowledgeDocument, KnowledgeStats } from '@/services/knowledgeDashboardService';

import { FolderTree, buildFolderTree, buildDualRepositoryTree, FolderNode } from '@/components/knowledge/FolderTree';
import { Breadcrumb, buildBreadcrumb } from '@/components/knowledge/Breadcrumb';
import { GitHubSyncPanel } from '@/components/knowledge/GitHubSyncPanel';
import { SecureDocumentSync } from '@/components/knowledge/SecureDocumentSync';
import { PermissionBadge, type PermissionLevel } from '@/components/knowledge';

export default function KnowledgeDashboard() {
  const { user } = useAuth(); // Get user for access control
  const userRole = user?.role; // Extract role from user object
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [stats, setStats] = useState<KnowledgeStats>({
    total_documents: 0,
    total_size: 0,
    active_documents: 0,
    pending_embeddings: 0,
    total_chunks: 0,
    total_words: 0,
    categories_count: 0,
    last_updated: ''
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<KnowledgeDocument | null>(null);
  const [showWebScrapingDialog, setShowWebScrapingDialog] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Folder navigation state
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [folderTree, setFolderTree] = useState<FolderNode[]>([]);
  const [showFolderSidebar, setShowFolderSidebar] = useState(true);

  // Form state for new/edit document
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    status: 'active' as 'active' | 'archived' | 'processing',
    // New sharing controls
    sharing_level: 'public' as 'public' | 'shelter_specific' | 'super_admin_only' | 'role_based',
    shared_with: [] as string[],
    access_roles: [] as string[],
    is_live: false,
    confidentiality_level: 'public' as 'public' | 'internal' | 'confidential' | 'restricted'
  });

  // Web scraping form state
  const [webScrapingData, setWebScrapingData] = useState({
    url: '',
    title: '',
    category: '',
    tags: [] as string[]
  });

  useEffect(() => {
    loadKnowledgeData();
  }, []);

  // Helper functions for quality indicators
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
    if (score >= 90) return { color: 'bg-green-500', text: 'Excellent', icon: Star };
    if (score >= 70) return { color: 'bg-blue-500', text: 'Good', icon: CheckCircle };
    if (score >= 50) return { color: 'bg-yellow-500', text: 'Fair', icon: AlertCircle };
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

  // Sharing control helpers
  const getSharingBadge = (doc: KnowledgeDocument) => {
    if (doc.is_live) {
      return { color: 'bg-green-500', text: 'LIVE', icon: Zap };
    }
    
    // Use sharing_level or fall back to access_level, default to 'public'
    const sharingLevel = doc.sharing_level || doc.access_level || 'public';
    
    switch (sharingLevel) {
      case 'public':
        return { color: 'bg-blue-500', text: 'Public', icon: Globe };
      case 'shelter_specific':
        return { color: 'bg-purple-500', text: 'Shelter', icon: Target };
      case 'super_admin_only':
        return { color: 'bg-red-500', text: 'Internal', icon: Shield };
      case 'role_based':
        return { color: 'bg-orange-500', text: 'Role-Based', icon: Users };
      case 'internal': // Legacy support
        return { color: 'bg-red-500', text: 'Internal', icon: Shield };
      default:
        return { color: 'bg-blue-500', text: 'Public', icon: Globe }; // Default to Public instead of Unknown
    }
  };

  const getConfidentialityBadge = (level: string) => {
    // Default to 'public' if level is undefined, null, or empty
    const confidentialityLevel = level || 'public';
    
    switch (confidentialityLevel) {
      case 'public':
        return { color: 'bg-green-100 text-green-800', text: 'Public', icon: Globe };
      case 'internal':
        return { color: 'bg-blue-100 text-blue-800', text: 'Internal', icon: Shield };
      case 'confidential':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Confidential', icon: Lock };
      case 'restricted':
        return { color: 'bg-red-100 text-red-800', text: 'Restricted', icon: AlertTriangle };
      default:
        return { color: 'bg-green-100 text-green-800', text: 'Public', icon: Globe }; // Default to Public instead of Unknown
    }
  };

  const openViewDialog = (doc: KnowledgeDocument) => {
    setViewingDocument(doc);
    setShowViewDialog(true);
  };

  const loadKnowledgeData = async () => {
    try {
      setLoading(true);
      
      // Get documents and stats from API
      const [documentsResponse, statsResponse] = await Promise.all([
        knowledgeDashboardService.getKnowledgeDocuments(),
        knowledgeDashboardService.getKnowledgeStats()
      ]);
      
      console.log('📊 Knowledge Data Debug:');
      console.log(`Total documents received: ${documentsResponse.data.documents.length}`);
      console.log('Sample document paths:', documentsResponse.data.documents.slice(0, 5).map(d => d.file_path));
      console.log('Stats:', statsResponse.data);
      
      setDocuments(documentsResponse.data.documents);
      setStats(statsResponse.data);
      
      // Build dual repository tree (GitHub + Firebase) from documents
      const tree = buildDualRepositoryTree(documentsResponse.data.documents);
      console.log('🌳 Dual repository tree built:', tree.map(f => `${f.name}: ${f.documentCount} docs`));
      setFolderTree(tree);

    } catch (error) {
      console.error('Error loading knowledge data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      tags: [],
      status: 'active',
      sharing_level: 'public',
      shared_with: [],
      access_roles: [],
      is_live: false,
      confidentiality_level: 'public'
    });
  };

  // Folder navigation handlers
  const handleFolderSelect = (folderPath: string) => {
    setSelectedFolder(folderPath);
  };

  const handleBreadcrumbNavigate = (path: string) => {
    if (path === '/') {
      setSelectedFolder('');
    } else {
      setSelectedFolder(path);
    }
  };

  const handleDocumentSelect = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (doc) {
      openViewPage(doc);
    }
  };

  const handleCreateDocument = async () => {
    try {
      await knowledgeDashboardService.createKnowledgeDocument(formData);
      setShowCreateDialog(false);
      resetForm();
      loadKnowledgeData(); // Refresh the list
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };


  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this knowledge document?')) return;
    
    try {
      await knowledgeDashboardService.deleteKnowledgeDocument(documentId);
      loadKnowledgeData(); // Refresh the list
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleWebScraping = async () => {
    try {
      // TODO: Implement web scraping API call
      console.log('Web scraping:', webScrapingData);
      setShowWebScrapingDialog(false);
      setWebScrapingData({ url: '', title: '', category: '', tags: [] });
      loadKnowledgeData(); // Refresh the list
    } catch (error) {
      console.error('Error web scraping:', error);
    }
  };

  const openEditPage = (document: KnowledgeDocument) => {
    // Navigate to dedicated edit page with search params
    window.location.href = `/dashboard/knowledge/edit?id=${document.id}`;
  };

  const openViewPage = (document: KnowledgeDocument) => {
    // Navigate to dedicated view page with search params
    window.location.href = `/dashboard/knowledge/view?id=${document.id}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    // Case-insensitive category matching to handle API vs Api vs api variations
    const matchesCategory = categoryFilter === 'all' || 
                           doc.category.toLowerCase() === categoryFilter.toLowerCase();
    
    // Status filter - now includes Doc Hub filter
    let matchesStatus = true;
    if (statusFilter === 'dochub') {
      // Show only documents published to Doc Hub with public visibility
      matchesStatus = (doc as any).published_to_hub === true && 
                     ((doc as any).permission_level === 'public' || 
                      (doc as any).sharing_level === 'public' ||
                      (!doc.is_private && !(doc as any).permission_level));
    } else if (statusFilter !== 'all') {
      matchesStatus = doc.status === statusFilter;
    }
    
    // Folder filtering
    const matchesFolder = !selectedFolder || 
                         (doc.file_path && doc.file_path.includes(`/${selectedFolder}/`));
    
    return matchesSearch && matchesCategory && matchesStatus && matchesFolder;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading knowledge base...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Folder Sidebar */}
      {showFolderSidebar && (
        <div className="w-96 border-r bg-card flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">📁 Folders</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFolderSidebar(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Folder Tree */}
          <div className="flex-1 overflow-auto p-4">
            <FolderTree
              folders={folderTree}
              selectedPath={selectedFolder}
              onFolderSelect={handleFolderSelect}
              onDocumentSelect={handleDocumentSelect}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                <Brain className="h-8 w-8 mr-3" />
                Knowledge Base
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2">
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage and organize your knowledge documents
                </p>
                {/* Folder Toggle - Under Subtitle */}
                <Button
                  variant={showFolderSidebar ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFolderSidebar(!showFolderSidebar)}
                  className={`flex-shrink-0 w-fit ${showFolderSidebar ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-blue-300 text-blue-600 hover:bg-blue-50'}`}
                  title={showFolderSidebar ? "Hide Folders" : "Show Folders"}
                >
                  <Folder className="h-4 w-4 mr-1" />
                  <span className="text-xs">
                    {showFolderSidebar ? "Hide Folders" : "Show Folders"}
                  </span>
                </Button>
              </div>
            </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={showWebScrapingDialog} onOpenChange={setShowWebScrapingDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Globe className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Web Scraping</span>
                <span className="sm:hidden">Scraping</span>
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* GitHub Sync Panel - Full Width at Top */}
      <div className="mb-6">
        <GitHubSyncPanel onSyncComplete={loadKnowledgeData} userRole={userRole} />
      </div>

      {/* Secure Document Sync Panel - NEW! */}
      {(userRole === 'super_admin' || userRole === 'platform_admin') && (
        <div className="mb-6">
          <SecureDocumentSync />
        </div>
      )}

      {/* AI Knowledge Helper Component */}
      <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                🤖 How SHELTR&apos;s AI Knowledge System Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">1. Document Processing</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Your documents are broken into smart &quot;chunks&quot; - small, meaningful pieces that our AI can understand and search through quickly.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">2. AI Embeddings</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Each chunk gets converted into &quot;embeddings&quot; - mathematical representations that capture the meaning, allowing instant semantic search.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-green-600" />
                    <span className="font-medium">3. Smart Chatbot</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    When users ask questions, our chatbot finds the most relevant chunks and provides accurate, contextual answers from your knowledge base.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  <span>{stats.total_chunks} chunks processed</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{stats.active_documents} documents live</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{stats.total_words?.toLocaleString() || 0} words indexed</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Row - Better Desktop Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card className="lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <Database className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-xs font-medium text-muted-foreground mb-1">Total Documents</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total_documents}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {documents.filter(d => {
                    // A document is public if:
                    // 1. permission_level is explicitly 'public'
                    // 2. is_private is false or undefined
                    // 3. sharing_level is 'public'
                    // 4. No permission fields set (defaults to public)
                    const hasPublicPermission = d.permission_level === 'public';
                    const notPrivate = d.is_private === false || d.is_private === undefined;
                    const isPublicSharing = d.sharing_level === 'public';
                    const noPermissionSet = !d.permission_level && !d.is_private && !d.sharing_level;
                    
                    return hasPublicPermission || (notPrivate && (isPublicSharing || noPermissionSet));
                  }).length} public
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  {documents.filter(d => {
                    // A document is secure if it's explicitly marked as private
                    // OR has a non-public permission level
                    const isPrivate = d.is_private === true;
                    const hasSecurePermission = d.permission_level && d.permission_level !== 'public';
                    const hasSecureSharing = d.sharing_level && d.sharing_level !== 'public';
                    
                    return isPrivate || hasSecurePermission || hasSecureSharing;
                  }).length} secure
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-xs font-medium text-muted-foreground mb-1">Active Documents</p>
              <p className="text-2xl font-bold text-green-600">{stats.active_documents}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <Hash className="h-8 w-8 text-purple-500 mb-2" />
              <p className="text-xs font-medium text-muted-foreground mb-1">Total Chunks</p>
              <p className="text-2xl font-bold text-purple-600">{stats.total_chunks}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <Brain className="h-8 w-8 text-orange-500 mb-2" />
              <p className="text-xs font-medium text-muted-foreground mb-1">Pending Embeddings</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending_embeddings}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <BookOpen className="h-8 w-8 text-indigo-500 mb-2" />
              <p className="text-xs font-medium text-muted-foreground mb-1">Total Words</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.total_words?.toLocaleString() || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <Folder className="h-8 w-8 text-teal-500 mb-2" />
              <p className="text-xs font-medium text-muted-foreground mb-1">Categories</p>
              <p className="text-2xl font-bold text-teal-600">{stats.categories_count || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters - Desktop Optimized */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Search bar - takes more space on desktop */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters - horizontal on desktop */}
            <div className="flex flex-col sm:flex-row xl:flex-row gap-3 xl:gap-2">
              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                {!showFolderSidebar && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFolderSidebar(true)}
                    className="flex-shrink-0 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Show Folders</span>
                    <span className="sm:hidden">Folders</span>
                  </Button>
                )}
                
                <Breadcrumb
                  items={buildBreadcrumb(selectedFolder)}
                  onNavigate={handleBreadcrumbNavigate}
                  className="flex-shrink-0"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40 xl:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Platform">📋 Platform</SelectItem>
                  <SelectItem value="Architecture">🏗️ Architecture</SelectItem>
                  <SelectItem value="API">🔌 API</SelectItem>
                  <SelectItem value="Features">✨ Features</SelectItem>
                  <SelectItem value="Development">💻 Development</SelectItem>
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 xl:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">✅ Active</SelectItem>
                  <SelectItem value="archived">📦 Archived</SelectItem>
                  <SelectItem value="processing">⏳ Processing</SelectItem>
                  <SelectItem value="dochub">📘 Doc Hub</SelectItem>
                </SelectContent>
              </Select>
              
              {/* View toggle - compact on desktop */}
              <div className="flex gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="px-3 py-1 h-8"
                >
                  <div className="grid grid-cols-2 gap-0.5 h-3 w-3 mr-2">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                  Cards
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3 py-1 h-8"
                >
                  <div className="flex flex-col gap-0.5 h-3 w-3 mr-2">
                    <div className="bg-current h-0.5 rounded-sm"></div>
                    <div className="bg-current h-0.5 rounded-sm"></div>
                    <div className="bg-current h-0.5 rounded-sm"></div>
                  </div>
                  List
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {filteredDocuments.length} of {documents.length} documents
              {selectedFolder && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  📁 {selectedFolder}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last updated: {stats.last_updated ? formatDate(stats.last_updated) : 'Never'}
            </div>
          </div>
        </CardContent>
      </Card>

                 {/* Documents Display - Enhanced Desktop Layout */}
                 {viewMode === 'cards' ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDocuments.map((doc) => {
            const qualityScore = getQualityScore(doc);
            const qualityBadge = getQualityBadge(qualityScore);
            const QualityIcon = qualityBadge.icon;
            const sharingBadge = getSharingBadge(doc);
            const SharingIcon = sharingBadge.icon;
            const confidentialityBadge = getConfidentialityBadge(doc.confidentiality_level || 'public');
            const ConfidentialityIcon = confidentialityBadge.icon;
            
            return (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow flex flex-col h-full">
                <CardHeader className="pb-3">
                  {/* Title and main badges - improved responsive layout */}
                  <div className="space-y-3">
                    <CardTitle className="text-base sm:text-lg line-clamp-2 leading-tight">
                      {doc.title}
                    </CardTitle>
                    
                    {/* Quality and sharing badges - better mobile layout */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <Badge className={`${qualityBadge.color} text-white text-xs px-2 py-0.5`}>
                        <QualityIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{qualityBadge.text}</span>
                      </Badge>
                      <Badge className={`${sharingBadge.color} text-white text-xs px-2 py-0.5`}>
                        <SharingIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{sharingBadge.text}</span>
                      </Badge>
                    </div>
                    
                    {/* Status badges - improved mobile stacking */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <Badge variant={doc.status === 'active' ? 'default' : 'secondary'} className="text-xs px-2 py-0.5">
                        <span className="truncate">{doc.status}</span>
                      </Badge>
                      <Badge variant={doc.embedding_status === 'completed' ? 'default' : 'outline'} className="text-xs px-2 py-0.5">
                        {getEmbeddingStatusIcon(doc.embedding_status)}
                        <span className="ml-1 truncate">{doc.embedding_status}</span>
                      </Badge>
                      {/* Permission Badge - Shows permission level */}
                      {(doc as any).permission_level ? (
                        <PermissionBadge 
                          permission={(doc as any).permission_level as PermissionLevel} 
                          size="sm"
                        />
                      ) : (
                        /* Fallback to old confidentiality badge if no permission_level */
                        <Badge className={`${confidentialityBadge.color} text-xs px-2 py-0.5`}>
                          <ConfidentialityIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{confidentialityBadge.text}</span>
                        </Badge>
                      )}
                    </div>

                    {/* Publishing Badges - Shows where document is published */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {(doc as any).published_to_hub && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5 border-blue-400 text-blue-600">
                          <Book className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">Docs Hub</span>
                        </Badge>
                      )}
                      {(doc as any).published_to_founders && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5 border-purple-400 text-purple-600">
                          <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">Founders</span>
                        </Badge>
                      )}
                      {(doc as any).published_to_ir && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5 border-green-400 text-green-600">
                          <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">IR</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
              
                <CardContent className="flex-1 flex flex-col pt-0">
                  {/* Quality score - improved mobile layout */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs sm:text-sm font-medium">Quality Score</span>
                      <span className="text-xs sm:text-sm font-bold">{qualityScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div 
                        className={`h-1.5 sm:h-2 rounded-full ${qualityBadge.color}`}
                        style={{ width: `${qualityScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Content preview - better mobile text handling */}
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                    {doc.content.substring(0, 120)}...
                  </p>
                  
                  {/* Tags - improved mobile wrapping */}
                  <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                    {doc.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">
                        <span className="truncate">{tag}</span>
                      </Badge>
                    ))}
                    {doc.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        +{doc.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Metadata - improved mobile grid */}
                  <div className="space-y-1.5 sm:space-y-2 text-xs text-muted-foreground mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{formatFileSize(doc.file_size)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Hash className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{doc.chunk_count} chunks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{doc.view_count} views</span>
                    </div>
                  </div>
                  
                  {/* Category and date - improved mobile layout */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground mb-4">
                    <span className="truncate">{doc.category}</span>
                    <span className="truncate">{formatDate(doc.updated_at)}</span>
                  </div>
                  
                  {/* Action buttons - improved mobile layout */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewPage(doc)}
                      className="flex-1 text-xs px-2 py-1 h-8"
                    >
                      <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditPage(doc)}
                      className="flex-1 text-xs px-2 py-1 h-8"
                    >
                      <Edit className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-500 hover:text-red-700 text-xs px-2 py-1 h-8"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredDocuments.map((doc) => {
            const qualityScore = getQualityScore(doc);
            const qualityBadge = getQualityBadge(qualityScore);
            const QualityIcon = qualityBadge.icon;
            const sharingBadge = getSharingBadge(doc);
            const SharingIcon = sharingBadge.icon;
            const confidentialityBadge = getConfidentialityBadge(doc.confidentiality_level || 'public');
            const ConfidentialityIcon = confidentialityBadge.icon;
            
            return (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  {/* Improved mobile-friendly layout */}
                  <div className="flex flex-col lg:flex-row lg:items-start gap-3 sm:gap-4">
                    {/* Main content area */}
                    <div className="flex-1 min-w-0">
                      {/* Header with title and badges - improved responsive layout */}
                      <div className="space-y-2 sm:space-y-3 mb-3">
                        <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2">
                          {doc.title}
                        </h3>
                        
                        {/* Quality and sharing badges - better mobile layout */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <Badge className={`${qualityBadge.color} text-white text-xs px-2 py-0.5`}>
                            <QualityIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{qualityBadge.text}</span>
                          </Badge>
                          <Badge className={`${sharingBadge.color} text-white text-xs px-2 py-0.5`}>
                            <SharingIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{sharingBadge.text}</span>
                          </Badge>
                        </div>
                        
                        {/* Status badges - improved mobile stacking */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <Badge 
                            variant={doc.status === 'active' ? 'default' : doc.status === 'draft' ? 'outline' : 'secondary'} 
                            className={`text-xs px-2 py-0.5 ${doc.status === 'draft' ? 'border-yellow-400 text-yellow-600' : ''}`}
                          >
                            <span className="truncate">
                              {doc.status === 'active' && '✅ Active'}
                              {doc.status === 'draft' && '📝 Draft'}
                              {doc.status === 'archived' && '📦 Archived'}
                              {doc.status === 'processing' && '⏳ Processing'}
                              {!['active', 'draft', 'archived', 'processing'].includes(doc.status) && doc.status}
                            </span>
                          </Badge>
                          <Badge variant={doc.embedding_status === 'completed' ? 'default' : 'outline'} className="text-xs px-2 py-0.5">
                            {getEmbeddingStatusIcon(doc.embedding_status)}
                            <span className="ml-1 truncate">{doc.embedding_status}</span>
                          </Badge>
                          <Badge 
                            variant={doc.is_live ? 'default' : 'secondary'} 
                            className={`text-xs px-2 py-0.5 ${doc.is_live ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'}`}
                          >
                            <Brain className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{doc.is_live ? 'Published' : 'Draft'}</span>
                          </Badge>
                          <Badge className={`${confidentialityBadge.color} text-xs px-2 py-0.5`}>
                            <ConfidentialityIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{confidentialityBadge.text}</span>
                          </Badge>
                        </div>

                        {/* Publishing Badges - Shows where document is published */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {(doc as any).published_to_hub && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5 border-blue-400 text-blue-600">
                              <Book className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">Docs Hub</span>
                            </Badge>
                          )}
                          {(doc as any).published_to_founders && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5 border-purple-400 text-purple-600">
                              <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">Founders</span>
                            </Badge>
                          )}
                          {(doc as any).published_to_ir && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5 border-green-400 text-green-600">
                              <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">IR</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Quality score - improved mobile layout */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs sm:text-sm font-medium">Quality Score</span>
                          <span className="text-xs sm:text-sm font-bold">{qualityScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className={`h-1.5 sm:h-2 rounded-full ${qualityBadge.color}`}
                            style={{ width: `${qualityScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Content preview - better mobile text handling */}
                      <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                        {doc.content.substring(0, 150)}...
                      </p>
                      
                      {/* Tags - improved mobile wrapping */}
                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {doc.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                              <span className="truncate">{tag}</span>
                            </Badge>
                          ))}
                          {doc.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              +{doc.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Metadata grid - improved mobile responsive */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{formatFileSize(doc.file_size)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{doc.chunk_count} chunks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{doc.word_count} words</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{doc.view_count} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{formatDate(doc.updated_at)}</span>
                        </div>
                      </div>
                      
                      {/* Category - improved mobile layout */}
                      <div className="text-xs sm:text-sm text-muted-foreground mb-3">
                        <span className="font-medium">Category:</span> <span className="truncate">{doc.category}</span>
                      </div>
                    </div>
                    
                    {/* Action buttons - improved mobile responsive */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-1.5 sm:gap-2 lg:gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewPage(doc)}
                        className="w-full sm:w-auto lg:w-full text-xs px-2 py-1 h-8"
                      >
                        <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="hidden sm:inline lg:hidden">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditPage(doc)}
                        className="w-full sm:w-auto lg:w-full text-xs px-2 py-1 h-8"
                      >
                        <Edit className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="hidden sm:inline lg:hidden">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-500 hover:text-red-700 w-full sm:w-auto lg:w-full text-xs px-2 py-1 h-8"
                      >
                        <Trash2 className="h-3 w-3 flex-shrink-0" />
                        <span className="hidden sm:inline lg:hidden">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="text-center py-16">
          <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-semibold mb-4">No knowledge documents found</h3>
          <p className="text-muted-foreground mb-8">
            {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Add your first knowledge document to get started.'
            }
          </p>
          {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Document
            </Button>
          )}
        </div>
      )}

      {/* Create Document Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Knowledge Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter document title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Category *</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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

            <div>
              <label className="text-sm font-medium">Content *</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Enter document content..."
                rows={10}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'archived' | 'processing') => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>

            {/* Sharing Controls Section */}
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-4">Sharing & Access Controls</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Sharing Level</label>
                  <Select value={formData.sharing_level} onValueChange={(value: 'public' | 'shelter_specific' | 'super_admin_only' | 'role_based') => setFormData({...formData, sharing_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Available to all users</SelectItem>
                      <SelectItem value="shelter_specific">Shelter Specific - Only specific shelters</SelectItem>
                      <SelectItem value="super_admin_only">Super Admin Only - Internal use</SelectItem>
                      <SelectItem value="role_based">Role Based - Specific user roles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Confidentiality Level</label>
                  <Select value={formData.confidentiality_level} onValueChange={(value: 'public' | 'internal' | 'confidential' | 'restricted') => setFormData({...formData, confidentiality_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - No restrictions</SelectItem>
                      <SelectItem value="internal">Internal - Organization only</SelectItem>
                      <SelectItem value="confidential">Confidential - Limited access</SelectItem>
                      <SelectItem value="restricted">Restricted - Highest security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="is_live"
                  checked={formData.is_live}
                  onChange={(e) => setFormData({...formData, is_live: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="is_live" className="text-sm font-medium">
                  Mark as Live/Public Document
                </label>
              </div>
              
              {formData.sharing_level === 'shelter_specific' && (
                <div>
                  <label className="text-sm font-medium">Share with Specific Shelters</label>
                  <Input
                    value={formData.shared_with.join(', ')}
                    onChange={(e) => setFormData({...formData, shared_with: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                    placeholder="Enter shelter IDs separated by commas"
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
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDocument}>
                <Plus className="h-4 w-4 mr-2" />
                Create Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Enhanced View Document Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className={`${isFullScreen ? 'max-w-full max-h-full w-full h-full' : 'max-w-7xl max-h-[95vh] w-[95vw]'} overflow-hidden`}>
          <DialogHeader className="pb-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                <FileTextIcon className="h-6 w-6 text-blue-600" />
                <span className="line-clamp-2">{viewingDocument?.title}</span>
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="px-3 py-2"
                >
                  {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline">Fullscreen</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewingDocument) {
                      navigator.clipboard.writeText(viewingDocument.content);
                    }
                  }}
                  className="px-3 py-2"
                >
                  <Copy className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewingDocument) {
                      openEditPage(viewingDocument);
                    }
                  }}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                >
                  <Edit className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Edit</span>
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {viewingDocument && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Sidebar - Metadata */}
                  <div className="lg:col-span-1">
                    <div className="space-y-6 sticky top-0">
                      
                      {/* Document Info */}
                      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-gray-900">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Document Info
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Category</span>
                            <Badge variant="outline" className="text-xs">
                              {viewingDocument.category}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Status</span>
                            <Badge variant={viewingDocument.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {viewingDocument.status}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600 block mb-2">File Path</span>
                            <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 break-all">
                              {viewingDocument.file_path || 'N/A'}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="font-bold text-lg text-blue-600">
                                {viewingDocument.file_size ? `${(viewingDocument.file_size / 1024).toFixed(1)}` : '0'}
                              </div>
                              <div className="text-xs text-gray-500">KB</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="font-bold text-lg text-blue-600">
                                {viewingDocument.word_count || 0}
                              </div>
                              <div className="text-xs text-gray-500">Words</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI & Embeddings */}
                      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-gray-900">
                          <Brain className="h-5 w-5 text-purple-600" />
                          AI & Embeddings
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Status</span>
                            <Badge variant={viewingDocument.embedding_status === 'completed' ? 'default' : 'outline'} className="text-xs">
                              {getEmbeddingStatusIcon(viewingDocument.embedding_status)}
                              <span className="ml-1">{viewingDocument.embedding_status}</span>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Chunks</span>
                            <span className="font-semibold text-purple-600">
                              {viewingDocument.chunk_count || 0}
                            </span>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-600">Quality Score</span>
                              <span className="font-semibold text-purple-600">{getQualityScore(viewingDocument)}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getQualityBadge(getQualityScore(viewingDocument)).color}`}
                                style={{ width: `${getQualityScore(viewingDocument)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Privacy & Access */}
                      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-gray-900">
                          <Shield className="h-5 w-5 text-red-600" />
                          Privacy & Access
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600 block mb-2">Access Level</span>
                            <div className="p-2 bg-gray-50 rounded text-sm text-center">
                              {viewingDocument.sharing_level === 'public' ? '🌐 Public' :
                               viewingDocument.sharing_level === 'super_admin_only' ? '🔒 Admin Only' :
                               viewingDocument.sharing_level === 'shelter_specific' ? '🏠 Shelter' :
                               '👥 Role Based'}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600 block mb-2">Confidentiality</span>
                            <div className="p-2 bg-gray-50 rounded text-sm text-center">
                              {viewingDocument.confidentiality_level === 'public' ? '📖 Public' :
                               viewingDocument.confidentiality_level === 'internal' ? '🏢 Internal' :
                               viewingDocument.confidentiality_level === 'confidential' ? '🔐 Confidential' :
                               '⛔ Restricted'}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600 block mb-2">Chatbot Access</span>
                            <div className={`p-2 rounded text-sm text-center ${viewingDocument.is_live ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              {viewingDocument.is_live ? '✅ Live & Available' : '❌ Disabled'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {viewingDocument.tags && viewingDocument.tags.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-gray-900">
                            <Hash className="h-5 w-5 text-green-600" />
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {viewingDocument.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timeline */}
                      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-gray-900">
                          <Clock className="h-5 w-5 text-gray-600" />
                          Timeline
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Created</span>
                            <p className="text-gray-500 mt-1">
                              {viewingDocument.created_at ? new Date(viewingDocument.created_at).toLocaleString() : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Last Updated</span>
                            <p className="text-gray-500 mt-1">
                              {viewingDocument.updated_at ? new Date(viewingDocument.updated_at).toLocaleString() : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Created By</span>
                            <p className="text-gray-500 mt-1">
                              {viewingDocument.created_by || 'System'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="lg:col-span-2">
                    <div className="space-y-6">
                      
                      {/* Content Preview */}
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Document Content</h3>
                            <div className="flex items-center gap-2 text-blue-100">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">{viewingDocument.content?.length || 0} characters</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 font-mono">
                              {viewingDocument.content || 'No content available'}
                            </pre>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Target className="h-4 w-4" />
                            <span className="text-sm">
                              This document {viewingDocument.is_live ? 'is available' : 'is not available'} to the AI chatbot
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                if (viewingDocument) {
                                  navigator.clipboard.writeText(viewingDocument.content);
                                }
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Content
                            </Button>
                            <Button 
                              onClick={() => {
                                if (viewingDocument) {
                                  openEditPage(viewingDocument);
                                }
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Document
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Web Scraping Dialog */}
      <Dialog open={showWebScrapingDialog} onOpenChange={setShowWebScrapingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Web Scraping</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">URL *</label>
              <Input
                value={webScrapingData.url}
                onChange={(e) => setWebScrapingData({...webScrapingData, url: e.target.value})}
                placeholder="https://example.com/article"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={webScrapingData.title}
                onChange={(e) => setWebScrapingData({...webScrapingData, title: e.target.value})}
                placeholder="Document title (optional - will be auto-detected)"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={webScrapingData.category} onValueChange={(value) => setWebScrapingData({...webScrapingData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
            
            <div>
              <label className="text-sm font-medium">Tags</label>
              <Input
                value={webScrapingData.tags.join(', ')}
                onChange={(e) => setWebScrapingData({...webScrapingData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                placeholder="Enter tags separated by commas"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowWebScrapingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleWebScraping}>
                <Globe className="h-4 w-4 mr-2" />
                Scrape & Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
