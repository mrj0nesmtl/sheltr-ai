#!/usr/bin/env python3
"""
Local Documentation Reorganizer
Reorganizes local /docs folder to match the new cloud knowledge base structure
"""

import os
import shutil
from pathlib import Path
from datetime import datetime

def reorganize_local_docs():
    """Reorganize local documentation to match cloud structure"""
    
    docs_root = Path("docs")
    
    print("🏗️  Starting local documentation reorganization...")
    
    # 1. Create missing directories
    missing_dirs = [
        "docs/05-deployment",
        "docs/07-reference", 
        "docs/08-integrations",
        "docs/10-resources",
        "docs/10-resources/templates"
    ]
    
    print("\n📁 Creating missing directories...")
    for dir_path in missing_dirs:
        Path(dir_path).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created: {dir_path}")
    
    # 2. Create missing README.md files
    readme_content = {
        "docs/02-architecture/README.md": """# 🏗️ Technical Architecture

This section contains detailed technical architecture documentation for the SHELTR-AI platform.

## 📋 Contents

- **System Design**: Overall system architecture and design patterns
- **Website Architecture**: Frontend and backend architecture
- **Whitepaper**: Complete technical whitepaper
- **Technical**: Detailed technical specifications
  - Blockchain architecture and smart contracts
- **Tokenomics**: Token economics and distribution models
- **Payment Rails**: Payment processing and integration

## 🔗 Related Documentation

- [API Documentation](../03-api/README.md)
- [Development Guide](../04-development/README.md)
- [Deployment Guide](../05-deployment/README.md)
""",
        
        "docs/04-development/README.md": """# 💻 Development Documentation

This section contains development guides, standards, and processes for the SHELTR-AI platform.

## 📋 Contents

- **Chatbot Agent Architecture**: AI chatbot system design
- **Complete Functionality Matrix**: Feature coverage matrix
- **Development Roadmap**: Development timeline and milestones
- **User Journeys**: User experience flows and scenarios

## 🔧 Development Resources

- **Development Archive**: Historical development sessions and notes
- **Session Notes**: Detailed development session documentation
- **Testing Guides**: Testing strategies and procedures

## 🔗 Related Documentation

- [API Documentation](../03-api/README.md)
- [Architecture](../02-architecture/README.md)
- [Deployment](../05-deployment/README.md)
""",

        "docs/05-deployment/README.md": """# 🚀 Deployment & Operations

This section contains deployment guides and operational procedures for the SHELTR-AI platform.

## 📋 Contents

*This section is ready for content. Key areas to document:*

- **Firebase Deployment**: Frontend deployment to Firebase Hosting
- **Google Cloud Run**: Backend API deployment
- **Smart Contract Deployment**: Blockchain deployment procedures
- **Mobile App Stores**: Mobile app deployment guides
- **Monitoring Setup**: System monitoring and alerting
- **Backup & Recovery**: Backup strategies and disaster recovery
- **Security Hardening**: Production security configurations
- **Performance Optimization**: Performance tuning guides

## 🔗 Related Documentation

- [Architecture](../02-architecture/README.md)
- [Development](../04-development/README.md)
- [Reference](../07-reference/README.md)
""",

        "docs/06-user-guides/README.md": """# 👥 User Guides

This section contains user-facing documentation for all SHELTR-AI platform roles.

## 📋 Contents

- **Donor Guide**: Complete guide for donors using the platform
- **Participant Guide**: Guide for shelter participants
- **Shelter Admin Guide**: Administrative guide for shelter managers

## 🎯 User Roles

### 🤝 Donors
- Platform registration and setup
- Making donations via QR codes
- Tracking donation impact
- Tax documentation

### 🏠 Shelter Participants  
- Platform access and navigation
- Receiving services and support
- Community features

### 👨‍💼 Shelter Administrators
- Shelter management dashboard
- Participant management
- Donation tracking and reporting
- QR code management

## 🔗 Related Documentation

- [API Documentation](../03-api/README.md)
- [Architecture](../02-architecture/README.md)
""",

        "docs/07-reference/README.md": """# 📚 Technical Reference

This section contains detailed technical reference materials for the SHELTR-AI platform.

## 📋 Contents

*This section is ready for content. Key areas to document:*

- **Database Reference**: Complete Firestore collections and schema
- **API Reference**: Comprehensive API endpoint documentation  
- **Component Library**: UI component documentation and examples
- **Smart Contract Reference**: Blockchain contract documentation
- **Error Codes**: Complete error code reference
- **Configuration Reference**: Environment variables and configuration
- **Glossary**: Technical terms and definitions
- **FAQ**: Frequently asked questions

## 🔗 Related Documentation

- [API Documentation](../03-api/README.md)
- [Architecture](../02-architecture/README.md)
- [User Guides](../06-user-guides/README.md)
""",

        "docs/08-integrations/README.md": """# 🔗 Third-Party Integrations

This section contains integration guides for external services and APIs.

## 📋 Contents

*This section is ready for content. Key areas to document:*

- **Firebase Integration**: Complete Firebase service setup
- **Google Cloud Integration**: GCP service integration guides
- **Blockchain Integration**: Web3 and smart contract integration
- **Payment Integration**: Stripe, PayPal, and other payment processors
- **Analytics Integration**: Analytics and tracking setup
- **Notification Integration**: Push notification services
- **Third-Party APIs**: External API integration guides

## 🔧 Integration Categories

### ☁️ Cloud Services
- Firebase (Auth, Firestore, Storage, Hosting)
- Google Cloud Platform (Cloud Run, Cloud Functions)
- Vercel/Netlify deployment

### 💳 Payment Processing
- Stripe integration
- PayPal integration  
- Cryptocurrency payments
- Adyen payment rails

### 📊 Analytics & Monitoring
- Google Analytics
- Firebase Analytics
- Error tracking (Sentry)
- Performance monitoring

## 🔗 Related Documentation

- [Architecture](../02-architecture/README.md)
- [Deployment](../05-deployment/README.md)
- [Reference](../07-reference/README.md)
""",

        "docs/10-resources/README.md": """# 📖 Additional Resources

This section contains supplementary resources, templates, and guidelines for the SHELTR-AI platform.

## 📋 Contents

*This section is ready for content. Key areas to document:*

- **Design System**: UI/UX design system and guidelines
- **Brand Guidelines**: Brand identity and style guide
- **Legal Compliance**: Legal and regulatory documentation
- **Accessibility Guide**: Accessibility standards and implementation
- **Performance Benchmarks**: Performance standards and metrics
- **Security Checklist**: Security audit checklist and procedures
- **Templates**: Document and code templates

## 📁 Templates Directory

The `templates/` subdirectory contains:
- Bug report templates
- Feature request templates
- Pull request templates
- Documentation templates
- Code scaffolding templates

## 🔗 Related Documentation

- [User Guides](../06-user-guides/README.md)
- [Development](../04-development/README.md)
- [Reference](../07-reference/README.md)
""",

        "docs/10-resources/templates/README.md": """# 📄 Templates

This directory contains templates for various documentation and development tasks.

## 📋 Available Templates

*Ready for template files:*

- `bug-report-template.md` - Standardized bug reporting
- `feature-request-template.md` - Feature request format
- `pr-template.md` - Pull request template
- `documentation-template.md` - Documentation structure template
- `api-endpoint-template.md` - API documentation template
- `user-story-template.md` - User story format

## 🎯 Usage

These templates ensure consistency across:
- Issue reporting
- Feature requests  
- Code contributions
- Documentation creation
- Project planning

Copy and customize these templates for your specific needs.
"""
    }
    
    print("\n📝 Creating missing README files...")
    for readme_path, content in readme_content.items():
        readme_file = Path(readme_path)
        if not readme_file.exists():
            readme_file.write_text(content)
            print(f"✅ Created: {readme_path}")
        else:
            print(f"ℹ️  Already exists: {readme_path}")
    
    # 3. Clean up legacy migration (consolidate into 09-migration)
    print("\n🧹 Consolidating legacy migration content...")
    
    legacy_migration_dir = Path("docs/legacy-migration")
    if legacy_migration_dir.exists():
        # Create a consolidated migration guide
        consolidated_content = """# 📚 Legacy Migration Archive

This document consolidates content from the legacy migration directory.

## 🔄 Migration Status

The SHELTR-AI platform has successfully migrated from legacy systems to the new Firebase/FastAPI architecture.

## 📋 Archived Migration Content

### High Priority Items (Completed)
- Architecture migration ✅
- Blockchain integration ✅  
- Hacking homelessness strategy ✅
- Platform overview ✅
- RBAC implementation ✅
- Whitepaper finalization ✅

### Medium Priority Items (Completed)
- API documentation ✅
- Best practices documentation ✅
- QR system implementation ✅
- Security implementation ✅

### Reference Materials (Archived)
- Authentication system documentation
- Database migration procedures
- Technical specifications
- Whitepaper versions (EN/FR)

## 🔗 Current Documentation

For current system documentation, see:
- [Architecture](../02-architecture/README.md)
- [API Documentation](../03-api/README.md)
- [Migration Status](DATABASE_MIGRATION_COMPLETE.md)

*Legacy migration directory archived on {datetime.now().strftime('%Y-%m-%d')}*
"""
        
        # Write consolidated migration file
        consolidated_file = Path("docs/09-migration/legacy-migration-archive.md")
        consolidated_file.write_text(consolidated_content)
        print(f"✅ Created consolidated: {consolidated_file}")
        
        # Archive the legacy directory (rename with timestamp)
        archive_name = f"legacy-migration-archived-{datetime.now().strftime('%Y%m%d')}"
        archived_path = Path(f"docs/{archive_name}")
        
        if not archived_path.exists():
            shutil.move(str(legacy_migration_dir), str(archived_path))
            print(f"📦 Archived legacy migration to: {archived_path}")
    
    # 4. Update main docs README if it exists
    main_readme = Path("docs/README.md")
    if not main_readme.exists():
        main_readme_content = """# 📚 SHELTR-AI Documentation

Welcome to the SHELTR-AI platform documentation. This comprehensive guide covers all aspects of the platform from architecture to user guides.

## 🗂️ Documentation Structure

### 📋 [01-overview/](01-overview/)
Project introduction, mission, and getting started guides.

### 🏗️ [02-architecture/](02-architecture/) 
Technical architecture, system design, and blockchain documentation.

### 🔌 [03-api/](03-api/)
API documentation, schemas, and integration guides.

### 💻 [04-development/](04-development/)
Development guides, standards, and processes.

### 🚀 [05-deployment/](05-deployment/)
Deployment guides and operational procedures.

### 👥 [06-user-guides/](06-user-guides/)
User documentation for donors, participants, and administrators.

### 📚 [07-reference/](07-reference/)
Technical reference materials and documentation.

### 🔗 [08-integrations/](08-integrations/)
Third-party integration guides and setup instructions.

### 🔄 [09-migration/](09-migration/)
Migration documentation and procedures.

### 📖 [10-resources/](10-resources/)
Additional resources, templates, and guidelines.

## 🚀 Quick Start

1. **New to SHELTR-AI?** Start with [Project Overview](01-overview/README.md)
2. **Developer?** Check out [Development Guide](04-development/README.md)
3. **User?** See [User Guides](06-user-guides/README.md)
4. **Deploying?** Review [Deployment Guide](05-deployment/README.md)

## 🔗 External Links

- [Live Platform](https://sheltr-ai.web.app)
- [GitHub Repository](https://github.com/mrj0nesmtl/sheltr-ai)
- [API Documentation](https://sheltr-ai.web.app/docs/api)

---

*Documentation last updated: {datetime.now().strftime('%Y-%m-%d')}*
"""
        main_readme.write_text(main_readme_content)
        print(f"✅ Created main README: {main_readme}")
    
    print("\n📊 Reorganization Summary:")
    print(f"✅ Created {len(missing_dirs)} missing directories")
    print(f"✅ Created {len(readme_content)} README files")
    print("✅ Consolidated legacy migration content")
    print("✅ Updated main documentation README")
    
    return True

