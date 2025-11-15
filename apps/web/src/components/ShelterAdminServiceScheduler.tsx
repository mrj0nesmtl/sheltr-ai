'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  Heart,
  Briefcase,
  Scale,
  FileText,
  Utensils,
  Droplets,
  Package,
  X,
  Plus,
  Edit,
  Trash2,
  User,
  Stethoscope,
  GraduationCap
} from 'lucide-react';
import {
  getShelterServices,
  getServicesByCategory,
  bookService,
  getAvailableSlots,
  SERVICE_CATEGORIES,
  type ShelterService,
  type ServiceBooking as ServiceBookingType,
  type AvailableSlot,
  type ServiceCategory
} from '@/services/serviceBookingService';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { shelterService } from '@/services/shelterService';

interface ShelterAdminServiceSchedulerProps {
  shelterId: string;
  onBookingComplete?: (booking: ServiceBookingType) => void;
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

const getCategoryIcon = (iconName: string) => {
  const icons = {
    Heart: <Heart className="h-6 w-6" />,
    Briefcase: <Briefcase className="h-6 w-6" />,
    Scale: <Scale className="h-6 w-6" />,
    FileText: <FileText className="h-6 w-6" />,
    Users: <Users className="h-6 w-6" />,
    Utensils: <Utensils className="h-6 w-6" />,
    Droplets: <Droplets className="h-6 w-6" />,
    Package: <Package className="h-6 w-6" />,
    Stethoscope: <Stethoscope className="h-6 w-6" />,
    GraduationCap: <GraduationCap className="h-6 w-6" />
  };
  return icons[iconName as keyof typeof icons] || <FileText className="h-6 w-6" />;
};

// Map shelter service names to icons and colors
const getServiceIconAndColor = (serviceName: string): { icon: string; color: string; description: string } => {
  const lowerName = serviceName.toLowerCase();
  
  // Medical/Healthcare services
  if (lowerName.includes('medical') || lowerName.includes('health') || lowerName.includes('clinic')) {
    return { icon: 'Stethoscope', color: 'red', description: 'Medical and health services' };
  }
  // Mental Health services
  if (lowerName.includes('mental') || lowerName.includes('counseling') || lowerName.includes('therapy')) {
    return { icon: 'Heart', color: 'purple', description: 'Mental health and counseling' };
  }
  // Employment/Job services
  if (lowerName.includes('job') || lowerName.includes('employment') || lowerName.includes('training') || lowerName.includes('career')) {
    return { icon: 'Briefcase', color: 'blue', description: 'Employment and job training' };
  }
  // Housing services
  if (lowerName.includes('housing') || lowerName.includes('shelter') || lowerName.includes('overnight')) {
    return { icon: 'Users', color: 'green', description: 'Housing and shelter services' };
  }
  // Food/Meals services
  if (lowerName.includes('meal') || lowerName.includes('food') || lowerName.includes('nutrition')) {
    return { icon: 'Utensils', color: 'orange', description: 'Meals and nutrition' };
  }
  // Case Management services
  if (lowerName.includes('case') || lowerName.includes('management') || lowerName.includes('coordination')) {
    return { icon: 'FileText', color: 'teal', description: 'Case management and coordination' };
  }
  // Substance Abuse services
  if (lowerName.includes('substance') || lowerName.includes('addiction') || lowerName.includes('recovery')) {
    return { icon: 'Heart', color: 'cyan', description: 'Substance abuse support' };
  }
  // Legal services
  if (lowerName.includes('legal')) {
    return { icon: 'Scale', color: 'purple', description: 'Legal assistance' };
  }
  // Education services
  if (lowerName.includes('education') || lowerName.includes('learning')) {
    return { icon: 'GraduationCap', color: 'blue', description: 'Education and learning' };
  }
  
  // Default fallback
  return { icon: 'FileText', color: 'gray', description: 'General services' };
};

const getCategoryStyle = (color: string) => {
  const styles = {
    red: 'border-2 border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20',
    blue: 'border-2 border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    purple: 'border-2 border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    green: 'border-2 border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20',
    teal: 'border-2 border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-900/20',
    orange: 'border-2 border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    cyan: 'border-2 border-cyan-500 text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20',
    gray: 'border-2 border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-900/20'
  };
  return styles[color as keyof typeof styles] || 'border-2 border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-900/20';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    case 'no_show': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

export function ShelterAdminServiceScheduler({ 
  shelterId, 
  onBookingComplete
}: ShelterAdminServiceSchedulerProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'schedule' | 'all-bookings' | 'manage-services'>('schedule');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [services, setServices] = useState<ShelterService[]>([]);
  const [configuredServices, setConfiguredServices] = useState<string[]>([]); // NEW: Shelter's configured services from settings
  const [selectedService, setSelectedService] = useState<ShelterService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [allBookings, setAllBookings] = useState<ServiceBookingType[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ServiceBookingType | null>(null);
  
  // Booking form data
  const [bookingForm, setBookingForm] = useState({
    participantPhone: '',
    emergencyContact: '',
    notes: '',
    providerNotes: ''
  });

  // Load shelter's configured services from public_config
  useEffect(() => {
    loadConfiguredServices();
  }, [shelterId]);

  // Load participants for this shelter
  useEffect(() => {
    loadParticipants();
  }, [shelterId]);

  // Load services when category is selected
  useEffect(() => {
    if (selectedCategory) {
      loadServicesByCategory();
    }
  }, [selectedCategory, shelterId]);

  // Load available slots when service and date are selected
  useEffect(() => {
    if (selectedService && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedService, selectedDate]);

  // Load all bookings for the shelter
  useEffect(() => {
    loadAllBookings();
  }, [shelterId]);

  const loadConfiguredServices = async () => {
    try {
      console.log('🔍 Loading configured services for shelter:', shelterId);
      const publicConfig = await shelterService.getShelterPublicConfig(shelterId);
      
      if (publicConfig?.services && Array.isArray(publicConfig.services)) {
        setConfiguredServices(publicConfig.services);
        console.log(`✅ Loaded ${publicConfig.services.length} configured services:`, publicConfig.services);
      } else {
        console.warn('⚠️ No configured services found in public_config');
        setConfiguredServices([]);
      }
    } catch (err) {
      console.error('❌ Error loading configured services:', err);
      setConfiguredServices([]);
    }
  };

  const loadParticipants = async () => {
    try {
      console.log('🔍 Loading participants for shelter:', shelterId);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('shelter_id', '==', shelterId), where('role', '==', 'participant'));
      const querySnapshot = await getDocs(q);
      
      const participantList: Participant[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        participantList.push({
          id: doc.id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || ''
        });
      });
      
      console.log(`✅ Loaded ${participantList.length} participants`);
      setParticipants(participantList);
    } catch (err) {
      console.error('❌ Error loading participants:', err);
      setError('Failed to load participants');
    }
  };

  const loadServicesByCategory = async () => {
    if (!selectedCategory) return;
    
    setLoading(true);
    try {
      const categoryServices = await getServicesByCategory(shelterId, selectedCategory.id);
      
      // If no services found in Firestore, provide demo services for the category
      if (categoryServices.length === 0) {
        const demoServices = getDemoServicesForCategory(selectedCategory.id, selectedCategory.name);
        setServices(demoServices);
        console.log(`⚠️ No real services found, using ${demoServices.length} demo services for "${selectedCategory.name}"`);
      } else {
        setServices(categoryServices);
        console.log(`✅ Loaded ${categoryServices.length} real services`);
      }
    } catch (err) {
      console.error('Error loading services:', err);
      // Fallback to demo services on error
      const demoServices = getDemoServicesForCategory(selectedCategory.id, selectedCategory.name);
      setServices(demoServices);
    } finally {
      setLoading(false);
    }
  };

  // Demo services fallback function with intelligent service name matching
  const getDemoServicesForCategory = (categoryId: string, categoryName: string): ShelterService[] => {
    // Map the configured service name to a demo service type
    const nameToType = (name: string): string => {
      const lower = name.toLowerCase();
      if (lower.includes('medical') || lower.includes('health') || lower.includes('clinic')) return 'healthcare';
      if (lower.includes('mental')) return 'mental-health';
      if (lower.includes('job') || lower.includes('employment') || lower.includes('training') || lower.includes('career')) return 'employment';
      if (lower.includes('housing') || lower.includes('shelter') || lower.includes('overnight')) return 'housing';
      if (lower.includes('meal') || lower.includes('food') || lower.includes('nutrition')) return 'meals';
      if (lower.includes('case') || lower.includes('management')) return 'case-management';
      if (lower.includes('substance') || lower.includes('addiction')) return 'substance-abuse';
      return 'general';
    };
    
    const mappedType = nameToType(categoryName);
    console.log(`🔄 Mapping "${categoryName}" (${categoryId}) → "${mappedType}" for demo services`);
    
    const demoServices: { [key: string]: ShelterService[] } = {
      healthcare: [
        {
          id: 'demo-healthcare-1',
          categoryId: 'healthcare',
          shelterId: shelterId,
          name: 'Medical Check-up',
          description: 'General health assessment and basic medical care',
          provider: 'Dr. Sarah Johnson',
          location: 'Medical Room A',
          duration: 30,
          capacity: 4,
          cost: 0,
          requirements: ['Photo ID required', 'Fasting for 12 hours if blood work needed'],
          isActive: true,
          schedule: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ],
      employment: [
        {
          id: 'demo-employment-1',
          categoryId: 'employment',
          shelterId: shelterId,
          name: 'Job Interview Preparation',
          description: 'Practice interviews and resume review',
          provider: 'Career Counselor',
          location: 'Career Center',
          duration: 60,
          capacity: 1,
          cost: 0,
          requirements: ['Bring current resume if available'],
          isActive: true,
          schedule: [
            { dayOfWeek: 1, startTime: '10:00', endTime: '16:00' },
            { dayOfWeek: 3, startTime: '10:00', endTime: '16:00' },
            { dayOfWeek: 5, startTime: '10:00', endTime: '16:00' }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        },
        {
          id: 'demo-employment-2',
          categoryId: 'employment',
          shelterId: shelterId,
          name: 'Resume Writing Workshop',
          description: 'Learn to create effective resumes and cover letters',
          provider: 'HR Specialist',
          location: 'Training Room B',
          duration: 90,
          capacity: 8,
          cost: 0,
          requirements: [],
          isActive: true,
          schedule: [
            { dayOfWeek: 2, startTime: '14:00', endTime: '16:00' },
            { dayOfWeek: 4, startTime: '14:00', endTime: '16:00' }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ],
      legal: [
        {
          id: 'demo-legal-1',
          categoryId: 'legal',
          shelterId: shelterId,
          name: 'Legal Aid Consultation',
          description: 'Free legal advice and assistance',
          provider: 'Legal Aid Society',
          location: 'Conference Room B',
          duration: 45,
          capacity: 1,
          cost: 0,
          requirements: ['Bring all relevant documents'],
          isActive: true,
          schedule: [
            { dayOfWeek: 2, startTime: '13:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '13:00', endTime: '17:00' }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ],
      counseling: [
        {
          id: 'demo-counseling-1',
          categoryId: 'counseling',
          shelterId: shelterId,
          name: 'Mental Health Counseling',
          description: 'Individual counseling sessions',
          provider: 'Therapist Amanda',
          location: 'Counseling Room',
          duration: 60,
          capacity: 1,
          cost: 0,
          requirements: [],
          isActive: true,
          schedule: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ],
      'mental-health': [ // Mapped from "Mental Health Support"
        {
          id: 'demo-mental-health-1',
          categoryId: 'mental-health',
          shelterId: shelterId,
          name: 'Mental Health Support Session',
          description: 'Confidential mental health support and counseling',
          provider: 'Mental Health Counselor',
          location: 'Private Counseling Room',
          duration: 60,
          capacity: 1,
          cost: 0,
          requirements: [],
          isActive: true,
          schedule: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ],
      housing: [ // Mapped from "Emergency Overnight Shelter" and "Housing Assistance"
        {
          id: 'demo-housing-1',
          categoryId: 'housing',
          shelterId: shelterId,
          name: 'Shelter Bed Assignment',
          description: 'Emergency overnight shelter bed assignment',
          provider: 'Intake Coordinator',
          location: 'Main Shelter Building',
          duration: 30,
          capacity: 10,
          cost: 0,
          requirements: ['Photo ID preferred but not required'],
          isActive: true,
          schedule: [
            { dayOfWeek: 1, startTime: '16:00', endTime: '20:00' },
            { dayOfWeek: 2, startTime: '16:00', endTime: '20:00' },
            { dayOfWeek: 3, startTime: '16:00', endTime: '20:00' },
            { dayOfWeek: 4, startTime: '16:00', endTime: '20:00' },
            { dayOfWeek: 5, startTime: '16:00', endTime: '20:00' },
            { dayOfWeek: 6, startTime: '16:00', endTime: '20:00' },
            { dayOfWeek: 0, startTime: '16:00', endTime: '20:00' }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ],
      meals: [ // Mapped from "Meals and Basic Necessities"
        {
          id: 'demo-meals-1',
          categoryId: 'meals',
          shelterId: shelterId,
          name: 'Meal Service',
          description: 'Hot meals served daily',
          provider: 'Kitchen Staff',
          location: 'Dining Hall',
          duration: 15,
          capacity: 50,
          cost: 0,
          requirements: [],
          isActive: true,
          schedule: [
            { dayOfWeek: 1, startTime: '07:00', endTime: '09:00' },
            { dayOfWeek: 1, startTime: '12:00', endTime: '14:00' },
            { dayOfWeek: 1, startTime: '17:00', endTime: '19:00' },
            { dayOfWeek: 2, startTime: '07:00', endTime: '09:00' },
            { dayOfWeek: 2, startTime: '12:00', endTime: '14:00' },
            { dayOfWeek: 2, startTime: '17:00', endTime: '19:00' },
            { dayOfWeek: 3, startTime: '07:00', endTime: '09:00' },
            { dayOfWeek: 3, startTime: '12:00', endTime: '14:00' },
            { dayOfWeek: 3, startTime: '17:00', endTime: '19:00' }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ],
      'case-management': [ // Mapped from "Case Management Services"
        {
          id: 'demo-case-management-1',
          categoryId: 'case-management',
          shelterId: shelterId,
          name: 'Case Management Consultation',
          description: 'Personalized case management and service coordination',
          provider: 'Case Manager',
          location: 'Case Management Office',
          duration: 45,
          capacity: 2,
          cost: 0,
          requirements: [],
          isActive: true,
          schedule: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ],
      'substance-abuse': [ // Mapped from "Substance Abuse Support"
        {
          id: 'demo-substance-abuse-1',
          categoryId: 'substance-abuse',
          shelterId: shelterId,
          name: 'Substance Abuse Counseling',
          description: 'Confidential substance abuse support and recovery planning',
          provider: 'Addiction Counselor',
          location: 'Counseling Room C',
          duration: 60,
          capacity: 1,
          cost: 0,
          requirements: [],
          isActive: true,
          schedule: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ]
    };

    // Try to find services for the mapped type, fall back to categoryId, then empty array
    const servicesForType = demoServices[mappedType] || demoServices[categoryId] || [];
    
    // If no demo services found, create a generic one for this service
    if (servicesForType.length === 0) {
      console.log(`⚠️ No demo services for "${mappedType}", creating generic service for "${categoryName}"`);
      return [{
        id: `demo-${categoryId}-1`,
        categoryId: categoryId,
        shelterId: shelterId,
        name: `${categoryName} Appointment`,
        description: `Schedule an appointment for ${categoryName.toLowerCase()}`,
        provider: 'Staff Member',
        location: 'Main Office',
        duration: 60,
        capacity: 5,
        cost: 0,
        requirements: ['Please arrive 10 minutes early'],
        isActive: true,
        schedule: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
          { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } }
        ],
        createdAt: { toDate: () => new Date() } as any,
        updatedAt: { toDate: () => new Date() } as any
      }];
    }
    
    return servicesForType;
  };

  const loadAvailableSlots = async () => {
    if (!selectedService || !selectedDate) return;
    
    setLoading(true);
    try {
      // Check if this is a demo service (starts with 'demo-')
      if (selectedService.id.startsWith('demo-')) {
        const demoSlots = generateDemoAvailableSlots(selectedService, selectedDate);
        setAvailableSlots(demoSlots);
      } else {
        const slots = await getAvailableSlots(selectedService.id, selectedDate, selectedService.duration);
        setAvailableSlots(slots);
      }
    } catch (err) {
      console.error('Error loading slots:', err);
      // Fallback to demo slots on error
      const demoSlots = generateDemoAvailableSlots(selectedService, selectedDate);
      setAvailableSlots(demoSlots);
    } finally {
      setLoading(false);
    }
  };

  // Generate demo available slots
  const generateDemoAvailableSlots = (service: ShelterService, date: Date): AvailableSlot[] => {
    const dayOfWeek = date.getDay();
    const slots: AvailableSlot[] = [];
    
    // Find schedule for this day
    const scheduleForDay = service.schedule.find(s => s.dayOfWeek === dayOfWeek);
    if (!scheduleForDay) {
      return []; // No service on this day
    }
    
    // Generate time slots
    const startTime = new Date(date);
    const [startHour, startMinute] = scheduleForDay.startTime.split(':').map(Number);
    startTime.setHours(startHour, startMinute, 0, 0);
    
    const endTime = new Date(date);
    const [endHour, endMinute] = scheduleForDay.endTime.split(':').map(Number);
    endTime.setHours(endHour, endMinute, 0, 0);
    
    const slotDuration = service.duration * 60000; // Convert to milliseconds
    
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
      
      // Generate realistic availability (some slots partially booked)
      const totalCapacity = service.capacity;
      const bookedCount = Math.floor(Math.random() * totalCapacity); // Random bookings
      const available = bookedCount < totalCapacity;
      
      slots.push({
        datetime: new Date(current),
        duration: service.duration,
        capacity: totalCapacity,
        bookedCount: bookedCount,
        available: available
      });
    }
    
    return slots;
  };

  const loadAllBookings = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      console.log('📅 Loading all bookings for shelter:', shelterId);
      
      // Load real bookings from Firebase
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('shelterId', '==', shelterId));
      const querySnapshot = await getDocs(q);
      
      const bookingsList: ServiceBookingType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookingsList.push({
          id: doc.id,
          ...data
        } as ServiceBookingType);
      });
      
      // Also load demo bookings from localStorage
      let shelterDemoBookings: any[] = [];
      try {
        const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
        shelterDemoBookings = demoBookings.filter((b: any) => b.shelterId === shelterId);
      } catch (localStorageErr) {
        console.warn('Could not load demo bookings from localStorage:', localStorageErr);
      }
      
      // Combine real and demo bookings
      const allBookingsList = [...bookingsList, ...shelterDemoBookings];
      
      // Sort by appointment date (newest first) - only if there are bookings
      if (allBookingsList.length > 0) {
        allBookingsList.sort((a, b) => {
          try {
            const dateA = a.appointmentDate?.toDate ? a.appointmentDate.toDate() : new Date(a.appointmentDate);
            const dateB = b.appointmentDate?.toDate ? b.appointmentDate.toDate() : new Date(b.appointmentDate);
            return dateB.getTime() - dateA.getTime();
          } catch (sortErr) {
            console.warn('Error sorting bookings:', sortErr);
            return 0;
          }
        });
      }
      
      console.log(`✅ Loaded ${allBookingsList.length} total bookings (${bookingsList.length} real, ${shelterDemoBookings.length} demo)`);
      setAllBookings(allBookingsList);
      
      // If no bookings, that's OK - not an error
      if (allBookingsList.length === 0) {
        console.log('ℹ️ No bookings found yet - this is normal for a new shelter');
      }
    } catch (err) {
      console.error('❌ Error loading bookings:', err);
      // Don't set error state if it's just "no bookings found"
      // Only set error for actual failures
      if (err instanceof Error && !err.message.includes('not found')) {
        setError('Failed to load bookings');
      } else {
        // No bookings is not an error
        setAllBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleAppointment = async () => {
    if (!selectedService || !selectedSlot || !selectedParticipant) {
      setError('Please select a service, time slot, and participant');
      return;
    }
    
    setLoading(true);
    try {
      let booking;
      
      // Handle demo services differently
      if (selectedService.id.startsWith('demo-')) {
        // Create a demo booking (just for UI demonstration)
        booking = {
          id: `demo-booking-${Date.now()}`,
          serviceId: selectedService.id,
          participantId: selectedParticipant.id,
          shelterId,
          appointmentDate: { toDate: () => selectedSlot.datetime } as any,
          duration: selectedSlot.duration,
          status: 'confirmed' as const,
          notes: bookingForm.notes,
          providerNotes: bookingForm.providerNotes,
          confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          reminderSent: false,
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any,
          attendeeInfo: {
            participantName: `${selectedParticipant.firstName} ${selectedParticipant.lastName}`,
            participantEmail: selectedParticipant.email,
            participantPhone: bookingForm.participantPhone || selectedParticipant.phone,
            emergencyContact: bookingForm.emergencyContact
          }
        };
        
        // Store demo booking in localStorage
        const existingBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('demoBookings', JSON.stringify(existingBookings));
        
        console.log('✅ Demo booking created:', booking.confirmationCode);
      } else {
        // Real booking through Firebase
        booking = await bookService({
          serviceId: selectedService.id,
          participantId: selectedParticipant.id,
          shelterId,
          appointmentDate: selectedSlot.datetime,
          duration: selectedSlot.duration,
          participantName: `${selectedParticipant.firstName} ${selectedParticipant.lastName}`,
          participantEmail: selectedParticipant.email,
          participantPhone: bookingForm.participantPhone || selectedParticipant.phone,
          emergencyContact: bookingForm.emergencyContact,
          notes: bookingForm.notes
        });
        
        console.log('✅ Real booking created:', booking.confirmationCode);
      }
      
      onBookingComplete?.(booking);
      setShowBookingDialog(false);
      setActiveView('all-bookings');
      await loadAllBookings();
      
      // Reset form
      setSelectedService(null);
      setSelectedSlot(null);
      setSelectedDate(new Date());
      setSelectedParticipant(null);
      setBookingForm({
        participantPhone: '',
        emergencyContact: '',
        notes: '',
        providerNotes: ''
      });
      
    } catch (err) {
      console.error('❌ Error scheduling appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: ServiceBookingType['status'], providerNotes?: string) => {
    setLoading(true);
    try {
      // Check if this is a demo booking
      if (bookingId.startsWith('demo-booking-')) {
        // Update demo booking in localStorage
        const existingBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
        const updatedBookings = existingBookings.map((b: any) => {
          if (b.id === bookingId) {
            return {
              ...b,
              status: newStatus,
              providerNotes: providerNotes || b.providerNotes,
              updatedAt: { toDate: () => new Date() }
            };
          }
          return b;
        });
        localStorage.setItem('demoBookings', JSON.stringify(updatedBookings));
        console.log('✅ Demo booking status updated');
      } else {
        // Update real booking in Firebase
        const bookingRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingRef, {
          status: newStatus,
          ...(providerNotes && { providerNotes }),
          updatedAt: Timestamp.now()
        });
        console.log('✅ Real booking status updated');
      }
      
      setShowStatusDialog(false);
      await loadAllBookings();
    } catch (err) {
      console.error('❌ Error updating booking status:', err);
      setError('Failed to update booking status');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setError(null);
              loadAllBookings();
            }}
            className="mt-2"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex space-x-2">
        <Button 
          variant={activeView === 'schedule' ? 'default' : 'outline'}
          onClick={() => setActiveView('schedule')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
        <Button 
          variant={activeView === 'all-bookings' ? 'default' : 'outline'}
          onClick={() => setActiveView('all-bookings')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          All Bookings
        </Button>
        <Button 
          variant={activeView === 'manage-services' ? 'default' : 'outline'}
          onClick={() => setActiveView('manage-services')}
        >
          <Edit className="mr-2 h-4 w-4" />
          Manage Services
        </Button>
      </div>

      {/* Schedule Appointment View */}
      {activeView === 'schedule' && (
        <div className="space-y-6">
          {/* Configured Services */}
          {!selectedCategory && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose a Service Category</h3>
              {configuredServices.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <p>No services configured yet. Please configure services in Settings → Services.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {configuredServices.map((serviceName, index) => {
                    const { icon, color, description } = getServiceIconAndColor(serviceName);
                    const serviceCategory: ServiceCategory = {
                      id: serviceName.toLowerCase().replace(/\s+/g, '-'),
                      name: serviceName,
                      description: description,
                      icon: icon,
                      color: color,
                      requiresAppointment: true,
                      maxDuration: 60,
                      advanceBookingDays: 14
                    };
                    
                    return (
                      <Card 
                        key={index}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedCategory(serviceCategory)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg ${getCategoryStyle(color)}`}>
                              {getCategoryIcon(icon)}
                            </div>
                            <div>
                              <h4 className="font-medium">{serviceName}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Services in Category */}
          {selectedCategory && !selectedService && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedCategory.name} Services</h3>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory(null);
                    setServices([]);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Back to Categories
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading services...</div>
              ) : services.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      No services available in this category
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {services.map((service) => (
                    <Card key={service.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{service.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                            
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{service.duration} min</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{service.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>Capacity: {service.capacity}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{service.provider}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => setSelectedService(service)}
                          >
                            Select Service
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Booking Interface */}
          {selectedService && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Schedule: {selectedService.name}</h3>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedService(null);
                    setSelectedSlot(null);
                    setSelectedParticipant(null);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Back to Services
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Participant Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Participant</CardTitle>
                    <CardDescription>Choose the participant for this appointment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={selectedParticipant?.id}
                      onValueChange={(value) => {
                        const participant = participants.find(p => p.id === value);
                        setSelectedParticipant(participant || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a participant" />
                      </SelectTrigger>
                      <SelectContent>
                        {participants.map((participant) => (
                          <SelectItem key={participant.id} value={participant.id}>
                            {participant.firstName} {participant.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedParticipant && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">{selectedParticipant.firstName} {selectedParticipant.lastName}</p>
                        {selectedParticipant.email && (
                          <p className="text-sm text-muted-foreground">{selectedParticipant.email}</p>
                        )}
                        {selectedParticipant.phone && (
                          <p className="text-sm text-muted-foreground">{selectedParticipant.phone}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Date Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date > new Date(Date.now() + (selectedCategory?.advanceBookingDays || 30) * 24 * 60 * 60 * 1000)}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Time Slot Selection */}
              {selectedParticipant && selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Times</CardTitle>
                    <CardDescription>
                      {selectedDate.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-4">Loading available times...</div>
                    ) : availableSlots.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No available times for this date
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {availableSlots.map((slot, index) => (
                          <Button
                            key={index}
                            variant={selectedSlot === slot ? "default" : "outline"}
                            size="sm"
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slot)}
                            className="justify-center"
                          >
                            <div className="text-center">
                              <div>{formatTime(slot.datetime)}</div>
                              <div className="text-xs">
                                {slot.available ? `${slot.capacity - slot.bookedCount} available` : 'Full'}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Booking Confirmation */}
              {selectedSlot && selectedParticipant && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Ready to Schedule</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {selectedService.name} for {selectedParticipant.firstName} {selectedParticipant.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedDate?.toLocaleDateString()} at {formatTime(selectedSlot.datetime)}
                        </p>
                      </div>
                      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                        <DialogTrigger asChild>
                          <Button>Confirm Booking</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Appointment</DialogTitle>
                            <DialogDescription>
                              Add any additional notes for this appointment.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="participantPhone">Phone Number (optional)</Label>
                              <Input
                                id="participantPhone"
                                value={bookingForm.participantPhone}
                                onChange={(e) => setBookingForm(prev => ({ ...prev, participantPhone: e.target.value }))}
                                placeholder={selectedParticipant.phone || 'Enter phone number'}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="emergencyContact">Emergency Contact (optional)</Label>
                              <Input
                                id="emergencyContact"
                                value={bookingForm.emergencyContact}
                                onChange={(e) => setBookingForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                                placeholder="Emergency contact name and number"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="notes">Participant Notes (optional)</Label>
                              <Textarea
                                id="notes"
                                value={bookingForm.notes}
                                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Any special requirements or information..."
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="providerNotes">Provider Notes (optional)</Label>
                              <Textarea
                                id="providerNotes"
                                value={bookingForm.providerNotes}
                                onChange={(e) => setBookingForm(prev => ({ ...prev, providerNotes: e.target.value }))}
                                placeholder="Internal notes for the service provider..."
                              />
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                onClick={handleScheduleAppointment}
                                disabled={loading}
                                className="flex-1"
                              >
                                {loading ? 'Scheduling...' : 'Confirm Appointment'}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setShowBookingDialog(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* All Bookings View */}
      {activeView === 'all-bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Appointments</h3>
            <Badge variant="outline">
              {allBookings.length} Total
            </Badge>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : allBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-gray-500">
                    No appointments scheduled yet
                  </div>
                  <Button 
                    onClick={() => setActiveView('schedule')}
                    className="mx-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule First Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {allBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">Booking #{booking.confirmationCode}</h4>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600 dark:text-gray-400">
                            <strong>Participant:</strong> {booking.attendeeInfo.participantName}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <strong>Date & Time:</strong> {formatDate(booking.appointmentDate)}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <strong>Duration:</strong> {booking.duration} minutes
                          </p>
                          {booking.attendeeInfo.participantPhone && (
                            <p className="text-gray-600 dark:text-gray-400">
                              <strong>Phone:</strong> {booking.attendeeInfo.participantPhone}
                            </p>
                          )}
                          {booking.notes && (
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          )}
                          {booking.providerNotes && (
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                              <strong>Provider Notes:</strong> {booking.providerNotes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Dialog open={showStatusDialog && selectedBooking?.id === booking.id} onOpenChange={(open) => {
                          setShowStatusDialog(open);
                          if (open) setSelectedBooking(booking);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Update Status
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Appointment Status</DialogTitle>
                              <DialogDescription>
                                Change the status of this appointment
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  variant={booking.status === 'confirmed' ? 'default' : 'outline'}
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                >
                                  Confirmed
                                </Button>
                                <Button
                                  variant={booking.status === 'completed' ? 'default' : 'outline'}
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                                >
                                  Completed
                                </Button>
                                <Button
                                  variant={booking.status === 'cancelled' ? 'default' : 'outline'}
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                >
                                  Cancelled
                                </Button>
                                <Button
                                  variant={booking.status === 'no_show' ? 'default' : 'outline'}
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'no_show')}
                                >
                                  No Show
                                </Button>
                              </div>
                              
                              <div>
                                <Label htmlFor="statusProviderNotes">Provider Notes</Label>
                                <Textarea
                                  id="statusProviderNotes"
                                  value={bookingForm.providerNotes}
                                  onChange={(e) => setBookingForm(prev => ({ ...prev, providerNotes: e.target.value }))}
                                  placeholder="Add notes about this appointment..."
                                />
                              </div>
                              
                              <Button 
                                onClick={() => handleUpdateBookingStatus(booking.id, booking.status, bookingForm.providerNotes)}
                                className="w-full"
                              >
                                Save Notes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manage Services View */}
      {activeView === 'manage-services' && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-gray-500">
                Service management coming soon!
              </div>
              <p className="text-sm text-muted-foreground">
                This feature will allow you to create, edit, and manage services for your shelter.
              </p>
              <Button variant="outline" disabled>
                <Plus className="mr-2 h-4 w-4" />
                Create New Service
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

