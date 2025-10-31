"""
SHELTR-AI Data Models
"""

from models.permissions import (
    DocumentPermission,
    UserRole,
    DocumentPermissionConfig,
    PERMISSION_HIERARCHY,
    check_document_permission,
    determine_permission_from_path,
    get_permission_display_info
)

from models.docs_hub import (
    HubCategory,
    HubBadge,
    DocsHubMetadata,
    DocsHubCard,
    DocsHubDocument,
    PublishToHubRequest,
    generate_slug,
    extract_description,
    extract_audience_from_content,
    extract_topics_from_content,
    get_category_icon,
    get_badge_color
)

from models.secure_publishing import (
    SecurePublishingSettings,
    PublishToFoundersRequest,
    PublishToIRRequest,
    SecureDocumentCard,
    SecureDocumentFull,
    BADGE_PRESETS,
    ICON_OPTIONS,
    generate_secure_slug,
    get_badge_preset
)

__all__ = [
    # Permissions
    'DocumentPermission',
    'UserRole',
    'DocumentPermissionConfig',
    'PERMISSION_HIERARCHY',
    'check_document_permission',
    'determine_permission_from_path',
    'get_permission_display_info',
    # Docs Hub
    'HubCategory',
    'HubBadge',
    'DocsHubMetadata',
    'DocsHubCard',
    'DocsHubDocument',
    'PublishToHubRequest',
    'generate_slug',
    'extract_description',
    'extract_audience_from_content',
    'extract_topics_from_content',
    'get_category_icon',
    'get_badge_color',
    # Secure Publishing
    'SecurePublishingSettings',
    'PublishToFoundersRequest',
    'PublishToIRRequest',
    'SecureDocumentCard',
    'SecureDocumentFull',
    'BADGE_PRESETS',
    'ICON_OPTIONS',
    'generate_secure_slug',
    'get_badge_preset'
]

