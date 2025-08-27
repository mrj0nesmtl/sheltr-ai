#!/usr/bin/env python3
"""
Test chart data to understand the discrepancy between Super Admin and Platform Admin views
"""

import firebase_admin
from firebase_admin import credentials, firestore
from collections import defaultdict
import json
from datetime import datetime, timedelta

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_current_user_counts():
    """Get current actual user counts"""
    users_ref = db.collection('users')
    users = users_ref.stream()
    
    role_counts = defaultdict(int)
    for user in users:
        user_data = user.to_dict()
        role = user_data.get('role', 'unknown')
        role_counts[role] += 1
    
    participants = role_counts['participant']
    donors = role_counts['donor'] 
    admins = (role_counts['admin'] + role_counts['shelteradmin'] + 
             role_counts['super_admin'] + role_counts['superadmin'] + 
             role_counts['platform_admin'])
    
    return {
        'participants': participants,
        'donors': donors,
        'admins': admins,
        'breakdown': dict(role_counts)
    }

def simulate_chart_data():
    """Simulate what the chart data should look like"""
    counts = get_current_user_counts()
    
    # Simulate the same logic as userAnalytics.ts
    current_participants = counts['participants']
    current_donors = counts['donors']
    current_admins = counts['admins']
    
    # Start with smaller base numbers 90 days ago
    start_participants = max(0, current_participants - 3)
    start_donors = max(0, current_donors - 2)
    start_admins = max(1, current_admins - 1)
    
    chart_data = []
    today = datetime.now()
    
    for i in range(89, -1, -1):  # 90 days ago to today
        date = today - timedelta(days=i)
        
        # Calculate growth factor (0 to 1 over 90 days)
        growth_progress = (89 - i) / 89
        
        # Calculate user counts with realistic linear growth to current numbers
        participants = round(start_participants + (current_participants - start_participants) * growth_progress)
        donors = round(start_donors + (current_donors - start_donors) * growth_progress)
        admins = round(start_admins + (current_admins - start_admins) * growth_progress)
        
        # Use date-based seed for consistent variance per day
        date_seed = (date.timestamp() % 1000) / 1000  # 0-1 based on date
        variance = 1 if i == 0 else (1 + (date_seed - 0.5) * 0.1)
        
        final_participants = current_participants if i == 0 else max(0, round(participants * variance))
        final_donors = current_donors if i == 0 else max(0, round(donors * variance))
        final_admins = current_admins if i == 0 else max(0, round(admins * variance))
        
        chart_data.append({
            'date': date.strftime('%Y-%m-%d'),
            'participants': final_participants,
            'donors': final_donors,
            'admins': final_admins
        })
    
    return chart_data

def analyze_chart_data():
    """Analyze what the chart should show"""
    print("🔍 ANALYZING CHART DATA CONSISTENCY")
    print("=" * 50)
    
    counts = get_current_user_counts()
    print(f"📊 CURRENT ACTUAL COUNTS:")
    print(f"   Participants: {counts['participants']}")
    print(f"   Donors: {counts['donors']}")
    print(f"   Admins: {counts['admins']}")
    print(f"   Role breakdown: {counts['breakdown']}")
    
    chart_data = simulate_chart_data()
    
    print(f"\n📈 CHART DATA SIMULATION:")
    print(f"   Total data points: {len(chart_data)}")
    
    # Show first, middle, and last few data points
    print(f"\n📅 FIRST 3 DAYS (90 days ago):")
    for item in chart_data[:3]:
        print(f"   {item['date']}: P={item['participants']}, D={item['donors']}, A={item['admins']}")
    
    print(f"\n📅 MIDDLE 3 DAYS (45 days ago):")
    middle_idx = len(chart_data) // 2
    for item in chart_data[middle_idx-1:middle_idx+2]:
        print(f"   {item['date']}: P={item['participants']}, D={item['donors']}, A={item['admins']}")
    
    print(f"\n📅 LAST 3 DAYS (recent):")
    for item in chart_data[-3:]:
        print(f"   {item['date']}: P={item['participants']}, D={item['donors']}, A={item['admins']}")
    
    # Verify final day matches actual counts
    final_day = chart_data[-1]
    print(f"\n✅ FINAL DAY VERIFICATION:")
    print(f"   Expected: P={counts['participants']}, D={counts['donors']}, A={counts['admins']}")
    print(f"   Chart shows: P={final_day['participants']}, D={final_day['donors']}, A={final_day['admins']}")
    
    matches = (
        final_day['participants'] == counts['participants'] and
        final_day['donors'] == counts['donors'] and
        final_day['admins'] == counts['admins']
    )
    
    print(f"   ✅ Match: {matches}")
    
    if not matches:
        print("   ❌ MISMATCH DETECTED - Chart data doesn't match database!")
    
    return chart_data

if __name__ == "__main__":
    chart_data = analyze_chart_data()
    
    print(f"\n🎯 CONCLUSION:")
    print(f"Both Super Admin and Platform Admin dashboards should show IDENTICAL data.")
    print(f"If they show different data, there's a React state or caching issue.")
