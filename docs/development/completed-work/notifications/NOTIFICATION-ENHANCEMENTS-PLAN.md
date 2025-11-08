# 🚀 Notification System Enhancements - Implementation Plan
**Date:** October 21, 2025  
**Time:** 3:30 PM EST  
**Status:** PLANNING → IMPLEMENTATION

---

## 🎯 Enhancement Goals

1. **Push Notifications** - Browser API integration
2. **Email Digests** - Daily/weekly summaries
3. **Notification Preferences** - Per-user settings
4. **Export to CSV** - Download notification history

---

## 📋 Phase 1: Push Notifications (Browser API)

### **Overview:**
Implement browser push notifications using the Web Push API and Firebase Cloud Messaging (FCM).

### **Features:**
- ✅ Request notification permission on first visit
- ✅ Send browser notifications for new alerts
- ✅ Handle notification clicks (navigate to relevant page)
- ✅ Background notifications when tab is closed
- ✅ Notification sound and icon
- ✅ Per-user notification toggle

### **Technical Stack:**
- **Frontend:** Service Worker + Push API
- **Backend:** Firebase Cloud Messaging (FCM)
- **Storage:** User preferences in Firestore

### **Implementation Steps:**

#### 1. **Service Worker Setup**
```typescript
// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
```

#### 2. **Frontend Permission Request**
```typescript
// hooks/usePushNotifications.ts
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  
  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      await subscribeToNotifications();
    }
  };
  
  const subscribeToNotifications = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
    });
    // Save subscription to Firestore
    await savePushSubscription(subscription);
  };
}
```

#### 3. **Backend Push Notification Service**
```python
# services/push_notification_service.py
from firebase_admin import messaging

async def send_push_notification(
    user_id: str,
    title: str,
    message: str,
    url: str
):
    # Get user's push subscription from Firestore
    subscription = await get_user_push_subscription(user_id)
    
    if not subscription:
        return
    
    # Send via FCM
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=message
        ),
        data={'url': url},
        token=subscription['token']
    )
    
    response = messaging.send(message)
    return response
```

#### 4. **Integration Points**
- Contact form submission → Push to Platform Admin
- Newsletter signup → Push to Platform Admin
- Donation received → Push to Participant
- New message → Push to recipient

---

## 📋 Phase 2: Email Digests

### **Overview:**
Send periodic email summaries of notifications (daily/weekly).

### **Features:**
- ✅ Daily digest (8am local time)
- ✅ Weekly digest (Monday 8am)
- ✅ Customizable per user
- ✅ Unread notifications summary
- ✅ HTML email templates
- ✅ One-click unsubscribe

### **Technical Stack:**
- **Email Service:** SendGrid or Firebase Extensions
- **Scheduler:** Firebase Cloud Functions (Pub/Sub)
- **Templates:** HTML email templates with Tailwind CSS

### **Implementation Steps:**

#### 1. **Email Template**
```html
<!-- email-templates/notification-digest.html -->
<!DOCTYPE html>
<html>
<head>
  <style>/* Tailwind CSS inline styles */</style>
</head>
<body>
  <div class="container">
    <h1>Your SHELTR Notifications Digest</h1>
    <p>You have {{ unread_count }} unread notifications</p>
    
    <div class="notifications">
      {% for notification in notifications %}
      <div class="notification-item">
        <h3>{{ notification.title }}</h3>
        <p>{{ notification.message }}</p>
        <a href="{{ notification.url }}">View in Dashboard</a>
      </div>
      {% endfor %}
    </div>
    
    <a href="{{ unsubscribe_url }}">Unsubscribe</a>
  </div>
</body>
</html>
```

#### 2. **Cloud Function (Scheduled)**
```typescript
// functions/src/scheduledDigests.ts
export const sendDailyDigests = functions.pubsub
  .schedule('0 8 * * *') // Daily at 8am UTC
  .onRun(async (context) => {
    const users = await getUsersWithEmailDigest('daily');
    
    for (const user of users) {
      const unreadNotifications = await getUnreadNotifications(user.id);
      
      if (unreadNotifications.length > 0) {
        await sendDigestEmail(user.email, {
          notifications: unreadNotifications,
          unread_count: unreadNotifications.length,
          user_name: user.displayName
        });
      }
    }
  });
```

