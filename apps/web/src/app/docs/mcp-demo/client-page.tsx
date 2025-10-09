'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Zap, 
  Brain, 
  BarChart3, 
  Search, 
  MessageSquare,
  Crown,
  Shield,
  Users,
  Heart,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { EnhancedMCPChatbot } from '@/components/EnhancedMCPChatbot';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { useAuth } from '@/contexts/AuthContext';

export default function MCPDemoClientPage() {
  const { user, loading: authLoading, hasRole } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    // Check if user is authorized (super_admin or platform_admin)
    if (!user) {
      router.push('/portal');
      return;
    }

    const checkAccess = async () => {
      const isSuperAdmin = await hasRole('super_admin');
      const isPlatformAdmin = await hasRole('platform_admin');
      
      if (isSuperAdmin || isPlatformAdmin) {
        setIsAuthorized(true);
      } else {
        router.push('/portal');
      }
      setIsChecking(false);
    };

    checkAccess();
  }, [user, authLoading, hasRole, router]);

  if (authLoading || isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

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
              <Link href="/portal/founders-only">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portal
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">OpenAI MCP Integration Demo <Zap className="inline h-8 w-8 text-yellow-500 ml-2" /></h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-red-600 text-white text-sm">🔒 Founders Only</Badge>
                    <Badge className="bg-green-600 text-white text-sm">Production Ready</Badge>
                    <Badge className="bg-blue-600 text-white text-sm">MCP Enhanced</Badge>
                    <Badge className="bg-purple-600 text-white text-sm">AI Agents</Badge>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Experience SHELTR-AI&apos;s revolutionary chatbot powered by OpenAI&apos;s Model Context Protocol (MCP) and Agents SDK. Our AI assistant now has specialized agents for different tasks and enhanced capabilities beyond traditional chatbots.
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>Updated September 22, 2025</span>
                  <span>•</span>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">DEMO ACTIVE</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

      {/* MCP Architecture Overview */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              MCP Architecture
            </CardTitle>
            <CardDescription>
              Model Context Protocol standardizes AI tool integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              MCP provides a unified interface for AI agents to access external tools, data sources, and services. This enables our chatbot to perform real-world actions beyond simple text responses.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-sm">Standardized tool integration</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-sm">Role-based agent specialization</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-sm">Real-time data access</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              Enhanced Capabilities
            </CardTitle>
            <CardDescription>
              Powered by OpenAI Agents SDK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our enhanced chatbot goes beyond traditional Q&A by leveraging specialized AI agents that can perform actions, analyze data, and provide contextual assistance based on your role.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-sm">Dynamic agent selection</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-sm">Context-aware responses</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-sm">Multi-turn conversations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example Queries Section */}
      <section className="mb-12 max-w-4xl mx-auto">
        <Card className="border-green-200 dark:border-green-900/50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700 dark:text-green-400">
              <MessageSquare className="h-5 w-5 mr-2" />
              Example Queries to Try
            </CardTitle>
            <CardDescription>
              Try these sample queries to see different agents in action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Analytics Agent Examples */}
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-sm">Analytics Agent (Admin Only)</h4>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• &quot;Show me donation trends for the past month&quot;</li>
                <li>• &quot;What are the top performing shelters?&quot;</li>
                <li>• &quot;Analyze participant engagement metrics&quot;</li>
              </ul>
            </div>

            {/* Knowledge Agent Examples */}
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-sm">Knowledge Agent (Authenticated)</h4>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• &quot;How does the SmartFund donation model work?&quot;</li>
                <li>• &quot;Explain the blockchain architecture&quot;</li>
                <li>• &quot;What is the MSB registration process?&quot;</li>
              </ul>
            </div>

            {/* Research Agent Examples */}
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold text-sm">Research Agent (All Users)</h4>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• &quot;Find information about homeless shelters in Toronto&quot;</li>
                <li>• &quot;Research best practices for shelter management&quot;</li>
                <li>• &quot;What are HMIS systems?&quot;</li>
              </ul>
            </div>

            {/* Support Agent Examples */}
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-orange-600" />
                <h4 className="font-semibold text-sm">Support Agent (All Users)</h4>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• &quot;How do I make a donation?&quot;</li>
                <li>• &quot;I need help with my account&quot;</li>
                <li>• &quot;What are the different user roles?&quot;</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Interactive MCP Demo */}
      <section className="mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="bg-blue-600 text-white text-sm mb-4">🤖 INTERACTIVE MCP DEMO</Badge>
            <h2 className="text-3xl font-bold mb-4">SHELTR MCP Demo Assistant</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Try the enhanced chatbot below. The agent selection will automatically adapt based on your login status and role.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-900/50">
            <EnhancedMCPChatbot />
          </div>
        </div>
      </section>

      {/* Agent Capabilities Grid */}
      <section className="mb-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Role-Based Agent Capabilities</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-blue-200 dark:border-blue-900/50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700 dark:text-blue-400">
                <Crown className="h-5 w-5 mr-2" />
                Super Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Access to all MCP agents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Advanced analytics and reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>System configuration queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>User management assistance</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
                <Shield className="h-5 w-5 mr-2" />
                Platform Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Analytics agent access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Knowledge base queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Shelter management support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Platform documentation access</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-900/50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700 dark:text-green-400">
                <Users className="h-5 w-5 mr-2" />
                Shelter Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Participant management queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Donation tracking assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Shelter operations support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Resource allocation insights</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-900/50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700 dark:text-orange-400">
                <Heart className="h-5 w-5 mr-2" />
                Public & Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span>General platform information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span>Donation process guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span>Support and help queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span>Public research assistance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="mb-12 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-indigo-600" />
              Technical Architecture
            </CardTitle>
            <CardDescription>
              How our MCP integration works under the hood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm">1. Agent Selection Layer</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically detects user authentication status and role, then routes queries to the appropriate specialized agent.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">2. MCP Tool Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Each agent has access to specific MCP tools for data retrieval, analytics, and action execution based on role permissions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">3. Context Management</h4>
                <p className="text-sm text-muted-foreground">
                  Maintains conversation context and user preferences across multiple interactions for personalized assistance.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">4. Response Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Leverages OpenAI&apos;s latest models with custom instructions and knowledge base integration for accurate, context-aware responses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center mb-12">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-900/50">
          <CardContent className="pt-6">
            <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-2xl font-bold mb-2">Ready to experience the future of AI assistance?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start chatting with our MCP-powered assistant above or explore our comprehensive documentation to learn more about the technical implementation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/docs/chatbot-architecture">
                  View Agent Architecture
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/docs/mcp-integration">
                  MCP Integration Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      </div>

      <Footer />
    </div>
  );
}

