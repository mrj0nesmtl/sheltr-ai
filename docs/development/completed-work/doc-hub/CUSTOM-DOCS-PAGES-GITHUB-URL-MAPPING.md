# Custom Documentation Pages - GitHub URL Mapping

> **Purpose:** Map all custom-designed documentation pages to their correct GitHub markdown source after documentation restructuring.

---

## 📋 Complete Mapping Table

| Custom Page Route | Page File | Markdown Source Location | GitHub URL |
|-------------------|-----------|-------------------------|------------|
| `/docs/api` | `apps/web/src/app/docs/api/page.tsx` | `docs/reference/api-reference.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/reference/api-reference.md` |
| `/docs/blockchain` | `apps/web/src/app/docs/blockchain/page.tsx` | `docs/architecture/technical/tokenomics/blockchain.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/tokenomics/blockchain.md` |
| `/docs/chatbot-architecture` | `apps/web/src/app/docs/chatbot-architecture/page.tsx` | `docs/features/chatbot/SHELTR-AGENT-ARCHITECTURE.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/features/chatbot/SHELTR-AGENT-ARCHITECTURE.md` |
| `/docs/chatbot-user-guide` | `apps/web/src/app/docs/chatbot-user-guide/page.tsx` | `docs/features/chatbot/AGENT-QUICK-REFERENCE.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/features/chatbot/AGENT-QUICK-REFERENCE.md` |
| `/docs/donor-guide` | `apps/web/src/app/docs/donor-guide/page.tsx` | `docs/user-guides/donor-guide.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/user-guides/donor-guide.md` |
| `/docs/functionality-matrix` | `apps/web/src/app/docs/functionality-matrix/page.tsx` | *No markdown source - standalone page* | N/A |
| `/docs/hacking-homelessness` | `apps/web/src/app/docs/hacking-homelessness/page.tsx` | `docs/overview/hacking_homelessness.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/overview/hacking_homelessness.md` |
| `/docs/knowledge-base-guide` | `apps/web/src/app/docs/knowledge-base-guide/page.tsx` | `docs/features/knowledge-base/KNOWLEDGE-BASE-STRATEGY.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/features/knowledge-base/KNOWLEDGE-BASE-STRATEGY.md` |
| `/docs/mcp-demo` | `apps/web/src/app/docs/mcp-demo/page.tsx` | *No markdown source - interactive demo* | N/A |
| `/docs/mcp-integration` | `apps/web/src/app/docs/mcp-integration/page.tsx` | `docs/features/chatbot/MCP-INTEGRATION-GUIDE.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/features/chatbot/MCP-INTEGRATION-GUIDE.md` |
| `/docs/participant-guide` | `apps/web/src/app/docs/participant-guide/page.tsx` | `docs/user-guides/participant-guide.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/user-guides/participant-guide.md` |
| `/docs/payment-rails` | `apps/web/src/app/docs/payment-rails/page.tsx` | `docs/architecture/payment-rails/README.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/payment-rails/README.md` |
| `/docs/platform-overview` | `apps/web/src/app/docs/platform-overview/page.tsx` | *Custom summary page* | N/A |
| `/docs/roadmap` | `apps/web/src/app/docs/roadmap/page.tsx` | `docs/development/dev-roadmap.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/development/dev-roadmap.md` ✅ **UPDATED** |
| `/docs/shelter-admin-guide` | `apps/web/src/app/docs/shelter-admin-guide/page.tsx` | `docs/user-guides/shelter-admin-guide.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/user-guides/shelter-admin-guide.md` |
| `/docs/system-design` | `apps/web/src/app/docs/system-design/page.tsx` | `docs/architecture/technical/system-design.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/system-design.md` |
| `/docs/website-architecture` | `apps/web/src/app/docs/website-architecture/page.tsx` | `docs/architecture/technical/website-architecture.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/website-architecture.md` |
| `/docs/whitepaper` | `apps/web/src/app/docs/whitepaper/page.tsx` | `docs/architecture/technical/tokenomics/whitepaper_final.md` | `https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/tokenomics/whitepaper_final.md` |

---

## 🔧 Update Instructions

### **For Each Custom Page:**

1. **Open the page file** (e.g., `apps/web/src/app/docs/api/page.tsx`)
2. **Find the GitHub link** (search for `github.com/mrj0nesmtl/sheltr-ai/blob`)
3. **Replace with the new URL** from the table above
4. **Save the file**

### **Example:**

**Old URL (before restructure):**
```tsx
href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/API.md"
```

**New URL (after restructure):**
```tsx
href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/reference/api-reference.md"
```

---

## ✅ Status Tracking

- [x] `/docs/roadmap` - **COMPLETE** (updated Oct 31, 2025)
- [ ] `/docs/api`
- [ ] `/docs/blockchain`
- [ ] `/docs/chatbot-architecture`
- [ ] `/docs/chatbot-user-guide`
- [ ] `/docs/donor-guide`
- [ ] `/docs/hacking-homelessness`
- [ ] `/docs/knowledge-base-guide`
- [ ] `/docs/mcp-integration`
- [ ] `/docs/participant-guide`
- [ ] `/docs/payment-rails`
- [ ] `/docs/shelter-admin-guide`
- [ ] `/docs/system-design`
- [ ] `/docs/website-architecture`
- [ ] `/docs/whitepaper`

---

## 📝 Notes

- **Functionality Matrix** and **MCP Demo** are standalone interactive pages with no markdown source
- **Platform Overview** is a custom summary page
- All other pages should link to their corresponding markdown source on GitHub
- Remember to update the `hub_slug` in Knowledge Base config panel to match the custom page route

---

**Last Updated:** October 31, 2025

