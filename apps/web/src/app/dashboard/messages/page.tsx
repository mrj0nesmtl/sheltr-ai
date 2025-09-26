'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Plus, 
  Search, 
  User, 
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Users,
  Bot,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MessageService } from '@/services/messageService';
import type {
  ConversationSummary,
  InternalMessage,
  UserShortcode,
  MessageSendRequest
} from '@/types/messaging';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [availableShortcodes, setAvailableShortcodes] = useState<UserShortcode[]>([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userShortcode, setUserShortcode] = useState<UserShortcode | null>(null);

  // Initialize user shortcode and load data
  useEffect(() => {
    const initializeMessaging = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        console.log('🎯 Initializing messaging for user:', user.email);

        // Initialize user shortcode if needed
        await MessageService.initializeUserShortcode(
          user.uid,
          user.email || '',
          user.displayName || user.email?.split('@')[0] || 'User',
          user.role as 'super_admin' | 'platform_admin' | 'shelter_admin'
        );

        // Get user's shortcode
        const shortcode = await MessageService.getShortcodeByUserId(user.uid);
        setUserShortcode(shortcode);

        // Load conversations and available shortcodes
        await Promise.all([
          loadConversations(),
          loadAvailableShortcodes()
        ]);

      } catch (error) {
        console.error('❌ Error initializing messaging:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMessaging();
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      const userConversations = await MessageService.getUserConversations(user.uid);
      setConversations(userConversations);
      console.log('✅ Loaded conversations:', userConversations.length);
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
    }
  };

  const loadAvailableShortcodes = async () => {
    if (!user) return;

    try {
      const shortcodes = await MessageService.getAllActiveShortcodes(user.uid);
      setAvailableShortcodes(shortcodes);
      console.log('✅ Loaded shortcodes:', shortcodes.length);
    } catch (error) {
      console.error('❌ Error loading shortcodes:', error);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    if (!user) return;

    try {
      const response = await MessageService.getConversationMessages(conversationId, user.uid);
      if (response.success) {
        setMessages(response.data);
        console.log('✅ Loaded messages:', response.data.length);
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !newMessageContent.trim()) return;

    let recipientShortcode = selectedRecipient;
    let content = newMessageContent.trim();

    // Check if this is an MCP-style command
    const mcpCommand = MessageService.parseMCPMessageCommand(content, userShortcode?.shortcode || '');
    
    if (mcpCommand.isValid && mcpCommand.parsedCommand.recipient) {
      recipientShortcode = mcpCommand.parsedCommand.recipient;
      content = mcpCommand.parsedCommand.content;
    }

    if (!recipientShortcode) {
      alert('Please select a recipient or use @username format');
      return;
    }

    try {
      setIsSending(true);

      const messageRequest: MessageSendRequest = {
        toUserShortcode: recipientShortcode,
        content,
        type: mcpCommand.isValid ? 'mention' : 'direct',
        sentVia: 'dashboard'
      };

      const result = await MessageService.sendMessage(user.uid, messageRequest);

      if (result.success) {
        setNewMessageContent('');
        setSelectedRecipient('');
        setShowNewMessage(false);
        
        // Refresh conversations and messages
        await loadConversations();
        if (selectedConversation) {
          await loadConversationMessages(selectedConversation);
        }
        
        console.log('✅ Message sent successfully');
      } else {
        alert(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'delivered':
        return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case 'sent':
        return <Circle className="h-3 w-3 text-gray-400" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Circle className="h-3 w-3 text-gray-400" />;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantShortcodes.some(shortcode =>
      shortcode.toLowerCase().includes(searchQuery.toLowerCase())
    ) || conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Internal admin communication with @mention support
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {userShortcode && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-300">
                <User className="h-3 w-3 mr-1" />
                @{userShortcode.shortcode}
              </Badge>
            )}
            <Button 
              onClick={() => setShowNewMessage(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Message
            </Button>
          </div>
        </div>
        
        {/* MCP Integration Info */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="font-semibold text-purple-800 dark:text-purple-200">MCP Integration Active</span>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            You can use chatbot commands here! Try: <code className="bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded text-xs">@joel Can you review the metrics?</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Conversations
              </CardTitle>
              <Badge variant="outline">
                {conversations.length}
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start a new message to get started!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.conversationId}
                      onClick={() => {
                        setSelectedConversation(conversation.conversationId);
                        loadConversationMessages(conversation.conversationId);
                      }}
                      className={`p-4 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        selectedConversation === conversation.conversationId
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {conversation.participantShortcodes
                            .filter(sc => sc !== userShortcode?.shortcode)
                            .map(shortcode => (
                              <Badge key={shortcode} variant="outline" className="text-xs">
                                @{shortcode}
                              </Badge>
                            ))
                          }
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(conversation.lastMessageAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {selectedConversation ? 'Messages' : 'Select a Conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <div className="space-y-4">
                {/* Messages */}
                <ScrollArea className="h-80 border rounded-lg p-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No messages in this conversation</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isOwnMessage = message.fromUserId === user?.uid;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isOwnMessage
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium">
                                  @{isOwnMessage ? message.fromUserShortcode : message.fromUserShortcode}
                                </span>
                                {message.sentVia === 'chatbot' && (
                                  <Bot className="h-3 w-3 opacity-70" />
                                )}
                              </div>
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-70">
                                  {formatTimeAgo(message.createdAt)}
                                </span>
                                {isOwnMessage && getMessageStatusIcon(message.status)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>

                {/* Reply Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message... (or use @username format)"
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !newMessageContent.trim()}
                    className="self-end"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No conversation selected</p>
                <p>Choose a conversation from the left or start a new message</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                New Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient</label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select recipient...</option>
                  {availableShortcodes.map((shortcode) => (
                    <option key={shortcode.id} value={shortcode.shortcode}>
                      @{shortcode.shortcode} - {shortcode.displayName} ({shortcode.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  placeholder="Type your message... (or use @username format)"
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNewMessage(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !newMessageContent.trim()}
                  className="flex-1"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
