#!/usr/bin/env python3
"""
Add Passwords to Existing Platform Administrators
Adds password authentication to existing Doug, Alexander, and Gunnar accounts
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
    # 8 characters: mix of uppercase, lowercase, numbers + "Temp!"
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(8)) + 'Temp!'

def add_password_to_existing_user(email: str):
    """Add password authentication to an existing Firebase user"""
    
    print(f'\n🔑 Adding password to: {email}')
    
    try:
        # Get existing user
        try:
            existing_user = auth.get_user_by_email(email)
            print(f'   ✅ Found existing user: {existing_user.uid}')
        except auth.UserNotFoundError:
            print(f'   ❌ User not found: {email}')
            return None
        
        # Generate temporary password
        temp_password = generate_temp_password()
        
        # Update user to add password authentication
        updated_user = auth.update_user(
            existing_user.uid,
            password=temp_password,
            email_verified=True,  # Mark as verified
            disabled=False  # Ensure account is enabled
        )
        
        print(f'   ✅ Password added successfully')
        print(f'   🔑 Temporary password: {temp_password}')
        
        # Update Firestore document to reflect password is set
        db = get_firestore()
        user_doc_ref = db.collection('users').document(existing_user.uid)
        
        # Check if Firestore document exists
        user_doc = user_doc_ref.get()
        if user_doc.exists:
            user_doc_ref.update({
                'passwordSet': True,
                'requirePasswordChange': True,  # Force password change on first login
                'emailVerified': True,
                'updated_at': datetime.now().isoformat()
            })
            print(f'   ✅ Updated Firestore document')
            
            # Get user details for return
            user_data = user_doc.to_dict()
            name = f"{user_data.get('firstName', 'Unknown')} {user_data.get('lastName', 'Unknown')}"
        else:
            print(f'   ⚠️  Firestore document not found, but password still added')
            name = email.split('@')[0]
        
        return {
            'uid': existing_user.uid,
            'email': email,
            'name': name,
            'temp_password': temp_password,
            'success': True
        }
        
    except Exception as e:
        print(f'   ❌ Error adding password: {e}')
        return {
            'email': email,
            'success': False,
            'error': str(e)
        }

def add_passwords_to_all_platform_admins():
    """Add passwords to all existing platform administrators"""
    
    print('🚀 ADDING PASSWORDS TO EXISTING PLATFORM ADMINISTRATORS')
    print('=' * 65)
    
    platform_admin_emails = [
        'doug.kukura@gmail.com',
        'alexanderkline13@gmail.com',
        'gunnar.blaze@gmail.com'
    ]
    
    results = []
    successful_updates = []
    
    for email in platform_admin_emails:
        result = add_password_to_existing_user(email)
        results.append(result)
        if result and result.get('success'):
            successful_updates.append(result)
    
    # Verify by checking Firebase Auth
    print(f'\n🔍 VERIFICATION - Firebase Auth Status:')
    for email in platform_admin_emails:
        try:
            user = auth.get_user_by_email(email)
            providers = [p.provider_id for p in user.provider_data]
            print(f'   👤 {email}')
            print(f'      🆔 UID: {user.uid}')
            print(f'      📧 Email Verified: {user.email_verified}')
            print(f'      🔌 Providers: {providers if providers else ["password"]}')
            print(f'      ✅ Account Status: {"Active" if not user.disabled else "Disabled"}')
        except auth.UserNotFoundError:
            print(f'   ❌ {email} - User not found')
        print()
    
    # Verify Firestore documents
    print(f'🔍 VERIFICATION - Firestore Documents:')
    db = get_firestore()
    platform_admin_query = db.collection('users').where('role', '==', 'platform_admin')
    platform_admins_docs = list(platform_admin_query.stream())
    
    print(f'   📊 Total Platform Admins in Firestore: {len(platform_admins_docs)}')
    
    for doc in platform_admins_docs:
        data = doc.to_dict()
        name = f"{data.get('firstName', 'Unknown')} {data.get('lastName', 'Unknown')}"
        email = data.get('email', 'Unknown')
        status = data.get('status', 'Unknown')
        password_set = data.get('passwordSet', False)
        print(f'   👤 {name} ({email}) - Status: {status} - Password Set: {password_set}')
    
    # Login instructions
    print(f'\n🔑 LOGIN CREDENTIALS:')
    print(f'   🌐 Login URL: http://localhost:3000/auth/login')
    print(f'   📝 Temporary passwords (CHANGE IMMEDIATELY):')
    
    for result in successful_updates:
        print(f'   👤 {result["name"]}:')
        print(f'      📧 Email: {result["email"]}')
        print(f'      🔑 Password: {result["temp_password"]}')
        print(f'      🆔 UID: {result["uid"]}')
        print()
    
    print(f'⚠️  SECURITY REMINDERS:')
    print(f'   • These are TEMPORARY passwords - change them immediately!')
    print(f'   • All accounts are set to requirePasswordChange=true')
    print(f'   • Passwords should be strong and unique')
    print(f'   • Consider enabling 2FA after login')
    
    print(f'\n🧪 TESTING CHECKLIST:')
    print(f'   ✅ Login with temporary credentials')
    print(f'   ✅ Platform Admin dashboard displays correctly')
    print(f'   ✅ Change password immediately after first login')
    print(f'   ✅ Verify all 3 Platform Admins show in User Management')
    print(f'   ✅ Test role simulation feature')
    print(f'   ✅ Confirm navigation and permissions work')
    
    # Summary
    print(f'\n📊 SUMMARY:')
    print(f'   ✅ Successfully updated: {len(successful_updates)} accounts')
    print(f'   ❌ Failed updates: {len(results) - len(successful_updates)} accounts')
    
    if len(successful_updates) == len(platform_admin_emails):
        print(f'   🎉 ALL PLATFORM ADMINISTRATORS NOW HAVE PASSWORD ACCESS!')
    
    return successful_updates

if __name__ == '__main__':
    result = add_passwords_to_all_platform_admins()
    print(f'\n✨ COMPLETED! {len(result)} Platform Administrator accounts now have password authentication.')
