'use client';

import Link from 'next/link';
import { Coins, Shield, Zap, QrCode, UserCheck, CreditCard, Database, Smartphone, Building2, Handshake, Globe, ArrowRight, Users, Heart, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import NewsletterSignup from '@/components/NewsletterSignup';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { StandardHero } from '@/components/StandardHero';

export default function AboutPage() {
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/about', '/backgrounds/about-bg.jpg');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Now using unified PublicNavigation component */}
      <PublicNavigation />

      {/* Hero Section - Standardized */}
      <StandardHero
        imageUrl={heroImage.url}
        badgeText="BLOCKCHAIN SECURED"
        title={
          <>
            Transforming Donations into <span className="text-blue-400">Impact</span>
          </>
        }
        subtitle="Transparency for all. Impact for all."
      />

      {/* SHELTR Product Introduction - Enhanced Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4" variant="outline">OUR MISSION</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What is SHELTR?
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                We&apos;re a QR-powered donation platform that enables <strong>direct participant empowerment</strong> through 
                transparent donations and smart contracts. Our focus spans <strong>shelter operations (HMIS), overflow management, 
                emergency housing, and micro-housing solutions</strong>—creating an ecosystem built on <strong>dignity, purpose, 
                and sustainable pathways</strong> out of homelessness.
              </p>
            </div>

            {/* Core Features - 3 Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <QrCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Scan & Give Instantly</CardTitle>
                  </div>
                  <CardDescription>
                    QR-powered donations with immediate impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Participants</strong> receive donations via unique QR codes linked to their profiles. 
                    <strong> Donors</strong> scan and give instantly, with funds flowing directly to those who need them most—
                    restoring dignity through direct empowerment.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-green-400 dark:hover:border-green-600 hover:shadow-lg hover:shadow-green-500/10 transition-all group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                      <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg">Blockchain Transparency</CardTitle>
                  </div>
                  <CardDescription>
                    Every transaction visible and verified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Built on Base blockchain with smart contracts that automatically 
                    distribute funds according to our 80/15/5 model—complete transparency, zero hidden fees, 
                    and immutable records that build trust across the entire ecosystem.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg hover:shadow-purple-500/10 transition-all group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Housing Solutions</CardTitle>
                  </div>
                  <CardDescription>
                    From emergency shelter to permanent housing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Addressing shelter overflow, emergency housing needs, and micro-housing development. 
                    Every donation builds towards long-term solutions—creating sustainable pathways from 
                    crisis to stability to permanent housing.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Four Stakeholder Solutions */}
            <div className="mb-12">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  An Ecosystem That Serves Everyone
                </h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Four comprehensive solutions designed with dignity and purpose for every stakeholder
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* For Shelters */}
                <Link href="/solutions/organizations" className="block h-full">
                  <Card className="border-2 hover:border-orange-400/50 dark:hover:border-orange-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 group cursor-pointer h-full">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-4 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors w-fit">
                        <Building2 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                      </div>
                      <CardTitle className="text-lg">For Shelters</CardTitle>
                      <CardDescription>Operations & Management</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>Enterprise HMIS platform</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>Overflow & capacity management</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>Automated reporting & compliance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>5% operational funding stream</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </Link>

                {/* For Participants */}
                <Link href="/solutions/participants" className="block h-full">
                  <Card className="border-2 hover:border-blue-400/50 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group cursor-pointer h-full">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-4 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors w-fit">
                        <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-lg">For Participants</CardTitle>
                      <CardDescription>Dignity & Direct Support</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Personal QR codes for direct donations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Virtual debit cards for immediate access</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Automatic housing fund building</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>AI-powered case management support</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </Link>

                {/* For Donors */}
                <Link href="/solutions/donors" className="block h-full">
                  <Card className="border-2 hover:border-green-400/50 dark:hover:border-green-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group cursor-pointer h-full">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-4 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors w-fit">
                        <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <CardTitle className="text-lg">For Donors</CardTitle>
                      <CardDescription>Transparent Impact</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>Scan QR codes for instant giving</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>Track every dollar on blockchain</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>See real-time impact metrics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>Tax receipts & donation history</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </Link>

                {/* For Governments */}
                <Link href="/solutions/government" className="block h-full">
                  <Card className="border-2 hover:border-purple-400/50 dark:hover:border-purple-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group cursor-pointer h-full">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-4 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors w-fit">
                        <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle className="text-lg">For Governments</CardTitle>
                      <CardDescription>Data & Accountability</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">•</span>
                          <span>Real-time population data & trends</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">•</span>
                          <span>HUD-compliant reporting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">•</span>
                          <span>Coordinated entry systems</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">•</span>
                          <span>Outcome tracking & ROI metrics</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Call to Action */}
            <div 
              className="relative text-center rounded-2xl p-12 border-2 border-primary/20 overflow-hidden"
              style={{
                backgroundImage: "url('/backgrounds/impact-bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/60 to-purple-900/60"></div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  Building an Ecosystem of Dignity and Purpose
                </h3>
                <p className="text-gray-200 mb-6 max-w-2xl mx-auto text-lg">
                  Every stakeholder plays a vital role. Together, we&apos;re creating sustainable solutions 
                  that address immediate needs while building long-term pathways out of homelessness.
                </p>
                <Link href="/solutions">
                  <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-gray-100">
                    Explore All Solutions
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Fund Change - New Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: "url('/backgrounds/impact-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                How We Fund Change
              </h2>
              <p className="text-xl text-gray-200">
                Our transparent SmartFund™ donation distribution model ensures maximum impact
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* 80% - Direct to Participants */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm rounded-xl p-8 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-lg border-2 border-blue-400 bg-blue-500/10 flex items-center justify-center">
                        <span className="text-3xl font-bold text-blue-300">80</span>
                      </div>
                      <div className="absolute -top-1 -right-1 text-blue-300 text-lg font-semibold">%</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Direct to Participants</h3>
                      <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-transparent rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Deposited and immediately accessible to Participants. 
                    Zero volatility risk ensures purchasing power remains stable at $1.00 USD value. 
                    Participants maintain complete autonomy over spending decisions and essential purchases.
                  </p>
                </div>
              </div>

              {/* 15% - Housing Allocation */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-sm rounded-xl p-8 border border-green-400/30 hover:border-green-400/60 transition-all duration-300 h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-lg border-2 border-green-400 bg-green-500/10 flex items-center justify-center">
                        <span className="text-3xl font-bold text-green-300">15</span>
                      </div>
                      <div className="absolute -top-1 -right-1 text-green-300 text-lg font-semibold">%</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Micro-Housing Allocation</h3>
                      <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-transparent rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    SmartFund™ contracts automatically direct 15% towards participants&apos; emergency housing goals, like micro-housing units. 
                    AI-optimized, Institutional staking with Coinbase compounds these funds over time. 
                    Each participant builds their housing fund through every donation receive! No one is left behind.
                  </p>
                </div>
              </div>

              {/* 5% - Shelter Operations */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 backdrop-blur-sm rounded-xl p-8 border border-orange-400/30 hover:border-orange-400/60 transition-all duration-300 h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-lg border-2 border-orange-400 bg-orange-500/10 flex items-center justify-center">
                        <span className="text-3xl font-bold text-orange-300">5</span>
                      </div>
                      <div className="absolute -top-1 -right-1 text-orange-300 text-lg font-semibold">%</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Shelter Operations</h3>
                      <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-transparent rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Covers the affiliatedshelter&apos;s onboarding, participant training materials, audits, and continuous platform upgrades*.  
                    Ensures 99.99% uptime through distributed/redundant cloud architecture and AI-powered systems.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-10 border border-white/30 shadow-2xl">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6 border-2 border-blue-400/50">
                  <Heart className="h-8 w-8 text-blue-300" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">Ready to Make a Difference?</h3>
                <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                  Discover how SHELTR creates pathways out of homelessness for donors, participants, 
                  and organizations. Choose your role and see how you can be part of the solution.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/solutions">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                      <Heart className="h-5 w-5 mr-2" />
                      Explore Solutions
                    </Button>
                  </Link>
                  <Link href="/scan-give">
                    <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Start Giving
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise-Grade Technology Ecosystem */}
      <section className="py-20 bg-gradient-to-b from-muted/30 via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">ENTERPRISE ARCHITECTURE</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              From QR Code to Housing:<br />The Complete Ecosystem
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              A comprehensive platform built on blockchain, AI, and enterprise-grade infrastructure. 
              Every donation flows through our SmartFund™ system, automatically distributing 80% for immediate needs, 
              15% towards micro-housing through institutional staking, and 5% for shelter operations—all starting with a simple scan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* QR Code Entry Point */}
            <Link href="/scan-give" className="block h-full">
              <Card className="text-center border-2 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group cursor-pointer h-full">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                    <QrCode className="h-full w-full" />
                  </div>
                  <CardTitle className="text-lg">QR Code Gateway</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Every participant receives a unique QR code linked to their profile. 
                    Donors scan, give instantly—funds flow directly through SmartFund™ contracts.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* SmartFund Distribution */}
            <Link href="/tokenomics" className="block h-full">
              <Card className="text-center border-2 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group cursor-pointer h-full">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 text-green-500 mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="h-full w-full" />
                  </div>
                  <CardTitle className="text-lg">SmartFund™ Auto-Split</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Blockchain smart contracts automatically distribute donations: 80% immediate access, 
                    15% housing fund (staked), 5% operations—transparent and immutable.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Virtual Cards & DeFi */}
            <Link href="/docs/payment-rails" className="block h-full">
              <Card className="text-center border-2 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group cursor-pointer h-full">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                    <CreditCard className="h-full w-full" />
                  </div>
                  <CardTitle className="text-lg">Virtual Cards & DeFi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Participants receive virtual debit cards for instant spending. 
                    Housing funds earn yield through Coinbase institutional staking—zero volatility risk.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Micro-Housing Fund */}
            <Link href="/solutions/participants" className="block h-full">
              <Card className="text-center border-2 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 group cursor-pointer h-full">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="h-full w-full" />
                  </div>
                  <CardTitle className="text-lg">Micro-Housing Fund</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    15% of every donation compounds towards emergency housing units. 
                    AI-optimized staking grows funds faster—building pathways to permanent shelter.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Agent Orchestra & MCP */}
            <Link href="/docs/chatbot-architecture" className="block h-full">
              <Card className="text-center border-2 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group cursor-pointer h-full">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 text-cyan-500 mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-full w-full" />
                  </div>
                  <CardTitle className="text-lg">AI Agent Orchestra</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Multi-agent AI system with MCP (Model Context Protocol) tools. 
                    Intelligent case management, resource allocation, and 24/7 participant support.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Enterprise HMIS */}
            <Link href="/solutions/organizations/hmis-guide" className="block h-full">
              <Card className="text-center border-2 hover:border-indigo-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 group cursor-pointer h-full">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
                    <Database className="h-full w-full" />
                  </div>
                  <CardTitle className="text-lg">Enterprise HMIS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    HUD-compliant Homeless Management Information System. 
                    Real-time case management, coordinated entry, and comprehensive reporting for shelters.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Blockchain Security */}
            <Link href="/docs/blockchain" className="block h-full">
              <Card className="text-center border-2 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 group cursor-pointer h-full">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="h-full w-full" />
                  </div>
                  <CardTitle className="text-lg">Base L2 Blockchain</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Built on Coinbase's Base Layer 2. Immutable transaction records, 
                    sub-cent fees, and complete transparency—every dollar tracked on-chain.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Global Infrastructure */}
            <a href="https://cloud.google.com/" target="_blank" rel="noopener noreferrer" className="block h-full">
              <Card className="text-center border-2 hover:border-pink-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 group cursor-pointer h-full">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 text-pink-500 mb-4 group-hover:scale-110 transition-transform">
                    <Globe className="h-full w-full" />
                  </div>
                  <CardTitle className="text-lg">Cloud-Native Scale</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Google Cloud multi-region deployment with Firebase real-time sync. 
                    99.9% uptime, instant global access, and enterprise-grade security.
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* Technology Partners */}
          <div className="text-center mb-8 mt-16">
            <Badge className="mb-4" variant="outline">TECHNOLOGY PARTNERS</Badge>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Powered By Industry Leaders</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Built on the world&apos;s most trusted and innovative technology platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Card className="text-center border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 flex items-center justify-center h-16">
                  <img 
                    src="/Google_Cloud_logo.svg" 
                    alt="Google Cloud" 
                    className="h-12 w-auto max-w-full"
                  />
                </div>
                <CardTitle className="text-lg">Google Cloud</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade cloud infrastructure with global scale and security
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 flex items-center justify-center h-16">
                  <img 
                    src="/New_Firebase_logo.svg" 
                    alt="Firebase" 
                    className="h-12 w-auto max-w-full"
                  />
                </div>
                <CardTitle className="text-lg">Firebase</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time database, authentication, and hosting for seamless development
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 flex items-center justify-center h-16">
                  <img 
                    src="/Anthropic_logo.svg" 
                    alt="Anthropic" 
                    className="h-12 w-auto max-w-full dark:filter dark:invert"
                  />
                </div>
                <CardTitle className="text-lg">Anthropic Claude</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced AI assistance for intelligent platform interactions and support
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 flex items-center justify-center h-16">
                  <img 
                    src="/Base_basemark_all_blue.svg" 
                    alt="Base" 
                    className="h-12 w-auto max-w-full"
                  />
                </div>
                <CardTitle className="text-lg">Base</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The #1 Ethereum Layer 2, incubated by Coinbase. Sub-cent global payments and built-in distribution.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 flex items-center justify-center h-16">
                  <img 
                    src="/Adyen_Corporate_Logo.svg" 
                    alt="Adyen" 
                    className="h-12 w-auto max-w-full"
                  />
                </div>
                <CardTitle className="text-lg">Adyen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Global payment platform engineered for ambition with end-to-end payment capabilities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Newsletter Signup */}
      <NewsletterSignup source="about" variant="banner" />

      <Footer />
      <PublicChatbot />
    </div>
  );
}