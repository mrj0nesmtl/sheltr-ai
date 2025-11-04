'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Handshake,
  Award,
  Download,
  Eye,
  EyeOff,
  Home,
  ChevronRight,
  ArrowLeft,
  Target,
  LineChart,
  BarChart3,
  Zap
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Revenue data structure based on the CSV projections
const revenueData = {
  months: ['Sep-24', 'Oct-24', 'Nov-24', 'Dec-24', 'Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25', 'Dec-25', 'Jan-26', 'Feb-26', 'Mar-26', 'Apr-26', 'May-26', 'Jun-26', 'Jul-26', 'Aug-26'],
  
  streams: {
    transactionFees: [0, 0, 63, 172, 338, 525, 813, 1097, 1531, 1925, 2531, 3047, 3850, 4500, 5525, 6322, 7594, 8550, 10094, 11222, 13063, 14375, 16538, 18047],
    saasSubs: [0, 0, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000, 4200],
    sponsorships: [0, 0, 0, 0, 0, 2500, 0, 0, 5000, 0, 0, 7500, 0, 0, 10000, 0, 0, 15000, 0, 0, 20000, 0, 0, 25000],
    whiteLabel: [0, 0, 0, 0, 0, 0, 5000, 0, 0, 8000, 0, 0, 10000, 0, 0, 12000, 0, 0, 15000, 0, 0, 18000, 0, 0],
    grants: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10000, 0, 0, 0, 15000, 0, 0, 0, 0, 0, 20000, 0, 0],
    tokenYields: [0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 462, 693, 924, 1155, 1386, 1617, 1848, 2079, 2310, 2541, 2772, 3003, 3234, 3465],
    apiFees: [0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 200, 200, 300, 300, 400, 400, 500, 500, 600, 600, 700, 700, 800, 800],
    analytics: [0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 300, 300, 450, 450, 600, 600, 750, 750, 900, 900, 1050, 1050, 1200],
  },
  
  monthlyTotal: [0, 0, 63, 372, 738, 3625, 6613, 2097, 7831, 11806, 4943, 23540, 17374, 8605, 20161, 38539, 13342, 29879, 31954, 18663, 40435, 60928, 25622, 52712],
  
  cumulativeTotal: [0, 0, 63, 435, 1173, 4798, 11411, 13508, 21339, 33145, 38088, 61628, 79002, 87607, 107768, 146307, 159649, 189528, 221482, 240145, 280580, 341508, 367130, 419842],
  
  growth: {
    activeShelters: [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    activeParticipants: [0, 0, 50, 125, 225, 350, 500, 675, 875, 1100, 1350, 1625, 1925, 2250, 2600, 2975, 3375, 3800, 4250, 4725, 5225, 5750, 6300, 6875],
    avgDonationPerParticipant: [0, 0, 50, 55, 60, 60, 65, 65, 70, 70, 75, 75, 80, 80, 85, 85, 90, 90, 95, 95, 100, 100, 105, 105],
    monthlyTransactionVolume: [0, 0, 2500, 6875, 13500, 21000, 32500, 43875, 61250, 77000, 101250, 121875, 154000, 180000, 221000, 252875, 303750, 342000, 403750, 448875, 522500, 575000, 661500, 721875],
  },
};

