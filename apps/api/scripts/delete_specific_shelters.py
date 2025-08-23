#!/usr/bin/env python3
"""
Delete specific hash ID shelters to reduce from 16 to exactly 10 shelters
Based on user's Firestore console screenshot
"""

import firebase_admin
from firebase_admin import firestore, credentials
import sys

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

# Exact hash IDs to delete (from user's screenshot)
HASH_IDS_TO_DELETE = [
    '7qGDhXSxiZfguEi16TSr',
    'LP9bXOlfveADxEX4pf4z', 
    'OVuOQgHdEAlhZCUUSvni',
    'buhGw3fhevsyfBFrZNj6',
    'irUtT68ceY5BssJbJvWO',
    'jbXyB9lge7byrhvnlYVG'
]

def main():
    dry_run = '--execute' not in sys.argv
    
    print("🗑️  Delete Specific Hash ID Shelters")
    print("="*60)
    
    # Get all shelters
    shelters_ref = db.collection('shelters')
    shelters = list(shelters_ref.stream())
    
    keep_shelters = []
    delete_shelters = []
    
    for shelter in shelters:
        data = shelter.to_dict()
        if not data:
            continue
            
        name = data.get('name', 'Unknown')
        
        if shelter.id in HASH_IDS_TO_DELETE:
            delete_shelters.append({
                'id': shelter.id,
                'name': name,
                'ref': shelter.reference
            })
        else:
            keep_shelters.append({
                'id': shelter.id,
                'name': name
            })
    
    print(f"✅ KEEP ({len(keep_shelters)} shelters):")
    for shelter in sorted(keep_shelters, key=lambda x: x['id']):
        icon = "🔒" if shelter['id'] == 'old-brewery-mission' else "  "
        print(f"   {icon} {shelter['id']} → {shelter['name']}")
    
    print(f"\n❌ DELETE ({len(delete_shelters)} hash ID shelters):")
    for shelter in delete_shelters:
        print(f"     {shelter['id']} → {shelter['name']}")
    
    if dry_run:
        print(f"\n🔮 DRY RUN: Would delete {len(delete_shelters)} shelters")
        print(f"📊 Final count: {len(keep_shelters)} shelters (target: 10)")
        
        if len(keep_shelters) == 10:
            print("✅ Perfect! This will give us exactly 10 shelters")
        else:
            print(f"⚠️  Warning: This would result in {len(keep_shelters)} shelters, not 10")
        
        print("💡 Add --execute flag to perform actual deletion")
        return
    
    # Execute deletion
    print(f"\n🗑️  DELETING {len(delete_shelters)} shelters...")
    deleted_count = 0
    
    for shelter in delete_shelters:
        try:
            shelter['ref'].delete()
            deleted_count += 1
            print(f"   ✅ Deleted: {shelter['name']} (ID: {shelter['id']})")
        except Exception as e:
            print(f"   ❌ Failed to delete {shelter['name']}: {e}")
    
    print(f"\n✅ Successfully deleted {deleted_count}/{len(delete_shelters)} shelters")
    print(f"🎯 Shelter count: 16 → {len(keep_shelters)}")
    
    # Verify Old Brewery Mission is preserved
    if any(s['id'] == 'old-brewery-mission' for s in keep_shelters):
        print("🔒 Old Brewery Mission preserved (has users attached)")

if __name__ == "__main__":
    main()
