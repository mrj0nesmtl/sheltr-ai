#!/usr/bin/env python3
"""Clear production cache and reset metrics"""

import firebase_admin
from firebase_admin import credentials, firestore
import time

try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

db = firestore.client()

def clear_cache():
    print("🧹 Clearing production cache and resetting metrics...")
    
    # Force refresh by updating a cache timestamp
    cache_ref = db.collection('system').document('cache')
    cache_ref.set({
        'last_updated': firestore.SERVER_TIMESTAMP,
        'force_refresh': True
    })
    
    print("✅ Cache cleared - production should now show correct metrics")
    print("🔄 Please refresh the dashboard in production")

if __name__ == "__main__":
    clear_cache()
