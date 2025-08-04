"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Zap, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { chatbotService } from '@/services/chatbotService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  actions?: Array<{
    type: string;
    label: string;
    data: Record<string, any>;
  }>;
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPopout, setIsPopout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const popoutWindowRef = useRef<Window | null>(null);
  
  const { user } = useAuth();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Expose open function globally for mobile nav
  useEffect(() => {
    (window as unknown as { openChatbot?: () => void }).openChatbot = () => setIsOpen(true);
    return () => {
      delete (window as unknown as { openChatbot?: () => void }).openChatbot;
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation when widget opens
  useEffect(() => {
    if (isOpen && messages.length === 0 && user) {
      const welcomeMessage = chatbotService.getConversationStarter(user.role || 'participant');
      const quickActions = chatbotService.getQuickActions(user.role || 'participant');
      
      setMessages([{
        id: 'welcome',
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
        actions: quickActions.slice(0, 3).map(action => ({
          type: 'quick_action',
          label: action.label,
          data: { message: action.message }
        }))
      }]);
    }
  }, [isOpen, user]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatbotService.sendMessage({
        message: messageText.trim(),
        conversation_id: conversationId || undefined,
        context: {
          user_role: user.role,
          timestamp: new Date().toISOString()
        }
      });

      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
        actions: response.actions
      };

      setMessages(prev => [...prev, botMessage]);

      // Handle escalation
      if (response.escalation_triggered) {
        const escalationMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          text: "🚨 Your request has been flagged for immediate attention. A support team member has been notified and will contact you shortly.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, escalationMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm experiencing technical difficulties. Please try again or contact support directly.",
        sender: 'bot',
        timestamp: new Date(),
        actions: [{
          type: 'contact_support',
          label: 'Contact Support',
          data: { action: 'support' }
        }]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: { type: string; label: string; data: Record<string, any> }) => {
    if (action.type === 'quick_action' && action.data.message) {
      sendMessage(action.data.message);
    } else {
      chatbotService.executeAction(action);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const openPopout = () => {
    if (popoutWindowRef.current && !popoutWindowRef.current.closed) {
      popoutWindowRef.current.focus();
      return;
    }

    const popoutWindow = window.open(
      'about:blank',
      'sheltr-ai-assistant',
      'width=400,height=600,resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,location=no'
    );

    if (popoutWindow) {
      popoutWindowRef.current = popoutWindow;
      
      // Create the HTML content for the popup
      const popoutContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>SHELTR AI Assistant</title>
          <meta charset="utf-8">
          <style>
            body { 
              margin: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #f8fafc;
              height: 100vh;
              display: flex;
              flex-direction: column;
            }
            .header {
              background: #2563eb;
              color: white;
              padding: 16px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .content {
              flex: 1;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .message {
              max-width: 80%;
              padding: 12px;
              border-radius: 12px;
              font-size: 14px;
            }
            .user-message {
              background: #2563eb;
              color: white;
              margin-left: auto;
              border-bottom-right-radius: 4px;
            }
            .bot-message {
              background: white;
              color: #1f2937;
              border: 1px solid #e5e7eb;
              border-bottom-left-radius: 4px;
            }
            .input-area {
              padding: 16px;
              border-top: 1px solid #e5e7eb;
              background: white;
            }
            .input-row {
              display: flex;
              gap: 8px;
            }
            input {
              flex: 1;
              padding: 8px 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 14px;
            }
            button {
              background: #2563eb;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 6px;
              cursor: pointer;
            }
            button:hover {
              background: #1d4ed8;
            }
            .notice {
              font-size: 12px;
              color: #6b7280;
              margin-top: 8px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <div style="font-weight: 600;">SHELTR AI Assistant</div>
              <div style="font-size: 12px; opacity: 0.9;">Platform Support</div>
            </div>
          </div>
          <div class="content" id="messages">
            <div class="message bot-message">
              👋 Hello! I can help with platform administration, analytics, system management, and user oversight. What would you like to know?
            </div>
          </div>
          <div class="input-area">
            <div class="input-row">
              <input type="text" placeholder="Type your message..." id="messageInput">
              <button onclick="sendMessage()">Send</button>
            </div>
            <div class="notice">⚡ For emergencies, type "emergency" or call 911</div>
          </div>
          <script>
            function sendMessage() {
              const input = document.getElementById('messageInput');
              const messages = document.getElementById('messages');
              
              if (input.value.trim()) {
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'message user-message';
                userMsg.textContent = input.value;
                messages.appendChild(userMsg);
                
                // Add bot response (placeholder)
                setTimeout(() => {
                  const botMsg = document.createElement('div');
                  botMsg.className = 'message bot-message';
                  botMsg.textContent = 'Thank you for your message. This is a demo pop-out window. Please use the main interface for full functionality.';
                  messages.appendChild(botMsg);
                  messages.scrollTop = messages.scrollHeight;
                }, 1000);
                
                input.value = '';
                messages.scrollTop = messages.scrollHeight;
              }
            }
            
            document.getElementById('messageInput').addEventListener('keypress', function(e) {
              if (e.key === 'Enter') {
                sendMessage();
              }
            });
          </script>
        </body>
        </html>
      `;
      
      popoutWindow.document.write(popoutContent);
      popoutWindow.document.close();
      
      // Handle window closing
      popoutWindow.addEventListener('beforeunload', () => {
        setIsPopout(false);
        popoutWindowRef.current = null;
      });
      
      setIsPopout(true);
      setIsOpen(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Chat Button - Hidden on mobile when bottom nav is present */}
      {!isOpen && !isMobile && (
        <button
          onClick={() => setIsOpen(true)}
          data-chatbot-trigger
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-50 group"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6" />
          <div className="absolute -top-2 -left-2 bg-green-500 rounded-full w-3 h-3 animate-pulse"></div>
          <div className="absolute -top-12 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI Assistant Available
          </div>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className={`fixed ${
          isFullscreen 
            ? 'inset-4 md:inset-8' 
            : 'bottom-6 right-6 w-80 sm:w-96 h-96 sm:h-[500px] md:bottom-20 lg:bottom-6'
        } bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 transition-all duration-300`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">SHELTR AI Assistant</h3>
                <p className="text-xs opacity-90">
                  {user.role === 'super_admin' ? 'Platform Support' :
                   user.role === 'admin' ? 'Shelter Operations' :
                   user.role === 'donor' ? 'Donor Relations' :
                   'Participant Support'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-200 transition-colors p-1"
                title={isFullscreen ? "Minimize" : "Maximize"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={openPopout}
                className="text-white hover:text-gray-200 transition-colors p-1"
                title="Open in new window"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${isFullscreen ? 'lg:max-w-[70%]' : 'lg:max-w-sm'} ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-l-xl rounded-tr-xl shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-r-xl rounded-tl-xl shadow-sm border border-gray-200 dark:border-gray-700'
                } px-4 py-3`}>
                  <div className="flex items-start space-x-3">
                    {message.sender === 'bot' && (
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => handleActionClick(action)}
                              className="block w-full text-left text-xs bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg px-3 py-2 transition-colors border border-blue-200 dark:border-blue-700"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs opacity-60 mt-2 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 rounded-r-xl rounded-tl-xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {/* Emergency Notice */}
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>For emergencies, type "emergency" or call 911</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}; 