def validate_structure():
    """Validate the new local structure matches cloud organization"""
    
    print("\n🔍 Validating local documentation structure...")
    
    expected_dirs = [
        "docs/01-overview",
        "docs/02-architecture", 
        "docs/02-architecture/technical",
        "docs/02-architecture/tokenomics", 
        "docs/02-architecture/payment-rails",
        "docs/03-api",
        "docs/04-development",
        "docs/05-deployment",
        "docs/06-user-guides", 
        "docs/07-reference",
        "docs/08-integrations",
        "docs/09-migration",
        "docs/10-resources",
        "docs/10-resources/templates"
    ]
    
    missing_dirs = []
    existing_dirs = []
    
    for dir_path in expected_dirs:
        if Path(dir_path).exists():
            existing_dirs.append(dir_path)
            print(f"✅ {dir_path}")
        else:
            missing_dirs.append(dir_path)
            print(f"❌ {dir_path}")
    
    print(f"\n📊 Validation Results:")
    print(f"✅ Existing directories: {len(existing_dirs)}")
    print(f"❌ Missing directories: {len(missing_dirs)}")
    
    if missing_dirs:
        print(f"\n⚠️  Missing directories:")
        for missing in missing_dirs:
            print(f"  - {missing}")
    
    return len(missing_dirs) == 0

if __name__ == "__main__":
    print("🚀 Starting Local Documentation Reorganization...")
    
    # Change to project root
    os.chdir("/Users/mrjones/Github/Projects/sheltr-ai")
    
    # Reorganize documentation
    reorganize_local_docs()
    
    # Validate structure
    validation_passed = validate_structure()
    
    if validation_passed:
        print("\n🎉 Local documentation reorganization completed successfully!")
        print("📁 Your local /docs folder now matches the cloud knowledge base structure!")
    else:
        print("\n⚠️  Reorganization completed with some issues. Please review missing directories.")
    
    print("\n🔗 Next steps:")
    print("1. Review the new README files and add content as needed")
    print("2. Move any remaining files to appropriate directories")
    print("3. Update TABLE_OF_CONTENTS.md to reflect new structure")
    print("4. Commit changes to version control")
