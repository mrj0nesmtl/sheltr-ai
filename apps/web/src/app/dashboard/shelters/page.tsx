"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { firestoreService, Shelter, PendingApplication } from '@/services/firestore';
import ShelterMap from '@/components/ShelterMap';
import DataPopulator from '@/components/DataPopulator';
import { 
  Building2, 
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Star,
  Activity,
  FileText,
  Shield,
  Phone,
  Mail,
  Map,
  Database
} from 'lucide-react';

export default function ShelterNetwork() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Load data from Firestore
  const loadData = async () => {
    setLoading(true);
    try {
      const [sheltersData, applicationsData] = await Promise.all([
        firestoreService.getShelters(),
        firestoreService.getPendingApplications()
      ]);
      
      setShelters(sheltersData);
      setPendingApplications(applicationsData);
    } catch (error) {
      console.error('Error loading shelter data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate metrics from live data
  const shelterMetrics = {
    totalShelters: shelters.length,
    activeShelters: shelters.filter(s => s.status === 'active').length,
    pendingApplications: pendingApplications.length,
    averageOccupancy: shelters.length > 0 
      ? Math.round(shelters.reduce((acc, s) => acc + (s.capacity > 0 ? (s.currentOccupancy / s.capacity * 100) : 0), 0) / shelters.length * 10) / 10
      : 0,
    totalCapacity: shelters.reduce((acc, s) => acc + s.capacity, 0),
    currentOccupants: shelters.reduce((acc, s) => acc + s.currentOccupancy, 0),
    monthlyGrowth: 8.2, // This would come from historical data
    complianceScore: shelters.length > 0 
      ? Math.round(shelters.reduce((acc, s) => acc + s.complianceScore, 0) / shelters.length * 10) / 10
      : 0
  };

  const performanceMetrics = shelters
    .filter(s => s.status === 'active')
    .sort((a, b) => b.rating - a.rating)
    .map(shelter => ({
      shelter: shelter.name,
      rating: shelter.rating,
      donations: shelter.totalDonations,
      participants: shelter.participants,
      efficiency: shelter.complianceScore
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'under_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'pending_documents': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return 'text-red-600';
    if (occupancy >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOccupancyPercentage = (shelter: Shelter) => {
    return shelter.capacity > 0 ? Math.round((shelter.currentOccupancy / shelter.capacity) * 100) : 0;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shelter Network</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage shelter directory, onboarding, and performance across the platform
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Shelter
          </Button>
        </div>
      </div>

      {/* Live Data Indicator */}
      {!loading && (
        <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 dark:text-green-300 font-medium">
            LIVE FIRESTORE DATA - {shelters.length} shelters loaded from database
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadData}
            className="text-green-700 hover:text-green-800 dark:text-green-300"
          >
            <Activity className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      )}

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shelters</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shelterMetrics.totalShelters}</div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {shelterMetrics.activeShelters} Active
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                {shelterMetrics.pendingApplications} Pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shelterMetrics.totalCapacity.toLocaleString()}</div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <Activity className="h-3 w-3 text-blue-500 mr-1" />
                {shelterMetrics.currentOccupants.toLocaleString()} Occupied
              </span>
              <span className={`flex items-center ${getOccupancyColor(shelterMetrics.averageOccupancy)}`}>
                {shelterMetrics.averageOccupancy}% Average
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{shelterMetrics.monthlyGrowth}%</div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span>Monthly Growth</span>
              <span className="flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                New Partners
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getComplianceColor(shelterMetrics.complianceScore)}`}>
              {shelterMetrics.complianceScore}%
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span>Platform Average</span>
              <span className="flex items-center text-green-600">
                <Shield className="h-3 w-3 mr-1" />
                Excellent
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Activity className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="map">
            <Map className="mr-2 h-4 w-4" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="directory">
            <Building2 className="mr-2 h-4 w-4" />
            Directory
          </TabsTrigger>
          <TabsTrigger value="applications">
            <FileText className="mr-2 h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="mr-2 h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Shelters</CardTitle>
              <CardDescription>Ranked by overall performance and community impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.slice(0, 5).map((shelter, index) => (
                  <div key={shelter.shelter} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{shelter.shelter}</div>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(shelter.rating)}
                          <span className="text-xs text-muted-foreground ml-1">
                            {shelter.rating > 0 ? shelter.rating.toFixed(1) : 'New'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-sm font-medium text-green-600">${shelter.donations.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Donations</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{shelter.participants}</div>
                        <div className="text-xs text-muted-foreground">Participants</div>
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${getComplianceColor(shelter.efficiency)}`}>
                          {shelter.efficiency}%
                        </div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Shelter Network Map
              </CardTitle>
              <CardDescription>
                Interactive map showing all shelters and their current status across the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-gray-500">Loading map data...</p>
                  </div>
                </div>
              ) : (
                <ShelterMap shelters={shelters} height="600px" />
              )}
            </CardContent>
          </Card>

          {/* Map Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Map Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">Active Shelters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Pending Approval</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">High Occupancy (90%+)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Low Occupancy (<75%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Directory Tab */}
        <TabsContent value="directory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Shelter Directory</h3>
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

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {shelters.map((shelter) => (
                <Card key={shelter.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{shelter.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {shelter.location} • {shelter.type}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {shelter.contact.email}
                            {shelter.contact.phone && (
                              <>
                                <span className="mx-2">•</span>
                                <Phone className="h-3 w-3 mr-1" />
                                {shelter.contact.phone}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{shelter.capacity}</div>
                          <div className="text-xs text-muted-foreground">Capacity</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-medium ${getOccupancyColor(getOccupancyPercentage(shelter))}`}>
                            {getOccupancyPercentage(shelter)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Occupied</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-green-600">
                            ${shelter.totalDonations.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Donations</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-medium ${getComplianceColor(shelter.complianceScore)}`}>
                            {shelter.complianceScore}%
                          </div>
                          <div className="text-xs text-muted-foreground">Compliance</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(shelter.status)}>
                            {shelter.status}
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Pending Applications</h3>
            <div className="text-sm text-muted-foreground">
              {pendingApplications.length} applications awaiting review
            </div>
          </div>

          {pendingApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pending applications</h3>
                <p className="text-gray-600 dark:text-gray-400">All shelter applications have been processed.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{application.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {application.location} • {application.type}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <span>Applicant: {application.applicant}</span>
                            <span className="mx-2">•</span>
                            <Mail className="h-3 w-3 mr-1" />
                            {application.email}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{application.capacity}</div>
                          <div className="text-xs text-muted-foreground">Capacity</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{application.documents.length}</div>
                          <div className="text-xs text-muted-foreground">Documents</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{application.submittedDate}</div>
                          <div className="text-xs text-muted-foreground">Submitted</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6">
          <DataPopulator onDataUpdated={loadData} />
          
          {/* Firestore Structure Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Firestore Database Structure
              </CardTitle>
              <CardDescription>
                Multi-tenant architecture following the Supabase migration guide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm font-mono">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>Firebase Project: sheltr-ai-production</div>
                  <div className="ml-2">├── tenants/</div>
                  <div className="ml-4">├── platform/</div>
                  <div className="ml-6">├── shelters/ ({shelters.length} documents)</div>
                  <div className="ml-6">├── shelter_applications/ ({pendingApplications.length} documents)</div>
                  <div className="ml-6">└── users/ (super_admin users)</div>
                  <div className="ml-4">├── shelter-[id]/</div>
                  <div className="ml-6">├── users/ (shelter staff)</div>
                  <div className="ml-6">├── participants/ (recipients)</div>
                  <div className="ml-6">└── donations/ (shelter donations)</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-base mb-2">Security Rules</h4>
                    <div className="text-xs space-y-1">
                      <div>✅ Multi-tenant data isolation</div>
                      <div>✅ Role-based access control</div>
                      <div>✅ Firestore security rules enforced</div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-base mb-2">Data Features</h4>
                    <div className="text-xs space-y-1">
                      <div>✅ Real-time updates with onSnapshot</div>
                      <div>✅ Indexed queries for performance</div>
                      <div>✅ Timestamp tracking (created/updated)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 