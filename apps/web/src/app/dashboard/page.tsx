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
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { getPlatformMetrics, PlatformMetrics } from '@/services/platformMetrics';
import { getNotificationCounts, getRecentEmailSignups, NotificationCounts, EmailSignup, formatRelativeTime } from '@/services/notificationService';
import { analyticsService } from '@/services/analyticsService';
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
  Bell
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts | null>(null);
  const [recentEmailSignups, setRecentEmailSignups] = useState<EmailSignup[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 Dashboard Debug - Current user:', user);
    console.log('🔍 Dashboard Debug - User role:', user?.role);
    console.log('🔍 Dashboard Debug - User UID:', user?.uid);
  }, [user]);

  // Load real platform metrics for super admin
  useEffect(() => {
    if (user?.role === 'super_admin') {
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
          totalDonations: apiMetrics.donations?.total_amount || 0,
          platformUptime: 99.9, // Keep as operational metric
          issuesOpen: 0, // Keep as operational metric
          recentActivity: [
            {
              action: 'Platform metrics loaded',
              details: `Connected to ${apiMetrics.shelters?.total_shelters || 0} shelters`,
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
      
      // Fallback to direct Firestore calls
      const metrics = await getPlatformMetrics();
      setPlatformMetrics(metrics);
      console.log('✅ Platform metrics loaded from Firestore:', metrics);
    } catch (error) {
      console.error('❌ Failed to load platform metrics:', error);
      // Set fallback metrics with dashes/zeros
      setPlatformMetrics({
        totalOrganizations: 0,
        totalUsers: 0,
        activeParticipants: 0,
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

  // Show Super Admin Dashboard for super_admin users
  if (user?.role === 'super_admin') {
    // Loading state while fetching real data
    if (metricsLoading || !platformMetrics) {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
              <p className="text-gray-600">Loading platform metrics...</p>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Shield className="w-4 h-4 mr-1" />
              Super Admin
            </Badge>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading real platform data...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Platform overview and system management</p>
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
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Shield className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Super Admin</span>
            </Badge>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformMetrics.totalOrganizations || '-'}</div>
              <p className="text-xs text-muted-foreground">Real database count</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformMetrics.totalUsers?.toLocaleString() || '-'}</div>
              <p className="text-xs text-muted-foreground">All platform users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformMetrics.activeParticipants || '-'}</div>
              <p className="text-xs text-muted-foreground">Currently in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${platformMetrics.totalDonations?.toLocaleString() || '-'}</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Uptime</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformMetrics.platformUptime || '-'}%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformMetrics.issuesOpen || '-'}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationCounts?.pendingShelterapplications || '-'}</div>
              <p className="text-xs text-muted-foreground">Shelter admin requests</p>
            </CardContent>
          </Card>
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

  // For all other roles, let DashboardRouter handle the redirect
  return (
    <DashboardRouter>
      <div className="text-center py-8">
        <p className="text-gray-500">Redirecting to your role-specific dashboard...</p>
      </div>
    </DashboardRouter>
  );
} 