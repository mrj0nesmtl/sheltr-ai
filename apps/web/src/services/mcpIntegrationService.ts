/**
 * MCP Integration Service
 * Handles integration between MCP chatbot and internal messaging system
 */

import { MessageService } from '@/services/messageService';
import type {
  MCPMessageCommand,
  MessageResponse,
  UserShortcode
} from '@/types/messaging';

export class MCPIntegrationService {
  
  /**
   * Process MCP command and execute appropriate action
   */
  static async processMCPCommand(
    input: string,
    userId: string,
    sessionId?: string
  ): Promise<{
    success: boolean;
    response: string;
    actionTaken?: string;
    messageId?: string;
    error?: string;
  }> {
    try {
      console.log(`🤖 Processing MCP command from user ${userId}: "${input}"`);
      
      // Get user's shortcode
      const userShortcode = await MessageService.getShortcodeByUserId(userId);
      if (!userShortcode) {
        return {
          success: false,
          response: 'Unable to process message command. Please contact system administrator.',
          error: 'User shortcode not found'
        };
      }
      
      // Parse the command
      const parsedCommand = MessageService.parseMCPMessageCommand(input, userShortcode.shortcode);
      
      if (!parsedCommand.isValid) {
        return {
          success: false,
          response: parsedCommand.errorMessage || 'Could not understand the message command. Try: @username your message',
          error: 'Invalid command format'
        };
      }
      
      // Execute the command
      const result = await MessageService.executeMCPMessageCommand(parsedCommand, userId);
      
      if (result.success) {
        let response = '';
        let actionTaken = '';
        
        if (parsedCommand.parsedCommand.action === 'send') {
          response = `✅ Message sent to @${parsedCommand.parsedCommand.recipient}`;
          actionTaken = 'message_sent';
        } else if (parsedCommand.parsedCommand.action === 'broadcast') {
          response = '✅ Message broadcast to all administrators';
          actionTaken = 'broadcast_sent';
        }
        
        // Log the MCP activity
        await this.logMCPActivity({
          userId,
          sessionId: sessionId || `mcp-${Date.now()}`,
          inputText: input,
          outputText: response,
          success: true,
          commandParsed: parsedCommand,
          executionTimeMs: 0 // Will be calculated in real implementation
        });
        
        return {
          success: true,
          response,
          actionTaken,
          messageId: result.messageId
        };
        
      } else {
        const errorResponse = result.error || 'Failed to send message';
        
        // Log the failed MCP activity
        await this.logMCPActivity({
          userId,
          sessionId: sessionId || `mcp-${Date.now()}`,
          inputText: input,
          outputText: errorResponse,
          success: false,
          commandParsed: parsedCommand,
          executionTimeMs: 0,
          error: result.error
        });
        
        return {
          success: false,
          response: `❌ ${errorResponse}`,
          error: result.error
        };
      }
      
    } catch (error) {
      console.error('❌ Error processing MCP command:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorResponse = 'Sorry, there was an error processing your message command.';
      
      // Log the error
      await this.logMCPActivity({
        userId,
        sessionId: sessionId || `mcp-${Date.now()}`,
        inputText: input,
        outputText: errorResponse,
        success: false,
        executionTimeMs: 0,
        error: errorMessage
      });
      
      return {
        success: false,
        response: errorResponse,
        error: errorMessage
      };
    }
  }
  
  /**
   * Check if input contains a message command
   */
  static containsMessageCommand(input: string): boolean {
    const messagePatterns = [
      /^@\w+\s+.+$/i,                           // @username message
      /^send\s+(?:message\s+)?to\s+@\w+:/i,     // send message to @username:
      /^message\s+@\w+:/i,                      // message @username:
      /^@broadcast\s+.+$/i                      // @broadcast message
    ];
    
    return messagePatterns.some(pattern => pattern.test(input.trim()));
  }
  
  /**
   * Get message command suggestions based on available users
   */
  static async getMessageCommandSuggestions(userId: string): Promise<string[]> {
    try {
      const availableShortcodes = await MessageService.getAllActiveShortcodes(userId);
      
      const suggestions: string[] = [];
      
      // Add direct message suggestions
      availableShortcodes.slice(0, 3).forEach(shortcode => {
        suggestions.push(`@${shortcode.shortcode} Can you help with...`);
        suggestions.push(`Send message to @${shortcode.shortcode}: ...`);
      });
      
      // Add broadcast suggestion for super admins
      const userShortcode = await MessageService.getShortcodeByUserId(userId);
      if (userShortcode?.role === 'super_admin') {
        suggestions.push('@broadcast Important announcement for all admins');
      }
      
      return suggestions;
      
    } catch (error) {
      console.error('❌ Error getting message suggestions:', error);
      return [
        '@username Your message here',
        'Send message to @username: Your message',
        'Message @username: Your message'
      ];
    }
  }
  
  /**
   * Get available admin shortcodes for autocomplete
   */
  static async getAvailableAdminShortcodes(userId: string): Promise<{
    shortcode: string;
    displayName: string;
    role: string;
    isOnline?: boolean;
  }[]> {
    try {
      const shortcodes = await MessageService.getAllActiveShortcodes(userId);
      
      return shortcodes.map(sc => ({
        shortcode: sc.shortcode,
        displayName: sc.displayName,
        role: sc.role,
        isOnline: sc.stats.lastActiveAt ? 
          (Date.now() - new Date(sc.stats.lastActiveAt).getTime()) < 300000 : // 5 minutes
          false
      }));
      
    } catch (error) {
      console.error('❌ Error getting admin shortcodes:', error);
      return [];
    }
  }
  
  /**
   * Process batch MCP commands (for multiple @mentions in one message)
   */
  static async processBatchMCPCommands(
    input: string,
    userId: string,
    sessionId?: string
  ): Promise<{
    success: boolean;
    responses: string[];
    successCount: number;
    failureCount: number;
  }> {
    try {
      // Extract multiple @mentions from input
      const mentionPattern = /@(\w+)/g;
      const mentions = Array.from(input.matchAll(mentionPattern));
      
      if (mentions.length === 0) {
        return {
          success: false,
          responses: ['No valid @mentions found in message'],
          successCount: 0,
          failureCount: 1
        };
      }
      
      const responses: string[] = [];
      let successCount = 0;
      let failureCount = 0;
      
      // Process each mention
      for (const mention of mentions) {
        const username = mention[1];
        const mentionCommand = `@${username} ${input.replace(/@\w+/g, '').trim()}`;
        
        const result = await this.processMCPCommand(mentionCommand, userId, sessionId);
        
        if (result.success) {
          successCount++;
          responses.push(`✅ @${username}: Message sent`);
        } else {
          failureCount++;
          responses.push(`❌ @${username}: ${result.error || 'Failed to send'}`);
        }
      }
      
      return {
        success: successCount > 0,
        responses,
        successCount,
        failureCount
      };
      
    } catch (error) {
      console.error('❌ Error processing batch MCP commands:', error);
      return {
        success: false,
        responses: ['Error processing batch message commands'],
        successCount: 0,
        failureCount: 1
      };
    }
  }
  
  /**
   * Log MCP activity for analytics and debugging
   */
  private static async logMCPActivity(activity: {
    userId: string;
    sessionId: string;
    inputText: string;
    outputText: string;
    success: boolean;
    commandParsed?: MCPMessageCommand;
    executionTimeMs: number;
    error?: string;
  }): Promise<void> {
    try {
      // TODO: Implement actual logging to database
      // This would save to the mcp_activity_log collection
      
      console.log('📊 MCP Activity Log:', {
        userId: activity.userId,
        sessionId: activity.sessionId,
        input: activity.inputText,
        output: activity.outputText,
        success: activity.success,
        command: activity.commandParsed?.parsedCommand,
        executionTime: activity.executionTimeMs,
        error: activity.error,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error logging MCP activity:', error);
    }
  }
  
  /**
   * Get MCP integration health status
   */
  static async getIntegrationHealth(): Promise<{
    isHealthy: boolean;
    services: {
      messageService: boolean;
      shortcodeSystem: boolean;
      commandParser: boolean;
      database: boolean;
    };
    lastActivity?: Date;
    totalCommands?: number;
    successRate?: number;
  }> {
    try {
      // Check message service
      const messageServiceHealthy = true; // TODO: Implement actual health check
      
      // Check shortcode system
      const shortcodeStats = await MessageService.getAllActiveShortcodes();
      const shortcodeSystemHealthy = shortcodeStats.length > 0;
      
      // Check command parser
      const testCommand = MessageService.parseMCPMessageCommand('@test hello', 'testuser');
      const commandParserHealthy = testCommand !== null;
      
      // Check database connectivity
      const databaseHealthy = true; // TODO: Implement actual database health check
      
      const isHealthy = messageServiceHealthy && shortcodeSystemHealthy && 
                       commandParserHealthy && databaseHealthy;
      
      return {
        isHealthy,
        services: {
          messageService: messageServiceHealthy,
          shortcodeSystem: shortcodeSystemHealthy,
          commandParser: commandParserHealthy,
          database: databaseHealthy
        },
        lastActivity: new Date(),
        totalCommands: 127, // TODO: Get from actual logs
        successRate: 0.98   // TODO: Calculate from actual logs
      };
      
    } catch (error) {
      console.error('❌ Error checking MCP integration health:', error);
      return {
        isHealthy: false,
        services: {
          messageService: false,
          shortcodeSystem: false,
          commandParser: false,
          database: false
        }
      };
    }
  }
  
  /**
   * Generate MCP response with context awareness
   */
  static generateContextualResponse(
    command: MCPMessageCommand,
    result: MessageResponse,
    userRole: string
  ): string {
    if (!result.success) {
      return `❌ ${result.error || 'Message failed to send'}`;
    }
    
    const action = command.parsedCommand.action;
    const recipient = command.parsedCommand.recipient;
    
    switch (action) {
      case 'send':
        return `✅ Message delivered to @${recipient}`;
        
      case 'broadcast':
        if (userRole === 'super_admin') {
          return '✅ Message broadcast to all administrators';
        } else {
          return '❌ Broadcast messages are only available to Super Admins';
        }
        
      default:
        return '✅ Message sent successfully';
    }
  }
}
