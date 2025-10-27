import * as functions from "firebase-functions";
import { google } from "googleapis";
import * as admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

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
  
  // Initialize Firebase Admin if needed
  try {
    if (!admin.apps || admin.apps.length === 0) {
      admin.initializeApp();
    }
  } catch (error) {
    // Already initialized
  }

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
    // Load service account credentials from file
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
      attendees: [
        { email: investorEmail, displayName: investorName },
        { email: "joel.yaffe@gmail.com", displayName: "Joel Yaffe - SHELTR Founder" },
        { email: "alexander@arcanaconcept.com", displayName: "Alexander Kline, Arcana Founder" },  
        // Add other team members here as needed
      ],
      conferenceData: {
        createRequest: {
          requestId: `sheltr-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "email", minutes: 60 },      // 1 hour before
        ],
      },
    };

    functions.logger.info("Creating calendar event", { investorEmail, investorName, selectedDateTime });

    // Insert event into calendar
    const response = await calendar.events.insert({
      auth,
      calendarId: "primary", // or use specific calendar ID
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: "all", // Send email invites to all attendees
    });

    functions.logger.info("Calendar event created successfully", { 
      eventId: response.data.id,
      meetingLink: response.data.hangoutLink 
    });

    // Store meeting record in Firestore
    const meetingRecord = {
      eventId: response.data.id,
      investorEmail,
      investorName,
      company: company || null,
      investmentRange,
      scheduledAt: admin.firestore.FieldValue.serverTimestamp(),
      meetingDateTime: startTime,
      meetingLink: response.data.hangoutLink || "https://meet.google.com",
      status: "scheduled",
      additionalNotes: additionalNotes || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await admin.firestore()
      .collection("investor_meetings")
      .add(meetingRecord);

    functions.logger.info("Meeting record saved to Firestore", { docId: docRef.id });

    return {
      success: true,
      meetingLink: response.data.hangoutLink || "https://meet.google.com",
      eventId: response.data.id,
      message: "Meeting scheduled successfully! Confirmation sent to your email.",
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
