# 🔧 Blog Post Creation - Backend API Required

## 📋 Issue Summary

When clicking "Create Post" in the Blog Management Dashboard (`/dashboard/blog`), the system displays an error: **"Failed to create blog post. Please try again."**

## 🔍 Root Cause

The blog post creation feature requires the **FastAPI backend server** to be running. The frontend (`blogService.ts`) makes an API call to:

```
POST http://localhost:8000/api/v1/blog/posts
```

If the backend is not running, this request fails with a network error, causing the "Failed to create blog post" message.

---

## ✅ Solution: Start the Backend API Server

### **Option 1: Start Backend Manually**

```bash
# Terminal 1 - Start Backend API
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/api
source venv/bin/activate  # Activate Python virtual environment
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Start Frontend (already running)
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/web
npm run dev
```

### **Option 2: Use Start Script (Recommended)**

```bash
# From project root
cd /Users/mrjones/Github/Projects/sheltr-ai
./start-dev.sh
```

This script starts both frontend and backend simultaneously.

---

## 🧪 Verify Backend is Running

### **1. Check Backend Health**

Open in browser: http://localhost:8000/docs

You should see the **FastAPI Swagger documentation** page.

### **2. Test Blog Endpoint**

```bash
curl http://localhost:8000/api/v1/blog/public/posts
```

Expected response:
```json
{
  "success": true,
  "data": {
    "posts": [],
    "total": 0,
    "limit": 10,
    "offset": 0
  }
}
```

---

## 📊 How Blog Post Creation Works

### **Frontend Flow:**

1. User fills out blog post form in `/dashboard/blog`
2. Clicks "Create Post" button
3. `handleCreatePost()` function is called
4. `blogService.createBlogPost()` makes API request

### **Backend Flow:**

```typescript
// Frontend (blogService.ts)
async createBlogPost(postData) {
  const response = await fetch('http://localhost:8000/api/v1/blog/posts', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
}
```

```python
# Backend (apps/api/routers/blog.py)
@router.post("/posts")
async def create_blog_post(
    title: str = Form(...),
    content: str = Form(...),
    # ... other fields
    current_user: Dict[str, Any] = Depends(require_super_admin)
):
    blog_service = BlogService()
    post_id = await blog_service.create_blog_post(...)
    return {"success": True, "data": {"post_id": post_id}}
```

```python
# Backend (apps/api/services/blog_service.py)
async def create_blog_post(...):
    # Save to Firestore blog_posts collection
    doc_ref = self.db.collection('blog_posts').document()
    doc_ref.set(post_data)
    return doc_ref.id
```

---

## 🔐 Authentication Requirements

The blog post creation endpoint requires:

- ✅ **Firebase Authentication Token** (automatically provided by frontend)
- ✅ **Super Admin Role** (checked by `require_super_admin` middleware)

### **Middleware Check:**

```python
# apps/api/middleware/auth_middleware.py
async def require_super_admin(current_user: Dict = Depends(get_current_user)):
    if current_user.get('role') != 'super_admin':
        raise HTTPException(status_code=403, detail="Super admin access required")
    return current_user
```

---

## 🐛 Troubleshooting

### **Error: "Failed to create blog post"**

**Cause:** Backend API not running or not accessible.

**Solution:**
1. Check if backend is running: `curl http://localhost:8000/docs`
2. Start backend: `cd apps/api && uvicorn main:app --reload`
3. Check firewall/port 8000 is not blocked

### **Error: "User not authenticated"**

**Cause:** Firebase auth token is invalid or expired.

**Solution:**
1. Log out and log back in
2. Check Firebase console for user authentication status
3. Verify `NEXT_PUBLIC_FIREBASE_*` env variables are correct

### **Error: "Super admin access required"**

**Cause:** User doesn't have `super_admin` role in Firestore.

**Solution:**
1. Go to Firebase Console → Firestore Database
2. Navigate to `users` collection
3. Find your user document
4. Set `role` field to `"super_admin"`

### **Error: "Connection refused" or "Network error"**

**Cause:** Backend server not running or wrong port.

**Solution:**
1. Verify `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` in `.env.local`
2. Check backend is running on port 8000
3. Try accessing http://localhost:8000/docs directly

---

## 📁 Related Files

### **Frontend:**
- `apps/web/src/app/dashboard/blog/page.tsx` - Blog management UI
- `apps/web/src/services/blogService.ts` - API client
- `apps/web/src/components/BlogImageUpload.tsx` - Image upload component

### **Backend:**
- `apps/api/routers/blog.py` - Blog API endpoints
- `apps/api/services/blog_service.py` - Blog business logic
- `apps/api/middleware/auth_middleware.py` - Authentication middleware

### **Configuration:**
- `apps/web/.env.local` - Frontend environment variables
- `apps/api/.env` - Backend environment variables (if exists)

---

## 🚀 Quick Start Checklist

Before creating blog posts, ensure:

- [ ] Backend API is running (`http://localhost:8000/docs` accessible)
- [ ] Frontend is running (`http://localhost:3000` accessible)
- [ ] Logged in as user with `super_admin` role
- [ ] Firebase authentication is working
- [ ] Blog images storage rules are deployed (already done ✅)

---

## 💡 Alternative: Direct Firestore Creation (Temporary Workaround)

If you need to create blog posts without the backend, you can temporarily add them directly to Firestore:

### **Using Firebase Console:**

1. Go to [Firebase Console](https://console.firebase.google.com/project/sheltr-ai/firestore)
2. Navigate to `blog_posts` collection
3. Click "Add document"
4. Add fields:
   ```
   title: "Your Blog Title"
   slug: "your-blog-title"
   content: "Your blog content..."
   excerpt: "Brief description"
   author_id: "your-firebase-uid"
   author_name: "Your Name"
   category: "Community Updates"
   tags: ["test"]
   status: "draft"
   read_time: 5
   view_count: 0
   created_at: (timestamp)
   updated_at: (timestamp)
   featured_image: "https://firebasestorage.googleapis.com/..."
   ```

**Note:** This is a temporary workaround. For production use, always use the backend API.

---

## ✨ Summary

Blog post creation requires the **FastAPI backend server** to be running on `http://localhost:8000`. The frontend makes API calls to create posts in Firestore through the backend.

**To fix:**
1. Start the backend: `cd apps/api && uvicorn main:app --reload`
2. Verify it's running: http://localhost:8000/docs
3. Try creating a blog post again

**Status:** ⚠️ **Backend Required** - Not a bug, just needs backend server running

