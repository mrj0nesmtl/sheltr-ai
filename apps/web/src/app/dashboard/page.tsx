"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight,
  Activity,
  CreditCard,
  Bell
} from 'lucide-react';

// Mock data for platform overview
const mockMetrics = {
  totalUsers: 2847,
  totalShelters: 156,
  totalDonations: 89234.67,
  monthlyGrowth: 12.5,
  activeParticipants: 1203,
  recentDonations: 45,
  platformRevenue: 4461.73,
  systemHealth: 99.2
};

const recentActivity = [
  {
    id: 1,
    type: 'donation',
    description: 'New donation to Downtown Shelter',
    amount: '$125.00',
    time: '2 minutes ago'
  },
  {
    id: 2,
    type: 'user',
    description: 'New participant registered',
    shelter: 'Hope Center',
    time: '5 minutes ago'
  },
  {
    id: 3,
    type: 'shelter',
    description: 'Riverside Shelter application approved',
    time: '12 minutes ago'
  },
  {
    id: 4,
    type: 'donation',
    description: 'Large donation received',
    amount: '$500.00',
    time: '18 minutes ago'
  }
];

export default function DashboardOverview() {
  const { user } = useAuth();

  // Only show Super Admin content for super_admin role
  if (user?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Super Admin access required for this dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.displayName?.split(' ')[0] || 'Joel'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Platform Overview • Last login: {new Date().toLocaleDateString()} • System Status: ✅ Operational
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{mockMetrics.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shelters</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalShelters}</div>
            <p className="text-xs text-muted-foreground">
              Across 12 regions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockMetrics.totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockMetrics.platformRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              5% of total donations
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
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Approve Pending Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              Review Shelter Applications
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              View System Health
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Check Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{activity.time}</span>
                      {activity.amount && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-green-600">{activity.amount}</span>
                        </>
                      )}
                      {activity.shelter && (
                        <>
                          <span>•</span>
                          <span>{activity.shelter}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
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

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{mockMetrics.activeParticipants}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Currently receiving support
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{mockMetrics.recentDonations}</div>
            <p className="text-sm text-muted-foreground mt-2">
              In the last 24 hours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{mockMetrics.systemHealth}%</div>
            <p className="text-sm text-muted-foreground mt-2">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 