/**
 * Service Booking Service
 * Handles appointment scheduling, service management, and availability
 * 
 * Features:
 * - Service browsing and booking
 * - Appointment scheduling with calendar integration
 * - Availability management
 * - Booking confirmations and notifications
 * - Waitlist management
 */

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types and interfaces
export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiresAppointment: boolean;
  maxDuration: number; // minutes
  advanceBookingDays: number;
}

export interface ShelterService {
  id: string;
  categoryId: string;
  shelterId: string;
  name: string;
  description: string;
  provider: string;
  location: string;
  duration: number; // minutes
  capacity: number;
  cost: number; // 0 for free
  requirements: string[];
  isActive: boolean;
  schedule: {
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    startTime: string; // "09:00"
    endTime: string; // "17:00"
    breakTime?: {
      start: string;
      end: string;
    };
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  participantId: string;
  shelterId: string;
  appointmentDate: Timestamp;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  confirmationCode: string;
  reminderSent: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  attendeeInfo: {
    participantName: string;
    participantEmail?: string;
    participantPhone?: string;
    emergencyContact?: string;
  };
  providerNotes?: string;
  outcome?: {
    attended: boolean;
    rating?: number;
    feedback?: string;
    followUpRequired: boolean;
  };
}

export interface AvailableSlot {
  datetime: Date;
  duration: number;
  capacity: number;
  bookedCount: number;
  available: boolean;
}

// Service categories (could be moved to Firestore in production)
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical and mental health services',
    icon: 'Heart',
    color: 'red',
    requiresAppointment: true,
    maxDuration: 60,
    advanceBookingDays: 14
  },
  {
    id: 'employment',
    name: 'Employment Support',
    description: 'Job search, resume help, skills training',
    icon: 'Briefcase',
    color: 'blue',
    requiresAppointment: true,
    maxDuration: 90,
    advanceBookingDays: 7
  },
  {
    id: 'legal',
    name: 'Legal Aid',
    description: 'Legal assistance and advocacy',
    icon: 'Scale',
    color: 'purple',
    requiresAppointment: true,
    maxDuration: 45,
    advanceBookingDays: 21
  },
  {
    id: 'benefits',
    name: 'Benefits & ID',
    description: 'Government benefits, ID assistance',
    icon: 'FileText',
    color: 'green',
    requiresAppointment: true,
    maxDuration: 30,
    advanceBookingDays: 3
  },
  {
    id: 'counseling',
    name: 'Counseling',
    description: 'Mental health and addiction support',
    icon: 'Users',
    color: 'teal',
    requiresAppointment: true,
    maxDuration: 60,
    advanceBookingDays: 7
  },
  {
    id: 'meals',
    name: 'Meals',
    description: 'Food services and nutrition',
    icon: 'Utensils',
    color: 'orange',
    requiresAppointment: false,
    maxDuration: 30,
    advanceBookingDays: 0
  },
  {
    id: 'shower',
    name: 'Showers & Laundry',
    description: 'Personal hygiene facilities',
    icon: 'Droplets',
    color: 'cyan',
    requiresAppointment: true,
    maxDuration: 30,
    advanceBookingDays: 1
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Personal belongings storage',
    icon: 'Package',
    color: 'gray',
    requiresAppointment: false,
    maxDuration: 15,
    advanceBookingDays: 0
  }
];

/**
 * Get all services for a specific shelter
 */
