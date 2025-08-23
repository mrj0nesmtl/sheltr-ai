#!/usr/bin/env python3
"""
Inspect the current tenants collection structure
"""

import firebase_admin
from firebase_admin import firestore, credentials
import json

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

print("🏢 Inspecting TENANTS collection:")
print("="*60)

# Get all tenant documents
tenants_ref = db.collection('tenants')
tenants = list(tenants_ref.stream())

print(f"📊 Found {len(tenants)} tenant documents:")
print()

for i, tenant in enumerate(tenants, 1):
    data = tenant.to_dict()
    print(f"{i}. Tenant ID: {tenant.id}")
    
    if data:
        print(f"   Data: {json.dumps(data, indent=4, default=str)}")
        
        # Check for subcollections
        try:
            # Check for platform subcollection
            platform_ref = tenant.reference.collection('platform')
            platform_docs = list(platform_ref.stream())
            if platform_docs:
                print(f"   📁 Has 'platform' subcollection with {len(platform_docs)} documents")
                
                for platform_doc in platform_docs:
                    print(f"      - {platform_doc.id}: {platform_doc.to_dict()}")
                    
                    # Check for shelters subcollection under platform
                    shelters_ref = platform_doc.reference.collection('shelters')
                    shelters_docs = list(shelters_ref.stream())
                    if shelters_docs:
                        print(f"        🏠 Has 'shelters' subcollection with {len(shelters_docs)} documents")
                        
                        # Check for data subcollection under shelters
                        for shelter_doc in shelters_docs:
                            data_ref = shelter_doc.reference.collection('data')
                            data_docs = list(data_ref.stream())
                            if data_docs:
                                print(f"          📋 Shelter '{shelter_doc.id}' has 'data' subcollection with {len(data_docs)} documents")
                            else:
                                print(f"          📋 Shelter '{shelter_doc.id}': {shelter_doc.to_dict()}")
        except Exception as e:
            print(f"   ❌ Error checking subcollections: {e}")
    else:
        print("   ⚠️  Empty document")
    
    print()

# Check if the top-level shelters collection exists
print("\n🏠 Checking top-level SHELTERS collection:")
shelters_ref = db.collection('shelters')
shelters = list(shelters_ref.stream())
print(f"📊 Found {len(shelters)} shelter documents in top-level collection")

print("\n💡 Analysis:")
print("- The migration plan was to restructure tenants, not delete it")
print("- Shelters should be under: tenants/{tenantId}/platform/shelters/data/")
print("- BUT we now have a top-level 'shelters' collection (which is working)")
print("- The 'tenants' collection might be legacy that can be cleaned up")
