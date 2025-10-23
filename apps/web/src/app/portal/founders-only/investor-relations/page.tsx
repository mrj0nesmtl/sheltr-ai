'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowLeft, TrendingUp, FileText, DollarSign, Users, Target, Rocket } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function InvestorRelationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        router.push('/portal');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;
          
          if (role === 'super_admin' || role === 'platform_admin') {
            setIsAuthorized(true);
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/portal');
        }
      } catch (error) {
        console.error('Authorization error:', error);
        router.push('/portal');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold">
                SHELTR
              </Link>
              <Badge className="bg-blue-600 text-white">
                <Lock className="h-3 w-3 mr-1" />
                Pre-Seed
              </Badge>
            </div>
            
            <Link href="/portal/founders-only">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <Badge className="bg-blue-600 text-white">Pre-Seed</Badge>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Investor Relations</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Pre-seed funding information, financial projections, and investment terms
          </p>
        </div>

        {/* Coming Soon Alert */}
        <Alert className="mb-8 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
          <Rocket className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <strong>Coming Soon:</strong> Detailed financial reports, investment terms, and strategic documentation 
            will be progressively published here as we advance toward our public launch timeline.
          </AlertDescription>
        </Alert>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Business Plan</CardTitle>
              <CardDescription>
                Professional VC-worthy business plan with market analysis and exit strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/portal/founders-only/business-plan">
                <Button variant="outline" className="w-full">
                  View Business Plan
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <DollarSign className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Financial Projections</CardTitle>
              <CardDescription>
                Revenue models, growth projections, and path to profitability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Cap Table</CardTitle>
              <CardDescription>
                Founder equity distribution and investor allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <Target className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle className="text-lg">Pitch Deck</CardTitle>
              <CardDescription>
                Investor presentation and key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <FileText className="h-8 w-8 text-red-600 mb-2" />
              <CardTitle className="text-lg">Legal Documents</CardTitle>
              <CardDescription>
                SAFE agreements, term sheets, and incorporation docs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/portal/founders-only/msb-registration">
                <Button variant="outline" className="w-full">
                  View MSB Guide
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-teal-200 dark:border-teal-800">
            <CardHeader>
              <Rocket className="h-8 w-8 text-teal-600 mb-2" />
              <CardTitle className="text-lg">Launch Roadmap</CardTitle>
              <CardDescription>
                60-day public launch timeline and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs/roadmap">
                <Button variant="outline" className="w-full">
                  View Roadmap
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Funding Information */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-2xl">Pre-Seed Funding Round</CardTitle>
            <CardDescription>Current fundraising status and terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Target Raise</p>
                <p className="text-3xl font-bold text-blue-600">$250K</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valuation Cap</p>
                <p className="text-3xl font-bold text-green-600">TBD</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Security Type</p>
                <p className="text-3xl font-bold text-purple-600">SAFE</p>
              </div>
            </div>
            <Alert className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-500">
              <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
                Detailed financial models, investor terms, and fundraising documentation will be published 
                progressively as we finalize our pre-seed round structure.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex justify-center mb-8">
          <Link href="/portal/founders-only">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Founders Portal
            </Button>
          </Link>
        </div>

        {/* Confidentiality Footer */}
        <Card className="bg-slate-900 text-white border-slate-700">
          <CardContent className="py-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Confidential Information</h4>
                <p className="text-sm text-slate-300">
                  All investor relations materials are confidential and proprietary to SHELTR-AI. 
                  Unauthorized sharing or distribution is strictly prohibited.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

