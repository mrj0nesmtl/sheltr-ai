'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minimize2, Maximize2, Send, User, Shield, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  mcpToolUsed?: string;
  roleRestricted?: boolean;
}

interface RoleAwareChatbotProps {
  embedded?: boolean;
  className?: string;
}

export const RoleAwareChatbot: React.FC<RoleAwareChatbotProps> = ({ 
  embedded = false, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(embedded);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user, hasRole } = useAuth();

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

  // Get role-specific welcome message
  const getWelcomeMessage = () => {
    if (!isAuthenticated) {
      return "👋 Hello! I'm the SHELTR AI Assistant. I can help you learn about our platform and answer general questions. For advanced features like analytics and system management, please sign in.";
    }

    const roleMessages = {
      super_admin: "👑 Welcome back, Super Admin! I have full access to all MCP tools including analytics, system management, shelter operations, and emergency protocols. Try asking me about platform status, donation analytics, or shelter capacity!",
      platform_admin: "🛡️ Hello, Platform Admin! I can help with analytics, user management, shelter operations, and knowledge base queries. Ask me about platform metrics, user reports, or shelter management.",
      admin: "🏢 Welcome, Shelter Admin! I can assist with participant management, capacity updates, and shelter-specific operations. Try asking about your shelter's status or participant reports.",
      participant: "🙋‍♂️ Hi there! I can help you with services, update your status, generate QR codes, and access support resources. How can I assist you today?",
      donor: "💝 Welcome, valued donor! I can show you donation impact, generate receipts, and provide transparency reports. Ask me about your donation history or impact metrics!",
      authenticated: "👤 Hello! You're signed in, so I have access to additional features. I can help with platform information and basic account queries."
    };

    return roleMessages[userRole as keyof typeof roleMessages] || roleMessages.authenticated;
  };

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

  // Initialize with role-specific welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        text: getWelcomeMessage(),
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [userRole, isAuthenticated]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Generate session ID
  const getSessionId = () => {
    if (user?.uid) return user.uid;
    let sessionId = localStorage.getItem('sheltr-session-id');
    if (!sessionId) {
      sessionId = `public_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sheltr-session-id', sessionId);
    }
    return sessionId;
  };

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
      const apiUrl = isAuthenticated 
        ? '/api/chatbot/authenticated' 
        : '/api/chatbot/public';
      
      const requestBody = {
        message: userMessage.text,
        sessionId: getSessionId(),
        userRole: userRole,
        context: {
          page: '/docs/chatbot-user-guide',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          embedded: true,
          authenticated: isAuthenticated,
          userId: user?.uid,
          email: user?.email
        }
      };
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || "I'm having trouble processing that request right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
        mcpToolUsed: data.mcp_tool_used,
        roleRestricted: data.role_restricted
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Provide different fallback messages based on role
      const fallbackMessage = isAuthenticated 
        ? "I'm currently having trouble accessing the advanced features. Please try again later or contact support."
        : "I'm having trouble connecting right now. For full functionality including MCP tools and analytics, please sign in to your account.";
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackMessage,
        isUser: false,
        timestamp: new Date(),
        roleRestricted: !isAuthenticated
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

  // Embedded version (always visible)
  if (embedded) {
    return (
      <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getRoleIcon()}
              <h3 className="font-semibold">SHELTR AI Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              {getRoleBadge()}
              {isAuthenticated && (
                <Badge className="bg-green-500 text-white text-xs">MCP Enabled</Badge>
              )}
            </div>
          </div>
          <p className="text-sm mt-2 opacity-90">
            {isAuthenticated 
              ? `Try: "Show me donation analytics" or "What's the platform status?"`
              : "Sign in to unlock MCP tools and advanced queries"}
          </p>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-500 text-white'
                    : message.roleRestricted
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isAuthenticated ? "Try: 'Show me platform analytics'" : "Ask me about SHELTR..."}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {!isAuthenticated && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              🔒 <a href="/login" className="text-blue-500 hover:underline">Sign in</a> to unlock MCP tools and advanced queries
            </div>
          )}
        </div>
      </div>
    );
  }

  // Floating widget version (for other pages)
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full p-3 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getRoleIcon()}
              <span className="font-semibold text-sm">SHELTR AI</span>
              {getRoleBadge()}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                onClick={() => setIsMinimized(!isMinimized)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1 h-6 w-6"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1 h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Rest of floating widget implementation */}
          {/* ... (similar to embedded version but in floating container) */}
        </div>
      )}
    </div>
  );
};
