'use client';

import Link from 'next/link';
import { ArrowLeft, Coins, TrendingUp, Shield, Zap, DollarSign, Users, BarChart3, CheckCircle, ExternalLink, Copy, Eye, LogIn, Menu, X, FileText, BookOpen, Rocket, Target, PieChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';

export default function TokenomicsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
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
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b">
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors py-2">Home</Link>
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors py-2">About</Link>
              <Link href="/solutions" className="block text-muted-foreground hover:text-primary transition-colors py-2">Solutions</Link>
              <Link href="/scan-give" className="block text-muted-foreground hover:text-primary transition-colors py-2">Scan & Give</Link>
              <Link href="/tokenomics" className="block text-foreground hover:text-primary transition-colors py-2">Tokenomics</Link>
              <Link href="/impact" className="block text-muted-foreground hover:text-primary transition-colors py-2">Impact</Link>
              <div className="border-t pt-4 space-y-3">
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Tokenomics</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coins className="h-10 w-10 text-white" />
          </div>
          <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">$SHLTR Tokenomics</Badge>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SmartFund™ Tokenomics
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Sheltr's pioneering dual-token architecture combines both stability and growth potential for Participants and the Community. 
            Built on Base network with enterprise-grade infrastructure for seamless real-world utility.
          </p>
          
          {/* Quick Links to Documentation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/docs/whitepaper">
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Whitepaper
              </Button>
            </Link>
            <Link href="/docs" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <BookOpen className="h-4 w-4 mr-2" />
                Thesis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Theory of Change Integration */}
      <section className="py-20 bg-gradient-to-r from-green-500/5 to-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Theory of Change: From Crisis to Solutions</h2>
            <p className="text-xl text-muted-foreground">How dual-token architecture transforms charitable giving efficiency from 60% to 95%</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2 border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-xl text-red-600 dark:text-red-400">❌ Traditional Charitable Model</CardTitle>
                <CardDescription>Broken systems with multiple inefficiencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>30-40% overhead costs consume donations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>24-72 hour delays for assistance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Opaque processes prevent impact verification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Multiple intermediaries create friction</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-red-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">60-70%</div>
                  <p className="text-sm text-red-600/70">Actual efficiency rate</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-xl text-green-600 dark:text-green-400">✅ SHELTR Model</CardTitle>
                <CardDescription>Revolutionary blockchain-verified transparency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Direct P2P donations via QR codes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>&lt;1 hour support delivery time</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>100% blockchain transparency</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Smart contract automated distribution</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">95%</div>
                  <p className="text-sm text-green-600/70">Revolutionary efficiency rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Token Architecture Chart */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dual-Token Architecture</h2>
            <p className="text-xl text-muted-foreground">Two tokens, one mission: stability and growth for Participants and Community</p>
          </div>

          {/* Interactive Token Comparison Chart */}
          <Card className="mb-12 border-2">
            <CardHeader>
              <CardTitle className="text-center">Architecture Overview</CardTitle>
              <CardDescription className="text-center">Complete breakdown of SHELTR&apos;s revolutionary dual-token system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* SmartFund Distribution */}
                <div className="text-center">
                  <h3 className="font-semibold mb-4">SmartFund™ Distribution</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">80%</div>
                      <div className="text-sm">→ SHELTR-S Tokens</div>
                      <div className="text-xs text-muted-foreground">Direct participant suppor</div>
                    </div>
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">15%</div>
                      <div className="text-sm">→ Housing Fund</div>
                      <div className="text-xs text-muted-foreground">Long-term solutions</div>
                    </div>
                    <div className="bg-purple-500/10 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">5%</div>
                      <div className="text-sm">→ Shelter Operations</div>
                      <div className="text-xs text-muted-foreground">Platform sustainability</div>
                    </div>
                  </div>
                </div>

                {/* Token Supply Chart */}
                <div className="text-center">
                  <h3 className="font-semibold mb-4">Token Supply & Economics</h3>
                  <div className="space-y-3">
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <div className="text-lg font-bold text-green-600">SHELTR-S</div>
                      <div className="text-sm">Unlimited Supply</div>
                      <div className="text-xs text-muted-foreground">USDC 1:1 backing</div>
                    </div>
                    <div className="bg-purple-500/10 p-3 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">$SHELTR</div>
                      <div className="text-sm">100M Fixed Supply</div>
                      <div className="text-xs text-muted-foreground">Deflationary mechanics</div>
                    </div>
                    <div className="bg-orange-500/10 p-3 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">Participant Welcome</div>
                      <div className="text-sm">100 $SHELTR</div>
                      <div className="text-xs text-muted-foreground">Per new participant</div>
                    </div>
                  </div>
                </div>

                {/* Network Specifications */}
                <div className="text-center">
                  <h3 className="font-semibold mb-4">Network & Fees</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 p-3 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">Base Network</div>
                      <div className="text-sm">Coinbase L2</div>
                      <div className="text-xs text-muted-foreground">Enterprise compliance</div>
                    </div>
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <div className="text-lg font-bold text-green-600">~$0.01</div>
                      <div className="text-sm">Transaction Fees</div>
                      <div className="text-xs text-muted-foreground">Free for participants</div>
                    </div>
                    <div className="bg-purple-500/10 p-3 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">~2 seconds</div>
                      <div className="text-sm">Transaction Speed</div>
                      <div className="text-xs text-muted-foreground">Near-instant confirmations</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* SHELTR-S (Stable) */}
            <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-green-600 dark:text-green-400">SHELTR-S</CardTitle>
                    <CardDescription className="text-green-600/70">Stable Utility Token</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">$1.00 USD</div>
                  <p className="text-sm text-green-600/70">Always stable, always reliable</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>USD-pegged stablecoin backed by USDC reserves</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Primary token for participants and daily transactions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Zero volatility risk for essential needs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>100 token welcome bonus for new participants</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>No transaction fees for participants</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">Use Cases:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Daily necessities and essential purchases</li>
                    <li>• Food, clothing, and transportation</li>
                    <li>• Healthcare and emergency expenses</li>
                    <li>• Marketplace transactions and services</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">Technical Specs:</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <div>• Network: Base (Coinbase L2)</div>
                    <div>• Standard: ERC-20</div>
                    <div>• Backing: 1:1 USDC reserve</div>
                    <div>• Supply: Unlimited (demand-driven)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SHELTR (Community) */}
            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">$SHELTR</CardTitle>
                    <CardDescription className="text-purple-600/70">Community & Governance Token</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">Market Value</div>
                  <p className="text-sm text-purple-600/70">Growth potential with community engagement</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Governance rights and platform decisions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Staking rewards and revenue sharing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Deflationary tokenomics with buyback program</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Premium marketplace discounts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Optional participation for participants</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">Use Cases:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Governance voting and platform decisions</li>
                    <li>• Staking for additional rewards (8% APY target)</li>
                    <li>• Premium marketplace features and discounts</li>
                    <li>• Community incentives and recognition</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">Technical Specs:</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <div>• Total Supply: 100,000,000 SHELTR</div>
                    <div>• Deflationary Rate: 2% annually</div>
                    <div>• Network: Base (Coinbase L2)</div>
                    <div>• Standard: ERC-20</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ICO Information Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500/5 to-red-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Token Launch Information</h2>
            <p className="text-xl text-muted-foreground">Invest in revolutionary social impact technology</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 border-orange-500/20 bg-orange-500/5">
              <CardHeader>
                <CardTitle className="text-xl text-orange-600 dark:text-orange-400">🚀 Pre-Seed (Current)</CardTitle>
                <CardDescription>Supports Platform Completion & Launch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-500/10 p-3 rounded-lg">
                    <div className="font-semibold">Token Price</div>
                    <div className="text-2xl font-bold text-orange-600">$0.05</div>
                    <div className="text-xs text-muted-foreground">50% discount to qualified parties</div>
                  </div>
                  <div className="bg-orange-500/10 p-3 rounded-lg">
                    <div className="font-semibold">Target Raise</div>
                    <div className="text-2xl font-bold text-orange-600">$150K</div>
                    <div className="text-xs text-muted-foreground">3M tokens allocated</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Progress</span>
                    <span className="font-semibold">$25K / $150K</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span>Governance rights from day one</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span>Staking rewards (8% APY target)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span>Platform fee revenue sharing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span>Deflationary mechanics (2% annual burn)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20 bg-purple-500/5">
              <CardHeader>
                <CardTitle className="text-xl text-purple-600 dark:text-purple-400">🎯 Public Launch (Q4 2025)</CardTitle>
                <CardDescription>Fair market launch with full platform utility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-500/10 p-3 rounded-lg">
                    <div className="font-semibold">Launch Price</div>
                    <div className="text-2xl font-bold text-purple-600">$0.10</div>
                    <div className="text-xs text-muted-foreground">Fair market value</div>
                  </div>
                  <div className="bg-purple-500/10 p-3 rounded-lg">
                    <div className="font-semibold">Public Allocation</div>
                    <div className="text-2xl font-bold text-purple-600">50M</div>
                    <div className="text-xs text-muted-foreground">Tokens available</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span>Full platform functionality live</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span>Marketplace integration complete</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span>Mobile app deployment ready</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span>Exchange listings initiated</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token Distribution Chart */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center">SHELTR Token Distribution (100M Total Supply)</CardTitle>
              <CardDescription className="text-center">Transparent allocation ensuring long-term sustainability and growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold">Distribution Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <span>Public Sale</span>
                      <div className="text-right">
                        <div className="font-semibold">50M (50%)</div>
                        <div className="text-xs text-muted-foreground">Community ownership</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <span>Reserve Fund</span>
                      <div className="text-right">
                        <div className="font-semibold">5M (5%)</div>
                        <div className="text-xs text-muted-foreground">Long-term Defi Staking</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                      <span>Team & Advisors</span>
                      <div className="text-right">
                        <div className="font-semibold">12M (12%)</div>
                        <div className="text-xs text-muted-foreground">3-year vesting</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg">
                      <span>SHELTR Operations</span>
                      <div className="text-right">
                        <div className="font-semibold">13M (13%)</div>
                        <div className="text-xs text-muted-foreground">Operations & growth</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                      <span>Participant Onboarding Rewards</span>
                      <div className="text-right">
                        <div className="font-semibold">10M (10%)</div>
                        <div className="text-xs text-muted-foreground">Incentives & airdrops</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cyan-500/10 rounded-lg">
                      <span>Strategic Partnerships</span>
                      <div className="text-right">
                        <div className="font-semibold">10M (10%)</div>
                        <div className="text-xs text-muted-foreground">Growth partnerships</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Value Accrual Mechanisms</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold">Platform Fees (2%)</div>
                        <div className="text-sm text-muted-foreground">Paid in SHELTR tokens</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-semibold">Deflationary Burns</div>
                        <div className="text-sm text-muted-foreground">2% annual token reduction</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-semibold">Staking Rewards</div>
                        <div className="text-sm text-muted-foreground">8% APY from platform revenue</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="font-semibold">Network Effects</div>
                        <div className="text-sm text-muted-foreground">Growing utility drives demand</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SmartFund Distribution */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">SmartFund™ Donation Model</h2>
            <p className="text-xl text-muted-foreground">Transparent, automated allocation ensuring maximum impact</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-500/20 bg-blue-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">80%</CardTitle>
                <CardDescription className="text-blue-600/70">Direct Participant Support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  Immediate conversion to SHELTR-S tokens for participants&apos; essential needs
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Food and nutrition</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Clothing and hygiene</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Transportation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Emergency expenses</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-3 bg-blue-500/10 rounded-lg border">
                  <div className="text-sm font-semibold text-blue-600">Example: $100 Donation</div>
                  <div className="text-xs text-muted-foreground">→ 80 SHELTR-S tokens instantly</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">15%</CardTitle>
                <CardDescription className="text-green-600/70">Housing Fund Initiative</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  Long-term housing solutions through smart contract governed investment
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Emergency housing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Transitional programs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Permanent solutions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Support services</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-3 bg-green-500/10 rounded-lg border">
                  <div className="text-sm font-semibold text-green-600">DeFi Strategy</div>
                  <div className="text-xs text-muted-foreground">6-8% APY target growth</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20 bg-purple-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-purple-600 dark:text-purple-400">5%</CardTitle>
                <CardDescription className="text-purple-600/70">Shelter Operations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  Sustainable platform development and community growth
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Onboarding Program</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Financial audits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Tech support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Support materials</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-3 bg-purple-500/10 rounded-lg border">
                  <div className="text-sm font-semibold text-purple-600">SHELTR for Shelters.</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blockchain Integration */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Base Network Integration</h2>
            <p className="text-xl text-muted-foreground">Built on Coinbase&apos;s L2 for optimal performance and compliance</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Technical Specifications</CardTitle>
                <CardDescription>Robust blockchain architecture for real-world utility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="font-semibold">Network</div>
                    <div className="text-sm text-muted-foreground">Base (Coinbase L2)</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="font-semibold">Transaction Speed</div>
                    <div className="text-sm text-muted-foreground">~2 seconds</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="font-semibold">Gas Fees</div>
                    <div className="text-sm text-muted-foreground">~$0.01 USD</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="font-semibold">Standard</div>
                    <div className="text-sm text-muted-foreground">ERC-20</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Coinbase integration for fiat on/off ramps</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Enterprise-grade security and compliance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>OpenZeppelin security standards</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Multi-signature treasury management</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Sample Transactions</CardTitle>
                <CardDescription>Live examples from our test network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Donation Processing</span>
                      <Badge variant="secondary">Success</Badge>
                    </div>
                    <div className="text-muted-foreground">
                      <div>Hash: 0xa1b2c3d4e5f6789...</div>
                      <div>Amount: $100.00 → 80 SHELTR-S</div>
                      <div>Gas: $0.008</div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Housing Fund Allocation</span>
                      <Badge variant="secondary">Success</Badge>
                    </div>
                    <div className="text-muted-foreground">
                      <div>Hash: 0x9f8e7d6c5b4a321...</div>
                      <div>Amount: $15.00 → Housing Fund</div>
                      <div>Gas: $0.006</div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Welcome Bonus</span>
                      <Badge variant="secondary">Success</Badge>
                    </div>
                    <div className="text-muted-foreground">
                      <div>Hash: 0x5g6h7i8j9k0l123...</div>
                      <div>Amount: 100 SHELTR-S → New Participant</div>
                      <div>Gas: $0.004</div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Base Explorer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Documentation Links Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Technical Documentation</h2>
            <p className="text-xl text-muted-foreground">Deep dive into the technology and theory behind SHELTR</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-6 w-6 mr-3 text-blue-600" />
                  Technical Whitepaper
                </CardTitle>
                <CardDescription>
                  Complete technical specifications, dual-token architecture, and platform implementation details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Dual-token economic model detailed analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Smart contract architecture and security</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Platform economics and sustainability model</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Risk assessment and regulatory compliance</span>
                  </div>
                </div>
                <Link href="/docs/whitepaper">
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Read Technical Whitepaper
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-green-600" />
                  Hacking Homelessness
                </CardTitle>
                <CardDescription>
                  Theory of Change document explaining our revolutionary approach to solving homelessness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Three-pillar impact framework breakdown</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Traditional vs. SHELTR efficiency comparison</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Behavioral economics and social impact</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Measurable outcomes and success metrics</span>
                  </div>
                </div>
                <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/01-overview/hacking_homelessness.md" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Theory of Change
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Sustainable Revenue Model</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Multiple revenue streams ensure platform growth while protecting participants
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Participant Protection</CardTitle>
                <CardDescription>Zero fees for essential services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>No fees on SHELTR-S transactions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Free donation-to-token conversion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Emergency fund access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>100 SHELTR-S welcome bonus</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Streams</CardTitle>
                <CardDescription>Diversified sustainability model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span>Marketplace transaction fees (2-3%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span>SHELTR token appreciation & staking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <span>DeFi yields from housing fund</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span>Enterprise & government partnerships</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the SHELTR Economy</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of the revolution that&apos;s making charitable giving transparent, efficient, and impactful.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Coins className="h-4 w-4 mr-2" />
                Get SHELTR Tokens
              </Button>
            </Link>
            <Link href="/impact">
              <Button variant="outline" size="lg">
                <Eye className="h-4 w-4 mr-2" />
                View Impact Dashboard
              </Button>
            </Link>
            <Link href="/scan-give">
              <Button variant="outline" size="lg">
                <Zap className="h-4 w-4 mr-2" />
                Start Donating
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 