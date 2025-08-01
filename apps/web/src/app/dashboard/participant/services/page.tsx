"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
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

// Mock services data
const availableServices = [
  {
    id: 1,
    name: 'Individual Counseling',
    category: 'Mental Health',
    provider: 'Dr. Sarah Wilson, LCSW',
    description: 'One-on-one counseling sessions to address personal challenges and develop coping strategies.',
    duration: '50 minutes',
    location: 'Counseling Room A',
    nextAvailable: '2024-01-16T10:00:00Z',
    slots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'],
    rating: 4.8,
    enrolledCount: 24,
    maxCapacity: 1,
    requirements: ['Initial intake required', 'Weekly commitment'],
    icon: Heart,
    color: 'bg-red-100 text-red-600'
  },
  {
    id: 2,
    name: 'Job Readiness Workshop',
    category: 'Employment',
    provider: 'Michael Chen, Career Counselor',
    description: 'Learn resume writing, interview skills, and job search strategies.',
    duration: '2 hours',
    location: 'Training Room B',
    nextAvailable: '2024-01-17T14:00:00Z',
    slots: ['9:00 AM', '2:00 PM'],
    rating: 4.9,
    enrolledCount: 8,
    maxCapacity: 12,
    requirements: ['Must attend all 4 sessions', 'Bring valid ID'],
    icon: Briefcase,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 3,
    name: 'Housing Search Assistance',
    category: 'Housing',
    provider: 'Lisa Rodriguez, Housing Specialist',
    description: 'Get help finding affordable housing options and completing applications.',
    duration: '1 hour',
    location: 'Housing Office',
    nextAvailable: '2024-01-15T13:00:00Z',
    slots: ['9:00 AM', '10:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'],
    rating: 4.7,
    enrolledCount: 15,
    maxCapacity: 1,
    requirements: ['Bring income documentation', 'Photo ID required'],
    icon: Home,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 4,
    name: 'Financial Literacy Class',
    category: 'Financial',
    provider: 'David Kim, Financial Advisor',
    description: 'Learn budgeting, saving, and money management skills.',
    duration: '90 minutes',
    location: 'Classroom C',
    nextAvailable: '2024-01-18T10:00:00Z',
    slots: ['10:00 AM', '6:00 PM'],
    rating: 4.6,
    enrolledCount: 18,
    maxCapacity: 20,
    requirements: ['6-week program', 'Weekly attendance'],
    icon: DollarSign,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 5,
    name: 'Health Screening',
    category: 'Healthcare',
    provider: 'Nurse Patricia Johnson, RN',
    description: 'Basic health check-up and vaccination updates.',
    duration: '30 minutes',
    location: 'Health Clinic',
    nextAvailable: '2024-01-16T09:00:00Z',
    slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'],
    rating: 4.9,
    enrolledCount: 5,
    maxCapacity: 1,
    requirements: ['Fasting not required', 'Bring insurance card if available'],
    icon: Stethoscope,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 6,
    name: 'Computer Skills Training',
    category: 'Education',
    provider: 'James Park, IT Instructor',
    description: 'Basic computer and internet skills for job searching and daily life.',
    duration: '2 hours',
    location: 'Computer Lab',
    nextAvailable: '2024-01-17T10:00:00Z',
    slots: ['10:00 AM', '2:00 PM'],
    rating: 4.8,
    enrolledCount: 10,
    maxCapacity: 15,
    requirements: ['No experience needed', '4-week program'],
    icon: GraduationCap,
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    id: 7,
    name: 'Support Group',
    category: 'Mental Health',
    provider: 'Maria Gonzalez, LMFT',
    description: 'Peer support group for sharing experiences and building community.',
    duration: '75 minutes',
    location: 'Community Room',
    nextAvailable: '2024-01-15T18:00:00Z',
    slots: ['6:00 PM'],
    rating: 4.7,
    enrolledCount: 12,
    maxCapacity: 15,
    requirements: ['Weekly commitment', 'Confidentiality agreement'],
    icon: Users,
    color: 'bg-pink-100 text-pink-600'
  },
  {
    id: 8,
    name: 'Nutrition Workshop',
    category: 'Health & Wellness',
    provider: 'Chef Anna Martinez',
    description: 'Learn healthy cooking on a budget and meal planning.',
    duration: '2 hours',
    location: 'Teaching Kitchen',
    nextAvailable: '2024-01-19T15:00:00Z',
    slots: ['3:00 PM'],
    rating: 4.9,
    enrolledCount: 8,
    maxCapacity: 12,
    requirements: ['Hands-on cooking', 'All skill levels welcome'],
    icon: Utensils,
    color: 'bg-orange-100 text-orange-600'
  }
];

const myAppointments = [
  {
    id: 1,
    serviceName: 'Individual Counseling',
    provider: 'Dr. Sarah Wilson, LCSW',
    date: '2024-01-15T10:00:00Z',
    duration: '50 minutes',
    location: 'Counseling Room A',
    status: 'confirmed',
    notes: 'Follow-up session for goal setting'
  },
  {
    id: 2,
    serviceName: 'Job Readiness Workshop',
    provider: 'Michael Chen, Career Counselor',
    date: '2024-01-17T14:00:00Z',
    duration: '2 hours',
    location: 'Training Room B',
    status: 'confirmed',
    notes: 'Session 2 of 4 - Resume building'
  },
  {
    id: 3,
    serviceName: 'Housing Search Assistance',
    provider: 'Lisa Rodriguez, Housing Specialist',
    date: '2024-01-18T13:00:00Z',
    duration: '1 hour',
    location: 'Housing Office',
    status: 'pending',
    notes: 'Review apartment applications'
  }
];

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
  const [selectedService, setSelectedService] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('browse');

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

  const filteredServices = availableServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookService = (service: any) => {
    setSelectedService(service);
    setShowBookingModal(true);
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
          { id: 'appointments', label: 'My Appointments', count: myAppointments.length },
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
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${service.color}`}>
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
                        <span>{service.duration}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {service.enrolledCount}/{service.maxCapacity} enrolled
                        </span>
                        <Badge variant="outline">
                          Next: {new Date(service.nextAvailable).toLocaleDateString()}
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

          {myAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{appointment.serviceName}</h3>
                      <Badge className={getStatusColor(appointment.status)}>
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
                        <span>{formatDateTime(appointment.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.duration}</span>
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
                  {selectedService.slots.map((slot: string) => (
                    <Button key={slot} variant="outline" size="sm">
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
              
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Booking
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