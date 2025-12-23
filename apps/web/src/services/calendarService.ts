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
    additionalNotes?: string,
    company?: string,
    investmentRange?: string
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

      // Call Firebase Function to create real calendar event
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const { functions } = await import('@/lib/firebase');
      
      const createMeeting = httpsCallable(functions, 'createInvestorMeeting');
      
      const result = await createMeeting({
        investorEmail,
        investorName,
        company,
        investmentRange,
        selectedDateTime,
        additionalNotes,
      });
      
      const data = result.data as any;
      
      if (data.success) {
        return {
          success: true,
          meetingLink: data.meetingLink,
          eventId: data.eventId,
          message: data.message || 'Meeting scheduled successfully! Confirmation sent to your email.',
        };
      } else {
        throw new Error(data.message || 'Failed to schedule meeting');
      }
    } catch (error) {
      console.error('❌ CalendarService.createInvestorMeeting error:', error);
      return {
        success: false,
        message: `Failed to schedule meeting: ${error instanceof Error ? error.message : 'Unknown error'}. Please contact us at investors@sheltr-ai.com`,
      };
    }
  }

  /**
   * Generic meeting scheduler for contact page and other general meetings
   */
  async scheduleMeeting(meetingData: {
    name: string;
    email: string;
    company?: string;
    meetingType?: string;
    investmentRange?: string;
    preferredDate: string;
    preferredTime: string;
    timezone: string;
    additionalNotes?: string;
  }): Promise<SchedulingResult> {
    try {
      // Combine date and time
      const dateTimeString = `${meetingData.preferredDate}T${meetingData.preferredTime}:00`;
      const selectedDateTime = new Date(dateTimeString).toISOString();

      // Determine meeting type and use appropriate method
      if (meetingData.meetingType === 'Investor Meeting' || meetingData.investmentRange) {
        return await this.createInvestorMeeting(
          meetingData.email,
          meetingData.name,
          selectedDateTime,
          meetingData.additionalNotes,
          meetingData.company,
          meetingData.investmentRange
        );
      }

      // General meeting (partnership, consultation, etc.)
      const eventDetails: CalendarEvent = {
        summary: `SHELTR-AI ${meetingData.meetingType || 'General'} Meeting`,
        description: `
Meeting Type: ${meetingData.meetingType || 'General Consultation'}

Participant: ${meetingData.name} (${meetingData.email})
${meetingData.company ? `Company: ${meetingData.company}` : ''}

${meetingData.additionalNotes ? `Notes: ${meetingData.additionalNotes}` : ''}

This meeting will cover topics related to SHELTR platform and partnerships.

Visit: https://sheltr-ai.web.app
        `.trim(),
        start: {
          dateTime: selectedDateTime,
          timeZone: meetingData.timezone,
        },
        end: {
          dateTime: new Date(new Date(selectedDateTime).getTime() + 45 * 60000).toISOString(),
          timeZone: meetingData.timezone,
        },
        attendees: [
          {
            email: meetingData.email,
            displayName: meetingData.name,
          },
          {
            email: 'contact@sheltr-ai.com',
            displayName: 'SHELTR-AI Team',
          }
        ],
        location: 'Google Meet (link will be provided)',
      };

      // Call Firebase Function to create real calendar event
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const { functions } = await import('@/lib/firebase');
      
      const createMeeting = httpsCallable(functions, 'createGeneralMeeting');
      
      const result = await createMeeting({
        fullName: meetingData.name,  // Backend expects 'fullName'
        email: meetingData.email,
        company: meetingData.company,
        meetingType: meetingData.meetingType,
        preferredDate: meetingData.preferredDate,  // Backend expects 'preferredDate'
        preferredTime: meetingData.preferredTime,  // Backend expects 'preferredTime'
        additionalNotes: meetingData.additionalNotes,
      });
      
      const data = result.data as any;
      
      if (data.success) {
        return {
          success: true,
          meetingLink: data.meetingLink,
          eventId: data.eventId,
          message: `✅ Meeting scheduled successfully! Check your email (${meetingData.email}) for confirmation and meeting link.`,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to schedule meeting. Please try again.',
        };
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      return {
        success: false,
        message: `Failed to schedule meeting: ${error instanceof Error ? error.message : 'Unknown error'}. Please contact us at contact@sheltr-ai.com`,
      };
    }
  }

  private async createCalendarEvent(event: CalendarEvent): Promise<string> {
    // TODO: Implement actual Google Calendar API integration
    // For now, we'll simulate a successful calendar event creation
    
    console.log('📅 Mock Calendar Event Creation:', {
      summary: event.summary,
      start: event.start.dateTime,
      attendees: event.attendees.map(a => a.email),
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock meeting link with a unique ID
    const meetingId = Math.random().toString(36).substring(2, 15);
    const mockMeetingLink = `https://meet.google.com/mock-${meetingId}`;
    
    console.log('✅ Mock meeting created:', mockMeetingLink);
    
    // In production, this would be replaced with actual API call:
    // const response = await fetch('/api/calendar/create-event', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event),
    // });
    // const result = await response.json();
    // return result.meetingLink;
    
    return mockMeetingLink;
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

    // TODO: Implement actual email sending
    // For now, we'll log the email content for testing
    console.log('📧 Mock Confirmation Email:', {
      to: emailContent.to,
      subject: emailContent.subject,
      meetingLink: meetingLink,
    });
    
    console.log('✅ Mock confirmation email "sent" successfully');
    
    // In production, this would use SendGrid/Gmail API:
    // await fetch('/api/email/send-confirmation', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(emailContent),
    // });
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