# Fixed version of demo_donations.py with corrected Firestore syntax

import os
import json
import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional

from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel, Field

from services.demo_participant_service import DemoParticipantService
from services.firebase_service import FirebaseService
logger = logging.getLogger(__name__)

# Initialize services
demo_service = DemoParticipantService()
firebase_service = FirebaseService()

def get_adyen_service():
    """Get Adyen service instance"""
    try:
        from services.adyen_service import AdyenPaymentService
        return AdyenPaymentService()
    except Exception as e:
        logger.warning(f"Adyen service not available: {e}")
        return None

router = APIRouter(
    prefix="/demo/donations",
    tags=["demo-donations"]
)

# Pydantic Models
class DemoDonationRequest(BaseModel):
    participant_id: Optional[str] = Field(None, description="Demo participant ID (optional for shelter donations)")
    shelter_id: Optional[str] = Field(None, description="Shelter ID (for direct shelter donations)")
    donation_type: Optional[str] = Field("participant", description="Type of donation: 'participant' or 'shelter'")
    amount: float = Field(..., ge=1.0, le=10000.0, description="Donation amount in USD")
    donor_info: Optional[Dict[str, str]] = Field(None, description="Optional donor information")
    demo_session_id: Optional[str] = Field(None, description="Demo session tracking ID")

class PaymentDetailsRequest(BaseModel):
    details: Dict[str, Any] = Field(..., description="Payment details from Adyen")

class DonationResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

