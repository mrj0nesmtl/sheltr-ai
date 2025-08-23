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
  Target,
  FileText as FileTextIcon,
  Copy,
  Maximize2,
  Minimize2,
  Shield,
  Users,
  Lock,
  AlertTriangle,
  Folder
} from 'lucide-react';
import { knowledgeDashboardService, KnowledgeDocument, KnowledgeStats } from '@/services/knowledgeDashboardService';
import { useAuth } from '@/contexts/AuthContext';
import { FolderTree, buildFolderTree, FolderNode } from '@/components/knowledge/FolderTree';
import { Breadcrumb, buildBreadcrumb } from '@/components/knowledge/Breadcrumb';
import { GitHubSyncPanel } from '@/components/knowledge/GitHubSyncPanel';

export default function KnowledgeDashboard() {
  const { user } = useAuth();
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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingDocument, setEditingDocument] = useState<KnowledgeDocument | null>(null);
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
    
    switch (doc.sharing_level) {
      case 'public':
        return { color: 'bg-blue-500', text: 'Public', icon: Globe };
      case 'shelter_specific':
        return { color: 'bg-purple-500', text: 'Shelter', icon: Target };
      case 'super_admin_only':
        return { color: 'bg-red-500', text: 'Internal', icon: Shield };
      case 'role_based':
        return { color: 'bg-orange-500', text: 'Role-Based', icon: Users };
      default:
        return { color: 'bg-gray-500', text: 'Unknown', icon: FileText };
    }
  };

  const getConfidentialityBadge = (level: string) => {
    switch (level) {
      case 'public':
        return { color: 'bg-green-100 text-green-800', text: 'Public', icon: Globe };
      case 'internal':
        return { color: 'bg-blue-100 text-blue-800', text: 'Internal', icon: Shield };
      case 'confidential':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Confidential', icon: Lock };
      case 'restricted':
        return { color: 'bg-red-100 text-red-800', text: 'Restricted', icon: AlertTriangle };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Unknown', icon: FileText };
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
      
      // Build folder tree from documents
      const tree = buildFolderTree(documentsResponse.data.documents);
      console.log('🌳 Folder tree built:', tree.map(f => `${f.name}: ${f.documentCount} docs`));
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
    setEditingDocument(null);
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
      openViewDialog(doc);
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

  const handleUpdateDocument = async () => {
    if (!editingDocument) return;
    
    try {
      await knowledgeDashboardService.updateKnowledgeDocument(editingDocument.id, formData);
      setShowEditDialog(false);
      resetForm();
      loadKnowledgeData(); // Refresh the list
    } catch (error) {
      console.error('Error updating document:', error);
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

  const openEditDialog = (document: KnowledgeDocument) => {
    setEditingDocument(document);
    setFormData({
      title: document.title,
      content: document.content,
      category: document.category,
      tags: document.tags,
      status: document.status,
      sharing_level: document.sharing_level || 'public',
      shared_with: document.shared_with || [],
      access_roles: document.access_roles || [],
      is_live: document.is_live || false,
      confidentiality_level: document.confidentiality_level || 'public'
    });
    setShowEditDialog(true);
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
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
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
        <div className="w-80 border-r bg-card flex flex-col">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                <Brain className="h-8 w-8 mr-3" />
                Knowledge Base
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage and organize your knowledge documents
              </p>
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

      {/* GitHub Sync Panel */}
      <GitHubSyncPanel onSyncComplete={loadKnowledgeData} />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.total_documents}</p>
              </div>
              <Database className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Documents</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.active_documents}</p>
              </div>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Chunks</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.total_chunks}</p>
              </div>
              <Hash className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Embeddings</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.pending_embeddings}</p>
              </div>
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                {/* Folder Toggle Button */}
                {!showFolderSidebar && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFolderSidebar(true)}
                    className="flex-shrink-0"
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    Show Folders
                  </Button>
                )}
                
                {/* Breadcrumb Navigation */}
                <Breadcrumb
                  items={buildBreadcrumb(selectedFolder)}
                  onNavigate={handleBreadcrumbNavigate}
                  className="flex-shrink-0"
                />
                
                {/* Manual Refresh Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadKnowledgeData}
                  disabled={loading}
                  className="flex-shrink-0"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Platform">Platform</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* View toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="flex-1 sm:flex-none"
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex-1 sm:flex-none"
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                      <Badge className={`${confidentialityBadge.color} text-xs px-2 py-0.5`}>
                        <ConfidentialityIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{confidentialityBadge.text}</span>
                      </Badge>
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
                      onClick={() => openViewDialog(doc)}
                      className="flex-1 text-xs px-2 py-1 h-8"
                    >
                      <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(doc)}
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
                          <Badge variant={doc.status === 'active' ? 'default' : 'secondary'} className="text-xs px-2 py-0.5">
                            <span className="truncate">{doc.status}</span>
                          </Badge>
                          <Badge variant={doc.embedding_status === 'completed' ? 'default' : 'outline'} className="text-xs px-2 py-0.5">
                            {getEmbeddingStatusIcon(doc.embedding_status)}
                            <span className="ml-1 truncate">{doc.embedding_status}</span>
                          </Badge>
                          <Badge className={`${confidentialityBadge.color} text-xs px-2 py-0.5`}>
                            <ConfidentialityIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{confidentialityBadge.text}</span>
                          </Badge>
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
                        onClick={() => openViewDialog(doc)}
                        className="w-full sm:w-auto lg:w-full text-xs px-2 py-1 h-8"
                      >
                        <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="hidden sm:inline lg:hidden">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(doc)}
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
                    <SelectItem value="Platform">Platform</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
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

      {/* Enhanced Edit Document Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Knowledge Document
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant={editingDocument?.embedding_status === 'completed' ? 'default' : 'secondary'}>
                  {editingDocument?.embedding_status === 'completed' ? 'Embedded' : 'Pending'}
                </Badge>
                <Badge variant="outline">
                  {editingDocument?.chunk_count || 0} chunks
                </Badge>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Document Info */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Document Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">File Path:</span>
                    <p className="text-muted-foreground font-mono text-xs break-all">
                      {editingDocument?.file_path || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Size:</span>
                    <span className="text-muted-foreground ml-2">
                      {editingDocument?.file_size ? `${(editingDocument.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Words:</span>
                    <span className="text-muted-foreground ml-2">
                      {editingDocument?.word_count || 0}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="text-muted-foreground text-xs">
                      {editingDocument?.created_at ? new Date(editingDocument.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span>
                    <p className="text-muted-foreground text-xs">
                      {editingDocument?.updated_at ? new Date(editingDocument.updated_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy & Access Controls */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy & Access
                </h3>
                
                <div>
                  <label className="text-sm font-medium">Access Level</label>
                  <Select 
                    value={formData.sharing_level} 
                    onValueChange={(value) => setFormData({...formData, sharing_level: value as any})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">🌐 Public (Chatbot)</SelectItem>
                      <SelectItem value="super_admin_only">🔒 Super Admin Only</SelectItem>
                      <SelectItem value="shelter_specific">🏠 Shelter Specific</SelectItem>
                      <SelectItem value="role_based">👥 Role Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Confidentiality</label>
                  <Select 
                    value={formData.confidentiality_level} 
                    onValueChange={(value) => setFormData({...formData, confidentiality_level: value as any})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">📖 Public</SelectItem>
                      <SelectItem value="internal">🏢 Internal</SelectItem>
                      <SelectItem value="confidential">🔐 Confidential</SelectItem>
                      <SelectItem value="restricted">⛔ Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_live"
                    checked={formData.is_live}
                    onChange={(e) => setFormData({...formData, is_live: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="is_live" className="text-sm font-medium">
                    Live in Chatbot
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:col-span-2 space-y-4">
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

              <div>
                <label className="text-sm font-medium">Content *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Enter document content (Markdown supported)"
                  rows={15}
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supports Markdown formatting. Changes will regenerate embeddings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'archived' | 'processing') => setFormData({...formData, status: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">✅ Active</SelectItem>
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
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              Changes will regenerate embeddings and update the chatbot knowledge
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateDocument} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Update & Regenerate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced View Document Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className={`${isFullScreen ? 'max-w-full max-h-full' : 'max-w-6xl max-h-[95vh]'} overflow-y-auto`}>
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <FileTextIcon className="h-5 w-5" />
                <span className="line-clamp-2">{viewingDocument?.title}</span>
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="flex-1 sm:flex-none"
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
                  className="flex-1 sm:flex-none"
                >
                  <Copy className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewingDocument) {
                      openEditDialog(viewingDocument);
                      setShowViewDialog(false);
                    }
                  }}
                  className="flex-1 sm:flex-none"
                >
                  <Edit className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Edit</span>
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {viewingDocument && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Metadata */}
              <div className="lg:col-span-1 space-y-4">
                {/* Document Info */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Document Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Category:</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {viewingDocument.category}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge variant={viewingDocument.status === 'active' ? 'default' : 'secondary'} className="ml-2 text-xs">
                        {viewingDocument.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">File Path:</span>
                      <p className="text-muted-foreground font-mono text-xs break-all mt-1">
                        {viewingDocument.file_path || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Size:</span>
                      <span className="text-muted-foreground ml-2">
                        {viewingDocument.file_size ? `${(viewingDocument.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Words:</span>
                      <span className="text-muted-foreground ml-2">
                        {viewingDocument.word_count || 0}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Views:</span>
                      <span className="text-muted-foreground ml-2">
                        {viewingDocument.view_count || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI & Embeddings */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI & Embeddings
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Embedding Status:</span>
                      <Badge variant={viewingDocument.embedding_status === 'completed' ? 'default' : 'outline'} className="ml-2 text-xs">
                        {getEmbeddingStatusIcon(viewingDocument.embedding_status)}
                        <span className="ml-1">{viewingDocument.embedding_status}</span>
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Chunks:</span>
                      <span className="text-muted-foreground ml-2">
                        {viewingDocument.chunk_count || 0}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Quality Score:</span>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">{getQualityScore(viewingDocument)}/100</span>
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
                </div>

                {/* Privacy & Access */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Privacy & Access
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Access Level:</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {viewingDocument.sharing_level === 'public' ? '🌐 Public' :
                         viewingDocument.sharing_level === 'super_admin_only' ? '🔒 Admin Only' :
                         viewingDocument.sharing_level === 'shelter_specific' ? '🏠 Shelter' :
                         '👥 Role Based'}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Confidentiality:</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {viewingDocument.confidentiality_level === 'public' ? '📖 Public' :
                         viewingDocument.confidentiality_level === 'internal' ? '🏢 Internal' :
                         viewingDocument.confidentiality_level === 'confidential' ? '🔐 Confidential' :
                         '⛔ Restricted'}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Chatbot Access:</span>
                      <Badge variant={viewingDocument.is_live ? 'default' : 'secondary'} className="ml-2 text-xs">
                        {viewingDocument.is_live ? '✅ Live' : '❌ Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {viewingDocument.tags && viewingDocument.tags.length > 0 && (
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Hash className="h-4 w-4" />
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

                {/* Timestamps */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Created:</span>
                      <p className="text-muted-foreground text-xs mt-1">
                        {viewingDocument.created_at ? new Date(viewingDocument.created_at).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>
                      <p className="text-muted-foreground text-xs mt-1">
                        {viewingDocument.updated_at ? new Date(viewingDocument.updated_at).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Created By:</span>
                      <p className="text-muted-foreground text-xs mt-1">
                        {viewingDocument.created_by || 'System'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-4">
                {/* Content Preview */}
                <div className="bg-muted/30 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Document Content</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {viewingDocument.content?.length || 0} characters
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto border rounded-lg bg-white p-4">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                        {viewingDocument.content || 'No content available'}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    This document {viewingDocument.is_live ? 'is available' : 'is not available'} to the AI chatbot
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
                          openEditDialog(viewingDocument);
                          setShowViewDialog(false);
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
                  <SelectItem value="Platform">Platform</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="Documentation">Documentation</SelectItem>
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
