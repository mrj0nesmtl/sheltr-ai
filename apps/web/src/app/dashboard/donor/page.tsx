"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Users, 
  MapPin,
  Target,
  Calendar,
  PiggyBank,
  Receipt,
  Award,
  ChevronRight,
  ExternalLink,
  Download
} from 'lucide-react';

// Mock data for donor dashboard
const donorData = {
  donorName: "Sarah Johnson",
  totalDonated: 2850.00,
  taxDeductible: 2850.00,
  impactScore: 92,
  donationsThisYear: 12,
  lastDonation: "2024-01-10",
  recurringDonations: 3,
  sheltersSupported: 5,
  participantsHelped: 23,
  totalTaxDocuments: 12,
  pendingReceipts: 2,
  nextRecurringDonation: "2024-01-15",
  totalRewards: 285  // Mock blockchain rewards
};

const recentDonations = [
  {
    id: 1,
    date: "2024-01-10",
    amount: 150.00,
    shelter: "Downtown Hope Shelter",
    type: "one-time",
    status: "completed",
    impact: "Provided 30 meals"
  },
  {
    id: 2,
    date: "2024-01-01",
    amount: 100.00,
    shelter: "Riverside Community Center",
    type: "recurring",
    status: "completed",
    impact: "Supported 2 participants"
  },
  {
    id: 3,
    date: "2023-12-25",
    amount: 200.00,
    shelter: "Hope Center",
    type: "one-time",
    status: "completed",
    impact: "Holiday meal program"
  },
  {
    id: 4,
    date: "2023-12-15",
    amount: 75.00,
    shelter: "Downtown Hope Shelter",
    type: "recurring",
    status: "completed",
    impact: "Emergency assistance fund"
  }
];

const impactMetrics = [
  {
    icon: Users,
    label: "People Helped",
    value: donorData.participantsHelped,
    description: "Direct impact on participants"
  },
  {
    icon: MapPin,
    label: "Shelters Supported",
    value: donorData.sheltersSupported,
    description: "Organizations receiving support"
  },
  {
    icon: Heart,
    label: "Total Donations",
    value: donorData.donationsThisYear,
    description: "Contributions this year"
  },
  {
    icon: Award,
    label: "Impact Score",
    value: `${donorData.impactScore}%`,
    description: "Community impact rating"
  }
];

export default function DonorDashboard() {
  const { user, hasRole } = useAuth();

  // Check if user has donor or super admin access
  if (!hasRole('donor') && !hasRole('super_admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Donor access required for this dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {donorData.donorName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your Giving Dashboard • Total Impact: ${donorData.totalDonated.toLocaleString()} • Last donation: {new Date(donorData.lastDonation).toLocaleDateString()}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${donorData.totalDonated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Tax deductible: ${donorData.taxDeductible.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SHELTR Rewards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donorData.totalRewards}</div>
            <p className="text-xs text-muted-foreground">
              SHELTR tokens earned
            </p>
            <Badge variant="outline" className="mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Blockchain Ready
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">People Helped</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donorData.participantsHelped}</div>
            <p className="text-xs text-muted-foreground">
              Across {donorData.sheltersSupported} shelters
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{donorData.impactScore}%</div>
            <p className="text-xs text-muted-foreground">
              Community impact rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Donation Management & Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your giving and impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Heart className="mr-2 h-4 w-4" />
              Make New Donation
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <PiggyBank className="mr-2 h-4 w-4" />
              Setup Recurring Gift
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Receipt className="mr-2 h-4 w-4" />
              Download Tax Docs
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              Find New Shelters
            </Button>
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Your latest contributions and their impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">${donation.amount.toFixed(2)}</p>
                      <Badge variant={donation.type === 'recurring' ? 'default' : 'outline'}>
                        {donation.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {donation.shelter} • {new Date(donation.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-green-600">
                      {donation.impact}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Donations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {impactMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tax Documents & Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Documents</CardTitle>
            <CardDescription>Download receipts and documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">2024 Tax Summary</p>
                  <p className="text-xs text-muted-foreground">
                    ${donorData.totalDonated.toLocaleString()} deductible
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Individual Receipts</p>
                  <p className="text-xs text-muted-foreground">
                    {donorData.totalTaxDocuments} documents available
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>

              {donorData.pendingReceipts > 0 && (
                <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Pending Receipts</p>
                    <p className="text-xs text-muted-foreground">
                      {donorData.pendingReceipts} receipts being processed
                    </p>
                  </div>
                  <Badge variant="outline">
                    Processing
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SHELTR Portfolio (Preview)</CardTitle>
            <CardDescription>Your blockchain rewards and token holdings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <Award className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium">Blockchain Integration Coming Soon</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your SHELTR tokens will appear here when blockchain features launch
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold">{donorData.totalRewards}</div>
                  <div className="text-xs text-muted-foreground">SHELTR Earned</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold">$0.00</div>
                  <div className="text-xs text-muted-foreground">Token Value</div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Learn About SHELTR Tokens
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recurring Donations Status */}
      {donorData.recurringDonations > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recurring Donations</CardTitle>
            <CardDescription>Your automatic giving schedule and next payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {donorData.recurringDonations} active recurring donations
                </p>
                <p className="text-xs text-muted-foreground">
                  Next payment: {new Date(donorData.nextRecurringDonation).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button variant="outline" size="sm">
                  <PiggyBank className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 