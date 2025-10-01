'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  Rocket, 
  Calendar, 
  Target, 
  Users, 
  Building, 
  CreditCard, 
  Shield, 
  Zap, 
  Brain,
  ExternalLink,
  Github,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  Blocks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/docs" className="flex items-center space-x-3">
              <ThemeLogo />
              <div>
                <h1 className="text-xl font-bold">Development Roadmap</h1>
                <p className="text-sm text-muted-foreground">180-Day Production Launch Timeline</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-orange-600 hover:bg-orange-700 text-white">
                v4.0 - Production Plan
              </Badge>
              <Badge variant="outline" className="text-xs">
                Updated: September 29, 2025
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Rocket className="h-8 w-8 text-orange-600" />
              <Badge className="bg-orange-600 text-white px-4 py-1">180-DAY PRODUCTION PLAN</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Production Launch Timeline
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Enterprise-ready platform with complete payment rails, blockchain integration, 
              and comprehensive testing launching Spring 2026
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                <a 
                  href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/dev-roadmap.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  View Full Roadmap Document
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/docs" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Back to Documentation Hub
                </Link>
              </Button>
            </div>
          </div>

          {/* Development Progress */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4">🚀 Development Progress</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">180</div>
                <div className="text-sm text-muted-foreground">Days to Production</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">5</div>
                <div className="text-sm text-muted-foreground">Development Phases</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-muted-foreground">Major Integrations</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">Q2</div>
                <div className="text-sm text-muted-foreground">2026 Launch</div>
              </div>
            </div>
            <Progress value={65} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Platform Foundation: 65% Complete</p>
          </div>
        </div>
      </section>

      {/* Main Content - Timeline Overview */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">180-Day Development Phases</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive development approach from payment rails to blockchain integration and production testing
            </p>
          </div>

          <div className="space-y-8">
            {/* Phase 1 */}
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold">1</span>
                    </div>
                    <div>
                      <CardTitle className="text-orange-600">Payment Rails Development</CardTitle>
                      <CardDescription>October 2025 - January 2026 • 3 Months</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-orange-600 text-white">Critical Milestone</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Key Deliverables</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>Adyen Integration Architecture</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>Virtual Card System Development</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>Payment Processing Logic</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>Security Framework Implementation</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Success Criteria</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Complete payment processing architecture</li>
                      <li>• Virtual card system fully functional</li>
                      <li>• SmartFund™ distribution logic implemented</li>
                      <li>• Security framework validated and tested</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <div>
                      <CardTitle className="text-blue-600">Blockchain Integration</CardTitle>
                      <CardDescription>February - March 2026 • 2 Months</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-blue-600 text-white">Smart Contracts</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Blockchain Components</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Blocks className="h-4 w-4 text-blue-600" />
                        <span>SHELTR Stablecoin Contract</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Blocks className="h-4 w-4 text-blue-600" />
                        <span>SmartFund Distribution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Blocks className="h-4 w-4 text-blue-600" />
                        <span>Base Network Integration</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Development Process</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Smart contract architecture</li>
                      <li>• Coinbase Base deployment</li>
                      <li>• Token distribution logic</li>
                      <li>• Security auditing</li>
                      <li>• Integration testing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Success Criteria</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Smart contracts deployed</li>
                      <li>• Token distribution functional</li>
                      <li>• Security audit passed</li>
                      <li>• Integration tests complete</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <div>
                      <CardTitle className="text-green-600">Comprehensive Testing & QA</CardTitle>
                      <CardDescription>April - May 2026 • 2 Months</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">Quality Assurance</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Testing Activities</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>End-to-end user role testing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span>Dashboard connectivity validation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <span>Payment flow testing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Blocks className="h-4 w-4 text-green-600" />
                        <span>Blockchain integration testing</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Quality Targets</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• All user roles fully functional</li>
                      <li>• Payment processing validated</li>
                      <li>• Security audit completed</li>
                      <li>• Performance benchmarks met</li>
                      <li>• User acceptance testing passed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Achievements Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">AI Hyper Chatbot & Knowledge Base Achievements</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Revolutionary AI architecture with multi-agent system and comprehensive knowledge base
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Hyper Chatbot Architecture
                  </CardTitle>
                  <CardDescription>Multi-agent system with advanced capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Multi-Agent System with role specialization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">MCP Integration for workflow automation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Emergency Detection with 911 escalation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Role-Aware Responses by user type</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Session Management with context switching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Real-Time Processing (sub-second responses)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    Knowledge Base Revolution
                  </CardTitle>
                  <CardDescription>Comprehensive documentation with AI enhancement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">61+ Documents with AI-powered enhancement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Semantic Search with vector embeddings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">GitHub Sync with real-time updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Quality Scoring (100/100 AI metrics)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Multi-Format Support (Markdown, PDF, Web)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Admin Dashboard with editing tools</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Production-Ready Development</h2>
          <p className="text-xl mb-8 opacity-90">
            Comprehensive 180-day development roadmap to deliver a fully-tested, enterprise-grade 
            platform with complete payment rails and blockchain integration by Spring 2026.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a 
                href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/dev-roadmap.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View Full Roadmap Document
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              <Link href="/docs" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Explore More Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}