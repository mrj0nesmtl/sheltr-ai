# 🔑 GitHub Token Renewal Guide
**Quick Reference for SHELTR-AI Knowledge Base Sync**

---

## 🚀 Quick Start (5 Minutes)

### **1. Generate Token**
Visit: https://github.com/settings/tokens/new

**Settings**:
- **Note**: `SHELTR-AI Knowledge Base Sync - Nov 2025`
- **Expiration**: 90 days (recommended) or No expiration
- **Scopes**:
  - ✅ `repo` (Full control of private repositories)
  - ✅ `read:org` (Read org and team membership)

Click "Generate token" → **Copy the token immediately**

---

### **2. Update Backend Environment**

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/api
```

Edit `.env` file (line 29):
```bash
GITHUB_TOKEN=ghp_YOUR_NEW_TOKEN_HERE
```

---

### **3. Restart Backend**

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai

# Stop backend
./stop-dev.sh

# Start backend
./start-dev.sh
```

---

### **4. Test Sync**

1. Open: http://localhost:3000/dashboard/knowledge
2. Click "Scan for Changes"
3. Verify: No 401 errors, actual file counts appear

---

## 📋 Verification Checklist

After renewal:
- [ ] Token copied and saved in `.env`
- [ ] Backend server restarted
- [ ] Sync shows real file counts (not 0/0/68)
- [ ] No 401 errors in `logs/backend.log`
- [ ] Calendar reminder set for next renewal (90 days)

---

## 🔍 Troubleshooting

### **Still Getting 401 Errors?**
1. Verify token was copied correctly (no extra spaces)
2. Check token has `repo` scope enabled
3. Restart backend server to load new environment variables

### **Token Not Working?**
1. Regenerate token on GitHub
2. Ensure repository `mrj0nesmtl/sheltr-ai` is accessible
3. Verify you have admin access to the repository

### **Sync Shows 0 Files?**
1. Check `GITHUB_OWNER` and `GITHUB_REPO` in `.env`
2. Verify `docs/` directory exists in repository
3. Check backend logs for specific errors

---

## 📅 Renewal Schedule

| Token Generated | Expiration | Status | Action Required |
|----------------|------------|--------|-----------------|
| Nov 24, 2025 | Feb 22, 2026 | 🟢 Active | Set calendar reminder |
| *Previous* | Nov 24, 2025 | 🔴 Expired | ✅ Renewed |

---

## 🔗 Resources

- **GitHub Token Settings**: https://github.com/settings/tokens
- **Token Scopes Documentation**: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
- **Backend Environment File**: `/Users/mrjones/Github/Projects/sheltr-ai/apps/api/.env`
- **Diagnostic Report**: `docs/operations/GITHUB-SYNC-DIAGNOSTIC-REPORT.md`

---

**Last Updated**: November 24, 2025  
**Next Review**: February 2026 (before token expiration)

