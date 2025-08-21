"""
Blog API Router for SHELTR-AI
Handles blog post CRUD operations and management
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional, Dict, Any
import logging
from services.blog_service import BlogService
from middleware.auth_middleware import get_current_user, require_super_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/blog", tags=["blog"])

@router.get("/posts")
async def get_blog_posts(
    status: str = "published",
    category: Optional[str] = None,
    tag: Optional[str] = None,
    limit: int = 10,
    offset: int = 0,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get blog posts with filtering and pagination"""
    
    try:
        blog_service = BlogService()
        posts = await blog_service.get_blog_posts(
            status=status,
            category=category,
            tag=tag,
            limit=limit,
            offset=offset
        )
        
        return {
            "success": True,
            "data": {
                "posts": posts,
                "total": len(posts),
                "limit": limit,
                "offset": offset
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get blog posts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve blog posts")

@router.get("/posts/{slug}")
async def get_blog_post(
    slug: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get a single blog post by slug"""
    
    try:
        blog_service = BlogService()
        post = await blog_service.get_blog_post_by_slug(slug)
        
        if not post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Increment view count for published posts
        if post.get('status') == 'published':
            await blog_service.increment_view_count(post['id'])
        
        return {
            "success": True,
            "data": {
                "post": post
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get blog post {slug}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve blog post")

@router.post("/posts")
async def create_blog_post(
    title: str = Form(...),
    content: str = Form(...),
    excerpt: str = Form(...),
    category: str = Form(...),
    tags: Optional[str] = Form(None),  # Comma-separated tags
    status: str = Form("draft"),
    seo_title: Optional[str] = Form(None),
    seo_description: Optional[str] = Form(None),
    seo_keywords: Optional[str] = Form(None),  # Comma-separated keywords
    featured_image: Optional[UploadFile] = File(None),
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Create a new blog post (Super Admin only)"""
    
    try:
        blog_service = BlogService()
        
        # Parse tags and keywords
        tag_list = [tag.strip() for tag in tags.split(',')] if tags else []
        keyword_list = [kw.strip() for kw in seo_keywords.split(',')] if seo_keywords else []
        
        # Handle featured image upload
        featured_image_url = None
        if featured_image:
            # TODO: Implement image upload to Firebase Storage
            # For now, we'll skip image upload
            logger.warning("Featured image upload not yet implemented")
        
        # Create the blog post
        post_id = await blog_service.create_blog_post(
            title=title,
            content=content,
            excerpt=excerpt,
            author_id=current_user['uid'],
            author_name=current_user.get('display_name') or current_user.get('email'),
            category=category,
            tags=tag_list,
            featured_image=featured_image_url,
            status=status,
            seo_title=seo_title,
            seo_description=seo_description,
            seo_keywords=keyword_list
        )
        
        return {
            "success": True,
            "data": {
                "post_id": post_id,
                "message": "Blog post created successfully"
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to create blog post: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create blog post")

@router.put("/posts/{post_id}")
async def update_blog_post(
    post_id: str,
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    excerpt: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    seo_title: Optional[str] = Form(None),
    seo_description: Optional[str] = Form(None),
    seo_keywords: Optional[str] = Form(None),
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Update an existing blog post (Super Admin only)"""
    
    try:
        blog_service = BlogService()
        
        # Build updates dictionary
        updates = {}
        if title is not None:
            updates['title'] = title
        if content is not None:
            updates['content'] = content
        if excerpt is not None:
            updates['excerpt'] = excerpt
        if category is not None:
            updates['category'] = category
        if tags is not None:
            updates['tags'] = [tag.strip() for tag in tags.split(',')]
        if status is not None:
            updates['status'] = status
        if seo_title is not None:
            updates['seo_title'] = seo_title
        if seo_description is not None:
            updates['seo_description'] = seo_description
        if seo_keywords is not None:
            updates['seo_keywords'] = [kw.strip() for kw in seo_keywords.split(',')]
        
        if not updates:
            raise HTTPException(status_code=400, detail="No updates provided")
        
        # Update the blog post
        success = await blog_service.update_blog_post(post_id, updates)
        
        if not success:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        return {
            "success": True,
            "data": {
                "message": "Blog post updated successfully"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update blog post {post_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update blog post")

@router.delete("/posts/{post_id}")
async def delete_blog_post(
    post_id: str,
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Delete a blog post (Super Admin only)"""
    
    try:
        blog_service = BlogService()
        success = await blog_service.delete_blog_post(post_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        return {
            "success": True,
            "data": {
                "message": "Blog post deleted successfully"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete blog post {post_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete blog post")

@router.get("/categories")
async def get_categories(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get all blog categories"""
    
    try:
        blog_service = BlogService()
        categories = await blog_service.get_categories()
        
        return {
            "success": True,
            "data": {
                "categories": categories
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get blog categories: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve blog categories")

@router.post("/categories")
async def create_category(
    name: str = Form(...),
    description: str = Form(...),
    color: str = Form("#3B82F6"),
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    """Create a new blog category (Super Admin only)"""
    
    try:
        blog_service = BlogService()
        category_id = await blog_service.create_category(
            name=name,
            description=description,
            color=color
        )
        
        return {
            "success": True,
            "data": {
                "category_id": category_id,
                "message": "Category created successfully"
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to create blog category: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create blog category")

@router.get("/tags")
async def get_tags(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get all blog tags with usage counts"""
    
    try:
        blog_service = BlogService()
        tags = await blog_service.get_tags()
        
        return {
            "success": True,
            "data": {
                "tags": tags
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get blog tags: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve blog tags")
