'use client';

import Link from 'next/link';
import { CreditCard, TrendingUp, Shield, Building2, Users, CheckCircle, Eye, FileText, BookOpen, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import PublicNavigation from '@/components/PublicNavigation';

export default function TokenomicsPage() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation - Now using unified PublicNavigation component */}
      <PublicNavigation />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Enterprise Tokenomics</span>
        </div>
      </div>

      {/* Strategic Pivot Alert */}
      <section className="py-12 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-y border-amber-200 dark:border-amber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-amber-900 dark:text-amber-100">
                  Strategic Architecture Transformation
                </h3>
                <p className="text-amber-800 dark:text-amber-200 leading-relaxed mb-4">
                  October 1, 2025: Following expert peer-analysis by our collegues and payments specialists, SHELTR is evolving from 
                  a dual-token architecture to a <strong>Single Stable Token Investment Fund</strong> model.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">❌ Eliminated:</h4>
                    <ul className="space-y-1 text-amber-800 dark:text-amber-200">
                      <li>• ICO speculation and volatility risks</li>
                      <li>• Dual-token complexity</li>
                      <li>• Participant cryptocurrency exposure</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">✅ Implemented:</h4>
                    <ul className="space-y-1 text-amber-800 dark:text-amber-200">
                      <li>• Enterprise payment partnerships</li>
                      <li>• Guaranteed 4-6% APY returns</li>
                      <li>• Zero-risk participant protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-24 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/backgrounds/hero-bg.jpg)'}}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            TOKENOMICS v2.0
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            SHELTR <span className="text-emerald-400">SmartFund™</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
             Enterprise-grade token architecture combining <strong>virtual cards</strong>, <strong> institutional staking</strong>, and <strong> utility tracking</strong> for transparency stability and growth.
          </p>
        </div>
      </section>

      {/* Theory of Change Integration */}
      <section className="py-20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Payment Architecture</h2>
            <p className="text-xl text-muted-foreground">How our single-token model achieves 100% efficiency with zero participant risk</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2 border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-xl text-red-600 dark:text-red-400">❌ Traditional Token Architecture</CardTitle>
                <CardDescription>High-risk models with participant exposure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>20-80% volatility risk for vulnerable populations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>ICO speculation and regulatory uncertainty</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Complex dual-token architectures</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>DeFi speculation with participant funds</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-red-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">HIGH RISK</div>
                  <p className="text-sm text-red-600/70">Participant vulnerability to market volatility</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-500/20 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400">✅ SHELTR SmartFund™ Model</CardTitle>
                <CardDescription>Zero-risk architecture with guaranteed returns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Virtual cards for 80% participant allocation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Coinbase institutional staking (4-6% APY)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>SHELTR utility token for transparent tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Traditional funding model eliminates ICO risks</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">ZERO RISK</div>
                  <p className="text-sm text-emerald-600/70">Complete participant protection with guaranteed growth</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* New Payment Flow */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Payment Flow</h2>
            <p className="text-xl text-muted-foreground">Direct to virtual debit card with blockchain transparency</p>
          </div>

          <Card className="border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-6">
                {/* Step 1: Donation */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Credit Card Donation</h3>
                  <p className="text-sm text-muted-foreground">Donor uses credit card via global payment processing</p>
                  <div className="mt-3 p-2 bg-blue-500/10 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">$100</div>
                    <div className="text-xs text-muted-foreground">Example donation</div>
                  </div>
                </div>

                {/* Step 2: Smart Contract */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Smart Contract</h3>
                  <p className="text-sm text-muted-foreground">Automatic distribution triggered on Base network</p>
                  <div className="mt-3 space-y-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <div className="text-sm font-bold text-emerald-600">80% → Card</div>
                    </div>
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <div className="text-sm font-bold text-orange-600">15% → Housing</div>
                    </div>
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <div className="text-sm font-bold text-purple-600">5% → Operations</div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Participant Card */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Virtual Debit Card</h3>
                  <p className="text-sm text-muted-foreground">Instant virtual card loading for participant</p>
                  <div className="mt-3 p-2 bg-emerald-500/10 rounded-lg">
                    <div className="text-lg font-bold text-emerald-600">$80</div>
                    <div className="text-xs text-muted-foreground">Visa/Mastercard network</div>
                  </div>
                </div>

                {/* Step 4: Housing Fund */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">4. Housing Fund Growth</h3>
                  <p className="text-sm text-muted-foreground">Coinbase institutional staking with SHELTR tracking</p>
                  <div className="mt-3 p-2 bg-orange-500/10 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">$15</div>
                    <div className="text-xs text-muted-foreground">4-6% APY guaranteed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Single Token Architecture */}
      <section className="py-20 bg-gradient-to-r from-emerald-500/5 to-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Stablecoin Architecture</h2>
            <p className="text-xl text-muted-foreground">Utility token for transparent housing fund tracking</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
              <CardHeader>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <CardTitle className="text-3xl text-emerald-600 dark:text-emerald-400">SHELTR Stablecoin</CardTitle>
                    <CardDescription className="text-emerald-600/70 text-lg">Housing Fund Tracking Token</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-emerald-500/10 p-6 rounded-lg border border-emerald-500/20 text-center">
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">$1.00 USD</div>
                  <p className="text-emerald-600/70">1:1 USDT Peg via Coinbase Institutional Custody</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Core Purpose:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Housing fund allocation tracking</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Blockchain transparency for donors</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Growth measurement and reporting</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Participant housing fund balance</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Participant Protection:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Zero participant cryptocurrency exposure</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Internal tracking only - no participant interaction</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Traditional payment cards for 80% allocation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>No volatility risk or market exposure</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-500/20">
                  <h4 className="font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Technical Specifications:</h4>
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div className="bg-emerald-500/5 p-3 rounded-lg">
                      <div className="text-lg font-bold text-emerald-600">Base Network</div>
                      <div className="text-sm text-muted-foreground">Coinbase L2</div>
                    </div>
                    <div className="bg-emerald-500/5 p-3 rounded-lg">
                      <div className="text-lg font-bold text-emerald-600">ERC-20</div>
                      <div className="text-sm text-muted-foreground">Standard</div>
                    </div>
                    <div className="bg-emerald-500/5 p-3 rounded-lg">
                      <div className="text-lg font-bold text-emerald-600">1:1 USDT</div>
                      <div className="text-sm text-muted-foreground">Backing</div>
                    </div>
                    <div className="bg-emerald-500/5 p-3 rounded-lg">
                      <div className="text-lg font-bold text-emerald-600">4-6% APY</div>
                      <div className="text-sm text-muted-foreground">Guaranteed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise Partners */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Infrastructure Partners</h2>
            <p className="text-xl text-muted-foreground">Institutional-grade payment processing and custody services</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Adyen */}
            <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Payment-Rails</CardTitle>
                    <CardDescription className="text-blue-600/70">Global Payment Processing & Virtual Cards</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">80% Allocation</div>
                  <p className="text-sm text-blue-600/70">Direct to participant virtual debit cards</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Global credit card acceptance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Instant virtual card issuance (&lt;60 seconds)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>PCI DSS Level 1 compliance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Visa/Mastercard network access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Zero fees for participants</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coinbase */}
            <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">Coinbase Institutional</CardTitle>
                    <CardDescription className="text-orange-600/70">Custody & Staking Services</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">15% Housing Fund</div>
                  <p className="text-sm text-orange-600/70">Guaranteed 4-6% APY institutional staking*</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>SOC 2 Type II certified custody</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>FDIC protection available</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Daily liquidity access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Institutional-grade security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Real-time performance tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Documentation Links */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Documentation</h2>
            <p className="text-xl text-muted-foreground">
              Explore detailed architecture, implementation guides, and strategic analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <FileText className="h-8 w-8 mb-3 text-emerald-600" />
                <CardTitle>Payment Rail Architecture</CardTitle>
                <CardDescription>
                  Complete technical specification for Payment Processing + Coinbase integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/docs/payment-rails">
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Architecture
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <BookOpen className="h-8 w-8 mb-3 text-blue-600" />
                <CardTitle>Enterprise Whitepaper</CardTitle>
                <CardDescription>
                  Strategic overview of single-token stable fund model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/docs/whitepaper">
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Read Whitepaper
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <Shield className="h-8 w-8 mb-3 text-purple-600" />
                <CardTitle>Blockchain Implementation</CardTitle>
                <CardDescription>
                  SHELTR stablecoin smart contracts and Base network integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/docs/blockchain">
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Blockchain Docs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Transform Charitable Giving?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the enterprise-grade platform that protects participants while delivering guaranteed results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                <Users className="h-5 w-5 mr-2" />
                Get Started Today
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <FileText className="h-5 w-5 mr-2" />
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <PublicChatbot />
    </div>
  );
}