#!/usr/bin/env python3
"""
Update existing shelter public URLs to remove the 'shelter-' prefix.
This fixes the routing from /shelter-[name] to /[name].
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

def update_shelter_urls():
    """Update shelter public URLs to remove shelter- prefix."""
    print("🔧 Updating shelter public URLs...")
    print("=" * 50)
    
    # Initialize Firebase
    db = initialize_firebase()
    
    try:
        # Get all shelters from the shelters collection
        print("🔍 Fetching all shelters from database...")
        shelters_ref = db.collection('shelters')
        shelters = shelters_ref.stream()
        
        updated_count = 0
        
        for shelter_doc in shelters:
            shelter_id = shelter_doc.id
            shelter_data = shelter_doc.to_dict()
            shelter_name = shelter_data.get('name', 'Unknown Shelter')
            
            print(f"\n📍 Processing: {shelter_name} (ID: {shelter_id})")
            
            # Get the public config
            config_ref = db.collection('shelters').document(shelter_id).collection('public_config').document('settings')
            config_doc = config_ref.get()
            
            if not config_doc.exists:
                print(f"⚠️  No public config found for: {shelter_name}")
                continue
            
            config_data = config_doc.to_dict()
            current_url = config_data.get('publicUrl', '')
            slug = config_data.get('slug', generate_slug(shelter_name))
            
            # Update the public URL to remove shelter- prefix
            new_url = f"/{slug}"
            
            if current_url == new_url:
                print(f"✅ URL already correct for: {shelter_name} ({new_url})")
                continue
            
            # Update the configuration
            updates = {
                'publicUrl': new_url,
                'updatedAt': SERVER_TIMESTAMP
            }
            
            config_ref.update(updates)
            print(f"🔄 Updated URL for: {shelter_name}")
            print(f"   📎 Old URL: {current_url}")
            print(f"   🌐 New URL: {new_url}")
            
            updated_count += 1
        
        print("\n" + "=" * 50)
        print("🎉 Shelter URL update complete!")
        print(f"✅ URLs updated: {updated_count}")
        
        if updated_count > 0:
            print("\n🌐 Updated URLs:")
            print("-" * 30)
            
            # List all updated URLs
            for shelter_doc in shelters_ref.stream():
                shelter_id = shelter_doc.id
                shelter_data = shelter_doc.to_dict()
                shelter_name = shelter_data.get('name', 'Unknown Shelter')
                slug = generate_slug(shelter_name)
                print(f"• {shelter_name}: /{slug}")
        
        print(f"\n🚀 You can now visit the shelters showcase page at: /shelters")
        print(f"🏠 Individual shelter pages are now available at: /[name]")
        
    except Exception as e:
        print(f"❌ Error updating shelter URLs: {e}")
        return False
    
    return True

def main():
    """Main function."""
    print("🚀 SHELTR Shelter URL Update")
    print("=" * 50)
    
    success = update_shelter_urls()
    
    if success:
        print("\n✅ Update completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Update failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
