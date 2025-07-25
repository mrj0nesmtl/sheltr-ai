"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Building2,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  MapPin,
  Clock,
  Target,
  Zap,
  Heart,
  Globe,
  PieChart
} from 'lucide-react';

// Mock data for analytics dashboard
const analyticsMetrics = {
  totalDonations: 89234.67,
  donationGrowth: 23.4,
  totalUsers: 2847,
  userGrowth: 12.5,
  activeParticipants: 1203,
  participantGrowth: 18.7,
  avgDonationAmount: 48.35,
  donationFrequency: 2.3,
  platformRevenue: 4461.73,
  conversionRate: 15.8
};

const donationTrends = [
  { month: 'Jan', donations: 12450.00, count: 289, avgAmount: 43.08 },
  { month: 'Feb', donations: 15620.30, count: 342, avgAmount: 45.67 },
  { month: 'Mar', donations: 18900.15, count: 398, avgAmount: 47.49 },
  { month: 'Apr', donations: 22450.80, count: 456, avgAmount: 49.23 },
  { month: 'May', donations: 26780.45, count: 523, avgAmount: 51.20 },
  { month: 'Jun', donations: 31200.67, count: 612, avgAmount: 50.98 },
  { month: 'Jul', donations: 42834.67, count: 847, avgAmount: 50.57 }
];

const userEngagement = [
  { category: 'Donors', total: 8934, active: 7832, engagement: 87.7, growth: 15.2 },
  { category: 'Participants', total: 1203, active: 1056, engagement: 87.8, growth: 18.7 },
  { category: 'Admins', total: 23, active: 21, engagement: 91.3, growth: 8.3 },
  { category: 'Shelters', total: 156, active: 152, engagement: 97.4, growth: 8.2 }
];

const geographicData = [
  { region: 'North America', shelters: 89, participants: 756, donations: 45234.67, growth: 12.3 },
  { region: 'Europe', shelters: 34, participants: 298, donations: 18750.22, growth: 23.1 },
  { region: 'Asia Pacific', shelters: 21, participants: 124, donations: 15890.45, growth: 34.5 },
  { region: 'Other', shelters: 12, participants: 25, donations: 9359.33, growth: 8.7 }
];

const topPerformers = [
  { name: 'Safe Harbor Foundation', type: 'Shelter', metric: '$23,567', category: 'Donations Received', growth: 18.5 },
  { name: 'David Thompson', type: 'Donor', metric: '$5,670', category: 'Total Donated', growth: 25.3 },
  { name: 'Downtown Hope Center', type: 'Shelter', metric: '145', category: 'Active Participants', growth: 12.1 },
  { name: 'Jennifer Williams', type: 'Donor', metric: '15', category: 'Donation Count', growth: 8.7 }
];

const realTimeActivity = [
  { time: '14:30', event: 'New donation', amount: '$125.00', location: 'Seattle, WA' },
  { time: '14:28', event: 'Participant registered', shelter: 'Hope Center', location: 'Portland, OR' },
  { time: '14:25', event: 'Large donation', amount: '$500.00', location: 'Vancouver, BC' },
  { time: '14:22', event: 'Shelter application', shelter: 'Community Center', location: 'San Francisco, CA' },
  { time: '14:20', event: 'QR code scan', participant: 'John D.', location: 'Seattle, WA' }
];

const insights = [
  {
    title: 'Peak Donation Hours',
    description: 'Donations are 40% higher between 2-4 PM on weekdays',
    impact: 'High',
    recommendation: 'Schedule social media campaigns during peak hours'
  },
  {
    title: 'Geographic Expansion',
    description: 'Asia Pacific region shows 34.5% growth - highest globally',
    impact: 'Medium',
    recommendation: 'Consider targeted marketing in APAC region'
  },
  {
    title: 'User Retention',
    description: 'Donor retention rate improved to 87.7% this quarter',
    impact: 'High',
    recommendation: 'Continue current engagement strategies'
  },
  {
    title: 'Average Donation Trending Up',
    description: 'Average donation amount increased 8.2% month-over-month',
    impact: 'Medium',
    recommendation: 'Analyze what\'s driving larger donations'
  }
];

