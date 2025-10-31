# 📋 Document Visibility & Permissions Guide

**Last Updated**: October 31, 2025  
**Version**: 2.0

---

## 🎯 Overview

SHELTR uses a **multi-layer permission system** to control:
1. **Who** can access documents
2. **Where** documents are published
3. **Which systems** can use documents (chatbots, automations, etc.)

---

## 🔐 Permission Levels (WHO Can Access)

### 1. **Public** 🌍
- **Anyone can view** (no authentication required)
- **Chat Access**: Available to ALL chatbot users (shelter staff, donors, public)
- **Knowledge Base**: Visible to all authenticated users
- **Search**: Indexed and searchable by everyone
- **Use Case**: General information, public FAQs, marketing materials

**Example**: "How to Donate to SHELTR" guide

---

### 2. **Authenticated** 🔑
- **Only logged-in users** can view
- **Chat Access**: Available to authenticated chatbot users only
- **Knowledge Base**: Visible to all platform users with accounts
- **Search**: Searchable by authenticated users
- **Use Case**: Platform guides, user documentation, standard procedures

**Example**: "Dashboard User Guide"

---

### 3. **Role-Based** 👥
- **Specific roles required** (e.g., Admin, Shelter Operator)
- **Chat Access**: Only users with matching roles
- **Knowledge Base**: Filtered by role
- **Search**: Role-restricted results
- **Use Case**: Role-specific procedures, admin guides

**Example**: "Shelter Admin Configuration Guide"

---

### 4. **Private** 🔒
- **Restricted to specific users/teams**
- **Chat Access**: NOT available to chatbots
- **Knowledge Base**: Only visible to authorized individuals
- **Search**: NOT included in general search
- **Use Case**: Internal memos, sensitive data, draft documents

**Example**: "Q4 Financial Strategy (Internal Only)"

---

## 🌐 Visibility Scope (WHERE Documents Are Available)

### 1. **Global** 🌍
**Available across entire platform**

| System | Access |
|--------|--------|
| **All Chatbots** | ✅ Yes |
| **All Knowledge Bases** | ✅ Yes |
| **All Shelters** | ✅ Yes |
| **All Organizations** | ✅ Yes |
| **Automations** | ✅ Yes |
| **RAG/Embeddings** | ✅ Yes |

**Use Case**: Universal platform knowledge, best practices, general guides  
**Example**: "SHELTR Platform Overview", "How QR Donations Work"

---

### 2. **Shelter** 🏠
**Limited to specific shelter**

| System | Access |
|--------|--------|
| **Shelter-Specific Chatbots** | ✅ Yes |
| **Shelter Knowledge Base** | ✅ Yes |
| **Shelter Automations** | ✅ Yes |
| **Public Website** | ❌ No |
| **Other Shelters** | ❌ No |
| **Platform Admin** | ✅ Yes (inherited) |

**Use Case**: Shelter-specific procedures, local policies, facility info  
**Example**: "Downtown Shelter Check-In Procedures"

**❓ Will this be in public chatbots?**  
❌ **NO** - Only shelter staff chatbots can access this!

---

### 3. **Organization** 🏢
**Limited to your internal team (SHELTR core team)**

| System | Access |
|--------|--------|
| **Internal Team Chat** | ✅ Yes |
| **Internal Knowledge Base** | ✅ Yes |
| **Internal Automations** | ✅ Yes |
| **Shelter Staff** | ❌ No |
| **Public** | ❌ No |
| **Founders Portal** | ✅ Yes (can be enabled) |
| **Investor Relations** | ✅ Yes (can be enabled) |

**Use Case**: Internal documents, team procedures, company knowledge  
**Example**: "SHELTR Team Onboarding Guide", "Internal API Documentation"

---

## 📍 Publishing Destinations (Distribution Channels)

### 1. **Public Docs Hub** 📚
- **URL**: `https://sheltr-ai.web.app/docs`
- **Requirements**: 
  - Permission Level: `Public`
  - Published to Hub: `Enabled`
- **Systems**:
  - Public website
  - Public chatbots
  - Search engines (SEO)
- **Use Case**: Product documentation, guides, API references

---

### 2. **Founders Portal** 👔
- **URL**: `https://sheltr-ai.web.app/founders`
- **Requirements**: 
  - Permission Level: `Private` or `Role-Based`
  - Visibility Scope: `Organization`
  - Founders Access: `Enabled`
- **Systems**:
  - Founders dashboard
  - Executive reports
  - Strategic planning tools
- **Use Case**: Strategic documents, investor updates, financial reports

---

### 3. **Investor Relations (IR)** 💼
- **URL**: `https://sheltr-ai.web.app/ir/dataroom`
- **Requirements**: 
  - Permission Level: `Private`
  - Visibility Scope: `Organization`
  - IR Access: `Enabled`
- **Systems**:
  - Data room
  - Investor dashboard
  - Due diligence portal
- **Use Case**: Investment decks, financial statements, legal documents

---

## 🤖 System Access Matrix

| System | Global + Public | Global + Auth | Shelter + Public | Organization + Private |
|--------|-----------------|---------------|------------------|------------------------|
| **Public Website Chatbot** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Authenticated Chatbot** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Shelter Staff Chatbot** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Internal Team Chat** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Public Docs Hub** | ✅ Yes (if published) | ❌ No | ❌ No | ❌ No |
| **Knowledge Base Search** | ✅ Yes | ✅ Yes | ✅ Yes (filtered) | ✅ Yes (filtered) |
| **N8N Automations** | ✅ Yes | ✅ Yes | ✅ Yes (context) | ✅ Yes (context) |
| **RAG Embeddings** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (restricted) |

