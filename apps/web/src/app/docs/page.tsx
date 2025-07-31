'use client';

import Link from 'next/link';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Users, 
  Shield, 
  Coins, 
  BarChart3,
  Book,
  Code,
  Building,
  LogIn,
  Menu,
  X,
  ArrowRight,
  Lock,
  Rocket,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const coreDocuments = [
    {
      title: "Technical White Paper",
      description: "Comprehensive technical documentation covering dual-token architecture, smart contracts, and implementation details",
      icon: FileText,
      badge: "Investment Grade",
      badgeColor: "bg-blue-500",
      pages: "67 pages",
      audience: "Investors • Technical Teams • Partners",
      topics: ["Dual-Token Economics", "Smart Contract Architecture", "Base Network Integration", "Security Framework", "Financial Projections"],
      link: "/docs/whitepaper",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/whitepaper_final.md",
      lastUpdated: "January 25, 2025"
    },
    {
      title: "Blockchain Architecture",
      description: "Deep technical dive into our Base network implementation, smart contracts, and verification systems",
      icon: Shield,
      badge: "Technical",
      badgeColor: "bg-green-500",
      pages: "45 pages",
      audience: "Developers • Blockchain Engineers • Security Auditors",
      topics: ["Smart Contract Code", "Base Network Integration", "Security Protocols", "Oracle Systems", "Token Utilities"],
      link: "/docs/blockchain",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/technical/blockchain.md",
      lastUpdated: "January 25, 2025"
    },
    {
      title: "Hacking Homelessness",
      description: "Executive overview of our theory of change, market analysis, and social impact framework",
      icon: Users,
      badge: "Executive Summary",
      badgeColor: "bg-purple-500",
      pages: "25 pages",
      audience: "Executives • Impact Investors • Media • Partners",
      topics: ["Theory of Change", "Market Analysis", "Social Impact", "Investment Thesis", "Implementation Roadmap"],
      link: "/docs/hacking-homelessness",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/01-overview/hacking_homelessness.md",
      lastUpdated: "January 25, 2025"
    },
    {
      title: "API Documentation",
      description: "Comprehensive API reference for developers, integration guides, and technical specifications",
      icon: Code,
      badge: "Technical",
      badgeColor: "bg-orange-500",
      pages: "32 pages",
      audience: "Developers • System Integrators • Technical Partners",
      topics: ["REST API Endpoints", "Authentication", "Rate Limiting", "Error Handling", "SDK Integration"],
      link: "/docs/api",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/03-api/README.md",
      lastUpdated: "January 25, 2025"
    },
    {
      title: "Participant User Guide",
      description: "Complete guide for participants using the SHELTR platform, from onboarding to advanced features",
      icon: Users,
      badge: "User Guide",
      badgeColor: "bg-teal-500",
      pages: "28 pages",
      audience: "Participants • Support Staff • Shelter Administrators",
      topics: ["Platform Onboarding", "QR Code Usage", "Wallet Management", "Service Access", "Support Resources"],
      link: "/docs/participant-guide",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/06-user-guides/participant-guide.md",
      lastUpdated: "January 25, 2025"
    }
  ];

  const additionalResources = [
    {
      title: "Development Roadmap",
      description: "Detailed development timeline, milestones, and feature planning",
      icon: Rocket,
      link: "/docs/roadmap",
      isInternal: true,
      badge: "Planning"
    },
    {
      title: "GitHub Repository",
      description: "Open source codebase and development updates",
      icon: ExternalLink,
      link: "https://github.com/mrj0nesmtl/sheltr-ai",
      isInternal: false,
      badge: "Public"
    },
    {
      title: "Tokenomics Deep Dive",
      description: "Detailed analysis of SHELTR and SHELTR-S token economics",
      icon: Coins,
      link: "/tokenomics",
      isInternal: true,
      badge: "Interactive"
    },
    {
      title: "Community Support",
      description: "Get help, share feedback, and connect with the SHELTR community",
      icon: Heart,
      link: "mailto:joel@arcanaconcept.com",
      isInternal: false,
      badge: "Support"
    }
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
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
                <Link href="/" className="block px-3 py-2 text-muted-foreground hover:text-primary">Home</Link>
                <Link href="/about" className="block px-3 py-2 text-muted-foreground hover:text-primary">About</Link>
                <Link href="/solutions" className="block px-3 py-2 text-muted-foreground hover:text-primary">Solutions</Link>
                <Link href="/scan-give" className="block px-3 py-2 text-muted-foreground hover:text-primary">Scan & Give</Link>
                <Link href="/impact" className="block px-3 py-2 text-muted-foreground hover:text-primary">Impact</Link>
                <Link href="/docs" className="block px-3 py-2 text-foreground hover:text-primary">Docs</Link>
                <div className="border-t pt-3 mt-3">
                  <Link href="/login" className="block px-3 py-2 text-muted-foreground hover:text-primary">Sign In</Link>
                  <Link href="/register" className="block px-3 py-2 text-muted-foreground hover:text-primary">Get Started</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 50%, hsl(var(--secondary)) 100%)"
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Book className="h-16 w-16 text-white/90" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-white">
              SHELTR Documentation Hub
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Comprehensive technical documentation, investment materials, and implementation guides 
              for the world&rsquo;s first dual-token charitable ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-black hover:bg-white/90">
                <Download className="h-5 w-5 mr-2" />
                Download All Documents
              </Button>
              <Button size="lg" variant="outline" className="border-white text-black bg-white/10 hover:bg-white hover:text-black">
                <Building className="h-5 w-5 mr-2" />
                View GitHub Repository
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Documents */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Documentation</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Investment-grade documentation covering technical architecture, market analysis, 
              and implementation strategy for SHELTR&rsquo;s revolutionary approach to charitable technology.
            </p>
          </div>

          <div className="grid lg:grid-cols-1 gap-8 max-w-5xl mx-auto">
            {coreDocuments.map((doc, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                        <doc.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-2xl">{doc.title}</CardTitle>
                          <Badge className={`${doc.badgeColor} text-white text-sm px-3 py-1`}>
                            {doc.badge}
                          </Badge>
                        </div>
                        <CardDescription className="text-base leading-relaxed">
                          {doc.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                      <div className="font-semibold">{doc.pages}</div>
                      <div className="text-xs">Updated {doc.lastUpdated}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-foreground">Target Audience</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{doc.audience}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-foreground">Key Topics Covered</h4>
                        <div className="flex flex-wrap gap-2">
                          {doc.topics.map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="outline" className="text-xs hover:bg-primary/10 transition-colors">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4 border-t">
                      <Link href={doc.link} className="flex-1">
                        <Button className="w-full h-12 text-base">
                          <FileText className="h-5 w-5 mr-2" />
                          View Online
                        </Button>
                      </Link>
                      <a href={doc.downloadLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full h-12 text-base border-2 hover:border-primary">
                          <Download className="h-5 w-5 mr-2" />
                          View on GitHub
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
            <p className="text-lg text-muted-foreground">
              Explore interactive demos, developer tools, and community resources
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <resource.icon className="h-8 w-8 text-primary" />
                    <Badge variant="outline" className="text-xs">
                      {resource.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {resource.isInternal ? (
                    <Link href={resource.link}>
                      <Button variant="outline" className="w-full">
                        View Resource
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full">
                        Open External
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Need More Information?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact our team for technical support, partnership opportunities, 
              or platform integration inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:joel@arcanaconcept.com">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Users className="h-5 w-5 mr-2" />
                  Contact Team
                </Button>
              </a>
              <a href="https://github.com/mrj0nesmtl/sheltr-ai" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 