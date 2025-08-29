#!/usr/bin/env python3
"""
Shelter Logo Upload Script
Allows direct upload of shelter logos to Firebase Storage and updates Firestore.
"""

import os
import sys
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, storage
from PIL import Image
import uuid

# Initialize Firebase Admin SDK
try:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'sheltr-ai.appspot.com'
    })
    print("✅ Firebase Admin SDK initialized successfully")
except Exception as e:
    print(f"❌ Error initializing Firebase: {e}")
    sys.exit(1)

db = firestore.client()
bucket = storage.bucket()

def upload_logo(shelter_id, logo_path, logo_name=None):
    """
    Upload a logo file to Firebase Storage and update the shelter's public config.
    
    Args:
        shelter_id (str): The ID of the shelter
        logo_path (str): Path to the logo file
        logo_name (str): Optional custom name for the logo
    """
    try:
        # Validate file exists
        if not os.path.exists(logo_path):
            print(f"❌ File not found: {logo_path}")
            return False
        
        # Get file extension
        file_ext = Path(logo_path).suffix.lower()
        if file_ext not in ['.jpg', '.jpeg', '.png', '.svg', '.webp']:
            print(f"❌ Unsupported file format: {file_ext}")
            return False
        
        # Generate filename
        if not logo_name:
            logo_name = f"logo_{uuid.uuid4().hex[:8]}{file_ext}"
        elif not logo_name.endswith(file_ext):
            logo_name += file_ext
        
        # Firebase Storage path
        storage_path = f"shelters/{shelter_id}/logo/{logo_name}"
        
        # Upload to Firebase Storage
        blob = bucket.blob(storage_path)
        blob.upload_from_filename(logo_path)
        
        # Make the file publicly accessible
        blob.make_public()
        
        # Get the public URL
        logo_url = blob.public_url
        
        # Update Firestore public config
        config_ref = db.collection('shelters').document(shelter_id).collection('public_config').document('settings')
        config_ref.update({
            'logoUrl': logo_url,
            'logoStoragePath': storage_path
        })
        
        print(f"✅ Logo uploaded successfully!")
        print(f"   Shelter ID: {shelter_id}")
        print(f"   Storage Path: {storage_path}")
        print(f"   Public URL: {logo_url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error uploading logo: {e}")
        return False

def list_shelters():
    """List all available shelters with their IDs and names."""
    try:
        shelters_ref = db.collection('shelters')
        docs = shelters_ref.stream()
        
        print("\n📋 Available Shelters:")
        print("-" * 50)
        
        shelters = []
        for doc in docs:
            data = doc.to_dict()
            shelter_info = {
                'id': doc.id,
                'name': data.get('name', 'Unknown'),
                'type': data.get('type', 'Unknown'),
                'status': data.get('status', 'Unknown')
            }
            shelters.append(shelter_info)
            
            print(f"ID: {shelter_info['id']}")
            print(f"Name: {shelter_info['name']}")
            print(f"Type: {shelter_info['type']}")
            print(f"Status: {shelter_info['status']}")
            print("-" * 30)
        
        return shelters
        
    except Exception as e:
        print(f"❌ Error listing shelters: {e}")
        return []

def optimize_image(input_path, output_path, max_size=(300, 300), quality=85):
    """
    Optimize an image for web use.
    
    Args:
        input_path (str): Path to the original image
        output_path (str): Path for the optimized image
        max_size (tuple): Maximum dimensions (width, height)
        quality (int): JPEG quality (1-100)
    """
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Resize while maintaining aspect ratio
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save optimized image
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
        print(f"✅ Image optimized: {output_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error optimizing image: {e}")
        return False

def main():
    """Main interactive function."""
    print("🏠 SHELTR Shelter Logo Upload Tool")
    print("=" * 40)
    
    while True:
        print("\nOptions:")
        print("1. List all shelters")
        print("2. Upload logo for a shelter")
        print("3. Upload and optimize logo")
        print("4. Exit")
        
        choice = input("\nSelect an option (1-4): ").strip()
        
        if choice == '1':
            list_shelters()
            
        elif choice == '2':
            shelter_id = input("Enter shelter ID: ").strip()
            logo_path = input("Enter path to logo file: ").strip()
            
            # Remove quotes if present
            logo_path = logo_path.strip('"\'')
            
            if upload_logo(shelter_id, logo_path):
                print("🎉 Upload completed!")
            else:
                print("💥 Upload failed!")
                
        elif choice == '3':
            shelter_id = input("Enter shelter ID: ").strip()
            logo_path = input("Enter path to logo file: ").strip()
            
            # Remove quotes if present
            logo_path = logo_path.strip('"\'')
            
            # Create optimized version
            optimized_path = f"/tmp/optimized_logo_{uuid.uuid4().hex[:8]}.jpg"
            
            if optimize_image(logo_path, optimized_path):
                if upload_logo(shelter_id, optimized_path):
                    print("🎉 Optimized upload completed!")
                    # Clean up temporary file
                    os.remove(optimized_path)
                else:
                    print("💥 Upload failed!")
            else:
                print("💥 Image optimization failed!")
                
        elif choice == '4':
            print("👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid option. Please try again.")

if __name__ == "__main__":
    main()
