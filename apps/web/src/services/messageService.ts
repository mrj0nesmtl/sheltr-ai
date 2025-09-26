/**
 * Internal Messaging Service
 * Handles admin-to-admin messaging with shortcode support and MCP integration
 */

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  serverTimestamp,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NotificationService } from './notificationService';
import type {
  InternalMessage,
  UserShortcode,
  MessageConversation,
  MessageSendRequest,
  MessageResponse,
  ConversationSummary,
  MCPMessageCommand,
  PaginatedResponse,
  APIResponse
} from '@/types/messaging';

export class MessageService {
  
  // ========================================
  // SHORTCODE MANAGEMENT
  // ========================================
  
  /**
   * Initialize user shortcode for admin users
   */
  static async initializeUserShortcode(
    userId: string,
    email: string,
    displayName: string,
    role: 'super_admin' | 'platform_admin' | 'shelter_admin'
  ): Promise<boolean> {
    try {
      console.log(`🎯 Initializing shortcode for user: ${email}`);
      
      // Generate shortcode from email (privacy-safe)
      const shortcode = this.generateShortcodeFromEmail(email);
      
      // Check if shortcode already exists
      const existingShortcode = await this.getShortcodeByUserId(userId);
      if (existingShortcode) {
        console.log(`✅ Shortcode already exists: @${existingShortcode.shortcode}`);
        return true;
      }
      
      // Create new shortcode record
      const shortcodeData: Omit<UserShortcode, 'id'> = {
        userId,
        shortcode,
        displayName,
        email,
        role,
        isActive: true,
        isPublic: true,
        notificationSettings: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          chatbotMentions: true
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          messagesReceived: 0,
          messagesSent: 0,
          mentionsReceived: 0
        }
      };
      
      await addDoc(collection(db, 'user_shortcodes'), shortcodeData);
      
      console.log(`✅ Created shortcode @${shortcode} for ${displayName}`);
      return true;
      
    } catch (error) {
      console.error('❌ Error initializing user shortcode:', error);
      return false;
    }
  }
  
  /**
   * Get user shortcode by user ID
   */
  static async getShortcodeByUserId(userId: string): Promise<UserShortcode | null> {
    try {
      const q = query(
        collection(db, 'user_shortcodes'),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as UserShortcode;
      
    } catch (error) {
      console.error('❌ Error getting shortcode by user ID:', error);
      return null;
    }
  }
  
  /**
   * Get user shortcode by shortcode string
   */
  static async getShortcodeByShortcode(shortcode: string): Promise<UserShortcode | null> {
    try {
      const q = query(
        collection(db, 'user_shortcodes'),
        where('shortcode', '==', shortcode.toLowerCase()),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as UserShortcode;
      
    } catch (error) {
      console.error('❌ Error getting shortcode by shortcode:', error);
      return null;
    }
  }
  
  /**
   * Get all available shortcodes for autocomplete
   */
  static async getAllActiveShortcodes(
    excludeUserId?: string
  ): Promise<UserShortcode[]> {
    try {
      let q = query(
        collection(db, 'user_shortcodes'),
        where('isActive', '==', true),
        where('isPublic', '==', true),
        orderBy('displayName')
      );
      
      const querySnapshot = await getDocs(q);
      let shortcodes: UserShortcode[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as UserShortcode;
        if (!excludeUserId || data.userId !== excludeUserId) {
          shortcodes.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      return shortcodes;
      
    } catch (error) {
      console.error('❌ Error getting all active shortcodes:', error);
      return [];
    }
  }
  
  // ========================================
  // MESSAGE OPERATIONS
  // ========================================
  
  /**
   * Send a direct message between admin users
   */
  static async sendMessage(
    fromUserId: string,
    request: MessageSendRequest
  ): Promise<MessageResponse> {
    try {
      console.log(`💌 Sending message from ${fromUserId} to @${request.toUserShortcode}`);
      
      // Get sender shortcode info
      const senderShortcode = await this.getShortcodeByUserId(fromUserId);
      if (!senderShortcode) {
        return {
          success: false,
          error: 'Sender shortcode not found. Please contact system administrator.'
        };
      }
      
      // Get recipient shortcode info
      const recipientShortcode = await this.getShortcodeByShortcode(request.toUserShortcode);
      if (!recipientShortcode) {
        return {
          success: false,
          error: `Recipient @${request.toUserShortcode} not found.`
        };
      }
      
      // Check if sender can message this role
      if (!this.canMessageRole(senderShortcode.role, recipientShortcode.role)) {
        return {
          success: false,
          error: 'You do not have permission to message this user.'
        };
      }
      
      // Get or create conversation
      const conversationId = await this.getOrCreateConversation(
        [senderShortcode.userId, recipientShortcode.userId],
        [senderShortcode.shortcode, recipientShortcode.shortcode]
      );
      
      // Create message
      const messageData: Omit<InternalMessage, 'id'> = {
        conversationId,
        fromUserId: senderShortcode.userId,
        fromUserShortcode: senderShortcode.shortcode,
        fromUserDisplayName: senderShortcode.displayName,
        fromUserRole: senderShortcode.role,
        toUserId: recipientShortcode.userId,
        toUserShortcode: recipientShortcode.shortcode,
        toUserDisplayName: recipientShortcode.displayName,
        toUserRole: recipientShortcode.role,
        content: request.content,
        type: request.type || 'direct',
        priority: request.priority || 'normal',
        category: request.category || 'general',
        status: 'sent',
        sentVia: request.sentVia || 'dashboard',
        createdAt: new Date(),
        metadata: {},
        isDeleted: false
      };
      
      const docRef = await addDoc(collection(db, 'internal_messages'), messageData);
      
      // Update conversation last message
      await this.updateConversationLastMessage(conversationId, docRef.id, request.content);
      
      // Update sender/recipient stats
      await this.updateUserStats(senderShortcode.id, 'sent');
      await this.updateUserStats(recipientShortcode.id, 'received');
      
      // Create notifications for message lifecycle
      await NotificationService.handleMessageStatusChange(
        docRef.id,
        conversationId,
        'sent',
        senderShortcode.userId,
        recipientShortcode.userId,
        senderShortcode.displayName,
        senderShortcode.shortcode,
        request.content
      );
      
      await NotificationService.handleMessageStatusChange(
        docRef.id,
        conversationId,
        'delivered',
        senderShortcode.userId,
        recipientShortcode.userId,
        senderShortcode.displayName,
        senderShortcode.shortcode,
        request.content
      );
      
      console.log(`✅ Message sent successfully with notifications: ${docRef.id}`);
      
      return {
        success: true,
        messageId: docRef.id,
        deliveredAt: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return {
        success: false,
        error: 'Failed to send message. Please try again.'
      };
    }
  }
  
  /**
   * Get messages for a conversation
   */
  static async getConversationMessages(
    conversationId: string,
    userId: string,
    page: number = 1,
    pageLimit: number = 50
  ): Promise<PaginatedResponse<InternalMessage>> {
    try {
      // Verify user has access to this conversation
      const hasAccess = await this.userHasConversationAccess(conversationId, userId);
      if (!hasAccess) {
        return {
          success: false,
          data: [],
          pagination: { page: 1, limit: pageLimit, total: 0, hasMore: false },
          error: 'Access denied to this conversation.'
        };
      }
      
      const q = query(
        collection(db, 'internal_messages'),
        where('conversationId', '==', conversationId),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc'),
        limit(pageLimit)
      );
      
      const querySnapshot = await getDocs(q);
      const messages: InternalMessage[] = [];
      
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        } as InternalMessage);
      });
      
      return {
        success: true,
        data: messages.reverse(), // Show oldest first in conversation
        pagination: {
          page,
          limit: pageLimit,
          total: messages.length,
          hasMore: messages.length === pageLimit
        }
      };
      
    } catch (error) {
      console.error('❌ Error getting conversation messages:', error);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: pageLimit, total: 0, hasMore: false },
        error: 'Failed to load messages.'
      };
    }
  }
  
  /**
   * Get user's conversations
   */
  static async getUserConversations(userId: string): Promise<ConversationSummary[]> {
    try {
      const q = query(
        collection(db, 'message_conversations'),
        where('participantIds', 'array-contains', userId),
        where('isActive', '==', true),
        orderBy('lastMessageAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const conversations: ConversationSummary[] = [];
      
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        
        // Get unread count
        const unreadCount = await this.getUnreadMessageCount(doc.id, userId);
        
        conversations.push({
          conversationId: doc.id,
          participantShortcodes: data.participantShortcodes || [],
          lastMessage: data.lastMessageContent || '',
          lastMessageAt: data.lastMessageAt?.toDate() || new Date(),
          unreadCount,
          isActive: data.isActive || true
        });
      }
      
      return conversations;
      
    } catch (error) {
      console.error('❌ Error getting user conversations:', error);
      return [];
    }
  }
  
  /**
   * Mark message as read
   */
  static async markMessageAsRead(messageId: string, userId: string): Promise<boolean> {
    try {
      const messageRef = doc(db, 'internal_messages', messageId);
      const messageDoc = await getDoc(messageRef);
      
      if (!messageDoc.exists()) {
        return false;
      }
      
      const messageData = messageDoc.data() as InternalMessage;
      
      // Only recipient can mark as read
      if (messageData.toUserId !== userId) {
        return false;
      }
      
      // Update message status
      await updateDoc(messageRef, {
        status: 'read',
        readAt: new Date()
      });
      
      return true;
      
    } catch (error) {
      console.error('❌ Error marking message as read:', error);
      return false;
    }
  }
  
  // ========================================
  // MCP INTEGRATION
  // ========================================
  
  /**
   * Parse MCP command for message sending
   */
  static parseMCPMessageCommand(input: string, senderShortcode: string): MCPMessageCommand {
    try {
      console.log(`🤖 Parsing MCP command: "${input}"`);
      
      // Patterns for message commands
      const patterns = [
        /^@(\w+)\s+(.+)$/i,                           // @joel message content
        /^send\s+(?:message\s+)?to\s+@(\w+):\s*(.+)$/i, // send message to @joel: content
        /^message\s+@(\w+):\s*(.+)$/i,                // message @joel: content
        /^@broadcast\s+(.+)$/i                        // @broadcast message content
      ];
      
      for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match) {
          if (match[1].toLowerCase() === 'broadcast') {
            return {
              originalInput: input,
              parsedCommand: {
                action: 'broadcast',
                content: match[2].trim(),
                sender: senderShortcode
              },
              isValid: true
            };
          } else {
            return {
              originalInput: input,
              parsedCommand: {
                action: 'send',
                recipient: match[1].toLowerCase(),
                content: match[2].trim(),
                sender: senderShortcode
              },
              isValid: true
            };
          }
        }
      }
      
      return {
        originalInput: input,
        parsedCommand: {
          action: 'send',
          content: input,
          sender: senderShortcode
        },
        isValid: false,
        errorMessage: 'Could not parse message command. Try: @username your message'
      };
      
    } catch (error) {
      console.error('❌ Error parsing MCP command:', error);
      return {
        originalInput: input,
        parsedCommand: {
          action: 'send',
          content: input,
          sender: senderShortcode
        },
        isValid: false,
        errorMessage: 'Error parsing command.'
      };
    }
  }
  
  /**
   * Execute MCP message command
   */
  static async executeMCPMessageCommand(
    command: MCPMessageCommand,
    fromUserId: string
  ): Promise<MessageResponse> {
    try {
      if (!command.isValid) {
        return {
          success: false,
          error: command.errorMessage || 'Invalid command'
        };
      }
      
      if (command.parsedCommand.action === 'send' && command.parsedCommand.recipient) {
        return await this.sendMessage(fromUserId, {
          toUserShortcode: command.parsedCommand.recipient,
          content: command.parsedCommand.content,
          type: 'mention',
          sentVia: 'chatbot'
        });
      }
      
      if (command.parsedCommand.action === 'broadcast') {
        return await this.broadcastMessage(fromUserId, {
          content: command.parsedCommand.content,
          sentVia: 'chatbot'
        });
      }
      
      return {
        success: false,
        error: 'Unsupported command action'
      };
      
    } catch (error) {
      console.error('❌ Error executing MCP command:', error);
      return {
        success: false,
        error: 'Failed to execute command'
      };
    }
  }
  
  /**
   * Broadcast message to all admins (Super Admin only)
   */
  static async broadcastMessage(
    fromUserId: string,
    request: { content: string; sentVia?: 'dashboard' | 'chatbot' }
  ): Promise<MessageResponse> {
    try {
      const senderShortcode = await this.getShortcodeByUserId(fromUserId);
      if (!senderShortcode || senderShortcode.role !== 'super_admin') {
        return {
          success: false,
          error: 'Only Super Admins can broadcast messages.'
        };
      }
      
      // Get all active shortcodes except sender
      const allShortcodes = await this.getAllActiveShortcodes(fromUserId);
      
      let successCount = 0;
      let errorCount = 0;
      
      // Send to each recipient
      for (const recipient of allShortcodes) {
        const result = await this.sendMessage(fromUserId, {
          toUserShortcode: recipient.shortcode,
          content: request.content,
          type: 'broadcast',
          priority: 'high',
          sentVia: request.sentVia || 'dashboard'
        });
        
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      }
      
      return {
        success: successCount > 0,
        messageId: `broadcast-${Date.now()}`,
        deliveredAt: new Date(),
        error: errorCount > 0 ? `Failed to deliver to ${errorCount} recipients` : undefined
      };
      
    } catch (error) {
      console.error('❌ Error broadcasting message:', error);
      return {
        success: false,
        error: 'Failed to broadcast message'
      };
    }
  }
  
  // ========================================
  // HELPER METHODS
  // ========================================
  
  /**
   * Generate shortcode from email (privacy-safe)
   */
  private static generateShortcodeFromEmail(email: string): string {
    const shortcodeMap: { [key: string]: string } = {
      'joel.yaffe@gmail.com': 'joel',
      'alaghetts@gmail.com': 'marc',
      'alexanderkline13@gmail.com': 'alex',
      'deefactorial@gmail.com': 'dom',
      'doug.kukura@gmail.com': 'doug',
      'senw@royaltri.com': 'sen',
      'christinesavardmedia@gmail.com': 'christine',
      'zaffialaplante@gmail.com': 'zaffia',
      'morganhirtle@gmail.com': 'morgan',
      'srivastavaaryan005@gmail.com': 'aryan',
      'gunnar.blaze@gmail.com': 'gunnar',
      'f.tjeff79@gmail.com': 'jeff',
      'admin@royaltri.com': 'royaltri'
    };
    
    return shortcodeMap[email.toLowerCase()] || email.split('@')[0].split('.')[0];
  }
  
  /**
   * Check if user role can message another role
   */
  private static canMessageRole(senderRole: string, recipientRole: string): boolean {
    const permissions = {
      super_admin: ['super_admin', 'platform_admin', 'shelter_admin'],
      platform_admin: ['super_admin', 'platform_admin', 'shelter_admin'],
      shelter_admin: ['super_admin', 'platform_admin', 'shelter_admin']
    };
    
    return permissions[senderRole as keyof typeof permissions]?.includes(recipientRole) || false;
  }
  
  /**
   * Get or create conversation between users
   */
  private static async getOrCreateConversation(
    participantIds: string[],
    participantShortcodes: string[]
  ): Promise<string> {
    try {
      // Sort IDs for consistent lookup
      const sortedIds = [...participantIds].sort();
      const sortedShortcodes = [...participantShortcodes].sort();
      
      // Look for existing conversation
      const q = query(
        collection(db, 'message_conversations'),
        where('participantIds', '==', sortedIds)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }
      
      // Create new conversation
      const conversationData: Omit<MessageConversation, 'id'> = {
        participantIds: sortedIds,
        participantShortcodes: sortedShortcodes,
        type: 'direct',
        lastMessageId: '',
        lastMessageContent: '',
        lastMessageAt: new Date(),
        lastMessageBy: participantIds[0],
        isActive: true,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: participantIds[0],
        settings: {
          allowNewParticipants: false,
          muteNotifications: false
        },
        stats: {
          totalMessages: 0,
          totalParticipants: participantIds.length
        }
      };
      
      const docRef = await addDoc(collection(db, 'message_conversations'), conversationData);
      return docRef.id;
      
    } catch (error) {
      console.error('❌ Error getting/creating conversation:', error);
      throw error;
    }
  }
  
  /**
   * Update conversation with last message info
   */
  private static async updateConversationLastMessage(
    conversationId: string,
    messageId: string,
    content: string
  ): Promise<void> {
    try {
      const conversationRef = doc(db, 'message_conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessageId: messageId,
        lastMessageContent: content,
        lastMessageAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('❌ Error updating conversation:', error);
    }
  }
  
  /**
   * Update user messaging statistics
   */
  private static async updateUserStats(
    shortcodeId: string,
    action: 'sent' | 'received' | 'mentioned'
  ): Promise<void> {
    try {
      const shortcodeRef = doc(db, 'user_shortcodes', shortcodeId);
      const shortcodeDoc = await getDoc(shortcodeRef);
      
      if (shortcodeDoc.exists()) {
        const data = shortcodeDoc.data() as UserShortcode;
        const stats = data.stats || { messagesReceived: 0, messagesSent: 0, mentionsReceived: 0 };
        
        switch (action) {
          case 'sent':
            stats.messagesSent++;
            break;
          case 'received':
            stats.messagesReceived++;
            break;
          case 'mentioned':
            stats.mentionsReceived++;
            break;
        }
        
        await updateDoc(shortcodeRef, {
          stats,
          lastUsedAt: new Date(),
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('❌ Error updating user stats:', error);
    }
  }
  
  /**
   * Check if user has access to conversation
   */
  private static async userHasConversationAccess(
    conversationId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const conversationRef = doc(db, 'message_conversations', conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (!conversationDoc.exists()) {
        return false;
      }
      
      const data = conversationDoc.data() as MessageConversation;
      return data.participantIds.includes(userId);
      
    } catch (error) {
      console.error('❌ Error checking conversation access:', error);
      return false;
    }
  }
  
  /**
   * Get unread message count for user in conversation
   */
  private static async getUnreadMessageCount(
    conversationId: string,
    userId: string
  ): Promise<number> {
    try {
      const q = query(
        collection(db, 'internal_messages'),
        where('conversationId', '==', conversationId),
        where('toUserId', '==', userId),
        where('status', 'in', ['sent', 'delivered']),
        where('isDeleted', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
      
    } catch (error) {
      console.error('❌ Error getting unread count:', error);
      return 0;
    }
  }
  
  /**
   * Get total unread message count for user
   */
  static async getTotalUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'internal_messages'),
        where('toUserId', '==', userId),
        where('status', 'in', ['sent', 'delivered']),
        where('isDeleted', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
      
    } catch (error) {
      console.error('❌ Error getting total unread count:', error);
      return 0;
    }
  }
}
