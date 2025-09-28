'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeLogo from '@/components/ThemeLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  LogOut, 
  ExternalLink,
  Rocket,
  CreditCard,
  FileText,
  Github,
  TrendingUp,
  AlertTriangle,
  Users,
  Lock
} from 'lucide-react';
import { checkFounderAccess, clearFounderAccess, getFounderInfo } from '@/services/founderAccessService';

export default function FoundersOnlyPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [founderInfo, setFounderInfo] = useState<{ email: string; name?: string; userId?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user has valid founder access
    const hasAccess = checkFounderAccess();
    const founder = getFounderInfo();
    
    if (!hasAccess || !founder) {
      // Redirect to portal login if not authorized
      router.push('/portal');
      return;
    }
    
    setIsAuthorized(true);
    setFounderInfo(founder);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearFounderAccess();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect to /portal
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">
                  Welcome, {founderInfo?.name || 'Founder'}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">SHELTR Founders Portal</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Confidential access for co-founders and strategic leadership
          </p>
          <Badge className="bg-purple-600 text-white px-4 py-1">
            Restricted Access • Co-Founders Only
          </Badge>
        </div>

        {/* Security Advisory */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-700 dark:text-amber-300 text-sm mb-1">
                  Security Advisory
                </h4>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  For security purposes, please ensure you log out of the founders portal after each session. 
                  All access is monitored and logged for confidentiality and security compliance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Access Links</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Development Roadmap */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Rocket className="h-8 w-8 text-orange-600" />
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    Launch Plan
                  </Badge>
                </div>
                <CardTitle className="text-orange-600">Development Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  60-day public launch timeline with client onboarding strategy and AI achievements
                </p>
                <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                  <Link href="/docs/roadmap" className="flex items-center gap-2">
                    View Roadmap
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Payment Rails */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Enterprise
                  </Badge>
                </div>
                <CardTitle className="text-green-600">Payment Rails</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Adyen + Coinbase integration architecture with single-token stable fund model
                </p>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/docs/payment-rails" className="flex items-center gap-2">
                    View Architecture
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Investor Relations */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Pre-Seed
                  </Badge>
                </div>
                <CardTitle className="text-blue-600">Investor Relations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Pre-seed funding information, financial projections, and investment terms
                </p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/portal/investor-relations" className="flex items-center gap-2">
                    View Details
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Documentation Hub */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Complete
                  </Badge>
                </div>
                <CardTitle className="text-purple-600">Documentation Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive technical documentation, whitepapers, and system architecture
                </p>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/docs" className="flex items-center gap-2">
                    Browse Docs
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* GitHub Repository */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200 dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Github className="h-8 w-8 text-gray-600" />
                  <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                    Source Code
                  </Badge>
                </div>
                <CardTitle className="text-gray-600">GitHub Repository</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete source code, smart contracts, and development history
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a 
                    href="https://github.com/mrj0nesmtl/sheltr-ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    View Repository
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Platform Access */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Shield className="h-8 w-8 text-indigo-600" />
                  <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    Live Platform
                  </Badge>
                </div>
                <CardTitle className="text-indigo-600">SHELTR Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Access the live SHELTR platform with full administrative privileges
                </p>
                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <a 
                    href="https://sheltr-ai.web.app/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Access Platform
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Security Notice */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-slate-50 dark:bg-slate-800 border rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-slate-600" />
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                Confidential Information
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              All information accessed through this portal is confidential and proprietary to SHELTR-AI. 
              Unauthorized sharing or distribution is strictly prohibited. Access is logged for security and compliance purposes.
            </p>
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2 mx-auto"
              >
                <LogOut className="h-4 w-4" />
                Secure Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
