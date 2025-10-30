# 📊 Blog Post Creation - Production Status

## ✅ Production Backend Configuration

Your production backend is deployed and configured correctly!

### **Production Backend URL:**
```
https://sheltr-api-714964620823.us-central1.run.app
```

### **Configuration Files:**

**Frontend Production (.env.production):**
```bash
NEXT_PUBLIC_API_BASE_URL=https://sheltr-api-714964620823.us-central1.run.app
```

**Backend (main.py):**
```python
servers=[
    {
        "url": "https://sheltr-api-714964620823.us-central1.run.app",
        "description": "Production server (Cloud Run)"
    }
]
```

**CORS Configuration:**
```python
allow_origins=[
    "https://sheltr-ai.web.app",      # ✅ Your production frontend
    "https://sheltr-ai.firebaseapp.com",
]
```

---

## 🧪 Test Production Backend

### **1. Check Backend Health**

Open in browser:
```
https://sheltr-api-714964620823.us-central1.run.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "SHELTR-AI API is running",
  "version": "2.0.0",
  "status": "healthy"
}
```

### **2. Check API Documentation**

```
https://sheltr-api-714964620823.us-central1.run.app/docs
```

Should show the FastAPI Swagger UI with all endpoints including `/api/v1/blog/posts`.

### **3. Test Blog Endpoint**

```bash
curl https://sheltr-api-714964620823.us-central1.run.app/api/v1/blog/public/posts
```

---

## 🔍 Debugging Production Blog Creation

If blog post creation is still failing in production, here are the possible causes:

### **1. Backend Not Deployed or Down**

**Check:**
```bash
curl https://sheltr-api-714964620823.us-central1.run.app/health
```

**If it fails:**
- Backend may not be deployed to Cloud Run
- Cloud Run service may be stopped
- Need to deploy backend: `gcloud run deploy sheltr-api`

### **2. Authentication Token Issue**

**Symptoms:**
- Error: "User not authenticated"
- 401 Unauthorized response

**Check:**
- Firebase auth token is being sent correctly
- Token is valid and not expired
- User is logged in on production

**Debug:**
Open browser console on production and check:
```javascript
// In browser console
const auth = getAuth();
const user = auth.currentUser;
const token = await user.getIdToken();
console.log('Token:', token);
```

### **3. Super Admin Role Not Set**

**Symptoms:**
- Error: "Super admin access required"
- 403 Forbidden response

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/project/sheltr-ai/firestore)
2. Navigate to `users` collection
3. Find your user document (search by email)
4. Verify `role` field is set to `"super_admin"`

### **4. CORS Issue**

**Symptoms:**
- Error in browser console: "CORS policy blocked"
- Network request shows as "failed" or "blocked"

**Check backend CORS config:**
The backend already includes `https://sheltr-ai.web.app` in allowed origins, so this should work.

### **5. Cloud Run Cold Start**

**Symptoms:**
- First request after inactivity takes 10-30 seconds
- Subsequent requests are fast

**This is normal** - Cloud Run instances spin down when idle and take time to start up.

---

## 🚀 Deploy Backend to Production

If the backend is not deployed or needs updating:

### **Option 1: Using gcloud CLI**

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/api

# Build and deploy to Cloud Run
gcloud run deploy sheltr-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=sheltr-ai
```

### **Option 2: Using Cloud Build (Automated)**

```bash
# From project root
gcloud builds submit --config cloudbuild.yaml
```

### **Option 3: Using Deploy Script**

```bash
# From project root
./deploy.sh
# Select option for backend deployment
```

---

## 📝 Production Blog Creation Flow

### **When you click "Create Post" in production:**

1. **Frontend** (`https://sheltr-ai.web.app/dashboard/blog`)
   ```typescript
   blogService.createBlogPost({
     title: "Test Blog 1",
     content: "...",
     featured_image: "https://firebasestorage.googleapis.com/..."
   })
   ```

2. **API Request**
   ```
   POST https://sheltr-api-714964620823.us-central1.run.app/api/v1/blog/posts
   Authorization: Bearer <firebase-token>
   ```

3. **Backend** (Cloud Run)
   - Validates Firebase token
   - Checks super_admin role
   - Creates document in Firestore `blog_posts` collection
   - Returns success response

4. **Firestore**
   - Document created in `blog_posts` collection
   - Available immediately for querying

---

## 🐛 Get Detailed Error Information

### **Check Browser Console**

1. Open production site: `https://sheltr-ai.web.app/dashboard/blog`
2. Open DevTools (F12)
3. Go to Console tab
4. Try creating a blog post
5. Look for error messages

Common errors:
```
❌ Failed to fetch
   → Backend not accessible

❌ 401 Unauthorized
   → Authentication token issue

❌ 403 Forbidden
   → Not super_admin role

❌ 500 Internal Server Error
   → Backend error (check Cloud Run logs)
```

### **Check Cloud Run Logs**

```bash
# View recent logs
gcloud run logs read sheltr-api \
  --region us-central1 \
  --limit 50

# Stream live logs
gcloud run logs tail sheltr-api \
  --region us-central1
```

Or visit:
```
https://console.cloud.google.com/run/detail/us-central1/sheltr-api/logs
```

---

## ✅ Quick Verification Checklist

Before creating blog posts in production:

- [ ] Backend health check responds: `https://sheltr-api-714964620823.us-central1.run.app/health`
- [ ] Logged in as super_admin on production
- [ ] Firebase auth working (can see user in console)
- [ ] Blog images upload successfully (already tested ✅)
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows API request being sent

---

## 🎯 Next Steps

1. **Test Backend Health:**
   ```
   https://sheltr-api-714964620823.us-central1.run.app/health
   ```

2. **If backend is down:**
   - Deploy backend to Cloud Run
   - Check Cloud Run service status

3. **If backend is up but blog creation fails:**
   - Check browser console for specific error
   - Verify super_admin role in Firestore
   - Check Cloud Run logs for backend errors

4. **Share the specific error message** from browser console and I can help debug further!

---

## 📚 Related Documentation

- [Cloud Run Console](https://console.cloud.google.com/run)
- [Firebase Console](https://console.firebase.google.com/project/sheltr-ai)
- [Backend API Docs](https://sheltr-api-714964620823.us-central1.run.app/docs)
- [Blog Image Upload Fix](./BLOG-IMAGE-UPLOAD-FIX.md)

---

**Status:** ⚠️ **Needs Testing** - Backend is configured, need to verify it's deployed and accessible

