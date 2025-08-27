#!/usr/bin/env python3
"""
Verify actual user counts in the database to ensure chart accuracy
"""

import firebase_admin
from firebase_admin import credentials, firestore
from collections import defaultdict
import json

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

db = firestore.client()

def verify_user_counts():
    """Verify actual user counts by role in the database"""
    try:
        print("🔍 Verifying actual user counts in database...")
        
        # Get all users
        users_ref = db.collection('users')
        users = users_ref.stream()
        
        # Count users by role
        role_counts = defaultdict(int)
        user_details = []
        
        for user in users:
            user_data = user.to_dict()
            role = user_data.get('role', 'unknown')
            role_counts[role] += 1
            
            user_details.append({
                'id': user.id,
                'email': user_data.get('email', 'N/A'),
                'firstName': user_data.get('firstName', 'N/A'),
                'lastName': user_data.get('lastName', 'N/A'),
                'role': role,
                'status': user_data.get('status', 'N/A')
            })
        
        print("\n📊 USER COUNTS BY ROLE:")
        print("=" * 40)
        
        # Calculate categories for chart
        participants = role_counts['participant']
        donors = role_counts['donor'] 
        admins = (role_counts['admin'] + role_counts['shelteradmin'] + 
                 role_counts['super_admin'] + role_counts['superadmin'] + 
                 role_counts['platform_admin'])
        
        print(f"👥 Participants: {participants}")
        print(f"💝 Donors: {donors}")
        print(f"🛡️  Admins (Total): {admins}")
        print(f"   - admin: {role_counts['admin']}")
        print(f"   - shelteradmin: {role_counts['shelteradmin']}")
        print(f"   - super_admin: {role_counts['super_admin']}")
        print(f"   - superadmin: {role_counts['superadmin']}")
        print(f"   - platform_admin: {role_counts['platform_admin']}")
        
        total_users = sum(role_counts.values())
        print(f"\n🎯 TOTAL USERS: {total_users}")
        
        print(f"\n📋 CHART SHOULD SHOW:")
        print(f"   Final day participants: {participants}")
        print(f"   Final day donors: {donors}")
        print(f"   Final day admins: {admins}")
        
        # Show user details
        print(f"\n👤 USER DETAILS:")
        print("=" * 80)
        for user in sorted(user_details, key=lambda x: x['role']):
            print(f"{user['role']:15} | {user['email']:30} | {user['firstName']} {user['lastName']}")
        
        return {
            'participants': participants,
            'donors': donors,
            'admins': admins,
            'total': total_users,
            'role_breakdown': dict(role_counts),
            'users': user_details
        }
        
    except Exception as e:
        print(f"❌ Error verifying user counts: {e}")
        return None

if __name__ == "__main__":
    result = verify_user_counts()
    if result:
        print(f"\n✅ Verification complete! Chart should end with: {result['participants']} participants, {result['donors']} donors, {result['admins']} admins")
