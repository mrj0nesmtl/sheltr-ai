'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Share, BookOpen, FileText, Code } from 'lucide-react';
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
                  <Badge className="bg-blue-500 text-white">Technical Specification</Badge>
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
                  <Badge variant="outline" className="text-green-600 border-green-600">Production Ready</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/whitepaper_final.md" target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
              </a>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share Document
              </Button>
              <Link href="/docs">
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Documentation Hub
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
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                📋 Technical Specification Document
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                This technical white paper contains comprehensive architecture documentation suitable for 
                developers, technical teams, and integration partners. The full document is available 
                for viewing in our GitHub repository.
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
                    <li>• Implementation Roadmap</li>
                    <li>• Market Analysis & Competitive Landscape</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Technical Analysis</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Risk Assessment & Mitigation</li>
                    <li>• Platform Economics & Sustainability</li>
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
                    Our platform launches with 100 SHELTR-S tokens ($100 value) gifted to every new participant, 
                    creating immediate engagement and platform adoption through direct empowerment.
                  </p>
                  <div className="mt-6">
                    <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/whitepaper_final.md" target="_blank" rel="noopener noreferrer">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Code className="h-4 w-4 mr-2" />
                        Read Full Paper on GitHub
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Platform Efficiency</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-1">95%</div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Of donations reach intended purposes vs. 60-70% traditional
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">Transaction Speed</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">&lt;5s</div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Average processing time for donations and transfers
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-2">Network Fees</h3>
                  <div className="text-2xl font-bold text-purple-600 mb-1">~$0.01</div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Base blockchain transaction costs
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6">Technical Highlights</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Architecture Innovation</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Dual-token architecture separating stability from growth</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Smart contract automation for transparent fund distribution</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Cross-platform integration bridging traditional and crypto ecosystems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Scalable infrastructure supporting global deployment</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Technical Implementation</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Base L2 network integration with minimal transaction fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>SHELTR-S stable token with USDC backing for 0% volatility</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Encrypted QR code system for secure participant identification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Multi-signature smart contracts with governance controls</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Full Document Access */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Access Complete Technical Documentation</h2>
                <p className="mb-6">
                  View the full 67-page technical white paper with detailed architecture specifications, 
                  smart contract code, and comprehensive implementation strategies.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/docs/blockchain">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      <Code className="h-4 w-4 mr-2" />
                      Blockchain Architecture
                    </Button>
                  </Link>
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/whitepaper_final.md" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      <Download className="h-4 w-4 mr-2" />
                      View on GitHub
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