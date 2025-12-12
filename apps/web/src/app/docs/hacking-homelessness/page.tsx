'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Users, Target, Heart, Brain, Shield, Building2, AlertTriangle } from 'lucide-react';
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

      {/* Strategic Pivot Alert */}
      <section className="py-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-amber-900 dark:text-amber-100">
                  Theory of Change v3.0 - QR-Scan-to-POD & Shelter Ledger
                </h3>
                <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                  Our foundational thesis has evolved to emphasize the <strong>Shelter Ledger dual-purpose token</strong> for public accountability and SmartFund™ transparency, 
                  <strong>QR-Scan-to-POD instant deployment</strong>, <strong>POD Model A single-SKU housing</strong>, and <strong>Basecamp community infrastructure</strong> 
                  while maintaining our core mission of hacking homelessness through blockchain transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  Revolutionary QR-Scan-to-POD ecosystem combining Shelter Ledger blockchain transparency with enterprise payment infrastructure and modular housing deployment
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
                    SHELTR represents more than a platform—we&apos;re building a <strong>complete QR-Scan-to-POD ecosystem</strong> powered by the Shelter Ledger dual-purpose blockchain. Our revolutionary POD Model A housing units, Basecamp community infrastructure, and future drone delivery systems (2027) transform donations into tangible assets. The <strong>Shelter Ledger</strong> provides immutable track & trace for every dollar while enabling SmartFund™ investment growth, proving that <strong>blockchain transparency and social innovation</strong> can create lasting, structural change.
                  </p>
                  
                  <p className="mb-4">
                    Our revolutionary <strong>SmartFund™ distribution model</strong> ensures 80% of donations reach participants through 
                    virtual debit cards with <strong>zero cryptocurrency exposure</strong>, 15% builds POD Model A housing units tracked by the <strong>Shelter Ledger with guaranteed 4-6% APY institutional staking</strong>, and 5% supports the participant&apos;s registered shelter operations. 
                    The <strong>Shelter Ledger dual-purpose token</strong> provides immutable donation tracking AND SmartFund™ investment transparency, eliminating participant risk while maintaining complete public accountability.
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">QR-Scan-to-POD Ecosystem Powered by Shelter Ledger:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <strong>POD Model A:</strong> Single-SKU modular housing solution
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <strong>Basecamp Infrastructure:</strong> Community support & resource centers
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <strong>Drone Network (2027):</strong> Future emergency supply delivery
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <strong>Shelter Ledger:</strong> Dual-purpose track & trace + SmartFund™ transparency
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <strong>QR-Scan System:</strong> Instant donation-to-impact verification
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <strong>Enterprise Infrastructure:</strong> Zero-risk payment processing & guaranteed returns
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-6">
                    We&apos;re not just building software—we&apos;re <strong>&ldquo;hacking homelessness&rdquo;</strong> through our QR-Scan-to-POD system where every donation is tracked by the Shelter Ledger, transforming digital contributions into POD Model A housing units and Basecamp community infrastructure. The Shelter Ledger&apos;s dual-purpose architecture provides public accountability through immutable track & trace while enabling SmartFund™ investment growth, merging blockchain transparency with compassionate action for sustainable, structural change.
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

              {/* Shelter Ledger & QR-to-POD Revolution */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Shelter Ledger & QR-Scan-to-POD Revolution</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-2 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-600">
                        <Shield className="h-5 w-5" />
                        Shelter Ledger Dual-Purpose Token
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Track & Trace Every Dollar</strong> - Immutable public donation transparency</li>
                        <li>• <strong>SmartFund™ Investment Tracking</strong> - Real-time housing fund growth verification</li>
                        <li>• <strong>Permanent Audit Trail</strong> - Blockchain-verified donation records forever</li>
                        <li>• <strong>Public Accountability</strong> - Anyone can verify donation flow and impact</li>
                        <li>• <strong>QR-Scan Integration</strong> - Instant donation-to-POD deployment tracking</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-600">
                        <Building2 className="h-5 w-5" />
                        QR-Scan-to-POD Ecosystem
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>POD Model A</strong> - Single-SKU modular housing solution</li>
                        <li>• <strong>Basecamp Infrastructure</strong> - Community resource & support centers</li>
                        <li>• <strong>Zero Risk Architecture</strong> - Enterprise payment processing for participants</li>
                        <li>• <strong>Guaranteed Returns</strong> - 4-6% APY through Coinbase institutional staking</li>
                        <li>• <strong>Drone Network (2027)</strong> - Future emergency delivery capabilities</li>
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
                        <li>• <strong>No donation tracking</strong> prevents public accountability verification</li>
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
                        <li>• <strong>100% efficiency</strong> through SmartFund™ distribution</li>
                        <li>• <strong>&lt;1 hour delivery</strong> via QR-Scan instant virtual card loading</li>
                        <li>• <strong>Shelter Ledger transparency</strong> - track & trace every dollar publicly</li>
                        <li>• <strong>Zero volatility risk</strong> through enterprise payment infrastructure</li>
                        <li>• <strong>QR-Scan-to-POD</strong> - instant donation-to-housing verification</li>
                        <li>• <strong>POD Model A deployment</strong> - donations become tangible housing</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Visual Ecosystem Flow */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-8 mt-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">🏠 QR-Scan-to-POD Ecosystem Powered by Shelter Ledger</h3>
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
                            <span>No donation tracking or public accountability</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Cryptocurrency volatility exposes participants to risk</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                        <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-3">✅ SHELTR QR-Scan-to-POD Solution</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span>Shelter Ledger Track & Trace → 100% Public Accountability</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span>&lt;1 hour delivery via QR-Scan instant loading</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span>QR-to-POD: Donations → POD Model A + Basecamp</span>
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
                      <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">🏠 SmartFund™ Distribution Flow (Shelter Ledger Tracked)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-lg">80%</span>
                          </div>
                          <h5 className="font-semibold mb-1">Virtual Debit Cards</h5>
                          <p className="text-xs text-muted-foreground">Zero cryptocurrency exposure</p>
                          <p className="text-xs mt-1">→ Instant QR-Scan Loading</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-lg">15%</span>
                          </div>
                          <h5 className="font-semibold mb-1">Housing Fund + Shelter Ledger</h5>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>→ Guaranteed 4-6% APY Returns</div>
                            <div>→ POD Model A Deployment</div>
                            <div>→ Basecamp Infrastructure</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-lg">5%</span>
                          </div>
                          <h5 className="font-semibold mb-1">Shelter Operations Support</h5>
                          <p className="text-xs text-muted-foreground">Community infrastructure</p>
                          <p className="text-xs mt-1">→ Shelter Development</p>
                        </div>
                      </div>
                    </div>

                    {/* Complete AI Ecosystem Impact */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                      <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">🌟 Complete QR-Scan-to-POD Ecosystem Impact</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                        <div>
                          <div className="font-bold text-emerald-600">Zero-Risk Support</div>
                          <div className="text-xs text-muted-foreground">QR-Scan virtual cards</div>
                        </div>
                        <div>
                          <div className="font-bold text-orange-600">Shelter Ledger Tracking</div>
                          <div className="text-xs text-muted-foreground">Public accountability</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-600">POD Model A</div>
                          <div className="text-xs text-muted-foreground">Modular housing units</div>
                        </div>
                        <div>
                          <div className="font-bold text-blue-600">Basecamp Network</div>
                          <div className="text-xs text-muted-foreground">Community infrastructure</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three-Pillar Framework */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Shelter Ledger Three-Pillar Impact Framework</h2>
                <div className="space-y-6">
                  <Card className="border-2 border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Pillar 1: Immediate Dignity & QR-Scan Stability</span>
                        <Badge className="bg-emerald-500">80% Virtual Card Allocation</Badge>
                      </CardTitle>
                      <CardDescription>
                        Preserve human dignity through instant, stable value delivery with zero cryptocurrency risk via QR-Scan virtual card loading
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Enterprise Technical Implementation</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Virtual debit cards with global Visa/Mastercard acceptance</li>
                            <li>• Zero transaction fees for participants</li>
                            <li>• QR-Scan instant card loading via enterprise payment processing</li>
                            <li>• Shelter Ledger tracks every dollar for public accountability</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">QR-Scan Impact Metrics</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Average delivery: &lt;1 hour via QR-Scan</li>
                            <li>• Purchasing power: 100% preserved (zero volatility)</li>
                            <li>• Shelter Ledger: 100% public donation tracking</li>
                            <li>• Financial autonomy: 85% satisfaction target</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Pillar 2: POD Model A Deployment & Shelter Ledger Housing Fund</span>
                        <Badge className="bg-orange-500">15% Housing Fund + Guaranteed Returns</Badge>
                      </CardTitle>
                      <CardDescription>
                        Transform digital donations into POD Model A housing units and Basecamp infrastructure, tracked by Shelter Ledger with guaranteed institutional returns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-4 text-center">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <div className="font-bold text-blue-600">Shelter Ledger Housing Fund</div>
                            <div className="text-xs font-semibold">Guaranteed 4-6% APY</div>
                            <div className="text-xs text-muted-foreground">Coinbase institutional staking</div>
                            <div className="text-xs text-muted-foreground">Public track & trace</div>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                            <div className="font-bold text-green-600">POD Model A</div>
                            <div className="text-xs font-semibold">Single-SKU Housing</div>
                            <div className="text-xs text-muted-foreground">Modular design</div>
                            <div className="text-xs text-muted-foreground">Climate-controlled</div>
                          </div>
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                            <div className="font-bold text-purple-600">Basecamp Infrastructure</div>
                            <div className="text-xs font-semibold">Community Centers</div>
                            <div className="text-xs text-muted-foreground">Resource hubs</div>
                            <div className="text-xs text-muted-foreground">Support services</div>
                          </div>
                          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                            <div className="font-bold text-orange-600">Drone Network (2027)</div>
                            <div className="text-xs font-semibold">Future Deployment</div>
                            <div className="text-xs text-muted-foreground">Emergency supplies</div>
                            <div className="text-xs text-muted-foreground">Rapid response</div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">🏠 POD Model A Manufacturing Excellence & Shelter Ledger Tracking</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span><strong>Single-SKU Efficiency:</strong> Streamlined production & cost reduction</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span><strong>Quality Assurance:</strong> Rigorous testing for durability & safety</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span><strong>Community Feedback:</strong> User-driven design improvements</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span><strong>Shelter Ledger Tracking:</strong> Every POD deployment publicly verified</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span><strong>Modular Design:</strong> Standardized components enable rapid scaling</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                <span><strong>QR-to-POD:</strong> Instant donation-to-deployment verification</span>
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
                        <span>Pillar 3: Shelter Operations & Basecamp Support</span>
                        <Badge className="bg-purple-500">5% Shelter Ops</Badge>
                      </CardTitle>
                      <CardDescription>
                        Support shelter operations and Basecamp community infrastructure development
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Shelter & Basecamp Support</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Infrastructure maintenance & technology upgrades</li>
                            <li>• Staff development & training programs</li>
                            <li>• Basecamp community center operations</li>
                            <li>• Technology integration & system optimization</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Special Rule</h4>
                          <ul className="text-sm space-y-1">
                            <li>• If participant not shelter-registered</li>
                            <li>• 5% automatically redirects to their housing fund</li>
                            <li>• Creates 20% total housing allocation</li>
                            <li>• Shelter Ledger tracks all allocations publicly</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Success Metrics & Shelter Ledger Impact */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Shelter Ledger Success Metrics & Impact Measurement</h2>
                
                {/* Platform Performance KPIs */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="border-2 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Shelter Ledger Technical Excellence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Shelter Ledger Uptime</span>
                          <Badge className="bg-green-500 text-white">99.99% Target</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>QR-Scan Transaction Speed</span>
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

                  <Card className="border-2 border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-emerald-600" />
                        QR-Scan User Engagement
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
                          <span>Satisfaction Score</span>
                          <Badge className="bg-orange-500 text-white">&gt;50 NPS Target</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Support Response</span>
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
                      QR-Scan-to-POD Infrastructure Outcomes (Shelter Ledger Verified)
                    </CardTitle>
                    <CardDescription>
                      Measurable impact through POD Model A deployment, Basecamp infrastructure, and Shelter Ledger public accountability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-blue-600">POD Model A & Basecamp Deployment</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>POD Model A Deployment</span>
                            <span className="font-semibold">500 units / 18 months</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Basecamp Centers</span>
                            <span className="font-semibold">25 locations / 24 months</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shelter Ledger Tracking</span>
                            <span className="font-semibold">100% public verification</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Manufacturing Jobs</span>
                            <span className="font-semibold">200+ positions</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-green-600">POD Model A Housing Outcomes</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Transition Rate</span>
                            <span className="font-semibold">65% stable housing</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Housing Retention</span>
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
                        <h4 className="font-semibold text-orange-600">Quality of Life Improvements</h4>
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
                            <span>Basecamp Access</span>
                            <span className="font-semibold">24/7 support services</span>
                          </div>
                          <div className="flex justify-between">
                            <span>POD Model A Satisfaction</span>
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
                <h2 className="text-2xl font-bold mb-4">Access Complete QR-Scan-to-POD Thesis</h2>
                <p className="mb-6">
                  View the full comprehensive document with detailed Shelter Ledger architecture, 
                  POD Model A specifications, Basecamp infrastructure plans, SmartFund™ distribution model, and complete QR-Scan-to-POD ecosystem implementation.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">🏠 Shelter Ledger</div>
                    <div className="text-xs opacity-90">Dual-purpose track & trace + SmartFund™ transparency</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">📊 POD Model A</div>
                    <div className="text-xs opacity-90">Single-SKU modular housing & Basecamp infrastructure</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">🔧 QR-to-POD System</div>
                    <div className="text-xs opacity-90">Instant donation-to-deployment verification</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/overview/hacking_homelessness.md" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-white text-purple-600 hover:bg-purple-50">
                      <Shield className="h-4 w-4 mr-2" />
                      View Complete Thesis on GitHub
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