# Internal Messaging System - Technical Documentation

**Version**: 1.0  
**Created**: September 26, 2025  
**Status**: Implementation Phase  

---

## 🎯 **System Overview**

The SHELTR Internal Messaging System enables real-time communication between administrators through both dashboard interface and MCP chatbot integration. The system supports role-based access, user shortcodes (@mentions), and automated message workflows.

### **Core Features**
- **Admin-to-Admin Messaging** (Super Admin, Platform Admin, Shelter Admin)
- **User Shortcode System** (@joel, @morgan, @alex)
- **Dual Interface** (Dashboard UI + MCP Chatbot commands)
- **Real-time Notifications** (WebSocket-based)
- **Message Threading** (Conversation history)
- **Automation Integration** (Auto-replies, notifications)

---

## 🗄️ **Database Schema**

### **1. Internal Messages Collection** (`internal_messages`)

```typescript
interface InternalMessage {
  // Core Message Data
  id: string;                    // Unique message identifier
  conversationId: string;        // Thread/conversation grouping
  
  // Sender Information
  fromUserId: string;            // Sender's user ID
  fromUserShortcode: string;     // Sender's @shortcode (e.g., @joel)
  fromUserDisplayName: string;   // Sender's display name
  fromUserRole: 'super_admin' | 'platform_admin' | 'shelter_admin';
  
  // Recipient Information
  toUserId: string;              // Recipient's user ID
  toUserShortcode: string;       // Recipient's @shortcode (e.g., @morgan)
  toUserDisplayName: string;     // Recipient's display name
  toUserRole: 'super_admin' | 'platform_admin' | 'shelter_admin';
  
  // Message Content
  content: string;               // Message text content
  originalContent?: string;      // Raw content before processing (for MCP commands)
  
  // Message Classification
  type: 'direct' | 'mention' | 'broadcast' | 'automation';
  priority: 'normal' | 'high' | 'urgent';
  category?: 'general' | 'support' | 'technical' | 'emergency';
  
  // Message Status
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentVia: 'dashboard' | 'chatbot' | 'automation';
  
  // Timestamps
  createdAt: Date;               // Message sent time
  deliveredAt?: Date;            // Message delivered time
  readAt?: Date;                 // Message read time
  
  // Metadata
  metadata: {
    originalCommand?: string;     // MCP command that triggered this message
    automationRuleId?: string;    // If sent by automation
    replyToMessageId?: string;    // If replying to another message
    attachments?: string[];       // File attachments (future feature)
    editHistory?: {               // Message edit tracking
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
```

### **2. User Shortcodes Collection** (`user_shortcodes`)

```typescript
interface UserShortcode {
  // Core Shortcode Data
  id: string;                    // Unique shortcode record ID
  userId: string;                // Reference to users collection
  shortcode: string;             // Shortcode without @ (e.g., "joel")
  
  // User Information
  displayName: string;           // User's display name
  email: string;                 // User's email (for lookup)
  role: 'super_admin' | 'platform_admin' | 'shelter_admin';
  
  // Shortcode Settings
  isActive: boolean;             // Can receive messages
  isPublic: boolean;             // Visible in autocomplete
  customShortcode?: string;      // User-defined shortcode override
  
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
  lastUsedAt?: Date;             // Last time shortcode was used
  
  // Usage Statistics
  stats: {
    messagesReceived: number;
    messagesSent: number;
    mentionsReceived: number;
    lastActiveAt?: Date;
  };
}
```

### **3. Message Conversations Collection** (`message_conversations`)

```typescript
interface MessageConversation {
  // Core Conversation Data
  id: string;                    // Unique conversation identifier
  title?: string;                // Optional conversation title
  
  // Participants
  participantIds: string[];      // Array of user IDs in conversation
  participantShortcodes: string[]; // Array of shortcodes (@joel, @morgan)
  
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
```

### **4. Message Automation Rules Collection** (`message_automation_rules`)

