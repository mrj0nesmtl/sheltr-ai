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
from services.adyen_service import get_adyen_service

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
    participant_id: str = Field(..., description="Demo participant ID")
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
            # Payment successful - process SmartFund distribution
            try:
                adyen_service = get_adyen_service()
                distribution = await adyen_service.process_smartfund_distribution(notification)
            except Exception as e:
                logger.warning(f"Adyen service not available for SmartFund processing: {e}")
                # Create mock distribution for demo mode
                amount_value = notification.get("amount", {}).get("value", 10000)
                total_amount = amount_value / 100
                distribution = {
                    "total": total_amount,
                    "direct": round(total_amount * 0.80, 2),
                    "housing": round(total_amount * 0.15, 2),
                    "operations": round(total_amount * 0.05, 2),
                    "currency": "USD",
                    "reference": merchant_reference,
                    "processed_at": datetime.now(timezone.utc).isoformat(),
                    "status": "completed"
                }
            
            # Update donation record
            await update_donation_on_success(merchant_reference, distribution)
            
            # Update participant stats
            amount = distribution["total"]
            participant_id = await get_participant_from_reference(merchant_reference)
            if participant_id:
                await demo_service.update_participant_from_donation(participant_id, amount)
            
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
