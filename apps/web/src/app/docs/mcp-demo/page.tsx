import { Metadata } from 'next';
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
  ArrowLeft
} from 'lucide-react';
import { EnhancedMCPChatbot } from '@/components/EnhancedMCPChatbot';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export const metadata: Metadata = {
  title: 'OpenAI MCP Integration Demo | SHELTR-AI Documentation',
  description: 'Experience SHELTR-AI\'s advanced MCP-powered chatbot with OpenAI Agents SDK integration.',
  keywords: ['MCP', 'OpenAI', 'Agents', 'AI', 'Chatbot', 'SHELTR', 'Demo'],
};

export default function MCPDemoPage() {
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
                    <Badge className="bg-green-600 text-white text-sm">Production Ready</Badge>
                    <Badge className="bg-blue-600 text-white text-sm">MCP Enhanced</Badge>
                    <Badge className="bg-purple-600 text-white text-sm">AI Agents</Badge>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Experience SHELTR-AI's revolutionary chatbot powered by OpenAI's Model Context Protocol (MCP) and Agents SDK. Our AI assistant now has specialized agents for different tasks and enhanced capabilities beyond traditional chatbots.
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
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm">OpenAI Agents SDK integration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm">Firebase MCP server (36 tools)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm">Filesystem access for documentation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Web search capabilities</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-sm">Custom SHELTR FastAPI MCP backend</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              Specialized Agents
            </CardTitle>
            <CardDescription>
              Role-based AI agents for different user needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Analytics Agent</span>
                </div>
                <Badge variant="outline" className="text-xs">Admin Only</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Knowledge Agent</span>
                </div>
                <Badge variant="outline" className="text-xs">Authenticated</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Research Agent</span>
                </div>
                <Badge variant="outline" className="text-xs">All Users</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Support Agent</span>
                </div>
                <Badge variant="outline" className="text-xs">All Users</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-Based Access */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Role-Based Agent Access
          </CardTitle>
          <CardDescription>
            Different user roles have access to different AI agents and capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-600">Super Admin</h3>
              <div className="text-sm text-gray-600 space-y-1 mt-2">
                <div>✓ Analytics Agent</div>
                <div>✓ Knowledge Agent</div>
                <div>✓ Research Agent</div>
                <div>✓ Support Agent</div>
              </div>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-600">Platform Admin</h3>
              <div className="text-sm text-gray-600 space-y-1 mt-2">
                <div>✓ Analytics Agent</div>
                <div>✓ Knowledge Agent</div>
                <div>✓ Research Agent</div>
                <div>✓ Support Agent</div>
              </div>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-red-600">Donors & Users</h3>
              <div className="text-sm text-gray-600 space-y-1 mt-2">
                <div>✗ Analytics Agent</div>
                <div>✓ Knowledge Agent</div>
                <div>✓ Research Agent</div>
                <div>✓ Support Agent</div>
              </div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-600">Public Users</h3>
              <div className="text-sm text-gray-600 space-y-1 mt-2">
                <div>✗ Analytics Agent</div>
                <div>✗ Knowledge Agent</div>
                <div>✓ Research Agent</div>
                <div>✓ Support Agent</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Queries */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
            Example Queries to Try
          </CardTitle>
          <CardDescription>
            Try these sample queries to see different agents in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                Analytics Agent (Admin Only)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100">
                  "Show me platform analytics and user growth metrics"
                </div>
                <div className="p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100">
                  "Generate a donation impact report for this month"
                </div>
                <div className="p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100">
                  "What are the top performing shelters by donations?"
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-green-600" />
                Knowledge Agent (Authenticated)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-green-50 rounded cursor-pointer hover:bg-green-100">
                  "How do I create a new shelter profile in SHELTR?"
                </div>
                <div className="p-2 bg-green-50 rounded cursor-pointer hover:bg-green-100">
                  "Explain SHELTR's SmartFund distribution system"
                </div>
                <div className="p-2 bg-green-50 rounded cursor-pointer hover:bg-green-100">
                  "What are the participant onboarding steps?"
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Search className="h-4 w-4 mr-2 text-purple-600" />
                Research Agent (All Users)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-purple-50 rounded cursor-pointer hover:bg-purple-100">
                  "Research the latest homelessness statistics in California"
                </div>
                <div className="p-2 bg-purple-50 rounded cursor-pointer hover:bg-purple-100">
                  "Find information about housing-first policies"
                </div>
                <div className="p-2 bg-purple-50 rounded cursor-pointer hover:bg-purple-100">
                  "What are innovative solutions to homelessness?"
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-orange-600" />
                Support Agent (All Users)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-orange-50 rounded cursor-pointer hover:bg-orange-100">
                  "How do I make a donation through SHELTR?"
                </div>
                <div className="p-2 bg-orange-50 rounded cursor-pointer hover:bg-orange-100">
                  "I'm having trouble accessing my dashboard"
                </div>
                <div className="p-2 bg-orange-50 rounded cursor-pointer hover:bg-orange-100">
                  "What is SHELTR's mission and how does it work?"
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-blue-600" />
            Interactive MCP Demo
          </CardTitle>
          <CardDescription>
            Try the enhanced chatbot below. The agent selection will automatically adapt based on your login status and role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedMCPChatbot 
            title="SHELTR MCP Demo Assistant"
            showAgentSelector={true}
            defaultAgent="auto"
            maxHeight="500px"
          />
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-600" />
            Technical Implementation
          </CardTitle>
          <CardDescription>
            How SHELTR-AI implements OpenAI MCP integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">MCP Server Configuration</h4>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm font-mono">
                <div>Firebase MCP: 36 tools enabled</div>
                <div>Filesystem MCP: Documentation access</div>
                <div>Web Search MCP: Research capabilities</div>
                <div>Custom FastAPI MCP: SHELTR-specific tools</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Integration Features</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Streaming responses for real-time interaction</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Role-based agent access control</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Automatic agent selection based on query</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Error handling and fallback mechanisms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Health monitoring and diagnostics</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t">
        <div>
          <Link 
            href="/docs/chatbot-architecture" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Chatbot Architecture
          </Link>
        </div>
        <div>
          <Link 
            href="/docs/mcp-integration" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            MCP Integration Guide
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>

    {/* Footer */}
    <Footer />
    </div>
  );
}
