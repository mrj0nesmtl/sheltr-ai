'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAnalyticsData, AnalyticsData, getShelterMetrics } from '@/services/platformMetrics';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users,
  Bed,
  Heart,
  DollarSign,
  Calendar,
  Download,
  FileText,
  PieChart,
  Activity,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Loader2
} from 'lucide-react';

export default function ReportsPage() {
  const { user, hasRole } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shelterName, setShelterName] = useState<string>('Your Shelter');

  // Load real analytics data based on user's shelter_id
  useEffect(() => {
    const loadAnalyticsData = async () => {
      const shelterId = user?.customClaims?.shelter_id || user?.shelterId;
      
      if (!shelterId) {
        setError('No shelter assigned to this admin');
        setLoading(false);
        return;
      }

      try {
        console.log('📊 Loading analytics data for shelter:', shelterId);
        
        // Get analytics data and shelter info in parallel
        const [analytics, shelterMetrics] = await Promise.all([
          getAnalyticsData(shelterId),
          getShelterMetrics(shelterId)
        ]);
        
        if (analytics && shelterMetrics) {
          setAnalyticsData(analytics);
          setShelterName(shelterMetrics.shelterName);
          console.log('✅ Analytics data loaded:', analytics);
        } else {
          setError('Failed to load analytics data');
        }
      } catch (error) {
        console.error('❌ Failed to load analytics data:', error);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    if (user && hasRole('admin')) {
      loadAnalyticsData();
    }
  }, [user, hasRole]);

  // Recent reports - these would come from a reports collection in the future
  const recentReports = [
    { name: 'Monthly Operations Report', type: 'Operational', date: '2025-01-15', size: '2.4 MB' },
    { name: 'Quarterly Impact Analysis', type: 'Impact', date: '2025-01-10', size: '1.8 MB' },
    { name: 'Funding Utilization Report', type: 'Financial', date: '2025-01-08', size: '956 KB' },
    { name: 'Service Delivery Assessment', type: 'Program', date: '2025-01-05', size: '1.2 MB' },
    { name: 'Participant Demographics', type: 'Statistical', date: '2025-01-03', size: '745 KB' }
  ];

  const getOccupancyPercentage = (occupancy: number, capacity: number) => {
    return (occupancy / capacity) * 100;
  };

  const getServiceEfficiency = (provided: number, requested: number) => {
    return (provided / requested) * 100;
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  // Check if user has shelter admin or super admin access
  if (!hasRole('admin') && !hasRole('super_admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Shelter Admin access required for this dashboard.
        </p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Loading analytics data...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading shelter analytics...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics Error</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Unable to load analytics data
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to Load Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {shelterName} • Real Data Analytics • Status: ✅ Live Analytics Connected
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Stay Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.keyMetrics.averageStayDuration}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on real participant data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.keyMetrics.successRate}</div>
            <p className="text-xs text-muted-foreground mt-1">Positive outcomes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bed Utilization</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.keyMetrics.bedUtilization}</div>
            <p className="text-xs text-muted-foreground mt-1">Real occupancy data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Satisfaction</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.keyMetrics.serviceSatisfaction}</div>
            <p className="text-xs text-muted-foreground mt-1">Average rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Dashboard */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Analytics Dashboard</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={selectedPeriod === 'week' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedPeriod('week')}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={selectedPeriod === 'month' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedPeriod('month')}
                  >
                    Month
                  </Button>
                  <Button 
                    variant={selectedPeriod === 'year' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedPeriod('year')}
                  >
                    Year
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Occupancy Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analyticsData.occupancyTrend.slice(-3).map((data, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{data.month}</span>
                                <span>{data.occupancy}/{data.capacity}</span>
                              </div>
                              <Progress value={getOccupancyPercentage(data.occupancy, data.capacity)} />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Demographics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analyticsData.demographics.slice(0, 6).map((demo, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm">{demo.category}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{demo.count}</span>
                                <span className="text-xs text-gray-500">({demo.percentage}%)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="occupancy" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Occupancy Analysis</CardTitle>
                      <CardDescription>Real bed utilization data from {shelterName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.occupancyTrend.map((data, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{data.month} 2025</span>
                              <span className="text-sm">
                                {data.occupancy}/{data.capacity} beds ({Math.round(getOccupancyPercentage(data.occupancy, data.capacity))}%)
                              </span>
                            </div>
                            <Progress value={getOccupancyPercentage(data.occupancy, data.capacity)} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="services" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Service Delivery Analysis</CardTitle>
                      <CardDescription>Real service statistics from {shelterName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.serviceStats.map((service, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{service.service}</span>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm">
                                  {service.provided}/{service.requested} requests
                                </span>
                                <Badge variant="outline">
                                  ⭐ {service.satisfaction}
                                </Badge>
                              </div>
                            </div>
                            <Progress value={getServiceEfficiency(service.provided, service.requested)} />
                            <p className="text-xs text-gray-500">
                              {Math.round(getServiceEfficiency(service.provided, service.requested))}% fulfillment rate
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="outcomes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Participant Outcomes</CardTitle>
                      <CardDescription>Real exit destinations and success metrics from {shelterName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.participantOutcomes.map((outcome, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{outcome.outcome}</span>
                              <span className="text-sm">{outcome.count} participants ({outcome.percentage}%)</span>
                            </div>
                            <Progress value={outcome.percentage} />
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800 dark:text-green-200">
                            {analyticsData.keyMetrics.successRate} Success Rate
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Real success metrics based on participant outcomes data
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
              <CardDescription>Generate instant reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Daily Operations
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Participant Summary
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Occupancy Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Heart className="mr-2 h-4 w-4" />
                Service Delivery
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Financial Summary
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{report.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{report.type}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{report.date}</span>
                      <span className="text-xs text-gray-500">{report.size}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Daily Operations</span>
                <Badge variant="outline">Daily 6 AM</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Weekly Summary</span>
                <Badge variant="outline">Mon 8 AM</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Monthly Report</span>
                <Badge variant="outline">1st of month</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Quarterly Analysis</span>
                <Badge variant="outline">Quarterly</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 