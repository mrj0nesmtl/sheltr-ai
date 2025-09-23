"""
Migration Router for Donation Architecture Cleanup
=================================================

This router provides endpoints for safely migrating donations
from demo_donations to proper tenant structure.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import asyncio
from datetime import datetime

from google.cloud import firestore
from google.cloud.firestore import Client

router = APIRouter(prefix="/migration", tags=["migration"])

# Initialize Firestore client
db: Client = firestore.Client(project="sheltr-ai")

OLD_BREWERY_MISSION_TENANT_ID = "YDJCJnuLGMC9mWOWDSOa"

class MigrationAnalysis(BaseModel):
    total_donations: int
    total_amount: float
    obm_donations: int
    donations_by_source: Dict[str, int]
    existing_tenant_donations: int
    existing_tenant_amount: float

class MigrationResult(BaseModel):
    success: bool
    migrated_count: int
    migrated_total: float
    verification: Dict[str, Any]
    message: str

@router.get("/analyze-donations", response_model=MigrationAnalysis)
async def analyze_donation_structure():
    """
    Analyze current donation data structure before migration
    """
    try:
        print("🔍 Analyzing current donation data structure...")
        
        # Get all demo donations
        demo_donations_ref = db.collection('demo_donations')
        demo_docs = demo_donations_ref.stream()
        
        total_amount = 0
        obm_donations = 0
        donations_by_source = {}
        donation_count = 0
        
        for doc in demo_docs:
            data = doc.to_dict()
            donation_count += 1
            
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
        
        return MigrationAnalysis(
            total_donations=donation_count,
            total_amount=total_amount,
            obm_donations=obm_donations,
            donations_by_source=donations_by_source,
            existing_tenant_donations=len(tenant_docs),
            existing_tenant_amount=tenant_total
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/migrate-donations", response_model=MigrationResult)
async def migrate_donations_to_tenant():
    """
    Migrate donations from demo_donations to proper tenant structure
    """
    try:
        print("🚀 Starting donation migration...")
        
        # First, analyze current state
        analysis = await analyze_donation_structure()
        
        # Get all demo donations
        demo_donations_ref = db.collection('demo_donations')
        demo_docs = demo_donations_ref.stream()
        
        # Prepare for migration
        tenant_donations_ref = db.collection(f'tenants/{OLD_BREWERY_MISSION_TENANT_ID}/donations')
        migrated_count = 0
        migrated_total = 0
        
        batch = db.batch()
        batch_count = 0
        
        for doc in demo_docs:
            donation_data = doc.to_dict()
            
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
                print(f"📝 Migrated batch: {migrated_count} donations")
                batch = db.batch()
                batch_count = 0
        
        # Commit final batch
        if batch_count > 0:
            batch.commit()
        
        # Verify migration
        verification = await verify_migration()
        
        return MigrationResult(
            success=True,
            migrated_count=migrated_count,
            migrated_total=migrated_total,
            verification=verification,
            message=f"Successfully migrated {migrated_count} donations (${migrated_total}) to tenant collection"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Migration failed: {str(e)}")

async def verify_migration():
    """Verify the migration was successful"""
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
    
    return {
        "total_tenant_donations": len(tenant_docs),
        "total_amount": tenant_total,
        "demo_donations": demo_count,
        "migration_successful": demo_count > 0
    }

@router.get("/verify-migration")
async def verify_migration_endpoint():
    """
    Verify the current state after migration
    """
    try:
        verification = await verify_migration()
        return verification
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@router.get("/analyze-shelters")
async def analyze_shelter_structure():
    """
    Analyze current shelter and user structure for debugging
    """
    try:
        print("🔍 Analyzing shelter and user structure...")
        
        # Get all shelters
        shelters_ref = db.collection('shelters')
        shelter_docs = list(shelters_ref.stream())
        
        shelters_data = []
        for doc in shelter_docs:
            data = doc.to_dict()
            shelters_data.append({
                "id": doc.id,
                "name": data.get('name', 'Unknown'),
                "status": data.get('status', 'unknown'),
                "capacity": data.get('capacity', 0)
            })
        
        # Get all users and their shelter assignments
        users_ref = db.collection('users')
        user_docs = list(users_ref.stream())
        
        shelter_admins = []
        for doc in user_docs:
            data = doc.to_dict()
            if data.get('role') == 'admin':  # shelter admin role
                shelter_admins.append({
                    "email": data.get('email', 'unknown'),
                    "shelter_id": data.get('shelter_id'),
                    "customClaims_shelter_id": data.get('customClaims', {}).get('shelter_id') if data.get('customClaims') else None
                })
        
        return {
            "shelters": shelters_data,
            "shelter_admins": shelter_admins,
            "total_shelters": len(shelter_docs),
            "total_shelter_admins": len(shelter_admins)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Shelter analysis failed: {str(e)}")

@router.post("/assign-shelter-admin")
async def assign_shelter_admin(email: str, shelter_id: str):
    """
    Assign a shelter admin to a specific shelter
    """
    try:
        print(f"🔧 Assigning {email} to shelter {shelter_id}...")
        
        # Find the user
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email)
        user_docs = list(query.stream())
        
        if not user_docs:
            raise HTTPException(status_code=404, detail=f"User {email} not found")
        
        user_doc = user_docs[0]
        
        # Verify the shelter exists
        shelter_ref = db.collection('shelters').document(shelter_id)
        shelter_doc = shelter_ref.get()
        
        if not shelter_doc.exists:
            raise HTTPException(status_code=404, detail=f"Shelter {shelter_id} not found")
        
        # Update the user's shelter_id
        user_doc.reference.update({
            'shelter_id': shelter_id,
            'updated_at': datetime.utcnow()
        })
        
        shelter_data = shelter_doc.to_dict()
        
        return {
            "success": True,
            "message": f"Successfully assigned {email} to {shelter_data.get('name', shelter_id)}",
            "user_email": email,
            "shelter_id": shelter_id,
            "shelter_name": shelter_data.get('name', shelter_id)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assignment failed: {str(e)}")
