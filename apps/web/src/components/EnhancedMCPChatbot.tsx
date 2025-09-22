"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Crown, 
  Shield, 
  Users, 
  Heart,
  Zap,
  Brain,
  Search,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { sheltrOpenAIMCP, type SheltrOpenAIMCPConfig } from '@/services/openaiMcpService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mcpAgent?: 'analytics' | 'knowledge' | 'research' | 'support' | 'custom';
  isStreaming?: boolean;
  error?: string;
}

interface EnhancedMCPChatbotProps {
  title?: string;
  placeholder?: string;
  maxHeight?: string;
  showAgentSelector?: boolean;
  defaultAgent?: 'analytics' | 'knowledge' | 'research' | 'support' | 'auto';
}

export function EnhancedMCPChatbot({ 
  title = "SHELTR AI Assistant",
  placeholder,
  maxHeight = "600px",
  showAgentSelector = true,
  defaultAgent = 'auto'
}: EnhancedMCPChatbotProps) {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<'analytics' | 'knowledge' | 'research' | 'support' | 'auto'>(defaultAgent);
  const [availableAgents, setAvailableAgents] = useState<string[]>([]);
  const [mcpInitialized, setMcpInitialized] = useState(false);
  const [mcpError, setMcpError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageRef = useRef<string>('');

  // Initialize OpenAI MCP service
  useEffect(() => {
    const initializeMCP = async () => {
      if (!user) return;

      try {
        console.log('🤖 [Enhanced MCP] Initializing OpenAI MCP for user:', user.email);
        
        const config: SheltrOpenAIMCPConfig = {
          userRole: user.role as any || 'public',
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'User',
          projectPath: '/Users/mrjones/Github/Projects/sheltr-ai'
        };

        await sheltrOpenAIMCP.initializeAgents(config);
        const agents = sheltrOpenAIMCP.getAvailableAgents(user.role || 'public');
        setAvailableAgents(agents);
        setMcpInitialized(true);
        setMcpError(null);

        // Add welcome message
        const welcomeMessage: Message = {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date(),
          mcpAgent: 'support'
        };
        setMessages([welcomeMessage]);

      } catch (error) {
        console.error('❌ [Enhanced MCP] Failed to initialize:', error);
        setMcpError(error instanceof Error ? error.message : 'Failed to initialize MCP');
        setMcpInitialized(false);
      }
    };

    initializeMCP();

    // Cleanup on unmount
    return () => {
      sheltrOpenAIMCP.cleanup().catch(console.error);
    };
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = useCallback(() => {
    if (!isAuthenticated || !user) {
      return "👋 Welcome to SHELTR-AI! I'm your AI assistant. I can help you learn about our platform, research homelessness solutions, and answer general questions. How can I help you today?";
    }

    const firstName = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'there';
    const roleSpecificMessage = getRoleSpecificWelcome(user.role || '');

    return `👋 Hello ${firstName}! ${roleSpecificMessage}

I'm powered by advanced MCP (Model Context Protocol) technology and can help you with:
${getAvailableCapabilities().map(cap => `• ${cap}`).join('\n')}

What would you like to explore today?`;
  }, [isAuthenticated, user]);

  const getRoleSpecificWelcome = (role: string): string => {
    switch (role) {
      case 'super_admin':
        return "As Super Admin, you have access to all my advanced capabilities including platform analytics, system insights, and comprehensive knowledge base access.";
      case 'platform_admin':
        return "As Platform Administrator, you can access analytics, knowledge base, research tools, and administrative functions.";
      case 'admin':
        return "As a Shelter Administrator, I can help you with shelter operations, participant management, and platform guidance.";
      case 'donor':
        return "As a valued donor, I can help you track your impact, find giving opportunities, and learn about SHELTR's mission.";
      case 'participant':
        return "I'm here to help you navigate SHELTR's services, find resources, and connect with support opportunities.";
      default:
        return "I'm here to help you understand SHELTR-AI and how we're working to end homelessness through technology.";
    }
  };

  const getAvailableCapabilities = (): string[] => {
    const capabilities: string[] = ['General platform support and guidance', 'Research homelessness solutions and statistics'];
    
    if (availableAgents.includes('knowledge')) {
      capabilities.push('Search SHELTR documentation and knowledge base');
    }
    
    if (availableAgents.includes('analytics')) {
      capabilities.push('Analyze platform metrics and generate reports');
      capabilities.push('Provide data-driven insights and recommendations');
    }

    return capabilities;
  };

  const determineOptimalAgent = (query: string): 'analytics' | 'knowledge' | 'research' | 'support' => {
    const lowerQuery = query.toLowerCase();
    
    // Analytics keywords
    if (availableAgents.includes('analytics') && 
        (lowerQuery.includes('analytics') || lowerQuery.includes('metrics') || 
         lowerQuery.includes('data') || lowerQuery.includes('report') || 
         lowerQuery.includes('statistics') || lowerQuery.includes('dashboard'))) {
      return 'analytics';
    }
    
    // Knowledge base keywords
    if (availableAgents.includes('knowledge') && 
        (lowerQuery.includes('how to') || lowerQuery.includes('documentation') || 
         lowerQuery.includes('guide') || lowerQuery.includes('feature') || 
         lowerQuery.includes('workflow') || lowerQuery.includes('sheltr'))) {
      return 'knowledge';
    }
    
    // Research keywords
    if (lowerQuery.includes('research') || lowerQuery.includes('find') || 
        lowerQuery.includes('search') || lowerQuery.includes('homelessness') || 
        lowerQuery.includes('housing') || lowerQuery.includes('policy')) {
      return 'research';
    }
    
    // Default to support
    return 'support';
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Determine which agent to use
      const agentToUse = selectedAgent === 'auto' ? determineOptimalAgent(input) : selectedAgent;
      
      console.log(`🤖 [Enhanced MCP] Using ${agentToUse} agent for query`);

      const config: SheltrOpenAIMCPConfig = {
        userRole: user?.role as any || 'public',
        userId: user?.uid,
        userName: user?.displayName || user?.email?.split('@')[0] || 'User'
      };

      // Create assistant message for streaming
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        mcpAgent: agentToUse,
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantMessage]);
      streamingMessageRef.current = '';

      // Use streaming for better UX
      const streamingGenerator = sheltrOpenAIMCP.executeStreamingQuery(
        agentToUse,
        input.trim(),
        config
      );

      for await (const chunk of streamingGenerator) {
        streamingMessageRef.current += chunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: streamingMessageRef.current, isStreaming: true }
            : msg
        ));
      }

      // Mark streaming as complete
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('❌ [Enhanced MCP] Error sending message:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getRoleIcon = () => {
    if (!isAuthenticated) return <User className="h-4 w-4" />;
    
    switch (user?.role) {
      case 'super_admin': return <Crown className="h-4 w-4 text-purple-600" />;
      case 'platform_admin': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'admin': return <Users className="h-4 w-4 text-green-600" />;
      case 'donor': return <Heart className="h-4 w-4 text-red-600" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadge = () => {
    if (!isAuthenticated) return <Badge variant="outline">Public</Badge>;
    
    const roleLabels: Record<string, string> = {
      'super_admin': 'Super Admin',
      'platform_admin': 'Platform Admin',
      'admin': 'Shelter Admin',
      'participant': 'Participant',
      'donor': 'Donor'
    };

    return <Badge variant="outline">{roleLabels[user?.role || ''] || 'User'}</Badge>;
  };

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'knowledge': return <Brain className="h-4 w-4" />;
      case 'research': return <Search className="h-4 w-4" />;
      case 'support': return <MessageSquare className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full" style={{ maxHeight }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{title}</CardTitle>
            {mcpInitialized && <Badge variant="outline" className="bg-green-50 text-green-700">
              <Zap className="h-3 w-3 mr-1" />
              MCP Enhanced
            </Badge>}
          </div>
          <div className="flex items-center space-x-2">
            {getRoleIcon()}
            {getRoleBadge()}
          </div>
        </div>

        {mcpError && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>MCP Error: {mcpError}</span>
          </div>
        )}

        {showAgentSelector && availableAgents.length > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Agent:</span>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value as any)}
              className="px-2 py-1 border rounded text-sm"
              disabled={isLoading}
            >
              <option value="auto">Auto-Select</option>
              {availableAgents.map(agent => (
                <option key={agent} value={agent}>
                  {agent.charAt(0).toUpperCase() + agent.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {message.role === 'assistant' && message.mcpAgent && (
                    <div className="flex items-center space-x-1 mb-1 text-xs text-gray-500">
                      {getAgentIcon(message.mcpAgent)}
                      <span>{message.mcpAgent} agent</span>
                      {message.isStreaming && <Loader2 className="h-3 w-3 animate-spin" />}
                      {!message.isStreaming && !message.error && <CheckCircle className="h-3 w-3 text-green-500" />}
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {message.error && (
                    <div className="text-xs text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Error: {message.error}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder || (isAuthenticated 
                ? `Ask about analytics, platform features, research, or get support...`
                : 'Ask me about SHELTR-AI, homelessness solutions, or general questions...'
              )}
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
              disabled={isLoading || !mcpInitialized}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim() || !mcpInitialized}
              size="sm"
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {!mcpInitialized && !mcpError && (
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Initializing MCP agents...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
