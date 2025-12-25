import * as functions from "firebase-functions";
import { google } from "googleapis";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getAuthenticatedClient, getStoredTokens } from "./oauth.js";

// Initialize Firebase Admin App
initializeApp();

// Type definitions for calendar events
interface CalendarEvent {
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
  attendees: string[];
  colorId?: string;
  conferenceData?: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
  reminders?: {
    useDefault: boolean;
    overrides: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

interface CalendarInsertOptions {
  auth: any;
  calendarId: string;
  requestBody: CalendarEvent;
  sendUpdates: string;
  conferenceDataVersion?: number;
}

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
A Google Meet link will be added to this event shortly.

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
      attendees: [],
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
        "joel@arcanaconcept.com",
        "alexander@arcanaconcept.com"
      ]
    });

    // Insert event into calendar
    // Using the shared "SHELTR Investor Meetings" calendar
    const response = await calendar.events.insert({
      auth,
      calendarId: "c_5678f9f5e708852d32e378ba9b4bbbc30a22a1038a5beb4465cc4b598f8ae7b1@group.calendar.google.com",
      requestBody: event,
      sendUpdates: "none",
    });

    // Generate a Google Meet link placeholder
    const meetingLink = `https://meet.google.com/new?authuser=${investorEmail}`;
    
    functions.logger.info("Calendar event created successfully", { 
      eventId: response.data.id,
      meetingLink,
      hasConferenceData: !!response.data.conferenceData
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
        "joel@arcanaconcept.com",
        "alexander@arcanaconcept.com"
      ],
      emailNotificationsSent: false, // To track if email notifications were sent
    };

    const docRef = await db.collection("investor_meetings").add(meetingRecord);

    functions.logger.info("Meeting record saved to Firestore", { docId: docRef.id });

    // Create notifications for Super Admins and Platform Admins
    try {
      // Get all super admins and platform admins
      const usersSnapshot = await db.collection("users")
        .where("role", "in", ["super_admin", "platform_admin"])
        .get();

      functions.logger.info(`Creating notifications for ${usersSnapshot.size} admins`);

      // Create a notification for each admin
      const notificationPromises = usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const notification = {
          recipient_id: userDoc.id,
          recipient_role: userData.role,
          type: "investor_meeting_scheduled",
          title: "New Investor Meeting Scheduled",
          message: `${investorName} (${company || "N/A"}) scheduled a meeting for ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}. Investment range: ${investmentRange}`,
          priority: "high",
          category: "application",
          isRead: false,
          created_at: new Date().toISOString(),
          data: {
            meetingId: docRef.id,
            investorEmail,
            investorName,
            company,
            investmentRange,
            meetingDateTime: startTime.toISOString(),
            eventId: response.data.id
          }
        };

        return db.collection("admin_notifications").add(notification);
      });

      await Promise.all(notificationPromises);
      functions.logger.info(`✅ Created ${usersSnapshot.size} admin notifications`);
    } catch (notificationError) {
      functions.logger.error("Failed to create admin notifications", notificationError);
      // Don't fail the entire function if notifications fail
    }

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

// Shelter Partnership Meeting Request Interface
interface ShelterPartnershipRequest {
  shelterName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  shelterLocation: string;
  currentCapacity?: string;
  selectedDateTime: string;
  additionalNotes?: string;
}

