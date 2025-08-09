# Google Calendar MCP Integration Setup

## Overview
This guide walks through setting up Google Calendar MCP (Model Context Protocol) to make the "Schedule Meeting" button functional for investor relations.

## Step 1: Google Cloud Console Setup

### 1.1 Create/Configure Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one: "SHELTR-AI-Calendar"
3. Enable required APIs:
   - Google Calendar API
   - Gmail API (optional, for notifications)

### 1.2 Enable APIs
```bash
# Navigate to APIs & Services > Library
# Search and enable:
- Google Calendar API
- Gmail API
```

### 1.3 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: `SHELTR-AI Calendar Integration`
   - User support email: `your-email@domain.com`
   - Developer contact: `your-email@domain.com`
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/gmail.send` (for notifications)
5. Add test users (your email addresses)

### 1.4 Create OAuth 2.0 Credentials
1. Go to "Credentials"
2. Click "Create Credentials" > "OAuth Client ID"
3. Choose "Desktop app" as application type
4. Name: "SHELTR-AI Calendar Desktop Client"
5. Download the JSON file and save as `gcp-oauth.keys.json`

## Step 2: Install MCP Server

### 2.1 Global Installation
```bash
# Install the Google Calendar MCP server globally
npm install -g mcp-google-calendar

# Or install the recommended version
npm install -g @am2rican5/mcp-google-calendar
```

### 2.2 Project-Specific Setup
```bash
# In your project root
mkdir mcp-servers
cd mcp-servers

# Clone the recommended server
git clone https://github.com/am2rican5/mcp-google-calendar.git
cd mcp-google-calendar

# Install dependencies
npm install

# Build the TypeScript
npm run build
```

## Step 3: Configuration Files

### 3.1 Environment Variables
Create `.env` file in project root:
```env
# Google Calendar MCP Configuration
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
CREDENTIALS_PATH=./gcp-oauth.keys.json
MCP_PORT=3420
```

### 3.2 MCP Configuration
Create `mcp-config.json`:
```json
{
  "mcpServers": {
    "google-calendar": {
      "command": "node",
      "args": ["./mcp-servers/mcp-google-calendar/build/index.js"],
      "env": {
        "CREDENTIALS_PATH": "./gcp-oauth.keys.json"
      }
    }
  }
}
```

## Step 4: Authentication Setup

### 4.1 First-Time Authentication
```bash
# Run authentication flow
cd mcp-servers/mcp-google-calendar
npm run auth
```

This will:
1. Open browser for OAuth flow
2. Save tokens to `token.json`
3. Enable automatic token refresh

### 4.2 Test Connection
```bash
# Test the MCP server
npm start
```

## Step 5: Frontend Integration

### 5.1 Create Calendar Service
```typescript
// apps/web/src/services/calendarService.ts
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
}

export class CalendarService {
  private mcpEndpoint = process.env.NEXT_PUBLIC_MCP_ENDPOINT || 'http://localhost:3420';

  async createMeeting(event: CalendarEvent): Promise<string> {
    const response = await fetch(`${this.mcpEndpoint}/calendar/events`, {
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
    return result.htmlLink; // Google Meet link
  }

  async sendNotification(eventDetails: CalendarEvent, meetingLink: string) {
    // Send confirmation email using Gmail API
    const emailContent = {
      to: eventDetails.attendees[0].email,
      subject: `SHELTR-AI Investor Meeting Scheduled - ${eventDetails.summary}`,
      html: `
        <h2>Meeting Confirmation</h2>
        <p>Your investor relations meeting has been scheduled:</p>
        <ul>
          <li><strong>Title:</strong> ${eventDetails.summary}</li>
          <li><strong>Date:</strong> ${new Date(eventDetails.start.dateTime).toLocaleString()}</li>
          <li><strong>Duration:</strong> 45 minutes</li>
          <li><strong>Meeting Link:</strong> <a href="${meetingLink}">Join Meeting</a></li>
        </ul>
        <p>We look forward to discussing SHELTR's investment opportunity with you.</p>
        <p>Best regards,<br>SHELTR-AI Team</p>
      `
    };

    await fetch(`${this.mcpEndpoint}/gmail/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent),
    });
  }
}
```

### 5.2 Update Schedule Meeting Button
```typescript
// In investor-relations/page.tsx
import { CalendarService } from '@/services/calendarService';

const calendarService = new CalendarService();

const handleScheduleMeeting = async () => {
  try {
    setIsScheduling(true);
    
    const eventDetails: CalendarEvent = {
      summary: 'SHELTR-AI Investor Relations Meeting',
      description: 'Discussion about SHELTR-AI investment opportunity, dual-token architecture, and pre-seed funding round.',
      start: {
        dateTime: selectedDateTime, // From date picker
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
          displayName: 'SHELTR-AI Team',
        }
      ],
    };

    const meetingLink = await calendarService.createMeeting(eventDetails);
    await calendarService.sendNotification(eventDetails, meetingLink);
    
    setMeetingScheduled(true);
    setSchedulingResult({
      success: true,
      meetingLink,
      message: 'Meeting scheduled successfully! Confirmation sent to your email.',
    });
  } catch (error) {
    setSchedulingResult({
      success: false,
      message: 'Failed to schedule meeting. Please try again.',
    });
  } finally {
    setIsScheduling(false);
  }
};
```

## Step 6: Security Considerations

### 6.1 Credential Security
```bash
# Add to .gitignore
gcp-oauth.keys.json
token.json
.env.local
mcp-servers/*/token.json
```

### 6.2 Environment Variables (Production)
```bash
# For production deployment
export GOOGLE_CLIENT_ID=your-production-client-id
export GOOGLE_CLIENT_SECRET=your-production-client-secret
export MCP_ENDPOINT=https://your-domain.com/api/mcp
```

## Step 7: Testing

### 7.1 Local Testing
```bash
# Start MCP server
npm run start:mcp

# In another terminal, test the integration
curl -X POST http://localhost:3420/calendar/events \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Test Meeting",
    "start": {
      "dateTime": "2025-01-26T14:00:00-05:00",
      "timeZone": "America/New_York"
    },
    "end": {
      "dateTime": "2025-01-26T14:45:00-05:00",
      "timeZone": "America/New_York"
    }
  }'
```

### 7.2 Frontend Testing
1. Navigate to `/investor-relations`
2. Click "Schedule Meeting"
3. Fill in details and submit
4. Verify calendar event creation
5. Check email notification delivery

## Troubleshooting

### Common Issues
1. **OAuth Errors**: Ensure redirect URIs match exactly
2. **Token Expiry**: Tokens expire after 7 days in testing mode
3. **Scope Issues**: Verify all required scopes are granted
4. **Port Conflicts**: Ensure MCP port (3420) is available

### Debug Commands
```bash
# Test authentication
npm run auth:test

# Check token validity
npm run token:check

# View server logs
npm run logs:mcp
```

## Next Steps
1. Complete Google Cloud setup
2. Install and configure MCP server
3. Update frontend integration
4. Test end-to-end functionality
5. Deploy to production with proper credentials 