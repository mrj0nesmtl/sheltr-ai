# Automation Dashboard System - Technical Documentation

**Version**: 1.0  
**Created**: September 26, 2025  
**Status**: Implementation Phase  

---

## 🎯 **System Overview**

The SHELTR Automation Dashboard provides Super Admins and Platform Admins with centralized control over MCP capabilities, automated workflows, and system responses. The system focuses on intelligent email reply automation for inquiries and comprehensive MCP monitoring.

### **Core Features**
- **Email Reply Automation** (Auto-respond to contact inquiries)
- **MCP Control Center** (Monitor and configure chatbot behavior)
- **Workflow Management** (Create and manage automation rules)
- **Analytics Dashboard** (Track automation performance)
- **Admin-Only Access** (Super Admin + Platform Admin roles)

---

## 🗄️ **Database Schema**

### **1. Automation Workflows Collection** (`automation_workflows`)

```typescript
interface AutomationWorkflow {
  // Core Workflow Data
  id: string;                    // Unique workflow identifier
  name: string;                  // Human-readable workflow name
  description: string;           // Workflow description
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
        time: string;            // HH:MM format
        timezone: string;
        daysOfWeek?: number[];   // 0-6 (Sunday-Saturday)
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
      recipients: string[];       // User shortcodes (@joel, @morgan)
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
  priority: number;              // Execution priority (1-10)
  maxExecutionsPerHour: number;  // Rate limiting
  retryOnFailure: boolean;
  maxRetries: number;
  
  // Access Control
  createdBy: string;             // User ID who created workflow
  allowedRoles: string[];        // Roles that can modify this workflow
  
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
```

### **2. Email Templates Collection** (`email_templates`)

```typescript
interface EmailTemplate {
  // Core Template Data
  id: string;                    // Unique template identifier
  name: string;                  // Template name
  description: string;           // Template description
  category: 'inquiry_response' | 'donation_thanks' | 'support_reply' | 'notification';
  
  // Template Content
  subject: string;               // Email subject line
  htmlContent: string;           // HTML email content
  textContent: string;           // Plain text fallback
  
  // Template Variables
  variables: {
    name: string;                // Variable name (e.g., "user_name")
    type: 'string' | 'number' | 'date' | 'boolean';
    required: boolean;
    defaultValue?: any;
    description: string;
  }[];
  
  // Template Settings
  isActive: boolean;
  isDefault: boolean;            // Default template for category
  
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
    avgResponseRate?: number;    // If tracking email opens/clicks
    lastUsedBy?: string;
  };
}
```

### **3. MCP Activity Log Collection** (`mcp_activity_log`)

```typescript
interface MCPActivityLog {
  // Core Activity Data
  id: string;                    // Unique log entry identifier
  sessionId: string;             // MCP session identifier
  
  // User Information
  userId: string;                // User who interacted with MCP
  userRole: string;              // User's role
  userShortcode: string;         // User's @shortcode
  
  // Interaction Data
  interactionType: 'query' | 'command' | 'message' | 'automation';
  inputText: string;             // User's input to MCP
  outputText: string;            // MCP's response
  
  // Command Analysis
  parsedCommand?: {
    action: string;              // Extracted action (send, query, etc.)
    target?: string;             // Target user or system
    parameters: { [key: string]: any };
  };
  
  // Execution Data
  executionTimeMs: number;       // Time taken to process
  success: boolean;              // Whether interaction succeeded
  errorMessage?: string;         // Error details if failed
  
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
    confidenceScore?: number;     // 0-1 confidence in intent recognition
    fallbackUsed: boolean;
    customResponseUsed: boolean;
  };
}
```

### **4. Inquiry Tracking Collection** (`inquiry_tracking`)

```typescript
interface InquiryTracking {
  // Core Inquiry Data
  id: string;                    // Unique inquiry identifier
  
  // Source Information
  source: 'contact_form' | 'email' | 'phone' | 'chat' | 'social_media';
  sourceDetails: {
    formId?: string;             // If from web form
    emailAddress?: string;       // If from email
    phoneNumber?: string;        // If from phone
    socialPlatform?: string;     // If from social media
  };
  
  // Inquirer Information
  inquirer: {
    name?: string;
    email?: string;
    phone?: string;
    organization?: string;
    role?: string;               // Their role/title
    location?: string;
  };
  
  // Inquiry Content
  subject: string;               // Inquiry subject/title
  content: string;               // Full inquiry text
  category: 'general' | 'donation' | 'partnership' | 'support' | 'shelter_request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Processing Status
  status: 'new' | 'processing' | 'responded' | 'resolved' | 'escalated';
  assignedTo?: string;           // Admin user ID assigned to handle
  
  // Automation Data
  autoResponseSent: boolean;
  autoResponseTemplateId?: string;
  autoResponseSentAt?: Date;
  
  // Manual Response Data
  manualResponseSent: boolean;
  manualResponseBy?: string;     // Admin who responded
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
    satisfactionRating?: number; // 1-5 if feedback provided
    conversionToAction?: boolean; // Did they donate/partner/etc?
  };
}
```

