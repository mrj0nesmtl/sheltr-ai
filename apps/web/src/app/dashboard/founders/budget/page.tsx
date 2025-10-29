'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Users,
  Server,
  Wrench,
  Megaphone,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
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
      { name: 'Cursor', role: 'IDE platform', values: [200, 200, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000] },
      { name: 'OpenAI', role: 'API access', values: [50, 50, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200] },
      { name: 'Anthropic', role: 'API access', values: [50, 50, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200] },
      { name: 'Github', role: 'Code base', values: [0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50] },
      { name: 'Google Cloud', role: 'Deployment/Hosting/AI/Database', values: [20, 20, 100, 50, 50, 50, 50, 50, 50, 50, 50, 50] },
      { name: 'Google Workspace', role: 'Internal', values: [0, 0, 25, 50, 50, 50, 50, 50, 50, 50, 50, 50] },
      { name: 'Cloudflare', role: 'Security', values: [0, 0, 25, 1500, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: 'Godaddy', role: 'Domain, Security', values: [38, 38, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
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

export default function BudgetPage() {
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

  const totalBurn = budgetData.runningTotal[budgetData.runningTotal.length - 1];
  const remainingFunds = seedRound - totalBurn;
  const burnRate = budgetData.monthlyBurn[budgetData.monthlyBurn.length - 1];
  const runway = Math.floor(remainingFunds / burnRate);

  const getCategoryTotal = (category: keyof typeof budgetData.categories) => {
    return budgetData.categories[category].reduce((sum, item) => {
      return sum + item.values.reduce((a, b) => a + b, 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Seed Round Budget</h1>
            <p className="text-muted-foreground">2025-2026 Financial Planning • $250K Seed Investment</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Seed Round</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(seedRound)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target raise amount</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 dark:border-red-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Burn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalBurn)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Through August 2026</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(remainingFunds)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((remainingFunds / seedRound) * 100).toFixed(1)}% remaining
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Runway</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {runway} mo
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                At {formatCurrency(burnRate)}/month
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
                      <TableCell className="text-right">{formatCurrency(totalBurn)}</TableCell>
                    </TableRow>

                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={2}>Running Total</TableCell>
                      {budgetData.runningTotal.map((total, idx) => (
                        <TableCell key={idx} className="text-right">
                          {formatCurrency(total)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right text-red-600 dark:text-red-400">
                        {formatCurrency(totalBurn)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card className="border-2 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-amber-800 dark:text-amber-200">Budget Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• This budget represents the <strong>seed round burn</strong> only and does not include revenue projections</p>
            <p>• Major expenses in <strong>November-December 2025</strong>: Token listing, payment rails setup, initial POD/MOBI materials</p>
            <p>• Stabilized monthly burn of <strong>~$18.7K</strong> from January 2026 onwards</p>
            <p>• Team ramp-up begins in November 2025 with full team operational by December</p>
            <p>• <strong>Runway extends beyond August 2026</strong> with remaining funds of {formatCurrency(remainingFunds)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

