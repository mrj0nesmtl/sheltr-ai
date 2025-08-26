"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp,
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
import { useState, useEffect } from 'react';
import { 
  getFinancialMetrics, 
  getRecentTransactions, 
  getRevenueBreakdown,
  type FinancialMetrics,
  type Transaction,
  type RevenueBreakdown
} from '@/services/financialService';
import { FinancialChart } from '@/components/charts/FinancialChart';
import { TransactionChart } from '@/components/charts/TransactionChart';

export default function FinancialOversight() {
  // Real data state
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load financial data
  const loadFinancialData = async () => {
    try {
      console.log('💰 [FINANCIAL] Loading real financial data...');
      setLoading(true);
      
      const [metrics, transactions, breakdown] = await Promise.all([
        getFinancialMetrics(),
        getRecentTransactions(10),
        getRevenueBreakdown()
      ]);
      
      setFinancialMetrics(metrics);
      setRecentTransactions(transactions);
      setRevenueBreakdown(breakdown);
      
      console.log('✅ [FINANCIAL] Financial data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    loadFinancialData();
  }, []);

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

  // Mock data for charts (TODO: Replace with real data)
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 2850.25, donations: 57005.0 },
    { month: 'Feb', revenue: 3240.80, donations: 64816.0 },
    { month: 'Mar', revenue: 3920.15, donations: 78403.0 },
    { month: 'Apr', revenue: financialMetrics?.totalRevenue || 0, donations: financialMetrics?.totalDonations || 0 }
  ];
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
            <DollarSign className="h-8 w-8 mr-3" />
            Financial Oversight
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Transaction monitoring, revenue analytics, and fraud detection
          </p>
        </div>
        
        <div className="flex space-x-2 sm:space-x-3">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <RefreshCw className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Refresh Data</span>
            <span className="sm:hidden">Refresh</span>
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
            <div className="text-2xl font-bold">
              {loading ? 'Loading...' : `$${financialMetrics?.totalRevenue.toLocaleString() || '0'}`}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{financialMetrics?.monthlyGrowth || 0}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 'Loading...' : `$${financialMetrics?.totalDonations.toLocaleString() || '0'}`}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="h-3 w-3 mr-1" />
              {financialMetrics?.transactionCount || 0} transactions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 'Loading...' : `$${financialMetrics?.avgDonation.toFixed(2) || '0.00'}`}
            </div>
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
            <div className="text-2xl font-bold text-green-600">
              {loading ? 'Loading...' : `${financialMetrics?.fraudRate.toFixed(2) || '0.00'}%`}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <Shield className="h-3 w-3 mr-1" />
              Well below industry average
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Oversight Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="fraud" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Fraud Detection
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Audit Trail
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mobile Stacked Tabs */}
        <div className="sm:hidden">
          <TabsList className="grid grid-cols-4 gap-1 h-14 bg-muted p-1 rounded-md w-full">
            <TabsTrigger 
              value="transactions" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Transactions"
            >
              <Activity className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="revenue" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Revenue"
            >
              <TrendingUp className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="fraud" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Fraud Detection"
            >
              <Shield className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="audit" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Audit Trail"
            >
              <FileText className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Transaction Analytics Chart */}
          <TransactionChart />
          
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

          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <Card key={tx.id} className="overflow-hidden">
                <CardContent className="p-0 sm:p-6">
                  {/* Mobile Layout - Completely Redesigned */}
                  <div className="block sm:hidden">
                    {/* Header Section */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-blue-950/30 dark:via-slate-900 dark:to-blue-950/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            {tx.type === 'donation' ? (
                              <DollarSign className="h-7 w-7 text-white" />
                            ) : (
                              <Banknote className="h-7 w-7 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white">
                              {tx.id}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {tx.type === 'donation' ? `${tx.donor} → ${tx.participant}` : 'Platform Payout'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-500 mt-0.5 truncate">
                              {tx.shelter}
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(tx.status)} shrink-0 ml-2`} variant="secondary">
                          {tx.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Amount & Fees Section */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-y border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${tx.amount.toLocaleString()}
                          </div>
                          <div className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">Amount</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-600 dark:text-gray-400">
                            ${tx.fees.toLocaleString()}
                          </div>
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Fees</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timestamp & Actions Section */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div className="font-medium">{tx.timestamp.split(' ')[1]}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">{tx.timestamp.split(' ')[0]}</div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-white dark:bg-slate-800">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex items-center justify-between p-6 border-b last:border-b-0">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                          {tx.type === 'donation' ? (
                            <DollarSign className="h-6 w-6 text-white" />
                          ) : (
                            <Banknote className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-lg">{tx.id}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {tx.type === 'donation' ? `${tx.donor} → ${tx.participant}` : 'Platform Payout'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 truncate">{tx.shelter}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">${tx.amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Amount</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-600 dark:text-gray-400">${tx.fees.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Fees</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{tx.timestamp.split(' ')[1]}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{tx.timestamp.split(' ')[0]}</div>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          {/* Financial Analytics Chart */}
          <FinancialChart />
          
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

          <div className="space-y-3">
            {fraudAlerts.map((alert) => (
              <Card key={alert.id} className="overflow-hidden">
                <CardContent className="p-0 sm:p-6">
                  {/* Mobile Layout - Completely Redesigned */}
                  <div className="block sm:hidden">
                    {/* Header Section */}
                    <div className="p-4 bg-gradient-to-r from-red-50 via-white to-red-50 dark:from-red-950/30 dark:via-slate-900 dark:to-red-950/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <AlertTriangle className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white">
                              {alert.description}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {alert.timestamp} • Status: {alert.status}
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getAlertColor(alert.level)} shrink-0 ml-2`} variant="secondary">
                          {alert.level}
                        </Badge>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-y border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {alert.details}
                      </div>
                    </div>
                    
                    {/* Actions Section */}
                    <div className="p-4">
                      <Button variant="outline" size="sm" className="w-full bg-white dark:bg-slate-800">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Investigate Alert
                      </Button>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex items-start space-x-4 p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="font-bold text-lg">{alert.description}</div>
                          <Badge className={getAlertColor(alert.level)}>
                            {alert.level}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{alert.details}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {alert.timestamp} • Status: {alert.status}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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