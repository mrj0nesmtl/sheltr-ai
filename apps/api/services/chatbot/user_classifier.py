"""
SHELTR-AI User Role Classifier
Intelligently detects user roles from conversation context and messages
"""

import logging
import re
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum

logger = logging.getLogger(__name__)

class UserRole(Enum):
    """Possible user roles in the SHELTR system"""
    PUBLIC = "public"
    PARTICIPANT = "participant"
    DONOR = "donor"
    SHELTER_ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class UserClassifier:
    """Classifies users based on their messages and context"""
    
    def __init__(self):
        self.role_indicators = self._initialize_role_indicators()
        self.confidence_threshold = 70  # Minimum confidence for role classification
    
    def _initialize_role_indicators(self) -> Dict[str, Dict[str, List[str]]]:
        """Initialize patterns that indicate different user roles"""
        
        return {
            "participant": {
                "strong_indicators": [
                    r"\bi'?m homeless\b",
                    r"\bi need help\b",
                    r"\bi want to join as a participant\b",
                    r"\bi need shelter\b",
                    r"\bi need food\b",
                    r"\bi need assistance\b",
                    r"\bparticipant registration\b",
                    r"\bget my qr code\b",
                    r"\bhomeless individual\b"
                ],
                "medium_indicators": [
                    r"\bneed support\b",
                    r"\blooking for help\b",
                    r"\bstruggling with housing\b",
                    r"\bneed temporary shelter\b",
                    r"\bfacing homelessness\b",
                    r"\bneed services\b"
                ],
                "context_clues": [
                    "housing", "shelter", "meals", "services", "assistance", 
                    "temporary", "emergency", "support", "resources"
                ]
            },
            
            "donor": {
                "strong_indicators": [
                    r"\bhow do i donate\b",
                    r"\bi want to donate\b",
                    r"\bi want to help financially\b",
                    r"\bhow can i give money\b",
                    r"\bdonation process\b",
                    r"\bmake a contribution\b",
                    r"\bsupport the cause\b"
                ],
                "medium_indicators": [
                    r"\bhow to help\b",
                    r"\bwant to contribute\b",
                    r"\bsupport your mission\b",
                    r"\bgive back\b",
                    r"\bimpact of donations\b",
                    r"\bwhere does my money go\b"
                ],
                "context_clues": [
                    "donate", "donation", "contribute", "support", "give", 
                    "help", "impact", "transparency", "fund", "money"
                ]
            },
            
            "shelter_admin": {
                "strong_indicators": [
                    r"\bi run a shelter\b",
                    r"\bi work at a shelter\b",
                    r"\bi'?m a shelter administrator\b",
                    r"\bshelter management\b",
                    r"\bmanage participants\b",
                    r"\bshelter operations\b",
                    r"\badd my shelter to the platform\b"
                ],
                "medium_indicators": [
                    r"\bshelter staff\b",
                    r"\bwork with homeless\b",
                    r"\bmanage shelter\b",
                    r"\bshelter director\b",
                    r"\bsocial worker\b",
                    r"\bcase manager\b"
                ],
                "context_clues": [
                    "shelter", "facility", "management", "staff", "operations",
                    "participants", "residents", "administration", "services"
                ]
            }
        }
    
    async def classify_user_role(
        self, 
        message: str, 
        conversation_history: List[Dict] = None,
        current_role: str = "public"
    ) -> Tuple[str, float, Dict[str, Any]]:
        """
        Classify user role based on message and conversation context
        
        Returns:
            Tuple of (role, confidence, metadata)
        """
        
        message_lower = message.lower().strip()
        role_scores = {}
        classification_evidence = {}
        
        # Score each potential role
        for role, indicators in self.role_indicators.items():
            score = 0
            evidence = []
            
            # Check strong indicators (high weight)
            for pattern in indicators["strong_indicators"]:
                if re.search(pattern, message_lower):
                    score += 40
                    evidence.append(f"Strong: {pattern}")
            
            # Check medium indicators (medium weight)
            for pattern in indicators["medium_indicators"]:
                if re.search(pattern, message_lower):
                    score += 20
                    evidence.append(f"Medium: {pattern}")
            
            # Check context clues (low weight, but cumulative)
            context_matches = 0
            for clue in indicators["context_clues"]:
                if clue.lower() in message_lower:
                    context_matches += 1
            
            # Context clue scoring (up to 20 points)
            context_score = min(context_matches * 3, 20)
            score += context_score
            
            if context_matches > 0:
                evidence.append(f"Context: {context_matches} matches")
            
            role_scores[role] = score
            classification_evidence[role] = evidence
        
        # Find the highest scoring role
        best_role = max(role_scores.items(), key=lambda x: x[1])
        role_name, confidence = best_role
        
        # If confidence is too low, keep current role
        if confidence < self.confidence_threshold:
            role_name = current_role
            confidence = 0
        
        # Convert confidence to percentage
        confidence_percentage = min(confidence, 100)
        
        metadata = {
            "all_scores": role_scores,
            "evidence": classification_evidence.get(role_name, []),
            "classification_method": "pattern_matching",
            "message_analyzed": message[:100] + "..." if len(message) > 100 else message
        }
        
        logger.info(f"User role classification: {role_name} (confidence: {confidence_percentage}%)")
        
        return role_name, confidence_percentage, metadata
    
    def should_suggest_agent_handoff(
        self, 
        detected_role: str, 
        current_agent: str, 
        confidence: float
    ) -> Tuple[bool, Optional[str]]:
        """
        Determine if we should suggest switching to a specialized agent
        
        Returns:
            Tuple of (should_handoff, suggested_agent)
        """
        
        # Only suggest handoff if we're confident and currently using public agent
        if confidence < 80 or not current_agent.startswith("public"):
            return False, None
        
        # Map roles to their specialized agents
        role_agent_map = {
            "participant": "participant_support",
            "donor": "donor_relations", 
            "admin": "shelter_operations",
            "super_admin": "shelter_operations"
        }
        
        suggested_agent = role_agent_map.get(detected_role)
        
        if suggested_agent and suggested_agent != current_agent:
            return True, suggested_agent
        
        return False, None
    
    def generate_handoff_message(
        self, 
        detected_role: str, 
        suggested_agent: str,
        confidence: float
    ) -> str:
        """Generate a friendly message for agent handoff"""
        
        handoff_messages = {
            "participant": "I can see you're looking for support services. Let me connect you with our Participant Support specialist who can better help you with resources, registration, and getting started.",
            
            "donor": "It looks like you're interested in making a donation! Let me connect you with our Donor Relations specialist who can walk you through the process and show you the impact of your contribution.",
            
            "admin": "I can see you're involved in shelter operations. Let me connect you with our Shelter Operations specialist who can help you with platform integration, participant management, and administrative features."
        }
        
        return handoff_messages.get(detected_role, 
            "Based on your message, I think one of our specialized assistants might be better suited to help you. Let me connect you with the right specialist.")

# Global user classifier instance
user_classifier = UserClassifier()
