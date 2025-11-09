'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users,
  Server,
  Wrench,
  Megaphone,
  Download,
  Eye,
  EyeOff,
  Home,
  ChevronRight,
  ArrowLeft,
  Lock,
  Shield
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

// Budget data structure
const budgetData = {
  months: ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
  categories: {
    team: [
      { name: 'Joel', role: 'Full-time developer', values: [650, 650, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000] },
      { name: 'Doug', role: 'Finance and Partnerships', values: [0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000] },
      { name: 'Alexander', role: 'Operations and Partnerships', values: [0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000] },
      { name: 'Zaffia', role: 'PR, Shelter outreach, onboarding', values: [0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000] },
      { name: 'Dominique', role: 'Developer', values: [0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000] },
    ],
    infrastructure: [
      { name: 'Cursor', role: 'IDE platform', values: [400, 400, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600] },
      { name: 'OpenAI', role: 'API access', values: [50, 50, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200] },
      { name: 'Anthropic', role: 'API access', values: [50, 50, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200] },
      { name: 'Github', role: 'Code base', values: [0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50] },
      { name: 'Google Cloud', role: 'Deployment/Hosting/AI/Database', values: [20, 20, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100] },
      { name: 'Google Workspace', role: 'Internal', values: [0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 50] },
      { name: 'Cloudflare', role: 'Security', values: [0, 0, 25, 1500, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: 'Godaddy', role: 'Domain, Security', values: [38, 38, 0, 0, 0, 7000, 0, 0, 0, 0, 0, 0] },
    ],
    operations: [
      { name: 'Coinbase', role: 'Token Listing', values: [0, 0, 5000, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: '$SHELTR', role: 'Token', values: [0, 0, 5000, 5000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000] },
      { name: 'Adyen', role: 'Payment Rails', values: [0, 0, 5000, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: 'Labour', role: 'Technician Under MR', values: [0, 0, 0, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000] },
      { name: 'PODS Material', role: 'POD Details', values: [0, 0, 0, 5000, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: 'MOBY Material', role: 'MOBI Cycle Details', values: [0, 0, 0, 5000, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: 'Shop-Fab Materials', role: 'Supplies', values: [0, 0, 0, 5000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000] },
      { name: 'Rent', role: 'Fab for Pods and Mobi', values: [0, 0, 0, 5000, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: 'Onboarding', role: 'Participant Packages', values: [0, 0, 500, 5000, 500, 500, 500, 500, 500, 500, 500, 500] },
      { name: 'Travel', role: 'ZL/JY/AK', values: [0, 0, 4000, 5000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000] },
      { name: 'Thinkers One', role: 'Mentorship', values: [0, 0, 0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000] },
      { name: 'Slack', role: 'Internal Comms', values: [0, 0, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40] },
    ],
    marketing: [
      { name: 'Marketing', role: 'Social Media', values: [0, 0, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500] },
      { name: 'Canva, Sora, Midjourney', role: 'Creative', values: [0, 0, 200, 40, 40, 40, 40, 40, 40, 40, 40, 40] },
      { name: 'X', role: 'Social', values: [0, 0, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40] },
    ],
  },
  monthlyBurn: [1008, 1008, 28880, 47670, 18670, 18670, 18670, 18670, 18670, 18670, 18670, 18670],
  runningTotal: [1008, 2016, 30896, 78566, 97236, 115906, 134576, 153246, 171916, 190586, 209256, 227926],
};

const seedRound = 250000;

export default function IRBudgetPage() {
  const router = useRouter();
  const [showSensitive, setShowSensitive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'team' | 'infrastructure' | 'operations' | 'marketing'>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const projectedAllocation = budgetData.runningTotal[budgetData.runningTotal.length - 1];
  const reserveBuffer = seedRound - projectedAllocation;
  const avgMonthlyBurn = budgetData.monthlyBurn[budgetData.monthlyBurn.length - 1];
  const projectedRunway = 12; // 12 months from raise date

  const getCategoryTotal = (category: keyof typeof budgetData.categories) => {
    return budgetData.categories[category].reduce((sum, item) => {
      return sum + item.values.reduce((a, b) => a + b, 0);
    }, 0);
  };

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
                <Shield className="h-3 w-3 mr-1" />
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
            <Link href="/ir" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Investor Relations
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/ir/dataroom" className="hover:text-foreground transition-colors">
              Data Room
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Seed Budget</span>
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
                <h1 className="text-3xl font-bold">Seed Round Budget</h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Lock className="h-3 w-3 mr-1" />
                  Projected Allocation Plan
                </Badge>
              </div>
              <p className="text-muted-foreground">
                2025-2026 Financial Planning • $250K Seed Investment
              </p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Seed Round</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(seedRound)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target raise amount</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projected Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(projectedAllocation)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Through August 2026</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reserve Buffer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(reserveBuffer)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((reserveBuffer / seedRound) * 100).toFixed(1)}% remaining
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-cyan-200 dark:border-cyan-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projected Runway</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                {projectedRunway} mo
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                At {formatCurrency(avgMonthlyBurn)}/month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation by Category</CardTitle>
            <CardDescription>Total spend across 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'team' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-border hover:border-blue-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'team' ? 'all' : 'team')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">Team</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('team'))}</div>
                <p className="text-xs text-muted-foreground mt-1">5 team members</p>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'infrastructure' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                    : 'border-border hover:border-green-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'infrastructure' ? 'all' : 'infrastructure')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Server className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Infrastructure</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('infrastructure'))}</div>
                <p className="text-xs text-muted-foreground mt-1">Tech & hosting</p>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'operations' 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950' 
                    : 'border-border hover:border-orange-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'operations' ? 'all' : 'operations')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Wrench className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold">Operations</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('operations'))}</div>
                <p className="text-xs text-muted-foreground mt-1">PODs, tokens, travel</p>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'marketing' 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' 
                    : 'border-border hover:border-purple-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'marketing' ? 'all' : 'marketing')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Megaphone className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold">Marketing</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('marketing'))}</div>
                <p className="text-xs text-muted-foreground mt-1">Social & creative</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Burn Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Burn Rate</CardTitle>
            <CardDescription>Projected monthly expenses Sep 2025 - Aug 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetData.months.map((month, index) => {
                const burn = budgetData.monthlyBurn[index];
                const percentage = (burn / Math.max(...budgetData.monthlyBurn)) * 100;
                
                return (
                  <div key={month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{month}</span>
                      <span className="text-muted-foreground">{formatCurrency(burn)}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          burn > 30000 ? 'bg-red-500' : burn > 15000 ? 'bg-orange-500' : 'bg-green-500'
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

        {/* Detailed Budget Table */}
        {showSensitive && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Budget Breakdown</CardTitle>
              <CardDescription>Line-item expenses by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Account</TableHead>
                      <TableHead className="w-[200px]">Role/Description</TableHead>
                      {budgetData.months.map((month) => (
                        <TableHead key={month} className="text-right">{month.slice(0, 3)}</TableHead>
                      ))}
                      <TableHead className="text-right font-bold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Team Section */}
                    {(selectedCategory === 'all' || selectedCategory === 'team') && (
                      <>
                        <TableRow className="bg-blue-50 dark:bg-blue-950">
                          <TableCell colSpan={14} className="font-bold">
                            <Users className="h-4 w-4 inline mr-2" />
                            Team
                          </TableCell>
                        </TableRow>
                        {budgetData.categories.team.map((item) => (
                          <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.role}</TableCell>
                            {item.values.map((value, idx) => (
                              <TableCell key={idx} className="text-right">
                                {value > 0 ? formatCurrency(value) : '-'}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                              {formatCurrency(item.values.reduce((a, b) => a + b, 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {/* Infrastructure Section */}
                    {(selectedCategory === 'all' || selectedCategory === 'infrastructure') && (
                      <>
                        <TableRow className="bg-green-50 dark:bg-green-950">
                          <TableCell colSpan={14} className="font-bold">
                            <Server className="h-4 w-4 inline mr-2" />
                            Infrastructure
                          </TableCell>
                        </TableRow>
                        {budgetData.categories.infrastructure.map((item) => (
                          <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.role}</TableCell>
                            {item.values.map((value, idx) => (
                              <TableCell key={idx} className="text-right">
                                {value > 0 ? formatCurrency(value) : '-'}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                              {formatCurrency(item.values.reduce((a, b) => a + b, 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {/* Operations Section */}
                    {(selectedCategory === 'all' || selectedCategory === 'operations') && (
                      <>
                        <TableRow className="bg-orange-50 dark:bg-orange-950">
                          <TableCell colSpan={14} className="font-bold">
                            <Wrench className="h-4 w-4 inline mr-2" />
                            Operations
                          </TableCell>
                        </TableRow>
                        {budgetData.categories.operations.map((item) => (
                          <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.role}</TableCell>
                            {item.values.map((value, idx) => (
                              <TableCell key={idx} className="text-right">
                                {value > 0 ? formatCurrency(value) : '-'}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                              {formatCurrency(item.values.reduce((a, b) => a + b, 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {/* Marketing Section */}
                    {(selectedCategory === 'all' || selectedCategory === 'marketing') && (
                      <>
                        <TableRow className="bg-purple-50 dark:bg-purple-950">
                          <TableCell colSpan={14} className="font-bold">
                            <Megaphone className="h-4 w-4 inline mr-2" />
                            Marketing
                          </TableCell>
                        </TableRow>
                        {budgetData.categories.marketing.map((item) => (
                          <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.role}</TableCell>
                            {item.values.map((value, idx) => (
                              <TableCell key={idx} className="text-right">
                                {value > 0 ? formatCurrency(value) : '-'}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                              {formatCurrency(item.values.reduce((a, b) => a + b, 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {/* Totals */}
                    <TableRow className="bg-muted font-bold">
                      <TableCell colSpan={2}>Monthly Burn</TableCell>
                      {budgetData.monthlyBurn.map((burn, idx) => (
                        <TableCell key={idx} className="text-right">
                          {formatCurrency(burn)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">{formatCurrency(projectedAllocation)}</TableCell>
                    </TableRow>

                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={2}>Running Total</TableCell>
                      {budgetData.runningTotal.map((total, idx) => (
                        <TableCell key={idx} className="text-right">
                          {formatCurrency(total)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right text-blue-600 dark:text-blue-400">
                        {formatCurrency(projectedAllocation)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">Budget Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              📊 This is a <strong>projected allocation plan</strong> for the $250K seed round we are currently raising
            </p>
            <div className="border-l-4 border-blue-400 pl-4 space-y-2">
              <p>• <strong>Status:</strong> Funds not yet raised - this represents planned spending once capital is secured</p>
              <p>• <strong>Timeline:</strong> 12-month runway from raise date (September 2025 - August 2026)</p>
              <p>• <strong>Major expenses in November-December 2025:</strong> Token listing, payment rails setup, initial POD/MOBI materials</p>
              <p>• <strong>Stabilized monthly burn:</strong> ~$18.7K from January 2026 onwards</p>
              <p>• <strong>Team ramp-up:</strong> Begins in November 2025 with full team operational by December</p>
              <p>• <strong>Reserve buffer:</strong> {formatCurrency(reserveBuffer)} ({((reserveBuffer / seedRound) * 100).toFixed(1)}%) held for contingencies and extended runway</p>
            </div>
            <p className="text-xs text-muted-foreground italic mt-4">
              Note: This budget does not include revenue projections. Actual spending will be tracked against this plan once funding is secured.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
