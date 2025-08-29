#!/usr/bin/env python3
"""
Text-Free QR Code Generator Script
Generates clean, square QR codes without any text for shelter donation pages.
"""

import os
import sys
import qrcode
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, storage
from PIL import Image
import uuid
from io import BytesIO

# Initialize Firebase Admin SDK
try:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'sheltr-ai.firebasestorage.app'
    })
    print("✅ Firebase Admin SDK initialized successfully")
except Exception as e:
    print(f"❌ Error initializing Firebase: {e}")
    sys.exit(1)

db = firestore.client()
bucket = storage.bucket()

def create_clean_qr_code(url, size=400):
    """
    Create a clean, text-free QR code that is a perfect square.
    
    Args:
        url (str): The URL to encode
        size (int): Size of the QR code (width and height)
    """
    try:
        # Create QR code with optimal settings
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        # Create QR code image with clean colors
        qr_img = qr.make_image(
            fill_color="#1f2937",  # Dark gray for better contrast
            back_color="#ffffff"   # Pure white background
        )

        # Resize to exact desired size (perfect square)
        qr_img = qr_img.resize((size, size), Image.Resampling.LANCZOS)

        return qr_img

    except Exception as e:
        print(f"❌ Error creating QR code: {e}")
        return None

def generate_textfree_shelter_qr_code(shelter_id, shelter_name):
    """
    Generate a text-free QR code for a shelter's donation page.
    
    Args:
        shelter_id (str): The Firestore document ID of the shelter
        shelter_name (str): Display name of the shelter
    """
    try:
        # Determine the base URL
        base_url = "https://sheltr-ai.web.app"  # Always use production for QR codes
        
        # Create donation URL
        donation_url = f"{base_url}/donate?shelter={shelter_id}"
        
        print(f"🏠 Generating text-free QR code for: {shelter_name}")
        print(f"   Shelter ID: {shelter_id}")
        print(f"   Donation URL: {donation_url}")

        # Create clean QR code (400x400 perfect square)
        qr_image = create_clean_qr_code(donation_url, size=400)
        
        if not qr_image:
            print(f"❌ Failed to create QR code image for {shelter_name}")
            return False

        # Convert to bytes
        img_buffer = BytesIO()
        qr_image.save(img_buffer, format='PNG', quality=95, optimize=True)
        img_bytes = img_buffer.getvalue()

        # Upload to Firebase Storage
        timestamp = int(os.path.getmtime(__file__) * 1000)  # Use script modification time
        filename = f"qr-clean-{shelter_id}-{timestamp}.png"
        storage_path = f"shelters/{shelter_id}/qr-codes/{filename}"

        blob = bucket.blob(storage_path)
        blob.upload_from_string(img_bytes, content_type='image/png')
        
        # Make public
        blob.make_public()
        public_url = blob.public_url

        # Update shelter's public config with the new clean QR code
        config_ref = db.collection('shelters').document(shelter_id).collection('public_config').document('settings')
        
        # Check if document exists
        config_doc = config_ref.get()
        if config_doc.exists:
            # Update existing document with clean QR code
            config_ref.update({
                'qrCodeClean': {
                    'url': public_url,
                    'storagePath': storage_path,
                    'donationUrl': donation_url,
                    'generatedAt': firestore.SERVER_TIMESTAMP,
                    'type': 'donation_clean',
                    'size': '400x400',
                    'format': 'PNG',
                    'hasText': False
                }
            })
            print(f"✅ Updated existing config with clean QR code")
        else:
            print(f"❌ No config document found for {shelter_id}")
            return False

        print(f"✅ Text-free QR code generated successfully!")
        print(f"   Storage Path: {storage_path}")
        print(f"   Public URL: {public_url}")
        print(f"   Size: 400x400 (perfect square)")
        print("-" * 50)
        
        return True

    except Exception as e:
        print(f"❌ Error generating clean QR code for {shelter_name}: {e}")
        return False

