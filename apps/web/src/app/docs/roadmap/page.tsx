'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Rocket, Calendar, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function RoadmapPage() {
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
      <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Rocket className="h-12 w-12 text-purple-600" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">Development Roadmap</h1>
                  <Badge className="bg-purple-500 text-white">Planning</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  SHELTR platform development timeline and milestones
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Version 2.0.0</span>
                  <span>•</span>
                  <span>August 2025</span>
                  <span>•</span>
                  <span>Updated Quarterly</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">Live Document</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/dev-roadmap.md" target="_blank" rel="noopener noreferrer">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Download className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
              </a>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Interactive Timeline
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              <h2>Platform Development Timeline</h2>
              <p>
                Our development roadmap outlines the strategic implementation of SHELTR&rsquo;s blockchain-powered 
                social impact platform. Each phase builds upon previous milestones to create a comprehensive 
                ecosystem for transparent charitable giving and participant empowerment.
              </p>
            </div>

            <div className="space-y-8 mb-12">
              {/* Q1-Q2 2025 */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-green-600">Q1-Q2 2025 - Foundation & MVP</CardTitle>
                    <Badge className="bg-green-500 text-white">Complete</Badge>
                  </div>
                  <CardDescription>
                    Core platform development and architecture establishment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Technical Achievements</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✅ Live platform: sheltr-ai.web.app</li>
                        <li>✅ FastAPI + Next.js architecture</li>
                        <li>✅ Multi-role dashboard system</li>
                        <li>✅ Firebase authentication & database</li>
                        <li>✅ Mobile-responsive design</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Business Features</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✅ 4-role user system (SuperAdmin, ShelterAdmin, Participant, Donor)</li>
                        <li>✅ AI-powered chatbot integration</li>
                        <li>✅ Comprehensive documentation hub</li>
                        <li>✅ Service booking system</li>
                        <li>✅ Analytics dashboard framework</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Q3 2025 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-600">Q3 2025 - Private Beta & Payment Rails</CardTitle>
                    <Badge className="bg-blue-500 text-white">Active</Badge>
                  </div>
                  <CardDescription>
                    Production optimization and payment system integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Current Focus</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✅ Adyen payment integration (Doug K. partnership)</li>
                        <li>✅ QR code donation system operational</li>
                        <li>✅ SmartFund 80-15-5 distribution demo</li>
                        <li>🔄 Real database connectivity</li>
                        <li>🔄 Production performance optimization</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Team & Strategy</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✅ Doug K. (CFO) - 20+ years payments expertise</li>
                        <li>✅ Private beta user testing</li>
                        <li>🔄 Seed funding preparation (September)</li>
                        <li>🔄 Security audit preparation</li>
                        <li>🔄 Partner shelter onboarding</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Q4 2025 */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-purple-600">Q4 2025 - Public Beta & Token ICO</CardTitle>
                    <Badge variant="outline" className="border-purple-500 text-purple-600">Target</Badge>
                  </div>
                  <CardDescription>
                    Public launch, community growth, and SHELTR token debut
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Public Beta Launch</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>🚀 Open platform registration</li>
                        <li>🚀 Montreal pilot program</li>
                        <li>🚀 Mobile app beta (iOS/Android)</li>
                        <li>🚀 Community growth campaigns</li>
                        <li>🚀 Shelter partnership expansion</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Token Launch (December)</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>💎 SHELTR utility token ICO</li>
                        <li>💎 Smart contract mainnet deployment</li>
                        <li>💎 DAO governance activation</li>
                        <li>💎 Exchange listings (DEX/CEX)</li>
                        <li>💎 Global marketing campaign</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Q1 2026+ */}
              <Card className="border-l-4 border-l-gray-400">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-600">Q1 2026+ - Scaling & Expansion</CardTitle>
                    <Badge variant="outline" className="border-gray-400 text-gray-600">Future</Badge>
                  </div>
                  <CardDescription>
                    Multi-city expansion and enterprise features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Geographic Expansion</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>📋 Toronto market entry</li>
                        <li>📋 US pilot cities (Seattle, SF)</li>
                        <li>📋 Cross-border transactions</li>
                        <li>📋 Regional compliance</li>
                        <li>📋 Localization features</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Enterprise Features</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>📋 Government integration APIs</li>
                        <li>📋 Advanced reporting tools</li>
                        <li>📋 White-label solutions</li>
                        <li>📋 DeFi yield optimization</li>
                        <li>📋 Impact measurement tools</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">Key Success Metrics - Q4 2025 Targets</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Platform Adoption</h4>
                  <p className="text-sm text-muted-foreground">Q4 Target: 5,000+ active participants</p>
                  <p className="text-sm text-muted-foreground">Current: ~100 (Private Beta)</p>
                  <p className="text-sm font-medium text-blue-600">ICO Target: 10,000+ token holders</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Transaction Volume</h4>
                  <p className="text-sm text-muted-foreground">Q4 Target: $500K+ monthly donations</p>
                  <p className="text-sm text-muted-foreground">Current: Demo phase (Adyen integrated)</p>
                  <p className="text-sm font-medium text-purple-600">50+ partner shelters</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Business Milestones</h4>
                  <p className="text-sm text-muted-foreground">September: Seed funding with Doug K.</p>
                  <p className="text-sm text-muted-foreground">October: Public beta launch</p>
                  <p className="text-sm font-medium text-green-600">December: SHELTR Token ICO</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  <Book className="h-5 w-5 mr-2" />
                  Back to Documentation Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 