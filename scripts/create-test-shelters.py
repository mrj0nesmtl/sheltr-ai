#!/usr/bin/env python3
"""
Create test shelter data for Platform Admin testing
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

def create_test_shelters():
    """Create test shelter data for platform admin metrics"""
    
    print("🏠 Creating test shelter data for Platform Admin testing...")
    
    # Test shelter data
    test_shelters = [
        {
            "name": "Old Brewery Mission",
            "address": "915 Clark Street, Montreal, QC",
            "location": "Montreal, QC",
            "type": "Emergency Shelter",
            "capacity": 150,
            "currentOccupancy": 120,
            "status": "active",
            "contact": {
                "name": "Sarah Manager",
                "email": "sarah.manager@oldbrewerymission.ca",
                "phone": "+1 (514) 866-6591"
            },
            "coordinates": {
                "lat": 45.5017,
                "lng": -73.5673
            },
            "complianceScore": 95,
            "lastInspection": "2025-08-15",
            "joinDate": "2023-01-15",
            "rating": 4.8,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "updatedAt": firestore.SERVER_TIMESTAMP
        },
        {
            "name": "Welcome Hall Mission",
            "address": "4755 Acorn Street, Montreal, QC",
            "location": "Montreal, QC",
            "type": "Emergency Shelter",
            "capacity": 200,
            "currentOccupancy": 180,
            "status": "active",
            "contact": {
                "name": "John Smith",
                "email": "john.smith@welcomehallmission.ca",
                "phone": "+1 (514) 523-5288"
            },
            "coordinates": {
                "lat": 45.5017,
                "lng": -73.5673
            },
            "complianceScore": 92,
            "lastInspection": "2025-08-10",
            "joinDate": "2023-03-20",
            "rating": 4.6,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "updatedAt": firestore.SERVER_TIMESTAMP
        },
        {
            "name": "Maison du Père",
            "address": "1625 Saint-Hubert Street, Montreal, QC",
            "location": "Montreal, QC",
            "type": "Emergency Shelter",
            "capacity": 100,
            "currentOccupancy": 85,
            "status": "active",
            "contact": {
                "name": "Marie Dubois",
                "email": "marie.dubois@maisondupere.ca",
                "phone": "+1 (514) 842-5334"
            },
            "coordinates": {
                "lat": 45.5017,
                "lng": -73.5673
            },
            "complianceScore": 88,
            "lastInspection": "2025-08-05",
            "joinDate": "2023-06-10",
            "rating": 4.4,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "updatedAt": firestore.SERVER_TIMESTAMP
        },
        {
            "name": "Chez Doris",
            "address": "1430 Chomedey Street, Montreal, QC",
            "location": "Montreal, QC",
            "type": "Day Center",
            "capacity": 50,
            "currentOccupancy": 35,
            "status": "active",
            "contact": {
                "name": "Lisa Johnson",
                "email": "lisa.johnson@chezdoris.ca",
                "phone": "+1 (514) 937-2341"
            },
            "coordinates": {
                "lat": 45.5017,
                "lng": -73.5673
            },
            "complianceScore": 96,
            "lastInspection": "2025-08-12",
            "joinDate": "2023-09-15",
            "rating": 4.9,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "updatedAt": firestore.SERVER_TIMESTAMP
        },
        {
            "name": "Accueil Bonneau",
            "address": "400 Saint-Paul Street East, Montreal, QC",
            "location": "Montreal, QC",
            "type": "Emergency Shelter",
            "capacity": 80,
            "currentOccupancy": 65,
            "status": "active",
            "contact": {
                "name": "Pierre Tremblay",
                "email": "pierre.tremblay@accueilbonneau.ca",
                "phone": "+1 (514) 845-3906"
            },
            "coordinates": {
                "lat": 45.5017,
                "lng": -73.5673
            },
            "complianceScore": 90,
            "lastInspection": "2025-08-08",
            "joinDate": "2023-11-20",
            "rating": 4.5,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "updatedAt": firestore.SERVER_TIMESTAMP
        }
    ]
    
    # Add shelters to Firestore
    shelters_ref = db.collection('shelters')
    
    for i, shelter_data in enumerate(test_shelters):
        try:
            # Create a unique ID for each shelter
            shelter_id = f"test-shelter-{i+1:03d}"
            
            # Add the shelter document
            shelters_ref.document(shelter_id).set(shelter_data)
            print(f"✅ Created shelter: {shelter_data['name']} (ID: {shelter_id})")
            
        except Exception as e:
            print(f"❌ Error creating shelter {shelter_data['name']}: {e}")
    
    print(f"\n🎉 Successfully created {len(test_shelters)} test shelters!")
    print("📊 Platform Admin metrics should now show real data instead of zeros.")

if __name__ == "__main__":
    create_test_shelters()
