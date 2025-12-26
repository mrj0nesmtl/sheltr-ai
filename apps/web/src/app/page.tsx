'use client';

import Link from 'next/link';
import { ArrowRight, Heart, QrCode, Shield, Users, Building2, Target, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import NewsletterSignup from '@/components/NewsletterSignup';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { useQRCodeTracking } from '@/hooks/useQRCodeTracking';
import { StandardHero } from '@/components/StandardHero';

export default function HomePage() {
  
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/', '/backgrounds/hero-bg.jpg');
  
  // Track QR code scans
  useQRCodeTracking();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation - Now using unified PublicNavigation component */}
      <PublicNavigation />

        {/* Hero Section - Standardized with Video Support */}
        <StandardHero
          imageUrl={heroImage.url}
          mediaType={heroImage.mediaType}
          videoType={heroImage.type}
          badgeText="TECH-4-GOOD"
          badgeVariant="secondary"
          badgeClassName="bg-white/20 text-white border-white/30 backdrop-blur-sm"
          title={
            <>
              Better to <span className="text-blue-400">Solve</span> than Manage
            </>
          }
          subtitle=""
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/scan-give">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-500 hover:text-white hover:border-green-500 backdrop-blur-sm transition-all">
                Scan & Give
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 bg-transparent border-2 border-white/60 text-white hover:bg-white hover:text-black hover:border-white backdrop-blur-sm transition-all">
                <ArrowRight className="h-5 w-5 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </StandardHero>

        {/* Mission Statement - Above the Fold */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-muted/50 via-background to-muted/30 rounded-2xl p-10 border-2 border-primary/10 text-center">
                <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-6">
                  <strong className="text-primary text-2xl">Born out of necessity—not ambition.</strong>
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Built by technologists guided by field experts, we apply a <em>tech-for-good</em> ethos to <strong>amplify existing infrastructure, 
                  not compete with it.</strong> Our singular focus: <strong className="text-foreground">housing the unhoused as quickly as possible.</strong> Because 
                  anything—<em>anything</em>—is better than a tent on the side of the road.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - 3 Simple Steps */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4" variant="outline">HOW IT WORKS</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Three Steps to <span className="text-blue-400">Real Impact</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From scan to shelter—transparent, automated, and built for dignity
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Step 1 */}
              <Card className="border-2 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group relative overflow-hidden">
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-500">1</span>
                </div>
                <CardHeader>
                  <div className="mb-4 p-4 rounded-full bg-blue-500/10 w-fit">
                    <QrCode className="h-10 w-10 text-blue-500" />
                  </div>
                  <CardTitle className="text-2xl">Scan & Give</CardTitle>
                  <CardDescription>Instant, direct donations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Participants receive unique QR codes. Donors scan and give instantly—funds flow directly through secure blockchain transactions.
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="border-2 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group relative overflow-hidden">
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-500">2</span>
                </div>
                <CardHeader>
                  <div className="mb-4 p-4 rounded-full bg-green-500/10 w-fit">
                    <Zap className="h-10 w-10 text-green-500" />
                  </div>
                  <CardTitle className="text-2xl">SmartFund™ Split</CardTitle>
                  <CardDescription>Automated distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Smart contracts automatically distribute every donation:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><strong>80%</strong> immediate access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><strong>15%</strong> housing fund (staked)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><strong>5%</strong> shelter operations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="border-2 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group relative overflow-hidden">
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-500">3</span>
                </div>
                <CardHeader>
                  <div className="mb-4 p-4 rounded-full bg-purple-500/10 w-fit">
                    <Building2 className="h-10 w-10 text-purple-500" />
                  </div>
                  <CardTitle className="text-2xl">Deploy Micro-Housing</CardTitle>
                  <CardDescription>Long-term solutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    The 15% housing allocation compounds through institutional staking, building towards micro-housing units and permanent shelter solutions.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Primary CTA - Above the Fold */}
            <div className="text-center">
              <Link href="/scan-give">
                <Button size="lg" className="text-xl px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-xl">
                  <QrCode className="h-6 w-6 mr-3" />
                  Start Giving Now
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">No signup required • Instant impact • 100% transparent</p>
            </div>
          </div>
        </section>

        {/* Social Proof - Trust Indicators */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why SHELTR?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Cutting-edge technology meets proven impact methodologies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">100% Transparent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every transaction tracked on blockchain. No hidden fees, complete visibility from donation to impact.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                    <TrendingUp className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Data-Driven</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Real-time analytics optimize resource allocation and maximize impact for every dollar donated.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                    <Heart className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Human-Centered</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Built with dignity and purpose. Technology that amplifies compassion, not replaces it.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Who We Serve - 4 Stakeholders */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4" variant="outline">AN ECOSYSTEM FOR ALL</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Solutions for Every Stakeholder
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Participants, donors, shelters, and governments—everyone has a role
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 hover:border-blue-400/50 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-blue-500/10 w-fit">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <CardTitle>For Participants</CardTitle>
                  <CardDescription>Dignity & Direct Support</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Personal QR codes</li>
                    <li>• Virtual debit cards</li>
                    <li>• Housing fund building</li>
                    <li>• AI case management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-400/50 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-green-500/10 w-fit">
                    <Heart className="h-8 w-8 text-green-500" />
                  </div>
                  <CardTitle>For Donors</CardTitle>
                  <CardDescription>Transparent Impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Instant QR giving</li>
                    <li>• Blockchain tracking</li>
                    <li>• Real-time impact</li>
                    <li>• Tax receipts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-orange-400/50 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-orange-500/10 w-fit">
                    <Building2 className="h-8 w-8 text-orange-500" />
                  </div>
                  <CardTitle>For Shelters</CardTitle>
                  <CardDescription>Operations & Management</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Enterprise HMIS</li>
                    <li>• Overflow management</li>
                    <li>• Automated reporting</li>
                    <li>• 5% funding stream</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-purple-400/50 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-purple-500/10 w-fit">
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                  <CardTitle>For Governments</CardTitle>
                  <CardDescription>Data & Accountability</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Real-time population data</li>
                    <li>• HUD compliance</li>
                    <li>• Coordinated entry</li>
                    <li>• ROI metrics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Link href="/solutions">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  Explore All Solutions
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA - With Background Image */}
        <section className="relative py-24 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/backgrounds/impact-bg.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/60 to-purple-900/60" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 drop-shadow-md">
              Join us in creating sustainable pathways out of homelessness
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="text-xl px-10 py-6 bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-2xl"
                >
                  Get Started Today
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-xl px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-black font-bold shadow-2xl"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-300 mt-6">
              <CheckCircle className="h-4 w-4 inline mr-2" />
              Free to start • No credit card required • Instant impact
            </p>
          </div>
        </section>

        {/* Newsletter Signup */}
        <NewsletterSignup source="landing" variant="banner" />
      
      <Footer />
      
      {/* Public Chatbot */}
      <PublicChatbot />
    </div>
  );
} 