'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  History, 
  Send, 
  Paperclip, 
  Globe, 
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Bot,
  User,
  Clock,
  Hash,
  Zap,
  Brain,
  Target,
  TrendingUp,
  FileText,
  Users,
  Shield,
  Star,
  BookOpen,
  Lightbulb,
  Sparkles,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Trash2,
  Edit,
  Copy,
  Download,
  Share2,
  Volume2,
  Mic,
  Video,
  Image,
  File,
  Link,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Grid3X3,
  List,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { chatbotDashboardService, ChatSession, ChatMessage, AgentConfig } from '@/services/chatbotDashboardService';
import { useAuth } from '@/contexts/AuthContext';
import { KBDocumentPickerModal } from '@/components/chatbot/KBDocumentPickerModal';

// Agent color mapping for badges (outline style)
const agentColors: Record<string, string> = {
  'general': 'border-blue-500 text-blue-600 dark:text-blue-400',
  'sheltr_support': 'border-green-500 text-green-600 dark:text-green-400',
  'technical_expert': 'border-purple-500 text-purple-600 dark:text-purple-400',
  'business_analyst': 'border-orange-500 text-orange-600 dark:text-orange-400',
  'creative_writer': 'border-pink-500 text-pink-600 dark:text-pink-400',
};

// Helper function to get agent color classes
const getAgentColorClass = (agentType: string): string => {
  return agentColors[agentType] || 'border-gray-500 text-gray-600 dark:text-gray-400';
};

