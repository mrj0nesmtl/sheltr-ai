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
  let message = '';
  let sessionId = '';
  let context: { page?: string; userAgent?: string; timestamp?: string } = {};
  
  try {
    const body: ChatRequest = await request.json();
    message = body.message;
    sessionId = body.sessionId;
    context = body.context || {};

    // Validate input
    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Note: Rate limiting would be implemented here in production with Redis
    
    // Call backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/api/v1/chatbot/public`, {
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
    
    // Enhanced fallback with SmartFund knowledge
    const messageText = message.toLowerCase();
    let response: string;
    
    if (messageText.includes('smartfund') || messageText.includes('smart fund')) {
      response = `🏠 **SmartFund Donation Distribution Model**

SHELTR's SmartFund is our intelligent donation allocation system that ensures maximum impact:

**80-15-5 Distribution:**
• **80%** → Direct participant support (immediate needs, food, essentials)
• **15%** → Housing fund (long-term housing solutions)
• **5%** → Platform operations (transparency, security)

**How it works:**
1. You scan a participant's QR code
2. Donate any amount via blockchain
3. SmartFund automatically distributes your donation
4. Real-time tracking shows your impact

This model ensures every donation creates both immediate relief AND long-term housing solutions. The blockchain technology provides complete transparency - you can track exactly how your funds are used.

Would you like to know more about making a donation or our housing programs?`;
    } else if (messageText.includes('donate') || messageText.includes('donation') || messageText.includes('give')) {
      response = `💝 **How SHELTR Donations Work**

SHELTR uses QR codes and blockchain technology for transparent, direct giving:

1. **Scan & Give**: Find a participant's QR code and scan it
2. **Choose Amount**: Donate any amount you're comfortable with
3. **Blockchain Security**: Your donation is processed securely
4. **SmartFund Distribution**: Funds automatically split 80-15-5
5. **Track Impact**: See real-time updates on your donation's impact

Our SmartFund ensures 80% goes directly to immediate needs, 15% builds housing, and only 5% covers operations. Every donation is transparent and trackable.

Ready to make a difference? Visit our Scan & Give page!`;
    } else if (messageText.includes('blockchain') || messageText.includes('crypto') || messageText.includes('token')) {
      response = `⛓️ **SHELTR Blockchain & Tokenomics**

SHELTR uses blockchain technology for maximum transparency and efficiency:

**Blockchain Benefits:**
• Complete transparency - all transactions are public
• Instant, secure donations without traditional banking delays
• Lower fees mean more money reaches participants
• Immutable records for accountability

**SHELTR Token (SHLTR):**
• Participants earn tokens for positive actions
• Tokens can be used for housing fund contributions
• Creates incentives for community engagement
• Built on Ethereum for security and interoperability

The combination of SmartFund allocation and blockchain transparency ensures your donations create verified, measurable impact.`;
    } else {
      // General fallback responses
      const fallbackResponses = [
        "Hi! I'm here to help you learn about SHELTR. You can ask me about our SmartFund donation model, how QR donations work, or how to get involved!",
        "Thanks for your question! SHELTR is a blockchain-powered platform that helps people experiencing homelessness. What would you like to know about our SmartFund or donation process?",
        "I can help you understand SHELTR's SmartFund model, our QR donation system, tokenomics, or how we're transforming charitable giving. What interests you most?",
        "SHELTR combines technology with compassion to create direct impact through our SmartFund system. Feel free to ask about donations, blockchain, or how to support participants!"
      ];
      response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    return NextResponse.json({
      success: true,
      response: response,
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
