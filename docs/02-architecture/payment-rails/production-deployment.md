# 🚀 Production Deployment Guide for Adyen Demo

## ✅ **Environment Configuration Fixed**

The frontend now properly uses environment variables for API calls, making it production-ready!

### **Environment Variables Setup**

#### **Development (`.env.local`)**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

#### **Production (`.env.production`)**
```env
NEXT_PUBLIC_API_BASE_URL=https://api.sheltr-ai.com
```

### **Frontend API Calls**
All API calls now use `process.env.NEXT_PUBLIC_API_BASE_URL`:

```typescript
// ✅ Environment-aware API calls
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/demo/donations/generate-qr`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});
```

## 🏗️ **Production Deployment Steps**

### **1. Backend Deployment (FastAPI)**
```bash
# Deploy to Google Cloud Run, Railway, or Heroku
# Example URL: https://api.sheltr-ai.com
```

### **2. Frontend Environment Update**
```bash
# Update production environment
NEXT_PUBLIC_API_BASE_URL=https://api.sheltr-ai.com
```

### **3. Adyen Configuration**
```bash
# Backend production environment
ADYEN_API_KEY=your_live_api_key
ADYEN_MERCHANT_ACCOUNT=your_live_merchant_account
ADYEN_CLIENT_KEY=your_live_client_key
ADYEN_HMAC_KEY=your_live_hmac_key
ADYEN_ENVIRONMENT=live  # or test
```

### **4. CORS Configuration**
Update FastAPI CORS to allow production domain:
```python
origins = [
    "https://sheltr-ai.web.app",
    "https://your-custom-domain.com"
]
```

## 🧪 **Testing Production**

1. **Deploy backend** with Adyen live credentials
2. **Update frontend** environment variables
3. **Test demo flow** on production URL
4. **Verify webhook** endpoint accessibility

## 🔧 **Current Status**

- ✅ **Frontend**: Environment-aware API calls
- ✅ **Backend**: Adyen demo endpoints ready
- ✅ **Local Testing**: Working perfectly
- 🎯 **Next**: Deploy to production when ready

The demo will work seamlessly in both development and production environments! 🎉