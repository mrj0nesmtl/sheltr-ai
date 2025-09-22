import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

interface AuthenticatedChatRequest {
  message: string;
  sessionId: string;
  userRole: string;
  context?: {
    page?: string;
    userAgent?: string;
    timestamp?: string;
    embedded?: boolean;
    authenticated?: boolean;
    userId?: string;
    email?: string;
  };
}

export async function POST(request: NextRequest) {
  let message = '';
  let sessionId = '';
  let userRole = 'authenticated';
  let context: AuthenticatedChatRequest['context'] = {};
  
  try {
    const body: AuthenticatedChatRequest = await request.json();
    message = body.message;
    sessionId = body.sessionId;
    userRole = body.userRole;
    context = body.context || {};

    // Validate input
    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Enhanced context for authenticated users
    const enhancedContext = {
      session_type: 'authenticated',
      anonymous: false,
      page: context?.page || '/',
      user_agent: context?.userAgent || 'unknown',
      embedded: context?.embedded || false,
      user_id: context?.userId,
      email: context?.email,
      timestamp: context?.timestamp || new Date().toISOString(),
      mcp_enabled: true,
      role_permissions: getRolePermissions(userRole)
    };

    // Call backend API using public endpoint but with enhanced authenticated context
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/api/v1/chatbot/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        user_id: sessionId,
        user_role: userRole, // This will tell the backend this is an authenticated user
        conversation_context: enhancedContext
      }),
    });

    if (!response.ok) {
      // Fallback for when backend is not available
      if (response.status >= 500) {
        return NextResponse.json({
          success: true,
          response: getOfflineResponse(message, userRole),
          mcp_enabled: false,
          offline_mode: true,
          timestamp: new Date().toISOString()
        });
      }
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      response: data.response || data.message,
      actions: data.actions || [],
      follow_up: data.follow_up,
      conversation_id: data.conversation_id,
      mcp_tool_used: data.mcp_tool_used,
      role_restricted: data.role_restricted || false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Authenticated chatbot API error:', error);
    
    // Provide helpful fallback response
    return NextResponse.json({
      success: false,
      response: getErrorResponse(userRole),
      error: 'Service temporarily unavailable',
      mcp_enabled: false,
      role_restricted: false,
      timestamp: new Date().toISOString()
    }, { status: 200 }); // Return 200 to avoid frontend error handling
  }
}

function getRolePermissions(userRole: string): string[] {
  const permissions = {
    super_admin: ['all_mcp_tools', 'analytics', 'system_management', 'shelter_operations', 'emergency_protocols'],
    platform_admin: ['analytics', 'user_management', 'shelter_operations', 'knowledge_base'],
    admin: ['shelter_operations', 'participant_management', 'capacity_updates'],
    participant: ['status_updates', 'qr_generation', 'service_access'],
    donor: ['donation_tracking', 'impact_reports', 'receipt_generation'],
    authenticated: ['basic_queries', 'knowledge_base']
  };
  
  return permissions[userRole as keyof typeof permissions] || permissions.authenticated;
}

function getOfflineResponse(message: string, userRole: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Role-specific offline responses
  if (userRole === 'super_admin' || userRole === 'platform_admin') {
    if (lowerMessage.includes('analytics') || lowerMessage.includes('report')) {
      return "🔧 I'd normally use the `generate_impact_report` MCP tool to get you live analytics, but I'm currently offline. When connected, I can provide real-time donation analytics, user metrics, and platform performance data.";
    }
    if (lowerMessage.includes('status') || lowerMessage.includes('platform')) {
      return "🔧 I'd use the `query_platform_data` MCP tool to check system status, but I'm offline. When connected, I can provide live platform health, user counts, and system metrics.";
    }
  }
  
  if (userRole === 'admin') {
    if (lowerMessage.includes('capacity') || lowerMessage.includes('shelter')) {
      return "🔧 I'd normally use the `update_shelter_capacity` MCP tool to check your shelter's current capacity, but I'm offline. When connected, I can provide real-time bed availability and occupancy data.";
    }
  }
  
  // Generic helpful response
  return `I'm currently offline, so I can't access the MCP tools that would normally help with "${message}". When connected, I have access to specialized tools for ${getRoleCapabilities(userRole)}. Please try again when the system is online!`;
}

function getErrorResponse(userRole: string): string {
  return `I'm having trouble accessing the advanced MCP features right now. As a ${userRole}, you normally have access to ${getRoleCapabilities(userRole)}. Please try again in a moment!`;
}

function getRoleCapabilities(userRole: string): string {
  const capabilities = {
    super_admin: 'all platform analytics, system management, shelter operations, and emergency protocols',
    platform_admin: 'platform analytics, user management, and shelter oversight',
    admin: 'shelter management, participant tracking, and capacity updates',
    participant: 'status updates, QR code generation, and service access',
    donor: 'donation tracking, impact reports, and receipt generation',
    authenticated: 'knowledge base queries and basic platform information'
  };
  
  return capabilities[userRole as keyof typeof capabilities] || capabilities.authenticated;
}
