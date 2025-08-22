#!/usr/bin/env python3
"""
SHELTR-AI Database Audit Script
Emergency audit and fix for database connectivity issues
"""

import firebase_admin
from firebase_admin import firestore, credentials
from google.cloud import storage
import json
import logging
from typing import Dict, List, Any
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseAuditor:
    """Comprehensive database audit and fix tool"""
    
    def __init__(self):
        """Initialize Firebase and Storage clients"""
        try:
            # Initialize Firebase Admin SDK
            if not firebase_admin._apps:
                cred = credentials.Certificate('path/to/serviceAccountKey.json')
                firebase_admin.initialize_app(cred)
            
            self.db = firestore.client()
            self.storage_client = storage.Client()
            self.bucket = self.storage_client.bucket('sheltr-ai.firebasestorage.app')
            
            logger.info("✅ Database auditor initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize database auditor: {e}")
            raise
    
    def audit_collections(self) -> Dict[str, Any]:
        """Audit Firestore collections"""
        logger.info("🔍 Auditing Firestore collections...")
        
        # Get all existing collections
        collections = self.db.collections()
        existing_collections = [col.id for col in collections]
        
        # Documented collections that should exist
        documented_collections = [
            'users', 'shelters', 'participants', 'donations', 'transactions',
            'services', 'appointments', 'knowledge_documents', 'knowledge_chunks',
            'blog_posts', 'blog_categories', 'chat_sessions', 'agent_configurations',
            'feature_flags', 'system_alerts', 'platform_metrics', 'tenants'
        ]
        
        # Find discrepancies
        missing_collections = [col for col in documented_collections if col not in existing_collections]
        extra_collections = [col for col in existing_collections if col not in documented_collections]
        
        audit_result = {
            'existing': existing_collections,
            'missing': missing_collections,
            'extra': extra_collections,
            'total_existing': len(existing_collections),
            'total_missing': len(missing_collections),
            'total_extra': len(extra_collections)
        }
        
        logger.info(f"📊 Collection audit results:")
        logger.info(f"   Existing: {audit_result['total_existing']}")
        logger.info(f"   Missing: {audit_result['total_missing']}")
        logger.info(f"   Extra: {audit_result['total_extra']}")
        
        return audit_result
    
    def audit_storage_structure(self) -> Dict[str, Any]:
        """Audit Firebase Storage structure"""
        logger.info("🔍 Auditing Firebase Storage structure...")
        
        # Get all blobs
        blobs = self.bucket.list_blobs()
        file_structure = {}
        
        for blob in blobs:
            path_parts = blob.name.split('/')
            current_level = file_structure
            
            for part in path_parts:
                if part not in current_level:
                    current_level[part] = {}
                current_level = current_level[part]
        
        # Documented structure
        documented_structure = {
            'knowledge-base': {
                'public': {},
                'internal': {},
                'shelter-specific': {},
                'embeddings': {}
            },
            'uploads': {
                'processing': {},
                'failed': {}
            },
            'processed': {
                'documents': {},
                'summaries': {},
                'extracted-text': {}
            }
        }
        
        audit_result = {
            'actual_structure': file_structure,
            'documented_structure': documented_structure,
            'files_count': len(list(self.bucket.list_blobs()))
        }
        
        logger.info(f"📁 Storage audit results:")
        logger.info(f"   Total files: {audit_result['files_count']}")
        logger.info(f"   Actual structure: {json.dumps(file_structure, indent=2)}")
        
        return audit_result
    
    def audit_indexes(self) -> Dict[str, Any]:
        """Audit Firestore indexes"""
        logger.info("🔍 Auditing Firestore indexes...")
        
        # Get existing indexes (this would require admin SDK or manual inspection)
        # For now, we'll document what should exist
        required_indexes = [
            {
                'collection': 'users',
                'fields': ['role', 'shelter_id', 'createdAt'],
                'description': 'User role and shelter filtering'
            },
            {
                'collection': 'shelters',
                'fields': ['status', 'location.city', 'createdAt'],
                'description': 'Shelter status and location filtering'
            },
            {
                'collection': 'appointments',
                'fields': ['participant_id', 'service_id', 'date'],
                'description': 'Appointment participant and service filtering'
            },
            {
                'collection': 'services',
                'fields': ['shelter_id', 'category', 'status'],
                'description': 'Service shelter and category filtering'
            },
            {
                'collection': 'knowledge_documents',
                'fields': ['access_level', 'categories', 'uploaded_at'],
                'description': 'Knowledge document access and category filtering'
            }
        ]
        
        audit_result = {
            'required_indexes': required_indexes,
            'total_required': len(required_indexes),
            'note': 'Index audit requires manual verification in Firebase Console'
        }
        
        logger.info(f"📊 Index audit results:")
        logger.info(f"   Required indexes: {audit_result['total_required']}")
        
        return audit_result
    
    def create_missing_collections(self, missing_collections: List[str]) -> Dict[str, Any]:
        """Create missing collections with proper structure"""
        logger.info(f"🔧 Creating {len(missing_collections)} missing collections...")
        
        results = {}
        
        for collection_name in missing_collections:
            try:
                # Create collection with a sample document
                doc_ref = self.db.collection(collection_name).document('_metadata')
                doc_ref.set({
                    'created_at': firestore.SERVER_TIMESTAMP,
                    'version': '1.0',
                    'description': f'Metadata for {collection_name} collection',
                    'created_by': 'database_auditor'
                })
                
                results[collection_name] = {
                    'status': 'created',
                    'success': True
                }
                logger.info(f"   ✅ Created collection: {collection_name}")
                
            except Exception as e:
                results[collection_name] = {
                    'status': 'failed',
                    'success': False,
                    'error': str(e)
                }
                logger.error(f"   ❌ Failed to create {collection_name}: {e}")
        
        return results
    
    def standardize_data_structures(self) -> Dict[str, Any]:
        """Standardize data structures across collections"""
        logger.info("🔧 Standardizing data structures...")
        
        results = {}
        
        # Standardize users collection
        try:
            users_ref = self.db.collection('users')
            users = users_ref.stream()
            
            updated_count = 0
            for user in users:
                user_data = user.to_dict()
                
                # Add missing fields
                updates = {}
                if 'role' not in user_data:
                    updates['role'] = 'participant'  # Default role
                if 'created_at' not in user_data:
                    updates['created_at'] = firestore.SERVER_TIMESTAMP
                if 'status' not in user_data:
                    updates['status'] = 'active'
                
                if updates:
                    user.reference.update(updates)
                    updated_count += 1
            
            results['users'] = {
                'status': 'standardized',
                'updated_count': updated_count,
                'success': True
            }
            logger.info(f"   ✅ Standardized users collection: {updated_count} updated")
            
        except Exception as e:
            results['users'] = {
                'status': 'failed',
                'success': False,
                'error': str(e)
            }
            logger.error(f"   ❌ Failed to standardize users: {e}")
        
        return results
    
    def create_storage_structure(self) -> Dict[str, Any]:
        """Create missing storage directory structure"""
        logger.info("🔧 Creating storage directory structure...")
        
        # Create new directory structure
        new_structure = [
            'knowledge-base/public/',
            'knowledge-base/internal/',
            'knowledge-base/shelter-specific/',
            'knowledge-base/embeddings/',
            'uploads/processing/',
            'uploads/failed/',
            'processed/documents/',
            'processed/summaries/',
            'processed/extracted-text/'
        ]
        
        results = {}
        
        for path in new_structure:
            try:
                # Create placeholder file for directory
                blob = self.bucket.blob(f"{path}.placeholder")
                blob.upload_from_string("Directory placeholder")
                
                results[path] = {
                    'status': 'created',
                    'success': True
                }
                logger.info(f"   ✅ Created directory: {path}")
                
            except Exception as e:
                results[path] = {
                    'status': 'failed',
                    'success': False,
                    'error': str(e)
                }
                logger.error(f"   ❌ Failed to create {path}: {e}")
        
        return results
    
    def run_complete_audit(self) -> Dict[str, Any]:
        """Run complete database audit and fix"""
        logger.info("🚀 Starting complete database audit...")
        
        audit_results = {}
        
        # Phase 1: Audit
        audit_results['collections'] = self.audit_collections()
        audit_results['storage'] = self.audit_storage_structure()
        audit_results['indexes'] = self.audit_indexes()
        
        # Phase 2: Fix missing collections
        if audit_results['collections']['missing']:
            audit_results['collection_creation'] = self.create_missing_collections(
                audit_results['collections']['missing']
            )
        
        # Phase 3: Standardize data
        audit_results['standardization'] = self.standardize_data_structures()
        
        # Phase 4: Create storage structure
        audit_results['storage_creation'] = self.create_storage_structure()
        
        # Summary
        audit_results['summary'] = {
            'total_issues_found': len(audit_results['collections']['missing']),
            'total_issues_fixed': len([r for r in audit_results.get('collection_creation', {}).values() if r.get('success')]),
            'audit_complete': True
        }
        
        logger.info("✅ Complete database audit finished")
        return audit_results

def main():
    """Main execution function"""
    try:
        auditor = DatabaseAuditor()
        results = auditor.run_complete_audit()
        
        # Save results to file
        with open('database_audit_results.json', 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
        logger.info("📄 Audit results saved to database_audit_results.json")
        
        # Print summary
        summary = results['summary']
        logger.info(f"📊 Audit Summary:")
        logger.info(f"   Issues found: {summary['total_issues_found']}")
        logger.info(f"   Issues fixed: {summary['total_issues_fixed']}")
        
    except Exception as e:
        logger.error(f"❌ Database audit failed: {e}")
        raise

if __name__ == "__main__":
    main()