export default function ChatbotDashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');
  const [isTyping, setIsTyping] = useState(false);
  const [showAgentConfig, setShowAgentConfig] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentConfig | null>(null);
  const [viewMode, setViewMode] = useState<'chat' | 'analytics'>('chat');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [sessionToRename, setSessionToRename] = useState<ChatSession | null>(null);
  const [newSessionTitle, setNewSessionTitle] = useState('');

  // KB Document state
  const [kbDocCount, setKbDocCount] = useState<{ documents: number; faqs: number } | null>(null);
  const [showKBPicker, setShowKBPicker] = useState(false);
  const [attachedDocs, setAttachedDocs] = useState<string[]>([]);

  // Toolbar state
  const [showToolbar, setShowToolbar] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'modern' | 'compact'>('modern');
  const [quickActions, setQuickActions] = useState([
    { id: 'new-chat', label: 'New Chat', icon: Plus, action: () => createNewSession() },
    { id: 'search', label: 'Search', icon: Search, action: () => {} },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, action: () => setViewMode('analytics') },
    { id: 'settings', label: 'Settings', icon: Settings, action: () => setShowAgentConfig(true) }
  ]);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load hardcoded agents (backend integration pending)
      const hardcodedAgents: AgentConfig[] = [
        {
          id: 'general',
          name: 'General Assistant',
          description: 'Versatile AI assistant for general queries and support',
          instructions: `You are a helpful and knowledgeable general assistant specializing in the SHELTR platform and homelessness support services. Your role is to:

• Provide clear, accurate information about SHELTR's features and services
• Assist users with platform navigation and basic troubleshooting
• Offer guidance on donation processes, shelter services, and participant support
• Maintain a compassionate, professional tone when discussing homelessness issues
• Direct users to appropriate resources and specialized support when needed
• Ensure all interactions prioritize dignity and respect for all individuals

When responding:
• Be empathetic and understanding, especially when discussing sensitive topics
• Provide actionable information and clear next steps
• Use accessible language that's easy to understand
• Acknowledge the complexity of homelessness while offering hope and practical solutions
• Always respect privacy and confidentiality

Remember that every interaction supports SHELTR's mission to create sustainable solutions for homelessness through technology, compassion, and community engagement.`,
          model: 'gpt-4o-mini',
          knowledge_bases: ['general', 'platform_help', 'shelter_info'],
          temperature: 0.7,
          max_tokens: 1000,
          status: 'active'
        },
        {
          id: 'sheltr_support',
          name: 'SHELTR Support',
          description: 'Specialized support for SHELTR platform features and processes',
          instructions: `You are a specialized SHELTR platform support agent with deep knowledge of our systems, features, and processes. Your expertise includes:

• Platform functionality and feature explanations
• Donation processing and SmartFund distribution (80-15-5 model)
• Shelter administrator tools and participant management
• QR code systems and mobile functionality
• Blockchain integration and token economics
• Reporting, analytics, and impact measurement
• Account management and security features
• Integration with partner services and APIs

When providing support:
• Offer step-by-step guidance for platform features
• Explain complex processes in simple, clear terms
• Provide relevant links to documentation and resources
• Troubleshoot technical issues methodically
• Escalate complex technical problems when appropriate
• Ensure users understand privacy and security measures
• Help optimize their use of SHELTR's features

Focus on enabling users to effectively leverage SHELTR's technology to maximize their impact in addressing homelessness.`,
          model: 'gpt-4o',
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
      ];
      
      setAgents(hardcodedAgents);
      
      // Set default agent if available
      if (hardcodedAgents.length > 0) {
        setSelectedAgent(hardcodedAgents[0].id);
      }

      // Load chat sessions from backend
      try {
        const response = await chatbotDashboardService.getChatSessions();
        if (response.success && response.data.sessions) {
          setSessions(response.data.sessions);
        } else {
          console.warn('No chat sessions found, starting with empty list');
          setSessions([]);
        }
      } catch (error) {
        console.error('Error loading chat sessions from backend:', error);
        // Fall back to empty sessions list if backend is unavailable
        setSessions([]);
      }

      // Load KB document count
      fetchKBDocumentCount();
      
    } catch (error) {
      console.error('Error loading chatbot data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKBDocumentCount = async () => {
    try {
      const userRole = user?.role || 'participant';
      const token = await user?.getIdToken();
      console.log('Fetching KB document count for role:', userRole);
      
      const response = await fetch(`/api/v1/knowledge-dashboard/accessible-count?user_role=${userRole}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('KB document count response:', data);
        if (data.success) {
          setKbDocCount(data.data);
          console.log('KB doc count set:', data.data);
        }
      } else {
        console.error('Failed to fetch KB count:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching KB document count:', error);
    }
  };

  const createNewSession = async () => {
    try {
      // Create session on backend first
      const response = await chatbotDashboardService.createChatSession(
        `New Chat ${sessions.length + 1}`,
        selectedAgent || 'general',
        selectedModel
      );

      if (response.success && response.data.session_id) {
        // Create local session object with backend ID
        const newSession: ChatSession = {
          id: response.data.session_id,
          title: `New Chat ${sessions.length + 1}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          agent_type: selectedAgent || 'general',
          message_count: 0,
          last_message: 'No messages yet',
          model: selectedModel,
          status: 'active'
        };
        
        setSessions(prev => [newSession, ...prev]);
        setCurrentSession(newSession);
        setMessages([]);
      } else {
        throw new Error('Failed to create session on backend');
      }
    } catch (error) {
      console.error('Error creating new session:', error);
      // Show user-friendly error message
      alert('Failed to create new chat session. Please try again.');
    }
  };

  const selectSession = async (session: ChatSession) => {
    try {
      setCurrentSession(session);
      
      // Load actual messages from backend
      try {
        const response = await chatbotDashboardService.getChatMessages(session.id);
        if (response.success && response.data.messages) {
          setMessages(response.data.messages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading messages from backend:', error);
        // Fall back to empty messages if backend is unavailable
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading session messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentSession) return;

    try {
      setIsTyping(true);
      
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: newMessage.trim(),
        role: 'user',
        timestamp: new Date().toISOString(),
        metadata: {
          model: selectedModel,
          tokens_used: 0,
          response_time: 0
        }
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Send message to backend
      try {
        const startTime = Date.now();
        
        // Use the session's agent type (not the dropdown selection)
        // This ensures consistency: once a session is created with an agent, it stays with that agent
        const sessionAgentType = currentSession.agent_type || selectedAgent || 'general';
        
        // Find the agent configuration for this session
        const baseAgentConfig = agents.find(agent => agent.id === sessionAgentType) || {
          id: 'general',
          name: 'General Assistant',
          description: 'A helpful general purpose assistant',
          instructions: 'You are a helpful AI assistant for SHELTR platform users.',
          model: 'gpt-4o-mini',
          knowledge_bases: [],
          temperature: 0.7,
          max_tokens: 1000,
          status: 'active' as const
        };
        
        // IMPORTANT: Override the model with the session's model
        // This ensures the correct model (including Claude) is used
        const selectedAgentConfig = {
          ...baseAgentConfig,
          model: currentSession.model || baseAgentConfig.model
        };
        
        // Use the chatbot dashboard service to send message and save to session
        const response = await chatbotDashboardService.sendMessage(
          currentSession.id,
          userMessage.content,
          selectedAgentConfig
        );
        
        if (response.success) {
          const responseTime = (Date.now() - startTime) / 1000;
          
          const aiMessage: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            content: response.data.message || "I received your message successfully!",
            role: 'assistant',
            timestamp: new Date().toISOString(),
            metadata: {
              model: selectedModel,
              tokens_used: response.data.metadata?.tokens_used || 150,
              response_time: response.data.metadata?.response_time || responseTime
            }
          };
          
          setMessages(prev => [...prev, aiMessage]);
          
          // Update the current session with new message count and last message
          const updatedSession = {
            ...currentSession,
            message_count: currentSession.message_count + 2, // user + assistant message
            last_message: aiMessage.content.slice(0, 50) + (aiMessage.content.length > 50 ? '...' : ''),
            updated_at: new Date().toISOString(),
            // Update title if backend generated one
            title: response.data.session_title || currentSession.title
          };
          
          // Log if title was auto-generated
          if (response.data.session_title) {
            console.log('[ChatbotDashboard] 🎉 Auto-generated title:', response.data.session_title);
          }
          
          setCurrentSession(updatedSession);
          
          // Update the session in the sessions list
          setSessions(prev => prev.map(session => 
            session.id === currentSession.id ? updatedSession : session
          ));
        } else {
          throw new Error('Failed to get response from chatbot service');
        }
        
      } catch (apiError) {
        console.error('API Error:', apiError);
        
        // Fallback response if backend fails
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          content: "I'm experiencing technical difficulties connecting to the AI backend. The message was received but I cannot provide an intelligent response right now. Please try again or contact support.",
          role: 'assistant',
          timestamp: new Date().toISOString(),
          metadata: {
            model: selectedModel,
            tokens_used: 0,
            response_time: 1.0
          }
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
      
      setIsTyping(false);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Rename session functions
  const handleRenameSession = (session: ChatSession) => {
    setSessionToRename(session);
    setNewSessionTitle(session.title);
    setRenameDialogOpen(true);
  };

  const handleSaveRename = async () => {
    if (!sessionToRename || !newSessionTitle.trim()) return;

    try {
      // Call the backend API to persist the title change first
      await chatbotDashboardService.updateSessionTitle(sessionToRename.id, newSessionTitle.trim());

      // Update the session title in the local state only after backend success
      setSessions(prev => prev.map(session => 
        session.id === sessionToRename.id 
          ? { ...session, title: newSessionTitle.trim(), updated_at: new Date().toISOString() }
          : session
      ));

      // Update current session if it's the one being renamed
      if (currentSession?.id === sessionToRename.id) {
        setCurrentSession({ ...currentSession, title: newSessionTitle.trim(), updated_at: new Date().toISOString() });
      }

      // Close the dialog
      setRenameDialogOpen(false);
      setSessionToRename(null);
      setNewSessionTitle('');
    } catch (error) {
      console.error('Error renaming session:', error);
      alert('Failed to rename chat session. Please try again.');
    }
  };

  const handleShareSession = async (session: ChatSession) => {
    try {
      const result = await chatbotDashboardService.generateShareLink(session.id);
      
      if (result.success) {
        const shareUrl = `${window.location.origin}${result.data.share_url}`;
        await navigator.clipboard.writeText(shareUrl);
        alert(`✅ Share link copied to clipboard!\n\n${shareUrl}\n\nAnyone with this link can view this conversation.`);
      }
    } catch (error) {
      console.error('Failed to generate share link:', error);
      alert('Failed to generate share link. Please try again.');
    }
  };

  const handleExportToKB = async (session: ChatSession) => {
    try {
      const confirmExport = confirm(`Export "${session.title}" to Knowledge Base?\n\nThis will create a new knowledge base document.`);
      if (!confirmExport) return;
      
      const result = await chatbotDashboardService.exportToKnowledgeBase(session.id, session.title, 'chat-exports');
      
      if (result.success) {
        alert(`✅ Successfully exported to Knowledge Base!\n\nDocument ID: ${result.data.document_id}\nWords: ${result.data.word_count}`);
      }
    } catch (error) {
      console.error('Failed to export to knowledge base:', error);
      alert('Failed to export to knowledge base. Please try again.');
    }
  };

  const handleDeleteSession = async (session: ChatSession) => {
    if (!confirm(`Are you sure you want to delete "${session.title}"?`)) return;

    try {
      // Call the backend API to delete the session first
      await chatbotDashboardService.deleteChatSession(session.id);

      // Remove from local state only after backend success
      setSessions(prev => prev.filter(s => s.id !== session.id));

      // If it's the current session, clear it
      if (currentSession?.id === session.id) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete chat session. Please try again.');
    }
  };

  // Filter sessions based on search and filter
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchQuery === '' || 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.last_message && session.last_message.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = sessionFilter === 'all' || 
      (sessionFilter === 'active' && session.message_count > 0) ||
      (sessionFilter === 'archived' && session.message_count === 0);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading chatbot control panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Header - Mobile Optimized */}
      <div className="border-b bg-card/50 backdrop-blur-sm flex-shrink-0">
        {/* Top Row - Title and Actions */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
          {/* Left side - Title and icon */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-semibold truncate">Chatbot Control</h1>
              {/* Stats - Hidden on mobile, shown on tablet+ */}
              <div className="hidden md:flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {sessions.length} sessions
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {agents.length} agents
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {agents.filter(a => a.status === 'active').length} active
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Right side - Actions (Compact on mobile) */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLayoutMode(layoutMode === 'modern' ? 'compact' : 'modern')}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              {layoutMode === 'modern' ? <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Grid3X3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAgentConfig(true)}
              className="h-8 sm:h-9 px-2 sm:px-3"
            >
              <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Agents</span>
            </Button>
            
            <Button onClick={createNewSession} className="h-8 sm:h-9 px-2 sm:px-4">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">New Chat</span>
              <span className="sm:hidden text-xs">New</span>
            </Button>
          </div>
        </div>

        {/* Mobile Stats Row - Only shown on mobile */}
        <div className="md:hidden px-3 pb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {sessions.length} sessions
            </Badge>
            <Badge variant="outline" className="text-xs">
              {agents.length} agents
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {agents.filter(a => a.status === 'active').length} active
            </Badge>
          </div>
        </div>

        {/* Search and filters */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 sm:h-10 text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sessionFilter} onValueChange={setSessionFilter}>
                <SelectTrigger className="w-full sm:w-32 h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="All Sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full sm:w-40 h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  {/* OpenAI Models */}
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  
                  {/* Anthropic Models */}
                  <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</SelectItem>
                  
                  {/* Google Gemini Models (Firebase AI Logic) */}
                  <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash ⚡</SelectItem>
                  <SelectItem value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite 🚀</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Sidebar - Sessions (Hidden on mobile when chat is active) */}
        <div className={`${currentSession ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 border-r bg-muted/30 flex-col flex-shrink-0 h-full overflow-hidden`}>
          {/* Sessions Header */}
          <div className="p-3 lg:p-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-base lg:text-lg">Chat Sessions</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={createNewSession}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Agent Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Active Agent</label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        {agent.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sessions List - Fixed scrolling */}
          <div className="flex-1 overflow-y-auto p-2 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">No chat sessions found</p>
                <Button onClick={createNewSession} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSessions.map((session) => (
                  <Card
                    key={session.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      currentSession?.id === session.id ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => selectSession(session)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm line-clamp-1">{session.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(session.updated_at)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {session.last_message || 'No messages yet'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${getAgentColorClass(session.agent_type || '')}`}>
                            {session.agent_type || 'Unknown'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {session.message_count} messages
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRenameSession(session);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareSession(session);
                                }}
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExportToKB(session);
                                }}
                              >
                                <BookOpen className="h-4 w-4 mr-2" />
                                Export to KB
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Chat Interface */}
        <div className={`${currentSession ? 'flex' : 'hidden lg:flex'} flex-1 flex-col min-h-0`}>
          {currentSession ? (
            <>
              {/* Chat Header */}
              <div className="border-b bg-card/50 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    {/* Mobile back button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentSession(null)}
                      className="lg:hidden h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div>
                      <h2 className="font-semibold text-base">{currentSession.title}</h2>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className={`text-xs ${getAgentColorClass(currentSession.agent_type)}`}>
                          {currentSession.agent_type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {selectedModel}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {messages.length} messages
                        </Badge>
                        
                        {/* KB Document Count Badges */}
                        {kbDocCount && (
                          <>
                            <Badge variant="outline" className="text-xs border-blue-400 text-blue-600 dark:text-blue-400">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {kbDocCount.documents} Docs
                            </Badge>
                            <Badge variant="outline" className="text-xs border-amber-400 text-amber-600 dark:text-amber-400">
                              <Lightbulb className="h-3 w-3 mr-1" />
                              {kbDocCount.faqs} FAQs
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Top action buttons removed - will be implemented in future phases */}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0 max-h-[calc(100vh-400px)]">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">Start a conversation</p>
                    <p className="text-xs text-muted-foreground">
                      Agent: {agents.find(a => a.id === currentSession.agent_type)?.name || 'Unknown'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                // Style headers
                                h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-base font-bold mt-2 mb-1" {...props} />,
                                h4: ({node, ...props}) => <h4 className="text-sm font-bold mt-2 mb-1" {...props} />,
                                // Style paragraphs
                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                // Style lists
                                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                                li: ({node, ...props}) => <li className="ml-2" {...props} />,
                                // Style code
                                code: ({node, inline, ...props}: any) => 
                                  inline ? (
                                    <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs" {...props} />
                                  ) : (
                                    <code className="block bg-black/10 dark:bg-white/10 p-2 rounded text-xs overflow-x-auto" {...props} />
                                  ),
                                // Style links
                                a: ({node, ...props}) => <a className="text-blue-500 hover:underline" {...props} />,
                                // Style blockquotes
                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                                // Style strong/bold
                                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                // Style emphasis/italic
                                em: ({node, ...props}) => <em className="italic" {...props} />,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                            <span>{formatTimestamp(message.timestamp)}</span>
                            {message.metadata && (
                              <>
                                <span>•</span>
                                <span>{message.metadata.model}</span>
                                {message.metadata?.tokens_used && message.metadata.tokens_used > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{message.metadata.tokens_used} tokens</span>
                                  </>
                                )}
                                {message.metadata?.response_time && message.metadata.response_time > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{message.metadata.response_time}s</span>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t bg-card/50 backdrop-blur-sm p-3 flex-shrink-0">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message... (Shift+Enter for new line)"
                      className="min-h-[50px] max-h-[100px] resize-none"
                      rows={1}
                    />
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isTyping}
                      className="h-9 px-3"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Model: {currentSession.model || selectedModel}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Agent: {agents.find(a => a.id === currentSession.agent_type)?.name || 'None'}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs hidden sm:flex"
                      title="Upload image to gallery (Vision AI coming soon)"
                      disabled={true}
                    >
                      <Image className="h-3 w-3 mr-1" />
                      Gallery
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs hidden sm:flex"
                      title="Connect Knowledge Base Documents"
                      onClick={() => setShowKBPicker(true)}
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Knowledge
                      {attachedDocs.length > 0 && (
                        <Badge className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                          {attachedDocs.length}
                        </Badge>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs hidden sm:flex"
                      title="Search the web for real-time information"
                      disabled={true}
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      Web Search
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Welcome to Chatbot Control</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a session or create a new chat to get started
                </p>
                <Button onClick={createNewSession}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent Configuration Dialog */}
      <Dialog open={showAgentConfig} onOpenChange={setShowAgentConfig}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agent Configuration</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="agents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="agents" className="space-y-4">
              <div className="grid gap-4">
                {agents.map((agent) => (
                  <Card key={agent.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Bot className="h-6 w-6 text-primary mt-1" />
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{agent.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                            {agent.status}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingAgent(agent)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{agent.instructions}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Model: {agent.model}</span>
                        <span>Temperature: {agent.temperature}</span>
                        <span>Max Tokens: {agent.max_tokens}</span>
                        <span>Knowledge Bases: {agent.knowledge_bases?.length || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="models" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {[
                      { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable OpenAI model', status: 'Available' },
                      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient', status: 'Available' },
                      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Advanced reasoning, 200K context', status: 'Available' },
                      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Fast responses, 200K context', status: 'Available' }
                    ].map((model) => (
                      <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{model.name}</h4>
                          <p className="text-sm text-muted-foreground">{model.description}</p>
                        </div>
                        <Badge variant="outline">{model.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chat Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Default Model</label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                          <SelectItem value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Default Agent</label>
                      <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Rename Session Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Session Name</label>
              <Input
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                placeholder="Enter new session name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveRename();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setRenameDialogOpen(false);
                  setSessionToRename(null);
                  setNewSessionTitle('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRename}
                disabled={!newSessionTitle.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* KB Document Picker Modal */}
      <KBDocumentPickerModal
        isOpen={showKBPicker}
        onClose={() => setShowKBPicker(false)}
        onSelect={(docIds) => {
          setAttachedDocs(docIds);
          console.log('Attached documents:', docIds);
        }}
        selectedDocuments={attachedDocs}
      />
    </div>
  );
}