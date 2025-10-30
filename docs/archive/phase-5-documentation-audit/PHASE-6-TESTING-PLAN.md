# 🧪 PHASE 6: TESTING PLAN

**Date**: October 30, 2025  
**Current Progress**: 90% Complete  
**Target Progress**: 95% Complete (+5%)  
**Estimated Duration**: 5-6 hours  
**Status**: 🟡 **READY TO START**

---

## 📋 TESTING OVERVIEW

Phase 6 focuses on comprehensive testing of all newly implemented features from Phase 5, ensuring everything works correctly before deployment.

---

## 🎯 TESTING OBJECTIVES

### Primary Goals:
1. ✅ Verify GitHub sync with permission system
2. ✅ Test all permission API endpoints
3. ✅ Test permission UI components
4. ✅ Verify auto-permission detection
5. ✅ Test docs hub search & filters
6. ✅ Cross-browser & mobile testing

### Success Criteria:
- All API endpoints return correct responses
- Permission system correctly restricts access
- UI components render properly
- GitHub sync assigns correct permissions
- Search & filters work across all categories
- Works on Chrome, Firefox, Safari
- Mobile-responsive on iOS & Android

---

## 🧪 TEST SUITE 1: GITHUB SYNC WITH PERMISSIONS

### Test 1.1: GitHub Service Integration ✅
**What to test:**
- `github_service.py` imports permission models correctly
- `determine_permission_from_path()` function works
- Sync creates documents with correct permissions

**Test Steps:**
1. Navigate to Knowledge Base dashboard
2. Click "Scan for Changes" button
3. Watch sync process in logs
4. Verify permissions are assigned automatically

**Expected Results:**
- No import errors
- Each document gets appropriate permission level
- Logs show: "Auto-assigned permission 'X' for path/to/file"

**Success Metrics:**
- ✅ All documents sync successfully
- ✅ Permissions match path rules
- ✅ No errors in console

---

### Test 1.2: Auto-Permission Detection Rules
**What to test:**
- Path-based permission detection works correctly

**Test Cases:**

| Path Pattern | Expected Permission |
|--------------|---------------------|
| `secure/**` | FOUNDERS or PLATFORM_ADMIN |
| `private/**` | FOUNDERS |
| `confidential/**` | PLATFORM_ADMIN |
| `public/**` | PUBLIC |
| `docs/**` | PUBLIC |
| `participant/**` | PARTICIPANT |
| `donor/**` | DONOR |
| `shelter/**` | SHELTER_ADMIN |
| `admin/**` | PLATFORM_ADMIN |
| `default` | AUTHENTICATED |

**Test Steps:**
1. Check each path pattern in `permissions.py`
2. Verify mapping in `github_service.py`
3. Test with sample documents

**Success Metrics:**
- ✅ All 10 path patterns correctly mapped
- ✅ Default fallback works

---

### Test 1.3: Document Metadata
**What to test:**
- Synced documents include permission metadata

**Expected Fields:**
```typescript
{
  permission_level: string,
  is_private: boolean,
  synced_from_github: true,
  github_path: string,
  // ... other fields
}
```

**Test Steps:**
1. Sync a document from GitHub
2. Check Firestore document
3. Verify all new fields present

**Success Metrics:**
- ✅ All permission fields present
- ✅ Values are correct
- ✅ Legacy fields preserved

---

## 🧪 TEST SUITE 2: PERMISSION API ENDPOINTS

### Test 2.1: GET /knowledge/permissions/levels
**What to test:**
- Endpoint returns all 8 permission levels

**Test Command:**
```bash
curl -X GET http://localhost:8000/knowledge/permissions/levels \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "permission_levels": [
      {
        "value": "public",
        "label": "Public",
        "description": "Anyone can view",
        "color": "text-green-600",
        "icon": "Globe"
      },
      // ... 7 more levels
    ],
    "total": 8
  },
  "message": "Permission levels retrieved successfully"
}
```

**Success Metrics:**
- ✅ Returns 200 status
- ✅ All 8 levels present
- ✅ Each has value, label, description, color, icon

---

### Test 2.2: POST /knowledge/permissions/check
**What to test:**
- Endpoint correctly checks user permission

**Test Cases:**

