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
import { getServiceCategoryStats, ServiceCategoryStats } from '@/services/platformMetrics';
import { ShelterAdminServiceScheduler } from '@/components/ShelterAdminServiceScheduler';

const serviceCategories = [
  { name: 'Healthcare', icon: Stethoscope, count: 15, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' },
  { name: 'Employment', icon: Briefcase, count: 23, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
  { name: 'Mental Health', icon: Heart, count: 18, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' },
  { name: 'Legal Aid', icon: Scale, count: 8, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  { name: 'Education', icon: GraduationCap, count: 12, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' },
  { name: 'Financial', icon: Users, count: 9, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100' }
];

export default function ServicesPage() {
  const { user, hasRole } = useAuth();
  const [categoryStats, setCategoryStats] = useState<ServiceCategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Get shelter ID from user
  const shelterId = user?.customClaims?.shelter_id || user?.shelterId || (user as any)?.shelter_id;

  // Load services data
  useEffect(() => {
    const loadServicesData = async () => {
      if (!shelterId) {
        setError('No shelter assigned to this admin');
        setLoading(false);
        return;
      }

      try {
        const statsData = await getServiceCategoryStats(shelterId);
        setCategoryStats(statsData);
      } catch (error) {
        console.error('❌ Failed to load services data:', error);
        setError('Failed to load services data');
      } finally {
        setLoading(false);
      }
    };

    if (user && hasRole('admin') && shelterId) {
      loadServicesData();
    }
  }, [user, hasRole, shelterId]);

  const getCategoryIcon = (category: string) => {
    const categoryData = serviceCategories.find(cat => cat.name === category);
    if (categoryData) {
      const IconComponent = categoryData.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return <UserCheck className="h-4 w-4" />;
  };

  // Check access
  if (!hasRole('admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Shelter administrator access required for this page.
        </p>
      </div>
    );
  }

  if (!shelterId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Shelter Assigned
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please contact support to be assigned to a shelter.
        </p>
      </div>
    );
  }

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
      </div>

      {/* Success Message */}
      {bookingSuccess && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Appointment scheduled successfully!</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2 text-blue-600">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">Real-Time Service Booking System</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                All appointments are loaded in real-time from the booking system below. 
                Use the scheduler to book services for participants.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Scheduler Component - This handles ALL bookings */}
      <ShelterAdminServiceScheduler 
        shelterId={shelterId}
        onBookingComplete={(booking) => {
          console.log('✅ Appointment scheduled:', booking);
          setBookingSuccess(true);
          setTimeout(() => setBookingSuccess(false), 5000);
          // Reload stats
          if (shelterId) {
            getServiceCategoryStats(shelterId).then(setCategoryStats);
          }
        }}
      />

      {/* Calendar & Today's Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Calendar view coming soon</p>
              <p className="text-xs mt-2">
                Full calendar integration with appointment scheduling
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Agenda */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Today's Agenda</span>
              </div>
              <Badge variant="outline">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Badge>
            </CardTitle>
            <CardDescription>Appointments scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* This will be populated with today's appointments */}
              <div className="text-center text-muted-foreground py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm font-medium">No appointments scheduled for today</p>
                <p className="text-xs mt-2">
                  Use the scheduler above to book appointments for participants
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
