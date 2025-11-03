# Investor Relations Document Sharing Flow

**Complete Guide to Document Publishing & Visibility**

> **Version:** 2.87.0  
> **Last Updated:** November 3, 2025  
> **Author:** AI Development Assistant

---

## 🎯 Overview

This document explains the **complete flow** for how documents move through the SHELTR platform from creation to investor visibility, including the **single source of truth** architecture and persistent toggle states.

---

## 📊 Document Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     KNOWLEDGE BASE                              │
│                (Central Document Repository)                     │
│                                                                  │
│  Collection: knowledge_documents                                │
│  ├─ GitHub Sync (62+ docs)                                      │
│  ├─ Secure Docs (.local-secure-docs) (13 docs)                  │
│  └─ Fields:                                                      │
│     ├─ published_to_founders: boolean                           │
│     ├─ published_to_ir: boolean                                 │
│     ├─ published_to_hub: boolean                                │
│     ├─ permission_level: string                                 │
│     └─ synced_from_github: boolean                              │
└─────────────────────────────────────────────────────────────────┘
                    │
                    │ PUBLISH
                    ▼
┌──────────────────────────────────┬──────────────────────────────┐
│     FOUNDERS PORTAL              │   INVESTOR DATA ROOM         │
│  /portal/founders-only           │      /ir/dataroom            │
│                                  │                              │
│  Access:                         │  Access:                     │
│  ✅ super_admin                  │  ✅ investor                 │
│  ✅ platform_admin               │  ✅ super_admin              │
│                                  │  ✅ platform_admin           │
│                                  │                              │
│  Filter:                         │  Filter:                     │
│  published_to_founders == true   │  published_to_ir == true     │
└──────────────────────────────────┴──────────────────────────────┘
```

---

## 🔐 Security & Access Control

### Document Visibility Matrix

| Document Type | Knowledge Base | Founders Portal | Investor Data Room | Public Hub |
|--------------|----------------|-----------------|-------------------|------------|
| **GitHub Docs (Public)** | ✅ View/Edit | ❌ No | ❌ No | ✅ If `published_to_hub` |
| **Secure Docs (Private)** | ✅ View/Edit | ✅ If `published_to_founders` | ✅ If `published_to_ir` | ❌ Never |

### Role-Based Access

| Role | Knowledge Base | Founders Portal | Investor Data Room |
|------|----------------|-----------------|-------------------|
| **super_admin** | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| **platform_admin** | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| **investor** | ❌ No Access | ❌ No Access | ✅ View Only |
| **public** | ❌ No Access | ❌ No Access | ❌ No Access |

---

## 🚀 Publishing Flow

### Step 1: Upload Secure Document

**Location:** Knowledge Base Dashboard → Secure Document Sync

1. Super Admin uploads markdown file to `.local-secure-docs/`
2. Run sync script: Syncs to `knowledge_documents` collection
3. Document fields set:
   ```javascript
   {
     title: "Document Title",
     content: "...",
     permission_level: "founders",  // or "platform_admin", "super_admin"
     published_to_founders: false,  // Default
     published_to_ir: false,        // Default
     source_directory: ".local-secure-docs",
     synced_from_github: false
   }
   ```

### Step 2: Publish to Founders Portal

**Location:** Knowledge Base Dashboard → Document Card → "Secure Publishing" Tab

1. Toggle **"Publish to Founders Portal"** → ON
2. Backend updates `knowledge_documents`:
   ```javascript
   {
     published_to_founders: true,
     secure_slug: "msb-registration",
     secure_badge: "Legal",
     secure_badge_color: "red",
     founders_description: "Custom description..."
   }
   ```
3. Document now appears in **Founders Portal** (http://localhost:3000/portal/founders-only)

### Step 3: Share to Investor Data Room

**Location:** Founders Portal → Document Card → "Share to Investor Data Room" Toggle

1. Super Admin goes to Founders Portal
2. Finds the document card
3. Toggles **"Share to Investor Data Room"** → ON
4. Frontend updates `knowledge_documents`:
   ```javascript
   {
     published_to_ir: true,
     updated_at: new Date()
   }
   ```
5. Document now appears in **Investor Data Room** (http://localhost:3000/ir/dataroom)

---

## 🔄 Single Source of Truth Architecture

### Problem (Before Fix)

**Two collections with conflicting data:**
- `knowledge_documents` → Used by backend API
- `secure_documents` → Used by frontend toggle

**Result:** Toggle states didn't persist on page reload! 😱

### Solution (After Fix)

**One collection, one truth:**
- `knowledge_documents` → **SINGLE SOURCE OF TRUTH**
- Frontend reads `published_to_ir` field from `knowledge_documents`
- Frontend writes `published_to_ir` field to `knowledge_documents`
- `secure_documents` → Only used for legacy hardcoded cards

---

## 💾 Data Persistence Flow

### Toggle State Loading (On Page Load)

**File:** `apps/web/src/app/portal/founders-only/page.tsx`

```typescript
// Load toggle states from knowledge_documents (SINGLE SOURCE OF TRUTH)
const toggleStates = await Promise.all(
  orderedCards.map(async (card) => {
    try {
      // Check if this is a dynamic card (from knowledge_documents)
      const kbDocRef = doc(db, 'knowledge_documents', card.id);
      const kbDocSnap = await getDoc(kbDocRef);
      
      if (kbDocSnap.exists()) {
        const kbData = kbDocSnap.data();
        console.log(`📊 Card ${card.id}: published_to_ir = ${kbData.published_to_ir}`);
        
        return {
          ...card,
          isInvestorDataRoom: kbData.published_to_ir || false  // ✅ Correct field!
        };
      }
      return card;
    } catch (error) {
      console.error(`Error loading toggle state for ${card.id}:`, error);
      return card;
    }
  })
);
```

### Toggle State Saving (On Toggle Change)

```typescript
const handleToggleInvestorDataRoom = async (cardId: string, value: boolean) => {
  try {
    // Update local state immediately for responsive UI
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === cardId ? { ...c, isInvestorDataRoom: value } : c
      )
    );

    // Update knowledge_documents collection (SINGLE SOURCE OF TRUTH)
    const kbDocRef = doc(db, 'knowledge_documents', cardId);
    const kbDocSnap = await getDoc(kbDocRef);
    
    if (kbDocSnap.exists()) {
      // Document exists in knowledge_documents - update published_to_ir field
      await setDoc(kbDocRef, {
        published_to_ir: value,  // ✅ Update the correct field
        updated_at: new Date()
      }, { merge: true });
      
      console.log(`✅ Updated knowledge_documents/${cardId}: published_to_ir = ${value}`);
    }
  } catch (error) {
    console.error('Error updating investor data room status:', error);
    // Revert local state on error
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, isInvestorDataRoom: !value } : card
      )
    );
  }
};
```

---

## 🎨 Visual Indicators

### Founders Portal Card States

| Toggle State | Badge | Visual Cue |
|-------------|-------|------------|
| **OFF** (Not shared) | - | Switch is OFF, grey background |
| **ON** (Shared to IR) | 🛡️ | Switch is ON, green checkmark |

### Investor Data Room

Documents with `published_to_ir: true` automatically appear in the IR Data Room accordion sections.

---

## 🔍 Debugging Guide

### Check Toggle State in Firestore

```javascript
// Firebase Console → Firestore Database → knowledge_documents
// Find your document ID (e.g., "msb-registration")
// Check field: published_to_ir: boolean

