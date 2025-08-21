"""
Blog Service for SHELTR-AI
Handles blog post management, categories, and tags
"""

import re
import hashlib
from datetime import datetime
from typing import List, Dict, Optional, Any
from firebase_admin import firestore, storage
import logging

logger = logging.getLogger(__name__)

class BlogService:
    """Service for managing blog posts and related content"""
    
    def __init__(self):
        self.db = firestore.client()
        self.storage_client = storage.client()
        self.bucket = self.storage_client.bucket('sheltr-ai.firebasestorage.app')
    
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
        seo_title: Optional[str] = None,
        seo_description: Optional[str] = None,
        seo_keywords: Optional[List[str]] = None
    ) -> str:
        """Create a new blog post"""
        
        try:
            # Generate slug
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
            if status:
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
