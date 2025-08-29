#!/usr/bin/env python3
"""
Setup shelter public configurations for all shelters in the database.
This script creates public page URLs and default configurations for each shelter.
"""

import sys
import os
from datetime import datetime
import json

# Add the parent directory to Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    from google.cloud.firestore import SERVER_TIMESTAMP
except ImportError as e:
    print(f"❌ Error importing required packages: {e}")
    print("📦 Please install required packages:")
    print("pip install firebase-admin google-cloud-firestore")
    sys.exit(1)

def initialize_firebase():
    """Initialize Firebase Admin SDK."""
    try:
        # Use Application Default Credentials (from environment)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(credentials.ApplicationDefault())
        
        db = firestore.client()
        print("✅ Firebase Admin SDK initialized successfully")
        return db
    except Exception as e:
        print(f"❌ Error initializing Firebase: {e}")
        sys.exit(1)

def generate_slug(name):
    """Generate URL slug from shelter name."""
    import re
    # Convert to lowercase and replace special characters
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s]', '', slug)  # Remove special characters
    slug = re.sub(r'\s+', '-', slug)  # Replace spaces with hyphens
    slug = slug.strip('-')  # Remove leading/trailing hyphens
    return slug

def create_default_shelter_config(shelter_id, shelter_data):
    """Create default public configuration for a shelter."""
    name = shelter_data.get('name', 'Unknown Shelter')
    slug = generate_slug(name)
    
    config = {
        'id': shelter_id,
        'name': name,
        'slug': slug,
        'publicUrl': f'/shelter-{slug}',
        'description': f"{name} is committed to providing safe, supportive emergency shelter and services to individuals and families experiencing homelessness in Montreal.",
        'mission': "To provide immediate shelter, support services, and pathways to permanent housing for our community's most vulnerable members.",
        'services': [
            'Emergency Overnight Shelter',
            'Meals and Basic Necessities',
            'Case Management Services',
            'Mental Health Support',
            'Job Training Programs',
            'Housing Assistance',
            'Medical Care Coordination',
            'Substance Abuse Support'
        ],
        'operatingHours': {
            'Monday': '6:00 PM - 8:00 AM',
            'Tuesday': '6:00 PM - 8:00 AM',
            'Wednesday': '6:00 PM - 8:00 AM',
            'Thursday': '6:00 PM - 8:00 AM',
            'Friday': '6:00 PM - 8:00 AM',
            'Saturday': '24 Hours',
            'Sunday': '24 Hours'
        },
        'established': '1985',
        'certifications': [
            'Canadian Centre for Accreditation',
            'Montreal Health Services Certified',
            'Emergency Shelter Standards Compliant'
        ],
        'socialMedia': {
            'website': f'https://example.com/{slug}',
            'facebook': f'https://facebook.com/{slug}',
            'twitter': f'https://twitter.com/{slug}'
        },
        'customizations': {
            'primaryColor': '#3B82F6',
            'secondaryColor': '#1E40AF',
            'headerStyle': 'modern'
        },
        'isPublic': True,
        'createdAt': SERVER_TIMESTAMP,
        'updatedAt': SERVER_TIMESTAMP
    }
    
    return config

def setup_shelter_public_configs():
    """Set up public configurations for all shelters."""
    print("🏠 Setting up shelter public configurations...")
    print("=" * 50)
    
    # Initialize Firebase
    db = initialize_firebase()
    
    try:
        # Get all shelters from the shelters collection
        print("🔍 Fetching all shelters from database...")
        shelters_ref = db.collection('shelters')
        shelters = shelters_ref.stream()
        
        shelter_count = 0
        processed_count = 0
        skipped_count = 0
        
        for shelter_doc in shelters:
            shelter_count += 1
            shelter_id = shelter_doc.id
            shelter_data = shelter_doc.to_dict()
            shelter_name = shelter_data.get('name', 'Unknown Shelter')
            
            print(f"\n📍 Processing: {shelter_name} (ID: {shelter_id})")
            
            # Check if public config already exists
            config_ref = db.collection('shelters').document(shelter_id).collection('public_config').document('settings')
            config_doc = config_ref.get()
            
            if config_doc.exists:
                print(f"⏭️  Public config already exists for: {shelter_name}")
                skipped_count += 1
                continue
            
            # Create default public configuration
            default_config = create_default_shelter_config(shelter_id, shelter_data)
            slug = default_config['slug']
            public_url = default_config['publicUrl']
            
            # Save configuration to Firestore
            config_ref.set(default_config)
            print(f"✅ Created public config for: {shelter_name}")
            print(f"   📎 Slug: {slug}")
            print(f"   🌐 Public URL: {public_url}")
            
            processed_count += 1
        
        print("\n" + "=" * 50)
        print("🎉 Shelter public configuration setup complete!")
        print(f"📊 Total shelters found: {shelter_count}")
        print(f"✅ Configurations created: {processed_count}")
        print(f"⏭️  Configurations skipped (already exist): {skipped_count}")
        
        if processed_count > 0:
            print("\n🌐 Public URLs created:")
            print("-" * 30)
            
            # List all public URLs
            for shelter_doc in shelters_ref.stream():
                shelter_id = shelter_doc.id
                shelter_data = shelter_doc.to_dict()
                shelter_name = shelter_data.get('name', 'Unknown Shelter')
                slug = generate_slug(shelter_name)
                print(f"• {shelter_name}: /shelter-{slug}")
        
        print(f"\n🚀 You can now visit the shelters showcase page at: /shelters")
        print(f"🏠 Individual shelter pages are available at: /shelter-[name]")
        
    except Exception as e:
        print(f"❌ Error setting up shelter configurations: {e}")
        return False
    
    return True

def main():
    """Main function."""
    print("🚀 SHELTR Shelter Public Configuration Setup")
    print("=" * 50)
    
    success = setup_shelter_public_configs()
    
    if success:
        print("\n✅ Setup completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Setup failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
