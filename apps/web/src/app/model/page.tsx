'use client';

import Link from 'next/link';
import { ArrowLeft, Coins, TrendingUp, Shield, Zap, DollarSign, Users, BarChart3, CheckCircle, ExternalLink, Copy, Eye, LogIn, Menu, X, FileText, BookOpen, Rocket, Target, PieChart, ArrowRight, Building2, Home, Timer, Percent, Wallet, PiggyBank, ChartLine, Globe, Handshake, Lock, RefreshCw, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';

export default function RevenueModelPage() {
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
          <Link href="/tokenomics" className="hover:text-primary">Tokenomics</Link>
          <span>/</span>
          <span className="text-foreground">Model</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/backgrounds/hero-bg.jpg)'}}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <DollarSign className="h-10 w-10 text-white" />
          </div>
          <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">Sustainable Economics</Badge>
          <h1 className="text-4xl font-bold mb-6 text-white">
            Sustainable Revenue Model
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Multiple revenue streams ensure platform growth while protecting participants. 
            Discover how SHELTR's innovative economics create lasting impact through DeFi yields, 
            marketplace fees, and strategic partnerships.
          </p>
        </div>
      </section>

      {/* Revenue Streams Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Revenue Streams Breakdown</h2>
            <p className="text-xl text-muted-foreground">Diversified income sources that fuel platform growth and participant protection</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Participant Protection */}
            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-green-600 dark:text-green-400">Participant Protection</CardTitle>
                    <CardDescription className="text-green-600/70">Zero fees for essential services</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>No fees on SHELTR-S transactions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Free donation-to-token conversion</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Emergency fund access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>100 SHELTR-S welcome bonus</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">Protection Guarantee:</h4>
                  <p className="text-sm text-muted-foreground">
                    Participants never pay fees for essential services. All SHELTR-S transactions, 
                    emergency fund access, and basic platform features are completely free.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Streams */}
            <Card className="border-2 border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Revenue Streams</CardTitle>
                    <CardDescription className="text-blue-600/70">Diversified sustainability model</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Marketplace transaction fees (2-3%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>SHELTR token appreciation & staking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>DeFi yields from housing fund</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Enterprise & government partnerships</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Growth Strategy:</h4>
                  <p className="text-sm text-muted-foreground">
                    Multiple income sources ensure platform sustainability while maintaining 
                    participant protection and driving long-term value creation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* DeFi Housing Fund Deep Dive */}
      <section className="py-20 bg-gradient-to-r from-green-500/5 to-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">DeFi Housing Fund Mechanics</h2>
            <p className="text-xl text-muted-foreground">How 15% of every donation creates sustainable housing solutions through DeFi yields</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Fund Allocation */}
            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PiggyBank className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">Fund Allocation</CardTitle>
                <CardDescription className="text-green-600/70">15% of every donation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">$150.00</div>
                    <p className="text-sm text-green-600/70">From every $1,000 monthly</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Automated smart contract allocation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Transparent blockchain tracking</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Immediate DeFi deployment</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DeFi Strategy */}
            <Card className="border-2 border-blue-500/20 bg-blue-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChartLine className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">DeFi Strategy</CardTitle>
                <CardDescription className="text-blue-600/70">6-8% APY target growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">6-8% APY</div>
                    <p className="text-sm text-blue-600/70">Annual yield target</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm">USDC stablecoin staking</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm">Liquidity pool participation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm">Risk-managed protocols</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Housing Solutions */}
            <Card className="border-2 border-purple-500/20 bg-purple-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">Housing Solutions</CardTitle>
                <CardDescription className="text-purple-600/70">Emergency & transitional housing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">24-48h</div>
                    <p className="text-sm text-purple-600/70">Emergency response time</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm">Emergency housing placement</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm">Transitional program funding</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm">Support services integration</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline & Turnover */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center">Housing Fund Timeline & Turnover</CardTitle>
              <CardDescription className="text-center">How DeFi yields amplify donations and accelerate participant housing goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">Donation Amplification Timeline</h3>
                                     <div className="space-y-4">
                     <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                       <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                         <Timer className="h-6 w-6 text-green-600" />
                       </div>
                       <div>
                         <div className="font-semibold">Month 1: Active Participant</div>
                         <div className="text-sm text-muted-foreground">$1,000 monthly donations → $150 to housing fund</div>
                       </div>
                     </div>
                     
                     <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                       <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                         <RefreshCw className="h-6 w-6 text-blue-600" />
                       </div>
                       <div>
                         <div className="font-semibold">Month 2-12: DeFi Growth</div>
                         <div className="text-sm text-muted-foreground">$1,800 grows to $1,944 (8% APY)</div>
                       </div>
                     </div>
                     
                     <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                       <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                         <Home className="h-6 w-6 text-purple-600" />
                       </div>
                       <div>
                         <div className="font-semibold">Month 12+: Tiny Home Goal</div>
                         <div className="text-sm text-muted-foreground">$1,944 + $3,056 = $5,000 tiny home fund</div>
                       </div>
                     </div>
                     
                     <div className="flex items-center space-x-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                       <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                         <Target className="h-6 w-6 text-orange-600" />
                       </div>
                       <div>
                         <div className="font-semibold text-orange-600">Success: Permanent Housing</div>
                         <div className="text-sm text-orange-600/70">Participant achieves $5,000 goal for tiny home</div>
                       </div>
                     </div>
                   </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">Participant Housing Goals</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Emergency Housing</h4>
                      <div className="space-y-2 text-sm">
                        <div>• 24-48 hour response time</div>
                        <div>• Immediate shelter placement</div>
                        <div>• Basic needs provision</div>
                        <div>• Case management referral</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Transitional Housing</h4>
                      <div className="space-y-2 text-sm">
                        <div>• 3-6 month programs</div>
                        <div>• Job training & placement</div>
                        <div>• Financial literacy education</div>
                        <div>• Permanent housing preparation</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Permanent Solutions</h4>
                      <div className="space-y-2 text-sm">
                        <div>• Affordable housing partnerships</div>
                        <div>• Rent assistance programs</div>
                        <div>• Homeownership pathways</div>
                        <div>• Community integration support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Marketplace Transaction Fees */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Marketplace Transaction Fees</h2>
            <p className="text-xl text-muted-foreground">How 2-3% fees on marketplace transactions create sustainable revenue</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Fee Structure</CardTitle>
                <CardDescription>Transparent pricing that supports platform growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <div className="font-semibold text-green-600">Essential Services</div>
                    <div className="text-2xl font-bold text-green-600">0%</div>
                    <div className="text-xs text-muted-foreground">No fees for participants</div>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="font-semibold text-blue-600">Marketplace</div>
                    <div className="text-2xl font-bold text-blue-600">2-3%</div>
                    <div className="text-xs text-muted-foreground">Premium services</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Fee-Free Services:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>SHELTR-S transactions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Donation processing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Emergency fund access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Basic marketplace features</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Premium Services (2-3%):</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span>Advanced marketplace features</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span>Priority support services</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span>Enhanced analytics & reporting</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span>Custom integration services</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Revenue Impact</CardTitle>
                <CardDescription>How fees translate to platform sustainability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Example Transaction</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Marketplace purchase:</span>
                        <span className="font-semibold">$100.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform fee (2.5%):</span>
                        <span className="font-semibold text-blue-600">$2.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Participant receives:</span>
                        <span className="font-semibold text-green-600">$97.50</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Fee Allocation:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Platform development:</span>
                        <span>40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support services:</span>
                        <span>30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SHELTR token rewards:</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emergency reserves:</span>
                        <span>10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SHELTR Token Economics */}
      <section className="py-20 bg-gradient-to-r from-purple-500/5 to-orange-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">SHELTR Token Appreciation & Staking</h2>
            <p className="text-xl text-muted-foreground">How token economics drive platform value and participant rewards</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-2 border-purple-500/20 bg-purple-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">Token Appreciation</CardTitle>
                <CardDescription className="text-purple-600/70">Value growth mechanisms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm">Deflationary tokenomics (2% annual burn)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm">Platform fee revenue sharing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm">Growing utility demand</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm">Governance rights value</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-500/20 bg-orange-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">Staking Rewards</CardTitle>
                <CardDescription className="text-orange-600/70">8% APY target</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">8% APY</div>
                    <p className="text-sm text-orange-600/70">Annual percentage yield</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm">Platform fee distribution</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm">DeFi yield sharing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm">Governance participation</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">Community Benefits</CardTitle>
                <CardDescription className="text-green-600/70">Participant advantages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Optional participation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Premium marketplace discounts</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Enhanced support access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Community recognition</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise & Government Partnerships */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise & Government Partnerships</h2>
            <p className="text-xl text-muted-foreground">Strategic collaborations that scale impact and create sustainable revenue</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise Solutions</CardTitle>
                <CardDescription>Corporate social responsibility and employee giving programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Employee Giving Programs</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Payroll deduction integration</div>
                      <div>• Corporate matching programs</div>
                      <div>• Impact reporting & analytics</div>
                      <div>• Employee engagement tools</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">CSR Initiatives</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Corporate donation campaigns</div>
                      <div>• Community impact programs</div>
                      <div>• Sustainability reporting</div>
                      <div>• Stakeholder engagement</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Revenue Model</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Platform licensing fees</div>
                      <div>• Custom integration services</div>
                      <div>• Analytics & reporting tools</div>
                      <div>• Dedicated support services</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Government Partnerships</CardTitle>
                <CardDescription>Public sector collaboration for systemic change</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Municipal Programs</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Emergency housing coordination</div>
                      <div>• Social service integration</div>
                      <div>• Data sharing & analytics</div>
                      <div>• Policy development support</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <h4 className="font-semibold text-cyan-600 dark:text-cyan-400 mb-2">State & Federal</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Grant program administration</div>
                      <div>• Compliance & reporting tools</div>
                      <div>• Cross-agency coordination</div>
                      <div>• Impact measurement systems</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Revenue Streams</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Software licensing agreements</div>
                      <div>• Implementation services</div>
                      <div>• Training & support programs</div>
                      <div>• Data analytics services</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Sustainable Impact Economy</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of a revenue model that prioritizes participant protection while creating lasting social impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Coins className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link href="/tokenomics">
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tokenomics
              </Button>
            </Link>
            <Link href="/impact">
              <Button variant="outline" size="lg">
                <Eye className="h-4 w-4 mr-2" />
                View Impact
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