| User Role | Doc Permission | Expected Result |
|-----------|----------------|-----------------|
| super_admin | any | ✅ true |
| founders | founders | ✅ true |
| platform_admin | shelter_admin | ✅ true |
| shelter_admin | platform_admin | ❌ false |
| participant | public | ✅ true |
| donor | participant | ❌ false |

**Test Command:**
```bash
curl -X POST http://localhost:8000/knowledge/permissions/check \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "document_permission": "founders",
    "is_private": true
  }'
```

**Success Metrics:**
- ✅ Returns correct true/false
- ✅ Respects role hierarchy
- ✅ Handles private documents

---

### Test 2.3: POST /knowledge/permissions/determine
**What to test:**
- Endpoint auto-detects permission from path

**Test Cases:**
```bash
# Test 1: Public path
curl -X POST http://localhost:8000/knowledge/permissions/determine \
  -d '{"file_path": "docs/overview/README.md"}'
# Expected: "public"

# Test 2: Secure path
curl -X POST http://localhost:8000/knowledge/permissions/determine \
  -d '{"file_path": "secure/founders/business-plan.md"}'
# Expected: "founders"

# Test 3: Admin path
curl -X POST http://localhost:8000/knowledge/permissions/determine \
  -d '{"file_path": "admin/platform/config.md"}'
# Expected: "platform_admin"
```

**Success Metrics:**
- ✅ Returns correct permission
- ✅ Includes display_info
- ✅ Handles edge cases

---

## 🧪 TEST SUITE 3: PERMISSION UI COMPONENTS

### Test 3.1: PermissionBadge Component
**What to test:**
- Badge displays correctly for all 8 levels
- Colors are correct
- Icons render
- Dark mode works

**Test Steps:**
1. Create test page with all 8 badges
2. Verify colors match design
3. Toggle dark mode
4. Test 3 sizes (sm, md, lg)

**Expected Results:**
- ✅ All 8 badges render
- ✅ Correct colors & icons
- ✅ Dark mode styles work
- ✅ All sizes display correctly

---

### Test 3.2: PermissionSelector Component
**What to test:**
- Dropdown shows all 8 levels
- Grouped by category
- Selection works
- Disabled state works

**Test Steps:**
1. Render PermissionSelector
2. Click dropdown
3. Verify all 8 options visible
4. Test selection
5. Test disabled prop

**Expected Results:**
- ✅ Dropdown opens/closes
- ✅ 4 category groups visible
- ✅ Selection updates value
- ✅ Disabled prevents interaction

---

### Test 3.3: PermissionToggle Component
**What to test:**
- Public/Private toggle works
- Info messages display
- Disabled state works

**Test Steps:**
1. Render PermissionToggle
2. Toggle private/public
3. Verify info box changes
4. Test disabled prop

**Expected Results:**
- ✅ Toggle updates state
- ✅ Icon changes (Lock/Unlock)
- ✅ Info messages update
- ✅ Colors change appropriately

---

### Test 3.4: PermissionManager Component
**What to test:**
- All sub-components work together
- Save functionality
- Change tracking
- Cancel resets state

**Test Steps:**
1. Render PermissionManager
2. Change permission level
3. Toggle private
4. Change visibility scope
5. Click Save
6. Verify all changes persist
7. Click Cancel
8. Verify resets to original

**Expected Results:**
- ✅ All components render
- ✅ State updates correctly
- ✅ Save calls callback
- ✅ Cancel resets state
- ✅ Success message shows

---

## 🧪 TEST SUITE 4: DOCS HUB UI

### Test 4.1: Search Functionality
**What to test:**
- Search filters documents correctly
- Empty state displays
- Clear button works

**Test Steps:**
1. Navigate to `/docs`
2. Type "blockchain" in search
3. Verify only matching docs show
4. Type nonsense
5. Verify empty state
6. Click X to clear
7. Verify all docs return

**Expected Results:**
- ✅ Search is case-insensitive
- ✅ Searches title, description, topics
- ✅ Results update in real-time
- ✅ Empty state shows when no results
- ✅ Clear button resets search

---

### Test 4.2: Category Filtering
**What to test:**
- All 7 category tabs work
- Document counts are correct
- Filters apply correctly

**Test Steps:**
1. Navigate to `/docs`
2. Click each category tab
3. Verify correct docs show
4. Check badge counts match
5. Return to "All Documents"

