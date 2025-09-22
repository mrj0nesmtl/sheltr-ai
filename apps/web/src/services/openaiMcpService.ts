/**
 * OpenAI MCP Integration Service for SHELTR-AI
 * Enhances existing chatbot capabilities with OpenAI Agents SDK
 * Session 16+ - MCP Integration Revolution
 */

import { Agent, run, hostedMcpTool, MCPServerStdio } from '@openai/agents';

export interface SheltrOpenAIMCPConfig {
  userRole: 'super_admin' | 'platform_admin' | 'admin' | 'participant' | 'donor' | 'public';
  userId?: string;
  userName?: string;
  projectPath?: string;
}

export class SheltrOpenAIMCPService {
  private agents: Map<string, Agent> = new Map();
  private mcpServers: MCPServerStdio[] = [];

  /**
   * Initialize SHELTR-specific OpenAI MCP Agents
   */
  async initializeAgents(config: SheltrOpenAIMCPConfig): Promise<void> {
    try {
      console.log('🤖 [OpenAI MCP] Initializing SHELTR-AI agents for role:', config.userRole);

      // 1. SHELTR Analytics Agent (Super Admin & Platform Admin only)
      if (config.userRole === 'super_admin' || config.userRole === 'platform_admin') {
        const analyticsAgent = new Agent({
          name: 'SHELTR Analytics Agent',
          instructions: `You are SHELTR-AI's analytics expert. You can:
            - Analyze platform metrics and donation patterns
            - Generate impact reports for shelters and donors
            - Query user engagement and growth analytics
            - Provide insights on platform performance
            - Access Firebase data and system health metrics
            
            Always provide data-driven insights with specific numbers and trends.
            Focus on actionable recommendations for platform improvement.`,
          tools: [
            hostedMcpTool({
              serverLabel: 'firebase',
              serverUrl: 'firebase://sheltr-ai',
              requireApproval: 'never'
            })
          ]
        });
        this.agents.set('analytics', analyticsAgent);
      }

      // 2. SHELTR Knowledge Base Agent (All authenticated users)
      if (config.userRole !== 'public') {
        const knowledgeAgent = new Agent({
          name: 'SHELTR Knowledge Agent',
          instructions: `You are SHELTR-AI's knowledge base expert. You can:
            - Search through SHELTR documentation and guides
            - Answer questions about platform features and workflows
            - Provide technical support and troubleshooting
            - Explain SHELTR's mission, impact, and technology
            - Guide users through platform functionality
            
            Always cite sources from the knowledge base and provide step-by-step guidance.
            Be helpful and educational while maintaining SHELTR's compassionate mission.`,
          mcpServers: await this.initializeFileSystemMCP(config.projectPath)
        });
        this.agents.set('knowledge', knowledgeAgent);
      }

      // 3. SHELTR Research Agent (Enhanced web search capabilities)
      const researchAgent = new Agent({
        name: 'SHELTR Research Agent', 
        instructions: `You are SHELTR-AI's research specialist. You can:
          - Research homelessness statistics and trends
          - Find information about housing policies and programs
          - Discover funding opportunities and grants
          - Research best practices in homeless services
          - Gather competitive intelligence on similar platforms
          
          Always provide credible sources and current information.
          Focus on actionable insights that can improve SHELTR's impact.`,
        tools: [
          hostedMcpTool({
            serverLabel: 'web-search',
            serverUrl: 'web-search://brave',
            requireApproval: config.userRole === 'public' ? 'always' : 'never'
          })
        ]
      });
      this.agents.set('research', researchAgent);

      // 4. SHELTR Support Agent (General assistance)
      const supportAgent = new Agent({
        name: 'SHELTR Support Agent',
        instructions: `You are SHELTR-AI's support specialist. You can:
          - Help users navigate the platform
          - Troubleshoot technical issues
          - Explain SHELTR's features and benefits
          - Guide donation and participation processes
          - Provide general platform assistance
          
          Be patient, helpful, and always prioritize user success.
          Escalate complex issues to appropriate administrators.`,
        tools: []
      });
      this.agents.set('support', supportAgent);

      console.log(`✅ [OpenAI MCP] Initialized ${this.agents.size} agents for ${config.userRole}`);
    } catch (error) {
      console.error('❌ [OpenAI MCP] Error initializing agents:', error);
      throw error;
    }
  }

