'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Search
} from 'lucide-react';

// Mock data for reports
const occupancyData = [
  { month: 'Jul', occupancy: 78, capacity: 120 },
  { month: 'Aug', occupancy: 82, capacity: 120 },
  { month: 'Sep', occupancy: 85, capacity: 120 },
  { month: 'Oct', occupancy: 91, capacity: 120 },
  { month: 'Nov', occupancy: 89, capacity: 120 },
  { month: 'Dec', occupancy: 94, capacity: 120 },
  { month: 'Jan', occupancy: 89, capacity: 120 }
];

const outcomesData = [
  { outcome: 'Permanent Housing', count: 23, percentage: 38 },
  { outcome: 'Transitional Housing', count: 15, percentage: 25 },
  { outcome: 'Family Reunification', count: 8, percentage: 13 },
  { outcome: 'Treatment Program', count: 6, percentage: 10 },
  { outcome: 'Other Support', count: 8, percentage: 14 }
];

const servicesData = [
  { service: 'Medical Care', provided: 145, requested: 178, satisfaction: 4.2 },
  { service: 'Mental Health', provided: 89, requested: 95, satisfaction: 4.5 },
  { service: 'Job Training', provided: 67, requested: 85, satisfaction: 4.1 },
  { service: 'Legal Aid', provided: 34, requested: 42, satisfaction: 4.3 },
  { service: 'Financial Planning', provided: 56, requested: 61, satisfaction: 4.0 },
  { service: 'Substance Abuse', provided: 28, requested: 35, satisfaction: 4.4 }
];

const demographicsData = [
  { category: 'Age 18-25', count: 12, percentage: 13 },
  { category: 'Age 26-35', count: 28, percentage: 31 },
  { category: 'Age 36-50', count: 31, percentage: 35 },
  { category: 'Age 51+', count: 18, percentage: 21 },
  { category: 'Male', count: 52, percentage: 58 },
  { category: 'Female', count: 34, percentage: 38 },
  { category: 'Non-binary', count: 3, percentage: 4 },
  { category: 'Veterans', count: 15, percentage: 17 },
  { category: 'Families', count: 8, percentage: 9 }
];

const keyMetrics = [
  {
    title: 'Average Stay Duration',
    value: '45 days',
    change: '-3 days',
    trend: 'down',
    icon: Clock,
    description: 'Compared to last month'
  },
  {
    title: 'Success Rate',
    value: '76%',
    change: '+5%',
    trend: 'up',
    icon: CheckCircle,
    description: 'Positive outcomes'
  },
  {
    title: 'Bed Utilization',
    value: '89%',
    change: '+2%',
    trend: 'up',
    icon: Bed,
    description: 'Average occupancy'
  },
  {
    title: 'Service Satisfaction',
    value: '4.3/5',
    change: '+0.2',
    trend: 'up',
    icon: Heart,
    description: 'Average rating'
  }
];

const recentReports = [
  { name: 'Monthly Operations Report', type: 'Operational', date: '2025-01-15', size: '2.4 MB' },
  { name: 'Quarterly Impact Analysis', type: 'Impact', date: '2025-01-10', size: '1.8 MB' },
  { name: 'Funding Utilization Report', type: 'Financial', date: '2025-01-08', size: '956 KB' },
  { name: 'Service Delivery Assessment', type: 'Program', date: '2025-01-05', size: '1.2 MB' },
  { name: 'Participant Demographics', type: 'Statistical', date: '2025-01-03', size: '745 KB' }
];

export default function ReportsPage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into shelter operations and outcomes
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
        {keyMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const TrendIcon = getTrendIcon(metric.trend);
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`flex items-center text-xs ${getTrendColor(metric.trend)}`}>
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {metric.change}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
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
                          {occupancyData.slice(-3).map((data, index) => (
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
                          {demographicsData.slice(0, 6).map((demo, index) => (
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
                      <CardDescription>Bed utilization over the past 7 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {occupancyData.map((data, index) => (
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
                      <CardDescription>Services provided vs. requested with satisfaction ratings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {servicesData.map((service, index) => (
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
                      <CardDescription>Exit destinations and success metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {outcomesData.map((outcome, index) => (
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
                            76% Success Rate
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Positive outcomes (permanent housing, transitional housing, family reunification)
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