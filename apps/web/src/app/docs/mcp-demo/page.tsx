import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  ArrowRight
} from 'lucide-react';
import { EnhancedMCPChatbot } from '@/components/EnhancedMCPChatbot';

export const metadata: Metadata = {
  title: 'OpenAI MCP Integration Demo | SHELTR-AI Documentation',
  description: 'Experience SHELTR-AI\'s advanced MCP-powered chatbot with OpenAI Agents SDK integration.',
  keywords: ['MCP', 'OpenAI', 'Agents', 'AI', 'Chatbot', 'SHELTR', 'Demo'],
};

export default function MCPDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Bot className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OpenAI MCP Integration Demo
          </h1>
          <Zap className="h-8 w-8 text-yellow-500 ml-3" />
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Experience SHELTR-AI's revolutionary chatbot powered by OpenAI's Model Context Protocol (MCP) 
          and Agents SDK. Our AI assistant now has specialized agents for different tasks and enhanced 
          capabilities beyond traditional chatbots.
        </p>
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Production Ready
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Zap className="h-3 w-3 mr-1" />
            MCP Enhanced
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Brain className="h-3 w-3 mr-1" />
            AI Agents
          </Badge>
        </div>
      </div>

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
          <a 
            href="/docs/chatbot-architecture" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Chatbot Architecture
          </a>
        </div>
        <div>
          <a 
            href="/docs/mcp-integrations" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            MCP Integration Guide
            <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
