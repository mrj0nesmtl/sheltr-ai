#!/usr/bin/env python3
"""
Assign some existing donations to Jane to fix the dashboard
"""

import firebase_admin
from firebase_admin import credentials, firestore

JANE_UID = 'rWM6e8zfa5UoRVe5tHe6cldQkh32'

def init_firebase():
    try:
        app = firebase_admin.get_app()
    except ValueError:
        cred = credentials.ApplicationDefault()
        app = firebase_admin.initialize_app(cred, {'projectId': 'sheltr-ai'})
    return firestore.client()

def assign_donations_to_jane():
    db = init_firebase()
    
    print('🎯 ASSIGNING DONATIONS TO JANE')
    print('=' * 50)
    
    # Get first 5 donations without proper donor_id (or with None/empty donor_id)
    all_donations = list(db.collection('demo_donations').limit(5).stream())
    
    # Filter for donations that don't have Jane's UID
    donations = []
    for doc in all_donations:
        data = doc.to_dict()
        donor_id = data.get('donor_id')
        if donor_id != JANE_UID:
            donations.append(doc)
    
    if not donations:
        print("⚠️ No 'Unknown' donations found to assign")
        return
    
    batch = db.batch()
    total_assigned = 0
    total_amount = 0
    
    print(f'\n📝 Assigning {len(donations)} donations to Jane...')
    
    for doc in donations:
        data = doc.to_dict()
        amount = data.get('amount', {})
        if isinstance(amount, dict):
            amount_value = amount.get('total', 0)
        else:
            amount_value = amount
        
        batch.update(doc.reference, {
            'donor_id': JANE_UID,
            'donor_info': {
                'name': 'Jane Supporter',
                'email': 'donor@example.com'
            },
            'source': f"{data.get('source', 'demo')}_assigned_to_jane",
            'updated_at': firestore.SERVER_TIMESTAMP
        })
        
        total_assigned += 1
        total_amount += amount_value
        print(f"   ✅ Assigning {doc.id}: ${amount_value}")
    
    # Commit the batch
    batch.commit()
    print(f"\n✅ Assigned {total_assigned} donations (${total_amount}) to Jane")
    
    # Update Jane's user document to match
    jane_doc_ref = db.collection('users').document(JANE_UID)
    jane_doc_ref.update({
        'donorProfile.totalDonated': total_amount,
        'donorProfile.donationCount': total_assigned,
        'donorProfile.lastDonation': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP
    })
    
    print(f"✅ Updated Jane's profile to ${total_amount} ({total_assigned} donations)")
    
    # Verify
    jane_donations_query = db.collection('demo_donations').where('donor_id', '==', JANE_UID)
    jane_donations = list(jane_donations_query.stream())
    
    verify_total = 0
    for doc in jane_donations:
        data = doc.to_dict()
        amount = data.get('amount', {})
        if isinstance(amount, dict):
            amount_value = amount.get('total', 0)
        else:
            amount_value = amount
        verify_total += amount_value
    
    print(f"\n🔍 VERIFICATION:")
    print(f"   Jane now has {len(jane_donations)} donations totaling ${verify_total}")
    
    if len(jane_donations) > 0 and verify_total > 0:
        print("\n🎉 SUCCESS! Jane's dashboard should now show donations!")
        print("\n🎯 Next steps:")
        print("   1. Refresh your browser")
        print("   2. Check Jane's dashboard")
        print("   3. Test making a new donation")
    else:
        print("\n⚠️ Something went wrong. Check the data manually.")

if __name__ == '__main__':
    assign_donations_to_jane()
