# 🔧 Blog Creation - Localhost Debugging Guide

## 🎯 Recommendation: Debug Locally First

**Why localhost is better for debugging:**
- ✅ Immediate error messages in terminal
- ✅ Faster iteration (no deployment wait)
- ✅ Full stack traces with line numbers
- ✅ Can add console.log() statements
- ✅ See backend logs in real-time

---

## 🚀 Setup Localhost Environment

### **Step 1: Start Backend API**

```bash
# Terminal 1 - Backend
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/api

# Activate Python virtual environment
source venv/bin/activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Start backend with hot reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
🏠 SHELTR-AI API is running
```

**Test it:**
```
http://localhost:8000/docs
```

### **Step 2: Start Frontend**

```bash
# Terminal 2 - Frontend
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/web

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

**Expected output:**
```
▲ Next.js 15.5.3
- Local:        http://localhost:3000
- Ready in 2.5s
```

**Test it:**
```
http://localhost:3000/dashboard/blog
```

---

## 🐛 Issue 1: Tags/Keywords Comma Input

### **Current Behavior:**
When you type a comma, the input field processes it immediately, making it hard to add multiple items.

### **The Fix:**

The code is actually correct (lines 444-445, 479-480), but we can improve the UX by using `onBlur` instead of `onChange`:

```typescript
// Current (processes on every keystroke)
onChange={(e) => setFormData({
  ...formData, 
  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
})}

// Better (processes when you leave the field)
onChange={(e) => setFormData({...formData, tagsInput: e.target.value})}
onBlur={(e) => setFormData({
  ...formData,
  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
})}
```

But **let's focus on the 500 error first** - that's the main blocker.

---

## 🔍 Issue 2: 500 Internal Server Error

### **What We Know:**
```
POST https://sheltr-api-714964620823.us-central1.run.app/api/v1/blog/posts
500 (Internal Server Error)
```

### **Possible Causes:**

1. **Backend code error** (most likely)
2. **Missing environment variables**
3. **Firestore permissions issue**
4. **Authentication token problem**

---

## 🧪 Debugging Steps (Localhost)

### **Step 1: Check Backend Logs**

When you try to create a blog post, watch Terminal 1 (backend). You'll see the exact error:

```bash
# Backend terminal will show:
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "...", line X, in create_blog_post
    # Exact error line
