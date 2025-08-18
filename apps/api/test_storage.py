#!/usr/bin/env python3
"""
Test Firebase Storage Configuration
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_firebase_storage():
    """Test Firebase storage configuration"""
    import firebase_admin
    from firebase_admin import credentials, storage
    
    try:
        # Initialize Firebase like the main app does
        if not firebase_admin._apps:
            # Use simplified initialization for testing
            storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET", "sheltr-ai.firebasestorage.app")
            firebase_admin.initialize_app(options={
                'storageBucket': storage_bucket
            })
            print(f"✅ Firebase initialized with bucket: {storage_bucket}")
        
        # Test storage access
        bucket = storage.bucket()
        print(f"✅ Storage bucket accessible: {bucket.name}")
        
        # Test creating knowledge-base folder structure
        blob = bucket.blob('knowledge-base/test.txt')
        blob.upload_from_string('Test file for knowledge base storage')
        print("✅ Test file uploaded successfully")
        
        # Clean up test file
        blob.delete()
        print("✅ Test file cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ Firebase storage test failed: {e}")
        return False

if __name__ == "__main__":
    import asyncio
    result = asyncio.run(test_firebase_storage())
    if result:
        print("\n🎉 Firebase Storage is properly configured!")
    else:
        print("\n💥 Firebase Storage configuration needs attention")
