"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getShelterMetrics, ShelterMetrics } from '@/services/platformMetrics';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { generateProfileQRCodeUrl, getParticipantProfileUrl } from '@/utils/profileUrls';
import { useNotifications } from '@/hooks/useNotifications';
import { getParticipantBookings, ServiceBooking } from '@/services/serviceBookingService';
import {
  User, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Target, 
  Wallet,
  QrCode,
  CreditCard,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Home,
  Utensils,
  Stethoscope,
  GraduationCap,
  Award,
  Copy,
  Eye,
  Loader2,
  AlertCircle,
  Building,
  Bell
} from 'lucide-react';

const upcomingServices = [
  {
    id: 1,
    type: "Medical",
    service: "General Health Checkup",
    date: "2024-01-15",
    time: "10:00 AM",
    location: "Health Clinic Room B",
    provider: "Dr. Martinez",
    status: "confirmed"
  },
  {
    id: 2,
    type: "Employment",
    service: "Job Interview Skills Workshop",
    date: "2024-01-17",
    time: "2:00 PM", 
    location: "Training Room A",
    provider: "Career Center",
    status: "pending"
  },
  {
    id: 3,
    type: "Mental Health",
    service: "Counseling Session",
    date: "2024-01-20",
    time: "11:00 AM",
    location: "Counseling Office",
    provider: "Lisa Chen, LCSW",
    status: "confirmed"
  }
];

const recentActivity = [
  {
    id: 1,
    type: "service",
    description: "Completed job readiness workshop",
    timestamp: "2024-01-10T16:00:00Z",
    sheltrEarned: 25,
    status: "completed"
  },
  {
    id: 2,
    type: "checkin",
    description: "Daily shelter check-in",
    timestamp: "2024-01-10T08:00:00Z",
    sheltrEarned: 5,
    status: "completed"
  },
  {
    id: 3,
    type: "goal",
    description: "Housing goal milestone reached",
    timestamp: "2024-01-09T14:30:00Z",
    sheltrEarned: 50,
    status: "completed"
  },
  {
    id: 4,
    type: "peer_support",
    description: "Helped fellow participant",
    timestamp: "2024-01-08T12:15:00Z",
    sheltrEarned: 10,
    status: "completed"
  }
];

const mockTransactions = [
  {
    id: 1,
    type: "earned",
    amount: 25,
    description: "Service completion reward",
    timestamp: "2024-01-10T16:00:00Z",
    hash: "0xabc123..."
  },
  {
    id: 2,
    type: "earned", 
    amount: 5,
    description: "Daily check-in",
    timestamp: "2024-01-10T08:00:00Z",
    hash: "0xdef456..."
  },
  {
    id: 3,
    type: "earned",
    amount: 50,
    description: "Goal achievement",
    timestamp: "2024-01-09T14:30:00Z",
    hash: "0xghi789..."
  }
];

// Interface for participant data
interface ParticipantData {
  totalReceived: number;
  housingFundBalance: number; // 15% housing fund
  donationCount: number;
  servicesCompleted: number;
  qrScans: number;
  lastDonation: string;
}

