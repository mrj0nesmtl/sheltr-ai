'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign,
  Users,
  Building,
  Handshake,
  Download,
  Eye,
  EyeOff,
  Home,
  ChevronRight,
  ArrowLeft,
  Zap,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Revenue data structure based on the CSV projections
// Timeline: Sep 2025 - Aug 2027 | Revenue starts Q2 2026 (Apr 2026)
const revenueData = {
  months: ['Sep-25', 'Oct-25', 'Nov-25', 'Dec-25', 'Jan-26', 'Feb-26', 'Mar-26', 'Apr-26', 'May-26', 'Jun-26', 'Jul-26', 'Aug-26', 'Sep-26', 'Oct-26', 'Nov-26', 'Dec-26', 'Jan-27', 'Feb-27', 'Mar-27', 'Apr-27', 'May-27', 'Jun-27', 'Jul-27', 'Aug-27'],
  
  streams: {
    transactionFees: [0, 0, 0, 0, 0, 0, 0, 63, 172, 338, 525, 813, 1097, 1531, 1925, 2531, 3047, 3850, 4500, 5525, 6322, 7594, 8550, 10094],
    saasSubs: [0, 0, 0, 0, 0, 0, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400],
    sponsorships: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2500, 0, 0, 5000, 0, 0, 7500, 0, 0, 10000, 0, 0, 15000, 0],
    whiteLabel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, 0, 0, 8000, 0, 0, 10000, 0, 0, 12000, 0, 0, 15000],
    grants: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10000, 0, 0, 0, 15000, 0, 0, 0],
    tokenYields: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 462, 693, 924, 1155, 1386, 1617, 1848, 2079, 2310],
    apiFees: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 200, 200, 300, 300, 400, 400, 500, 500, 600],
    analytics: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 300, 300, 450, 450, 600, 600, 750, 750],
  },
  
  monthlyTotal: [0, 0, 0, 0, 0, 0, 0, 263, 572, 938, 3825, 6813, 2297, 8031, 12006, 5143, 23440, 17574, 8805, 20361, 38739, 13542, 30079, 32154],
  
  cumulativeTotal: [0, 0, 0, 0, 0, 0, 0, 263, 835, 1773, 5598, 12411, 14708, 22739, 34745, 39888, 63328, 80902, 89707, 110068, 148807, 162349, 192428, 224582],
  
  growth: {
    activeShelters: [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    activeParticipants: [0, 0, 0, 0, 0, 0, 0, 50, 125, 225, 350, 500, 675, 875, 1100, 1350, 1625, 1925, 2250, 2600, 2975, 3375, 3800, 4250],
    avgDonationPerParticipant: [0, 0, 0, 0, 0, 0, 0, 50, 55, 60, 60, 65, 65, 70, 70, 75, 75, 80, 80, 85, 85, 90, 90, 95],
    monthlyTransactionVolume: [0, 0, 0, 0, 0, 0, 0, 2500, 6875, 13500, 21000, 32500, 43875, 61250, 77000, 101250, 121875, 154000, 180000, 221000, 252875, 303750, 342000, 403750],
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/ir/dataroom" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              SHELTR
            </Link>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-600 text-white">
                <Lock className="h-3 w-3 mr-1" />
                Investor Access
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/ir/dataroom" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Investor Dataroom
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Revenue Projections</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">2-Year Revenue Projections</h1>
              </div>
              <p className="text-muted-foreground">
                Pre-Revenue to Scale • Sep 2025 - Aug 2027 • 8 Revenue Streams
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                  Currently: Nov 2025
                </Badge>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                  Revenue Launch: Q2 2026
                </Badge>
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
              <p className="text-xs text-muted-foreground mt-1">Sep 2025 - Aug 2027</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Final MRR (Aug 27)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                {formatCurrency(revenueData.monthlyTotal[revenueData.monthlyTotal.length - 1])}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                17 shelters, 4,250 participants
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights - Moved up from bottom */}
        <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">Revenue Projection Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              📈 This is a <strong>conservative 24-month revenue forecast</strong> starting Q2 2026 with 1 shelter onboarded per month
            </p>
            <div className="border-l-4 border-blue-400 pl-4 space-y-2">
              <p>• <strong>Current Status:</strong> November 2025 - 5 months into hardcore development, pre-revenue phase</p>
              <p>• <strong>Revenue Launch:</strong> Q2 2026 (April 2026) - 4-6 months from today</p>
              <p>• <strong>Growth Model:</strong> 1 shelter/month starting Q2 2026, with 50-75 participants each, growing to 4,250 participants by Aug 2027</p>
              <p>• <strong>8 Revenue Streams:</strong> Transaction fees, SaaS subscriptions, sponsorships, white label, grants, token yields, API fees, analytics</p>
              <p>• <strong>First Profitable Month:</strong> January 2027 (Month 17) - Break-even achievement</p>
              <p>• <strong>Sustained Profitability:</strong> May 2027 (Month 21) onwards</p>
              <p>• <strong>Year 1 Revenue:</strong> {formatCurrency(year1Revenue)} (12 months from Sep 2025)</p>
              <p>• <strong>Year 2 Revenue:</strong> {formatCurrency(year2Revenue)} (next 12 months)</p>
              <p>• <strong>Platform Fee:</strong> Conservative 2.5% on all transactions (mid-range of 2-3%)</p>
              <p>• <strong>Final MRR:</strong> {formatCurrency(revenueData.monthlyTotal[23])} (August 2027) with 17 shelters</p>
              <p>• <strong>Pre-Seed Required:</strong> $350K to cover extended pre-revenue runway + path to profitability</p>
            </div>
            <p className="text-xs text-muted-foreground italic mt-4">
              Note: This is a pre-revenue forecast model reflecting actual development timeline. Actual performance will be tracked against these projections as operations scale.
            </p>
          </CardContent>
        </Card>

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
                  <span className="text-sm">Month 24 (Aug 2027)</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">17 shelters</span>
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
                  <span className="text-sm">Month 24 (Aug 2027)</span>
                  <span className="font-bold text-green-600 dark:text-green-400">4,250 participants</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg per Shelter</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">~250</span>
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
            <CardDescription>Revenue progression Sep 2025 - Aug 2027</CardDescription>
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
                        {index === 7 && (
                          <Badge className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                            Revenue Launch
                          </Badge>
                        )}
                        {index === 16 && (
                          <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                            First Profit
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
                        <TableRow className="bg-green-50 dark:bg-green-950">
                        <TableCell colSpan={14} className="font-bold text-green-800 dark:text-green-200">
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
                        <TableRow className="bg-green-50 dark:bg-green-950">
                        <TableCell colSpan={14} className="font-bold text-green-800 dark:text-green-200">
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
                          <TableCell colSpan={14} className="font-bold text-green-800 dark:text-green-200">
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
      </div>
    </div>
  );
}

