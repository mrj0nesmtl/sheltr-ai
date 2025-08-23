#!/usr/bin/env python3
"""
Fix the specific README.md duplicate issue
Keep only one document per storage file
"""

import firebase_admin
from firebase_admin import firestore

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

def fix_readme_duplicates():
    """Fix README.md having 2 different document entries"""
    print("🔧 Fixing README.md duplicates")
    print("="*40)
    
    # Get all documents pointing to README.md
    docs = list(db.collection('knowledge_documents').stream())
    readme_docs = []
    
    for doc in docs:
        data = doc.to_dict()
        file_path = data.get('file_path', '')
        if 'README.md' in file_path:
            readme_docs.append({
                'id': doc.id,
                'title': data.get('title', 'Unknown'),
                'file_path': file_path,
                'doc_ref': doc
            })
    
    print(f"📄 Found {len(readme_docs)} documents for README.md:")
    for doc in readme_docs:
        print(f"   - {doc['title']} (ID: {doc['id']})")
    
    if len(readme_docs) > 1:
        # Keep the first one, delete the rest
        keep_doc = readme_docs[0]
        delete_docs = readme_docs[1:]
        
        print(f"\n✅ Keeping: {keep_doc['title']} (ID: {keep_doc['id']})")
        print(f"🗑️  Deleting {len(delete_docs)} duplicates:")
        
        for doc in delete_docs:
            print(f"   - {doc['title']} (ID: {doc['id']})")
            try:
                doc['doc_ref'].reference.delete()
                print(f"     ✅ Deleted")
            except Exception as e:
                print(f"     ❌ Error: {e}")
        
        print(f"\n🎉 README.md now has exactly 1 document entry!")
    else:
        print("\n✅ README.md already has only 1 document entry")

def verify_final_count():
    """Verify we now have exactly 9 documents"""
    docs = list(db.collection('knowledge_documents').stream())
    print(f"\n📊 Final verification:")
    print(f"   Firestore documents: {len(docs)}")
    print(f"   Expected: 9")
    
    if len(docs) == 9:
        print("   ✅ Perfect! Collection now matches storage files")
    else:
        print(f"   ⚠️  Still have {len(docs)} documents instead of 9")

if __name__ == "__main__":
    fix_readme_duplicates()
    verify_final_count()
