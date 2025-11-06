/**
 * Qualified Investor Management Service
 * Handles API calls for creating, listing, and managing qualified investors
 */

import { auth } from '@/lib/firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ==================== Types ====================

export interface InvestorMetadata {
  // Contact Information
  email: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  
  // Investment Details
  company?: string;
  investment_range?: string; // e.g., "$1M - $5M"
  check_size?: string;
  accreditation_status: 'verified' | 'pending' | 'not_verified';
  
  // Location & Context
  location?: string;
  source?: string; // linkedin, referral, direct, event, other
  referral_source?: string;
  
  // Access & Notes
  dataroom_access_level: 'full' | 'limited';
  notes?: string;
  initial_contact_date?: string;
}

export interface CreateQualifiedInvestorRequest {
  display_name: string;
  email: string;
  metadata: InvestorMetadata;
}

export interface QualifiedInvestorResponse {
  uid: string;
  email: string;
  display_name: string;
  generated_password: string; // Only returned on creation
  metadata: InvestorMetadata;
  status: string;
}

export interface InvestorListItem {
  uid: string;
  email: string;
  display_name: string;
  company?: string;
  investment_range?: string;
  accreditation_status: string;
  access_level: string;
  created_at: string;
  status: string;
}

export interface UpdateInvestorRequest {
  metadata?: Partial<InvestorMetadata>;
  status?: 'active' | 'inactive';
}

// ==================== Helper Functions ====================

/**
 * Get authenticated user's ID token for API calls
 */
async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user');
  }
  return await user.getIdToken();
}

/**
 * Make authenticated API request
 */
async function makeAuthenticatedRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.detail || `HTTP ${response.status}`);
  }
  
  return await response.json();
}

// ==================== Service Functions ====================

/**
 * Create a new qualified investor account
 * 
 * @param request - Investor details including name, email, and metadata
 * @returns Investor account details including generated password (shown once)
 */
export async function createQualifiedInvestor(
  request: CreateQualifiedInvestorRequest
): Promise<QualifiedInvestorResponse> {
  console.log('🔧 Creating qualified investor:', request.email);
  
  try {
    const result = await makeAuthenticatedRequest<QualifiedInvestorResponse>(
      '/api/v1/admin/qualified-investors',
      'POST',
      request
    );
    
    console.log('✅ Qualified investor created:', result.uid);
    return result;
  } catch (error: any) {
    console.error('❌ Failed to create qualified investor:', error);
    throw error;
  }
}

/**
 * List all qualified investors
 * 
 * @returns Array of qualified investor summaries
 */
export async function listQualifiedInvestors(): Promise<InvestorListItem[]> {
  console.log('📊 Fetching qualified investors...');
  
  try {
    const result = await makeAuthenticatedRequest<InvestorListItem[]>(
      '/api/v1/admin/qualified-investors',
      'GET'
    );
    
    console.log(`✅ Loaded ${result.length} qualified investors`);
    return result;
  } catch (error: any) {
    console.error('❌ Failed to list qualified investors:', error);
    throw error;
  }
}

/**
 * Update qualified investor details
 * 
 * @param uid - Investor user ID
 * @param updates - Fields to update (metadata and/or status)
 * @returns Success confirmation
 */
export async function updateQualifiedInvestor(
  uid: string,
  updates: UpdateInvestorRequest
): Promise<{ success: boolean; message: string }> {
  console.log('🔧 Updating qualified investor:', uid);
  
  try {
    const result = await makeAuthenticatedRequest<{ success: boolean; message: string }>(
      `/api/v1/admin/qualified-investors/${uid}`,
      'PATCH',
      updates
    );
    
    console.log('✅ Qualified investor updated:', uid);
    return result;
  } catch (error: any) {
    console.error('❌ Failed to update qualified investor:', error);
    throw error;
  }
}

/**
 * Deactivate (soft delete) a qualified investor
 * 
 * @param uid - Investor user ID
 * @returns Success confirmation
 */
export async function deactivateQualifiedInvestor(
  uid: string
): Promise<{ success: boolean; message: string }> {
  console.log('🚫 Deactivating qualified investor:', uid);
  
  try {
    const result = await makeAuthenticatedRequest<{ success: boolean; message: string }>(
      `/api/v1/admin/qualified-investors/${uid}`,
      'DELETE'
    );
    
    console.log('✅ Qualified investor deactivated:', uid);
    return result;
  } catch (error: any) {
    console.error('❌ Failed to deactivate qualified investor:', error);
    throw error;
  }
}

/**
 * Format investment range for display
 */
export function formatInvestmentRange(range?: string): string {
  if (!range) return 'Not specified';
  return range;
}

/**
 * Get accreditation status badge color
 */
export function getAccreditationBadgeColor(status: string): string {
  switch (status) {
    case 'verified':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'not_verified':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Get status badge color
 */
export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

