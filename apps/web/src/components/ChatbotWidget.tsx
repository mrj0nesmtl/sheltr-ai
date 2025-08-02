"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Zap } from 'lucide-react';
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  if (!user) return null;

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
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
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
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
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-r-lg rounded-tl-lg'
                } px-3 py-2`}>
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-sm">{message.text}</p>
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => handleActionClick(action)}
                              className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1 transition-colors"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-r-lg rounded-tl-lg px-3 py-2 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg px-3 py-2 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {/* Emergency Notice */}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>For emergencies, type "emergency" or call 911</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}; 