---

## 🔗 **Database Relationships**

### **Primary Relationships**
```
users (1) ←→ (∞) automation_workflows (creator)
automation_workflows (1) ←→ (∞) email_templates
users (1) ←→ (∞) mcp_activity_log
automation_workflows (1) ←→ (∞) mcp_activity_log (triggered)
inquiry_tracking (1) ←→ (1) email_templates (auto-response)
users (1) ←→ (∞) inquiry_tracking (assigned admin)
```

### **Index Strategy**
```sql
-- Performance Indexes
CREATE INDEX idx_workflows_active ON automation_workflows(isActive, priority);
CREATE INDEX idx_workflows_trigger ON automation_workflows(trigger.type, isActive);
CREATE INDEX idx_mcp_log_user ON mcp_activity_log(userId, timestamp DESC);
CREATE INDEX idx_mcp_log_session ON mcp_activity_log(sessionId, timestamp);
CREATE INDEX idx_inquiries_status ON inquiry_tracking(status, createdAt DESC);
CREATE INDEX idx_inquiries_assigned ON inquiry_tracking(assignedTo, status);
CREATE INDEX idx_templates_category ON email_templates(category, isActive);
```

---

## 🛡️ **Security & Access Control**

### **Role-Based Permissions**
```typescript
const AUTOMATION_PERMISSIONS = {
  super_admin: {
    canCreateWorkflows: true,
    canEditAllWorkflows: true,
    canDeleteWorkflows: true,
    canViewMCPLogs: true,
    canManageTemplates: true,
    canAssignInquiries: true,
    canViewAnalytics: true
  },
  platform_admin: {
    canCreateWorkflows: true,
    canEditOwnWorkflows: true,
    canDeleteOwnWorkflows: false,
    canViewMCPLogs: true,
    canManageTemplates: true,
    canAssignInquiries: true,
    canViewAnalytics: true
  },
  shelter_admin: {
    canCreateWorkflows: false,
    canEditOwnWorkflows: false,
    canDeleteOwnWorkflows: false,
    canViewMCPLogs: false,
    canManageTemplates: false,
    canAssignInquiries: false,
    canViewAnalytics: false
  }
};
```

### **Data Protection**
- **Audit Trail**: All automation actions logged with timestamps
- **Rate Limiting**: Prevent automation abuse with execution limits
- **Validation**: Input sanitization for all automation parameters
- **Encryption**: Sensitive data encrypted at rest and in transit

---

## 📊 **Performance & Scalability**

### **Optimization Strategy**
- **Background Processing**: Heavy automation tasks run asynchronously
- **Queue Management**: Automation jobs queued and processed in order
- **Caching**: Frequently used templates and workflows cached
- **Monitoring**: Real-time performance metrics and alerting

### **Resource Limits**
- **Workflow Execution**: Maximum 5 minutes per workflow
- **Email Templates**: Maximum 50KB per template
- **MCP Logs**: Auto-archived after 90 days
- **Concurrent Executions**: Maximum 10 workflows per minute per user

---

## 🔄 **Integration Architecture**

### **Email Integration**
```typescript
interface EmailIntegration {
  provider: 'sendgrid' | 'mailgun' | 'ses' | 'smtp';
  configuration: {
    apiKey?: string;
    smtpHost?: string;
    smtpPort?: number;
    fromAddress: string;
    fromName: string;
  };
  templates: {
    inquiryResponse: string;
    donationThank: string;
    supportReply: string;
  };
}
```

### **MCP Integration Points**
- **Command Processing**: Parse and execute MCP automation commands
- **Response Generation**: Generate contextual responses based on user role
- **Activity Logging**: Track all MCP interactions for analytics
- **Workflow Triggers**: Execute automation based on MCP commands

### **External Service Hooks**
- **CRM Integration**: Sync inquiries with external CRM systems
- **Analytics Platforms**: Send automation metrics to analytics tools
- **Notification Services**: Push notifications for urgent inquiries
- **Backup Systems**: Automated backup of critical automation data

---

## 🧪 **Testing & Quality Assurance**

### **Automated Testing**
- **Workflow Execution**: Test all automation workflows end-to-end
- **Email Delivery**: Verify email templates and delivery
- **MCP Commands**: Test chatbot command parsing and execution
- **Performance**: Load testing for concurrent automation execution

### **Monitoring & Alerting**
- **Execution Failures**: Alert admins when workflows fail
- **Performance Degradation**: Monitor execution times and resource usage
- **Security Events**: Alert on suspicious automation activity
- **System Health**: Overall automation system health dashboard

---

*This automation system provides intelligent, scalable, and secure workflow management that enhances SHELTR's operational efficiency while maintaining strict access control and comprehensive monitoring.*
