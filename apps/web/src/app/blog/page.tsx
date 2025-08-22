'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Clock, User, Tag, Filter } from 'lucide-react';
import { blogService, BlogPost, BlogCategory, BlogTag } from '@/services/blogService';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 9;

  useEffect(() => {
    loadBlogData();
  }, [currentPage, selectedCategory, selectedTag]);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      
      // Load posts
      const postsResponse = await blogService.getBlogPosts(
        'published',
        selectedCategory === 'all' ? undefined : selectedCategory,
        selectedTag === 'all' ? undefined : selectedTag,
        postsPerPage,
        (currentPage - 1) * postsPerPage
      );
      
      setPosts(postsResponse.data.posts);
      setTotalPosts(postsResponse.data.total);

      // Load categories and tags (only once)
      if (categories.length === 0) {
        const categoriesResponse = await blogService.getCategories();
        setCategories(categoriesResponse.data.categories);
      }

      if (tags.length === 0) {
        const tagsResponse = await blogService.getTags();
        setTags(tagsResponse.data.tags);
      }
    } catch (error) {
      console.error('Error loading blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <ThemeLogo />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/backgrounds/hero-bg.jpg)'}}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              SHELTR Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Insights, updates, and stories from the SHELTR community
            </p>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.slice(0, 10).map((tag) => (
                    <SelectItem key={tag.id} value={tag.name}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">No posts found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" style={{ backgroundColor: categories.find(c => c.name === post.category)?.color }}>
                          {post.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {post.read_time} min read
                        </span>
                      </div>
                      <CardTitle className="text-xl">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
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
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
