# SHELTR Demo Donations Router
# FastAPI endpoints for Adyen-powered QR donation demonstration

from fastapi import APIRouter, HTTPException, Request, BackgroundTasks, Header
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
import json
import uuid
import logging

from services.adyen_service import AdyenPaymentService
from services.demo_participant_service import DemoParticipantService
from services.firebase_service import FirebaseService

logger = logging.getLogger(__name__)

# Initialize services (lazy loading for Adyen to avoid startup errors)
demo_service = DemoParticipantService()
firebase_service = FirebaseService()

# Lazy initialize Adyen service only when needed
def get_adyen_service():
    """Get Adyen service instance with lazy initialization"""
    try:
        return AdyenPaymentService()
    except Exception as e:
        logger.warning(f"Adyen service not available: {e}")
        raise HTTPException(
            status_code=503,
            detail="Payment service temporarily unavailable. Please set up Adyen credentials."
        )

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
    details: Dict[str, Any] = Field(..., description="Payment details from frontend")
    payment_data: Optional[str] = Field(None, description="Payment data for 3DS")

class DonationResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

# Routes

@router.get("/participant/{participant_id}")
async def get_demo_participant(participant_id: str):
    """
    Get demo participant data for payment page
    """
    try:
        participant = await demo_service.get_demo_participant(participant_id)
        stats = await demo_service.get_participant_stats(participant_id)
        
        return DonationResponse(
            success=True,
            message="Demo participant retrieved successfully",
            data={
                "participant": participant,
                "stats": stats
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to get demo participant {participant_id}: {e}")
        raise HTTPException(
            status_code=404 if "not found" in str(e).lower() else 500,
            detail=f"Failed to retrieve participant: {str(e)}"
        )

@router.post("/generate-qr")
async def generate_demo_qr(request: Request):
    """
    Generate QR code for demo participant Alex Thompson
    """
    try:
        # Generate QR for default demo participant
        qr_result = await demo_service.generate_qr_code('demo-participant-001')
        
        # Track analytics
        client_ip = request.client.host
        user_agent = request.headers.get("user-agent", "")
        
        await track_demo_event(
            event_type="qr_generated",
            participant_id="demo-participant-001",
            metadata={
                "client_ip": client_ip,
                "user_agent": user_agent,
                "session_id": qr_result["session_id"]
            }
        )
        
        return DonationResponse(
            success=True,
            message="Demo QR code generated successfully",
            data={
                "qr_code_url": qr_result["qr_code_url"],
                "participant": qr_result["participant"],
                "session_id": qr_result["session_id"]
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to generate demo QR: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"QR generation failed: {str(e)}"
        )

@router.post("/payment-session")
async def create_demo_payment_session(request: DemoDonationRequest):
    """
    Create Adyen payment session for demo donation
    """
    try:
        # Validate participant exists
        participant = await demo_service.get_demo_participant(request.participant_id)
        
        # Create demo donation record
        donation_id = await create_demo_donation_record(request, participant)
        
        # Create Adyen payment session
        adyen_service = get_adyen_service()
        session_result = await adyen_service.create_demo_payment_session(
            participant_id=request.participant_id,
            amount=request.amount,
            donor_info=request.donor_info,
            demo_session_id=request.demo_session_id
        )
        
        # Update donation record with Adyen reference
        await update_donation_with_session(donation_id, session_result)
        
        # Track analytics
        await track_demo_event(
            event_type="payment_session_created",
            participant_id=request.participant_id,
            donation_id=donation_id,
            metadata={
                "amount": request.amount,
                "reference": session_result["reference"],
                "demo_session_id": request.demo_session_id
            }
        )
        
        return DonationResponse(
            success=True,
            message="Payment session created successfully",
            data={
                "session_data": session_result["session_data"],
                "donation_id": donation_id,
                "reference": session_result["reference"],
                "smartfund_breakdown": session_result["smartfund_breakdown"],
                "participant": participant
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to create payment session: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Payment session creation failed: {str(e)}"
        )

@router.post("/payment-details")
async def submit_payment_details(request: PaymentDetailsRequest):
    """
    Handle additional payment details (3DS, redirects, etc.)
    """
    try:
        adyen_service = get_adyen_service()
        result = await adyen_service.handle_payment_details({
            "details": request.details,
            "paymentData": request.payment_data
        })
        
        return DonationResponse(
            success=True,
            message="Payment details processed successfully",
            data=result
        )
        
    except Exception as e:
        logger.error(f"Failed to process payment details: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Payment details processing failed: {str(e)}"
        )

@router.get("/payment-methods")
async def get_payment_methods():
    """
    Get available payment methods for demo donations
    """
    try:
        adyen_service = get_adyen_service()
        payment_methods = await adyen_service.get_payment_methods()
        
        return DonationResponse(
            success=True,
            message="Payment methods retrieved successfully",
            data=payment_methods
        )
        
    except Exception as e:
        logger.error(f"Failed to get payment methods: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Payment methods retrieval failed: {str(e)}"
        )

@router.get("/test-cards")
async def get_test_cards():
    """
    Get Adyen test card numbers for demo
    """
    try:
        adyen_service = get_adyen_service()
        test_cards = adyen_service.get_test_card_numbers()
        
        return DonationResponse(
            success=True,
            message="Test cards retrieved successfully",
            data=test_cards
        )
        
    except Exception as e:
        logger.error(f"Failed to get test cards: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Test cards retrieval failed: {str(e)}"
        )

@router.post("/webhook")
async def demo_donation_webhook(
    request: Request,
    background_tasks: BackgroundTasks
):
    """
    Handle Adyen webhook notifications for demo donations
    """
    try:
        # Get webhook payload
        webhook_data = await request.json()
        
        logger.info(f"Received demo donation webhook: {webhook_data}")
        
        # Extract notification items
        notification_items = webhook_data.get("notificationItems", [])
        
        if not notification_items:
            logger.warning("No notification items in webhook")
            return {"notificationResponse": "[accepted]"}
        
        # Process each notification
        for item in notification_items:
            notification = item.get("NotificationRequestItem", {})
            
            # Verify HMAC signature (if Adyen is available)
            try:
                adyen_service = get_adyen_service()
                if not adyen_service.verify_webhook_signature(notification):
                    logger.error("Invalid webhook signature")
                    return {"notificationResponse": "[failed]"}
            except HTTPException:
                logger.warning("Adyen service not available for webhook verification")
                # For demo mode, we can skip signature verification and continue
            
            # Process notification in background
            background_tasks.add_task(
                process_demo_webhook_notification,
                notification
            )
        
        return {"notificationResponse": "[accepted]"}
        
    except Exception as e:
        logger.error(f"Webhook processing failed: {e}")
        return {"notificationResponse": "[failed]"}

@router.get("/analytics/{participant_id}")
async def get_demo_analytics(participant_id: str):
    """
    Get analytics for demo participant
    """
    try:
        stats = await demo_service.get_participant_stats(participant_id)
        
        # Get recent demo events
        analytics_query = firebase_service.db.collection('demo_analytics')\
            .where('participant_id', '==', participant_id)\
            .order_by('timestamp', direction='DESCENDING')\
            .limit(20)
        
        events = []
        for doc in analytics_query.stream():
            event_data = doc.to_dict()
            event_data['id'] = doc.id
            events.append(event_data)
        
        return DonationResponse(
            success=True,
            message="Analytics retrieved successfully",
            data={
                "stats": stats,
                "recent_events": events
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to get analytics for {participant_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Analytics retrieval failed: {str(e)}"
        )

# Helper Functions

async def create_demo_donation_record(
    request: DemoDonationRequest,
    participant: Dict[str, Any]
) -> str:
    """
    Create initial demo donation record in Firestore
    """
    try:
        donation_id = str(uuid.uuid4())
        
        donation_record = {
            "id": donation_id,
            "participant_id": request.participant_id,
            "participant_name": f"{participant['firstName']} {participant['lastName']}",
            "shelter_id": participant.get("shelter_id"),
            "amount": {
                "total": request.amount,
                "currency": "USD",
                "breakdown": {
                    "direct": round(request.amount * 0.80, 2),
                    "housing": round(request.amount * 0.15, 2),
                    "operations": round(request.amount * 0.05, 2)
                }
            },
            "donor_info": request.donor_info or {},
            "payment_data": {
                "provider": "adyen",
                "status": "pending",
                "demo": True
            },
            "demo_session_id": request.demo_session_id,
            "created_at": datetime.now(timezone.utc),
            "status": "pending"
        }
        
        # Save to Firestore
        firebase_service.db.collection('demo_donations').document(donation_id).set(donation_record)
        
        logger.info(f"Created demo donation record: {donation_id}")
        return donation_id
        
    except Exception as e:
        logger.error(f"Failed to create donation record: {e}")
        raise

async def update_donation_with_session(donation_id: str, session_result: Dict[str, Any]) -> None:
    """
    Update donation record with Adyen session data
    """
    try:
        updates = {
            "payment_data.adyen_reference": session_result["reference"],
            "payment_data.session_created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        
        firebase_service.db.collection('demo_donations').document(donation_id).update(updates)
        
        logger.info(f"Updated donation {donation_id} with session data")
        
    except Exception as e:
        logger.error(f"Failed to update donation with session: {e}")
        raise

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
        
        # Update donation
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

async def update_donation_on_failure(reference: str, notification: Dict[str, Any]) -> None:
    """
    Update donation record when payment fails
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
        
        # Update donation
        doc = docs[0]
        doc.reference.update({
            "status": "failed",
            "payment_data.status": "failed",
            "payment_data.failure_reason": notification.get("reason", "Unknown"),
            "failed_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })
        
        logger.info(f"Updated donation on failure: {reference}")
        
    except Exception as e:
        logger.error(f"Failed to update donation on failure: {e}")

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