#!/usr/bin/env python3
"""
Debug shelter data structure to see what fields are missing
"""

import firebase_admin
from firebase_admin import firestore, credentials
import json

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

print("🔍 Debugging shelter data structure:")
print("="*60)

# Get all shelters
shelters_ref = db.collection('shelters')
shelters = list(shelters_ref.stream())

print(f"📊 Found {len(shelters)} shelters in top-level collection")
print()

# Expected fields from Shelter interface (TypeScript)
expected_fields = [
    'id', 'name', 'location', 'address', 'coordinates', 'type', 'capacity',
    'currentOccupancy', 'participants', 'totalDonations', 'status', 
    'complianceScore', 'lastInspection', 'contact', 'joinDate', 'rating',
    'tenantId', 'createdAt', 'updatedAt'
]

for i, shelter in enumerate(shelters[:3], 1):  # Check first 3 shelters
    data = shelter.to_dict()
    print(f"{i}. Shelter: {shelter.id}")
    print(f"   Name: {data.get('name', 'MISSING')}")
    
    print("   📋 Field Analysis:")
    missing_fields = []
    present_fields = []
    
    for field in expected_fields:
        if field == 'id':
            present_fields.append(field)  # ID is always present
        elif field in data:
            present_fields.append(field)
        else:
            missing_fields.append(field)
    
    print(f"   ✅ Present ({len(present_fields)}): {', '.join(present_fields)}")
    print(f"   ❌ Missing ({len(missing_fields)}): {', '.join(missing_fields)}")
    
    # Show actual data structure
    print("   📄 Actual data:")
    print(json.dumps(data, indent=6, default=str))
    print()

print("💡 Analysis:")
print("- Check if missing fields are causing frontend issues")
print("- Coordinates might be missing (required for map display)")
print("- Contact object structure might be incorrect")
print("- Some numeric fields might be missing (capacity, participants, etc.)")
