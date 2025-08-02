/**
 * Chatbot Service for SHELTR-AI Frontend
 * Connects to the backend chatbot API for AI-powered support
 */

import { auth } from '@/lib/firebase';

interface ChatMessage {
  message: string;
  conversation_id?: string;
  context?: Record<string, any>;
}

interface ChatResponse {
  success: boolean;
  response: string;
  actions: Array<{
    type: string;
    label: string;
    data: Record<string, any>;
  }>;
  follow_up?: string;
  escalation_triggered: boolean;
  agent_used?: string;
  conversation_id: string;
  timestamp: string;
}

interface ConversationHistory {
  success: boolean;
  conversation_id: string;
  messages: Array<{
    timestamp: string;
    user_message: string;
    bot_response: string;
    intent: {
      category: string;
      subcategory: string;
      confidence: number;
    };
    agent: string;
    escalation: boolean;
  }>;
  user_role: string;
  created_at: string;
}

interface Agent {
  name: string;
  description: string;
  capabilities: string[];
  available_to: string[];
}

class ChatbotService {
  private baseUrl: string;
  private websocket: WebSocket | null = null;
  private messageHandlers: Array<(message: any) => void> = [];

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.sheltr.ai' 
      : 'http://localhost:8000';
  }

  private async getAuthToken(): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return await currentUser.getIdToken();
  }

  /**
   * Send a message to the chatbot
   */
  async sendMessage(chatMessage: ChatMessage): Promise<ChatResponse> {
    try {
      const token = await this.getAuthToken();
      
      // Temporary: Use test endpoint for local development (bypasses auth)
      const response = await fetch(`${this.baseUrl}/chatbot/test-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatMessage),
      });

      if (!response.ok) {
        throw new Error(`Chatbot API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      // Return fallback response
      return this.getFallbackResponse(chatMessage.message);
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string): Promise<ConversationHistory> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}/chatbot/conversation/${conversationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Chatbot API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  }

  /**
   * Get available agents
   */
  async getAvailableAgents(): Promise<Record<string, Agent>> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}/chatbot/agents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Chatbot API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.agents;
    } catch (error) {
      console.error('Error getting available agents:', error);
      return {};
    }
  }

  /**
   * Submit feedback about a conversation
   */
  async submitFeedback(
    conversationId: string, 
    rating: number, 
    feedback?: string
  ): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}/chatbot/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          rating,
          feedback,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  }

  /**
   * Check chatbot system health
   */
  async checkHealth(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/chatbot/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chatbot health check failed:', error);
      return { success: false, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Connect to WebSocket for real-time chat
   */
  async connectWebSocket(userId: string, userRole: string): Promise<void> {
    try {
      const wsUrl = this.baseUrl.replace('http', 'ws');
      this.websocket = new WebSocket(`${wsUrl}/chatbot/ws/${userId}`);

      this.websocket.onopen = () => {
        console.log('WebSocket connected to chatbot');
      };

      this.websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(message));
      };

      this.websocket.onclose = () => {
        console.log('WebSocket disconnected from chatbot');
        this.websocket = null;
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  /**
   * Send message via WebSocket
   */
  sendWebSocketMessage(message: string, userRole: string): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        message,
        user_role: userRole,
        timestamp: new Date().toISOString()
      }));
    } else {
      console.error('WebSocket not connected');
    }
  }

  /**
   * Add message handler for WebSocket responses
   */
  onMessage(handler: (message: any) => void): void {
    this.messageHandlers.push(handler);
  }

  /**
   * Remove message handler
   */
  offMessage(handler: (message: any) => void): void {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  /**
   * Get quick action suggestions based on user role
   */
  getQuickActions(userRole: string): Array<{ label: string; message: string }> {
    const actions = {
      participant: [
        { label: "Book a Meal", message: "I want to book a meal service" },
        { label: "Find Shelter", message: "I need a place to stay tonight" },
        { label: "Available Services", message: "What services are available to me?" },
        { label: "My Profile", message: "Help me update my profile" },
        { label: "Get Support", message: "I need help with something" }
      ],
      donor: [
        { label: "Make Donation", message: "I want to make a donation" },
        { label: "View Impact", message: "Show me my donation impact" },
        { label: "Tax Documents", message: "I need my tax receipts" },
        { label: "Monthly Giving", message: "Set up recurring donations" },
        { label: "Find Shelters", message: "Which shelters can I support?" }
      ],
      admin: [
        { label: "Manage Participants", message: "Help with participant management" },
        { label: "View Reports", message: "Generate shelter reports" },
        { label: "Resource Management", message: "Help with resource allocation" },
        { label: "Service Scheduling", message: "Schedule shelter services" },
        { label: "System Support", message: "I need technical assistance" }
      ],
      super_admin: [
        { label: "Platform Overview", message: "Show me platform analytics" },
        { label: "User Management", message: "Help with user administration" },
        { label: "System Health", message: "Check system status" },
        { label: "Generate Reports", message: "Create platform reports" },
        { label: "Configuration", message: "Help with system configuration" }
      ]
    };

    return actions[userRole as keyof typeof actions] || actions.participant;
  }

  /**
   * Fallback response when API is unavailable
   */
  private getFallbackResponse(message: string): ChatResponse {
    return {
      success: false,
      response: "I'm sorry, I'm currently experiencing technical difficulties. Please try again in a moment or contact support if the issue persists.",
      actions: [
        {
          type: "contact_support",
          label: "Contact Support",
          data: { action: "support" }
        },
        {
          type: "try_again",
          label: "Try Again",
          data: { action: "retry" }
        }
      ],
      escalation_triggered: false,
      agent_used: "fallback",
      conversation_id: `fallback_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get conversation starter based on user role
   */
  getConversationStarter(userRole: string): string {
    const starters = {
      participant: "Hi! I'm here to help you find services, book appointments, and navigate resources. What can I help you with today?",
      donor: "Hello! I can help you with donations, track your impact, and provide information about the shelters you're supporting. How can I assist you?",
      admin: "Hi! I'm here to help with shelter operations, participant management, and administrative tasks. What do you need assistance with?",
      super_admin: "Hello! I can help with platform administration, analytics, system management, and user oversight. What would you like to know?"
    };

    return starters[userRole as keyof typeof starters] || starters.participant;
  }

  /**
   * Parse action from chat response and execute it
   */
  executeAction(action: { type: string; label: string; data: Record<string, any> }): void {
    switch (action.type) {
      case 'emergency_call':
        window.open(`tel:${action.data.phone}`, '_self');
        break;
      
      case 'view_services':
        // Navigate to services page
        window.location.href = '/dashboard/participant/services';
        break;
      
      case 'make_donation':
        // Navigate to donations page
        window.location.href = '/dashboard/donor/donations';
        break;
      
      case 'view_impact':
        // Navigate to impact page
        window.location.href = '/dashboard/donor/impact';
        break;
      
      case 'manage_participants':
        // Navigate to participants management
        window.location.href = '/dashboard/shelter-admin/participants';
        break;
      
      case 'view_profile':
        // Navigate to profile page
        window.location.href = '/dashboard/participant/profile';
        break;
      
      case 'contact_support':
        // Open support contact (could be email or phone)
        window.open('mailto:support@sheltr.ai', '_blank');
        break;
      
      default:
        console.log('Unknown action type:', action.type);
    }
  }
}

// Export singleton instance
export const chatbotService = new ChatbotService();
export default chatbotService; 