#!/usr/bin/env python3
"""
Create Gunnar Blaze with Password
Creates Gunnar's Firebase Auth account with password and updates Firestore
"""

import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime
import secrets
import string

# Initialize Firebase Admin SDK once at module level
try:
    app = firebase_admin.get_app()
    print('✅ Using existing Firebase app')
except ValueError:
    cred = credentials.ApplicationDefault()
    app = firebase_admin.initialize_app(cred, {'projectId': 'sheltr-ai'})
    print('✅ Initialized Firebase Admin SDK')

def get_firestore():
    return firestore.client()

def generate_temp_password():
    """Generate a secure temporary password"""
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(8)) + 'Temp!'

def create_gunnar_with_password():
    """Create Gunnar's Firebase Auth account and link to existing Firestore document"""
    
    print('🚀 CREATING GUNNAR BLAZE FIREBASE AUTH WITH PASSWORD')
    print('=' * 55)
    
    email = 'gunnar.blaze@gmail.com'
    
    try:
        # Check if Firestore document exists
        db = get_firestore()
        
        # Find Gunnar's Firestore document
        gunnar_query = db.collection('users').where('email', '==', email).limit(1)
        docs = list(gunnar_query.stream())
        
        if not docs:
            print(f'   ❌ Gunnar\'s Firestore document not found')
            return None
            
        gunnar_doc = docs[0]
        gunnar_data = gunnar_doc.to_dict()
        existing_uid = gunnar_doc.id
        
        print(f'   ✅ Found Firestore document: {existing_uid}')
        print(f'   👤 Name: {gunnar_data.get("firstName")} {gunnar_data.get("lastName")}')
        
        # Generate temporary password
        temp_password = generate_temp_password()
        
        # Create Firebase Auth user with the same UID as Firestore document
        try:
            # Try to create with specific UID to match Firestore
            user_record = auth.create_user(
                uid=existing_uid,
                email=email,
                password=temp_password,
                display_name=f'{gunnar_data.get("firstName")} {gunnar_data.get("lastName")}',
                email_verified=True
            )
            print(f'   ✅ Created Firebase Auth user with matching UID: {user_record.uid}')
            
        except Exception as e:
            # If UID already exists, create with new UID and update Firestore
            print(f'   ⚠️  Could not use existing UID ({e}), creating new one...')
            user_record = auth.create_user(
                email=email,
                password=temp_password,
                display_name=f'{gunnar_data.get("firstName")} {gunnar_data.get("lastName")}',
                email_verified=True
            )
            print(f'   ✅ Created Firebase Auth user with new UID: {user_record.uid}')
            
            # Update Firestore document with new UID
            new_doc_ref = db.collection('users').document(user_record.uid)
            gunnar_data['uid'] = user_record.uid
            new_doc_ref.set(gunnar_data)
            
            # Delete old document
            gunnar_doc.reference.delete()
            print(f'   ✅ Updated Firestore document with new UID')
            existing_uid = user_record.uid
        
        print(f'   🔑 Temporary password: {temp_password}')
        
        # Update Firestore document to mark password as set
        user_doc_ref = db.collection('users').document(existing_uid)
        user_doc_ref.update({
            'passwordSet': True,
            'requirePasswordChange': True,
            'emailVerified': True,
            'updated_at': datetime.now().isoformat()
        })
        print(f'   ✅ Updated Firestore document with password status')
        
        # Set custom claims
        custom_claims = {
            'role': 'platform_admin',
            'tenant_id': 'platform',
            'permissions': gunnar_data['adminProfile']['permissions']
        }
        auth.set_custom_user_claims(existing_uid, custom_claims)
        print(f'   ✅ Set custom claims')
        
        # Verification
        print(f'\n🔍 VERIFICATION:')
        updated_user = auth.get_user(existing_uid)
        providers = [p.provider_id for p in updated_user.provider_data] if updated_user.provider_data else ['password']
        
        print(f'   👤 {email}')
        print(f'   🆔 UID: {updated_user.uid}')
        print(f'   📧 Email Verified: {updated_user.email_verified}')
        print(f'   🔌 Providers: {providers}')
        print(f'   ✅ Account Status: {"Active" if not updated_user.disabled else "Disabled"}')
        
        return {
            'uid': existing_uid,
            'email': email,
            'name': f'{gunnar_data.get("firstName")} {gunnar_data.get("lastName")}',
            'temp_password': temp_password,
            'success': True
        }
        
    except Exception as e:
        print(f'   ❌ Error creating Gunnar\'s account: {e}')
        return None

if __name__ == '__main__':
    result = create_gunnar_with_password()
    
    if result:
        print(f'\n✨ SUCCESS! Gunnar now has password authentication.')
        print(f'\n🔑 GUNNAR\'S LOGIN CREDENTIALS:')
        print(f'   📧 Email: {result["email"]}')
        print(f'   🔑 Password: {result["temp_password"]}')
        print(f'   🆔 UID: {result["uid"]}')
        print(f'   🌐 Login at: http://localhost:3000/auth/login')
    else:
        print(f'\n❌ Failed to create Gunnar\'s account.')
