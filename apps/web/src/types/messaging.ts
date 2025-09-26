/**
 * Internal Messaging System - Type Definitions
 * Comprehensive TypeScript interfaces for the messaging and automation system
 */

// ========================================
// CORE MESSAGING TYPES
// ========================================

export interface InternalMessage {
  // Core Message Data
  id: string;
  conversationId: string;
  
  // Sender Information
  fromUserId: string;
  fromUserShortcode: string;     // @joel
  fromUserDisplayName: string;
  fromUserRole: 'super_admin' | 'platform_admin' | 'shelter_admin';
  
  // Recipient Information
  toUserId: string;
  toUserShortcode: string;       // @morgan
  toUserDisplayName: string;
  toUserRole: 'super_admin' | 'platform_admin' | 'shelter_admin';
  
  // Message Content
  content: string;
  originalContent?: string;      // Raw content before processing
  
  // Message Classification
  type: 'direct' | 'mention' | 'broadcast' | 'automation';
  priority: 'normal' | 'high' | 'urgent';
  category?: 'general' | 'support' | 'technical' | 'emergency';
  
  // Message Status
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentVia: 'dashboard' | 'chatbot' | 'automation';
  
  // Timestamps
  createdAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  
  // Metadata
  metadata: {
    originalCommand?: string;
    automationRuleId?: string;
    replyToMessageId?: string;
    attachments?: string[];
    editHistory?: {
      editedAt: Date;
      previousContent: string;
      editedBy: string;
    }[];
  };
  
  // Soft Delete
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface UserShortcode {
  // Core Shortcode Data
  id: string;
  userId: string;
  shortcode: string;             // Without @ symbol
  
  // User Information
  displayName: string;
  email: string;
  role: 'super_admin' | 'platform_admin' | 'shelter_admin';
  
  // Shortcode Settings
  isActive: boolean;
  isPublic: boolean;
  customShortcode?: string;
  
  // Preferences
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    chatbotMentions: boolean;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
  
  // Usage Statistics
  stats: {
    messagesReceived: number;
    messagesSent: number;
    mentionsReceived: number;
    lastActiveAt?: Date;
  };
}

export interface MessageConversation {
  // Core Conversation Data
  id: string;
  title?: string;
  
  // Participants
  participantIds: string[];
  participantShortcodes: string[];
  
  // Conversation Type
  type: 'direct' | 'group' | 'broadcast' | 'automated';
  
  // Last Message Info
  lastMessageId: string;
  lastMessageContent: string;
  lastMessageAt: Date;
  lastMessageBy: string;
  
  // Conversation Status
  isActive: boolean;
  isArchived: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Settings
  settings: {
    allowNewParticipants: boolean;
    muteNotifications: boolean;
    autoArchiveAfterDays?: number;
  };
  
  // Statistics
  stats: {
    totalMessages: number;
    totalParticipants: number;
    avgResponseTimeMinutes?: number;
  };
}

// ========================================
// AUTOMATION SYSTEM TYPES
// ========================================

export interface AutomationWorkflow {
  // Core Workflow Data
  id: string;
  name: string;
  description: string;
  category: 'email_automation' | 'mcp_control' | 'notification' | 'data_processing';
  
  // Workflow Configuration
  trigger: {
    type: 'email_received' | 'form_submitted' | 'user_action' | 'scheduled' | 'mcp_command';
    conditions: {
      // Email-specific triggers
      emailSubjectContains?: string[];
      emailFromDomain?: string[];
      emailToAddress?: string[];
      
      // Form-specific triggers
      formType?: 'contact' | 'donation' | 'shelter_inquiry' | 'support';
      formFields?: { [key: string]: any };
      
      // User action triggers
      userRole?: string[];
      actionType?: string;
      
      // Scheduled triggers
      schedule?: {
        frequency: 'once' | 'daily' | 'weekly' | 'monthly';
        time: string;
        timezone: string;
        daysOfWeek?: number[];
      };
      
      // MCP command triggers
      mcpCommand?: string;
      mcpUser?: string[];
    };
  };
  
  // Actions to Execute
  actions: {
    // Email automation actions
    sendEmailReply?: {
      templateId: string;
      customSubject?: string;
      customContent?: string;
      attachments?: string[];
    };
    
    // Internal messaging actions
    sendInternalMessage?: {
      recipients: string[];
      content: string;
      priority: 'normal' | 'high' | 'urgent';
    };
    
    // MCP actions
    triggerMCPResponse?: {
      responseType: 'acknowledgment' | 'data_query' | 'custom';
      responseContent: string;
    };
    
    // Data processing actions
    logToAnalytics?: {
      eventType: string;
      metadata: { [key: string]: any };
    };
    
    // External integrations
    webhookCall?: {
      url: string;
      method: 'GET' | 'POST' | 'PUT';
      headers: { [key: string]: string };
      payload: { [key: string]: any };
    };
  };
  
  // Workflow Settings
  isActive: boolean;
  priority: number;
  maxExecutionsPerHour: number;
  retryOnFailure: boolean;
  maxRetries: number;
  
  // Access Control
  createdBy: string;
  allowedRoles: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastExecutedAt?: Date;
  
  // Execution Statistics
  stats: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    avgExecutionTimeMs: number;
    lastErrorMessage?: string;
    lastErrorAt?: Date;
  };
}

export interface EmailTemplate {
  // Core Template Data
  id: string;
  name: string;
  description: string;
  category: 'inquiry_response' | 'donation_thanks' | 'support_reply' | 'notification';
  
  // Template Content
  subject: string;
  htmlContent: string;
  textContent: string;
  
  // Template Variables
  variables: {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    required: boolean;
    defaultValue?: any;
    description: string;
  }[];
  
