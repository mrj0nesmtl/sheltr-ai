'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Users, TrendingUp, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
                  <span>Version 2.0.0 - Complete Ecosystem Edition</span>
                  <span>•</span>
                  <span>September 21, 2025</span>
                  <span>•</span>
                  <Badge className="bg-green-500 text-white text-xs">Enhanced with Physical Infrastructure</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                    SHELTR represents more than a platform—we&apos;re building a <strong>complete ecosystem</strong> that includes revolutionary housing solutions (PODS), sustainable transportation (MOBI electric bikes), advanced delivery systems (drones), and a fabrication pipeline that turns donations into tangible infrastructure. We&apos;re joining the brilliant collective of Internet Angels doing transformative work, proving that technology and social innovation can create lasting, structural change.
                  </p>
                  
                  <p className="mb-4">
                    Our revolutionary <strong>SmartFund™ distribution model</strong> ensures 85% of donations reach participants as 
                    stable SHELTR-S tokens, 10% builds sustainable housing solutions through our PODS fabrication pipeline, and 5% supports the participant&apos;s registered shelter operations. 
                    Every new participant receives 100 SHELTR-S tokens ($100 value) as a welcome bonus, creating immediate 
                    engagement and platform adoption.
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">🏗️ The SHELTR Ecosystem Transforms Donations Into Tangible Infrastructure:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <strong>PODS Housing Units:</strong> Modular, secure, mobile housing solutions
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <strong>MOBI Electric Bikes:</strong> Sustainable transportation for employment access
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <strong>Drone Delivery Network:</strong> Rapid delivery of essential supplies
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <strong>Digital Platform:</strong> Blockchain-verified donations & AI-powered support
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-6">
                    We&apos;re not just building software—we&apos;re <strong>&ldquo;hacking homelessness&rdquo;</strong> by creating a complete ecosystem that turns digital donations into physical infrastructure, merging technological innovation with compassionate action, and fostering an engaged community of stakeholders aligned for sustainable, structural change.
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

                {/* Visual Ecosystem Flow */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-8 mt-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">🔄 Complete Ecosystem Transformation Flow</h3>
                  <div className="space-y-6">
                    {/* Traditional vs SHELTR */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <h4 className="font-bold text-red-700 dark:text-red-300 mb-3">❌ Traditional Model Problems</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Multiple Intermediaries → 60-70% Efficiency</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>24-72 hour delays in crisis support</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>No tangible infrastructure creation</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <h4 className="font-bold text-green-700 dark:text-green-300 mb-3">✅ SHELTR Ecosystem Solution</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Blockchain Direct → 100% Efficiency + Physical Assets</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>&lt;1 hour delivery via QR codes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Donations → PODS + MOBI + Drones</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SmartFund Distribution Visual */}
                    <div className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
                      <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">💰 SmartFund™ Distribution Flow</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-lg">85%</span>
                          </div>
                          <h5 className="font-semibold mb-1">SHELTR-S Stable Tokens</h5>
                          <p className="text-xs text-muted-foreground">+ 100 Token Welcome Bonus</p>
                          <p className="text-xs mt-1">→ Immediate Dignified Support</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-lg">10%</span>
                          </div>
                          <h5 className="font-semibold mb-1">Physical Infrastructure Fund</h5>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>→ PODS Housing Units</div>
                            <div>→ MOBI Electric Bikes</div>
                            <div>→ Drone Delivery Network</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-lg">5%</span>
                          </div>
                          <h5 className="font-semibold mb-1">Shelter Operations Support</h5>
                          <p className="text-xs text-muted-foreground">+ Community Governance</p>
                          <p className="text-xs mt-1">→ Community-Driven Development</p>
                        </div>
                      </div>
                    </div>

                    {/* Complete Ecosystem Impact */}
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                      <h4 className="font-bold text-orange-700 dark:text-orange-300 mb-4 text-center">🌟 Complete Ecosystem Impact</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                        <div>
                          <div className="font-bold text-blue-600">Immediate Support</div>
                          <div className="text-xs text-muted-foreground">Dignified assistance</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-600">Sustainable Housing</div>
                          <div className="text-xs text-muted-foreground">PODS solutions</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-600">Employment Access</div>
                          <div className="text-xs text-muted-foreground">MOBI transportation</div>
                        </div>
                        <div>
                          <div className="font-bold text-orange-600">Emergency Response</div>
                          <div className="text-xs text-muted-foreground">Drone delivery</div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                        <span>Pillar 2: Physical Infrastructure & Manufacturing Pipeline</span>
                        <Badge className="bg-green-500">10% Infrastructure Fund</Badge>
                      </CardTitle>
                      <CardDescription>
                        Transform digital donations into tangible infrastructure through our comprehensive fabrication ecosystem
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-4 text-center">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <div className="font-bold text-blue-600">50%</div>
                            <div className="text-xs font-semibold">PODS Housing</div>
                            <div className="text-xs text-muted-foreground">$12K per 1-person unit</div>
                            <div className="text-xs text-muted-foreground">$18K per 2-person unit</div>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                            <div className="font-bold text-green-600">25%</div>
                            <div className="text-xs font-semibold">MOBI Transportation</div>
                            <div className="text-xs text-muted-foreground">$2.5K per electric bike</div>
                            <div className="text-xs text-muted-foreground">50+ mile range</div>
                          </div>
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                            <div className="font-bold text-purple-600">15%</div>
                            <div className="text-xs font-semibold">Drone Network</div>
                            <div className="text-xs text-muted-foreground">$8K per drone + station</div>
                            <div className="text-xs text-muted-foreground">5-mile coverage</div>
                          </div>
                          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                            <div className="font-bold text-orange-600">10%</div>
                            <div className="text-xs font-semibold">Fabrication Infrastructure</div>
                            <div className="text-xs text-muted-foreground">Manufacturing equipment</div>
                            <div className="text-xs text-muted-foreground">Quality control</div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">🏭 Manufacturing Excellence & Scale</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span><strong>Production Optimization:</strong> 15-25% cost reduction annually</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span><strong>Quality Assurance:</strong> Rigorous testing for durability</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span><strong>Community Feedback:</strong> User-driven design improvements</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span><strong>Supply Chain:</strong> Strategic partnerships optimize costs</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span><strong>Modular Design:</strong> Standardized components enable scaling</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                <span><strong>Technology Advancement:</strong> Continuous R&D improvements</span>
                              </div>
                            </div>
                          </div>
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



              {/* Success Metrics & Impact Measurement */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Success Metrics & Impact Measurement</h2>
                
                {/* Platform Performance KPIs */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Technical Excellence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>System Uptime</span>
                          <Badge className="bg-green-500 text-white">99.99% Target</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Transaction Speed</span>
                          <Badge className="bg-blue-500 text-white">&lt;5 seconds</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Blockchain Confirmations</span>
                          <Badge className="bg-purple-500 text-white">&lt;30 seconds</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Security Incidents</span>
                          <Badge className="bg-green-500 text-white">Zero Target</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Concurrent Users</span>
                          <Badge className="bg-orange-500 text-white">100K Support</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        User Engagement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Daily Active Users</span>
                          <Badge className="bg-blue-500 text-white">10K by Year 2</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Donation Volume</span>
                          <Badge className="bg-green-500 text-white">$3M by Year 5</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>User Retention</span>
                          <Badge className="bg-purple-500 text-white">80% Annual</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>NPS Score</span>
                          <Badge className="bg-orange-500 text-white">&gt;50 Target</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Support Resolution</span>
                          <Badge className="bg-teal-500 text-white">&lt;24 hours</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Physical Infrastructure Outcomes */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Physical Infrastructure Outcomes (Blockchain-Verified)
                    </CardTitle>
                    <CardDescription>
                      Measurable impact through tangible asset deployment and community transformation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-blue-600">Infrastructure Deployment</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>PODS Deployment</span>
                            <span className="font-semibold">500 units / 18 months</span>
                          </div>
                          <div className="flex justify-between">
                            <span>MOBI Distribution</span>
                            <span className="font-semibold">1,000 bikes / 24 months</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Drone Network</span>
                            <span className="font-semibold">50-mile coverage</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Manufacturing Jobs</span>
                            <span className="font-semibold">200+ positions</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-green-600">Housing Outcomes</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Transition Rate</span>
                            <span className="font-semibold">65% stable housing</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Retention Rate</span>
                            <span className="font-semibold">80% after 18 months</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cost Effectiveness</span>
                            <span className="font-semibold">$12K avg/transition</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time to Housing</span>
                            <span className="font-semibold">4 months average</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-orange-600">Quality of Life</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Health Improvement</span>
                            <span className="font-semibold">40% ER reduction</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Employment Rate</span>
                            <span className="font-semibold">55% within 18 months</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Emergency Response</span>
                            <span className="font-semibold">&lt;15 min delivery</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PODS Satisfaction</span>
                            <span className="font-semibold">90% satisfaction</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Economic Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Economic Impact & ROI
                    </CardTitle>
                    <CardDescription>
                      Quantifiable economic benefits and cost savings generated by the SHELTR ecosystem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Local Economic Stimulus</span>
                          <span className="font-semibold text-green-600">$2.3x multiplier</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Healthcare Savings</span>
                          <span className="font-semibold text-blue-600">$8K annual/participant</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Criminal Justice Savings</span>
                          <span className="font-semibold text-purple-600">$12K annual/participant</span>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Tax Revenue Generation</span>
                          <span className="font-semibold text-orange-600">$5K annual/employed</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Platform Fee Capture</span>
                          <span className="font-semibold text-teal-600">$2.4M at 1% market</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Token Appreciation</span>
                          <span className="font-semibold text-purple-600">Strategic value</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Full Document Access */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Access Complete Ecosystem Document</h2>
                <p className="mb-6">
                  View the full 45-page comprehensive document with detailed implementation roadmap, 
                  manufacturing specifications, competitive analysis, and complete ecosystem architecture including PODS, MOBI, and drone systems.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">✨ Enhanced Content</div>
                    <div className="text-xs opacity-90">Physical infrastructure vision</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">📊 Market Analysis</div>
                    <div className="text-xs opacity-90">Competitive differentiation matrix</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">🔧 Technical Specs</div>
                    <div className="text-xs opacity-90">Smart contract examples</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/01-overview/hacking_homelessness.md">
                    <Button className="bg-white text-purple-600 hover:bg-purple-50">
                      <Users className="h-4 w-4 mr-2" />
                      View Complete Document on GitHub
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