#### 3. **Email Service Integration**
```typescript
// services/emailDigestService.ts
import sgMail from '@sendgrid/mail';

export async function sendDigestEmail(
  email: string,
  data: {
    notifications: Notification[];
    unread_count: number;
    user_name: string;
  }
) {
  const html = renderTemplate('notification-digest', data);
  
  await sgMail.send({
    to: email,
    from: 'notifications@sheltr-ai.app',
    subject: `You have ${data.unread_count} unread notifications`,
    html: html
  });
}
```

---

## 📋 Phase 3: Notification Preferences

### **Overview:**
Allow users to customize notification settings per category and delivery method.

### **Features:**
- ✅ Toggle notifications by category
- ✅ Choose delivery methods (in-app, push, email)
- ✅ Set digest frequency (daily, weekly, never)
- ✅ Quiet hours (mute notifications during sleep)
- ✅ Priority threshold (only high/urgent)

### **Database Schema:**
```typescript
interface NotificationPreferences {
  userId: string;
  
  // Delivery methods
  inApp: boolean;
  push: boolean;
  email: boolean;
  
  // Email digest
  emailDigest: 'never' | 'daily' | 'weekly';
  emailDigestTime: string; // "08:00"
  
  // Category preferences
  categories: {
    contact: boolean;
    newsletter: boolean;
    donation: boolean;
    security: boolean;
    system: boolean;
    participant: boolean;
    shelter: boolean;
  };
  
  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "08:00"
  
  // Priority filter
  minPriority: 'low' | 'normal' | 'high' | 'urgent';
  
  updatedAt: Timestamp;
}
```

