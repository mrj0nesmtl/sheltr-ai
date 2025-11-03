# Investor Relations Sharing System - Complete Guide

**Version:** 2.87.0  
**Last Updated:** November 3, 2025  
**Status:** ✅ Fully Functional

---

## 🎯 Overview

The IR Sharing System allows you to control which documents from the Founders Portal are visible to investors in the Investor Data Room. It provides a simple toggle interface with full persistence and visual feedback.

---

## 📋 How It Works

### **1. What Gets Shared**

When you toggle a document **ON** to share to the IR Data Room:

✅ **Document Card** appears in `/ir/dataroom` Investment Documents section  
✅ **Full Document Content** becomes accessible when investors click the card  
✅ **All Metadata** (title, description, badges) is preserved  
✅ **Updates** to the source document automatically reflect in IR  

When you toggle a document **OFF**:

❌ **Card is removed** from IR Data Room immediately  
❌ **Content becomes inaccessible** to investors  
❌ **No trace** remains in the Data Room

---

## 🔄 Complete Flow

### **Step 1: Founders Portal**
```
/portal/founders-only
```

1. Navigate to the Founders Portal
2. Scroll to "Quick Access Links" section
3. Each document card has a toggle section:
   - **Label Changes Based on State:**
     - OFF: "Share to Investor Data Room" (gray background)
     - ON: "Shared with Investors" (blue background)
   - **Helper Text:**
     - OFF: "Toggle ON to make visible to investors"
     - ON: "Toggle OFF to remove from Data Room"

### **Step 2: Toggle ON (Share)**
```
Click the switch → Toggle turns blue
```

**What Happens:**
- ✅ Immediately updates local state (responsive UI)
- ✅ Saves to Firestore `knowledge_documents.published_to_ir = true`
- ✅ Shows success toast: "Added to IR Data Room"
- ✅ Card displays blue "Shared to IR" badge
- ✅ Toggle section turns blue
- ✅ Document appears in IR Data Room

**Toast Message:**
```
✅ Added to IR Data Room
"Document Title" is now visible to investors. The document 
card and full content will appear in the Investor Data Room.
```

### **Step 3: Verify in IR Data Room**
```
/ir/dataroom → Investment Documents accordion
```

- Document card now appears in the grid
- Investors can click "View Document" 
- Full content loads via iframe

### **Step 4: Toggle OFF (Remove)**
```
Click the switch again → Toggle turns gray
```

**What Happens:**
- ✅ Immediately updates local state
- ✅ Saves to Firestore `knowledge_documents.published_to_ir = false`
- ✅ Shows success toast: "Removed from IR Data Room"
- ✅ Blue "Shared to IR" badge disappears
- ✅ Toggle section turns gray
- ✅ Document removed from IR Data Room

**Toast Message:**
```
🗑️ Removed from IR Data Room
"Document Title" is no longer visible to investors and has 
been removed from the Data Room.
```

---

## 🎨 Visual Indicators

### **Card Badge (Top)**
- **When Shared:** Blue badge with shield icon: "Shared to IR"
- **When Not Shared:** No badge

### **Toggle Section**
- **Shared State:**
  - 🔵 Blue background (`bg-blue-50`)
  - 🔵 Blue border (`border-blue-300`)
  - 🔵 Blue shield icon
  - **Label:** "Shared with Investors"
  - **Helper:** "Toggle OFF to remove from Data Room"

- **Not Shared State:**
  - ⚫ Gray background (`bg-muted/50`)
  - ⚫ Gray border
  - 🔴 Red shield icon
  - **Label:** "Share to Investor Data Room"
  - **Helper:** "Toggle ON to make visible to investors"

---

## 🗄️ Database Schema

### **Knowledge Documents Collection**
```typescript
knowledge_documents/{documentId}
{
  title: string,
  description: string,
  published_to_founders: boolean,  // Shows in Founders Portal
  published_to_ir: boolean,        // Shows in IR Data Room ⭐
  published_to_hub: boolean,       // Shows in Public Docs Hub
  updated_at: timestamp
}
```

### **Secure Documents Collection (Fallback)**
```typescript
secure_documents/{documentId}
{
  title: string,
  description: string,
  isInvestorDataRoom: boolean,  // Legacy field for hardcoded cards
  updatedAt: string
}
```

---

## 🔍 How State is Loaded

