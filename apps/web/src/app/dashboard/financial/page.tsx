"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Activity,
  CreditCard,
  Banknote,
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Mock data for financial oversight
const financialMetrics = {
  totalRevenue: 4461.73,
  monthlyGrowth: 18.2,
  totalDonations: 89234.67,
  platformFees: 4461.73,
  processingFees: 892.35,
  transactionCount: 1847,
  avgDonation: 48.35,
  fraudRate: 0.02
};

const recentTransactions = [
  {
    id: 'tx_001',
    type: 'donation',
    amount: 125.00,
    participant: 'John D.',
    donor: 'Jennifer W.',
    shelter: 'Downtown Hope Center',
    timestamp: '2024-07-24 14:30:15',
    status: 'completed',
    fees: 6.25
  },
  {
    id: 'tx_002',
    type: 'donation',
    amount: 50.00,
    participant: 'Maria S.',
    donor: 'David T.',
    shelter: 'Riverside Shelter',
    timestamp: '2024-07-24 14:15:30',
    status: 'completed',
    fees: 2.50
  },
  {
    id: 'tx_003',
    type: 'donation',
    amount: 500.00,
    participant: 'Robert K.',
    donor: 'Anonymous',
    shelter: 'Safe Harbor Foundation',
    timestamp: '2024-07-24 13:45:22',
    status: 'pending',
    fees: 25.00
  },
  {
    id: 'tx_004',
    type: 'payout',
    amount: 1000.00,
    participant: 'Multiple',
    shelter: 'Downtown Hope Center',
    timestamp: '2024-07-24 13:30:10',
    status: 'completed',
    fees: 5.00
  }
];

const fraudAlerts = [
  {
    id: 1,
    level: 'high',
    description: 'Unusual donation pattern detected',
    details: 'User attempting multiple $500 donations in 5 minutes',
    timestamp: '15 minutes ago',
    status: 'investigating'
  },
  {
    id: 2,
    level: 'medium',
    description: 'Velocity check triggered',
    details: 'Same IP address making donations across multiple participants',
    timestamp: '2 hours ago',
    status: 'resolved'
  },
  {
    id: 3,
    level: 'low',
    description: 'Card verification failed',
    details: 'CVV mismatch on donation attempt',
    timestamp: '4 hours ago',
    status: 'auto_blocked'
  }
];

const revenueBreakdown = [
  { category: 'Platform Fees (5%)', amount: 4461.73, percentage: 83.4 },
  { category: 'Processing Fees', amount: 892.35, percentage: 16.6 }
];

const monthlyRevenueData = [
  { month: 'Jan', revenue: 2850.25, donations: 57005.0 },
  { month: 'Feb', revenue: 3240.80, donations: 64816.0 },
  { month: 'Mar', revenue: 3920.15, donations: 78403.0 },
  { month: 'Apr', revenue: 4461.73, donations: 89234.67 }
];

export default function FinancialOversight() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Oversight</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Transaction monitoring, revenue analytics, and fraud detection
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

      {/* Financial Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialMetrics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{financialMetrics.monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialMetrics.totalDonations.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="h-3 w-3 mr-1" />
              {financialMetrics.transactionCount} transactions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialMetrics.avgDonation}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              Per transaction
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{financialMetrics.fraudRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <Shield className="h-3 w-3 mr-1" />
              Well below industry average
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Oversight Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">
            <Activity className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <TrendingUp className="mr-2 h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="fraud">
            <Shield className="mr-2 h-4 w-4" />
            Fraud Detection
          </TabsTrigger>
          <TabsTrigger value="audit">
            <FileText className="mr-2 h-4 w-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recent Transactions</h3>
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
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-6 border-b last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        {tx.type === 'donation' ? (
                          <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{tx.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {tx.type === 'donation' ? `${tx.donor} → ${tx.participant}` : 'Platform Payout'}
                        </div>
                        <div className="text-xs text-muted-foreground">{tx.shelter}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">${tx.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Amount</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">${tx.fees.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Fees</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{tx.timestamp.split(' ')[1]}</div>
                        <div className="text-xs text-muted-foreground">{tx.timestamp.split(' ')[0]}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(tx.status)}
                        <Badge className={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Current month revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{item.category}</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="font-medium">${item.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trends</CardTitle>
                <CardDescription>Revenue and donation volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyRevenueData.map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="font-medium">{month.month} 2024</div>
                      <div className="text-right">
                        <div className="font-medium">${month.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          ${month.donations.toLocaleString()} donated
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fraud Detection Tab */}
        <TabsContent value="fraud" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Fraud Detection & Alerts</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Configure Rules
              </Button>
              <Button variant="outline" size="sm">
                View All Alerts
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="space-y-4">
              {fraudAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">{alert.description}</div>
                      <Badge className={getAlertColor(alert.level)}>
                        {alert.level}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{alert.details}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {alert.timestamp} • Status: {alert.status}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Financial Audit Trail</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Audit Log
              </Button>
              <Button variant="outline" size="sm">
                Generate Report
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Audit Summary</CardTitle>
              <CardDescription>Complete transaction history and compliance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">1,847</div>
                  <div className="text-sm text-muted-foreground">Total Transactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Audit Coverage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Discrepancies</div>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Complete Audit Trail
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 