  // Template Settings
  isActive: boolean;
  isDefault: boolean;
  
  // Personalization
  personalization: {
    useUserName: boolean;
    useUserRole: boolean;
    useOrganizationName: boolean;
    customGreeting?: string;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastUsedAt?: Date;
  
  // Usage Statistics
  stats: {
    timesUsed: number;
    avgResponseRate?: number;
    lastUsedBy?: string;
  };
}

export interface MCPActivityLog {
  // Core Activity Data
  id: string;
  sessionId: string;
  
  // User Information
  userId: string;
  userRole: string;
  userShortcode: string;
  
  // Interaction Data
  interactionType: 'query' | 'command' | 'message' | 'automation';
  inputText: string;
  outputText: string;
  
  // Command Analysis
  parsedCommand?: {
    action: string;
    target?: string;
    parameters: { [key: string]: any };
  };
  
  // Execution Data
  executionTimeMs: number;
  success: boolean;
  errorMessage?: string;
  
  // Context Data
  context: {
    platform: 'dashboard' | 'mobile' | 'api';
    ipAddress: string;
    userAgent: string;
    location?: {
      country: string;
      region: string;
      city: string;
    };
  };
  
  // Automation Integration
  triggeredAutomation?: {
    workflowId: string;
    workflowName: string;
    executionSuccess: boolean;
  };
  
  // Metadata
  timestamp: Date;
  
  // Analytics Data
  analytics: {
    intentRecognized: boolean;
    confidenceScore?: number;
    fallbackUsed: boolean;
    customResponseUsed: boolean;
  };
}

export interface InquiryTracking {
  // Core Inquiry Data
  id: string;
  
  // Source Information
  source: 'contact_form' | 'email' | 'phone' | 'chat' | 'social_media';
  sourceDetails: {
    formId?: string;
    emailAddress?: string;
    phoneNumber?: string;
    socialPlatform?: string;
  };
  
  // Inquirer Information
  inquirer: {
    name?: string;
    email?: string;
    phone?: string;
    organization?: string;
    role?: string;
    location?: string;
  };
  
  // Inquiry Content
  subject: string;
  content: string;
  category: 'general' | 'donation' | 'partnership' | 'support' | 'shelter_request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Processing Status
  status: 'new' | 'processing' | 'responded' | 'resolved' | 'escalated';
  assignedTo?: string;
  
  // Automation Data
  autoResponseSent: boolean;
  autoResponseTemplateId?: string;
  autoResponseSentAt?: Date;
  
  // Manual Response Data
  manualResponseSent: boolean;
  manualResponseBy?: string;
  manualResponseAt?: Date;
  responseContent?: string;
  
  // Follow-up Tracking
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpBy?: string;
  followUpNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  
  // Analytics
  analytics: {
    responseTimeMinutes?: number;
    resolutionTimeHours?: number;
    satisfactionRating?: number;
    conversionToAction?: boolean;
  };
}

// ========================================
// SERVICE INTERFACES
// ========================================

export interface MessageSendRequest {
  toUserShortcode: string;
  content: string;
  type?: 'direct' | 'mention';
  priority?: 'normal' | 'high' | 'urgent';
  category?: 'general' | 'support' | 'technical' | 'emergency';
  sentVia?: 'dashboard' | 'chatbot';
}

export interface MessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  deliveredAt?: Date;
}

export interface ConversationSummary {
  conversationId: string;
  participantShortcodes: string[];
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  isActive: boolean;
}

export interface MCPMessageCommand {
  originalInput: string;
  parsedCommand: {
    action: 'send' | 'broadcast' | 'query';
    recipient?: string;
    content: string;
    sender: string;
  };
  isValid: boolean;
  errorMessage?: string;
}

// ========================================
// PERMISSION & ACCESS CONTROL
// ========================================

export interface MessagingPermissions {
  canMessageRoles: string[];
  canCreateAutomation: boolean;
  canViewAllMessages: boolean;
  canManageShortcodes: boolean;
  canViewMCPLogs: boolean;
  canAssignInquiries: boolean;
}

export interface AutomationPermissions {
  canCreateWorkflows: boolean;
  canEditAllWorkflows: boolean;
  canEditOwnWorkflows: boolean;
  canDeleteWorkflows: boolean;
  canDeleteOwnWorkflows: boolean;
  canManageTemplates: boolean;
  canViewAnalytics: boolean;
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  error?: string;
}

// ========================================
// UTILITY TYPES
// ========================================

export type UserRole = 'super_admin' | 'platform_admin' | 'shelter_admin';
export type MessageType = 'direct' | 'mention' | 'broadcast' | 'automation';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type MessagePriority = 'normal' | 'high' | 'urgent';
export type AutomationCategory = 'email_automation' | 'mcp_control' | 'notification' | 'data_processing';
export type InquiryStatus = 'new' | 'processing' | 'responded' | 'resolved' | 'escalated';

// ========================================
// CONSTANTS
// ========================================

export const MESSAGE_LIMITS = {
  CONTENT_MAX_LENGTH: 2000,
  ATTACHMENTS_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MESSAGES_PER_HOUR_LIMIT: 100,
  CONVERSATION_PARTICIPANTS_MAX: 10
} as const;

export const AUTOMATION_LIMITS = {
  WORKFLOW_EXECUTION_TIMEOUT_MS: 5 * 60 * 1000, // 5 minutes
  MAX_WORKFLOWS_PER_USER: 50,
  MAX_EXECUTIONS_PER_MINUTE: 10,
  TEMPLATE_MAX_SIZE: 50 * 1024 // 50KB
} as const;

export const SHORTCODE_PATTERN = /^[a-z][a-z0-9_]{2,15}$/i;
export const MENTION_PATTERN = /@([a-z][a-z0-9_]{2,15})/gi;
