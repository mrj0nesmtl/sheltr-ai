# IR Data Room Troubleshooting Guide

**Last Updated**: December 22, 2025 (2:45 PM)  
**Status**: ✅ **ACTIVE GUIDE**  
**Purpose**: Diagnose and fix document sharing sync issues between Founder Portal and IR Data Room

---

## 📋 Table of Contents

1. [Problem Overview](#problem-overview)
2. [Understanding the Architecture](#understanding-the-architecture)
3. [Common Issues](#common-issues)
4. [Diagnostic Tools](#diagnostic-tools)
5. [Solution Steps](#solution-steps)
6. [Prevention](#prevention)

---

## Problem Overview

### Symptoms

- **Founder Portal** shows `X documents currently shared` (e.g., 8)
- **All toggles are OFF** in Founder Portal (all 21 cards)
- **"Clear All from IR" button** has been clicked
- **IR Data Room** still shows documents (e.g., 8 cards in "Deep Dive" section)

### Root Cause

**"Ghost Documents"** exist in `knowledge_documents` collection that:
- Have `published_to_ir: true` 
- Are NOT represented by any of the 21 cards in Founder Portal
- Continue to appear in IR Data Room despite "Clear All" operation

---

## Understanding the Architecture

### Data Flow

```
Founder Portal (21 Cards)
    ↓
Toggle ON/OFF
    ↓
knowledge_documents.published_to_ir = true/false
    ↓
IR Data Room Query
    ↓
Shows documents where published_to_ir == true
```

### Key Collections

#### 1. `knowledge_documents` (SINGLE SOURCE OF TRUTH)

**Purpose**: Stores all dynamic documents for the platform

**Key Fields**:
```typescript
{
  id: string;                      // Document ID
  title: string;                   // Display title
  published_to_founders: boolean;  // Show in Founder Portal?
  published_to_ir: boolean;        // Show in IR Data Room? ← KEY FIELD
  status: 'active' | 'archived';   // Document status
  source: string;                  // Origin (e.g., 'hardcoded_portal_card', 'github_sync')
  // ... other fields
}
```

#### 2. `secure_documents` (LEGACY - DEPRECATED)

**Purpose**: Old system for hardcoded cards (being phased out)

**Key Fields**:
```typescript
{
  id: string;
  isInvestorDataRoom: boolean;  // Old field (deprecated)
  // ... other fields
}
```

### Founder Portal Logic

**21 Visible Cards** come from:
1. **Hardcoded `initialCards`** array (protected cards like `investor-relations`, `pitch-deck`)
2. **Dynamic documents** from `knowledge_documents` where `published_to_founders == true`

**Important**: If a document in `knowledge_documents` has:
- `published_to_ir: true` ✅
- `published_to_founders: false` ❌

...it will be a **GHOST DOCUMENT** (visible in IR, invisible in Founder Portal)

### IR Data Room Logic

**Queries `knowledge_documents` directly**:

```typescript
const irDocsQuery = query(
  collection(db, 'knowledge_documents'),
  where('published_to_ir', '==', true),
  where('status', '==', 'active')
);
```

**Result**: Shows ALL documents with `published_to_ir: true`, regardless of whether they're visible in Founder Portal

---

## Common Issues

### Issue 1: Ghost Documents

**Problem**: Documents in `knowledge_documents` with:
- `published_to_ir: true`
- `published_to_founders: false` (or missing)

**Why it happens**:
- Old documents from previous system migrations
- Manual Firestore edits
- Documents created by scripts/imports
- Hardcoded cards that were toggled ON but later removed from `initialCards` array

**How to detect**:
```bash
node scripts/diagnose-ir-ghost-docs.js
```

### Issue 2: Toggle State Mismatch

**Problem**: Founder Portal toggles show OFF, but `knowledge_documents` still has `published_to_ir: true`

**Why it happens**:
- "Clear All from IR" button failed silently
- Firestore permission error during batch update
- Network interruption during save
- Cache not invalidated after update

**How to detect**:
- Check Founder Portal: "X documents currently shared" (should be 0)
- Check IR Data Room: Count visible cards (should be 0)
- Mismatch = toggle state issue

### Issue 3: Orphaned Documents

**Problem**: Documents in `knowledge_documents` that shouldn't exist

**Why it happens**:
- Deleted from GitHub but not from Firestore
- Manual document creation without proper cleanup
- Failed deletion operations

**How to detect**:
```bash
node scripts/diagnose-ir-ghost-docs.js
```

---

## Diagnostic Tools

### Tool 1: Ghost Document Diagnostic Script

**Purpose**: Identify all documents with `published_to_ir: true`

**Location**: `/scripts/diagnose-ir-ghost-docs.js` (local only, not in Git)

**Note**: This script is in the `/scripts` folder which is `.gitignore`d for security. It's available locally but not committed to the repository.

**Usage**:
```bash
cd /Users/mrjones/Github/Projects/sheltr-ai
node scripts/diagnose-ir-ghost-docs.js
```

**Output**:
```
🔍 DIAGNOSING IR DATA ROOM GHOST DOCUMENTS
============================================================

📊 Step 1: Querying knowledge_documents for published_to_ir: true...

✅ Found 8 documents with published_to_ir: true

📋 Ghost Documents Found:
============================================================

📄 Document ID: adyen-integration
   Title: Adyen Integration Strategy
   Badge: Strategic
   Published to Founders: true
   Published to IR: true
   Source: hardcoded_portal_card
   Created: Sun Dec 22 2025

[... 7 more documents ...]

🎯 SUMMARY: 8 ghost documents found

💡 SOLUTION OPTIONS:
[... solutions listed ...]
```

### Tool 2: Nuclear Clear Script

**Purpose**: Set `published_to_ir: false` for ALL documents

**Location**: `/scripts/clear-all-ir-docs.js` (local only, not in Git)

**Note**: This script is in the `/scripts` folder which is `.gitignore`d for security. It's available locally but not committed to the repository.

**Usage**:
```bash
cd /Users/mrjones/Github/Projects/sheltr-ai
node scripts/clear-all-ir-docs.js
```

**⚠️ WARNING**: This will wipe the IR Data Room completely!

**Output**:
```
🚨 NUCLEAR OPTION: CLEAR ALL IR DATA ROOM DOCUMENTS
============================================================

⚠️  WARNING: This will:
   • Set published_to_ir: false for ALL documents
   • Wipe the IR Data Room completely
   • Cannot be undone (but you can re-toggle documents later)

📊 Found 8 documents with published_to_ir: true

❓ Are you sure you want to clear 8 documents? (type 'yes' to confirm): yes

🗑️  Clearing IR Data Room...

   ✓ Cleared: Adyen Integration Strategy
   ✓ Cleared: Implementation Readiness
   [... 6 more ...]

✅ SUCCESS: Cleared 8 documents from IR Data Room
   All published_to_ir flags set to false

📊 Verification: 0 documents remaining with published_to_ir: true
✅ IR Data Room is now completely empty!
```

### Tool 3: Founder Portal Management Panel

**Purpose**: UI-based management of IR Data Room

**Location**: Founder Portal → "IR Data Room Management" panel

**Features**:
1. **Statistics Dashboard**
   - Shows count of documents shared to IR
   - Shows count of documents not shared
   - Shows total documents in Founders Portal

2. **Re-Sync Toggles Button**
   - Reloads card order from database
   - Updates all toggle states to match reality
   - Fixes mismatches between toggles and actual IR state

3. **Clear All from IR Button**
   - Removes ALL documents from IR Data Room at once
   - Confirmation dialog with clear warnings
   - Batch updates both `knowledge_documents` and `secure_documents`

**Usage**:
1. Navigate to `/portal/founders-only`
2. Scroll to "IR Data Room Management" panel
3. Click "Show Tools"
4. Use "Re-Sync Toggles" or "Clear All from IR"

---

## Solution Steps

### Step 1: Diagnose the Problem

**Run the diagnostic script**:

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai
node scripts/diagnose-ir-ghost-docs.js
```

**Review the output**:
- Note the document IDs
- Check if they should be in IR or not
- Identify which are "ghost documents"

### Step 2: Choose Your Approach

#### Option A: Manual Cleanup (Recommended for Selective Removal)

**Best for**: When you want to keep some documents and remove others

**Steps**:
1. Open Firestore Console: https://console.firebase.google.com/
2. Navigate to `knowledge_documents` collection
3. For each ghost document:
   - Open the document
   - Set `published_to_ir` to `false`
   - Set `updated_at` to current timestamp
   - Save

**Pros**:
- Precise control
- Can review each document
- No risk of removing wanted documents

**Cons**:
- Time-consuming for many documents
- Manual process

#### Option B: Nuclear Clear (Recommended for Fresh Start)

**Best for**: When you want to wipe IR Data Room completely and start fresh

**Steps**:
1. Run the nuclear clear script:
   ```bash
   node scripts/clear-all-ir-docs.js
   ```
2. Type `yes` to confirm
3. Wait for completion
4. Verify in IR Data Room (should be empty)

**Pros**:
- Fast and complete
- Guaranteed clean slate
- Automated

**Cons**:
- Removes ALL documents (must re-toggle wanted ones)
- No undo (but you can re-toggle later)

#### Option C: UI-Based Clear (Recommended for Non-Technical Users)

**Best for**: When you prefer using the UI instead of scripts

**Steps**:
1. Navigate to `/portal/founders-only`
2. Scroll to "IR Data Room Management" panel
3. Click "Show Tools"
4. Click "Clear All from IR"
5. Confirm the dialog
6. Wait for success toast

**Pros**:
- No command line needed
- Visual confirmation
- Integrated with platform

**Cons**:
- Only clears documents visible in Founder Portal
- May miss ghost documents not represented by cards

### Step 3: Verify the Fix

**Check Founder Portal**:
1. Navigate to `/portal/founders-only`
2. Look at "IR Data Room Management" panel
3. Should show: "0 documents currently shared"

**Check IR Data Room**:
1. Log in as investor: `investor@sheltr-demo.com` / `Investor2025!`
2. Navigate to `/ir/dataroom`
3. Scroll to "Deep Dive" section
4. Should show: "No documents available" or empty state

**Run diagnostic again**:
```bash
node scripts/diagnose-ir-ghost-docs.js
```

Should output:
```
✅ SUCCESS: No documents are published to IR Data Room!
   The IR Data Room should be empty.
```

### Step 4: Re-Toggle Desired Documents

**Once IR Data Room is clean**:

1. Navigate to `/portal/founders-only`
2. Find the documents you want to share with investors
3. Toggle ON the "Share to Investor Data Room" switch
4. Confirm the dialog
5. Wait for success toast

**Verify**:
- Check "IR Data Room Management" panel (should show count)
- Check IR Data Room as investor (should see documents)

---

## Prevention

### Best Practices

#### 1. Always Use the UI for Toggles

**DO**:
- Use Founder Portal toggles to enable/disable IR sharing
- Use "Clear All from IR" button for bulk operations
- Use "Re-Sync Toggles" to fix mismatches

**DON'T**:
- Manually edit Firestore documents
- Use Firebase Console for IR sharing changes
- Run custom scripts without understanding impact

#### 2. Keep Documents in Sync

**Ensure**:
- Documents have `published_to_founders: true` if they should appear in Founder Portal
- Documents have `published_to_ir: true` ONLY if they should appear in IR Data Room
- Documents have `status: 'active'` to be queryable

#### 3. Use Protected Cards for Hardcoded Content

**Protected cards** (defined in `PROTECTED_CARDS` set):
- `investor-relations`
- `pitch-deck`
- `shelter-research`
- `leadership-team`
- `gallery-management`
- ... and others

**These cards**:
- Will NEVER be replaced by dynamic documents
- Are guaranteed to appear in Founder Portal
- Can be safely toggled for IR sharing

#### 4. Regular Audits

**Monthly**:
1. Run diagnostic script
2. Review ghost documents
3. Clean up orphaned entries
4. Verify IR Data Room matches expectations

**After major changes**:
1. Run diagnostic script
2. Use "Re-Sync Toggles" button
3. Verify counts match

#### 5. Document Lifecycle

**When creating new documents**:
1. Set `published_to_founders: true` (to appear in Founder Portal)
2. Set `published_to_ir: false` (default to OFF for IR)
3. Set `status: 'active'`
4. Set `source` to indicate origin

**When deleting documents**:
1. Set `status: 'archived'` (soft delete)
2. Set `published_to_founders: false`
3. Set `published_to_ir: false`
4. Keep document for audit trail

---

## Technical Details

### Firestore Queries

**Founder Portal - Load IR Count**:
```typescript
const irQuery = query(
  collection(db, 'knowledge_documents'),
  where('published_to_ir', '==', true),
  where('status', '==', 'active')
);
const snapshot = await getDocs(irQuery);
const count = snapshot.size; // Actual IR count
```

**IR Data Room - Load Documents**:
```typescript
const docsQuery = query(
  collection(db, 'knowledge_documents'),
  where('published_to_ir', '==', true),
  where('status', '==', 'active')
);
const snapshot = await getDocs(docsQuery);
const irDocs = snapshot.docs.map(doc => ({
  id: doc.id,
  title: doc.data().title,
  // ... other fields
}));
```

**Founder Portal - Toggle IR Sharing**:
```typescript
const kbDocRef = doc(db, 'knowledge_documents', cardId);
await setDoc(kbDocRef, {
  published_to_ir: value, // true or false
  updated_at: new Date()
}, { merge: true });
```

### Cache Invalidation

**After toggling or clearing**:
```typescript
import { cache } from '@/services/cache_service';

// Invalidate documents cache
cache.invalidate('knowledge_documents_all');

// Invalidate stats cache
cache.invalidate('knowledge_stats');
```

**Why important**:
- Ensures fresh data on next load
- Updates "X documents currently shared" count
- Prevents stale toggle states

---

## Related Documentation

- [IR Sharing System Guide](./IR-SHARING-SYSTEM-GUIDE.md) - Complete guide to IR sharing
- [Knowledge Base Update Guide](./knowledge-base/KNOWLEDGE-BASE-UPDATE-GUIDE.md) - Document management
- [Founder Portal Guide](../user-guides/FOUNDER-PORTAL-GUIDE.md) - Using the Founder Portal

---

## Changelog

### v1.0 - December 22, 2025
- ✅ Initial guide created
- ✅ Added diagnostic script
- ✅ Added nuclear clear script
- ✅ Documented common issues and solutions
- ✅ Added prevention best practices

---

**Need Help?**

If you're still experiencing issues after following this guide:

1. Run the diagnostic script and save the output
2. Check the browser console for errors
3. Check the Firestore Console for document states
4. Contact the development team with diagnostic output

**Quick Links**:
- Diagnostic Script: `/scripts/diagnose-ir-ghost-docs.js`
- Nuclear Clear Script: `/scripts/clear-all-ir-docs.js`
- Founder Portal: `/portal/founders-only`
- IR Data Room: `/ir/dataroom`
