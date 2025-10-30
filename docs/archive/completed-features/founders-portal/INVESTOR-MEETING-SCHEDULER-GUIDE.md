# Investor Meeting Scheduler - Testing & Integration Guide

**Date:** October 27, 2025  
**Status:** 🔄 **FRONTEND READY - BACKEND INTEGRATION NEEDED**

---

## ✅ **What's Ready to Test Now (Frontend)**

### **Booking Form Flow**

You can test the complete frontend experience:

1. **Navigate to:** `http://localhost:3000/portal/founders-only/investor-relations`

2. **Scroll to the "Schedule Investor Meeting" section**

3. **Fill out the form:**
   - **Full Name:** Test Investor
   - **Email Address:** investor@example.com
   - **Company/Organization:** Test Ventures Inc
   - **Investment Range:** Select from dropdown:
     - $1,000 - $10,000
     - $10,000 - $50,000
     - $100,000 - $250,000
     - $250,000+
   - **Preferred Date:** Select a future date
   - **Preferred Time (EST):** Select time slot
   - **Additional Notes:** Any specific topics to discuss

4. **Click "Schedule Meeting"**

### **Current Behavior:**

✅ **Form validates all required fields**  
✅ **Shows loading state during submission**  
⚠️  **Returns mock meeting link** (simulated success)  
❌ **Does NOT create actual calendar event** (needs backend API)  
❌ **Does NOT send email confirmation** (needs email service)

---

## 🔧 **Google Calendar Integration Setup**

### **Prerequisites**

1. **Google Cloud Project** with Calendar API enabled
2. **Service Account** with calendar permissions
3. **MCP Server** configured and running
4. **Firebase Functions** or backend API endpoint

### **Step 1: Enable Google Calendar API**

```bash
# 1. Go to Google Cloud Console
https://console.cloud.google.com/

# 2. Select your project (or create new one)

# 3. Enable Google Calendar API
APIs & Services > Enable APIs and Services > Search "Google Calendar API" > Enable

# 4. Create Service Account
APIs & Services > Credentials > Create Credentials > Service Account

# 5. Generate Key (JSON)
Service Account > Keys > Add Key > Create New Key > JSON > Download
```

### **Step 2: Configure Service Account**

```json
// Save as: apps/api/google-calendar-credentials.json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "calendar-service@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

**⚠️ IMPORTANT:** Add to `.gitignore`:
```bash
# Google Calendar credentials
**/google-calendar-credentials.json
```

### **Step 3: Share Calendar with Service Account**

1. Open **Google Calendar** (calendar.google.com)
2. Find your **SHELTR Investor Calendar**
3. Click **Settings and sharing**
4. Under **"Share with specific people"**, add:
   ```
   calendar-service@your-project.iam.gserviceaccount.com
   ```
5. Set permission to **"Make changes to events"**

---

## 📝 **Backend Implementation**

### **Option 1: Firebase Functions (Recommended)**

Create a new Cloud Function to handle calendar events:

```typescript
// functions/src/calendar.ts
import * as functions from 'firebase-functions';
import { google } from 'googleapis';
import * as admin from 'firebase-admin';

const calendar = google.calendar('v3');

// Initialize service account
const serviceAccountKey = require('../google-calendar-credentials.json');
const auth = new google.auth.JWT({
  email: serviceAccountKey.client_email,
  key: serviceAccountKey.private_key,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

export const createInvestorMeeting = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { investorEmail, investorName, selectedDateTime, additionalNotes, investmentRange } = data;

  try {
    // Create calendar event
    const event = {
      summary: 'SHELTR-AI Investor Relations Meeting',
      description: `
Investment Opportunity Discussion

Investor: ${investorName} (${investorEmail})
Investment Range: ${investmentRange}

Agenda:
• SHELTR-AI Platform Overview
• Dual-Token Architecture (SHELTR-S & SHELTR)
• Pre-Seed Funding Round ($250K)
• Financial Projections & ROI Analysis
• Technical Deep Dive
• Q&A Session

${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

This meeting will cover SHELTR's revolutionary approach to homelessness support through blockchain technology.
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
        { email: investorEmail, displayName: investorName },
        { email: 'investors@sheltr-ai.com', displayName: 'SHELTR-AI Investment Team' },
      ],
      conferenceData: {
        createRequest: {
          requestId: `sheltr-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'email', minutes: 60 },      // 1 hour before
        ],
      },
    };

    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary', // or specific calendar ID
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Send email invites to all attendees
    });

    // Log to Firestore
    await admin.firestore().collection('investor_meetings').add({
      eventId: response.data.id,
      investorEmail,
      investorName,
      investmentRange,
      scheduledAt: admin.firestore.FieldValue.serverTimestamp(),
      meetingDateTime: selectedDateTime,
      meetingLink: response.data.hangoutLink,
      status: 'scheduled',
    });

    return {
      success: true,
      meetingLink: response.data.hangoutLink,
      eventId: response.data.id,
      message: 'Meeting scheduled successfully!',
    };
  } catch (error) {
    console.error('Failed to create calendar event:', error);
    throw new functions.https.HttpsError('internal', 'Failed to schedule meeting');
  }
});
```

**Deploy:**
```bash
cd functions
npm install googleapis
firebase deploy --only functions:createInvestorMeeting
```

### **Option 2: Next.js API Route**

Create API endpoint:

```typescript
// apps/web/src/app/api/calendar/create-event/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const calendar = google.calendar('v3');

// Initialize service account
const serviceAccountKey = JSON.parse(
  process.env.GOOGLE_CALENDAR_CREDENTIALS || '{}'
);

