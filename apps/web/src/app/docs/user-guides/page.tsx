'use client';

import Link from 'next/link';
import { 
  Users, 
  Heart, 
  Building2,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Home,
  ChevronRight,
  FileText,
  Clock,
  Target,
  CheckCircle,
  Sparkles,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function UserGuidesHub() {
  const guides = [
    {
      title: "Participant Guide",
      description: "Complete guide for individuals experiencing homelessness using the SHELTR platform",
      icon: Users,
      color: "teal",
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20",
      borderColor: "border-teal-200 dark:border-teal-800",
      href: "/docs/participant-guide",
      keyFeatures: [
        "Getting your personal QR code",
        "Setting up your digital wallet",
        "Receiving and managing donations",
        "Accessing services and support",
        "Privacy and security controls"
      ],
      badge: "For Participants",
      badgeColor: "bg-teal-600"
    },
    {
      title: "Donor & Contributor Guide",
      description: "Everything you need to know about making impactful donations through SHELTR",
      icon: Heart,
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
      href: "/docs/donor-guide",
      keyFeatures: [
        "Quick QR code donations",
        "Real-time impact tracking",
        "SmartFund™ 80-15-5 model",
        "Tax receipts and reporting",
        "Recurring donations setup"
      ],
      badge: "For Donors",
      badgeColor: "bg-pink-600"
    },
    {
      title: "Shelter Admin Guide",
      description: "Comprehensive management guide for shelter staff and administrators",
      icon: Building2,
      color: "blue",
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      href: "/docs/shelter-admin-guide",
      keyFeatures: [
        "Multi-tenant dashboard",
        "Participant registration",
        "QR code generation",
        "Real-time analytics",
        "Compliance and reporting"
      ],
      badge: "For Shelters",
      badgeColor: "bg-blue-600"
    },
    {
      title: "AI Chatbot User Guide",
      description: "Learn how to use SHELTR's AI-powered assistance and specialized agents",
      icon: MessageSquare,
      color: "purple",
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      href: "/docs/chatbot-user-guide",
      keyFeatures: [
        "5 specialized AI agents",
        "24/7 instant support",
        "Natural language queries",
        "Context-aware responses",
        "Multi-language support"
      ],
      badge: "AI Assistant",
      badgeColor: "bg-purple-600"
    },
    {
      title: "Knowledge Base Guide",
      description: "Navigate and utilize SHELTR's comprehensive documentation system",
      icon: BookOpen,
      color: "emerald",
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      href: "/docs/knowledge-base-guide",
      keyFeatures: [
        "Search and filtering",
        "Category navigation",
        "Document management",
        "Version history",
        "Export and sharing"
      ],
      badge: "Documentation",
      badgeColor: "bg-emerald-600"
    }
  ];

  const quickLinks = [
    {
      title: "Technical Documentation",
      href: "/docs/system-design",
      icon: FileText,
      description: "System architecture and technical specs"
    },
    {
      title: "User Journeys",
      href: "/docs/user-journeys",
      icon: Target,
      description: "Stakeholder experience mapping"
    },
    {
      title: "Platform Overview",
      href: "/docs/platform-overview",
      icon: Sparkles,
      description: "High-level platform introduction"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/docs" className="flex items-center space-x-3">
              <ThemeLogo />
              <div>
                <h1 className="text-xl font-bold">User Guides</h1>
                <p className="text-sm text-muted-foreground">Comprehensive Platform Documentation</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Interactive Guides
              </Badge>
              <Badge variant="outline" className="text-xs hidden sm:flex">
                Updated: November 4, 2025
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">User Guides</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full mb-6">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              SHELTR User Guides
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Comprehensive documentation for every platform stakeholder
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <CheckCircle className="h-4 w-4" />
                <span>Step-by-Step Instructions</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <CheckCircle className="h-4 w-4" />
                <span>Interactive Examples</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <CheckCircle className="h-4 w-4" />
                <span>Best Practices</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Guides Grid */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Platform User Guides</h3>
            <p className="text-muted-foreground">
              Select your role to access tailored documentation and step-by-step guides
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <Card 
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-300 border-2 ${guide.borderColor} overflow-hidden`}
                >
                  <div className={`h-2 bg-gradient-to-r ${guide.gradient}`} />
                  
                  <CardHeader className={`bg-gradient-to-br ${guide.bgGradient}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${guide.gradient}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge className={`${guide.badgeColor} text-white text-xs`}>
                        {guide.badge}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl mb-2">{guide.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="space-y-3 mb-6">
                      <p className="text-sm font-semibold text-muted-foreground">Key Topics:</p>
                      <ul className="space-y-2">
                        {guide.keyFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <CheckCircle className={`h-4 w-4 text-${guide.color}-600 mr-2 mt-0.5 flex-shrink-0`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={guide.href}>
                      <Button 
                        className={`w-full group-hover:shadow-lg transition-all bg-gradient-to-r ${guide.gradient} text-white`}
                      >
                        Read Guide
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="max-w-7xl mx-auto">
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">Additional Resources</CardTitle>
                  <CardDescription>
                    Explore more documentation and technical resources
                  </CardDescription>
                </div>
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link key={index} href={link.href}>
                      <div className="p-4 rounded-lg border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-900 hover:shadow-md transition-all group">
                        <div className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                              {link.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {link.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/docs">
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse All Docs
                  </Button>
                </Link>
                <Link href="https://github.com/mrj0nesmtl/sheltr-ai/tree/main/docs/user-guides" target="_blank">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Get Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div className="max-w-7xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-lg text-blue-100 mb-6">
              Our AI-powered chatbot is available 24/7 to assist you with any questions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/docs/chatbot-user-guide">
                <Button size="lg" variant="secondary">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat with AI Assistant
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Contact Support Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

