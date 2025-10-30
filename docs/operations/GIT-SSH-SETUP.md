# 🔐 Git SSH Authentication Setup

**Quick Reference Guide**

---

## 🎯 Purpose

This guide helps you set up SSH authentication for GitHub, eliminating the need for username/password when pushing code.

---

## ✅ Your SSH Public Key

Your current SSH public key is:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPTYU0v2Z0K+EIsAUGXmGsS/iXOdhgIBTimezxs7K9kY joel.yaffe@gmail.com
```

**Location**: `~/.ssh/id_ed25519.pub`

---

## 📋 Setup Steps

### Step 1: Add SSH Key to GitHub

1. Go to: https://github.com/settings/keys
2. Click "New SSH key" (green button)
3. Fill in:
   - **Title**: "MacBook Pro" (or any name you want)
   - **Key type**: Authentication Key
   - **Key**: Paste your public key from above
4. Click "Add SSH key"
5. Confirm with your GitHub password

### Step 2: Verify Connection

Open terminal and run:

```bash
ssh -T git@github.com
```

**Expected output:**
```
Hi mrj0nesmtl! You've successfully authenticated, but GitHub does not provide shell access.
```

If you see "Permission denied", the key hasn't been added yet.

---

## 🔧 Repository Configuration

### Current Setup:

The SHELTR-AI repository is already configured to use SSH:

```bash
# Remote URL
git@github.com:mrj0nesmtl/sheltr-ai.git
```

### Verify Configuration:

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai
git remote -v
```

Should show:
```
origin  git@github.com:mrj0nesmtl/sheltr-ai.git (fetch)
origin  git@github.com:mrj0nesmtl/sheltr-ai.git (push)
```

---

## 🚀 Usage

Once SSH is set up, pushing is simple:

```bash
git push origin main
```

No username or password required! 🎉

---

## 🔄 Switching Between HTTPS and SSH

### Switch to SSH (recommended):
```bash
git remote set-url origin git@github.com:mrj0nesmtl/sheltr-ai.git
```

### Switch to HTTPS (not recommended):
```bash
git remote set-url origin https://github.com/mrj0nesmtl/sheltr-ai.git
```

---

## 🐛 Troubleshooting

### Error: "Permission denied (publickey)"

**Cause**: SSH key not added to GitHub or wrong key being used

**Solution**:
1. Verify key is added to GitHub: https://github.com/settings/keys
2. Check SSH agent is running:
   ```bash
   ssh-add -l
   ```
3. Add key to SSH agent if needed:
   ```bash
   ssh-add ~/.ssh/id_ed25519
   ```

### Error: "Could not read Username for 'https://github.com'"

**Cause**: Using HTTPS instead of SSH

**Solution**: Switch to SSH (see above)

### Error: "Host key verification failed"

**Cause**: GitHub's host key not in known_hosts

**Solution**:
```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

---

## 🔒 Security Best Practices

1. ✅ **Never share your private key** (`~/.ssh/id_ed25519`)
2. ✅ **Only share your public key** (`~/.ssh/id_ed25519.pub`)
3. ✅ **Use SSH over HTTPS** for better security
4. ✅ **Keep your SSH keys backed up** securely
5. ✅ **Use different keys for different machines** (optional)

---

## 📚 Additional Resources

- [GitHub SSH Documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Generating SSH Keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [Testing SSH Connection](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)

---

## ✅ Quick Checklist

After setup, verify:

- [ ] SSH key added to GitHub
- [ ] `ssh -T git@github.com` succeeds
- [ ] `git remote -v` shows SSH URL
- [ ] `git push origin main` works without password

---

*Last updated: October 30, 2025*  
*Repository: sheltr-ai*  
*User: mrj0nesmtl (Joel Yaffe)*

