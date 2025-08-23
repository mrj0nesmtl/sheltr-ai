#!/usr/bin/env python3
"""
Test the knowledge dashboard API endpoints directly
"""

import asyncio
import sys
sys.path.append('/Users/mrjones/Github/Projects/sheltr-ai/apps/api')

import firebase_admin
from firebase_admin import credentials

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

from services.knowledge_dashboard_service import KnowledgeDashboardService

async def test_knowledge_service():
    print("🧪 Testing Knowledge Dashboard Service")
    print("="*50)
    
    try:
        service = KnowledgeDashboardService()
        
        # Test get documents
        print("📄 Testing get_knowledge_documents()...")
        documents = await service.get_knowledge_documents()
        print(f"✅ Found {len(documents)} documents")
        
        if documents:
            # Show first document
            first_doc = documents[0]
            print(f"\n📋 Sample document:")
            print(f"   ID: {first_doc.get('id', 'N/A')}")
            print(f"   Title: {first_doc.get('title', 'N/A')}")
            print(f"   Category: {first_doc.get('category', 'N/A')}")
            print(f"   Status: {first_doc.get('status', 'N/A')}")
            print(f"   File size: {first_doc.get('file_size', 0)} bytes")
            print(f"   Tags: {first_doc.get('tags', [])}")
        
        # Test get stats
        print(f"\n📊 Testing get_knowledge_stats()...")
        stats = await service.get_knowledge_stats()
        print(f"✅ Stats retrieved:")
        print(f"   Total documents: {stats.get('total_documents', 0)}")
        print(f"   Active documents: {stats.get('active_documents', 0)}")
        print(f"   Total chunks: {stats.get('total_chunks', 0)}")
        print(f"   Categories: {stats.get('categories_count', 0)}")
        
        if documents:
            print("\n🎉 Knowledge service is working correctly!")
        else:
            print("\n⚠️  Knowledge service returns no documents")
            
    except Exception as e:
        print(f"❌ Error testing knowledge service: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_knowledge_service())