export const createShelterPartnershipMeeting = functions.https.onCall(async (request) => {
  const data = request.data as ShelterPartnershipRequest;
  
  // Get Firestore instance
  const db = getFirestore();

  const { 
    shelterName,
    contactName, 
    contactEmail, 
    contactPhone,
    shelterLocation,
    currentCapacity,
    selectedDateTime, 
    additionalNotes 
  } = data;

  // Validate required fields
  if (!shelterName || !contactName || !contactEmail || !selectedDateTime) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: shelterName, contactName, contactEmail, or selectedDateTime"
    );
  }

  try {
    // Load SHELTER-SPECIFIC service account credentials from file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const credentialsPath = join(__dirname, "..", "shelter-calendar-service.json");
    const credentialsContent = readFileSync(credentialsPath, "utf8");
    const serviceAccountKey = JSON.parse(credentialsContent);

    // Create auth client
    const auth = new google.auth.JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar("v3");

    // Calculate end time (60 minutes for partnership calls)
    const startTime = new Date(selectedDateTime);
    const endTime = new Date(startTime.getTime() + 60 * 60000); // 60 minutes

    // Create calendar event
    const event = {
      summary: `SHELTR Partnership Call - ${shelterName}`,
      description: `
Shelter Partnership Discussion

Organization: ${shelterName}
Contact: ${contactName} (${contactEmail})
${contactPhone ? `Phone: ${contactPhone}` : ""}
Location: ${shelterLocation}
${currentCapacity ? `Current Capacity: ${currentCapacity}` : ""}

Agenda:
• Introduction to SHELTR's Dual-Platform Approach
• Mobile PODS for Overflow Relief
• Next-Generation HMIS Solution
• Partnership Structure & Implementation
• Pricing & Timeline Discussion
• Technical Requirements Review
• Q&A Session

${additionalNotes ? `Additional Notes:\n${additionalNotes}` : ""}

This meeting will explore how SHELTR can support ${shelterName} with innovative solutions for capacity management and operational excellence.
A Google Meet link will be added to this event shortly.

Visit our solutions page: https://sheltr-ai.web.app/solutions/organizations
      `.trim(),
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "America/New_York",
      },
      colorId: "9", // Blue color for shelter partnerships
    };

    // Insert event into Shelter Inquiries calendar
    const response = await calendar.events.insert({
      auth,
      calendarId: "c_fd2371c84487cb8877a64151719edde2d7c2ff05fd4d695b6bd4ef8b444d6638@group.calendar.google.com",
      requestBody: event,
      sendUpdates: "none",
    });

    // Generate a Google Meet link placeholder
    const meetingLink = `https://meet.google.com/new?authuser=${contactEmail}`;
    
    functions.logger.info("Shelter partnership calendar event created successfully", { 
      eventId: response.data.id,
      meetingLink,
      hasConferenceData: !!response.data.conferenceData
    });

    // Store meeting record in Firestore
    const meetingRecord = {
      eventId: response.data.id,
      shelterName,
      contactName,
      contactEmail,
      contactPhone: contactPhone || null,
      shelterLocation,
      currentCapacity: currentCapacity || null,
      scheduledAt: new Date().toISOString(),
      meetingDateTime: startTime.toISOString(),
      meetingLink,
      status: "scheduled",
      additionalNotes: additionalNotes || null,
      attendees: [
        contactEmail,
        "joel@arcanaconcept.com",
        "alexander@arcanaconcept.com"
      ],
      emailNotificationsSent: false,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("shelter_partnership_meetings").add(meetingRecord);

    functions.logger.info("Shelter partnership meeting record saved to Firestore", { docId: docRef.id });

    // Create notifications for Super Admins and Platform Admins
    const usersSnapshot = await db.collection("users")
      .where("role", "in", ["super_admin", "platform_admin"])
      .get();

    const notificationPromises = usersSnapshot.docs.map(async (doc) => {
      const notification = {
        userId: doc.id,
        type: "shelter_partnership",
        title: `New Partnership Call: ${shelterName}`,
        message: `${contactName} from ${shelterName} has scheduled a partnership call for ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}`,
        meetingId: docRef.id,
        read: false,
        createdAt: new Date().toISOString(),
        data: {
          shelterName,
          contactName,
          contactEmail,
          meetingDateTime: startTime.toISOString(),
          meetingLink
        }
      };

      return db.collection("notifications").add(notification);
    });

    await Promise.all(notificationPromises);

    return {
      success: true,
      eventId: response.data.id,
      meetingLink,
      message: "Partnership call scheduled successfully. You will receive a confirmation email shortly."
    };

  } catch (error) {
    functions.logger.error("Failed to create shelter partnership calendar event", error);
    
    throw new functions.https.HttpsError(
      "internal",
      `Failed to schedule partnership call: ${error instanceof Error ? error.message : "Unknown error"}`,
      error
    );
  }
});

// General Meeting Request Interface (for contact page)
interface GeneralMeetingRequest {
  fullName: string;
  email: string;
  company?: string;
  meetingType: string;
  preferredDate: string;
  preferredTime: string;
  additionalNotes?: string;
}

