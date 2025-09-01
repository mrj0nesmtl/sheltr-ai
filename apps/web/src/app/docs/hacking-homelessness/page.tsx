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
            <div className="flex items-start gap-4 mb-6">
              <Users className="h-12 w-12 text-purple-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">Hacking Homelessness and the Theory of Change</h1>
                  <Badge className="bg-purple-500 text-white text-sm">Thesis</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Executive overview of our theory of change, market analysis, and social impact framework
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 1.4.0</span>
                  <span>•</span>
                  <span>July 20, 2025</span>
                  <span>•</span>

                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/docs">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Users className="h-4 w-4 mr-2" />
                      View Online
                    </Button>
                  </Link>
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/01-overview/hacking_homelessness.md">
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
                This executive summary presents SHELTR&apos;s vision, our Theory of Change, and partnership opportunities 
                for organizations, influencers, community leaders, media, and strategic partners.
              </p>
            </div>

            <div className="space-y-8">
              {/* Executive Abstract */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Executive Abstract</h2>
                <div className="space-y-4 text-lg leading-relaxed">
                  <p className="mb-4">
                    SHELTR was born from a simple but powerful realization: <strong>&ldquo;It&apos;s better to solve than to manage.&rdquo;</strong> 
                    This philosophy, inspired by Malcolm Gladwell&apos;s groundbreaking essay &ldquo;Million-Dollar Murray&rdquo; in The New Yorker, 
                    became the foundation of our approach to addressing homelessness through technology.
                  </p>
                  
                  <p className="mb-4">
                    This journey into tech-for-good wasn&apos;t born in a boardroom—it emerged from witnessing 
                    the disconnect between charitable intentions and measurable impact. Too often, well-meaning donations 
                    disappeared into administrative overhead, leaving both donors frustrated and those in need still struggling.
                  </p>
                  
                  <p className="mb-4">
                    SHELTR represents an attempt to join the brilliant collective of Internet Angels doing transformative work—
                    creators who use their platforms and influence to directly help those in need, proving that technology 
                    and social media can be forces for genuine, lasting change.
                  </p>
                  
                  <p className="mb-4">
                    Our revolutionary <strong>SmartFund™ distribution model</strong> ensures 85% of donations reach participants as 
                    stable SHELTR-S tokens, 10% builds sustainable housing solutions, and 5% supports the participant&apos;s registered shelter operations. 
                    Every new participant receives 100 SHELTR-S tokens ($100 value) as a welcome bonus, creating immediate 
                    engagement and platform adoption.
                  </p>
                  
                  <p className="mb-6">
                    We&apos;re not just building software—we&apos;re <strong>&ldquo;hacking homelessness&rdquo;</strong> by merging 
                    technological innovation with compassionate action, creating verifiable impact through 
                    blockchain transparency, and fostering an engaged community of like-minded partners, creators, 
                    and stakeholders aligned for sustainable change.
                  </p>
                  
                  <blockquote className="border-l-4 border-purple-500 pl-4 italic text-purple-700 dark:text-purple-300 my-6 bg-purple-50 dark:bg-purple-900/20 py-4 rounded-r-lg">
                    &ldquo;It costs a lot more to manage a problem than it does to solve it.&rdquo;
                    <br />
                    <cite className="text-sm font-normal">— Malcolm Gladwell, &ldquo;Million-Dollar Murray,&rdquo; The New Yorker (2006)</cite>
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
                        <li>• <strong>100% efficiency</strong> through direct blockchain distribution</li>
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
                        <Badge className="bg-blue-500">85% + Welcome Bonus</Badge>
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
                        <Badge className="bg-green-500">10% Housing Fund</Badge>
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
                        <span>Pillar 3: Shelter Operations Support</span>
                        <Badge className="bg-purple-500">5% Shelter Ops</Badge>
                      </CardTitle>
                      <CardDescription>
                        Support the participant&apos;s registered shelter operations and infrastructure
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Shelter Support Excellence</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Infrastructure maintenance & tech upgrades</li>
                            <li>• Staff development & training programs</li>
                            <li>• Program expansion & enhanced capacity</li>
                            <li>• Technology integration & optimization</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Special Rule</h4>
                          <ul className="text-sm space-y-1">
                            <li>• If participant not shelter-registered</li>
                            <li>• 5% automatically redirects to their housing fund</li>
                            <li>• Creates 15% total housing allocation</li>
                            <li>• Supports independent participants</li>
                          </ul>
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
                <h2 className="text-2xl font-bold mb-4">Access Complete Document</h2>
                <p className="mb-6">
                  View the full 25-page executive summary with detailed implementation roadmap, 
                  and comprehensive theory of change framework.
                </p>
                <div className="flex justify-center">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/01-overview/hacking_homelessness.md">
                    <Button className="bg-white text-purple-600 hover:bg-purple-50">
                      <Users className="h-4 w-4 mr-2" />
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