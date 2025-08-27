#!/usr/bin/env python3
"""
Create Platform Administrators with Passwords
Creates Doug, Alexander, and Gunnar with temporary passwords for immediate login
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
    # 8 characters: mix of uppercase, lowercase, numbers
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(8)) + 'Temp!'

def create_platform_admin_with_password(email: str, first_name: str, last_name: str):
    """Create a platform administrator user with a password"""
    
    print(f'\n👤 Creating Platform Admin: {first_name} {last_name}')
    print(f'   Email: {email}')
    
    try:
        # Generate temporary password
        temp_password = generate_temp_password()
        
        # Check if user already exists and delete if so
        try:
            existing_user = auth.get_user_by_email(email)
            print(f'   🗑️  Deleting existing user: {existing_user.uid}')
            auth.delete_user(existing_user.uid)
            print(f'   ✅ Deleted existing Firebase Auth user')
        except auth.UserNotFoundError:
            print(f'   ℹ️  No existing user found (good)')
        
        # Create Firebase Auth user with password
        user_record = auth.create_user(
            email=email,
            password=temp_password,
            display_name=f'{first_name} {last_name}',
            email_verified=True  # Set as verified to avoid email verification step
        )
        print(f'   ✅ Created Firebase Auth user: {user_record.uid}')
        print(f'   🔑 Temporary password: {temp_password}')
        user_uid = user_record.uid
        
        # Create Firestore user document
        db = get_firestore()
        user_doc_data = {
            'uid': user_uid,
            'email': email,
            'firstName': first_name,
            'lastName': last_name,
            'role': 'platform_admin',
            'status': 'active',
            'emailVerified': True,
            'profileComplete': True,
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat(),
            'lastLoginAt': None,
            
            # Platform admin specific fields
            'adminProfile': {
                'title': 'Founding Partner',
                'department': 'Platform Administration',
                'permissions': [
                    'manage_shelters',
                    'manage_users', 
                    'view_platform_metrics',
                    'manage_applications',
                    'access_admin_dashboard'
                ],
                'accessLevel': 'platform',
                'canManageRoles': ['admin', 'participant', 'donor'],
                'restrictedRoles': ['super_admin']  # Cannot manage super admins
            },
            
            # Contact info
            'phone': '',
            'address': {
                'street': '',
                'city': '',
                'province': '',
                'postalCode': '',
                'country': 'Canada'
            },
            
            # Platform connection
            'tenant_id': 'platform',  # Special tenant for platform admins
            'shelter_id': None,  # Not tied to specific shelter
            
            # Metadata
            'onboardingComplete': True,
            'termsAccepted': True,
            'privacyPolicyAccepted': True,
            'marketingOptIn': False,
            
            # Password info
            'passwordSet': True,
            'requirePasswordChange': True  # Force them to change on first login
        }
        
        # Store user document
        db.collection('users').document(user_uid).set(user_doc_data)
        print(f'   ✅ Created Firestore user document')
        
        # Set custom claims
        custom_claims = {
            'role': 'platform_admin',
            'tenant_id': 'platform',
            'permissions': user_doc_data['adminProfile']['permissions']
        }
        auth.set_custom_user_claims(user_uid, custom_claims)
        print(f'   ✅ Set custom claims: {custom_claims}')
        
        return {
            'uid': user_uid,
            'email': email,
            'name': f'{first_name} {last_name}',
            'temp_password': temp_password
        }
        
    except Exception as e:
        print(f'   ❌ Error creating platform admin: {e}')
        raise

def create_all_platform_admins_with_passwords():
    """Create all platform administrators with passwords"""
    
    print('🚀 CREATING PLATFORM ADMINISTRATORS WITH PASSWORDS')
    print('=' * 60)
    print('⚠️  IMPORTANT: Delete existing users from Firebase Console first!')
    print('=' * 60)
    
    platform_admins = [
        {
            'email': 'doug.kukura@gmail.com',
            'first_name': 'Doug',
            'last_name': 'Kukura'
        },
        {
            'email': 'alexanderkline13@gmail.com', 
            'first_name': 'Alexander',
            'last_name': 'Kline'
        },
        {
            'email': 'gunnar.blaze@gmail.com',
            'first_name': 'Gunnar',
            'last_name': 'Blaze'
        }
    ]
    
    created_admins = []
    
    for admin_data in platform_admins:
        try:
            result = create_platform_admin_with_password(
                admin_data['email'],
                admin_data['first_name'], 
                admin_data['last_name']
            )
            created_admins.append(result)
        except Exception as e:
            print(f'   ❌ Failed to create {admin_data["first_name"]} {admin_data["last_name"]}: {e}')
    
    # Verify creation
    print(f'\n🔍 VERIFICATION:')
    db = get_firestore()
    
    platform_admin_query = db.collection('users').where('role', '==', 'platform_admin')
    platform_admins_docs = list(platform_admin_query.stream())
    
    print(f'   📊 Total Platform Admins: {len(platform_admins_docs)}')
    
    for doc in platform_admins_docs:
        data = doc.to_dict()
        name = f"{data.get('firstName', 'Unknown')} {data.get('lastName', 'Unknown')}"
        email = data.get('email', 'Unknown')
        status = data.get('status', 'Unknown')
        print(f'   👤 {name} ({email}) - Status: {status}')
    
    # Login instructions
    print(f'\n🔑 LOGIN CREDENTIALS:')
    print(f'   🌐 Login URL: http://localhost:3000/auth/login')
    print(f'   📝 Use these temporary passwords:')
    for admin in created_admins:
        print(f'   👤 {admin["name"]}:')
        print(f'      📧 Email: {admin["email"]}')
        print(f'      🔑 Password: {admin["temp_password"]}')
        print(f'      🆔 UID: {admin["uid"]}')
        print()
    
    print(f'⚠️  SECURITY NOTES:')
    print(f'   • These are TEMPORARY passwords')
    print(f'   • Users should change them immediately after first login')
    print(f'   • All accounts are set to requirePasswordChange=true')
    
    print(f'\n🧪 TESTING CHECKLIST:')
    print(f'   ✅ Login with temporary credentials')
    print(f'   ✅ Platform Admin dashboard displays')
    print(f'   ✅ Change password on first login')
    print(f'   ✅ User Management tab shows Platform Administrators')
    print(f'   ✅ All navigation items accessible')
    
    return created_admins

if __name__ == '__main__':
    print('⚠️  PREREQUISITE: Delete the 3 existing platform admin users from Firebase Console first!')
    print('   Then run this script to recreate them with passwords.')
    input('\nPress Enter when you have deleted the existing users from Firebase Console...')
    
    result = create_all_platform_admins_with_passwords()
    print(f'\n✨ COMPLETED! {len(result)} Platform Administrators created with passwords.')