**Expected Results:**
- ✅ All 7 categories filter correctly
- ✅ Badge counts accurate
- ✅ Smooth transitions
- ✅ Mobile tabs work

---

### Test 4.3: Combined Search + Filter
**What to test:**
- Search works within category filter

**Test Steps:**
1. Select "Architecture" category
2. Type "blockchain" in search
3. Verify only architecture docs matching "blockchain"

**Expected Results:**
- ✅ Both filters apply
- ✅ Results accurate
- ✅ Counts update

---

## 🧪 TEST SUITE 5: CROSS-BROWSER TESTING

### Test 5.1: Chrome
- [ ] Docs hub renders correctly
- [ ] Search works
- [ ] Category filters work
- [ ] Permission components render
- [ ] Colors display correctly

### Test 5.2: Firefox
- [ ] Docs hub renders correctly
- [ ] Search works
- [ ] Category filters work
- [ ] Permission components render
- [ ] Colors display correctly

### Test 5.3: Safari
- [ ] Docs hub renders correctly
- [ ] Search works
- [ ] Category filters work
- [ ] Permission components render
- [ ] Colors display correctly

---

## 🧪 TEST SUITE 6: MOBILE TESTING

### Test 6.1: Mobile Layout (< 768px)
**What to test:**
- Docs hub responsive
- Search bar full width
- Category tabs scroll
- Cards stack vertically

**Test Steps:**
1. Open in mobile view
2. Verify layout adapts
3. Test search
4. Test category filters
5. Test card interactions

**Expected Results:**
- ✅ No horizontal scroll
- ✅ All text readable
- ✅ Buttons tappable
- ✅ Categories scroll horizontally

---

### Test 6.2: Tablet Layout (768px - 1024px)
**What to test:**
- Layout uses available space
- 2-column card grid

**Expected Results:**
- ✅ Cards display in 2 columns
- ✅ Search bar centered
- ✅ Category tabs wrap nicely

---

## 📊 TEST PROGRESS TRACKER

```
Test Suite 1: GitHub Sync           ░░░░░░░░░░░░░░░░░░░░  0/3
Test Suite 2: API Endpoints         ░░░░░░░░░░░░░░░░░░░░  0/3
Test Suite 3: UI Components         ░░░░░░░░░░░░░░░░░░░░  0/4
Test Suite 4: Docs Hub UI           ░░░░░░░░░░░░░░░░░░░░  0/3
Test Suite 5: Cross-Browser         ░░░░░░░░░░░░░░░░░░░░  0/3
Test Suite 6: Mobile                ░░░░░░░░░░░░░░░░░░░░  0/2

Overall: ░░░░░░░░░░░░░░░░░░░░ 0/18 tests
```

---

## 🎯 TESTING PRIORITIES

### HIGH PRIORITY (Must Pass):
1. ✅ GitHub sync with permissions
2. ✅ Permission API endpoints
3. ✅ Auto-detection rules
4. ✅ Permission checking logic

### MEDIUM PRIORITY (Should Pass):
1. ✅ UI component rendering
2. ✅ Search & filter functionality
3. ✅ Mobile responsiveness

### LOW PRIORITY (Nice to Have):
1. ✅ Cross-browser consistency
2. ✅ Edge case handling
3. ✅ Performance optimization

---

## 🐛 BUG TRACKING

### Found Bugs:
| # | Severity | Description | Status |
|---|----------|-------------|--------|
| - | - | No bugs yet! | - |

---

## ✅ TEST COMPLETION CRITERIA

**Phase 6 Complete When:**
- [ ] All 18 tests pass
- [ ] No critical bugs
- [ ] GitHub sync works with permissions
- [ ] All API endpoints functional
- [ ] UI components render correctly
- [ ] Search & filters work
- [ ] Mobile-responsive
- [ ] Cross-browser compatible

**Estimated Completion:** 5-6 hours  
**Current Progress:** 90% → 95%

---

## 🚀 NEXT PHASE

**Phase 7: Deployment** (2-3 hours)
- Production environment setup
- Database migration
- API & frontend deployment
- SSL & DNS configuration
- Team training
- Launch! 🎉

---

*Testing plan created: October 30, 2025*  
*Ready to begin comprehensive testing!*