```

### **Step 2: Add Debug Logging**

**Edit `apps/api/routers/blog.py`:**

```python
@router.post("/posts")
async def create_blog_post(
    title: str = Form(...),
    content: str = Form(...),
    # ... other params
):
    """Create a new blog post (Super Admin only)"""
    
    try:
        # ADD DEBUG LOGGING
        logger.info(f"📝 Creating blog post: {title}")
        logger.info(f"   Author: {current_user.get('email')}")
        logger.info(f"   Category: {category}")
        logger.info(f"   Tags: {tags}")
        logger.info(f"   Featured image URL: {featured_image_url}")
        
        blog_service = BlogService()
        
        # Parse tags and keywords
        tag_list = [tag.strip() for tag in tags.split(',')] if tags else []
        logger.info(f"   Parsed tags: {tag_list}")
        
        keyword_list = [kw.strip() for kw in seo_keywords.split(',')] if seo_keywords else []
        logger.info(f"   Parsed keywords: {keyword_list}")
        
        # Create the blog post
        post_id = await blog_service.create_blog_post(
            title=title,
            content=content,
            excerpt=excerpt,
            author_id=current_user['uid'],
            author_name=current_user.get('display_name') or current_user.get('email'),
            category=category,
            tags=tag_list,
            featured_image=final_featured_image_url,
            status=status,
            slug=slug,
            seo_title=seo_title,
            seo_description=seo_description,
            seo_keywords=keyword_list
        )
        
        logger.info(f"✅ Blog post created successfully: {post_id}")
        
        return {
            "success": True,
            "data": {
                "post_id": post_id,
                "message": "Blog post created successfully"
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Failed to create blog post: {str(e)}")
        logger.exception(e)  # This prints full stack trace
        raise HTTPException(status_code=500, detail=f"Failed to create blog post: {str(e)}")
```

### **Step 3: Add Debug Logging to Service**

**Edit `apps/api/services/blog_service.py`:**

```python
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
        logger.info(f"🔧 BlogService.create_blog_post called")
        logger.info(f"   Title: {title}")
        logger.info(f"   Author: {author_name} ({author_id})")
        
        # Use provided slug or generate from title
        if not slug:
            slug = self._generate_slug(title)
            logger.info(f"   Generated slug: {slug}")
        
        # Check if slug already exists
        logger.info(f"   Checking for existing slug...")
        existing_posts = self.db.collection('blog_posts').where('slug', '==', slug).limit(1).stream()
        if list(existing_posts):
            slug = f"{slug}-{int(datetime.now().timestamp())}"
            logger.info(f"   Slug exists, using: {slug}")
        
        # Calculate read time
        read_time = self._calculate_read_time(content)
        logger.info(f"   Read time: {read_time} minutes")
        
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
        
        logger.info(f"   Creating Firestore document...")
        
        # Create the post
        timestamp, doc_ref = self.db.collection('blog_posts').add(post_data)
        post_id = doc_ref.id
        
        logger.info(f"   Document created: {post_id}")
        
        # Update tag usage counts
        if tags:
            logger.info(f"   Updating tag usage counts for {len(tags)} tags...")
            await self._update_tag_usage_counts(tags, increment=True)
        
        logger.info(f"✅ Blog post created successfully: {post_id}")
        return post_id
        
    except Exception as e:
        logger.error(f"❌ Failed to create blog post: {str(e)}")
        logger.exception(e)
        raise
```

---

## 🧪 Testing Procedure (Localhost)

### **Test 1: Basic Blog Post (No Image, No Tags)**

1. Go to http://localhost:3000/dashboard/blog
2. Click "Create Post"
3. Fill in ONLY required fields:
   - Title: "Test Post 1"
   - Category: "Community Updates"
   - Excerpt: "This is a test"
   - Content: "Just testing"
   - Status: "Draft"
4. Leave tags empty
5. Leave SEO fields empty
6. Click "Create Post"

**Watch backend terminal for errors!**

### **Test 2: With Tags (No Commas Yet)**

Same as Test 1, but add:
- Tags: "test"

### **Test 3: With Multiple Tags**

Same as Test 1, but add:
- Tags: "test, blog, community"

### **Test 4: With Featured Image**

Same as Test 1, but:
- Upload a featured image
- Wait for upload to complete
- Then click "Create Post"

### **Test 5: Full Post**

Fill in ALL fields and test complete flow.

---

## 🔍 Common Errors & Solutions

### **Error: "User not authenticated"**

**Cause:** Firebase auth token not being sent.

**Fix:**
```bash
# Check if logged in
# In browser console:
firebase.auth().currentUser
```

### **Error: "Super admin access required"**

**Cause:** User doesn't have super_admin role.

**Fix:**
1. Go to Firebase Console → Firestore
2. Find your user in `users` collection
3. Set `role: "super_admin"`

### **Error: "Failed to create blog post: 'NoneType' object..."**

**Cause:** Missing required field or None value.

**Fix:** Check which field is None in the logs and ensure it's being passed correctly.

### **Error: "Collection 'blog_posts' not found"**

**Cause:** Firestore collection doesn't exist.

**Fix:** Create it manually in Firebase Console or let the first post create it.

---

## 📊 Success Indicators

### **Backend Terminal Should Show:**
```
INFO: 📝 Creating blog post: Test Post 1
INFO:    Author: your-email@gmail.com
INFO:    Category: Community Updates
INFO: 🔧 BlogService.create_blog_post called
INFO:    Generated slug: test-post-1
INFO:    Read time: 1 minutes
INFO:    Creating Firestore document...
INFO:    Document created: abc123xyz
INFO: ✅ Blog post created successfully: abc123xyz
INFO: 200 POST /api/v1/blog/posts
```

### **Browser Console Should Show:**
```
✅ Blog post created successfully!
```

### **Firestore Should Have:**
- New document in `blog_posts` collection
- All fields populated correctly

---

## 🎯 Next Steps After Localhost Works

1. ✅ Fix any issues found locally
2. ✅ Test all scenarios (tags, images, SEO)
3. ✅ Commit fixes to git
4. ✅ Redeploy to production
5. ✅ Test in production one more time

---

## 📝 Report Template

When you find the error, share this info:

```
**Environment:** Localhost
**Test:** [Which test from above]
**Error Message:** [Exact error from backend terminal]
**Stack Trace:** [Full stack trace if available]
**Browser Console:** [Any errors in browser]
```

---

## ✨ Summary

**Switch to localhost debugging** - you'll get much better error messages and can iterate faster. Once it works locally, we'll deploy to production with confidence!

**Start here:**
1. Start backend: `cd apps/api && uvicorn main:app --reload`
2. Start frontend: `cd apps/web && npm run dev`
3. Try creating a basic blog post
4. **Share the backend terminal error** and we'll fix it together!

