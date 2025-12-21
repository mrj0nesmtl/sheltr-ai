#!/bin/bash

# SHELTR-AI Dependabot PR Batch Merge Script
# Date: December 20, 2025
# Total PRs to merge: 17 (16 safe + 1 Adyen)

set -e  # Exit on error

echo "🚀 SHELTR-AI Dependabot PR Batch Merge"
echo "======================================"
echo ""
echo "Merging 17 dependency update PRs..."
echo ""

# Check if gh CLI is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI not authenticated!"
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Counter for successful merges
SUCCESS_COUNT=0
FAILED_COUNT=0
FAILED_PRS=()

# Function to merge a PR
merge_pr() {
    local PR_NUM=$1
    local TITLE=$2
    
    echo "📦 Merging PR #$PR_NUM: $TITLE"
    
    if gh pr merge $PR_NUM --squash --auto --repo mrj0nesmtl/sheltr-ai 2>/dev/null; then
        echo "   ✅ Success!"
        ((SUCCESS_COUNT++))
    else
        echo "   ❌ Failed"
        ((FAILED_COUNT++))
        FAILED_PRS+=($PR_NUM)
    fi
    echo ""
}

# Frontend Dependencies (9 PRs)
echo "🎨 FRONTEND DEPENDENCIES (apps/web)"
echo "-----------------------------------"
merge_pr 295 "@modelcontextprotocol/sdk: 1.24.2 → 1.25.1"
merge_pr 294 "style-to-js: 1.1.17 → 1.1.21"
merge_pr 293 "recharts: 3.2.1 → 3.6.0"
merge_pr 292 "css-selector-parser: 3.1.3 → 3.3.0"
merge_pr 291 "react-hook-form: 7.63.0 → 7.68.0"
merge_pr 290 "eslint: 9.38.0 → 9.39.2"
merge_pr 289 "@radix-ui/react-label: 2.1.7 → 2.1.8"
merge_pr 288 "eslint-config-next: 15.4.6 → 16.0.10"
merge_pr 282 "@types/qrcode: 1.5.5 → 1.5.6"
merge_pr 277 "jiti: 2.5.1 → 2.6.1"

# Backend Dependencies (10 PRs)
echo "⚙️  BACKEND DEPENDENCIES (apps/api)"
echo "-----------------------------------"
merge_pr 287 "google-auth: 2.43.0 → 2.45.0"
merge_pr 286 "python-multipart: 0.0.20 → 0.0.21"
merge_pr 285 "google-generativeai: 0.8.5 → 0.8.6"
merge_pr 284 "click: 8.1.8 → 8.3.1"
merge_pr 283 "adyen: 13.4.0 → 14.0.0 (not yet implemented)"
merge_pr 281 "mypy: 1.17.1 → 1.19.1"
merge_pr 279 "twilio: 9.8.8 → 9.9.0"
merge_pr 278 "sentry-sdk[fastapi]: 2.37.1 → 2.48.0"
merge_pr 276 "google-cloud-firestore: 2.21.0 → 2.22.0"

# Summary
echo "======================================"
echo "📊 MERGE SUMMARY"
echo "======================================"
echo "✅ Successfully merged: $SUCCESS_COUNT PRs"
echo "❌ Failed to merge: $FAILED_COUNT PRs"

if [ $FAILED_COUNT -gt 0 ]; then
    echo ""
    echo "Failed PRs:"
    for pr in "${FAILED_PRS[@]}"; do
        echo "  - PR #$pr"
    done
    echo ""
    echo "You can manually merge these at:"
    echo "https://github.com/mrj0nesmtl/sheltr-ai/pulls"
fi

echo ""
echo "🎉 Batch merge complete!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Pull latest changes: git pull origin main"
echo "2. Update dependencies:"
echo "   - Frontend: cd apps/web && npm install"
echo "   - Backend: cd apps/api && pip install -r requirements.txt"
echo "3. Restart dev environment: ./start-dev.sh"
echo "4. Test dashboard charts (recharts update)"
echo "5. Run linting: cd apps/web && npm run lint"
echo ""
echo "Only 3 PRs remaining to review:"
echo "  - PR #280: OpenAI 1.99.9 → 2.13.0 (MAJOR - review required)"
echo ""
