# 📅 Google Calendar Integration Setup Guide

## Overview

This guide will help you set up **real Google Calendar integration** for the SHELTR Investor Relations booking system. Once complete, meetings booked through the platform will automatically:

✅ Create events in your Google Calendar  
✅ Generate Google Meet links  
✅ Send email invitations to all attendees  
✅ Store meeting records in Firestore  
✅ Provide automated reminders

---

## 🚀 Quick Start (5 Steps)

### Step 1: Enable Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project: **sheltr-ai**
3. Navigate to: **APIs & Services** > **Library**
4. Search for: **"Google Calendar API"**
5. Click: **Enable**

---

### Step 2: Create Service Account

1. In Google Cloud Console, go to: **APIs & Services** > **Credentials**
2. Click: **Create Credentials** > **Service Account**
3. Fill in the form:
   - **Name:** `sheltr-calendar-service`
   - **Description:** "Service account for SHELTR investor meeting calendar"
4. Grant role: **Editor** (or specifically **"Google Calendar API" > "Calendar Editor"**)
5. Click: **Done**

---

### Step 3: Download Service Account Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click: **Add Key** > **Create New Key** > **JSON**
4. Save the downloaded file as: `google-calendar-credentials.json`
5. **Move it to:** `/Users/mrjones/Github/Projects/sheltr-ai/functions/`

```bash
# Move the downloaded key to functions folder
mv ~/Downloads/sheltr-ai-*.json /Users/mrjones/Github/Projects/sheltr-ai/functions/google-calendar-credentials.json

# Verify it's there
ls -la /Users/mrjones/Github/Projects/sheltr-ai/functions/google-calendar-credentials.json
```

⚠️ **IMPORTANT:** Add this to `.gitignore` (already done):
```bash
functions/google-calendar-credentials.json
```

---

### Step 4: Share Your Google Calendar

