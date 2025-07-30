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
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>January 25, 2025</span>
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
              {/* Q1 2025 */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-green-600">Q1 2025 - Foundation</CardTitle>
                    <Badge className="bg-green-500 text-white">In Progress</Badge>
                  </div>
                  <CardDescription>
                    Core platform development and blockchain integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Technical Milestones</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✅ Smart contract deployment on Base</li>
                        <li>✅ SHELTR-S stable token implementation</li>
                        <li>🔄 QR code generation system</li>
                        <li>📋 Multi-role dashboard architecture</li>
                        <li>📋 Participant onboarding flows</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Platform Features</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✅ Dual-token economic model</li>
                        <li>✅ 80/15/5 distribution mechanism</li>
                        <li>🔄 Blockchain wallet integration</li>
                        <li>📋 Real-time transaction tracking</li>
                        <li>📋 Mobile-responsive design</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Q2 2025 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-600">Q2 2025 - Platform Launch</CardTitle>
                    <Badge variant="outline" className="border-blue-500 text-blue-600">Planned</Badge>
                  </div>
                  <CardDescription>
                    Public beta launch and initial market deployment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Launch Activities</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>📋 Montreal pilot program launch</li>
                        <li>📋 Shelter partnership onboarding</li>
                        <li>📋 Community testing and feedback</li>
                        <li>📋 Platform optimization</li>
                        <li>📋 Security audit completion</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">User Experience</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>📋 Native mobile applications</li>
                        <li>📋 Enhanced user onboarding</li>
                        <li>📋 Multi-language support</li>
                        <li>📋 Advanced analytics dashboard</li>
                        <li>📋 Community support features</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Q3-Q4 2025 */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-purple-600">Q3-Q4 2025 - Scaling</CardTitle>
                    <Badge variant="outline" className="border-purple-500 text-purple-600">Future</Badge>
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
              <h3 className="text-2xl font-bold mb-4">Key Success Metrics</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Platform Adoption</h4>
                  <p className="text-sm text-muted-foreground">Target: 10,000 active participants by Q4 2025</p>
                  <p className="text-sm text-muted-foreground">Current: 0 (Pre-launch)</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Transaction Volume</h4>
                  <p className="text-sm text-muted-foreground">Target: $3M monthly by Year 2</p>
                  <p className="text-sm text-muted-foreground">Projection: Growing 20% monthly</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Social Impact</h4>
                  <p className="text-sm text-muted-foreground">Target: 65% housing transition rate</p>
                  <p className="text-sm text-muted-foreground">Baseline: Industry average 30%</p>
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