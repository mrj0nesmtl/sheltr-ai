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
            <div className="flex items-start gap-4 mb-6">
              <Rocket className="h-12 w-12 text-purple-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">Development Roadmap</h1>
                  <Badge className="bg-purple-500 text-white text-sm">Planning</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Detailed development timeline, milestones, and feature planning
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 2.0.0</span>
                  <span>•</span>
                  <span>August 2025</span>
                  <span>•</span>
                  <span>Updated Quarterly</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/dev-roadmap.md" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
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
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-6">
                <h3 className="text-green-800 dark:text-green-200 font-semibold mb-2">✅ Current Status: Q3 2025 - Multi-Tenant Platform Complete</h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  <strong>SHELTR MVP Status</strong>: Production Ready Multi-Tenant Platform - Session 13 completed with platform admin role, real donation flow, and consistent data across environments
                </p>
              </div>
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
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-green-600">Q3 2025 - Multi-Tenant Platform Complete</CardTitle>
                    <Badge className="bg-green-500 text-white">Complete</Badge>
                  </div>
                  <CardDescription>
                    Platform admin role, real donation flow, production deployment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Session 13 Achievements</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✅ Platform Administrator Role implemented</li>
                        <li>✅ Real donation flow with Michael Rodriguez profile</li>
                        <li>✅ Production database consistency achieved</li>
                        <li>✅ Multi-tenant platform architecture complete</li>
                        <li>✅ Role simulation testing for super admin</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Technical Achievements</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✅ Adyen payment integration operational</li>
                        <li>✅ QR code donation system with confetti animation</li>
                        <li>✅ SmartFund™ 80-15-5 distribution demo</li>
                        <li>✅ Investor access portal with dual authentication</li>
                        <li>✅ Production deployment to Cloud Run</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session 14 - Current */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-600">Session 14 - Shelter Admin UX & Onboarding</CardTitle>
                    <Badge className="bg-blue-500 text-white">Active</Badge>
                  </div>
                  <CardDescription>
                    Shelter admin reconnection, participant registration optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Current Focus</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>🔄 Shelter Admin Reconnection to tenant-specific data</li>
                        <li>🔄 Participant Registration optimization</li>
                        <li>🔄 Donor Onboarding streamlined flows</li>
                        <li>🔄 Technical debt cleanup</li>
                        <li>🔄 Codebase performance optimization</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Next Milestones</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>🎯 September: Pre-Sale & Seed Funding</li>
                        <li>🎯 October: Public Beta Launch</li>
                        <li>🎯 December: SHELTR Token ICO</li>
                        <li>🎯 Platform stability: 99.9% uptime</li>
                        <li>🎯 User onboarding optimization</li>
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
              <h3 className="text-2xl font-bold mb-4">Key Success Metrics - Current Status & Q4 2025 Targets</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Platform Adoption</h4>
                  <p className="text-sm text-muted-foreground">Q4 Target: 5,000+ active participants</p>
                  <p className="text-sm text-muted-foreground">Current: 1 (Michael Rodriguez - Production Ready)</p>
                  <p className="text-sm font-medium text-blue-600">ICO Target: 10,000+ token holders</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Transaction Volume</h4>
                  <p className="text-sm text-muted-foreground">Q4 Target: $500K+ monthly donations</p>
                  <p className="text-sm text-muted-foreground">Current: $0+ (Demo Flow Working)</p>
                  <p className="text-sm font-medium text-purple-600">50+ partner shelters</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Business Milestones</h4>
                  <p className="text-sm text-muted-foreground">September: Seed funding (CFO-led)</p>
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