export default function Analytics() {
  const getGrowthColor = (growth: number) => {
    if (growth > 20) return 'text-green-600';
    if (growth > 10) return 'text-blue-600';
    if (growth > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Platform-wide analytics, insights, and performance metrics
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsMetrics.totalDonations.toLocaleString()}</div>
            <div className={`flex items-center text-xs ${getGrowthColor(analyticsMetrics.donationGrowth)}`}>
              {getGrowthIcon(analyticsMetrics.donationGrowth)}
              <span className="ml-1">+{analyticsMetrics.donationGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsMetrics.totalUsers.toLocaleString()}</div>
            <div className={`flex items-center text-xs ${getGrowthColor(analyticsMetrics.userGrowth)}`}>
              {getGrowthIcon(analyticsMetrics.userGrowth)}
              <span className="ml-1">+{analyticsMetrics.userGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsMetrics.activeParticipants.toLocaleString()}</div>
            <div className={`flex items-center text-xs ${getGrowthColor(analyticsMetrics.participantGrowth)}`}>
              {getGrowthIcon(analyticsMetrics.participantGrowth)}
              <span className="ml-1">+{analyticsMetrics.participantGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Donation</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsMetrics.avgDonationAmount}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="h-3 w-3 mr-1" />
              {analyticsMetrics.donationFrequency}x frequency
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsMetrics.conversionRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Above industry avg
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="donations">
            <DollarSign className="mr-2 h-4 w-4" />
            Donations
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="geographic">
            <Globe className="mr-2 h-4 w-4" />
            Geographic
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Eye className="mr-2 h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donation Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Donation Trends</CardTitle>
                <CardDescription>Monthly donation volume and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donationTrends.slice(-4).map((trend) => (
                    <div key={trend.month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="font-medium">{trend.month} 2024</div>
                      <div className="text-right">
                        <div className="font-semibold">${trend.donations.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{trend.count} donations</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time Activity</CardTitle>
                <CardDescription>Live platform events and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {realTimeActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{activity.event}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.time} • {activity.location}
                          {activity.amount && ` • ${activity.amount}`}
                          {activity.shelter && ` • ${activity.shelter}`}
                          {activity.participant && ` • ${activity.participant}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Leading contributors across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{performer.type}</Badge>
                      <div className={`flex items-center text-xs ${getGrowthColor(performer.growth)}`}>
                        {getGrowthIcon(performer.growth)}
                        <span className="ml-1">+{performer.growth}%</span>
                      </div>
                    </div>
                    <div className="font-medium text-sm">{performer.name}</div>
                    <div className="text-lg font-bold">{performer.metric}</div>
                    <div className="text-xs text-muted-foreground">{performer.category}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Donation Volume Trends</CardTitle>
                <CardDescription>Monthly donation amounts and transaction counts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donationTrends.map((trend) => (
                    <div key={trend.month} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{trend.month} 2024</div>
                        <div className="text-sm text-muted-foreground">{trend.count} transactions</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${trend.donations.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">${trend.avgAmount} avg</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Insights</CardTitle>
                <CardDescription>Key donation metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">${analyticsMetrics.avgDonationAmount}</div>
                    <div className="text-sm text-muted-foreground">Average Donation</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analyticsMetrics.donationFrequency}x</div>
                    <div className="text-sm text-muted-foreground">Monthly Frequency</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${analyticsMetrics.platformRevenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Platform Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Analytics</CardTitle>
              <CardDescription>Engagement metrics across all user types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userEngagement.map((category) => (
                  <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        {category.category === 'Donors' && <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                        {category.category === 'Participants' && <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                        {category.category === 'Admins' && <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                        {category.category === 'Shelters' && <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <div>
                        <div className="font-medium">{category.category}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.active} of {category.total} active
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{category.engagement}%</div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                      <div className={`text-center ${getGrowthColor(category.growth)}`}>
                        <div className="flex items-center text-lg font-bold">
                          {getGrowthIcon(category.growth)}
                          <span className="ml-1">{category.growth}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Growth</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Platform reach and performance by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicData.map((region) => (
                  <div key={region.region} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">{region.region}</div>
                        <div className="text-sm text-muted-foreground">
                          {region.shelters} shelters • {region.participants} participants
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">${region.donations.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Donations</div>
                      </div>
                      <div className={`text-center ${getGrowthColor(region.growth)}`}>
                        <div className="flex items-center text-lg font-bold">
                          {getGrowthIcon(region.growth)}
                          <span className="ml-1">{region.growth}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Growth</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Data-driven recommendations for platform optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="font-medium">{insight.title}</div>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} Impact
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </div>
                    <div className="text-sm">
                      <strong>Recommendation:</strong> {insight.recommendation}
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