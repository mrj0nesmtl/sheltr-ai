# 📅 Google Calendar Integration - Quick Setup Checklist

## 5-Minute Setup to Go Live! ⚡

### ✅ Step 1: Enable API (2 minutes)
```bash
# 1. Open: https://console.cloud.google.com/
# 2. Select project: sheltr-ai
# 3. Go to: APIs & Services > Library
# 4. Search: "Google Calendar API"
# 5. Click: Enable
```

---

### ✅ Step 2: Create Service Account (2 minutes)
```bash
# 1. Go to: APIs & Services > Credentials
# 2. Click: Create Credentials > Service Account
# 3. Name: sheltr-calendar-service
# 4. Role: Editor
# 5. Click: Done
# 6. Click on the service account
# 7. Keys tab > Add Key > Create New Key > JSON
# 8. Download saves as: sheltr-ai-xxxxx.json
```

**Move the file:**
```bash
mv ~/Downloads/sheltr-ai-*.json /Users/mrjones/Github/Projects/sheltr-ai/functions/google-calendar-credentials.json
```

---

### ✅ Step 3: Share Calendar (1 minute)
```bash
# 1. Open: https://calendar.google.com
# 2. Settings (gear) > Settings
# 3. Select your calendar (or create "SHELTR Investor Meetings")
# 4. "Share with specific people" > Add people
# 5. Paste service account email from JSON file:
#    sheltr-calendar-service@sheltr-ai.iam.gserviceaccount.com
# 6. Permission: Make changes to events
# 7. Uncheck: Send email notification
# 8. Click: Send
```

---

### ✅ Step 4: Deploy Functions (2 minutes)
```bash
cd /Users/mrjones/Github/Projects/sheltr-ai/functions

# Install dependencies
npm install googleapis @google-cloud/firestore

# Deploy
cd ..
firebase deploy --only functions

# OR use deploy script
./deploy.sh
# (Select option that includes functions)
```

---

### ✅ Step 5: Test It! (1 minute)
```bash
# 1. Visit: https://sheltr-ai.web.app/portal/founders-only/investor-relations
# 2. Fill out booking form
# 3. Submit
# 4. Check:
#    - Success message with Google Meet link ✅
#    - Your email for calendar invite ✅
#    - Google Calendar for the event ✅
#    - Firestore > investor_meetings collection ✅
```

---

## 🎉 You're Live!

Once all 5 steps are complete, investors can book meetings directly from your website!

**What happens automatically:**
- ✅ Calendar event created
- ✅ Google Meet link generated
- ✅ Email invitations sent
- ✅ Reminders scheduled (1 day + 1 hour before)
- ✅ Meeting saved to Firestore

---

## 📚 Full Documentation

For detailed setup, configuration, and troubleshooting:

**Read:** `docs/04-development/GOOGLE-CALENDAR-INTEGRATION-SETUP.md`

---

## 🆘 Quick Troubleshooting

### "Failed to create calendar event"
```bash
# Check function logs
firebase functions:log --only createInvestorMeeting

# Common fixes:
# 1. Verify service account is shared with calendar
# 2. Check google-calendar-credentials.json exists
# 3. Ensure Google Calendar API is enabled
```

### "Functions deploy fails"
```bash
cd functions
rm -rf node_modules lib
npm install
npm run build
cd ..
firebase deploy --only functions
```

---

**Questions?** See full guide: `docs/04-development/GOOGLE-CALENDAR-INTEGRATION-SETUP.md`

*Last Updated: October 27, 2025*

