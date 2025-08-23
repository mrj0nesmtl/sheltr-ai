#!/usr/bin/env python3
"""
Frontend GitHub Links Updater
Updates hardcoded GitHub links in frontend components to maintain compatibility
"""

import os
import re
from pathlib import Path

def update_github_links():
    """Update hardcoded GitHub links in frontend components"""
    
    # Define the frontend docs directory
    frontend_docs_dir = Path("apps/web/src/app/docs")
    
    # GitHub link pattern to match
    github_pattern = r'https://github\.com/mrj0nesmtl/sheltr-ai/blob/main/docs/([^"\']+)'
    
    # Files that contain GitHub links (from our analysis)
    files_to_update = [
        "hacking-homelessness/page.tsx",
        "website-architecture/page.tsx", 
        "roadmap/page.tsx",
        "whitepaper/page.tsx",
        "blockchain/page.tsx",
        "participant-guide/page.tsx",
        "api/page.tsx",
        "page.tsx"  # Main docs page
    ]
    
    print("🔗 Updating GitHub links in frontend components...")
    
    updates_made = []
    
    for file_path in files_to_update:
        full_path = frontend_docs_dir / file_path
        
        if not full_path.exists():
            print(f"⚠️  File not found: {full_path}")
            continue
            
        try:
            # Read the file
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Find and replace GitHub links
            def replace_link(match):
                old_path = match.group(1)
                
                # Map old paths to new paths (preserving GitHub structure)
                path_mapping = {
                    '01-overview/hacking_homelessness.md': '01-overview/hacking_homelessness.md',
                    '02-architecture/website-architecture.md': '02-architecture/website-architecture.md',
                    '02-architecture/whitepaper_final.md': '02-architecture/whitepaper_final.md',
                    '02-architecture/technical/blockchain.md': '02-architecture/technical/blockchain.md',
                    '03-api/README.md': '03-api/README.md',
                    '04-development/dev-roadmap.md': '04-development/dev-roadmap.md',
                    '06-user-guides/participant-guide.md': '06-user-guides/participant-guide.md',
                    '06-user-guides/shelter-admin-guide.md': '06-user-guides/shelter-admin-guide.md',
                    '06-user-guides/donor-guide.md': '06-user-guides/donor-guide.md',
                }
                
                # Keep the same path (GitHub structure remains unchanged)
                new_path = path_mapping.get(old_path, old_path)
                new_url = f'https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/{new_path}'
                
                return new_url
            
            # Replace all GitHub links
            updated_content = re.sub(github_pattern, replace_link, content)
            
            # Check if any changes were made
            if updated_content != original_content:
                # Write the updated content back
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                
                # Count the number of links updated
                links_updated = len(re.findall(github_pattern, original_content))
                
                print(f"✅ Updated {links_updated} links in: {file_path}")
                updates_made.append({
                    'file': str(file_path),
                    'links_updated': links_updated
                })
            else:
                print(f"ℹ️  No updates needed for: {file_path}")
                
        except Exception as e:
            print(f"❌ Error updating {file_path}: {e}")
    
    # Summary
    total_files_updated = len(updates_made)
    total_links_updated = sum(update['links_updated'] for update in updates_made)
    
    print(f"\n📊 Update Summary:")
    print(f"📁 Files updated: {total_files_updated}")
    print(f"🔗 Total links updated: {total_links_updated}")
    
    if updates_made:
        print("\n📋 Updated files:")
        for update in updates_made:
            print(f"  - {update['file']}: {update['links_updated']} links")
    
    return updates_made

def validate_frontend_routes():
    """Validate that all frontend routes still work after updates"""
    
    frontend_docs_dir = Path("apps/web/src/app/docs")
    
    required_routes = [
        "page.tsx",  # /docs
        "whitepaper/page.tsx",  # /docs/whitepaper
        "hacking-homelessness/page.tsx",  # /docs/hacking-homelessness
        "website-architecture/page.tsx",  # /docs/website-architecture
        "blockchain/page.tsx",  # /docs/blockchain
        "api/page.tsx",  # /docs/api
        "shelter-admin-guide/page.tsx",  # /docs/shelter-admin-guide
        "donor-guide/page.tsx",  # /docs/donor-guide
        "participant-guide/page.tsx",  # /docs/participant-guide
        "roadmap/page.tsx",  # /docs/roadmap
    ]
    
    print("🔍 Validating frontend routes...")
    
    missing_routes = []
    existing_routes = []
    
    for route in required_routes:
        route_path = frontend_docs_dir / route
        if route_path.exists():
            existing_routes.append(route)
            print(f"✅ Route exists: /docs/{route.replace('/page.tsx', '').replace('page.tsx', '')}")
        else:
            missing_routes.append(route)
            print(f"❌ Route missing: /docs/{route.replace('/page.tsx', '').replace('page.tsx', '')}")
    
    print(f"\n📊 Route Validation Summary:")
    print(f"✅ Existing routes: {len(existing_routes)}")
    print(f"❌ Missing routes: {len(missing_routes)}")
    
    if missing_routes:
        print("\n⚠️  Missing routes that need attention:")
        for route in missing_routes:
            print(f"  - {route}")
    
    return {
        'existing_routes': existing_routes,
        'missing_routes': missing_routes,
        'total_required': len(required_routes)
    }

if __name__ == "__main__":
    print("🚀 Starting Frontend GitHub Links Update Process...")
    
    # Update GitHub links
    update_results = update_github_links()
    
    print("\n" + "="*50)
    
    # Validate routes
    validation_results = validate_frontend_routes()
    
    print("\n✅ Frontend update process completed!")
