#!/usr/bin/env python3
"""
Simple script to list all shelters and their data
"""

import firebase_admin
from firebase_admin import firestore, credentials
import json

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

print("🏠 Listing all shelters:")
print("="*50)

shelters_ref = db.collection('shelters')
shelters = shelters_ref.stream()

count = 0
names_seen = {}

for shelter in shelters:
    count += 1
    data = shelter.to_dict()
    
    name = data.get('name', 'NO NAME') if data else 'EMPTY DOCUMENT'
    address = data.get('address', 'No address') if data else 'No data'
    status = data.get('status', 'No status') if data else 'No data'
    
    print(f"{count:2d}. ID: {shelter.id}")
    print(f"    Name: {name}")
    print(f"    Address: {address}")
    print(f"    Status: {status}")
    print()
    
    # Track name duplicates
    if name in names_seen:
        names_seen[name] += 1
        print(f"    ⚠️  DUPLICATE NAME: {name} (occurrence #{names_seen[name]})")
    else:
        names_seen[name] = 1

print(f"📊 Total: {count} shelters")
print(f"📋 Unique names: {len(names_seen)}")

if any(count > 1 for count in names_seen.values()):
    print("\n🔄 DUPLICATES FOUND:")
    for name, count in names_seen.items():
        if count > 1:
            print(f"   {name}: {count} entries")
