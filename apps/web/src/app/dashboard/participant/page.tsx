"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getShelterMetrics, ShelterMetrics } from '@/services/platformMetrics';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { generateProfileQRCodeUrl, getParticipantProfileUrl } from '@/utils/profileUrls';
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
  Building
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
  donationCount: number;
  servicesCompleted: number;
  qrScans: number;
  lastDonation: string;
}

export default function ParticipantDashboard() {
  const { user, hasRole } = useAuth();
  const [shelterInfo, setShelterInfo] = useState<ShelterMetrics | null>(null);
  const [participantData, setParticipantData] = useState<ParticipantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get participant's real donation data from Firestore
  const getParticipantRealData = async (participantId: string) => {
    try {
      console.log(`🔍 [PARTICIPANT-DASHBOARD] Fetching real donation data for: ${participantId}`);
      
      // Query all donations for this participant
      const donationsQuery = query(
        collection(db, 'demo_donations'),
        where('participant_id', '==', participantId)
      );
      const donationsSnapshot = await getDocs(donationsQuery);
      
      let totalReceived = 0;
      let donationCount = 0;
      let lastDonationDate = new Date(0); // Unix epoch start
      
      donationsSnapshot.docs.forEach(doc => {
        const donationData = doc.data();
        const amount = donationData.amount?.total || donationData.amount || 0;
        if (amount > 0) {
          totalReceived += amount;
          donationCount++;
          
          // Track latest donation
          const createdAt = donationData.created_at?.toDate ? donationData.created_at.toDate() : new Date(donationData.created_at);
          if (createdAt > lastDonationDate) {
            lastDonationDate = createdAt;
          }
        }
      });
      
      console.log(`💰 [PARTICIPANT-DASHBOARD] Found ${donationCount} donations totaling $${totalReceived} for ${participantId}`);
      
      return {
        totalReceived,
        donationCount,
        servicesCompleted: 8, // Keep static for demo
        qrScans: donationCount * 2, // Estimate QR scans as double donations
        lastDonation: donationCount > 0 ? lastDonationDate.toLocaleDateString() : 'No donations yet'
      };
    } catch (error) {
      console.error('❌ Error fetching participant real data:', error);
      return {
        totalReceived: 0,
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
    // For Michael Rodriguez, use consistent ID across platform
    if (user?.email === 'participant@example.com' || user?.email === 'michael.rodriguez@example.com') {
      return 'michael-rodriguez';
    }
    // For other participants, derive from email or user ID
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

      {/* Wallet & QR Code Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Wallet */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Digital Wallet</span>
            </CardTitle>
            <CardDescription>Your SHELTR blockchain wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium">SHELTR Stable Coin</span>
                  <div className="text-xs text-muted-foreground">USDC • 80% of donations</div>
                </div>
                <span className="text-lg font-bold text-green-600">
                  ${participantData ? Math.round(participantData.totalReceived * 0.80).toLocaleString() : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">SHELTR Utility Token</span>
                  <div className="text-xs text-muted-foreground">Housing Growth Fund • DeFi • 15%</div>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  ${participantData ? Math.round(participantData.totalReceived * 0.15).toLocaleString() : 0}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Wallet Address:</span>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
                0x742d35Cc6634C0532925a3b8D6Fd7Fd4
              </div>
            </div>

            <Link href="/dashboard/participant/wallet" className="block">
              <Button className="w-full h-10" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Transaction History
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
          <div className="space-y-4">
            {upcomingServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`h-10 w-10 rounded-lg border-2 flex items-center justify-center bg-transparent ${
                    service.type === 'Medical' ? 'border-red-500 text-red-600' :
                    service.type === 'Employment' ? 'border-blue-500 text-blue-600' :
                    service.type === 'Mental Health' ? 'border-green-500 text-green-600' :
                    'border-gray-500 text-gray-600'
                  }`}>
                    {service.type === 'Medical' && <Stethoscope className="h-5 w-5" />}
                    {service.type === 'Employment' && <GraduationCap className="h-5 w-5" />}
                    {service.type === 'Mental Health' && <Heart className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{service.service}</p>
                      <Badge variant={service.status === 'confirmed' ? 'default' : 'outline'}>
                        {service.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(service.date)} at {service.time} • {service.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Provider: {service.provider}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
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