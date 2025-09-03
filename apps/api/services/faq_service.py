"""
SHELTR-AI FAQ Service
Manages frequently asked questions for quick, consistent responses
"""

import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import re
import difflib

logger = logging.getLogger(__name__)

class FAQService:
    """Service for managing and retrieving FAQ responses"""
    
    def __init__(self):
        self.faq_database = self._initialize_faq_database()
        self.confidence_threshold = 70  # Minimum similarity score for FAQ match
        self.role_specific_faqs = self._initialize_role_specific_faqs()
        
    def _initialize_faq_database(self) -> Dict[str, Dict[str, Any]]:
        """Initialize the FAQ database with common questions and answers"""
        
        return {
            # Platform Overview
            "what_is_sheltr": {
                "questions": [
                    "what is sheltr",
                    "what does this platform do",
                    "tell me about sheltr",
                    "what is this platform",
                    "how does sheltr work"
                ],
                "answer": "SHELTR is a platform that helps homeless individuals through technology and transparent donations. We use blockchain to ensure 80% of donations go directly to people in need.",
                "category": "platform_overview",
                "agent_suggestion": "public_information",
                "actions": [
                    {"type": "link", "text": "Learn More", "url": "/about"},
                    {"type": "link", "text": "See Impact", "url": "/impact"}
                ]
            },
            
            # Participant Questions
            "join_as_participant": {
                "questions": [
                    "i want to join as a participant",
                    "how do i become a participant",
                    "i need help",
                    "i'm homeless and need assistance",
                    "how to get support"
                ],
                "answer": "To join as a participant, visit our guide to learn about the process and then register to get started.",
                "category": "participant_support",
                "agent_suggestion": "participant_support",
                "role_detection": "participant",
                "actions": [
                    {"type": "link", "text": "Participant Guide", "url": "/solutions/participants"},
                    {"type": "link", "text": "Register Now", "url": "/register"}
                ]
            },
            
            # Donation Questions
            "how_to_donate": {
                "questions": [
                    "how do i donate",
                    "how can i give money",
                    "how to help financially",
                    "donation process",
                    "how to contribute"
                ],
                "answer": "You can donate instantly using our QR code system. Scan a participant's QR code or visit our donation page to get started.",
                "category": "donation_support",
                "agent_suggestion": "donor_relations",
                "role_detection": "donor",
                "actions": [
                    {"type": "link", "text": "Donate Now", "url": "/scan-give"},
                    {"type": "link", "text": "Learn About Impact", "url": "/impact"}
                ]
            },
            
            # Donor Definition Questions
            "what_is_donor": {
                "questions": [
                    "what is a donor",
                    "what is a sheltr donor",
                    "who is a donor",
                    "donor definition",
                    "what does donor mean"
                ],
                "answer": "A SHELTR donor is someone who contributes to our platform, helping to provide direct support to homeless individuals through our innovative technology. Donors can make instant, transparent donations via QR codes with 80% going directly to participants.",
                "category": "donor_support",
                "agent_suggestion": "donor_relations", 
                "role_detection": "donor",
                "actions": [
                    {"type": "link", "text": "Become a Donor", "url": "/scan-give"},
                    {"type": "link", "text": "See Impact", "url": "/impact"},
                    {"type": "link", "text": "How It Works", "url": "/solutions/donors"}
                ]
            },
            
            # Shelter Admin Questions
            "shelter_admin": {
                "questions": [
                    "i run a shelter",
                    "i operate a shelter",
                    "shelter administrator",
                    "how to add my shelter",
                    "shelter management",
                    "i work at a shelter",
                    "how do i get involved as a shelter",
                    "shelter operator",
                    "shelter director",
                    "how can my shelter join"
                ],
                "answer": "Great! We'd love to work with your shelter. Our platform helps shelters manage participants and track donations transparently. You can sign up to connect with participants and receive community support.",
                "category": "shelter_operations",
                "agent_suggestion": "shelter_operations",
                "role_detection": "admin",
                "actions": [
                    {"type": "link", "text": "Shelter Solutions", "url": "/solutions/organizations"},
                    {"type": "link", "text": "Get Started", "url": "/register"},
                    {"type": "link", "text": "Contact Us", "url": "/about#contact"}
                ]
            },
            
            # SmartFund Questions
            "smartfund_explanation": {
                "questions": [
                    "what is smartfund",
                    "how does the money work",
                    "where does my donation go",
                    "fund allocation",
                    "money distribution"
                ],
                "answer": "SmartFund ensures 80% goes directly to participants, 15% builds long-term housing funds, and 5% supports operations. All transactions are blockchain-verified.",
                "category": "tokenomics",
                "agent_suggestion": "donor_relations",
                "actions": [
                    {"type": "link", "text": "Learn Tokenomics", "url": "/tokenomics"},
                    {"type": "link", "text": "View Transparency", "url": "/impact"}
                ]
            },
            
            # Roadmap and Global Launch Questions
            "roadmap_global": {
                "questions": [
                    "is sheltr global",
                    "where are you launching first",
                    "what is your roadmap",
                    "is sheltr global where are you launching first what is your roadmap",
                    "global launch plans",
                    "expansion plans",
                    "which cities first",
                    "launch timeline",
                    "rollout strategy",
                    "where will sheltr launch",
                    "global expansion",
                    "launch locations"
                ],
                "answer": "SHELTR aims to make a global impact, starting with targeted launches in key areas to maximize outreach and effectiveness. We're beginning with pilot programs in select cities before expanding worldwide.",
                "category": "platform_info",
                "agent_suggestion": "public_information", 
                "role_detection": "public",
                "actions": [
                    {"type": "link", "text": "View Roadmap", "url": "/docs/roadmap"},
                    {"type": "link", "text": "About SHELTR", "url": "/about"},
                    {"type": "link", "text": "Our Impact", "url": "/impact"}
                ]
            },
            
            # DeFi Strategy and Investment Questions
            "defi_strategy": {
                "questions": [
                    "what is the defi strategy",
                    "how does defi work",
                    "defi investment strategy",
                    "housing fund investment",
                    "how is the housing fund invested",
                    "yield generation strategy",
                    "conservative vs growth allocation"
                ],
                "answer": "SHELTR uses a diversified DeFi strategy for the housing fund: 60% conservative allocation (USDC earning 4-6% APY), 30% growth allocation (blue-chip DeFi protocols 6-10% APY), and 10% innovation allocation for strategic partnerships. This generates sustainable yield to fund permanent housing solutions.",
                "category": "tokenomics",
                "agent_suggestion": "donor_relations",
                "role_detection": "public",
                "actions": [
                    {"type": "link", "text": "View Tokenomics", "url": "/tokenomics"},
                    {"type": "link", "text": "Housing Strategy", "url": "/docs/hacking-homelessness"},
                    {"type": "link", "text": "Investment Details", "url": "/model"}
                ]
            },
            
            # Pool Donations and Fund Management
            "pool_donations": {
                "questions": [
                    "how do pool donations work",
                    "what is the housing fund pool",
                    "pool donation benefits",
                    "collective funding model",
                    "housing fund allocation",
                    "how are pooled funds used"
                ],
                "answer": "Pool donations create collective impact through our SmartFund system. 10% of every donation goes to a shared housing fund that generates yield through DeFi strategies. This pool funds emergency housing (40%), transitional programs (35%), permanent solutions (20%), and support services (5%).",
                "category": "donation_support",
                "agent_suggestion": "donor_relations",
                "role_detection": "donor",
                "actions": [
                    {"type": "link", "text": "Start Donating", "url": "/scan-give"},
                    {"type": "link", "text": "See Impact", "url": "/impact"},
                    {"type": "link", "text": "Fund Strategy", "url": "/docs/hacking-homelessness"}
                ]
            },
            
            # Blockchain Verification and Transparency
            "blockchain_verification": {
                "questions": [
                    "how does blockchain verification work",
                    "blockchain transparency",
                    "transaction verification",
                    "how are transactions verified",
                    "blockchain magic",
                    "smart contract verification",
                    "on-chain verification"
                ],
                "answer": "Every SHELTR transaction is verified on the Base blockchain through smart contracts. This creates an immutable, transparent record of all donations, fund distributions, and spending. You can verify any transaction on-chain, ensuring 100% transparency and accountability.",
                "category": "platform_info",
                "agent_suggestion": "technical_support",
                "role_detection": "public",
                "actions": [
                    {"type": "link", "text": "Blockchain Details", "url": "/docs/blockchain"},
                    {"type": "link", "text": "View Transparency", "url": "/impact"},
                    {"type": "link", "text": "Technical Docs", "url": "/docs/website-architecture"}
                ]
            },
            
            # Dual Token System
            "dual_token_system": {
                "questions": [
                    "what are sheltr tokens",
                    "dual token system",
                    "sheltr-s vs sheltr",
                    "stable token vs governance token",
                    "token differences",
                    "why two tokens"
                ],
                "answer": "SHELTR uses two tokens: SHELTR-S (stable utility token pegged to $1 USD for participant protection) and SHELTR (governance token for community voting and platform growth). This dual system protects vulnerable populations from volatility while enabling community governance.",
                "category": "tokenomics",
                "agent_suggestion": "donor_relations",
                "role_detection": "public",
                "actions": [
                    {"type": "link", "text": "Full Tokenomics", "url": "/tokenomics"},
                    {"type": "link", "text": "Token Launch", "url": "/investor-relations"},
                    {"type": "link", "text": "Whitepaper", "url": "/docs/whitepaper"}
                ]
            },
            
            # Emergency
            "emergency_help": {
                "questions": [
                    "emergency",
                    "crisis",
                    "suicide",
                    "immediate help",
                    "urgent"
                ],
                "answer": "If this is an emergency, please call 911 immediately. For crisis support: Crisis Text Line (Text HOME to 741741) or National Suicide Prevention Lifeline (988).",
                "category": "emergency",
                "agent_suggestion": "emergency",
                "priority": "critical",
                "actions": [
                    {"type": "phone", "text": "Call 911", "url": "tel:911"},
                    {"type": "phone", "text": "Crisis Text Line", "url": "sms:741741"}
                ]
            }
                }
    
    def _initialize_role_specific_faqs(self) -> Dict[str, Dict[str, Dict[str, Any]]]:
        """Initialize role-specific FAQ collections for different user types"""
        return {
            "donor_relations": {
                "donation_process": {
                    "questions": ["how do i donate", "donation process", "how to give money"],
                    "answer": "You can donate instantly by scanning a participant's QR code or visiting our donation page. Your contribution is automatically split: 80% goes directly to the participant, 15% to the housing fund, and 5% to shelter operations.",
                    "actions": [
                        {"type": "link", "text": "Start Donating", "url": "/scan-give"},
                        {"type": "link", "text": "View Impact", "url": "/impact"},
                        {"type": "link", "text": "How It Works", "url": "/solutions/donors"}
                    ]
                },
                "tax_receipts": {
                    "questions": ["tax receipt", "donation receipt", "tax deduction", "receipt for taxes"],
                    "answer": "All donations through SHELTR are tax-deductible. You'll receive an automated receipt via email immediately after donation, and can access all receipts in your donor dashboard.",
                    "actions": [
                        {"type": "link", "text": "Donor Dashboard", "url": "/dashboard"},
                        {"type": "link", "text": "Tax Info", "url": "/docs/donor-guide"},
                        {"type": "link", "text": "Contact Support", "url": "/contact"}
                    ]
                },
                "impact_tracking": {
                    "questions": ["track my impact", "see donation results", "where did my money go", "donation tracking"],
                    "answer": "Every donation is tracked on the blockchain for complete transparency. You can see exactly how your funds were distributed, view participant updates, and track housing fund growth in real-time.",
                    "actions": [
                        {"type": "link", "text": "Impact Dashboard", "url": "/impact"},
                        {"type": "link", "text": "Blockchain Explorer", "url": "/docs/blockchain"},
                        {"type": "link", "text": "Your Donations", "url": "/dashboard"}
                    ]
                }
            },
            
            "participant_support": {
                "getting_started": {
                    "questions": ["how do i join", "sign up process", "get started as participant", "register participant"],
                    "answer": "To join SHELTR, visit your local participating shelter to get verified and set up your profile. Once verified, you'll receive your QR code and can start receiving direct donations and accessing services.",
                    "actions": [
                        {"type": "link", "text": "Find Shelters", "url": "/shelters"},
                        {"type": "link", "text": "Participant Guide", "url": "/solutions/participants"},
                        {"type": "link", "text": "Get Help", "url": "/contact"}
                    ]
                },
                "services_available": {
                    "questions": ["what services available", "shelter services", "what help can i get", "available programs"],
                    "answer": "SHELTR participants can access meals, emergency shelter, showers, counseling, medical care, job training, and educational programs through our partner shelters. Plus direct financial support through QR donations.",
                    "actions": [
                        {"type": "link", "text": "Find Services", "url": "/shelters"},
                        {"type": "link", "text": "Book Services", "url": "/dashboard"},
                        {"type": "link", "text": "Emergency Help", "url": "/contact"}
                    ]
                },
                "qr_code_help": {
                    "questions": ["qr code not working", "how to use qr code", "qr code help", "donations not coming"],
                    "answer": "Your QR code is your direct link to receiving donations. If it's not working, contact your shelter administrator or our support team. Make sure your profile is complete and verified for best results.",
                    "actions": [
                        {"type": "link", "text": "Contact Support", "url": "/contact"},
                        {"type": "link", "text": "Profile Help", "url": "/dashboard"},
                        {"type": "link", "text": "Technical Support", "url": "/docs/participant-guide"}
                    ]
                }
            },
            
            "shelter_operations": {
                "participant_management": {
                    "questions": ["add new participant", "manage participants", "participant intake", "onboard participant"],
                    "answer": "To add new participants, use the shelter admin dashboard to create profiles, verify identity, generate QR codes, and set up their SHELTR accounts. Full training materials are available in the admin guide.",
                    "actions": [
                        {"type": "link", "text": "Admin Dashboard", "url": "/dashboard"},
                        {"type": "link", "text": "Admin Guide", "url": "/docs/shelter-admin-guide"},
                        {"type": "link", "text": "Training Videos", "url": "/docs/shelter-admin-guide"}
                    ]
                },
                "donation_reporting": {
                    "questions": ["donation reports", "track shelter donations", "funding reports", "analytics"],
                    "answer": "Access comprehensive donation analytics, participant impact reports, and funding summaries through your shelter admin dashboard. All data is real-time and blockchain-verified for transparency.",
                    "actions": [
                        {"type": "link", "text": "Analytics Dashboard", "url": "/dashboard"},
                        {"type": "link", "text": "Generate Reports", "url": "/dashboard"},
                        {"type": "link", "text": "Admin Training", "url": "/docs/shelter-admin-guide"}
                    ]
                },
                "platform_support": {
                    "questions": ["platform help", "technical issues", "admin support", "shelter setup"],
                    "answer": "Our shelter operations team provides full technical support, training, and onboarding assistance. Contact us for platform setup, staff training, or any technical issues you encounter.",
                    "actions": [
                        {"type": "link", "text": "Contact Support", "url": "/contact"},
                        {"type": "link", "text": "Admin Guide", "url": "/docs/shelter-admin-guide"},
                        {"type": "link", "text": "Schedule Training", "url": "/contact"}
                    ]
                }
            }
        }
    
    async def find_role_specific_faq(self, user_message: str, user_role: str) -> Optional[Dict[str, Any]]:
        """Find FAQ matches specific to user role"""
        if user_role not in self.role_specific_faqs:
            return None
            
        role_faqs = self.role_specific_faqs[user_role]
        user_message_lower = user_message.lower().strip()
        best_match = None
        best_score = 0
        
        for faq_id, faq_data in role_faqs.items():
            for question in faq_data["questions"]:
                similarity = difflib.SequenceMatcher(None, user_message_lower, question.lower()).ratio()
                score = int(similarity * 100)
                
                if score > best_score and score >= self.confidence_threshold:
                    best_score = score
                    best_match = {
                        "id": f"{user_role}_{faq_id}",
                        "confidence": score,
                        "answer": faq_data["answer"],
                        "category": f"{user_role}_support",
                        "actions": faq_data.get("actions", [])
                    }
        
        return best_match
        
    async def find_faq_match(self, user_message: str, user_role: str = "public") -> Optional[Dict[str, Any]]:
        """Find the best FAQ match for a user message, checking role-specific FAQs first"""
        
        # First check role-specific FAQs if user has a specific role
        if user_role != "public":
            role_match = await self.find_role_specific_faq(user_message, user_role)
            if role_match:
                return role_match
        
        # Fall back to general FAQ database
        user_message_lower = user_message.lower().strip()
        best_match = None
        best_score = 0
        
        for faq_id, faq_data in self.faq_database.items():
            for question in faq_data["questions"]:
                # Use built-in difflib for similarity matching
                similarity = difflib.SequenceMatcher(None, user_message_lower, question.lower()).ratio()
                score = int(similarity * 100)  # Convert to percentage
                
                if score > best_score and score >= self.confidence_threshold:
                    best_score = score
                    best_match = {
                        "id": faq_id,
                        "confidence": score,
                        "answer": faq_data["answer"],
                        "category": faq_data["category"],
                        "agent_suggestion": faq_data["agent_suggestion"],
                        "actions": faq_data.get("actions", []),
                        "role_detection": faq_data.get("role_detection"),
                        "priority": faq_data.get("priority", "normal")
                    }
        
        if best_match:
            logger.info(f"FAQ match found: {best_match['id']} (confidence: {best_match['confidence']})")
            
        return best_match
    
    async def get_category_faqs(self, category: str) -> List[Dict[str, Any]]:
        """Get all FAQs for a specific category"""
        
        category_faqs = []
        for faq_id, faq_data in self.faq_database.items():
            if faq_data["category"] == category:
                category_faqs.append({
                    "id": faq_id,
                    "questions": faq_data["questions"],
                    "answer": faq_data["answer"],
                    "actions": faq_data.get("actions", [])
                })
        
        return category_faqs
    
    def add_faq(self, faq_id: str, faq_data: Dict[str, Any]) -> bool:
        """Add a new FAQ to the database"""
        
        try:
            self.faq_database[faq_id] = faq_data
            logger.info(f"Added new FAQ: {faq_id}")
            return True
        except Exception as e:
            logger.error(f"Error adding FAQ {faq_id}: {str(e)}")
            return False
    
    def update_faq(self, faq_id: str, faq_data: Dict[str, Any]) -> bool:
        """Update an existing FAQ"""
        
        try:
            if faq_id in self.faq_database:
                self.faq_database[faq_id].update(faq_data)
                logger.info(f"Updated FAQ: {faq_id}")
                return True
            else:
                logger.warning(f"FAQ not found for update: {faq_id}")
                return False
        except Exception as e:
            logger.error(f"Error updating FAQ {faq_id}: {str(e)}")
            return False

# Global FAQ service instance
faq_service = FAQService()
