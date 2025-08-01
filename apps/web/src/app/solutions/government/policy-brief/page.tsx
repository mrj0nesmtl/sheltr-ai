'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Users, BarChart3, TrendingUp, CheckCircle, Shield, FileText, Download, DollarSign, Calendar, AlertTriangle, Target, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function GovernmentPolicyBriefPage() {
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
              <Link href="/solutions/government">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Solutions
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <MapPin className="h-12 w-12 text-purple-600" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">SHELTR Policy Brief</h1>
                  <Badge className="bg-purple-500 text-white">Government</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  Evidence-Based Homelessness Policy Through Blockchain Technology
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Policy Brief</span>
                  <span>•</span>
                  <span>January 2025</span>
                  <span>•</span>
                  <span>20 min read</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">Implementation Ready</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Government Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              <h2>Executive Summary</h2>
              <p>
                This policy brief outlines how SHELTR enables government agencies to implement 
                evidence-based homelessness policy through comprehensive data analytics, transparent 
                budget allocation, and measurable outcomes. Our blockchain-powered platform provides 
                unprecedented visibility into program effectiveness and public fund utilization.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-purple-500/20 bg-purple-50/50 dark:bg-purple-900/10">
                <CardHeader className="text-center">
                  <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-purple-600">35% Reduction</CardTitle>
                  <CardDescription>Administrative costs</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-900/10">
                <CardHeader className="text-center">
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-green-600">50% Faster</CardTitle>
                  <CardDescription>Policy impact assessment</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10">
                <CardHeader className="text-center">
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-blue-600">25% Improvement</CardTitle>
                  <CardDescription>Inter-agency coordination</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Current Challenges */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Current Policy Challenges</h2>
              <p className="text-xl text-muted-foreground">
                Addressing systemic barriers to effective homelessness intervention
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-red-500/20 bg-red-50/50 dark:bg-red-900/10">
                <CardHeader className="text-center">
                  <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Data Silos</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Fragmented data across agencies prevents comprehensive analysis
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-500/20 bg-orange-50/50 dark:bg-orange-900/10">
                <CardHeader className="text-center">
                  <DollarSign className="h-10 w-10 text-orange-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Budget Opacity</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Limited visibility into fund allocation and program effectiveness
                  </p>
                </CardContent>
              </Card>

              <Card className="border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-900/10">
                <CardHeader className="text-center">
                  <Users className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Service Gaps</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Difficulty identifying and addressing unmet needs
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-500/20 bg-gray-50/50 dark:bg-gray-900/10">
                <CardHeader className="text-center">
                  <BarChart3 className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Outcome Measurement</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Inconsistent metrics and delayed reporting cycles
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SHELTR-AI Solution Framework */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">SHELTR Solution Framework</h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive platform for evidence-based policy implementation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <CardTitle>Real-Time Analytics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Regional homelessness trends</span>
                      <span className="text-sm font-medium text-green-600">Live data</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Service utilization rates</span>
                      <span className="text-sm font-medium text-blue-600">Real-time</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Demographic analysis</span>
                      <span className="text-sm font-medium text-purple-600">Comprehensive</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <CardTitle>Transparent Funding</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Budget allocation tracking</span>
                      <span className="text-sm font-medium text-green-600">Blockchain verified</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Program ROI measurement</span>
                      <span className="text-sm font-medium text-blue-600">Automated</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Public accountability</span>
                      <span className="text-sm font-medium text-purple-600">Enhanced</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <CardTitle>Cross-Agency Coordination</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Shared data protocols</span>
                      <span className="text-sm font-medium text-green-600">Standardized</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resource optimization</span>
                      <span className="text-sm font-medium text-blue-600">AI-powered</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Impact coordination</span>
                      <span className="text-sm font-medium text-purple-600">Unified</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-orange-600" />
                    <CardTitle>Evidence-Based Policy</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Outcome prediction models</span>
                      <span className="text-sm font-medium text-green-600">ML-powered</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Policy impact simulation</span>
                      <span className="text-sm font-medium text-blue-600">Predictive</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Continuous improvement</span>
                      <span className="text-sm font-medium text-purple-600">Data-driven</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Strategy */}
      <section className="py-16 bg-purple-50/50 dark:bg-purple-900/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Implementation Strategy</h2>
              <p className="text-xl text-muted-foreground">
                Phased rollout approach for maximum impact and minimal disruption
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card className="relative border-2 border-purple-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <CardTitle className="text-center">Pilot Program</CardTitle>
                  <CardDescription className="text-center">Months 1-3</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="space-y-2 text-sm">
                    <li>Single agency deployment</li>
                    <li>Core feature validation</li>
                    <li>Staff training & feedback</li>
                    <li>Initial data migration</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative border-2 border-blue-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <CardTitle className="text-center">Regional Expansion</CardTitle>
                  <CardDescription className="text-center">Months 4-6</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="space-y-2 text-sm">
                    <li>Multi-agency integration</li>
                    <li>Data sharing protocols</li>
                    <li>Regional dashboard launch</li>
                    <li>Policy framework development</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative border-2 border-green-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <CardTitle className="text-center">Full Deployment</CardTitle>
                  <CardDescription className="text-center">Months 7-12</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="space-y-2 text-sm">
                    <li>Jurisdiction-wide rollout</li>
                    <li>Advanced analytics activation</li>
                    <li>Public transparency portal</li>
                    <li>Performance optimization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative border-2 border-orange-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold">4</span>
                  </div>
                  <CardTitle className="text-center">Scale & Optimize</CardTitle>
                  <CardDescription className="text-center">Year 2+</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="space-y-2 text-sm">
                    <li>Inter-jurisdiction coordination</li>
                    <li>Predictive modeling deployment</li>
                    <li>Policy impact measurement</li>
                    <li>Continuous improvement</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Expected Outcomes</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Measurable improvements in policy effectiveness and public service delivery
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-background rounded-lg p-6 border-2 border-purple-500/20">
                <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
                <div className="text-sm text-muted-foreground mb-2">Reduction in administrative burden</div>
                <div className="text-xs text-muted-foreground">Automated reporting & compliance</div>
              </div>

              <div className="bg-white dark:bg-background rounded-lg p-6 border-2 border-green-500/20">
                <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
                <div className="text-sm text-muted-foreground mb-2">Faster policy impact assessment</div>
                <div className="text-xs text-muted-foreground">Real-time data & analytics</div>
              </div>

              <div className="bg-white dark:bg-background rounded-lg p-6 border-2 border-blue-500/20">
                <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
                <div className="text-sm text-muted-foreground mb-2">Improved service coordination</div>
                <div className="text-xs text-muted-foreground">Cross-agency data sharing</div>
              </div>

              <div className="bg-white dark:bg-background rounded-lg p-6 border-2 border-orange-500/20">
                <div className="text-3xl font-bold text-orange-600 mb-2">25%</div>
                <div className="text-sm text-muted-foreground mb-2">Better public trust</div>
                <div className="text-xs text-muted-foreground">Transparent fund allocation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Considerations */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Budget Considerations</h2>
              <p className="text-xl text-muted-foreground">
                Cost-effective implementation with measurable ROI
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-green-600" />
                    Implementation Costs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Platform licensing (annual)</span>
                      <span className="font-medium">$50K - $200K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Implementation & training</span>
                      <span className="font-medium">$25K - $75K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data migration</span>
                      <span className="font-medium">$15K - $50K</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Total Year 1</span>
                      <span className="text-green-600">$90K - $325K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    Expected Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Administrative efficiency</span>
                      <span className="font-medium">$100K - $400K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Improved program outcomes</span>
                      <span className="font-medium">$200K - $800K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reduced compliance costs</span>
                      <span className="font-medium">$50K - $150K</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Total Annual Savings</span>
                      <span className="text-blue-600">$350K - $1.35M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-500/20">
                <div className="text-2xl font-bold text-green-600 mb-2">300% - 400% ROI</div>
                <div className="text-sm text-muted-foreground">Expected return on investment within first year</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Policy Making?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join forward-thinking government agencies using SHELTR for evidence-based homelessness policy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Government Demo
              </Button>
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Download Full Policy Brief
              </Button>
              <Button variant="outline" size="lg">
                <Globe className="h-4 w-4 mr-2" />
                Request Pilot Program
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 