// Expected values:
{
  "title": "MSB Registration Guide",
  "published_to_founders": true,   // ✅ Visible in Founders Portal
  "published_to_ir": true,          // ✅ Visible in IR Data Room
  "permission_level": "founders",
  "source_directory": ".local-secure-docs"
}
```

### Console Logging

Open browser console and filter by "📊" emoji:
```
📊 Card msb-registration: published_to_ir = true
✅ Updated knowledge_documents/msb-registration: published_to_ir = true
```

---

## 📋 Testing Checklist

### Test Toggle Persistence

1. ✅ Go to Founders Portal: http://localhost:3000/portal/founders-only
2. ✅ Find a secure document card (e.g., "MSB Registration Guide")
3. ✅ Toggle "Share to Investor Data Room" → **ON**
4. ✅ Check console: Should see `✅ Updated knowledge_documents/...`
5. ✅ **Refresh the page** (F5 or Cmd+R)
6. ✅ **Expected:** Toggle should **still be ON** ✅
7. ✅ Go to Investor Data Room: http://localhost:3000/ir/dataroom
8. ✅ **Expected:** Document should appear in Investment Documents accordion

### Test Role-Based Access

1. ✅ Login as **Super Admin** → Can access Founders Portal + IR Data Room
2. ✅ Login as **Platform Admin** → Can access Founders Portal + IR Data Room
3. ✅ Login as **Investor** → Can ONLY access IR Data Room
4. ✅ Public (not logged in) → Cannot access any secure portal

---

## 🚨 Common Issues & Solutions

### Issue 1: Toggle Doesn't Persist on Refresh

**Symptom:** Toggle turns ON, but after refresh it's OFF again

**Cause:** Old code was writing to `secure_documents` instead of `knowledge_documents`

**Solution:** ✅ **FIXED** in v2.87.0 - Now writes to `knowledge_documents`

### Issue 2: Document Doesn't Appear in IR Data Room

**Checklist:**
- ✅ Is `published_to_ir: true` in Firestore?
- ✅ Is `permission_level` NOT "public"? (Secure docs only)
- ✅ Is user logged in as investor, super_admin, or platform_admin?
- ✅ Did you refresh the IR Data Room page?

### Issue 3: All Toggles Show "OFF" on Load

**Cause:** Document IDs in `knowledge_documents` don't match card IDs in Founders Portal

**Solution:** Check Firestore document IDs match the `secure_slug` or document ID used in the frontend

---

## 🎯 Best Practices

### For Super Admins

1. **Upload to Knowledge Base First**
   - Always start by syncing documents to the Knowledge Base
   - Set appropriate `permission_level` (founders, platform_admin, super_admin)

2. **Publish to Founders Portal**
   - Review and customize badge, description
   - Test the document rendering

3. **Share to Investor Data Room**
   - Only share finalized documents
   - Use the toggle in Founders Portal for granular control

### For Document Organization

- **Founders Portal:** Strategic docs, business plans, legal guides
- **Investor Data Room:** Financial docs, pitch decks, investment terms
- **Public Hub:** Marketing materials, public documentation

---

## 📊 Database Schema

### knowledge_documents Collection

```typescript
interface KnowledgeDocument {
  // Core Fields
  id: string;
  title: string;
  content: string;  // Markdown content
  description: string;
  
