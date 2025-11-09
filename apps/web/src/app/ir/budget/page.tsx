'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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
  Lock
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

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

export default function IRBudgetPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'team' | 'infrastructure' | 'operations' | 'marketing'>('all');

  // Authorization check
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/ir');
      } else if (user.role !== 'investor' && user.role !== 'super_admin') {
        toast.error('Access denied: Investor or Super Admin credentials required');
        router.push('/dashboard');
      } else {
        // Check if financial overview is enabled
        const checkAccess = async () => {
          try {
            const financialDoc = await getDoc(doc(db, 'secure_documents', 'financial-overview'));
            if (financialDoc.exists() && financialDoc.data().isInvestorDataRoom) {
              setIsAuthorized(true);
            } else {
              toast.error('Financial Overview is currently unavailable');
              router.push('/ir/dataroom');
            }
          } catch (error) {
            console.error('Error checking access:', error);
            router.push('/ir/dataroom');
          }
        };
        checkAccess();
      }
    }
  }, [user, authLoading, router]);

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'team':
        return <Users className="h-5 w-5" />;
      case 'infrastructure':
        return <Server className="h-5 w-5" />;
      case 'operations':
        return <Wrench className="h-5 w-5" />;
      case 'marketing':
        return <Megaphone className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getFilteredData = () => {
    if (selectedCategory === 'all') {
      return Object.entries(budgetData.categories).flatMap(([, items]) => items);
    }
    return budgetData.categories[selectedCategory];
  };

  if (authLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                <h1 className="text-3xl font-bold">Seed Budget 2025-26</h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Lock className="h-3 w-3 mr-1" />
                  Projected Allocation Plan
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Comprehensive 12-month projected budget for $250K seed round
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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Target Raise</CardDescription>
              <CardTitle className="text-3xl text-green-600">{formatCurrency(seedRound)}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Projected Allocation</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{formatCurrency(projectedAllocation)}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Reserve Buffer</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{formatCurrency(reserveBuffer)}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Projected Runway</CardDescription>
              <CardTitle className="text-3xl text-cyan-600">{projectedRunway} mo</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Filter detailed budget by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className="justify-start"
              >
                All Categories
              </Button>
              {Object.keys(budgetData.categories).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category as any)}
                  className="justify-start"
                >
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  <Badge variant="secondary" className="ml-auto">
                    {formatCurrency(getCategoryTotal(category as keyof typeof budgetData.categories))}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Budget Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Budget</CardTitle>
            <CardDescription>
              Monthly allocation breakdown for {selectedCategory === 'all' ? 'all categories' : selectedCategory}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Item</TableHead>
                    <TableHead className="w-[200px]">Role/Purpose</TableHead>
                    {budgetData.months.map((month) => (
                      <TableHead key={month} className="text-right min-w-[100px]">
                        {month.substring(0, 3)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredData().map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{showSensitive ? item.name : '••••••'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.role}</TableCell>
                      {item.values.map((value, monthIdx) => (
                        <TableCell key={monthIdx} className="text-right">
                          {value > 0 ? formatCurrency(value) : '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={2}>Monthly Burn</TableCell>
                    {budgetData.monthlyBurn.map((burn, idx) => (
                      <TableCell key={idx} className="text-right text-blue-600">
                        {formatCurrency(burn)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="font-bold bg-muted">
                    <TableCell colSpan={2}>Running Total</TableCell>
                    {budgetData.runningTotal.map((total, idx) => (
                      <TableCell key={idx} className="text-right text-blue-600">
                        {formatCurrency(total)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Budget Notes */}
        <Card className="mt-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">Budget Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Projected Allocation Plan</h4>
              <p className="text-muted-foreground">
                This budget represents a <strong>projected allocation plan</strong> for a <strong>$250,000 seed round currently being raised</strong>. 
                These are not actual expenses - this is a forward-looking financial roadmap that demonstrates how capital will be deployed upon successful fundraising.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Timeline & Deployment</h4>
              <p className="text-muted-foreground">
                The 12-month runway begins from the date of capital injection (target: Q4 2025/Q1 2026). The first two months reflect current burn rate during 
                fundraising, followed by full deployment starting month 3 post-raise.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Reserve Buffer</h4>
              <p className="text-muted-foreground">
                The ${formatCurrency(reserveBuffer)} reserve buffer (~{((reserveBuffer / seedRound) * 100).toFixed(1)}%) provides strategic flexibility for 
                unexpected opportunities or market adjustments during the deployment phase.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

