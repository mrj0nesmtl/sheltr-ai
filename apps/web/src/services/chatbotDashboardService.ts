import { getAuth } from 'firebase/auth';

// Interfaces for Chatbot Dashboard
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'link' | 'file';
    url: string;
    name?: string;
  }[];
  metadata?: {
    model?: string;
    tokens_used?: number;
    response_time?: number;
    context_used?: boolean;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  agent_type: string;
  model: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message?: string;
  status: 'active' | 'archived';
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model: string;
  knowledge_bases: string[];
  temperature: number;
  max_tokens: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface ChatAnalytics {
  total_sessions: number;
  total_messages: number;
  active_sessions: number;
  agent_stats: Record<string, { sessions: number; messages: number }>;
  last_activity?: string;
}

export interface ChatSessionsResponse {
  success: boolean;
  data: {
    sessions: ChatSession[];
  };
}

export interface ChatMessagesResponse {
  success: boolean;
  data: {
    messages: ChatMessage[];
  };
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    message: string;
    metadata: {
      model?: string;
      tokens_used?: number;
      response_time?: number;
      context_used?: boolean;
    };
  };
}

export interface AgentConfigurationsResponse {
  success: boolean;
  data: {
    agents: AgentConfig[];
  };
}

export interface ChatAnalyticsResponse {
  success: boolean;
  data: ChatAnalytics;
}

class ChatbotDashboardService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private async getAuthToken(): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const token = await user.getIdToken();
    return token;
  }

  /**
   * Get all chat sessions for the current user
   */
  async getChatSessions(): Promise<ChatSessionsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chatbot-dashboard/sessions`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chat sessions: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  }

  /**
   * Create a new chat session
   */
  async createChatSession(title: string, agent_type: string, model: string): Promise<{ success: boolean; data: { session_id: string; message: string } }> {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('agent_type', agent_type);
      formData.append('model', model);

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/chatbot-dashboard/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create chat session: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  /**
   * Get all messages for a chat session
   */
  async getChatMessages(sessionId: string): Promise<ChatMessagesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chatbot-dashboard/sessions/${sessionId}/messages`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chat messages: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(sessionId: string, message: string, agentConfig: AgentConfig): Promise<SendMessageResponse> {
    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('agent_config', JSON.stringify(agentConfig));

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/chatbot-dashboard/sessions/${sessionId}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get all agent configurations
   */
  async getAgentConfigurations(): Promise<AgentConfigurationsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chatbot-dashboard/agents`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch agent configurations: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching agent configurations:', error);
      throw error;
    }
  }

  /**
   * Save or update agent configuration
   */
  async saveAgentConfiguration(agentData: AgentConfig): Promise<{ success: boolean; data: { agent_id: string; message: string } }> {
    try {
      const formData = new FormData();
      formData.append('agent_data', JSON.stringify(agentData));

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/chatbot-dashboard/agents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to save agent configuration: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving agent configuration:', error);
      throw error;
    }
  }

  /**
   * Delete a chat session
   */
  async deleteChatSession(sessionId: string): Promise<{ success: boolean; data: { message: string } }> {
    try {
      const response = await fetch(`${this.baseUrl}/chatbot-dashboard/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete chat session: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting chat session:', error);
      throw error;
    }
  }

  /**
   * Update chat session title
   */
  async updateSessionTitle(sessionId: string, title: string): Promise<{ success: boolean; data: { message: string } }> {
    try {
      const formData = new FormData();
      formData.append('title', title);

      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/chatbot-dashboard/sessions/${sessionId}/title`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update session title: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating session title:', error);
      throw error;
    }
  }

  /**
   * Get chat analytics
   */
  async getChatAnalytics(): Promise<ChatAnalyticsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chatbot-dashboard/analytics`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chat analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chat analytics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const chatbotDashboardService = new ChatbotDashboardService();
