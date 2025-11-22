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
  Globe,
  ArrowLeft
} from 'lucide-react';

export default function DonorGuidePage() {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Heart,
      description: 'Account creation, profile setup, and understanding the SmartFund™ model',
      status: 'Essential',
      color: 'bg-red-50 text-red-700',
      link: '/docs/user-journeys/donors/',
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
      link: 'https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/user-guides/donor-guide.md',
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
      link: 'mailto:admin@arcanaconcept.com',
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
      title: 'SmartFund™ Distribution',
      description: '80% direct, 15% housing fund, 5% platform operations',
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
      link: 'https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/tokenomics/blockchain.md',
      external: true
    },
    {
      title: 'Housing Impact',
      description: '15% of every donation builds long-term housing solutions',
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
      link: 'https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/security.md',
      external: true
    }
  ];



  const quickActions = [
    {
      title: 'View User Journey',
      description: 'Complete donor user journey and workflow guide',
      icon: BookOpen,
      action: '/docs/user-journeys/donors/',
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
      action: 'mailto:admin@arcanaconcept.com',
      external: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/docs" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documentation
          </Link>
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
                    Your complete guide to making transparent, impactful donations with SHELTR
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
                  November 2025
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Star className="h-3 w-3 mr-1" />
                  Beta Production Online
                </Badge>

              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Version 2.0 • Updated November 21, 2025
              </p>
              <Link href="/docs/user-journeys/donors/">
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View User Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SmartFund™ Model */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-400">
                <Wallet className="h-5 w-5" />
                <span>The SmartFund™ Model (80-15-5)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">80%</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Direct Impact</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Goes directly to the participant you&apos;re supporting
                  </p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">15%</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Housing Fund</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Builds long-term housing solutions for the community
                  </p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">5%</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Platform Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Supports platform operations and technology maintenance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods & Security */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            💰 Payment Methods & Security
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Secure Payment Options
                </CardTitle>
                <CardDescription>
                  Multiple secure payment methods with bank-level encryption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Credit & Debit Cards</div>
                      <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Wallet className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Digital Wallets</div>
                      <div className="text-sm text-muted-foreground">Apple Pay, Google Pay, PayPal</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Bank Transfers</div>
                      <div className="text-sm text-muted-foreground">ACH transfers for larger donations</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Globe className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Cryptocurrency</div>
                      <div className="text-sm text-muted-foreground">Bitcoin, Ethereum & major cryptos</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Financial Security
                </CardTitle>
                <CardDescription>
                  Your security is our paramount concern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Bank-level encryption</div>
                      <div className="text-sm text-muted-foreground">All transactions protected</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">PCI DSS compliance</div>
                      <div className="text-sm text-muted-foreground">Payment processing standards</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Secure tokenization</div>
                      <div className="text-sm text-muted-foreground">We never store card numbers</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Real-time fraud monitoring</div>
                      <div className="text-sm text-muted-foreground">Alerts and protection</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">GDPR compliance</div>
                      <div className="text-sm text-muted-foreground">Privacy law compliance</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Giving Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Our Platform Features
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

        {/* Remote Support & Participant Connections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Remote Support & Participant Connections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Participant Check-ins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Stay connected with participants you&apos;ve supported. Receive progress updates, milestones, and success stories directly from those you&apos;ve helped.
                </p>
                <Badge className="bg-green-100 text-green-800">Real-time Updates</Badge>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Recurring Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Set up automatic recurring donations to provide consistent support. Choose weekly, monthly, or custom schedules that work for your budget.
                </p>
                <Badge className="bg-purple-100 text-purple-800">Automated Support</Badge>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  Remote Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Support participants from anywhere in the world. Technology bridges distance, allowing meaningful connections across cities, states, or countries.
                </p>
                <Badge className="bg-orange-100 text-orange-800">Global Impact</Badge>
              </CardContent>
            </Card>
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
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-full sm:w-auto">
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

        {/* Safety & Best Practices */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            ⚠️ Safety & Best Practices
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Safe Giving Guidelines
                </CardTitle>
                <CardDescription>
                  Essential safety practices for all donor interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Use the QR code system</div>
                      <div className="text-sm text-muted-foreground">Avoid cash transactions</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Meet in public areas</div>
                      <div className="text-sm text-muted-foreground">Well-lit, safe locations only</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Don't share personal information</div>
                      <div className="text-sm text-muted-foreground">Keep contact details private</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Report concerning behavior</div>
                      <div className="text-sm text-muted-foreground">Use the app reporting system</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Trust your instincts</div>
                      <div className="text-sm text-muted-foreground">Your safety comes first</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Responsible Giving
                </CardTitle>
                <CardDescription>
                  Building sustainable giving habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Establish a monthly budget</div>
                      <div className="text-sm text-muted-foreground">Set sustainable giving limits</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Balance immediate & long-term</div>
                      <div className="text-sm text-muted-foreground">Plan your giving strategy</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">It's okay to say no</div>
                      <div className="text-sm text-muted-foreground">Don't give beyond your means</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Regular small donations</div>
                      <div className="text-sm text-muted-foreground">Often more impactful than large one-time gifts</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Combine with advocacy</div>
                      <div className="text-sm text-muted-foreground">Support policy changes too</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Scam Prevention & Financial Protection
            </h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Financial Protection</h5>
                <ul className="space-y-1 text-amber-700 dark:text-amber-300">
                  <li>• Never give bank account information</li>
                  <li>• Use secure payment methods through platform</li>
                  <li>• Monitor donations and account activity</li>
                  <li>• Report suspicious activity immediately</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Scam Prevention</h5>
                <ul className="space-y-1 text-amber-700 dark:text-amber-300">
                  <li>• Verify QR codes lead to official SHELTR platform</li>
                  <li>• Be cautious of requests outside the platform</li>
                  <li>• Don't download apps from unofficial sources</li>
                  <li>• Report fake QR codes or fraudulent requests</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Make a Real Difference?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Join donors who are transforming lives through transparent, direct giving. 
            Every donation creates immediate impact while building long-term solutions for homelessness.
          </p>
          <div className="flex justify-center">
            <Link href="/solutions/donors">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white" size="lg">
                <Heart className="h-4 w-4 mr-2" />
                Back to Donor Solutions
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Clear fees for donors • Bank-level security • Instant impact
          </p>
        </div>
      </div>
    </div>
  );
}
