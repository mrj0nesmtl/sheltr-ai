'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  Building2, 
  CreditCard, 
  Shield, 
  Zap, 
  Users, 
  Database, 
  Cloud, 
  Smartphone,
  ExternalLink,
  Github,
  FileText,
  Coins,
  TrendingUp,
  Lock,
  Globe,
  Home,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import Mermaid from '@/components/Mermaid';

// Component that uses useSearchParams (wrapped in Suspense)
function SystemDesignContent() {
  const searchParams = useSearchParams();
  const [isEmbedded, setIsEmbedded] = useState(false);
  
  // Check if embedded in iframe
  useEffect(() => {
    setIsEmbedded(searchParams.get('embed') === 'true');
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header - Hide when embedded */}
      {!isEmbedded && (
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/docs" className="flex items-center space-x-3">
              <ThemeLogo />
              <div>
                <h1 className="text-xl font-bold">System Design Architecture</h1>
                <p className="text-sm text-muted-foreground">Enterprise Donation Infrastructure</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                v3.0.0 - Shelter Ledger + RAG System
              </Badge>
              <Badge variant="outline" className="text-xs">
                Updated: December 12, 2025
              </Badge>
            </div>
          </div>
        </div>
      </header>
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="hover:bg-muted p-1 h-auto"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4" />
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="hover:bg-muted px-2 py-1 h-auto"
            >
              <Link href="/docs">
                Documentation
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">
              System Design Architecture
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <Badge className="bg-blue-600 text-white px-4 py-1">SYSTEM ARCHITECTURE</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Multi-Tenant Cloud Architecture
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Enterprise donation infrastructure with Shelter Ledger public accountability system, 
              dual-purpose SHELTR utility token for track & trace transparency, 
              zero cryptocurrency exposure for participants, and guaranteed institutional returns
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <a 
                  href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/platform/system-design.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  View Full Technical Document
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-blue-600">80%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Virtual Debit Cards</p>
                <p className="text-xs text-muted-foreground mt-1">Zero Crypto Exposure</p>
              </CardContent>
            </Card>
            <Card className="text-center border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-3">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-purple-600">15%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Housing Fund</p>
                <p className="text-xs text-muted-foreground mt-1">4-6% Guaranteed APY</p>
              </CardContent>
            </Card>
            <Card className="text-center border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-3">
                <Zap className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-emerald-600">5%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Platform Operations</p>
                <p className="text-xs text-muted-foreground mt-1">Sustainable Revenue</p>
              </CardContent>
            </Card>
            <Card className="text-center border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-orange-600">0%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Crypto Risk</p>
                <p className="text-xs text-muted-foreground mt-1">Enterprise Safety</p>
              </CardContent>
            </Card>
          </div>

          {/* Dual-Purpose Platform Mission */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dual-Purpose Platform: Four Integrated Pillars
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                SHELTR revolutionizes homeless services through a comprehensive ecosystem combining fundraising, shelter management, physical infrastructure, and financial services
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Globe className="h-5 w-5" />
                    1. Crowdfunding & Donation Platform
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-3">
                    Enterprise-grade fundraising infrastructure enabling direct donations to participants via QR codes, with instant virtual card loading and complete Shelter Ledger transparency.
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Real-time blockchain donation tracking</li>
                    <li>• Instant QR-Scan virtual card loading</li>
                    <li>• Zero cryptocurrency exposure for participants</li>
                    <li>• 100% donation efficiency with SmartFund™</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Database className="h-5 w-5" />
                    2. HMIS-Compliant Shelter Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-3">
                    Full-featured Homeless Management Information System (HMIS) providing comprehensive tools for participant intake, case management, and regulatory compliance.
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Complete participant intake & case management</li>
                    <li>• Service coordination & bed management</li>
                    <li>• Multi-tenant data isolation & security</li>
                    <li>• HMIS regulatory compliance reporting</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-600">
                    <Building2 className="h-5 w-5" />
                    3. POD Deployment & Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-3">
                    QR-Scan-to-POD ecosystem transforming digital donations into tangible housing solutions with complete Shelter Ledger public accountability.
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• POD Model A modular housing deployment</li>
                    <li>• Basecamp community infrastructure</li>
                    <li>• 15% SmartFund™ housing allocation</li>
                    <li>• Future drone delivery network (2027)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <CreditCard className="h-5 w-5" />
                    4. Digital Banking & Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-3">
                    Zero-risk financial services through Adyen virtual cards, guaranteed housing fund growth, and automated SmartFund™ distribution.
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 80% Adyen virtual debit cards (zero crypto)</li>
                    <li>• 15% housing fund (4-6% guaranteed APY)</li>
                    <li>• 5% shelter operations support</li>
                    <li>• Enterprise payment infrastructure (Adyen + Base)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="overview">System Overview</TabsTrigger>
              <TabsTrigger value="payment-flow">Payment Flow</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
            </TabsList>

            {/* System Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Enterprise System Overview</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  SHELTR combines Next.js 15 frontend with Firebase backend, revolutionary Shelter Ledger public accountability system, 
                  complete RAG Knowledge Base with AI embeddings, enterprise payment processing (Adyen), 
                  and Base network blockchain integration with dual-purpose SHELTR utility token for track & trace transparency. 
                  Now with 56% cost optimization and hybrid secure portal architecture.
                </p>
              </div>

              {/* High-Level System Diagram */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    High-Level System Architecture
                  </CardTitle>
                  <CardDescription>
                    Complete system integration with enterprise payment processing and blockchain transparency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 overflow-x-auto">
                    <Mermaid 
                      key="system-overview-diagram"
                      chart={`graph TD
    A[Next.js 15 Website<br/>Shadcn UI + Dark Theme] -->|Firebase SDK| B[Firebase Backend<br/>Auth + Firestore]
    C[Mobile App<br/>Future: React Native] -->|Same Firebase SDK| B
    
    A -->|QR Donations| D[Adyen Payment Processing<br/>Enterprise Credit Card Gateway]
    D -->|Secure Payment| E[SHELTR Main Account<br/>Traditional Banking]
    E -->|SmartFund Distribution| F[80/15/5 Allocation<br/>Auto-executed]
    
    F -->|80%| G[Virtual Debit Cards<br/>Participant Access - Zero Crypto]
    F -->|15%| H[Coinbase Base Network<br/>SHELTR Utility Token + Shelter Ledger]
    F -->|5%| I[Platform Operations<br/>Sustainable Revenue]
    
    H -->|USDT Backing| J[Institutional Staking<br/>4-6% Guaranteed APY]
    H -->|Track & Trace| K[Shelter Ledger Transparency<br/>Immutable Public Records]
    
    B -->|User Management| L[Four Stakeholder Types<br/>Orgs/Gov/Participants/Donors]
    B -->|Real-time Data| M[Impact Analytics<br/>Blockchain + Traditional Verified]
    
    N[Adyen Virtual Cards<br/>Zero Crypto Exposure] -->|Direct Loading| G
    O[Coinbase Prime<br/>Institutional Custody] -->|Secure Staking| J
    P[Base Network<br/>L2 Optimization] -->|Low-Cost Tracking| K

    style A fill:#3b82f6,stroke:#2563eb,stroke-width:3px
    style D fill:#10b981,stroke:#059669,stroke-width:3px
    style H fill:#8b5cf6,stroke:#7c3aed,stroke-width:3px
    style B fill:#06b6d4,stroke:#0891b2,stroke-width:3px
    style F fill:#f43f5e,stroke:#e11d48,stroke-width:3px
    style G fill:#f97316,stroke:#ea580c,stroke-width:3px`}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <Badge variant="outline" className="text-xs">
                      Interactive Mermaid Diagram - Fully Rendered
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Core Design Principles */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      Zero-Risk Architecture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm">Virtual debit cards for participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm">No cryptocurrency exposure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm">Enterprise payment processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm">Guaranteed 4-6% APY returns</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      Multi-Tenant SaaS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Infinite shelter scalability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Tenant-isolated data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Role-based access control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Global deployment ready</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payment Flow Tab */}
            <TabsContent value="payment-flow" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Enterprise Payment Flow</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Revolutionary SmartFund™ distribution with Shelter Ledger track & trace, 
                  combining traditional payment stability with complete blockchain transparency, 
                  immutable public records, and guaranteed returns.
                </p>
              </div>

              {/* SmartFund Distribution Diagram */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    SmartFund™ Distribution Flow (80/15/5)
                  </CardTitle>
                  <CardDescription>
                    Every donation automatically distributed through enterprise payment infrastructure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 overflow-x-auto">
                    <Mermaid 
                      key="payment-flow-diagram"
                      chart={`graph LR
    A[Donor Credit Card<br/>💳 Adyen Processing] --> B[SHELTR Main Account<br/>🏦 Traditional Banking]
    
    B --> C[SmartFund Distribution<br/>⚡ 80/15/5 Split]
    
    C -->|80%| D[Virtual Debit Cards<br/>💳 Participant Access<br/>🚫 Zero Crypto Risk]
    C -->|15%| E[Housing Fund<br/>🏠 SHELTR Utility Token<br/>📈 4-6% Guaranteed APY]
    C -->|5%| F[Platform Operations<br/>⚙️ Sustainable Revenue]
    
    E --> G[Shelter Ledger<br/>📖 Track & Trace Every Dollar]
    E --> H[Coinbase Base Network<br/>⛓️ Immutable Public Records]
    E --> I[USDT Backing<br/>💰 Institutional Staking]
    
    G --> J[Donation Transparency<br/>📊 Real-time Public Access]
    H --> K[Blockchain Verification<br/>🔒 Permanent Audit Trail]
    I --> L[Guaranteed Returns<br/>💹 Coinbase Prime Custody]
    
    D --> K[Retail Purchases<br/>🛒 Visa/Mastercard Networks]
    
    style A fill:#4ade80,stroke:#22c55e,stroke-width:2px
    style D fill:#fbbf24,stroke:#f59e0b,stroke-width:2px
    style E fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px
    style F fill:#06b6d4,stroke:#0891b2,stroke-width:2px`}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <Badge variant="outline" className="text-xs">
                      Interactive Payment Flow Diagram - Fully Rendered
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Processing Steps */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">1</span>
                        </div>
                        <CardTitle className="text-lg">Payment Processing</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <span>Donor uses credit card</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>Adyen enterprise processing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span>PCI DSS Level 1 compliance</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-sm">2</span>
                        </div>
                        <CardTitle className="text-lg">SmartFund Distribution</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span>Automated 80/15/5 split</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                        <span>Virtual card loading</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span>Housing fund deposit</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">3</span>
                        </div>
                        <CardTitle className="text-lg">Blockchain Tracking</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Base network transparency</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-blue-600" />
                        <span>USDT-backed stablecoin</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>Guaranteed APY tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Technical Architecture</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Modern, scalable architecture built on Next.js 15, Firebase, and enterprise-grade integrations.
                </p>
              </div>

              {/* Technology Stack */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                  <CardHeader>
                    <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Frontend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>Next.js 15.4.3</li>
                      <li>TypeScript 5.0</li>
                      <li>Tailwind CSS</li>
                      <li>Shadcn UI</li>
                      <li>Dark Theme</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <Database className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Backend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>Firebase Auth</li>
                      <li>Firestore Database</li>
                      <li>Firebase Storage</li>
                      <li>Firebase Functions</li>
                      <li>Custom Claims RBAC</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>Adyen Processing</li>
                      <li>Virtual Debit Cards</li>
                      <li>PCI DSS Compliance</li>
                      <li>Global Payment Rails</li>
                      <li>Real-time Settlement</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <Shield className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Blockchain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>Base Network (L2)</li>
                      <li>USDT Backing</li>
                      <li>Coinbase Prime</li>
                      <li>Smart Contracts</li>
                      <li>Institutional Staking</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Multi-Tenant Architecture */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Multi-Tenant Data Architecture
                  </CardTitle>
                  <CardDescription>
                    Scalable tenant isolation with infinite shelter support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 overflow-x-auto">
                    <pre className="text-xs font-mono">
{`Firebase Project: sheltr-ai-production
├── tenants/                        # Each shelter = individual tenant
│   ├── old-brewery-mission/        # Tenant 1 (Montreal Shelter)
│   │   ├── settings/
│   │   │   ├── shelter_profile/     # Name, address, capacity, FREE subscription
│   │   │   ├── admin_config/        # Shelter admin settings
│   │   │   └── platform_config/     # Free platform features enabled
│   │   ├── participants/            # Shelter-specific participants
│   │   ├── staff/                   # Shelter employees & volunteers
│   │   ├── services/                # Shelter-specific services
│   │   ├── donations/               # Donations TO this shelter
│   │   ├── resources/               # Shelter resources & inventory
│   │   ├── analytics/               # Shelter-specific metrics
│   │   └── qr_codes/               # QR codes for this shelter
│   │
│   ├── [any-new-shelter]/          # Infinite scalability
│   │   └── (same structure)
│   │
│   └── [global-expansion]/         # Toronto, Vancouver, NYC, etc.
│       └── (same structure)
│
├── global/                         # Cross-tenant platform data
│   ├── platform_admin/             # SHELTR platform management
│   ├── smartfund/                  # Global SmartFund pool
│   ├── cross_shelter_donations/    # Donations spanning shelters
│   ├── shared_services/            # Platform services
│   └── blockchain/                 # Token & blockchain data
│
└── legacy/                         # Legacy collections (to be cleaned up)`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blockchain Tab */}
            <TabsContent value="blockchain" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Blockchain Integration</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Base network integration for housing fund transparency with enterprise-grade security and guaranteed returns.
                </p>
              </div>

              {/* Base Network Features */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Base Network Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Coinbase Prime institutional custody</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Sub-cent transaction costs (~$0.01)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">2-second block finality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Enterprise compliance & security</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-purple-600" />
                      SHELTR Utility Token (Dual-Purpose)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-semibold">Primary: Track & Trace transparency</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Immutable donation records</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-semibold">Secondary: SmartFund™ investment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">USDT-backed with 4-6% APY</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Smart Contract Architecture */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Smart Contract Architecture
                  </CardTitle>
                  <CardDescription>
                    Enterprise-grade smart contracts for payment distribution and housing fund management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 overflow-x-auto">
                    <pre className="text-xs font-mono">
{`// SHELTR Utility Token - Dual-Purpose Architecture
// Primary: Shelter Ledger Track & Trace | Secondary: SmartFund™ Investment
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SHELTRUtilityToken is ERC20, AccessControl, ReentrancyGuard {
    bytes32 public constant FUND_MANAGER_ROLE = keccak256("FUND_MANAGER_ROLE");
    
    IERC20 public immutable USDT;
    uint256 public totalHousingFund;
    uint256 public guaranteedAPY = 500; // 5.00% (basis points)
    
    // Shelter Ledger: Track & Trace mappings
    mapping(address => uint256) public participantAllocations;
    mapping(address => uint256) public totalDonationsReceived;
    mapping(address => Transaction[]) public transactionHistory;
    mapping(string => DonationRecord) public donationLedger;
    
    struct Transaction {
        uint256 amount;
        uint256 timestamp;
        TransactionType txType;
        string donationId;
        bool isPublic;
    }
    
    struct DonationRecord {
        address donor;
        address participant;
        uint256 totalAmount;
        uint256 timestamp;
        bool verified;
    }
    
    enum TransactionType {
        DONATION_RECEIVED,
        HOUSING_FUND_DEPOSIT,
        VIRTUAL_CARD_LOAD,
        INTEREST_ACCRUED
    }
    
    constructor(address _usdt) ERC20("SHELTR Utility Token", "SHELTR") {
        USDT = IERC20(_usdt);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    // PRIMARY PURPOSE: Track donation in Shelter Ledger
    function trackDonation(
        string memory donationId,
        address donor,
        address participant,
        uint256 amount
    ) external onlyRole(FUND_MANAGER_ROLE) nonReentrant {
        donationLedger[donationId] = DonationRecord({
            donor: donor,
            participant: participant,
            totalAmount: amount,
            timestamp: block.timestamp,
            verified: true
        });
        
        totalDonationsReceived[participant] += amount;
        
        emit DonationTracked(donationId, participant, amount);
    }
    
    // SECONDARY PURPOSE: Deposit to housing fund with guaranteed APY
    function depositHousingFund(
        address participant, 
        uint256 amount,
        string memory donationId
    ) external onlyRole(FUND_MANAGER_ROLE) nonReentrant {
        require(USDT.balanceOf(address(this)) >= amount, "Insufficient USDT");
        
        participantAllocations[participant] += amount;
        totalHousingFund += amount;
        
        _mint(address(this), amount); // Mint for tracking
        
        // Record in Shelter Ledger
        transactionHistory[participant].push(Transaction({
            amount: amount,
            timestamp: block.timestamp,
            txType: TransactionType.HOUSING_FUND_DEPOSIT,
            donationId: donationId,
            isPublic: true
        }));
        
        emit HousingFundDeposit(participant, amount, donationId);
    }
    
    // Public verification function (Shelter Ledger)
    function verifyDonation(string memory donationId) 
        external view returns (bool) {
        return donationLedger[donationId].verified;
    }
    
    event DonationTracked(string indexed donationId, address participant, uint256 amount);
    event HousingFundDeposit(address indexed participant, uint256 amount, string donationId);
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deployment Tab */}
            <TabsContent value="deployment" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Deployment Architecture</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Production-ready deployment with Firebase hosting, global CDN, and enterprise integrations.
                </p>
              </div>

              {/* Current Production Environment */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    Current Production Environment
                  </CardTitle>
                  <CardDescription>
                    Live at https://sheltr-ai.web.app with complete authentication system operational
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">✅ Implemented & Live</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Complete website with stakeholder pages</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Firebase authentication & RBAC</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Role-based dashboards</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Complete RAG Knowledge Base (62+ GitHub docs, 13 secure docs)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Founders Portal with hybrid dynamic/static system</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Public Documentation Hub with GitHub sync</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>GCP Cost Optimization (56% reduction, $54/mo savings)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Donation system with QR codes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Blog & gallery management systems</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>AI chatbot with RAG integration</span>
                      </li>
                    </ul>
                  </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-600">🔵 Planned Integrations</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Adyen payment processing</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Virtual debit card system</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Base network smart contracts</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Coinbase Prime integration</span>
                        </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>SHELTR Utility Token + Shelter Ledger deployment</span>
                      </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Mobile React Native app</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Implementation Timeline */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-600">Q4 2025 ✅</CardTitle>
                    <CardDescription>RAG & Cost Optimization - COMPLETE</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>✅ Complete RAG Knowledge Base</li>
                      <li>✅ Founders Portal (hybrid system)</li>
                      <li>✅ Public Documentation Hub</li>
                      <li>✅ 56% GCP cost reduction</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Q1 2026</CardTitle>
                    <CardDescription>Blockchain & Payment Rails</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Deploy SHELTR Utility Token + Shelter Ledger</li>
                      <li>• Implement track & trace public API</li>
                      <li>• Set up Coinbase Prime custody</li>
                      <li>• Adyen payment processing</li>
                      <li>• Virtual debit card system</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="text-purple-600">Q2 2026</CardTitle>
                    <CardDescription>Mobile & Scale</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• React Native mobile app</li>
                      <li>• QR code scanning</li>
                      <li>• Push notifications</li>
                      <li>• Global shelter onboarding</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore the Technical Details?</h2>
          <p className="text-xl mb-8 opacity-90">
            Dive deeper into our comprehensive system design documentation with complete technical specifications, 
            code examples, and implementation guides.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a 
                href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/platform/system-design.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View Full Technical Document
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/docs" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Explore More Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Hide when embedded */}
      {!isEmbedded && <Footer />}
    </div>
  );
}

// Main page component with Suspense boundary
export default function SystemDesignPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SystemDesignContent />
    </Suspense>
  );
}
