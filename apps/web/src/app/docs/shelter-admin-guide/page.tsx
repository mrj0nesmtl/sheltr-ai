'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  HelpCircle,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  BookOpen,
  FileText,
  MessageSquare,
  BarChart,
  Shield as ShieldIcon,
  LifeBuoy
} from 'lucide-react';

export default function ShelterAdminGuidePage() {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Building2,
      description: 'Account setup, dashboard overview, and initial configuration',
      status: 'Essential',
      color: 'bg-blue-50 text-blue-700',
      link: '/user-journeys/shelters/',
      external: false
    },
    {
      id: 'participant-management',
      title: 'Participant Management',
      icon: Users,
      description: 'Registration, status tracking, and comprehensive participant care',
      status: 'Core Feature',
      color: 'bg-green-50 text-green-700',
      link: '/solutions',
      external: false
    },
    {
      id: 'service-management',
      title: 'Service Management',
      icon: Settings,
      description: 'Service administration, scheduling, and provider coordination',
      status: 'Operational',
      color: 'bg-purple-50 text-purple-700',
      link: 'https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/06-user-guides/shelter-admin-guide.md',
      external: true
    },
    {
      id: 'analytics-reporting',
      title: 'Analytics & Reporting',
      icon: BarChart3,
      description: 'Real-time metrics, impact measurement, and stakeholder reporting',
      status: 'Data-Driven',
      color: 'bg-orange-50 text-orange-700',
      link: '/impact',
      external: false
    },
    {
      id: 'security-compliance',
      title: 'Security & Compliance',
      icon: Shield,
      description: 'Data protection, regulatory compliance, and emergency procedures',
      status: 'Critical',
      color: 'bg-red-50 text-red-700',
      link: 'https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/technical/security.md',
      external: true
    },
    {
      id: 'support-resources',
      title: 'Support & Resources',
      icon: HelpCircle,
      description: 'Troubleshooting, best practices, and community support',
      status: 'Support',
      color: 'bg-gray-50 text-gray-700',
      link: 'mailto:joel@arcanaconcept.com',
      external: true
    }
  ];

  const keyFeatures = [
    {
      title: 'Real-Time Dashboard',
      description: 'Live participant tracking with Session 14 implementation',
      status: 'operational',
      link: '/dashboard',
      external: false
    },
    {
      title: 'Bed Management System',
      description: 'Dynamic occupancy tracking for Old Brewery Mission and other shelters',
      status: 'operational',
      link: '/solutions',
      external: false
    },
    {
      title: 'SmartFund Distribution',
      description: 'Transparent 80-15-5 donation allocation system',
      status: 'operational',
      link: '/tokenomics',
      external: false
    },
    {
      title: 'Service Coordination',
      description: 'Comprehensive service management and provider integration',
      status: 'operational',
      link: 'https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/06-user-guides/shelter-admin-guide.md',
      external: true
    },
    {
      title: 'Impact Analytics',
      description: 'Data-driven insights for shelter optimization',
      status: 'operational',
      link: '/impact',
      external: false
    },
    {
      title: 'Community Integration',
      description: 'Donor engagement and community building tools',
      status: 'operational',
      link: '/scan-give',
      external: false
    }
  ];

  const quickActions = [
    {
      title: 'View User Journey',
      description: 'Complete shelter administrator user journey and workflow',
      icon: BookOpen,
      action: '/user-journeys/shelters/',
      external: false
    },
    {
      title: 'Access Documentation',
      description: 'Comprehensive technical documentation and guides',
      icon: FileText,
      action: '/docs',
      external: false
    },
    {
      title: 'Chatbot Support',
      description: 'AI-powered assistance for platform questions',
      icon: MessageSquare,
      action: '/dashboard/chatbots',
      external: false
    },
    {
      title: 'Contact Support',
      description: '24/7 technical and operational support',
      icon: LifeBuoy,
      action: 'mailto:joel@arcanaconcept.com',
      external: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Shelter Administrator Guide
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your complete guide to managing shelter operations with SHELTR-AI
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Session 14 Updated
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Clock className="h-3 w-3 mr-1" />
                  August 2025
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Star className="h-3 w-3 mr-1" />
                  Professional Documentation
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Version 2.0 • Professional Documentation
              </p>
              <Link href="/user-journeys/shelters/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View User Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Features Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Platform Features & Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                {feature.external ? (
                  <a href={feature.link} target="_blank" rel="noopener noreferrer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base group-hover:text-blue-600 transition-colors">{feature.title}</CardTitle>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {feature.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                      <div className="flex items-center mt-2 text-blue-600">
                        <span className="text-xs">View Documentation</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </div>
                    </CardContent>
                  </a>
                ) : (
                  <Link href={feature.link}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base group-hover:text-blue-600 transition-colors">{feature.title}</CardTitle>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {feature.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                      <div className="flex items-center mt-2 text-blue-600">
                        <span className="text-xs">Learn More</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </CardContent>
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Guide Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Complete Guide Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                {section.external ? (
                  <a href={section.link} target="_blank" rel="noopener noreferrer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${section.color}`}>
                            <section.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {section.title}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {section.status}
                            </Badge>
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                      <div className="flex items-center mt-2 text-blue-600">
                        <span className="text-xs">View Documentation</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </div>
                    </CardContent>
                  </a>
                ) : (
                  <Link href={section.link}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${section.color}`}>
                            <section.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {section.title}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {section.status}
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                      <div className="flex items-center mt-2 text-blue-600">
                        <span className="text-xs">Learn More</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </CardContent>
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                {action.external ? (
                  <a href={action.action} target="_blank" rel="noopener noreferrer">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                          <action.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {action.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </a>
                ) : (
                  <Link href={action.action}>
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                          <action.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {action.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation Status */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>Session 14 Implementation Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  95%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Platform Completion
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  6
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Operational Dashboards
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  10
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Montreal Shelters Connected
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                🏠 Old Brewery Mission - Live Implementation
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time data connectivity with shelter capacity (300 beds), active participant tracking, 
                service management, and transparent donation processing. Test the system with authenticated 
                admin account: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">shelteradmin@example.com</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support & Contact */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Need Help Getting Started?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Our support team is available 24/7 for technical assistance, training, and platform optimization. 
            Connect with other shelter administrators through our community forum.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline">
              <HelpCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Join Admin Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