```typescript
interface MessageAutomationRule {
  // Core Rule Data
  id: string;                    // Unique rule identifier
  name: string;                  // Human-readable rule name
  description: string;           // Rule description
  
  // Trigger Conditions
  triggers: {
    type: 'inquiry_received' | 'user_mention' | 'scheduled' | 'event_based';
    conditions: {
      keywords?: string[];        // Trigger on specific keywords
      senderRole?: string[];      // Trigger for specific user roles
      urgencyLevel?: 'low' | 'medium' | 'high';
      timeRange?: {               // Time-based triggers
        start: string;            // HH:MM format
        end: string;
        timezone: string;
      };
      eventType?: string;         // Custom event triggers
    };
  };
  
  // Actions to Execute
  actions: {
    sendMessage: boolean;
    messageTemplate: string;
    notifyUsers: string[];        // Array of user IDs or shortcodes
    escalateAfterMinutes?: number;
    createTicket?: boolean;
    logToAnalytics: boolean;
  };
  
  // Rule Configuration
  isActive: boolean;
  priority: number;              // Rule execution priority (1-10)
  maxExecutionsPerHour?: number; // Rate limiting
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastTriggeredAt?: Date;
  
  // Statistics
  stats: {
    timesTriggered: number;
    successfulExecutions: number;
    failedExecutions: number;
    avgExecutionTimeMs: number;
  };
}
```

---

## 🔗 **Database Relationships**

### **Primary Relationships**
```
users (1) ←→ (1) user_shortcodes
users (1) ←→ (∞) internal_messages (sender)
users (1) ←→ (∞) internal_messages (recipient)
message_conversations (1) ←→ (∞) internal_messages
message_automation_rules (1) ←→ (∞) internal_messages
```

### **Index Strategy**
```sql
-- Performance Indexes
CREATE INDEX idx_messages_conversation ON internal_messages(conversationId, createdAt DESC);
CREATE INDEX idx_messages_recipient ON internal_messages(toUserId, status, createdAt DESC);
CREATE INDEX idx_messages_sender ON internal_messages(fromUserId, createdAt DESC);
CREATE INDEX idx_shortcodes_lookup ON user_shortcodes(shortcode, isActive);
CREATE INDEX idx_conversations_participants ON message_conversations USING GIN(participantIds);
CREATE INDEX idx_automation_triggers ON message_automation_rules(isActive, priority);
```

---

## 🛡️ **Security & Privacy**

### **Data Protection**
- **No Email Exposure**: File names use shortcodes, not email addresses
- **Role-Based Access**: Messages only between authorized admin roles
- **Audit Trail**: Complete message history with timestamps
- **Soft Deletes**: Messages marked as deleted, not permanently removed

### **Access Control**
```typescript
// Role-based messaging permissions
const MESSAGING_PERMISSIONS = {
  super_admin: {
    canMessageRoles: ['super_admin', 'platform_admin', 'shelter_admin'],
    canCreateAutomation: true,
    canViewAllMessages: true,
    canManageShortcodes: true
  },
  platform_admin: {
    canMessageRoles: ['super_admin', 'platform_admin', 'shelter_admin'],
    canCreateAutomation: true,
    canViewAllMessages: false,
    canManageShortcodes: false
  },
  shelter_admin: {
    canMessageRoles: ['super_admin', 'platform_admin', 'shelter_admin'],
    canCreateAutomation: false,
    canViewAllMessages: false,
    canManageShortcodes: false
  }
};
```

---

## 📊 **Performance Considerations**

### **Scalability Design**
- **Pagination**: Messages loaded in chunks (20-50 per page)
- **Real-time Updates**: WebSocket connections for instant delivery
- **Caching**: Recent conversations cached in Redis/memory
- **Compression**: Message content compressed for storage

### **Message Limits**
- **Content Length**: 2000 characters per message
- **Attachments**: 10MB per message (future feature)
- **Rate Limiting**: 100 messages per user per hour
- **Retention**: Messages auto-archived after 1 year

---

## 🔄 **Integration Points**

### **MCP Chatbot Integration**
```typescript
// Chatbot command parsing
interface MCPMessageCommand {
  originalInput: string;         // "@joel Can you review metrics?"
  parsedCommand: {
    action: 'send' | 'broadcast';
    recipient: string;           // "joel"
    content: string;             // "Can you review metrics?"
    sender: string;              // Current user shortcode
  };
}
```

### **External System Hooks**
- **Email Notifications**: Send email alerts for urgent messages
- **SMS Integration**: SMS alerts for emergency broadcasts
- **Analytics Tracking**: Message volume and response time metrics
- **Audit Logging**: Complete message audit trail

---

## 🧪 **Testing Strategy**

### **Unit Tests**
- Message creation and validation
- Shortcode resolution and mapping
- Automation rule execution
- Permission and access control

### **Integration Tests**
- Dashboard ↔ Database messaging flow
- MCP chatbot ↔ Database integration
- Real-time WebSocket message delivery
- Cross-role message permissions

### **Load Testing**
- Concurrent message sending
- WebSocket connection limits
- Database query performance
- Automation rule execution under load

---

*This schema provides the foundation for a scalable, secure, and feature-rich internal messaging system that integrates seamlessly with SHELTR's existing architecture.*
