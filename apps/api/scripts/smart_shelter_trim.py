#!/usr/bin/env python3
"""
Smart Shelter Trimming Script
Keep exactly 10 most important shelters, preserving Old Brewery Mission
"""

import firebase_admin
from firebase_admin import firestore, credentials
import sys

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

def get_shelter_priority_score(shelter_id, name, status, address):
    """Calculate priority score for shelter"""
    score = 0
    
    # CRITICAL: Old Brewery Mission (has users attached)
    if shelter_id == 'old-brewery-mission':
        score += 1000
        return score, "Critical - has users attached"
    
    # HIGH: Active shelters
    if status == 'active':
        score += 100
    
    # MEDIUM: Well-known major Montreal shelters
    major_shelters = [
        'welcome hall mission',
        'accueil bonneau', 
        'dans la rue',
        'maison du père',
        'chez doris',
        'mission old brewery',
        'refuge des jeunes',
        'ywca montreal'
    ]
    
    if any(major in name.lower() for major in major_shelters):
        score += 50
    
    # LOW: Has specific address in Montreal
    if 'montreal' in address.lower() or 'qc' in address:
        score += 10
    
    reasons = []
    if score >= 1000:
        reasons.append("Critical - has users")
    if status == 'active':
        reasons.append("Active status")
    if any(major in name.lower() for major in major_shelters):
        reasons.append("Major Montreal shelter")
    if 'montreal' in address.lower():
        reasons.append("Montreal location")
    
    return score, ", ".join(reasons) if reasons else "Basic shelter"

def main():
    dry_run = '--execute' not in sys.argv
    
    print("🏠 Smart Shelter Trimming - Keep Best 10 Shelters")
    print("="*60)
    
    # Get all shelters
    shelters_ref = db.collection('shelters')
    shelters = list(shelters_ref.stream())
    
    shelter_scores = []
    
    for shelter in shelters:
        data = shelter.to_dict()
        if not data:
            continue
            
        name = data.get('name', 'Unknown')
        status = data.get('status', 'unknown')
        address = data.get('address', '')
        
        score, reason = get_shelter_priority_score(shelter.id, name, status, address)
        
        shelter_scores.append({
            'id': shelter.id,
            'name': name,
            'status': status,
            'address': address,
            'score': score,
            'reason': reason,
            'ref': shelter.reference
        })
    
    # Sort by score (highest first)
    shelter_scores.sort(key=lambda x: x['score'], reverse=True)
    
    # Select top 10 to keep
    keep_shelters = shelter_scores[:10]
    delete_shelters = shelter_scores[10:]
    
    print("✅ TOP 10 SHELTERS TO KEEP:")
    for i, shelter in enumerate(keep_shelters, 1):
        print(f"{i:2d}. {shelter['name']}")
        print(f"    ID: {shelter['id']}")
        print(f"    Status: {shelter['status']}")
        print(f"    Score: {shelter['score']} - {shelter['reason']}")
        print()
    
    print(f"\n❌ SHELTERS TO DELETE ({len(delete_shelters)}):")
    for shelter in delete_shelters:
        print(f"- {shelter['name']} (ID: {shelter['id']}) - Score: {shelter['score']}")
    
    if dry_run:
        print(f"\n🔮 DRY RUN: Would delete {len(delete_shelters)} shelters")
        print("💡 Add --execute flag to perform actual deletion")
        return
    
    # Execute deletion
    print(f"\n🗑️  DELETING {len(delete_shelters)} shelters...")
    deleted_count = 0
    
    for shelter in delete_shelters:
        try:
            shelter['ref'].delete()
            deleted_count += 1
            print(f"   ✅ Deleted: {shelter['name']}")
        except Exception as e:
            print(f"   ❌ Failed to delete {shelter['name']}: {e}")
    
    print(f"\n✅ Successfully deleted {deleted_count}/{len(delete_shelters)} shelters")
    print(f"🎯 Shelter count reduced from {len(shelter_scores)} to 10")

if __name__ == "__main__":
    main()
