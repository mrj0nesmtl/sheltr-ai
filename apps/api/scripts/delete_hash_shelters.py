#!/usr/bin/env python3
"""
Delete shelters with hash IDs, keep the ones with proper named IDs
This will reduce from 16 to exactly 10 shelters
"""

import firebase_admin
from firebase_admin import firestore, credentials
import sys
import re

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

def is_hash_id(shelter_id):
    """Check if shelter ID is a hash (random characters) vs a proper name"""
    # Hash IDs are exactly 20 random alphanumeric characters
    # Named IDs contain dashes and descriptive words
    if len(shelter_id) == 20 and not '-' in shelter_id:
        # Additional check: must contain both uppercase and lowercase
        has_upper = any(c.isupper() for c in shelter_id)
        has_lower = any(c.islower() for c in shelter_id)
        has_digit = any(c.isdigit() for c in shelter_id)
        return has_upper and has_lower and has_digit
    return False

def main():
    dry_run = '--execute' not in sys.argv
    
    print("🗑️  Delete Hash ID Shelters - Keep Named Shelters")
    print("="*60)
    
    # Get all shelters
    shelters_ref = db.collection('shelters')
    shelters = list(shelters_ref.stream())
    
    named_shelters = []
    hash_shelters = []
    
    for shelter in shelters:
        data = shelter.to_dict()
        if not data:
            continue
            
        name = data.get('name', 'Unknown')
        
        if is_hash_id(shelter.id):
            hash_shelters.append({
                'id': shelter.id,
                'name': name,
                'ref': shelter.reference
            })
        else:
            named_shelters.append({
                'id': shelter.id,
                'name': name
            })
    
    print(f"✅ KEEP ({len(named_shelters)} named shelters):")
    for shelter in sorted(named_shelters, key=lambda x: x['id']):
        print(f"   {shelter['id']} → {shelter['name']}")
    
    print(f"\n❌ DELETE ({len(hash_shelters)} hash ID shelters):")
    for shelter in hash_shelters:
        print(f"   {shelter['id']} → {shelter['name']}")
    
    if dry_run:
        print(f"\n🔮 DRY RUN: Would delete {len(hash_shelters)} hash shelters")
        print(f"📊 Final count: {len(named_shelters)} shelters (target: 10)")
        print("💡 Add --execute flag to perform actual deletion")
        return
    
    # Execute deletion
    print(f"\n🗑️  DELETING {len(hash_shelters)} hash shelters...")
    deleted_count = 0
    
    for shelter in hash_shelters:
        try:
            shelter['ref'].delete()
            deleted_count += 1
            print(f"   ✅ Deleted: {shelter['name']} (ID: {shelter['id']})")
        except Exception as e:
            print(f"   ❌ Failed to delete {shelter['name']}: {e}")
    
    print(f"\n✅ Successfully deleted {deleted_count}/{len(hash_shelters)} shelters")
    print(f"🎯 Shelter count: {len(shelters)} → {len(named_shelters)}")

if __name__ == "__main__":
    main()
