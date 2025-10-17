# Shelter Public Page URL Routing Fix

**Date:** October 4, 2025  
**Status:** 🚧 In Progress

---

## 🎯 Problem Statement

The system has inconsistent URL patterns for shelter public pages:

### ❌ **Current (Incorrect)**
```
https://sheltr-ai.web.app/shelter/old-brewery-mission
https://sheltr-ai.web.app/shelter/downtown-hope
```

### ✅ **Required (Correct)**
```
https://sheltr-ai.web.app/old-brewery-mission
https://sheltr-ai.web.app/downtown-hope
```

---

## 📍 Files with Incorrect `/shelter/` References

1. **`apps/web/src/app/dashboard/shelters/page.tsx` (Line 133)**
   - Super Admin shelter network popup
   - QR code generation URLs
   
2. **`apps/web/src/app/dashboard/shelter-admin/settings/page.tsx` (Lines 64, 258)**
   - Settings preview banner
   - Mock data with hardcoded URLs

3. **Missing Features:**
   - Participant public pages don't link to their shelter
   - No clear slug configuration UI

---

## 🔧 Fixes Required

### Fix 1: Super Admin Shelter Network Popup
**File:** `apps/web/src/app/dashboard/shelters/page.tsx`

**Current (Line 133):**
```typescript
const getShelterPublicUrl = (shelter: ShelterTenant) => {
  return `https://sheltr-ai.web.app/shelter/${shelter.id}`;
};
```

**Fix:**
```typescript
const getShelterPublicUrl = (shelter: ShelterTenant) => {
  // Use shelter.slug if available, otherwise fallback to shelter.id
  const slugOrId = shelter.slug || shelter.id;
  return `https://sheltr-ai.web.app/${slugOrId}`;
};
```

### Fix 2: Shelter Admin Settings Preview
**File:** `apps/web/src/app/dashboard/shelter-admin/settings/page.tsx`

**Current (Line 258):**
```tsx
<Badge variant="outline">Live at sheltr-ai.web.app/shelter/downtown-hope</Badge>
```

**Fix:**
```tsx
<Badge variant="outline">
  Live at sheltr-ai.web.app/{shelter?.slug || 'your-shelter'}
</Badge>
```

**Current (Line 64 - Mock Data):**
```typescript
qrCode: 'https://sheltr-ai.web.app/shelter/old-brewery-mission',
```

**Fix:**
```typescript
// Load actual shelter data instead of hardcoded mock
qrCode: shelter?.qrCode?.url || '',
```

### Fix 3: Add Shelter Link to Participant Pages
**File:** `apps/web/src/app/participant/[slug]/page.tsx`

**Add new section:**
```tsx
{/* Shelter Affiliation */}
{participant.shelter_id && participant.shelter_name && (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Building className="h-5 w-5 mr-2" />
        Affiliated Shelter
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{participant.shelter_name}</p>
          <p className="text-sm text-muted-foreground">Supporting {participant.displayName}'s journey</p>
        </div>
        <Button asChild>
          <Link href={`/${participant.shelter_slug}`}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Shelter
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

### Fix 4: Slug Configuration UI
**File:** `apps/web/src/app/dashboard/shelter-admin/settings/page.tsx`

**Add to "General Info" tab:**
```tsx
{/* Public Page URL Configuration */}
<div className="space-y-4">
  <Label>Public Page URL</Label>
  <p className="text-sm text-muted-foreground">
    This is how people will find your shelter's public page
  </p>
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">sheltr-ai.web.app/</span>
    <Input
      value={formData.slug}
      onChange={(e) => handleSlugChange(e.target.value)}
      placeholder="your-shelter-name"
      className="flex-1"
    />
  </div>
  <p className="text-xs text-muted-foreground">
    Only lowercase letters, numbers, and hyphens allowed
  </p>
  {slugError && (
    <p className="text-xs text-red-600">{slugError}</p>
  )}
</div>
```

---

## 🗄️ Database Updates

### `tenants` Collection
Ensure all shelter documents have a `slug` field:

```typescript
interface ShelterTenant {
  id: string;
  name: string;
  slug: string;  // ← REQUIRED for public URLs
  // ... other fields
}
```

### Migration Script Needed?
Check if existing shelters have `slug` fields. If not, generate from `name`:

```typescript
const generateSlug = (name: string): string => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
};
```

---

## 🧪 Testing Checklist

- [ ] Super Admin: Generate QR code for shelter → Verify URL has no `/shelter/`
- [ ] Super Admin: Click "Open Public Page" → Verify correct URL
- [ ] Shelter Admin: View settings preview → Verify correct URL in banner
- [ ] Shelter Admin: Edit slug → Save → Verify public page accessible at new slug
- [ ] Participant Page: Verify shelter link appears
- [ ] Participant Page: Click shelter link → Verify navigates to correct shelter page
- [ ] QR Code Scanner: Scan shelter QR → Verify lands on correct page
- [ ] Direct URL: Visit `https://sheltr-ai.web.app/old-brewery-mission` → Works
- [ ] Direct URL: Visit `https://sheltr-ai.web.app/shelter/old-brewery-mission` → 404

---

## 📝 Implementation Order

1. ✅ Fix `shelters/page.tsx` - Super Admin popup URLs
2. ✅ Fix `shelter-admin/settings/page.tsx` - Preview banner
3. ✅ Add slug configuration UI in settings
4. ✅ Add shelter link to participant pages
5. ✅ Test all URLs and QR codes
6. ✅ Deploy and verify in production

---

**End of Document**

