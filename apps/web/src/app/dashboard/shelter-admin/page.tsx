"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Bed, 
  Utensils, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  Activity,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

// Mock data for shelter admin
const shelterData = {
  shelterName: "Downtown Hope Shelter",
  totalBeds: 120,
  occupiedBeds: 89,
  availableBeds: 31,
  totalParticipants: 156,
  activeParticipants: 89,
  pendingIntake: 12,
  mealServicesDaily: 3,
  todayMeals: 267,
  monthlyDonations: 15420.50,
  emergencyFund: 2340.00,
  staffOnDuty: 8,
  scheduledServices: 15
};

const recentActivity = [
  {
    id: 1,
    type: 'intake',
    description: 'New participant registered - Maria Santos',
    time: '5 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'service',
    description: 'Medical appointment completed - John D.',
    time: '12 minutes ago',
    status: 'success'
  },
  {
    id: 3,
    type: 'alert',
    description: 'Bed availability low (74% capacity)',
    time: '25 minutes ago',
    status: 'warning'
  },
  {
    id: 4,
    type: 'donation',
    description: 'Emergency fund allocation - $250',
    time: '1 hour ago',
    status: 'info'
  }
];

export default function ShelterAdminDashboard() {
  const { user, hasRole } = useAuth();

  // Check if user has shelter admin or super admin access
  if (!hasRole('admin') && !hasRole('super_admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Shelter Admin access required for this dashboard.
        </p>
      </div>
    );
  }

  const occupancyRate = Math.round((shelterData.occupiedBeds / shelterData.totalBeds) * 100);
  const participantRate = Math.round((shelterData.activeParticipants / shelterData.totalParticipants) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {shelterData.shelterName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Shelter Operations Dashboard • Today's Date: {new Date().toLocaleDateString()} • Staff Status: ✅ {shelterData.staffOnDuty} on duty
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shelterData.occupiedBeds}/{shelterData.totalBeds}</div>
            <p className="text-xs text-muted-foreground">
              {occupancyRate}% capacity • {shelterData.availableBeds} available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shelterData.activeParticipants}</div>
            <p className="text-xs text-muted-foreground">
              {participantRate}% engagement • {shelterData.pendingIntake} pending intake
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Meals</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shelterData.todayMeals}</div>
            <p className="text-xs text-muted-foreground">
              {shelterData.mealServicesDaily} services today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${shelterData.monthlyDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Emergency fund: ${shelterData.emergencyFund.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common shelter management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Register New Participant
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Services
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Bed className="mr-2 h-4 w-4" />
              Manage Bed Assignments
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              View Participant Progress
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest shelter operations and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  {activity.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {activity.status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{shelterData.scheduledServices}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Scheduled services and appointments
            </p>
            <Button variant="outline" className="w-full mt-3">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resource Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Food Supplies</span>
                <span className="text-sm font-medium text-green-600">Good</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Medical Supplies</span>
                <span className="text-sm font-medium text-yellow-600">Low</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Clothing</span>
                <span className="text-sm font-medium text-green-600">Good</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-3">
              <Activity className="mr-2 h-4 w-4" />
              Manage Resources
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                24/7 Emergency Hotline
              </div>
              <div className="text-lg font-bold text-red-600">
                (555) 911-HELP
              </div>
              <Button variant="destructive" className="w-full mt-3">
                <AlertCircle className="mr-2 h-4 w-4" />
                Emergency Protocol
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 