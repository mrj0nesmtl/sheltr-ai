'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, Download, CreditCard, Shield, TrendingUp, Building2, CheckCircle, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function PaymentRailsPage() {
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
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
              <Link href="/docs" className="text-foreground hover:text-primary transition-colors">Docs</Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Payment Rail Architecture</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl flex items-center justify-center">
                <CreditCard className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <Badge className="bg-emerald-600 text-white text-sm px-4 py-2">
                Enterprise Architecture v2.0
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Payment Rail Architecture
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Revolutionary single-token stable fund system with <strong>Adyen payment processing</strong> and <strong>Coinbase institutional staking</strong>, 
              providing zero-risk participant protection with guaranteed 4-6% APY returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/payment-rails/sheltr-unified-payment-architecture.md" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Github className="h-5 w-5 mr-2" />
                  View Full Document
                </Button>
              </a>
              <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/payment-rails/sheltr-unified-payment-architecture.md" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-2">
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Pivot Alert */}
      <section className="py-12 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-y border-amber-200 dark:border-amber-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-amber-900 dark:text-amber-100">
                  🚨 Strategic Architecture Pivot
                </h3>
                <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                  Following extensive analysis by our payments and blockchairn peers, SHELTR has pivoted from 
                  a dual-token architecture to a <strong>Single Stable Token Investment Fund</strong> model. This eliminates market 
                  volatility risks, reduces complexity, and provides guaranteed returns while maintaining complete blockchain transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center"> Payment Processing Summary</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl">Zero Risk Protection</CardTitle>
                  </div>
                  <CardDescription>
                    Participants receive traditional Adyen virtual debit cards with 80% of donations, 
                    eliminating cryptocurrency volatility exposure while maintaining global acceptance.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <CardTitle className="text-xl">Guaranteed Returns</CardTitle>
                  </div>
                  <CardDescription>
                    15% housing fund allocation generates 4-6% APY through Coinbase institutional staking, 
                    providing guaranteed growth without DeFi speculation risks.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 border-2">
              <CardHeader>
                <CardTitle className="text-2xl mb-4">Key Innovation</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  <strong>Direct credit card donations</strong> → <strong>Adyen payment rails</strong> → 
                  <strong>Smart contract distribution</strong> → <strong>80% participant debit cards</strong> + 
                  <strong>15% Base SHELTR Stablecoin pool</strong> generating <strong>4-6% APY</strong> + 
                  <strong>5% shelter operations</strong>.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture Components */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Architecture Components</h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Adyen Integration */}
              <Card className="border-2 hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Adyen Payment Processing</CardTitle>
                  <CardDescription>
                    Enterprise-grade global payment processing with virtual card issuance capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Global credit card acceptance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Instant virtual card issuance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      PCI DSS Level 1 compliance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Real-time fraud prevention
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Coinbase Staking */}
              <Card className="border-2 hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Coinbase Institutional</CardTitle>
                  <CardDescription>
                    Institutional-grade custody and staking services with guaranteed returns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      4-6% APY guaranteed returns
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      SOC 2 Type II certified
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      FDIC protection available
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Daily liquidity access
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* SHELTR Token */}
              <Card className="border-2 hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">SHELTR Stablecoin</CardTitle>
                  <CardDescription>
                    USDT-pegged utility token for transparent housing fund tracking only
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      1:1 USDT backing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Zero volatility risk
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Transparent fund tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      No participant exposure
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Strategic Benefits</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-600">❌ Problems Eliminated</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Market volatility risk for vulnerable populations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>ICO stigma and regulatory uncertainty</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Complex dual-token architecture</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Participant cryptocurrency exposure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Speculative DeFi investment risks</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-600">✅ Solutions Implemented</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Zero-risk traditional payment cards for participants</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Enterprise partnerships with proven infrastructure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Single-token stable architecture</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Complete blockchain transparency</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Guaranteed 4-6% APY institutional returns</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Target Audience</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Building2 className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">Stakeholers</h3>
                  <p className="text-sm text-muted-foreground">Financial leadership and strategic planning</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <CreditCard className="h-8 w-8 mx-auto mb-3 text-emerald-600" />
                  <h3 className="font-semibold mb-2">Payment Architects</h3>
                  <p className="text-sm text-muted-foreground">Enterprise payment system design</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold mb-2">Enterprise Partners</h3>
                  <p className="text-sm text-muted-foreground">Strategic partnership development</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <TrendingUp className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-semibold mb-2">Financial Teams</h3>
                  <p className="text-sm text-muted-foreground">Investment and risk management</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Document Meta */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Document Information</h4>
                <ul className="space-y-1">
                  <li><strong>Version:</strong> 2.0.0</li>
                  <li><strong>Last Updated:</strong> September 26, 2025</li>
                  <li><strong>Status:</strong> Strategic Architecture Review</li>
                  <li><strong>Lead Architect:</strong> Doug Kukura, CFO & Payments Expert</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Key Topics Covered</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Adyen Integration</Badge>
                  <Badge variant="outline" className="text-xs">Coinbase Staking</Badge>
                  <Badge variant="outline" className="text-xs">Single-Token Model</Badge>
                  <Badge variant="outline" className="text-xs">Enterprise Infrastructure</Badge>
                  <Badge variant="outline" className="text-xs">Guaranteed Returns</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
