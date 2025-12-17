'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Share, BookOpen, FileText, Code, Shield, CreditCard, TrendingUp, Building2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Docs
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <FileText className="h-12 w-12 text-emerald-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">White Paper v3.0</h1>
                  <Badge className="bg-emerald-500 text-white text-sm">Peer Reviewed + x402 Enhanced</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Enterprise-grade platform with dual-rail payment architecture (Adyen + x402), Shelter Ledger transparency, and guaranteed institutional returns
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 3.0.0</span>
                  <span>•</span>
                  <span>December 16, 2025</span>
                  <span>•</span>
                  <Badge className="bg-blue-500 text-white text-xs">Published</Badge>
                  <span>•</span>
                  <Badge className="bg-purple-500 text-white text-xs">x402 Ready</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/whitepaper_final.md" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Download className="h-4 w-4 mr-2" />
                      View Full Paper
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Document Notice */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                📋 Strategic Document
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                This  whitepaper outlines our revolutionary single-token stable fund architecture, 
                designed for CFOs, payment architects, enterprise partners, and institutional investors. 
                The complete strategic analysis is available in our GitHub repository.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Multi-Tenent SaaS Framework</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Theory of Change & Social Impact</li>
                    <li>• Single-Token Stable Architecture</li>
                    <li>• Enterprise Payment Infrastructure</li>
                    <li>• Technical Architecture</li>
                    <li>• Implementation Roadmap</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Strategic Analysis</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Market Analysis & Competitive Landscape</li>
                    <li>• Risk Assessment & Mitigation</li>
                    <li>• Business Model & Sustainability</li>
                    <li>• Regulatory Compliance & Legal Framework</li>
                    <li>• Success Metrics & Impact Measurement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Abstract</h2>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p>
                    SHELTR represents a revolutionary enterprise-grade platform that addresses homelessness through traditional payment 
                    stability combined with blockchain transparency. By integrating <strong>payment processing</strong>, 
                    <strong>Coinbase institutional staking</strong>, and <strong>single-token housing fund tracking</strong>, SHELTR creates 
                    a zero-risk bridge between donors and individuals experiencing homelessness while building sustainable long-term solutions.
                  </p>
                  <p>
                    Our <strong>single-token stable architecture</strong> uses the SHELTR Stablecoin (USDT-pegged) exclusively 
                    for housing fund tracking and transparency, while participants receive <strong>virtual debit cards</strong> with 80% of donations, 
                    eliminating cryptocurrency volatility exposure. This innovative approach ensures <strong>100% of donations reach their intended purposes</strong>: 
                    80% participant support via traditional payment cards, 15% housing fund growth through <strong>guaranteed 4-6% APY institutional staking</strong>, 
                    and 5% shelter operations support—all verified on-chain for complete transparency with <strong>zero participant risk</strong>.
                  </p>
                  <p>
                    Our platform launches with <strong>enterprise partnerships</strong> providing institutional-grade infrastructure, 
                    <strong>traditional funding models</strong> eliminating ICO speculation, and <strong>guaranteed returns</strong> through 
                    Coinbase Prime institutional custody and staking services.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-4 mt-6">Enterprise Payment Architecture</h3>
                  <p>
                    SHELTR&apos;s infrastructure is built on proven enterprise partnerships with payment processing for global credit card acceptance 
                    and virtual card issuance, and Coinbase Prime for institutional-grade custody and staking. Our smart contract architecture 
                    on Base network implements OpenZeppelin security standards with multi-signature governance and emergency pause capabilities.
                  </p>
                  <p>
                    The platform integrates Firebase Firestore for real-time multi-tenant data management, FastAPI for 
                    high-performance backend services, and Next.js 15 for enterprise-grade frontend experiences. 
                    All participant funds are processed through traditional payment infrastructure with zero cryptocurrency exposure.
                  </p>

                  <h3 className="text-xl font-semibold mb-4 mt-6">Enterprise Payment Flow</h3>
                  <div className="bg-muted/20 rounded-lg p-6 my-6">
                    <div className="space-y-4">
                      <div className="text-center font-semibold text-lg mb-4">Zero-Risk Payment Architecture</div>
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <span className="font-medium">💳 $100 Credit Card Donation</span>
                          <span className="text-sm text-muted-foreground">Global Payment Processing</span>
                        </div>
                        <div className="flex justify-center">
                          <div className="w-px h-8 bg-border"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">
                            <div className="font-bold text-emerald-600">80%</div>
                            <div className="text-sm">$80 → Virtual Card</div>
                            <div className="text-xs text-muted-foreground">Instant Debit Card</div>
                          </div>
                          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded text-center">
                            <div className="font-bold text-orange-600">15%</div>
                            <div className="text-sm">$15 → Housing Fund</div>
                            <div className="text-xs text-muted-foreground">4-6% APY Guaranteed</div>
                          </div>
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded text-center">
                            <div className="font-bold text-purple-600">5%</div>
                            <div className="text-sm">$5 → Shelter Ops</div>
                            <div className="text-xs text-muted-foreground">*Or Housing if Independent</div>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div className="w-px h-8 bg-border"></div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                          <span className="font-medium">⛓️ SHELTR Token Tracking</span>
                          <span className="text-sm text-muted-foreground">Transparent Housing Fund Growth</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 mt-6">Security & Compliance</h3>
                  <p>
                    Every transaction is secured through enterprise-grade infrastructure including payment processing PCI DSS Level 1 compliance, 
                    Coinbase Prime SOC 2 Type II certified custody, and Base network smart contract security. Our compliance framework 
                    adheres to traditional business regulations, AML screening, and GDPR/CCPA data protection standards.
                  </p>
                  <div className="mt-6">
                    <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/whitepaper_final.md" target="_blank" rel="noopener noreferrer">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Code className="h-4 w-4 mr-2" />
                        Read Full Paper
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">Zero Risk Protection</h3>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">100%</div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Participant protection through traditional payment cards
                  </p>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-orange-800 dark:text-orange-200 mb-2">Guaranteed Returns</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-1">4-6% APY</div>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Housing fund growth through Coinbase institutional staking
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Enterprise SLA</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-1">99.99%</div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Uptime guarantee through institutional partnerships
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6">Platform Architecture Highlights</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Infrastructure Innovation</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Single-token stable architecture eliminating complexity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Enterprise payment processing with virtual card issuance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Coinbase institutional custody and guaranteed staking returns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Traditional funding model eliminating ICO speculation</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Enterprise Benefits</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Government-ready traditional business structure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Municipal contract opportunities ($8B annual market)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Corporate CSR partnership integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Scalable revenue through enterprise partnerships</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Enterprise Partners */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Enterprise Infrastructure Partners</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-8 w-8 text-blue-600" />
                        <div>
                          <CardTitle className="text-xl text-blue-600">Payment Processing</CardTitle>
                          <CardDescription>Global payment processing and virtual card issuance</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>80% allocation to participant virtual cards</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>PCI DSS Level 1 compliance</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>Global Visa/Mastercard acceptance</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>Zero fees for participants</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-8 w-8 text-orange-600" />
                        <div>
                          <CardTitle className="text-xl text-orange-600">Coinbase Institutional</CardTitle>
                          <CardDescription>Custody and staking services for housing fund</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-orange-500" />
                          <span>15% housing fund allocation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-orange-500" />
                          <span>4-6% APY guaranteed returns</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-orange-500" />
                          <span>SOC 2 Type II certified custody</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-orange-500" />
                          <span>Daily liquidity access</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Target Audience</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="text-center border-2">
                    <CardContent className="pt-6">
                      <Building2 className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                      <h3 className="font-semibold mb-2">Stakeholders</h3>
                      <p className="text-sm text-muted-foreground">Strategic financial planning and risk management</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center border-2">
                    <CardContent className="pt-6">
                      <CreditCard className="h-10 w-10 mx-auto mb-3 text-emerald-600" />
                      <h3 className="font-semibold mb-2">Payment Architects</h3>
                      <p className="text-sm text-muted-foreground">Enterprise payment system design and integration</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center border-2">
                    <CardContent className="pt-6">
                      <Shield className="h-10 w-10 mx-auto mb-3 text-purple-600" />
                      <h3 className="font-semibold mb-2">Enterprise Partners</h3>
                      <p className="text-sm text-muted-foreground">Strategic partnership development and implementation</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center border-2">
                    <CardContent className="pt-6">
                      <TrendingUp className="h-10 w-10 mx-auto mb-3 text-orange-600" />
                      <h3 className="font-semibold mb-2">Investment Teams</h3>
                      <p className="text-sm text-muted-foreground">Traditional funding and institutional investment</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Document Information */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Document Information</h2>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Version Details</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li><strong>Version:</strong> 2.0.0</li>
                      <li><strong>Last Updated:</strong> September 26, 2025</li>
                      <li><strong>Status:</strong> Strategic Implementation - Enterprise Ready</li>
                      <li><strong>Classification:</strong> Enterprise-Grade Strategic Documentation</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Key Topics Covered</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Single-Token Architecture</Badge>
                      <Badge variant="outline" className="text-xs">Enterprise Partnerships</Badge>
                      <Badge variant="outline" className="text-xs">Payment Processing</Badge>
                      <Badge variant="outline" className="text-xs">Coinbase Staking</Badge>
                      <Badge variant="outline" className="text-xs">Zero Risk Protection</Badge>
                      <Badge variant="outline" className="text-xs">Traditional Funding</Badge>
                    </div>
                  </div>
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