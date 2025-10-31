"""
Docs Hub Models
Models and schemas for the public documentation hub feature
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import re


class HubCategory(str):
    """Categories for organizing docs hub cards"""
    CORE = "core"
    ADDITIONAL = "additional"


class HubBadge(str):
    """Badge types for docs hub cards"""
    STRATEGIC_VISION = "Strategic Vision"
    ARCHITECTURE = "Architecture"
    PUBLISHED = "Published"
    IMPLEMENTATION = "Implementation"
    TECHNICAL = "Technical"
    ENTERPRISE = "Enterprise"
    LAUNCH_PLAN = "Launch Plan"
    AI_SYSTEM = "AI System"
    MCP_SYSTEM = "MCP System"
    QA_FRAMEWORK = "QA Framework"
    ADMIN_GUIDE = "Admin Guide"
    DONOR_GUIDE = "Donor Guide"
    USER_GUIDE = "User Guide"


class DocsHubMetadata(BaseModel):
    """Metadata for publishing a document to the docs hub"""
    published_to_hub: bool = False
    hub_category: str = HubCategory.CORE
    hub_badge: str = HubBadge.TECHNICAL
    hub_order: int = Field(default=999, ge=0, le=9999)
    hub_slug: str = ""
    hub_description: Optional[str] = None  # Override auto-generated description
    hub_audience: Optional[List[str]] = None  # e.g., ["Developers", "QA Engineers"]
    hub_topics: Optional[List[str]] = None  # Key topics covered
    hub_updated_at: Optional[datetime] = None
    hub_icon: Optional[str] = None  # Emoji or icon identifier


class DocsHubCard(BaseModel):
    """A single card on the docs hub page"""
    id: str
    title: str
    description: str
    category: str  # HubCategory
    badge: str  # HubBadge
    link: str  # /docs/[slug]
    github_link: Optional[str] = None
    updated: str  # Formatted date
    audience: List[str] = []
    topics: List[str] = []
    icon: Optional[str] = None
    order: int = 999


class DocsHubDocument(BaseModel):
    """Full document for individual doc pages"""
    id: str
    title: str
    content: str
    category: str
    badge: str
    slug: str
    github_path: Optional[str] = None
    updated_at: datetime
    audience: List[str] = []
    topics: List[str] = []
    view_count: int = 0


class PublishToHubRequest(BaseModel):
    """Request to publish/update a document to the docs hub"""
    published_to_hub: bool
    hub_category: str = HubCategory.CORE
    hub_badge: str = HubBadge.TECHNICAL
    hub_order: int = 999
    hub_slug: Optional[str] = None  # Auto-generated if not provided
    hub_description: Optional[str] = None
    hub_audience: Optional[List[str]] = None
    hub_topics: Optional[List[str]] = None
    hub_icon: Optional[str] = None


def generate_slug(title: str) -> str:
    """
    Generate a URL-friendly slug from a title
    
    Examples:
        "Hacking Homelessness and the Theory of Change" -> "hacking-homelessness-theory-of-change"
        "API Documentation - Current Implementation" -> "api-documentation-current-implementation"
        "SHELTR-AI Design System" -> "sheltr-ai-design-system"
    """
    # Convert to lowercase
    slug = title.lower()
    
    # Remove special characters except spaces, hyphens, and alphanumeric
    slug = re.sub(r'[^\w\s-]', '', slug)
    
    # Replace spaces and multiple hyphens with single hyphen
    slug = re.sub(r'[-\s]+', '-', slug)
    
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    
    # Limit length to 100 characters
    if len(slug) > 100:
        slug = slug[:100].rsplit('-', 1)[0]  # Cut at last word boundary
    
    return slug


def extract_description(content: str, max_length: int = 200) -> str:
    """
    Extract a description from document content
    Takes the first non-heading paragraph
    """
    lines = content.split('\n')
    
    for line in lines:
        # Skip empty lines, headings, and code blocks
        line = line.strip()
        if not line or line.startswith('#') or line.startswith('```'):
            continue
        
        # Found a paragraph
        if len(line) > 50:  # Minimum length for a description
            # Clean up markdown formatting
            desc = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', line)  # Remove links
            desc = re.sub(r'[*_`]', '', desc)  # Remove emphasis
            
            # Truncate to max length
            if len(desc) > max_length:
                desc = desc[:max_length].rsplit(' ', 1)[0] + '...'
            
            return desc
    
    return "Comprehensive documentation and implementation guide"


def extract_audience_from_content(content: str) -> List[str]:
    """
    Extract target audience from document content
    Looks for common patterns like "Target Audience:" or "For:"
    """
    audience = []
    
    # Look for audience section
    lines = content.split('\n')
    in_audience_section = False
    
    for line in lines:
        line = line.strip()
        
        # Check for audience header
        if 'target audience' in line.lower() or 'intended for' in line.lower():
            in_audience_section = True
            continue
        
        # Extract audience items
        if in_audience_section:
            # Stop at next section
            if line.startswith('#'):
                break
            
            # Extract from bullets or inline
            if line.startswith('-') or line.startswith('*'):
                item = line.lstrip('-*').strip()
                if item and len(item) < 50:
                    audience.append(item)
            elif '•' in line:
                items = [i.strip() for i in line.split('•') if i.strip()]
                audience.extend([i for i in items if len(i) < 50])
    
    # Fallback: use common roles from content
    if not audience:
        roles = [
            "Developers", "Engineers", "Architects", "QA Engineers",
            "Project Managers", "Technical Teams", "Administrators",
            "Donors", "Participants", "Partners", "Executives",
            "Investors", "CFOs", "System Integrators"
        ]
        
        for role in roles:
            if role.lower() in content.lower():
                audience.append(role)
                if len(audience) >= 4:  # Max 4 roles
                    break
    
    return audience[:4]  # Limit to 4


def extract_topics_from_content(content: str, tags: List[str]) -> List[str]:
    """
    Extract key topics from content and tags
    Returns top 5 topics
    """
    topics = []
    
    # Use existing tags first
    topics.extend(tags[:3])
    
    # Look for key topics section in content
    lines = content.split('\n')
    in_topics_section = False
    
    for line in lines:
        line = line.strip()
        
        if 'key topics' in line.lower() or 'topics covered' in line.lower():
            in_topics_section = True
            continue
        
        if in_topics_section:
            if line.startswith('#'):
                break
            
            if line.startswith('-') or line.startswith('*'):
                topic = line.lstrip('-*').strip()
                if topic and len(topic) < 50 and topic not in topics:
                    topics.append(topic)
    
    return topics[:5]  # Top 5 topics


def get_category_icon(category: str) -> str:
    """Get emoji icon for a category"""
    icons = {
        "Platform": "📋",
        "Architecture": "🏗️",
        "API": "🔌",
        "Features": "✨",
        "Development": "💻",
        "Deployment": "🚀",
        "Operations": "⚙️",
        "User Guides": "👥",
        "Guides": "📖",
        "Reference": "📚",
        "Integrations": "🔗",
        "Products": "🌐",
        "Resources": "🎯",
        "Documentation": "📄"
    }
    return icons.get(category, "📄")


def get_badge_color(badge: str) -> str:
    """Get color class for a badge"""
    colors = {
        HubBadge.STRATEGIC_VISION: "bg-purple-500",
        HubBadge.ARCHITECTURE: "bg-blue-500",
        HubBadge.PUBLISHED: "bg-green-500",
        HubBadge.IMPLEMENTATION: "bg-orange-500",
        HubBadge.TECHNICAL: "bg-red-500",
        HubBadge.ENTERPRISE: "bg-indigo-500",
        HubBadge.LAUNCH_PLAN: "bg-pink-500",
        HubBadge.AI_SYSTEM: "bg-cyan-500",
        HubBadge.MCP_SYSTEM: "bg-teal-500",
        HubBadge.QA_FRAMEWORK: "bg-yellow-500",
        HubBadge.ADMIN_GUIDE: "bg-gray-500",
        HubBadge.DONOR_GUIDE: "bg-rose-500",
        HubBadge.USER_GUIDE: "bg-sky-500"
    }
    return colors.get(badge, "bg-gray-500")

