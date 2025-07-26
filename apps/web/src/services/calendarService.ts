export interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
    displayName?: string;
  }>;
  location?: string;
}

export interface SchedulingResult {
  success: boolean;
  meetingLink?: string;
  eventId?: string;
  message: string;
}

export class CalendarService {
  private mcpEndpoint = process.env.NEXT_PUBLIC_MCP_ENDPOINT || 'http://localhost:3420';

  async createInvestorMeeting(
    investorEmail: string,
    investorName: string,
    selectedDateTime: string,
    additionalNotes?: string
  ): Promise<SchedulingResult> {
    try {
      const eventDetails: CalendarEvent = {
        summary: 'SHELTR-AI Investor Relations Meeting',
        description: `
Investment Opportunity Discussion

Agenda:
• SHELTR-AI Platform Overview
• Dual-Token Architecture (SHELTR-S & SHELTR)
• Pre-Seed Funding Round ($150K)
• Financial Projections & ROI Analysis
• Technical Deep Dive
• Q&A Session

Investor: ${investorName} (${investorEmail})

${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

This meeting will cover SHELTR's revolutionary approach to homelessness support through blockchain technology and our current investment opportunity.

Visit our investor portal: https://sheltr-ai.web.app/investor-relations
        `.trim(),
        start: {
          dateTime: selectedDateTime,
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: new Date(new Date(selectedDateTime).getTime() + 45 * 60000).toISOString(),
          timeZone: 'America/New_York',
        },
        attendees: [
          {
            email: investorEmail,
            displayName: investorName,
          },
          {
            email: 'investors@sheltr-ai.com',
            displayName: 'SHELTR-AI Investment Team',
          }
        ],
        location: 'Google Meet (link will be provided)',
      };

      // Create calendar event via MCP
      const meetingLink = await this.createCalendarEvent(eventDetails);
      
      // Send confirmation notification
      await this.sendConfirmationEmail(eventDetails, meetingLink);
      
      return {
        success: true,
        meetingLink,
        message: 'Meeting scheduled successfully! Confirmation sent to your email.',
      };
    } catch (error) {
      console.error('Failed to create investor meeting:', error);
      return {
        success: false,
        message: 'Failed to schedule meeting. Please try again or contact us directly.',
      };
    }
  }

  private async createCalendarEvent(event: CalendarEvent): Promise<string> {
    // For now, we'll simulate the MCP call
    // In production, this would call the actual MCP server
    
    if (typeof window !== 'undefined') {
      // Client-side implementation
      const response = await fetch('/api/calendar/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error('Failed to create calendar event');
      }

      const result = await response.json();
      return result.meetingLink;
    }

    // Fallback for development - return a mock meeting link
    return 'https://meet.google.com/mock-meeting-link';
  }

  private async sendConfirmationEmail(eventDetails: CalendarEvent, meetingLink: string): Promise<void> {
    const emailContent = {
      to: eventDetails.attendees[0].email,
      subject: `SHELTR-AI Investor Meeting Scheduled - ${eventDetails.summary}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">SHELTR-AI</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Investor Relations</p>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa;">
            <h2 style="color: #333;">Meeting Confirmation</h2>
            <p>Thank you for your interest in SHELTR-AI. Your investor relations meeting has been scheduled:</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">Meeting Details</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 10px 0;"><strong>Title:</strong> ${eventDetails.summary}</li>
                <li style="margin: 10px 0;"><strong>Date & Time:</strong> ${new Date(eventDetails.start.dateTime).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}</li>
                <li style="margin: 10px 0;"><strong>Duration:</strong> 45 minutes</li>
                <li style="margin: 10px 0;"><strong>Format:</strong> Video Conference</li>
              </ul>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${meetingLink}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  📅 Join Meeting
                </a>
              </div>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1976d2;">What to Expect</h3>
              <ul>
                <li>Platform demonstration and technical overview</li>
                <li>Dual-token architecture explanation (SHELTR-S & SHELTR)</li>
                <li>Pre-seed funding opportunity ($150K round)</li>
                <li>Financial projections and growth strategy</li>
                <li>Q&A session tailored to your interests</li>
              </ul>
            </div>
            
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #f57c00;">Preparation Materials</h3>
              <p>To maximize our meeting time, we recommend reviewing:</p>
              <ul>
                <li><a href="https://sheltr-ai.web.app/docs/whitepaper" style="color: #667eea;">Technical White Paper</a></li>
                <li><a href="https://sheltr-ai.web.app/docs/blockchain" style="color: #667eea;">Blockchain Architecture</a></li>
                <li><a href="https://sheltr-ai.web.app/investor-relations" style="color: #667eea;">Investment Overview</a></li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666;">Questions before our meeting?</p>
              <a href="mailto:investors@sheltr-ai.com" style="color: #667eea;">investors@sheltr-ai.com</a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 SHELTR-AI Technologies Inc. | Confidential & Proprietary</p>
          </div>
        </div>
      `
    };

    // For now, we'll simulate sending the email
    // In production, this would use the Gmail API via MCP
    console.log('Confirmation email would be sent:', emailContent);
    
    // You could also integrate with other email services like SendGrid, Mailgun, etc.
    if (typeof window !== 'undefined') {
      await fetch('/api/email/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailContent),
      });
    }
  }

  async getAvailableTimeSlots(date: Date): Promise<string[]> {
    // This would integrate with your calendar to check availability
    // For now, return sample time slots
    const baseDate = new Date(date);
    const slots = [];
    
    // Generate time slots from 9 AM to 5 PM EST
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(baseDate);
        slotTime.setHours(hour, minute, 0, 0);
        slots.push(slotTime.toISOString());
      }
    }
    
    return slots;
  }

  async checkMeetingConflicts(dateTime: string): Promise<boolean> {
    // This would check your actual calendar for conflicts
    // For now, return false (no conflicts)
    return false;
  }
} 