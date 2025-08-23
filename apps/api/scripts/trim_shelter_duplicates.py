#!/usr/bin/env python3
"""
SHELTR-AI Shelter Duplicate Trimming Script
Query and remove duplicate shelters, keeping exactly 10 organizations
Preserve Old Brewery Mission with attached shelter admin and participant
"""

import firebase_admin
from firebase_admin import firestore, credentials
import json
import logging
import sys
from collections import defaultdict

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ShelterTrimmer:
    """Trim shelter duplicates while preserving critical data"""
    
    def __init__(self):
        """Initialize Firebase client"""
        try:
            if not firebase_admin._apps:
                firebase_admin.initialize_app()
            
            self.db = firestore.client()
            logger.info("✅ Firebase initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Firebase initialization failed: {e}")
            raise
    
    def analyze_shelters(self):
        """Analyze current shelter data and find duplicates"""
        try:
            logger.info("🔍 Analyzing shelter collection for duplicates...")
            
            # Get all shelters
            shelters_ref = self.db.collection('shelters')
            shelters = shelters_ref.stream()
            
            shelter_data = []
            name_groups = defaultdict(list)
            
            for shelter in shelters:
                data = shelter.to_dict()
                if not data:  # Skip if document is empty
                    logger.warning(f"⚠️ Empty shelter document: {shelter.id}")
                    continue
                    
                shelter_info = {
                    'id': shelter.id,
                    'name': data.get('name', 'Unknown'),
                    'address': data.get('address', ''),
                    'city': data.get('city', ''),
                    'capacity': data.get('capacity', 0),
                    'status': data.get('status', 'unknown'),
                    'created_at': data.get('created_at'),
                    'primary_admin': data.get('primary_admin', {})
                }
                shelter_data.append(shelter_info)
                logger.debug(f"   Added shelter: {shelter_info['name']} (ID: {shelter_info['id']})")
                
                # Group by name for duplicate detection
                name_groups[shelter_info['name']].append(shelter_info)
            
            logger.info(f"📊 Found {len(shelter_data)} total shelters")
            
            # Find duplicates
            duplicates = {}
            for name, shelters in name_groups.items():
                if len(shelters) > 1:
                    duplicates[name] = shelters
                    logger.info(f"🔄 Duplicate found: '{name}' has {len(shelters)} entries")
            
            # Find critical shelters (Old Brewery Mission and those with admins)
            critical_shelters = []
            for shelter in shelter_data:
                try:
                    if ('old brewery mission' in shelter['name'].lower() or
                        'old-brewery-mission' in shelter['id'].lower() or
                        shelter.get('primary_admin', {}).get('user_id')):
                        critical_shelters.append(shelter)
                        logger.info(f"🔒 Critical shelter found: {shelter['name']} (ID: {shelter['id']})")
                except Exception as e:
                    logger.error(f"❌ Error processing shelter {shelter}: {e}")
                    continue
            
            return {
                'total_shelters': len(shelter_data),
                'all_shelters': shelter_data,
                'duplicates': duplicates,
                'critical_shelters': critical_shelters
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing shelters: {e}")
            return None
    
    def check_user_attachments(self):
        """Check which shelters have users attached"""
        try:
            logger.info("👥 Checking user attachments to shelters...")
            
            users_ref = self.db.collection('users')
            users = users_ref.stream()
            
            shelter_user_map = defaultdict(list)
            
            for user in users:
                user_data = user.to_dict()
                shelter_id = user_data.get('shelter_id')
                if shelter_id:
                    shelter_user_map[shelter_id].append({
                        'user_id': user.id,
                        'email': user_data.get('email', ''),
                        'role': user_data.get('role', ''),
                        'name': f"{user_data.get('firstName', '')} {user_data.get('lastName', '')}"
                    })
            
            logger.info(f"📋 Found users attached to {len(shelter_user_map)} shelters")
            for shelter_id, users in shelter_user_map.items():
                logger.info(f"   {shelter_id}: {len(users)} users")
                for user in users:
                    logger.info(f"      - {user['name']} ({user['role']}) - {user['email']}")
            
            return shelter_user_map
            
        except Exception as e:
            logger.error(f"❌ Error checking user attachments: {e}")
            return {}
    
    def select_best_shelters(self, analysis, user_attachments):
        """Select the best 10 shelters to keep"""
        try:
            logger.info("🎯 Selecting best 10 shelters to keep...")
            
            all_shelters = analysis['all_shelters']
            duplicates = analysis['duplicates']
            
            # Priority scoring system
            shelters_with_scores = []
            
            for shelter in all_shelters:
                score = 0
                reasons = []
                
                # High priority: Has users attached
                if shelter['id'] in user_attachments:
                    score += 100
                    user_count = len(user_attachments[shelter['id']])
                    score += user_count * 10
                    reasons.append(f"Has {user_count} users attached")
                
                # High priority: Old Brewery Mission
                if 'old brewery mission' in shelter['name'].lower():
                    score += 200
                    reasons.append("Old Brewery Mission (critical)")
                
                # Medium priority: Has admin assigned
                if shelter.get('primary_admin', {}).get('user_id'):
                    score += 50
                    reasons.append("Has primary admin")
                
                # Medium priority: Active status
                if shelter.get('status') == 'active':
                    score += 30
                    reasons.append("Active status")
                
                # Low priority: Has capacity data
                if shelter.get('capacity', 0) > 0:
                    score += 10
                    reasons.append(f"Has capacity ({shelter['capacity']})")
                
                # Low priority: Has address
                if shelter.get('address'):
                    score += 5
                    reasons.append("Has address")
                
                shelters_with_scores.append({
                    'shelter': shelter,
                    'score': score,
                    'reasons': reasons
                })
            
            # Sort by score (highest first)
            shelters_with_scores.sort(key=lambda x: x['score'], reverse=True)
            
            # Select top 10
            selected_shelters = shelters_with_scores[:10]
            to_delete = shelters_with_scores[10:]
            
            logger.info("✅ Selected shelters to KEEP (top 10):")
            for i, item in enumerate(selected_shelters, 1):
                shelter = item['shelter']
                logger.info(f"   {i}. {shelter['name']} (Score: {item['score']}) - {', '.join(item['reasons'])}")
            
            logger.info(f"❌ Shelters to DELETE ({len(to_delete)}):")
            for item in to_delete:
                shelter = item['shelter']
                logger.info(f"   - {shelter['name']} (ID: {shelter['id']}) - Score: {item['score']}")
            
            return {
                'keep': [item['shelter'] for item in selected_shelters],
                'delete': [item['shelter'] for item in to_delete]
            }
            
        except Exception as e:
            logger.error(f"❌ Error selecting shelters: {e}")
            return None
    
    def execute_trimming(self, selection, dry_run=True):
        """Execute the shelter trimming (with dry-run option)"""
        try:
            to_delete = selection['delete']
            
            if dry_run:
                logger.info(f"🔮 DRY RUN: Would delete {len(to_delete)} shelters")
                return True
            
            logger.info(f"🗑️  DELETING {len(to_delete)} duplicate/excess shelters...")
            
            deleted_count = 0
            for shelter in to_delete:
                try:
                    shelter_ref = self.db.collection('shelters').document(shelter['id'])
                    shelter_ref.delete()
                    deleted_count += 1
                    logger.info(f"   ✅ Deleted: {shelter['name']} (ID: {shelter['id']})")
                except Exception as e:
                    logger.error(f"   ❌ Failed to delete {shelter['name']}: {e}")
            
            logger.info(f"✅ Successfully deleted {deleted_count}/{len(to_delete)} shelters")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error executing trimming: {e}")
            return False
    
    def run_trimming(self, dry_run=True):
        """Run complete shelter trimming process"""
        try:
            logger.info("🚀 Starting shelter trimming process...")
            
            # Analyze current state
            analysis = self.analyze_shelters()
            if not analysis:
                return False
            
            # Check user attachments
            user_attachments = self.check_user_attachments()
            
            # Select best shelters
            selection = self.select_best_shelters(analysis, user_attachments)
            if not selection:
                return False
            
            # Execute trimming
            success = self.execute_trimming(selection, dry_run=dry_run)
            
            if success:
                mode = "simulation" if dry_run else "trimming"
                logger.info(f"✅ Shelter {mode} completed successfully!")
                
                if dry_run:
                    logger.info("💡 Run with --execute flag to perform actual deletion")
                
                return True
            else:
                logger.error(f"❌ Shelter {mode} failed!")
                return False
                
        except Exception as e:
            logger.error(f"❌ Shelter trimming failed: {e}")
            return False

def main():
    """Main execution function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='SHELTR-AI Shelter Duplicate Trimmer')
    parser.add_argument('--execute', action='store_true', help='Actually delete shelters (default is dry-run)')
    parser.add_argument('--analyze-only', action='store_true', help='Only analyze, do not trim')
    
    args = parser.parse_args()
    
    try:
        trimmer = ShelterTrimmer()
        
        if args.analyze_only:
            analysis = trimmer.analyze_shelters()
            user_attachments = trimmer.check_user_attachments()
            logger.info("📊 Analysis complete. Use --execute to perform trimming.")
            return 0
        
        dry_run = not args.execute
        success = trimmer.run_trimming(dry_run=dry_run)
        
        if success:
            logger.info("🎉 Shelter trimming operation completed successfully!")
            return 0
        else:
            logger.error("❌ Shelter trimming operation failed!")
            return 1
            
    except Exception as e:
        logger.error(f"❌ Script execution failed: {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
