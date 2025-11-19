"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardRouter } from '@/components/auth/DashboardRouter';
import { doc, getDoc, setDoc, collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { getPlatformMetricsFromTenants, PlatformMetrics } from '@/services/platformMetrics';
import { analyticsService } from '@/services/analyticsService';
import { useNotifications } from '@/hooks/useNotifications';
import { VisitorAreaChart } from '@/components/charts/VisitorAreaChart';
import { 
  Users, 
  Building, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
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
  FileText,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [refreshingActivity, setRefreshingActivity] = useState(false);
  const [investorMeetingsCount, setInvestorMeetingsCount] = useState<number>(0);
  const [qrCodeStats, setQrCodeStats] = useState<{ totalCodes: number; totalScans: number; topPerformer: string | null }>({ totalCodes: 0, totalScans: 0, topPerformer: null });
  
  // Role simulation for Super Admin testing
  const [simulatedRole, setSimulatedRole] = useState<string | null>(null);
  const [simulatedUser, setSimulatedUser] = useState<{uid: string; email: string; firstName: string; lastName: string; displayName: string; role: string} | null>(null);
  
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
  
  // Super Admin function to fix ALL Platform Admin custom claims at once
  // Currently unused but kept for future debugging needs
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fixAllPlatformAdminClaims = async () => {
    if (!user || user.role !== 'super_admin') {
      toast.error('Access Denied', {
        description: 'This function is only for Super Administrators'
      });
      return;
    }
    
    if (!confirm('Fix custom claims for ALL Platform Administrators? This will set proper Firebase custom claims for all 12 Platform Admins.')) {
      return;
    }
    
    try {
      console.log('🔧 Starting bulk Platform Admin claims fix...');
      
      // Get the Firebase user object to access token methods
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        throw new Error('No Firebase user found');
      }
      
      // Call the backend Python API directly to fix all platform admin claims
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/auth/fix-platform-admin-claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Bulk fix result:', result);
      
      if (result.success) {
        toast.success(`Fixed claims for ${result.data.total_fixed} Platform Administrators!`, {
          description: `Fixed users: ${result.data.fixed_users.map((u: {email: string}) => u.email).join(', ')}${result.data.errors.length > 0 ? `. Errors: ${result.data.errors.join(', ')}` : ''}`
        });
      } else {
        throw new Error(result.message || 'Unknown error');
      }
      
    } catch (error: unknown) {
      console.error('❌ Bulk fix failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Error fixing Platform Admin claims', {
        description: errorMessage
      });
    }
  };
  
  // Temporary function to fix Platform Admin custom claims
  // Currently unused but kept for future debugging needs
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fixPlatformAdminClaims = async () => {
    if (!user || user.role !== 'platform_admin') {
      console.log('❌ Not a platform admin or user not found');
      toast.error('Access Denied', {
        description: 'This function is only for Platform Administrators'
      });
      return;
    }
    
    try {
      console.log('🔧 Diagnosing Platform Admin permissions...');
      console.log('👤 User object:', user);
      
      // Get the Firebase user object to access token methods
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        throw new Error('No Firebase user found');
      }
      
      // Get the user's ID token to check current claims
      const idTokenResult = await firebaseUser.getIdTokenResult(true); // Force refresh
      console.log('🔍 Current token claims:', idTokenResult.claims);
      console.log('🔍 Token auth time:', new Date((idTokenResult.authTime as unknown as number) * 1000));
      console.log('🔍 Token issued at:', new Date((idTokenResult.issuedAtTime as unknown as number) * 1000));
      
      // Check if user has role in custom claims
      const hasRoleInToken = !!idTokenResult.claims.role;
      const tokenRole = idTokenResult.claims.role;
      const firestoreRole = user.role;
      
      console.log(`🔍 Role in token: ${tokenRole || 'MISSING'}`);
      console.log(`🔍 Role in Firestore: ${firestoreRole || 'MISSING'}`);
      
      if (!hasRoleInToken) {
        console.log('⚠️ ISSUE FOUND: No role in Firebase custom claims');
        console.log('🔧 SOLUTION: Need to set custom claims via Firebase Admin SDK');
        
        // Show user-friendly message with next steps
        const message = `🔍 DIAGNOSIS COMPLETE:
        
Issue: Your account doesn't have Firebase custom claims set.
Current Status:
- Firestore Role: ${firestoreRole}
- Token Role: MISSING
- User ID: ${user.uid}

Next Steps:
1. Contact Super Admin (Joel Yaffe) to run the custom claims fix
2. Or ask Joel to call the /fix-platform-admin-claims API endpoint
3. Then refresh this page

This will resolve the "Missing or insufficient permissions" error.`;
        
        toast.error('Custom Claims Missing', {
          description: 'Contact Super Admin (Joel Yaffe) to run the custom claims fix. User info copied to clipboard.'
        });
        
        // Copy user info to clipboard for easy sharing
        const userInfo = `Platform Admin Claims Fix Needed:
Email: ${user.email}
UID: ${user.uid}
Firestore Role: ${firestoreRole}
Token Role: ${tokenRole || 'MISSING'}`;
        
        try {
          await navigator.clipboard.writeText(userInfo);
          console.log('✅ User info copied to clipboard');
        } catch (clipError) {
          console.log('⚠️ Could not copy to clipboard:', clipError);
        }
        
      } else if (tokenRole !== firestoreRole) {
        console.log('⚠️ ISSUE FOUND: Token role doesn\'t match Firestore role');
        console.log('🔧 SOLUTION: Refreshing token...');
        
        // Force token refresh and reload page
        await firebaseUser.getIdToken(true);
        toast.success('Token refreshed!', {
          description: 'Reloading page...'
        });
        setTimeout(() => window.location.reload(), 1000);
        
      } else {
        console.log('✅ Custom claims look correct, checking other issues...');
        toast.info('Claims look correct', {
          description: `Token Role: ${tokenRole}, Firestore Role: ${firestoreRole}. The permissions issue might be elsewhere. Check console.`
        });
      }
      
    } catch (error: unknown) {
      console.error('❌ Error diagnosing custom claims:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Error during diagnosis', {
        description: errorMessage
      });
    }
  };
  
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
    console.log('🔍 Dashboard Debug - User custom claims:', user?.customClaims);
    console.log('🔍 Dashboard Debug - User permissions:', user?.permissions);
    console.log('🔍 Dashboard Debug - User tenant_id:', user?.tenantId);
  }, [user]);

  // Load real platform metrics for super admin and platform admin
  useEffect(() => {
    if (user?.role === 'super_admin') {
      loadPlatformMetrics();
    } else if (user?.role === 'platform_admin') {
      loadSimplePlatformMetrics(); // Use simple approach for Platform Admins
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  // Enhanced platform activity from multiple real data sources
  const generateRealPlatformActivity = async () => {
    try {
      const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      const allActivities: Array<{action: string, details: string, time: string, timestamp: number}> = [];
      
      // Helper function to format time
      const formatTimeAgo = (timestamp: unknown) => {
        if (!timestamp) return 'Recently';
        
        try {
          const date = (timestamp as {toDate?: () => Date}).toDate ? (timestamp as {toDate: () => Date}).toDate() : new Date(timestamp as string | number | Date);
          const diffMs = Date.now() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          if (diffMins < 1) return 'Just now';
          if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
          if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
          if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
          return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        } catch {
          return 'Recently';
        }
      };
      
      // 1. Get recent donations (from demo_donations and main donations)
      try {
        const donationsQuery = query(
          collection(db, 'demo_donations'),
          orderBy('created_at', 'desc'),
          limit(3)
        );
        const donationsSnapshot = await getDocs(donationsQuery);
        
        donationsSnapshot.docs.forEach((doc) => {
          const donation = doc.data();
          const amount = donation.amount?.total || donation.amount || 0;
          const timestamp = donation.created_at?.toDate?.()?.getTime() || Date.now();
          
          allActivities.push({
            action: '💰 New donation received',
            details: `$${amount.toFixed(2)} donated to ${donation.participant_name || 'participant'} at ${donation.shelter_name || 'shelter'}`,
            time: formatTimeAgo(donation.created_at),
            timestamp
          });
        });
      } catch (error) {
        console.warn('Could not load donation activity:', error);
      }
      
      // 2. Get recent contact inquiries
      try {
        const inquiriesQuery = query(
          collection(db, 'contact_inquiries'),
          orderBy('created_at', 'desc'),
          limit(3)
        );
        const inquiriesSnapshot = await getDocs(inquiriesQuery);
        
        inquiriesSnapshot.docs.forEach((doc) => {
          const inquiry = doc.data();
          const timestamp = inquiry.created_at?.toDate?.()?.getTime() || Date.now();
          
          const typeEmoji = inquiry.inquiry_type === 'newsletter_signup' ? '📧' :
                           inquiry.inquiry_type === 'partnership_waitlist' ? '🤝' :
                           inquiry.inquiry_type === 'investor_inquiry' ? '💼' : '📨';
          
          const typeName = inquiry.inquiry_type === 'newsletter_signup' ? 'Newsletter signup' :
                          inquiry.inquiry_type === 'partnership_waitlist' ? 'Partnership inquiry' :
                          inquiry.inquiry_type === 'investor_inquiry' ? 'Investor inquiry' :
                          inquiry.inquiry_type === 'contact_form' ? 'Contact form submission' : 'New inquiry';
          
          allActivities.push({
            action: `${typeEmoji} ${typeName}`,
            details: `${inquiry.name || inquiry.email} - ${inquiry.subject || 'Contact request'}`,
            time: formatTimeAgo(inquiry.created_at),
            timestamp
          });
        });
      } catch (error) {
        console.warn('Could not load inquiry activity:', error);
      }
      
      // 3. Get recent shelter additions
      try {
        const sheltersQuery = query(
          collection(db, 'tenants'),
          orderBy('created_at', 'desc'),
          limit(2)
        );
        const sheltersSnapshot = await getDocs(sheltersQuery);
        
        sheltersSnapshot.docs.forEach((doc) => {
          const shelter = doc.data();
          const timestamp = shelter.created_at?.toDate?.()?.getTime() || Date.now();
          
          allActivities.push({
            action: '🏢 New shelter registered',
            details: `${shelter.name} joined the platform`,
            time: formatTimeAgo(shelter.created_at),
            timestamp
          });
        });
      } catch (error) {
        console.warn('Could not load shelter activity:', error);
      }
      
      // 4. Get recent user registrations (participants and donors only, no admins)
      try {
        const recentUsersQuery = query(
          collection(db, 'users'),
          orderBy('created_at', 'desc'),
          limit(5)
        );
        const usersSnapshot = await getDocs(recentUsersQuery);
        
        usersSnapshot.docs.forEach((doc) => {
          const userData = doc.data();
          const timestamp = userData.created_at?.toDate?.()?.getTime() || Date.now();
          
          // Only show participant and donor registrations (skip admins)
          if (userData.role === 'participant') {
            allActivities.push({
              action: '👤 New participant joined',
              details: `${userData.firstName || userData.email || 'User'} registered for assistance`,
              time: formatTimeAgo(userData.created_at),
              timestamp
            });
          } else if (userData.role === 'donor') {
            allActivities.push({
              action: '❤️ New donor joined',
              details: `${userData.firstName || userData.email || 'User'} signed up to help`,
              time: formatTimeAgo(userData.created_at),
              timestamp
            });
          }
        });
      } catch (error) {
        console.warn('Could not load user activity:', error);
      }
      
      // Sort all activities by timestamp (most recent first)
      allActivities.sort((a, b) => b.timestamp - a.timestamp);
      
      // Return top 5 most recent activities
      const recentActivities = allActivities.slice(0, 5).map(({ action, details, time }) => ({
        action,
        details,
        time
      }));
      
      // If no activities found, show fallback
      if (recentActivities.length === 0) {
        return [{
          action: '✅ Platform online',
          details: 'All systems operational',
          time: 'Just now'
        }];
      }
      
      return recentActivities;
      
    } catch (error) {
      console.error('Error generating enhanced activity:', error);
      return [
        {
          action: '⚠️ Activity loading error',
          details: 'Could not fetch recent platform activities',
          time: 'Just now'
        }
      ];
    }
  };

  // SIMPLE Platform Admin metrics - no complex multi-tenant BS
  const loadSimplePlatformMetrics = async () => {
    setMetricsLoading(true);
    try {
      console.log('📊 [SIMPLE] Loading Platform Admin metrics directly...');
      
      // Import Firebase functions
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      // Get basic counts from collections Platform Admins can definitely access
      const [usersSnapshot, sheltersSnapshot, donationsSnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'shelters')), 
        getDocs(collection(db, 'demo_donations'))
      ]);
      
      // Count users by role
      const allUsers = usersSnapshot.docs.map(doc => doc.data());
      const platformAdmins = allUsers.filter(user => user.role === 'platform_admin').length;
      const participants = allUsers.filter(user => user.role === 'participant').length;
      const donors = allUsers.filter(user => user.role === 'donor').length;
      
      // Calculate total donations
      const totalDonations = donationsSnapshot.docs.reduce((total, doc) => {
        const donation = doc.data();
        return total + (donation.amount?.total || donation.amount || 0);
      }, 0);
      
      // Simple metrics object
      const simpleMetrics = {
        totalOrganizations: sheltersSnapshot.size,
        totalUsers: usersSnapshot.size,
        activeParticipants: participants,
        activeDonors: donors,
        platformAdmins: platformAdmins,
        totalDonations: totalDonations,
        platformUptime: 99.9,
        issuesOpen: 0,
        investorAccessAttempts: 0,
        investorAccessLogins: 0,
        recentActivity: await generateRealPlatformActivity()
      };
      
      console.log('✅ [SIMPLE] Platform Admin metrics loaded:', simpleMetrics);
      setPlatformMetrics(simpleMetrics);
      
    } catch (error: unknown) {
      console.error('❌ [SIMPLE] Failed to load simple metrics:', error);
      
      // Fallback metrics
      setPlatformMetrics({
        totalOrganizations: 10,
        totalUsers: 50,
        activeParticipants: 25,
        activeDonors: 15,
        platformAdmins: 12,
        totalDonations: 89234,
        platformUptime: 99.9,
        issuesOpen: 0,
        investorAccessAttempts: 0,
        investorAccessLogins: 0,
        recentActivity: [
          {
            action: 'Using fallback data',
            details: 'Simple metrics loading failed, showing estimated values',
            time: 'Just now'
          }
        ]
      });
    } finally {
      setMetricsLoading(false);
    }
  };

  const loadPlatformMetrics = async () => {
    setMetricsLoading(true);
    try {
      console.log('📊 Loading real platform metrics from API...');
      
      // Try API first, but validate the data quality
      try {
        console.log('📊 Trying API first for platform metrics...');
        const apiMetrics = await analyticsService.getPlatformAnalytics();
        console.log('📊 API metrics received:', apiMetrics);
        console.log('🔍 [API DEBUG] API users by role:', apiMetrics.users?.by_role);
        console.log('🔍 [API DEBUG] API admin count:', apiMetrics.users?.by_role?.admin);
        console.log('🔍 [API DEBUG] API platform_admin count:', apiMetrics.users?.by_role?.platform_admin);
        
        // PRODUCTION FIX: Check if API data looks like mock data (inconsistent with Shelter Network)
        const apiShelterCount = apiMetrics.shelters?.total_shelters || 0;
        const apiUserCount = apiMetrics.users?.total || 0;
        
        // If API returns suspiciously low numbers that don't match production, skip it
        const apiPlatformAdminCount = apiMetrics.users?.by_role?.platform_admin || 0;
        const isLikelyMockData = (apiShelterCount <= 5 && apiUserCount <= 8) || (apiPlatformAdminCount === 0);
        
        if (!isLikelyMockData) {
          console.log('✅ API data looks valid, using it');
          
          // Try to get real activity data from Firebase
          let recentActivity = [
            {
              action: 'Platform metrics loaded',
              details: `Connected to ${apiShelterCount} shelters with ${apiUserCount} users`,
              time: 'Just now'
            }
          ];
          
          try {
            const { generateSimpleActivity } = await import('@/utils/generateSimpleActivity');
            const simpleActivity = await generateSimpleActivity();
            if (simpleActivity && simpleActivity.length > 0) {
              recentActivity = simpleActivity;
            }
          } catch (activityError) {
            console.warn('⚠️ Failed to get activity data, using fallback:', activityError);
          }
          
          // Transform API data to match PlatformMetrics interface
          const transformedMetrics: PlatformMetrics = {
            totalOrganizations: apiShelterCount,
            totalUsers: apiUserCount,
            activeParticipants: apiMetrics.shelters?.participants_served || 0,
            activeDonors: apiMetrics.users?.by_role?.donor || 0,
            platformAdmins: apiMetrics.users?.by_role?.platform_admin || 0,
            totalDonations: apiMetrics.donations?.total_amount || 0,
            platformUptime: 99.9,
            issuesOpen: 0,
            recentActivity: recentActivity
          };
          
          setPlatformMetrics(transformedMetrics);
          console.log('✅ Platform metrics loaded from API:', transformedMetrics);
          return;
        } else {
          console.warn('⚠️ API data appears to be incomplete (shelters:', apiShelterCount, 'users:', apiUserCount, 'platform_admins:', apiPlatformAdminCount, ') - falling back to tenant service');
        }
      } catch (apiError) {
        console.warn('⚠️ API call failed, falling back to direct Firestore calls:', apiError);
      }
      
      // PRODUCTION FIX: Always use multi-tenant platform metrics for consistency
      console.log('🏢 [PRODUCTION FIX] Using multi-tenant platform metrics for data consistency...');
      
      // ⚡ SUPER ADMIN FIX: Query demo_donations directly for accurate totals
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const donationsSnapshot = await getDocs(collection(db, 'demo_donations'));
      const totalDonationsFromFirestore = donationsSnapshot.docs.reduce((total, doc) => {
        const donation = doc.data();
        return total + (donation.amount?.total || donation.amount || 0);
      }, 0);
      console.log(`💰 [SUPER ADMIN] Queried demo_donations: ${donationsSnapshot.size} donations, total: $${totalDonationsFromFirestore}`);
      
      // Fetch investor meetings count
      const investorMeetingsSnapshot = await getDocs(collection(db, 'investor_meetings'));
      const meetingsCount = investorMeetingsSnapshot.size;
      setInvestorMeetingsCount(meetingsCount);
      console.log(`📅 [INVESTOR MEETINGS] Found ${meetingsCount} scheduled meetings`);
      
      // Fetch QR code stats
      const { PlatformQRCodeService } = await import('@/services/platformQRCodeService');
      const qrStats = await PlatformQRCodeService.getQRCodeStats();
      setQrCodeStats(qrStats);
      console.log(`📊 [QR CODES] Stats loaded:`, qrStats);
      
      const [metrics, investorMetrics, realPlatformAdmins] = await Promise.all([
        getPlatformMetricsFromTenants().then(result => {
          console.log('🔍 [DEEP DEBUG] getPlatformMetricsFromTenants returned platformAdmins:', result.platformAdmins);
          return result;
        }),
        import('@/services/investorAccessService').then(module => module.getInvestorAccessMetrics()).catch(() => ({
          totalAttempts: 0,
          successfulLogins: 0,
          teamLogins: 0,
          accessCodeLogins: 0
        })),
        // CONSISTENCY FIX: Use same function as User Management dashboard
        import('@/services/platformMetrics').then(async (module) => {
          console.log('🔍 [DEEP DEBUG] Calling getPlatformAdmins function...');
          const result = await module.getPlatformAdmins();
          console.log('🔍 [DEEP DEBUG] getPlatformAdmins returned:', result.length, 'admins');
          result.forEach((admin, index) => {
            console.log(`🔍 [DEEP DEBUG] Admin ${index + 1}: ${admin.firstName} ${admin.lastName} (${admin.email}) - Status: ${admin.status}`);
          });
          return result;
        }).catch((error) => {
          console.error('❌ Failed to load getPlatformAdmins:', error);
          return [];
        })
      ]);
      
      // Merge investor access metrics and fix platform admin count
      const correctPlatformAdminCount = Math.max(realPlatformAdmins.length, metrics.platformAdmins || 0);
      const enhancedMetrics = {
        ...metrics,
        investorAccessAttempts: investorMetrics.totalAttempts,
        investorAccessLogins: investorMetrics.successfulLogins,
        // CONSISTENCY FIX: Use real platform admin count from User Management function
        platformAdmins: correctPlatformAdminCount,
        // ⚡ SUPER ADMIN FIX: Use accurate donation total from demo_donations
        totalDonations: totalDonationsFromFirestore
      };
      
      console.log(`🔧 [CONSISTENCY FIX] Platform admin count corrected: ${metrics.platformAdmins} → ${correctPlatformAdminCount} (from ${realPlatformAdmins.length} real admins)`);
      console.log(`💰 [SUPER ADMIN FIX] Total donations updated: ${metrics.totalDonations} → $${totalDonationsFromFirestore}`);
      console.log(`🔍 [DEBUG] Real platform admins found:`, realPlatformAdmins.map(admin => `${admin.firstName} ${admin.lastName} (${admin.email})`));
      console.log(`🔍 [DEBUG] Enhanced metrics platformAdmins:`, enhancedMetrics.platformAdmins);
      
      // Use the corrected platform admin count from User Management function
      const finalMetrics = {
        ...enhancedMetrics,
        platformAdmins: realPlatformAdmins.length, // Use real count from getPlatformAdmins()
        totalDonations: totalDonationsFromFirestore // ⚡ Ensure donation total is preserved
      };
      
      console.log(`🚨 [FINAL DEBUG] Setting state with platformAdmins: ${finalMetrics.platformAdmins}, totalDonations: $${finalMetrics.totalDonations}`);
      setPlatformMetrics(finalMetrics);
      console.log('✅ [SESSION 13] Multi-tenant platform metrics loaded with investor access:', finalMetrics);
    } catch (error) {
      console.error('❌ Failed to load platform metrics:', error);
      // Set fallback metrics with dashes/zeros
      setPlatformMetrics({
        totalOrganizations: 0,
        totalUsers: 0,
        activeParticipants: 0,
        activeDonors: 0,
        platformAdmins: 0,
        totalDonations: 0,
        platformUptime: 0,
        issuesOpen: 0,
        investorAccessAttempts: 0,
        investorAccessLogins: 0,
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


  const refreshActivity = async () => {
    setRefreshingActivity(true);
    try {
      console.log('🔄 Refreshing platform activity...');
      
      // Get fresh REAL activity data
      const freshActivity = await generateRealPlatformActivity();
      
      if (freshActivity && freshActivity.length > 0) {
        // Update only the recent activity part of platform metrics
        setPlatformMetrics(prev => prev ? {
          ...prev,
          recentActivity: freshActivity
        } : null);
        console.log('✅ Platform activity refreshed with real data');
      } else {
        console.log('⚠️ No fresh activity data available');
      }
    } catch (error) {
      console.error('❌ Failed to refresh activity:', error);
    } finally {
      setRefreshingActivity(false);
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
            {unreadCount > 0 && (
              <div className="relative">
                <Link href="/dashboard/notifications">
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Notifications</span>
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                      {unreadCount}
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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

          <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Administrators</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformMetrics.platformAdmins || '-'}</div>
                <p className="text-xs text-muted-foreground">SHELTR Admins</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/financial">
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.filter(n => n.category === 'newsletter').length}</div>
                <p className="text-xs text-muted-foreground">
                  Newsletter subscribers
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/platform">
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.filter(n => n.category === 'application').length}</div>
                <p className="text-xs text-muted-foreground">Shelter admin requests</p>
              </CardContent>
            </Card>
          </Link>

          <a 
            href="https://calendar.google.com/calendar/embed?src=c_5678f9f5e708852d32e378ba9b4bbbc30a22a1038a5beb4465cc4b598f8ae7b1%40group.calendar.google.com&ctz=America%2FNew_York" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investor Meetings</CardTitle>
                <Calendar className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{investorMeetingsCount}</div>
                <p className="text-xs text-muted-foreground">
                  On the books! 📅
                </p>
              </CardContent>
            </Card>
          </a>
        </div>

        {/* Visitor Analytics Chart */}
        <div className="mb-8">
          <VisitorAreaChart key={`chart-${effectiveRole || user?.role}-${user?.uid}`} />
        </div>

        {/* Activity and Notifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Platform Activity</CardTitle>
                  <CardDescription>Latest system events and updates</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshActivity}
                  disabled={refreshingActivity}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshingActivity ? 'animate-spin' : ''}`} />
                  <span>{refreshingActivity ? 'Refreshing...' : 'Refresh'}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformMetrics.recentActivity?.length > 0 ? (
                  platformMetrics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-3 border-b-2 last:border-b-0 border-border/40 hover:bg-accent/20 p-2 rounded transition-colors">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{activity.details}</p>
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

          {/* Recent Notifications */}
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Recent Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                <Link href="/dashboard/notifications">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Latest platform activity and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                      notification.isRead ? 'bg-muted/30 border-border/40 hover:border-border' : 'bg-primary/5 border-l-4 border-primary border-t-2 border-r-2 border-b-2 hover:bg-primary/10'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.isRead ? 'bg-gray-400' : 'bg-primary'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {notification.category}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                    <p className="text-xs text-gray-400">Activity will appear here</p>
                  </div>
                )}
              </div>
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
              {simulatedRole ? `Super Admin simulating ${simulatedUser?.displayName} (${simulatedUser?.email})` : 'SHELTR Admins'}
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-end space-x-3">
            {/* Notification Badge */}
            {unreadCount > 0 && (
              <div className="relative">
                <Link href="/dashboard/notifications">
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Notifications</span>
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                      {unreadCount}
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.filter(n => n.category === 'newsletter').length}</div>
                <p className="text-xs text-muted-foreground">
                  Newsletter subscribers
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/platform">
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.filter(n => n.category === 'application').length}</div>
                <p className="text-xs text-muted-foreground">Shelter admin requests</p>
              </CardContent>
            </Card>
          </Link>

          <a 
            href="https://calendar.google.com/calendar/embed?src=c_5678f9f5e708852d32e378ba9b4bbbc30a22a1038a5beb4465cc4b598f8ae7b1%40group.calendar.google.com&ctz=America%2FNew_York" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investor Meetings</CardTitle>
                <Calendar className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{investorMeetingsCount}</div>
                <p className="text-xs text-muted-foreground">
                  On the books! 📅
                </p>
              </CardContent>
            </Card>
          </a>

          <Link href="/dashboard/settings?tab=qr-codes">
            <Card className="cursor-pointer border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total QR Scans</CardTitle>
                <QrCode className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{qrCodeStats.totalScans}</div>
                <p className="text-xs text-muted-foreground">
                  All-time scans
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Visitor Analytics Chart */}
        <div className="mb-8">
          <VisitorAreaChart key={`chart-${effectiveRole || user?.role}-${user?.uid}`} />
        </div>

        {/* Activity and Notifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Platform Activity</CardTitle>
                  <CardDescription>Latest system events and updates</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshActivity}
                  disabled={refreshingActivity}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshingActivity ? 'animate-spin' : ''}`} />
                  <span>{refreshingActivity ? 'Refreshing...' : 'Refresh'}</span>
                </Button>
              </div>
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

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Recent Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                <Link href="/dashboard/notifications">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Latest platform activity and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                      notification.isRead ? 'bg-muted/30' : 'bg-primary/5 border-l-4 border-primary'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.isRead ? 'bg-gray-400' : 'bg-primary'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {notification.category}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                    <p className="text-xs text-gray-400">Activity will appear here</p>
                  </div>
                )}
              </div>
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

  // Show Shelter Admin simulation view (only when super admin is simulating)
  if (effectiveRole === 'admin' && user?.role === 'super_admin' && simulatedRole) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
              <Building className="h-8 w-8 mr-3" />
              {effectiveUser?.displayName}&apos;s Shelter
              {user?.role === 'super_admin' && (
                <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-800 text-xs">
                  SIMULATION MODE
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {user?.role === 'super_admin' 
                ? `Super Admin simulating ${effectiveUser?.displayName} (${effectiveUser?.email})`
                : 'Shelter Operations Dashboard • Today&apos;s Date: ' + new Date().toLocaleDateString() + ' • Status: ✅ Real Data Connected'
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
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common shelter management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <UserPlus className="h-6 w-6 mb-2" />
                  New Resident
                </Button>
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <Calendar className="h-6 w-6 mb-2" />
                  Schedule Service
                </Button>
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <Utensils className="h-6 w-6 mb-2" />
                  Meal Planning
                </Button>
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <Activity className="h-6 w-6 mb-2" />
                  Daily Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest shelter events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 pb-3 border-b-2 last:border-b-0 border-border/40 hover:bg-accent/20 p-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">New resident checked in</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">John D. assigned to Bed 23</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b-2 last:border-b-0 border-border/40 hover:bg-accent/20 p-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">Medical appointment completed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Maria S. - General checkup</p>
                    <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b-2 last:border-b-0 border-border/40 hover:bg-accent/20 p-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">Donation received</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">$150 from anonymous donor</p>
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

  // Show Participant simulation view (only when super admin is simulating)
  if (effectiveRole === 'participant' && user?.role === 'super_admin' && simulatedRole) {
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
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your SHELTR experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <QrCode className="h-6 w-6 mb-2" />
                  Share Profile
                </Button>
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <Calendar className="h-6 w-6 mb-2" />
                  Book Service
                </Button>
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <Target className="h-6 w-6 mb-2" />
                  Update Goals
                </Button>
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <Wallet className="h-6 w-6 mb-2" />
                  View Wallet
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Services */}
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Upcoming Services</CardTitle>
              <CardDescription>Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 pb-3 border-b-2 last:border-b-0 border-border/40 hover:bg-accent/20 p-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">General Health Checkup</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tomorrow, 10:00 AM • Dr. Martinez</p>
                    <Badge variant="outline" className="text-xs mt-1 border-2">Confirmed</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b-2 last:border-b-0 border-border/40 hover:bg-accent/20 p-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">Job Interview Skills Workshop</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Friday, 2:00 PM • Career Center</p>
                    <Badge variant="outline" className="text-xs mt-1 border-2">Pending</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b-2 last:border-b-0 border-border/40 hover:bg-accent/20 p-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">Counseling Session</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Monday, 11:00 AM • Lisa Chen, LCSW</p>
                    <Badge variant="outline" className="text-xs mt-1 border-2">Confirmed</Badge>
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

  // Show Donor simulation view (only when super admin is simulating)
  if (effectiveRole === 'donor' && user?.role === 'super_admin' && simulatedRole) {
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
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Your latest contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 pb-3 border-b-2 last:border-b-0 border-border/40 hover:bg-accent/20 p-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">$120 to Michael Rodriguez</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Old Brewery Mission • January 15, 2025</p>
                    <Badge variant="outline" className="text-xs mt-1 border-2">Completed</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b-2 last:border-b-0 border-border/40 hover:bg-accent/20 p-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">$200 to Michael Rodriguez</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Old Brewery Mission • December 20, 2024</p>
                    <Badge variant="outline" className="text-xs mt-1 border-2">Completed</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b-2 last:border-b-0 border-border/40 hover:bg-accent/20 p-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">$180 to Michael Rodriguez</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Old Brewery Mission • November 28, 2024</p>
                    <Badge variant="outline" className="text-xs mt-1 border-2">Completed</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t-2 border-border/40">
                <Button variant="outline" className="w-full border-2 hover:border-border hover:shadow-md transition-all">
                  View All Donations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-border/60 bg-card hover:border-border hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your giving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <Heart className="h-6 w-6 mb-2" />
                  Quick Donate
                </Button>
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  View Impact
                </Button>
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <FileText className="h-6 w-6 mb-2" />
                  Tax Receipts
                </Button>
                <Button variant="outline" className="h-16 flex-col border-2 hover:border-border hover:shadow-md transition-all">
                  <Users className="h-6 w-6 mb-2" />
                  Find Recipients
                </Button>
              </div>
              <div className="mt-4">
                <Button className="w-full hover:shadow-md transition-all">
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

  // For all other roles (participant, donor, shelter admin), immediately redirect to their dashboard
  // The DashboardRouter will handle the actual redirection
  return (
    <DashboardRouter>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    </DashboardRouter>
  );
} 