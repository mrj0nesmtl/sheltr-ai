/**
 * OAuth 2.0 Flow for Google Calendar with Meet Integration
 * 
 * This module handles:
 * - OAuth token storage and refresh
 * - Automatic token refresh when expired
 * - Google Meet link generation via OAuth credentials
 */

import * as functions from "firebase-functions";
import { google } from "googleapis";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load OAuth credentials
const oauthCredentialsPath = join(__dirname, "..", "google-oauth-credentials.json");
const oauthCredentials = JSON.parse(readFileSync(oauthCredentialsPath, "utf8"));

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

const REDIRECT_URI = oauthCredentials.web.redirect_uris[0]; // Use production URI

/**
 * Create OAuth2 client
 */
export function createOAuth2Client() {
  return new google.auth.OAuth2(
    oauthCredentials.web.client_id,
    oauthCredentials.web.client_secret,
    REDIRECT_URI
  );
}

/**
 * Get stored OAuth tokens from Firestore
 */
export async function getStoredTokens() {
  const db = getFirestore();
  const tokenDoc = await db.collection("system_config").doc("oauth_tokens").get();
  
  if (!tokenDoc.exists) {
    return null;
  }
  
  return tokenDoc.data();
}

/**
 * Store OAuth tokens in Firestore
 */
export async function storeTokens(tokens: any) {
  const db = getFirestore();
  await db.collection("system_config").doc("oauth_tokens").set({
    ...tokens,
    updated_at: new Date().toISOString(),
  });
}

/**
 * Get authenticated OAuth2 client with automatic token refresh
 */
export async function getAuthenticatedClient() {
  const oauth2Client = createOAuth2Client();
  const tokens = await getStoredTokens();
  
  if (!tokens) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "OAuth tokens not found. Please complete OAuth authorization first."
    );
  }
  
  oauth2Client.setCredentials(tokens);
  
  // Refresh token if expired
  if (tokens.expiry_date && Date.now() >= tokens.expiry_date) {
    functions.logger.info("OAuth token expired, refreshing...");
    const { credentials } = await oauth2Client.refreshAccessToken();
    await storeTokens(credentials);
    oauth2Client.setCredentials(credentials);
  }
  
  return oauth2Client;
}

/**
 * Generate OAuth authorization URL
 * Call this endpoint to get the URL for initial OAuth setup
 */
export const getOAuthUrl = functions.https.onCall(async (request) => {
  // Only allow super_admin to generate OAuth URL
  if (!request.auth || request.auth.token.role !== "super_admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only super admins can initiate OAuth flow"
    );
  }
  
  const oauth2Client = createOAuth2Client();
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force consent to get refresh token
  });
  
  return {
    authUrl,
    message: "Visit this URL to authorize the application",
  };
});

/**
 * OAuth callback handler
 * This is called by Google after user authorizes the app
 */
export const oauthCallback = functions.https.onRequest(async (req, res) => {
  const code = req.query.code as string;
  
  if (!code) {
    res.status(400).send("Missing authorization code");
    return;
  }
  
  try {
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in Firestore
    await storeTokens(tokens);
    
    functions.logger.info("OAuth tokens stored successfully");
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 3rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 500px;
            }
            h1 {
              color: #667eea;
              margin: 0 0 1rem 0;
            }
            p {
              color: #666;
              line-height: 1.6;
            }
            .success {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✅</div>
            <h1>Authorization Successful!</h1>
            <p>
              SHELTR can now automatically create Google Meet links for calendar events.
            </p>
            <p>
              You can close this window and return to the application.
            </p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    functions.logger.error("OAuth callback error:", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Failed</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            }
            .container {
              background: white;
              padding: 3rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 500px;
            }
            h1 {
              color: #f5576c;
              margin: 0 0 1rem 0;
            }
            p {
              color: #666;
              line-height: 1.6;
            }
            .error {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">❌</div>
            <h1>Authorization Failed</h1>
            <p>
              There was an error during the authorization process.
            </p>
            <p>
              Error: ${error instanceof Error ? error.message : "Unknown error"}
            </p>
            <p>
              Please try again or contact support.
            </p>
          </div>
        </body>
      </html>
    `);
  }
});
