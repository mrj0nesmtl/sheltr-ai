'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, TrendingUp, Shield, Building2, Users, CheckCircle, Eye, FileText, BookOpen, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import { PublicChatbot } from '@/components/PublicChatbot';
import PublicNavigation from '@/components/PublicNavigation';
import { useHeroImage } from '@/hooks/useHeroImage';
import { StandardHero } from '@/components/StandardHero';

// Component that uses useSearchParams (wrapped in Suspense)
function TokenomicsContent() {
  const searchParams = useSearchParams();
  const [isEmbedded, setIsEmbedded] = useState(false);
  
  // Fetch hero image from gallery (or use fallback)
  const { heroImage } = useHeroImage('/tokenomics', '/backgrounds/hero-bg.jpg');
  
  // Check if embedded in iframe
  useEffect(() => {
    setIsEmbedded(searchParams.get('embed') === 'true');
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation - Hide when embedded */}
      {!isEmbedded && <PublicNavigation />}

      {/* Breadcrumb - Hide when embedded */}
      {!isEmbedded && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/docs" className="hover:text-primary">Docs</Link>
            <span>/</span>
            <span className="text-foreground">Tokenomics</span>
          </div>
        </div>
      )}

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
                  October 1, 2025: Following expert peer-analysis by our colleagues and payments specialists, SHELTR is evolving from 
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

      {/* Hero Section - Standardized */}
      <StandardHero
        imageUrl={heroImage.url}
        badgeText="TOKENOMICS v3.0 - Dual-Rail Architecture"
        badgeVariant="secondary"
        badgeClassName="bg-white/20 text-white border-white/30 backdrop-blur-sm"
        title={
          <>
            SHELTR <span className="text-emerald-400">SmartFund™</span>
          </>
        }
        subtitle="Enterprise-grade token architecture with dual-rail payments (Adyen + x402), Shelter Ledger transparency, virtual cards, institutional staking, and complete public accountability."
      />

      {/* 1. SHELTER LEDGER - Track & Trace (NEW - TOP PRIORITY) */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-blue-600 border-blue-600">
              <Eye className="h-4 w-4 mr-2" />
              PUBLIC TRANSPARENCY
            </Badge>
            <h2 className="text-4xl font-bold mb-4">The Shelter Ledger</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every donation tracked. Every payout verified. Complete transparency through blockchain-powered public accountability.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Track & Trace */}
            <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600 dark:text-blue-400">Track & Trace</CardTitle>
                <CardDescription>Real-time donation flow visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Every Donation Tracked</div>
                    <p className="text-sm text-muted-foreground">From donor credit card to participant wallet</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Every Payout Verified</div>
                    <p className="text-sm text-muted-foreground">80/15/5 split recorded on-chain</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Real-Time Updates</div>
                    <p className="text-sm text-muted-foreground">Instant blockchain confirmation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Immutable Records */}
            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-600 dark:text-purple-400">Immutable Records</CardTitle>
                <CardDescription>Tamper-proof blockchain storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Permanent Storage</div>
                    <p className="text-sm text-muted-foreground">Base network blockchain security</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Cannot Be Altered</div>
                    <p className="text-sm text-muted-foreground">Cryptographic verification</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Audit Trail Forever</div>
                    <p className="text-sm text-muted-foreground">Historical transaction access</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Public Access */}
            <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-600 dark:text-emerald-400">Public Access</CardTitle>
                <CardDescription>Open books for complete accountability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Anyone Can Verify</div>
                    <p className="text-sm text-muted-foreground">Public blockchain explorer access</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Real-Time Auditing</div>
                    <p className="text-sm text-muted-foreground">No waiting for annual reports</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Crystal Clear Books</div>
                    <p className="text-sm text-muted-foreground">100% financial transparency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participant Wallet Dashboard */}
          <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20">
            <CardHeader>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Participant Wallet Dashboard</h3>
                <p className="text-muted-foreground">Every participant receives a blockchain wallet upon registration</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Automatic Wallet Creation</span>
                  </h4>
                  <div className="space-y-3 pl-7">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Registration Trigger</div>
                        <p className="text-sm text-muted-foreground">Wallet auto-generated when participant joins SHELTR</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Unique Address</div>
                        <p className="text-sm text-muted-foreground">Personal blockchain address for all transactions</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Zero Complexity</div>
                        <p className="text-sm text-muted-foreground">Participants never see crypto - just their dashboard</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <span>Real-Time Tracking</span>
                  </h4>
                  <div className="space-y-3 pl-7">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Housing Fund Balance</div>
                        <p className="text-sm text-muted-foreground">View 15% allocation + staking rewards growth</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Transaction History</div>
                        <p className="text-sm text-muted-foreground">Complete record of all donations received</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Growth Analytics</div>
                        <p className="text-sm text-muted-foreground">4-6% APY tracking with projections</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                <div className="text-center">
                  <h4 className="font-bold text-lg mb-2">Complete Transparency</h4>
                  <p className="text-muted-foreground">
                    Participants can monitor their SmartFund investment growth in real-time, view every donation allocation, 
                    and track their path to stable housing - all through a simple, user-friendly dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. SHELTR UTILITY TOKEN - Dual Purpose */}
      <section className="py-20 bg-gradient-to-r from-emerald-500/5 to-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">SHELTR Utility Token</h2>
            <p className="text-xl text-muted-foreground">Dual-purpose blockchain token: Track every dollar + Grow housing funds</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
              <CardHeader>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <CardTitle className="text-3xl text-emerald-600 dark:text-emerald-400">SHELTR Utility Token</CardTitle>
                    <CardDescription className="text-emerald-600/70 text-lg">Track & Trace Every Dollar</CardDescription>
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
                    <h4 className="font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Primary Utility: Tracking</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Track every donation in the system</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Trace every payout and allocation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Public ledger accountability</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Real-time verification API</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Secondary Utility: Staking</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Housing fund balance tracking</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>4-6% APY growth monitoring</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Participant wallet dashboard</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Zero volatility risk (USDT-pegged)</span>
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

      {/* 3. PAYMENT FLOW - How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">SmartFund™ Payment Flow</h2>
            <p className="text-xl text-muted-foreground">From donation to participant wallet in seconds - tracked on blockchain</p>
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
                  <h3 className="font-semibold mb-2">2. Blockchain Tracking</h3>
                  <p className="text-sm text-muted-foreground">SHELTR token records transaction on Shelter Ledger</p>
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
                  <p className="text-sm text-muted-foreground">Instant card loading for immediate use</p>
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
                  <h3 className="font-semibold mb-2">4. Institutional Staking</h3>
                  <p className="text-sm text-muted-foreground">Coinbase staking generates guaranteed growth</p>
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

      {/* 4. ENTERPRISE PARTNERS - Infrastructure */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-orange-500/5">
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
                  <p className="text-sm text-orange-600/70">Guaranteed 4-6% APY institutional staking</p>
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

      {/* 5. WHY THIS MATTERS - Theory of Change */}
      <section className="py-20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why This Architecture Matters</h2>
            <p className="text-xl text-muted-foreground">Zero risk + Complete transparency + Guaranteed growth</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2 border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-xl text-red-600 dark:text-red-400">❌ Traditional Charity Models</CardTitle>
                <CardDescription>Opaque systems with high overhead</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>30-40% administrative overhead</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Annual reports only - no real-time visibility</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>No guaranteed fund growth</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Limited donor verification</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-red-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">60-70% Efficiency</div>
                  <p className="text-sm text-red-600/70">Only 60-70 cents per dollar reaches beneficiaries</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-500/20 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400">✅ SHELTR SmartFund™ Model</CardTitle>
                <CardDescription>Blockchain transparency with institutional stability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Zero overhead - 100% allocation efficiency</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Real-time tracking via Shelter Ledger</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Guaranteed 4-6% APY on housing funds</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Public blockchain verification</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100% Efficiency</div>
                  <p className="text-sm text-emerald-600/70">Every dollar reaches its intended purpose</p>
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
            <h2 className="text-3xl font-bold mb-4">Technical Documentation</h2>
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
                  SHELTR utility token smart contracts and Base network integration
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
            Join the enterprise-grade platform that protects participants while delivering guaranteed results through complete transparency.
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

      {/* Footer - Hide when embedded */}
      {!isEmbedded && <Footer />}
      {!isEmbedded && <PublicChatbot />}
    </div>
  );
}

// Main page component with Suspense boundary
export default function TokenomicsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <TokenomicsContent />
    </Suspense>
  );
}
