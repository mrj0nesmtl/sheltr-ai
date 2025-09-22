"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Shield, Crown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  mcpToolUsed?: string;
  roleRestricted?: boolean;
  actions?: Array<{
    type: string;
    label?: string;
    text?: string;
    url?: string;
    data?: Record<string, unknown>;
  }>;
}

interface PublicChatbotProps {
  className?: string;
}

export const PublicChatbot: React.FC<PublicChatbotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Smart positioning detection and role awareness
  const { user, hasRole } = useAuth();
  const pathname = usePathname();

  // Determine user role and permissions
  const getUserRole = () => {
    if (!user) return 'public';
    if (hasRole('super_admin')) return 'super_admin';
    if (hasRole('platform_admin')) return 'platform_admin';
    if (hasRole('admin')) return 'admin';
    if (hasRole('participant')) return 'participant';
    if (hasRole('donor')) return 'donor';
    return 'authenticated';
  };

  const userRole = getUserRole();
  const isAuthenticated = !!user;

  // Get user's first name for personalization
  const getUserFirstName = () => {
    if (!user) return null;
    if (user.displayName) {
      return user.displayName.split(' ')[0];
    }
    if (user.email) {
      // Extract name from email (e.g., doug.smith@example.com -> Doug)
      const emailName = user.email.split('@')[0];
      const name = emailName.replace(/[._-]/g, ' ').split(' ')[0];
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }
    return null;
  };

  const firstName = getUserFirstName();

  // Get role icon
  const getRoleIcon = () => {
    const icons = {
      super_admin: <Crown className="h-4 w-4 text-yellow-500" />,
      platform_admin: <Shield className="h-4 w-4 text-purple-500" />,
      admin: <Shield className="h-4 w-4 text-blue-500" />,
      participant: <User className="h-4 w-4 text-green-500" />,
      donor: <User className="h-4 w-4 text-orange-500" />,
      authenticated: <User className="h-4 w-4 text-gray-500" />,
      public: <MessageCircle className="h-4 w-4 text-gray-400" />
    };
    return icons[userRole as keyof typeof icons] || icons.public;
  };

  // Get role badge
  const getRoleBadge = () => {
    const badges = {
      super_admin: <Badge className="bg-yellow-500 text-white text-xs">Super Admin</Badge>,
      platform_admin: <Badge className="bg-purple-500 text-white text-xs">Platform Admin</Badge>,
      admin: <Badge className="bg-blue-500 text-white text-xs">Shelter Admin</Badge>,
      participant: <Badge className="bg-green-500 text-white text-xs">Participant</Badge>,
      donor: <Badge className="bg-orange-500 text-white text-xs">Donor</Badge>,
      authenticated: <Badge className="bg-gray-500 text-white text-xs">User</Badge>,
      public: <Badge className="bg-gray-400 text-white text-xs">Public</Badge>
    };
    return badges[userRole as keyof typeof badges] || badges.public;
  };

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get personalized welcome message
  const getWelcomeMessage = useCallback(() => {
    if (!isAuthenticated) {
      return "👋 Hello! I'm the SHELTR AI Assistant. I can help you learn about our platform, find resources, or answer questions about blockchain-powered charitable giving. For advanced features like analytics and system management, please sign in. How can I help you today?";
    }

    const greeting = firstName ? `👋 Hello ${firstName}!` : "👋 Hello!";
    
    const roleMessages = {
      super_admin: `${greeting} Great to see you! I have full access to all MCP tools including analytics, system management, shelter operations, and emergency protocols. Try asking me about platform status, donation analytics, or shelter capacity!`,
      platform_admin: `${greeting} Nice to see you! I can help with analytics, user management, shelter operations, and knowledge base queries. Ask me about platform metrics, user reports, or shelter management.`,
      admin: `${greeting} Welcome back! I can assist with participant management, capacity updates, and shelter-specific operations. Try asking about your shelter's status or participant reports.`,
      participant: `${greeting} I'm here to help! I can assist you with services, update your status, generate QR codes, and access support resources. How can I help you today?`,
      donor: `${greeting} Welcome back! I can show you donation impact, generate receipts, and provide transparency reports. Ask me about your donation history or impact metrics!`,
      authenticated: `${greeting} You're signed in, so I have access to additional features. I can help with platform information and basic account queries.`
    };

    return roleMessages[userRole as keyof typeof roleMessages] || roleMessages.authenticated;
  }, [isAuthenticated, firstName, userRole]);

  // Initialize with personalized welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        text: getWelcomeMessage(),
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [getWelcomeMessage, messages.length]);

  // Persist chat state across pages
  useEffect(() => {
    const savedMessages = localStorage.getItem('sheltr-public-chat');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: Record<string, unknown>) => ({
          ...msg,
          timestamp: new Date(msg.timestamp as string)
        })));
      } catch (error) {
        console.warn('Failed to load chat history:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) { // Don't save just the welcome message
      localStorage.setItem('sheltr-public-chat', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Use different endpoints based on authentication
      const isDevelopment = process.env.NODE_ENV === 'development';
      const apiUrl = isDevelopment 
        ? (isAuthenticated ? '/api/chatbot/authenticated' : '/api/chatbot/public')
        : (isAuthenticated 
            ? 'https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/authenticated'
            : 'https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/public');
      
      // Prepare the request body based on authentication and endpoint
      const requestBody = isDevelopment ? {
        message: userMessage.text,
        sessionId: getSessionId(),
        userRole: userRole,
        context: {
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          authenticated: isAuthenticated,
          userId: user?.uid,
          email: user?.email,
          firstName: firstName
        }
      } : {
        message: userMessage.text,
        user_id: getSessionId(),
        user_role: userRole,
        conversation_context: {
          page: window.location.pathname,
          user_agent: navigator.userAgent,
          session_type: isAuthenticated ? 'authenticated' : 'public',
          anonymous: !isAuthenticated,
          timestamp: new Date().toISOString(),
          user_id: user?.uid,
          email: user?.email,
          first_name: firstName
        }
      };
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle different response formats from Next.js API route vs backend API
        const responseText = data.response || data.message || "I'm here to help! Could you please rephrase your question?";
        const actions = data.actions || [];
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isUser: false,
          timestamp: new Date(),
          actions: actions,
          mcpToolUsed: data.mcp_tool_used,
          roleRestricted: data.role_restricted || false
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. You can always contact us directly or explore our help sections!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionId = (): string => {
    let sessionId = localStorage.getItem('sheltr-chat-session');
    if (!sessionId) {
      // Generate cryptographically secure random string
      const randomBytes = new Uint32Array(1);
      crypto.getRandomValues(randomBytes);
      const randomString = randomBytes[0].toString(36);
      sessionId = `guest_${Date.now()}_${randomString}`;
      localStorage.setItem('sheltr-chat-session', sessionId);
    }
    return sessionId;
  };

  const clearChat = () => {
    localStorage.removeItem('sheltr-public-chat');
    setMessages([{
      id: 'welcome',
      text: "👋 Hello! I'm the SHELTR AI Assistant. I can help you learn about our platform, find resources, or answer questions about blockchain-powered charitable giving. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }]);
  };

  // Smart positioning: detect if mobile nav is present
  const isDashboard = pathname.startsWith('/dashboard');
  const hasMobileNav = isAuthenticated && isDashboard;
  
  // Debug logging for positioning
  useEffect(() => {
    console.log('PublicChatbot positioning:', {
      isMobile,
      isAuthenticated,
      isDashboard,
      hasMobileNav,
      pathname,
      user: user ? { role: user.role, email: user.email } : null
    });
  }, [isMobile, isAuthenticated, isDashboard, hasMobileNav, pathname, user]);
  
  // Mobile-specific styles with smart positioning
  const mobileStyles = isMobile ? (
    hasMobileNav ? {
      bottom: '80px', // Leave space for mobile bottom navigation (dashboard pages)
      maxHeight: 'calc(100vh - 120px)', // Account for header and mobile nav
    } : {
      bottom: '20px', // Normal mobile spacing (public pages)
      maxHeight: 'calc(100vh - 60px)', // Account for header only
    }
  ) : {};

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${
          isMobile 
            ? hasMobileNav 
              ? 'bottom-20 right-4' // Dashboard pages with mobile nav
              : 'bottom-6 right-4'   // Public pages without mobile nav
            : 'bottom-6 right-6'     // Desktop
        } bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-40 group ${className}`}
        aria-label="Open SHELTR AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-2 -left-2 bg-green-500 rounded-full w-3 h-3 animate-pulse"></div>
        <div className="absolute -top-12 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          SHELTR AI Assistant
        </div>
      </button>
    );
  }

  return (
    <div 
      className={`fixed ${
        isMobile 
          ? 'inset-x-4' 
          : isExpanded 
            ? 'inset-0 m-auto w-[600px] h-[700px]' 
            : 'bottom-6 right-6 w-96'
      } bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 flex flex-col ${className}`}
      style={mobileStyles}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            {getRoleIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-sm">SHELTR AI Assistant</h3>
            <div className="flex items-center space-x-2">
              {getRoleBadge()}
              {isAuthenticated && (
                <Badge className="bg-green-500 text-white text-xs">MCP</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              title={isExpanded ? "Minimize to corner" : "Expand to center"}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isExpanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6-6m0 0l-6 6m6-6v6m0-6H9" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isExpanded ? 'max-h-[550px]' : 'max-h-96'}`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="mb-2">{message.text}</div>
                  {message.mcpToolUsed && (
                    <div className="mt-2">
                      <Badge className="bg-green-500 text-white text-xs">
                        MCP: {message.mcpToolUsed}
                      </Badge>
                    </div>
                  )}
                  {message.roleRestricted && (
                    <div className="mt-2">
                      <Badge className="bg-red-500 text-white text-xs">
                        🔒 Sign in required
                      </Badge>
                    </div>
                  )}
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.actions.map((action, index) => {
                        // Safety check for action properties - API returns 'label' not 'text'
                        const url = (action.url || action.data?.url || '#') as string;
                        const text = (action.label || action.text || 'Link') as string;
                        const isExternal = typeof url === 'string' && url.startsWith('http');
                        
                        return (
                          <a
                            key={index}
                            href={url}
                            target={isExternal ? '_blank' : '_self'}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            {text}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={isAuthenticated 
                  ? (userRole === 'super_admin' || userRole === 'platform_admin' 
                      ? "Try: 'Show me platform analytics'" 
                      : "Ask me anything about SHELTR...")
                  : "Ask about SHELTR, donations, or getting help..."}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                ⚡ For emergencies, type &quot;emergency&quot; or call 911
              </p>
              <button
                onClick={clearChat}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear chat
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