export async function getShelterServices(shelterId: string): Promise<ShelterService[]> {
  try {
    const servicesRef = collection(db, 'services');
    const q = query(
      servicesRef,
      where('shelterId', '==', shelterId),
      where('isActive', '==', true),
      orderBy('name')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ShelterService[];
  } catch (error) {
    console.error('Error fetching shelter services:', error);
    return [];
  }
}

/**
 * Get services by category for a shelter
 */
export async function getServicesByCategory(shelterId: string, categoryId: string): Promise<ShelterService[]> {
  try {
    const servicesRef = collection(db, 'services');
    const q = query(
      servicesRef,
      where('shelterId', '==', shelterId),
      where('categoryId', '==', categoryId),
      where('isActive', '==', true),
      orderBy('name')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ShelterService[];
  } catch (error) {
    console.error('Error fetching services by category:', error);
    return [];
  }
}

/**
 * Create a new service
 */
export async function createService(serviceData: Omit<ShelterService, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const servicesRef = collection(db, 'services');
    const docRef = await addDoc(servicesRef, {
      ...serviceData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating service:', error);
    throw new Error('Failed to create service');
  }
}

/**
 * Update existing service
 */
export async function updateService(serviceId: string, updates: Partial<ShelterService>): Promise<void> {
  try {
    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating service:', error);
    throw new Error('Failed to update service');
  }
}

/**
 * Generate confirmation code
 */
function generateConfirmationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Check service availability for a specific date/time
 */
export async function checkAvailability(
  serviceId: string, 
  appointmentDate: Date, 
  duration: number
): Promise<{ available: boolean; capacity: number; bookedCount: number }> {
  try {
    // Get service details
    const serviceDoc = await getDoc(doc(db, 'services', serviceId));
    if (!serviceDoc.exists()) {
      throw new Error('Service not found');
    }
    
    const service = serviceDoc.data() as ShelterService;
    
    // Check if the appointment time falls within service schedule
    const dayOfWeek = appointmentDate.getDay();
    const timeStr = appointmentDate.toTimeString().substring(0, 5); // "HH:MM"
    
    const scheduleForDay = service.schedule.find(s => s.dayOfWeek === dayOfWeek);
    if (!scheduleForDay) {
      return { available: false, capacity: 0, bookedCount: 0 };
    }
    
    if (timeStr < scheduleForDay.startTime || timeStr > scheduleForDay.endTime) {
      return { available: false, capacity: 0, bookedCount: 0 };
    }
    
    // Check existing bookings for that time slot
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('serviceId', '==', serviceId),
      where('appointmentDate', '>=', Timestamp.fromDate(appointmentDate)),
      where('appointmentDate', '<', Timestamp.fromDate(new Date(appointmentDate.getTime() + duration * 60000))),
      where('status', 'in', ['pending', 'confirmed'])
    );
    
    const snapshot = await getDocs(q);
    const bookedCount = snapshot.size;
    
    return {
      available: bookedCount < service.capacity,
      capacity: service.capacity,
      bookedCount
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    return { available: false, capacity: 0, bookedCount: 0 };
  }
}

/**
 * Book a service appointment
 */
export async function bookService(bookingData: {
  serviceId: string;
  participantId: string;
  shelterId: string;
  appointmentDate: Date;
  duration: number;
  participantName: string;
  participantEmail?: string;
  participantPhone?: string;
  emergencyContact?: string;
  notes?: string;
}): Promise<ServiceBooking> {
  try {
    // Check availability first
    const availability = await checkAvailability(
      bookingData.serviceId, 
      bookingData.appointmentDate, 
      bookingData.duration
    );
    
    if (!availability.available) {
      throw new Error('Service is not available at the requested time');
    }
    
    // Create booking
    const booking: Omit<ServiceBooking, 'id'> = {
      serviceId: bookingData.serviceId,
      participantId: bookingData.participantId,
      shelterId: bookingData.shelterId,
      appointmentDate: Timestamp.fromDate(bookingData.appointmentDate),
      duration: bookingData.duration,
      status: 'pending',
      notes: bookingData.notes,
      confirmationCode: generateConfirmationCode(),
      reminderSent: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      attendeeInfo: {
        participantName: bookingData.participantName,
        participantEmail: bookingData.participantEmail,
        participantPhone: bookingData.participantPhone,
        emergencyContact: bookingData.emergencyContact
      }
    };
    
    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, booking);
    
    return {
      id: docRef.id,
      ...booking
    } as ServiceBooking;
  } catch (error) {
    console.error('Error booking service:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to book service');
  }
}

/**
 * Get participant's bookings
 */
export async function getParticipantBookings(participantId: string): Promise<ServiceBooking[]> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('participantId', '==', participantId),
      orderBy('appointmentDate', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ServiceBooking[];
  } catch (error) {
    console.error('Error fetching participant bookings:', error);
    return [];
  }
}

/**
 * Get shelter's bookings
 */
export async function getShelterBookings(shelterId: string, status?: string): Promise<ServiceBooking[]> {
  try {
    const bookingsRef = collection(db, 'bookings');
    let q = query(
      bookingsRef,
      where('shelterId', '==', shelterId),
      orderBy('appointmentDate', 'desc')
    );
    
    if (status) {
      q = query(
        bookingsRef,
        where('shelterId', '==', shelterId),
        where('status', '==', status),
        orderBy('appointmentDate', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ServiceBooking[];
  } catch (error) {
    console.error('Error fetching shelter bookings:', error);
    return [];
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string, 
  status: ServiceBooking['status'],
  providerNotes?: string
): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      providerNotes,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
}

/**
 * Cancel booking
 */
export async function cancelBooking(bookingId: string, reason?: string): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'cancelled',
      providerNotes: reason,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw new Error('Failed to cancel booking');
  }
}

/**
 * Complete booking with outcome
 */
export async function completeBooking(
  bookingId: string,
  outcome: {
    attended: boolean;
    rating?: number;
    feedback?: string;
    followUpRequired: boolean;
  }
): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'completed',
      outcome,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error completing booking:', error);
    throw new Error('Failed to complete booking');
  }
}

