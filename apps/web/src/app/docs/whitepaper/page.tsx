'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Share, BookOpen, FileText, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <FileText className="h-12 w-12 text-blue-600" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">SHELTR Technical White Paper</h1>
                  <Badge className="bg-blue-500 text-white">Investment Grade</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  Hacking Homelessness Through Direct-Impact Technology
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>January 25, 2025</span>
                  <span>•</span>
                  <span>67 pages</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-amber-600 border-amber-600">In Development</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="https://github.com/mrj0nesmtl/sheltr-ai/raw/main/docs/02-architecture/whitepaper_final.md">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </a>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share Document
              </Button>
              <Link href="/investor-access">
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Investor Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Document Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Document Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                📋 Investment Grade Documentation
              </h3>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                This technical white paper contains comprehensive analysis suitable for investors, 
                technical teams, and strategic partners. The full document is available for download 
                or can be viewed in our GitHub repository.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Core Framework</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Theory of Change & Social Impact</li>
                    <li>• Dual-Token Economic Model</li>
                    <li>• Technical Architecture</li>
                    <li>• Investment Opportunity</li>
                    <li>• Implementation Roadmap</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Business Analysis</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Market Analysis & Competitive Landscape</li>
                    <li>• Risk Assessment & Mitigation</li>
                    <li>• Financial Projections & ROI</li>
                    <li>• Regulatory Compliance & Legal Framework</li>
                    <li>• Success Metrics & Impact Measurement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Executive Abstract</h2>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p>
                    SHELTR represents a paradigm shift in addressing homelessness through technology-driven 
                    charitable giving and dual-token economics. By seamlessly integrating blockchain transparency, 
                    AI-powered financial guidance, and location-based services, SHELTR creates a direct bridge 
                    between donors and individuals experiencing homelessness while building sustainable long-term solutions.
                  </p>
                  <p>
                    Our revolutionary dual-token architecture combines <strong>SHELTR-S</strong> (stable utility token) 
                    for participant protection with <strong>SHELTR</strong> (community governance token) for ecosystem growth. 
                    This innovative approach ensures that 80% of donations reach participants as stable value, 
                    15% funds housing solutions, and 5% supports operations—all verified on-chain for complete transparency.
                  </p>
                  <p>
                    <strong>Investment Opportunity</strong>: SHELTR is raising $150,000 in pre-seed funding through our 
                    token-based investment structure, with a clear path to $1M seed funding and Series A scaling. 
                    Our platform launches with 100 SHELTR-S tokens ($100 value) gifted to every new participant, 
                    creating immediate engagement and platform adoption.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">Pre-Seed Round</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">$150,000</div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Target funding at $0.05/token (50% discount to public launch)
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Platform Efficiency</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-1">95%</div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Of donations reach intended purposes vs. 60-70% traditional
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-2">ROI Potential</h3>
                  <div className="text-2xl font-bold text-purple-600 mb-1">30x</div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Projected 5-year return for pre-seed investors
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6">Investment Highlights</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Market Opportunity</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>$450B global charitable giving market</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>$45B annual homelessness support funding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>300% YoY growth in cryptocurrency charity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>First-mover advantage in dual-token charitable architecture</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Technical Innovation</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Base network integration (~$0.01 transaction fees)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>SHELTR-S stable token with 0% volatility for participants</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>SHELTR governance token with 8% staking yields</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Smart contract-governed housing fund with DeFi yields</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Full Document Access */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Access Complete Documentation</h2>
                <p className="mb-6">
                  View the full 67-page technical white paper with detailed financial projections, 
                  smart contract code, and comprehensive implementation strategy.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/tokenomics">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      <Coins className="h-4 w-4 mr-2" />
                      View Tokenomics
                    </Button>
                  </Link>
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/raw/main/docs/02-architecture/whitepaper_final.md">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </a>
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