#!/usr/bin/env python3
"""
Create test services in Firestore for SHELTR-AI service booking testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timezone
from services.firebase_service import firebase_service

def create_test_services():
    """Create sample services in Firestore"""
    
    test_services = [
        {
            'id': 'counseling-individual',
            'name': 'Individual Counseling',
            'category': 'Mental Health',
            'provider': 'Dr. Sarah Wilson, LCSW',
            'description': 'One-on-one counseling sessions to address personal challenges and develop coping strategies.',
            'duration_minutes': 50,
            'location': 'Counseling Room A',
            'max_capacity': 1,
            'requirements': ['Initial intake required', 'Weekly commitment'],
            'shelter_id': 'demo-shelter-001',
            'tenant_id': 'shelter-demo-shelter-001',
            'created_by': 'system',
            'created_at': datetime.now(timezone.utc),
            'rating': 4.8,
            'total_ratings': 24
        },
        {
            'id': 'job-workshop',
            'name': 'Job Readiness Workshop',
            'category': 'Employment',
            'provider': 'Michael Chen, Career Counselor',
            'description': 'Learn resume writing, interview skills, and job search strategies.',
            'duration_minutes': 120,
            'location': 'Training Room B',
            'max_capacity': 12,
            'requirements': ['Must attend all 4 sessions', 'Bring valid ID'],
            'shelter_id': 'demo-shelter-001',
            'tenant_id': 'shelter-demo-shelter-001',
            'created_by': 'system',
            'created_at': datetime.now(timezone.utc),
            'rating': 4.9,
            'total_ratings': 18
        },
        {
            'id': 'housing-assistance',
            'name': 'Housing Search Assistance',
            'category': 'Housing',
            'provider': 'Lisa Rodriguez, Housing Specialist',
            'description': 'Get help finding affordable housing options and completing applications.',
            'duration_minutes': 60,
            'location': 'Housing Office',
            'max_capacity': 1,
            'requirements': ['Bring income documentation', 'Photo ID required'],
            'shelter_id': 'demo-shelter-001',
            'tenant_id': 'shelter-demo-shelter-001',
            'created_by': 'system',
            'created_at': datetime.now(timezone.utc),
            'rating': 4.7,
            'total_ratings': 15
        },
        {
            'id': 'financial-literacy',
            'name': 'Financial Literacy Class',
            'category': 'Financial',
            'provider': 'David Kim, Financial Advisor',
            'description': 'Learn budgeting, saving, and money management skills.',
            'duration_minutes': 90,
            'location': 'Classroom C',
            'max_capacity': 20,
            'requirements': ['6-week program', 'Weekly attendance'],
            'shelter_id': 'demo-shelter-001',
            'tenant_id': 'shelter-demo-shelter-001',
            'created_by': 'system',
            'created_at': datetime.now(timezone.utc),
            'rating': 4.6,
            'total_ratings': 22
        },
        {
            'id': 'health-screening',
            'name': 'Health Screening',
            'category': 'Healthcare',
            'provider': 'Nurse Patricia Johnson, RN',
            'description': 'Basic health check-up and vaccination updates.',
            'duration_minutes': 30,
            'location': 'Health Clinic',
            'max_capacity': 1,
            'requirements': ['Fasting not required', 'Bring insurance card if available'],
            'shelter_id': 'demo-shelter-001',
            'tenant_id': 'shelter-demo-shelter-001',
            'created_by': 'system',
            'created_at': datetime.now(timezone.utc),
            'rating': 4.9,
            'total_ratings': 31
        },
        {
            'id': 'computer-training',
            'name': 'Computer Skills Training',
            'category': 'Education',
            'provider': 'James Park, IT Instructor',
            'description': 'Basic computer and internet skills for job searching and daily life.',
            'duration_minutes': 120,
            'location': 'Computer Lab',
            'max_capacity': 15,
            'requirements': ['No experience needed', '4-week program'],
            'shelter_id': 'demo-shelter-001',
            'tenant_id': 'shelter-demo-shelter-001',
            'created_by': 'system',
            'created_at': datetime.now(timezone.utc),
            'rating': 4.8,
            'total_ratings': 19
        }
    ]
    
    print("🔄 Creating test services in Firestore...")
    
    for service in test_services:
        doc_id = service['id']
        try:
            firebase_service.db.collection('services').document(doc_id).set(service)
            print(f"✅ Created service: {service['name']}")
        except Exception as e:
            print(f"❌ Failed to create {service['name']}: {e}")
    
    print(f"\n🎉 Successfully created {len(test_services)} test services!")
    print("🏢 All services assigned to shelter: demo-shelter-001")
    print("👤 You can test with any user that has access to this shelter")

if __name__ == "__main__":
    create_test_services() 