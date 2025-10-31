/**
 * Secure Document Publishing Service
 * Handles publishing Knowledge Base documents to Founders Portal and Investor Relations
 */

import { getAuth } from 'firebase/auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface SecurePublishingSettings {
  published_to_founders: boolean;
  published_to_ir: boolean;
  secure_slug: string;
  secure_badge?: string;
  secure_badge_color?: string;
  secure_icon?: string;
  founders_description?: string;
  ir_description?: string;
  source_directory?: string;
  local_file_path?: string;
}

export interface PublishToFoundersRequest {
  published: boolean;
  settings?: SecurePublishingSettings;
}

export interface PublishToIRRequest {
  published: boolean;
  settings?: SecurePublishingSettings;
}

export interface SecureDocumentCard {
  id: string;
  title: string;
  description: string;
  secure_slug: string;
  badge: string;
  badge_color: string;
  icon: string;
  category: string;
  updated_at: string;
  word_count?: number;
  permission_level: string;
  visibility_scope: string;
}

export interface BadgePreset {
  text: string;
  color: string;
  icon: string;
}

export interface BadgePresetsResponse {
  presets: Record<string, BadgePreset>;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

class SecurePublishingService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  /**
   * Get auth token for API requests
   */
  private async getAuthToken(): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    return await user.getIdToken();
  }

  /**
   * Get auth headers
   */
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // ============================================================================
  // FOUNDERS PORTAL
  // ============================================================================

  /**
   * Get all documents published to Founders Portal
   */
  async getFoundersPortalDocuments(): Promise<SecureDocumentCard[]> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/knowledge/founders-portal`,
      {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to fetch Founders Portal documents');
    }

    return await response.json();
  }

  /**
   * Publish or unpublish a document to Founders Portal
   */
  async publishToFounders(
    documentId: string,
    request: PublishToFoundersRequest
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/knowledge/founders-portal/${documentId}/publish`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to publish to Founders Portal');
    }

    return await response.json();
  }

  // ============================================================================
  // INVESTOR RELATIONS
  // ============================================================================

  /**
   * Get all documents published to Investor Relations
   */
  async getIRDocuments(): Promise<SecureDocumentCard[]> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/knowledge/investor-relations`,
      {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to fetch Investor Relations documents');
    }

    return await response.json();
  }

  /**
   * Publish or unpublish a document to Investor Relations
   */
  async publishToIR(
    documentId: string,
    request: PublishToIRRequest
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/knowledge/investor-relations/${documentId}/publish`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to publish to Investor Relations');
    }

    return await response.json();
  }

  // ============================================================================
  // UTILITY ENDPOINTS
  // ============================================================================

  /**
   * Check if a secure slug is available
   */
  async checkSlugAvailability(
    slug: string,
    excludeId?: string
  ): Promise<{ available: boolean; message: string }> {
    const url = new URL(`${this.baseUrl}/api/v1/knowledge/check-secure-slug/${slug}`);
    if (excludeId) {
      url.searchParams.append('exclude_id', excludeId);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to check slug availability');
    }

    return await response.json();
  }

  /**
   * Get badge presets for UI selection
   */
  async getBadgePresets(): Promise<BadgePresetsResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/knowledge/badge-presets`,
      {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to fetch badge presets');
    }

    return await response.json();
  }

  /**
   * Get secure document by slug
   */
  async getSecureDocumentBySlug(slug: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/knowledge/secure/${slug}`,
      {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to fetch secure document');
    }

    return await response.json();
  }

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Generate a URL-safe slug from a title
   */
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  }

  /**
   * Validate slug format
   */
  validateSlugFormat(slug: string): { valid: boolean; error?: string } {
    if (!slug || slug.length < 3) {
      return { valid: false, error: 'Slug must be at least 3 characters' };
    }

    if (slug.length > 100) {
      return { valid: false, error: 'Slug must be less than 100 characters' };
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' };
    }

    if (slug.startsWith('-') || slug.endsWith('-')) {
      return { valid: false, error: 'Slug cannot start or end with a hyphen' };
    }

    if (slug.includes('--')) {
      return { valid: false, error: 'Slug cannot contain consecutive hyphens' };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const securePublishingService = new SecurePublishingService();

// Export default for convenience
export default securePublishingService;

