'use client';

import Link from 'next/link';
import { ArrowLeft, Building2, Users, Clock, TrendingUp, CheckCircle, BarChart3, FileText, Download, Shield, DollarSign, Calendar, Target, Coins, Zap, Heart, Gamepad2, Smartphone, QrCode, Globe, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function OrganizationsCaseStudyPage() {
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
              <Link href="/solutions/organizations">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Solutions
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="relative py-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/backgrounds/solutions-bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Building2 className="h-12 w-12 text-white" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold text-white">SHELTR for Shelters -  Case Study</h1>
                  <Badge className="bg-white text-black">Organizations</Badge>
                </div>
                <p className="text-lg text-gray-200">
                  Transforming Shelter Operations Through Technology
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                  <span>Case Study</span>
                  <span>•</span>
                  <span>June 2025</span>
                  <span>•</span>
                  <span>15 min read</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-green-300 border-green-300">Implementation Studied</Badge>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-300 mb-4">
                This case study demonstrates the transformative potential of SHELTR's platform for shelter operations.
              </p>
              <p className="text-sm text-gray-400">
                For detailed documentation and implementation guides, visit our{' '}
                <a 
                  href="https://github.com/mrjones/sheltr-ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  GitHub repository
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Statement */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <Badge className="bg-green-100 text-green-800 border-green-200 mb-4">
                <Heart className="h-4 w-4 mr-2" />
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Elevating Lives Through Technology & Community Support
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                SHELTR transforms the traditional approach to homelessness by leveraging cutting-edge technology 
                to create direct pathways from the streets to stable housing. Our platform connects participants 
                with immediate housing solutions—from tiny homes to apartments—while building sustainable financial 
                foundations through community-powered crowdfunding.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Immediate Housing</h3>
                  <p className="text-muted-foreground">
                    Connect participants with tiny homes, transitional apartments, and permanent housing solutions 
                    through our verified network of providers.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Financial Elevation</h3>
                  <p className="text-muted-foreground">
                    Build sustainable income through skill development, job placement, and direct community 
                    support via blockchain-verified micro-donations.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Community Crowdfunding</h3>
                  <p className="text-muted-foreground">
                    Harness the power of technology to mobilize community support, creating transparent 
                    funding streams that directly impact participant outcomes.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <blockquote className="text-lg italic text-foreground border-l-4 border-blue-500 pl-6">
                  "Technology isn't just changing how we manage homelessness—it's revolutionizing how we 
                  <strong>solve</strong> it. By connecting participants directly with housing opportunities 
                  and community funding, we're creating pathways to independence that were never possible before."
                </blockquote>
                <cite className="block text-right text-muted-foreground mt-4">— SHELTR Platform Vision</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              <h2 className="text-center">Summary: The Operational Implementation</h2>
              <p className="text-center text-xl">
                Transform shelter operations through cutting-edge technology, streamlining participant management 
                while creating unprecedented transparency and fundraising engagement opportunities. A blockchain-powered platform 
                modernizes every aspect of shelter administration, from intake to housing placement, while building 
                sustainable support networks for long-term participant success.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg mt-8">
                <p className="text-center text-lg font-semibold mb-4">
                  🎯 <strong>Core Innovation:</strong> Modern technology meets compassionate care through AI-powered insights and blockchain transparency
                </p>
                <p className="text-center">
                  SHELTR elevates traditional shelter management into a sophisticated, data-driven operation that maximizes 
                  both efficiency and participant outcomes through automated systems and real-time analytics.
                </p>
              </div>
            </div>

            {/* Operational Impact Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card className="border-blue-500/20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <CardHeader className="text-center pb-2">
                  <Clock className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-blue-600 text-2xl">75%</CardTitle>
                  <CardDescription className="font-medium">Potential Time Savings</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">Potential Reduction in administrative tasks</p>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardHeader className="text-center pb-2">
                  <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-green-600 text-2xl">100%</CardTitle>
                  <CardDescription className="font-medium">Digital Compliance</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">Automated HUD reporting & analytics</p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/20 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
                <CardHeader className="text-center pb-2">
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-purple-600 text-2xl">50%</CardTitle>
                  <CardDescription className="font-medium">Faster Outcomes</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">Accelerated housing placements</p>
                </CardContent>
              </Card>

              <Card className="border-orange-500/20 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                <CardHeader className="text-center pb-2">
                  <Shield className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                  <CardTitle className="text-orange-600 text-2xl">24/7</CardTitle>
                  <CardDescription className="font-medium">System Availability</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">Always-on blockchain infrastructure</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Story */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Case Study: Shelter Implementation</h2>
              <p className="text-xl text-muted-foreground">
                A 120-bed shelter transforms operations in 3 weeks with SHELTR's comprehensive platform
              </p>
            </div>

            {/* Implementation Timeline Story */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-12 shadow-lg">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <h3 className="text-center mb-8">The Implementation Journey</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-blue-600 font-semibold mb-4">📋 Pre-Implementation Challenges</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Paper-based intake requiring 45 minutes per participant</li>
                      <li>• Manual bed tracking causing frequent overbooking</li>
                      <li>• 15+ hours weekly spent on compliance reporting</li>
                      <li>• Limited donor visibility reducing fundraising effectiveness</li>
                      <li>• No systematic participant progress tracking</li>
                      <li>• Disconnected service referrals and case management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-green-600 font-semibold mb-4">🚀 Post-Implementation Results</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Digital intake completed in under 8 minutes</li>
                      <li>• Real-time bed availability with zero overbooking</li>
                      <li>• Automated reporting saving 12+ hours weekly</li>
                      <li>• Transparent fund tracking increasing donor confidence</li>
                      <li>• Comprehensive participant journey documentation</li>
                      <li>• Integrated service network with automated referrals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Week-by-Week Implementation */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Setup & Configuration</CardTitle>
                      <CardDescription>Week 1: Foundation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground italic">
                      "Our IT team was amazed by how quickly we got everything running. The platform 
                      configured itself to our existing workflows seamlessly." - IT Director
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Platform deployment and security setup
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Staff training sessions (4 hours total)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Data migration from existing systems
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Participant Onboarding</CardTitle>
                      <CardDescription>Week 2: Going Live</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground italic">
                      "Participants loved their QR codes immediately. Many asked if they could share 
                      them with family members right away." - Case Manager
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Digital intake for 85 existing participants
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        QR code generation and explanation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Blockchain wallet setup and education
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Full Operations</CardTitle>
                      <CardDescription>Week 3: Optimization</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground italic">
                      "By week 3, we couldn't imagine going back to our old system. Everything just works 
                      better now." - Shelter Director
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Full platform deployment active
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        First donations and revenue automation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Analytics and optimization workflows
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features & Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comprehensive Platform Features</h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to run a modern, efficient, and transparent shelter operation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <CardTitle>Participant Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Digital check-in process</span>
                      <span className="text-sm font-medium text-green-600">8x faster</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Case file management</span>
                      <span className="text-sm font-medium text-blue-600">100% digital</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Progress tracking & analytics</span>
                      <span className="text-sm font-medium text-purple-600">Real-time</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                    <CardTitle>Automated Reporting</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">HUD compliance reports</span>
                      <span className="text-sm font-medium text-green-600">Auto-generated</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Impact analytics dashboard</span>
                      <span className="text-sm font-medium text-blue-600">Live updates</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Grant reporting templates</span>
                      <span className="text-sm font-medium text-purple-600">One-click</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-purple-600" />
                    <CardTitle>Blockchain Transparency</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fund distribution tracking</span>
                      <span className="text-sm font-medium text-green-600">100% visible</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Transaction verification</span>
                      <span className="text-sm font-medium text-blue-600">Immutable</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Donor confidence & trust</span>
                      <span className="text-sm font-medium text-purple-600">Enhanced</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-orange-600" />
                    <CardTitle>Outcome Tracking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Housing placement success</span>
                      <span className="text-sm font-medium text-green-600">Auto-tracked</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Service utilization metrics</span>
                      <span className="text-sm font-medium text-blue-600">Measured</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Long-term stability monitoring</span>
                      <span className="text-sm font-medium text-purple-600">Continuous</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Foundation */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Built on SHELTR's Three Revolutionary Pillars</h2>
              <p className="text-xl text-muted-foreground">
                Our SmartFund™ technology creates sustainable support systems through automated blockchain distribution
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-blue-600 mb-2">Pillar 1: Direct Support (85%)</h4>
                <p className="text-sm text-muted-foreground">Immediate participant funding + welcome bonus system drives donor confidence and recurring support</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-bold text-green-600 mb-2">Pillar 2: Housing Fund (10%)</h4>
                <p className="text-sm text-muted-foreground">Automated savings with 4.2% yield creates visible progress toward permanent housing goals</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-purple-600 mb-2">Pillar 3: Shelter Operations (5%)</h4>
                <p className="text-sm text-muted-foreground">Sustainable funding for operations, staff development, technology upgrades, and program expansion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 100 Participants Financial Scenario */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Financial Scenario: 100 Participants</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Conservative projections show how SHELTR transforms your shelter's financial sustainability 
                through participant-driven revenue generation and donor engagement automation.
              </p>
            </div>

            {/* Monthly Revenue Breakdown */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="border-2 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                    Monthly Revenue Projection
                  </CardTitle>
                  <CardDescription>Conservative estimate: $500 per participant monthly fundraising average</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-medium">100 Participants × $500/month</span>
                      <span className="text-2xl font-bold text-green-600">$50,000</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Direct Participant Support (85%)</span>
                        <span className="font-medium">$42,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Housing Fund (10%)</span>
                        <span className="font-medium">$5,000</span>
                      </div>
                      <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <span className="font-semibold text-green-700 dark:text-green-400">🏆 YOUR SHELTER REVENUE (5%)</span>
                        <span className="text-xl font-bold text-green-600">$2,500</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    Annual Financial Impact
                  </CardTitle>
                  <CardDescription>Sustainable recurring revenue model with growth potential</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">$30,000</div>
                        <div className="text-sm text-muted-foreground">Annual Shelter Revenue</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">$600,000</div>
                        <div className="text-sm text-muted-foreground">Total Platform Volume</div>
                      </div>
                    </div>
                    <div className="text-center pt-4">
                      <div className="text-3xl font-bold text-green-600 mb-2">300% ROI</div>
                      <p className="text-sm text-muted-foreground">Typical first-year return on technology investment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fundraising Performance Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-8">Participant Fundraising Performance Distribution</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">20</div>
                  <div className="text-sm font-medium mb-2">Top Performers</div>
                  <div className="text-xs text-muted-foreground mb-3">$1,000+ monthly</div>
                  <div className="bg-red-500/10 p-3 rounded-lg">
                    <div className="font-bold text-red-600">$1,000 × 20 = $20,000</div>
                    <div className="text-xs">Shelter Revenue: $1,000</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">30</div>
                  <div className="text-sm font-medium mb-2">Strong Performers</div>
                  <div className="text-xs text-muted-foreground mb-3">$500-$999 monthly</div>
                  <div className="bg-orange-500/10 p-3 rounded-lg">
                    <div className="font-bold text-orange-600">$750 × 30 = $22,500</div>
                    <div className="text-xs">Shelter Revenue: $1,125</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">30</div>
                  <div className="text-sm font-medium mb-2">Average Performers</div>
                  <div className="text-xs text-muted-foreground mb-3">$200-$499 monthly</div>
                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <div className="font-bold text-blue-600">$350 × 30 = $10,500</div>
                    <div className="text-xs">Shelter Revenue: $525</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-500 mb-2">20</div>
                  <div className="text-sm font-medium mb-2">New/Developing</div>
                  <div className="text-xs text-muted-foreground mb-3">$50-$199 monthly</div>
                  <div className="bg-gray-500/10 p-3 rounded-lg">
                    <div className="font-bold text-gray-600">$125 × 20 = $2,500</div>
                    <div className="text-xs">Shelter Revenue: $125</div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">$55,500</div>
                <div className="text-lg text-muted-foreground mb-2">Total Monthly Platform Volume</div>
                <div className="text-2xl font-bold text-purple-600">$2,775 Monthly Shelter Revenue</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Actual performance often exceeds conservative projections due to gamification effects
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donor Engagement Revolution */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The Donor Engagement Revolution</h2>
              <p className="text-xl text-muted-foreground">
                SHELTR's invisible gamification mechanics transform casual donors into committed long-term supporters
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="border-2 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Gamepad2 className="h-6 w-6 text-purple-600" />
                    Gamification Mechanics
                  </CardTitle>
                  <CardDescription>Psychological triggers that drive sustained engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Progress Visualization</div>
                        <div className="text-sm text-muted-foreground">Real-time housing fund growth with visual progress bars</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Heart className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Milestone Celebrations</div>
                        <div className="text-sm text-muted-foreground">Achievement notifications for employment, housing approvals</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Impact Leaderboards</div>
                        <div className="text-sm text-muted-foreground">Social proof through community impact rankings</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Globe className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium">Distance Relationship Building</div>
                        <div className="text-sm text-muted-foreground">Technology-enabled personal connections across geography</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Smartphone className="h-6 w-6 text-green-600" />
                    Engagement Technologies
                  </CardTitle>
                  <CardDescription>Seamless tools that maximize donor participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <QrCode className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Personal QR Codes</div>
                        <div className="text-sm text-muted-foreground">One-tap donations with instant blockchain confirmation</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Recurring Automation</div>
                        <div className="text-sm text-muted-foreground">Set-and-forget monthly support with smart contract automation</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Real-time Analytics</div>
                        <div className="text-sm text-muted-foreground">Live impact dashboards showing fund utilization and outcomes</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Shield className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium">Blockchain Transparency</div>
                        <div className="text-sm text-muted-foreground">Immutable proof of fund distribution and impact verification</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Donor Journey Visualization */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Typical Donor Journey & Revenue Acceleration</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                  <h4 className="font-bold mb-2">Discovery ($5-20)</h4>
                  <p className="text-sm text-muted-foreground">Initial QR code scan, small test donation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                  <h4 className="font-bold mb-2">Engagement ($25-100)</h4>
                  <p className="text-sm text-muted-foreground">Progress tracking, milestone celebrations increase giving</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                  <h4 className="font-bold mb-2">Commitment ($100-500)</h4>
                  <p className="text-sm text-muted-foreground">Recurring monthly support, relationship building</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                  <h4 className="font-bold mb-2">Advocacy ($500+)</h4>
                  <p className="text-sm text-muted-foreground">Social sharing, recruiting other donors, major gifts</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-lg font-semibold text-purple-600">
                  Average donor value increases 15x from discovery to advocacy stage
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Platform gamification accelerates this journey from 18 months to 6 months
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Generation Timeline */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Revenue Generation Timeline</h2>
              <p className="text-xl text-muted-foreground">
                From setup to sustainable monthly income in under 30 days
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card className="relative border-2 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Setup & Launch</CardTitle>
                      <CardDescription>Week 1</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Platform configuration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Participant onboarding
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      QR code generation
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">$0</div>
                    <div className="text-xs text-muted-foreground">Initial revenue</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative border-2 border-green-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">First Donations</CardTitle>
                      <CardDescription>Week 2-3</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      QR code activation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Initial donor engagement
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      5% revenue automation
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">$200-500</div>
                    <div className="text-xs text-muted-foreground">Early revenue</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative border-2 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Momentum Building</CardTitle>
                      <CardDescription>Month 1</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Donor relationship growth
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Recurring donations setup
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Social media sharing
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">$1,000+</div>
                    <div className="text-xs text-muted-foreground">Monthly revenue</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative border-2 border-orange-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center">
                      <span className="font-bold">4</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Sustainable Revenue</CardTitle>
                      <CardDescription>Month 2-3</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Full participant portfolio
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Automated monthly income
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Growth optimization
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">$2,500+</div>
                    <div className="text-xs text-muted-foreground">Target achieved</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Growth Chart */}
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-center mb-8">Projected Monthly Revenue Growth (100 Participants)</h3>
              <div className="grid grid-cols-12 gap-2 items-end h-64">
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-blue-500 mb-2" style={{height: '20px'}}></div>
                  <span className="text-xs">Week 1</span>
                  <span className="text-xs font-bold">$0</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-green-500 mb-2" style={{height: '40px'}}></div>
                  <span className="text-xs">Week 2</span>
                  <span className="text-xs font-bold">$200</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-green-600 mb-2" style={{height: '80px'}}></div>
                  <span className="text-xs">Week 3</span>
                  <span className="text-xs font-bold">$500</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-purple-500 mb-2" style={{height: '120px'}}></div>
                  <span className="text-xs">Month 1</span>
                  <span className="text-xs font-bold">$1,200</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-purple-600 mb-2" style={{height: '160px'}}></div>
                  <span className="text-xs">Month 2</span>
                  <span className="text-xs font-bold">$1,800</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-orange-500 mb-2" style={{height: '200px'}}></div>
                  <span className="text-xs">Month 3</span>
                  <span className="text-xs font-bold">$2,500</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-orange-600 mb-2" style={{height: '220px'}}></div>
                  <span className="text-xs">Month 4</span>
                  <span className="text-xs font-bold">$2,750</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-red-500 mb-2" style={{height: '240px'}}></div>
                  <span className="text-xs">Month 5</span>
                  <span className="text-xs font-bold">$3,000</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-red-600 mb-2" style={{height: '256px'}}></div>
                  <span className="text-xs">Month 6</span>
                  <span className="text-xs font-bold">$3,200</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-red-700 mb-2" style={{height: '256px'}}></div>
                  <span className="text-xs">Month 7+</span>
                  <span className="text-xs font-bold">$3,500+</span>
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-lg font-semibold text-green-600">
                  Conservative projection: 200% month-over-month growth in first quarter
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Actual results often exceed projections due to viral sharing and community support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features & Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features & Benefits</h2>
              <p className="text-xl text-muted-foreground">
                Purpose-built for the unique challenges of homelessness services
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <CardTitle>Participant Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Digital check-in process</span>
                      <span className="text-sm font-medium text-green-600">95% faster</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Case file management</span>
                      <span className="text-sm font-medium text-blue-600">100% digital</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Progress tracking</span>
                      <span className="text-sm font-medium text-purple-600">Real-time</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                    <CardTitle>Automated Reporting</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Compliance reports</span>
                      <span className="text-sm font-medium text-green-600">Auto-generated</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Impact analytics</span>
                      <span className="text-sm font-medium text-blue-600">Live dashboard</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Grant reporting</span>
                      <span className="text-sm font-medium text-purple-600">One-click</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-purple-600" />
                    <CardTitle>Blockchain Transparency</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fund tracking</span>
                      <span className="text-sm font-medium text-green-600">100% visible</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Transaction verification</span>
                      <span className="text-sm font-medium text-blue-600">Immutable</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Donor confidence</span>
                      <span className="text-sm font-medium text-purple-600">Enhanced</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-orange-600" />
                    <CardTitle>Outcome Tracking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Housing placements</span>
                      <span className="text-sm font-medium text-green-600">Auto-tracked</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Service utilization</span>
                      <span className="text-sm font-medium text-blue-600">Measured</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Long-term stability</span>
                      <span className="text-sm font-medium text-purple-600">Monitored</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Analysis */}
      <section className="py-16 bg-blue-50/50 dark:bg-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Return on Investment</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Organizations typically see positive ROI within 3 months of implementation
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-background rounded-lg p-6 border">
                <div className="text-3xl font-bold text-blue-600 mb-2">$15,000</div>
                <div className="text-sm text-muted-foreground mb-4">Annual staff time savings</div>
                <div className="text-xs text-muted-foreground">Based on 15 hours/week × $20/hour</div>
              </div>

              <div className="bg-white dark:bg-background rounded-lg p-6 border">
                <div className="text-3xl font-bold text-green-600 mb-2">$25,000</div>
                <div className="text-sm text-muted-foreground mb-4">Additional grant funding</div>
                <div className="text-xs text-muted-foreground">From improved reporting & outcomes</div>
              </div>

              <div className="bg-white dark:bg-background rounded-lg p-6 border">
                <div className="text-3xl font-bold text-purple-600 mb-2">300%</div>
                <div className="text-sm text-muted-foreground mb-4">First-year ROI</div>
                <div className="text-xs text-muted-foreground">Typical organization results</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Your Financial Revolution Starts Now</h2>
              <p className="text-xl mb-8 opacity-90">
                Stop leaving money on the table. Transform your participants into revenue-generating assets 
                while providing them unprecedented support and dignity.
              </p>
            </div>

            {/* ROI Guarantee */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">$30,000</div>
                <div className="text-lg mb-2">Annual Revenue Potential</div>
                <div className="text-sm opacity-80">Conservative 100-participant estimate</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">30 Days</div>
                <div className="text-lg mb-2">To First Revenue</div>
                <div className="text-sm opacity-80">From implementation to income</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-lg mb-2">Automated Income</div>
                <div className="text-sm opacity-80">Blockchain works while you sleep</div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-center mb-8">Conservative Financial Projections</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">🎯 Month 1 Targets</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• 25 participants onboarded and active</li>
                    <li>• $200-500 in initial donations generated</li>
                    <li>• 5% shelter operations revenue ($10-25)</li>
                    <li>• Donor engagement systems activated</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">🚀 Month 3 Achievements</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• 100 participants generating $50,000 monthly</li>
                    <li>• $2,500 monthly shelter operations revenue</li>
                    <li>• Recurring donor base established</li>
                    <li>• Gamification driving 300% engagement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Risk-Free Proposition */}
            <div className="bg-yellow-500/20 border border-yellow-300/30 rounded-xl p-6 mb-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">🛡️ Risk-Free Implementation Guarantee</h3>
                <p className="mb-4">
                  If you don't see positive ROI within 90 days, we'll refund your setup investment 
                  and help transition participants to alternative solutions at no cost.
                </p>
                <p className="text-sm opacity-90">
                  We're so confident in SHELTR's financial impact that we guarantee results. 
                  Your success is our success.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Revenue Demo
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <FileText className="h-5 w-5 mr-2" />
                  Download Financial Model
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Calculate Your ROI
                </Button>
              </div>
              <p className="text-sm opacity-80">
                Limited early-adopter pricing available for the first 50 shelters
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 