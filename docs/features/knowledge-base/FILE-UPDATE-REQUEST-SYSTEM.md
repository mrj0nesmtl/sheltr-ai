# 📬 File Update Request System

**Last Updated**: November 25, 2025  
**Version**: 2.150.0  
**Status**: ✅ Production Ready

---

## 🎯 **Overview**

The File Update Request System allows users to request changes to source files (GitHub repository or local secure docs) when they need permanent content updates. This solves the problem of temporary UI edits being overwritten on the next sync.

---

## 🚀 **Features**

### **1. Clarification Banners**

#### **Info Banner (Blue)**
Located above the content editor, explains:
- ✅ What you're editing: Metadata and settings (title, category, tags, permissions)
- ✅ Where changes are saved: Firestore (persist until next sync)
- ⚠️ Content edits are temporary: Must edit source file for permanent changes
- 💡 How to request changes: Use "Request File Update" button

#### **Warning Banner (Amber)**
Located below the content textarea:
- ⚠️ Reminds users that content edits are temporary
- 📝 Explains they'll be overwritten on next sync
- 💡 Suggests requesting file update or editing source directly

### **2. Request File Update Button**

- **Location**: Top-right of content editor header
- **Style**: Purple outline button with FileText icon
- **Action**: Opens File Update Request Modal
- **Visibility**: Always visible when editing a document

### **3. File Update Request Modal**

Beautiful modal with:

#### **Document Info Section**
- Document title
- Source type badge (GitHub or Secure Docs)
- File path (monospace font)

#### **Request Type Selection** (5 options)
- 📝 **Content Update**: General content updates
- ✏️ **Correction**: Fix typos, errors, inaccuracies
- ➕ **Addition**: Add new content or sections
- ➖ **Removal**: Remove outdated or incorrect content
- 💡 **Other**: Any other type of request

#### **Priority Selection** (4 levels)
- **Low**: Can wait, not urgent
- **Normal**: Standard priority (default)
- **High**: Important, needs attention soon
- **Urgent**: Critical, needs immediate attention

#### **Summary Field**
- One-line description
- 100 character limit
- Character counter
- Required field

#### **Details Field**
- Detailed explanation with Markdown support
- 2000 character limit
- Character counter
- Required field
- Placeholder with helpful prompts:
  - What needs to be updated?
  - Why is this change needed?
  - Any specific requirements or context?

#### **Info Alert**
- Explains request visibility (super admins)
- Notes that request persists until completed/rejected
- Mentions status update notifications

#### **Success State**
- Green checkmark animation
- Success message
- Auto-closes after 2 seconds

---

## 🔄 **Request Workflow**

### **User Flow**

```
1. User edits document
   ↓
2. Realizes content needs permanent change
   ↓
3. Clicks "Request File Update" button
   ↓
4. Fills out request form:
   - Selects request type
   - Sets priority
   - Writes summary
   - Provides details
   ↓
5. Submits request
   ↓
6. Request saved to Firestore
   ↓
7. Super admins notified
   ↓
8. User sees success message
```

### **Admin Flow**

```
1. Admin receives notification
   ↓
2. Views pending requests in dashboard
   ↓
3. Reviews request details
   ↓
4. Assigns to self (status: in_progress)
   ↓
5. Edits source file (GitHub/Local)
   ↓
6. Marks request as completed
   ↓
7. User notified of completion
```

---

## 🗄️ **Database Schema**

### **Collection**: `file_update_requests`

```typescript
interface FileUpdateRequest {
  // Document Reference
  document_id: string;           // Firestore document ID
  document_title: string;        // Human-readable title
  document_path: string;         // File path (e.g., "docs/features/...")
  source_type: 'github' | 'secure_docs';  // Where the file lives
  
  // Request Details
  request_type: 'content_update' | 'correction' | 'addition' | 'removal' | 'other';
  summary: string;               // Brief description (max 100 chars)
  details: string;               // Full description (max 2000 chars)
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Status Tracking
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  
  // User Attribution
  requested_by: string;          // User email
  requested_by_name: string;     // Display name
  
  // Admin Assignment (optional)
  assigned_to?: string;          // Admin email
  assigned_to_name?: string;     // Admin display name
  admin_notes?: string;          // Admin comments
  
  // Completion Tracking (optional)
  completed_at?: Timestamp;      // When completed
  rejected_reason?: string;      // Why rejected
  
  // Timestamps
  created_at: Timestamp;         // When created
  updated_at: Timestamp;         // Last updated
}
```

---

## 🔐 **Security Rules**

### **Firestore Rules**

```javascript
match /file_update_requests/{requestId} {
  // Read: Creator can read their own requests, admins can read all
  allow read: if isAuthenticated() && (
    resource.data.requested_by == request.auth.token.email ||
    isSuperAdmin() ||
    isPlatformAdmin()
  );
  
  // Create: Any authenticated user can create requests
  allow create: if isAuthenticated();
  
  // Update: Only admins can update (status, assignment, notes)
  allow update: if isSuperAdmin() || isPlatformAdmin();
  
  // Delete: Super Admin only
  allow delete: if isSuperAdmin();
}
```

### **Access Control**

| Action | Public | Authenticated | Admin | Super Admin |
|--------|--------|---------------|-------|-------------|
| Create Request | ❌ | ✅ | ✅ | ✅ |
| Read Own Requests | ❌ | ✅ | ✅ | ✅ |
| Read All Requests | ❌ | ❌ | ✅ | ✅ |
| Update Status | ❌ | ❌ | ✅ | ✅ |
| Assign Requests | ❌ | ❌ | ✅ | ✅ |
| Delete Requests | ❌ | ❌ | ❌ | ✅ |

