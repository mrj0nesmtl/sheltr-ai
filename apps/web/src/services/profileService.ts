/**
 * Profile API Service for SHELTR-AI Frontend
 * Handles user profile management, preferences, and data persistence
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  preferredLanguage?: string;
  pronouns?: string;
}

export interface EmergencyContact {
  id?: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Goal {
  id?: string;
  title: string;
  description: string;
  category: string;
  targetDate?: string;
  progress: number;
  status: string;
}

export interface UserProfile {
  personalInfo: PersonalInfo;
  emergencyContacts: EmergencyContact[];
  goals: Goal[];
  preferences: { [key: string]: any };
}

export interface ProfileUpdateRequest {
  personalInfo?: PersonalInfo;
  emergencyContacts?: EmergencyContact[];
  goals?: Goal[];
  preferences?: { [key: string]: any };
}

class ProfileService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    // Get Firebase ID token from auth context
    try {
      // Import auth dynamically to avoid SSR issues
      const { auth } = await import('@/lib/firebase');
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken();
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };
      }
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
    
    return {
      'Content-Type': 'application/json',
    };
  }

  async getUserProfile(): Promise<UserProfile> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(profileUpdate: ProfileUpdateRequest): Promise<{ success: boolean; message: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(profileUpdate),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async getUserPreferences(): Promise<{ [key: string]: any }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/preferences`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch preferences: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  async updateUserPreferences(preferences: { [key: string]: any }): Promise<{ success: boolean; message: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/preferences`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`Failed to update preferences: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Utility methods
  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  generateGoalId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  generateContactId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Mock data for fallback
  getMockProfile(): UserProfile {
    return {
      personalInfo: {
        firstName: 'Michael',
        lastName: 'Rodriguez',
        dateOfBirth: '1990-03-15',
        phone: '(555) 123-4567',
        email: 'participant@example.com',
        preferredLanguage: 'English',
        pronouns: 'He/Him'
      },
      emergencyContacts: [
        {
          id: 'contact1',
          name: 'Maria Rodriguez',
          relationship: 'Sister',
          phone: '(555) 987-6543',
          email: 'maria.rodriguez@email.com'
        }
      ],
      goals: [
        {
          id: 'goal1',
          title: 'Find Stable Housing',
          description: 'Secure permanent housing within the next 6 months',
          category: 'Housing',
          targetDate: '2025-02-01',
          progress: 45,
          status: 'active'
        }
      ],
      preferences: {
        notifications: {
          email: true,
          sms: false,
          appointments: true
        },
        privacy: {
          shareProgress: false,
          publicProfile: false
        }
      }
    };
  }
}

export const profileService = new ProfileService(); 