'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  QrCode, 
  TrendingUp, 
  Shield, 
  Users, 
  HelpCircle,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Wallet,
  BarChart3,
  Home,
  BookOpen,
  FileText,
  MessageSquare,
  Target,
  DollarSign,
  Globe
} from 'lucide-react';

export default function DonorGuidePage() {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Heart,
      description: 'Account creation, profile setup, and understanding the SmartFund model',
      status: 'Essential',
      color: 'bg-red-50 text-red-700',
      link: '/user-journeys/donors/',
      external: false
    },
    {
      id: 'qr-donations',
      title: 'QR Code Giving',
      icon: QrCode,
      description: 'Instant donations, participant connection, and mobile giving experience',
      status: 'Core Feature',
      color: 'bg-blue-50 text-blue-700',
      link: '/scan-give',
      external: false
    },
    {
      id: 'impact-tracking',
      title: 'Impact Tracking',
      icon: TrendingUp,
      description: 'Real-time transparency, outcome measurement, and success stories',
      status: 'Transparency',
      color: 'bg-green-50 text-green-700',
      link: '/impact',
      external: false
    },
    {
      id: 'payment-security',
      title: 'Payment & Security',
      icon: Shield,
      description: 'Secure payment methods, privacy protection, and financial safety',
      status: 'Security',
      color: 'bg-purple-50 text-purple-700',
      link: 'https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/06-user-guides/donor-guide.md',
      external: true
    },
    {
      id: 'community-building',
      title: 'Community Building',
      icon: Users,
      description: 'Participant relationships, corporate giving, and advocacy opportunities',
      status: 'Community',
      color: 'bg-orange-50 text-orange-700',
      link: '/solutions',
      external: false
    },
    {
      id: 'support-resources',
      title: 'Support & Resources',
      icon: HelpCircle,
      description: 'Getting help, best practices, and donor community resources',
      status: 'Support',
      color: 'bg-gray-50 text-gray-700',
      link: 'mailto:joel@arcanaconcept.com',
      external: true
    }
  ];

  const givingFeatures = [
    {
      title: 'QR Code Donations',
      description: 'Instant giving through smartphone camera scanning',
      icon: QrCode,
      status: 'Instant',
      link: '/scan-give',
      external: false
    },
    {
      title: 'SmartFund Distribution',
      description: '85% direct, 10% housing fund, 5% shelter operations',
      icon: Wallet,
      status: 'Transparent',
      link: '/tokenomics',
      external: false
    },
    {
      title: 'Blockchain Tracking',
      description: 'Every donation tracked with complete transparency',
      icon: BarChart3,
      status: 'Verified',
      link: 'https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/tokenomics/blockchain.md',
      external: true
    },
    {
      title: 'Housing Impact',
      description: '10% of every donation builds long-term housing solutions',
      icon: Home,
      status: 'Long-term',
      link: '/impact',
      external: false
    },
    {
      title: 'Real-Time Impact',
      description: 'See immediate results and participant progress',
      icon: TrendingUp,
      status: 'Live',
      link: '/impact',
      external: false
    },
    {
      title: 'Secure Payments',
      description: 'Bank-level security with multiple payment options',
      icon: Shield,
      status: 'Protected',
      link: 'https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/technical/security.md',
      external: true
    }
  ];



  const quickActions = [
    {
      title: 'View User Journey',
      description: 'Complete donor user journey and workflow guide',
      icon: BookOpen,
      action: '/user-journeys/donors/',
      external: false
    },
    {
      title: 'Start Giving Today',
      description: 'Create your account and make your first donation',
      icon: Heart,
      action: '/register?role=donor',
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
      title: 'Contact Support',
      description: 'Get help with donations and platform questions',
      icon: MessageSquare,
      action: 'mailto:joel@arcanaconcept.com',
      external: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-600 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Donor Guide
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your complete guide to making transparent, impactful donations through SHELTR-AI
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Latest Features
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Clock className="h-3 w-3 mr-1" />
                  August 2025
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Star className="h-3 w-3 mr-1" />
                  28 Pages
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Version 1.4.0 • Revolutionary Giving Platform
              </p>
              <Link href="/user-journeys/donors/">
                <Button className="bg-red-600 hover:bg-red-700">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View User Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SmartFund Model */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-400">
                <Wallet className="h-5 w-5" />
                <span>The SmartFund Model (85-10-5)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Direct Impact</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Goes directly to the participant you&apos;re supporting
                  </p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10%</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Housing Fund</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Builds long-term housing solutions for the community
                  </p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">5%</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Shelter Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Supports the participant&apos;s registered shelter operations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Giving Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Revolutionary Giving Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {givingFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                {feature.external ? (
                  <a href={feature.link} target="_blank" rel="noopener noreferrer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <feature.icon className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-base group-hover:text-red-600 transition-colors">{feature.title}</CardTitle>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                      <div className="flex items-center mt-2 text-red-600">
                        <span className="text-xs">View Documentation</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </div>
                    </CardContent>
                  </a>
                ) : (
                  <Link href={feature.link}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <feature.icon className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-base group-hover:text-red-600 transition-colors">{feature.title}</CardTitle>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                      <div className="flex items-center mt-2 text-red-600">
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

        {/* Distance Giving & Participant Connection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Give at a Distance, Stay Connected
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/impact">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-red-600 transition-colors">
                    <Users className="h-5 w-5 text-blue-600" />
                    Participant Check-ins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Stay connected with participants you&apos;ve supported. Receive progress updates, milestones, and success stories directly from those you&apos;ve helped.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800">Real-time Updates</Badge>
                    <ArrowRight className="h-4 w-4 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/tokenomics">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-red-600 transition-colors">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Recurring Donations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Set up automatic recurring donations to provide consistent support. Choose weekly, monthly, or custom schedules that work for your budget.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-100 text-purple-800">Automated Support</Badge>
                    <ArrowRight className="h-4 w-4 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/solutions">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-red-600 transition-colors">
                    <Globe className="h-5 w-5 text-orange-600" />
                    Remote Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Support participants from anywhere in the world. Technology bridges distance, allowing meaningful connections across cities, states, or countries.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-orange-100 text-orange-800">Global Impact</Badge>
                    <ArrowRight className="h-4 w-4 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              🌟 The Power of Distance Giving
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              One of SHELTR&apos;s most innovative features is enabling meaningful relationships between donors and participants regardless of geographic distance. Through secure, privacy-respecting technology:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">✓ Follow Their Journey</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive opt-in progress updates and milestone notifications</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">✓ Secure Communication</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Privacy-first messaging system protects both parties</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">✓ Housing Fund Growth</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Watch their automated savings grow toward permanent housing</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">✓ Success Celebrations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Be notified when they achieve housing independence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Donor Wallet Preview Callout */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-400">
                <Wallet className="h-5 w-5" />
                <span>Experience Your Future Donor Wallet</span>
              </CardTitle>
              <CardDescription>
                See exactly what your donor experience will look like with real data and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What You&apos;ll See in the Preview</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Real-time participant progress tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Recurring donation management dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>SmartFund™ distribution transparency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Milestone celebrations and success stories</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Distance giving across multiple cities</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Interactive Features</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>One-click donation buttons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>QR code scanning simulation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Impact score and statistics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Notification and settings management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Housing fund growth visualization</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="/demo/donor-wallet" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                    <Wallet className="h-4 w-4 mr-2" />
                    Preview Donor Wallet
                  </Button>
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  💡 Based on 6 months of realistic donor activity
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guide Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Complete Donor Guide Sections
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
                            <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                              {section.title}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {section.status}
                            </Badge>
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                      <div className="flex items-center mt-2 text-red-600">
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
                            <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                              {section.title}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {section.status}
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                      <div className="flex items-center mt-2 text-red-600">
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
            Get Started & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                {action.external ? (
                  <a href={action.action} target="_blank" rel="noopener noreferrer">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors">
                          <action.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors">
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
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors">
                          <action.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors">
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

        {/* Success Story */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-400">
              <Star className="h-5 w-5" />
              <span>Donor Success Story</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
              &ldquo;I started with $10 donations and watched Sarah go from sleeping in her car to getting her own apartment. 
              Seeing that transformation made me realize how powerful direct giving can be. The transparency of knowing 
              exactly where my money goes and seeing real results has completely changed how I think about charity.&rdquo;
            </blockquote>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                — Anonymous Donor, Seattle
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read More Stories
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Make a Real Difference?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Join thousands of donors who are transforming lives through transparent, direct giving. 
            Every donation creates immediate impact while building long-term solutions for homelessness.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/user-journeys/donors/">
              <Button className="bg-red-600 hover:bg-red-700" size="lg">
                <BookOpen className="h-4 w-4 mr-2" />
                View User Journey
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Access Documentation
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No fees for donors • Bank-level security • Instant impact
          </p>
        </div>
      </div>
    </div>
  );
}