  // Publishing Flags (SINGLE SOURCE OF TRUTH)
  published_to_founders: boolean;  // Founders Portal visibility
  published_to_ir: boolean;        // Investor Data Room visibility
  published_to_hub: boolean;       // Public Hub visibility
  
  // Security & Access
  permission_level: 'public' | 'founders' | 'platform_admin' | 'super_admin';
  visibility_scope: 'public' | 'organization' | 'private';
  
  // Source Tracking
  source_directory: string;  // e.g., ".local-secure-docs" or "knowledge-base/public"
  synced_from_github: boolean;
  github_path?: string;
  
  // Metadata
  category: string;
  tags: string[];
  word_count: number;
  view_count: number;
  
  // Secure Document Settings
  secure_slug?: string;           // URL-friendly slug
  secure_badge?: string;          // Badge text (e.g., "Legal", "Pre-Seed")
  secure_badge_color?: string;    // Badge color (e.g., "red", "blue")
  secure_icon?: string;           // Icon name (Lucide icons)
  founders_description?: string;  // Custom description for Founders Portal
  ir_description?: string;        // Custom description for IR Data Room
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  synced_at?: Date;
}
```

---

## 🎉 Summary

The document sharing flow is now **fully functional** with:

✅ **Single source of truth** (`knowledge_documents` collection)  
✅ **Persistent toggle states** (survives page reloads)  
✅ **Role-based access control** (super_admin, platform_admin, investor)  
✅ **Visual indicators** on cards showing IR sharing status  
✅ **Accordion sections** in both Founders Portal and IR Data Room  
✅ **Secure by default** (documents never public without explicit publishing)  

---

## 📞 Support

If you encounter any issues with document sharing:

1. Check the console for error messages
2. Verify Firestore `published_to_ir` field values
3. Ensure user has correct role permissions
4. Clear browser cache and hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

**Need help?** Contact platform support or review this documentation.

---

**End of Document** 🚀

