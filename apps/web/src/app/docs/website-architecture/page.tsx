'use client';

import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Building, 
  Users, 
  Shield, 
  Smartphone,
  CheckCircle,
  BarChart3,
  Settings,
  Globe,
  LogIn,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';

export default function WebsiteArchitecturePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const documentSections = [
    {
      title: "Complete Site Tree",
      description: "Visual mapping of all 50+ pages including public and authenticated routes",
      icon: Globe,
      topics: ["Public Pages", "Dashboard System", "Authentication Routes", "Role-Based Navigation"]
    },
    {
      title: "Role-Based Access Matrix",
      description: "Comprehensive permissions table for Super Admin, Shelter Admin, Participant, and Donor roles",
      icon: Shield,
      topics: ["Access Control", "Permission Levels", "Security Boundaries", "Role Inheritance"]
    },
    {
      title: "Mobile Responsiveness Guide",
      description: "Apple Liquid Glass design standards and mobile optimization framework",
      icon: Smartphone,
      topics: ["Breakpoints", "Touch Targets", "Typography Scale", "Navigation Patterns"]
    },
    {
      title: "Feature Testing Checklist",
      description: "100+ test cases covering authentication, navigation, business logic, and mobile features",
      icon: CheckCircle,
      topics: ["Critical Tests", "High Priority", "Medium Priority", "Low Priority"]
    },
    {
      title: "Authentication Flow Testing",
      description: "Complete testing scenarios for login, registration, and role-based routing",
      icon: Users,
      topics: ["Test User Accounts", "Role Validation", "Session Management", "Access Control"]
    },
    {
      title: "Business Logic Testing",
      description: "Service booking system, form persistence, and core functionality validation",
      icon: Settings,
      topics: ["API Endpoints", "Data Models", "Error Handling", "Real-time Updates"]
    },
    {
      title: "Performance & Deployment",
      description: "KPIs, metrics, and production readiness checklist",
      icon: BarChart3,
      topics: ["Performance Targets", "User Experience Metrics", "Security Testing", "Deployment Checklist"]
    }
  ];

  const keyFeatures = [
    "📱 Mobile-first design standards with Apple Liquid Glass aesthetics",
    "🔐 Complete 4-role authentication system testing framework",
    "🌳 Visual site tree mapping all public and authenticated pages", 
    "✅ 100+ comprehensive test cases prioritized by criticality",
    "🎯 Role-based feature matrix ensuring proper access control",
    "⚙️ Business logic testing for service booking and form persistence",
    "📊 Performance KPIs and deployment readiness metrics",
    "🚀 Production-ready QA framework for enterprise deployment"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
              <Link href="/docs" className="text-foreground hover:text-primary transition-colors">Docs</Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden md:flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              <Link href="/" className="block px-3 py-2 text-base hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="block px-3 py-2 text-base hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="block px-3 py-2 text-base hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="block px-3 py-2 text-base hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="block px-3 py-2 text-base hover:text-primary transition-colors">Impact</Link>
              <Link href="/docs" className="block px-3 py-2 text-base text-foreground hover:text-primary transition-colors">Docs</Link>
              <div className="flex space-x-2 px-3 pt-2">
                <Button variant="ghost" size="sm" asChild className="flex-1">
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild className="flex-1">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/docs" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documentation
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <Badge className="bg-indigo-500 hover:bg-indigo-600 mb-2">Platform Framework</Badge>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Website Architecture & Platform Guide
              </h1>
              <p className="text-xl text-muted-foreground">
                Complete site structure, role-based features, and comprehensive platform framework
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center text-sm text-muted-foreground">
              <Building className="w-4 h-4 mr-2" />
              45 pages
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2" />
              QA Engineers • Developers • Project Managers
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 mr-2" />
              Updated August 4, 2025
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/website-architecture.md">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Document Overview */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Document Sections */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Documentation Sections</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {documentSections.map((section, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {section.topics.map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Documentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Comprehensive Platform Framework</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border bg-card">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Technical Coverage</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <Globe className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                  <CardTitle>50+ Pages Mapped</CardTitle>
                  <CardDescription>
                    Complete site architecture including all public and authenticated routes
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <CardTitle>100+ Test Cases</CardTitle>
                  <CardDescription>
                    Comprehensive testing checklist covering all critical functionality
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Shield className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <CardTitle>4-Role System</CardTitle>
                  <CardDescription>
                    Complete access control matrix for all stakeholder types
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Target Audience */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Target Audience</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-lg border bg-card">
                <CheckCircle className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
                <h3 className="font-semibold mb-2">QA Engineers</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive testing framework and validation procedures
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card">
                <Settings className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Developers</h3>
                <p className="text-sm text-muted-foreground">
                  Technical architecture and implementation guidelines
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card">
                <BarChart3 className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2">Project Managers</h3>
                <p className="text-sm text-muted-foreground">
                  Project tracking and quality assurance metrics
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card">
                <Users className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold mb-2">Technical Teams</h3>
                <p className="text-sm text-muted-foreground">
                  Cross-functional collaboration and testing standards
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Quality Documentation Standards</CardTitle>
                <CardDescription className="text-lg">
                  We follow enterprise-grade documentation standards with comprehensive coverage, clear structure, and continuous updates. Our platform framework ensures maintainable, scalable, and well-documented codebases.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/website-architecture.md">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on GitHub
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/docs">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Documentation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 