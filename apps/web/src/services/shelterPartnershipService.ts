/**
 * Shelter Partnership Booking Service
 * 
 * Handles scheduling partnership calls with shelter organizations
 */

export interface ShelterPartnershipBooking {
  shelterName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  shelterLocation: string;
  currentCapacity?: string;
  selectedDateTime: string;
  additionalNotes?: string;
}

export interface SchedulingResult {
  success: boolean;
  eventId?: string;
  message: string;
}

export class ShelterPartnershipService {
  /**
   * Schedule a partnership call with a shelter organization
   */
  async createPartnershipMeeting(booking: ShelterPartnershipBooking): Promise<SchedulingResult> {
    try {
      // Call Firebase Function to create real calendar event
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const { functions } = await import('@/lib/firebase');
      
      const createMeeting = httpsCallable(functions, 'createShelterPartnershipMeeting');
      
      const result = await createMeeting({
        shelterName: booking.shelterName,
        contactName: booking.contactName,
        contactEmail: booking.contactEmail,
        contactPhone: booking.contactPhone,
        shelterLocation: booking.shelterLocation,
        currentCapacity: booking.currentCapacity,
        selectedDateTime: booking.selectedDateTime,
        additionalNotes: booking.additionalNotes,
      });

      const data = result.data as { success: boolean; eventId: string; message: string };

      return {
        success: data.success,
        eventId: data.eventId,
        message: data.message,
      };

    } catch (error) {
      console.error('❌ Partnership meeting scheduling error:', error);
      
      return {
        success: false,
        message: `Failed to schedule partnership call: ${error instanceof Error ? error.message : 'An unexpected error occurred'}. Please contact us directly at partnerships@sheltr-ai.com`,
      };
    }
  }
}

// Export singleton instance
export const shelterPartnershipService = new ShelterPartnershipService();

