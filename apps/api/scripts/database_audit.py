#!/usr/bin/env python3
"""
SHELTR-AI Database Audit Script - Enhanced Version
Emergency audit and fix for database connectivity issues
Session 12: Database Infrastructure Audit & Cleanup
"""

import firebase_admin
from firebase_admin import firestore, credentials
from google.cloud import storage
import json
import logging
from typing import Dict, List, Any, Optional
import os
from datetime import datetime
from collections import defaultdict
import sys

# Set up enhanced logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('database_audit.log')
    ]
)
logger = logging.getLogger(__name__)

class DatabaseAuditor:
    """Enhanced comprehensive database audit and fix tool"""
    
    def __init__(self):
        """Initialize Firebase and Storage clients with better error handling"""
        try:
            # Try to initialize Firebase Admin SDK with environment detection
            if not firebase_admin._apps:
                # Try different credential sources
                if os.path.exists('serviceAccountKey.json'):
                    cred = credentials.Certificate('serviceAccountKey.json')
                    firebase_admin.initialize_app(cred)
                    logger.info("🔐 Using local service account key")
                elif os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
                    firebase_admin.initialize_app()
                    logger.info("🔐 Using environment credentials")
                else:
                    # Try default application credentials
                    firebase_admin.initialize_app()
                    logger.info("🔐 Using default application credentials")
            
            self.db = firestore.client()
            self.storage_client = storage.Client()
            self.bucket_name = 'sheltr-ai.firebasestorage.app'
            self.bucket = self.storage_client.bucket(self.bucket_name)
            
            # Test connectivity
            self._test_connectivity()
            
            logger.info("✅ Enhanced database auditor initialized successfully")
            logger.info(f"🗄️  Database: {self.db._database_string}")
            logger.info(f"🪣 Storage bucket: {self.bucket_name}")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize database auditor: {e}")
            logger.error("💡 Ensure you have proper Firebase credentials configured")
            raise
    
    def _test_connectivity(self):
        """Test basic connectivity to Firebase services"""
        try:
            # Test Firestore connectivity
            collections = list(self.db.collections())
            logger.info(f"🔗 Firestore connectivity confirmed - {len(collections)} collections found")
            
            # Test Storage connectivity
            blobs = list(self.bucket.list_blobs(max_results=1))
            logger.info(f"🔗 Storage connectivity confirmed")
            
        except Exception as e:
            logger.error(f"❌ Connectivity test failed: {e}")
            raise
    
    def audit_collections(self) -> Dict[str, Any]:
        """Enhanced Firestore collections audit with detailed analysis"""
        logger.info("🔍 Starting comprehensive Firestore collections audit...")
        
        # Get all existing collections
        collections = list(self.db.collections())
        existing_collections = [col.id for col in collections]
        
        # Based on SESSION-12 documents and current state analysis
        documented_collections = [
            # Core collections (should exist)
            'users', 'shelters', 'services', 
            # Content management
            'knowledge_documents', 'knowledge_chunks', 'blog_posts', 'blog_categories', 'blog_tags',
            # Operational data
            'participants', 'donations', 'transactions', 'appointments',
            # AI & Chat
            'chat_sessions', 'agent_configurations',
            # System management
            'feature_flags', 'system_alerts', 'platform_metrics', 'tenants',
            # Additional documented collections
            'user_profiles', 'shelter_services', 'newsletter_signups'
        ]
        
        # Analyze each existing collection in detail
        collection_details = {}
        for collection_name in existing_collections:
            try:
                collection_ref = self.db.collection(collection_name)
                
                # Get basic stats
                docs = list(collection_ref.limit(10).stream())
                total_docs = len(list(collection_ref.stream()))
                
                # Analyze sample documents for schema
                sample_schemas = []
                for doc in docs[:3]:  # Analyze first 3 documents
                    doc_data = doc.to_dict()
                    if doc_data:
                        sample_schemas.append({
                            'doc_id': doc.id,
                            'fields': list(doc_data.keys()),
                            'field_types': {k: type(v).__name__ for k, v in doc_data.items()},
                            'has_timestamps': any('created_at' in k or 'updated_at' in k or 'timestamp' in k.lower() for k in doc_data.keys())
                        })
                
                collection_details[collection_name] = {
                    'document_count': total_docs,
                    'sample_schemas': sample_schemas,
                    'status': 'existing',
                    'analysis': {
                        'has_data': total_docs > 0,
                        'schema_consistent': len(set(str(sorted(s['fields'])) for s in sample_schemas)) <= 1 if sample_schemas else False,
                        'has_metadata': any(s.get('has_timestamps', False) for s in sample_schemas)
                    }
                }
                
                logger.info(f"   📋 {collection_name}: {total_docs} documents")
                
            except Exception as e:
                collection_details[collection_name] = {
                    'error': str(e),
                    'status': 'error'
                }
                logger.warning(f"   ⚠️  Error analyzing {collection_name}: {e}")
        
        # Find discrepancies
        missing_collections = [col for col in documented_collections if col not in existing_collections]
        extra_collections = [col for col in existing_collections if col not in documented_collections]
        
        # Categorize existing collections
        core_collections = ['users', 'shelters', 'services']
        demo_collections = [col for col in existing_collections if col.startswith('demo_')]
        system_collections = ['tenants', 'translations', 'test', 'system_health']
        
        audit_result = {
            'existing_collections': existing_collections,
            'missing_collections': missing_collections,
            'extra_collections': extra_collections,
            'collection_details': collection_details,
            'categorization': {
                'core': [col for col in core_collections if col in existing_collections],
                'demo': demo_collections,
                'system': [col for col in system_collections if col in existing_collections],
                'content': [col for col in existing_collections if any(keyword in col for keyword in ['knowledge', 'blog', 'chat'])],
                'other': [col for col in existing_collections if col not in core_collections and not col.startswith('demo_') and col not in system_collections]
            },
            'summary': {
                'total_existing': len(existing_collections),
                'total_missing': len(missing_collections),
                'total_documented': len(documented_collections),
                'total_with_data': sum(1 for details in collection_details.values() if details.get('document_count', 0) > 0),
                'coverage_percentage': round((len(existing_collections) / len(documented_collections)) * 100, 1)
            }
        }
        
        logger.info(f"📊 Collection audit summary:")
        logger.info(f"   ✅ Existing: {audit_result['summary']['total_existing']}")
        logger.info(f"   ❌ Missing: {audit_result['summary']['total_missing']}")
        logger.info(f"   📈 Coverage: {audit_result['summary']['coverage_percentage']}%")
        logger.info(f"   📄 With data: {audit_result['summary']['total_with_data']}")
        
        return audit_result
    
    def audit_storage_structure(self) -> Dict[str, Any]:
        """Enhanced Firebase Storage structure audit with detailed analysis"""
        logger.info("🔍 Starting comprehensive Firebase Storage audit...")
        
        # Get all blobs with detailed analysis
        blobs = list(self.bucket.list_blobs())
        file_structure = {}
        file_details = []
        
        # Build file structure and collect detailed information
        for blob in blobs:
            path_parts = blob.name.split('/')
            current_level = file_structure
            
            # Build nested structure
            for i, part in enumerate(path_parts):
                if i == len(path_parts) - 1:  # Last part is filename
                    if part:  # Not empty (directories end with /)
                        current_level[part] = {
                            'type': 'file',
                            'size': blob.size,
                            'updated': blob.updated.isoformat() if blob.updated else None,
                            'content_type': blob.content_type
                        }
                else:  # Directory part
                    if part not in current_level:
                        current_level[part] = {}
                    current_level = current_level[part]
            
            # Collect file details
            file_details.append({
                'name': blob.name,
                'size': blob.size,
                'size_mb': round(blob.size / 1024 / 1024, 2) if blob.size else 0,
                'updated': blob.updated.isoformat() if blob.updated else None,
                'content_type': blob.content_type,
                'directory': '/'.join(path_parts[:-1]) if len(path_parts) > 1 else 'root',
                'extension': os.path.splitext(blob.name)[1].lower() if '.' in blob.name else None
            })
        
        # Expected structure based on documentation
        documented_structure = {
            'knowledge-base': {
                'public': {'description': 'Public knowledge documents'},
                'internal': {'description': 'Internal documentation'},
                'shelter-specific': {'description': 'Shelter-specific documents'},
                'embeddings': {'description': 'Document embeddings and vectors'}
            },
            'uploads': {
                'processing': {'description': 'Files being processed'},
                'failed': {'description': 'Failed upload attempts'},
                'completed': {'description': 'Successfully processed uploads'}
            },
            'processed': {
                'documents': {'description': 'Processed document files'},
                'summaries': {'description': 'Generated document summaries'},
                'extracted-text': {'description': 'Extracted text content'}
            },
            'profiles': {
                'avatars': {'description': 'User profile avatars'},
                'documents': {'description': 'User uploaded documents'}
            },
            'blog': {
                'images': {'description': 'Blog post images'},
                'media': {'description': 'Blog media files'}
            }
        }
        
        # Analyze current vs expected structure
        existing_directories = set()
        for blob_name in [blob.name for blob in blobs]:
            if '/' in blob_name:
                directory = blob_name.split('/')[0]
                existing_directories.add(directory)
        
        expected_directories = set(documented_structure.keys())
        missing_directories = expected_directories - existing_directories
        extra_directories = existing_directories - expected_directories
        
        # File type analysis
        file_types = defaultdict(int)
        total_size = 0
        for detail in file_details:
            if detail['extension']:
                file_types[detail['extension']] += 1
            total_size += detail['size'] or 0
        
        audit_result = {
            'actual_structure': file_structure,
            'documented_structure': documented_structure,
            'file_details': file_details,
            'analysis': {
                'total_files': len(file_details),
                'total_size_mb': round(total_size / 1024 / 1024, 2),
                'existing_directories': list(existing_directories),
                'missing_directories': list(missing_directories),
                'extra_directories': list(extra_directories),
                'file_types': dict(file_types),
                'directories_by_file_count': {
                    dir_name: len([f for f in file_details if f['directory'] == dir_name])
                    for dir_name in existing_directories
                }
            },
            'summary': {
                'directories_coverage': round((len(existing_directories) / len(expected_directories)) * 100, 1),
                'largest_directory': max(existing_directories, 
                                       key=lambda d: len([f for f in file_details if f['directory'] == d])) if existing_directories else None,
                'most_common_file_type': max(file_types.items(), key=lambda x: x[1])[0] if file_types else None
            }
        }
        
        logger.info(f"📁 Storage audit summary:")
        logger.info(f"   📊 Total files: {audit_result['analysis']['total_files']}")
        logger.info(f"   💾 Total size: {audit_result['analysis']['total_size_mb']} MB")
        logger.info(f"   📂 Directories: {len(existing_directories)} (coverage: {audit_result['summary']['directories_coverage']}%)")
        logger.info(f"   🗂️  Missing directories: {audit_result['analysis']['missing_directories']}")
        
        return audit_result
    
    def audit_indexes(self) -> Dict[str, Any]:
        """Enhanced Firestore indexes audit with performance recommendations"""
        logger.info("🔍 Starting comprehensive Firestore indexes audit...")
        
        # Required indexes based on SESSION-12 documentation and expected queries
        required_indexes = [
            {
                'collection': 'users',
                'fields': ['role', 'shelter_id', 'status'],
                'description': 'User role and shelter filtering with status',
                'priority': 'HIGH',
                'estimated_queries': ['role-based dashboards', 'shelter user lists', 'active user filtering']
            },
            {
                'collection': 'users',
                'fields': ['shelter_id', 'role', 'last_active'],
                'description': 'Shelter users ordered by activity',
                'priority': 'MEDIUM',
                'estimated_queries': ['shelter admin views', 'recent user activity']
            },
            {
                'collection': 'shelters',
                'fields': ['status', 'city', 'verification_status'],
                'description': 'Shelter filtering by status and location',
                'priority': 'HIGH',
                'estimated_queries': ['active shelters by city', 'verified shelter lists']
            },
            {
                'collection': 'services',
                'fields': ['shelter_id', 'category', 'isActive'],
                'description': 'Service filtering by shelter and category',
                'priority': 'HIGH',
                'estimated_queries': ['shelter service listings', 'category-based search']
            },
            {
                'collection': 'appointments',
                'fields': ['participant_id', 'status', 'date'],
                'description': 'Participant appointments by status and date',
                'priority': 'HIGH',
                'estimated_queries': ['participant appointment history', 'upcoming appointments']
            },
            {
                'collection': 'appointments',
                'fields': ['service_id', 'date', 'status'],
                'description': 'Service appointments by date and status',
                'priority': 'MEDIUM',
                'estimated_queries': ['service booking availability', 'appointment calendars']
            },
            {
                'collection': 'donations',
                'fields': ['participant_id', 'status', 'created_at'],
                'description': 'Participant donations by status and date',
                'priority': 'HIGH',
                'estimated_queries': ['participant donation history', 'recent donations']
            },
            {
                'collection': 'donations',
                'fields': ['status', 'created_at', 'amount.total'],
                'description': 'All donations by status, date, and amount',
                'priority': 'MEDIUM',
                'estimated_queries': ['donation analytics', 'financial reporting']
            },
            {
                'collection': 'knowledge_documents',
                'fields': ['access_level', 'categories', 'uploaded_at'],
                'description': 'Knowledge documents by access and category',
                'priority': 'HIGH',
                'estimated_queries': ['document access control', 'category browsing']
            },
            {
                'collection': 'chat_sessions',
                'fields': ['user_id', 'created_at', 'status'],
                'description': 'User chat sessions by date and status',
                'priority': 'MEDIUM',
                'estimated_queries': ['user chat history', 'session management']
            },
            {
                'collection': 'blog_posts',
                'fields': ['status', 'published_at', 'category'],
                'description': 'Blog posts by status, publication date, and category',
                'priority': 'MEDIUM',
                'estimated_queries': ['public blog listings', 'content management']
            }
        ]
        
        # Test performance of common queries without indexes
        query_performance_tests = []
        for index_spec in required_indexes[:3]:  # Test first 3 high-priority indexes
            collection_name = index_spec['collection']
            if collection_name in [col.id for col in self.db.collections()]:
                try:
                    # Test a simple query that would benefit from the index
                    start_time = datetime.now()
                    collection_ref = self.db.collection(collection_name)
                    
                    # Try a basic query on the first field
                    first_field = index_spec['fields'][0]
                    results = list(collection_ref.limit(10).stream())
                    
                    end_time = datetime.now()
                    duration_ms = (end_time - start_time).total_seconds() * 1000
                    
                    query_performance_tests.append({
                        'collection': collection_name,
                        'field_tested': first_field,
                        'duration_ms': round(duration_ms, 2),
                        'documents_tested': len(results),
                        'performance_grade': 'GOOD' if duration_ms < 100 else 'SLOW' if duration_ms < 500 else 'CRITICAL'
                    })
                    
                except Exception as e:
                    query_performance_tests.append({
                        'collection': collection_name,
                        'error': str(e),
                        'status': 'FAILED'
                    })
        
        audit_result = {
            'required_indexes': required_indexes,
            'query_performance_tests': query_performance_tests,
            'analysis': {
                'total_required_indexes': len(required_indexes),
                'high_priority_indexes': len([idx for idx in required_indexes if idx['priority'] == 'HIGH']),
                'medium_priority_indexes': len([idx for idx in required_indexes if idx['priority'] == 'MEDIUM']),
                'collections_needing_indexes': list(set([idx['collection'] for idx in required_indexes])),
                'performance_issues': [test for test in query_performance_tests if test.get('performance_grade') in ['SLOW', 'CRITICAL']]
            },
            'recommendations': {
                'immediate_action': [idx for idx in required_indexes if idx['priority'] == 'HIGH'],
                'next_phase': [idx for idx in required_indexes if idx['priority'] == 'MEDIUM'],
                'monitoring_needed': 'Set up query performance monitoring after index creation'
            },
            'notes': [
                'Index creation should be done via Firebase Console or firebase deploy --only firestore:indexes',
                'Some indexes may already exist - verify in Firebase Console',
                'Index creation can take time for large collections',
                'Monitor query costs after index implementation'
            ]
        }
        
        logger.info(f"📊 Index audit summary:")
        logger.info(f"   🎯 Required indexes: {audit_result['analysis']['total_required_indexes']}")
        logger.info(f"   🔥 High priority: {audit_result['analysis']['high_priority_indexes']}")
        logger.info(f"   📈 Performance issues found: {len(audit_result['analysis']['performance_issues'])}")
        
        return audit_result
    
    def create_missing_collections(self, missing_collections: List[str], dry_run: bool = False) -> Dict[str, Any]:
        """Create missing collections with proper structure and schema templates"""
        action = "Simulating creation of" if dry_run else "Creating"
        logger.info(f"🔧 {action} {len(missing_collections)} missing collections...")
        
        results = {}
        
        # Collection templates with proper schemas
        collection_templates = {
            'blog_posts': {
                '_metadata': {
                    'collection_type': 'content_management',
                    'description': 'Blog posts and articles',
                    'schema_version': '1.0',
                    'required_fields': ['title', 'content', 'author', 'status', 'created_at'],
                    'created_by': 'database_auditor'
                }
            },
            'blog_categories': {
                '_metadata': {
                    'collection_type': 'content_taxonomy',
                    'description': 'Blog post categories',
                    'schema_version': '1.0',
                    'required_fields': ['name', 'slug', 'description', 'color'],
                    'created_by': 'database_auditor'
                }
            },
            'blog_tags': {
                '_metadata': {
                    'collection_type': 'content_taxonomy',
                    'description': 'Blog post tags',
                    'schema_version': '1.0',
                    'required_fields': ['name', 'slug', 'usage_count'],
                    'created_by': 'database_auditor'
                }
            },
            'participants': {
                '_metadata': {
                    'collection_type': 'core_operational',
                    'description': 'Program participants',
                    'schema_version': '1.0',
                    'required_fields': ['firstName', 'lastName', 'shelter_id', 'status', 'created_at'],
                    'security_note': 'Contains PII - ensure proper access controls',
                    'created_by': 'database_auditor'
                }
            },
            'donations': {
                '_metadata': {
                    'collection_type': 'financial',
                    'description': 'Donation transactions',
                    'schema_version': '1.0',
                    'required_fields': ['participant_id', 'amount', 'status', 'payment_method', 'created_at'],
                    'security_note': 'Contains financial data - ensure PCI compliance',
                    'created_by': 'database_auditor'
                }
            },
            'transactions': {
                '_metadata': {
                    'collection_type': 'financial',
                    'description': 'All financial transactions',
                    'schema_version': '1.0',
                    'required_fields': ['type', 'amount', 'status', 'reference_id', 'created_at'],
                    'created_by': 'database_auditor'
                }
            },
            'appointments': {
                '_metadata': {
                    'collection_type': 'operational',
                    'description': 'Service appointments and bookings',
                    'schema_version': '1.0',
                    'required_fields': ['participant_id', 'service_id', 'date', 'status'],
                    'created_by': 'database_auditor'
                }
            },
            'agent_configurations': {
                '_metadata': {
                    'collection_type': 'ai_system',
                    'description': 'AI agent configurations and settings',
                    'schema_version': '1.0',
                    'required_fields': ['name', 'type', 'configuration', 'status'],
                    'created_by': 'database_auditor'
                }
            },
            'feature_flags': {
                '_metadata': {
                    'collection_type': 'system_management',
                    'description': 'Feature flags for system configuration',
                    'schema_version': '1.0',
                    'required_fields': ['name', 'enabled', 'description', 'target_audience'],
                    'created_by': 'database_auditor'
                }
            },
            'system_alerts': {
                '_metadata': {
                    'collection_type': 'system_management',
                    'description': 'System alerts and notifications',
                    'schema_version': '1.0',
                    'required_fields': ['type', 'message', 'severity', 'status', 'created_at'],
                    'created_by': 'database_auditor'
                }
            },
            'platform_metrics': {
                '_metadata': {
                    'collection_type': 'analytics',
                    'description': 'Platform metrics and KPIs',
                    'schema_version': '1.0',
                    'required_fields': ['metric_name', 'value', 'timestamp', 'category'],
                    'created_by': 'database_auditor'
                }
            },
            'user_profiles': {
                '_metadata': {
                    'collection_type': 'user_management',
                    'description': 'Extended user profile information',
                    'schema_version': '1.0',
                    'required_fields': ['user_id', 'profile_data', 'privacy_settings', 'updated_at'],
                    'created_by': 'database_auditor'
                }
            },
            'shelter_services': {
                '_metadata': {
                    'collection_type': 'operational',
                    'description': 'Shelter-specific service offerings',
                    'schema_version': '1.0',
                    'required_fields': ['shelter_id', 'service_type', 'capacity', 'schedule'],
                    'created_by': 'database_auditor'
                }
            }
        }
        
        for collection_name in missing_collections:
            try:
                if not dry_run:
                    # Get the appropriate template or use default
                    template = collection_templates.get(collection_name, {
                        '_metadata': {
                            'collection_type': 'general',
                            'description': f'{collection_name.replace("_", " ").title()} collection',
                            'schema_version': '1.0',
                            'created_by': 'database_auditor',
                            'created_at': firestore.SERVER_TIMESTAMP
                        }
                    })
                    
                    # Create collection with metadata document
                    for doc_id, doc_data in template.items():
                        doc_data['created_at'] = firestore.SERVER_TIMESTAMP
                        doc_ref = self.db.collection(collection_name).document(doc_id)
                        doc_ref.set(doc_data)
                
                results[collection_name] = {
                    'status': 'created' if not dry_run else 'simulated',
                    'success': True,
                    'template_used': collection_name in collection_templates,
                    'has_schema': collection_name in collection_templates
                }
                
                status_icon = "✅" if not dry_run else "🔮"
                logger.info(f"   {status_icon} {'Created' if not dry_run else 'Would create'} collection: {collection_name}")
                
            except Exception as e:
                results[collection_name] = {
                    'status': 'failed',
                    'success': False,
                    'error': str(e)
                }
                logger.error(f"   ❌ Failed to {'create' if not dry_run else 'simulate'} {collection_name}: {e}")
        
        success_count = sum(1 for r in results.values() if r.get('success'))
        logger.info(f"📊 Collection creation summary: {success_count}/{len(missing_collections)} successful")
        
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
    
    def run_complete_audit(self, dry_run: bool = False, fix_issues: bool = False) -> Dict[str, Any]:
        """Run enhanced complete database audit with optional fixes"""
        audit_start_time = datetime.now()
        
        action_verb = "Simulating" if dry_run else "Running"
        logger.info(f"🚀 {action_verb} comprehensive database audit and infrastructure analysis...")
        logger.info(f"📅 Audit started at: {audit_start_time.isoformat()}")
        logger.info(f"🔧 Dry run mode: {'ON' if dry_run else 'OFF'}")
        logger.info(f"🛠️  Fix issues: {'ON' if fix_issues else 'OFF'}")
        
        audit_results = {
            'audit_metadata': {
                'start_time': audit_start_time.isoformat(),
                'dry_run': dry_run,
                'fix_issues': fix_issues,
                'auditor_version': '2.0_enhanced',
                'session': 'SESSION-12_DATABASE_AUDIT'
            }
        }
        
        try:
            # Phase 1: Comprehensive Infrastructure Audit
            logger.info("\n" + "="*60)
            logger.info("🔍 PHASE 1: INFRASTRUCTURE AUDIT")
            logger.info("="*60)
            
            audit_results['collections'] = self.audit_collections()
            audit_results['storage'] = self.audit_storage_structure()
            audit_results['indexes'] = self.audit_indexes()
            
            # Phase 2: Issue Resolution (if enabled)
            if fix_issues and audit_results['collections']['missing_collections']:
                logger.info("\n" + "="*60)
                logger.info("🔧 PHASE 2: ISSUE RESOLUTION")
                logger.info("="*60)
                
                audit_results['collection_creation'] = self.create_missing_collections(
                    audit_results['collections']['missing_collections'], dry_run=dry_run
                )
                
                audit_results['standardization'] = self.standardize_data_structures()
                audit_results['storage_creation'] = self.create_storage_structure()
            
            # Phase 3: Comprehensive Analysis and Recommendations
            logger.info("\n" + "="*60)
            logger.info("📊 PHASE 3: ANALYSIS & RECOMMENDATIONS")
            logger.info("="*60)
            
            audit_results['analysis'] = self._generate_comprehensive_analysis(audit_results)
            audit_results['recommendations'] = self._generate_action_recommendations(audit_results)
            
        except Exception as e:
            logger.error(f"❌ Audit failed with error: {e}")
            audit_results['error'] = str(e)
            audit_results['status'] = 'FAILED'
            return audit_results
        
        # Final Summary
        audit_end_time = datetime.now()
        audit_duration = (audit_end_time - audit_start_time).total_seconds()
        
        audit_results['audit_metadata']['end_time'] = audit_end_time.isoformat()
        audit_results['audit_metadata']['duration_seconds'] = round(audit_duration, 2)
        audit_results['status'] = 'COMPLETED'
        
        # Generate executive summary
        self._log_executive_summary(audit_results)
        
        logger.info(f"✅ Complete database audit finished in {audit_duration:.2f} seconds")
        return audit_results
    
    def _generate_comprehensive_analysis(self, audit_results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive analysis of audit results"""
        collections_data = audit_results.get('collections', {})
        storage_data = audit_results.get('storage', {})
        indexes_data = audit_results.get('indexes', {})
        
        analysis = {
            'database_health_score': 0,
            'critical_issues': [],
            'infrastructure_gaps': [],
            'data_quality_concerns': [],
            'performance_issues': [],
            'security_concerns': [],
            'recommendations_priority': {
                'immediate': [],
                'high': [],
                'medium': [],
                'low': []
            }
        }
        
        # Calculate database health score (0-100)
        health_factors = {
            'collections_coverage': collections_data.get('summary', {}).get('coverage_percentage', 0),
            'collections_with_data': (collections_data.get('summary', {}).get('total_with_data', 0) / 
                                   max(collections_data.get('summary', {}).get('total_existing', 1), 1)) * 100,
            'storage_organization': storage_data.get('summary', {}).get('directories_coverage', 0),
            'index_coverage': min(100, (indexes_data.get('analysis', {}).get('high_priority_indexes', 0) / 6) * 100)
        }
        
        analysis['database_health_score'] = round(sum(health_factors.values()) / len(health_factors), 1)
        
        # Identify critical issues
        missing_collections = collections_data.get('missing_collections', [])
        if len(missing_collections) > 5:
            analysis['critical_issues'].append(f"Missing {len(missing_collections)} critical collections")
        
        performance_issues = indexes_data.get('analysis', {}).get('performance_issues', [])
        if performance_issues:
            analysis['performance_issues'].extend([f"Query performance issue in {issue.get('collection')}" for issue in performance_issues])
        
        # Storage analysis
        missing_dirs = storage_data.get('analysis', {}).get('missing_directories', [])
        if missing_dirs:
            analysis['infrastructure_gaps'].append(f"Missing storage directories: {', '.join(missing_dirs)}")
        
        return analysis
    
    def _generate_action_recommendations(self, audit_results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate prioritized action recommendations"""
        collections_data = audit_results.get('collections', {})
        storage_data = audit_results.get('storage', {})
        indexes_data = audit_results.get('indexes', {})
        
        recommendations = {
            'immediate_actions': [],
            'next_phase_actions': [],
            'optimization_actions': [],
            'monitoring_setup': [],
            'estimated_effort': {
                'immediate': '2-4 hours',
                'next_phase': '1-2 hours',
                'optimization': '1-2 hours',
                'monitoring': '30 minutes'
            }
        }
        
        # Immediate actions
        missing_collections = collections_data.get('missing_collections', [])
        if missing_collections:
            recommendations['immediate_actions'].append({
                'action': 'Create missing collections',
                'details': f"Create {len(missing_collections)} missing collections: {', '.join(missing_collections[:5])}{'...' if len(missing_collections) > 5 else ''}",
                'priority': 'CRITICAL',
                'estimated_time': '1-2 hours'
            })
        
        # High priority indexes
        high_priority_indexes = indexes_data.get('recommendations', {}).get('immediate_action', [])
        if high_priority_indexes:
            recommendations['immediate_actions'].append({
                'action': 'Create high-priority indexes',
                'details': f"Create {len(high_priority_indexes)} performance-critical indexes",
                'priority': 'HIGH',
                'estimated_time': '30 minutes'
            })
        
        # Storage organization
        missing_dirs = storage_data.get('analysis', {}).get('missing_directories', [])
        if missing_dirs:
            recommendations['next_phase_actions'].append({
                'action': 'Organize storage structure',
                'details': f"Create missing directories: {', '.join(missing_dirs)}",
                'priority': 'MEDIUM',
                'estimated_time': '30 minutes'
            })
        
        return recommendations
    
    def _log_executive_summary(self, audit_results: Dict[str, Any]):
        """Log executive summary of audit results"""
        logger.info("\n" + "="*80)
        logger.info("📋 EXECUTIVE SUMMARY - SESSION 12 DATABASE AUDIT")
        logger.info("="*80)
        
        # Health score
        health_score = audit_results.get('analysis', {}).get('database_health_score', 0)
        health_emoji = "🟢" if health_score >= 80 else "🟡" if health_score >= 60 else "🔴"
        logger.info(f"{health_emoji} Database Health Score: {health_score}/100")
        
        # Key metrics
        collections_data = audit_results.get('collections', {})
        logger.info(f"📊 Collections: {collections_data.get('summary', {}).get('total_existing', 0)} existing, "
                   f"{len(collections_data.get('missing_collections', []))} missing")
        
        storage_data = audit_results.get('storage', {})
        logger.info(f"💾 Storage: {storage_data.get('analysis', {}).get('total_files', 0)} files, "
                   f"{storage_data.get('analysis', {}).get('total_size_mb', 0)} MB")
        
        # Critical issues
        critical_issues = audit_results.get('analysis', {}).get('critical_issues', [])
        if critical_issues:
            logger.info(f"🚨 Critical Issues: {len(critical_issues)}")
            for issue in critical_issues[:3]:
                logger.info(f"   • {issue}")
        else:
            logger.info("✅ No critical issues found")
        
        # Next steps
        immediate_actions = audit_results.get('recommendations', {}).get('immediate_actions', [])
        logger.info(f"🎯 Immediate Actions Required: {len(immediate_actions)}")
        for action in immediate_actions[:3]:
            logger.info(f"   • {action.get('action')}: {action.get('details')}")
        
        logger.info("="*80)

def main():
    """Enhanced main execution function with command-line options"""
    import argparse
    
    parser = argparse.ArgumentParser(description='SHELTR-AI Enhanced Database Auditor - Session 12')
    parser.add_argument('--dry-run', action='store_true', help='Run in simulation mode without making changes')
    parser.add_argument('--fix-issues', action='store_true', help='Automatically fix identified issues')
    parser.add_argument('--audit-only', action='store_true', help='Run audit only without fixes (default)')
    parser.add_argument('--output-file', default='database_audit_results.json', help='Output file for results')
    parser.add_argument('--verbose', action='store_true', help='Enable verbose logging')
    
    args = parser.parse_args()
    
    # Adjust logging level if verbose
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    try:
        logger.info("🚀 Starting SHELTR-AI Enhanced Database Auditor - Session 12")
        logger.info(f"🎯 Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
        logger.info(f"🔧 Fix issues: {'ON' if args.fix_issues else 'OFF'}")
        
        # Initialize auditor
        auditor = DatabaseAuditor()
        
        # Run comprehensive audit
        results = auditor.run_complete_audit(
            dry_run=args.dry_run,
            fix_issues=args.fix_issues or not args.audit_only
        )
        
        # Save results to file with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"database_audit_results_{timestamp}.json"
        
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
        logger.info(f"📄 Detailed audit results saved to: {output_file}")
        
        # Generate summary report
        _generate_summary_report(results, output_file.replace('.json', '_summary.md'))
        
        # Exit code based on health score
        health_score = results.get('analysis', {}).get('database_health_score', 0)
        if health_score >= 80:
            logger.info("✅ Audit completed successfully - Database health is GOOD")
            exit_code = 0
        elif health_score >= 60:
            logger.warning("⚠️ Audit completed - Database health needs ATTENTION")
            exit_code = 1
        else:
            logger.error("❌ Audit completed - Database health is CRITICAL")
            exit_code = 2
        
        return exit_code
        
    except Exception as e:
        logger.error(f"❌ Database audit failed: {e}")
        import traceback
        logger.error(f"Stack trace: {traceback.format_exc()}")
        return 3

def _generate_summary_report(results: Dict[str, Any], output_file: str):
    """Generate a markdown summary report"""
    try:
        with open(output_file, 'w') as f:
            f.write("# SHELTR-AI Database Audit Report - Session 12\n\n")
            
            # Metadata
            metadata = results.get('audit_metadata', {})
            f.write(f"**Audit Date**: {metadata.get('start_time', 'N/A')}\n")
            f.write(f"**Duration**: {metadata.get('duration_seconds', 0)} seconds\n")
            f.write(f"**Mode**: {'DRY RUN' if metadata.get('dry_run') else 'LIVE'}\n\n")
            
            # Health Score
            analysis = results.get('analysis', {})
            health_score = analysis.get('database_health_score', 0)
            health_status = "🟢 GOOD" if health_score >= 80 else "🟡 NEEDS ATTENTION" if health_score >= 60 else "🔴 CRITICAL"
            f.write(f"## Database Health Score: {health_score}/100 {health_status}\n\n")
            
            # Collections Summary
            collections = results.get('collections', {})
            f.write("## Collections Analysis\n")
            f.write(f"- **Existing**: {collections.get('summary', {}).get('total_existing', 0)}\n")
            f.write(f"- **Missing**: {len(collections.get('missing_collections', []))}\n")
            f.write(f"- **Coverage**: {collections.get('summary', {}).get('coverage_percentage', 0)}%\n\n")
            
            # Storage Summary
            storage = results.get('storage', {})
            f.write("## Storage Analysis\n")
            f.write(f"- **Total Files**: {storage.get('analysis', {}).get('total_files', 0)}\n")
            f.write(f"- **Total Size**: {storage.get('analysis', {}).get('total_size_mb', 0)} MB\n")
            f.write(f"- **Directory Coverage**: {storage.get('summary', {}).get('directories_coverage', 0)}%\n\n")
            
            # Critical Issues
            critical_issues = analysis.get('critical_issues', [])
            if critical_issues:
                f.write("## Critical Issues\n")
                for issue in critical_issues:
                    f.write(f"- {issue}\n")
                f.write("\n")
            
            # Recommendations
            recommendations = results.get('recommendations', {})
            immediate_actions = recommendations.get('immediate_actions', [])
            if immediate_actions:
                f.write("## Immediate Actions Required\n")
                for action in immediate_actions:
                    f.write(f"- **{action.get('action')}**: {action.get('details')}\n")
                f.write("\n")
        
        logger.info(f"📄 Summary report saved to: {output_file}")
        
    except Exception as e:
        logger.warning(f"⚠️ Failed to generate summary report: {e}")

if __name__ == "__main__":
    exit_code = main()
    exit(exit_code)
