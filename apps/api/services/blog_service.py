"""
Blog Service for SHELTR-AI
Handles blog post management, categories, and tags
"""

import re
import hashlib
import os
import base64
from datetime import datetime
from typing import List, Dict, Optional, Any
from firebase_admin import firestore, storage
import logging
import markdown
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

class BlogService:
    """Service for managing blog posts and related content"""
    
    def __init__(self):
        self.db = firestore.client()
        self.bucket = storage.bucket('sheltr-ai.firebasestorage.app')
    
    def _generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug from title"""
        # Convert to lowercase and replace spaces with hyphens
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')
    
    def _calculate_read_time(self, content: str) -> int:
        """Calculate estimated reading time in minutes"""
        words_per_minute = 200
        word_count = len(content.split())
        read_time = max(1, round(word_count / words_per_minute))
        return read_time
    
    async def create_blog_post(
        self,
        title: str,
        content: str,
        excerpt: str,
        author_id: str,
        author_name: str,
        category: str,
        tags: List[str] = None,
        featured_image: Optional[str] = None,
        status: str = 'draft',
        slug: Optional[str] = None,
        seo_title: Optional[str] = None,
        seo_description: Optional[str] = None,
        seo_keywords: Optional[List[str]] = None
    ) -> str:
        """Create a new blog post"""
        
        try:
            # Use provided slug or generate from title
            if not slug:
                slug = self._generate_slug(title)
            
            # Check if slug already exists
            existing_posts = self.db.collection('blog_posts').where('slug', '==', slug).limit(1).stream()
            if list(existing_posts):
                # Add timestamp to make slug unique
                slug = f"{slug}-{int(datetime.now().timestamp())}"
            
            # Calculate read time
            read_time = self._calculate_read_time(content)
            
            # Prepare post data
            post_data = {
                'title': title,
                'slug': slug,
                'content': content,
                'excerpt': excerpt,
                'author_id': author_id,
                'author_name': author_name,
                'category': category,
                'tags': tags or [],
                'status': status,
                'read_time': read_time,
                'view_count': 0,
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP
            }
            
            # Add optional fields
            if featured_image:
                post_data['featured_image'] = featured_image
            if seo_title:
                post_data['seo_title'] = seo_title
            if seo_description:
                post_data['seo_description'] = seo_description
            if seo_keywords:
                post_data['seo_keywords'] = seo_keywords
            
            # Set published_at if status is published
            if status == 'published':
                post_data['published_at'] = firestore.SERVER_TIMESTAMP
            
            # Create the post
            doc_ref = self.db.collection('blog_posts').add(post_data)
            
            # Update tag usage counts
            if tags:
                await self._update_tag_usage_counts(tags, increment=True)
            
            logger.info(f"Blog post created: {doc_ref[1].id}")
            return doc_ref[1].id
            
        except Exception as e:
            logger.error(f"Failed to create blog post: {str(e)}")
            raise
    
    async def update_blog_post(
        self,
        post_id: str,
        updates: Dict[str, Any]
    ) -> bool:
        """Update an existing blog post"""
        
        try:
            # Get current post data
            post_ref = self.db.collection('blog_posts').document(post_id)
            current_post = post_ref.get()
            
            if not current_post.exists:
                raise ValueError(f"Blog post {post_id} not found")
            
            current_data = current_post.to_dict()
            
            # Handle slug changes
            if 'title' in updates and updates['title'] != current_data.get('title'):
                new_slug = self._generate_slug(updates['title'])
                # Check if new slug already exists
                existing_posts = self.db.collection('blog_posts').where('slug', '==', new_slug).limit(1).stream()
                if list(existing_posts):
                    new_slug = f"{new_slug}-{int(datetime.now().timestamp())}"
                updates['slug'] = new_slug
            
            # Handle content changes
            if 'content' in updates:
                updates['read_time'] = self._calculate_read_time(updates['content'])
            
            # Handle status changes
            if 'status' in updates and updates['status'] == 'published' and current_data.get('status') != 'published':
                updates['published_at'] = firestore.SERVER_TIMESTAMP
            
            # Update tags usage counts
            if 'tags' in updates:
                old_tags = set(current_data.get('tags', []))
                new_tags = set(updates['tags'])
                
                # Decrement old tags
                removed_tags = old_tags - new_tags
                if removed_tags:
                    await self._update_tag_usage_counts(list(removed_tags), increment=False)
                
                # Increment new tags
                added_tags = new_tags - old_tags
                if added_tags:
                    await self._update_tag_usage_counts(list(added_tags), increment=True)
            
            # Add updated timestamp
            updates['updated_at'] = firestore.SERVER_TIMESTAMP
            
            # Update the post
            post_ref.update(updates)
            
            logger.info(f"Blog post updated: {post_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update blog post {post_id}: {str(e)}")
            raise
    
    async def delete_blog_post(self, post_id: str) -> bool:
        """Delete a blog post"""
        
        try:
            # Get post data for tag cleanup
            post_ref = self.db.collection('blog_posts').document(post_id)
            post_data = post_ref.get()
            
            if not post_data.exists:
                raise ValueError(f"Blog post {post_id} not found")
            
            # Update tag usage counts
            tags = post_data.to_dict().get('tags', [])
            if tags:
                await self._update_tag_usage_counts(tags, increment=False)
            
            # Delete the post
            post_ref.delete()
            
            logger.info(f"Blog post deleted: {post_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete blog post {post_id}: {str(e)}")
            raise
    
    async def get_blog_posts(
        self,
        status: str = 'published',
        category: Optional[str] = None,
        tag: Optional[str] = None,
        limit: int = 10,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Get blog posts with filtering and pagination"""
        
        try:
            query = self.db.collection('blog_posts')
            
            # Apply filters
            if status and status != 'all':
                query = query.where('status', '==', status)
            if category:
                query = query.where('category', '==', category)
            
            # Order by published_at (descending) or created_at
            if status == 'published':
                query = query.order_by('published_at', direction=firestore.Query.DESCENDING)
            else:
                query = query.order_by('created_at', direction=firestore.Query.DESCENDING)
            
            # Apply pagination
            query = query.limit(limit).offset(offset)
            
            # Execute query
            posts = query.stream()
            
            # Convert to list of dictionaries
            posts_list = []
            for post in posts:
                post_data = post.to_dict()
                post_data['id'] = post.id
                
                # Filter by tag if specified
                if tag and tag not in post_data.get('tags', []):
                    continue
                
                posts_list.append(post_data)
            
            return posts_list
            
        except Exception as e:
            logger.error(f"Failed to get blog posts: {str(e)}")
            raise
    
    async def get_blog_post_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """Get a single blog post by slug"""
        
        try:
            posts = self.db.collection('blog_posts').where('slug', '==', slug).limit(1).stream()
            
            for post in posts:
                post_data = post.to_dict()
                post_data['id'] = post.id
                return post_data
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get blog post by slug {slug}: {str(e)}")
            raise
    
    async def increment_view_count(self, post_id: str) -> bool:
        """Increment the view count for a blog post"""
        
        try:
            post_ref = self.db.collection('blog_posts').document(post_id)
            post_ref.update({
                'view_count': firestore.Increment(1)
            })
            return True
            
        except Exception as e:
            logger.error(f"Failed to increment view count for post {post_id}: {str(e)}")
            return False
    
    async def create_category(
        self,
        name: str,
        description: str,
        color: str = '#3B82F6'
    ) -> str:
        """Create a new blog category"""
        
        try:
            slug = self._generate_slug(name)
            
            category_data = {
                'name': name,
                'slug': slug,
                'description': description,
                'color': color,
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP
            }
            
            doc_ref = self.db.collection('blog_categories').add(category_data)
            logger.info(f"Blog category created: {doc_ref[1].id}")
            return doc_ref[1].id
            
        except Exception as e:
            logger.error(f"Failed to create blog category: {str(e)}")
            raise
    
    async def get_categories(self) -> List[Dict[str, Any]]:
        """Get all blog categories"""
        
        try:
            categories = self.db.collection('blog_categories').order_by('name').stream()
            
            categories_list = []
            for category in categories:
                category_data = category.to_dict()
                category_data['id'] = category.id
                categories_list.append(category_data)
            
            return categories_list
            
        except Exception as e:
            logger.error(f"Failed to get blog categories: {str(e)}")
            raise
    
    async def get_tags(self) -> List[Dict[str, Any]]:
        """Get all blog tags with usage counts"""
        
        try:
            tags = self.db.collection('blog_tags').order_by('usage_count', direction=firestore.Query.DESCENDING).stream()
            
            tags_list = []
            for tag in tags:
                tag_data = tag.to_dict()
                tag_data['id'] = tag.id
                tags_list.append(tag_data)
            
            return tags_list
            
        except Exception as e:
            logger.error(f"Failed to get blog tags: {str(e)}")
            raise
    
    async def _update_tag_usage_counts(self, tags: List[str], increment: bool = True) -> None:
        """Update usage counts for tags"""
        
        try:
            for tag_name in tags:
                # Find existing tag
                tag_query = self.db.collection('blog_tags').where('name', '==', tag_name).limit(1)
                tag_docs = list(tag_query.stream())
                
                if tag_docs:
                    # Update existing tag
                    tag_ref = tag_docs[0].reference
                    if increment:
                        tag_ref.update({
                            'usage_count': firestore.Increment(1),
                            'updated_at': firestore.SERVER_TIMESTAMP
                        })
                    else:
                        current_count = tag_docs[0].to_dict().get('usage_count', 0)
                        new_count = max(0, current_count - 1)
                        tag_ref.update({
                            'usage_count': new_count,
                            'updated_at': firestore.SERVER_TIMESTAMP
                        })
                elif increment:
                    # Create new tag
                    tag_data = {
                        'name': tag_name,
                        'slug': self._generate_slug(tag_name),
                        'usage_count': 1,
                        'created_at': firestore.SERVER_TIMESTAMP,
                        'updated_at': firestore.SERVER_TIMESTAMP
                    }
                    self.db.collection('blog_tags').add(tag_data)
                    
        except Exception as e:
            logger.error(f"Failed to update tag usage counts: {str(e)}")
            # Don't raise - this is not critical for post creation/update

    def _parse_markdown_file(self, file_content: str) -> Dict[str, Any]:
        """Parse markdown file content and extract frontmatter and content"""
        try:
            # Split content into frontmatter and markdown
            parts = file_content.split('---', 2)
            
            if len(parts) >= 3:
                # Has frontmatter
                frontmatter_text = parts[1].strip()
                markdown_content = parts[2].strip()
                
                # Parse frontmatter (simple YAML-like parsing)
                frontmatter = {}
                for line in frontmatter_text.split('\n'):
                    if ':' in line:
                        key, value = line.split(':', 1)
                        key = key.strip()
                        value = value.strip().strip('"\'')
                        frontmatter[key] = value
                
                return {
                    'frontmatter': frontmatter,
                    'content': markdown_content,
                    'html_content': markdown.markdown(markdown_content)
                }
            else:
                # No frontmatter, treat entire content as markdown
                return {
                    'frontmatter': {},
                    'content': file_content,
                    'html_content': markdown.markdown(file_content)
                }
                
        except Exception as e:
            logger.error(f"Failed to parse markdown file: {str(e)}")
            return {
                'frontmatter': {},
                'content': file_content,
                'html_content': markdown.markdown(file_content)
            }

    def _extract_title_from_markdown(self, content: str) -> str:
        """Extract title from markdown content (first # heading)"""
        lines = content.split('\n')
        for line in lines:
            if line.strip().startswith('# '):
                return line.strip()[2:].strip()
        return "Untitled Post"

    def _detect_media_embeds(self, content: str) -> List[Dict[str, str]]:
        """Detect and extract media embeds from content"""
        embeds = []
        
        # YouTube video patterns
        youtube_patterns = [
            r'https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]+)',
            r'https?://(?:www\.)?youtu\.be/([a-zA-Z0-9_-]+)',
            r'https?://(?:www\.)?youtube\.com/embed/([a-zA-Z0-9_-]+)'
        ]
        
        for pattern in youtube_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                video_id = match.group(1)
                embeds.append({
                    'type': 'youtube',
                    'url': match.group(0),
                    'embed_id': video_id,
                    'embed_code': f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" frameborder="0" allowfullscreen></iframe>'
                })
        
        # Vimeo video patterns
        vimeo_pattern = r'https?://(?:www\.)?vimeo\.com/(\d+)'
        vimeo_matches = re.finditer(vimeo_pattern, content)
        for match in vimeo_matches:
            video_id = match.group(1)
            embeds.append({
                'type': 'vimeo',
                'url': match.group(0),
                'embed_id': video_id,
                'embed_code': f'<iframe src="https://player.vimeo.com/video/{video_id}" width="560" height="315" frameborder="0" allowfullscreen></iframe>'
            })
        
        # Audio file patterns
        audio_pattern = r'https?://[^\s]+\.(mp3|wav|ogg|m4a)(?:\?[^\s]*)?'
        audio_matches = re.finditer(audio_pattern, content)
        for match in audio_matches:
            audio_url = match.group(0)
            embeds.append({
                'type': 'audio',
                'url': audio_url,
                'embed_code': f'<audio controls><source src="{audio_url}" type="audio/{match.group(1)}">Your browser does not support the audio element.</audio>'
            })
        
        # Social media patterns
        social_patterns = {
            'twitter': r'https?://(?:www\.)?twitter\.com/\w+/status/\d+',
            'instagram': r'https?://(?:www\.)?instagram\.com/p/[a-zA-Z0-9_-]+',
            'linkedin': r'https?://(?:www\.)?linkedin\.com/posts/[a-zA-Z0-9_-]+',
            'facebook': r'https?://(?:www\.)?facebook\.com/\w+/posts/\d+'
        }
        
        for platform, pattern in social_patterns.items():
            matches = re.finditer(pattern, content)
            for match in matches:
                social_url = match.group(0)
                embeds.append({
                    'type': f'social_{platform}',
                    'url': social_url,
                    'embed_code': f'<div class="social-embed {platform}"><a href="{social_url}" target="_blank" rel="noopener noreferrer">{social_url}</a></div>'
                })
        
        return embeds

    async def import_markdown_file(self, file_content: str, author_id: str, author_name: str) -> str:
        """Import blog post from markdown file content"""
        try:
            # Parse markdown file
            parsed = self._parse_markdown_file(file_content)
            frontmatter = frontmatter = parsed['frontmatter']
            markdown_content = parsed['content']
            
            # Extract metadata from frontmatter or content
            title = frontmatter.get('title') or self._extract_title_from_markdown(markdown_content)
            excerpt = frontmatter.get('excerpt', '') or markdown_content[:200] + '...'
            category = frontmatter.get('category', 'Uncategorized')
            tags = [tag.strip() for tag in frontmatter.get('tags', '').split(',')] if frontmatter.get('tags') else []
            status = frontmatter.get('status', 'draft')
            
            # Detect media embeds
            media_embeds = self._detect_media_embeds(markdown_content)
            
            # Create the blog post
            post_id = await self.create_blog_post(
                title=title,
                content=markdown_content,
                excerpt=excerpt,
                author_id=author_id,
                author_name=author_name,
                category=category,
                tags=tags,
                status=status,
                seo_title=frontmatter.get('seo_title'),
                seo_description=frontmatter.get('seo_description'),
                seo_keywords=[kw.strip() for kw in frontmatter.get('seo_keywords', '').split(',')] if frontmatter.get('seo_keywords') else None
            )
            
            # Store media embeds metadata
            if media_embeds:
                self.db.collection('blog_posts').document(post_id).update({
                    'media_embeds': media_embeds
                })
            
            logger.info(f"Successfully imported markdown file as blog post: {post_id}")
            return post_id
            
        except Exception as e:
            logger.error(f"Failed to import markdown file: {str(e)}")
            raise Exception(f"Failed to import markdown file: {str(e)}")

    async def get_media_embeds(self, post_id: str) -> List[Dict[str, str]]:
        """Get media embeds for a blog post"""
        try:
            doc = self.db.collection('blog_posts').document(post_id).get()
            if doc.exists:
                return doc.to_dict().get('media_embeds', [])
            return []
        except Exception as e:
            logger.error(f"Failed to get media embeds for post {post_id}: {str(e)}")
            return []
