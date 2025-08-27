#!/usr/bin/env python3
"""
Mark remaining donations as anonymous/public donations
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

def mark_anonymous_donations():
    db = init_firebase()
    
    print('🎭 MARKING REMAINING DONATIONS AS ANONYMOUS')
    print('=' * 50)
    
    # Get all donations that don't belong to Jane
    all_donations = list(db.collection('demo_donations').stream())
    
    anonymous_donations = []
    jane_donations = []
    
    for doc in all_donations:
        data = doc.to_dict()
        donor_id = data.get('donor_id')
        if donor_id == JANE_UID:
            jane_donations.append(doc)
        else:
            anonymous_donations.append(doc)
    
    print(f'📊 CURRENT STATUS:')
    print(f'   Jane\'s donations: {len(jane_donations)}')
    print(f'   Other donations: {len(anonymous_donations)}')
    
    if not anonymous_donations:
        print("✅ No donations to mark as anonymous")
        return
    
    batch = db.batch()
    total_anonymous = 0
    total_amount = 0
    
    print(f'\n🎭 Marking {len(anonymous_donations)} donations as anonymous...')
    
    for doc in anonymous_donations:
        data = doc.to_dict()
        amount = data.get('amount', {})
        if isinstance(amount, dict):
            amount_value = amount.get('total', 0)
        else:
            amount_value = amount
        
        batch.update(doc.reference, {
            'donor_id': 'anonymous',
            'donor_info': {
                'name': 'Anonymous Donor',
                'email': 'anonymous@sheltr.ai'
            },
            'source': f"{data.get('source', 'demo')}_anonymous",
            'donation_type': 'anonymous',
            'public': True,
            'anonymous': True,
            'updated_at': firestore.SERVER_TIMESTAMP
        })
        
        total_anonymous += 1
        total_amount += amount_value
        print(f"   🎭 Marking {doc.id}: ${amount_value} as anonymous")
    
    # Commit the batch
    batch.commit()
    print(f"\n✅ Marked {total_anonymous} donations (${total_amount}) as anonymous")
    
    # Final summary
    print(f"\n📈 FINAL SUMMARY:")
    
    # Count Jane's donations
    jane_donations_query = db.collection('demo_donations').where('donor_id', '==', JANE_UID)
    jane_donations_final = list(jane_donations_query.stream())
    
    jane_total = 0
    for doc in jane_donations_final:
        data = doc.to_dict()
        amount = data.get('amount', {})
        if isinstance(amount, dict):
            amount_value = amount.get('total', 0)
        else:
            amount_value = amount
        jane_total += amount_value
    
    # Count anonymous donations
    anon_donations_query = db.collection('demo_donations').where('donor_id', '==', 'anonymous')
    anon_donations_final = list(anon_donations_query.stream())
    
    anon_total = 0
    for doc in anon_donations_final:
        data = doc.to_dict()
        amount = data.get('amount', {})
        if isinstance(amount, dict):
            amount_value = amount.get('total', 0)
        else:
            amount_value = amount
        anon_total += amount_value
    
    print(f"   👤 Jane's donations: {len(jane_donations_final)} (${jane_total})")
    print(f"   🎭 Anonymous donations: {len(anon_donations_final)} (${anon_total})")
    print(f"   💰 Total platform donations: ${jane_total + anon_total}")
    
    print(f"\n🎉 SUCCESS! Clean donation data structure:")
    print(f"   ✅ Tracked donations: Jane's account")
    print(f"   ✅ Anonymous donations: Public/anonymous")
    print(f"   ✅ No orphaned or 'unknown' donations")
    
    print(f"\n🎯 Benefits:")
    print(f"   • Jane's dashboard shows real tracked donations")
    print(f"   • Anonymous donations contribute to platform metrics")
    print(f"   • Clean data structure for future development")

if __name__ == '__main__':
    mark_anonymous_donations()