### **UI Component:**
```typescript
// components/NotificationPreferences.tsx
export function NotificationPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Customize how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Methods */}
        <div>
          <h3 className="font-semibold mb-3">Delivery Methods</h3>
          <div className="space-y-2">
            <Switch checked={preferences?.inApp} label="In-App Notifications" />
            <Switch checked={preferences?.push} label="Push Notifications" />
            <Switch checked={preferences?.email} label="Email Notifications" />
          </div>
        </div>
        
        {/* Email Digest */}
        <div>
          <h3 className="font-semibold mb-3">Email Digest</h3>
          <Select value={preferences?.emailDigest}>
            <SelectItem value="never">Never</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </Select>
        </div>
        
        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            {Object.entries(preferences?.categories || {}).map(([cat, enabled]) => (
              <Switch key={cat} checked={enabled} label={cat} />
            ))}
          </div>
        </div>
        
        {/* Quiet Hours */}
        <div>
          <h3 className="font-semibold mb-3">Quiet Hours</h3>
          <Switch checked={preferences?.quietHoursEnabled} />
          {preferences?.quietHoursEnabled && (
            <div className="flex gap-4 mt-2">
              <Input type="time" value={preferences.quietHoursStart} />
              <Input type="time" value={preferences.quietHoursEnd} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 📋 Phase 4: Export to CSV

### **Overview:**
Allow users to download their notification history as CSV for archival/reporting.

### **Features:**
- ✅ Export all notifications or filtered subset
- ✅ Date range selection
- ✅ Category filter
- ✅ CSV format with headers
- ✅ Direct download (no server storage)

### **Implementation:**

#### 1. **Frontend Export Function**
```typescript
// utils/exportNotifications.ts
export function exportNotificationsToCSV(
  notifications: UnifiedNotification[],
  filename: string = 'notifications.csv'
) {
  // Create CSV headers
  const headers = [
    'ID',
    'Date',
    'Time',
    'Category',
    'Priority',
    'Title',
    'Message',
    'Read Status',
    'Created At'
  ];
  
  // Convert notifications to CSV rows
  const rows = notifications.map(n => [
    n.id,
    formatDate(n.created_at),
    formatTime(n.created_at),
    n.category,
    n.priority,
    `"${n.title}"`, // Escape quotes
    `"${n.message}"`,
    n.isRead ? 'Read' : 'Unread',
    n.created_at.toISOString()
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
```

#### 2. **Export UI Component**
```typescript
// components/ExportNotificationsDialog.tsx
export function ExportNotificationsDialog() {
  const { notifications } = useNotifications();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const handleExport = () => {
    // Filter notifications
    let filtered = notifications;
    
    if (dateRange) {
      filtered = filtered.filter(n => 
        n.created_at >= dateRange.from && 
        n.created_at <= dateRange.to
      );
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(n => 
        selectedCategories.includes(n.category)
      );
    }
    
    // Export
    exportNotificationsToCSV(
      filtered,
      `notifications-${formatDate(new Date())}.csv`
    );
  };
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Notifications</DialogTitle>
          <DialogDescription>
            Export your notification history as CSV
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Date Range Picker */}
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          
          {/* Category Filter */}
          <MultiSelect
            options={NOTIFICATION_CATEGORIES}
            value={selectedCategories}
            onChange={setSelectedCategories}
          />
          
          {/* Preview Count */}
          <p className="text-sm text-muted-foreground">
            {filtered.length} notifications will be exported
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

#### 3. **Add Export Button to Notifications Page**
```typescript
// In NotificationList component
<div className="flex items-center justify-between mb-4">
  <h2>Notifications</h2>
  <div className="flex gap-2">
    <Button variant="outline" onClick={() => setShowExportDialog(true)}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  </div>
</div>
```

---

## 🗂️ File Structure

```
apps/web/src/
├── hooks/
│   ├── usePushNotifications.ts          ✨ NEW
│   └── useNotificationPreferences.ts    ✨ NEW
│
├── components/
│   ├── notifications/
│   │   ├── NotificationPreferences.tsx  ✨ NEW
│   │   └── ExportDialog.tsx             ✨ NEW
│   └── PushNotificationPrompt.tsx       ✨ NEW
│
├── services/
│   ├── pushNotificationService.ts       ✨ NEW
│   └── emailDigestService.ts            ✨ NEW
│
├── utils/
│   └── exportNotifications.ts           ✨ NEW
│
└── public/
    └── sw.js                             ✨ NEW (Service Worker)

apps/api/
├── services/
│   ├── push_notification_service.py     ✨ NEW
│   └── email_digest_service.py          ✨ NEW
│
└── routers/
    └── notification_preferences.py      ✨ NEW

functions/
└── src/
    └── scheduledDigests.ts              ✨ NEW
```

---

## 📊 Implementation Priority

### **Priority 1: Push Notifications** (1-2 hours)
- Service Worker setup
- Permission request UI
- FCM integration
- Test with contact form

### **Priority 2: Notification Preferences** (1-2 hours)
- Database schema
- Preferences UI
- Save/load preferences
- Apply filters to notifications

### **Priority 3: Export to CSV** (30 minutes)
- Export utility function
- Export dialog UI
- Add to notifications page

### **Priority 4: Email Digests** (2-3 hours)
- Email templates
- Cloud Function scheduler
- SendGrid integration
- Test daily/weekly delivery

---

## 🧪 Testing Plan

### **Push Notifications:**
- [ ] Request permission dialog appears
- [ ] Permission saved to Firestore
- [ ] Push sent on contact form submission
- [ ] Notification appears in browser
- [ ] Click notification navigates to page
- [ ] Works when tab is closed

### **Email Digests:**
- [ ] Daily digest sent at correct time
- [ ] Weekly digest sent on Monday
- [ ] Unsubscribe link works
- [ ] HTML renders correctly
- [ ] Only includes unread notifications

### **Preferences:**
- [ ] All toggles save correctly
- [ ] Category filters work
- [ ] Quiet hours respected
- [ ] Priority threshold applied
- [ ] Changes persist after logout

### **CSV Export:**
- [ ] All notifications export
- [ ] Date range filter works
- [ ] Category filter works
- [ ] CSV format is correct
- [ ] Special characters escaped
- [ ] Downloads successfully

---

## 🎯 Success Criteria

- ✅ Users can enable browser push notifications
- ✅ Users receive email digests (daily/weekly)
- ✅ Users can customize notification preferences
- ✅ Users can export notification history to CSV
- ✅ All features work across all user roles
- ✅ Preferences persist across sessions
- ✅ No impact on existing functionality

---

**Ready to implement! Let's build these enhancements! 🚀**

