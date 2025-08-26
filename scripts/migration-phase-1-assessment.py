#!/usr/bin/env python3
"""
PHASE 1: Database Assessment & Backup
Assess current collections and create comprehensive backup before migration
"""

import firebase_admin
from firebase_admin import firestore, credentials
import json
from datetime import datetime
import os

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        cred = credentials.Certificate('service-account-key.json')
        firebase_admin.initialize_app(cred)
    return firestore.client()

def assess_current_structure(db):
    """Assess current database structure"""
    print("🔍 PHASE 1: DATABASE STRUCTURE ASSESSMENT")
    print("=" * 80)
    
    assessment = {
        "timestamp": datetime.now().isoformat(),
        "collections": {},
        "tenant_data": {},
        "shelter_data": {}
    }
    
    # 1. Check top-level /shelters collection
    print("\n1️⃣ TOP-LEVEL /shelters COLLECTION:")
    print("-" * 50)
    shelters_ref = db.collection('shelters')
    shelters_docs = shelters_ref.get()
    
    assessment["shelter_data"]["top_level"] = {
        "count": len(shelters_docs),
        "shelters": []
    }
    
    for doc in shelters_docs:
        data = doc.to_dict()
        shelter_info = {
            "id": doc.id,
            "name": data.get('name'),
            "address": data.get('address'),
            "type": data.get('type'),
            "created": str(data.get('createdAt'))
        }
        assessment["shelter_data"]["top_level"]["shelters"].append(shelter_info)
        print(f"  ✅ {doc.id}: {data.get('name')}")
    
    # 2. Check tenant collection structure
    print("\n2️⃣ TENANT STRUCTURE ANALYSIS:")
    print("-" * 50)
    
    # Check if tenant structure exists
    tenant_id = 'Vc48fjy0cajJrstbLQRr'
    try:
        tenant_shelters_ref = db.collection('tenants').document(tenant_id).collection('platform').document('shelters').collection('data')
        tenant_shelters_docs = tenant_shelters_ref.get()
        
        assessment["shelter_data"]["tenant_structure"] = {
            "tenant_id": tenant_id,
            "count": len(tenant_shelters_docs),
            "shelters": []
        }
        
        for doc in tenant_shelters_docs:
            data = doc.to_dict()
            migration_info = data.get('_migration', {})
            shelter_info = {
                "id": doc.id,
                "name": data.get('name'),
                "address": data.get('address'),
                "type": data.get('type'),
                "migration_date": str(migration_info.get('migratedAt', 'N/A')),
                "original_path": migration_info.get('originalPath', 'N/A')
            }
            assessment["shelter_data"]["tenant_structure"]["shelters"].append(shelter_info)
            print(f"  📦 {doc.id}: {data.get('name')} (Migrated: {migration_info.get('migratedAt', 'N/A')})")
    
    except Exception as e:
        print(f"  ❌ Error accessing tenant structure: {e}")
        assessment["shelter_data"]["tenant_structure"] = {"error": str(e)}
    
    # 3. Check all top-level collections
    print("\n3️⃣ ALL TOP-LEVEL COLLECTIONS:")
    print("-" * 50)
    collections = db.collections()
    collection_names = []
    
    for col in collections:
        col_ref = db.collection(col.id)
        docs = col_ref.limit(1).get()  # Get count efficiently
        doc_count = len(list(col_ref.stream()))
        
        collection_info = {
            "name": col.id,
            "document_count": doc_count
        }
        assessment["collections"][col.id] = collection_info
        collection_names.append(col.id)
        print(f"  📁 {col.id}: {doc_count} documents")
    
    # 4. Check for existing participants, users, etc.
    print("\n4️⃣ KEY COLLECTIONS ANALYSIS:")
    print("-" * 50)
    
    key_collections = ['users', 'participants', 'donations', 'services']
    for col_name in key_collections:
        if col_name in collection_names:
            col_ref = db.collection(col_name)
            docs = list(col_ref.limit(5).stream())
            print(f"  📊 {col_name}: {len(list(col_ref.stream()))} documents")
            
            # Sample some data
            for i, doc in enumerate(docs[:3]):
                data = doc.to_dict()
                if 'role' in data:
                    print(f"    - {doc.id}: role={data.get('role')}")
                elif 'name' in data:
                    print(f"    - {doc.id}: name={data.get('name')}")
                else:
                    print(f"    - {doc.id}: {list(data.keys())[:3]}")
    
    return assessment

