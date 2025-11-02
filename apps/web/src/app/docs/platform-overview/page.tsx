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
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function PlatformOverviewPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
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

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <Star className="h-12 w-12 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">
                    Platform Overview
                  </h1>
                  <Badge className="bg-blue-500 text-white text-sm">ARCHITECTURE</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Comprehensive guides, API references, and technical documentation for the SHELTR platform
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 2.86.0 - Published</span>
                  <span>•</span>
                  <span>November 2, 2025</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">Complete RAG System</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Star className="h-4 w-4 mr-2" />
                      View on GitHub
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Target Audience</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Badge variant="outline" className="justify-center py-2 border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                Developers
              </Badge>
              <Badge variant="outline" className="justify-center py-2 border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                Donors
              </Badge>
              <Badge variant="outline" className="justify-center py-2 border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                Participants
              </Badge>
              <Badge variant="outline" className="justify-center py-2 border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                Partners
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">💡 Mission & Vision</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                    <p className="text-lg leading-relaxed">
                      <strong>Hacking homelessness through technology.</strong> We believe that by combining cutting-edge 
                      technology with compassionate action, we can create measurable, verifiable impact in the fight against homelessness.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                    <p className="text-lg leading-relaxed">
                      A world where every act of giving is transparent, every donation reaches its intended recipient, 
                      and every person experiencing homelessness has access to the tools and resources they need to rebuild their lives.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Values */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle className="text-lg">Empowerment</CardTitle>
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
                    <CardTitle className="text-lg">Transparency</CardTitle>
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
                    <CardTitle className="text-lg">Automation</CardTitle>
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
                    <CardTitle className="text-lg">Sustainability</CardTitle>
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
                    <CardTitle className="text-lg">Innovation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Leveraging the latest technology to solve age-old problems
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The SHELTR Difference */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">🏠 The SHELTR Difference</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Four-Role Ecosystem */}
              <Card className="border-indigo-200 dark:border-indigo-800">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-6 w-6 text-indigo-600" />
                    <CardTitle>Four-Role Ecosystem</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Unlike traditional donation platforms, SHELTR recognizes four distinct user types:
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-sm">SuperAdmin:</strong>
                      <span className="text-sm text-muted-foreground"> Platform founders and operators</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-sm">Admin:</strong>
                      <span className="text-sm text-muted-foreground"> Shelter operators and staff</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Heart className="h-4 w-4 text-pink-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-sm">Participant:</strong>
                      <span className="text-sm text-muted-foreground"> Individuals receiving donations</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-sm">Donor:</strong>
                      <span className="text-sm text-muted-foreground"> Contributors making a difference</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SmartFund Distribution */}
              <Card className="border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                    <CardTitle>SmartFund™ Distribution</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Every donation automatically distributes through blockchain smart contracts:
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-2xl font-bold text-emerald-600">80%</span>
                    <span className="text-sm text-muted-foreground">Virtual debit cards</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-2xl font-bold text-blue-600">15%</span>
                    <span className="text-sm text-muted-foreground">Housing fund (4-6% APY)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-2xl font-bold text-purple-600">5%</span>
                    <span className="text-sm text-muted-foreground">Platform operations</span>
                  </div>
                </CardContent>
              </Card>

              {/* QR-Powered Giving */}
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                    <CardTitle>QR-Powered Direct Giving</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Instant scan-and-give technology</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>No intermediaries or delayed transfers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Real-time confirmation and tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Works offline for reliability</span>
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain Transparency */}
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-6 w-6 text-purple-600" />
                    <CardTitle>Blockchain Transparency</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Every transaction permanently recorded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Public verification of impact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Immutable donation history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Smart contract automation</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features by Role */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">🚀 Key Features</h2>

            <div className="space-y-6">
              {/* For Participants */}
              <Card className="border-pink-200 dark:border-pink-800 bg-pink-50/30 dark:bg-pink-900/10">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-pink-600" />
                    <CardTitle>For Participants</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Personal QR Codes</strong> - Unique donation identifiers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Digital Wallets</strong> - Direct control over received funds</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Impact Tracking</strong> - See your progress and support</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Verification System</strong> - Build trust with donors</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Mobile Access</strong> - Manage everything from your phone</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* For Donors */}
              <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-emerald-600" />
                    <CardTitle>For Donors</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Instant Donations</strong> - Scan and give in seconds</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Full Transparency</strong> - Track every dollar's impact</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Impact Analytics</strong> - See your cumulative difference</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Social Features</strong> - Share and engage with community</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Tax Documentation</strong> - Automatic receipt generation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* For Shelter Admins */}
              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <CardTitle>For Shelter Admins</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Participant Management</strong> - Onboard and support individuals</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Real-time Dashboards</strong> - Monitor donations and impact</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Location Services</strong> - Help donors find your shelter</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Analytics</strong> - Data-driven insights for operations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Multi-tenant Support</strong> - Secure, isolated data</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* For Platform Admins */}
              <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/10">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-purple-600" />
                    <CardTitle>For Platform Admins</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>System Monitoring</strong> - Real-time platform health</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Global Analytics</strong> - Cross-platform impact metrics</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>User Management</strong> - Comprehensive admin tools</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Security Controls</strong> - Multi-layer protection</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Blockchain Management</strong> - Smart contract oversight</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">🌍 Real-World Impact</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-emerald-600 mb-1">$1,534</div>
                  <div className="text-sm text-muted-foreground">Total Donations</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-600 mb-1">10+</div>
                  <div className="text-sm text-muted-foreground">Active Shelters</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-600 mb-1">&lt;1s</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Brain className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-orange-600 mb-1">75+</div>
                  <div className="text-sm text-muted-foreground">RAG Documents</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Platform Status: ✅ Production Ready (v2.86.0)</h3>
                  <p className="text-sm text-muted-foreground">
                    As of November 2025, SHELTR is fully operational with complete RAG Knowledge Base (75+ docs), 
                    Founders Portal hybrid system, advanced AI agents, 56% GCP cost optimization, and comprehensive 
                    multi-tenant architecture serving active shelters in Montreal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">🚀 Get Started</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Heart className="h-6 w-6 text-pink-600 mb-2" />
                  <CardTitle>For Participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>1. Register on the SHELTR platform</p>
                  <p>2. Get verified through your shelter</p>
                  <p>3. Receive your QR code for donations</p>
                  <p>4. Track your support in real-time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-6 w-6 text-emerald-600 mb-2" />
                  <CardTitle>For Donors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>1. Scan a QR code from any participant</p>
                  <p>2. Choose donation amount (secure payment)</p>
                  <p>3. Track impact through your dashboard</p>
                  <p>4. Engage with community via social features</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Building2 className="h-6 w-6 text-blue-600 mb-2" />
                  <CardTitle>For Shelter Admins</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>1. Register your shelter on the platform</p>
                  <p>2. Onboard participants with verification</p>
                  <p>3. Access real-time dashboards for insights</p>
                  <p>4. Manage operations through admin tools</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Brain className="h-6 w-6 text-purple-600 mb-2" />
                  <CardTitle>For Developers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>1. Explore our API documentation</p>
                  <p>2. Review technical architecture guides</p>
                  <p>3. Check GitHub repository for source code</p>
                  <p>4. Join our community for collaboration</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex flex-col sm:flex-row gap-3">
                <Link href="/login">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    <Globe className="h-5 w-5 mr-2" />
                    Visit Platform
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button size="lg" variant="outline">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Browse Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="py-12 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-center">
              <p className="text-xl italic text-muted-foreground mb-4">
                &ldquo;It&apos;s better to solve than to manage.&rdquo;
              </p>
              <footer className="text-sm text-muted-foreground">
                — SHELTR&apos;s founding principle
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

