/**
 * Docs Hub Service
 * Handles API calls for publishing documents to the public documentation hub
 */

export interface DocsHubSettings {
  published_to_hub: boolean;
  hub_category: string;
  hub_badge: string;
  hub_order: number;
  hub_slug: string;
  hub_description?: string;
  hub_audience?: string[];
  hub_topics?: string[];
  hub_icon?: string;
}

export interface DocsHubCard {
  id: string;
  title: string;
  description: string;
  category: string;
  badge: string;
  link: string;
  github_link?: string;
  updated: string;
  audience: string[];
  topics: string[];
  icon?: string;
  order: number;
}

export interface DocsHubDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  badge: string;
  slug: string;
  github_path?: string;
  updated_at: string;
  audience: string[];
  topics: string[];
  view_count: number;
}

class DocsHubService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  /**
   * Get all published documents for the docs hub
   */
  async getPublishedDocuments(): Promise<DocsHubCard[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/knowledge/docs-hub`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch published documents: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching published documents:', error);
      throw error;
    }
  }

  /**
   * Get a specific document by slug
   */
  async getDocumentBySlug(slug: string): Promise<DocsHubDocument> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/knowledge/docs-hub/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Document not found');
        }
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching document with slug "${slug}":`, error);
      throw error;
    }
  }

  /**
   * Publish or unpublish a document to the docs hub
   */
  async publishDocument(documentId: string, settings: DocsHubSettings): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/knowledge/${documentId}/publish-to-hub`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to publish document: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error publishing document:', error);
      throw error;
    }
  }

  /**
   * Check if a slug is available
   */
  async checkSlugAvailability(slug: string): Promise<{ available: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/knowledge/docs-hub/check-slug/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check slug: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        available: data.available,
        message: data.message,
      };
    } catch (error) {
      console.error('Error checking slug availability:', error);
      throw error;
    }
  }
}

export const docsHubService = new DocsHubService();