---

## 📊 **Service API**

### **`fileUpdateRequestService.ts`**

#### **Create Request**
```typescript
await fileUpdateRequestService.createRequest({
  document_id: 'abc123',
  document_title: 'Adyen Integration',
  document_path: 'secure-docs/fintec/adyen_strategy.md',
  source_type: 'secure_docs',
  request_type: 'content_update',
  summary: 'Update pricing section',
  details: 'The pricing information is outdated...',
  priority: 'high',
  requested_by: 'user@example.com',
  requested_by_name: 'John Doe',
  status: 'pending'
});
```

#### **Get Requests for Document**
```typescript
const requests = await fileUpdateRequestService.getRequestsForDocument('abc123');
```

#### **Get Pending Requests (Admin)**
```typescript
const pending = await fileUpdateRequestService.getPendingRequests();
```

#### **Update Request Status**
```typescript
await fileUpdateRequestService.updateRequestStatus(
  'request123',
  'in_progress',
  'admin@example.com',
  'Admin User',
  'Working on this now'
);
```

#### **Reject Request**
```typescript
await fileUpdateRequestService.rejectRequest(
  'request123',
  'This change is not needed because...',
  'admin@example.com',
  'Admin User'
);
```

#### **Get Request Statistics**
```typescript
const stats = await fileUpdateRequestService.getRequestStats();
// Returns: { total: 10, pending: 3, in_progress: 2, completed: 4, rejected: 1 }
```

---

## 🎨 **UI Components**

### **FileUpdateRequestModal**

#### **Props**
```typescript
interface FileUpdateRequestModalProps {
  isOpen: boolean;                    // Modal visibility
  onClose: () => void;                // Close handler
  documentId: string;                 // Document ID
  documentTitle: string;              // Document title
  documentPath?: string;              // File path
  sourceType: 'github' | 'secure_docs';  // Source type
}
```

#### **Usage**
```tsx
<FileUpdateRequestModal
  isOpen={showRequestModal}
  onClose={() => setShowRequestModal(false)}
  documentId={documentId}
  documentTitle={document.title}
  documentPath={document.file_path}
  sourceType={document.synced_from_github ? 'github' : 'secure_docs'}
/>
```

---

## 💡 **Use Cases**

### **1. Fix Typo**
**Scenario**: User finds a typo in a document  
**Action**:
1. Click "Request File Update"
2. Select "Correction"
3. Set priority to "Normal"
4. Summary: "Fix typo in section 3"
5. Details: "Change 'recieve' to 'receive' in paragraph 2"
6. Submit

### **2. Update Outdated Information**
**Scenario**: Pricing information has changed  
**Action**:
1. Click "Request File Update"
2. Select "Content Update"
3. Set priority to "High"
4. Summary: "Update pricing section"
5. Details: "Current pricing is $X, should be $Y. Also add new tier..."
6. Submit

### **3. Add Missing Content**
**Scenario**: Important section is missing  
**Action**:
1. Click "Request File Update"
2. Select "Addition"
3. Set priority to "Urgent"
4. Summary: "Add security compliance section"
5. Details: "We need to add information about GDPR compliance..."
6. Submit

### **4. Remove Deprecated Content**
**Scenario**: Old feature documentation no longer relevant  
**Action**:
1. Click "Request File Update"
2. Select "Removal"
3. Set priority to "Low"
4. Summary: "Remove old API v1 docs"
5. Details: "API v1 was deprecated in 2024, remove all references..."
6. Submit

---

## 🔔 **Notifications** (Future Enhancement)

### **Planned Features**
- Email notifications to super admins on new requests
- In-app notification badge with count
- User notifications on status updates
- Slack/Discord webhook integration
- Request assignment notifications

---

## 📈 **Metrics** (Future Enhancement)

### **Admin Dashboard**
- Total requests (all time)
- Pending requests (current)
- In-progress requests
- Completed requests (last 30 days)
- Rejected requests (last 30 days)
- Average time to completion
- Requests by type (pie chart)
- Requests by priority (bar chart)
- Top requesters (leaderboard)

---

## 🎯 **Best Practices**

### **For Users**

1. **Be Specific**: Provide clear, detailed descriptions
2. **Set Appropriate Priority**: Don't mark everything as urgent
3. **Include Context**: Explain why the change is needed
4. **One Request Per Issue**: Don't bundle multiple unrelated changes
5. **Check Existing Requests**: Avoid duplicates

### **For Admins**

1. **Review Promptly**: Check pending requests daily
2. **Assign Yourself**: Update status to "in_progress" when starting
3. **Add Notes**: Document what you did
4. **Mark Complete**: Update status when done
5. **Communicate**: Reject with clear reasons if not feasible

---

## 🚧 **Future Enhancements**

### **Phase 2** (Q1 2026)
- [ ] Admin dashboard for viewing/managing requests
- [ ] Email notifications
- [ ] In-app notification system
- [ ] Request comments/discussion thread
- [ ] Attach screenshots to requests
- [ ] Link related requests
- [ ] Request templates

### **Phase 3** (Q2 2026)
- [ ] Automatic PR creation for GitHub requests
- [ ] Diff preview before/after changes
- [ ] Request voting/upvoting
- [ ] Request search and filtering
- [ ] Export requests to CSV
- [ ] Analytics dashboard
- [ ] SLA tracking

---

## 🎉 **Success Metrics**

- ✅ Users understand what's editable vs. what requires source file changes
- ✅ Clear path for requesting permanent content updates
- ✅ Admins notified and can track requests
- ✅ Reduced confusion about temporary UI edits
- ✅ Better collaboration between users and admins

---

**Great addition to the platform! 🚀**

