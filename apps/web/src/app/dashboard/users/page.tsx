"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  UserCheck,
  UserCog,
  Heart,
  Building2,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  Crown,
  Activity,
  MapPin,
  Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock data for user management (keeping existing data)
const adminUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@downtownhope.org',
    shelter: 'Downtown Hope Center',
    role: 'Shelter Manager',
    status: 'active',
    lastLogin: '2 hours ago',
    participants: 45,
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'mchen@riverside.org',
    shelter: 'Riverside Shelter',
    role: 'Case Worker',
    status: 'active',
    lastLogin: '1 day ago',
    participants: 28,
    joinDate: '2024-02-01'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'erodriguez@community.org',
    shelter: 'Community Outreach',
    role: 'Director',
    status: 'pending',
    lastLogin: 'Never',
    participants: 0,
    joinDate: '2024-07-20'
  }
];

const participantUsers = [
  {
    id: 1,
    name: 'John D.',
    email: 'john.doe.temp@sheltr.org',
    shelter: 'Downtown Hope Center',
    status: 'verified',
    joinDate: '2024-06-01',
    totalReceived: 1245.67,
    lastDonation: '3 hours ago',
    qrScans: 23
  },
  {
    id: 2,
    name: 'Maria S.',
    email: 'maria.s.temp@sheltr.org',
    shelter: 'Riverside Shelter',
    status: 'pending_verification',
    joinDate: '2024-07-15',
    totalReceived: 234.50,
    lastDonation: '1 day ago',
    qrScans: 8
  },
  {
    id: 3,
    name: 'Robert K.',
    email: 'robert.k.temp@sheltr.org',
    shelter: 'Safe Harbor Foundation',
    status: 'verified',
    joinDate: '2024-05-20',
    totalReceived: 2156.34,
    lastDonation: '5 hours ago',
    qrScans: 67
  }
];

const donorUsers = [
  {
    id: 1,
    name: 'Jennifer Williams',
    email: 'jwilliams@email.com',
    status: 'verified',
    joinDate: '2024-03-10',
    totalDonated: 2500.00,
    donationCount: 15,
    lastDonation: '2 days ago',
    favoriteShelter: 'Downtown Hope Center'
  },
  {
    id: 2,
    name: 'David Thompson',
    email: 'dthompson@email.com',
    status: 'active',
    joinDate: '2024-01-05',
    totalDonated: 5670.25,
    donationCount: 34,
    lastDonation: '1 hour ago',
    favoriteShelter: 'Multiple'
  },
  {
    id: 3,
    name: 'Lisa Chen',
    email: 'lchen@email.com',
    status: 'active',
    joinDate: '2024-04-12',
    totalDonated: 890.50,
    donationCount: 7,
    lastDonation: '1 week ago',
    favoriteShelter: 'Riverside Shelter'
  }
];

const userStats = {
  superAdmins: { total: 1, active: 1, pending: 0 },
  admins: { total: 23, active: 21, pending: 2 },
  participants: { total: 1203, verified: 1056, pending: 147 },
  donors: { total: 8934, active: 7832, verified: 8120 }
};

