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
  ArrowRight,
  Rocket,
  Heart,
  Building2,
  Mail,
  Send,
  MessageSquare,
  CheckSquare,
  BookOpen,
  Eye,
  Github,
  CreditCard,
  TreePine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { UnifiedInquiryService } from '@/services/unifiedInquiryService';
import PublicNavigation from '@/components/PublicNavigation';

export default function DocsPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await UnifiedInquiryService.createNewsletterSignup({
        email: email.trim(),
        source: 'docs_page_cta',
        page: 'documentation_hub'
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
      description: "Revolutionary AI-powered ecosystem combining enterprise payment infrastructure with blockchain transparency and physical infrastructure deployment",
      icon: Users,
      badge: "Strategic Vision",
      badgeColor: "border-purple-400 text-purple-400",
      audience: "Executives • Impact Investors • AI Engineers • Tech-for-Good Partners",
      topics: ["AI & Tech-for-Good Revolution", "Single-Token Stable Architecture", "Zero Risk Protection", "Enterprise Infrastructure", "Intelligent Resource Allocation"],
      link: "/docs/hacking-homelessness",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/01-overview/hacking_homelessness.md",
      lastUpdated: "September 26, 2025"
    },
    {
      title: "Platform Architecture",
      description: "Complete site structure, role-based features, and comprehensive quality assurance testing framework",
      icon: Building,
      badge: "Architecture",
      badgeColor: "border-blue-400 text-blue-400",
      audience: "QA Engineers • Developers • Project Managers • Technical Teams",
      topics: ["Site Architecture", "Role-Based Access", "Mobile Testing", "Authentication Flow", "Business Logic QA"],
      link: "/docs/website-architecture",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/website-architecture.md",
      lastUpdated: "September 21, 2025"
    },
    {
      title: "White Paper",
      description: "Explore SHELTR's enterprise-grade platform combining traditional payment stability with blockchain transparency through single-token architecture",
      icon: FileText,
      badge: "Published",
      badgeColor: "border-emerald-400 text-emerald-400",
      audience: "CFOs • Payment Architects • Enterprise Partners • Investment Teams",
      topics: ["Single-Token Stable Architecture", "Enterprise Payment Infrastructure", "Zero Risk Protection", "Guaranteed Returns", "Strategic Implementation"],
      link: "/docs/whitepaper",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/whitepaper_final.md",
      lastUpdated: "September 26, 2025"
    },
    {
      title: "Blockchain Architecture",
      description: "Single-token stable fund ecosystem with enterprise payment infrastructure and guaranteed institutional returns",
      icon: Shield,
      badge: "Implementation",
      badgeColor: "border-emerald-400 text-emerald-400",
      audience: "Developers • Blockchain Engineers • Enterprise Partners • Security Auditors",
      topics: ["Single-Token Architecture", "Smart Contracts", "Base Network", "Enterprise Security", "Coinbase Integration", "Zero Risk Design"],
      link: "/docs/blockchain",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/technical/blockchain.md",
      lastUpdated: "September 26, 2025"
    },
    {
      title: "API Documentation",
      description: "Comprehensive API reference for developers, integration guides, and technical specifications",
      icon: Code,
      badge: "Technical",
      badgeColor: "border-orange-400 text-orange-400",
      audience: "Developers • System Integrators • Technical Partners",
      topics: ["REST API Endpoints", "Authentication", "Rate Limiting", "Error Handling", "SDK Integration"],
      link: "/docs/api",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/03-api/README.md",
      lastUpdated: "September 21, 2025"
    },
    {
      title: "Payment Rail Architecture",
      description: "Revolutionary single-token stable fund system with Adyen payment processing and Coinbase institutional staking",
      icon: CreditCard,
      badge: "Enterprise",
      badgeColor: "border-emerald-400 text-emerald-400",
      audience: "CFOs • Payment Architects • Enterprise Partners • Financial Teams",
      topics: ["Adyen Integration", "Coinbase Staking", "Single-Token Model", "Enterprise Infrastructure", "Guaranteed Returns"],
      link: "/docs/payment-rails",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/payment-rails/sheltr-unified-payment-architecture.md",
      lastUpdated: "September 26, 2025"
    },
    {
      title: "Systems Design",
      description: "Multi-tenant SaaS architecture with enterprise payment infrastructure, visual flow diagrams, and comprehensive system integration",
      icon: Building2,
      badge: "Architecture",
      badgeColor: "border-blue-400 text-blue-400",
      audience: "System Architects • DevOps Engineers • Technical Leaders • Enterprise Partners",
      topics: ["Multi-Tenant Architecture", "Enterprise Payment Flow", "Base Network Integration", "Visual System Diagrams", "Scalability Design"],
      link: "/docs/system-design",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/system-design.md",
      lastUpdated: "September 28, 2025"
    },
    {
      title: "Development Roadmap",
      description: "60-day public launch timeline with client onboarding strategy, AI hyper chatbot achievements, and enterprise payment integration",
      icon: Rocket,
      badge: "Launch Plan",
      badgeColor: "border-orange-400 text-orange-400",
      audience: "Project Managers • Investors • Technical Teams • Business Partners",
      topics: ["60-Day Launch Timeline", "Client Onboarding Strategy", "AI Hyper Chatbot", "Enterprise Payment Integration", "Success Metrics"],
      link: "/docs/roadmap",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/dev-roadmap.md",
      lastUpdated: "September 27, 2025"
    },
    {
      title: "Agent Architecture",
      description: "Comprehensive guide to SHELTR-AI's multi-agent chatbot system with MCP-powered workflow automation",
      icon: MessageSquare,
      badge: "AI System",
      badgeColor: "border-amber-400 text-amber-400",
      audience: "AI Engineers • Developers • System Architects • Technical Teams",
      topics: ["Multi-Agent System", "MCP Integration", "Workflow Automation", "RAG Integration", "Role-Based Routing"],
      link: "/docs/chatbot-architecture",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/CHATBOT-AGENT-ARCHITECTURE.md",
      lastUpdated: "September 22, 2025"
    },
    {
      title: "MCP Integrations",
      description: "Model Context Protocol implementation enabling AI agents to execute real-world actions and automated workflows",
      icon: Rocket,
      badge: "MCP System",
      badgeColor: "border-purple-400 text-purple-400",
      audience: "AI Engineers • Full-Stack Developers • System Architects • DevOps Engineers",
      topics: ["Model Context Protocol", "Workflow Automation", "Tool Integration", "FastAPI Backend", "React Frontend"],
      link: "/docs/mcp-integration",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/MCP-INTEGRATION-GUIDE.md",
      lastUpdated: "September 22, 2025"
    },
    {
      title: "Functionality Matrix",
      description: "Comprehensive testing matrix for all features, data storage/retrieval, business logic, and user workflows",
      icon: CheckSquare,
      badge: "QA Framework",
      badgeColor: "border-teal-400 text-teal-400",
      audience: "QA Engineers • Developers • Project Managers • Technical Teams",
      topics: ["Testing Matrix", "Business Logic", "User Workflows", "Data Validation", "Platform Status"],
      link: "/docs/functionality-matrix",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/COMPLETE-FUNCTIONALITY-MATRIX-UPDATED.md",
      lastUpdated: "September 21, 2025"
    },
    {
      title: "Knowledge Base Guide",
      description: "Complete guide for updating SHELTR-AI Knowledge Base documents with embedding regeneration",
      icon: BookOpen,
      badge: "AI System",
      badgeColor: "border-amber-400 text-amber-400",
      audience: "Developers • System Administrators • Content Managers • Technical Teams",
      topics: ["Document Updates", "Embedding Regeneration", "RAG System", "Firebase Storage", "Chatbot Integration"],
      link: "/docs/knowledge-base-guide",
      downloadLink: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/04-development/KNOWLEDGE-BASE-UPDATE-GUIDE.md",
      lastUpdated: "September 21, 2025"
    },
    {
      title: "Shelter Administrator Guide",
      description: "Comprehensive guide for shelter administrators managing operations, participants, and services with SHELTR-AI",
      icon: Building2,
      badge: "Admin Guide",
      badgeColor: "border-blue-400 text-blue-400",
      audience: "Shelter Administrators • Operations Managers • Staff",
      topics: ["Dashboard Management", "Participant Registration", "Service Coordination", "Resource Management", "Analytics & Reporting"],
      link: "/docs/shelter-admin-guide",
      downloadLink: "/user-journeys/shelters/",
      lastUpdated: "September 21, 2025"
    },
    {
      title: "Donor Guide",
      description: "Complete guide for donors making transparent, impactful donations through QR codes and the SmartFund™ model",
      icon: Heart,
      badge: "Donor Guide",
      badgeColor: "border-red-400 text-red-400",
      audience: "Donors • Community Supporters • Corporate Partners",
      topics: ["QR Code Giving", "SmartFund™ Model", "Impact Tracking", "Payment Security", "Community Building"],
      link: "/docs/donor-guide",
      downloadLink: "/user-journeys/donors/",
      lastUpdated: "September 21, 2025"
    },
    {
      title: "Participant Guide",
      description: "Complete guide for participants using the SHELTR platform, from onboarding to advanced features",
      icon: Users,
      badge: "User Guide",
      badgeColor: "border-teal-400 text-teal-400",
      audience: "Participants • Support Staff • Shelter Administrators",
      topics: ["Platform Onboarding", "QR Code Usage", "Wallet Management", "Service Access", "Support Resources"],
      link: "/docs/participant-guide",
      downloadLink: "/user-journeys/participants/",
      lastUpdated: "September 21, 2025"
    }
  ];

  const additionalResources = [
    {
      title: "Project Tree",
      description: "Comprehensive project structure reference for developers and contributors",
      icon: TreePine,
      link: "https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/PROJECT-TREE.md",
      isInternal: false,
      badge: "Reference"
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
      {/* Navigation - Now using unified PublicNavigation component */}
      <PublicNavigation />

      {/* Hero Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: "url('/backgrounds/hero-bg.jpg')",
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
              Documentation
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Built on modern cloud infrastructure with AI-powered intelligent systems.
            </p>
            
            {/* Tech Stack Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                🔥 FIREBASE
              </Badge>
              <Badge variant="outline" className="border-teal-400 text-teal-400 hover:bg-teal-400/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                ⚡ FASTAPI
              </Badge>
              <Badge variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                ⚛️ REACT
              </Badge>
              <Badge variant="outline" className="border-gray-400 text-gray-300 hover:bg-gray-400/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                📱 EXPO
              </Badge>
              <Badge variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                🤖 MCP INTEGRATION
              </Badge>
              <Badge variant="outline" className="border-indigo-400 text-indigo-400 hover:bg-indigo-400/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                🔍 SEMANTIC SEARCH
              </Badge>
              <Badge variant="outline" className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                🧠 HYPERBOTS
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-400/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                🏦 COINBASE
              </Badge>
              <Badge variant="outline" className="border-blue-300 text-blue-300 hover:bg-blue-300/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                ⭐ STARS 12
              </Badge>
              <Badge variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                📄 LICENSE MIT
              </Badge>
              <Badge variant="outline" className="border-slate-400 text-slate-300 hover:bg-slate-400/10 backdrop-blur-sm bg-black/20 font-semibold px-3 py-1">
                🐍 PYTHON 3.11+
              </Badge>
            </div>
            
            {/* Last Updated Badge */}
            <div className="flex justify-center">
              <Badge variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/10 backdrop-blur-sm bg-black/20 font-semibold px-4 py-2 text-sm">
                📅 LAST UPDATED: October 1, 2025
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
              <Card key={index} className="border-2 border-gray-400 dark:border-gray-600 hover:border-primary/80 dark:hover:border-primary/90 hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 shadow-md">
                <CardHeader className="pb-4">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden space-y-4">
                    {/* Top Row: Icon and Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center shadow-sm">
                        <doc.icon className="h-7 w-7 text-primary" />
                      </div>
                      <Badge variant="outline" className={`${doc.badgeColor} hover:bg-opacity-10 backdrop-blur-sm bg-background/50 text-xs px-2 py-1 font-medium`}>
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
                    
                    {/* Update Date */}
                    <div className="flex items-center justify-end text-xs bg-muted/50 rounded-lg px-3 py-2">
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
                          <Badge variant="outline" className={`${doc.badgeColor} hover:bg-opacity-10 backdrop-blur-sm bg-background/50 text-sm px-3 py-1`}>
                            {doc.badge}
                          </Badge>
                        </div>
                        <CardDescription className="text-base leading-relaxed">
                          {doc.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
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
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
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
                            <Github className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
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
              <Card key={index} className="border-2 border-gray-400 dark:border-gray-600 hover:border-primary/80 dark:hover:border-primary/90 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
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