def generate_clean_qr_for_all_shelters():
    """Generate text-free QR codes for all shelters in the database."""
    
    print("🏠 Generating text-free QR codes for all shelters")
    print("=" * 60)
    
    try:
        shelters_ref = db.collection('shelters')
        docs = shelters_ref.stream()
        
        success_count = 0
        total_count = 0
        
        for doc in docs:
            total_count += 1
            shelter_data = doc.to_dict()
            shelter_id = doc.id
            shelter_name = shelter_data.get('name', f'Shelter {shelter_id}')
            
            if generate_textfree_shelter_qr_code(shelter_id, shelter_name):
                success_count += 1
        
        print(f"\n🎉 Text-free QR code generation completed!")
        print(f"   Successfully generated: {success_count}/{total_count} QR codes")
        print(f"   All codes are 400x400 perfect squares with no text")
        
        if success_count < total_count:
            print(f"   Failed: {total_count - success_count} shelters")
            
    except Exception as e:
        print(f"❌ Error generating clean QR codes for all shelters: {e}")

def generate_clean_qr_for_specific_shelter():
    """Generate a text-free QR code for a specific shelter."""
    
    print("🏠 Generate Text-Free QR Code for Specific Shelter")
    print("=" * 50)
    
    shelter_id = input("Enter shelter ID: ").strip()
    if not shelter_id:
        print("❌ Shelter ID is required.")
        return
    
    try:
        # Get shelter info from database
        shelter_ref = db.collection('shelters').document(shelter_id)
        shelter_doc = shelter_ref.get()
        
        if not shelter_doc.exists:
            print(f"❌ Shelter with ID '{shelter_id}' not found.")
            return
        
        shelter_data = shelter_doc.to_dict()
        shelter_name = shelter_data.get('name', f'Shelter {shelter_id}')
        
        if generate_textfree_shelter_qr_code(shelter_id, shelter_name):
            print("🎉 Text-free QR code generation completed!")
        else:
            print("💥 Failed to generate text-free QR code")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def list_shelters_with_qr_status():
    """List all shelters and their QR code status."""
    
    print("\n📋 Available Shelters and QR Code Status:")
    print("-" * 80)
    
    try:
        shelters_ref = db.collection('shelters')
        docs = shelters_ref.stream()
        
        for doc in docs:
            data = doc.to_dict()
            print(f"ID: {doc.id}")
            print(f"Name: {data.get('name', 'Unknown')}")
            print(f"Type: {data.get('type', 'Unknown')}")
            print(f"Status: {data.get('status', 'Unknown')}")
            
            # Check QR code status
            config_ref = db.collection('shelters').document(doc.id).collection('public_config').document('settings')
            config_doc = config_ref.get()
            if config_doc.exists:
                config_data = config_doc.to_dict()
                
                # Check original QR code with text
                if config_data.get('qrCode'):
                    print("QR Code (with text): ✅ Generated")
                else:
                    print("QR Code (with text): ❌ Not generated")
                
                # Check clean QR code without text
                if config_data.get('qrCodeClean'):
                    print("QR Code (clean): ✅ Generated")
                else:
                    print("QR Code (clean): ❌ Not generated")
            else:
                print("QR Code (with text): ❌ No config")
                print("QR Code (clean): ❌ No config")
            
            print("-" * 50)
            
    except Exception as e:
        print(f"❌ Error listing shelters: {e}")

def main():
    """Main interactive function."""
    print("📱 SHELTR Text-Free QR Code Generator")
    print("=" * 40)
    print("Generate clean, square QR codes without text labels")
    
    while True:
        print("\nOptions:")
        print("1. Generate text-free QR codes for ALL shelters")
        print("2. Generate text-free QR code for specific shelter")
        print("3. List all shelters with QR code status")
        print("4. Exit")
        
        choice = input("\nSelect an option (1-4): ").strip()
        
        if choice == '1':
            confirm = input("Generate text-free QR codes for ALL shelters? (y/N): ").strip().lower()
            if confirm == 'y':
                generate_clean_qr_for_all_shelters()
            else:
                print("Operation cancelled.")
                
        elif choice == '2':
            generate_clean_qr_for_specific_shelter()
                
        elif choice == '3':
            list_shelters_with_qr_status()
                
        elif choice == '4':
            print("👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid option. Please try again.")

if __name__ == "__main__":
    main()
