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
  Filter, 
  Brain, 
  Upload, 
  Download,
  RefreshCw,
  BarChart3,
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
  TrendingUp,
  FileCode,
  FileText as FileTextIcon,
  ExternalLink,
  Copy,
  Maximize2,
  Minimize2,
  Shield,
  Users,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { knowledgeDashboardService, KnowledgeDocument, KnowledgeStats } from '@/services/knowledgeDashboardService';
import { useAuth } from '@/contexts/AuthContext';

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
      
      setDocuments(documentsResponse.data.documents);
      setStats(statsResponse.data);

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
    
    return matchesSearch && matchesCategory && matchesStatus;
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage and organize your knowledge documents</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showWebScrapingDialog} onOpenChange={setShowWebScrapingDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Web Scraping
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{stats.total_documents}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Documents</p>
                <p className="text-2xl font-bold">{stats.active_documents}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Chunks</p>
                <p className="text-2xl font-bold">{stats.total_chunks}</p>
              </div>
              <Hash className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Embeddings</p>
                <p className="text-2xl font-bold">{stats.pending_embeddings}</p>
              </div>
              <Brain className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
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
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const qualityScore = getQualityScore(doc);
            const qualityBadge = getQualityBadge(qualityScore);
            const QualityIcon = qualityBadge.icon;
            const sharingBadge = getSharingBadge(doc);
            const SharingIcon = sharingBadge.icon;
            const confidentialityBadge = getConfidentialityBadge(doc.confidentiality_level || 'public');
            const ConfidentialityIcon = confidentialityBadge.icon;
            
            return (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                        {doc.title}
                        <Badge className={`${qualityBadge.color} text-white text-xs`}>
                          <QualityIcon className="h-3 w-3 mr-1" />
                          {qualityBadge.text}
                        </Badge>
                        <Badge className={`${sharingBadge.color} text-white text-xs`}>
                          <SharingIcon className="h-3 w-3 mr-1" />
                          {sharingBadge.text}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={doc.status === 'active' ? 'default' : 'secondary'}>
                          {doc.status}
                        </Badge>
                        <Badge variant={doc.embedding_status === 'completed' ? 'default' : 'outline'}>
                          {getEmbeddingStatusIcon(doc.embedding_status)}
                          <span className="ml-1">{doc.embedding_status}</span>
                        </Badge>
                        <Badge className={`${confidentialityBadge.color} text-xs`}>
                          <ConfidentialityIcon className="h-3 w-3 mr-1" />
                          {confidentialityBadge.text}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Quality Score</span>
                    <span className="text-sm font-bold">{qualityScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${qualityBadge.color}`}
                      style={{ width: `${qualityScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {doc.content.substring(0, 150)}...
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {doc.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {doc.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{doc.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    <span>{formatFileSize(doc.file_size)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    <span>{doc.chunk_count} chunks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    <span>{doc.view_count} views</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{doc.category}</span>
                  <span>{formatDate(doc.updated_at)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewDialog(doc)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(doc)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="text-red-500 hover:text-red-700"
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
        <div className="space-y-4">
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
                <CardContent className="p-4">
                  {/* Mobile-friendly layout */}
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Main content area */}
                    <div className="flex-1 min-w-0">
                      {/* Header with title and badges */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {doc.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className={`${qualityBadge.color} text-white text-xs`}>
                              <QualityIcon className="h-3 w-3 mr-1" />
                              {qualityBadge.text}
                            </Badge>
                            <Badge className={`${sharingBadge.color} text-white text-xs`}>
                              <SharingIcon className="h-3 w-3 mr-1" />
                              {sharingBadge.text}
                            </Badge>
                            <Badge variant={doc.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {doc.status}
                            </Badge>
                            <Badge variant={doc.embedding_status === 'completed' ? 'default' : 'outline'} className="text-xs">
                              {getEmbeddingStatusIcon(doc.embedding_status)}
                              <span className="ml-1">{doc.embedding_status}</span>
                            </Badge>
                            <Badge className={`${confidentialityBadge.color} text-xs`}>
                              <ConfidentialityIcon className="h-3 w-3 mr-1" />
                              {confidentialityBadge.text}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quality score */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Quality Score</span>
                          <span className="text-sm font-bold">{qualityScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${qualityBadge.color}`}
                            style={{ width: `${qualityScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Content preview */}
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {doc.content.substring(0, 200)}...
                      </p>
                      
                      {/* Tags */}
                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {doc.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{doc.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Metadata grid - mobile responsive */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{formatFileSize(doc.file_size)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          <span>{doc.chunk_count} chunks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{doc.word_count} words</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{doc.view_count} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(doc.updated_at)}</span>
                        </div>
                      </div>
                      
                      {/* Category */}
                      <div className="text-sm text-muted-foreground mb-3">
                        <span className="font-medium">Category:</span> {doc.category}
                      </div>
                    </div>
                    
                    {/* Action buttons - mobile responsive */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewDialog(doc)}
                        className="w-full sm:w-auto lg:w-full"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline lg:hidden">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(doc)}
                        className="w-full sm:w-auto lg:w-full"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline lg:hidden">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-500 hover:text-red-700 w-full sm:w-auto lg:w-full"
                      >
                        <Trash2 className="h-3 w-3" />
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

      {/* Edit Document Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Knowledge Document</DialogTitle>
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

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateDocument}>
                <Edit className="h-4 w-4 mr-2" />
                Update Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className={`${isFullScreen ? 'max-w-full max-h-full' : 'max-w-4xl max-h-[90vh]'} overflow-y-auto`}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                {viewingDocument?.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                >
                  {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewingDocument) {
                      navigator.clipboard.writeText(viewingDocument.content);
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {viewingDocument && (
            <div className="space-y-6">
              {/* Document Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={viewingDocument.status === 'active' ? 'default' : 'secondary'}>
                    {viewingDocument.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Embeddings</p>
                  <Badge variant={viewingDocument.embedding_status === 'completed' ? 'default' : 'outline'}>
                    {getEmbeddingStatusIcon(viewingDocument.embedding_status)}
                    <span className="ml-1">{viewingDocument.embedding_status}</span>
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Chunks</p>
                  <p className="text-sm">{viewingDocument.chunk_count}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Words</p>
                  <p className="text-sm">{viewingDocument.word_count}</p>
                </div>
              </div>
              
              {/* Quality Score */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Quality Score</span>
                  <span className="text-sm font-bold">{getQualityScore(viewingDocument)}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${getQualityBadge(getQualityScore(viewingDocument)).color}`}
                    style={{ width: `${getQualityScore(viewingDocument)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Full Content */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Document Content</h3>
                <div className="bg-muted/30 p-6 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {viewingDocument.content}
                  </pre>
                </div>
              </div>
              
              {/* Tags */}
              {viewingDocument.tags && viewingDocument.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingDocument.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
  );
}
