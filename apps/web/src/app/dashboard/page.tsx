"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { DashboardRouter } from '@/components/auth/DashboardRouter';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { getPlatformMetrics, PlatformMetrics } from '@/services/platformMetrics';
import { 
  Users, 
  Building, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Settings,
  BarChart3,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 Dashboard Debug - Current user:', user);
    console.log('🔍 Dashboard Debug - User role:', user?.role);
    console.log('🔍 Dashboard Debug - User UID:', user?.uid);
  }, [user]);

  // Load real platform metrics for super admin
  useEffect(() => {
    if (user?.role === 'super_admin') {
      loadPlatformMetrics();
    }
  }, [user?.role]);

  const loadPlatformMetrics = async () => {
    setMetricsLoading(true);
    try {
      console.log('📊 Loading real platform metrics...');
      const metrics = await getPlatformMetrics();
      setPlatformMetrics(metrics);
      console.log('✅ Platform metrics loaded:', metrics);
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
        recentActivity: []
      });
    } finally {
      setMetricsLoading(false);
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-gray-600">Platform overview and system management</p>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Shield className="w-4 h-4 mr-1" />
            Super Admin
          </Badge>
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
        </div>

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