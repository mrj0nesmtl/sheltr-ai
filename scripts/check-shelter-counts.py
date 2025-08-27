#!/usr/bin/env python3
"""Check shelter counts to debug production vs local mismatch"""

import firebase_admin
from firebase_admin import credentials, firestore

try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

db = firestore.client()

def check_shelters():
    print("🏠 Checking shelter counts...")
    
    shelters = db.collection('shelters').stream()
    total = 0
    active = 0
    
    for doc in shelters:
        data = doc.to_dict()
        status = data.get('status', 'no-status')
        total += 1
        if status == 'active' or not status:
            active += 1
        print(f"   {doc.id}: {data.get('name', 'Unknown')} - {status}")
    
    print(f"\n📊 Results: {active} active out of {total} total shelters")

if __name__ == "__main__":
    check_shelters()
