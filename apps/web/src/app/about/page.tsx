'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn, Coins, Shield, Zap, QrCode, UserCheck, CreditCard, Database, Smartphone, Building2, Handshake, Globe, ArrowRight, Users, Heart, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/about" className="text-primary px-3 py-2 text-sm font-medium">
                  About
                </Link>
                <Link href="/solutions" className="hover:text-primary px-3 py-2 text-sm font-medium">
                  Solutions
                </Link>
                <Link href="/scan-give" className="hover:text-primary px-3 py-2 text-sm font-medium">
                  Scan & Give
                </Link>
                <Link href="/impact" className="hover:text-primary px-3 py-2 text-sm font-medium">
                  Impact
                </Link>
              </div>
            </div>

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
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
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
                <div className="px-3 py-2 space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
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
        className="relative py-20"
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
              Better to <span className="text-blue-400">Solve</span> than Manage
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
              An ecosystem where every donation creates immediate, transparent impact 
              through direct participant empowerment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
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
                A blockchain-powered platform that enables direct participant empowerment 
                through transparent donations and crypto wallets
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2 hover:shadow-lg transition-shadow">
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
                    Participants receive unique QR codes linked to their crypto wallets. 
                    Donors scan and give instantly, with funds flowing directly to those who need them most.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
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

              <Card className="border-2 hover:shadow-lg transition-shadow">
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How Donations Create Change
              </h2>
              <p className="text-xl text-muted-foreground">
                Our transparent 80/15/5 distribution model ensures maximum impact
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  80%
                </div>
                <h3 className="text-xl font-semibold mb-3">Direct to Participants</h3>
                <p className="text-muted-foreground">
                  Goes directly to participant crypto wallets as SHELTR-S stable tokens, 
                  providing immediate purchasing power for essentials.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  15%
                </div>
                <h3 className="text-xl font-semibold mb-3">SmartFund™ Distribution</h3>
                <p className="text-muted-foreground">
                  Automatically funds emergency housing providers and essential services 
                  through blockchain smart contracts.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  5%
                </div>
                <h3 className="text-xl font-semibold mb-3">Platform Operations</h3>
                <p className="text-muted-foreground">
                  Covers technology infrastructure, security, and platform development 
                  to ensure reliable service delivery.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-8 border-2">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Complete Transparency</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Every transaction is recorded on the blockchain. Donors can track their impact in real-time, 
                  and participants maintain full control over their funds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Target className="h-5 w-5 mr-2" />
                    Track Your Impact
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn About Blockchain
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Story Behind SHELTR - Enhanced */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Story Behind SHELTR</h2>
            <p className="text-xl text-muted-foreground">From concept to community-driven solution</p>
          </div>
          
          <div className="space-y-8">
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="text-lg leading-relaxed">
                SHELTR was born from a simple but powerful realization: <strong>&ldquo;It&rsquo;s better to solve than to manage.&rdquo;</strong> 
                This philosophy, inspired by Malcolm Gladwell&rsquo;s groundbreaking essay <em>&ldquo;Million-Dollar Murray&rdquo;</em> in The New Yorker, 
                became the foundation of our approach to addressing homelessness through technology.
              </p>
              
              <p className="text-lg leading-relaxed">
                Founder Joel Yaffe&rsquo;s journey into tech for good wasn&rsquo;t born in a boardroom—it emerged from witnessing 
                the disconnect between charitable intentions and measurable impact. Too often, well-meaning donations 
                disappeared into administrative overhead, leaving both donors frustrated and those in need still struggling.
              </p>
              
              <p className="text-lg leading-relaxed">
                SHELTR represents an attempt to join the brilliant collective of Community Angels doing transformative work—
                creators who use their platforms and influence to directly help those in need, proving that technology 
                and social media can be forces for genuine, lasting change.
              </p>
            </div>
            
            {/* Malcolm Gladwell Reference Card */}
            <div className="bg-card rounded-lg p-6 border-l-4 border-primary">
              <blockquote className="text-lg italic mb-4">
                &ldquo;It costs a lot more to manage a problem than it does to solve it.&rdquo;
              </blockquote>
              <cite className="text-sm text-muted-foreground">
                — Malcolm Gladwell, <a href="https://www.newyorker.com/magazine/2006/02/13/million-dollar-murray" 
                target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                &ldquo;Million-Dollar Murray,&rdquo; The New Yorker (2006)
                </a>
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Enterprise-Grade Technology
              </h2>
              <p className="text-xl text-muted-foreground">
                Built on Google Cloud with AI embeddings, Base blockchain, and modern web technologies
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-6 w-6 text-blue-600" />
                    Cloud Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Google Cloud Platform with AI embeddings for intelligent donor-participant matching
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">Google Cloud AI</span>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">Firebase</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-6 w-6 text-purple-600" />
                    Blockchain Layer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Base network integration with dual-token architecture
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded">Base Network</span>
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded">SHELTR Tokens</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-6 w-6 text-green-600" />
                    QR Code System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Secure QR codes for instant donations and participant identification
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">Encrypted QR</span>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">Instant Payments</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-orange-600" />
                    AI & Automation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Intelligent systems for impact measurement and resource allocation
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded">AI Analytics</span>
                    <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded">Smart Distribution</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>



      {/* Seamless Flow to Solutions - New CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
              Ready to See How It Works?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Discover our solutions for donors, participants, shelter organizations, and government agencies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/solutions">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-background text-foreground hover:bg-background/90">
                  <Heart className="h-5 w-5 mr-2" />
                  Explore Solutions
                </Button>
              </Link>
              <Link href="/scan-give">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Start Giving Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 