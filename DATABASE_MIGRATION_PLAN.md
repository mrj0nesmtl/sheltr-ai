# SHELTR-AI Database Migration Plan

## 🚨 Current Issues Identified

### 1. Incorrect Shelter Storage Path
**Problem**: Shelters are stored at `tenants/platform/shelters/...`
**Issue**: This creates confusion where "platform" appears to be a tenant but is actually storing shelter data

### 2. Missing Proper Tenant Hierarchy
**Problem**: No proper tenant isolation for shelters
**Issue**: All shelters are mixed together instead of being properly scoped to tenants

## 📋 Migration Strategy

### Phase 1: Assess Current Data
- ✅ Found 10 shelter documents at `tenants/platform/shelters/`
- ✅ Found 2 tenant documents in `/tenants` collection
- ✅ Found 8 user documents with tenant associations

### Phase 2: Create Proper Structure
```
tenants/
  {tenantId}/              ← Proper tenant document
    platform/
      metadata/            ← Platform configuration
      shelters/           ← Tenant-specific shelters
        {shelterId}/      ← Individual shelter data
      users/              ← Tenant-specific users
        {userId}/         ← User data scoped to tenant
```

### Phase 3: Migration Steps

#### Step 1: Backup Current Data
```bash
# Export current shelter data
firebase firestore:export ./backup-$(date +%Y%m%d)
```

#### Step 2: Create Proper Tenant Structure
1. Choose primary tenant ID (recommend using one of the existing tenant docs)
2. Create proper subcollections under that tenant
3. Move shelter data to correct location

#### Step 3: Move Shelter Data
```javascript
// Move from: tenants/platform/shelters/{shelterId}
// Move to:   tenants/{primaryTenantId}/platform/shelters/{shelterId}
```

#### Step 4: Update Application Code
1. Update all Firestore queries to use proper tenant scoping
2. Update security rules for tenant isolation
3. Test all shelter-related functionality

#### Step 5: Clean Up
1. Remove the orphaned `tenants/platform/` document
2. Verify all data is accessible
3. Update documentation

## 🎯 Recommended Final Structure

```
tenants/
  Vc48fjy0cajJrstbLQRr/                    ← Primary tenant
    metadata: {name, type, status, ...}     ← Tenant info
    platform/
      shelters/
        1yDQeRjTbyHx28or4AyY/              ← Refuge des Jeunes
        9XnLJm9N5U6AAbhzsRze/              ← YWCA Montreal
        SLsqUwZHRHD4oWAZb9O6/              ← Le Chaînon
        ...
      users/
        {userId}/                           ← Tenant users
      settings/
        configuration/                      ← Platform settings

users/ (global)                             ← Cross-tenant user management
system_health/                              ← System monitoring
translations/                               ← Global translations
```

## ⚠️ Risk Assessment

**Low Risk**: Data migration (we have backups)
**Medium Risk**: Application downtime during migration
**High Risk**: Breaking existing authentication/user flows

## 🚀 Next Steps

1. **Immediate**: Create backup of current data
2. **Short-term**: Implement migration script
3. **Medium-term**: Update all application queries
4. **Long-term**: Implement proper multi-tenancy if needed

## 💡 Alternative Approach: Accept Current Structure

If migration is too risky, we could:
1. Update application code to work with current structure
2. Treat `tenants/platform/` as the "default tenant"
3. Add proper tenant scoping in future development
4. Document the current structure for developers 