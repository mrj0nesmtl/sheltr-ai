#!/usr/bin/env python3
"""
Shelter QR Code Generator Script
Generates QR codes for shelter donation pages and stores them in Firebase Storage.
"""

import os
import sys
import qrcode
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, storage
from PIL import Image, ImageDraw, ImageFont
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

def create_branded_qr_code(url, shelter_name, output_path=None, size=400, include_text=True):
    """
    Create a branded QR code with SHELTR styling.
    
    Args:
        url (str): The URL to encode
        shelter_name (str): Name of the shelter for the label
        output_path (str): Optional path to save the image
        size (int): Size of the QR code
    """
    try:
        # Create QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        # Create QR code image with custom colors
        qr_img = qr.make_image(
            fill_color="#1f2937",  # Dark gray
            back_color="#ffffff"   # White
        )

        # Resize to desired size
        qr_img = qr_img.resize((size, size), Image.Resampling.LANCZOS)

        if include_text:
            # Create a larger canvas for branding
            canvas_height = size + 120  # Extra space for text
            canvas = Image.new('RGB', (size + 40, canvas_height), '#ffffff')
            
            # Paste QR code
            canvas.paste(qr_img, (20, 20))

            # Add text
            draw = ImageDraw.Draw(canvas)
            
            try:
                # Try to use a nice font
                title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
                subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
                footer_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
            except:
                # Fallback to default font
                title_font = ImageFont.load_default()
                subtitle_font = ImageFont.load_default()
                footer_font = ImageFont.load_default()

            # Draw shelter name
            text = f"Donate to {shelter_name}"
            text_bbox = draw.textbbox((0, 0), text, font=title_font)
            text_width = text_bbox[2] - text_bbox[0]
            text_x = (canvas.width - text_width) // 2
            draw.text((text_x, size + 30), text, fill="#1f2937", font=title_font)

            # Draw subtitle
            subtitle = "Scan to donate securely"
            subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
            subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
            subtitle_x = (canvas.width - subtitle_width) // 2
            draw.text((subtitle_x, size + 60), subtitle, fill="#6b7280", font=subtitle_font)

            # Draw SHELTR branding
            footer = "Powered by SHELTR"
            footer_bbox = draw.textbbox((0, 0), footer, font=footer_font)
            footer_width = footer_bbox[2] - footer_bbox[0]
            footer_x = (canvas.width - footer_width) // 2
            draw.text((footer_x, size + 85), footer, fill="#3b82f6", font=footer_font)
        else:
            # Just use the QR code without extra text
            canvas = qr_img

        # Save if path provided
        if output_path:
            canvas.save(output_path, 'PNG', quality=95, optimize=True)
            print(f"✅ Branded QR code saved: {output_path}")

        return canvas

    except Exception as e:
        print(f"❌ Error creating branded QR code: {e}")
        return None

def generate_shelter_qr_code(shelter_id, shelter_name, shelter_slug=None):
    """
    Generate a QR code for a shelter's donation page.
    
    Args:
        shelter_id (str): The Firestore document ID of the shelter
        shelter_name (str): Display name of the shelter
        shelter_slug (str): Optional URL slug for the shelter
    """
    try:
        # Determine the base URL
        base_url = "https://sheltr-ai.web.app"  # Always use production for QR codes
        
        # Create donation URL
        donation_url = f"{base_url}/donate?shelter={shelter_id}"
        
        print(f"🏠 Generating QR code for: {shelter_name}")
        print(f"   Shelter ID: {shelter_id}")
        print(f"   Donation URL: {donation_url}")

        # Create branded QR code
        qr_image = create_branded_qr_code(donation_url, shelter_name, size=400)
        
        if not qr_image:
            print(f"❌ Failed to create QR code image for {shelter_name}")
            return False

        # Convert to bytes
        img_buffer = BytesIO()
        qr_image.save(img_buffer, format='PNG', quality=95, optimize=True)
        img_bytes = img_buffer.getvalue()

        # Upload to Firebase Storage
        timestamp = int(os.path.getmtime(__file__) * 1000)  # Use script modification time
        filename = f"qr-donation-{shelter_id}-{timestamp}.png"
        storage_path = f"shelters/{shelter_id}/qr-codes/{filename}"

        blob = bucket.blob(storage_path)
        blob.upload_from_string(img_bytes, content_type='image/png')
        
        # Make public
        blob.make_public()
        public_url = blob.public_url

        # Update shelter's public config
        config_ref = db.collection('shelters').document(shelter_id).collection('public_config').document('settings')
        
        # Check if document exists
        config_doc = config_ref.get()
        if config_doc.exists:
            # Update existing document
            config_ref.update({
                'qrCode': {
                    'url': public_url,
                    'storagePath': storage_path,
                    'donationUrl': donation_url,
                    'generatedAt': firestore.SERVER_TIMESTAMP,
                    'type': 'donation',
                    'size': '400x520',  # Including branding
                    'format': 'PNG'
                }
            })
        else:
            # Create new document with QR code
            config_ref.set({
                'qrCode': {
                    'url': public_url,
                    'storagePath': storage_path,
                    'donationUrl': donation_url,
                    'generatedAt': firestore.SERVER_TIMESTAMP,
                    'type': 'donation',
                    'size': '400x520',
                    'format': 'PNG'
                },
                'slug': shelter_slug or shelter_name.lower().replace(' ', '-'),
                'publicUrl': f"/{shelter_slug or shelter_name.lower().replace(' ', '-')}"
            })

        print(f"✅ QR code generated successfully!")
        print(f"   Storage Path: {storage_path}")
        print(f"   Public URL: {public_url}")
        print(f"   Donation URL: {donation_url}")
        print("-" * 50)
        
        return True

    except Exception as e:
        print(f"❌ Error generating QR code for {shelter_name}: {e}")
        return False

