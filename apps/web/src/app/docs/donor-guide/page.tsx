'use client';

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
  Home
} from 'lucide-react';

export default function DonorGuidePage() {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Heart,
      description: 'Account creation, profile setup, and understanding the SmartFund model',
      status: 'Essential',
      color: 'bg-red-50 text-red-700'
    },
    {
      id: 'qr-donations',
      title: 'QR Code Giving',
      icon: QrCode,
      description: 'Instant donations, participant connection, and mobile giving experience',
      status: 'Core Feature',
      color: 'bg-blue-50 text-blue-700'
    },
    {
      id: 'impact-tracking',
      title: 'Impact Tracking',
      icon: TrendingUp,
      description: 'Real-time transparency, outcome measurement, and success stories',
      status: 'Transparency',
      color: 'bg-green-50 text-green-700'
    },
    {
      id: 'payment-security',
      title: 'Payment & Security',
      icon: Shield,
      description: 'Secure payment methods, privacy protection, and financial safety',
      status: 'Security',
      color: 'bg-purple-50 text-purple-700'
    },
    {
      id: 'community-building',
      title: 'Community Building',
      icon: Users,
      description: 'Participant relationships, corporate giving, and advocacy opportunities',
      status: 'Community',
      color: 'bg-orange-50 text-orange-700'
    },
    {
      id: 'support-resources',
      title: 'Support & Resources',
      icon: HelpCircle,
      description: 'Getting help, best practices, and donor community resources',
      status: 'Support',
      color: 'bg-gray-50 text-gray-700'
    }
  ];

  const givingFeatures = [
    {
      title: 'QR Code Donations',
      description: 'Instant giving through smartphone camera scanning',
      icon: QrCode,
      status: 'Instant'
    },
    {
      title: 'SmartFund Distribution',
      description: '80% direct, 15% housing fund, 5% platform operations',
      icon: Wallet,
      status: 'Transparent'
    },
    {
      title: 'Blockchain Tracking',
      description: 'Every donation tracked with complete transparency',
      icon: BarChart3,
      status: 'Verified'
    },
    {
      title: 'Housing Impact',
      description: '15% of every donation builds long-term housing solutions',
      icon: Home,
      status: 'Long-term'
    },
    {
      title: 'Real-Time Impact',
      description: 'See immediate results and participant progress',
      icon: TrendingUp,
      status: 'Live'
    },
    {
      title: 'Secure Payments',
      description: 'Bank-level security with multiple payment options',
      icon: Shield,
      status: 'Protected'
    }
  ];

  const impactStats = [
    {
      value: '$2.3M',
      label: 'Total Donated',
      description: 'Through the SHELTR-AI platform'
    },
    {
      value: '1,200+',
      label: 'People Supported',
      description: 'Direct participant impact'
    },
    {
      value: '850+',
      label: 'Housing Placements',
      description: 'Long-term stability achieved'
    },
    {
      value: '95%',
      label: 'Satisfaction Rate',
      description: 'Participant happiness with support'
    }
  ];

  const quickActions = [
    {
      title: 'Download PDF Guide',
      description: 'Complete 450+ page donor guide for comprehensive reference',
      icon: Download,
      action: '/docs/donor-guide.pdf'
    },
    {
      title: 'Start Giving Today',
      description: 'Create your account and make your first donation',
      icon: Heart,
      action: '/register?role=donor'
    },
    {
      title: 'View Impact Stories',
      description: 'See real success stories from community giving',
      icon: Star,
      action: '/impact/stories'
    },
    {
      title: 'Join Donor Community',
      description: 'Connect with other donors and share experiences',
      icon: Users,
      action: '/community/donors'
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
                  450+ Pages
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Version 2.0 • Revolutionary Giving Platform
              </p>
              <Button className="bg-red-600 hover:bg-red-700">
                <Heart className="h-4 w-4 mr-2" />
                Start Giving Today
              </Button>
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
                <span>The SmartFund Model (80-15-5)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">80%</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Direct Impact</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Goes directly to the participant you're supporting
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
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Platform</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Maintains technology and platform operations
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
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Community Impact & Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {stat.value}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Guide Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Complete Donor Guide Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
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
                </CardContent>
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
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
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
              "I started with $10 donations and watched Sarah go from sleeping in her car to getting her own apartment. 
              Seeing that transformation made me realize how powerful direct giving can be. The transparency of knowing 
              exactly where my money goes and seeing real results has completely changed how I think about charity."
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
            <Button className="bg-red-600 hover:bg-red-700" size="lg">
              <Heart className="h-4 w-4 mr-2" />
              Start Giving Today
            </Button>
            <Button variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download Guide
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No fees for donors • Bank-level security • Instant impact
          </p>
        </div>
      </div>
    </div>
  );
}
