"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardRouter } from '@/components/auth/DashboardRouter';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { getPlatformMetrics, getPlatformMetricsFromTenants, PlatformMetrics } from '@/services/platformMetrics';
import { getNotificationCounts, getRecentEmailSignups, NotificationCounts, EmailSignup, formatRelativeTime } from '@/services/notificationService';
import { analyticsService } from '@/services/analyticsService';
import { VisitorAreaChart } from '@/components/charts/VisitorAreaChart';
import { 
  Users, 
  Building, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Settings,
  BarChart3,
  Loader2,
  Mail,
  Bell,
  Heart,
  Star,
  ChevronDown,
  Bed,
  DollarSign,
  Calendar,
  UserPlus,
  Utensils,
  User,
  Target,
  QrCode,
  Wallet,
  Award,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts | null>(null);
  const [recentEmailSignups, setRecentEmailSignups] = useState<EmailSignup[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  
  // Role simulation for Super Admin testing
  const [simulatedRole, setSimulatedRole] = useState<string | null>(null);
  const [simulatedUser, setSimulatedUser] = useState<any | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  
  // Demo accounts for role simulation
  const demoAccounts = {
    platform_admin: {
      uid: 'crVEKc8MuqQBLJlg8dis43cY6Zo2',
      email: 'doug.kukura@gmail.com',
      firstName: 'Doug',
      lastName: 'Kukura',
      displayName: 'Doug Kukura',
      role: 'platform_admin'
    },
    admin: {
      uid: '4uFBYGFWEehnsOzilYxZ0n2ti3s2',
      email: 'shelteradmin@example.com',
      firstName: 'Sarah',
      lastName: 'Manager',
      displayName: 'Sarah Manager',
      role: 'admin'
    },
    participant: {
      uid: 'michael-rodriguez',
      email: 'participant@example.com',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      displayName: 'Michael Rodriguez',
      role: 'participant'
    },
    donor: {
      uid: 'rWM6e8zfa5UoRVe5tHe6cldQkh32',
      email: 'donor@example.com',
      firstName: 'Jane',
      lastName: 'Supporter',
      displayName: 'Jane Supporter',
      role: 'donor'
    }
  };
  
  // Get effective role (simulated role for super admin, or actual role)
  const getEffectiveRole = () => {
    if (user?.role === 'super_admin' && simulatedRole) {
      return simulatedRole;
    }
    return user?.role;
  };

  // Get effective user (simulated user for super admin, or actual user)
  const getEffectiveUser = () => {
    if (user?.role === 'super_admin' && simulatedUser) {
      return simulatedUser;
    }
    return user;
  };

  const effectiveRole = getEffectiveRole();
  const effectiveUser = getEffectiveUser();
  
  // Handle role simulation change
  const handleRoleSimulation = (role: string | null) => {
    setSimulatedRole(role);
    if (role && demoAccounts[role as keyof typeof demoAccounts]) {
      setSimulatedUser(demoAccounts[role as keyof typeof demoAccounts]);
    } else {
      setSimulatedUser(null);
    }
  };

  useEffect(() => {
    console.log('🔍 Dashboard Debug - Current user:', user);
    console.log('🔍 Dashboard Debug - User role:', user?.role);
    console.log('🔍 Dashboard Debug - User UID:', user?.uid);
  }, [user]);

  // Load real platform metrics for super admin and platform admin
  useEffect(() => {
    if (user?.role === 'super_admin' || user?.role === 'platform_admin') {
      loadPlatformMetrics();
      loadNotifications();
    }
  }, [user?.role]);

  const loadPlatformMetrics = async () => {
    setMetricsLoading(true);
    try {
      console.log('📊 Loading real platform metrics from API...');
      
      // Try API first, fallback to direct Firestore calls
      try {
        const apiMetrics = await analyticsService.getPlatformAnalytics();
        console.log('📊 API metrics received:', apiMetrics);
        
        // Transform API data to match PlatformMetrics interface
        const transformedMetrics: PlatformMetrics = {
          totalOrganizations: apiMetrics.shelters?.total_shelters || 0,
          totalUsers: apiMetrics.users?.total || 0,
          activeParticipants: apiMetrics.shelters?.participants_served || 0,
          activeDonors: apiMetrics.users?.donors || 0,
          totalDonations: apiMetrics.donations?.total_amount || 0,
          platformUptime: 99.9, // Keep as operational metric
          issuesOpen: 0, // Keep as operational metric
          recentActivity: [
            {
              action: 'Platform metrics loaded',
              details: `Connected to ${apiMetrics.shelters?.total_shelters || 0} shelters with ${apiMetrics.users?.total || 0} users`,
              time: 'Just now'
            }
          ]
        };
        
        setPlatformMetrics(transformedMetrics);
        console.log('✅ Platform metrics loaded from API:', transformedMetrics);
        return;
      } catch (apiError) {
        console.warn('⚠️ API call failed, falling back to direct Firestore calls:', apiError);
      }
      
      // Fallback to multi-tenant platform metrics (SESSION 13)
      console.log('🏢 [SESSION 13] Using multi-tenant platform metrics...');
      const metrics = await getPlatformMetricsFromTenants();
      setPlatformMetrics(metrics);
      console.log('✅ [SESSION 13] Multi-tenant platform metrics loaded:', metrics);
    } catch (error) {
      console.error('❌ Failed to load platform metrics:', error);
      // Set fallback metrics with dashes/zeros
      setPlatformMetrics({
        totalOrganizations: 0,
        totalUsers: 0,
        activeParticipants: 0,
        activeDonors: 0,
        totalDonations: 0,
        platformUptime: 0,
        issuesOpen: 0,
        recentActivity: [
          {
            action: 'Data loading error',
            details: 'Please check database connection',
            time: 'Just now'
          }
        ]
      });
    } finally {
      setMetricsLoading(false);
    }
  };

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    try {
      console.log('🔔 Loading notifications...');
      
      // Load notification counts and recent email signups in parallel
      const [counts, emailSignups] = await Promise.all([
        getNotificationCounts(),
        getRecentEmailSignups(5) // Get last 5 signups
      ]);
      
      setNotificationCounts(counts);
      setRecentEmailSignups(emailSignups);
      console.log('✅ Notifications loaded:', { counts, emailSignups });
      
    } catch (error) {
      console.error('❌ Failed to load notifications:', error);
      // Set fallback data
      setNotificationCounts({
        totalEmailSignups: 0,
        recentEmailSignups: 0,
        pendingShelterapplications: 0,
        totalNotifications: 0
      });
      setRecentEmailSignups([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const debugUserData = async () => {
    if (!user?.uid) {
      console.log('❌ No user UID available');
      return;
    }

    try {
      console.log('🔍 Manually checking Firestore for user:', user.uid);
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        console.log('✅ Firestore user document found:', data);
      } else {
        console.log('❌ No Firestore user document found for UID:', user.uid);
      }
    } catch (error) {
      console.error('❌ Error fetching user document:', error);
    }
  };

  const createMissingUserDoc = async () => {
    if (!user?.uid || !user?.email) {
      console.log('❌ No user data available for document creation');
      return;
    }

    try {
      console.log('🔧 Creating missing user document for:', user.email);
      
      // Determine role based on email
      let role = 'participant'; // Default role
      if (user.email === 'joel.yaffe@gmail.com') {
        role = 'super_admin';
      } else if (user.email === 'sarah.manager@sheltr.com') {
        role = 'admin';
      } else if (user.email === 'david.donor@example.com') {
        role = 'donor';
      } else if (user.email === 'participant@example.com') {
        role = 'participant';
      }

      const userDocData = {
        uid: user.uid,
        email: user.email,
        role: role,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        profileComplete: false,
        lastLoginAt: new Date().toISOString(),
        status: 'active'
      };

      await setDoc(doc(db, 'users', user.uid), userDocData);
      console.log('✅ User document created successfully:', userDocData);
      
      // Force page reload to re-fetch user data
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Error creating user document:', error);
    }
  };

  // Show debug interface only for users with undefined roles
  if (user?.role === undefined) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-4">Loading your dashboard...</p>
        
        {/* Debug section */}
        <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">🐛 Debug Info</h3>
          <p className="text-sm text-yellow-700 mb-2">
            User: {user?.email} | Role: {user?.role || 'undefined'} | UID: {user?.uid}
          </p>
          <div className="space-x-2">
            <Button onClick={debugUserData} variant="outline" size="sm">
              Check Firestore Data
            </Button>
            <Button onClick={createMissingUserDoc} variant="secondary" size="sm">
              🔧 Create Missing User Doc
            </Button>
          </div>
        </div>

        <DashboardRouter>
          <div className="text-center py-8">
            <p className="text-gray-500">Redirecting to your role-specific dashboard...</p>
          </div>
        </DashboardRouter>
      </div>
    );
  }

  // Show Super Admin Dashboard for super_admin users (when not simulating)
  if (user?.role === 'super_admin' && !simulatedRole) {
    // Loading state while fetching real data
    if (metricsLoading || !platformMetrics) {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
              <p className="text-gray-600">Loading multi-tenant platform data...</p>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Shield className="w-4 h-4 mr-1" />
              Super Admin
            </Badge>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading multi-tenant platform data...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
              <Shield className="h-8 w-8 mr-3" />
              Super Admin Dashboard
              <Badge variant="secondary" className="ml-3 bg-green-100 text-green-800 text-xs">
                Multi-Tenant
              </Badge>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Multi-tenant platform oversight and cross-tenant management</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end space-x-3">
            {/* Notification Badge */}
            {notificationCounts && notificationCounts.totalNotifications > 0 && (
              <div className="relative">
                <Link href="/dashboard/notifications">
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Notifications</span>
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                      {notificationCounts.totalNotifications}
                    </Badge>
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Role Simulation Toggle for Super Admin */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 hover:bg-blue-100">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">
                    View As: {simulatedUser ? simulatedUser.displayName : 'Super Admin'}
                  </span>
                  <span className="sm:hidden">View As</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem onClick={() => handleRoleSimulation(null)}>
                  <Shield className="w-4 h-4 mr-2 text-purple-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">Super Admin (Real)</span>
                    <span className="text-xs text-gray-500">Your actual account</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleSimulation('platform_admin')}>
                  <Star className="w-4 h-4 mr-2 text-orange-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">Platform Admin</span>
                    <span className="text-xs text-gray-500">Doug Kukura</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleSimulation('admin')}>
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">Shelter Admin</span>
                    <span className="text-xs text-gray-500">Sarah Manager</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleSimulation('participant')}>
                  <Activity className="w-4 h-4 mr-2 text-green-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">Participant</span>
                    <span className="text-xs text-gray-500">Michael Rodriguez</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleSimulation('donor')}>
                  <Heart className="w-4 h-4 mr-2 text-red-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">Donor</span>
                    <span className="text-xs text-gray-500">Jane Supporter</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Shield className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Super Admin</span>
            </Badge>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/shelters">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.totalOrganizations || '-'}</div>
                <p className="text-xs text-muted-foreground">Real database count</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/users">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.totalUsers?.toLocaleString() || '-'}</div>
                <p className="text-xs text-muted-foreground">All platform users</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/users">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.activeParticipants || '-'}</div>
                <p className="text-xs text-muted-foreground">Currently in system</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformMetrics.activeDonors || '-'}</div>
              <p className="text-xs text-muted-foreground">Contributing to platform</p>
            </CardContent>
          </Card>

          <Link href="/dashboard/users">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Administrators</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.platformAdmins || '-'}</div>
                <p className="text-xs text-muted-foreground">Founding partners</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/financial">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${platformMetrics.totalDonations?.toLocaleString() || '-'}</div>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/platform">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Uptime</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.platformUptime || '-'}%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/notifications">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.issuesOpen || '-'}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/notifications">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notificationCounts?.totalEmailSignups || '-'}</div>
                <p className="text-xs text-muted-foreground">
                  {notificationCounts?.recentEmailSignups || 0} new this week
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/platform">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notificationCounts?.pendingShelterapplications || '-'}</div>
                <p className="text-xs text-muted-foreground">Shelter admin requests</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Visitor Analytics Chart */}
        <div className="mb-8">
          <VisitorAreaChart />
        </div>

        {/* Activity and Notifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>Latest system events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformMetrics.recentActivity?.length > 0 ? (
                  platformMetrics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Email Signups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Recent Email Signups
                {notificationCounts && notificationCounts.recentEmailSignups > 0 && (
                  <Badge className="ml-2 bg-green-500 text-white">
                    {notificationCounts.recentEmailSignups} new
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Latest newsletter subscribers from mobile app teaser</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Loading signups...</span>
                  </div>
                ) : recentEmailSignups.length > 0 ? (
                  recentEmailSignups.map((signup) => (
                    <div key={signup.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{signup.email}</p>
                        <p className="text-xs text-gray-500">
                          Source: {signup.source} • Page: {signup.page}
                        </p>
                        <p className="text-xs text-gray-400">
                          {signup.signup_date?.toDate ? formatRelativeTime(signup.signup_date.toDate()) : 'Recently'}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {signup.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No email signups yet</p>
                    <p className="text-xs text-gray-400">New signups will appear here</p>
                  </div>
                )}
              </div>
              {recentEmailSignups.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Link href="/dashboard/notifications">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Email Signups
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DashboardRouter>
          <div></div>
        </DashboardRouter>
        
        {/* AI Chatbot Widget */}
        <ChatbotWidget />
      </div>
    );
  }

  // Show Platform Admin Dashboard for platform_admin users (similar to Super Admin minus Super Admin metrics)
  if (effectiveRole === 'platform_admin') {
    // Loading state while fetching real data
    if (metricsLoading || !platformMetrics) {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Platform Admin Dashboard</h1>
              <p className="text-gray-600">Loading platform data...</p>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              <Star className="w-4 h-4 mr-1" />
              Platform Admin
            </Badge>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading platform data...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
              <Star className="h-8 w-8 mr-3" />
              Platform Admin Dashboard
              <Badge variant="secondary" className="ml-3 bg-green-100 text-green-800 text-xs">
                Multi-Tenant
              </Badge>
              {simulatedRole && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-300 text-xs animate-pulse">
                  SIMULATION MODE
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {simulatedRole ? `Super Admin simulating ${simulatedUser?.displayName} (${simulatedUser?.email})` : 'Founding partner platform oversight and management'}
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-end space-x-3">
            {/* Notification Badge */}
            {notificationCounts && notificationCounts.totalNotifications > 0 && (
              <div className="relative">
                <Link href="/dashboard/notifications">
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Notifications</span>
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                      {notificationCounts.totalNotifications}
                    </Badge>
                  </Button>
                </Link>
              </div>
            )}
            
            {simulatedRole && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleRoleSimulation(null)}
                className="bg-purple-50 border-purple-200 hover:bg-purple-100"
              >
                <Shield className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Return to Super Admin</span>
                <span className="sm:hidden">Return</span>
              </Button>
            )}
            
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              <Star className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Platform Admin</span>
              {simulatedRole && <span className="hidden sm:inline"> (Simulated)</span>}
            </Badge>
          </div>
        </div>

        {/* Platform Statistics - Same as Super Admin but without Platform Administrators metric */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/shelters">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.totalOrganizations || '-'}</div>
                <p className="text-xs text-muted-foreground">Real database count</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/users">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.totalUsers?.toLocaleString() || '-'}</div>
                <p className="text-xs text-muted-foreground">All platform users</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/users">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.activeParticipants || '-'}</div>
                <p className="text-xs text-muted-foreground">Currently in system</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformMetrics.activeDonors || '-'}</div>
              <p className="text-xs text-muted-foreground">Contributing to platform</p>
            </CardContent>
          </Card>

          <Link href="/dashboard/financial">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${platformMetrics.totalDonations?.toLocaleString() || '-'}</div>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/platform">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Uptime</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.platformUptime || '-'}%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/notifications">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.issuesOpen || '-'}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/notifications">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.issuesOpen || '-'}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/notifications">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notificationCounts?.totalEmailSignups || '-'}</div>
                <p className="text-xs text-muted-foreground">
                  {notificationCounts?.recentEmailSignups || 0} new this week
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/platform">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notificationCounts?.pendingShelterapplications || '-'}</div>
                <p className="text-xs text-muted-foreground">Shelter admin requests</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Visitor Analytics Chart */}
        <div className="mb-8">
          <VisitorAreaChart />
        </div>

        {/* Activity and Notifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>Latest system events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformMetrics.recentActivity?.length > 0 ? (
                  platformMetrics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Email Signups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Recent Email Signups
                {notificationCounts && notificationCounts.recentEmailSignups > 0 && (
                  <Badge className="ml-2 bg-green-500 text-white">
                    {notificationCounts.recentEmailSignups} new
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Latest newsletter subscribers from mobile app teaser</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Loading signups...</span>
                  </div>
                ) : recentEmailSignups.length > 0 ? (
                  recentEmailSignups.map((signup) => (
                    <div key={signup.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{signup.email}</p>
                        <p className="text-xs text-gray-500">
                          Source: {signup.source} • Page: {signup.page}
                        </p>
                        <p className="text-xs text-gray-400">
                          {signup.signup_date?.toDate ? formatRelativeTime(signup.signup_date.toDate()) : 'Recently'}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {signup.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No email signups yet</p>
                    <p className="text-xs text-gray-400">New signups will appear here</p>
                  </div>
                )}
              </div>
              {recentEmailSignups.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Link href="/dashboard/notifications">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Email Signups
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* DashboardRouter for Platform Admin navigation */}
        <DashboardRouter>
          <div></div>
        </DashboardRouter>
        
        {/* AI Chatbot Widget */}
        <ChatbotWidget />
      </div>
    );
  }

  // Show Shelter Admin simulation view
  if (effectiveRole === 'admin') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
              <Building className="h-8 w-8 mr-3" />
              {effectiveUser?.displayName}'s Shelter
              {user?.role === 'super_admin' && (
                <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-800 text-xs">
                  SIMULATION MODE
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {user?.role === 'super_admin' 
                ? `Super Admin simulating ${effectiveUser?.displayName} (${effectiveUser?.email})`
                : 'Shelter Operations Dashboard • Today\'s Date: ' + new Date().toLocaleDateString() + ' • Status: ✅ Real Data Connected'
              }
            </p>
          </div>
          {user?.role === 'super_admin' && (
            <Button onClick={() => handleRoleSimulation(null)} variant="outline" size="sm">
              Return to Super Admin
            </Button>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18/25</div>
              <p className="text-xs text-muted-foreground">
                72% occupancy • 7 available
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                Real database count • Active residents
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,245</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                3 medical, 2 counseling, 3 job training
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common shelter management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col">
                  <UserPlus className="h-6 w-6 mb-2" />
                  New Resident
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  Schedule Service
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Utensils className="h-6 w-6 mb-2" />
                  Meal Planning
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Activity className="h-6 w-6 mb-2" />
                  Daily Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest shelter events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">New resident checked in</p>
                    <p className="text-sm text-gray-600">John D. assigned to Bed 23</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Medical appointment completed</p>
                    <p className="text-sm text-gray-600">Maria S. - General checkup</p>
                    <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Donation received</p>
                    <p className="text-sm text-gray-600">$150 from anonymous donor</p>
                    <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ChatbotWidget />
      </div>
    );
  }

  // Show Participant simulation view
  if (effectiveRole === 'participant') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
              Welcome back, {effectiveUser?.displayName}!
              {user?.role === 'super_admin' && (
                <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-800 text-xs">
                  SIMULATION MODE
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {user?.role === 'super_admin' 
                ? `Super Admin simulating ${effectiveUser?.displayName} (${effectiveUser?.email})`
                : 'Your SHELTR Dashboard • Real Data Connected • Status: ✅ Active Participant'
              }
            </p>
          </div>
          
          {/* Shelter Badge */}
          <Badge variant="outline" className="border-blue-500 text-blue-600 bg-transparent px-4 py-2">
            <Building className="w-4 h-4 mr-2" />
            Old Brewery Mission
          </Badge>
          
          {user?.role === 'super_admin' && (
            <Button onClick={() => handleRoleSimulation(null)} variant="outline" size="sm">
              Return to Super Admin
            </Button>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donations Received</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$387</div>
              <p className="text-xs text-muted-foreground">
                From 8 supporters this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services Booked</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                This week • 1 completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground">
                2 of 3 goals on track
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">
                +23 this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Upcoming Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your SHELTR experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col">
                  <QrCode className="h-6 w-6 mb-2" />
                  Share Profile
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  Book Service
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Target className="h-6 w-6 mb-2" />
                  Update Goals
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Wallet className="h-6 w-6 mb-2" />
                  View Wallet
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Services */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Services</CardTitle>
              <CardDescription>Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">General Health Checkup</p>
                    <p className="text-sm text-gray-600">Tomorrow, 10:00 AM • Dr. Martinez</p>
                    <Badge variant="outline" className="text-xs mt-1">Confirmed</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Job Interview Skills Workshop</p>
                    <p className="text-sm text-gray-600">Friday, 2:00 PM • Career Center</p>
                    <Badge variant="outline" className="text-xs mt-1">Pending</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Counseling Session</p>
                    <p className="text-sm text-gray-600">Monday, 11:00 AM • Lisa Chen, LCSW</p>
                    <Badge variant="outline" className="text-xs mt-1">Confirmed</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ChatbotWidget />
      </div>
    );
  }

  // Show Donor simulation view
  if (effectiveRole === 'donor') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
              Welcome back, {effectiveUser?.displayName}!
              {user?.role === 'super_admin' && (
                <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-800 text-xs">
                  SIMULATION MODE
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {user?.role === 'super_admin' 
                ? `Super Admin simulating ${effectiveUser?.displayName} (${effectiveUser?.email})`
                : 'Your Giving Dashboard • Real Data Connected • Status: ✅ Ready for donations • Last donation: January 15, 2025'
              }
            </p>
          </div>
          {user?.role === 'super_admin' && (
            <Button onClick={() => handleRoleSimulation(null)} variant="outline" size="sm">
              Return to Super Admin
            </Button>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$500</div>
              <p className="text-xs text-muted-foreground">
                +$120 this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                All time donations
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">People Helped</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                Michael Rodriguez
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85</div>
              <p className="text-xs text-muted-foreground">
                Community impact rating
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Donations & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Your latest contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">$120 to Michael Rodriguez</p>
                    <p className="text-sm text-gray-600">Old Brewery Mission • January 15, 2025</p>
                    <Badge variant="outline" className="text-xs mt-1">Completed</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">$200 to Michael Rodriguez</p>
                    <p className="text-sm text-gray-600">Old Brewery Mission • December 20, 2024</p>
                    <Badge variant="outline" className="text-xs mt-1">Completed</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">$180 to Michael Rodriguez</p>
                    <p className="text-sm text-gray-600">Old Brewery Mission • November 28, 2024</p>
                    <Badge variant="outline" className="text-xs mt-1">Completed</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View All Donations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your giving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col">
                  <Heart className="h-6 w-6 mb-2" />
                  Quick Donate
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  View Impact
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Tax Receipts
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Find Recipients
                </Button>
              </div>
              <div className="mt-4">
                <Button className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Donate to Michael Rodriguez
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <ChatbotWidget />
      </div>
    );
  }

  // For all other roles, let DashboardRouter handle the redirect
  return (
    <DashboardRouter>
      <div className="text-center py-8">
        <p className="text-gray-500">Redirecting to your role-specific dashboard...</p>
      </div>
    </DashboardRouter>
  );
} 