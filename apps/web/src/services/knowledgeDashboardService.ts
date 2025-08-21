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
      const response = await fetch(`${this.baseUrl}/knowledge-dashboard/documents`, {
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
      const response = await fetch(`${this.baseUrl}/knowledge-dashboard/stats`, {
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
   * Update an existing knowledge document
   */
  async updateKnowledgeDocument(
    documentId: string,
    updates: {
      title: string;
      content: string;
      category: string;
      tags: string[];
      status: string;
    }
  ): Promise<{ success: boolean; data: { message: string } }> {
    try {
      const formData = new FormData();
      formData.append('title', updates.title);
      formData.append('content', updates.content);
      formData.append('category', updates.category);
      formData.append('tags', updates.tags.join(', '));
      formData.append('status', updates.status);

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/knowledge-dashboard/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
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
      const response = await fetch(`${this.baseUrl}/knowledge-dashboard/documents/${documentId}`, {
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
