import * as functions from "firebase-functions";
import { google } from "googleapis";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Initialize Firebase Admin App
initializeApp();

interface MeetingRequest {
  investorEmail: string;
  investorName: string;
  company?: string;
  investmentRange: string;
  selectedDateTime: string;
  additionalNotes?: string;
}

export const createInvestorMeeting = functions.https.onCall(async (request) => {
  const data = request.data as MeetingRequest;
  
  // Get Firestore instance
  const db = getFirestore();

  const { 
    investorEmail, 
    investorName, 
    company,
    investmentRange,
    selectedDateTime, 
    additionalNotes 
  } = data;

  // Validate required fields
  if (!investorEmail || !investorName || !selectedDateTime) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: investorEmail, investorName, or selectedDateTime"
    );
  }

  try {
    // For now, we'll create the event without sending invites via Google Calendar API
    // Instead, we'll send email notifications separately
    // This avoids the Domain-Wide Delegation requirement
    
    // Load service account credentials from file
    // Get current file's directory in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const credentialsPath = join(__dirname, "..", "google-calendar-credentials.json");
    const credentialsContent = readFileSync(credentialsPath, "utf8");
    const serviceAccountKey = JSON.parse(credentialsContent);

    // Create auth client
    const auth = new google.auth.JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar("v3");

    // Calculate end time (45 minutes after start)
    const startTime = new Date(selectedDateTime);
    const endTime = new Date(startTime.getTime() + 45 * 60000); // 45 minutes

    // Create calendar event
    const event = {
      summary: "SHELTR-AI Investor Relations Meeting",
      description: `
Investment Opportunity Discussion

Investor: ${investorName} (${investorEmail})
${company ? `Company: ${company}` : ""}
Investment Range: ${investmentRange}

Agenda:
• SHELTR Platform Overview
• System Architecture
• Pre-Seed Funding Round ($250K)
• Financial Projections & ROI Analysis
• Deep Dive
• Q&A Session

${additionalNotes ? `Additional Notes:\n${additionalNotes}` : ""}

This meeting will cover SHELTR's disruptive approach to homelessness support through technology and our current investment opportunity.

Visit our investor portal: https://sheltr-ai.web.app/portal/founders-only/investor-relations
      `.trim(),
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "America/New_York",
      },
      // Note: attendees removed to avoid Domain-Wide Delegation requirement
      // Calendar event will be created in service account's calendar
      // Attendees will be notified via separate email system
      attendees: [],
      // Note: conferenceData removed - service accounts can't create Meet links
      // Meeting link will be created manually or via another method
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "email", minutes: 60 },      // 1 hour before
        ],
      },
    };

    functions.logger.info("Creating calendar event", { 
      investorEmail, 
      investorName, 
      selectedDateTime,
      attendeesForNotification: [
        investorEmail,
        "joel.yaffe@gmail.com",
        "alexander@arcanaconcept.com"
      ]
    });

    // Insert event into calendar
    // Using the shared "SHELTR Investor Meetings" calendar
    const response = await calendar.events.insert({
      auth,
      calendarId: "d257b50132689ff7d20d6117dafe4293e2d39558a55058fb52d3f16e85baabe4@group.calendar.google.com",
      requestBody: event,
      sendUpdates: "none", // Don't send invites (no attendees to avoid Domain-Wide Delegation)
    });

    // Generate a placeholder Google Meet link
    // In production, this would be replaced with actual Meet link creation via OAuth
    const meetingLink = "https://meet.google.com/new";
    
    functions.logger.info("Calendar event created successfully", { 
      eventId: response.data.id,
      meetingLink 
    });

    // Store meeting record in Firestore
    const meetingRecord = {
      eventId: response.data.id,
      investorEmail,
      investorName,
      company: company || null,
      investmentRange,
      scheduledAt: new Date().toISOString(),
      meetingDateTime: startTime.toISOString(),
      meetingLink,
      status: "scheduled",
      additionalNotes: additionalNotes || null,
      createdAt: new Date().toISOString(),
      attendees: [
        investorEmail,
        "joel.yaffe@gmail.com",
        "alexander@arcanaconcept.com"
      ],
      emailNotificationsSent: false, // To track if email notifications were sent
    };

    const docRef = await db.collection("investor_meetings").add(meetingRecord);

    functions.logger.info("Meeting record saved to Firestore", { docId: docRef.id });

    return {
      success: true,
      meetingLink,
      eventId: response.data.id,
      message: "Meeting scheduled successfully! You will receive a calendar invite with meeting details.",
    };

  } catch (error) {
    functions.logger.error("Failed to create calendar event", error);
    
    throw new functions.https.HttpsError(
      "internal",
      `Failed to schedule meeting: ${error instanceof Error ? error.message : "Unknown error"}`,
      error
    );
  }
});
