#!/usr/bin/env python3
"""
PHASE 2: Create Proper Tenant Structure
Transform current shelter data into proper multi-tenant architecture
Each shelter becomes its own tenant with isolated data
"""

import firebase_admin
from firebase_admin import firestore, credentials
import json
from datetime import datetime
import re

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        cred = credentials.Certificate('service-account-key.json')
        firebase_admin.initialize_app(cred)
    return firestore.client()

def create_tenant_id(shelter_name):
    """Create tenant ID from shelter name"""
    # Convert name to kebab-case
    tenant_id = shelter_name.lower()
    tenant_id = re.sub(r'[^\w\s-]', '', tenant_id)  # Remove special chars
    tenant_id = re.sub(r'[-\s]+', '-', tenant_id)   # Replace spaces/hyphens
    tenant_id = tenant_id.strip('-')                # Remove leading/trailing hyphens
    
    return tenant_id

def create_tenant_structure(db, shelter_data, backup_dir):
    """Create proper tenant structure for each shelter"""
    print("🏗️ PHASE 2: CREATING PROPER TENANT STRUCTURE")
    print("=" * 80)
    
    migration_log = {
        "timestamp": datetime.now().isoformat(),
        "phase": "tenant_creation",
        "tenants_created": [],
        "errors": []
    }
    
    # Get shelter data from assessment
    with open(f"{backup_dir}/assessment.json", 'r') as f:
        assessment = json.load(f)
    
    # Use top-level shelters as source (they have better IDs)
    shelters = assessment["shelter_data"]["top_level"]["shelters"]
    
    print(f"📊 Processing {len(shelters)} shelters into tenant structure...")
    
    for shelter in shelters:
        try:
            # Create tenant ID
            tenant_id = create_tenant_id(shelter["name"])
            print(f"\n🏠 Creating tenant: {tenant_id} (for {shelter['name']})")
            
            # Create tenant directory structure
            tenant_ref = db.collection('tenants').document(tenant_id)
            
            # 1. Create shelter settings/profile
            shelter_profile = {
                "shelter_info": {
                    "original_id": shelter["id"],
                    "name": shelter["name"],
                    "address": shelter.get("address", ""),
                    "type": shelter.get("type", "Emergency Shelter"),
                    "created_at": datetime.now(),
                    "status": "active",
                    "platform_subscription": "free",  # FREE SAAS MODEL
                    "features_enabled": {
                        "participant_management": True,
                        "donation_processing": True,
                        "qr_code_generation": True,
                        "analytics_dashboard": True,
                        "staff_management": True,
                        "resource_tracking": True,
                        "smartfund_integration": True
                    }
                },
                "admin_config": {
                    "primary_admin": None,  # To be set when admin users are migrated
                    "timezone": "America/Montreal",  # Default for Montreal shelters
                    "currency": "CAD",
                    "language": "en"
                },
                "platform_config": {
                    "tenant_type": "shelter",
                    "created_at": datetime.now(),
                    "migration_source": "top_level_shelters",
                    "migration_date": datetime.now()
                }
            }
            
            # Set shelter profile
            tenant_ref.collection('settings').document('shelter_profile').set(shelter_profile)
            print(f"  ✅ Created shelter profile")
            
            # 2. Create empty collections with proper structure
            collections_to_create = [
                "participants",
                "staff", 
                "services",
                "donations",
                "resources",
                "analytics",
                "qr_codes"
            ]
            
            for collection_name in collections_to_create:
                # Create a placeholder document to establish collection
                placeholder_ref = tenant_ref.collection(collection_name).document('_placeholder')
                placeholder_ref.set({
                    "created_at": datetime.now(),
                    "type": "placeholder",
                    "note": f"Placeholder for {collection_name} collection - remove after first real document"
                })
                print(f"  ✅ Created {collection_name} collection")
            
            # 3. If there's existing shelter data from tenant structure, migrate it
            if "tenant_structure" in assessment["shelter_data"]:
                tenant_shelters = assessment["shelter_data"]["tenant_structure"]["shelters"]
                
                # Find matching shelter in tenant structure
                matching_tenant_shelter = None
                for ts in tenant_shelters:
                    if ts["name"] == shelter["name"]:
                        matching_tenant_shelter = ts
                        break
                
                if matching_tenant_shelter:
                    print(f"  🔄 Found matching data in old tenant structure: {matching_tenant_shelter['id']}")
                    
                    # Copy the data from old tenant structure
                    old_tenant_id = 'Vc48fjy0cajJrstbLQRr'
                    old_shelter_ref = db.collection('tenants').document(old_tenant_id).collection('platform').document('shelters').collection('data').document(matching_tenant_shelter['id'])
                    old_shelter_doc = old_shelter_ref.get()
                    
                    if old_shelter_doc.exists:
                        old_data = old_shelter_doc.to_dict()
                        
                        # Update shelter profile with additional data from old structure
                        additional_data = {
                            "capacity": old_data.get("capacity"),
                            "current_occupancy": old_data.get("currentOccupancy"),
                            "contact": old_data.get("contact"),
                            "coordinates": old_data.get("coordinates"),
                            "compliance_score": old_data.get("complianceScore"),
                            "last_inspection": old_data.get("lastInspection"),
                            "rating": old_data.get("rating")
                        }
                        
                        # Update shelter profile with additional data
                        tenant_ref.collection('settings').document('shelter_profile').update({
                            "shelter_info": firestore.ArrayUnion([additional_data])
                        })
                        print(f"    ✅ Migrated additional data from old tenant structure")
            
            # Log successful creation
            migration_log["tenants_created"].append({
                "tenant_id": tenant_id,
                "shelter_name": shelter["name"],
                "original_id": shelter["id"],
                "created_at": datetime.now().isoformat()
            })
            
            print(f"  ✅ Tenant {tenant_id} created successfully")
        
        except Exception as e:
            error_msg = f"Error creating tenant for {shelter['name']}: {str(e)}"
            print(f"  ❌ {error_msg}")
            migration_log["errors"].append(error_msg)
    
    # Save migration log
    with open(f"{backup_dir}/phase2_migration_log.json", 'w') as f:
        json.dump(migration_log, f, indent=2, default=str)
    
    print(f"\n✅ PHASE 2 COMPLETE:")
    print(f"  📊 {len(migration_log['tenants_created'])} tenants created")
    print(f"  ❌ {len(migration_log['errors'])} errors encountered")
    print(f"  📁 Migration log saved to {backup_dir}/phase2_migration_log.json")
    
    return migration_log

