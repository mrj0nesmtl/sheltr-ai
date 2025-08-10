'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Share, Users, TrendingUp, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function HackingHomelessnessPage() {
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
              <Users className="h-12 w-12 text-purple-600" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">Hacking Homelessness Through Technology</h1>
                  <Badge className="bg-purple-500 text-white">Executive Summary</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  Revolutionary approach to charitable technology and social impact
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>July 20, 2025</span>
                  <span>•</span>
                  <span>25 pages</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">Production Ready</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="https://github.com/mrj0nesmtl/sheltr-ai/raw/main/docs/01-overview/hacking_homelessness.md">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </a>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share Document
              </Button>
              <Link href="/impact">
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Impact Metrics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Abstract */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Document Notice */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                👔 Executive Overview
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                This executive summary presents SHELTR's vision, our Theory of Change, and partnership opportunities 
                for organizations, influencers, community leaders, media, and strategic partners.
              </p>
            </div>

            <div className="space-y-8">
              {/* Executive Abstract */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Executive Abstract</h2>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p>
                    SHELTR was born from a simple but powerful realization: <strong>"It's better to solve than to manage."</strong> 
                    This philosophy, inspired by Malcolm Gladwell's groundbreaking essay "Million-Dollar Murray" in The New Yorker, 
                    became the foundation of our approach to addressing homelessness through technology.
                  </p>
                  <p>
                    This journey into tech-for-good wasn't born in a boardroom—it emerged from witnessing 
                    the disconnect between charitable intentions and measurable impact. Too often, well-meaning donations 
                    disappeared into administrative overhead, leaving both donors frustrated and those in need still struggling.
                  </p>
                  <p>
                    SHELTR represents an attempt to join the brilliant collective of Internet Angels doing transformative work—
                    creators who use their platforms and influence to directly help those in need, proving that technology 
                    and social media can be forces for genuine, lasting change.
                  </p>
                  <p>
                    Our revolutionary <strong>SmartFund™ distribution model</strong> ensures 80% of donations reach participants as 
                    stable SHELTR-S tokens, 15% builds sustainable housing solutions, and 5% maintains platform operations. 
                    Every new participant receives 100 SHELTR-S tokens ($100 value) as a welcome bonus, creating immediate 
                    engagement and platform adoption.
                  </p>
                  <p>
                    We're not just building software—we're <strong>"hacking homelessness"</strong> by merging 
                    technological innovation with compassionate action, creating verifiable impact through 
                    blockchain transparency, and fostering an engaged community of like-minded partners, creators, 
                    and stakeholders aligned for sustainable change.
                  </p>
                  
                  <blockquote className="border-l-4 border-purple-500 pl-4 italic text-purple-700 dark:text-purple-300 my-6">
                    "It costs a lot more to manage a problem than it does to solve it."
                    <br />
                    <cite className="text-sm font-normal">— Malcolm Gladwell, "Million-Dollar Murray," The New Yorker (2006)</cite>
                  </blockquote>
                </div>
              </div>

              {/* Theory of Change */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Theory of Change Framework</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <Target className="h-5 w-5" />
                        The Problem
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>30-40% overhead</strong> in traditional charity systems</li>
                        <li>• <strong>24-72 hour delays</strong> in crisis support delivery</li>
                        <li>• <strong>Opaque processes</strong> prevent impact verification</li>
                        <li>• <strong>Volatility exposure</strong> in crypto donations</li>
                        <li>• <strong>Centralized control</strong> creates single points of failure</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <Heart className="h-5 w-5" />
                        SHELTR Solution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>95% efficiency</strong> through direct blockchain distribution</li>
                        <li>• <strong>&lt;1 hour delivery</strong> via QR code instant donations</li>
                        <li>• <strong>Complete transparency</strong> with blockchain verification</li>
                        <li>• <strong>Zero volatility</strong> through SHELTR-S stable tokens</li>
                        <li>• <strong>Community governance</strong> via SHELTR token voting</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Three-Pillar Framework */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Three-Pillar Impact Framework</h2>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Pillar 1: Immediate Dignity & Stability</span>
                        <Badge className="bg-blue-500">80% + Welcome Bonus</Badge>
                      </CardTitle>
                      <CardDescription>
                        Preserve human dignity through instant, stable value delivery with zero volatility risk
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Technical Implementation</h4>
                          <ul className="text-sm space-y-1">
                            <li>• SHELTR-S tokens maintain $1.00 USD peg</li>
                            <li>• 100 token welcome bonus per signup</li>
                            <li>• Zero transaction fees for participants</li>
                            <li>• 24/7 QR code access</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Impact Metrics</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Average delivery: &lt;1 hour</li>
                            <li>• Purchasing power: 100% preserved</li>
                            <li>• Emergency response: &lt;5 minutes</li>
                            <li>• Autonomy satisfaction: 85% target</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Pillar 2: Sustainable Solutions & Long-term Impact</span>
                        <Badge className="bg-green-500">15% Housing Fund</Badge>
                      </CardTitle>
                      <CardDescription>
                        Build permanent housing infrastructure through smart contract governance and DeFi strategies
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                          <div className="font-bold text-red-600">40%</div>
                          <div className="text-xs">Emergency Housing</div>
                          <div className="text-xs text-muted-foreground">$6K avg/participant</div>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <div className="font-bold text-blue-600">35%</div>
                          <div className="text-xs">Transitional Programs</div>
                          <div className="text-xs text-muted-foreground">$15K avg/participant</div>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <div className="font-bold text-green-600">20%</div>
                          <div className="text-xs">Permanent Solutions</div>
                          <div className="text-xs text-muted-foreground">$45K avg/participant</div>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <div className="font-bold text-purple-600">5%</div>
                          <div className="text-xs">Support Services</div>
                          <div className="text-xs text-muted-foreground">$2K avg/participant</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Pillar 3: Platform Sustainability & Innovation</span>
                        <Badge className="bg-purple-500">5% Operations</Badge>
                      </CardTitle>
                      <CardDescription>
                        Ensure long-term platform viability, continuous innovation, and global scalability
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Operational Excellence</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Security audits & performance optimization</li>
                            <li>• Regulatory compliance maintenance</li>
                            <li>• 24/7 multilingual community support</li>
                            <li>• Global expansion capabilities</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Innovation Pipeline</h4>
                          <ul className="text-sm space-y-1">
                            <li>• AI-enhanced personalized support</li>
                            <li>• Corporate CSR program integration</li>
                            <li>• Advanced governance tools</li>
                            <li>• Multi-currency international support</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Market Opportunity */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Market Opportunity</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Global Market Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">$450B</div>
                          <div className="text-sm text-muted-foreground">Annual charitable giving</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">$45B</div>
                          <div className="text-sm text-muted-foreground">Homelessness support funding</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">300%</div>
                          <div className="text-sm text-muted-foreground">YoY crypto charity growth</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Investment Opportunity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-amber-600">$150K</div>
                          <div className="text-sm text-muted-foreground">Pre-seed target</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">$1M</div>
                          <div className="text-sm text-muted-foreground">Seed round (Q4 2025)</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-indigo-600">30x</div>
                          <div className="text-sm text-muted-foreground">5-year ROI potential</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Impact Projections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-green-600">50K</div>
                          <div className="text-sm text-muted-foreground">Participants by 2026</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">65%</div>
                          <div className="text-sm text-muted-foreground">Housing success rate</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">$3M</div>
                          <div className="text-sm text-muted-foreground">Monthly donations by Year 5</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Implementation Progress */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Implementation Progress</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Platform Foundation</span>
                      <span className="text-sm text-green-600">Complete</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Blockchain Integration</span>
                      <span className="text-sm text-blue-600">In Progress</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Token Launch Preparation</span>
                      <span className="text-sm text-purple-600">Active</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Mobile Application</span>
                      <span className="text-sm text-orange-600">Planned Q2</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Full Document Access */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Access Complete Executive Overview</h2>
                <p className="mb-6">
                  View the full 25-page executive summary with detailed market analysis, 
                  implementation roadmap, and comprehensive theory of change framework.
                </p>
                <div className="flex gap-4 justify-center">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/01-overview/hacking_homelessness.md">
                    <Button className="bg-white text-purple-600 hover:bg-purple-50">
                      <Users className="h-4 w-4 mr-2" />
                      View on GitHub
                    </Button>
                  </a>
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/raw/main/docs/01-overview/hacking_homelessness.md">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                      <Download className="h-4 w-4 mr-2" />
                      Download Markdown
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