  /**
   * Initialize filesystem MCP server for knowledge base access
   */
  private async initializeFileSystemMCP(projectPath?: string): Promise<MCPServerStdio[]> {
    if (!projectPath) {
      console.warn('⚠️ [OpenAI MCP] No project path provided, skipping filesystem MCP');
      return [];
    }

    try {
      const fsServer = new MCPServerStdio({
        name: 'SHELTR Filesystem Server',
        fullCommand: `npx -y @modelcontextprotocol/server-filesystem ${projectPath}/docs`,
        cacheToolsList: true
      });

      await fsServer.connect();
      this.mcpServers.push(fsServer);
      
      console.log('✅ [OpenAI MCP] Filesystem server connected');
      return [fsServer];
    } catch (error) {
      console.error('❌ [OpenAI MCP] Error connecting filesystem server:', error);
      return [];
    }
  }

  /**
   * Execute a query using the appropriate agent
   */
  async executeQuery(
    agentType: 'analytics' | 'knowledge' | 'research' | 'support',
    query: string,
    config: SheltrOpenAIMCPConfig
  ): Promise<string> {
    try {
      const agent = this.agents.get(agentType);
      if (!agent) {
        throw new Error(`Agent '${agentType}' not available for role '${config.userRole}'`);
      }

      console.log(`🤖 [OpenAI MCP] Executing ${agentType} query:`, query.substring(0, 100) + '...');

      const result = await run(agent, query);
      
      console.log(`✅ [OpenAI MCP] Query completed successfully`);
      return result.finalOutput || 'No response generated';
    } catch (error) {
      console.error(`❌ [OpenAI MCP] Error executing ${agentType} query:`, error);
      throw error;
    }
  }

  /**
   * Execute a streaming query for real-time responses
   */
  async *executeStreamingQuery(
    agentType: 'analytics' | 'knowledge' | 'research' | 'support',
    query: string,
    config: SheltrOpenAIMCPConfig
  ): AsyncGenerator<string, void, unknown> {
    try {
      const agent = this.agents.get(agentType);
      if (!agent) {
        throw new Error(`Agent '${agentType}' not available for role '${config.userRole}'`);
      }

      console.log(`🤖 [OpenAI MCP] Starting streaming ${agentType} query:`, query.substring(0, 100) + '...');

      const result = await run(agent, query, { stream: true });

      for await (const event of result) {
        if (
          event.type === 'raw_model_stream_event' &&
          event.data.type === 'model' &&
          event.data.event.type === 'response.output_text.delta'
        ) {
          yield event.data.event.delta || '';
        }
      }

      console.log(`✅ [OpenAI MCP] Streaming query completed`);
    } catch (error) {
      console.error(`❌ [OpenAI MCP] Error in streaming ${agentType} query:`, error);
      throw error;
    }
  }

  /**
   * Get available agents for a user role
   */
  getAvailableAgents(userRole: string): string[] {
    const agents: string[] = ['support', 'research'];

    if (userRole !== 'public') {
      agents.push('knowledge');
    }

    if (userRole === 'super_admin' || userRole === 'platform_admin') {
      agents.push('analytics');
    }

    return agents;
  }

  /**
   * Cleanup MCP servers
   */
  async cleanup(): Promise<void> {
    try {
      console.log('🧹 [OpenAI MCP] Cleaning up MCP servers...');
      
      for (const server of this.mcpServers) {
        await server.close();
      }
      
      this.mcpServers.clear();
      this.agents.clear();
      
      console.log('✅ [OpenAI MCP] Cleanup completed');
    } catch (error) {
      console.error('❌ [OpenAI MCP] Error during cleanup:', error);
    }
  }

  /**
   * Health check for MCP services
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    agents: number;
    servers: number;
    details: string[];
  }> {
    const details: string[] = [];
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    try {
      details.push(`Agents initialized: ${this.agents.size}`);
      details.push(`MCP servers connected: ${this.mcpServers.length}`);

      if (this.agents.size === 0) {
        status = 'unhealthy';
        details.push('No agents available');
      } else if (this.mcpServers.length === 0) {
        status = 'degraded';
        details.push('No MCP servers connected (limited functionality)');
      }

      return {
        status,
        agents: this.agents.size,
        servers: this.mcpServers.length,
        details
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        agents: 0,
        servers: 0,
        details: [`Health check failed: ${error}`]
      };
    }
  }
}

// Singleton instance for global access
export const sheltrOpenAIMCP = new SheltrOpenAIMCPService();
