'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Users, 
  Home, 
  Utensils, 
  GraduationCap,
  Briefcase,
  TrendingUp,
  Calendar,
  MapPin,
  Share2,
  Download,
  ChevronRight,
  Star
} from 'lucide-react';

export default function DonorImpactPage() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  // Mock impact data
  const impactStats = {
    totalDonated: 2850,
    peopleHelped: 23,
    mealsProvided: 142,
    nightsShelter: 8,
    jobsSecured: 3,
    programsSupported: 7
  };

  const impactByCategory = [
    { category: 'Emergency Shelter', amount: 1200, percentage: 42, color: 'bg-blue-500' },
    { category: 'Meals & Food', amount: 850, percentage: 30, color: 'bg-green-500' },
    { category: 'Job Training', amount: 450, percentage: 16, color: 'bg-purple-500' },
    { category: 'Mental Health', amount: 350, percentage: 12, color: 'bg-orange-500' }
  ];

  const impactStories = [
    {
      id: 1,
      name: 'Maria S.',
      image: '/api/placeholder/64/64',
      story: 'Thanks to your support, I was able to get back on my feet after losing my job. The shelter provided me with a safe place to stay while I completed job training.',
      outcome: 'Now employed as a certified nursing assistant',
      date: '3 months ago',
      shelter: 'Downtown Hope Shelter'
    },
    {
      id: 2,
      name: 'Robert T.',
      image: '/api/placeholder/64/64',
      story: 'Your donations helped me through the hardest time of my life. The counseling services gave me the tools to overcome addiction.',
      outcome: 'Celebrating 6 months of sobriety',
      date: '6 months ago',
      shelter: 'Old Brewery Mission'
    },
    {
      id: 3,
      name: 'Jennifer M.',
      image: '/api/placeholder/64/64',
      story: 'The emergency shelter was there when I needed it most. Your kindness gave me hope during a dark period.',
      outcome: 'Secured permanent housing',
      date: '1 year ago',
      shelter: 'Union Gospel Mission'
    }
  ];

  const communityImpact = [
    { metric: 'Bed Occupancy Rate', value: '94%', change: '+3%', trend: 'up' },
    { metric: 'Program Completion', value: '87%', change: '+12%', trend: 'up' },
    { metric: 'Job Placement Rate', value: '78%', change: '+8%', trend: 'up' },
    { metric: 'Housing Retention', value: '92%', change: '+5%', trend: 'up' }
  ];

  const shelterProgress = [
    {
      shelter: 'Downtown Hope Shelter',
      goal: 50000,
      raised: 38500,
      percentage: 77,
      donors: 156,
      daysLeft: 45
    },
    {
      shelter: 'Old Brewery Mission',
      goal: 30000,
      raised: 28200,
      percentage: 94,
      donors: 98,
      daysLeft: 12
    },
    {
      shelter: 'Union Gospel Mission',
      goal: 40000,
      raised: 22100,
      percentage: 55,
      donors: 87,
      daysLeft: 78
    }
  ];

  // Only show for donor role
  if (user?.role !== 'donor' && user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Donor role required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Impact
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            See the real difference your donations are making in our community
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Impact
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Impact Timeframe</h3>
            <div className="flex gap-2">
              {['3m', '6m', '1y', 'all'].map((period) => (
                <Button
                  key={period}
                  variant={selectedTimeframe === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe(period)}
                >
                  {period === 'all' ? 'All Time' : period.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">${impactStats.totalDonated.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">People Helped</p>
                <p className="text-2xl font-bold text-gray-900">{impactStats.peopleHelped}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Meals Provided</p>
                <p className="text-2xl font-bold text-gray-900">{impactStats.mealsProvided}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nights Shelter</p>
                <p className="text-2xl font-bold text-gray-900">{impactStats.nightsShelter}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Jobs Secured</p>
                <p className="text-2xl font-bold text-gray-900">{impactStats.jobsSecured}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-pink-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Programs Supported</p>
                <p className="text-2xl font-bold text-gray-900">{impactStats.programsSupported}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="breakdown" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakdown">Impact Breakdown</TabsTrigger>
          <TabsTrigger value="stories">Success Stories</TabsTrigger>
          <TabsTrigger value="community">Community Impact</TabsTrigger>
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
        </TabsList>

        {/* Impact Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Breakdown by Category</CardTitle>
                <CardDescription>
                  See how your donations are being used across different programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactByCategory.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-gray-600">${category.amount} ({category.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${category.color} h-2 rounded-full`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Impact Trend</CardTitle>
                <CardDescription>
                  Your impact over the past 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">This Month</span>
                    <span className="text-2xl font-bold text-green-600">+15%</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Your donations helped 4 more people this month compared to last month
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">8</p>
                      <p className="text-xs text-gray-600">People Housed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">45</p>
                      <p className="text-xs text-gray-600">Meals Served</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">2</p>
                      <p className="text-xs text-gray-600">Jobs Found</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Success Stories Tab */}
        <TabsContent value="stories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Success Stories</CardTitle>
              <CardDescription>
                Real stories from people whose lives were changed by your generosity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {impactStories.map((story) => (
                  <div key={story.id} className="border rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{story.name}</h3>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{story.shelter}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">"{story.story}"</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Star className="h-3 w-3 mr-1" />
                            {story.outcome}
                          </Badge>
                          <span className="text-sm text-gray-500">{story.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Impact Tab */}
        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community-Wide Impact</CardTitle>
              <CardDescription>
                See how your contributions are helping improve overall shelter performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {communityImpact.map((metric) => (
                  <div key={metric.metric} className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">{metric.metric}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                    <div className="flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">{metric.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network-Wide Statistics</CardTitle>
              <CardDescription>
                Your donations are part of a larger community effort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">847</p>
                  <p className="text-sm text-gray-600">Total People Served This Month</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">95%</p>
                  <p className="text-sm text-gray-600">Average Satisfaction Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">$127K</p>
                  <p className="text-sm text-gray-600">Total Raised This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Fundraising Campaigns</CardTitle>
              <CardDescription>
                Current campaigns where your additional support can make a difference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {shelterProgress.map((campaign) => (
                  <div key={campaign.shelter} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{campaign.shelter}</h3>
                      <Badge variant="outline">{campaign.daysLeft} days left</Badge>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>${campaign.raised.toLocaleString()} of ${campaign.goal.toLocaleString()}</span>
                      </div>
                      <Progress value={campaign.percentage} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{campaign.donors} donors</span>
                      <Button size="sm">
                        Contribute
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
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