export default function UserManagement() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for live session tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Create live Super Admin data from current user
  const liveUserSession = user ? {
    id: user.uid,
    name: user.displayName || 'Joel Yaffe',
    email: user.email,
    role: 'Platform Owner',
    status: 'active',
    lastLogin: 'Active now',
    sessionStart: new Date().toLocaleTimeString(),
    location: 'Vancouver, BC',
    device: 'Chrome/Mac',
    tenantId: user.tenantId || 'platform',
    emailVerified: user.emailVerified,
    customClaims: user.role,
    joinDate: '2024-01-01' // Platform founding date
  } : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'inactive':
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
      case 'pending_verification':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage all user accounts and roles across the platform
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* User Statistics Overview - Updated with Super Admins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{userStats.superAdmins.total}</div>
            <div className="flex items-center space-x-4 text-xs text-purple-600 dark:text-purple-400 mt-2">
              <span className="flex items-center">
                <Activity className="h-3 w-3 text-green-500 mr-1" />
                {userStats.superAdmins.active} Online
              </span>
              <span className="flex items-center">
                <Shield className="h-3 w-3 text-purple-500 mr-1" />
                Platform Control
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.admins.total}</div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {userStats.admins.active} Active
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                {userStats.admins.pending} Pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.participants.total.toLocaleString()}</div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {userStats.participants.verified} Verified
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                {userStats.participants.pending} Pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donors</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.donors.total.toLocaleString()}</div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {userStats.donors.active} Active
              </span>
              <span className="flex items-center">
                <Heart className="h-3 w-3 text-blue-500 mr-1" />
                {userStats.donors.verified} Verified
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Tabs - Updated with Super Admins */}
      <Tabs defaultValue="super-admins" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="super-admins">
            <Crown className="mr-2 h-4 w-4" />
            Super Admins
          </TabsTrigger>
          <TabsTrigger value="admins">
            <UserCog className="mr-2 h-4 w-4" />
            Admin Users
          </TabsTrigger>
          <TabsTrigger value="participants">
            <UserCheck className="mr-2 h-4 w-4" />
            Participants
          </TabsTrigger>
          <TabsTrigger value="donors">
            <Heart className="mr-2 h-4 w-4" />
            Donors
          </TabsTrigger>
        </TabsList>

        {/* Super Admins Tab - NEW LIVE DATA */}
        <TabsContent value="super-admins" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <Crown className="mr-2 h-5 w-5 text-purple-600" />
                Super Administrators
              </h3>
              <p className="text-sm text-muted-foreground">Platform owners with complete system access</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">LIVE DATA</span>
              </div>
            </div>
          </div>

          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardContent className="p-0">
              {liveUserSession && (
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-purple-700 dark:text-purple-300">{liveUserSession.name}</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">{liveUserSession.email}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Building2 className="h-3 w-3 mr-1" />
                        {liveUserSession.role} • Tenant: {liveUserSession.tenantId}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm font-medium">Session Started</div>
                      <div className="text-xs text-muted-foreground">{liveUserSession.sessionStart}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium flex items-center">
                        <Activity className="h-3 w-3 mr-1 text-green-500" />
                        Active Now
                      </div>
                      <div className="text-xs text-muted-foreground">{currentTime.toLocaleTimeString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {liveUserSession.location}
                      </div>
                      <div className="text-xs text-muted-foreground">{liveUserSession.device}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Online
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Super Admin Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Super Admin Capabilities
              </CardTitle>
              <CardDescription>Complete platform control and oversight</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Platform Management</div>
                    <div className="text-sm text-muted-foreground">Full system control</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">User Administration</div>
                    <div className="text-sm text-muted-foreground">All user management</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Financial Oversight</div>
                    <div className="text-sm text-muted-foreground">Transaction monitoring</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Users Tab */}
        <TabsContent value="admins" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Shelter Administrators</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {adminUsers.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-6 border-b last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <UserCog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-sm text-muted-foreground">{admin.email}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Building2 className="h-3 w-3 mr-1" />
                          {admin.shelter} • {admin.role}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">{admin.participants}</div>
                        <div className="text-xs text-muted-foreground">Participants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{admin.lastLogin}</div>
                        <div className="text-xs text-muted-foreground">Last Login</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(admin.status)}
                        <Badge className={getStatusColor(admin.status)}>
                          {admin.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Homeless Participants</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {participantUsers.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-6 border-b last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-sm text-muted-foreground">{participant.email}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Building2 className="h-3 w-3 mr-1" />
                          {participant.shelter}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">${participant.totalReceived.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Total Received</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{participant.qrScans}</div>
                        <div className="text-xs text-muted-foreground">QR Scans</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{participant.lastDonation}</div>
                        <div className="text-xs text-muted-foreground">Last Donation</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(participant.status)}
                        <Badge className={getStatusColor(participant.status)}>
                          {participant.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donors Tab */}
        <TabsContent value="donors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Platform Donors</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {donorUsers.map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between p-6 border-b last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="font-medium">{donor.name}</div>
                        <div className="text-sm text-muted-foreground">{donor.email}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Building2 className="h-3 w-3 mr-1" />
                          Prefers: {donor.favoriteShelter}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">${donor.totalDonated.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Total Donated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{donor.donationCount}</div>
                        <div className="text-xs text-muted-foreground">Donations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{donor.lastDonation}</div>
                        <div className="text-xs text-muted-foreground">Last Donation</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(donor.status)}
                        <Badge className={getStatusColor(donor.status)}>
                          {donor.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 