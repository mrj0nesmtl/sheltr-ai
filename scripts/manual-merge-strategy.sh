#!/bin/bash
# SHELTR Manual Merge Strategy for Conflicting Dependabot PRs
# Groups PRs by type and merges them systematically

set -e

echo "🔧 SHELTR Manual Dependabot Merge Strategy"
echo "=========================================="

# Our backup is already created: backup-before-dependabot-20250814-025748

echo "📋 STRATEGY: Merge PRs in logical groups to minimize conflicts"
echo ""

# Group 1: GitHub Actions (usually safe, no conflicts)
echo "🎯 GROUP 1: GitHub Actions updates"
GITHUB_ACTIONS_PRS="1"
echo "   PR #1: actions/setup-python from 4 to 5"

# Group 2: Python API dependencies  
echo ""
echo "🐍 GROUP 2: Python API dependencies (/apps/api)"
PYTHON_PRS="18 17 16 12 11 10 9 6 5 4 3"
echo "   PR #18: httpx (critical security)"
echo "   PR #17: aiohttp (critical security)"  
echo "   PR #16: openai (security)"
echo "   PR #12: qrcode[pil] (security)"
echo "   PR #11: google-cloud-firestore (security)"
echo "   PR #10: pydantic-settings (security)"
echo "   PR #9: langchain (security)"
echo "   PR #6: twilio (security)"
echo "   PR #5: textblob (security)"
echo "   PR #4: google-cloud-storage (security)"
echo "   PR #3: sendgrid (security)"

# Group 3: Frontend dependencies (/apps/web)
echo ""
echo "⚛️  GROUP 3: Frontend dependencies (/apps/web)"
FRONTEND_PRS="28 27 26 25 24 23 22 20 15 13"
echo "   PR #28: @modelcontextprotocol/sdk (security)"
echo "   PR #27: es-toolkit (security)"
echo "   PR #26: @radix-ui/react-select (security)"
echo "   PR #25: @eslint/plugin-kit (dev security)"
echo "   PR #24: napi-postinstall (dev security)"
echo "   PR #23: next (critical security)"
echo "   PR #22: eslint-config-next (dev security)"
echo "   PR #20: tw-animate-css (dev security)"
echo "   PR #15: @jridgewell/gen-mapping (dev security)"
echo "   PR #13: @types/node (dev security)"

# Group 4: Firebase Functions (/functions)
echo ""
echo "🔥 GROUP 4: Firebase Functions (/functions)"  
FUNCTIONS_PRS="21 19 14 8 7"
echo "   PR #21: firebase-admin (critical security)"
echo "   PR #19: eslint (dev security)"
echo "   PR #14: @typescript-eslint/eslint-plugin (dev security)"
echo "   PR #8: @typescript-eslint/parser (dev security)"
echo "   PR #7: typescript (dev security)"

echo ""
echo "🚀 EXECUTION PLAN:"
echo "1. Close all current conflicting PRs"
echo "2. Update dependencies manually in batches"
echo "3. Commit each batch separately"
echo "4. Let Dependabot create fresh PRs for any remaining updates"

echo ""
read -p "🤔 Proceed with manual merge strategy? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Manual merge cancelled"
    exit 1
fi

# Close all conflicting PRs first
echo ""
echo "🔄 Closing conflicting Dependabot PRs to prevent further conflicts..."

for PR in $GITHUB_ACTIONS_PRS $PYTHON_PRS $FRONTEND_PRS $FUNCTIONS_PRS; do
    echo "   Closing PR #$PR..."
    gh pr close "$PR" --comment "Closing to resolve conflicts - will update dependencies manually" || true
done

echo ""
echo "✅ All conflicting PRs closed"
echo ""
echo "🔧 NEXT: Manual dependency updates by group"
echo "   You can now update package.json/requirements.txt files manually"
echo "   Or run individual dependency update commands"
echo ""
echo "🔒 Remember: Your backup branch is available for rollback"
echo "   git checkout backup-before-dependabot-20250814-025748"
