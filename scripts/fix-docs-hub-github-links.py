#!/usr/bin/env python3
"""
Fix Docs Hub GitHub Links
Updates the github_path field for specific documents in Firestore
"""

import sys
import os

# Add the parent directory to the path so we can import from apps/api
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'apps', 'api'))

from services.firebase_service import firebase_service
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fix_github_links():
    """Update github_path for Hacking Homelessness and Platform Overview"""
    
    try:
        db = firebase_service.db
        
        # Documents to update with their correct github_path
        updates = {
            'hacking-homelessness': 'docs/overview/hacking_homelessness.md',
            'platform-overview': 'docs/overview/platform-overview.md',
            'whitepaper': 'docs/architecture/technical/whitepaper_final.md',
            'system-design': 'docs/architecture/platform/system-design.md',
            'roadmap': 'docs/development/roadmap.md',
            'donor-guide': 'docs/user-guides/donor-guide.md',
            'participant-guide': 'docs/user-guides/participant-guide.md',
        }
        
        # Try multiple possible slugs for agent architecture
        agent_slugs = ['agent-architecture', 'agent-system', 'ai-agents', 'chatbot-architecture']
        
        logger.info("🔗 Fixing GitHub links for docs hub documents...")
        
        for slug, github_path in updates.items():
            # Find document by slug
            docs_query = db.collection('knowledge_documents') \
                .where('hub_slug', '==', slug) \
                .limit(1) \
                .stream()
            
            doc_list = list(docs_query)
            
            if not doc_list:
                logger.warning(f"⚠️  Document with slug '{slug}' not found")
                continue
            
            doc_ref = doc_list[0]
            doc_id = doc_ref.id
            doc_data = doc_ref.to_dict()
            
            # Update github_path
            db.collection('knowledge_documents').document(doc_id).update({
                'github_path': github_path
            })
            
            logger.info(f"✅ Updated '{doc_data.get('title')}' (slug: {slug})")
            logger.info(f"   GitHub path: {github_path}")
            logger.info(f"   Full URL: https://github.com/mrj0nesmtl/sheltr-ai/blob/main/{github_path}")
        
        # Try to find and update agent architecture with multiple possible slugs
        logger.info("\n🔍 Searching for Agent Architecture document...")
        agent_github_path = 'docs/features/agents/AGENT-ARCHITECTURE.md'
        agent_found = False
        
        for agent_slug in agent_slugs:
            docs_query = db.collection('knowledge_documents') \
                .where('hub_slug', '==', agent_slug) \
                .limit(1) \
                .stream()
            
            doc_list = list(docs_query)
            
            if doc_list:
                doc_ref = doc_list[0]
                doc_id = doc_ref.id
                doc_data = doc_ref.to_dict()
                
                # Update github_path
                db.collection('knowledge_documents').document(doc_id).update({
                    'github_path': agent_github_path
                })
                
                logger.info(f"✅ Updated '{doc_data.get('title')}' (slug: {agent_slug})")
                logger.info(f"   GitHub path: {agent_github_path}")
                logger.info(f"   Full URL: https://github.com/mrj0nesmtl/sheltr-ai/blob/main/{agent_github_path}")
                agent_found = True
                break
        
        if not agent_found:
            logger.warning(f"⚠️  Agent Architecture document not found with any of these slugs: {agent_slugs}")
        
        logger.info("\n✅ GitHub links updated successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error updating GitHub links: {str(e)}")
        raise

if __name__ == "__main__":
    print("🚀 Starting GitHub links fix...")
    fix_github_links()
    print("\n✅ Process completed!")

