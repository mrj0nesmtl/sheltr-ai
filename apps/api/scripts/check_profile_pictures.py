#!/usr/bin/env python3
"""
Check for existing profile pictures in Firebase Storage
"""
import os
import sys
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, storage, firestore

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

def check_profile_pictures():
    """Check for existing profile pictures in Storage"""
    try:
        # Get storage bucket
        bucket = storage.bucket()
        
        # Get Firestore client
        db = firestore.client()
        
        print("🔍 Checking profile pictures in Firebase Storage...")
        print("=" * 60)
        
        # Get all users from Firestore
        users_ref = db.collection('users')
        users = users_ref.stream()
        
        user_count = 0
        pic_count = 0
        
        for user_doc in users:
            user_data = user_doc.to_dict()
            user_id = user_doc.id
            user_count += 1
            
            email = user_data.get('email', 'N/A')
            first_name = user_data.get('firstName', 'N/A')
            last_name = user_data.get('lastName', 'N/A')
            role = user_data.get('role', 'N/A')
            
            print(f"\n👤 User: {first_name} {last_name} ({email}) - {role}")
            print(f"   UID: {user_id}")
            
            # Check for profile pictures
            possible_paths = [
                f'profiles/{user_id}/avatar.jpg',
                f'profiles/{user_id}/avatar.jpeg',
                f'profiles/{user_id}/avatar.png',
                f'profiles/{user_id}/avatar.webp',
                f'profiles/{user_id}/profile.jpg',
                f'profiles/{user_id}/profile.jpeg',
                f'profiles/{user_id}/profile.png',
                f'profiles/{user_id}/profile.webp'
            ]
            
            found_pics = []
            for path in possible_paths:
                try:
                    blob = bucket.blob(path)
                    if blob.exists():
                        # Get file metadata
                        blob.reload()
                        size_mb = round(blob.size / (1024 * 1024), 2)
                        found_pics.append({
                            'path': path,
                            'size': f"{size_mb} MB",
                            'updated': blob.updated.strftime('%Y-%m-%d %H:%M:%S') if blob.updated else 'Unknown'
                        })
                except Exception as e:
                    # Ignore permission errors or other issues
                    pass
            
            if found_pics:
                pic_count += 1
                print(f"   📷 Profile pictures found:")
                for pic in found_pics:
                    print(f"      ✅ {pic['path']} ({pic['size']}) - Updated: {pic['updated']}")
            else:
                print(f"   📷 No profile pictures found")
        
        print("\n" + "=" * 60)
        print(f"📊 Summary: {pic_count} users with profile pictures out of {user_count} total users")
        
        if pic_count == 0:
            print("\n💡 No profile pictures found. Users may need to upload avatars via the platform.")
            print("   Pictures should be uploaded to: profiles/{userId}/avatar.{ext}")
        
    except Exception as e:
        print(f"❌ Error checking profile pictures: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🔍 SHELTR-AI Profile Picture Checker")
    print("=" * 50)
    
    # Initialize Firebase
    app = initialize_firebase()
    
    # Check profile pictures
    check_profile_pictures()
    
    print("\n✅ Profile picture check completed!")
