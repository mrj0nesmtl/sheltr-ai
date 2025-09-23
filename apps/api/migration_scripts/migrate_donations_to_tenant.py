#!/usr/bin/env python3
"""
Donation Architecture Migration Script
=====================================

This script migrates donations from the demo_donations collection 
to the proper tenant structure (tenants/YDJCJnuLGMC9mWOWDSOa/donations)

Step 1 of 5: Data Migration
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, List, Any

from google.cloud import firestore
from google.cloud.firestore import Client

# Initialize Firestore client
db: Client = firestore.Client(project="sheltr-ai")

OLD_BREWERY_MISSION_TENANT_ID = "YDJCJnuLGMC9mWOWDSOa"

async def analyze_current_data():
    """Analyze current donation data structure"""
    print("🔍 STEP 1: Analyzing current donation data structure...")
    
    # Get all demo donations
    demo_donations_ref = db.collection('demo_donations')
    demo_docs = demo_donations_ref.stream()
    
    demo_donations = []
    total_amount = 0
    obm_donations = 0
    donations_by_source = {}
    donations_by_donor = {}
    
    for doc in demo_docs:
        data = doc.to_dict()
        data['_doc_id'] = doc.id
        demo_donations.append(data)
        
        amount = data.get('amount', {})
        if isinstance(amount, dict):
            amount_value = amount.get('total', 0) or amount.get('amount', 0)
        else:
            amount_value = amount or 0
        
        total_amount += amount_value
        
        shelter_id = data.get('shelter_id', '')
        if shelter_id in ['YDJCJnuLGMC9mWOWDSOa', 'old-brewery-mission']:
            obm_donations += 1
        
        # Track by source
        source = data.get('source', 'unknown')
        donations_by_source[source] = donations_by_source.get(source, 0) + 1
        
        # Track by donor
        donor = data.get('donor_id', 'anonymous')
        donations_by_donor[donor] = donations_by_donor.get(donor, 0) + amount_value
    
    print(f"📊 ANALYSIS RESULTS:")
    print(f"💰 Total amount: ${total_amount}")
    print(f"🏠 OBM donations: {obm_donations}/{len(demo_donations)}")
    print(f"📈 Total donations to migrate: {len(demo_donations)}")
    
    print("\n📈 By source:")
    for source, count in donations_by_source.items():
        print(f"  - {source}: {count} donations")
    
    print("\n👥 Top donors:")
    top_donors = sorted(donations_by_donor.items(), key=lambda x: x[1], reverse=True)[:5]
    for donor, amount in top_donors:
        print(f"  - {donor}: ${amount}")
    
    # Check existing tenant donations
    tenant_donations_ref = db.collection(f'tenants/{OLD_BREWERY_MISSION_TENANT_ID}/donations')
    tenant_docs = list(tenant_donations_ref.stream())
    
    tenant_total = 0
    for doc in tenant_docs:
        data = doc.to_dict()
        amount = data.get('amount', {})
        if isinstance(amount, dict):
            amount_value = amount.get('total', 0) or amount.get('amount', 0)
        else:
            amount_value = amount or 0
        tenant_total += amount_value
    
    print(f"\n🏢 Existing tenant donations: {len(tenant_docs)} (${tenant_total})")
    
    return demo_donations, total_amount

async def migrate_donations():
    """Migrate donations from demo_donations to tenant collection"""
    print("\n🚀 Starting donation migration...")
    
    demo_donations, expected_total = await analyze_current_data()
    
    print(f"\n🎯 MIGRATION PLAN:")
    print(f"1. Migrate {len(demo_donations)} donations")
    print(f"2. Expected total: ${expected_total}")
    print(f"3. Target: tenants/{OLD_BREWERY_MISSION_TENANT_ID}/donations")
    print(f"4. Mark all with demo: true flag")
    
    # Confirm before proceeding
    print("\n⚠️  This will migrate all demo donations to the real tenant structure.")
    print("📋 Each donation will be marked with 'demo: true' for easy identification.")
    
    # Proceed with migration
    tenant_donations_ref = db.collection(f'tenants/{OLD_BREWERY_MISSION_TENANT_ID}/donations')
    migrated_count = 0
    migrated_total = 0
    
    batch = db.batch()
    batch_count = 0
    
    for donation in demo_donations:
        # Prepare donation data for tenant collection
        donation_data = donation.copy()
        
        # Remove the document ID from the data
        donation_data.pop('_doc_id', None)
        
        # Ensure demo flag is set
        donation_data['demo'] = True
        donation_data['migrated_from_demo_collection'] = True
        donation_data['migration_timestamp'] = datetime.utcnow()
        
        # Normalize shelter_id to the correct tenant ID
        if donation_data.get('shelter_id') == 'old-brewery-mission':
            donation_data['shelter_id'] = OLD_BREWERY_MISSION_TENANT_ID
            donation_data['legacy_shelter_id'] = 'old-brewery-mission'
        
        # Add to batch
        new_doc_ref = tenant_donations_ref.document()
        batch.set(new_doc_ref, donation_data)
        
        # Track progress
        amount = donation_data.get('amount', {})
        if isinstance(amount, dict):
            amount_value = amount.get('total', 0) or amount.get('amount', 0)
        else:
            amount_value = amount or 0
        
        migrated_total += amount_value
        migrated_count += 1
        batch_count += 1
        
        # Commit batch every 500 documents
        if batch_count >= 500:
            batch.commit()
            print(f"📝 Migrated batch: {migrated_count} donations (${migrated_total})")
            batch = db.batch()
            batch_count = 0
    
    # Commit final batch
    if batch_count > 0:
        batch.commit()
    
    print(f"\n✅ MIGRATION COMPLETE!")
    print(f"📊 Migrated: {migrated_count} donations")
    print(f"💰 Total amount: ${migrated_total}")
    print(f"🎯 All donations now in: tenants/{OLD_BREWERY_MISSION_TENANT_ID}/donations")
    
    return migrated_count, migrated_total

async def verify_migration():
    """Verify the migration was successful"""
    print("\n🔍 Verifying migration...")
    
    # Count tenant donations
    tenant_donations_ref = db.collection(f'tenants/{OLD_BREWERY_MISSION_TENANT_ID}/donations')
    tenant_docs = list(tenant_donations_ref.stream())
    
    tenant_total = 0
    demo_count = 0
    
    for doc in tenant_docs:
        data = doc.to_dict()
        amount = data.get('amount', {})
        if isinstance(amount, dict):
            amount_value = amount.get('total', 0) or amount.get('amount', 0)
        else:
            amount_value = amount or 0
        tenant_total += amount_value
        
        if data.get('demo', False):
            demo_count += 1
    
    print(f"✅ Verification Results:")
    print(f"📊 Total tenant donations: {len(tenant_docs)}")
    print(f"💰 Total amount: ${tenant_total}")
    print(f"🧪 Demo donations: {demo_count}")
    
    return len(tenant_docs), tenant_total, demo_count

async def main():
    """Main migration function"""
    try:
        print("🏗️  DONATION ARCHITECTURE MIGRATION")
        print("=" * 50)
        
        # Step 1: Analyze and migrate
        migrated_count, migrated_total = await migrate_donations()
        
        # Step 2: Verify
        total_docs, total_amount, demo_count = await verify_migration()
        
        print("\n🎉 MIGRATION SUMMARY:")
        print(f"✅ Successfully migrated {migrated_count} donations")
        print(f"💰 Total value: ${migrated_total}")
        print(f"📍 Location: tenants/{OLD_BREWERY_MISSION_TENANT_ID}/donations")
        print(f"🧪 Demo donations marked: {demo_count}")
        
        print("\n📋 NEXT STEPS:")
        print("1. ✅ Data Migration Complete")
        print("2. 🔄 Update donation creation endpoints")
        print("3. 🔄 Update analytics services")
        print("4. 🔄 Test data integrity")
        print("5. 🔄 Clean up demo_donations references")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
