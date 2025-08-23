#!/usr/bin/env python3
"""
Knowledge Base Folder Structure Creator
Creates the new folder structure in Firebase Storage for organized documentation
"""

import firebase_admin
from firebase_admin import credentials, storage
from pathlib import Path

def create_folder_structure():
    """Create the new knowledge base folder structure in Firebase Storage"""
    
    # Initialize Firebase (if not already initialized)
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    
    bucket = storage.bucket('sheltr-ai.firebasestorage.app')
    
    # Define the new folder structure
    folders = [
        'knowledge-base/01-overview/',
        'knowledge-base/02-architecture/',
        'knowledge-base/02-architecture/technical/',
        'knowledge-base/02-architecture/tokenomics/',
        'knowledge-base/02-architecture/payment-rails/',
        'knowledge-base/03-api/',
        'knowledge-base/03-api/examples/',
        'knowledge-base/04-development/',
        'knowledge-base/05-deployment/',
        'knowledge-base/06-user-guides/',
        'knowledge-base/07-reference/',
        'knowledge-base/08-integrations/',
        'knowledge-base/09-migration/',
        'knowledge-base/10-resources/',
        'knowledge-base/10-resources/templates/',
    ]
    
    print("🏗️  Creating Knowledge Base folder structure...")
    
    # Create folders by uploading placeholder files
    for folder in folders:
        placeholder_path = f"{folder}.gitkeep"
        
        try:
            # Create a placeholder blob to establish the folder
            blob = bucket.blob(placeholder_path)
            blob.upload_from_string("# Folder placeholder\nThis file maintains the folder structure.")
            print(f"📁 Created folder: {folder}")
        except Exception as e:
            print(f"❌ Error creating folder {folder}: {e}")
    
    print("✅ Folder structure created successfully!")
    
    # Create README files for each main directory
    readme_content = {
        'knowledge-base/01-overview/README.md': """# 📋 Project Overview
This section contains high-level project information, mission, and getting started guides.

## Contents
- Project mission and vision
- Architecture overview
- Getting started guides
- Implementation plans
""",
        'knowledge-base/02-architecture/README.md': """# 🏗️ Technical Architecture
This section contains detailed technical architecture documentation.

## Contents
- System design documents
- Database schemas
- API architecture
- Blockchain architecture
- Security architecture
""",
        'knowledge-base/03-api/README.md': """# 🔌 API Documentation
This section contains comprehensive API documentation and examples.

## Contents
- API reference documentation
- Authentication guides
- Code examples
- Integration guides
""",
        'knowledge-base/04-development/README.md': """# 💻 Development Documentation
This section contains development guides, standards, and processes.

## Contents
- Development setup guides
- Coding standards
- Testing guidelines
- Debugging guides
""",
        'knowledge-base/05-deployment/README.md': """# 🚀 Deployment & Operations
This section contains deployment guides and operational procedures.

## Contents
- Deployment guides
- Environment setup
- Monitoring and alerts
- Backup and recovery
""",
        'knowledge-base/06-user-guides/README.md': """# 👥 User Guides
This section contains user-facing documentation for all platform roles.

## Contents
- Donor guides
- Participant guides
- Shelter admin guides
- Mobile app guides
""",
        'knowledge-base/07-reference/README.md': """# 📚 Technical Reference
This section contains detailed technical reference materials.

## Contents
- API reference
- Database reference
- Component library
- Error codes
- Configuration reference
""",
        'knowledge-base/08-integrations/README.md': """# 🔗 Third-Party Integrations
This section contains integration guides for external services.

## Contents
- Firebase integration
- Google Cloud integration
- Payment integrations
- Analytics integrations
""",
        'knowledge-base/09-migration/README.md': """# 🔄 Migration Documentation
This section contains migration guides and procedures.

## Contents
- Database migration guides
- Legacy system migration
- Data migration strategies
- Rollback procedures
""",
        'knowledge-base/10-resources/README.md': """# 📖 Additional Resources
This section contains supplementary resources and templates.

## Contents
- Design system
- Brand guidelines
- Legal compliance
- Templates and examples
"""
    }
    
    print("📝 Creating README files...")
    
    for readme_path, content in readme_content.items():
        try:
            blob = bucket.blob(readme_path)
            blob.upload_from_string(content)
            print(f"📄 Created: {readme_path}")
        except Exception as e:
            print(f"❌ Error creating {readme_path}: {e}")
    
    print("✅ README files created successfully!")
    return folders

if __name__ == "__main__":
    create_folder_structure()
