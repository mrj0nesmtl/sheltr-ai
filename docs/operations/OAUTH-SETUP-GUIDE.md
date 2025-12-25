# OAuth 2.0 Setup Guide for Google Meet Integration

## 🎯 Overview

This guide explains how to set up OAuth 2.0 authentication to enable **automatic Google Meet link generation** for calendar meetings.

---

## ✅ Prerequisites

1. **OAuth credentials created** in Google Cloud Console
   - Client ID: `YOUR_CLIENT_ID.apps.googleusercontent.com` (get from Google Cloud Console)
   - Client Secret: `YOUR_CLIENT_SECRET` (get from Google Cloud Console - download credentials file)
   - Credentials file: `functions/google-oauth-credentials.json` ✅

2. **APIs enabled** in Google Cloud Console:
   - ✅ Google Calendar API
   - ✅ Google Meet API

3. **Functions deployed** with OAuth code:
   - ✅ `getOAuthUrl`
   - ✅ `oauthCallback`
   - ✅ Updated `createGeneralMeeting`

---

## 🚀 One-Time Setup Process

### Step 1: Deploy Functions

```bash
cd functions
npm run deploy
```

Or deploy specific functions:
```bash
firebase deploy --only functions:getOAuthUrl,functions:oauthCallback,functions:createGeneralMeeting
```

### Step 2: Get Authorization URL

**As a super_admin user**, call the `getOAuthUrl` function from your app:

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const getOAuthUrl = httpsCallable(functions, 'getOAuthUrl');

const result = await getOAuthUrl();
console.log(result.data.authUrl);
```

**Or use Firebase Console:**
1. Go to Firebase Console → Functions
2. Find `getOAuthUrl` function
3. Click "Test function"
4. Copy the returned `authUrl`

### Step 3: Authorize the Application

1. **Visit the authorization URL** from Step 2
2. **Sign in** with your Google account (must have Calendar access)
3. **Grant permissions** when prompted:
   - View and edit events on all your calendars
   - Create and manage conference data

4. **You'll be redirected** to the callback URL
5. **See success message**: "Authorization Successful!"

### Step 4: Verify Token Storage

Check Firestore:
```
Collection: system_config
Document: oauth_tokens
Fields:
  - access_token
  - refresh_token
  - expiry_date
  - updated_at
```

---

## 🎉 Done!

All future meetings will automatically include Google Meet links!

---

## 🔧 How It Works

### Without OAuth (Before):
```
User books meeting
  ↓
Calendar event created (service account)
  ↓
❌ No Meet link (manual addition required)
```

### With OAuth (After):
```
User books meeting
  ↓
System checks for OAuth tokens
  ↓
✅ Tokens found → Use OAuth client
  ↓
Calendar event created WITH conferenceData
  ↓
✅ Google Meet link automatically generated!
  ↓
Link included in calendar invite
```

---

## 🔄 Token Refresh

Tokens are automatically refreshed when expired:

1. **Access token expires** (typically after 1 hour)
2. **System detects expiration** before API call
3. **Refresh token used** to get new access token
4. **New tokens stored** in Firestore
5. **API call proceeds** with fresh token

No manual intervention required! 🎉

---

## 🛡️ Security

### Credentials Protection:
- ✅ OAuth credentials in `.gitignore`
- ✅ Never committed to GitHub
- ✅ Stored securely in `functions/` folder
- ✅ Only accessible to Cloud Functions

### Token Security:
- ✅ Stored in Firestore (encrypted at rest)
- ✅ Only accessible by Cloud Functions
- ✅ Automatic refresh prevents expiration
- ✅ Scoped to calendar access only

### Access Control:
- ✅ Only `super_admin` can initiate OAuth flow
- ✅ OAuth consent screen limits (100 users until verified)
- ✅ Can revoke access anytime in Google Account settings

---

## 🔍 Troubleshooting

### Issue: "OAuth tokens not found"

**Solution:** Complete the authorization flow (Steps 2-3 above)

### Issue: "Permission denied"

**Solution:** Ensure you're signed in as `super_admin` role

### Issue: "Invalid conference type value"

**Solution:** OAuth tokens may be expired or invalid. Re-authorize:
1. Delete `system_config/oauth_tokens` document in Firestore
2. Repeat Steps 2-3

### Issue: Meet link not appearing

**Check:**
1. OAuth tokens exist in Firestore
2. Function logs show "Using OAuth client"
3. `conferenceData` in calendar event response

---

## 📊 Monitoring

### Check if OAuth is working:

**Function Logs:**
```
✅ "Using OAuth client for Meet link generation"
✅ "useOAuth: true"
✅ "willCreateMeetLink: true"
```

**Calendar Event:**
```json
{
  "conferenceData": {
    "entryPoints": [
      {
        "entryPointType": "video",
        "uri": "https://meet.google.com/xxx-yyyy-zzz"
      }
    ]
  }
}
```

---

## 🎯 Testing

### Test the complete flow:

1. **Book a meeting** via `/contact` page
2. **Check function logs** for OAuth usage
3. **View calendar event** in Google Calendar
4. **Verify Meet link** is present
5. **Click "Join Meeting"** to test the link

---

## 📝 Notes

- **OAuth consent screen** is in testing mode (100 user limit)
- **Production verification** may take several days if needed
- **Tokens never expire** as long as refresh token is valid
- **Graceful fallback** to service account if OAuth fails

---

## 🆘 Support

If you encounter issues:

1. Check function logs in Firebase Console
2. Verify OAuth tokens in Firestore
3. Test with a fresh authorization
4. Contact support with error messages

---

**Last Updated:** December 24, 2025
**Status:** ✅ Implemented and Ready for Setup
