"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { servicesService, type Service, type Appointment } from '@/services/servicesService';
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Search,
  Filter,
  BookOpen,
  Heart,
  Briefcase,
  Home,
  DollarSign,
  Stethoscope,
  GraduationCap,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
  MessageCircle,
  Utensils,
  Plus,
  Eye,
  X
} from 'lucide-react';





const categories = [
  'All',
  'Mental Health',
  'Employment',
  'Housing',
  'Healthcare',
  'Education',
  'Financial',
  'Health & Wellness'
];

export default function ParticipantServices() {
  const { user, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState('browse');
  
  // Real data state
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Booking state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);

  // Load real data from API
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load available services (this should work)
        try {
          const services = await servicesService.getAvailableServices();
          setAvailableServices(services);
        } catch (serviceErr) {
          console.error('Failed to load services:', serviceErr);
          setError('Failed to load services. Using demo data.');
          setAvailableServices(servicesService.getMockServices());
        }
        
        // Load user appointments 
        try {
          console.log('🔄 Loading user appointments...');
          const appointments = await servicesService.getUserAppointments();
          console.log('✅ Appointments loaded:', appointments.length);
          setUserAppointments(appointments);
        } catch (appointmentErr) {
          console.error('❌ Failed to load appointments:', appointmentErr);
          // Don't show error for appointments, just keep empty array  
          setUserAppointments([]);
        }
        
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user]);

  // Check if user has participant or super admin access
  if (!hasRole('participant') && !hasRole('super_admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Participant access required for this page.
        </p>
      </div>
    );
  }

  // Utility function to get icon for service category
  const getServiceIcon = (category: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'Mental Health': Heart,
      'Employment': Briefcase,
      'Housing': Home,
      'Financial': DollarSign,
      'Healthcare': Stethoscope,
      'Education': GraduationCap,
      'Health & Wellness': Utensils
    };
    return iconMap[category] || BookOpen;
  };

  // Utility function to get color for service category
  const getServiceColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Mental Health': 'bg-red-100 text-red-600',
      'Employment': 'bg-blue-100 text-blue-600',
      'Housing': 'bg-green-100 text-green-600',
      'Financial': 'bg-yellow-100 text-yellow-600',
      'Healthcare': 'bg-purple-100 text-purple-600',
      'Education': 'bg-indigo-100 text-indigo-600',
      'Health & Wellness': 'bg-orange-100 text-orange-600'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-600';
  };

  const filteredServices = availableServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setSelectedTimeSlot('');
    setBookingNotes('');
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedTimeSlot) {
      alert('Please select a time slot');
      return;
    }

    setIsBooking(true);
    try {
      // Create a proper datetime for the selected slot
      const today = new Date();
      const [time, period] = selectedTimeSlot.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      const scheduledTime = new Date(today);
      scheduledTime.setHours(hour, parseInt(minutes), 0, 0);
      // If the time is in the past today, schedule for tomorrow
      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      // Call real booking API
      const appointment = await servicesService.bookService({
        service_id: selectedService.id,
        scheduled_time: scheduledTime.toISOString(),
        notes: bookingNotes || undefined
      });

      alert(`Booking confirmed for ${selectedService.name} at ${selectedTimeSlot}!`);
      setShowBookingModal(false);
      
      // Refresh appointments to show the new booking
      try {
        console.log('🔄 Refreshing appointments after booking...');
        const updatedAppointments = await servicesService.getUserAppointments();
        console.log('✅ Appointments refreshed:', updatedAppointments.length);
        setUserAppointments(updatedAppointments);
      } catch (appointmentErr) {
        console.log('⚠️ Could not refresh appointments:', appointmentErr);
        // Don't fail the booking if we can't refresh appointments
      }
      
    } catch (error) {
      console.error('Booking failed:', error);
      alert(`Booking failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsBooking(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Services & Appointments
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Browse and book services to support your journey
        </p>
      </div>

      {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'browse', label: 'Browse Services', count: availableServices.length },
          { id: 'appointments', label: 'My Appointments', count: userAppointments.length },
          { id: 'history', label: 'Service History', count: 12 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 shadow-sm'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-sm font-medium">{tab.label}</span>
            <Badge variant="secondary" className="text-xs">
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Browse Services Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading services...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-yellow-600">{error}</p>
              </div>
            ) : filteredServices.map((service) => {
              const Icon = getServiceIcon(service.category);
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${getServiceColor(service.category)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{service.rating}</span>
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>{service.category}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{service.provider}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{servicesService.formatDuration(service.duration_minutes)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {service.current_bookings}/{service.max_capacity} enrolled
                        </span>
                        <Badge variant="outline">
                          Next: {service.next_available ? servicesService.formatDate(service.next_available) : 'Available'}
                        </Badge>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleBookService(service)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Book
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* My Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Upcoming Appointments</h2>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
          </div>

          {userAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{appointment.service_name}</h3>
                      <Badge className={servicesService.getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{appointment.provider}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{servicesService.formatDateTime(appointment.scheduled_time)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{servicesService.formatDuration(appointment.duration_minutes)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>
                      {appointment.notes && (
                        <div className="flex items-start space-x-2">
                          <MessageCircle className="w-4 h-4 mt-0.5" />
                          <span>{appointment.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Service History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Service History</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Service History
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your completed services and progress will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Book {selectedService.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBookingModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Select Date</Label>
                <Input type="date" id="date" />
              </div>
              
              <div>
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'].map((slot: string) => (
                    <Button 
                      key={slot} 
                      variant={selectedTimeSlot === slot ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className="cursor-pointer"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
              
              {selectedService.requirements.length > 0 && (
                <div>
                  <Label>Requirements</Label>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                    {selectedService.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-500" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <textarea
                  id="notes"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-none"
                  rows={3}
                  placeholder="Any special requests or notes..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  className="flex-1" 
                  onClick={handleConfirmBooking}
                  disabled={!selectedTimeSlot || isBooking}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isBooking ? 'Booking...' : 'Confirm Booking'}
                </Button>
                <Button variant="outline" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 