'use client';

import Link from 'next/link';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  TrendingUp,
  CheckCircle,
  Eye,
  CreditCard,
  Building2,
  Smartphone,
  BarChart3,
  Lock,
  QrCode,
  Coins,
  Home,
  ChevronRight,
  ExternalLink,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import Mermaid from '@/components/Mermaid';

export default function PlatformOverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Docs
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="hover:bg-muted p-1 h-auto"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4" />
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="hover:bg-muted px-2 py-1 h-auto"
            >
              <Link href="/docs">
                Documentation
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">
              Platform Overview
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="h-8 w-8 text-blue-600" />
              <Badge className="bg-blue-600 text-white px-4 py-1">PLATFORM OVERVIEW</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Disrupting Charitable Giving
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Technology-driven transparency and direct impact through enterprise infrastructure, 
              blockchain innovation, and zero-crypto participant experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <a 
                  href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/overview/platform-overview.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  Full Technical Document
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/docs/system-design">
                  <Building2 className="h-4 w-4 mr-2" />
                  System Architecture
                </Link>
              </Button>
            </div>
          </div>

          {/* Version & Status Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700">
              ✓ Pilot Ready
            </Badge>
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700">
              v2.90.0
            </Badge>
            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700">
              Mission: Tech for Good
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="impact" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="impact" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Impact Model</span>
                <span className="sm:hidden">Impact</span>
              </TabsTrigger>
              <TabsTrigger value="mission" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Mission & Vision</span>
                <span className="sm:hidden">Mission</span>
              </TabsTrigger>
              <TabsTrigger value="difference" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">SHELTR Difference</span>
                <span className="sm:hidden">Difference</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Key Features</span>
                <span className="sm:hidden">Features</span>
              </TabsTrigger>
            </TabsList>

            {/* Mission & Vision Tab */}
            <TabsContent value="mission" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">💡 Mission & Vision</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our commitment to hacking homelessness through technology-driven solutions
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Heart className="h-6 w-6 text-blue-600" />
                      Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      Hacking homelessness through technology.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      We believe that by combining cutting-edge technology with compassionate action, 
                      we can create measurable, verifiable impact in the fight against homelessness.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Eye className="h-6 w-6 text-emerald-600" />
                      Our Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      A world where every act of giving is transparent, every donation reaches its intended recipient, 
                      and every person experiencing homelessness has access to the tools and resources they need to 
                      rebuild their lives.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Core Values */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-center">Core Values</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
                    <CardHeader>
                      <Zap className="h-8 w-8 text-blue-600 mb-2" />
                      <CardTitle>Empowerment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Providing tools for individuals to take control of their futures
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10">
                    <CardHeader>
                      <Eye className="h-8 w-8 text-emerald-600 mb-2" />
                      <CardTitle>Transparency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Every transaction visible and verifiable on the blockchain
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
                    <CardHeader>
                      <Brain className="h-8 w-8 text-purple-600 mb-2" />
                      <CardTitle>Automation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Streamlining processes for maximum efficiency and impact
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
                    <CardHeader>
                      <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
                      <CardTitle>Sustainability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Building long-term solutions, not just short-term fixes
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-pink-200 dark:border-pink-800 bg-pink-50/50 dark:bg-pink-900/10">
                    <CardHeader>
                      <Star className="h-8 w-8 text-pink-600 mb-2" />
                      <CardTitle>Innovation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Leveraging the latest technology to solve age-old problems
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10">
                    <CardHeader>
                      <Shield className="h-8 w-8 text-indigo-600 mb-2" />
                      <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Enterprise-grade protection at every level
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* SHELTR Difference Tab */}
            <TabsContent value="difference" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">🏠 The SHELTR Difference</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  What makes us unique in the charitable giving landscape
                </p>
              </div>

              {/* Five-Role Ecosystem */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Users className="h-6 w-6 text-purple-600" />
                    Five-Role Ecosystem
                  </CardTitle>
                  <CardDescription>
                    Unlike traditional donation platforms, SHELTR recognizes five distinct user types with role-based access control
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50/50 dark:bg-red-900/10">
                      <Shield className="h-6 w-6 text-red-600 mb-2" />
                      <h4 className="font-semibold mb-1">Super Admin</h4>
                      <p className="text-sm text-muted-foreground">Platform founders with full system access</p>
                    </div>
                    <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
                      <Building2 className="h-6 w-6 text-blue-600 mb-2" />
                      <h4 className="font-semibold mb-1">Platform Admin</h4>
                      <p className="text-sm text-muted-foreground">Executive team with cross-platform oversight</p>
                    </div>
                    <div className="p-4 border border-emerald-200 dark:border-emerald-800 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10">
                      <Home className="h-6 w-6 text-emerald-600 mb-2" />
                      <h4 className="font-semibold mb-1">Shelter Admin</h4>
                      <p className="text-sm text-muted-foreground">Shelter operators and staff managing locations</p>
                    </div>
                    <div className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50/50 dark:bg-orange-900/10">
                      <Heart className="h-6 w-6 text-orange-600 mb-2" />
                      <h4 className="font-semibold mb-1">Participant</h4>
                      <p className="text-sm text-muted-foreground">Individuals receiving donations (the heart of our platform)</p>
                    </div>
                    <div className="p-4 border border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50/50 dark:bg-purple-900/10">
                      <Coins className="h-6 w-6 text-purple-600 mb-2" />
                      <h4 className="font-semibold mb-1">Donor</h4>
                      <p className="text-sm text-muted-foreground">Contributors making a difference through transparent giving</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SmartFund Distribution */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                    SmartFund™ Distribution (80-15-5)
                  </CardTitle>
                  <CardDescription>
                    Every donation automatically distributes through enterprise payment infrastructure powered by Adyen for Platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div className="text-center p-6 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
                      <div className="text-4xl font-bold text-blue-600 mb-2">80%</div>
                      <h4 className="font-semibold mb-2">Virtual Debit Cards</h4>
                      <p className="text-sm text-muted-foreground">Zero crypto exposure for participants</p>
                    </div>
                    <div className="text-center p-6 border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50/50 dark:bg-purple-900/10">
                      <div className="text-4xl font-bold text-purple-600 mb-2">15%</div>
                      <h4 className="font-semibold mb-2">Housing Fund</h4>
                      <p className="text-sm text-muted-foreground">4-6% guaranteed APY (SHELTR Stablecoin on Base)</p>
                    </div>
                    <div className="text-center p-6 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">5%</div>
                      <h4 className="font-semibold mb-2">Platform Operations</h4>
                      <p className="text-sm text-muted-foreground">Sustainable revenue for growth</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-center text-muted-foreground">
                      <strong>No blockchain knowledge required.</strong> Participants receive standard virtual debit cards 
                      while transparency is maintained on-chain.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* QR-Powered & Blockchain */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-indigo-200 dark:border-indigo-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="h-6 w-6 text-indigo-600" />
                      QR-Powered Direct Giving
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm">Instant scan-and-give technology</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm">No intermediaries or delayed transfers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm">Real-time confirmation and tracking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm">Works offline for reliability</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm">Mobile-first design for accessibility</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-cyan-200 dark:border-cyan-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-cyan-600" />
                      Blockchain Transparency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-cyan-600" />
                        <span className="text-sm">Every transaction on Base (Ethereum L2)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-cyan-600" />
                        <span className="text-sm">Public verification of impact</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-cyan-600" />
                        <span className="text-sm">Immutable donation history</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-cyan-600" />
                        <span className="text-sm">Smart contract automation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-cyan-600" />
                        <span className="text-sm">Single-token architecture (SHELTR stablecoin)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Key Features Tab */}
            <TabsContent value="features" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">🚀 Key Features</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Comprehensive features tailored for each stakeholder in the SHELTR ecosystem
                </p>
              </div>

              <div className="space-y-6">
                {/* For Participants */}
                <Card className="border-2 border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Heart className="h-6 w-6 text-orange-600" />
                      For Participants
                    </CardTitle>
                    <CardDescription>Empowering individuals with tools and autonomy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Personal QR Codes</p>
                          <p className="text-sm text-muted-foreground">Unique donation identifiers</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Virtual Debit Cards</p>
                          <p className="text-sm text-muted-foreground">Direct control via Adyen</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Impact Tracking</p>
                          <p className="text-sm text-muted-foreground">See your progress and support</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Verification System</p>
                          <p className="text-sm text-muted-foreground">Build trust with donors</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Mobile Access</p>
                          <p className="text-sm text-muted-foreground">Manage from your phone</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Zero Crypto Exposure</p>
                          <p className="text-sm text-muted-foreground">Standard banking experience</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* For Donors */}
                <Card className="border-2 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Coins className="h-6 w-6 text-purple-600" />
                      For Donors
                    </CardTitle>
                    <CardDescription>Transparent giving with measurable impact</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Instant Donations</p>
                          <p className="text-sm text-muted-foreground">Scan and give in seconds</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Full Transparency</p>
                          <p className="text-sm text-muted-foreground">Track every dollar on blockchain</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Impact Analytics</p>
                          <p className="text-sm text-muted-foreground">See your cumulative difference</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Social Features</p>
                          <p className="text-sm text-muted-foreground">Share and engage with community</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Tax Documentation</p>
                          <p className="text-sm text-muted-foreground">Automatic receipt generation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Flexible Giving</p>
                          <p className="text-sm text-muted-foreground">Anonymous or logged-in options</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* For Shelter Admins */}
                <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Home className="h-6 w-6 text-emerald-600" />
                      For Shelter Admins
                    </CardTitle>
                    <CardDescription>Comprehensive tools for shelter operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Participant Management</p>
                          <p className="text-sm text-muted-foreground">Onboard and support individuals</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Real-time Dashboards</p>
                          <p className="text-sm text-muted-foreground">Monitor donations and impact</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Location Services</p>
                          <p className="text-sm text-muted-foreground">Help donors find your shelter</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Analytics</p>
                          <p className="text-sm text-muted-foreground">Data-driven insights</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Multi-tenant Support</p>
                          <p className="text-sm text-muted-foreground">Secure, isolated data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Lead Capture</p>
                          <p className="text-sm text-muted-foreground">Unified contact system</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* For Platform Admins */}
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Building2 className="h-6 w-6 text-blue-600" />
                      For Platform Admins
                    </CardTitle>
                    <CardDescription>Enterprise-level oversight and control</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">System Monitoring</p>
                          <p className="text-sm text-muted-foreground">Real-time platform health</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Global Analytics</p>
                          <p className="text-sm text-muted-foreground">Cross-platform metrics</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">User Management</p>
                          <p className="text-sm text-muted-foreground">Comprehensive admin tools</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Security Controls</p>
                          <p className="text-sm text-muted-foreground">Multi-layer protection</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Blockchain Management</p>
                          <p className="text-sm text-muted-foreground">Smart contract oversight</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Investor Portal</p>
                          <p className="text-sm text-muted-foreground">IR Data Room access</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Impact Model Tab */}
            <TabsContent value="impact" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">📊 Impact Model</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our theory of change and measurable approach to solving homelessness
                </p>
              </div>

              {/* Theory of Change Diagram */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BarChart3 className="h-6 w-6 text-emerald-600" />
                    Theory of Change
                  </CardTitle>
                  <CardDescription>
                    How SHELTR creates lasting impact through direct giving and sustainable housing solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 overflow-x-auto">
                    <Mermaid
                      key="theory-of-change-diagram"
                      chart={`graph TD
    A[Individual in Need] -->|QR Code Registration| B[SHELTR Platform]
    C[Compassionate Donor] -->|Scans QR Code| B
    B -->|SmartFund Distribution| D[80% Virtual Debit Card]
    B -->|Automated Allocation| E[15% Housing Fund]
    B -->|Platform Operations| F[5% Sustainability]
    
    D -->|Immediate Relief| G[Basic Needs Met]
    E -->|Long-term Investment| H[Sustainable Housing - 4-6% APY]
    F -->|Platform Growth| I[Expanded Reach]
    
    G -->|Stability| J[Path to Independence]
    H -->|Permanent Solutions| J
    I -->|More Shelters| A
    
    style A fill:#ff6b6b,stroke:#ff4757,stroke-width:3px
    style C fill:#4ecdc4,stroke:#26d0ce,stroke-width:3px
    style D fill:#45b7d1,stroke:#3742fa,stroke-width:3px
    style E fill:#96ceb4,stroke:#55a3ff,stroke-width:3px
    style J fill:#feca57,stroke:#ff9ff3,stroke-width:3px`}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <Badge variant="outline" className="text-xs">
                      Interactive Theory of Change - Fully Rendered
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Real-World Impact Metrics */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    Real-World Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6 mt-6">
                    <div className="text-center p-6 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50/50 dark:bg-green-900/10">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-green-600 mb-1">$1,534</div>
                      <p className="text-sm text-muted-foreground">Total Raised</p>
                    </div>
                    <div className="text-center p-6 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-blue-600 mb-1">10+</div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                    <div className="text-center p-6 border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50/50 dark:bg-purple-900/10">
                      <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-purple-600 mb-1">&lt;1s</div>
                      <p className="text-sm text-muted-foreground">Avg Scan Time</p>
                    </div>
                    <div className="text-center p-6 border-2 border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50/50 dark:bg-orange-900/10">
                      <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-orange-600 mb-1">75+</div>
                      <p className="text-sm text-muted-foreground">Avg Conversion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Status */}
              <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                    Platform Status: Production Ready (v2.90.0)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    SHELTR is actively being tested in real-world environments. Feedback from pilots validates 
                    both technical implementation and user experience across all stakeholder types.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30">
                      ✓ Multi-tenant SaaS
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30">
                      ✓ QR Donations Live
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30">
                      ✓ Blockchain Integration
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30">
                      ✓ Virtual Card System
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30">
                      ✓ AI Chatbot System
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join us in revolutionizing charitable giving and fighting homelessness through technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/scan">
                <QrCode className="h-4 w-4 mr-2" />
                Start Giving Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20">
              <Link href="/docs">
                Browse Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