/**
 * Get available time slots for a service on a specific date
 */
export async function getAvailableSlots(
  serviceId: string, 
  date: Date, 
  duration: number = 30
): Promise<AvailableSlot[]> {
  try {
    // Get service details
    const serviceDoc = await getDoc(doc(db, 'services', serviceId));
    if (!serviceDoc.exists()) {
      return [];
    }
    
    const service = serviceDoc.data() as ShelterService;
    const dayOfWeek = date.getDay();
    
    // Find schedule for this day
    const scheduleForDay = service.schedule.find(s => s.dayOfWeek === dayOfWeek);
    if (!scheduleForDay) {
      return [];
    }
    
    // Generate time slots
    const slots: AvailableSlot[] = [];
    const startTime = new Date(date);
    const [startHour, startMinute] = scheduleForDay.startTime.split(':').map(Number);
    startTime.setHours(startHour, startMinute, 0, 0);
    
    const endTime = new Date(date);
    const [endHour, endMinute] = scheduleForDay.endTime.split(':').map(Number);
    endTime.setHours(endHour, endMinute, 0, 0);
    
    const slotDuration = duration * 60000; // Convert to milliseconds
    
    for (let current = new Date(startTime); current < endTime; current = new Date(current.getTime() + slotDuration)) {
      // Skip break time if defined
      if (scheduleForDay.breakTime) {
        const [breakStartHour, breakStartMinute] = scheduleForDay.breakTime.start.split(':').map(Number);
        const [breakEndHour, breakEndMinute] = scheduleForDay.breakTime.end.split(':').map(Number);
        
        const currentHourMinute = current.getHours() * 60 + current.getMinutes();
        const breakStart = breakStartHour * 60 + breakStartMinute;
        const breakEnd = breakEndHour * 60 + breakEndMinute;
        
        if (currentHourMinute >= breakStart && currentHourMinute < breakEnd) {
          continue;
        }
      }
      
      // Check availability for this slot
      const availability = await checkAvailability(serviceId, current, duration);
      
      slots.push({
        datetime: new Date(current),
        duration,
        capacity: availability.capacity,
        bookedCount: availability.bookedCount,
        available: availability.available
      });
    }
    
    return slots;
  } catch (error) {
    console.error('Error getting available slots:', error);
    return [];
  }
}