def create_global_collections(db):
    """Create global collections for cross-tenant data"""
    print("\n🌍 CREATING GLOBAL COLLECTIONS:")
    print("-" * 50)
    
    global_collections = {
        "platform_admin": {
            "super_admins": "Platform administrators",
            "system_metrics": "Cross-tenant analytics", 
            "tenant_directory": "All shelter tenants",
            "platform_config": "Global platform settings"
        },
        "smartfund": {
            "pool_balance": "15% global housing fund",
            "distributions": "Fund distribution records",
            "allocation_rules": "Distribution algorithms"
        },
        "cross_shelter_donations": {
            "donor_profiles": "Global donor accounts",
            "multi_shelter_campaigns": "Cross-shelter fundraising",
            "global_impact": "Platform-wide impact"
        },
        "shared_services": {
            "ai_chatbot": "Shared AI system",
            "knowledge_base": "Platform documentation", 
            "emergency_services": "Crisis response system",
            "compliance_tools": "Shared compliance resources"
        },
        "blockchain": {
            "token_transactions": "All SHELTR-S/SHELTR transactions",
            "smart_contracts": "Contract addresses & configs",
            "wallet_registry": "All participant wallets"
        }
    }
    
    for main_collection, subcollections in global_collections.items():
        for subcoll_name, description in subcollections.items():
            collection_ref = db.collection('global').document(main_collection).collection(subcoll_name)
            
            # Create placeholder
            collection_ref.document('_placeholder').set({
                "created_at": datetime.now(),
                "type": "placeholder",
                "description": description,
                "note": "Global collection - remove placeholder after first real document"
            })
            
            print(f"  ✅ Created global/{main_collection}/{subcoll_name}")
    
    print(f"  🌍 Global collections structure created")

def verify_tenant_structure(db, migration_log):
    """Verify the created tenant structure"""
    print("\n🔍 VERIFYING TENANT STRUCTURE:")
    print("-" * 50)
    
    verification_results = {
        "tenants_verified": 0,
        "collections_verified": 0,
        "issues": []
    }
    
    for tenant_info in migration_log["tenants_created"]:
        tenant_id = tenant_info["tenant_id"]
        
        try:
            # Check tenant exists
            tenant_ref = db.collection('tenants').document(tenant_id)
            
            # Check settings exist
            settings_ref = tenant_ref.collection('settings').document('shelter_profile')
            settings_doc = settings_ref.get()
            
            if settings_doc.exists:
                print(f"  ✅ {tenant_id}: Settings verified")
                verification_results["tenants_verified"] += 1
                
                # Check collections exist
                expected_collections = ["participants", "staff", "services", "donations", "resources", "analytics", "qr_codes"]
                
                for collection_name in expected_collections:
                    collection_ref = tenant_ref.collection(collection_name)
                    docs = collection_ref.limit(1).get()
                    
                    if len(docs) > 0:
                        verification_results["collections_verified"] += 1
                    else:
                        verification_results["issues"].append(f"{tenant_id}: Missing {collection_name} collection")
            
            else:
                verification_results["issues"].append(f"{tenant_id}: Missing settings document")
        
        except Exception as e:
            verification_results["issues"].append(f"{tenant_id}: Verification error - {str(e)}")
    
    print(f"\n📊 VERIFICATION RESULTS:")
    print(f"  ✅ {verification_results['tenants_verified']} tenants verified")
    print(f"  📁 {verification_results['collections_verified']} collections verified")
    print(f"  ⚠️  {len(verification_results['issues'])} issues found")
    
    if verification_results["issues"]:
        print(f"\n⚠️  ISSUES:")
        for issue in verification_results["issues"][:5]:  # Show first 5 issues
            print(f"    - {issue}")
    
    return verification_results

def main():
    """Main tenant creation function"""
    # Load backup directory from Phase 1
    import glob
    backup_dirs = glob.glob("backup_*")
    if not backup_dirs:
        print("❌ No backup directory found. Run Phase 1 first.")
        return
    
    backup_dir = sorted(backup_dirs)[-1]  # Get latest backup
    print(f"📁 Using backup directory: {backup_dir}")
    
    db = initialize_firebase()
    
    # Create tenant structure
    migration_log = create_tenant_structure(db, None, backup_dir)
    
    # Create global collections
    create_global_collections(db)
    
    # Verify structure
    verification_results = verify_tenant_structure(db, migration_log)
    
    print(f"\n🎉 PHASE 2 COMPLETE!")
    print(f"🚀 Ready for Phase 3: Data Migration & Frontend Updates")

if __name__ == "__main__":
    main()
