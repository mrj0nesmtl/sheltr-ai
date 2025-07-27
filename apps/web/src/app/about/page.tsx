'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn, Coins, Shield, Zap, QrCode, UserCheck, CreditCard, Database, Smartphone, Building2, Handshake, Globe, ArrowRight } from 'lucide-react';
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

      {/* Hero Section */}
      <section 
        className="relative py-20 bg-gradient-to-r from-purple-600 to-blue-600"
        style={{
          backgroundImage: "url('/backgrounds/about-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-purple-900/60"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              POWERED BY AI & BLOCKCHAIN
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Funding <span className="text-orange-400">Emergency Housing</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
              SHELTR powers a revolutionary e-commerce ecosystem where every donation creates 
              immediate impact. We're funding emergency housing solutions and essential services 
              while building the world's first AI-powered marketplace for homeless support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tokenomics">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Coins className="h-5 w-5 mr-2" />
                  View Tokenomics
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <Shield className="h-5 w-5 mr-2" />
                  Technical Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The SHELTR Story */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">The SHELTR Story</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              From QR code donations to AI-powered marketplace: How we're revolutionizing charitable giving and funding real solutions for emergency housing
            </p>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                Inspiring Organizations
              </h3>
              <p className="text-lg leading-relaxed mb-6">
                When we discovered Tiny Tiny Homes in Toronto, we saw the future of homelessness solutions. 
                Their mobile emergency shelters replace unsafe tent encampments with dignified, secure alternatives. 
                Organizations like this inspire our vision for what's possible.
              </p>
              <p className="text-lg leading-relaxed mb-8">
                SHELTR was born from this challenge: How do we ensure innovative emergency housing and essential 
                service providers get the funding they need, instantly and transparently?
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8 mb-12">
                <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  💡 The Solution: SmartFund Contracts
                </h4>
                <p className="text-lg mb-6">
                  15% of every donation automatically flows to housing solutions via blockchain smart contracts. 
                  Our system enables instant, transparent funding for emergency shelter and essential services.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-semibold text-red-600 mb-3">Traditional Funding</h5>
                    <ul className="space-y-2">
                      <li>• Grant applications take 6-18 months</li>
                      <li>• Success rates under 20%</li>
                      <li>• Restrictive reporting requirements</li>
                      <li>• Funding tied to bureaucratic approval</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-600 mb-3">SHELTR SmartFund</h5>
                    <ul className="space-y-2">
                      <li>• Instant funding via smart contracts</li>
                      <li>• 100% transparent allocation</li>
                      <li>• Impact-based distribution</li>
                      <li>• Community governance via SHELTR tokens</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Homeless Depot Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Introducing the Homeless Depot
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The world's first AI-powered e-commerce marketplace for homeless services, 
                powered by Visa Intelligent Commerce and SHELTR's dual-token architecture
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <QrCode className="h-6 w-6 text-blue-400" />
                    Scan & Give
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Instant donations via QR codes
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p>
                    Participants receive QR codes linked to their SHELTR-S wallets. Donors scan and give instantly, 
                    with 80% going directly to participants as stable value, protected from crypto volatility.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-green-400" />
                    AI Shopping Assistant
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Visa Intelligent Commerce integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p>
                    AI agents help participants purchase essentials through the Homeless Depot. 
                    Visa's intelligent commerce platform enables secure, personalized transactions 
                    with fraud protection and seamless checkout.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <UserCheck className="h-6 w-6 text-purple-400" />
                    Dignity-First Marketplace
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    E-commerce built for impact
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p>
                    From emergency housing to job training, the Homeless Depot connects participants 
                    with services that create lasting change. Every purchase tracked on-chain for complete transparency.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                🛒 Coming Soon: Homeless Depot Beta
              </h3>
              <p className="text-orange-100 text-lg">
                Launching Q2 2025 with emergency housing providers and essential service organizations. 
                Participants will be able to browse, select, and purchase shelter solutions directly 
                through AI-powered recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Enterprise-Grade Technology Stack
              </h2>
              <p className="text-xl text-muted-foreground">
                Built on Google Cloud with AI embeddings, Base blockchain, and Visa Intelligent Commerce
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
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
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Google Cloud AI</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Vector Embeddings</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Firebase</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Cloud Functions</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
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
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Base Network</span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">SHELTR-S Stable Token</span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">SHELTR Governance Token</span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Smart Contracts</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-green-600" />
                    Payment Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Visa Intelligent Commerce for AI-powered transactions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Visa AI Commerce</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Tokenized Payments</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">SmartFund Contract</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">QR Code Payments</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
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
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">AI Guidance</span>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Automated Distribution</span>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Impact Analytics</span>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Predictive Modeling</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Partners */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Strategic Partners & Funded Organizations
              </h2>
              <p className="text-xl text-gray-300">
                Working with industry leaders and innovative nonprofits to create lasting impact
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-blue-400" />
                    Emergency Housing Providers
                  </CardTitle>
                  <CardDescription className="text-blue-400">Global Network</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <ul className="space-y-2">
                    <li>Mobile shelter solutions & temporary housing</li>
                    <li>Dignified alternatives to tent encampments and unsafe conditions</li>
                    <li>SmartFund allocation ready</li>
                  </ul>
                  <Button variant="outline" className="mt-4 text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white">
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-6 w-6 text-purple-400" />
                    Base Protocol
                  </CardTitle>
                  <CardDescription className="text-purple-400">Global</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <ul className="space-y-2">
                    <li>Layer 2 blockchain infrastructure</li>
                    <li>Low-cost, fast transactions (~$0.01 fees)</li>
                    <li>Strategic partnership</li>
                  </ul>
                  <Button variant="outline" className="mt-4 text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white">
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Handshake className="h-6 w-6 text-green-400" />
                    Visa Intelligent Commerce
                  </CardTitle>
                  <CardDescription className="text-green-400">Global</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <ul className="space-y-2">
                    <li>AI-powered payment solutions</li>
                    <li>Seamless AI agent transactions for homeless services</li>
                    <li>Technology integration partner</li>
                  </ul>
                  <Button variant="outline" className="mt-4 text-green-400 border-green-400 hover:bg-green-400 hover:text-white">
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join the Revolution
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Help us fund more organizations like Tiny Tiny Homes while building the future of charitable technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/investor-relations">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Invest in SHELTR
                </Button>
              </Link>
              <Link href="/scan-give">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                  Start Giving
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