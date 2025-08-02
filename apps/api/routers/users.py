"""
Users Router for SHELTR-AI API
Handles user profile management, preferences, and data persistence
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from middleware.auth_middleware import get_current_user
from services.firebase_service import firebase_service

router = APIRouter(prefix="/users", tags=["users"])

# Pydantic Models
class PersonalInfo(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    dateOfBirth: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    preferredLanguage: Optional[str] = None
    pronouns: Optional[str] = None

class EmergencyContact(BaseModel):
    id: Optional[str] = None
    name: str
    relationship: str
    phone: str
    email: Optional[str] = None

class Goal(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    category: str
    targetDate: Optional[str] = None
    progress: int = 0
    status: str = 'active'

class UserProfile(BaseModel):
    personalInfo: PersonalInfo
    emergencyContacts: Optional[List[EmergencyContact]] = []
    goals: Optional[List[Goal]] = []
    preferences: Optional[Dict[str, Any]] = {}

class ProfileUpdateRequest(BaseModel):
    personalInfo: Optional[PersonalInfo] = None
    emergencyContacts: Optional[List[EmergencyContact]] = None
    goals: Optional[List[Goal]] = None
    preferences: Optional[Dict[str, Any]] = None

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get user's complete profile
    """
    try:
        user_id = current_user.get('uid')
        
        # Get user profile from Firestore
        profile_doc = firebase_service.db.collection('user_profiles').document(user_id).get()
        
        if profile_doc.exists:
            profile_data = profile_doc.to_dict()
            return UserProfile(**profile_data)
        else:
            # Return default profile structure
            return UserProfile(
                personalInfo=PersonalInfo(
                    firstName="",
                    lastName="",
                    email=current_user.get('email', ''),
                    preferredLanguage="English"
                ),
                emergencyContacts=[],
                goals=[],
                preferences={}
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")

@router.put("/profile")
async def update_user_profile(
    profile_update: ProfileUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update user's profile
    """
    try:
        user_id = current_user.get('uid')
        
        # Get existing profile
        profile_doc = firebase_service.db.collection('user_profiles').document(user_id).get()
        
        if profile_doc.exists:
            existing_data = profile_doc.to_dict()
        else:
            existing_data = {
                'personalInfo': {},
                'emergencyContacts': [],
                'goals': [],
                'preferences': {}
            }
        
        # Update only provided fields
        update_data = {}
        
        if profile_update.personalInfo:
            # Merge personal info
            personal_info = existing_data.get('personalInfo', {})
            for field, value in profile_update.personalInfo.dict(exclude_none=True).items():
                personal_info[field] = value
            update_data['personalInfo'] = personal_info
        
        if profile_update.emergencyContacts is not None:
            # Generate IDs for new contacts
            contacts = []
            for contact in profile_update.emergencyContacts:
                contact_dict = contact.dict()
                if not contact_dict.get('id'):
                    contact_dict['id'] = str(uuid.uuid4())
                contacts.append(contact_dict)
            update_data['emergencyContacts'] = contacts
        
        if profile_update.goals is not None:
            # Generate IDs for new goals
            goals = []
            for goal in profile_update.goals:
                goal_dict = goal.dict()
                if not goal_dict.get('id'):
                    goal_dict['id'] = str(uuid.uuid4())
                goals.append(goal_dict)
            update_data['goals'] = goals
        
        if profile_update.preferences is not None:
            preferences = existing_data.get('preferences', {})
            preferences.update(profile_update.preferences)
            update_data['preferences'] = preferences
        
        # Add metadata
        update_data['updatedAt'] = datetime.now()
        if not profile_doc.exists:
            update_data['createdAt'] = datetime.now()
        
        # Save to Firestore
        firebase_service.db.collection('user_profiles').document(user_id).set(update_data, merge=True)
        
        return {"success": True, "message": "Profile updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@router.get("/preferences")
async def get_user_preferences(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get user preferences
    """
    try:
        user_id = current_user.get('uid')
        profile_doc = firebase_service.db.collection('user_profiles').document(user_id).get()
        
        if profile_doc.exists:
            profile_data = profile_doc.to_dict()
            return profile_data.get('preferences', {})
        else:
            return {}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch preferences: {str(e)}")

@router.put("/preferences")
async def update_user_preferences(
    preferences: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update user preferences
    """
    try:
        user_id = current_user.get('uid')
        
        # Get existing profile
        profile_doc = firebase_service.db.collection('user_profiles').document(user_id).get()
        
        if profile_doc.exists:
            existing_preferences = profile_doc.to_dict().get('preferences', {})
        else:
            existing_preferences = {}
        
        # Merge preferences
        existing_preferences.update(preferences)
        
        # Update in Firestore
        firebase_service.db.collection('user_profiles').document(user_id).set({
            'preferences': existing_preferences,
            'updatedAt': datetime.now()
        }, merge=True)
        
        return {"success": True, "message": "Preferences updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update preferences: {str(e)}") 