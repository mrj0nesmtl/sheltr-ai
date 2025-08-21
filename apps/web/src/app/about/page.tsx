'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn, Coins, Shield, Zap, QrCode, UserCheck, CreditCard, Database, Smartphone, Building2, Handshake, Globe, ArrowRight, Users, Heart, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <ThemeLogo />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">
                Solutions
              </Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">
                Scan & Give
              </Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">
                Impact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
                <Link 
                  href="/about" 
                  className="block px-3 py-2 text-base font-medium text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/solutions" 
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Solutions
                </Link>
                <Link 
                  href="/scan-give" 
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Scan & Give
                </Link>
                <Link 
                  href="/impact" 
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Impact
                </Link>
                <div className="border-t pt-2 mt-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start mb-2">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Redesigned with cleaner aesthetic */}
      <section 
        className="relative py-24 min-h-[80vh] flex items-center"
        style={{
          backgroundImage: "url('/backgrounds/about-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
              POWERED BY AI & BLOCKCHAIN
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Transforming Donations into <span className="text-blue-400">Impact</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
              Turn meaningful actions into direct support with transparency and accountability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs">
                <Button variant="outline" size="lg" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-black backdrop-blur-sm">
                  <Shield className="h-5 w-5 mr-2" />
                  Technical Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SHELTR Product Introduction - New Enhanced Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What is SHELTR?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We&apos;re a blockchain-powered platform that enables <strong>direct participant empowerment </strong> 
                through transparent donations and smart contracts.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-6 w-6 text-blue-600" />
                    Scan & Give Instantly
                  </CardTitle>
                  <CardDescription>
                    QR-powered donations with immediate impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    <strong>Participants</strong> receive donations via unique QR codes linked to their profiles. 
                    <strong> Donors</strong> scan and give instantly, with funds flowing directly to those who need them most.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-green-600" />
                    Blockchain Transparency
                  </CardTitle>
                  <CardDescription>
                    Every transaction visible and verified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Built on Base blockchain with smart contracts that automatically 
                    distribute funds according to our 80/15/5 model - complete transparency, zero hidden fees.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-purple-600" />
                    Community Angels
                  </CardTitle>
                  <CardDescription>
                    Partnering with social impact creators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Working with influential creators and community leaders to amplify impact 
                    and reach those who need support most effectively.
                  </p>
                </CardContent>
              </Card>
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
                How We Create Change
              </h2>
              <p className="text-xl text-gray-200">
                Our transparent SmartFund donation distribution model ensures maximum impact
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  80%
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Direct to Participants</h3>
                <p className="text-gray-200">
                  Deposited and immediately accessible to Participants. 
                  Zero volatility risk ensures purchasing power remains stable at $1.00 USD value. 
                  Participants maintain complete autonomy over spending decisions and essential purchases.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  15%
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Housing Allocation</h3>
                <p className="text-gray-200">
                  SmartFund contracts automatically direct 15% towards participants&apos; emergency housing goals like tiny homes. 
                  AI-optimized token staking compounds these funds over time. 
                  Each participant builds their housing fund through every donation received.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  5%
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Shelter Operations</h3>
                <p className="text-gray-200">
                  Covers the shelter&apos;s onboarding, participant training materials, audits, and continuous platform upgrades.  
                  Ensures 99.99% uptime through distributed cloud architecture and automated monitoring systems.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border-2 border-white/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-white">Transparency, Dignity, Accountability</h3>
                <p className="text-lg text-gray-200 mb-6">
                  Every transaction is recorded on the blockchain. Donors can track their impact in real-time, 
                  and participants maintain full control over their funds.
                </p>
                <div className="flex justify-center">
                  <Link href="/solutions">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Heart className="h-5 w-5 mr-2" />
                      Explore Solutions
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise-Grade Technology */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Enterprise-Grade Technology</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built on the world&apos;s most secure and scalable infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-lg">Blockchain Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Immutable transaction records and smart contract automation
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Database className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-lg">Real-Time Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Live tracking of donations, distributions, and impact metrics
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Smartphone className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-lg">Mobile-First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Native apps for iOS and Android with offline capabilities
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Globe className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-lg">Global Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Multi-region deployment with 99.9% uptime guarantee
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Technology Partners */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Powered By Industry Leaders</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Built on the world&apos;s most trusted and innovative technology platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                    className="h-12 w-auto max-w-full filter invert dark:invert-0"
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
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">A Path Forward</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our roadmap to transforming charitable giving across North America
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Badge className="mx-auto mb-4 bg-green-500/10 text-green-600 border-green-500/20">Phase 1</Badge>
                <CardTitle>Foundation & Pilot</CardTitle>
                <CardDescription>Local Market Entry</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• Platform development & testing</li>
                  <li>• Local shelter partnerships</li>
                  <li>• Community pilot programs</li>
                  <li>• User feedback integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Badge className="mx-auto mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">Phase 2</Badge>
                <CardTitle>Regional Expansion</CardTitle>
                <CardDescription>Network Scaling</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• National expansion</li>
                  <li>• Provincial government partnerships</li>
                  <li>• Mobile app launch</li>
                  <li>• Corporate sponsorship program</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Badge className="mx-auto mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">Phase 3</Badge>
                <CardTitle>Continental Impact</CardTitle>
                <CardDescription>North American Network</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• US market entry</li>
                  <li>• International partnerships</li>
                  <li>• AI-driven impact optimization</li>
                  <li>• Global replication framework</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}