@router.post("/simulate-success/{donation_id}")
async def simulate_donation_success(donation_id: str):
    """
    Simulate successful donation for demo purposes
    """
    try:
        # Get the donation record
        donation_doc = firebase_service.db.collection('demo_donations').document(donation_id).get()
        
        if not donation_doc.exists:
            raise HTTPException(status_code=404, detail="Donation not found")
        
        donation_data = donation_doc.to_dict()
        participant_id = donation_data.get('participant_id')
        amount = donation_data.get('amount', {}).get('total', 0)
        
        # Create mock webhook notification
        mock_notification = {
            "merchantReference": donation_data.get('payment_data', {}).get('adyen_reference', f"DEMO-{donation_id}"),
            "eventCode": "AUTHORISATION",
            "success": "true",
            "amount": {
                "value": int(amount * 100),  # Convert to minor units
                "currency": "USD"
            }
        }
        
        # Process the webhook notification
        await process_demo_webhook_notification(mock_notification)
        
        logger.info(f"Simulated successful donation: {donation_id}")
        
        return DonationResponse(
            success=True,
            message="Donation success simulated",
            data={
                "donation_id": donation_id,
                "participant_id": participant_id,
                "amount": amount
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to simulate donation success: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Simulation failed: {str(e)}"
        )

@router.get("/")
async def get_demo_donations():
    """
    Get all demo donations (for health check and testing)
    """
    try:
        donations_query = firebase_service.db.collection('demo_donations').limit(10)
        donations = []
        
        for doc in donations_query.stream():
            donation_data = doc.to_dict()
            donations.append({
                "id": doc.id,
                **donation_data
            })
        
        return {
            "success": True,
            "data": {
                "donations": donations,
                "count": len(donations)
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get demo donations: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get donations: {str(e)}"
        )

@router.get("/participant/{participant_id}")
async def get_demo_participant(participant_id: str):
    """
    Get demo participant data for donation page
    """
    try:
        # Try to get real participant data first
        participant = await demo_service.get_demo_participant(participant_id)
        
        if not participant:
            # Fallback to hardcoded Michael Rodriguez data
            participant = {
                "id": participant_id,
                "firstName": "Michael",
                "lastName": "Rodriguez",
                "age": 32,
                "story": "Dedicated community member working towards housing stability and career growth. With SHELTR's support, I'm building skills and connections to create a better future for myself and help others in my community.",
                "shelter_name": "Old Brewery Mission",
                "location": {"city": "Montreal", "state": "QC", "zipcode": "H2X 1Y5"},
                "total_received": 0.00,
                "donation_count": 0,
                "services_completed": 8,
                "progress": 55,
                "qr_code": f"SHELTR-{participant_id.upper()}-REAL",
                "featured": True,
                "demo": True
            }
        
        return {
            "success": True,
            "data": {
                "participant": participant
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get demo participant {participant_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get participant: {str(e)}"
        )

@router.post("/payment-session")
async def create_payment_session(request: DemoDonationRequest):
    """
    Create a payment session for demo donation
    Includes proper donor tracking for dashboard metrics
    FIXED: Maps participant slugs to Firebase UIDs
    NEW: Supports direct shelter donations
    """
    try:
        # Validate request
        donation_type = request.donation_type or "participant"
        
        if donation_type == "participant" and not request.participant_id:
            raise HTTPException(status_code=400, detail="participant_id required for participant donations")
        if donation_type == "shelter" and not request.shelter_id:
            raise HTTPException(status_code=400, detail="shelter_id required for shelter donations")
        
        # Generate unique donation ID
        donation_id = str(uuid.uuid4())
        
        # Enhance donor_info with donor_id if available
        donor_info = request.donor_info or {}
        
        # Create base donation record
        donation_data = {
            "id": donation_id,
            "donation_type": donation_type,
            "amount": {
                "total": request.amount,
                "currency": "USD"
            },
            "donor_info": donor_info,
            "donor_id": donor_info.get("donor_id"),  # Extract for easy querying
            "demo_session_id": request.demo_session_id,
            "status": "pending",
            "payment_data": {
                "adyen_reference": f"DEMO-{donation_id}",
                "status": "pending"
            },
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        
        # Handle participant donation
        if donation_type == "participant":
            # Map participant slug to Firebase UID for consistency
            participant_id = request.participant_id
            participant_slug = request.participant_id
            
            # Map known slugs to Firebase UIDs
            if participant_id in ['michael-rodriguez', 'demo-participant-001']:
                participant_id = 'dFJNlIh2g4R8vAvxvIvWZtwu8zw1'  # Michael's Firebase UID
                participant_slug = 'michael-rodriguez'
                logger.info(f"🔄 Mapped slug '{request.participant_id}' to UID: {participant_id}")
            
            donation_data["participant_id"] = participant_id  # Firebase UID
            donation_data["participant_slug"] = participant_slug  # Keep slug for reference
            
            # Get participant's shelter for operations routing
            try:
                participant = await demo_service.get_demo_participant(participant_id)
                if participant:
                    shelter_id = participant.get("shelter_id") or participant.get("shelterId")
                    if shelter_id:
                        donation_data["shelter_id"] = shelter_id
                        logger.info(f"🏠 Participant's shelter: {shelter_id}")
            except Exception as e:
                logger.warning(f"Could not fetch participant shelter: {e}")
            
            logger.info(f"💚 Created participant donation session: {donation_id}")
            logger.info(f"  Participant UID: {participant_id} (slug: {participant_slug})")
        
        # Handle shelter donation
        elif donation_type == "shelter":
            donation_data["shelter_id"] = request.shelter_id
            # No participant_id for direct shelter donations
            logger.info(f"💚 Created shelter donation session: {donation_id}")
            logger.info(f"  Shelter ID: {request.shelter_id}")
        
        # Log donor info
        if donor_info.get("donor_id"):
            logger.info(f"  Donor: {donor_info.get('name', 'Unknown')} ({donor_info.get('email', 'no email')})")
        
        # Save to Firestore
        firebase_service.db.collection('demo_donations').document(donation_id).set(donation_data)
        
        return {
            "success": True,
            "data": {
                "donation_id": donation_id,
                "session_id": f"CS_{donation_id[:8]}",
                "donation_type": donation_type,
                "participant_id": request.participant_id if donation_type == "participant" else None,
                "shelter_id": request.shelter_id if donation_type == "shelter" else None,
                "amount": request.amount,
                "reference": f"DEMO-{donation_id}"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create payment session: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create payment session: {str(e)}"
        )

async def process_demo_webhook_notification(notification: Dict[str, Any]) -> None:
    """
    Process Adyen webhook notification for demo donation
    """
    try:
        merchant_reference = notification.get("merchantReference")
        event_code = notification.get("eventCode")
        success = notification.get("success")
        
        logger.info(f"Processing demo webhook: {event_code} for {merchant_reference}")
        
        if event_code == "AUTHORISATION" and success == "true":
            # Get donation document to determine donation type
            donation_doc = await get_donation_by_reference(merchant_reference)
            if not donation_doc:
                logger.error(f"❌ No donation found for reference: {merchant_reference}")
                return
            
            donation_type = donation_doc.get("donation_type", "participant")
            participant_id = donation_doc.get("participant_id")
            shelter_id = donation_doc.get("shelter_id")
            amount_value = notification.get("amount", {}).get("value", 10000)
            total_amount = amount_value / 100
            
            # Payment successful - process distribution based on type
            try:
                adyen_service = get_adyen_service()
                distribution = await adyen_service.process_smartfund_distribution(
                    notification,
                    participant_id=participant_id
                )
            except Exception as e:
                logger.warning(f"Adyen service not available for SmartFund processing: {e}")
                
                if donation_type == "shelter":
                    # 🏠 SHELTER DONATION: 95% to shelter, 5% platform fee
                    logger.info(f"💚 Processing shelter donation: ${total_amount}")
                    shelter_amount = round(total_amount * 0.95, 2)
                    platform_fee = round(total_amount * 0.05, 2)
                    
                    distribution = {
                        "total": total_amount,
                        "shelter_operations": shelter_amount,
                        "platform_fee": platform_fee,
                        "currency": "USD",
                        "reference": merchant_reference,
                        "processed_at": datetime.now(timezone.utc).isoformat(),
                        "status": "completed",
                        "donation_type": "shelter"
                    }
                    
                    logger.info(f"💰 Shelter donation distribution: 95% (${shelter_amount}) to shelter, 5% (${platform_fee}) platform")
                    
                else:
                    # 🧑 PARTICIPANT DONATION: 80-15-5 SmartFund™ model
                    logger.info(f"💚 Processing participant donation: ${total_amount}")
                    
                    # Get participant data to check shelter affiliation
                    participant_data = None
                    if participant_id:
                        try:
                            participant = await demo_service.get_demo_participant(participant_id)
                            participant_data = participant
                        except:
                            pass
                    
                    # Calculate distribution with shelter routing
                    direct_amount = round(total_amount * 0.80, 2)
                    housing_amount = round(total_amount * 0.15, 2)
                    operations_amount = round(total_amount * 0.05, 2)
                    
                    distribution = {
                        "total": total_amount,
                        "direct": direct_amount,
                        "housing": housing_amount,
                        "currency": "USD",
                        "reference": merchant_reference,
                        "processed_at": datetime.now(timezone.utc).isoformat(),
                        "status": "completed",
                        "donation_type": "participant"
                    }
                    
                    # Route 5% based on shelter affiliation
                    shelter_name = None
                    if not shelter_id and participant_data:
                        shelter_id = participant_data.get("shelter_id") or participant_data.get("shelterId")
                        shelter_name = participant_data.get("shelter_name") or participant_data.get("shelterName")
                    
                    if shelter_id:
                        distribution["shelter_operations"] = operations_amount
                        distribution["shelter_id"] = shelter_id
                        distribution["shelter_name"] = shelter_name
                        distribution["recipient_type"] = "shelter"
                        logger.info(f"💰 Demo: Routing 5% (${operations_amount}) to shelter: {shelter_name}")
                    else:
                        distribution["platform_operations"] = operations_amount
                        distribution["recipient_type"] = "platform"
                        logger.info(f"💰 Demo: Routing 5% (${operations_amount}) to platform")
            
            # Update donation record
            await update_donation_on_success(merchant_reference, distribution)
            
            # Update participant stats (only for participant donations)
            if donation_type == "participant" and participant_id:
                direct_amount = distribution.get("direct", 0)
                housing_amount = distribution.get("housing", 0)
                logger.info(f"💰 Updating participant {participant_id} stats: +${direct_amount} (direct)")
                await update_participant_stats(participant_id, direct_amount, housing_amount)
            
            # Update donor stats (if donor_id is present)
            donor_id = donation_doc.get("donor_id")
            if donor_id:
                logger.info(f"💰 Updating donor {donor_id} stats: +${total_amount} (total)")
                await update_donor_stats(donor_id, total_amount)
            
            # Update shelter operations revenue
            if donation_type == "shelter" and shelter_id:
                # Direct shelter donation - shelter gets 95%
                await update_shelter_operations_direct(
                    shelter_id=shelter_id,
                    amount=distribution["shelter_operations"],
                    donation_reference=merchant_reference,
                    donor_id=donor_id
                )
            elif distribution.get("recipient_type") == "shelter":
                # Participant donation routing - shelter gets 5%
                await update_shelter_operations(
                    shelter_id=shelter_id,
                    amount=distribution["shelter_operations"],
                    participant_id=participant_id,
                    donation_reference=merchant_reference
                )
            
            # Track analytics
            await track_demo_event(
                event_type="payment_completed",
                participant_id=participant_id,
                metadata={
                    "reference": merchant_reference,
                    "amount": amount,
                    "distribution": distribution
                }
            )
            
        elif event_code == "AUTHORISATION" and success == "false":
            # Payment failed
            await update_donation_on_failure(merchant_reference, notification)
            
        logger.info(f"Demo webhook processed: {merchant_reference}")
        
    except Exception as e:
        logger.error(f"Failed to process demo webhook notification: {e}")

async def update_donation_on_success(reference: str, distribution: Dict[str, Any]) -> None:
    """
    Update donation record when payment succeeds
    """
    try:
        # Find donation by reference
        donations_query = firebase_service.db.collection('demo_donations')\
            .where('payment_data.adyen_reference', '==', reference)\
            .limit(1)
        
        docs = list(donations_query.stream())
        if not docs:
            logger.warning(f"No donation found for reference: {reference}")
            return
        
        # Update donation - FIXED: Use correct Firestore syntax
        doc = docs[0]
        doc.reference.update({
            "status": "completed",
            "payment_data.status": "completed",
            "smartfund_distribution": distribution,
            "completed_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })
        
        logger.info(f"Updated donation on success: {reference}")
        
    except Exception as e:
        logger.error(f"Failed to update donation on success: {e}")

async def get_participant_from_reference(reference: str) -> Optional[str]:
    """
    Get participant ID from payment reference
    """
    try:
        # Find donation by reference
        donations_query = firebase_service.db.collection('demo_donations')\
            .where('payment_data.adyen_reference', '==', reference)\
            .limit(1)
        
        docs = list(donations_query.stream())
        if docs:
            donation_data = docs[0].to_dict()
            return donation_data.get("participant_id")
        
        return None
        
    except Exception as e:
        logger.error(f"Failed to get participant from reference: {e}")
        return None

async def get_donation_by_reference(reference: str) -> Optional[Dict[str, Any]]:
    """
    Get donation document by payment reference
    """
    try:
        # Find donation by reference
        donations_query = firebase_service.db.collection('demo_donations')\
            .where('payment_data.adyen_reference', '==', reference)\
            .limit(1)
        
        docs = list(donations_query.stream())
        if docs:
            return docs[0].to_dict()
        
        return None
        
    except Exception as e:
        logger.error(f"Failed to get donation by reference: {e}")
        return None

async def update_participant_stats(participant_id: str, direct_amount: float, housing_amount: float) -> None:
    """
    Update participant's total_received (direct amount) and housing_fund_balance
    """
    try:
        from google.cloud.firestore import Increment

        participant_ref = firebase_service.db.collection('users').document(participant_id)
        participant_doc = participant_ref.get()

        if participant_doc.exists:
            # Update participant stats using Firestore Increment for atomic updates
            participant_ref.update({
                "total_received": Increment(direct_amount),  # 80% goes here
                "housing_fund_balance": Increment(housing_amount),  # 15% goes here
                "donation_count": Increment(1),
                "updated_at": datetime.now(timezone.utc)
            })
            logger.info(f"✅ Updated participant {participant_id}: +${direct_amount} (direct), +${housing_amount} (housing)")
        else:
            logger.warning(f"⚠️ Participant document not found: {participant_id}")

    except Exception as e:
        logger.error(f"❌ Failed to update participant stats for {participant_id}: {e}")


@router.post("/update-participant-stats")
async def api_update_participant_stats(request: Request):
    """
    API endpoint to update participant stats from frontend (bypasses Firestore security rules)
    This is needed because the success page runs in the donor's browser context
    """
    try:
        body = await request.json()
        participant_id = body.get("participant_id")
        direct_amount = body.get("direct_amount", 0)
        housing_amount = body.get("housing_amount", 0)
        
        if not participant_id:
            raise HTTPException(status_code=400, detail="participant_id is required")
        
        logger.info(f"📡 API: Updating participant {participant_id} stats: +${direct_amount} (direct), +${housing_amount} (housing)")
        
        await update_participant_stats(participant_id, direct_amount, housing_amount)
        
        return {
            "success": True,
            "participant_id": participant_id,
            "direct_amount": direct_amount,
            "housing_amount": housing_amount
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ API error updating participant stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def update_donor_stats(donor_id: str, amount: float) -> None:
    """
    Update donor's totalDonated and donation_count stats
    """
    try:
        from google.cloud.firestore import Increment
        
        donor_ref = firebase_service.db.collection('users').document(donor_id)
        donor_doc = donor_ref.get()
        
        if donor_doc.exists:
            # Update donor stats using Firestore Increment for atomic updates
            donor_ref.update({
                "totalDonated": Increment(amount),
                "donation_count": Increment(1),
                "updated_at": datetime.now(timezone.utc)
            })
            logger.info(f"✅ Updated donor {donor_id}: +${amount} (totalDonated)")
        else:
            logger.warning(f"⚠️ Donor document not found: {donor_id}")
        
    except Exception as e:
        logger.error(f"❌ Failed to update donor stats for {donor_id}: {e}")

async def update_shelter_operations(
    shelter_id: str,
    amount: float,
    participant_id: str,
    donation_reference: str
) -> None:
    """
    Update shelter's operations revenue from participant donation routing (5%)
    """
    try:
        from google.cloud.firestore import Increment
        
        shelter_ref = firebase_service.db.collection('shelters').document(shelter_id)
        shelter_doc = shelter_ref.get()
        
        if shelter_doc.exists:
            # Update existing shelter - operations revenue from routing
            shelter_ref.update({
                "operations_revenue": Increment(amount),  # 5% from participant donations
                "total_donations_received": Increment(amount),  # Also count towards total
                "updated_at": datetime.now(timezone.utc)
            })
            logger.info(f"✅ Updated shelter {shelter_id} operations (routing): +${amount}")
        else:
            # Create shelter record if doesn't exist
            shelter_ref.set({
                "id": shelter_id,
                "operations_revenue": amount,
                "total_donations_received": amount,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            })
            logger.info(f"✅ Created shelter {shelter_id} with operations: ${amount}")
        
        # Track shelter operation transaction
        firebase_service.db.collection('shelter_operations_transactions').add({
            "shelter_id": shelter_id,
            "amount": amount,
            "participant_id": participant_id,
            "donation_reference": donation_reference,
            "timestamp": datetime.now(timezone.utc),
            "type": "donation_routing"
        })
        
    except Exception as e:
        logger.error(f"Failed to update shelter operations: {e}")
        # Don't raise - shelter update failure shouldn't break donation flow

async def update_shelter_operations_direct(
    shelter_id: str,
    amount: float,
    donation_reference: str,
    donor_id: Optional[str] = None
) -> None:
    """
    Update shelter's direct donation revenue (95% from direct shelter donations)
    """
    try:
        from google.cloud.firestore import Increment
        
        shelter_ref = firebase_service.db.collection('shelters').document(shelter_id)
        shelter_doc = shelter_ref.get()
        
        if shelter_doc.exists:
            # Update existing shelter - direct donation revenue
            shelter_ref.update({
                "operations_revenue": Increment(amount),  # 95% from direct shelter donations
                "total_donations_received": Increment(amount),  # Count towards total
                "direct_donation_count": Increment(1),
                "updated_at": datetime.now(timezone.utc)
            })
            logger.info(f"✅ Updated shelter {shelter_id} direct donation: +${amount}")
        else:
            # Create shelter record if doesn't exist
            shelter_ref.set({
                "id": shelter_id,
                "operations_revenue": amount,
                "total_donations_received": amount,
                "direct_donation_count": 1,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            })
            logger.info(f"✅ Created shelter {shelter_id} with direct donation: ${amount}")
        
        # Track shelter operation transaction
        firebase_service.db.collection('shelter_operations_transactions').add({
            "shelter_id": shelter_id,
            "amount": amount,
            "donor_id": donor_id,
            "donation_reference": donation_reference,
            "timestamp": datetime.now(timezone.utc),
            "type": "direct_donation"
        })
        
    except Exception as e:
        logger.error(f"Failed to update shelter direct donation: {e}")
        # Don't raise - shelter update failure shouldn't break donation flow

async def track_demo_event(
    event_type: str,
    participant_id: Optional[str] = None,
    donation_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> None:
    """
    Track analytics event for demo
    """
    try:
        event_record = {
            "event_type": event_type,
            "participant_id": participant_id,
            "donation_id": donation_id,
            "metadata": metadata or {},
            "timestamp": datetime.now(timezone.utc),
            "demo": True
        }
        
        firebase_service.db.collection('demo_analytics').add(event_record)
        logger.info(f"Tracked demo event: {event_type}")
        
    except Exception as e:
        logger.warning(f"Failed to track demo event: {e}")
        # Don't raise - analytics failure shouldn't break main flow
