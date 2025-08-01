'use client';

import Link from 'next/link';
import { ArrowLeft, Building2, Users, Clock, TrendingUp, CheckCircle, BarChart3, FileText, Download, Shield, DollarSign, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function OrganizationsCaseStudyPage() {
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
              <Link href="/solutions/organizations">
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
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Building2 className="h-12 w-12 text-blue-600" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">SHELTR for Shelters -  Case Study</h1>
                  <Badge className="bg-blue-500 text-white">Organizations</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  Transforming Shelter Operations Through Technology
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Case Study</span>
                  <span>•</span>
                  <span>June 2025</span>
                  <span>•</span>
                  <span>15 min read</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">Implementation Studied</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Demo
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
                This case study examines how SHELTR can revolutionize shelter and NGO operations through 
                blockchain-powered participant management, automated reporting, and transparent fund tracking. 
                Organizations implementing our platform report significant improvements in operational efficiency, 
                funding success rates, and participant outcomes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10">
                <CardHeader className="text-center">
                  <Clock className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-blue-600">35% Time Savings</CardTitle>
                  <CardDescription>Reduction in administrative tasks</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-900/10">
                <CardHeader className="text-center">
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-green-600">50% Faster</CardTitle>
                  <CardDescription>Policy impact assessment</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-purple-500/20 bg-purple-50/50 dark:bg-purple-900/10">
                <CardHeader className="text-center">
                  <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-purple-600">25% Increase</CardTitle>
                  <CardDescription>Improved inter-agency coordination</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Implementation Timeline</h2>
              <p className="text-xl text-muted-foreground">
                Complete onboarding in 1-2 weeks with dedicated support
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <CardTitle>Setup & Training</CardTitle>
                      <CardDescription>Week 1</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Platform configuration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Staff training sessions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Data migration setup
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <CardTitle>Data Migration</CardTitle>
                      <CardDescription>Week 2</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Seamless import of existing records
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      System integration testing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Quality assurance validation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <CardTitle>Go Live</CardTitle>
                      <CardDescription>Week 3+</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Full platform deployment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      24/7 support available
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Ongoing optimization
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features & Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features & Benefits</h2>
              <p className="text-xl text-muted-foreground">
                Purpose-built for the unique challenges of homelessness services
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <CardTitle>Participant Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Digital check-in process</span>
                      <span className="text-sm font-medium text-green-600">95% faster</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Case file management</span>
                      <span className="text-sm font-medium text-blue-600">100% digital</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Progress tracking</span>
                      <span className="text-sm font-medium text-purple-600">Real-time</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                    <CardTitle>Automated Reporting</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Compliance reports</span>
                      <span className="text-sm font-medium text-green-600">Auto-generated</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Impact analytics</span>
                      <span className="text-sm font-medium text-blue-600">Live dashboard</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Grant reporting</span>
                      <span className="text-sm font-medium text-purple-600">One-click</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-purple-600" />
                    <CardTitle>Blockchain Transparency</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fund tracking</span>
                      <span className="text-sm font-medium text-green-600">100% visible</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Transaction verification</span>
                      <span className="text-sm font-medium text-blue-600">Immutable</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Donor confidence</span>
                      <span className="text-sm font-medium text-purple-600">Enhanced</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-orange-600" />
                    <CardTitle>Outcome Tracking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Housing placements</span>
                      <span className="text-sm font-medium text-green-600">Auto-tracked</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Service utilization</span>
                      <span className="text-sm font-medium text-blue-600">Measured</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Long-term stability</span>
                      <span className="text-sm font-medium text-purple-600">Monitored</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Analysis */}
      <section className="py-16 bg-blue-50/50 dark:bg-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Return on Investment</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Organizations typically see positive ROI within 3 months of implementation
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-background rounded-lg p-6 border">
                <div className="text-3xl font-bold text-blue-600 mb-2">$15,000</div>
                <div className="text-sm text-muted-foreground mb-4">Annual staff time savings</div>
                <div className="text-xs text-muted-foreground">Based on 15 hours/week × $20/hour</div>
              </div>

              <div className="bg-white dark:bg-background rounded-lg p-6 border">
                <div className="text-3xl font-bold text-green-600 mb-2">$25,000</div>
                <div className="text-sm text-muted-foreground mb-4">Additional grant funding</div>
                <div className="text-xs text-muted-foreground">From improved reporting & outcomes</div>
              </div>

              <div className="bg-white dark:bg-background rounded-lg p-6 border">
                <div className="text-3xl font-bold text-purple-600 mb-2">300%</div>
                <div className="text-sm text-muted-foreground mb-4">First-year ROI</div>
                <div className="text-xs text-muted-foreground">Typical organization results</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Operations?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join forward-thinking organizations already using SHELTR to maximize their impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Demo
              </Button>
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Download Full Case Study
              </Button>
              <Button variant="outline" size="lg">
                <Users className="h-4 w-4 mr-2" />
                Contact Sales Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 