def create_backup(db, assessment):
    """Create comprehensive backup"""
    print("\n💾 CREATING COMPREHENSIVE BACKUP:")
    print("-" * 50)
    
    backup_timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = f"backup_{backup_timestamp}"
    os.makedirs(backup_dir, exist_ok=True)
    
    # Save assessment
    with open(f"{backup_dir}/assessment.json", 'w') as f:
        json.dump(assessment, f, indent=2)
    print(f"  ✅ Assessment saved to {backup_dir}/assessment.json")
    
    # Backup critical collections
    critical_collections = ['shelters', 'users', 'participants', 'donations']
    
    for col_name in critical_collections:
        if col_name in assessment["collections"]:
            print(f"  📦 Backing up {col_name}...")
            col_ref = db.collection(col_name)
            docs = col_ref.stream()
            
            backup_data = []
            for doc in docs:
                doc_data = doc.to_dict()
                doc_data['_doc_id'] = doc.id
                backup_data.append(doc_data)
            
            with open(f"{backup_dir}/{col_name}_backup.json", 'w') as f:
                json.dump(backup_data, f, indent=2, default=str)
            print(f"    ✅ {len(backup_data)} documents backed up")
    
    # Backup tenant structure if it exists
    if "tenant_structure" in assessment["shelter_data"] and "error" not in assessment["shelter_data"]["tenant_structure"]:
        print(f"  📦 Backing up tenant structure...")
        tenant_id = assessment["shelter_data"]["tenant_structure"]["tenant_id"]
        
        try:
            tenant_shelters_ref = db.collection('tenants').document(tenant_id).collection('platform').document('shelters').collection('data')
            tenant_docs = tenant_shelters_ref.stream()
            
            tenant_backup = []
            for doc in tenant_docs:
                doc_data = doc.to_dict()
                doc_data['_doc_id'] = doc.id
                tenant_backup.append(doc_data)
            
            with open(f"{backup_dir}/tenant_shelters_backup.json", 'w') as f:
                json.dump(tenant_backup, f, indent=2, default=str)
            print(f"    ✅ {len(tenant_backup)} tenant shelter documents backed up")
            
        except Exception as e:
            print(f"    ❌ Error backing up tenant structure: {e}")
    
    print(f"\n✅ BACKUP COMPLETE: {backup_dir}/")
    return backup_dir

def main():
    """Main assessment and backup function"""
    db = initialize_firebase()
    
    # Perform assessment
    assessment = assess_current_structure(db)
    
    # Create backup
    backup_dir = create_backup(db, assessment)
    
    # Generate migration recommendations
    print("\n🎯 MIGRATION RECOMMENDATIONS:")
    print("-" * 50)
    
    top_level_count = assessment["shelter_data"]["top_level"]["count"]
    tenant_count = assessment["shelter_data"].get("tenant_structure", {}).get("count", 0)
    
    print(f"  📊 Found {top_level_count} shelters in top-level collection")
    print(f"  📊 Found {tenant_count} shelters in tenant structure")
    
    if top_level_count > 0 and tenant_count > 0:
        print("  🚨 DUPLICATE DATA DETECTED - Migration Required")
        print("  📋 Recommendation: Consolidate to proper tenant structure")
    elif top_level_count > 0 and tenant_count == 0:
        print("  ✅ Use top-level as source for tenant migration")
    elif top_level_count == 0 and tenant_count > 0:
        print("  ✅ Restructure existing tenant data to proper format")
    
    print(f"\n📁 All data backed up to: {backup_dir}/")
    print("🚀 Ready for Phase 2: Tenant Structure Creation")

if __name__ == "__main__":
    main()
