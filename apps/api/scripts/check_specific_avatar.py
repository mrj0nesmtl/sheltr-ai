#!/usr/bin/env python3
"""
Check for the specific avatar that should exist
"""
import os
import sys
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, storage

# Load environment variables
load_dotenv()

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Try to get the existing app
        app = firebase_admin.get_app()
        print("✅ Using existing Firebase app")
    except ValueError:
        # Initialize Firebase Admin SDK
        service_account_path = os.path.join(os.path.dirname(__file__), '..', 'service-account-key.json')
        
        if not os.path.exists(service_account_path):
            print(f"❌ Service account key not found at: {service_account_path}")
            sys.exit(1)
        
        cred = credentials.Certificate(service_account_path)
        app = firebase_admin.initialize_app(cred, {
            'storageBucket': 'sheltr-ai.appspot.com'
        })
        print("✅ Firebase Admin SDK initialized")
    
    return app

def check_specific_avatar():
    """Check for the specific avatar that should exist"""
    try:
        # Get storage bucket
        bucket = storage.bucket()
        
        user_id = "dFJNlIh2g4R8vAvxvIvWZtwu8zw1"
        
        print(f"🔍 Checking for avatar for user: {user_id}")
        print("=" * 60)
        
        # Check various possible paths
        possible_paths = [
            f'profiles/{user_id}/avatar.png',
            f'profiles/{user_id}/avatar.jpg',
            f'profiles/{user_id}/avatar.jpeg',
            f'profiles/{user_id}/avatar.webp',
            f'profiles/{user_id}/profile.png',
            f'profiles/{user_id}/profile.jpg',
            f'profiles/{user_id}/profile.jpeg',
            f'profiles/{user_id}/profile.webp'
        ]
        
        found_files = []
        
        for path in possible_paths:
            try:
                blob = bucket.blob(path)
                
                # Try to get metadata
                if blob.exists():
                    blob.reload()
                    size_mb = round(blob.size / (1024 * 1024), 2)
                    found_files.append({
                        'path': path,
                        'size': f"{size_mb} MB",
                        'updated': blob.updated.strftime('%Y-%m-%d %H:%M:%S') if blob.updated else 'Unknown',
                        'content_type': blob.content_type or 'Unknown'
                    })
                    print(f"✅ Found: {path}")
                    print(f"   Size: {size_mb} MB")
                    print(f"   Type: {blob.content_type}")
                    print(f"   Updated: {blob.updated}")
                    print(f"   Public URL: gs://sheltr-ai.appspot.com/{path}")
                else:
                    print(f"❌ Not found: {path}")
                    
            except Exception as e:
                print(f"❌ Error checking {path}: {e}")
        
        print("\n" + "=" * 60)
        if found_files:
            print(f"📊 Found {len(found_files)} profile picture(s) for user {user_id}")
        else:
            print(f"📊 No profile pictures found for user {user_id}")
            print("\n🔍 Let's also check if there are ANY files in the profiles directory...")
            
            # List all files in profiles directory
            try:
                blobs = bucket.list_blobs(prefix=f'profiles/{user_id}/')
                files_found = list(blobs)
                if files_found:
                    print(f"✅ Found {len(files_found)} files in profiles/{user_id}/:")
                    for blob in files_found:
                        print(f"   - {blob.name} ({blob.size} bytes)")
                else:
                    print(f"❌ No files found in profiles/{user_id}/")
            except Exception as e:
                print(f"❌ Error listing directory: {e}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🔍 SHELTR-AI Specific Avatar Checker")
    print("=" * 50)
    
    # Initialize Firebase
    app = initialize_firebase()
    
    # Check specific avatar
    check_specific_avatar()
    
    print("\n✅ Specific avatar check completed!")
