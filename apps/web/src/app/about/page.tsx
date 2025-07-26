'use client';

import Link from 'next/link';
import { 
  Home, 
  Heart, 
  Shield, 
  Users, 
  ArrowRight, 
  Github, 
  Twitter, 
  Mail, 
  Coins, 
  LogIn, 
  Menu, 
  X,
  Cloud,
  Zap,
  ShoppingCart,
  Building,
  Cpu,
  Database,
  QrCode,
  CreditCard,
  Bot,
  Layers,
  Network,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const techStack = [
    {
      category: "Cloud Infrastructure",
      icon: Cloud,
      color: "text-blue-600",
      description: "Google Cloud Platform with AI embeddings for intelligent donor-participant matching",
      technologies: ["Google Cloud AI", "Vector Embeddings", "Firebase", "Cloud Functions"]
    },
    {
      category: "Blockchain Layer",
      icon: Network,
      color: "text-purple-600", 
      description: "Base network integration with dual-token architecture",
      technologies: ["Base Network", "SHELTR-S Stable Token", "SHELTR Governance Token", "Smart Contracts"]
    },
    {
      category: "Payment Solutions",
      icon: CreditCard,
      color: "text-green-600",
      description: "Visa Intelligent Commerce for AI-powered transactions",
      technologies: ["Visa AI Commerce", "Tokenized Payments", "SmartFund Contract", "QR Code Payments"]
    },
    {
      category: "AI & Automation",
      icon: Bot,
      color: "text-amber-600",
      description: "Intelligent systems for impact measurement and resource allocation",
      technologies: ["AI Guidance", "Automated Distribution", "Impact Analytics", "Predictive Modeling"]
    }
  ];

  const partnerOrganizations = [
    {
      name: "Emergency Housing Providers",
      location: "Global Network",
      focus: "Mobile shelter solutions & temporary housing",
      impact: "Dignified alternatives to tent encampments and unsafe conditions",
      funding: "SmartFund allocation ready",
      url: "https://tinytinyhomes.ca/"
    },
    {
      name: "Base Protocol",
      location: "Global",
      focus: "Layer 2 blockchain infrastructure", 
      impact: "Low-cost, fast transactions (~$0.01 fees)",
      funding: "Strategic partnership",
      url: "https://www.coinbase.com/en-ca/price/base-protocol"
    },
    {
      name: "Visa Intelligent Commerce",
      location: "Global",
      focus: "AI-powered payment solutions",
      impact: "Seamless AI agent transactions for homeless services",
      funding: "Technology integration partner",
      url: "https://corporate.visa.com/en/products/intelligent-commerce.html"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
              <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">Docs</Link>
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
                  <Button>
                    Get Started
                  </Button>
                </Link>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
                <Link href="/" className="block px-3 py-2 text-muted-foreground hover:text-primary">Home</Link>
                <Link href="/about" className="block px-3 py-2 text-foreground hover:text-primary">About</Link>
                <Link href="/solutions" className="block px-3 py-2 text-muted-foreground hover:text-primary">Solutions</Link>
                <Link href="/scan-give" className="block px-3 py-2 text-muted-foreground hover:text-primary">Scan & Give</Link>
                <Link href="/impact" className="block px-3 py-2 text-muted-foreground hover:text-primary">Impact</Link>
                <Link href="/docs" className="block px-3 py-2 text-muted-foreground hover:text-primary">Docs</Link>
                <div className="border-t pt-3 mt-3">
                  <Link href="/login" className="block px-3 py-2 text-muted-foreground hover:text-primary">Sign In</Link>
                  <Link href="/register" className="block px-3 py-2 text-muted-foreground hover:text-primary">Get Started</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-amber-600 text-black">POWERED BY AI & BLOCKCHAIN</Badge>
            <h1 className="text-5xl font-bold mb-6">
              Funding <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Emergency Housing</span>
              <br />Through the Homeless Depot
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              SHELTR powers a revolutionary e-commerce ecosystem where every donation creates immediate impact. 
              We're funding emergency housing solutions and essential services while building the world's first 
              AI-powered marketplace for homeless support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tokenomics">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-black">
                  <Coins className="h-5 w-5 mr-2" />
                  View Tokenomics
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  <Shield className="h-5 w-5 mr-2" />
                  Technical Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The SHELTR Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The SHELTR Story</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From QR code donations to AI-powered marketplace: How we're revolutionizing charitable giving 
              and funding real solutions for emergency housing
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Inspiring Organizations</h3>
              <p className="text-muted-foreground mb-6">
                When we discovered <a href="https://tinytinyhomes.ca/" target="_blank" className="text-blue-600 hover:underline">Tiny Tiny Homes</a> in Toronto, 
                we saw the future of homelessness solutions. Their mobile emergency shelters replace unsafe tent encampments 
                with dignified, secure alternatives. Organizations like this inspire our vision for what's possible.
              </p>
              <p className="text-muted-foreground mb-6">
                SHELTR was born from this challenge: How do we ensure innovative emergency housing and essential service 
                providers get the funding they need, instantly and transparently?
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  💡 The Solution: SmartFund Contracts
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  15% of every donation automatically flows to housing solutions via blockchain smart contracts. 
                  Our system enables instant, transparent funding for emergency shelter and essential services.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    Traditional Funding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Grant applications take 6-18 months</li>
                    <li>• Success rates under 20%</li>
                    <li>• Restrictive reporting requirements</li>
                    <li>• Funding tied to bureaucratic approval</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    SHELTR SmartFund
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <li>• Instant funding via smart contracts</li>
                    <li>• 100% transparent allocation</li>
                    <li>• Impact-based distribution</li>
                    <li>• Community governance via SHELTR tokens</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Homeless Depot Concept */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Introducing the Homeless Depot</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The world's first AI-powered e-commerce marketplace for homeless services, 
              powered by Visa Intelligent Commerce and SHELTR's dual-token architecture
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-blue-600" />
                  Scan & Give
                </CardTitle>
                <CardDescription>Instant donations via QR codes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Participants receive QR codes linked to their SHELTR-S wallets. 
                  Donors scan and give instantly, with 80% going directly to participants 
                  as stable value, protected from crypto volatility.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  AI Shopping Assistant
                </CardTitle>
                <CardDescription>Visa Intelligent Commerce integration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI agents help participants purchase essentials through the Homeless Depot. 
                  Visa's intelligent commerce platform enables secure, personalized transactions 
                  with fraud protection and seamless checkout.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Dignity-First Marketplace
                </CardTitle>
                <CardDescription>E-commerce built for impact</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  From emergency housing to job training, the Homeless Depot connects participants 
                  with services that create lasting change. Every purchase tracked on-chain 
                  for complete transparency.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 max-w-3xl mx-auto">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                🛒 Coming Soon: Homeless Depot Beta
              </h3>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                Launching Q2 2025 with emergency housing providers and essential service organizations. 
                Participants will be able to browse, select, and purchase shelter solutions 
                directly through AI-powered recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Technology Stack</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Built on Google Cloud with AI embeddings, Base blockchain, and Visa Intelligent Commerce
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {techStack.map((tech, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <tech.icon className={`h-8 w-8 ${tech.color}`} />
                    <div>
                      <h3 className="text-xl">{tech.category}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{tech.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tech.technologies.map((technology, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Organizations */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Strategic Partners & Funded Organizations</h2>
            <p className="text-lg text-muted-foreground">
              Working with industry leaders and innovative nonprofits to create lasting impact
            </p>
          </div>

          <div className="space-y-6">
            {partnerOrganizations.map((partner, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{partner.name}</h3>
                        <Badge variant="outline">{partner.location}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{partner.focus}</p>
                      <p className="text-sm">{partner.impact}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600 mb-1">{partner.funding}</div>
                      <a 
                        href={partner.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Learn More →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Revolution</h2>
          <p className="text-xl mb-8 text-blue-100">
            Help us fund more organizations like Tiny Tiny Homes while building 
            the future of charitable technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/investor-relations">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Coins className="h-5 w-5 mr-2" />
                Invest in SHELTR
              </Button>
            </Link>
            <Link href="/scan-give">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Heart className="h-5 w-5 mr-2" />
                Start Giving
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 