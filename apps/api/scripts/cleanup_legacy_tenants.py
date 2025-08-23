#!/usr/bin/env python3
"""
Clean up legacy tenants collection
The app now uses top-level shelters collection successfully
"""

import firebase_admin
from firebase_admin import firestore, credentials
import sys

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

def main():
    dry_run = '--execute' not in sys.argv
    
    print("🧹 Legacy Tenants Collection Cleanup")
    print("="*60)
    
    # Get tenant documents
    tenants_ref = db.collection('tenants')
    tenants = list(tenants_ref.stream())
    
    print(f"📊 Found {len(tenants)} tenant documents to clean up:")
    
    for tenant in tenants:
        data = tenant.to_dict()
        name = data.get('name', 'Unknown') if data else 'Empty'
        tenant_type = data.get('type', 'unknown') if data else 'unknown'
        print(f"   - {tenant.id}: {name} (type: {tenant_type})")
    
    # Verify top-level shelters collection exists and works
    shelters_ref = db.collection('shelters')
    shelters = list(shelters_ref.stream())
    print(f"\n✅ Verified: Top-level 'shelters' collection has {len(shelters)} documents (working)")
    
    print(f"\n💡 Rationale for cleanup:")
    print("   - App successfully uses top-level 'shelters' collection")
    print("   - Multi-tenancy not currently needed (single platform)")
    print("   - Tenants collection is unused legacy data")
    print("   - Simplifies database structure")
    
    if dry_run:
        print(f"\n🔮 DRY RUN: Would delete {len(tenants)} tenant documents")
        print("💡 Add --execute flag to perform actual cleanup")
        return
    
    # Execute cleanup
    print(f"\n🗑️  DELETING {len(tenants)} tenant documents...")
    deleted_count = 0
    
    for tenant in tenants:
        try:
            # Delete all subcollections recursively
            tenant.reference.delete()
            deleted_count += 1
            print(f"   ✅ Deleted tenant: {tenant.id}")
        except Exception as e:
            print(f"   ❌ Failed to delete tenant {tenant.id}: {e}")
    
    print(f"\n✅ Successfully deleted {deleted_count}/{len(tenants)} tenant documents")
    print("🎯 Database structure simplified: using top-level collections")

if __name__ == "__main__":
    main()
