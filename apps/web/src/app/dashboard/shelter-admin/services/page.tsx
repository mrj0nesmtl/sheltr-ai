'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus,
  Search, 
  Filter,
  Heart,
  Briefcase,
  GraduationCap,
  Scale,
  Stethoscope,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import { getServiceCategoryStats, getShelterServices, ServiceCategoryStats, ShelterService } from '@/services/platformMetrics';

// Mock services data
const mockServices = [
  {
    id: 'S001',
    name: 'Medical Checkup',
    category: 'Healthcare',
    provider: 'Dr. Sarah Wilson',
    date: '2025-01-22',
    time: '10:00 AM',
    participant: 'Michael Rodriguez',
    status: 'Scheduled',
    duration: '30 min',
    location: 'Medical Room A',
    notes: 'Regular health assessment'
  },
  {
    id: 'S002',
    name: 'Job Interview Prep',
    category: 'Employment',
    provider: 'Career Counselor',
    date: '2025-01-22',
    time: '2:00 PM',
    participant: 'Sarah Johnson',
    status: 'In Progress',
    duration: '60 min',
    location: 'Training Room 1',
    notes: 'Resume review and mock interview'
  },
  {
    id: 'S003',
    name: 'Legal Consultation',
    category: 'Legal Aid',
    provider: 'Public Defender',
    date: '2025-01-22',
    time: '3:30 PM',
    participant: 'Sarah Johnson',
    status: 'Scheduled',
    duration: '45 min',
    location: 'Conference Room',
    notes: 'Custody case discussion'
  },
  {
    id: 'S004',
    name: 'Mental Health Counseling',
    category: 'Mental Health',
    provider: 'Dr. James Chen',
    date: '2025-01-23',
    time: '11:00 AM',
    participant: 'Emma Williams',
    status: 'Scheduled',
    duration: '50 min',
    location: 'Counseling Room B',
    notes: 'Initial assessment session'
  },
  {
    id: 'S005',
    name: 'Financial Planning',
    category: 'Financial',
    provider: 'Financial Advisor',
    date: '2025-01-23',
    time: '1:00 PM',
    participant: 'David Chen',
    status: 'Completed',
    duration: '45 min',
    location: 'Office 2',
    notes: 'Housing budget planning'
  }
];

const serviceCategories = [
  { name: 'Healthcare', icon: Stethoscope, count: 15, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' },
  { name: 'Employment', icon: Briefcase, count: 23, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
  { name: 'Mental Health', icon: Heart, count: 18, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' },
  { name: 'Legal Aid', icon: Scale, count: 8, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  { name: 'Education', icon: GraduationCap, count: 12, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' },
  { name: 'Financial', icon: Users, count: 9, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100' }
];

const todaysSchedule = [
  { time: '9:00 AM', service: 'Group Therapy Session', participants: 8, room: 'Main Hall' },
  { time: '10:00 AM', service: 'Medical Checkups', participants: 3, room: 'Medical Room A' },
  { time: '11:30 AM', service: 'Job Skills Workshop', participants: 12, room: 'Training Room 1' },
  { time: '1:00 PM', service: 'Legal Aid Clinic', participants: 5, room: 'Conference Room' },
  { time: '2:30 PM', service: 'Financial Planning', participants: 4, room: 'Office 2' },
  { time: '4:00 PM', service: 'Mental Health Counseling', participants: 6, room: 'Counseling Rooms' }
];

export default function ServicesPage() {
  const { user, hasRole } = useAuth();
  const [selectedTab, setSelectedTab] = useState('today');
  const [categoryStats, setCategoryStats] = useState<ServiceCategoryStats[]>([]);
  const [services, setServices] = useState<ShelterService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load services data
  useEffect(() => {
    const loadServicesData = async () => {
      const shelterId = user?.customClaims?.shelter_id;
      
      if (!shelterId) {
        setError('No shelter assigned to this admin');
        setLoading(false);
        return;
      }

      try {
        // Load both category stats and services
        const [statsData, servicesData] = await Promise.all([
          getServiceCategoryStats(shelterId),
          getShelterServices(shelterId)
        ]);

        setCategoryStats(statsData);
        setServices(servicesData);
      } catch (error) {
        console.error('❌ Failed to load services data:', error);
        setError('Failed to load services data');
      } finally {
        setLoading(false);
      }
    };

    if (user && hasRole('admin')) {
      loadServicesData();
    }
  }, [user, hasRole]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = serviceCategories.find(cat => cat.name === category);
    if (categoryData) {
      const IconComponent = categoryData.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return <UserCheck className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Schedule and manage shelter services and appointments
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Service
        </Button>
      </div>

      {/* Service Categories Overview - Real Data */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading ? (
          // Loading state
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </div>
                <h3 className="font-semibold text-sm">Loading...</h3>
                <p className="text-2xl font-bold">-</p>
                <p className="text-xs text-muted-foreground">Loading data</p>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          // Error state
          <Card className="col-span-full text-center">
            <CardContent className="p-4">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : (
          // Real data from database
          serviceCategories.map((category) => {
            const IconComponent = category.icon;
            const realStats = categoryStats.find(stat => stat.category.toLowerCase() === category.name.toLowerCase());
            const count = realStats?.count || 0;
            
            return (
              <Card key={category.name} className="text-center">
                <CardContent className="p-4">
                  <div className="flex justify-center mb-2">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">
                    {count > 0 ? 'Real data connected' : 'No services yet'}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Service Schedule</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="all">All Services</TabsTrigger>
                </TabsList>
                
                <TabsContent value="today" className="space-y-4">
                  {mockServices.filter(service => service.date === '2025-01-22').map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              {getCategoryIcon(service.category)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{service.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {service.participant} • {service.provider}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="mr-1 h-3 w-3" />
                              {service.time}
                            </Badge>
                            <Badge variant="outline">
                              {service.duration}
                            </Badge>
                            <Badge variant="secondary">{service.category}</Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>📍 {service.location}</p>
                            {service.notes && <p className="mt-1">📝 {service.notes}</p>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="week" className="space-y-4">
                  {mockServices.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              {getCategoryIcon(service.category)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{service.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {service.participant} • {service.provider}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                            <Badge variant="outline">
                              <Calendar className="mr-1 h-3 w-3" />
                              {service.date}
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="mr-1 h-3 w-3" />
                              {service.time}
                            </Badge>
                            <Badge variant="secondary">{service.category}</Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>📍 {service.location}</p>
                            {service.notes && <p className="mt-1">📝 {service.notes}</p>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {mockServices.filter(service => service.status === 'Scheduled').map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              {getCategoryIcon(service.category)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{service.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {service.participant} • {service.provider}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                            <Badge variant="outline">
                              <Calendar className="mr-1 h-3 w-3" />
                              {service.date}
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="mr-1 h-3 w-3" />
                              {service.time}
                            </Badge>
                            <Badge variant="secondary">{service.category}</Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>📍 {service.location}</p>
                            {service.notes && <p className="mt-1">📝 {service.notes}</p>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="all" className="space-y-4">
                  {mockServices.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              {getCategoryIcon(service.category)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{service.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {service.participant} • {service.provider}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                            <Badge variant="outline">
                              <Calendar className="mr-1 h-3 w-3" />
                              {service.date}
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="mr-1 h-3 w-3" />
                              {service.time}
                            </Badge>
                            <Badge variant="secondary">{service.category}</Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>📍 {service.location}</p>
                            {service.notes && <p className="mt-1">📝 {service.notes}</p>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>January 22, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysSchedule.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.service}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.participants} participants • {item.room}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Providers
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Service Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 