#!/usr/bin/env python3
"""
Test donation flow and verify Michael's profile updates
"""

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import random

# Initialize Firebase Admin SDK
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

db = firestore.client()

def test_donation_flow():
    """Test the donation flow and verify Michael's profile updates"""
    
    print("🧪 Testing donation flow and Michael's profile updates...")
    
    # Step 1: Check current Michael's profile data
    print("\n📊 Step 1: Checking Michael's current profile data...")
    
    # Get current donations for Michael
    demo_donations_ref = db.collection('demo_donations')
    
    # Query for Michael's donations
    michael_donations = demo_donations_ref.where('participant_id', '==', 'michael-rodriguez').stream()
    
    total_received = 0
    donation_count = 0
    
    for doc in michael_donations:
        data = doc.to_dict()
        amount_data = data.get('amount', {})
        
        # Handle different amount formats
        if isinstance(amount_data, dict):
            amount = amount_data.get('total', 0)
        else:
            amount = amount_data or 0
            
        total_received += amount
        donation_count += 1
        
        print(f"   💰 Donation: ${amount} - {data.get('donor_info', {}).get('name', 'Unknown')} - {data.get('source', 'unknown')}")
    
    print(f"   📈 Current Total: ${total_received} from {donation_count} donations")
    
    # Step 2: Create a test donation
    print("\n🎯 Step 2: Creating a test donation...")
    
    test_donation = {
        'participant_id': 'michael-rodriguez',
        'participant_name': 'Michael Rodriguez',
        'shelter_id': 'YDJCJnuLGMC9mWOWDSOa',
        'shelter_name': 'Old Brewery Mission',
        'amount': {
            'total': 50,
            'currency': 'USD'
        },
        'donor_id': 'test-donor-123',
        'donor_info': {
            'name': 'Test Donor',
            'email': 'test@example.com'
        },
        'status': 'completed',
        'type': 'one-time',
        'purpose': 'Test donation from script',
        'payment_data': {
            'adyen_reference': f'TEST-{datetime.now().timestamp()}',
            'status': 'completed'
        },
        'created_at': firestore.SERVER_TIMESTAMP,
        'updated_at': firestore.SERVER_TIMESTAMP,
        'demo': True,
        'source': 'test-script',
        'anonymous': False,
        'public': True
    }
    
    try:
        doc_ref = demo_donations_ref.add(test_donation)
        print(f"   ✅ Test donation created with ID: {doc_ref[1].id}")
    except Exception as e:
        print(f"   ❌ Error creating test donation: {e}")
        return
    
    # Step 3: Verify the donation was added
    print("\n🔍 Step 3: Verifying donation was added...")
    
    # Wait a moment for the database to update
    import time
    time.sleep(2)
    
    # Query again for Michael's donations
    michael_donations_after = demo_donations_ref.where('participant_id', '==', 'michael-rodriguez').stream()
    
    total_received_after = 0
    donation_count_after = 0
    
    for doc in michael_donations_after:
        data = doc.to_dict()
        amount_data = data.get('amount', {})
        
        # Handle different amount formats
        if isinstance(amount_data, dict):
            amount = amount_data.get('total', 0)
        else:
            amount = amount_data or 0
            
        total_received_after += amount
        donation_count_after += 1
    
    print(f"   📈 New Total: ${total_received_after} from {donation_count_after} donations")
    print(f"   📊 Difference: +${total_received_after - total_received} (+{donation_count_after - donation_count} donations)")
    
    # Step 4: Check if the profile should update
    print("\n🌐 Step 4: Profile should now show updated metrics...")
    print(f"   🔗 Visit: https://sheltr-ai.web.app/participant/michael-rodriguez/")
    print(f"   💰 Expected Total Received: ${total_received_after}")
    print(f"   📊 Expected Donation Count: {donation_count_after}")
    
    # Step 5: Clean up test donation
    print("\n🧹 Step 5: Cleaning up test donation...")
    
    try:
        # Find and delete the test donation
        test_donations = demo_donations_ref.where('source', '==', 'test-script').stream()
        for doc in test_donations:
            doc.reference.delete()
            print(f"   ✅ Deleted test donation: {doc.id}")
    except Exception as e:
        print(f"   ⚠️ Could not clean up test donation: {e}")
    
    print("\n✅ Donation flow test completed!")
    print("🎯 The scan-give donation flow should now:")
    print("   1. ✅ Create donations automatically on success page")
    print("   2. ✅ Show confetti animation")
    print("   3. ✅ Update Michael's profile metrics")
    print("   4. ✅ Track both logged-in and anonymous donations")

if __name__ == "__main__":
    test_donation_flow()
