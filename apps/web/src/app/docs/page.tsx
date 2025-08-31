'use client';

import Link from 'next/link';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Users, 
  Shield, 
  Coins, 
  Book,
  Code,
  Building,
  LogIn,
  Menu,
  X,
  ArrowRight,
  Rocket,
  Heart,
  Building2,
  Mail,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function DocsPage() {
  const { user, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await addDoc(collection(db, 'newsletter_signups'), {
        email: email.trim(),
        source: 'docs_page_cta',
        page: 'documentation_hub',
        signup_date: Timestamp.now(),
        user_agent: navigator.userAgent,
        status: 'active'
      });

      setSubmitMessage('✅ Thank you! We\'ll be in touch soon.');
      setEmail('');
    } catch (error) {
      console.error('Error saving email:', error);
      setSubmitMessage('❌ Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  const coreDocuments = [
    {
      title: "Hacking Homelessness and the Theory of Change",
      description: "Executive overview of our theory of change, market analysis, and social impact framework",
      icon: Users,
      badge: "Thesis",
      badgeColor: "bg-purple-500",
      pages: "25 pages",
      audience: "Executives • Impact Investors • Media • Partners",
      topics: ["Theory of Change", "Market Analysis", "Social Impact", "Investment Thesis", "Implementation Roadmap"],
      link: "/docs/hacking-homelessness",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/01-overview/hacking_homelessness.md",
      lastUpdated: "July 20, 2025"
    },
    {
      title: "SHELTR Platform Architecture",
      description: "Complete site structure, role-based features, and comprehensive quality assurance testing framework",
      icon: Building,
      badge: "QA Framework",
      badgeColor: "bg-indigo-500",
      pages: "45 pages",
      audience: "QA Engineers • Developers • Project Managers • Technical Teams",
      topics: ["Site Architecture", "Role-Based Access", "Mobile Testing", "Authentication Flow", "Business Logic QA"],
      link: "/docs/website-architecture",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/website-architecture.md",
      lastUpdated: "August 4, 2025"
    },
    {
      title: "Technical White Paper",
      description: "Comprehensive technical documentation covering dual-token architecture, smart contracts, and implementation details",
      icon: FileText,
      badge: "Published",
      badgeColor: "bg-blue-500",
      pages: "67 pages",
      audience: "Technical Teams • Partners",
      topics: ["Dual-Token Economics", "Smart Contract Architecture", "Base Network Integration", "Security Framework", "Financial Projections"],
      link: "/docs/whitepaper",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/whitepaper_final.md",
      lastUpdated: "January 25, 2025"
    },
    {
      title: "Blockchain Architecture",
      description: "Deep technical dive into our Base network implementation, smart contracts, and verification systems",
      icon: Shield,
      badge: "Peer Review",
      badgeColor: "bg-green-500",
      pages: "45 pages",
      audience: "Developers • Blockchain Engineers • Security Auditors",
      topics: ["Smart Contract Code", "Base Network Integration", "Security Protocols", "Oracle Systems", "Token Utilities"],
      link: "/docs/blockchain",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/technical/blockchain.md",
      lastUpdated: "August 2025"
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
      lastUpdated: "August 9, 2025"
    },
    {
      title: "Shelter Administrator Guide",
      description: "Comprehensive guide for shelter administrators managing operations, participants, and services with SHELTR-AI",
      icon: Building2,
      badge: "Admin Guide",
      badgeColor: "bg-blue-600",
      pages: "25 pages",
      audience: "Shelter Administrators • Operations Managers • Staff",
      topics: ["Dashboard Management", "Participant Registration", "Service Coordination", "Resource Management", "Analytics & Reporting"],
      link: "/docs/shelter-admin-guide",
      downloadLink: "/user-journeys/shelters/",
      lastUpdated: "August 2025"
    },
    {
      title: "Donor Guide",
      description: "Complete guide for donors making transparent, impactful donations through QR codes and the SmartFund model",
      icon: Heart,
      badge: "Donor Guide",
      badgeColor: "bg-red-600",
      pages: "28 pages",
      audience: "Donors • Community Supporters • Corporate Partners",
      topics: ["QR Code Giving", "SmartFund Model", "Impact Tracking", "Payment Security", "Community Building"],
      link: "/docs/donor-guide",
      downloadLink: "/user-journeys/donors/",
      lastUpdated: "August 2025"
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
      downloadLink: "/user-journeys/participants/",
      lastUpdated: "July 2025"
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
                {user ? (
                  // Logged in user navigation
                  <>
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user.displayName || user.email}
                    </span>
                    <Link href={hasRole('donor') ? '/dashboard/donor' : hasRole('super_admin') ? '/dashboard' : hasRole('platform_admin') ? '/dashboard' : hasRole('participant') ? '/dashboard/participant' : '/dashboard'}>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  // Non-logged in navigation
                  <>
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
                  </>
                )}
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
                  {user ? (
                    // Logged in mobile menu
                    <>
                      <div className="text-sm text-muted-foreground px-3 py-2">
                        Welcome, {user.displayName || user.email}
                      </div>
                      <Link href={hasRole('donor') ? '/dashboard/donor' : hasRole('super_admin') ? '/dashboard' : hasRole('platform_admin') ? '/dashboard' : hasRole('participant') ? '/dashboard/participant' : '/dashboard'} className="block px-3 py-2 text-muted-foreground hover:text-primary">
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    // Non-logged in mobile menu
                    <>
                      <Link href="/login" className="block px-3 py-2 text-muted-foreground hover:text-primary">Sign In</Link>
                      <Link href="/register" className="block px-3 py-2 text-muted-foreground hover:text-primary">Get Started</Link>
                    </>
                  )}
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
          backgroundImage: "url('/backgrounds/iamdocumentation.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/55"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Book className="h-16 w-16 text-white/90" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-white">
              I am Documentation!
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Built on modern cloud infrastructure.
            </p>
            
            {/* Tech Stack Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1">
                🔥 FIREBASE
              </Badge>
              <Badge className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-3 py-1">
                ⚡ FASTAPI
              </Badge>
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1">
                ⚛️ REACT
              </Badge>
              <Badge className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-3 py-1">
                📱 EXPO
              </Badge>
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1">
                ⭐ STARS 12
              </Badge>
              <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-3 py-1">
                📄 LICENSE MIT
              </Badge>
              <Badge className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-3 py-1">
                🐍 PYTHON 3.11+
              </Badge>
            </div>
            
            {/* Last Updated Badge */}
            <div className="flex justify-center">
              <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 text-sm">
                📅 LAST UPDATED: AUGUST 29, 2025
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Core Documents */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Project Documentation</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Covering technical architecture, market analysis, 
              and implementation strategy for SHELTR&rsquo;s unique approach to charitable technology.
            </p>
          </div>

          <div className="grid lg:grid-cols-1 gap-6 max-w-5xl mx-auto">
            {coreDocuments.map((doc, index) => (
              <Card key={index} className="border-2 border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/70 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
                <CardHeader className="pb-4">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden space-y-4">
                    {/* Top Row: Icon and Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center shadow-sm">
                        <doc.icon className="h-7 w-7 text-primary" />
                      </div>
                      <Badge className={`${doc.badgeColor} text-white text-xs px-2 py-1 font-medium`}>
                        {doc.badge}
                      </Badge>
                    </div>
                    
                    {/* Title and Description */}
                    <div>
                      <CardTitle className="text-xl font-bold mb-2 leading-tight">{doc.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {doc.description}
                      </CardDescription>
                    </div>
                    
                    {/* Page Count and Update Date */}
                    <div className="flex items-center justify-between text-xs bg-muted/50 rounded-lg px-3 py-2">
                      <span className="font-semibold text-foreground">{doc.pages}</span>
                      <span className="text-muted-foreground">Updated {doc.lastUpdated}</span>
                    </div>
                  </div>
                  
                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-start justify-between">
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
                  <div className="space-y-4 sm:space-y-6">
                    {/* Mobile: Stacked Layout */}
                    <div className="block sm:hidden space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-foreground text-sm">Target Audience</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{doc.audience}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 text-foreground text-sm">Key Topics</h4>
                        <div className="flex flex-wrap gap-1">
                          {doc.topics.slice(0, 3).map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="outline" className="text-xs px-2 py-1 hover:bg-primary/10 transition-colors">
                              {topic}
                            </Badge>
                          ))}
                          {doc.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground">
                              +{doc.topics.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop: Grid Layout */}
                    <div className="hidden sm:grid md:grid-cols-2 gap-6">
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
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
                      <Link href={doc.link} className="flex-1">
                        <Button className="w-full h-10 sm:h-12 text-sm sm:text-base bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                          <span className="hidden sm:inline">View Online</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </Link>
                      {doc.downloadLink.startsWith('/') ? (
                        <Link href={doc.downloadLink} className="flex-1">
                          <Button variant="outline" className="w-full h-10 sm:h-12 text-sm sm:text-base border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                            <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            <span className="hidden sm:inline">View User Journey</span>
                            <span className="sm:hidden">Journey</span>
                          </Button>
                        </Link>
                      ) : (
                        <a href={doc.downloadLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" className="w-full h-10 sm:h-12 text-sm sm:text-base border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                            <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            <span className="hidden sm:inline">View on GitHub</span>
                            <span className="sm:hidden">GitHub</span>
                          </Button>
                        </a>
                      )}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {additionalResources.map((resource, index) => (
              <Card key={index} className="border-2 border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/70 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                      <resource.icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {resource.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold leading-tight">{resource.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {resource.isInternal ? (
                    <Link href={resource.link}>
                      <Button variant="outline" className="w-full h-9 text-sm border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                        <span className="hidden sm:inline">View Resource</span>
                        <span className="sm:hidden">View</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full h-9 text-sm border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                        <span className="hidden sm:inline">Open External</span>
                        <span className="sm:hidden">Open</span>
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
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
            <h2 className="text-3xl font-bold mb-6">Get Updates & Technical Support</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Stay informed about platform updates, API changes, and new documentation. 
              Our team will personally reach out for technical support, partnership opportunities, 
              or integration inquiries.
            </p>
            
            {/* Email Capture Form */}
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email for updates"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 px-6"
                  disabled={isSubmitting || !email.trim()}
                >
                  {isSubmitting ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            {/* Status Message */}
            {submitMessage && (
              <div className={`text-sm mb-6 p-3 rounded-lg ${
                submitMessage.includes('✅') 
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
              }`}>
                {submitMessage}
              </div>
            )}
            
            {/* Contact Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:joel@arcanaconcept.com">
                <Button size="lg" variant="outline" className="border-2">
                  <Mail className="h-5 w-5 mr-2" />
                  Direct Contact
                </Button>
              </a>
              <a href="https://github.com/mrj0nesmtl/sheltr-ai" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-2">
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