export const createGeneralMeeting = functions.https.onCall(async (request) => {
  const data = request.data as GeneralMeetingRequest;
  
  // Get Firestore instance
  const db = getFirestore();

  const { 
    fullName,
    email, 
    company,
    meetingType,
    preferredDate,
    preferredTime,
    additionalNotes 
  } = data;

  // Validate required fields
  if (!fullName || !email || !preferredDate || !preferredTime) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: fullName, email, preferredDate, or preferredTime"
    );
  }

  try {
    // Combine date and time into ISO string
    const dateTimeStr = `${preferredDate}T${preferredTime}:00`;
    const startTime = new Date(dateTimeStr);
    
    // Validate date
    if (isNaN(startTime.getTime())) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid date/time format"
      );
    }

    const endTime = new Date(startTime.getTime() + 45 * 60000); // 45 minutes

    // Try to use OAuth client first (for Meet link generation)
    // Fall back to service account if OAuth not configured
    let auth;
    let useOAuth = false;
    
    try {
      const oauthTokens = await getStoredTokens();
      if (oauthTokens) {
        auth = await getAuthenticatedClient();
        useOAuth = true;
        functions.logger.info('Using OAuth client for Meet link generation');
      }
    } catch (oauthError) {
      functions.logger.warn("OAuth not available, using service account:", oauthError);
    }
    
    // Fall back to service account if OAuth not available
    if (!auth) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const credentialsPath = join(__dirname, "..", "google-calendar-credentials.json");
      const credentialsContent = readFileSync(credentialsPath, "utf8");
      const serviceAccountKey = JSON.parse(credentialsContent);

      auth = new google.auth.JWT({
        email: serviceAccountKey.client_email,
        key: serviceAccountKey.private_key,
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });
    }

    const calendar = google.calendar("v3");

    // Create calendar event with optional Meet link (if using OAuth)
    const event: any = {
      summary: `SHELTR General Meeting - ${meetingType}`,
      description: `
General Meeting Request

Name: ${fullName}
Email: ${email}
${company ? `Company/Organization: ${company}` : ""}
Meeting Type: ${meetingType}

${additionalNotes ? `Additional Notes:\n${additionalNotes}` : ""}

This is a general inquiry meeting scheduled through the SHELTR contact page.
${useOAuth ? 'A Google Meet link will be automatically generated.' : 'A Google Meet link will be added to this event shortly.'}

Visit SHELTR: https://sheltr-ai.web.app
      `.trim(),
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "America/New_York",
      },
      attendees: [],
      colorId: "2", // Sage green for general meetings
    };

    // Add conferenceData if using OAuth (enables automatic Meet link)
    if (useOAuth) {
      event.conferenceData = {
        createRequest: {
          requestId: `meeting-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      };
    }

    functions.logger.info("Creating general meeting calendar event", { 
      fullName, 
      email, 
      meetingType,
      startTime: startTime.toISOString(),
      useOAuth,
      willCreateMeetLink: useOAuth
    });

    // Insert event into calendar
    const insertOptions: CalendarInsertOptions = {
      auth,
      calendarId: "c_5678f9f5e708852d32e378ba9b4bbbc30a22a1038a5beb4465cc4b598f8ae7b1@group.calendar.google.com",
      requestBody: event,
      sendUpdates: "none",
    };

    // Add conferenceDataVersion if using OAuth
    if (useOAuth) {
      insertOptions.conferenceDataVersion = 1;
    }

    const response = await calendar.events.insert(insertOptions);

    // Extract Meet link if available, otherwise provide placeholder
    let meetingLink;
    if (useOAuth && response.data.conferenceData?.entryPoints) {
      meetingLink = response.data.conferenceData.entryPoints.find(
        (entry: any) => entry.entryPointType === "video"
      )?.uri || response.data.hangoutLink;
    }
    
    if (!meetingLink) {
      meetingLink = `https://meet.google.com/new?authuser=${email}`;
    }
    
    functions.logger.info("General meeting calendar event created successfully", { 
      eventId: response.data.id,
      meetingLink,
      hasConferenceData: !!response.data.conferenceData
    });

    // Store meeting record in Firestore
    const meetingRecord = {
      eventId: response.data.id,
      fullName,
      email,
      company: company || null,
      meetingType,
      scheduledAt: new Date().toISOString(),
      meetingDateTime: startTime.toISOString(),
      meetingLink,
      status: "scheduled",
      additionalNotes: additionalNotes || null,
      createdAt: new Date().toISOString(),
      attendees: [
        email,
        "joel@arcanaconcept.com"
      ],
      emailNotificationsSent: false,
    };

    const docRef = await db.collection("general_meetings").add(meetingRecord);

    functions.logger.info("General meeting record saved to Firestore", { docId: docRef.id });

    // Create notifications for Super Admins and Platform Admins
    try {
      const usersSnapshot = await db.collection("users")
        .where("role", "in", ["super_admin", "platform_admin"])
        .get();

      functions.logger.info(`Creating notifications for ${usersSnapshot.size} admins`);

      const notificationPromises = usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const notification = {
          recipient_id: userDoc.id,
          recipient_role: userData.role,
          type: "general_meeting_scheduled",
          title: "New General Meeting Scheduled",
          message: `${fullName} (${company || "Individual"}) scheduled a ${meetingType} meeting for ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}`,
          priority: "normal",
          category: "application",
          isRead: false,
          created_at: new Date().toISOString(),
          data: {
            meetingId: docRef.id,
            email,
            fullName,
            company,
            meetingType,
            meetingDateTime: startTime.toISOString(),
            eventId: response.data.id
          }
        };

        return db.collection("admin_notifications").add(notification);
      });

      await Promise.all(notificationPromises);
      functions.logger.info(`✅ Created ${usersSnapshot.size} admin notifications`);
    } catch (notificationError) {
      functions.logger.error("Failed to create admin notifications", notificationError);
      // Don't fail the entire function if notifications fail
    }

    return {
      success: true,
      meetingLink,
      eventId: response.data.id,
      message: "Meeting scheduled successfully! You will receive a confirmation email with meeting details.",
    };

  } catch (error) {
    functions.logger.error("Failed to create general meeting calendar event", error);
    
    throw new functions.https.HttpsError(
      "internal",
      `Failed to schedule meeting: ${error instanceof Error ? error.message : "Unknown error"}`,
      error
    );
  }
});