const auth = new google.auth.JWT({
  email: serviceAccountKey.client_email,
  key: serviceAccountKey.private_key,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { summary, description, start, end, attendees } = body;

    const event = {
      summary,
      description,
      start,
      end,
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `sheltr-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    return NextResponse.json({
      success: true,
      meetingLink: response.data.hangoutLink,
      eventId: response.data.id,
    });
  } catch (error) {
    console.error('Calendar API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
```

**Environment Variables:**
```bash
# .env.local
GOOGLE_CALENDAR_CREDENTIALS='{"type":"service_account",...}'
```

---

## 🧪 **Testing the Integration**

### **1. Test Calendar Event Creation**

```bash
# Using curl
curl -X POST http://localhost:3000/api/calendar/create-event \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Test SHELTR Investor Meeting",
    "description": "Testing calendar integration",
    "start": {
      "dateTime": "2025-10-26T14:00:00-05:00",
      "timeZone": "America/New_York"
    },
    "end": {
      "dateTime": "2025-10-26T14:45:00-05:00",
      "timeZone": "America/New_York"
    },
    "attendees": [
      {
        "email": "test@example.com"
      }
    ]
  }'
```

### **2. Check Google Calendar**

- Open Google Calendar
- Verify event was created
- Check that Google Meet link was generated
- Confirm attendees received email invites

### **3. Test from Frontend**

1. Fill out investor meeting form
2. Submit
3. Check browser console for API response
4. Verify event in Google Calendar
5. Confirm email notifications sent

---

## 📧 **Email Integration**

### **Option 1: Gmail API (via Service Account)**

Already handled by Google Calendar API when `sendUpdates: 'all'` is used.

### **Option 2: SendGrid (Recommended for Custom Emails)**

```typescript
// Install SendGrid
npm install @sendgrid/mail

// apps/web/src/app/api/email/send-confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json();

    const msg = {
      to,
      from: 'investors@sheltr-ai.com',
      subject,
      html,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SendGrid Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

**Environment Variable:**
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
```

---

## 🔐 **Security Considerations**

### **1. Rate Limiting**

Implement rate limiting to prevent abuse:

```typescript
// Using Upstash Redis or similar
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per IP per window
};
```

### **2. Authentication**

Require user to be logged in:

```typescript
// In API route
if (!request.headers.get('authorization')) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### **3. Input Validation**

Validate all form inputs:

```typescript
import { z } from 'zod';

const meetingSchema = z.object({
  investorEmail: z.string().email(),
  investorName: z.string().min(2),
  selectedDateTime: z.string().datetime(),
  investmentRange: z.string(),
  additionalNotes: z.string().optional(),
});
```

---

## 📊 **Analytics & Tracking**

Store meeting requests in Firestore:

```typescript
// Firestore collection: investor_meetings
{
  eventId: string;
  investorEmail: string;
  investorName: string;
  company: string;
  investmentRange: string;
  scheduledAt: timestamp;
  meetingDateTime: timestamp;
  meetingLink: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  followUpRequired: boolean;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

---

## 🚀 **Deployment Checklist**

### **Frontend:**
- [x] Form validation working
- [x] UI/UX polished
- [x] Loading states implemented
- [x] Error handling in place
- [x] Success confirmation modal

### **Backend:**
- [ ] Google Calendar API credentials configured
- [ ] Service account created and shared with calendar
- [ ] Cloud Function or API route deployed
- [ ] Environment variables set in production
- [ ] Rate limiting implemented
- [ ] Error logging configured

### **Testing:**
- [ ] Test with real email addresses
- [ ] Verify calendar events create successfully
- [ ] Confirm email notifications sent
- [ ] Test Google Meet link generation
- [ ] Verify timezone handling
- [ ] Test error scenarios

### **Monitoring:**
- [ ] Set up Cloud Monitoring alerts
- [ ] Log all booking attempts
- [ ] Track conversion rates
- [ ] Monitor API usage quotas

---

## 💤 **Ready to Test Frontend!**

### **What You Can Do Right Now:**

1. ✅ **Test the booking form UI** at `http://localhost:3000/portal/founders-only/investor-relations`
2. ✅ **Validate form fields** and error messages
3. ✅ **See loading states** and success modals
4. ✅ **Review email template** in browser console
5. ✅ **Assign hero image** in `/dashboard/gallery` (Investor Relations is now listed!)

### **What Needs Backend Integration:**

1. ⚠️ **Google Calendar API setup** (follow guide above)
2. ⚠️ **Deploy Cloud Function** or API route
3. ⚠️ **Configure service account** credentials
4. ⚠️ **Test real calendar event creation**
5. ⚠️ **Verify email delivery**

---

## 📝 **Quick Start Commands**

```bash
# Install dependencies
cd functions
npm install googleapis @google-cloud/firestore

# Deploy Firebase Functions
firebase deploy --only functions:createInvestorMeeting

# Test locally (if using Next.js API route)
cd apps/web
npm run dev

# Deploy frontend
firebase deploy --only hosting
```

---

## 🌙 **Sleep Well!**

The investor meeting booking system is **frontend-ready** and waiting for backend integration!

**What's Complete:**
- ✅ Beautiful booking form
- ✅ Updated investment ranges
- ✅ Form validation
- ✅ Loading states
- ✅ Email template designed
- ✅ Calendar service architecture
- ✅ Investor Relations page in gallery selector

**Next Session:**
- Set up Google Calendar API
- Deploy backend integration
- Test with real calendar
- Go live with investor bookings! 🚀

**Sweet dreams!** 💤✨

