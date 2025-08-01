"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Eye
} from 'lucide-react';

// Mock data for participant
const participantData = {
  participantName: "Michael Rodriguez",
  participantId: "PART-001-2024",
  dateJoined: "2023-11-15",
  currentShelter: "Downtown Hope Shelter",
  caseworker: "Sarah Johnson",
  nextAppointment: "2024-01-15",
  servicesCompleted: 8,
  goalsProgress: 65,
  supportNetworkSize: 12,
  emergencyContacts: 2,
  
  // Mock Blockchain Data
  walletAddress: "0x742d35Cc6634C0532925a3b8D6Fd7Fd4",
  sheltrSBalance: 45.50,
  sheltrBalance: 12,
  totalEarned: 125.75,
  transactionCount: 23,
  qrCodeGenerated: true,
  lastQRScan: "2024-01-10T14:30:00Z"
};

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

export default function ParticipantDashboard() {
  const { user, hasRole } = useAuth();

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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {participantData.participantName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your SHELTR Dashboard • Member since: {formatDate(participantData.dateJoined)} • ID: {participantData.participantId}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SHELTR-S Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{participantData.sheltrSBalance}</div>
            <p className="text-xs text-muted-foreground">
              Stable token balance
            </p>
            <Badge variant="outline" className="mt-2">
              <Shield className="h-3 w-3 mr-1" />
              Blockchain Secured
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participantData.servicesCompleted}</div>
            <p className="text-xs text-muted-foreground">
              Total earned: {participantData.totalEarned} SHELTR-S
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{participantData.goalsProgress}%</div>
            <p className="text-xs text-muted-foreground">
              Personal development goals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Network</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participantData.supportNetworkSize}</div>
            <p className="text-xs text-muted-foreground">
              People supporting you
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
                <span className="text-sm font-medium">SHELTR-S</span>
                <span className="text-lg font-bold text-green-600">{participantData.sheltrSBalance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SHELTR</span>
                <span className="text-lg font-bold text-blue-600">{participantData.sheltrBalance}</span>
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
                {participantData.walletAddress}
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View Transaction History
            </Button>
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
            <div className="mx-auto w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <QrCode className="h-16 w-16 text-gray-400" />
            </div>
            <div className="text-xs text-muted-foreground">
              Last scanned: {formatDateTime(participantData.lastQRScan)}
            </div>
            <Button className="w-full" size="sm">
              <QrCode className="mr-2 h-4 w-4" />
              Generate New QR
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common participant tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Book Services
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message Caseworker
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Update Goals
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <User className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
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
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    service.type === 'Medical' ? 'bg-red-100 text-red-600' :
                    service.type === 'Employment' ? 'bg-blue-100 text-blue-600' :
                    service.type === 'Mental Health' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-600'
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
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      +{activity.sheltrEarned} SHELTR-S
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              ))}
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
              <User className="h-8 w-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />
              <div className="flex-1">
                <p className="font-medium">{participantData.caseworker}</p>
                <p className="text-sm text-muted-foreground">Primary Caseworker</p>
              </div>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Home className="h-8 w-8 p-1.5 bg-green-100 text-green-600 rounded-full" />
              <div className="flex-1">
                <p className="font-medium">{participantData.currentShelter}</p>
                <p className="text-sm text-muted-foreground">Current Shelter</p>
              </div>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Information</CardTitle>
            <CardDescription>Important contacts and resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-900 dark:text-red-100">24/7 Crisis Hotline</span>
              </div>
              <p className="text-lg font-bold text-red-600">(555) 911-HELP</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Emergency Contacts</span>
              <span className="text-sm font-medium">{participantData.emergencyContacts} on file</span>
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