---

## 🎯 Common Use Cases

### Use Case 1: Shelter Operator Manual
**Goal**: Share with shelter staff ONLY

```
✅ Permission Level: Role-Based (Shelter Operator)
✅ Visibility Scope: Shelter
❌ Publish to Docs Hub: No
❌ Founders Portal: No
❌ Investor Relations: No
```

**Result**: 
- ✅ Shelter staff chatbot can access
- ✅ Visible in shelter's knowledge base
- ❌ NOT available to public
- ❌ NOT in general chatbots

---

### Use Case 2: Public API Documentation
**Goal**: Share with developers publicly

```
✅ Permission Level: Public
✅ Visibility Scope: Global
✅ Publish to Docs Hub: Yes
❌ Founders Portal: No
❌ Investor Relations: No
```

**Result**: 
- ✅ Public docs hub (`/docs/api-reference`)
- ✅ Public chatbot can answer questions
- ✅ Searchable by everyone
- ✅ SEO indexed

---

### Use Case 3: Investor Pitch Deck
**Goal**: Share with investors only

```
✅ Permission Level: Private
✅ Visibility Scope: Organization
❌ Publish to Docs Hub: No
✅ Founders Portal: Yes
✅ Investor Relations: Yes
```

**Result**: 
- ✅ Investor data room
- ✅ Founders dashboard
- ❌ NOT in chatbots
- ❌ NOT public

---

### Use Case 4: Internal Team Procedures
**Goal**: Internal team only

```
✅ Permission Level: Private
✅ Visibility Scope: Organization
❌ Publish to Docs Hub: No
❌ Founders Portal: No
❌ Investor Relations: No
```

**Result**: 
- ✅ Internal knowledge base
- ✅ Team chatbot
- ❌ NOT visible externally

---

## 🏷️ Badge System

Documents display badges showing their publishing status:

### Permission Badges
- 🌍 **Public** - Anyone can access
- 🔑 **Authenticated** - Login required
- 👥 **Role-Based** - Specific roles only
- 🔒 **Private** - Restricted access

### Visibility Badges
- 🌍 **Global** - Platform-wide
- 🏠 **Shelter** - Shelter-specific
- 🏢 **Organization** - Internal only

### Publishing Badges
- 📚 **Docs Hub** - Published to public docs
- 👔 **Founders** - In founders portal
- 💼 **IR** - In investor relations
- 🤖 **Chatbot Ready** - Embeddings complete

---

## ⚙️ Recommended Settings by Document Type

| Document Type | Permission | Visibility | Publish To |
|--------------|------------|------------|------------|
| **Public Guide** | Public | Global | Docs Hub |
| **API Reference** | Public | Global | Docs Hub |
| **User Manual** | Authenticated | Global | - |
| **Shelter Procedure** | Role-Based | Shelter | - |
| **Admin Guide** | Role-Based | Global | - |
| **Internal Memo** | Private | Organization | - |
| **Investor Deck** | Private | Organization | Founders + IR |
| **Financial Report** | Private | Organization | Founders + IR |
| **Team Handbook** | Private | Organization | - |

---

## 🔍 Permission Hierarchy

**Higher roles inherit lower permissions:**

```
Super Admin (Platform)
    ↓ Can access everything
Shelter Admin
    ↓ Can access: Global + Shelter + Authenticated
Shelter Operator
    ↓ Can access: Global + Shelter (filtered)
Authenticated User
    ↓ Can access: Global + Authenticated
Public User
    ↓ Can access: Global + Public only
```

---

## 📊 Quick Reference

### "My document should be in chatbots" ✅
```
Permission: Public or Authenticated
Visibility: Global
Embedding Status: Completed
```

### "My document is shelter-specific" ✅
```
Permission: Role-Based (Shelter role)
Visibility: Shelter
Embedding Status: Completed
```

### "My document is internal only" ✅
```
Permission: Private
Visibility: Organization
Publish to: None (or Founders/IR if needed)
```

### "My document is for investors" ✅
```
Permission: Private
Visibility: Organization
Publish to: Investor Relations
```

---

## 🚨 Important Notes

1. **Chatbot Access**:
   - Only documents with `Embedding Status: Completed` can be used by chatbots
   - Permission level filters which chatbot users can access them
   - Visibility scope determines which chatbot instances have access

2. **Publishing**:
   - You can publish to multiple destinations simultaneously
   - Each destination has its own access rules
   - Publishing doesn't override permission levels

3. **Search**:
   - Search respects permission levels
   - Users only see documents they have access to
   - Private documents never appear in public search

4. **Automations**:
   - N8N automations respect visibility scope
   - Workflows only access documents in their context
   - Organization scope = internal automations only

---

## 💡 Need Help?

**Common Questions:**
- "Where will this document be visible?" → Check Permission + Visibility + Publishing
- "Can chatbots use this?" → Check Embedding Status + Permission Level
- "Is this public?" → Check if Published to Docs Hub
- "Who can edit this?" → Separate from viewing permissions (role-based)

---

*This guide is part of the SHELTR Knowledge Management System*  
*For technical implementation details, see: `/docs/features/DOCS-HUB-PUBLISHER.md`*

