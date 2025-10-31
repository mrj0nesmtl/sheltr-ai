import { getAuth } from 'firebase/auth';

// Interfaces for Knowledge Dashboard
export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category: string;
  tags: string[];
  status: 'active' | 'archived' | 'processing';
  embedding_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  created_by: string;
  view_count: number;
  chunk_count: number;
  word_count: number;
  // New sharing controls
  sharing_level: 'public' | 'shelter_specific' | 'super_admin_only' | 'role_based';
  shared_with?: string[]; // Array of shelter IDs or user IDs
  access_roles?: string[]; // Array of roles that can access
  is_live?: boolean; // Whether document is live/public
  confidentiality_level: 'public' | 'internal' | 'confidential' | 'restricted';
  // Publishing destinations
  published_to_hub?: boolean; // Published to public docs hub
  published_to_founders?: boolean; // Published to founders portal
  published_to_ir?: boolean; // Published to investor relations
  // Secure publishing settings
  secure_slug?: string;
  secure_badge?: string;
  secure_badge_color?: string;
  secure_icon?: string;
  founders_description?: string;
  ir_description?: string;
  source_directory?: string;
  local_file_path?: string;
  // Permission system
  permission_level?: 'public' | 'authenticated' | 'donor' | 'participant' | 'shelter_admin' | 'platform_admin' | 'founders' | 'super_admin';
  visibility_scope?: 'global' | 'shelter' | 'organization';
  is_private?: boolean;
  // GitHub sync
  synced_from_github?: boolean;
  github_path?: string;
  // Docs Hub publishing
  hub_category?: string;
  hub_badge?: string;
  hub_order?: number;
  hub_slug?: string;
  hub_description?: string;
  hub_audience?: string;
  hub_topics?: string[];
  hub_icon?: string;
}

export interface KnowledgeStats {
  total_documents: number;
  total_size: number;
  active_documents: number;
  pending_embeddings: number;
  total_chunks: number;
  total_words: number;
  categories_count: number;
  last_updated: string;
}

export interface KnowledgeDocumentsResponse {
  success: boolean;
  data: {
    documents: KnowledgeDocument[];
  };
}

export interface KnowledgeStatsResponse {
  success: boolean;
  data: KnowledgeStats;
}

export interface KnowledgeDocumentResponse {
  success: boolean;
  data: {
    document_id: string;
    message: string;
  };
}

class KnowledgeDashboardService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private async getAuthToken(): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const token = await user.getIdToken();
    return token;
  }

  /**
   * Get all knowledge documents
   */
  async getKnowledgeDocuments(): Promise<KnowledgeDocumentsResponse> {
    try {
      const apiUrl = `${this.baseUrl}/api/v1/knowledge-dashboard/documents`;
      console.log('🔍 Fetching knowledge documents from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch knowledge documents: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching knowledge documents:', error);
      throw error;
    }
  }

  /**
   * Get knowledge base statistics
   */
  async getKnowledgeStats(): Promise<KnowledgeStatsResponse> {
    try {
      const apiUrl = `${this.baseUrl}/api/v1/knowledge-dashboard/stats`;
      console.log('🔍 Fetching knowledge stats from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch knowledge stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching knowledge stats:', error);
      throw error;
    }
  }

  /**
   * Get single knowledge document by ID
   */
  async getKnowledgeDocument(documentId: string): Promise<{ success: boolean; data: KnowledgeDocument }> {
    try {
      const apiUrl = `${this.baseUrl}/api/v1/knowledge-dashboard/documents/${documentId}`;
      console.log('🔍 Fetching knowledge document from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch knowledge document: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching knowledge document:', error);
      throw error;
    }
  }

  /**
   * Create a new knowledge document
   */
  async createKnowledgeDocument(documentData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    status: string;
  }): Promise<KnowledgeDocumentResponse> {
    try {
      const formData = new FormData();
      formData.append('title', documentData.title);
      formData.append('content', documentData.content);
      formData.append('category', documentData.category);
      formData.append('tags', documentData.tags.join(', '));
      formData.append('status', documentData.status);

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/knowledge-dashboard/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create knowledge document: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating knowledge document:', error);
      throw error;
    }
  }

  /**
   * Update knowledge document from file upload (with embedding regeneration)
   */
  async updateKnowledgeDocumentFromFile(
    documentId: string,
    file: File,
    metadata?: {
      title?: string;
      category?: string;
      tags?: string[];
    }
  ): Promise<{ success: boolean; data: { message: string } }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (metadata?.title) formData.append('title', metadata.title);
      if (metadata?.category) formData.append('category', metadata.category);
      if (metadata?.tags) formData.append('tags', metadata.tags.join(', '));

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/api/v1/knowledge-dashboard/documents/${documentId}/upload`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update document from file: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating document from file:', error);
      throw error;
    }
  }

  /**
   * Update a knowledge document (with ALL fields including permissions)
   */
  async updateKnowledgeDocument(documentId: string, documentData: Partial<{
    title: string;
    content: string;
    category: string;
    tags: string[];
    status: string;
    sharing_level: string;
    shared_with: string[];
    access_roles: string[];
    is_live: boolean;
    confidentiality_level: string;
    // NEW permission fields
    permission_level: string;
    is_private: boolean;
    visibility_scope: string | null;
    // Secure publishing fields
    published_to_founders: boolean;
    published_to_ir: boolean;
    secure_slug: string;
    secure_badge: string;
    secure_badge_color: string;
    secure_icon: string;
    founders_description: string;
    ir_description: string;
    source_directory: string;
    local_file_path: string;
  }>): Promise<{ success: boolean; data: { message: string } }> {
    try {
      const apiUrl = `${this.baseUrl}/api/v1/knowledge-dashboard/documents/${documentId}`;
      console.log('📝 Updating knowledge document at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          ...await this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update knowledge document: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating knowledge document:', error);
      throw error;
    }
  }

  /**
   * Delete a knowledge document
   */
  async deleteKnowledgeDocument(documentId: string): Promise<{ success: boolean; data: { message: string } }> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/api/v1/knowledge-dashboard/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete knowledge document: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting knowledge document:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const knowledgeDashboardService = new KnowledgeDashboardService();