def generate_qr_for_old_brewery_mission():
    """Generate QR code specifically for Old Brewery Mission (our test shelter)."""
    
    print("🍺 Generating QR code for Old Brewery Mission (Test Shelter)")
    print("=" * 60)
    
    # Find Old Brewery Mission in the database
    shelters_ref = db.collection('shelters')
    query = shelters_ref.where('name', '==', 'Old Brewery Mission').limit(1)
    docs = list(query.stream())
    
    if not docs:
        # Try alternative names
        alternative_queries = [
            shelters_ref.where('name', '==', 'La Maison Benoît Labre').limit(1),
            shelters_ref.where('name', '==', 'Brewery Mission').limit(1)
        ]
        
        for alt_query in alternative_queries:
            docs = list(alt_query.stream())
            if docs:
                break
    
    if docs:
        doc = docs[0]
        shelter_data = doc.to_dict()
        shelter_id = doc.id
        shelter_name = shelter_data.get('name', 'Old Brewery Mission')
        
        print(f"✅ Found shelter: {shelter_name} (ID: {shelter_id})")
        
        success = generate_shelter_qr_code(
            shelter_id=shelter_id,
            shelter_name=shelter_name,
            shelter_slug='old-brewery-mission'
        )
        
        if success:
            print("🎉 Old Brewery Mission QR code generation completed!")
        else:
            print("💥 Failed to generate QR code for Old Brewery Mission")
    else:
        print("❌ Old Brewery Mission not found in database")
        print("\nAvailable shelters:")
        all_shelters = shelters_ref.stream()
        for shelter in all_shelters:
            data = shelter.to_dict()
            print(f"   - {data.get('name', 'Unknown')} (ID: {shelter.id})")

def generate_qr_for_all_shelters():
    """Generate QR codes for all shelters in the database."""
    
    print("🏠 Generating QR codes for all shelters")
    print("=" * 50)
    
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
            
            # Generate slug from name
            shelter_slug = shelter_name.lower().replace(' ', '-').replace("'", "").replace('é', 'e')
            
            if generate_shelter_qr_code(shelter_id, shelter_name, shelter_slug):
                success_count += 1
        
        print(f"\n🎉 QR code generation completed!")
        print(f"   Successfully generated: {success_count}/{total_count} QR codes")
        
        if success_count < total_count:
            print(f"   Failed: {total_count - success_count} shelters")
            
    except Exception as e:
        print(f"❌ Error generating QR codes for all shelters: {e}")

def main():
    """Main interactive function."""
    print("📱 SHELTR QR Code Generator")
    print("=" * 30)
    
    while True:
        print("\nOptions:")
        print("1. Generate QR code for Old Brewery Mission (test)")
        print("2. Generate QR codes for all shelters")
        print("3. Generate QR code for specific shelter")
        print("4. List all shelters")
        print("5. Exit")
        
        choice = input("\nSelect an option (1-5): ").strip()
        
        if choice == '1':
            generate_qr_for_old_brewery_mission()
            
        elif choice == '2':
            confirm = input("Generate QR codes for ALL shelters? (y/N): ").strip().lower()
            if confirm == 'y':
                generate_qr_for_all_shelters()
            else:
                print("Operation cancelled.")
                
        elif choice == '3':
            shelter_id = input("Enter shelter ID: ").strip()
            shelter_name = input("Enter shelter name: ").strip()
            shelter_slug = input("Enter shelter slug (optional): ").strip() or None
            
            if shelter_id and shelter_name:
                generate_shelter_qr_code(shelter_id, shelter_name, shelter_slug)
            else:
                print("❌ Shelter ID and name are required.")
                
        elif choice == '4':
            print("\n📋 Available Shelters:")
            print("-" * 50)
            try:
                shelters_ref = db.collection('shelters')
                docs = shelters_ref.stream()
                
                for doc in docs:
                    data = doc.to_dict()
                    print(f"ID: {doc.id}")
                    print(f"Name: {data.get('name', 'Unknown')}")
                    print(f"Type: {data.get('type', 'Unknown')}")
                    print(f"Status: {data.get('status', 'Unknown')}")
                    
                    # Check if QR code exists
                    config_ref = db.collection('shelters').document(doc.id).collection('public_config').document('settings')
                    config_doc = config_ref.get()
                    if config_doc.exists and config_doc.to_dict().get('qrCode'):
                        print("QR Code: ✅ Generated")
                    else:
                        print("QR Code: ❌ Not generated")
                    print("-" * 30)
                    
            except Exception as e:
                print(f"❌ Error listing shelters: {e}")
                
        elif choice == '5':
            print("👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid option. Please try again.")

if __name__ == "__main__":
    main()
