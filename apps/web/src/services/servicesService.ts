/**
 * Services API Service for SHELTR-AI Frontend
 * Handles service booking, availability, and appointment management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  provider: string;
  description: string;
  duration_minutes: number;
  location: string;
  max_capacity: number;
  current_bookings: number;
  next_available?: string;
  requirements: string[];
  rating: number;
  shelter_id: string;
  created_at: string;
}

export interface ServiceBooking {
  service_id: string;
  scheduled_time: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  service_id: string;
  service_name: string;
  participant_id: string;
  provider: string;
  scheduled_time: string;
  duration_minutes: number;
  location: string;
  status: string;
  notes?: string;
  created_at: string;
}

class ServicesService {
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

  async getAvailableServices(
    date?: string,
    category?: string,
    shelter_id?: string
  ): Promise<Service[]> {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (category) params.append('category', category);
      if (shelter_id) params.append('shelter_id', shelter_id);

      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/services/available?${params}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available services:', error);
      throw error;
    }
  }

  async bookService(booking: ServiceBooking): Promise<Appointment> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/services/book`, {
        method: 'POST',
        headers,
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Booking failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error booking service:', error);
      throw error;
    }
  }

  async getUserAppointments(status?: string): Promise<Appointment[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);

      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/services/appointments?${params}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/services/appointments/${appointmentId}/status`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update appointment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  async cancelAppointment(appointmentId: string): Promise<{ success: boolean; message: string }> {
    return this.updateAppointmentStatus(appointmentId, 'cancelled');
  }

  // Utility methods for frontend use
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes === 60) {
      return '1 hour';
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`
        : `${hours} hour${hours > 1 ? 's' : ''}`;
    }
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString();
  }

  formatDate(dateTime: string): string {
    return new Date(dateTime).toLocaleDateString();
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Mock data fallback for development/demo purposes
  getMockServices(): Service[] {
    return [
      {
        id: 'mock-1',
        name: 'Individual Counseling',
        category: 'Mental Health',
        provider: 'Dr. Sarah Wilson, LCSW',
        description: 'One-on-one counseling sessions to address personal challenges and develop coping strategies.',
        duration_minutes: 50,
        location: 'Counseling Room A',
        max_capacity: 1,
        current_bookings: 0,
        next_available: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        requirements: ['Initial intake required', 'Weekly commitment'],
        rating: 4.8,
        shelter_id: 'demo-shelter',
        created_at: new Date().toISOString()
      },
      {
        id: 'mock-2',
        name: 'Job Readiness Workshop',
        category: 'Employment',
        provider: 'Michael Chen, Career Counselor',
        description: 'Learn resume writing, interview skills, and job search strategies.',
        duration_minutes: 120,
        location: 'Training Room B',
        max_capacity: 12,
        current_bookings: 8,
        next_available: new Date(Date.now() + 2 * 86400000).toISOString(), // Day after tomorrow
        requirements: ['Must attend all 4 sessions', 'Bring valid ID'],
        rating: 4.9,
        shelter_id: 'demo-shelter',
        created_at: new Date().toISOString()
      }
    ];
  }
}

export const servicesService = new ServicesService(); 