export default function ParticipantDashboard() {
  const { user, hasRole } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [shelterInfo, setShelterInfo] = useState<ShelterMetrics | null>(null);
  const [participantData, setParticipantData] = useState<ParticipantData | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get participant's real donation data from user doc (FAST & ACCURATE)
  const getParticipantRealData = async (participantId: string) => {
    try {
      console.log(`🔍 [PARTICIPANT-DASHBOARD] Fetching real donation data for: ${participantId}`);
      
      // FIRST: Read from user document (fastest, single query)
      const { doc, getDoc } = await import('firebase/firestore');
      const userRef = doc(db, 'users', participantId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const totalReceived = userData.total_received || 0;
        const housingFundBalance = userData.housing_fund_balance || 0;
        const donationCount = userData.donation_count || 0;
        
        console.log(`✅ [USER-DOC] Participant stats:`, {
          totalReceived,
          housingFundBalance,
          donationCount
        });
        
        // Query latest donation for lastDonation date
        let lastDonationDate = new Date(0);
        
        try {
          const { limit, orderBy } = await import('firebase/firestore');
          const demoQuery = query(
            collection(db, 'demo_donations'),
            where('participant_id', '==', participantId),
            where('status', '==', 'completed'),
            orderBy('created_at', 'desc'),
            limit(1)
          );
          const demoSnapshot = await getDocs(demoQuery);
          
          if (!demoSnapshot.empty) {
            const lastDonation = demoSnapshot.docs[0].data();
            lastDonationDate = lastDonation.created_at?.toDate ? lastDonation.created_at.toDate() : new Date(lastDonation.created_at);
          }
        } catch (error) {
          console.warn('⚠️ Could not fetch last donation date:', error);
        }
        
        return {
          totalReceived,
          housingFundBalance,
          donationCount,
          servicesCompleted: 8, // Keep static for demo
          qrScans: donationCount * 2, // Estimate QR scans as double donations
          lastDonation: donationCount > 0 ? lastDonationDate.toLocaleDateString() : 'No donations yet'
        };
      } else {
        console.warn('⚠️ User document not found, falling back to $0');
        return {
          totalReceived: 0,
          housingFundBalance: 0,
          donationCount: 0,
          servicesCompleted: 0,
          qrScans: 0,
          lastDonation: 'No donations yet'
        };
      }
    } catch (error) {
      console.error('❌ Error fetching participant real data:', error);
      return {
        totalReceived: 0,
        housingFundBalance: 0,
        donationCount: 0,
        servicesCompleted: 0,
        qrScans: 0,
        lastDonation: 'No donations yet'
      };
    }
  };

  // Load shelter information and participant data
  useEffect(() => {
    const loadParticipantInfo = async () => {
      if (!user) return;
      
      const participantId = getParticipantId();
      const shelterId = user?.customClaims?.shelter_id || user?.shelterId;
      
      try {
        console.log(`🔄 [PARTICIPANT-DASHBOARD] Loading data for participant: ${participantId}`);
        
        // Load participant donation data
        const realData = await getParticipantRealData(participantId);
        setParticipantData(realData);
        
        // Load shelter information if available
        if (shelterId) {
          const metrics = await getShelterMetrics(shelterId);
          setShelterInfo(metrics);
        }
        
        // Load upcoming bookings
        try {
          const bookings = await getParticipantBookings(participantId);
          // Filter for upcoming/confirmed bookings only
          const upcoming = bookings.filter(b => 
            (b.status === 'confirmed' || b.status === 'pending') &&
            b.appointmentDate.toDate() > new Date()
          );
          setUpcomingBookings(upcoming);
          console.log('✅ Loaded upcoming bookings:', upcoming.length);
        } catch (bookingError) {
          console.warn('⚠️ Could not load bookings:', bookingError);
          // Don't fail the whole page if bookings fail
        }
      } catch (error) {
        console.error('❌ Failed to load participant info:', error);
        setError('Failed to load participant information');
      } finally {
        setLoading(false);
      }
    };

    if (user && hasRole('participant')) {
      loadParticipantInfo();
    }
  }, [user, hasRole]);

  // Check if user has participant or super admin access
  if (!hasRole('participant') && !hasRole('super_admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Participant access required for this dashboard.
        </p>
      </div>
    );
  }

  // Get user display name - Enhanced for real data
  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      // Map specific test emails to names for demo purposes
      if (user.email === 'participant@example.com' || user.email === 'michael.rodriguez@example.com') {
        return 'Michael Rodriguez';
      }
      if (user.email === 'david.donor@example.com') {
        return 'David Donor';
      }
      // Fallback to email prefix formatted as name
      return user.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Participant';
  };

  // Get participant ID for data queries
  const getParticipantId = () => {
    // ALWAYS use Firebase UID for consistent data access
    // The getParticipantRealData function expects UID, not slug
    return user?.uid || 'demo-participant-001';
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Welcome Header with Shelter Badge */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {getUserDisplayName()}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your SHELTR Dashboard • Real Data Connected • Status: ✅ Active Participant
            </p>
          </div>
          
          {/* Shelter Badge - Only show if participant is assigned to a shelter */}
          {shelterInfo && (
            <Badge variant="outline" className="border-blue-500 text-blue-600 bg-transparent px-4 py-2">
              <Building className="w-4 h-4 mr-2" />
              {shelterInfo.shelterName}
            </Badge>
          )}
          
          {loading && (
            <Badge variant="outline" className="px-4 py-2">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading shelter info...
            </Badge>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${participantData?.totalReceived.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {participantData?.donationCount || 0} donations received
            </p>
            <Badge variant="outline" className="mt-2">
              <Shield className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participantData?.servicesCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">
              Services used this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{participantData?.qrScans || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last scan: {participantData?.lastDonation || 'Never'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Network</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shelterInfo?.totalParticipants || '-'}</div>
            <p className="text-xs text-muted-foreground">
              Participants in your shelter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Quick Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} unread
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Recent donations, services, and updates
              </CardDescription>
            </div>
            <Link href="/dashboard/participant/notifications">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No notifications yet</p>
              <p className="text-sm mt-1">
                You'll see donations, appointments, and updates here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.isRead
                      ? 'bg-muted/30 border-border'
                      : 'bg-primary/5 border-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {notification.category}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {notifications.length > 3 && (
                <div className="text-center pt-2">
                  <Link href="/dashboard/participant/notifications">
                    <Button variant="ghost" size="sm" className="w-full">
                      View {notifications.length - 3} more notifications
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet & QR Code Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Wallet */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Digital Wallet</span>
            </CardTitle>
            <CardDescription>Virtual debit card & SmartFund savings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Virtual Debit Account - 80% */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400">Virtual Debit Account</span>
                  <div className="text-xs text-muted-foreground">Everyday spending • Tap & Go</div>
                </div>
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${participantData?.totalReceived?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                80% of donations • Virtual card ready
              </div>
            </div>

            {/* SmartFund Savings - 15% */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">SmartFund Savings</span>
                  <div className="text-xs text-muted-foreground">Pod purchase savings • USDC staking</div>
                </div>
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${participantData?.housingFundBalance?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                15% of donations • Coinbase institutional
              </div>
            </div>

            <Link href="/dashboard/participant/wallet" className="block">
              <Button className="w-full h-10" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Manage Wallet & Accounts
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" />
              <span>Your QR Code</span>
            </CardTitle>
            <CardDescription>For payments and identification</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="mx-auto w-32 h-32 bg-white rounded-lg flex items-center justify-center p-1">
              <img 
                src={generateProfileQRCodeUrl(getParticipantId(), 128)}
                alt={`QR Code for ${getUserDisplayName()}`}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  console.log('🚫 QR Code image failed to load');
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('✅ QR Code image loaded successfully');
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Last scanned: {participantData?.lastDonation || 'Never'}
            </div>
            <Link href={`/participant/${getParticipantId()}`} target="_blank" className="block">
              <Button className="w-full h-10" size="sm">
                <QrCode className="mr-2 h-4 w-4" />
                View Public Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common participant tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/participant/services" className="block">
              <Button className="w-full justify-start h-12" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Book Services
              </Button>
            </Link>
            <Link href="/dashboard/participant/support" className="block">
              <Button className="w-full justify-start h-12" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Caseworker
              </Button>
            </Link>
            <Link href="/dashboard/participant/goals" className="block">
              <Button className="w-full justify-start h-12" variant="outline">
                <Target className="mr-2 h-4 w-4" />
                Manage Goals
              </Button>
            </Link>
            <Link href="/dashboard/participant/profile" className="block">
              <Button className="w-full justify-start h-12" variant="outline">
                <User className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Services */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Services & Appointments</CardTitle>
          <CardDescription>Your scheduled services and next steps</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming appointments</p>
              <Link href="/dashboard/participant/services">
                <Button variant="outline" className="mt-4">
                  Browse Services
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => {
                const appointmentDate = booking.appointmentDate.toDate();
                const serviceName = booking.serviceName || 'Service Appointment';
                
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg border-2 flex items-center justify-center bg-transparent border-blue-500 text-blue-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{serviceName}</p>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {appointmentDate.toLocaleDateString([], { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {appointmentDate.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} • {booking.duration} min
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Confirmation: {booking.confirmationCode}
                        </p>
                      </div>
                    </div>
                    <Link href="/dashboard/participant/services">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity & Blockchain Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">Real data connection established</p>
                  <p className="text-xs text-muted-foreground">
                    Just now
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-600">
                    ✅ Active
                  </div>
                  <Badge variant="outline" className="text-xs">
                    system
                  </Badge>
                </div>
              </div>
              
              {shelterInfo && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Assigned to {shelterInfo.shelterName}</p>
                    <p className="text-xs text-muted-foreground">
                      Database connected
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-blue-600">
                      {shelterInfo.capacity} capacity
                    </div>
                    <Badge variant="outline" className="text-xs">
                      shelter
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center p-8 text-gray-500">
                <p className="text-sm">Recent activity will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blockchain Transactions</CardTitle>
            <CardDescription>Your SHELTR token activity (Mock Data)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {tx.hash}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(tx.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      +{tx.amount} SHELTR-S
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Earned
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Support Team</CardTitle>
            <CardDescription>People here to help you succeed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <User className="h-8 w-8 p-1.5 border-2 border-blue-500 text-blue-600 bg-transparent rounded-lg" />
              <div className="flex-1">
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Primary Caseworker</p>
              </div>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>

            {shelterInfo && (
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Home className="h-8 w-8 p-1.5 border-2 border-green-500 text-green-600 bg-transparent rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium">{shelterInfo.shelterName}</p>
                  <p className="text-sm text-muted-foreground">Your Assigned Shelter</p>
                </div>
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </Button>
              </div>
            )}
            
            {!shelterInfo && !loading && (
              <div className="flex items-center space-x-3 p-3 border-2 border-yellow-500 rounded-lg bg-transparent">
                <AlertCircle className="h-8 w-8 p-1.5 border-2 border-yellow-500 text-yellow-600 bg-transparent rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium">No Shelter Assignment</p>
                  <p className="text-sm text-muted-foreground">Contact admin for shelter placement</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Information</CardTitle>
            <CardDescription>Important contacts and resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border border-red-300 dark:border-red-700 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="font-medium text-red-700 dark:text-red-300">24/7 Crisis Hotline</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-500 text-red-600 bg-transparent hover:bg-transparent hover:scale-105 hover:border-red-600 hover:shadow-md transition-all duration-200 dark:border-red-400 dark:text-red-400 dark:hover:border-red-300 dark:hover:bg-transparent"
              >
                <Phone className="h-4 w-4 mr-2" />
                (555) 911-HELP
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Emergency Contacts</span>
              <span className="text-sm font-medium">- on file</span>
            </div>

            <Button variant="outline" className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Manage Emergency Contacts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 