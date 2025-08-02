"""
Services Router for SHELTR-AI API
Handles service booking, availability, and management
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid
from firebase_admin import firestore

from typing import Dict
from middleware.auth_middleware import get_current_user
from services.firebase_service import firebase_service

router = APIRouter(prefix="/services", tags=["Services"])

# Pydantic models for service booking
class TimeSlot(BaseModel):
    start_time: str
    end_time: str
    available: bool = True

class ServiceCreate(BaseModel):
    name: str
    category: str
    provider: str
    description: str
    duration_minutes: int
    location: str
    max_capacity: int
    requirements: List[str] = []
    schedule: List[TimeSlot] = []

class ServiceBooking(BaseModel):
    service_id: str
    scheduled_time: datetime
    notes: Optional[str] = None
    participant_id: Optional[str] = None  # For admin booking on behalf of participant

class ServiceResponse(BaseModel):
    id: str
    name: str
    category: str
    provider: str
    description: str
    duration_minutes: int
    location: str
    max_capacity: int
    current_bookings: int
    next_available: Optional[datetime]
    requirements: List[str]
    rating: float
    shelter_id: str
    created_at: datetime

class BookingResponse(BaseModel):
    id: str
    service_id: str
    service_name: str
    participant_id: str
    provider: str
    scheduled_time: datetime
    duration_minutes: int
    location: str
    status: str
    notes: Optional[str]
    created_at: datetime

@router.get("/available", response_model=List[ServiceResponse])
async def get_available_services(
    date: Optional[str] = None,
    category: Optional[str] = None,
    shelter_id: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """
    Get available services based on filters
    Note: Authentication is optional for browsing services
    """
    try:
        # Try to get current user if authenticated
        current_user = None
        if authorization and authorization.startswith('Bearer '):
            try:
                token = authorization.split(' ')[1]
                decoded_token = await firebase_service.verify_token(token)
                current_user = decoded_token
            except Exception:
                pass  # Continue without authentication
        
        # Default to user's shelter if not specified and user is authenticated
        if not shelter_id and current_user and current_user.get('shelter_id'):
            shelter_id = current_user.get('shelter_id')
        
        # If no specific shelter and no user, show demo-shelter-001 services
        if not shelter_id:
            shelter_id = 'demo-shelter-001'
        
        # Query services collection
        services_ref = firebase_service.db.collection('services')
        
        # Apply filters
        if shelter_id:
            services_ref = services_ref.where('shelter_id', '==', shelter_id)
        if category:
            services_ref = services_ref.where('category', '==', category)
        
        # Get services
        services_docs = services_ref.stream()
        services = []
        
        for doc in services_docs:
            service_data = doc.to_dict()
            service_data['id'] = doc.id
            
            # Calculate current bookings
            bookings_ref = firebase_service.db.collection('appointments')\
                .where('service_id', '==', doc.id)\
                .where('status', 'in', ['scheduled', 'confirmed'])
            
            current_bookings = len(list(bookings_ref.stream()))
            service_data['current_bookings'] = current_bookings
            
            # Calculate next available slot (simplified)
            service_data['next_available'] = datetime.now(timezone.utc).isoformat()
            
            services.append(ServiceResponse(**service_data))
        
        return services
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch services: {str(e)}")

@router.post("/book", response_model=BookingResponse)
async def book_service(
    booking: ServiceBooking,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Book a service appointment
    """
    try:
        # Verify service exists
        service_doc = firebase_service.db.collection('services').document(booking.service_id).get()
        if not service_doc.exists:
            raise HTTPException(status_code=404, detail="Service not found")
        
        service_data = service_doc.to_dict()
        
        # Check capacity
        bookings_ref = firebase_service.db.collection('appointments')\
            .where('service_id', '==', booking.service_id)\
            .where('status', 'in', ['scheduled', 'confirmed'])
        
        current_bookings = len(list(bookings_ref.stream()))
        if current_bookings >= service_data.get('max_capacity', 1):
            raise HTTPException(status_code=400, detail="Service is fully booked")
        
        # Determine who the appointment is for
        target_participant_id = booking.participant_id or current_user.get('uid')
        
        # Check if admin is booking for someone else
        if booking.participant_id and booking.participant_id != current_user.get('uid'):
            user_role = current_user.get('role')
            if user_role not in ['admin', 'super_admin']:
                raise HTTPException(status_code=403, detail="Only admins can book services for other participants")
        
        # Create appointment record
        appointment_id = str(uuid.uuid4())
        appointment_data = {
            'id': appointment_id,
            'service_id': booking.service_id,
            'service_name': service_data['name'],
            'participant_id': target_participant_id,
            'booked_by': current_user.get('uid'),  # Track who made the booking
            'provider': service_data['provider'],
            'scheduled_time': booking.scheduled_time,
            'duration_minutes': service_data['duration_minutes'],
            'location': service_data['location'],
            'status': 'scheduled',
            'notes': booking.notes,
            'created_at': datetime.now(timezone.utc),
            'shelter_id': service_data.get('shelter_id'),
            'tenant_id': current_user.get('tenant_id')
        }
        
        # Save to Firestore
        firebase_service.db.collection('appointments').document(appointment_id).set(appointment_data)
        
        # TODO: Send confirmation email/notification
        
        return BookingResponse(**appointment_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to book service: {str(e)}")

@router.get("/appointments", response_model=List[BookingResponse])
async def get_user_appointments(
    status: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """
    Get user's appointments (requires authentication)
    """
    try:
        # Authentication required for appointments
        if not authorization or not authorization.startswith('Bearer '):
            return []  # Return empty list if not authenticated
        
        current_user = None
        try:
            token = authorization.split(' ')[1]
            current_user = await firebase_service.verify_token(token)
        except Exception as auth_error:
            # Authentication failed, return empty list (this is expected for unauthenticated users)
            return []
        
        if not current_user or not current_user.get('uid'):
            return []
        
        try:
            appointments_ref = firebase_service.db.collection('appointments')\
                .where('participant_id', '==', current_user.get('uid'))
            
            if status:
                appointments_ref = appointments_ref.where('status', '==', status)
            
            appointments_ref = appointments_ref.order_by('scheduled_time', direction=firestore.Query.ASCENDING)
            
            appointments_docs = appointments_ref.stream()
            appointments = []
            
            for doc in appointments_docs:
                try:
                    appointment_data = doc.to_dict()
                    appointment_data['id'] = doc.id
                    
                    # Ensure all required fields exist
                    if not all(key in appointment_data for key in ['service_name', 'scheduled_time', 'status']):
                        continue  # Skip incomplete appointments
                    
                    appointments.append(BookingResponse(**appointment_data))
                except Exception as doc_error:
                    # Skip this document if it can't be parsed
                    continue
            
            return appointments
            
        except Exception as query_error:
            # If query fails, return empty list
            return []
        
    except Exception as e:
        # Last resort error handling
        return []

@router.get("/appointments/shelter/{shelter_id}", response_model=List[BookingResponse])
async def get_shelter_appointments(
    shelter_id: str,
    status: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get all appointments for a shelter (admin/super admin only)
    """
    try:
        user_role = current_user.get('role')
        user_shelter_id = current_user.get('shelter_id')
        
        # Check permissions
        if user_role == 'super_admin':
            # Super admin can see all shelters
            pass
        elif user_role == 'admin' and user_shelter_id == shelter_id:
            # Admin can see their own shelter
            pass
        else:
            raise HTTPException(status_code=403, detail="Access denied to shelter appointments")
        
        # Query appointments
        appointments_ref = firebase_service.db.collection('appointments')\
            .where('shelter_id', '==', shelter_id)
        
        if status:
            appointments_ref = appointments_ref.where('status', '==', status)
        
        appointments_ref = appointments_ref.order_by('scheduled_time', direction=firestore.Query.ASCENDING)
        
        appointments_docs = appointments_ref.stream()
        appointments = []
        
        for doc in appointments_docs:
            appointment_data = doc.to_dict()
            appointment_data['id'] = doc.id
            appointments.append(BookingResponse(**appointment_data))
        
        return appointments
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch shelter appointments: {str(e)}")

@router.get("/appointments/all", response_model=List[BookingResponse])
async def get_all_appointments(
    status: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get all appointments across platform (super admin only)
    """
    try:
        user_role = current_user.get('role')
        
        if user_role != 'super_admin':
            raise HTTPException(status_code=403, detail="Super admin access required")
        
        # Query all appointments
        appointments_ref = firebase_service.db.collection('appointments')
        
        if status:
            appointments_ref = appointments_ref.where('status', '==', status)
        
        appointments_ref = appointments_ref.order_by('scheduled_time', direction=firestore.Query.ASCENDING)
        
        appointments_docs = appointments_ref.stream()
        appointments = []
        
        for doc in appointments_docs:
            appointment_data = doc.to_dict()
            appointment_data['id'] = doc.id
            appointments.append(BookingResponse(**appointment_data))
        
        return appointments
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch all appointments: {str(e)}")

@router.put("/appointments/{appointment_id}/status")
async def update_appointment_status(
    appointment_id: str,
    status: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update appointment status (cancel, reschedule, etc.)
    """
    try:
        appointment_ref = firebase_service.db.collection('appointments').document(appointment_id)
        appointment_doc = appointment_ref.get()
        
        if not appointment_doc.exists:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        appointment_data = appointment_doc.to_dict()
        
        # Check if user owns this appointment
        if appointment_data['participant_id'] != current_user.get('uid'):
            raise HTTPException(status_code=403, detail="Not authorized to modify this appointment")
        
        # Update status
        appointment_ref.update({
            'status': status,
            'updated_at': datetime.now(timezone.utc)
        })
        
        return {"success": True, "message": f"Appointment status updated to {status}"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update appointment: {str(e)}")

@router.post("/", response_model=Dict[str, Any])
async def create_service(
    service: ServiceCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create a new service (admin only)
    """
    try:
        # Check if user has admin permissions
        if not (current_user.get('role') in ['admin', 'super_admin']):
            raise HTTPException(status_code=403, detail="Admin access required")
        
        service_id = str(uuid.uuid4())
        service_data = {
            'id': service_id,
            **service.dict(),
            'shelter_id': current_user.get('shelter_id', 'platform'),
            'tenant_id': current_user.get('tenant_id'),
            'created_by': current_user.get('uid'),
            'created_at': datetime.now(timezone.utc),
            'rating': 0.0,
            'total_ratings': 0
        }
        
        # Save to Firestore
        firebase_service.db.collection('services').document(service_id).set(service_data)
        
        return {"success": True, "service_id": service_id, "message": "Service created successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create service: {str(e)}") 