export default function RevenuePage() {
  const router = useRouter();
  const [showSensitive, setShowSensitive] = useState(false);
  const [selectedStream, setSelectedStream] = useState<'all' | 'core' | 'enterprise' | 'defi'>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = revenueData.cumulativeTotal[revenueData.cumulativeTotal.length - 1];
  const year1Revenue = revenueData.cumulativeTotal[11]; // Month 12 (Aug 2025)
  const year2Revenue = totalRevenue - year1Revenue;
  const avgMonthlyRevenueY1 = year1Revenue / 12;
  const avgMonthlyRevenueY2 = year2Revenue / 12;

  const getStreamTotal = (stream: keyof typeof revenueData.streams) => {
    return revenueData.streams[stream].reduce((a, b) => a + b, 0);
  };

  const coreStreamsTotal = getStreamTotal('transactionFees') + getStreamTotal('saasSubs');
  const enterpriseStreamsTotal = getStreamTotal('sponsorships') + getStreamTotal('whiteLabel') + getStreamTotal('grants');
  const defiStreamsTotal = getStreamTotal('tokenYields') + getStreamTotal('apiFees') + getStreamTotal('analytics');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/')}
            className="hover:bg-muted p-1 h-auto"
          >
            <Home className="h-4 w-4" />
          </Button>
          <ChevronRight className="h-4 w-4" />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/portal')}
            className="hover:bg-muted px-2 py-1 h-auto"
          >
            Portal
          </Button>
          <ChevronRight className="h-4 w-4" />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/portal/founders-only')}
            className="hover:bg-muted px-2 py-1 h-auto"
          >
            Founders Only
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">
            Revenue Projections
          </span>
        </div>

        {/* Back Button & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2">2-Year Revenue Projections</h1>
              <p className="text-muted-foreground">Pre-Revenue to Scale • Sep 2024 - Aug 2026 • 8 Revenue Streams</p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                  1 Shelter/Month Growth Model
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Path to $500K ARR
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSensitive(!showSensitive)}
            >
              {showSensitive ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Details
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Details
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-green-200 dark:border-green-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue (24mo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Sep 2024 - Aug 2026</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Year 1 Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(year1Revenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg: {formatCurrency(avgMonthlyRevenueY1)}/mo
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Year 2 Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(year2Revenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg: {formatCurrency(avgMonthlyRevenueY2)}/mo
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-cyan-200 dark:border-cyan-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Final MRR (Aug 26)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                {formatCurrency(revenueData.monthlyTotal[revenueData.monthlyTotal.length - 1])}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                22 shelters, 6,875 participants
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Streams Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Streams by Category</CardTitle>
            <CardDescription>8 revenue sources across 24 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStream === 'core' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-border hover:border-blue-300'
                }`}
                onClick={() => setSelectedStream(selectedStream === 'core' ? 'all' : 'core')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">Core Platform</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(coreStreamsTotal)}</div>
                <p className="text-xs text-muted-foreground mt-1">Transaction fees & SaaS</p>
                <div className="mt-2 text-xs">
                  <p className="text-green-600 dark:text-green-400">
                    {((coreStreamsTotal / totalRevenue) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStream === 'enterprise' 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' 
                    : 'border-border hover:border-purple-300'
                }`}
                onClick={() => setSelectedStream(selectedStream === 'enterprise' ? 'all' : 'enterprise')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Handshake className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold">Enterprise</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(enterpriseStreamsTotal)}</div>
                <p className="text-xs text-muted-foreground mt-1">Sponsorships & partnerships</p>
                <div className="mt-2 text-xs">
                  <p className="text-green-600 dark:text-green-400">
                    {((enterpriseStreamsTotal / totalRevenue) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStream === 'defi' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                    : 'border-border hover:border-green-300'
                }`}
                onClick={() => setSelectedStream(selectedStream === 'defi' ? 'all' : 'defi')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">DeFi & Services</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(defiStreamsTotal)}</div>
                <p className="text-xs text-muted-foreground mt-1">Yields, API, analytics</p>
                <div className="mt-2 text-xs">
                  <p className="text-green-600 dark:text-green-400">
                    {((defiStreamsTotal / totalRevenue) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-500" />
                Shelter Growth
              </CardTitle>
              <CardDescription>1 shelter onboarded per month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Starting Position</span>
                  <span className="font-bold">0 shelters</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Month 24 (Aug 2026)</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">22 shelters</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Growth Rate</span>
                  <span className="font-bold text-green-600 dark:text-green-400">+1/month</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: '91%' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Participant Growth
              </CardTitle>
              <CardDescription>50-75 participants per shelter average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Starting Position</span>
                  <span className="font-bold">0 participants</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Month 24 (Aug 2026)</span>
                  <span className="font-bold text-green-600 dark:text-green-400">6,875 participants</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg per Shelter</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">~312</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Growth</CardTitle>
            <CardDescription>Revenue progression Sep 2024 - Aug 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueData.months.map((month, index) => {
                const revenue = revenueData.monthlyTotal[index];
                const maxRevenue = Math.max(...revenueData.monthlyTotal);
                const percentage = revenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-16">{month}</span>
                        {index === 11 && (
                          <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                            Break-even
                          </Badge>
                        )}
                        {index === 20 && (
                          <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            Sustained Profit
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground">{formatCurrency(revenue)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          revenue === 0 ? 'bg-gray-300' :
                          revenue < 10000 ? 'bg-blue-500' : 
                          revenue < 30000 ? 'bg-green-500' : 
                          'bg-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Revenue Table */}
        {showSensitive && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Revenue Breakdown</CardTitle>
              <CardDescription>Line-item revenue by stream and month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Revenue Stream</TableHead>
                      <TableHead className="w-[150px]">Category</TableHead>
                      {revenueData.months.slice(0, 12).map((month) => (
                        <TableHead key={month} className="text-right">{month}</TableHead>
                      ))}
                      <TableHead className="text-right font-bold">Y1 Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Core Platform */}
                    {(selectedStream === 'all' || selectedStream === 'core') && (
                      <>
                        <TableRow className="bg-blue-50 dark:bg-blue-950">
                          <TableCell colSpan={14} className="font-bold">
                            <DollarSign className="h-4 w-4 inline mr-2" />
                            Core Platform Revenue
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Transaction Fees</TableCell>
                          <TableCell className="text-sm text-muted-foreground">2.5% platform fee</TableCell>
                          {revenueData.streams.transactionFees.slice(0, 12).map((value, idx) => (
                            <TableCell key={idx} className="text-right">
                              {value > 0 ? formatCurrency(value) : '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {formatCurrency(revenueData.streams.transactionFees.slice(0, 12).reduce((a, b) => a + b, 0))}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">SaaS Subscriptions</TableCell>
                          <TableCell className="text-sm text-muted-foreground">$200/shelter/mo</TableCell>
                          {revenueData.streams.saasSubs.slice(0, 12).map((value, idx) => (
                            <TableCell key={idx} className="text-right">
                              {value > 0 ? formatCurrency(value) : '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {formatCurrency(revenueData.streams.saasSubs.slice(0, 12).reduce((a, b) => a + b, 0))}
                          </TableCell>
                        </TableRow>
                      </>
                    )}

                    {/* Enterprise */}
                    {(selectedStream === 'all' || selectedStream === 'enterprise') && (
                      <>
                        <TableRow className="bg-purple-50 dark:bg-purple-950">
                          <TableCell colSpan={14} className="font-bold">
                            <Handshake className="h-4 w-4 inline mr-2" />
                            Enterprise Revenue
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Corporate Sponsorships</TableCell>
                          <TableCell className="text-sm text-muted-foreground">Quarterly deals</TableCell>
                          {revenueData.streams.sponsorships.slice(0, 12).map((value, idx) => (
                            <TableCell key={idx} className="text-right">
                              {value > 0 ? formatCurrency(value) : '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {formatCurrency(revenueData.streams.sponsorships.slice(0, 12).reduce((a, b) => a + b, 0))}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">White Label</TableCell>
                          <TableCell className="text-sm text-muted-foreground">Enterprise deals</TableCell>
                          {revenueData.streams.whiteLabel.slice(0, 12).map((value, idx) => (
                            <TableCell key={idx} className="text-right">
                              {value > 0 ? formatCurrency(value) : '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {formatCurrency(revenueData.streams.whiteLabel.slice(0, 12).reduce((a, b) => a + b, 0))}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Foundation Grants</TableCell>
                          <TableCell className="text-sm text-muted-foreground">Awarded grants</TableCell>
                          {revenueData.streams.grants.slice(0, 12).map((value, idx) => (
                            <TableCell key={idx} className="text-right">
                              {value > 0 ? formatCurrency(value) : '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {formatCurrency(revenueData.streams.grants.slice(0, 12).reduce((a, b) => a + b, 0))}
                          </TableCell>
                        </TableRow>
                      </>
                    )}

                    {/* DeFi & Services */}
                    {(selectedStream === 'all' || selectedStream === 'defi') && (
                      <>
                        <TableRow className="bg-green-50 dark:bg-green-950">
                          <TableCell colSpan={14} className="font-bold">
                            <Zap className="h-4 w-4 inline mr-2" />
                            DeFi & Services Revenue
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Token Staking Yields</TableCell>
                          <TableCell className="text-sm text-muted-foreground">7% APY housing fund</TableCell>
                          {revenueData.streams.tokenYields.slice(0, 12).map((value, idx) => (
                            <TableCell key={idx} className="text-right">
                              {value > 0 ? formatCurrency(value) : '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {formatCurrency(revenueData.streams.tokenYields.slice(0, 12).reduce((a, b) => a + b, 0))}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">API Access Fees</TableCell>
                          <TableCell className="text-sm text-muted-foreground">Third-party integration</TableCell>
                          {revenueData.streams.apiFees.slice(0, 12).map((value, idx) => (
                            <TableCell key={idx} className="text-right">
                              {value > 0 ? formatCurrency(value) : '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {formatCurrency(revenueData.streams.apiFees.slice(0, 12).reduce((a, b) => a + b, 0))}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Impact Analytics Premium</TableCell>
                          <TableCell className="text-sm text-muted-foreground">Advanced reporting</TableCell>
                          {revenueData.streams.analytics.slice(0, 12).map((value, idx) => (
                            <TableCell key={idx} className="text-right">
                              {value > 0 ? formatCurrency(value) : '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {formatCurrency(revenueData.streams.analytics.slice(0, 12).reduce((a, b) => a + b, 0))}
                          </TableCell>
                        </TableRow>
                      </>
                    )}

                    {/* Totals */}
                    <TableRow className="bg-muted font-bold">
                      <TableCell colSpan={2}>Monthly Total</TableCell>
                      {revenueData.monthlyTotal.slice(0, 12).map((total, idx) => (
                        <TableCell key={idx} className="text-right">
                          {formatCurrency(total)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right text-green-600 dark:text-green-400">
                        {formatCurrency(year1Revenue)}
                      </TableCell>
                    </TableRow>

                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={2}>Cumulative Total</TableCell>
                      {revenueData.cumulativeTotal.slice(0, 12).map((total, idx) => (
                        <TableCell key={idx} className="text-right">
                          {formatCurrency(total)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right text-blue-600 dark:text-blue-400">
                        {formatCurrency(year1Revenue)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Insights */}
        <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">Revenue Projection Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              📈 This is a <strong>conservative 24-month revenue forecast</strong> based on 1 shelter onboarded per month
            </p>
            <div className="border-l-4 border-blue-400 pl-4 space-y-2">
              <p>• <strong>Growth Model:</strong> 1 shelter/month with 50-75 participants each, growing to 6,875 participants by Aug 2026</p>
              <p>• <strong>8 Revenue Streams:</strong> Transaction fees, SaaS subscriptions, sponsorships, white label, grants, token yields, API fees, analytics</p>
              <p>• <strong>Break-even Achievement:</strong> Month 12 (August 2025) - First profitable month</p>
              <p>• <strong>Sustained Profitability:</strong> Month 21-22 (May-June 2026) onwards</p>
              <p>• <strong>Year 1 Target:</strong> {formatCurrency(year1Revenue)} revenue (on path to $500K ARR)</p>
              <p>• <strong>Year 2 Trajectory:</strong> {formatCurrency(year2Revenue)} revenue (approaching $2M ARR path)</p>
              <p>• <strong>Platform Fee:</strong> Conservative 2.5% on all transactions (mid-range of 2-3%)</p>
              <p>• <strong>Final MRR:</strong> {formatCurrency(revenueData.monthlyTotal[23])} (August 2026)</p>
            </div>
            <p className="text-xs text-muted-foreground italic mt-4">
              Note: This is a pre-revenue forecast model. Actual performance will be tracked against these projections as operations scale.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

