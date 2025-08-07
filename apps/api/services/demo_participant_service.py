# SHELTR Demo Participant Service
# Creates and manages demo participants for Adyen payment demonstration

import os
import json
import uuid
import qrcode
import base64
from io import BytesIO
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List

from services.firebase_service import FirebaseService
import logging

logger = logging.getLogger(__name__)

class DemoParticipantService:
    """
    Service for managing demo participants in SHELTR QR donation flow
    """
    
    def __init__(self):
        self.firebase_service = FirebaseService()
        self.db = self.firebase_service.db
        
    async def get_demo_participant(self, participant_id: str = "demo-participant-001") -> Dict[str, Any]:
        """
        Get demo participant data, creating default if doesn't exist
        """
        try:
            # Try to get existing demo participant
            doc_ref = self.db.collection('demo_participants').document(participant_id)
            doc = doc_ref.get()
            
            if doc.exists:
                participant_data = doc.to_dict()
                logger.info(f"Retrieved demo participant: {participant_id}")
                return participant_data
            else:
                # Create default demo participant
                logger.info(f"Creating default demo participant: {participant_id}")
                return await self.create_default_demo_participant(participant_id)
                
        except Exception as e:
            logger.error(f"Failed to get demo participant {participant_id}: {e}")
            raise
    
    async def create_default_demo_participant(self, participant_id: str = "demo-participant-001") -> Dict[str, Any]:
        """
        Create Alex Thompson - our default demo participant
        """
        try:
            # Generate unique QR code
            qr_code_id = f"SHELTR-DEMO-{uuid.uuid4().hex[:8].upper()}"
            
            demo_participant = {
                "id": participant_id,
                "firstName": "Alex",
                "lastName": "Thompson", 
                "age": 28,
                "story": "Former chef who lost housing due to medical emergency. Working towards stability through SHELTR services. Alex is passionate about cooking and hopes to open a food truck once housing is secured.",
                "photo_url": "/images/demo/alex-thompson.jpg",  # We'll create this
                "qr_code": qr_code_id,
                "shelter_id": "demo-shelter-001",
                "shelter_name": "Downtown Community Shelter",
                "goals": [
                    {
                        "id": "housing-goal",
                        "title": "Secure Stable Housing",
                        "description": "Find permanent housing solution",
                        "progress": 75,
                        "target_date": "2024-09-01",
                        "status": "in_progress"
                    },
                    {
                        "id": "employment-goal", 
                        "title": "Find Employment",
                        "description": "Secure full-time work in food service",
                        "progress": 60,
                        "target_date": "2024-08-15",
                        "status": "in_progress"
                    },
                    {
                        "id": "financial-goal",
                        "title": "Financial Stability",
                        "description": "Build emergency fund and credit score",
                        "progress": 40,
                        "target_date": "2024-12-01",
                        "status": "in_progress"
                    }
                ],
                "skills": ["Cooking", "Food Safety", "Customer Service", "Team Leadership"],
                "interests": ["Culinary Arts", "Nutrition", "Community Gardening"],
                "progress": 65,  # Overall progress
                "total_received": 2847.50,  # Demo donation total
                "donation_count": 52,       # Number of demo donations
                "services_completed": 8,    # Services accessed
                "status": "active",
                "location": {
                    "city": "San Francisco",
                    "state": "CA",
                    "zipcode": "94102"
                },
                "emergency_contact": {
                    "name": "Maria Thompson", 
                    "relationship": "Sister",
                    "phone": "+1-555-0123"
                },
                "case_worker": {
                    "name": "Sarah Johnson",
                    "email": "s.johnson@downtownshelter.org",
                    "phone": "+1-555-0156"
                },
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "demo": True,
                "featured": True,
                "tenant_id": "demo-shelter-001"
            }
            
            # Save to Firestore
            doc_ref = self.db.collection('demo_participants').document(participant_id)
            doc_ref.set(demo_participant)
            
            logger.info(f"✅ Created demo participant: {participant_id}")
            return demo_participant
            
        except Exception as e:
            logger.error(f"Failed to create demo participant: {e}")
            raise
    
    async def generate_qr_code(self, participant_id: str, custom_data: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Generate QR code for demo participant
        """
        try:
            # Get participant data
            participant = await self.get_demo_participant(participant_id)
            
            # Create QR data payload
            qr_data = {
                "type": "sheltr_demo_donation",
                "version": "1.0",
                "participant_id": participant_id,
                "participant_name": f"{participant['firstName']} {participant['lastName']}",
                "shelter_id": participant["shelter_id"],
                "redirect_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/donate?demo=true&participant={participant_id}",
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "session_id": str(uuid.uuid4())
            }
            
            # Add custom data if provided
            if custom_data:
                qr_data.update(custom_data)
            
            # Generate QR code image
            qr_code_url = await self.create_qr_image(json.dumps(qr_data))
            
            # Track analytics
            await self.track_qr_generation(participant_id, qr_data)
            
            return {
                "qr_code_url": qr_code_url,
                "qr_data": qr_data,
                "participant": participant,
                "session_id": qr_data["session_id"]
            }
            
        except Exception as e:
            logger.error(f"Failed to generate QR code for {participant_id}: {e}")
            raise
    
    async def create_qr_image(self, qr_data: str) -> str:
        """
        Create QR code image and return base64 data URL
        """
        try:
            # Create QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(qr_data)
            qr.make(fit=True)
            
            # Create image
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Convert to base64 data URL
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            img_str = base64.b64encode(buffer.getvalue()).decode()
            qr_code_url = f"data:image/png;base64,{img_str}"
            
            logger.info("QR code image generated successfully")
            return qr_code_url
            
        except Exception as e:
            logger.error(f"Failed to create QR code image: {e}")
            raise
    
    async def track_qr_generation(self, participant_id: str, qr_data: Dict[str, Any]) -> None:
        """
        Track QR code generation for analytics
        """
        try:
            analytics_event = {
                "event_type": "qr_generated",
                "participant_id": participant_id,
                "session_id": qr_data.get("session_id"),
                "timestamp": datetime.now(timezone.utc),
                "metadata": {
                    "qr_version": qr_data.get("version"),
                    "shelter_id": qr_data.get("shelter_id"),
                    "demo": True
                }
            }
            
            # Save to analytics collection
            self.db.collection('demo_analytics').add(analytics_event)
            logger.info(f"QR generation tracked for {participant_id}")
            
        except Exception as e:
            logger.warning(f"Failed to track QR generation: {e}")
            # Don't raise - analytics failure shouldn't break QR generation
    
    async def get_participant_stats(self, participant_id: str) -> Dict[str, Any]:
        """
        Get aggregated stats for demo participant
        """
        try:
            participant = await self.get_demo_participant(participant_id)
            
            # Get recent demo donations (simplified query to avoid index requirement)
            donations_query = self.db.collection('demo_donations')\
                .where('participant_id', '==', participant_id)\
                .limit(10)  # Remove order_by to avoid composite index requirement
            
            recent_donations = []
            total_demo_amount = 0
            
            # Get all donations and sort in memory (for demo purposes)
            all_donations = []
            for doc in donations_query.stream():
                donation = doc.to_dict()
                donation['id'] = doc.id
                all_donations.append(donation)
            
            # Sort by created_at in memory
            all_donations.sort(key=lambda x: x.get('created_at', datetime.min), reverse=True)
            
            # Take the 5 most recent
            for donation in all_donations[:5]:
                recent_donations.append({
                    "id": donation['id'],
                    "amount": donation.get("amount", {}).get("total", 0),
                    "created_at": donation.get("created_at"),
                    "status": donation.get("payment_data", {}).get("status", "unknown")
                })
                total_demo_amount += donation.get("amount", {}).get("total", 0)
            
            # Calculate goal completion
            goals = participant.get("goals", [])
            total_progress = sum(goal.get("progress", 0) for goal in goals) / len(goals) if goals else 0
            
            stats = {
                "participant_id": participant_id,
                "total_received": participant.get("total_received", 0),
                "donation_count": participant.get("donation_count", 0),
                "services_completed": participant.get("services_completed", 0),
                "overall_progress": total_progress,
                "goals_count": len(goals),
                "completed_goals": len([g for g in goals if g.get("progress", 0) >= 100]),
                "recent_donations": recent_donations,
                "demo_total": total_demo_amount,
                "last_updated": datetime.now(timezone.utc).isoformat()
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get participant stats for {participant_id}: {e}")
            raise
    
    async def update_participant_from_donation(
        self, 
        participant_id: str, 
        donation_amount: float
    ) -> Dict[str, Any]:
        """
        Update participant stats when demo donation is completed
        """
        try:
            doc_ref = self.db.collection('demo_participants').document(participant_id)
            
            # Get current data
            doc = doc_ref.get()
            if not doc.exists:
                raise ValueError(f"Demo participant {participant_id} not found")
            
            current_data = doc.to_dict()
            
            # Update totals
            new_total = current_data.get("total_received", 0) + donation_amount
            new_count = current_data.get("donation_count", 0) + 1
            
            # Update document
            doc_ref.update({
                "total_received": new_total,
                "donation_count": new_count,
                "updated_at": datetime.now(timezone.utc)
            })
            
            logger.info(f"Updated demo participant {participant_id}: +${donation_amount}")
            
            # Return updated stats
            return await self.get_participant_stats(participant_id)
            
        except Exception as e:
            logger.error(f"Failed to update participant from donation: {e}")
            raise
    
    def get_all_demo_participants(self) -> List[Dict[str, Any]]:
        """
        Get all demo participants for admin/testing purposes
        """
        try:
            participants = []
            docs = self.db.collection('demo_participants').stream()
            
            for doc in docs:
                participant_data = doc.to_dict()
                participant_data['id'] = doc.id
                participants.append(participant_data)
            
            logger.info(f"Retrieved {len(participants)} demo participants")
            return participants
            
        except Exception as e:
            logger.error(f"Failed to get all demo participants: {e}")
            raise
    
    async def reset_demo_participant(self, participant_id: str) -> Dict[str, Any]:
        """
        Reset demo participant stats for testing
        """
        try:
            # Reset to default values
            updates = {
                "total_received": 0,
                "donation_count": 0,
                "services_completed": 0,
                "updated_at": datetime.now(timezone.utc)
            }
            
            doc_ref = self.db.collection('demo_participants').document(participant_id)
            doc_ref.update(updates)
            
            logger.info(f"Reset demo participant: {participant_id}")
            
            return await self.get_demo_participant(participant_id)
            
        except Exception as e:
            logger.error(f"Failed to reset demo participant: {e}")
            raise