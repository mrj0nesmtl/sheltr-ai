'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  Rocket, 
  Users, 
  CreditCard, 
  Shield, 
  Brain,
  ExternalLink,
  Github,
  FileText,
  CheckCircle,
  Clock,
  Blocks,
  Home,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
              <p className="text-sm text-muted-foreground">6-Week MVP Refactoring Sprint</p>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Badge className="bg-orange-600 hover:bg-orange-700 text-white">
              v4.1 - Strategic Refactoring
            </Badge>
            <Badge variant="outline" className="text-xs">
              Updated: December 16, 2025
            </Badge>
          </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="hover:bg-muted p-1 h-auto"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4" />
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="hover:bg-muted px-2 py-1 h-auto"
            >
              <Link href="/docs">
                Documentation
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">
              Development Roadmap
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Rocket className="h-8 w-8 text-orange-600" />
              <Badge className="bg-orange-600 text-white px-4 py-1">6-WEEK SPRINT</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Beta to MVP: Strategic Refactoring
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Polish the 80% that works brilliantly, fix the 20% that needs attention. 
              Production-ready MVP with 10 core features working perfectly by Q1 2026.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                <a 
                  href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/development/roadmap.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  View GitHub Document
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
            <h2 className="text-2xl font-bold mb-4">🎯 Strategic Refactoring Sprint</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">6</div>
                <div className="text-sm text-muted-foreground">Weeks to MVP</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">80%</div>
                <div className="text-sm text-muted-foreground">Already Excellent</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">10</div>
                <div className="text-sm text-muted-foreground">Core Features per Dashboard</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">Q1</div>
                <div className="text-sm text-muted-foreground">2026 MVP Launch</div>
              </div>
            </div>
            <Progress value={80} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Platform Status: Beta → MVP (Foundation excellent, dashboard refinement needed)</p>
          </div>
        </div>
      </section>

      {/* Main Content - Timeline Overview */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">6-Week MVP Refactoring Phases</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Strategic sprint to polish core features, optimize performance, and deliver production-ready MVP
            </p>
          </div>

          <div className="space-y-8">
            {/* Week 1-2: Data Pipeline */}
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold">1-2</span>
                    </div>
                    <div>
                      <CardTitle className="text-orange-600">Data Pipeline Overhaul 🔧</CardTitle>
                      <CardDescription>Week 1-2 • Aggregation & Performance</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-orange-600 text-white">Critical</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-orange-600">Key Deliverables</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>Design aggregation data models</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>Implement Cloud Functions for metrics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>Update dashboards to read aggregates</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>Testing & validation</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Success Criteria</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Dashboard load time &lt; 2 seconds</li>
                      <li>• Metrics update in real-time (&lt; 500ms)</li>
                      <li>• Firestore reads reduced by 80%+</li>
                      <li>• All 5 dashboards showing accurate data</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Week 3: Notification System */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    <div>
                      <CardTitle className="text-blue-600">Notification System Redesign 🔔</CardTitle>
                      <CardDescription>Week 3 • Simple, Reliable, Non-Intrusive</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-blue-600 text-white">UX Focus</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">Key Deliverables</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Simplify from 13 to 3 notification types</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Implement simplified notification service</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Update all 5 dashboard notification centers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Implement quiet hours logic</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Success Criteria</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• 3 notification types only (critical, important, info)</li>
                      <li>• One email toggle per user</li>
                      <li>• Quiet hours working correctly</li>
                      <li>• Clear, actionable notifications</li>
                      <li>• No notification spam</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Week 4: Dashboard Cleanup */}
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">4</span>
                    </div>
                    <div>
                      <CardTitle className="text-purple-600">Dashboard Feature Audit 🧹</CardTitle>
                      <CardDescription>Week 4 • 10 Core Features Working Perfectly</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-purple-600 text-white">Quality Focus</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-purple-600">Key Deliverables</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span>Audit all dashboard components</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span>Remove/hide broken features</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span>Polish remaining features</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span>Standardize UI/UX patterns</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Success Criteria</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Each dashboard has 6-10 working features</li>
                      <li>• No broken/partial features visible</li>
                      <li>• Consistent UI/UX across all dashboards</li>
                      <li>• Clear navigation</li>
                      <li>• Proper error handling</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Week 5: Performance Optimization */}
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">5</span>
                    </div>
                    <div>
                      <CardTitle className="text-emerald-600">Real-Time Optimization ⚡</CardTitle>
                      <CardDescription>Week 5 • Fast, Responsive Dashboards</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 text-white">Performance</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-emerald-600">Key Deliverables</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        <span>Audit all Firestore listeners</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        <span>Implement query optimization</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        <span>Implement caching strategy</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        <span>Optimize React rendering</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Success Criteria</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Dashboard load &lt; 2 seconds</li>
                      <li>• Real-time updates &lt; 500ms</li>
                      <li>• Firestore reads reduced 60%+</li>
                      <li>• Lighthouse score 90+</li>
                      <li>• Proper indexes and pagination</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Week 6: Testing & Polish */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">6</span>
                    </div>
                    <div>
                      <CardTitle className="text-green-600">Testing, Polish & Documentation ✨</CardTitle>
                      <CardDescription>Week 6 • Production-Ready MVP</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">MVP Launch</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Testing Strategy</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>Test all 5 user roles thoroughly</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span>Test critical user journeys</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Test edge cases & error handling</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span>Update documentation</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Success Criteria</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• All 5 user roles tested thoroughly</li>
                      <li>• Critical user journeys working end-to-end</li>
                      <li>• Error handling graceful</li>
                      <li>• Documentation up-to-date</li>
                      <li>• Ready for production deployment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What's Already Excellent Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">✅ What's Already Production-Ready (80%)</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Solid foundation with excellent public site, AI systems, and core infrastructure
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Public Site Excellence
                  </CardTitle>
                  <CardDescription>Professional, fast, accessible</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Modern design & UX</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">SEO optimized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Mobile responsive</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Fast load times</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Intuitive navigation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-green-600" />
                    AI & Knowledge Base
                  </CardTitle>
                  <CardDescription>Gemini 2.5 Flash + RAG system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">75+ RAG documents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Role-aware chatbot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">56% cost reduction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">GitHub sync</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Semantic search</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Core Systems
                  </CardTitle>
                  <CardDescription>Auth, blog, gallery, docs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">5-role RBAC system</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Blog management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Gallery system</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Documentation hub</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Firebase integration</span>
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
          <h2 className="text-3xl font-bold mb-6">MVP-Ready by Q1 2026</h2>
          <p className="text-xl mb-8 opacity-90">
            Strategic 6-week refactoring sprint to deliver a production-ready MVP with 10 core features 
            working perfectly across all 5 user roles. Foundation is excellent, dashboard refinement needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a 
                href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/development/REFACTORING-ROADMAP-v1.0.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View Refactoring Roadmap
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