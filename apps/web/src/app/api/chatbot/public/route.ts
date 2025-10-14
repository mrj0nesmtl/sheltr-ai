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
    
    // Call backend API with timeout
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    console.log(`[Public Chat API] Calling backend: ${backendUrl}/api/v1/chatbot/public`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
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
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[Public Chat API] Backend responded with ${response.status}, using fallback`);
        throw new Error(`Backend responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('[Public Chat API] Backend response received successfully');
      
      return NextResponse.json({
        success: true,
        response: data.response || data.message,
        actions: data.actions || [],
        follow_up: data.follow_up,
        conversation_id: data.conversation_id,
        timestamp: new Date().toISOString()
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.warn('[Public Chat API] Backend fetch failed, using smart fallback:', fetchError);
      throw fetchError; // Re-throw to trigger main fallback logic
    }

  } catch (error) {
    console.error('[Public Chat API] Error occurred, generating fallback response:', error);
    
    // Enhanced fallback with SmartFund knowledge
    const messageText = message.toLowerCase();
    let response: string;
    let suggestedActions = [];
    
    // Check for participant/homeless queries first
    if (messageText.includes('homeless') || messageText.includes('need help') || messageText.includes('participant') || messageText.includes('housing')) {
      response = `🏠 **Welcome to SHELTR - We're Here to Help**

I understand you're looking for support. SHELTR partners with homeless shelters to provide direct assistance:

**How SHELTR Can Help You:**
• **Get Support**: Partner shelters can set you up with a SHELTR profile
• **Receive Direct Donations**: People can donate directly to you via QR code
• **Build Housing Fund**: 15% of donations go toward your housing deposit
• **Track Progress**: See your path to stable housing in real-time

**Next Steps:**
1. Ask your shelter if they partner with SHELTR
2. They'll help you create your participant profile
3. Start receiving direct support from donors
4. Build toward your housing goals

**Need Immediate Help?**
• Contact local shelters in your area
• Call 211 for homeless services (US/Canada)
• Visit /contact on our website to reach our team

Would you like to know more about how SHELTR participants receive support?`;
      
      suggestedActions = [
        { type: 'link', text: 'Learn About Participant Benefits', url: '/solutions/participants' },
        { type: 'link', text: 'Contact Us', url: '/contact' },
        { type: 'link', text: 'Find Participating Shelters', url: '/about' }
      ];
    } else if (messageText.includes('smartfund') || messageText.includes('smart fund')) {
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
      
      suggestedActions = [
        { type: 'link', text: 'Learn More About SHELTR', url: '/about' },
        { type: 'link', text: 'How to Donate', url: '/scan-give' },
        { type: 'link', text: 'View Our Team', url: '/team' }
      ];
    }
    
    // Use context-appropriate actions or default ones
    const finalActions = suggestedActions.length > 0 ? suggestedActions : [
      { type: 'link', text: 'Learn More About SHELTR', url: '/about' },
      { type: 'link', text: 'How to Donate', url: '/scan-give' },
      { type: 'link', text: 'View Our Team', url: '/team' }
    ];
    
    return NextResponse.json({
      success: true,
      response: response,
      actions: finalActions,
      fallback: true,
      timestamp: new Date().toISOString()
    });
  }
}
