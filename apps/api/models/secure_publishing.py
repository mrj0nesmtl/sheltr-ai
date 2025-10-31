"""
Pydantic models for secure document publishing to Founders Portal and Investor Relations.

This module handles publishing Knowledge Base documents to secure portals:
- Founders Portal: For super_admin and platform_admin
- Investor Relations: For super_admin, platform_admin, and investor roles
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
import re


class SecurePublishingSettings(BaseModel):
    """Settings for publishing a document to secure portals."""
    
    # Publishing toggles
    published_to_founders: bool = False
    published_to_ir: bool = False
    
    # Secure document metadata
    secure_slug: str = Field(..., min_length=3, max_length=100)
    secure_badge: Optional[str] = "Secure"
    secure_badge_color: Optional[str] = "red"
    secure_icon: Optional[str] = "FileText"
    
    # Custom descriptions for each portal
    founders_description: Optional[str] = None
    ir_description: Optional[str] = None
    
    # Source tracking
    source_directory: Optional[str] = None  # 'founders', 'payment-rails', 'platform-admin'
    local_file_path: Optional[str] = None
    
    @validator('secure_slug')
    def validate_slug(cls, v):
        """Ensure slug is URL-safe."""
        if not re.match(r'^[a-z0-9-]+$', v):
            raise ValueError('Slug must contain only lowercase letters, numbers, and hyphens')
        if v.startswith('-') or v.endswith('-'):
            raise ValueError('Slug cannot start or end with a hyphen')
        if '--' in v:
            raise ValueError('Slug cannot contain consecutive hyphens')
        return v
    
    @validator('secure_badge_color')
    def validate_badge_color(cls, v):
        """Validate badge color is a valid option."""
        valid_colors = [
            'red', 'blue', 'green', 'yellow', 'purple', 'pink', 
            'orange', 'cyan', 'teal', 'indigo', 'emerald', 'gray'
        ]
        if v and v not in valid_colors:
            raise ValueError(f'Badge color must be one of: {", ".join(valid_colors)}')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "published_to_founders": True,
                "published_to_ir": False,
                "secure_slug": "business-plan-2026",
                "secure_badge": "Secure",
                "secure_badge_color": "red",
                "secure_icon": "FileText",
                "founders_description": "Comprehensive business plan for SHELTR platform",
                "ir_description": None,
                "source_directory": "founders",
                "local_file_path": ".local-secure-docs/founders/business-plan.md"
            }
        }


class PublishToFoundersRequest(BaseModel):
    """Request to publish/unpublish a document to Founders Portal."""
    
    published: bool
    settings: Optional[SecurePublishingSettings] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "published": True,
                "settings": {
                    "secure_slug": "business-plan-2026",
                    "secure_badge": "Secure",
                    "secure_badge_color": "red",
                    "founders_description": "Comprehensive business plan"
                }
            }
        }


class PublishToIRRequest(BaseModel):
    """Request to publish/unpublish a document to Investor Relations."""
    
    published: bool
    settings: Optional[SecurePublishingSettings] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "published": True,
                "settings": {
                    "secure_slug": "adyen-integration-strategy",
                    "secure_badge": "Strategic",
                    "secure_badge_color": "blue",
                    "ir_description": "Payment infrastructure analysis"
                }
            }
        }


class SecureDocumentCard(BaseModel):
    """Document card for Founders Portal or Investor Relations."""
    
    id: str
    title: str
    description: str
    secure_slug: str
    
    # Badge styling
    badge: str = "Secure"
    badge_color: str = "red"
    icon: str = "FileText"
    
    # Metadata
    category: str
    updated_at: datetime
    word_count: Optional[int] = None
    
    # Access control
    permission_level: str = "private"
    visibility_scope: str = "organization"
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "abc123def456",
                "title": "Business Plan 2026",
                "description": "Comprehensive business plan for SHELTR platform",
                "secure_slug": "business-plan-2026",
                "badge": "Secure",
                "badge_color": "red",
                "icon": "FileText",
                "category": "Business",
                "updated_at": "2025-10-31T12:00:00Z",
                "word_count": 5000,
                "permission_level": "private",
                "visibility_scope": "organization"
            }
        }


class SecureDocumentFull(BaseModel):
    """Full document data for secure viewing."""
    
    id: str
    title: str
    content: str
    secure_slug: str
    
    # Metadata
    description: Optional[str] = None
    category: str
    tags: List[str] = []
    
    # Publishing status
    published_to_founders: bool = False
    published_to_ir: bool = False
    
    # Badge styling
    badge: str = "Secure"
    badge_color: str = "red"
    icon: str = "FileText"
    
    # Timestamps
    created_at: datetime
    updated_at: datetime
    synced_at: Optional[datetime] = None
    
    # Access control
    permission_level: str = "private"
    visibility_scope: str = "organization"
    
    # Stats
    word_count: Optional[int] = None
    view_count: int = 0


# Badge presets for easy selection
BADGE_PRESETS = {
    "secure": {"text": "Secure", "color": "red", "icon": "Lock"},
    "strategic": {"text": "Strategic", "color": "blue", "icon": "TrendingUp"},
    "financial": {"text": "Financial", "color": "green", "icon": "DollarSign"},
    "legal": {"text": "Legal", "color": "purple", "icon": "Shield"},
    "technical": {"text": "Technical", "color": "cyan", "icon": "Code"},
    "partnership": {"text": "Partnership", "color": "pink", "icon": "Briefcase"},
    "design": {"text": "Design", "color": "orange", "icon": "Palette"},
    "content": {"text": "Content", "color": "yellow", "icon": "Edit"},
    "onboarding": {"text": "Onboarding", "color": "teal", "icon": "BookOpen"},
    "admin": {"text": "Admin", "color": "indigo", "icon": "Shield"},
    "launch": {"text": "Launch Plan", "color": "emerald", "icon": "Rocket"},
    "pre-seed": {"text": "Pre-Seed", "color": "purple", "icon": "TrendingUp"},
}


# Icon options for UI selection
ICON_OPTIONS = [
    "FileText", "Lock", "TrendingUp", "DollarSign", "Shield", 
    "Code", "Briefcase", "Palette", "Edit", "BookOpen", "Rocket",
    "CreditCard", "Users", "Building2", "Heart", "Star", "Zap"
]


# Utility functions
def generate_secure_slug(title: str) -> str:
    """Generate a URL-safe slug from a title."""
    # Convert to lowercase
    slug = title.lower()
    # Replace spaces and special chars with hyphens
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    # Replace multiple consecutive hyphens
    slug = re.sub(r'-+', '-', slug)
    return slug


def get_badge_preset(preset_name: str) -> dict:
    """Get a badge preset by name."""
    return BADGE_PRESETS.get(preset_name.lower(), BADGE_PRESETS["secure"])