### **On Page Load**
```typescript
1. Load dynamic documents from knowledge_documents
2. Merge with hardcoded cards
3. For EACH card, check sharing status:
   
   Priority Order:
   a) Check knowledge_documents.published_to_ir
   b) Fallback to secure_documents.isInvestorDataRoom
   c) Default to false if neither exists
   
4. Update UI with correct toggle states
5. Display "Shared to IR" badges where applicable
```

**Console Logs:**
- `✅ KB Doc {id}: published_to_ir = true/false`
- `📁 Secure Doc {id}: isInvestorDataRoom = true/false`
- `ℹ️ Card {id}: No sharing data found, defaulting to OFF`

---

## 🔧 Technical Implementation

### **Toggle Handler**
```typescript
handleToggleInvestorDataRoom(cardId, value)

1. Find card data
2. Update local state (immediate UI feedback)
3. Check if document exists in knowledge_documents:
   - YES: Update published_to_ir field
   - NO: Update secure_documents collection (hardcoded cards)
4. Show success toast with clear message
5. On error: Revert UI state + show error toast
```

### **Single Source of Truth**
- **For dynamic documents:** `knowledge_documents.published_to_ir`
- **For hardcoded cards:** `secure_documents.isInvestorDataRoom`
- **Priority:** Knowledge Base always takes precedence

---

## 📊 What Investors See

### **Before Sharing:**
```
/ir/dataroom
→ Investment Documents section
→ Document NOT visible in grid
```

### **After Sharing:**
```
/ir/dataroom
→ Investment Documents section  
→ Document card appears with:
   - Badge (e.g., "Pre-Seed", "Secure", "Strategic")
   - Title
   - Description
   - "View Document" button

→ Click "View Document"
→ Opens /ir/documents/{documentId}
→ Full document content displayed via iframe
```

---

## ❓ FAQ

### **Q: Why are all toggles OFF when I reload the page?**
**A:** FIXED in v2.87.0! The system now properly loads state from both `knowledge_documents` and `secure_documents` collections.

### **Q: How do I know which documents are currently shared?**
**A:** Look for:
1. Blue "Shared to IR" badge on the card
2. Blue-highlighted toggle section
3. Toggle switch in ON position
4. Label says "Shared with Investors"

### **Q: How do I remove a document from the IR Data Room?**
**A:** Simply toggle the switch OFF. The document will be immediately removed from the Data Room.

### **Q: What happens if I update a document that's already shared?**
**A:** The toggle stays ON, but the content link remains the same. The IR will show the updated content automatically.

### **Q: Can I share multiple documents at once?**
**A:** No, each document must be toggled individually. This is intentional for security and control.

### **Q: What if I delete a document from the Knowledge Base?**
**A:** If a document is deleted from Knowledge Base:
- The card will disappear from Founders Portal
- It will automatically be removed from IR Data Room
- No orphaned data remains

---

## 🚀 Best Practices

### **1. Before Sharing**
- ✅ Review document content for investor readiness
- ✅ Ensure sensitive founder-only info is removed
- ✅ Verify all financial data is accurate
- ✅ Check that links and references work

### **2. When Sharing**
- ✅ Read the toast confirmation
- ✅ Verify the blue "Shared to IR" badge appears
- ✅ Test by viewing in IR Data Room
- ✅ Confirm document content loads properly

### **3. When Removing**
- ✅ Verify the document is no longer needed by investors
- ✅ Check that no investor communications reference it
- ✅ Confirm removal by checking IR Data Room
- ✅ Document removal in internal notes if needed

### **4. Regular Maintenance**
- 📅 Review shared documents monthly
- 📅 Remove outdated materials
- 📅 Update descriptions as needed
- 📅 Ensure all shared docs are current

---

## 🐛 Troubleshooting

### **Problem: Toggle doesn't change state**
**Solution:**
1. Check browser console for errors
2. Verify you're logged in as Platform Admin
3. Check Firestore permissions
4. Try refreshing the page

### **Problem: Document shared but not visible in IR**
**Solution:**
1. Check if investor is logged in correctly
2. Verify document's `published_to_ir = true` in Firestore
3. Check IR Data Room's hardcoded document list
4. Clear browser cache

### **Problem: Toggle shows OFF but document is in IR**
**Solution:**
1. This was the old bug (fixed in v2.87.0)
2. If it persists, check both database collections
3. Report issue with document ID for investigation

---

## 📞 Support

**For technical issues:**
- Check console logs in browser DevTools
- Review Firestore rules and permissions
- Contact platform administrators

**For feature requests:**
- Document the use case
- Explain the current limitation
- Suggest the desired behavior

---

**End of Guide**

