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
import { Plus, Edit, Trash2, Eye, Calendar, User, Search, Upload, FileText } from 'lucide-react';
import { blogService, BlogPost, BlogCategory, BlogTag } from '@/services/blogService';
import { useAuth } from '@/contexts/AuthContext';
import BlogImageUpload from '@/components/BlogImageUpload';

export default function BlogManagementPage() {
  const { } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [importMode, setImportMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [] as string[],
    status: 'draft',
    seo_title: '',
    seo_description: '',
    seo_keywords: [] as string[],
    featured_image: '',
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadBlogData();
  }, []);

  // Generate URL-friendly slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[-\s]+/g, '-')
      .trim();
  };

  // Auto-generate slug when title changes
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingPost ? prev.slug : generateSlug(title)
    }));
  };

  // Parse markdown frontmatter and content
  const parseMarkdown = (markdown: string) => {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
      return {
        frontmatter: {},
        content: markdown
      };
    }

    const frontmatterText = match[1];
    const content = match[2];
    const frontmatter: Record<string, any> = {};

    // Parse YAML-like frontmatter
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
        
        if (key === 'tags' || key === 'seo_keywords') {
          frontmatter[key] = value.split(',').map((tag: string) => tag.trim());
        } else {
          frontmatter[key] = value;
        }
      }
    });

    return { frontmatter, content };
  };

  // Handle markdown import and populate form
  const handleMarkdownImport = (markdownText: string) => {
    const { frontmatter, content } = parseMarkdown(markdownText);
    
    setFormData({
      title: frontmatter.title || '',
      slug: frontmatter.slug || generateSlug(frontmatter.title || ''),
      content: content.trim(),
      excerpt: frontmatter.excerpt || '',
      category: frontmatter.category || '',
      tags: frontmatter.tags || [],
      status: frontmatter.status || 'draft',
      seo_title: frontmatter.seo_title || '',
      seo_description: frontmatter.seo_description || '',
      seo_keywords: frontmatter.seo_keywords || [],
      featured_image: '',
    });
    
    setImportMode(false);
    setMarkdownContent('');
  };

  const loadBlogData = async () => {
    try {
      setLoading(true);
      
      // Load all posts (including drafts)
      try {
        const postsResponse = await blogService.getBlogPosts('all', undefined, undefined, 100, 0);
        setPosts(postsResponse.data.posts);
      } catch (error) {
        console.error('Error loading posts:', error);
      }

      // Load categories and tags
      try {
        const categoriesResponse = await blogService.getCategories();
        setCategories(categoriesResponse.data.categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }

      try {
        const tagsResponse = await blogService.getTags();
        setTags(tagsResponse.data.tags);
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    } catch (error) {
      console.error('Error loading blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: '',
      tags: [],
      status: 'draft',
      seo_title: '',
      seo_description: '',
      seo_keywords: [],
      featured_image: '',
    });
    setEditingPost(null);
    setShowPreview(false);
  };

  const handleCreatePost = async () => {
    try {
      const result = await blogService.createBlogPost({
        ...formData,
        // Add knowledge base integration flag
        ingest_to_knowledge_base: true
      });
      
      setShowCreateDialog(false);
      resetForm();
      setImportMode(false);
      setMarkdownContent('');
      loadBlogData(); // Refresh the list
      
      alert(`Blog post created successfully! ${result.data.message}`);
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('Failed to create blog post. Please try again.');
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


  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      status: post.status,
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      seo_keywords: post.seo_keywords || '',
      featured_image: post.featured_image || '',
    });
    setShowCreateDialog(true);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = (post.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (post.excerpt?.toLowerCase() || '').includes(searchQuery.toLowerCase());
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
          <Dialog open={showCreateDialog} onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) {
              setImportMode(false);
              setMarkdownContent('');
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setImportMode(true);
              setShowCreateDialog(true);
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Markdown
          </Button>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Blog Post' : importMode ? 'Import Markdown & Configure Post' : 'Create New Blog Post'}
              </DialogTitle>
            </DialogHeader>
            
            {/* Markdown Import Section */}
            {importMode && !editingPost && (
              <div className="space-y-4 mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Import Markdown Content</h3>
                </div>
                <Textarea
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder="Paste your markdown content with frontmatter here...&#10;&#10;Example:&#10;---&#10;title: Your Post Title&#10;excerpt: Brief description&#10;category: Technology&#10;tags: tag1, tag2&#10;status: draft&#10;---&#10;&#10;# Your Content Here"
                  rows={8}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleMarkdownImport(markdownContent)}
                    disabled={!markdownContent.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Parse & Import
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setImportMode(false);
                      setMarkdownContent('');
                    }}
                  >
                    Skip Import
                  </Button>
                </div>
                {markdownContent && (
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Click &quot;Parse &amp; Import&quot; to automatically populate the form fields from your markdown frontmatter.
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">URL Slug *</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="url-friendly-slug"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Will be used in the URL: /blog/{formData.slug || 'your-slug'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="" disabled>Loading categories...</SelectItem>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
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

              {/* Featured Image Upload */}
              <BlogImageUpload
                currentImageUrl={formData.featured_image}
                onImageUploaded={(url) => setFormData({...formData, featured_image: url})}
                onImageRemoved={() => setFormData({...formData, featured_image: ''})}
              />

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

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? 'Hide Preview' : 'Preview Post'}
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingPost ? handleUpdatePost : handleCreatePost}>
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                </div>
              </div>
              
              {/* Preview Section */}
              {showPreview && (
                <div className="mt-6 p-6 border rounded-lg bg-muted/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Preview</h3>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <h1>{formData.title || 'Untitled Post'}</h1>
                    {formData.excerpt && (
                      <p className="text-lg text-muted-foreground italic">{formData.excerpt}</p>
                    )}
                    <div className="flex gap-2 mb-4">
                      {formData.category && (
                        <Badge variant="secondary">{formData.category}</Badge>
                      )}
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    {formData.featured_image && (
                      <img 
                        src={formData.featured_image} 
                        alt="Featured image" 
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div 
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: formData.content.replace(/\n/g, '<br/>')
                      }}
                    />
                  </div>
                </div>
              )}
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
                {(post.tags || []).slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {(post.tags || []).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(post.tags || []).length - 3} more
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

    </div>
  );
}
