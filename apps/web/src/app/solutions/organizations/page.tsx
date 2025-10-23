'use client';

import Link from 'next/link';
import { ArrowLeft, Building2, Users, BarChart3, Shield, UserCheck, Clock, DollarSign, CheckCircle, Smartphone, FileText, Bell, Settings, Brain, Zap, Target, Award, TrendingUp, Star, Rocket, Globe, Heart, AlertTriangle, TrendingDown, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { StandardHero } from '@/components/StandardHero';

export default function OrganizationsPage() {
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/solutions/organizations', '/backgrounds/solutions-bg.jpg');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <PublicNavigation />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/solutions" className="hover:text-primary flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Solutions
          </Link>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400">Shelters</span>
        </div>
      </div>

      {/* Hero Section - Standardized */}
      <StandardHero
        imageUrl={heroImage.url}
        badgeText="Launching Soon"
        badgeVariant="outline"
        badgeClassName="border-2 border-white text-white px-4 py-2"
        title={
          <>
            Your Impact <span className="text-blue-400">Amplified</span>
          </>
        }
        subtitle="Next-Generation HMIS + Overflow Relief Ecosystem"
      >
        <p className="text-lg text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed">
          <span className="font-semibold text-blue-300">AI-powered analytics</span>, 
          <span className="font-semibold text-purple-300"> blockchain transparency</span>, 
          <span className="font-semibold text-green-300"> overflow assistance</span>, and 
          <span className="font-semibold text-yellow-300"> community investment returns</span>. 
          We're not competing—we're <strong className="text-white"> amplifying your impact</strong>.
        </p>
      </StandardHero>

      {/* Reality Check Section - NEW */}
      <section className="py-20 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-red-600 text-white mb-4">
                <AlertTriangle className="h-4 w-4 mr-2" />
                The Hard Truth
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                After Decades of Effort, The Crisis Is Growing
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We deeply respect the tireless work of shelter operators everywhere. You've saved countless lives. 
                But the numbers don't lie—and we can't ignore them anymore.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-2 border-red-500/30 bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown className="h-8 w-8 text-red-600" />
                    <CardTitle className="text-red-700 dark:text-red-300">The Overflow Crisis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    <strong>Shelters across North America are at capacity.</strong> Every night, thousands are turned away. 
                    Parks, tents, and encampments become the only "option" for people in crisis.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Toronto's shelter system operating at 98% capacity (2024)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Vancouver reports 400+ people denied shelter nightly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Encampments growing 40% year-over-year in major cities</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-500/30 bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <CardTitle className="text-orange-700 dark:text-orange-300">The 90-Day Threshold</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    <strong>Academic research proves:</strong> After 90 days of homelessness, the chance of recovery 
                    drops dramatically. Traditional shelter-to-housing pipelines take too long.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Average wait time for subsidized housing: 18-36 months</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Shelter stays don't provide the stability needed for job hunting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Nobody recovers their life while living in a tent</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    We Need Technology. We Need Innovation. We Need It Now.
                  </h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    <strong>This isn't a criticism of your work—it's a call to action.</strong> No civilized society 
                    should accept overflow homelessness as inevitable. The current infrastructure was built for a 
                    different era. The tools available haven't kept pace with the crisis.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    <strong className="text-blue-600 dark:text-blue-400">Anything is better than a tent.</strong> SHELTR 
                    provides the technological bridge: immediate overflow relief through mobile PODS, community-funded 
                    emergency housing, and next-generation HMIS tools to maximize your existing operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Statement */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <Badge className="bg-green-100 text-green-800 border-green-200 mb-4">
                <Heart className="h-4 w-4 mr-2" />
                Tech-for-Good Partnership
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                We're Not Competing. We're Amplifying Your Impact.
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-xl text-muted-foreground leading-relaxed mb-8"> 
                SHELTR provides overflow relief when you're at capacity, creates new revenue streams through 
                community investment, and modernizes your operations with next-generation HMIS capabilities. 
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Overflow Relief</h3>
                  <p className="text-muted-foreground">
                    When you're at capacity, seamlessly connect participants with PODS emergency housing, 
                    transitional apartments, and permanent housing through our verified provider network*.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Community Investment</h3>
                  <p className="text-muted-foreground">
                    Generate sustainable revenue through our SmartFund™ model: 15% of donations create 
                    housing infrastructure with guaranteed 4-6% APY returns, benefiting all.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Next-Gen HMIS</h3>
                  <p className="text-muted-foreground">
                    Powerful analytics, blockchain transparency, and mobile-first design that makes 
                    traditional HMIS feel like the past. Your data, your control, enhanced capabilities.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <blockquote className="text-lg italic text-foreground border-l-4 border-blue-500 pl-6">
                  Sheltr is creating an ecosystem where technology, community, and compassion converge to <strong>hack</strong> homelessness at its root. Every 
                  participant is empowered with direct access to a new opportunity."
                </blockquote>
                <cite className="block text-right text-muted-foreground mt-4">— SHELTR</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              <Target className="h-4 w-4 mr-2" />
              Immediate Impact
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Why Organizations Must Act Now</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              <strong>The overflow crisis demands immediate action.</strong> Open source, purpose-built for the unique 
              challenges of emergency services, and ready to deploy. Stop turning people away—start connecting them to solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-green-700 dark:text-green-300">Increase Funding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Comprehensive impact data and automated compliance reporting 
                  strengthen grant applications and funder relationships.
                </p>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center text-sm font-medium text-green-600">
                    <Award className="h-4 w-4 mr-1" />
                    Better grant success rates
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-purple-700 dark:text-purple-300">Improve Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Data-driven insights help optimize programs and track participant 
                  progress from intake to permanent housing.
                </p>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center text-sm font-medium text-purple-600">
                    <Globe className="h-4 w-4 mr-1" />
                    Measurable impact
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-300">Save Hours Daily</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Automated reporting, digital intake, and streamlined case management 
                  free up staff time for direct participant support.
                </p>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center text-sm font-medium text-blue-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Up to 40% time savings
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center mt-12">
            <Link href="/solutions/organizations/hmis-guide">
              <Button variant="outline" size="lg" className="bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300 px-8">
                <Brain className="h-5 w-5 mr-2" />
                HMIS & SHELTR
              </Button>
            </Link>
            <Link href="/solutions/organizations/case-study">
              <Button variant="outline" size="lg" className="bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300 px-8">
                <FileText className="h-5 w-5 mr-2" />
                View Case Study
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">NextGeneration HMIS</h2>
            <p className="text-xl text-muted-foreground">Everything you need to run efficient, impactful programs</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Participant Management */}
            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle className="text-2xl">Participant Management</CardTitle>
                <CardDescription>Comprehensive case management from intake to housing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Digital intake and assessment forms</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Automated QR code generation for donations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Progress tracking and milestone management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Document storage and verification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Communication logs and notes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics & Reporting */}
            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle className="text-2xl">Analytics & Reporting</CardTitle>
                <CardDescription>Real-time insights and automated compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Real-time donation tracking and allocation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Outcome measurement and success metrics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Automated funder reports (HUD, HMIS compatible)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Performance dashboards and KPI tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Custom report builder for stakeholders</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff Tools */}
            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle className="text-2xl">Staff Tools</CardTitle>
                <CardDescription>Mobile-first tools for frontline workers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Mobile app for field case management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>QR code scanning for quick check-ins</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Real-time notifications and alerts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Offline capability for field work</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Secure messaging between staff</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Security */}
            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle className="text-2xl">Compliance & Security</CardTitle>
                <CardDescription>Enterprise-grade security and regulatory compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>HIPAA-compliant data handling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>SOC 2 Type II certification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Role-based access controls</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Audit trails and data backup</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Multi-factor authentication</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200">
              <Zap className="h-4 w-4 mr-2" />
              Breaking the Mold
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Why Traditional HMIS Systems Can't Keep Up</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              <strong>Legacy systems were built for data management, not crisis response.</strong> We've built what others only dream of: 
              the first integrated HMIS-donation-investment platform that doesn't just manage data—it creates sustainable revenue 
              streams, solves overflow challenges, and provides immediate emergency housing alternatives.
            </p>
          </div>

          {/* Competitive Comparison Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">SHELTR-AI</th>
                    <th className="px-6 py-4 text-center font-semibold">WellSky HMIS</th>
                    <th className="px-6 py-4 text-center font-semibold">PlanStreet</th>
                    <th className="px-6 py-4 text-center font-semibold">Traditional HMIS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 font-medium">AI-Powered Analytics</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700/30">
                    <td className="px-6 py-4 font-medium">Blockchain Donations</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Participant QR Codes</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-yellow-500">Barcode Only</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700/30">
                    <td className="px-6 py-4 font-medium">Mobile-First Design</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-yellow-500">Limited</td>
                    <td className="px-6 py-4 text-center text-yellow-500">Responsive</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Real-time Fund Tracking</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-yellow-500">Basic</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700/30">
                    <td className="px-6 py-4 font-medium">HUD Compliance</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Implementation Time</td>
                    <td className="px-6 py-4 text-center font-semibold text-green-600">1-2 weeks</td>
                    <td className="px-6 py-4 text-center text-yellow-600">2-6 months</td>
                    <td className="px-6 py-4 text-center text-yellow-600">1-3 months</td>
                    <td className="px-6 py-4 text-center text-red-600">3-12 months</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700/30">
                    <td className="px-6 py-4 font-medium">Overflow Relief Network</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Investment Returns (APY)</td>
                    <td className="px-6 py-4 text-center font-semibold text-green-600">4-6% Guaranteed</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-700/30">
                    <td className="px-6 py-4 font-medium">Physical Infrastructure</td>
                    <td className="px-6 py-4 text-center font-semibold text-green-600">PODS + MOBI + Drones</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Pricing Model</td>
                    <td className="px-6 py-4 text-center font-semibold text-green-600">Free / Community Supported</td>
                    <td className="px-6 py-4 text-center text-red-600">Enterprise only</td>
                    <td className="px-6 py-4 text-center text-yellow-600">Tiered</td>
                    <td className="px-6 py-4 text-center text-red-600">High setup costs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Differentiators */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="text-center">
                <Smartphone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-purple-600">Modern Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Built with cutting-edge AI, blockchain, and mobile-first design principles.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />AI-powered predictive analytics</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Blockchain donation transparency</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Native mobile applications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-blue-600">Participant-Centric Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Unlike traditional HMIS systems, SHELTR empowers participants with direct access and control.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Personal QR donation codes</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Digital wallet access</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Real-time progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-600">Investment Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Generate sustainable revenue while solving homelessness through our revolutionary SmartFund™ model.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />4-6% guaranteed APY returns</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />15% of donations build infrastructure</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Coinbase institutional staking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              <Rocket className="h-4 w-4 mr-2" />
              Fast Implementation
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Quick Implementation, Immediate Results</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our experienced team works with you to ensure a smooth transition and rapid adoption. 
              Get up and running in weeks, not months.
            </p>
          </div>
          
          <div className="relative mb-16">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-8 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-green-300 via-blue-300 to-purple-300"></div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3 text-green-700 dark:text-green-300">Setup & Training</h3>
                  <p className="text-muted-foreground">Complete onboarding in 1-2 weeks with dedicated support and comprehensive training for your team</p>
                </div>
              </div>
              
              <div className="relative text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-300">Data Migration</h3>
                  <p className="text-muted-foreground">Seamless import of existing participant records with zero data loss and full historical preservation</p>
                </div>
              </div>
              
              <div className="relative text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-300">Go Live</h3>
                  <p className="text-muted-foreground">Start seeing results immediately with 24/7 support and continuous optimization guidance</p>
                </div>
              </div>
            </div>
          </div>
          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-12 shadow-lg border-2 border-blue-500/20">
            <Badge className="bg-blue-600 text-white mb-4">
              <Zap className="h-4 w-4 mr-2" />
              The Time Is Now
            </Badge>
            <h3 className="text-3xl font-bold mb-6">The Overflow Won't Wait. Neither Should You.</h3>
            <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              <strong>Every night you're at capacity, someone is turned away.</strong> Every day the 90-day threshold passes, 
              someone's chances of recovery diminish. The technology exists. The solution is here.
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join forward-thinking shelter organizations exploring SHELTR's dual-platform approach: 
              <strong> mobile PODS for overflow relief</strong> + <strong>next-gen HMIS for operational excellence</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  <Rocket className="h-5 w-5 mr-2" />
                  Schedule a Partnership Call
                </Button>
              </Link>
              <Link href="/solutions/organizations/case-study">
                <Button size="lg" variant="outline" className="border-2 border-purple-400 text-purple-600 hover:bg-purple-50 dark:text-purple-300 dark:border-purple-300 dark:hover:bg-purple-900/20 px-8 py-6 text-lg">
                  <FileText className="h-5 w-5 mr-2" />
                  Read the Full Case Study
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Open-source. Community-supported. Built for the frontlines.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <PublicChatbot />
    </div>
  );
} 