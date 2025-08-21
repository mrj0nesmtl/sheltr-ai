/**
 * Blog Service for SHELTR-AI Frontend
 * Handles blog post management and retrieval
 */

import { getAuth } from 'firebase/auth';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  author_id: string;
  author_name: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  category: string;
  read_time: number;
  view_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostsResponse {
  success: boolean;
  data: {
    posts: BlogPost[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface BlogPostResponse {
  success: boolean;
  data: {
    post: BlogPost;
  };
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: BlogCategory[];
  };
}

export interface TagsResponse {
  success: boolean;
  data: {
    tags: BlogTag[];
  };
}

class BlogService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  private async getAuthToken(): Promise<string> {
    // Get Firebase auth token
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  /**
   * Get blog posts with filtering and pagination
   */
  async getBlogPosts(
    status: string = 'published',
    category?: string,
    tag?: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<BlogPostsResponse> {
    try {
      const params = new URLSearchParams({
        status,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (category) params.append('category', category);
      if (tag) params.append('tag', tag);

      const response = await fetch(`${this.baseUrl}/blog/posts?${params}`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  /**
   * Get a single blog post by slug
   */
  async getBlogPost(slug: string): Promise<BlogPostResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/blog/posts/${slug}`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blog post: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }

  /**
   * Create a new blog post
   */
  async createBlogPost(postData: {
    title: string;
    content: string;
    excerpt: string;
    category: string;
    tags?: string[];
    status?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string[];
    featured_image?: File;
  }): Promise<{ success: boolean; data: { post_id: string; message: string } }> {
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      formData.append('excerpt', postData.excerpt);
      formData.append('category', postData.category);
      formData.append('status', postData.status || 'draft');

      if (postData.tags) {
        formData.append('tags', postData.tags.join(','));
      }
      if (postData.seo_title) {
        formData.append('seo_title', postData.seo_title);
      }
      if (postData.seo_description) {
        formData.append('seo_description', postData.seo_description);
      }
      if (postData.seo_keywords) {
        formData.append('seo_keywords', postData.seo_keywords.join(','));
      }
      if (postData.featured_image) {
        formData.append('featured_image', postData.featured_image);
      }

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/blog/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create blog post: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  /**
   * Update an existing blog post
   */
  async updateBlogPost(
    postId: string,
    updates: Partial<{
      title: string;
      content: string;
      excerpt: string;
      category: string;
      tags: string[];
      status: string;
      seo_title: string;
      seo_description: string;
      seo_keywords: string[];
    }>
  ): Promise<{ success: boolean; data: { message: string } }> {
    try {
      const formData = new FormData();
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, value.join(','));
          } else {
            formData.append(key, value);
          }
        }
      });

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/blog/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update blog post: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  /**
   * Delete a blog post
   */
  async deleteBlogPost(postId: string): Promise<{ success: boolean; data: { message: string } }> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/blog/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete blog post: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  /**
   * Get all blog categories
   */
  async getCategories(): Promise<CategoriesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/blog/categories`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Create a new blog category
   */
  async createCategory(categoryData: {
    name: string;
    description: string;
    color?: string;
  }): Promise<{ success: boolean; data: { category_id: string; message: string } }> {
    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description);
      formData.append('color', categoryData.color || '#3B82F6');

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/blog/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create category: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Get all blog tags
   */
  async getTags(): Promise<TagsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/blog/tags`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  /**
   * Import markdown file content as a blog post
   */
  async importMarkdownFile(fileContent: string): Promise<{ success: boolean; data: { post_id: string; message: string } }> {
    try {
      const formData = new FormData();
      formData.append('file_content', fileContent);

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/blog/import-markdown`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to import markdown file: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error importing markdown file:', error);
      throw error;
    }
  }

  /**
   * Get media embeds for a specific blog post
   */
  async getMediaEmbeds(postId: string): Promise<{ success: boolean; data: { embeds: any[] } }> {
    try {
      const response = await fetch(`${this.baseUrl}/blog/posts/${postId}/media-embeds`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch media embeds: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching media embeds:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const blogService = new BlogService();