1. Open [Google Calendar](https://calendar.google.com)
2. **Option A:** Create a new calendar (Recommended)
   - Click the **+** next to "Other calendars"
   - Select **"Create new calendar"**
   - Name it: **"SHELTR Investor Meetings"**
   - Click **Create calendar**

3. **Option B:** Use your existing calendar
   - Go to Settings > Select your calendar

4. **Share with Service Account:**
   - In calendar settings, scroll to **"Share with specific people"**
   - Click **Add people**
   - Paste the **service account email** from your JSON file (looks like):
     ```
     sheltr-calendar-service@sheltr-ai.iam.gserviceaccount.com
     ```
   - Set permission: **Make changes to events**
   - Uncheck **"Send email notification"** (it's a service account)
   - Click **Send**

5. **Get Calendar ID (if using custom calendar):**
   - In calendar settings, scroll to **"Integrate calendar"**
   - Copy the **Calendar ID** (looks like an email address)
   - Update `functions/src/calendar.ts` line 132:
     ```typescript
     calendarId: 'c_5678f9f5e708852d32e378ba9b4bbbc30a22a1038a5beb4465cc4b598f8ae7b1@group.calendar.google.com',
     ```
   
   **Current Configuration:**
   - Calendar: **SHELTR Investor Meetings** (admin@arcanaconcept.com)
   - Calendar ID: `c_5678f9f5e708852d32e378ba9b4bbbc30a22a1038a5beb4465cc4b598f8ae7b1@group.calendar.google.com`
   - Shared with: `sheltr-ai@appspot.gserviceaccount.com`
   - Attendees: `joel@arcanaconcept.com`, `alexander@arcanaconcept.com`

---

### Step 5: Install Dependencies & Deploy

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai/functions

# Install required packages
npm install googleapis @google-cloud/firestore

# Build functions
npm run build

# Deploy to Firebase
cd ..
firebase deploy --only functions

# Or deploy everything
./deploy.sh
# Choose option that includes functions
```

---

## 🧪 Testing the Integration

### 1. **Local Testing (Emulator)**

```bash
# Start Firebase emulators
cd /Users/mrjones/Github/Projects/sheltr-ai
firebase emulators:start

# In another terminal, start Next.js dev server
cd apps/web
npm run dev
```

Then visit: `http://localhost:3000/portal/founders-only/investor-relations`

⚠️ **Note:** Emulator can't send real calendar invites, but you'll see logs.

---

### 2. **Production Testing**

1. Deploy everything:
   ```bash
   ./deploy.sh
   ```

2. Visit production: `https://sheltr-ai.web.app/portal/founders-only/investor-relations`

3. Book a test meeting:
   - **Name:** Test Investor
   - **Email:** your-test-email@gmail.com (use a real email you can check)
   - **Company:** Test Ventures
   - **Investment Range:** $100,000 - $250,000
   - **Date:** Tomorrow
   - **Time:** 2:00 PM
   - **Notes:** Test booking

4. **Check Results:**
   - ✅ You should see a success message with Google Meet link
   - ✅ Check your test email inbox for calendar invite
   - ✅ Check Google Calendar for the event
   - ✅ Check Firebase Console > Firestore > `investor_meetings` collection
   - ✅ Check Firebase Console > Functions > Logs

---

## 📊 Viewing Scheduled Meetings

### Option A: Google Calendar
- Open your [Google Calendar](https://calendar.google.com)
- All meetings appear in the shared calendar

### Option B: Firestore Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **sheltr-ai** project
3. Navigate to **Firestore Database**
4. Open the **investor_meetings** collection

Each meeting record includes:
```json
{
  "eventId": "google_calendar_event_id",
  "investorEmail": "investor@example.com",
  "investorName": "John Doe",
  "company": "Acme Ventures",
  "investmentRange": "$100,000 - $250,000",
  "meetingDateTime": "2025-10-29T14:00:00.000Z",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "status": "scheduled",
  "additionalNotes": "Interested in pre-seed",
  "scheduledAt": "2025-10-27T12:34:56Z",
  "createdAt": "2025-10-27T12:34:56Z"
}
```

### Option C: Build Admin Dashboard (Future Enhancement)
Create a page at `/dashboard/investor-meetings` to view/manage all bookings.

---

## 🔧 Configuration Options

### Customize Meeting Duration
Edit `functions/src/calendar.ts` line 66:
```typescript
const endTime = new Date(startTime.getTime() + 45 * 60000); // 45 minutes
```

Change `45` to desired minutes (e.g., `30`, `60`, `90`)

---

### Add More Attendees
Edit `functions/src/calendar.ts` lines 88-93:
```typescript
attendees: [
  { email: investorEmail, displayName: investorName },
  { email: 'investors@sheltr-ai.com', displayName: 'SHELTR-AI Investment Team' },
  { email: 'joel.yaffe@gmail.com', displayName: 'Joel Yaffe' }, // Add team members
  { email: 'another@sheltr-ai.com', displayName: 'Another Team Member' },
],
```

---

### Customize Email Reminders
Edit `functions/src/calendar.ts` lines 102-108:
```typescript
reminders: {
  useDefault: false,
  overrides: [
    { method: 'email', minutes: 24 * 60 }, // 1 day before
    { method: 'email', minutes: 60 },      // 1 hour before
    { method: 'popup', minutes: 15 },      // 15 minutes before (for Google Calendar users)
  ],
},
```

---

### Change Timezone
Edit `functions/src/calendar.ts` lines 81 & 85:
```typescript
start: {
  dateTime: startTime.toISOString(),
  timeZone: 'America/New_York', // Change to your timezone
},
end: {
  dateTime: endTime.toISOString(),
  timeZone: 'America/New_York', // Change to your timezone
},
```

[Full list of timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

---

## 🔒 Security Considerations

### ✅ Already Implemented:
- Service account authentication (not exposed to client)
- Firestore security rules (only admins can read meetings)
- Firebase Functions (server-side validation)
- No API keys in frontend code

### 🛡️ Optional Enhancements:
1. **Rate Limiting:** Prevent spam bookings
   ```typescript
   // Add to functions/src/calendar.ts
   // Check if email has booked in last 24 hours
   ```

2. **Email Verification:** Require valid email domains
   ```typescript
   if (!investorEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
     throw new functions.https.HttpsError('invalid-argument', 'Invalid email');
   }
   ```

3. **Authentication Required:** Force login before booking
   ```typescript
   if (!context.auth) {
     throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
   }
   ```

---

## 🐛 Troubleshooting

### Issue: "Failed to create calendar event"

**Check Function Logs:**
```bash
# View live logs
firebase functions:log --only createInvestorMeeting

# Or in Firebase Console:
# Functions > Dashboard > Logs
```

**Common Causes:**
1. **Service account not shared with calendar**
   - Go to Google Calendar settings
   - Verify service account email has "Make changes to events" permission

2. **Wrong calendar ID**
   - If using custom calendar, update `calendarId` in `calendar.ts`

3. **Missing credentials file**
   - Verify `functions/google-calendar-credentials.json` exists
   - Check file permissions: `chmod 600 functions/google-calendar-credentials.json`

4. **API not enabled**
   - Go to Google Cloud Console
   - APIs & Services > Library
   - Search "Google Calendar API" and ensure it's enabled

---

### Issue: "Calendar event created but no email sent"

**Check:**
1. `sendUpdates: 'all'` is set in `functions/src/calendar.ts` (line 109)
2. Attendee emails are valid
3. Check spam folder

**Solution:**
Google Calendar sends emails automatically when `sendUpdates: 'all'`. If not working:
- Verify attendee email format is correct
- Check Google Calendar spam settings
- Manually resend from Google Calendar

---

### Issue: "Functions deploy fails"

```bash
# Clean build
cd /Users/mrjones/Github/Projects/sheltr-ai/functions
rm -rf node_modules lib
npm install
npm run build

# Deploy again
cd ..
firebase deploy --only functions
```

---

## 📈 Monitoring & Analytics

### View Function Metrics
1. [Firebase Console](https://console.firebase.google.com/)
2. **Functions** > **Dashboard**
3. Click: **createInvestorMeeting**

You'll see:
- Invocations (total bookings)
- Errors
- Execution time
- Memory usage

---

### Enable Detailed Logging

Add to `functions/src/calendar.ts`:
```typescript
functions.logger.info('Meeting created', {
  investorName,
  investorEmail,
  meetingDateTime: startTime.toISOString(),
  eventId: response.data.id,
});
```

View logs:
```bash
firebase functions:log --only createInvestorMeeting
```

---

## 🎯 Next Steps

1. **Set up email notifications** (SendGrid/Gmail API)
2. **Build admin dashboard** to view all bookings
3. **Add calendar sync** to participant dashboards
4. **Implement waiting room** for high-demand times
5. **Add Zoom/Teams integration** as alternative to Google Meet

---

## 📚 Related Documentation

- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Google Calendar API](https://developers.google.com/calendar/api/v3/reference)
- [Investor Meeting Scheduler Guide](./INVESTOR-MEETING-SCHEDULER-GUIDE.md)
- [Investor Relations Enhancements](./INVESTOR-RELATIONS-ENHANCEMENTS.md)

---

## ✅ Quick Checklist

Before going live, verify:

- [ ] Google Calendar API enabled
- [ ] Service account created
- [ ] `google-calendar-credentials.json` in `/functions/`
- [ ] Service account shared with calendar
- [ ] Dependencies installed (`googleapis`, `@google-cloud/firestore`)
- [ ] Functions deployed to Firebase
- [ ] Firestore rules updated
- [ ] Test booking completed successfully
- [ ] Calendar event appears in Google Calendar
- [ ] Email invite received
- [ ] Meeting link works
- [ ] Firestore record created

---

**🎉 Once all steps are complete, your Google Calendar integration is live!**

Meetings booked through the platform will automatically sync to your calendar with Google Meet links and email notifications.

---

*Last Updated: October 27, 2025*

