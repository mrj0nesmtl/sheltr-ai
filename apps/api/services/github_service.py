"""
GitHub Service for Knowledge Base Sync
Handles GitHub API integration for scanning and syncing documentation files.
"""

import os
import logging
import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
import base64
import hashlib

logger = logging.getLogger(__name__)

class GitHubService:
    def __init__(self):
        self.token = os.getenv('GITHUB_TOKEN')
        self.owner = os.getenv('GITHUB_OWNER', 'mrjones')
        self.repo = os.getenv('GITHUB_REPO', 'sheltr-ai')
        self.docs_path = os.getenv('GITHUB_DOCS_PATH', 'docs')
        self.base_url = "https://api.github.com"
        
        if not self.token or self.token == 'your_github_token_here':
            logger.warning("GitHub token not configured - using public API with rate limits")
            self.token = None
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for GitHub API requests"""
        headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'SHELTR-AI-Knowledge-Sync/1.0'
        }
        if self.token:
            headers['Authorization'] = f'token {self.token}'
        return headers
    
    async def scan_repository_changes(self) -> Dict[str, List[str]]:
        """
        Scan the GitHub repository for documentation changes
        Returns dict with new, modified, deleted, and unchanged files
        """
        try:
            logger.info(f"Scanning GitHub repository: {self.owner}/{self.repo}")
            
            # Get current files from GitHub
            github_files = await self._get_repository_files()
            
            # Get current files from Firestore knowledge base
            from services.knowledge_dashboard_service import KnowledgeDashboardService
            kb_service = KnowledgeDashboardService()
            kb_documents = await kb_service.get_knowledge_documents()
            
            # Create mapping of existing files
            existing_files = {}
            for doc in kb_documents:
                file_path = doc.get('file_path', '')
                if file_path.startswith('knowledge-base/public/'):
                    # Remove the knowledge-base/public/ prefix to match GitHub paths
                    github_path = file_path.replace('knowledge-base/public/', '')
                    existing_files[github_path] = {
                        'id': doc.get('id'),
                        'updated_at': doc.get('updated_at'),
                        'file_size': doc.get('file_size', 0)
                    }
            
            # Compare and categorize files
            new_files = []
            modified_files = []
            unchanged_files = []
            deleted_files = []
            
            # Check GitHub files against knowledge base
            for github_file in github_files:
                file_path = github_file['path']
                
                if file_path in existing_files:
                    # File exists - check if modified
                    kb_file = existing_files[file_path]
                    github_size = github_file.get('size', 0)
                    kb_size = kb_file.get('file_size', 0)
                    
                    # Simple comparison by file size (could be enhanced with SHA comparison)
                    if github_size != kb_size:
                        modified_files.append(file_path)
                    else:
                        unchanged_files.append(file_path)
                else:
                    # New file
                    new_files.append(file_path)
            
            # Check for deleted files (in KB but not in GitHub)
            github_paths = {f['path'] for f in github_files}
            for kb_path in existing_files.keys():
                if kb_path not in github_paths:
                    deleted_files.append(kb_path)
            
            logger.info(f"Scan complete: {len(new_files)} new, {len(modified_files)} modified, {len(deleted_files)} deleted")
            
            return {
                "new": new_files,
                "modified": modified_files,
                "deleted": deleted_files,
                "unchanged": unchanged_files
            }
            
        except Exception as e:
            logger.error(f"Error scanning GitHub repository: {str(e)}")
            raise
    
    async def _get_repository_files(self) -> List[Dict[str, Any]]:
        """Get all markdown files from the docs directory"""
        try:
            url = f"{self.base_url}/repos/{self.owner}/{self.repo}/contents/{self.docs_path}"
            
            async with aiohttp.ClientSession() as session:
                files = []
                
                # First check if the docs directory exists
                async with session.get(url, headers=self._get_headers()) as response:
                    if response.status == 404:
                        logger.warning(f"Docs directory '{self.docs_path}' not found in repository")
                        return []  # Return empty list instead of raising error
                    elif response.status != 200:
                        error_text = await response.text()
                        logger.error(f"GitHub API error: {response.status} - {error_text}")
                        return []
                
                # If directory exists, get files recursively
                await self._get_files_recursive(session, url, files)
                
                # Filter for markdown files only
                markdown_files = [
                    f for f in files 
                    if f['name'].endswith(('.md', '.markdown'))
                ]
                
                logger.info(f"Found {len(markdown_files)} markdown files in repository")
                return markdown_files
                
        except Exception as e:
            logger.error(f"Error getting repository files: {str(e)}")
            return []  # Return empty list instead of raising error
    
    async def _get_files_recursive(self, session: aiohttp.ClientSession, url: str, files: List[Dict]):
        """Recursively get all files from a directory"""
        try:
            async with session.get(url, headers=self._get_headers()) as response:
                if response.status == 200:
                    items = await response.json()
                    
                    for item in items:
                        if item['type'] == 'file':
                            # Add relative path from docs directory
                            relative_path = item['path'].replace(f"{self.docs_path}/", "")
                            files.append({
                                'name': item['name'],
                                'path': relative_path,
                                'size': item['size'],
                                'sha': item['sha'],
                                'download_url': item['download_url']
                            })
                        elif item['type'] == 'dir':
                            # Recursively get files from subdirectory
                            await self._get_files_recursive(session, item['url'], files)
                elif response.status == 404:
                    logger.warning(f"Directory not found: {url}")
                    # Don't raise error for 404, just log and continue
                else:
                    error_text = await response.text()
                    logger.error(f"GitHub API error: {response.status} - {error_text}")
                    
        except Exception as e:
            logger.error(f"Error in recursive file fetch: {str(e)}")
            # Don't re-raise, just log the error
    
    async def get_file_content(self, file_path: str) -> Optional[str]:
        """Get the content of a specific file from GitHub"""
        try:
            # Construct full path
            full_path = f"{self.docs_path}/{file_path}"
            url = f"{self.base_url}/repos/{self.owner}/{self.repo}/contents/{full_path}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=self._get_headers()) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        # Decode base64 content
                        content = base64.b64decode(data['content']).decode('utf-8')
                        return content
                    else:
                        logger.error(f"Failed to get file content: {response.status}")
                        return None
                        
        except Exception as e:
            logger.error(f"Error getting file content for {file_path}: {str(e)}")
            return None
    
    async def sync_files_to_knowledge_base(self, file_paths: List[str]) -> Dict[str, Any]:
        """
        Sync specified files from GitHub to the knowledge base
        """
        try:
            from services.knowledge_dashboard_service import KnowledgeDashboardService
            from services.embeddings_service import EmbeddingsService
            
            kb_service = KnowledgeDashboardService()
            embeddings_service = EmbeddingsService()
            
            successful = 0
            failed = 0
            details = []
            
            for file_path in file_paths:
                try:
                    logger.info(f"Syncing file: {file_path}")
                    
                    # Get file content from GitHub
                    content = await self.get_file_content(file_path)
                    if not content:
                        details.append({"file": file_path, "status": "failed", "error": "Could not fetch content"})
                        failed += 1
                        continue
                    
                    # Extract title from filename or content
                    title = self._extract_title_from_content(content, file_path)
                    
                    # Determine category from path
                    category = self._determine_category_from_path(file_path)
                    
                    # Check if document already exists
                    kb_documents = await kb_service.get_knowledge_documents()
                    existing_doc = None
                    
                    for doc in kb_documents:
                        doc_path = doc.get('file_path', '').replace('knowledge-base/public/', '')
                        if doc_path == file_path:
                            existing_doc = doc
                            break
                    
                    if existing_doc:
                        # Update existing document
                        document_id = existing_doc['id']
                        await kb_service.update_knowledge_document(
                            document_id=document_id,
                            updates={
                                'title': title,
                                'content': content,
                                'category': category,
                                'file_size': len(content.encode('utf-8')),
                                'updated_at': datetime.utcnow(),
                                'embedding_status': 'pending'
                            }
                        )
                    else:
                        # Create new document
                        document_data = {
                            'title': title,
                            'content': content,
                            'category': category,
                            'file_path': f'knowledge-base/public/{file_path}',
                            'file_size': len(content.encode('utf-8')),
                            'access_level': 'public',
                            'tags': self._extract_tags_from_path(file_path),
                            'embedding_status': 'pending'
                        }
                        document_id = await kb_service.create_knowledge_document(document_data)
                    
                    # Generate embeddings
                    metadata = {
                        'document_id': document_id,
                        'title': title,
                        'category': category,
                        'access_level': 'public'
                    }
                    
                    chunk_ids = await embeddings_service.process_document_embeddings(
                        document_id=document_id,
                        content=content,
                        metadata=metadata
                    )
                    
                    # Update document with embedding info
                    await kb_service.update_knowledge_document(
                        document_id=document_id,
                        updates={
                            'embedding_count': len(chunk_ids),
                            'processed': True,
                            'embedding_status': 'completed'
                        }
                    )
                    
                    details.append({
                        "file": file_path, 
                        "status": "success", 
                        "document_id": document_id,
                        "embeddings": len(chunk_ids)
                    })
                    successful += 1
                    
                    logger.info(f"Successfully synced {file_path} with {len(chunk_ids)} embeddings")
                    
                except Exception as file_error:
                    logger.error(f"Failed to sync {file_path}: {str(file_error)}")
                    details.append({"file": file_path, "status": "failed", "error": str(file_error)})
                    failed += 1
            
            return {
                "successful": successful,
                "failed": failed,
                "details": details,
                "message": f"Synced {successful} files successfully, {failed} failed"
            }
            
        except Exception as e:
            logger.error(f"Error in sync_files_to_knowledge_base: {str(e)}")
            raise
    
    def _extract_title_from_content(self, content: str, file_path: str) -> str:
        """Extract title from markdown content or filename"""
        lines = content.split('\n')
        
        # Look for markdown title (# Title)
        for line in lines:
            line = line.strip()
            if line.startswith('# '):
                return line[2:].strip()
        
        # Fallback to filename
        filename = os.path.basename(file_path)
        return filename.replace('.md', '').replace('-', ' ').replace('_', ' ').title()
    
    def _determine_category_from_path(self, file_path: str) -> str:
        """Determine category based on file path"""
        path_parts = file_path.split('/')
        
        if len(path_parts) > 1:
            folder = path_parts[0]
            
            category_mapping = {
                '01-overview': 'Platform',
                '02-architecture': 'Architecture',
                '03-api': 'API',
                '04-development': 'Development',
                '05-deployment': 'Deployment',
                '06-user-guides': 'User Guides',
                '07-reference': 'Reference',
                '08-integrations': 'Integrations',
                '09-migration': 'Migration',
                '10-resources': 'Resources'
            }
            
            return category_mapping.get(folder, 'Documentation')
        
        return 'Documentation'
    
    def _extract_tags_from_path(self, file_path: str) -> List[str]:
        """Extract relevant tags from file path"""
        tags = []
        
        # Add folder-based tags
        path_parts = file_path.split('/')
        if len(path_parts) > 1:
            folder = path_parts[0]
            tags.append(folder.replace('-', ' '))
        
        # Add filename-based tags
        filename = os.path.basename(file_path).replace('.md', '')
        if 'readme' not in filename.lower():
            tags.append(filename.replace('-', ' ').replace('_', ' '))
        
        return tags

# Global instance
github_service = GitHubService()
