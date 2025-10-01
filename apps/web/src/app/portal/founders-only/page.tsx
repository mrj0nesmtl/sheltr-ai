'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeLogo from '@/components/ThemeLogo';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
  Lock,
  Building2,
  Blocks,
  Camera
} from 'lucide-react';
import { checkFounderAccess, clearFounderAccess, getFounderInfo } from '@/services/founderAccessService';
import FoundersGallery from '@/components/FoundersGallery';

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
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/logo-sheltr-white.png" 
              alt="SHELTR Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">SHELTR Founders Portal</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Confidential access for co-founders and strategic leadership
          </p>
          <Badge variant="outline" className="border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 px-4 py-1">
            🔒 Restricted Access • Co-Founders Only
          </Badge>
        </div>

        {/* Founders Introduction */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-0">
              <h2 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-200">Welcome to SHELTR&apos;s Executive Command Center</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Your Google email addresses provide you with comprehensive access to the SHELTR platform, including full Platform Administrator privileges and executive dashboard capabilities. As co-founders, you have unrestricted access to all system functions, financial oversight, user management, and strategic analytics. Upon logging into the main platform, you will be presented with a Non-Disclosure Agreement (NDA) and a personalized welcome letter tailored to your specific expertise and leadership role within SHELTR. This portal serves as your gateway to confidential business plans, financial reports, and strategic documentation that will be progressively published here as we advance toward our public launch.
              </p>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/40 rounded-lg border border-amber-300 dark:border-amber-700">
                <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                  🔒 Confidential Access: Only the five SHELTR co-founders have access to this executive portal and its strategic resources.
                </p>
              </div>
            </CardContent>
          </Card>
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
                <Button asChild variant="outline" className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 dark:text-orange-400 dark:border-orange-400">
                  <Link href="/docs/roadmap" className="flex items-center justify-center gap-2 no-underline">
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
                <CardTitle className="text-green-600">Proposed Payment Rails</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Adyen + Coinbase integration architecture with single-token stable fund model
                </p>
                <Button asChild variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-green-400 dark:border-green-400">
                  <Link href="/docs/payment-rails" className="flex items-center justify-center gap-2 no-underline">
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
                <Button asChild variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400">
                  <Link href="/portal/investor-relations" className="flex items-center justify-center gap-2 no-underline">
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
                <Button asChild variant="outline" className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 dark:text-purple-400 dark:border-purple-400">
                  <Link href="/docs" className="flex items-center justify-center gap-2 no-underline">
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
                <Button asChild variant="outline" className="w-full border-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <a 
                    href="https://github.com/mrj0nesmtl/sheltr-ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 no-underline"
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
                <Button asChild variant="outline" className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-400">
                  <a 
                    href="https://sheltr-ai.web.app/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 no-underline"
                  >
                    Access Platform
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* System Design Architecture */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-cyan-200 dark:border-cyan-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Building2 className="h-8 w-8 text-cyan-600" />
                  <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                    Architecture
                  </Badge>
                </div>
                <CardTitle className="text-cyan-600">System Design Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Multi-tenant SaaS architecture with enterprise payment infrastructure, visual flow diagrams, and comprehensive system integration blueprints
                </p>
                <Button asChild variant="outline" className="w-full border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-400">
                  <Link href="/docs/system-design" className="flex items-center justify-center gap-2 no-underline">
                    View Architecture
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Technical White Paper */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <FileText className="h-8 w-8 text-emerald-600" />
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    v2.0
                  </Badge>
                </div>
                <CardTitle className="text-emerald-600">Technical White Paper</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Revolutionary enterprise-grade platform with single-token architecture and blockchain transparency
                </p>
                <Button asChild variant="outline" className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-400">
                  <Link href="/docs/whitepaper" className="flex items-center justify-center gap-2 no-underline">
                    Read Whitepaper
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Blockchain Architecture */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-amber-200 dark:border-amber-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Blocks className="h-8 w-8 text-amber-600" />
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    SmartFund™
                  </Badge>
                </div>
                <CardTitle className="text-amber-600">Blockchain Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Single-token stable fund ecosystem with enterprise payment infrastructure and guaranteed returns
                </p>
                <Button asChild variant="outline" className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:text-amber-400 dark:border-amber-400">
                  <Link href="/docs/blockchain" className="flex items-center justify-center gap-2 no-underline">
                    View Blockchain
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Gallery Management */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Camera className="h-8 w-8 text-indigo-600" />
                  <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    Media Hub
                  </Badge>
                </div>
                <CardTitle className="text-indigo-600">Gallery Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload and manage media content, videos, and images for platform and founders portal sharing
                </p>
                <Button asChild variant="outline" className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-400">
                  <Link href="/dashboard/gallery" className="flex items-center justify-center gap-2 no-underline">
                    Manage Gallery
                    <Camera className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-rose-200 dark:border-rose-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <FileText className="h-8 w-8 text-rose-600" />
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Secure
                  </Badge>
                </div>
                <CardTitle className="text-rose-600">Business Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Professional VC-worthy business plan with market analysis, financial projections, and exit strategy
                </p>
                <Button asChild variant="outline" className="w-full border-2 border-rose-600 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 dark:text-rose-400 dark:border-rose-400">
                  <Link href="/secure-docs/business-plan" className="flex items-center justify-center gap-2 no-underline">
                    View Business Plan
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section Divider */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 py-2 bg-background text-muted-foreground font-medium rounded-full border border-gray-200 dark:border-gray-700">
                Quality Assurance & Testing Environment
              </span>
            </div>
          </div>
        </div>

        {/* Demo User Credentials for QA Testing */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-emerald-700 dark:text-emerald-300">QA Testing Demo Accounts</CardTitle>
                  <p className="text-sm text-muted-foreground">Connected test accounts for comprehensive system validation</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Introduction */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                    These three interconnected demo accounts simulate the complete SHELTR ecosystem for testing purposes. 
                    The <strong>Participant</strong> and <strong>Shelter Admin</strong> are connected to <strong>Old Brewery Mission</strong> for realistic data flow testing. 
                    The Scan & Give system is currently awaiting payment rail and blockchain integration, but the data stream functions consistently. 
                    <strong>Important:</strong> When logged in as Platform Administrators, donations will be credited to your accounts for testing purposes.
                  </p>
                </div>

                {/* Demo Accounts Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Donor Account */}
                  <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">D</span>
                        </div>
                        <CardTitle className="text-blue-700 dark:text-blue-300 text-lg">Demo Donor</CardTitle>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Jane Supporter</div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs font-medium text-blue-600 dark:text-blue-400">Email</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">donor@example.com</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-blue-600 dark:text-blue-400">Password</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">sheltr123</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-blue-600 dark:text-blue-400">Role</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">donor</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Participant Account */}
                  <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">P</span>
                        </div>
                        <CardTitle className="text-green-700 dark:text-green-300 text-lg">Demo Participant</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs font-medium text-green-600 dark:text-green-400">Email</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">participant@example.com</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-green-600 dark:text-green-400">Password</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">sheltr123</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-green-600 dark:text-green-400">Role</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">participant</p>
                      </div>
                      <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-300">
                        <strong>Connected to:</strong> Old Brewery Mission
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shelter Admin Account */}
                  <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">S</span>
                        </div>
                        <CardTitle className="text-purple-700 dark:text-purple-300 text-lg">Demo Shelter Admin</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs font-medium text-purple-600 dark:text-purple-400">Email</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">shelteradmin@example.com</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-purple-600 dark:text-purple-400">Password</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">sheltr123</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-purple-600 dark:text-purple-400">Role</Label>
                        <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">sheltr-admin</p>
                      </div>
                      <div className="mt-2 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-purple-700 dark:text-purple-300">
                        <strong>Organization:</strong> Old Brewery Mission
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Status Notice */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-600 text-xs">⚠</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-1">Payment & Blockchain Integration Status</h4>
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        The Scan & Give donation system is currently in development, awaiting full payment rail (Adyen) and blockchain (Coinbase Base) integration. 
                        However, the data streaming and user interface components are fully functional for testing purposes. All donation flows will be simulated 
                        until payment processing is activated.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Future Content Notice */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-slate-600" />
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Coming Soon to This Portal</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Business plans, detailed financial reports, and strategic documentation will be progressively published 
                    in this founders portal as we advance toward our public launch timeline.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Founders Gallery Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Founders Gallery</h2>
            <p className="text-muted-foreground">
              Curated media content shared exclusively with SHELTR co-founders
            </p>
          </div>
          
          <FoundersGallery />
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
