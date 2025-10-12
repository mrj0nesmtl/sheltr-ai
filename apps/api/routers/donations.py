"""
SHELTR-AI Donations Router
Handles donation-related operations including fetching active shelters and verified participants
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
import logging
from services.firebase_service import FirebaseService
from firebase_admin import firestore

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/donations",
    tags=["Donations"],
    responses={404: {"description": "Not found"}},
)

# Initialize Firebase service
firebase_service = FirebaseService()
db = firestore.client()


@router.get("/active-donation-targets")
async def get_active_donation_targets():
    """
    Get active shelters and verified participants for donation selection.
    This endpoint is public/authenticated to allow donors to see donation options.
    
    Returns:
        dict: Contains active_shelters and verified_participants arrays
    """
    try:
        logger.info("🏢 Fetching active donation targets...")
        
        # Fetch ACTIVE shelters from shelters collection (not tenants)
        shelters_ref = db.collection('shelters')
        shelters_query = shelters_ref.where('status', '==', 'active').stream()
        
        active_shelters = []
        for doc in shelters_query:
            data = doc.to_dict()
            
            # Count participants for this shelter (use 'active' status, not 'verified')
            participants_count = 0
            try:
                participants_query = db.collection('users')\
                    .where('role', '==', 'participant')\
                    .where('shelter_id', '==', doc.id)\
                    .where('status', '==', 'active')\
                    .stream()
                participants_count = sum(1 for _ in participants_query)
            except Exception as e:
                logger.warning(f"Could not count participants for shelter {doc.id}: {e}")
            
            shelter = {
                'id': doc.id,
                'name': data.get('name', 'Unknown Shelter'),
                'location': data.get('address', 'Location TBD'),
                'city': data.get('city', 'Montreal'),  # Default
                'province': data.get('province', 'QC'),  # Default
                'description': data.get('description', 'Providing support services'),
                'participantCount': participants_count,
                'totalDonations': data.get('totalDonations', 0),
                'status': data.get('status', 'active')
            }
            active_shelters.append(shelter)
        
        logger.info(f"✅ Found {len(active_shelters)} active shelter(s)")
        
        # Fetch ACTIVE participants from users collection (status is 'active', not 'verified')
        participants_ref = db.collection('users')
        participants_query = participants_ref\
            .where('role', '==', 'participant')\
            .where('status', '==', 'active')\
            .stream()
        
        verified_participants = []
        for doc in participants_query:
            data = doc.to_dict()
            
            # Get shelter name from shelter_id (from shelters collection, not tenants)
            shelter_name = 'Unknown Shelter'
            if data.get('shelter_id'):
                try:
                    shelter_doc = db.collection('shelters').document(data.get('shelter_id')).get()
                    if shelter_doc.exists:
                        shelter_name = shelter_doc.to_dict().get('name', 'Unknown Shelter')
                except Exception as e:
                    logger.warning(f"Could not fetch shelter name for participant {doc.id}: {e}")
            
            # Calculate actual total received from demo_donations
            # Using SmartProof 80-15-5 model: 80% direct, 15% housing, 5% shelter
            total_full_donations = 0
            total_direct_amount = 0  # 80% that goes directly to participant
            donation_count = 0
            try:
                donations_query = db.collection('demo_donations')\
                    .where('participant_id', '==', doc.id)\
                    .where('status', '==', 'completed')\
                    .stream()
                
                for donation_doc in donations_query:
                    donation_data = donation_doc.to_dict()
                    amount = donation_data.get('amount', {})
                    
                    # Get breakdown if available
                    if isinstance(amount, dict):
                        breakdown = amount.get('breakdown', {})
                        if breakdown and 'direct' in breakdown:
                            # Use the 80% direct amount from breakdown
                            direct = breakdown.get('direct', 0)
                            total_direct_amount += direct
                            # Calculate full amount from direct (direct / 0.80)
                            total_full_donations += amount.get('total', direct / 0.80)
                        else:
                            # No breakdown, calculate 80% manually
                            full = amount.get('total', 0)
                            total_full_donations += full
                            total_direct_amount += full * 0.80
                    else:
                        # Simple number format
                        total_full_donations += amount
                        total_direct_amount += amount * 0.80
                    
                    donation_count += 1
                
                logger.info(f"  💰 {data.get('firstName')} {data.get('lastName')}: ${total_direct_amount:.2f} direct (80%) from ${total_full_donations:.2f} total ({donation_count} donations)")
            except Exception as e:
                logger.warning(f"Could not fetch donations for participant {doc.id}: {e}")
            
            # Calculate housing fund as 15% of the DIRECT amount (matches frontend logic)
            # Frontend does: housingFund = participant.total_received * 0.15
            # where total_received is the 80% direct amount
            housing_fund = int(total_direct_amount * 0.15)
            housing_goal = 5000  # Standard emergency housing deposit goal
            
            participant = {
                'id': doc.id,
                'name': f"{data.get('firstName', '')} {data.get('lastName', '')}".strip() or 'Anonymous',
                'firstName': data.get('firstName', 'Anonymous'),
                'lastName': data.get('lastName', ''),
                'shelter': shelter_name,
                'shelter_id': data.get('shelter_id'),
                'story': data.get('bio') or data.get('story') or 'Seeking support and assistance',
                'goal': data.get('goal') or 'Achieving stability and independence',
                'raised': housing_fund,  # Housing fund (15% of direct amount)
                'target': housing_goal,  # $5,000 emergency housing goal
                'total_received': int(total_direct_amount),  # 80% direct amount (matches frontend)
                'total_full_donations': int(total_full_donations),  # 100% full donation amount
                'donation_count': donation_count,
                'status': data.get('status', 'active')
            }
            verified_participants.append(participant)
        
        logger.info(f"✅ Found {len(verified_participants)} active participant(s)")
        
        if not active_shelters:
            logger.warning("⚠️ No active shelters found in database")
        
        if not verified_participants:
            logger.warning("⚠️ No active participants found in database")
        
        return {
            "success": True,
            "active_shelters": active_shelters,
            "verified_participants": verified_participants,
            "counts": {
                "shelters": len(active_shelters),
                "participants": len(verified_participants)
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Error fetching donation targets: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch donation targets: {str(e)}"
        )


@router.get("/shelter/{shelter_id}/participants")
async def get_shelter_participants(shelter_id: str):
    """
    Get all active participants for a specific shelter.
    
    Args:
        shelter_id: The shelter's document ID
    
    Returns:
        list: Active participants for the shelter
    """
    try:
        logger.info(f"👥 Fetching participants for shelter: {shelter_id}")
        
        # Fetch shelter info (from shelters collection, not tenants)
        shelter_doc = db.collection('shelters').document(shelter_id).get()
        if not shelter_doc.exists:
            raise HTTPException(status_code=404, detail="Shelter not found")
        
        shelter_data = shelter_doc.to_dict()
        shelter_name = shelter_data.get('name', 'Unknown Shelter')
        
        # Fetch active participants for this shelter
        participants_ref = db.collection('users')
        participants_query = participants_ref\
            .where('role', '==', 'participant')\
            .where('status', '==', 'active')\
            .where('shelter_id', '==', shelter_id)\
            .stream()
        
        participants = []
        for doc in participants_query:
            data = doc.to_dict()
            participant = {
                'id': doc.id,
                'name': f"{data.get('firstName', '')} {data.get('lastName', '')}".strip() or 'Anonymous',
                'firstName': data.get('firstName', 'Anonymous'),
                'lastName': data.get('lastName', ''),
                'shelter': shelter_name,
                'shelter_id': shelter_id,
                'story': data.get('bio') or data.get('story') or 'Seeking support and assistance',
                'goal': data.get('goal') or 'Achieving stability and independence',
                'raised': data.get('totalReceived', 0),
                'target': data.get('donationGoal', 2000),
                'status': data.get('status', 'verified')
            }
            participants.append(participant)
        
        logger.info(f"✅ Found {len(participants)} active participant(s) for shelter {shelter_name}")
        
        return {
            "success": True,
            "shelter": {
                "id": shelter_id,
                "name": shelter_name
            },
            "participants": participants,
            "count": len(participants)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching shelter participants: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch shelter participants: {str(e)}"
        )

