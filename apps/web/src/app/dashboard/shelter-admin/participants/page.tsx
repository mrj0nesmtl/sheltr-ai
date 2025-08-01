'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  FileText,
  Heart,
  Bed
} from 'lucide-react';

// Mock participant data
const mockParticipants = [
  {
    id: 'P001',
    name: 'Michael Rodriguez',
    age: 34,
    gender: 'Male',
    status: 'Active',
    bedNumber: 'B-12',
    checkInDate: '2025-01-15',
    lastActivity: '2 hours ago',
    phone: '(555) 123-4567',
    email: 'michael.r@email.com',
    emergencyContact: 'Maria Rodriguez - Sister',
    services: ['Medical', 'Job Training'],
    notes: 'Seeking employment in construction',
    riskLevel: 'Low'
  },
  {
    id: 'P002',
    name: 'Sarah Johnson',
    age: 28,
    gender: 'Female',
    status: 'Active',
    bedNumber: 'B-07',
    checkInDate: '2025-01-10',
    lastActivity: '30 minutes ago',
    phone: '(555) 987-6543',
    email: 'sarah.j@email.com',
    emergencyContact: 'John Johnson - Father',
    services: ['Medical', 'Legal Aid', 'Counseling'],
    notes: 'Single mother, custody case pending',
    riskLevel: 'Medium'
  },
  {
    id: 'P003',
    name: 'David Chen',
    age: 45,
    gender: 'Male',
    status: 'Transitioning',
    bedNumber: 'B-23',
    checkInDate: '2024-12-28',
    lastActivity: '1 day ago',
    phone: '(555) 456-7890',
    email: 'david.c@email.com',
    emergencyContact: 'Linda Chen - Ex-wife',
    services: ['Job Training', 'Financial Planning'],
    notes: 'Found permanent housing, moving out next week',
    riskLevel: 'Low'
  },
  {
    id: 'P004',
    name: 'Emma Williams',
    age: 22,
    gender: 'Female',
    status: 'New',
    bedNumber: 'B-15',
    checkInDate: '2025-01-20',
    lastActivity: '5 minutes ago',
    phone: '(555) 234-5678',
    email: 'emma.w@email.com',
    emergencyContact: 'Robert Williams - Father',
    services: ['Intake Assessment'],
    notes: 'Recent college graduate, lost job and housing',
    riskLevel: 'Low'
  }
];

const recentActivity = [
  { participant: 'Michael Rodriguez', action: 'Completed job interview', time: '2 hours ago', type: 'success' },
  { participant: 'Sarah Johnson', action: 'Medical appointment scheduled', time: '3 hours ago', type: 'info' },
  { participant: 'Emma Williams', action: 'Check-in completed', time: '5 hours ago', type: 'success' },
  { participant: 'David Chen', action: 'Housing application approved', time: '1 day ago', type: 'success' },
  { participant: 'Michael Rodriguez', action: 'Missed counseling session', time: '2 days ago', type: 'warning' }
];

export default function ParticipantsPage() {
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Transitioning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Participants</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage participant registrations, profiles, and services
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Register New Participant
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">7 pending intake</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successfully Housed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Stay Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participants List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Participant Directory</CardTitle>
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
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="transitioning">Transitioning</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="space-y-4">
                  {mockParticipants.filter(p => p.status === 'Active').map((participant) => (
                    <div key={participant.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{participant.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {participant.age} years • {participant.gender} • Bed {participant.bedNumber}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(participant.status)}>
                              {participant.status}
                            </Badge>
                            <Badge variant="outline" className={getRiskColor(participant.riskLevel)}>
                              {participant.riskLevel} Risk
                            </Badge>
                            {participant.services.map((service) => (
                              <Badge key={service} variant="secondary">{service}</Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Check-in: {participant.checkInDate} • Last activity: {participant.lastActivity}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="new" className="space-y-4">
                  {mockParticipants.filter(p => p.status === 'New').map((participant) => (
                    <div key={participant.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{participant.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {participant.age} years • {participant.gender} • Bed {participant.bedNumber}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(participant.status)}>
                              {participant.status}
                            </Badge>
                            <Badge variant="outline" className={getRiskColor(participant.riskLevel)}>
                              {participant.riskLevel} Risk
                            </Badge>
                            {participant.services.map((service) => (
                              <Badge key={service} variant="secondary">{service}</Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Check-in: {participant.checkInDate} • Last activity: {participant.lastActivity}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="transitioning" className="space-y-4">
                  {mockParticipants.filter(p => p.status === 'Transitioning').map((participant) => (
                    <div key={participant.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{participant.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {participant.age} years • {participant.gender} • Bed {participant.bedNumber}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(participant.status)}>
                              {participant.status}
                            </Badge>
                            <Badge variant="outline" className={getRiskColor(participant.riskLevel)}>
                              {participant.riskLevel} Risk
                            </Badge>
                            {participant.services.map((service) => (
                              <Badge key={service} variant="secondary">{service}</Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Check-in: {participant.checkInDate} • Last activity: {participant.lastActivity}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="all" className="space-y-4">
                  {mockParticipants.map((participant) => (
                    <div key={participant.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{participant.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {participant.age} years • {participant.gender} • Bed {participant.bedNumber}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className={getStatusColor(participant.status)}>
                              {participant.status}
                            </Badge>
                            <Badge variant="outline" className={getRiskColor(participant.riskLevel)}>
                              {participant.riskLevel} Risk
                            </Badge>
                            {participant.services.map((service) => (
                              <Badge key={service} variant="secondary">{service}</Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Check-in: {participant.checkInDate} • Last activity: {participant.lastActivity}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Activity Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest participant updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.participant}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                New Registration
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Intake
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Bed className="mr-2 h-4 w-4" />
                Manage Beds
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 