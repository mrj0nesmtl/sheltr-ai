'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Home,
  Calendar,
  Gift,
  Star,
  ChevronRight,
  QrCode,
  Shield,
  Bell,
  Settings
} from 'lucide-react';

export default function DonorWalletPreview() {
  const donorStats = {
    totalDonated: 1250,
    participantsSupported: 8,
    recurringActive: 3,
    impactScore: 95
  };

  const recentDonations = [
    {
      id: 1,
      participant: "Sarah M.",
      amount: 25,
      date: "2 hours ago",
      purpose: "Groceries & essentials",
      housingProgress: 67,
      location: "Montreal, QC"
    },
    {
      id: 2,
      participant: "Marcus J.",
      amount: 50,
      date: "1 day ago", 
      purpose: "Job interview preparation",
      housingProgress: 34,
      location: "Vancouver, BC"
    },
    {
      id: 3,
      participant: "Elena R.",
      amount: 15,
      date: "3 days ago",
      purpose: "Transportation",
      housingProgress: 89,
      location: "Toronto, ON"
    }
  ];

  const recurringSupport = [
    {
      participant: "David K.",
      amount: 30,
      frequency: "Weekly",
      nextDonation: "Tomorrow",
      progress: 78,
      milestone: "Apartment viewing scheduled"
    },
    {
      participant: "Maria S.",
      amount: 25,
      frequency: "Bi-weekly", 
      nextDonation: "In 5 days",
      progress: 45,
      milestone: "Job training program started"
    },
    {
      participant: "James T.",
      amount: 40,
      frequency: "Monthly",
      nextDonation: "In 12 days",
      progress: 23,
      milestone: "ID documents obtained"
    }
  ];

  const milestones = [
    {
      participant: "Sarah M.",
      achievement: "Secured stable employment",
      date: "Yesterday",
      impact: "First paycheck received! Housing goal 67% complete.",
      badge: "Employment"
    },
    {
      participant: "Elena R.",
      achievement: "Housing application approved",
      date: "3 days ago", 
      impact: "Move-in date set for next week. Independence achieved!",
      badge: "Housing"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Donor Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your impact and stay connected with participants
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            3
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Donated</p>
                <p className="text-2xl font-bold text-green-600">${donorStats.totalDonated}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Participants Supported</p>
                <p className="text-2xl font-bold text-blue-600">{donorStats.participantsSupported}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recurring Active</p>
                <p className="text-2xl font-bold text-purple-600">{donorStats.recurringActive}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Impact Score</p>
                <p className="text-2xl font-bold text-orange-600">{donorStats.impactScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Donations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Recent Donations
              </CardTitle>
              <CardDescription>
                Your latest contributions and their impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{donation.participant}</h4>
                      <span className="text-lg font-bold text-green-600">${donation.amount}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{donation.purpose}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{donation.location} • {donation.date}</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Housing Progress</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">{donation.housingProgress}%</span>
                      </div>
                      <Progress value={donation.housingProgress} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <QrCode className="h-4 w-4 mr-2" />
                Make New Donation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Milestones */}
        <div className="space-y-6">
          {/* Recent Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Recent Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{milestone.participant}</h4>
                    <Badge variant="secondary" className="text-xs">{milestone.badge}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{milestone.achievement}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{milestone.impact}</p>
                  <p className="text-xs text-gray-500">{milestone.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Donation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                Quick Donation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">$10</Button>
                <Button variant="outline" size="sm">$25</Button>
                <Button variant="outline" size="sm">$50</Button>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <QrCode className="h-4 w-4 mr-2" />
                Scan to Donate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recurring Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Recurring Support
          </CardTitle>
          <CardDescription>
            Your ongoing commitments and their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recurringSupport.map((support, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">{support.participant}</h4>
                  <Badge variant="outline">{support.frequency}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-medium">${support.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Next:</span>
                    <span className="font-medium">{support.nextDonation}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-xs font-medium">{support.progress}%</span>
                    </div>
                    <Progress value={support.progress} className="h-2" />
                  </div>
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                    <p className="text-blue-800 dark:text-blue-200">{support.milestone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Home className="h-5 w-5" />
            Your SmartFund Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">$1,062.50</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Direct Support (85%)</p>
              <p className="text-xs text-gray-500">Immediate participant access</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">$125.00</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Housing Fund (10%)</p>
              <p className="text-xs text-gray-500">Growing at 4.2% annual yield</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">$62.50</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Shelter Operations (5%)</p>
              <p className="text-xs text-gray-500">Supporting 3 shelter partners</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              🏆 <strong>100% Efficiency:</strong> Every dollar creates measurable impact through our SmartFund™ distribution
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
