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
  X
} from 'lucide-react';
import {
  getShelterServices,
  getServicesByCategory,
  bookService,
  getParticipantBookings,
  getAvailableSlots,
  SERVICE_CATEGORIES,
  type ShelterService,
  type ServiceBooking,
  type AvailableSlot,
  type ServiceCategory
} from '@/services/serviceBookingService';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceBookingProps {
  shelterId: string;
  participantId: string;
  onBookingComplete?: (booking: ServiceBooking) => void;
  showMyBookings?: boolean;
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
    Package: <Package className="h-6 w-6" />
  };
  return icons[iconName as keyof typeof icons] || <FileText className="h-6 w-6" />;
};

const getCategoryStyle = (color: string) => {
  const styles = {
    red: 'border-2 border-red-500 text-red-600 bg-transparent',
    blue: 'border-2 border-blue-500 text-blue-600 bg-transparent',
    purple: 'border-2 border-purple-500 text-purple-600 bg-transparent',
    green: 'border-2 border-green-500 text-green-600 bg-transparent',
    teal: 'border-2 border-teal-500 text-teal-600 bg-transparent',
    orange: 'border-2 border-orange-500 text-orange-600 bg-transparent',
    cyan: 'border-2 border-cyan-500 text-cyan-600 bg-transparent',
    gray: 'border-2 border-gray-500 text-gray-600 bg-transparent'
  };
  return styles[color as keyof typeof styles] || 'border-2 border-gray-500 text-gray-600 bg-transparent';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'text-green-600 border border-green-500 bg-transparent';
    case 'pending': return 'text-yellow-600 border border-yellow-500 bg-transparent';
    case 'completed': return 'text-blue-600 border border-blue-500 bg-transparent';
    case 'cancelled': return 'text-red-600 border border-red-500 bg-transparent';
    case 'no_show': return 'text-gray-600 border border-gray-500 bg-transparent';
    default: return 'text-gray-600 border border-gray-500 bg-transparent';
  }
};

