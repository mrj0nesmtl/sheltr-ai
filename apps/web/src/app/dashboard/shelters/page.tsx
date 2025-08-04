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
  X,
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
  
  // Filtering state
  const [filters, setFilters] = useState({
    location: '',
    status: '',
    type: '',
    occupancyLevel: '', // 'low', 'medium', 'high', 'at_capacity'
    searchTerm: ''
  });

  // Deduplicate shelters by ID to prevent duplicate key errors
  const uniqueShelters = shelters.filter((shelter, index, arr) => 
    arr.findIndex(s => s.id === shelter.id) === index
  );

  // Filter shelters based on current filters
  const filteredShelters = uniqueShelters.filter(shelter => {
    const matchesLocation = !filters.location || shelter.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesStatus = !filters.status || shelter.status === filters.status;
    const matchesType = !filters.type || shelter.type === filters.type;
    const matchesSearch = !filters.searchTerm || 
      shelter.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      shelter.location.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    let matchesOccupancy = true;
    if (filters.occupancyLevel) {
      const occupancyPercentage = (shelter.currentOccupancy / shelter.capacity) * 100;
      switch (filters.occupancyLevel) {
        case 'low':
          matchesOccupancy = occupancyPercentage < 50;
          break;
        case 'medium':
          matchesOccupancy = occupancyPercentage >= 50 && occupancyPercentage < 80;
          break;
        case 'high':
          matchesOccupancy = occupancyPercentage >= 80 && occupancyPercentage < 95;
          break;
        case 'at_capacity':
          matchesOccupancy = occupancyPercentage >= 95;
          break;
      }
    }
    
    return matchesLocation && matchesStatus && matchesType && matchesSearch && matchesOccupancy;
  });

  // Get unique values for filter options
  const uniqueLocations = [...new Set(uniqueShelters.map(s => s.location))];
  const uniqueStatuses = [...new Set(uniqueShelters.map(s => s.status))];
  const uniqueTypes = [...new Set(uniqueShelters.map(s => s.type))];

  // Update filters
  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      location: '',
      status: '',
      type: '',
      occupancyLevel: '',
      searchTerm: ''
    });
  };

  // Load data from Firestore
  const loadData = async () => {
    setLoading(true);
    try {
      const [sheltersData, applicationsData] = await Promise.all([
        firestoreService.getShelters('platform'), // Get shelters from platform/shelters collection
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

  // Calculate metrics from filtered data (for display) and raw data (for context)
  const shelterMetrics = {
    totalShelters: filteredShelters.length,
    allShelters: uniqueShelters.length, // Keep original count for "of X shelters" display
    activeShelters: filteredShelters.filter(s => s.status === 'active').length,
    pendingApplications: pendingApplications.length,
    averageOccupancy: filteredShelters.length > 0 
      ? Math.round(filteredShelters.reduce((acc, s) => acc + (s.capacity > 0 ? ((s.currentOccupancy || 0) / s.capacity * 100) : 0), 0) / filteredShelters.length * 10) / 10
      : 0,
    totalCapacity: filteredShelters.reduce((acc, s) => acc + s.capacity, 0),
    currentOccupants: filteredShelters.reduce((acc, s) => acc + (s.currentOccupancy || 0), 0),
    monthlyGrowth: 8.2, // This would come from historical data
    complianceScore: filteredShelters.length > 0 
      ? Math.round(filteredShelters.reduce((acc, s) => acc + (s.complianceScore || 0), 0) / filteredShelters.length * 10) / 10
      : 0
  };

  const performanceMetrics = filteredShelters
    .filter(s => s.status === 'active')
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .map(shelter => ({
      id: shelter.id,
      shelter: shelter.name,
      rating: shelter.rating || 0,
      donations: shelter.totalDonations || 0,
      participants: shelter.participants || 0,
      efficiency: shelter.complianceScore || 0
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Shelter Network</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Manage shelter directory, onboarding, and performance across the platform
          </p>
        </div>
        
        <div className="flex space-x-2 sm:space-x-3">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Shelter</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Live Data Indicator */}
      {!loading && (
        <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 dark:text-green-300 font-medium">
            LIVE FIRESTORE DATA - {uniqueShelters.length} unique shelters loaded from database
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

      {/* Global Filter Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Global Filters
          </CardTitle>
          <CardDescription>Filter shelters across all views (Overview, Map, Directory)</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search shelters..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-sm bg-background"
              />
            </div>
            
            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <select
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="">All Status</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              
              <select
                value={filters.occupancyLevel}
                onChange={(e) => updateFilter('occupancyLevel', e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="">All Occupancy</option>
                <option value="low">Low (&lt;50%)</option>
                <option value="medium">Medium (50-80%)</option>
                <option value="high">High (80-95%)</option>
                <option value="at_capacity">At Capacity (95%+)</option>
              </select>
            </div>
            
            {/* Clear Filters and Results Count */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="text-sm text-muted-foreground font-medium">
                Showing {filteredShelters.length} of {uniqueShelters.length} shelters
              </div>
              {(filters.searchTerm || filters.location || filters.status || filters.type || filters.occupancyLevel) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center space-x-1 w-fit"
                >
                  <X className="h-3 w-3" />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center">
              <Map className="mr-2 h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="directory" className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              Directory
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mobile Stacked Tabs */}
        <div className="sm:hidden">
          <TabsList className="grid grid-cols-5 gap-1 h-14 bg-muted p-1 rounded-md w-full">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Overview"
            >
              <Activity className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Map View"
            >
              <Map className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="directory" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Directory"
            >
              <Building2 className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Applications"
            >
              <FileText className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="data" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Data"
            >
              <Database className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Shelters</CardTitle>
              <CardDescription>Ranked by overall performance and community impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceMetrics.slice(0, 5).map((shelter, index) => (
                  <div key={`performance-${shelter.id}`} className="p-4 border rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 hover:shadow-md transition-all duration-200">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-3">
                      {/* Top Row: Rank, Name, Rating */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base truncate">{shelter.shelter}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            {renderStars(shelter.rating)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {shelter.rating > 0 ? shelter.rating.toFixed(1) : 'New'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Metrics Grid */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">${shelter.donations.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Donations</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{shelter.participants}</div>
                          <div className="text-xs text-muted-foreground">Participants</div>
                        </div>
                        <div>
                          <div className={`text-lg font-bold ${getComplianceColor(shelter.efficiency)}`}>
                            {shelter.efficiency}%
                          </div>
                          <div className="text-xs text-muted-foreground">Efficiency</div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{shelter.shelter}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            {renderStars(shelter.rating)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {shelter.rating > 0 ? shelter.rating.toFixed(1) : 'New'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">${shelter.donations.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Donations</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{shelter.participants}</div>
                          <div className="text-xs text-muted-foreground">Participants</div>
                        </div>
                        <div>
                          <div className={`text-lg font-bold ${getComplianceColor(shelter.efficiency)}`}>
                            {shelter.efficiency}%
                          </div>
                          <div className="text-xs text-muted-foreground">Efficiency</div>
                        </div>
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
                  <span className="text-sm">Low Occupancy (&lt;75%)</span>
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
            <div className="space-y-3">
              {shelters.map((shelter) => (
                <Card key={shelter.id} className="overflow-hidden">
                  <CardContent className="p-0 sm:p-6">
                    {/* Mobile Layout - Completely Redesigned */}
                    <div className="block sm:hidden">
                      {/* Header Section */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-blue-950/30 dark:via-slate-900 dark:to-blue-950/30">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <Building2 className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg leading-tight truncate text-gray-900 dark:text-white">
                                {shelter.name}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <MapPin className="h-4 w-4 mr-1 shrink-0" />
                                <span className="truncate">{shelter.location}</span>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                                {shelter.type}
                              </div>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(shelter.status)} shrink-0 ml-2`} variant="secondary">
                            {shelter.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Contact Section */}
                      <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-y border-gray-200 dark:border-gray-700">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <Mail className="h-4 w-4 mr-2 shrink-0 text-blue-500" />
                            <span className="truncate font-medium">{shelter.contact.email}</span>
                          </div>
                          {shelter.contact.phone && (
                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <Phone className="h-4 w-4 mr-2 shrink-0 text-green-500" />
                              <span className="font-medium">{shelter.contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Metrics Section */}
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{shelter.capacity}</div>
                            <div className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">Capacity</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                            <div className={`text-2xl font-bold ${getOccupancyColor(getOccupancyPercentage(shelter))}`}>
                              {getOccupancyPercentage(shelter)}%
                            </div>
                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Occupied</div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 text-center">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400">
                              ${shelter.totalDonations.toLocaleString()}
                            </div>
                            <div className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">Donations</div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 text-center">
                            <div className={`text-2xl font-bold ${getComplianceColor(shelter.complianceScore)}`}>
                              {shelter.complianceScore}%
                            </div>
                            <div className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">Compliance</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="px-4 pb-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-white dark:bg-slate-800">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm" className="px-3">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Building2 className="h-6 w-6 text-white" />
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
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{shelter.capacity}</div>
                            <div className="text-xs text-muted-foreground">Capacity</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getOccupancyColor(getOccupancyPercentage(shelter))}`}>
                              {getOccupancyPercentage(shelter)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Occupied</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              ${shelter.totalDonations.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Donations</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getComplianceColor(shelter.complianceScore)}`}>
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
                  <div className="ml-6">├── shelters/ ({uniqueShelters.length} unique documents)</div>
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