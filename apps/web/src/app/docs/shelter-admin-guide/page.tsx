'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Building2, Users, Settings, BarChart3, Shield, Heart, CheckCircle, Star, AlertCircle, Zap, Globe, BookOpen, Github, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useDocumentMetadata, formatDocumentDate } from '@/hooks/useDocumentMetadata';

export default function ShelterAdminGuidePage() {
  // Fetch dynamic metadata from Knowledge Base using Firestore document ID
  // Using ID instead of slug to avoid conflicts with KB editor's auto-slug generation
  // Document: "Shelter Admin Guide" (TuFRjV6EZfrvKacBkNIc)
  const { metadata, loading } = useDocumentMetadata('TuFRjV6EZfrvKacBkNIc');

  // Fallback values if metadata fetch fails
  const displayTitle = metadata?.title || 'Shelter Administrator Guide';
  const displayDate = metadata?.updated_at 
    ? formatDocumentDate(metadata.updated_at)
    : 'December 12, 2025';
  const displayVersion = metadata?.version || '2.0';
  const displayDescription = metadata?.description || 
    'Complete guide for shelter administrators to manage participants, services, and operations on the SHELTR platform';

  // Show loading state while fetching metadata
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }
  const keyFeatures = [
    "Real-Time Participant Tracking",
    "SmartFund™ 80-15-5 Distribution",
    "Comprehensive Service Management",
    "Advanced Analytics & Reporting",
    "GDPR/HIPAA Compliance",
    "Multi-Role Staff Access Control"
  ];

  const managementAreas = [
    {
      title: "Participant Management",
      icon: Users,
      features: ["Registration & QR Code Generation", "Status Tracking (New/Active/Transitioning)", "Digital Wallet Setup", "Case Management Documentation", "Bulk Operations & Export"]
    },
    {
      title: "Service Administration",
      icon: Settings,
      features: ["Healthcare & Mental Health", "Employment & Training", "Housing Assistance", "Education & Financial Literacy", "Legal Aid & Documentation"]
    },
    {
      title: "Resource Management",
      icon: Building2,
      features: ["Real-Time Bed Occupancy", "Inventory Tracking", "Facility Maintenance", "Supply Chain Management", "Vendor Coordination"]
    },
    {
      title: "Analytics & Impact",
      icon: BarChart3,
      features: ["Operational Metrics", "Participant Outcomes", "Financial Reporting", "Community Impact", "Stakeholder Dashboards"]
    }
  ];

  const operationalStatus = [
    { metric: "Platform Completion", value: "95%", color: "text-green-600" },
    { metric: "Active Dashboards", value: "6", color: "text-blue-600" },
    { metric: "Participant Success Rate", value: "85%", color: "text-orange-600" }
  ];

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
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <Link
              href="/docs"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Link>
            
            <div className="flex items-start gap-4 mb-6">
              <Building2 className="h-12 w-12 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">{displayTitle}</h1>
                  <Badge className="bg-blue-600 text-white text-sm">{metadata?.badge || 'Operations Management'}</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  {displayDescription}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version {displayVersion}</span>
                  <span>•</span>
                  <span>Updated {displayDate}</span>
                  <span>•</span>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">OPERATIONAL</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/user-guides/shelter-admin-guide.md" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Github className="h-4 w-4 mr-2" />
                      View on GitHub
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              <h2>Platform Overview for Shelter Operations</h2>
              <p>
                SHELTR-AI transforms shelter management through real-time participant tracking, transparent donation processing, 
                and comprehensive service coordination. This guide covers everything from initial setup to advanced analytics, 
                helping you maximize impact for your organization and the people you serve.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 mb-12">
              <h3 className="text-green-800 dark:text-green-200 font-semibold mb-4">🚀 Current Implementation Status</h3>
              <div className="grid md:grid-cols-4 gap-6 mb-4">
                {operationalStatus.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      {stat.metric}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-green-700 dark:text-green-300 text-sm">
                <strong>Live Implementation</strong>: Old Brewery Mission (300 beds) with real-time occupancy tracking<br/>
                <strong>SmartFund™ Active</strong>: Transparent 80-15-5 donation distribution operational<br/>
                <strong>Multi-Tenant Ready</strong>: Advanced role-based access control system operational
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Key Platform Features</CardTitle>
                  <CardDescription>
                    Comprehensive shelter management capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Getting Started Checklist</CardTitle>
                  <CardDescription>
                    Essential steps for shelter onboarding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Complete shelter verification & documentation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Set up admin account with secure authentication
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Configure shelter capacity & services offered
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Create staff accounts with role-based access
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Begin participant registration & QR code setup
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/30 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">Core Management Areas</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {managementAreas.map((area, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <area.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold">{area.title}</h4>
                    </div>
                    <ul className="space-y-2">
                      {area.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <Star className="h-3 w-3 text-yellow-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-12">
              <h3 className="text-blue-800 dark:text-blue-200 font-semibold mb-4">🏠 SmartFund™ Distribution Model</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-4">
                <div className="text-center p-4 bg-white dark:bg-blue-800/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">80%</div>
                  <p className="text-sm font-medium">Direct to Participant</p>
                  <p className="text-xs text-muted-foreground">Immediate wallet access</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-blue-800/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15%</div>
                  <p className="text-sm font-medium">Housing Fund</p>
                  <p className="text-xs text-muted-foreground">Long-term solutions</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-blue-800/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">5%</div>
                  <p className="text-sm font-medium">Platform Operations</p>
                  <p className="text-xs text-muted-foreground">System maintenance</p>
                </div>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Every donation is automatically and transparently distributed through blockchain-powered smart contracts, 
                ensuring maximum impact while maintaining full transparency for donors and administrators.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 mb-12">
              <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-4">📊 Advanced Analytics & Reporting</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800 dark:text-yellow-200">Real-Time Operational Metrics</h4>
                  <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <li>• <strong>Live Occupancy</strong>: Current participants vs. capacity</li>
                    <li>• <strong>Service Utilization</strong>: Program enrollment and completion</li>
                    <li>• <strong>Resource Tracking</strong>: Inventory levels and consumption</li>
                    <li>• <strong>Staff Productivity</strong>: Workload distribution and efficiency</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800 dark:text-yellow-200">Impact Measurement</h4>
                  <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <li>• <strong>Housing Placements</strong>: Success rates and stability tracking</li>
                    <li>• <strong>Employment Outcomes</strong>: Job placement and income growth</li>
                    <li>• <strong>Community Donations</strong>: Transparent fund tracking</li>
                    <li>• <strong>Long-term Follow-up</strong>: 6-month and 1-year stability</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 mb-12">
              <h3 className="text-red-800 dark:text-red-200 font-semibold mb-4">🔒 Security & Compliance Framework</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-800 dark:text-red-200">Data Protection</h4>
                  <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                    <li>• <strong>GDPR/HIPAA Compliance</strong>: Full regulatory adherence</li>
                    <li>• <strong>Encrypted Storage</strong>: AES-256 encryption at rest</li>
                    <li>• <strong>Access Controls</strong>: Role-based permissions system</li>
                    <li>• <strong>Audit Logging</strong>: Complete activity tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-red-800 dark:text-red-200">Operational Security</h4>
                  <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                    <li>• <strong>Multi-Factor Auth</strong>: Admin account protection</li>
                    <li>• <strong>Emergency Procedures</strong>: Crisis management protocols</li>
                    <li>• <strong>Backup Systems</strong>: Data recovery and continuity</li>
                    <li>• <strong>Staff Training</strong>: Security awareness programs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-6 mb-12">
              <h3 className="text-purple-800 dark:text-purple-200 font-semibold mb-4">🌟 Success Stories & Impact</h3>
              <div className="space-y-4">
                <blockquote className="border-l-4 border-purple-300 pl-4 italic">
                  <p className="text-purple-700 dark:text-purple-300 mb-2">
                    "Since implementing SHELTR-AI, we've increased our housing placement rate by 40% and reduced average stay duration by 25%. 
                    The transparency has also increased community donations by 200%."
                  </p>
                  <footer className="text-purple-600 dark:text-purple-400 font-medium">
                    — Sarah Martinez, Director, Hope Harbor Shelter
                  </footer>
                </blockquote>
                
                <div className="grid md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Participant Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">60%</div>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Donation Increase</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">40%</div>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Efficiency Improvement</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Housing Success Rate</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-12">
              <h3 className="text-xl font-semibold mb-4">🚀 Your Mission Forward</h3>
              <p className="text-muted-foreground mb-6">
                As a Shelter Administrator, you're not just managing a facility - you're transforming lives and building community. 
                Every participant you serve, every donor you connect with, and every service you provide contributes to breaking the cycle of homelessness.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Immediate Goals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• Master platform features</li>
                      <li>• Train your team</li>
                      <li>• Engage community with transparency</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Short-term (Quarter)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• Optimize operations with analytics</li>
                      <li>• Expand service partnerships</li>
                      <li>• Increase graduation rates</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Long-term (Year)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• Become model shelter</li>
                      <li>• Mentor other administrators</li>
                      <li>• Advocate for innovation</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center">
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Back to Documentation Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}