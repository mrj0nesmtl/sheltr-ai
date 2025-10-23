'use client';

import Link from 'next/link';
import { ArrowLeft, Building2, Users, Clock, TrendingUp, CheckCircle, BarChart3, FileText, Download, Shield, DollarSign, Calendar, Target, Coins, Zap, Heart, Gamepad2, Smartphone, QrCode, Globe, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { StandardHero } from '@/components/StandardHero';

export default function OrganizationsCaseStudyPage() {
  const { heroImage } = useHeroImage('/solutions/organizations/case-study', '/backgrounds/solutions-bg.jpg');
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <PublicNavigation />

      {/* Document Header - Standardized */}
      <StandardHero
        imageUrl={heroImage.url}
        badgeText="Case Study"
        badgeVariant="secondary"
        badgeClassName="bg-white text-black"
        title="Breaking the Cycle"
      >
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="flex items-center gap-4 text-sm text-white/80">
            <span>TECH4GOOD</span>
            <span>•</span>
            <span>June 2025</span>
            <span>•</span>
            <span>15 min read</span>
          </div>
          <Badge variant="outline" className="text-green-300 border-green-300">Implementation Studied</Badge>
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-200 mb-4 text-xl font-semibold">
          </p>
          <p className="text-gray-300 mb-4">
            Academic research proves that after 90 days of homelessness, the chance of recovery drops dramatically. 
            SHELTR offers a new platform to attack this crisis from both sides: <strong>Crowd funded emergency mobile housing</strong> for those on the streets, 
            and <strong>next-gen HMIS tools</strong> for shelters to maximize efficiency and fundraising.
          </p>
          <p className="text-sm text-gray-300">
            For detailed documentation, visit our{' '}
            <a 
              href="https://github.com/mrjones/sheltr-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 underline"
            >
              GitHub Repo
            </a>
          </p>
        </div>
      </StandardHero>

      {/* The 90-Day Crisis Threshold */}
      <section className="py-16 bg-background dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-red-600 text-white mb-4">
                <Clock className="h-4 w-4 mr-2" />
                Critical Research
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                The 90-Day Crisis Threshold
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Academic studies prove that if a person is homeless for <strong>more than 90 days</strong>, 
                the chance of them recovering their lives and returning to any sense of normalcy is <strong>slim to none</strong>.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-l-4 border-red-500 mb-12">
              <h3 className="text-2xl font-bold mb-4 text-red-700 dark:text-red-300">The Shelter Trap</h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  <strong>Nobody's going to get a job or get back on their feet living in a shelter.</strong>
                </p>
                <ul className="space-y-3 list-disc list-inside">
                  <li>Shelters provide <strong>temporary beds</strong>, not <strong>stability</strong></li>
                  <li>Apartments can take <strong>years</strong> to acquire through traditional channels</li>
                  <li>Living in parks and tents while waiting is <strong>not a solution</strong></li>
                  <li>The longer someone stays homeless, the harder it becomes to escape</li>
                  <li>Traditional shelter systems can trap people in a cycle they may <strong>never escape</strong></li>
                </ul>
                <p className="text-lg font-semibold text-foreground pt-4">
                  The sooner we give them <strong>their own place</strong>, the sooner they can get back into life.
                </p>
              </div>
            </div>

            <div className="bg-muted/50 dark:bg-gray-900/50 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300">SHELTR's Two-Pronged Solution</h3>
              <p className="text-lg text-muted-foreground mb-6">
                We attack the homelessness epidemic from <strong>both sides</strong> with distinct but complementary solutions:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-blue-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Home className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-600">Fundraising Technology:</h4>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    <strong>For those on the streets:</strong> Direct community fundraising + QR code donations to secure <strong>mobile PODS</strong> and emergency housing.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Personal QR codes for direct community support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>80% of donations go directly to participant for PODS/housing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Bypass the shelter trap—go straight to independence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Mobile, secure, and dignified living space</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-purple-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-600">Next-Gen HMIS:</h4>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    <strong>For shelter operators:</strong> Enhance existing operations with AI-powered tools, overflow management, and automated fundraising.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Upgrade existing HMIS with next-gen capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Overflow relief: connect participants to PODS when full</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>5% automated operations revenue from participant donations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>AI analytics, compliance automation, and fundraising tools</span>
                    </li>
                  </ul>
                </div>
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
              <p className="text-center text-xl">
                SHELTR attacks the homelessness crisis with a dual-purpose platform designed to break the 90-day crisis threshold. 
                <strong> First, </strong> empower those living in tents and parks with direct community funding to secure <strong>mobile PODS and emergency housing</strong>—because anything is better than a tent. 
                <strong> Second,</strong> provide shelters with next-generation HMIS systems for free to maximize their impact and efficiency.
              </p>
              <div className="bg-muted/50 dark:bg-gray-900/50 p-6 rounded-lg mt-8">
                <p className="text-center text-lg font-semibold mb-4">
                  🎯 <strong>Core Innovation:</strong> Direct-to-participant housing funding + shelter operational excellence
                </p>
                <p className="text-center">
                  The object is to help those who want to seek out donations amplify that effort and help them secure mobile housing 
                  so they don't get sucked into shelter life from which they may never escape. The sooner we give them their own place, 
                  the sooner they can get back into life.
                </p>
              </div>
            </div>

            {/* Dual Platform Impact Metrics */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Platform 1 Metrics */}
              <Card className="border-2 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Home className="h-6 w-6" />
                    Mobile PODS Impact
                  </CardTitle>
                  <CardDescription>Direct-to-participant emergency housing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Bypass Shelter Trap</span>
                      <span className="text-2xl font-bold text-blue-600">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-sm text-muted-foreground">Direct to independent living—no shelter stay required</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-medium">Community Funding</span>
                      <span className="text-2xl font-bold text-green-600">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    <p className="text-sm text-muted-foreground">Direct to participant for PODS/housing/essentials</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-medium">Recovery Window</span>
                      <span className="text-2xl font-bold text-red-600">&lt;90 Days</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Beat the crisis threshold with immediate housing</p>
                  </div>
                </CardContent>
              </Card>

              {/* Platform 2 Metrics */}
              <Card className="border-2 border-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Building2 className="h-6 w-6" />
                    HMIS Enhancement
                  </CardTitle>
                  <CardDescription>Next-gen tools for shelter operators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Admin Time Savings</span>
                      <span className="text-2xl font-bold text-purple-600">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-sm text-muted-foreground">Automated reporting, AI analytics, digital intake</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-medium">Overflow Management</span>
                      <span className="text-2xl font-bold text-green-600">Seamless</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-sm text-muted-foreground">Connect participants to PODS when shelter is full</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-medium">Operations Revenue</span>
                      <span className="text-2xl font-bold text-blue-600">5%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Automated from participant donations via platform</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Story */}
      <section className="py-16 bg-background dark:bg-black">
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
      <section className="py-16 bg-background dark:bg-black">
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
      <section className="py-16 bg-background dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Scenario: 100 Participants</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Conservative projections show how SHELTR technology can create financial sustainability 
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
                        <span className="font-semibold text-green-700 dark:text-green-400">SHELTER DISTRIBUTION (5%)</span>
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

          </div>
        </div>
      </section>

      {/* Donor Engagement Revolution */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Donor Engagement Disruption</h2>
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
            <div className="bg-muted/50 dark:bg-gray-900/50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Typical Donor Journey</h3>
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
      <section className="py-16 bg-background dark:bg-black">
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
              <div className="text-center mt-12">
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
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">The Disruption Starts Now</h2>
              <p className="text-xl mb-8 opacity-90">
                Transform your revenue model while providing unprecedented support.
              </p>
            </div>

            {/* ROI Guarantee */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">$30,000</div>
                <div className="text-lg mb-2">Annual Impact Potential</div>
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