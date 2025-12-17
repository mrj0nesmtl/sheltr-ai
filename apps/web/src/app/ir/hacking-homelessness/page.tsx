'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Users, TrendingUp, Target, Heart, Brain, Zap, Shield, CreditCard, Building2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function IRIRHackingHomelessnessPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/ir/dataroom" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Investor Access
              </Badge>
              <Link href="/ir/dataroom">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Data Room
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-purple-50 to-emerald-50 dark:from-purple-900/20 dark:to-emerald-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <Brain className="h-12 w-12 text-purple-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">Hacking Homelessness: Better to Solve than Manage</h1>
                  <Badge className="bg-purple-500 text-white text-sm">THESIS</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Revolutionary AI-powered ecosystem combining enterprise payment infrastructure with blockchain transparency and physical infrastructure deployment
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 2.0.0 - Published</span>
                  <span>•</span>
                  <span>September 26, 2025</span>
                  <span>•</span>
                  <Badge className="bg-emerald-500 text-white text-xs">TECH-FOR-GOOD</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/overview/hacking_homelessness.md" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Brain className="h-4 w-4 mr-2" />
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
                Tech-for-Good Thesis
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                This thesis presents SHELTR&apos;s revolutionary approach combining AI-powered resource allocation, 
                enterprise payment infrastructure, and physical asset deployment to hack homelessness through technology innovation.
              </p>
            </div>

            <div className="space-y-8">
              {/* Executive Abstract */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Abstract: Better to Solve than Manage</h2>
                <div className="space-y-4 text-lg leading-relaxed">
                  <p className="mb-4">
                    SHELTR was born from a simple but powerful realization: <strong>&ldquo;It&apos;s better to solve than to manage.&rdquo;</strong> 
                    This philosophy, inspired by Malcolm Gladwell&apos;s groundbreaking essay &ldquo;Million-Dollar Murray&rdquo; in The New Yorker, 
                    became the foundation of our approach to addressing homelessness through <strong>AI-powered technology innovation</strong>.
                  </p>
                  
                  <p className="mb-4">
                    This journey into <strong>tech-for-good</strong> wasn&apos;t born in a boardroom—it emerged from witnessing 
                    the disconnect between charitable intentions and measurable impact. Too often, well-meaning donations 
                    disappeared into administrative overhead, leaving both donors frustrated and those in need still struggling.
                  </p>
                  
                  <p className="mb-4">
                    SHELTR represents more than a platform—we&apos;re building a <strong>complete AI-powered ecosystem</strong> that includes revolutionary housing solutions (PODS), sustainable transportation (MOBI electric bikes), advanced delivery systems (drones), and a fabrication pipeline that turns donations into tangible infrastructure. We&apos;re joining the brilliant collective of Internet Angels doing transformative work, proving that <strong>AI and social innovation</strong> can create lasting, structural change.
                  </p>
                  
                  <p className="mb-4">
                    Our revolutionary <strong>SmartFund™ distribution model</strong> ensures 80% of donations reach participants through 
                    virtual debit cards with <strong>zero cryptocurrency exposure</strong>, 15% builds sustainable housing solutions through <strong>guaranteed 4-6% APY institutional staking</strong> and SHELTR token tracking, and 5% supports the participant&apos;s registered shelter operations. 
                    This enterprise-grade architecture eliminates participant risk while maintaining complete blockchain transparency.
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">🤖 AI-Powered SHELTR Ecosystem Transforms Donations Into Tangible Infrastructure:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <strong>PODS Housing Units:</strong> AI-optimized modular housing solutions
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <strong>MOBI Electric Bikes:</strong> Smart transportation with AI route optimization
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <strong>Drone Delivery Network:</strong> AI-coordinated emergency supply delivery
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <strong>AI-Powered Platform:</strong> Intelligent resource allocation & predictive analytics
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <strong>Tech-for-Good Innovation:</strong> Cutting-edge AI assistance & automated support
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <strong>Enterprise Infrastructure:</strong> Zero-risk payment processing & guaranteed returns
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-6">
                    We&apos;re not just building software—we&apos;re <strong>&ldquo;hacking homelessness&rdquo;</strong> by creating a complete AI-powered ecosystem that turns digital donations into physical infrastructure, merging technological innovation with compassionate action, and fostering an engaged community of stakeholders aligned for sustainable, structural change.
                  </p>
                  
                  <blockquote className="border-l-4 border-purple-500 pl-4 italic text-purple-700 dark:text-purple-300 my-6 bg-purple-50 dark:bg-purple-900/20 py-4 rounded-r-lg">
                    &ldquo;It costs a lot more to manage a problem than it does to solve it.&rdquo;
                    <br />
                    <cite className="text-sm font-normal">
                      — Malcolm Gladwell, <a href="https://www.newyorker.com/magazine/2006/02/13/million-dollar-murray" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-900 dark:hover:text-purple-100">&ldquo;Million-Dollar Murray,&rdquo;</a> The New Yorker (2006)
                    </cite>
                    <div className="mt-3 not-italic">
                      <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/overview/Million-Dollar-Murray.pdf" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30">
                          <Download className="h-4 w-4 mr-2" />
                          Read Original Article (PDF)
                        </Button>
                      </a>
                    </div>
                  </blockquote>
                </div>
              </div>

              {/* AI & Tech-for-Good Revolution */}
              <div>
                <h2 className="text-3xl font-bold mb-6">AI & Tech-for-Good Revolution</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-2 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-600">
                        <Brain className="h-5 w-5" />
                        AI-Powered Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Intelligent Resource Allocation</strong> - AI optimizes donation distribution</li>
                        <li>• <strong>Predictive Analytics</strong> - Anticipate participant needs and optimize support</li>
                        <li>• <strong>Smart Financial Insights</strong> - AI-driven spending analysis and budgeting assistance</li>
                        <li>• <strong>Automated Support Systems</strong> - 24/7 AI assistance for participants and shelters</li>
                        <li>• <strong>Manufacturing Optimization</strong> - AI-enhanced production planning and quality control</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-600">
                        <Zap className="h-5 w-5" />
                        Enterprise Tech-for-Good
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Zero Risk Architecture</strong> - Enterprise payment processing eliminates crypto exposure</li>
                        <li>• <strong>Guaranteed Returns</strong> - 4-6% APY through Coinbase institutional staking</li>
                        <li>• <strong>Blockchain Transparency</strong> - Complete donation tracking without participant risk</li>
                        <li>• <strong>Global Payment Infrastructure</strong> - Visa/Mastercard virtual cards worldwide</li>
                        <li>• <strong>Traditional Funding Model</strong> - Enterprise partnerships eliminate ICO speculation</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Theory of Change Framework */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Theory of Change Framework</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-2 border-red-500/20">
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
                        <li>• <strong>Cryptocurrency volatility</strong> exposes vulnerable populations to risk</li>
                        <li>• <strong>Lack of AI optimization</strong> leads to inefficient resource allocation</li>
                        <li>• <strong>No physical infrastructure</strong> creation from digital donations</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-600">
                        <Heart className="h-5 w-5" />
                        SHELTR Solution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>100% efficiency</strong> through AI-optimized distribution</li>
                        <li>• <strong>&lt;1 hour delivery</strong> via QR code instant virtual card loading</li>
                        <li>• <strong>Complete transparency</strong> with blockchain verification</li>
                        <li>• <strong>Zero volatility risk</strong> through enterprise payment infrastructure</li>
                        <li>• <strong>AI-powered optimization</strong> for intelligent resource allocation</li>
                        <li>• <strong>Physical infrastructure creation</strong> - donations become tangible assets</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Visual Ecosystem Flow */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-8 mt-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">🤖 AI-Powered Complete Ecosystem Transformation Flow</h3>
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
                            <span>No AI optimization or tangible infrastructure</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Cryptocurrency volatility exposes participants to risk</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                        <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-3">✅ SHELTR Ecosystem Solution</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span>AI-Optimized Direct → 100% Efficiency + Physical Assets</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span>&lt;1 hour delivery via smart QR codes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span>AI-Enhanced: Donations → PODS + MOBI + Drones</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span>Zero risk virtual cards + guaranteed 4-6% APY returns</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SmartFund Distribution Visual */}
                    <div className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
                      <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">🧠 AI-Enhanced SmartFund™ Distribution Flow</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-lg">80%</span>
                          </div>
                          <h5 className="font-semibold mb-1">Virtual Debit Cards</h5>
                          <p className="text-xs text-muted-foreground">Zero cryptocurrency exposure</p>
                          <p className="text-xs mt-1">→ AI-Enhanced Financial Support</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-lg">15%</span>
                          </div>
                          <h5 className="font-semibold mb-1">Housing Fund + SHELTR Tracking</h5>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>→ Guaranteed 4-6% APY Returns</div>
                            <div>→ AI-Optimized PODS/MOBI/Drones</div>
                            <div>→ Coinbase Institutional Staking</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-lg">5%</span>
                          </div>
                          <h5 className="font-semibold mb-1">Shelter Operations Support</h5>
                          <p className="text-xs text-muted-foreground">+ AI-Powered Community Support</p>
                          <p className="text-xs mt-1">→ Smart Community Development</p>
                        </div>
                      </div>
                    </div>

                    {/* Complete AI Ecosystem Impact */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                      <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">🌟 Complete AI-Powered Ecosystem Impact</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                        <div>
                          <div className="font-bold text-emerald-600">Zero-Risk Support</div>
                          <div className="text-xs text-muted-foreground">AI-enhanced virtual cards</div>
                        </div>
                        <div>
                          <div className="font-bold text-orange-600">Guaranteed Growth</div>
                          <div className="text-xs text-muted-foreground">4-6% APY housing fund</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-600">Smart Infrastructure</div>
                          <div className="text-xs text-muted-foreground">AI-optimized PODS/MOBI</div>
                        </div>
                        <div>
                          <div className="font-bold text-blue-600">Intelligent Response</div>
                          <div className="text-xs text-muted-foreground">AI-coordinated drone delivery</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three-Pillar Framework */}
              <div>
                <h2 className="text-3xl font-bold mb-6">AI-Enhanced Three-Pillar Impact Framework</h2>
                <div className="space-y-6">
                  <Card className="border-2 border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Pillar 1: Immediate Dignity & AI-Enhanced Stability</span>
                        <Badge className="bg-emerald-500">80% Virtual Card Allocation</Badge>
                      </CardTitle>
                      <CardDescription>
                        Preserve human dignity through instant, stable value delivery with zero cryptocurrency risk and AI-powered financial support
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Enterprise Technical Implementation</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Virtual debit cards with global Visa/Mastercard acceptance</li>
                            <li>• Zero transaction fees for participants</li>
                            <li>• Enterprise payment processing with instant card loading</li>
                            <li>• AI-powered spending insights and financial literacy tools</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">AI-Enhanced Impact Metrics</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Average delivery: &lt;1 hour via smart systems</li>
                            <li>• Purchasing power: 100% preserved (zero volatility)</li>
                            <li>• AI emergency response: &lt;5 minutes</li>
                            <li>• Financial autonomy: 85% satisfaction target</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Pillar 2: AI-Optimized Physical Infrastructure & Housing Fund</span>
                        <Badge className="bg-orange-500">15% Housing Fund + Guaranteed Returns</Badge>
                      </CardTitle>
                      <CardDescription>
                        Transform digital donations into tangible infrastructure through AI-enhanced manufacturing and guaranteed institutional returns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-4 text-center">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <div className="font-bold text-blue-600">Housing Fund</div>
                            <div className="text-xs font-semibold">Guaranteed 4-6% APY</div>
                            <div className="text-xs text-muted-foreground">Coinbase institutional staking</div>
                            <div className="text-xs text-muted-foreground">SHELTR token tracking</div>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                            <div className="font-bold text-green-600">AI-Optimized PODS</div>
                            <div className="text-xs font-semibold">Smart Housing Units</div>
                            <div className="text-xs text-muted-foreground">$12K per 1-person unit</div>
                            <div className="text-xs text-muted-foreground">$18K per 2-person unit</div>
                          </div>
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                            <div className="font-bold text-purple-600">Smart MOBI Bikes</div>
                            <div className="text-xs font-semibold">AI Route Optimization</div>
                            <div className="text-xs text-muted-foreground">$2.5K per electric bike</div>
                            <div className="text-xs text-muted-foreground">50+ mile smart range</div>
                          </div>
                          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                            <div className="font-bold text-orange-600">AI Drone Network</div>
                            <div className="text-xs font-semibold">Intelligent Coordination</div>
                            <div className="text-xs text-muted-foreground">$8K per drone + station</div>
                            <div className="text-xs text-muted-foreground">5-mile AI coverage</div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">🤖 AI-Enhanced Manufacturing Excellence & Scale</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span><strong>AI Production Optimization:</strong> 15-25% cost reduction annually</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span><strong>Intelligent Quality Assurance:</strong> AI-powered testing for durability</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span><strong>Smart Community Feedback:</strong> AI-analyzed user-driven improvements</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span><strong>AI Supply Chain:</strong> Intelligent partnerships optimize costs</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span><strong>Smart Modular Design:</strong> AI-enhanced standardized components</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                <span><strong>Intelligent R&D:</strong> AI-driven continuous improvements</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Pillar 3: AI-Powered Shelter Operations Support</span>
                        <Badge className="bg-purple-500">5% Smart Shelter Ops</Badge>
                      </CardTitle>
                      <CardDescription>
                        Support shelter operations with AI-enhanced community support and intelligent resource allocation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">AI-Enhanced Shelter Support</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Smart infrastructure maintenance & tech upgrades</li>
                            <li>• AI-powered staff development & training programs</li>
                            <li>• Intelligent program expansion & capacity optimization</li>
                            <li>• AI-enhanced technology integration & system optimization</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Smart Special Rule</h4>
                          <ul className="text-sm space-y-1">
                            <li>• If participant not shelter-registered</li>
                            <li>• 5% automatically redirects to their housing fund</li>
                            <li>• Creates 20% total housing allocation with AI optimization</li>
                            <li>• AI-enhanced support for independent participants</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Success Metrics & AI Impact */}
              <div>
                <h2 className="text-3xl font-bold mb-6">AI-Enhanced Success Metrics & Impact Measurement</h2>
                
                {/* Platform Performance KPIs */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="border-2 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        AI-Powered Technical Excellence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>AI System Uptime</span>
                          <Badge className="bg-green-500 text-white">99.99% Target</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Smart Transaction Speed</span>
                          <Badge className="bg-blue-500 text-white">&lt;5 seconds</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>AI-Optimized Confirmations</span>
                          <Badge className="bg-purple-500 text-white">&lt;30 seconds</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>AI Security Incidents</span>
                          <Badge className="bg-green-500 text-white">Zero Target</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Intelligent User Support</span>
                          <Badge className="bg-orange-500 text-white">100K Concurrent</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-emerald-600" />
                        AI-Enhanced User Engagement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>AI-Supported Daily Users</span>
                          <Badge className="bg-blue-500 text-white">10K by Year 2</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Smart Donation Volume</span>
                          <Badge className="bg-green-500 text-white">$3M by Year 5</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>AI-Enhanced Retention</span>
                          <Badge className="bg-purple-500 text-white">80% Annual</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>AI Satisfaction Score</span>
                          <Badge className="bg-orange-500 text-white">&gt;50 NPS Target</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Intelligent Support</span>
                          <Badge className="bg-teal-500 text-white">&lt;24 hours</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI-Enhanced Physical Infrastructure Outcomes */}
                <Card className="mb-8 border-2 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      AI-Optimized Physical Infrastructure Outcomes (Blockchain-Verified)
                    </CardTitle>
                    <CardDescription>
                      Measurable impact through AI-enhanced tangible asset deployment and intelligent community transformation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-blue-600">AI-Enhanced Infrastructure Deployment</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Smart PODS Deployment</span>
                            <span className="font-semibold">500 units / 18 months</span>
                          </div>
                          <div className="flex justify-between">
                            <span>AI MOBI Distribution</span>
                            <span className="font-semibold">1,000 bikes / 24 months</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Intelligent Drone Network</span>
                            <span className="font-semibold">50-mile AI coverage</span>
                          </div>
                          <div className="flex justify-between">
                            <span>AI-Enhanced Manufacturing</span>
                            <span className="font-semibold">200+ smart jobs</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-green-600">AI-Optimized Housing Outcomes</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Smart Transition Rate</span>
                            <span className="font-semibold">65% stable housing</span>
                          </div>
                          <div className="flex justify-between">
                            <span>AI-Enhanced Retention</span>
                            <span className="font-semibold">80% after 18 months</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Intelligent Cost Effectiveness</span>
                            <span className="font-semibold">$12K avg/transition</span>
                          </div>
                          <div className="flex justify-between">
                            <span>AI-Optimized Time to Housing</span>
                            <span className="font-semibold">4 months average</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-orange-600">AI-Enhanced Quality of Life</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Smart Health Improvement</span>
                            <span className="font-semibold">40% ER reduction</span>
                          </div>
                          <div className="flex justify-between">
                            <span>AI-Enhanced Employment</span>
                            <span className="font-semibold">55% within 18 months</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Intelligent Emergency Response</span>
                            <span className="font-semibold">&lt;15 min delivery</span>
                          </div>
                          <div className="flex justify-between">
                            <span>AI-Optimized PODS Satisfaction</span>
                            <span className="font-semibold">90% satisfaction</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Full Document Access */}
              <div className="bg-gradient-to-r from-purple-600 to-emerald-600 text-white rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Access Complete AI & Tech-for-Good Thesis</h2>
                <p className="mb-6">
                  View the full comprehensive document with detailed AI implementation roadmap, 
                  enterprise infrastructure specifications, competitive analysis, and complete ecosystem architecture including AI-optimized PODS, smart MOBI, and intelligent drone systems.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">🤖 AI-Enhanced Content</div>
                    <div className="text-xs opacity-90">Intelligent resource allocation & predictive analytics</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">📊 Enterprise Analysis</div>
                    <div className="text-xs opacity-90">Zero-risk architecture & guaranteed returns</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">🔧 Tech-for-Good Specs</div>
                    <div className="text-xs opacity-90">Smart contract examples & AI integration</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/overview/hacking_homelessness.md" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-white text-purple-600 hover:bg-purple-50">
                      <Brain className="h-4 w-4 mr-2" />
                      View Complete AI Thesis on GitHub
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