export function ServiceBooking({ 
  shelterId, 
  participantId, 
  onBookingComplete,
  showMyBookings = true 
}: ServiceBookingProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'browse' | 'book' | 'my-bookings'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [services, setServices] = useState<ShelterService[]>([]);
  const [selectedService, setSelectedService] = useState<ShelterService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [myBookings, setMyBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  
  // Booking form data
  const [bookingForm, setBookingForm] = useState({
    participantName: user?.displayName || '',
    participantEmail: user?.email || '',
    participantPhone: '',
    emergencyContact: '',
    notes: ''
  });

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

  // Load participant's bookings
  useEffect(() => {
    if (showMyBookings) {
      loadMyBookings();
    }
  }, [participantId, showMyBookings]);

  const loadServicesByCategory = async () => {
    if (!selectedCategory) return;
    
    setLoading(true);
    try {
      const categoryServices = await getServicesByCategory(shelterId, selectedCategory.id);
      
      // If no services found in Firestore, provide demo services for the category
      if (categoryServices.length === 0) {
        const demoServices = getDemoServicesForCategory(selectedCategory.id);
        setServices(demoServices);
      } else {
        setServices(categoryServices);
      }
    } catch (err) {
      console.error('Error loading services:', err);
      // Fallback to demo services on error
      const demoServices = getDemoServicesForCategory(selectedCategory.id);
      setServices(demoServices);
    } finally {
      setLoading(false);
    }
  };

  // Demo services fallback function
  const getDemoServicesForCategory = (categoryId: string): ShelterService[] => {
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
          provider: 'Career Counselor Mike',
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
          provider: 'HR Specialist Jennifer',
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
      benefits: [
        {
          id: 'demo-benefits-1',
          categoryId: 'benefits',
          shelterId: shelterId,
          name: 'Government Benefits Application',
          description: 'Assistance with applying for government benefits',
          provider: 'Social Worker Lisa',
          location: 'Benefits Office',
          duration: 30,
          capacity: 2,
          cost: 0,
          requirements: ['Birth certificate or ID', 'Social security card if available'],
          isActive: true,
          schedule: [
            { dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
            { dayOfWeek: 2, startTime: '08:00', endTime: '12:00' },
            { dayOfWeek: 3, startTime: '08:00', endTime: '12:00' },
            { dayOfWeek: 4, startTime: '08:00', endTime: '12:00' },
            { dayOfWeek: 5, startTime: '08:00', endTime: '12:00' }
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
      meals: [
        {
          id: 'demo-meals-1',
          categoryId: 'meals',
          shelterId: shelterId,
          name: 'Hot Meal Service',
          description: 'Nutritious hot meals served daily',
          provider: 'Kitchen Staff',
          location: 'Dining Hall',
          duration: 30,
          capacity: 50,
          cost: 0,
          requirements: [],
          isActive: true,
          schedule: [
            { dayOfWeek: 0, startTime: '07:00', endTime: '09:00' },
            { dayOfWeek: 0, startTime: '12:00', endTime: '14:00' },
            { dayOfWeek: 0, startTime: '17:00', endTime: '19:00' },
            { dayOfWeek: 1, startTime: '07:00', endTime: '09:00' },
            { dayOfWeek: 1, startTime: '12:00', endTime: '14:00' },
            { dayOfWeek: 1, startTime: '17:00', endTime: '19:00' }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ],
      shower: [
        {
          id: 'demo-shower-1',
          categoryId: 'shower',
          shelterId: shelterId,
          name: 'Shower & Personal Care',
          description: 'Private shower facilities with towels and basic toiletries',
          provider: 'Facility Staff',
          location: 'Shower Facilities',
          duration: 30,
          capacity: 4,
          cost: 0,
          requirements: [],
          isActive: true,
          schedule: [
            { dayOfWeek: 0, startTime: '06:00', endTime: '22:00' },
            { dayOfWeek: 1, startTime: '06:00', endTime: '22:00' },
            { dayOfWeek: 2, startTime: '06:00', endTime: '22:00' },
            { dayOfWeek: 3, startTime: '06:00', endTime: '22:00' },
            { dayOfWeek: 4, startTime: '06:00', endTime: '22:00' },
            { dayOfWeek: 5, startTime: '06:00', endTime: '22:00' },
            { dayOfWeek: 6, startTime: '06:00', endTime: '22:00' }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ],
      storage: [
        {
          id: 'demo-storage-1',
          categoryId: 'storage',
          shelterId: shelterId,
          name: 'Personal Storage Locker',
          description: 'Secure storage for personal belongings',
          provider: 'Security Staff',
          location: 'Storage Facility',
          duration: 15,
          capacity: 20,
          cost: 0,
          requirements: ['Valid ID required'],
          isActive: true,
          schedule: [
            { dayOfWeek: 1, startTime: '08:00', endTime: '20:00' },
            { dayOfWeek: 2, startTime: '08:00', endTime: '20:00' },
            { dayOfWeek: 3, startTime: '08:00', endTime: '20:00' },
            { dayOfWeek: 4, startTime: '08:00', endTime: '20:00' },
            { dayOfWeek: 5, startTime: '08:00', endTime: '20:00' },
            { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 0, startTime: '10:00', endTime: '18:00' }
          ],
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any
        }
      ]
    };

    return demoServices[categoryId] || [];
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

  const loadMyBookings = async () => {
    setLoading(true);
    try {
      // Load real bookings from Firebase
      let realBookings = [];
      try {
        realBookings = await getParticipantBookings(participantId);
      } catch (err) {
        console.log('No real bookings found, using demo bookings only');
      }
      
      // Load demo bookings from localStorage
      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      
      // Combine real and demo bookings
      const allBookings = [...realBookings, ...demoBookings];
      setMyBookings(allBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async () => {
    if (!selectedService || !selectedSlot) return;
    
    setLoading(true);
    try {
      let booking;
      
      // Handle demo services differently
      if (selectedService.id.startsWith('demo-')) {
        // Create a demo booking (just for UI demonstration)
        booking = {
          id: `demo-booking-${Date.now()}`,
          serviceId: selectedService.id,
          participantId,
          shelterId,
          appointmentDate: { toDate: () => selectedSlot.datetime } as any,
          duration: selectedSlot.duration,
          status: 'confirmed' as const,
          notes: bookingForm.notes,
          confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          reminderSent: false,
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any,
          attendeeInfo: {
            participantName: bookingForm.participantName,
            participantEmail: bookingForm.participantEmail,
            participantPhone: bookingForm.participantPhone,
            emergencyContact: bookingForm.emergencyContact
          }
        };
        
        // Store demo booking in localStorage for demo purposes
        const existingBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('demoBookings', JSON.stringify(existingBookings));
      } else {
        // Real booking through Firebase
        booking = await bookService({
          serviceId: selectedService.id,
          participantId,
          shelterId,
          appointmentDate: selectedSlot.datetime,
          duration: selectedSlot.duration,
          participantName: bookingForm.participantName,
          participantEmail: bookingForm.participantEmail,
          participantPhone: bookingForm.participantPhone,
          emergencyContact: bookingForm.emergencyContact,
          notes: bookingForm.notes
        });
      }
      
      onBookingComplete?.(booking);
      setShowBookingDialog(false);
      setActiveView('my-bookings');
      await loadMyBookings();
      
      // Reset form
      setSelectedService(null);
      setSelectedSlot(null);
      setSelectedDate(new Date());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book service');
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
            onClick={() => setError(null)}
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
          variant={activeView === 'browse' ? 'default' : 'outline'}
          onClick={() => setActiveView('browse')}
        >
          Browse Services
        </Button>
        {showMyBookings && (
          <Button 
            variant={activeView === 'my-bookings' ? 'default' : 'outline'}
            onClick={() => setActiveView('my-bookings')}
          >
            My Bookings
          </Button>
        )}
      </div>

      {/* Browse Services View */}
      {activeView === 'browse' && (
        <div className="space-y-6">
          {/* Service Categories */}
          {!selectedCategory && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose a Service Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICE_CATEGORIES.map((category) => (
                  <Card 
                    key={category.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${getCategoryStyle(category.color)}`}>
                          {getCategoryIcon(category.icon)}
                        </div>
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Services in Category */}
          {selectedCategory && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedCategory.name} Services</h3>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory(null);
                    setServices([]);
                    setSelectedService(null);
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
                            <p className="text-gray-600 mt-1">{service.description}</p>
                            
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
                            </div>
                            
                            {service.cost > 0 && (
                              <Badge variant="outline" className="mt-2">
                                ${service.cost}
                              </Badge>
                            )}
                          </div>
                          
                          <Button 
                            onClick={() => {
                              setSelectedService(service);
                              setActiveView('book');
                            }}
                            disabled={!selectedCategory.requiresAppointment}
                          >
                            {selectedCategory.requiresAppointment ? 'Book Now' : 'Walk-in Only'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Book Service View */}
      {activeView === 'book' && selectedService && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Book: {selectedService.name}</h3>
            <Button 
              variant="outline" 
              onClick={() => setActiveView('browse')}
            >
              Back to Services
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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
                  disabled={(date) => date < new Date() || date > new Date(Date.now() + selectedCategory!.advanceBookingDays * 24 * 60 * 60 * 1000)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Available Times</CardTitle>
                <CardDescription>
                  {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date first'}
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
                  <div className="grid grid-cols-2 gap-2">
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
          </div>

          {/* Booking Confirmation */}
          {selectedSlot && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Ready to Book</h4>
                    <p className="text-gray-600">
                      {selectedService.name} on {selectedDate?.toLocaleDateString()} at {formatTime(selectedSlot.datetime)}
                    </p>
                  </div>
                  <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                    <DialogTrigger asChild>
                      <Button>Confirm Booking</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Your Booking</DialogTitle>
                        <DialogDescription>
                          Please provide your contact information for this appointment.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="participantName">Full Name</Label>
                          <Input
                            id="participantName"
                            value={bookingForm.participantName}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, participantName: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="participantEmail">Email (optional)</Label>
                          <Input
                            id="participantEmail"
                            type="email"
                            value={bookingForm.participantEmail}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, participantEmail: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="participantPhone">Phone Number</Label>
                          <Input
                            id="participantPhone"
                            value={bookingForm.participantPhone}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, participantPhone: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="emergencyContact">Emergency Contact (optional)</Label>
                          <Input
                            id="emergencyContact"
                            value={bookingForm.emergencyContact}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="notes">Additional Notes (optional)</Label>
                          <Textarea
                            id="notes"
                            value={bookingForm.notes}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Any special requirements or information..."
                          />
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleBookService}
                            disabled={loading || !bookingForm.participantName}
                            className="flex-1"
                          >
                            {loading ? 'Booking...' : 'Confirm Booking'}
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

      {/* My Bookings View */}
      {activeView === 'my-bookings' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">My Bookings</h3>
          
          {loading ? (
            <div className="text-center py-8">Loading your bookings...</div>
          ) : myBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-gray-500">
                    No bookings found. Book your first service!
                  </div>
                  <Button 
                    onClick={() => setActiveView('browse')}
                    className="mx-auto"
                  >
                    Create New Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">Booking #{booking.confirmationCode}</h4>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mt-1">
                          {formatDate(booking.appointmentDate)} • {booking.duration} minutes
                        </p>
                        {booking.notes && (
                          <p className="text-sm text-gray-500 mt-2">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        )}
                        {booking.providerNotes && (
                          <p className="text-sm text-gray-500 mt-2">
                            <strong>Provider Notes:</strong> {booking.providerNotes}
                          </p>
                        )}
                      </div>
                      
                      {booking.status === 'pending' && (
                        <Badge variant="outline" className="text-blue-600">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Scheduled
                        </Badge>
                      )}
                      {booking.status === 'confirmed' && (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirmed
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
