import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
  sessionId: string;
  context?: {
    page: string;
    userAgent: string;
    timestamp: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, sessionId, context } = body;

    // Validate input
    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Rate limiting check (simple implementation)
    const rateLimitKey = `public_chat_${sessionId}`;
    // In production, use Redis or similar for rate limiting
    
    // Call backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/chatbot/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        user_id: sessionId,
        user_role: 'public',
        conversation_context: {
          page: context?.page || '/',
          user_agent: context?.userAgent || 'unknown',
          session_type: 'public',
          anonymous: true,
          ...context
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      response: data.response || data.message,
      actions: data.actions || [],
      follow_up: data.follow_up,
      conversation_id: data.conversation_id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Public chatbot API error:', error);
    
    // Fallback response for when backend is unavailable
    const fallbackResponses = [
      "Hi! I'm here to help you learn about SHELTR. You can ask me about our mission, how donations work, or how to get involved!",
      "Thanks for your question! SHELTR is a blockchain-powered platform that helps people experiencing homelessness. What would you like to know more about?",
      "I can help you understand how SHELTR works, our QR donation system, or how we're transforming charitable giving. What interests you most?",
      "SHELTR combines technology with compassion to create direct impact. Feel free to ask about our platform, tokenomics, or how to support participants!"
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return NextResponse.json({
      success: true,
      response: randomResponse,
      actions: [
        { type: 'link', text: 'Learn More About SHELTR', url: '/about' },
        { type: 'link', text: 'How to Donate', url: '/scan-give' },
        { type: 'link', text: 'View Our Team', url: '/team' }
      ],
      fallback: true,
      timestamp: new Date().toISOString()
    });
  }
}
