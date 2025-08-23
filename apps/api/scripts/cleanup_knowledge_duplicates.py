#!/usr/bin/env python3
"""
Clean up duplicate knowledge documents
The collection should match Firebase Storage exactly (9 documents)
"""

import firebase_admin
from firebase_admin import firestore, storage
from collections import defaultdict
import json

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()
bucket = storage.bucket('sheltr-ai.firebasestorage.app')

def analyze_knowledge_duplicates():
    """Analyze knowledge documents for duplicates"""
    print("🔍 Analyzing Knowledge Document Duplicates")
    print("="*60)
    
    # Get actual files from Firebase Storage
    print("📁 Checking Firebase Storage files...")
    storage_files = []
    blobs = bucket.list_blobs(prefix='knowledge-base/public/')
    
    for blob in blobs:
        if blob.name.endswith('.md') or blob.name.endswith('.txt'):
            filename = blob.name.split('/')[-1]  # Get just the filename
            storage_files.append({
                'path': blob.name,
                'filename': filename,
                'size': blob.size,
                'created': blob.time_created
            })
    
    print(f"✅ Found {len(storage_files)} actual files in storage:")
    for i, file in enumerate(storage_files, 1):
        print(f"   {i}. {file['filename']} ({file['size']} bytes)")
    
    # Get documents from Firestore
    print(f"\n📋 Checking Firestore knowledge_documents collection...")
    firestore_docs = list(db.collection('knowledge_documents').stream())
    
    print(f"✅ Found {len(firestore_docs)} documents in Firestore")
    
    # Group by title/name to find duplicates
    title_groups = defaultdict(list)
    path_groups = defaultdict(list)
    
    for doc in firestore_docs:
        data = doc.to_dict()
        title = data.get('title', 'Untitled')
        file_path = data.get('file_path', '')
        
        title_groups[title].append({
            'id': doc.id,
            'title': title,
            'file_path': file_path,
            'category': data.get('category', 'Unknown'),
            'file_size': data.get('file_size', 0),
            'created_at': data.get('created_at', 'Unknown'),
            'doc_ref': doc
        })
        
        if file_path:
            path_groups[file_path].append({
                'id': doc.id,
                'title': title,
                'file_path': file_path,
                'doc_ref': doc
            })
    
    # Find duplicates by title
    print(f"\n🔄 Analyzing duplicates by title:")
    title_duplicates = {title: docs for title, docs in title_groups.items() if len(docs) > 1}
    
    if title_duplicates:
        for title, docs in title_duplicates.items():
            print(f"   📄 '{title}' has {len(docs)} copies:")
            for doc in docs:
                print(f"      - ID: {doc['id']}")
                print(f"        Path: {doc['file_path']}")
                print(f"        Size: {doc['file_size']} bytes")
                print()
    else:
        print("   ✅ No title duplicates found")
    
    # Find duplicates by file path
    print(f"\n🔄 Analyzing duplicates by file path:")
    path_duplicates = {path: docs for path, docs in path_groups.items() if len(docs) > 1}
    
    if path_duplicates:
        for path, docs in path_duplicates.items():
            print(f"   📁 '{path}' has {len(docs)} references:")
            for doc in docs:
                print(f"      - ID: {doc['id']} | Title: {doc['title']}")
    else:
        print("   ✅ No path duplicates found")
    
    # Find orphaned documents (no corresponding storage file)
    print(f"\n🔍 Finding orphaned documents (no storage file):")
    storage_paths = {file['path'] for file in storage_files}
    orphaned_docs = []
    
    for doc in firestore_docs:
        data = doc.to_dict()
        file_path = data.get('file_path', '')
        if file_path and file_path not in storage_paths:
            orphaned_docs.append({
                'id': doc.id,
                'title': data.get('title', 'Untitled'),
                'file_path': file_path,
                'doc_ref': doc
            })
    
    if orphaned_docs:
        print(f"   ❌ Found {len(orphaned_docs)} orphaned documents:")
        for doc in orphaned_docs:
            print(f"      - {doc['title']} (ID: {doc['id']})")
            print(f"        Missing file: {doc['file_path']}")
    else:
        print("   ✅ No orphaned documents found")
    
    # Find missing documents (storage file without Firestore doc)
    print(f"\n🔍 Finding missing documents (storage file without Firestore doc):")
    firestore_paths = {doc.to_dict().get('file_path', '') for doc in firestore_docs}
    missing_docs = []
    
    for file in storage_files:
        if file['path'] not in firestore_paths:
            missing_docs.append(file)
    
    if missing_docs:
        print(f"   ❌ Found {len(missing_docs)} storage files without Firestore docs:")
        for file in missing_docs:
            print(f"      - {file['filename']} (Path: {file['path']})")
    else:
        print("   ✅ All storage files have corresponding Firestore documents")
    
    return {
        'storage_files': storage_files,
        'firestore_docs': firestore_docs,
        'title_duplicates': title_duplicates,
        'path_duplicates': path_duplicates,
        'orphaned_docs': orphaned_docs,
        'missing_docs': missing_docs
    }

