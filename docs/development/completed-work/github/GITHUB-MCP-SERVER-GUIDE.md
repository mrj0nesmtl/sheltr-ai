# GitHub MCP Server - Quick Reference Guide

**Date**: December 11, 2025  
**Project**: SHELTR-AI

---

## 📦 Installation Status

✅ **GitHub MCP Server Installed**: `@modelcontextprotocol/server-github@2025.4.8`  
📍 **Installation Type**: Global NPM package  
🔧 **Installation Date**: December 11, 2025

---

## 🚀 What is the GitHub MCP Server?

The GitHub Model Context Protocol (MCP) server provides AI agents with direct access to GitHub repositories, enabling:

- **Repository Management**: Create, read, update repositories
- **Issue Tracking**: Create, update, close issues
- **Pull Request Management**: Create, review, merge PRs
- **Security Alerts**: Access Dependabot and Code Scanning alerts
- **File Operations**: Read, write, delete files in repositories
- **Branch Management**: Create, switch, merge branches
- **Commit Operations**: Create commits, view history

---

## 🔑 Authentication Setup

### GitHub Personal Access Token Required

To use the GitHub MCP server, you need a GitHub Personal Access Token (PAT) with appropriate permissions.

#### Required Scopes:
- `repo` - Full control of private repositories
- `workflow` - Update GitHub Action workflows
- `read:org` - Read organization data
- `read:user` - Read user profile data
- `security_events` - Read security events (for Dependabot/CodeQL alerts)

#### Create Token:
1. Go to: https://github.com/settings/tokens/new
2. Select scopes: `repo`, `workflow`, `read:org`, `read:user`, `security_events`
3. Generate token
4. Save securely (you won't see it again!)

#### Configure Token:

**Option 1: Environment Variable**
```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

**Option 2: MCP Configuration**
Create or update `~/.config/mcp/config.json`:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

---

## 🛠️ Common MCP Commands

### Repository Operations

```bash
# List repositories
mcp github list-repos --owner mrj0nesmtl

# Get repository details
mcp github get-repo --owner mrj0nesmtl --repo sheltr-ai

# Create new branch
mcp github create-branch --owner mrj0nesmtl --repo sheltr-ai --branch security/fixes --from main
```

### Security Alerts

```bash
# List Dependabot alerts
mcp github list-dependabot-alerts --owner mrj0nesmtl --repo sheltr-ai

# List Code Scanning alerts
mcp github list-code-scanning-alerts --owner mrj0nesmtl --repo sheltr-ai

# Get specific alert details
mcp github get-dependabot-alert --owner mrj0nesmtl --repo sheltr-ai --alert-number 34
```

### Pull Requests

```bash
# List open PRs
mcp github list-prs --owner mrj0nesmtl --repo sheltr-ai --state open

# Get PR details
mcp github get-pr --owner mrj0nesmtl --repo sheltr-ai --pr-number 216

# Merge PR
mcp github merge-pr --owner mrj0nesmtl --repo sheltr-ai --pr-number 216 --merge-method squash
```

### Issues

```bash
# List issues
mcp github list-issues --owner mrj0nesmtl --repo sheltr-ai --state open

# Create issue
mcp github create-issue --owner mrj0nesmtl --repo sheltr-ai --title "Security Fix" --body "Details..."

# Close issue
mcp github close-issue --owner mrj0nesmtl --repo sheltr-ai --issue-number 123
```

---

## 🤖 Using with AI Agents

### In Cursor AI

The GitHub MCP server is automatically available to Cursor AI agents. You can reference GitHub operations in your prompts:

**Example Prompts:**

```
"List all open Dependabot alerts in the sheltr-ai repository"

"Show me the details of pull request #216"

"Create a new branch called 'security/node-forge-fix' from main"

"Merge all Dependabot PRs that update patch versions"

"Show me all Code Scanning alerts with HIGH severity"
```

### In New Chat Sessions

When starting a new AI session for security remediation, the agent can:

1. **Automatically fetch** current security alerts
2. **Analyze** pull requests and their changes
3. **Create branches** for fixes
4. **Commit changes** directly to GitHub
5. **Merge PRs** after verification
6. **Close alerts** once resolved

---

## 📊 Current Repository Status

### Quick Stats (as of Dec 11, 2025)

- **Open PRs**: 27 (mostly Dependabot updates)
- **Dependabot Alerts**: 10 (3 HIGH, 4 MODERATE, 3 LOW)
- **Code Scanning Alerts**: 4 (3 HIGH, 1 MEDIUM)
- **Secret Scanning Alerts**: 30 CLOSED ✅

### Priority Issues

1. **node-forge** vulnerabilities (HIGH) - 3 alerts
2. **XSS vulnerabilities** in gallery pages (HIGH) - 2 alerts
3. **Sensitive logging** in Python backend (HIGH) - 1 alert
4. **Dependency updates** - 27 pending PRs

---

## 🔒 Security Best Practices

### When Using MCP Server

1. **Never commit tokens** to the repository
2. **Use environment variables** for authentication
3. **Rotate tokens regularly** (every 90 days)
4. **Limit token scope** to minimum required permissions
5. **Monitor token usage** in GitHub settings

### For Security Remediation

1. **Create feature branches** for all fixes
2. **Test thoroughly** before merging
3. **Document changes** in commits
4. **Update CHANGELOG.md** for all security fixes
5. **Review PRs** even if auto-generated

---

## 🚨 Troubleshooting

### Common Issues

**Issue**: "Authentication failed"
- **Solution**: Check `GITHUB_TOKEN` is set and valid
- **Verify**: Token has required scopes

**Issue**: "Rate limit exceeded"
- **Solution**: Wait for rate limit reset (check headers)
- **Alternative**: Use authenticated requests (higher limits)

**Issue**: "Resource not found"
- **Solution**: Verify repository name and owner
- **Check**: Token has access to private repositories

**Issue**: "Permission denied"
- **Solution**: Ensure token has required scopes
- **Update**: Token permissions in GitHub settings

---

## 📚 Additional Resources

- **GitHub MCP Server Repo**: https://github.com/github/github-mcp-server
- **MCP Documentation**: https://modelcontextprotocol.io/
- **GitHub API Docs**: https://docs.github.com/en/rest
- **Cursor AI Docs**: https://cursor.sh/docs

---

## 🎯 Next Steps

1. ✅ Install GitHub MCP Server (COMPLETE)
2. ✅ Create comprehensive remediation prompt (COMPLETE)
3. ⏳ Configure GitHub token for MCP
4. ⏳ Start new AI session with remediation prompt
5. ⏳ Systematically address all security issues
6. ⏳ Test and verify fixes
7. ⏳ Update documentation

---

**Document Created**: December 11, 2025  
**Last Updated**: December 11, 2025  
**Status**: Ready for Use

