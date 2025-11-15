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
    </div>
  );
}
