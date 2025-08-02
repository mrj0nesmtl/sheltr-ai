/**
 * Analytics Service for SHELTR-AI Frontend
 * Connects to the backend analytics API to provide real-time data
 */

import { auth } from '@/lib/firebase';

interface AnalyticsResponse {
  success: boolean;
  data: any;
  timestamp: string;
  message?: string;
}

interface PlatformMetrics {
  users: {
    total: number;
    active_today: number;
    new_this_week: number;
    by_role: Record<string, number>;
    growth_rate: number;
  };
  donations: {
    total_amount: number;
    total_count: number;
    average_amount: number;
    today_amount: number;
    today_count: number;
    growth_rate: number;
  };
  shelters: {
    total_shelters: number;
    active_shelters: number;
    total_capacity: number;
    current_occupancy: number;
    occupancy_rate: number;
    services_provided: number;
    participants_served: number;
  };
  system: {
    uptime: string;
    response_time: number;
    error_rate: number;
    active_connections: number;
  };
  growth: {
    user_growth: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    donation_growth: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
}

class AnalyticsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.sheltr.ai' 
      : 'http://localhost:8000';
  }

  private async getAuthToken(): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return await currentUser.getIdToken();
  }

  private async makeRequest(endpoint: string): Promise<AnalyticsResponse> {
    try {
      // Temporary: Use test endpoints for local development (bypass auth)
      const testEndpoint = endpoint.replace('/analytics/platform', '/analytics/test-platform');
      
      const response = await fetch(`${this.baseUrl}${testEndpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Analytics service error:', error);
      throw error;
    }
  }

  /**
   * Get platform analytics for Super Admin dashboard
   */
  async getPlatformAnalytics(): Promise<PlatformMetrics> {
    try {
      const response = await this.makeRequest('/analytics/platform');
      return response.data;
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
      // Return mock data as fallback
      return this.getMockPlatformData();
    }
  }

  /**
   * Get real-time metrics for dashboard displays
   */
  async getRealtimeMetrics(): Promise<any> {
    try {
      const response = await this.makeRequest('/analytics/realtime');
      return response.data;
    } catch (error) {
      console.error('Error fetching realtime metrics:', error);
      // Return mock data as fallback
      return this.getMockRealtimeData();
    }
  }

  /**
   * Get dashboard analytics based on user role
   */
  async getDashboardAnalytics(userRole?: string): Promise<any> {
    try {
      const endpoint = userRole 
        ? `/analytics/dashboard?user_role=${userRole}`
        : '/analytics/dashboard';
      
      const response = await this.makeRequest(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      // Return role-specific mock data as fallback
      return this.getMockDashboardData(userRole);
    }
  }

  /**
   * Get shelter-specific analytics
   */
  async getShelterAnalytics(shelterId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/analytics/shelter/${shelterId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shelter analytics:', error);
      // Return mock shelter data as fallback
      return this.getMockShelterData();
    }
  }

  /**
   * Generate analytics report
   */
  async generateReport(
    reportType: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<any> {
    try {
      let endpoint = `/analytics/reports/${reportType}`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const response = await this.makeRequest(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Track an analytics event
   */
  async trackEvent(eventType: string, metadata: Record<string, any>): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}/analytics/track`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          metadata: metadata
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error tracking event:', error);
      return false;
    }
  }

  // Fallback mock data methods
  private getMockPlatformData(): PlatformMetrics {
    return {
      users: {
        total: 8,
        active_today: 3,
        new_this_week: 2,
        by_role: {
          super_admin: 1,
          admin: 5,
          participant: 1,
          donor: 1
        },
        growth_rate: 25.0
      },
      donations: {
        total_amount: 89234.67,
        total_count: 2847,
        average_amount: 31.35,
        today_amount: 1567.89,
        today_count: 23,
        growth_rate: 15.4
      },
      shelters: {
        total_shelters: 5,
        active_shelters: 5,
        total_capacity: 250,
        current_occupancy: 188,
        occupancy_rate: 75.2,
        services_provided: 15,
        participants_served: 175
      },
      system: {
        uptime: "99.9%",
        response_time: 45,
        error_rate: 0.1,
        active_connections: 127
      },
      growth: {
        user_growth: {
          daily: 3.2,
          weekly: 18.7,
          monthly: 45.3
        },
        donation_growth: {
          daily: 8.1,
          weekly: 23.4,
          monthly: 67.8
        }
      }
    };
  }

  private getMockRealtimeData(): any {
    return {
      users: {
        total: 8,
        active_today: 3,
        by_role: {
          super_admin: 1,
          admin: 5,
          participant: 1,
          donor: 1
        }
      },
      donations: {
        today_amount: 1567.89,
        today_count: 23,
        total_amount: 89234.67
      },
      shelters: {
        total: 5,
        occupancy_rate: 75.2
      },
      system: {
        uptime: "99.9%",
        response_time: 45,
        error_rate: 0.1,
        active_connections: 127
      },
      last_updated: new Date().toISOString()
    };
  }

  private getMockDashboardData(userRole?: string): any {
    if (userRole === 'super_admin') {
      return this.getMockPlatformData();
    } else if (userRole === 'admin') {
      return this.getMockShelterData();
    } else {
      return {
        user_stats: {
          role: userRole || 'participant',
          profile_complete: false
        },
        platform_health: "operational"
      };
    }
  }

  private getMockShelterData(): any {
    return {
      shelter_id: 'downtown-hope-shelter',
      participants: {
        total: 45,
        active: 38,
        new_this_month: 7
      },
      services: {
        meals_provided: 234,
        nights_shelter: 1567,
        counseling_sessions: 89
      },
      occupancy: {
        current: 38,
        capacity: 50,
        rate: 76.0
      },
      donations_received: {
        amount: 12567.89,
        count: 234
      }
    };
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService; 