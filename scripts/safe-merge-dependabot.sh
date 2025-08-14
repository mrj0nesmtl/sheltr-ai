#!/bin/bash
# SHELTR Safe Dependabot PR Merge Script
# Creates backup and merges security fixes with rollback capability

set -e

echo "🔒 SHELTR Safe Dependabot Merge Script"
echo "======================================"

# Store current commit for rollback
BACKUP_COMMIT=$(git rev-parse HEAD)
echo "📍 Backup commit: $BACKUP_COMMIT"

# Create a backup branch
BACKUP_BRANCH="backup-before-dependabot-$(date +%Y%m%d-%H%M%S)"
echo "🔄 Creating backup branch: $BACKUP_BRANCH"
git branch "$BACKUP_BRANCH"

echo ""
echo "✅ ROLLBACK INSTRUCTIONS (if needed):"
echo "   git checkout main"
echo "   git reset --hard $BACKUP_COMMIT"
echo "   git push --force-with-lease origin main"
echo ""

# Get all Dependabot PRs
echo "🔍 Fetching Dependabot PRs..."
DEPENDABOT_PRS=$(gh pr list --author "dependabot[bot]" --state open --json number --jq '.[].number')

if [ -z "$DEPENDABOT_PRS" ]; then
    echo "❌ No Dependabot PRs found"
    exit 1
fi

PR_COUNT=$(echo "$DEPENDABOT_PRS" | wc -l | tr -d ' ')
echo "📋 Found $PR_COUNT Dependabot PRs to merge"

# Confirmation
echo ""
read -p "🤔 Proceed with merging $PR_COUNT security PRs? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Merge cancelled"
    exit 1
fi

echo ""
echo "🚀 Starting safe merge process..."

# Counter for tracking
SUCCESS_COUNT=0
FAILED_COUNT=0
FAILED_PRS=""

# Merge each PR
for PR_NUMBER in $DEPENDABOT_PRS; do
    echo ""
    echo "🔄 Processing PR #$PR_NUMBER..."
    
    # Get PR details
    PR_TITLE=$(gh pr view "$PR_NUMBER" --json title --jq '.title')
    echo "   Title: $PR_TITLE"
    
    # Check if PR is still mergeable
    MERGEABLE=$(gh pr view "$PR_NUMBER" --json mergeable --jq '.mergeable')
    if [ "$MERGEABLE" != "MERGEABLE" ]; then
        echo "   ⚠️  PR #$PR_NUMBER is not mergeable (conflicts), skipping..."
        FAILED_COUNT=$((FAILED_COUNT + 1))
        FAILED_PRS="$FAILED_PRS #$PR_NUMBER"
        continue
    fi
    
    # Merge the PR
    if gh pr merge "$PR_NUMBER" --squash --delete-branch; then
        echo "   ✅ Successfully merged PR #$PR_NUMBER"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        
        # Small delay to avoid rate limiting
        sleep 2
    else
        echo "   ❌ Failed to merge PR #$PR_NUMBER"
        FAILED_COUNT=$((FAILED_COUNT + 1))
        FAILED_PRS="$FAILED_PRS #$PR_NUMBER"
    fi
done

echo ""
echo "🎉 MERGE COMPLETE!"
echo "=================="
echo "✅ Successfully merged: $SUCCESS_COUNT PRs"
echo "❌ Failed to merge: $FAILED_COUNT PRs"

if [ $FAILED_COUNT -gt 0 ]; then
    echo "Failed PRs:$FAILED_PRS"
    echo ""
    echo "🔍 Check failed PRs manually in GitHub"
fi

echo ""
echo "📊 NEXT STEPS:"
echo "1. Wait 5-10 minutes for GitHub security scan to update"
echo "2. Check security alerts should decrease significantly"
echo "3. Test your application to ensure everything works"
echo ""
echo "🔒 IF PROBLEMS OCCUR, ROLLBACK WITH:"
echo "   git checkout main"
echo "   git reset --hard $BACKUP_COMMIT"
echo "   git push --force-with-lease origin main"
echo ""
echo "✨ Your backup branch: $BACKUP_BRANCH"
echo "🎯 Current state: $SUCCESS_COUNT security vulnerabilities fixed!"
