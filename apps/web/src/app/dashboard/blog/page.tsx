'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Eye, Calendar, User, Tag, Search, Filter, Upload, FileText } from 'lucide-react';
import { blogService, BlogPost, BlogCategory, BlogTag } from '@/services/blogService';
import { useAuth } from '@/contexts/AuthContext';

export default function BlogManagementPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [] as string[],
    status: 'draft',
    seo_title: '',
    seo_description: '',
    seo_keywords: [] as string[],
  });

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      
      // Load all posts (including drafts)
      const postsResponse = await blogService.getBlogPosts('all', undefined, undefined, 100, 0);
      setPosts(postsResponse.data.posts);

      // Load categories and tags
      const categoriesResponse = await blogService.getCategories();
      setCategories(categoriesResponse.data.categories);

      const tagsResponse = await blogService.getTags();
      setTags(tagsResponse.data.tags);
    } catch (error) {
      console.error('Error loading blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: [],
      status: 'draft',
      seo_title: '',
      seo_description: '',
      seo_keywords: [],
    });
    setEditingPost(null);
  };

  const handleCreatePost = async () => {
    try {
      await blogService.createBlogPost(formData);
      setShowCreateDialog(false);
      resetForm();
      loadBlogData(); // Refresh the list
    } catch (error) {
      console.error('Error creating blog post:', error);
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    
    try {
      await blogService.updateBlogPost(editingPost.id, formData);
      setShowCreateDialog(false);
      resetForm();
      loadBlogData(); // Refresh the list
    } catch (error) {
      console.error('Error updating blog post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await blogService.deleteBlogPost(postId);
      loadBlogData(); // Refresh the list
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const handleImportMarkdown = async () => {
    if (!markdownContent.trim()) {
      alert('Please enter markdown content');
      return;
    }
    
    try {
      await blogService.importMarkdownFile(markdownContent);
      setShowImportDialog(false);
      setMarkdownContent('');
      loadBlogData(); // Refresh the list
      alert('Markdown file imported successfully!');
    } catch (error) {
      console.error('Error importing markdown file:', error);
      alert('Failed to import markdown file');
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      status: post.status,
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      seo_keywords: post.seo_keywords || [],
    });
    setShowCreateDialog(true);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading blog management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
            <FileText className="h-8 w-8 mr-3" />
            Blog Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Create and manage blog posts</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Markdown
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter post title"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Excerpt *</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="Brief description of the post"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Content *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your blog post content..."
                  rows={10}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
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

              <Separator />

              {/* SEO Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">SEO Title</label>
                    <Input
                      value={formData.seo_title}
                      onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                      placeholder="SEO-optimized title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">SEO Description</label>
                    <Textarea
                      value={formData.seo_description}
                      onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
                      placeholder="SEO meta description"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">SEO Keywords</label>
                    <Input
                      value={formData.seo_keywords.join(', ')}
                      onChange={(e) => setFormData({...formData, seo_keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)})}
                      placeholder="Enter keywords separated by commas"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={editingPost ? handleUpdatePost : handleCreatePost}>
                  {editingPost ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge 
                  variant={post.status === 'published' ? 'default' : 'secondary'}
                >
                  {post.status}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(post)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardTitle className="text-lg line-clamp-2">
                {post.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.updated_at)}</span>
                </div>
              </div>
              
              {post.status === 'published' && (
                <div className="mt-4 pt-4 border-t">
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Post
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold mb-4">No blog posts found</h3>
          <p className="text-muted-foreground mb-8">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters.'
              : 'Create your first blog post to get started.'
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Post
            </Button>
          )}
        </div>
      )}

      {/* Import Markdown Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Markdown File</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Markdown Content</label>
              <Textarea
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                placeholder="Paste your markdown content here...&#10;&#10;You can include frontmatter:&#10;---&#10;title: Your Post Title&#10;excerpt: Brief description&#10;category: Technology&#10;tags: tag1, tag2&#10;status: draft&#10;---&#10;&#10;# Your Content Here&#10;&#10;Supports media embeds:&#10;- YouTube: https://youtube.com/watch?v=VIDEO_ID&#10;- Vimeo: https://vimeo.com/VIDEO_ID&#10;- Audio: https://example.com/audio.mp3&#10;- Social: https://twitter.com/user/status/123"
                rows={15}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleImportMarkdown}>
                <FileText className="h-4 w-4 mr-2" />
                Import Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
