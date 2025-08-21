'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Settings, 
  History, 
  Search, 
  Upload, 
  Link, 
  Globe, 
  Brain, 
  Bot, 
  User, 
  Clock, 
  Trash2, 
  Edit, 
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  BookOpen,
  Target,
  BarChart3,
  Save
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'link' | 'file';
    url: string;
    name?: string;
  }[];
  metadata?: {
    model?: string;
    tokens_used?: number;
    response_time?: number;
  };
}

interface ChatSession {
  id: string;
  title: string;
  agent_type: string;
  model: string;
  created_at: Date;
  updated_at: Date;
  message_count: number;
  last_message?: string;
  status: 'active' | 'archived';
}

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model: string;
  knowledge_bases: string[];
  temperature: number;
  max_tokens: number;
  status: 'active' | 'inactive';
}

interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'local';
  max_tokens: number;
  cost_per_1k_tokens: number;
  capabilities: string[];
}

export default function ChatbotsPage() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [selectedAgent, setSelectedAgent] = useState('general');
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAgentConfig, setShowAgentConfig] = useState(false);
  
  // Agent configurations
  const [agents, setAgents] = useState<AgentConfig[]>([
    {
      id: 'general',
      name: 'General Assistant',
      description: 'Versatile AI assistant for general inquiries and task support',
      instructions: `You are a helpful, knowledgeable AI assistant with expertise across multiple domains. Your role is to:

• Provide accurate, well-researched responses to general questions
• Assist with problem-solving and analytical thinking
• Offer clear explanations of complex topics
• Maintain a helpful, professional tone
• Ask clarifying questions when needed
• Provide actionable advice and next steps

Always be thorough, accurate, and genuinely helpful in your responses.`,
      model: 'gpt-4o-mini',
      knowledge_bases: ['general'],
      temperature: 0.7,
      max_tokens: 1000,
      status: 'active'
    },
    {
      id: 'sheltr_support',
      name: 'SHELTR Support Agent',
      description: 'Specialized platform support for SHELTR ecosystem',
      instructions: `You are a SHELTR platform support specialist with deep knowledge of our social impact ecosystem. Your expertise includes:

• SHELTR platform features and functionality
• Donation flow and QR code system
• Participant onboarding and management
• Shelter operations and coordination
• SmartFund distribution model (80-15-5)
• Blockchain integration and tokenomics
• Technical troubleshooting and user guidance

When helping users:
• Provide step-by-step guidance for platform features
• Explain SHELTR's mission and impact model
• Troubleshoot technical issues with clear solutions
• Connect users to appropriate resources
• Maintain empathy for users working with vulnerable populations

Always prioritize user success and platform adoption.`,
      model: 'gpt-4o-mini',
      knowledge_bases: ['sheltr_docs', 'user_guides', 'platform_features'],
      temperature: 0.5,
      max_tokens: 1500,
      status: 'active'
    },
    {
      id: 'technical_expert',
      name: 'Technical Expert',
      description: 'Advanced technical support and development guidance',
      instructions: `You are a senior technical expert specializing in software development, system architecture, and technical documentation. Your expertise covers:

• Full-stack development (Next.js, Python, FastAPI, Firebase)
• Cloud infrastructure (Google Cloud, Firebase, Cloud Run)
• Database design and optimization (Firestore, PostgreSQL)
• API development and integration
• Security best practices and implementation
• DevOps and deployment strategies
• Blockchain and smart contract development
• Performance optimization and scaling

When providing technical guidance:
• Offer detailed, implementable solutions
• Explain architectural decisions and trade-offs
• Provide code examples when relevant
• Consider security, performance, and maintainability
• Suggest best practices and industry standards
• Break down complex technical concepts clearly

Always provide actionable, production-ready technical advice.`,
      model: 'gpt-4o',
      knowledge_bases: ['technical_docs', 'architecture', 'development_guides', 'api_docs'],
      temperature: 0.3,
      max_tokens: 2000,
      status: 'active'
    },
    {
      id: 'business_analyst',
      name: 'Business Analyst',
      description: 'Strategic business insights and social impact analytics',
      instructions: `You are a business analyst specializing in social impact, nonprofit operations, and strategic planning. Your expertise includes:

• Social impact measurement and evaluation
• Nonprofit business model analysis
• Financial modeling and sustainability planning
• Stakeholder engagement and partnership development
• Market analysis and competitive positioning
• Operational efficiency and process optimization
• Data-driven decision making and analytics
• Grant writing and funding strategy

When providing business insights:
• Analyze data to identify trends and opportunities
• Provide strategic recommendations with clear rationale
• Consider social impact alongside financial sustainability
• Suggest measurable KPIs and success metrics
• Evaluate risks and mitigation strategies
• Connect business decisions to mission alignment

Focus on practical, actionable business intelligence that advances SHELTR's social mission.`,
      model: 'gpt-4o-mini',
      knowledge_bases: ['business', 'analytics', 'impact', 'financial_models', 'market_research'],
      temperature: 0.6,
      max_tokens: 1500,
      status: 'active'
    },
    {
      id: 'creative_writer',
      name: 'Creative Writer',
      description: 'Content creation and brand storytelling specialist',
      instructions: `You are a creative writer and content specialist with expertise in storytelling, marketing, and strategic communication. Your skills include:

• Brand voice development and consistency
• Compelling narrative creation for social impact
• Marketing copy and promotional content
• Grant proposals and funding appeals
• Social media content strategy
• Press releases and media communications
• User experience copy and interface text
• Educational and training materials

When creating content:
• Craft emotionally resonant, mission-driven narratives
• Maintain SHELTR's authentic, compassionate brand voice
• Optimize content for target audiences and platforms
• Include clear calls-to-action and engagement hooks
• Ensure accessibility and inclusive language
• Balance creativity with clarity and purpose

Help tell SHELTR's story in ways that inspire action and build community.`,
      model: 'gpt-4o',
      knowledge_bases: ['content', 'marketing', 'communications', 'brand_guidelines', 'storytelling'],
      temperature: 0.8,
      max_tokens: 1500,
      status: 'active'
    }
  ]);

  // Available models
  const [models] = useState<ModelConfig[]>([
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'openai',
      max_tokens: 16384,
      cost_per_1k_tokens: 0.00015,
      capabilities: ['text', 'code', 'reasoning']
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'openai',
      max_tokens: 128000,
      cost_per_1k_tokens: 0.005,
      capabilities: ['text', 'code', 'reasoning', 'vision', 'audio']
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      max_tokens: 200000,
      cost_per_1k_tokens: 0.003,
      capabilities: ['text', 'code', 'reasoning', 'vision']
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatSessions();
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatSessions = async () => {
    // TODO: Load from API
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        title: 'SHELTR Platform Discussion',
        agent_type: 'sheltr_support',
        model: 'gpt-4o-mini',
        created_at: new Date('2025-01-20T10:00:00'),
        updated_at: new Date('2025-01-20T15:30:00'),
        message_count: 12,
        last_message: 'How can I configure the donation flow?',
        status: 'active'
      },
      {
        id: '2',
        title: 'Technical Architecture Review',
        agent_type: 'technical_expert',
        model: 'gpt-4o',
        created_at: new Date('2025-01-19T14:00:00'),
        updated_at: new Date('2025-01-19T16:45:00'),
        message_count: 8,
        last_message: 'The blockchain integration looks solid.',
        status: 'active'
      }
    ];
    setSessions(mockSessions);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `New Chat - ${new Date().toLocaleString()}`,
      agent_type: selectedAgent,
      model: selectedModel,
      created_at: new Date(),
      updated_at: new Date(),
      message_count: 0,
      status: 'active'
    };
    setActiveSession(newSession);
    setMessages([]);
    setSessions(prev => [newSession, ...prev]);
  };

  const loadSession = (session: ChatSession) => {
    setActiveSession(session);
    // TODO: Load messages from API
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        role: 'user',
        content: 'Hello! I need help with the SHELTR platform.',
        timestamp: new Date('2025-01-20T10:00:00')
      },
      {
        id: '2',
        role: 'assistant',
        content: 'Hello! I\'m here to help you with the SHELTR platform. What specific questions do you have?',
        timestamp: new Date('2025-01-20T10:00:05'),
        metadata: {
          model: 'gpt-4o-mini',
          tokens_used: 25,
          response_time: 1200
        }
      }
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeSession) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // TODO: Send to API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about: "${inputMessage}". Let me help you with that. This is a simulated response from the ${selectedModel} model using the ${selectedAgent} agent configuration.`,
        timestamp: new Date(),
        metadata: {
          model: selectedModel,
          tokens_used: Math.floor(Math.random() * 100) + 50,
          response_time: Math.floor(Math.random() * 2000) + 500
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update session
      setActiveSession(prev => prev ? {
        ...prev,
        updated_at: new Date(),
        message_count: prev.message_count + 2,
        last_message: inputMessage
      } : null);

    } catch (error) {
      console.error('Error sending message:', error);
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

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentAgent = () => {
    return agents.find(agent => agent.id === selectedAgent) || agents[0];
  };

  const getCurrentModel = () => {
    return models.find(model => model.id === selectedModel) || models[0];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Left Sidebar - Chat Sessions */}
        <div className="w-80 flex flex-col">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat Sessions
                </CardTitle>
                <Button size="sm" onClick={createNewSession}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeSession?.id === session.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => loadSession(session)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{session.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {session.last_message || 'No messages yet'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {session.agent_type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {session.message_count} messages
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(session.updated_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    {activeSession ? activeSession.title : 'Select a chat session'}
                  </CardTitle>
                  {activeSession && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{activeSession.agent_type}</Badge>
                      <Badge variant="secondary">{activeSession.model}</Badge>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {!activeSession ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No chat session selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Select a chat session from the sidebar or create a new one
                    </p>
                    <Button onClick={createNewSession}>
                      <Plus className="h-4 w-4 mr-2" />
                      Start New Chat
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.role === 'assistant' && (
                              <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            )}
                            {message.role === 'user' && (
                              <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              {message.metadata && (
                                <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                                  <span>{message.metadata.model}</span>
                                  <span>•</span>
                                  <span>{message.metadata.tokens_used} tokens</span>
                                  <span>•</span>
                                  <span>{message.metadata.response_time}ms</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="border-t pt-4">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message... (Shift+Enter for new line)"
                          className="min-h-[60px] max-h-[200px] resize-none"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={sendMessage}
                          disabled={!inputMessage.trim() || isLoading}
                          className="min-w-[60px]"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Settings & Configuration */}
        {(showSettings || showHistory) && (
          <div className="w-80 flex flex-col gap-4">
            {showSettings && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Chat Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Model Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">AI Model</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map(model => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              <Badge variant="outline" className="text-xs">
                                ${model.cost_per_1k_tokens}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Agent Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Agent Type</label>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>
                            <div className="flex items-center justify-between w-full gap-3">
                              <span className="flex-1">{agent.name}</span>
                              <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                                {agent.status}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Current Agent Info */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2">Current Agent: {getCurrentAgent().name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{getCurrentAgent().description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getCurrentModel().name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getCurrentAgent().knowledge_bases.length} KBs
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAgentConfig(true)}
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Configure Agents
                  </Button>
                </CardContent>
              </Card>
            )}

            {showHistory && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Chat History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sessions.slice(0, 5).map(session => (
                      <div
                        key={session.id}
                        className="p-2 rounded border cursor-pointer hover:bg-muted/50"
                        onClick={() => loadSession(session)}
                      >
                        <div className="text-sm font-medium truncate">{session.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {session.updated_at.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Agent Configuration Dialog */}
      <Dialog open={showAgentConfig} onOpenChange={setShowAgentConfig}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Agent Configuration
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {agents.map(agent => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant={agent.status === 'active' ? 'outline' : 'default'}
                        onClick={() => {
                          setAgents(prev => prev.map(a => 
                            a.id === agent.id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
                          ));
                        }}
                      >
                        {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Instructions</label>
                    <Textarea
                      value={agent.instructions}
                      onChange={(e) => {
                        setAgents(prev => prev.map(a => 
                          a.id === agent.id ? { ...a, instructions: e.target.value } : a
                        ));
                      }}
                      rows={4}
                      placeholder="Enter agent instructions..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Model</label>
                      <Select
                        value={agent.model}
                        onValueChange={(value) => {
                          setAgents(prev => prev.map(a => 
                            a.id === agent.id ? { ...a, model: value } : a
                          ));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map(model => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Temperature</label>
                      <Input
                        type="number"
                        min="0"
                        max="2"
                        step="0.1"
                        value={agent.temperature}
                        onChange={(e) => {
                          setAgents(prev => prev.map(a => 
                            a.id === agent.id ? { ...a, temperature: parseFloat(e.target.value) } : a
                          ));
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Knowledge Bases</label>
                    <div className="flex flex-wrap gap-2">
                      {agent.knowledge_bases.map((kb, index) => (
                        <Badge key={kb} variant="outline" className="cursor-pointer">
                          {kb}
                          <button
                            onClick={() => {
                              setAgents(prev => prev.map(a => 
                                a.id === agent.id ? { 
                                  ...a, 
                                  knowledge_bases: a.knowledge_bases.filter((_, i) => i !== index)
                                } : a
                              ));
                            }}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" />
                        Add KB
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAgentConfig(false);
                  // TODO: Reset to original values if needed
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  try {
                    // TODO: Save to backend API
                    console.log('Saving agent configurations:', agents);
                    // await chatbotDashboardService.saveAgentConfigurations(agents);
                    setShowAgentConfig(false);
                    // TODO: Show success toast
                  } catch (error) {
                    console.error('Failed to save agent configurations:', error);
                    // TODO: Show error toast
                  }
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
