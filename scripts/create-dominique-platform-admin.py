#!/usr/bin/env python3
"""
Create Dominique Legault as Platform Administrator
Creates platform admin for Arcana partner and blockchain expert
"""

import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime
import uuid

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

def create_platform_admin(email: str, first_name: str, last_name: str):
    """Create a platform administrator user"""
    
    print(f'\n👤 Creating Platform Admin: {first_name} {last_name}')
    print(f'   Email: {email}')
    
    try:
        # Check if user already exists in Firebase Auth
        try:
            existing_user = auth.get_user_by_email(email)
            print(f'   ✅ Firebase Auth user exists: {existing_user.uid}')
            user_uid = existing_user.uid
            
            # Generate new password reset link even if user exists
            reset_link = auth.generate_password_reset_link(email)
            print(f'   📧 NEW Password reset link: {reset_link}')
            
        except auth.UserNotFoundError:
            # Create Firebase Auth user (they'll need to set password via email)
            user_record = auth.create_user(
                email=email,
                display_name=f'{first_name} {last_name}',
                email_verified=False  # They'll verify via email
            )
            print(f'   ✅ Created Firebase Auth user: {user_record.uid}')
            user_uid = user_record.uid
            
            # Send password reset email so they can set their password
            reset_link = auth.generate_password_reset_link(email)
            print(f'   📧 Password reset link: {reset_link}')
        
        # Create Firestore user document
        db = get_firestore()
        user_doc_data = {
            'uid': user_uid,
            'email': email,
            'firstName': first_name,
            'lastName': last_name,
            'role': 'platform_admin',
            'status': 'active',
            'emailVerified': False,
            'profileComplete': True,
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat(),
            'lastLoginAt': None,
            
            # Platform admin specific fields
            'adminProfile': {
                'title': 'Founding Partner & Blockchain Expert',
                'department': 'Platform Administration',
                'company': 'Arcana Concept',
                'specialization': 'Blockchain & Strategic Development',
                'permissions': [
                    'manage_shelters',
                    'manage_users', 
                    'view_platform_metrics',
                    'manage_applications',
                    'access_admin_dashboard',
                    'blockchain_oversight',
                    'strategic_partnerships'
                ],
                'accessLevel': 'platform',
                'canManageRoles': ['admin', 'participant', 'donor'],
                'restrictedRoles': ['super_admin'],  # Cannot manage super admins
                'expertise': ['Blockchain', 'Smart Contracts', 'Platform Architecture', 'Strategic Partnerships']
            },
            
            # Contact info
            'phone': '',
            'address': {
                'street': '',
                'city': 'Montreal',
                'province': 'Quebec',
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
            
            # Partner-specific metadata
            'partnerInfo': {
                'company': 'Arcana Concept',
                'role': 'Partner',
                'expertise': 'Blockchain Technology',
                'joinedAt': datetime.now().isoformat(),
                'partnerType': 'founding'
            }
        }
        
        # Store user document
        db.collection('users').document(user_uid).set(user_doc_data)
        print(f'   ✅ Created Firestore user document')
        
        # Set custom claims
        custom_claims = {
            'role': 'platform_admin',
            'tenant_id': 'platform',
            'permissions': user_doc_data['adminProfile']['permissions'],
            'partner': True,
            'blockchain_expert': True
        }
        auth.set_custom_user_claims(user_uid, custom_claims)
        print(f'   ✅ Set custom claims: {custom_claims}')
        
        return user_uid, reset_link
        
    except Exception as e:
        print(f'   ❌ Error creating platform admin: {e}')
        raise

def create_dominique_platform_admin():
    """Create Dominique Legault as platform administrator"""
    
    print('🚀 CREATING DOMINIQUE LEGAULT AS PLATFORM ADMINISTRATOR')
    print('=' * 60)
    print('🏢 Company: Arcana Concept')
    print('⚡ Expertise: Blockchain & Strategic Development')
    
    admin_data = {
        'email': 'deefactorial@gmail.com',
        'first_name': 'Dominique',
        'last_name': 'Legault'
    }
    
    try:
        user_uid, reset_link = create_platform_admin(
            admin_data['email'],
            admin_data['first_name'], 
            admin_data['last_name']
        )
        
        print(f'\n🎯 SUCCESS!')
        print(f'   👤 Name: {admin_data["first_name"]} {admin_data["last_name"]}')
        print(f'   📧 Email: {admin_data["email"]}')
        print(f'   🆔 UID: {user_uid}')
        print(f'   🏢 Company: Arcana Concept')
        print(f'   ⚡ Role: Blockchain Expert & Platform Administrator')
        print(f'   🔗 Reset Link: {reset_link}')
        
        # Verify creation by checking all platform admins
        print(f'\n🔍 VERIFICATION - All Platform Admins:')
        db = get_firestore()
        
        platform_admin_query = db.collection('users').where('role', '==', 'platform_admin')
        platform_admins_docs = list(platform_admin_query.stream())
        
        print(f'   📊 Total Platform Admins: {len(platform_admins_docs)}')
        
        for doc in platform_admins_docs:
            data = doc.to_dict()
            name = f"{data.get('firstName', 'Unknown')} {data.get('lastName', 'Unknown')}"
            email = data.get('email', 'Unknown')
            status = data.get('status', 'Unknown')
            company = data.get('partnerInfo', {}).get('company', data.get('adminProfile', {}).get('company', 'N/A'))
            created = data.get('createdAt', 'Unknown')
            print(f'   👤 {name} ({email}) - {company} - Status: {status} - Created: {created[:10] if created != "Unknown" else "Unknown"}')
        
        print(f'\n📧 EMAIL INSTRUCTIONS FOR DOMINIQUE:')
        print(f'   1. Check email: {admin_data["email"]}')
        print(f'   2. Look for password reset email from Firebase')
        print(f'   3. Click the link to set your password')
        print(f'   4. Log in at: https://sheltr-ai.web.app/login')
        print(f'   5. You should see the Platform Admin dashboard')
        print(f'   6. Navigate to "My Giving" to see personal donation tracking')
        
        print(f'\n🧪 TESTING CHECKLIST:')
        print(f'   ✅ Email received and password set')
        print(f'   ✅ Login successful')
        print(f'   ✅ Platform Admin dashboard displays')
        print(f'   ✅ User Management tab shows Platform Administrators')
        print(f'   ✅ "My Giving" sidebar menu accessible')
        print(f'   ✅ Contact Inquiries management available')
        print(f'   ✅ All navigation items accessible')
        
        print(f'\n🔗 PLATFORM ADMIN FEATURES:')
        print(f'   • Shelter Network Management')
        print(f'   • User Management (except Super Admins)')
        print(f'   • Platform Analytics & Metrics')
        print(f'   • Contact Inquiries Management')
        print(f'   • Knowledge Base Management')
        print(f'   • Blog Management')
        print(f'   • Personal Giving Dashboard')
        print(f'   • Financial Oversight')
        
        return {
            'uid': user_uid,
            'name': f"{admin_data['first_name']} {admin_data['last_name']}",
            'email': admin_data['email'],
            'reset_link': reset_link,
            'company': 'Arcana Concept',
            'expertise': 'Blockchain & Strategic Development'
        }
        
    except Exception as e:
        print(f'   ❌ Failed to create Dominique Legault: {e}')
        raise

if __name__ == '__main__':
    result = create_dominique_platform_admin()
    print(f'\n✨ COMPLETED! Dominique Legault is now a Platform Administrator.')
    print(f'🤝 Arcana partnership strengthened with blockchain expertise!')