def cleanup_duplicates(analysis, dry_run=True):
    """Clean up duplicate and orphaned documents"""
    print(f"\n🧹 Cleaning up duplicates (dry_run={dry_run})")
    print("="*60)
    
    total_to_delete = 0
    
    # Strategy 1: Remove orphaned documents (no storage file)
    orphaned_docs = analysis['orphaned_docs']
    if orphaned_docs:
        print(f"📋 Plan: Delete {len(orphaned_docs)} orphaned documents")
        total_to_delete += len(orphaned_docs)
        
        if not dry_run:
            for doc in orphaned_docs:
                try:
                    doc['doc_ref'].reference.delete()
                    print(f"   ✅ Deleted orphaned: {doc['title']}")
                except Exception as e:
                    print(f"   ❌ Failed to delete {doc['title']}: {e}")
        else:
            for doc in orphaned_docs:
                print(f"   🗑️  Would delete: {doc['title']} (ID: {doc['id']})")
    
    # Strategy 2: For title duplicates, keep the one with correct file path
    title_duplicates = analysis['title_duplicates']
    storage_paths = {file['path'] for file in analysis['storage_files']}
    
    for title, docs in title_duplicates.items():
        print(f"\n📄 Processing duplicates for: '{title}'")
        
        # Find the document that matches an actual storage file
        correct_doc = None
        to_delete = []
        
        for doc in docs:
            if doc['file_path'] in storage_paths:
                if correct_doc is None:
                    correct_doc = doc
                    print(f"   ✅ Keeping: {doc['id']} (has correct file: {doc['file_path']})")
                else:
                    to_delete.append(doc)
                    print(f"   🗑️  Duplicate with correct file: {doc['id']}")
            else:
                to_delete.append(doc)
                print(f"   🗑️  No matching file: {doc['id']} (file: {doc['file_path']})")
        
        if to_delete:
            total_to_delete += len(to_delete)
            
            if not dry_run:
                for doc in to_delete:
                    try:
                        doc['doc_ref'].reference.delete()
                        print(f"   ✅ Deleted duplicate: {doc['title']} (ID: {doc['id']})")
                    except Exception as e:
                        print(f"   ❌ Failed to delete {doc['title']}: {e}")
    
    print(f"\n📊 Summary:")
    print(f"   Current Firestore docs: {len(analysis['firestore_docs'])}")
    print(f"   Storage files: {len(analysis['storage_files'])}")
    print(f"   Documents to delete: {total_to_delete}")
    print(f"   Final count: {len(analysis['firestore_docs']) - total_to_delete}")
    
    if total_to_delete > 0:
        if dry_run:
            print(f"\n💡 Run with --execute to perform actual cleanup")
        else:
            print(f"\n🎉 Cleanup completed!")
    else:
        print(f"\n✅ No cleanup needed - everything looks good!")

def main():
    import sys
    dry_run = '--execute' not in sys.argv
    
    analysis = analyze_knowledge_duplicates()
    cleanup_duplicates(analysis, dry_run=dry_run)

if __name__ == "__main__":
    main()
