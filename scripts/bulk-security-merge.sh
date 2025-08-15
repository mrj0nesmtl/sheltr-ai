#!/bin/bash

# SHELTR Security Bulk Merge Script
# Safely merges low-risk Dependabot PRs in batches

set -e

echo "🔒 SHELTR Security Bulk Merge Tool"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo "Install with: brew install gh"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with GitHub${NC}"
    echo "Run: gh auth login"
    exit 1
fi

echo -e "${BLUE}📊 Fetching Dependabot PRs...${NC}"

# Get all open Dependabot PRs
dependabot_prs=$(gh pr list --author "app/dependabot" --state open --json number,title,labels,headRefName)

if [ -z "$dependabot_prs" ] || [ "$dependabot_prs" = "[]" ]; then
    echo -e "${GREEN}✅ No Dependabot PRs to merge${NC}"
    exit 0
fi

echo -e "${YELLOW}📋 Found Dependabot PRs:${NC}"
echo "$dependabot_prs" | jq -r '.[] | "  PR #\(.number): \(.title)"'

echo ""
echo -e "${BLUE}🎯 Categorizing PRs by risk level...${NC}"

# Safe categories for auto-merge (patch versions, dev dependencies)
safe_patterns=(
    "patch"
    "deps-dev"
    "eslint"
    "@types/"
    "typescript"
    "autoprefixer"
    "tailwindcss"
)

# Get PRs that match safe patterns
safe_prs=()
risky_prs=()

while IFS= read -r pr_data; do
    pr_number=$(echo "$pr_data" | jq -r '.number')
    pr_title=$(echo "$pr_data" | jq -r '.title')
    
    is_safe=false
    for pattern in "${safe_patterns[@]}"; do
        if [[ "$pr_title" =~ $pattern ]]; then
            is_safe=true
            break
        fi
    done
    
    if [ "$is_safe" = true ]; then
        safe_prs+=("$pr_number")
    else
        risky_prs+=("$pr_number")
    fi
done <<< "$(echo "$dependabot_prs" | jq -c '.[]')"

echo -e "${GREEN}✅ Safe PRs (${#safe_prs[@]}): ${safe_prs[*]}${NC}"
echo -e "${YELLOW}⚠️  Risky PRs (${#risky_prs[@]}): ${risky_prs[*]}${NC}"

# Function to merge a PR safely
merge_pr() {
    local pr_number=$1
    echo -e "${BLUE}🔄 Attempting to merge PR #$pr_number...${NC}"
    
    # Check if PR is mergeable
    pr_status=$(gh pr view "$pr_number" --json mergeable,statusCheckRollupState)
    mergeable=$(echo "$pr_status" | jq -r '.mergeable')
    checks=$(echo "$pr_status" | jq -r '.statusCheckRollupState')
    
    if [ "$mergeable" = "MERGEABLE" ] && [ "$checks" = "SUCCESS" ]; then
        if gh pr merge "$pr_number" --squash --delete-branch; then
            echo -e "${GREEN}✅ Successfully merged PR #$pr_number${NC}"
            return 0
        else
            echo -e "${RED}❌ Failed to merge PR #$pr_number${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  PR #$pr_number not ready (mergeable: $mergeable, checks: $checks)${NC}"
        return 1
    fi
}

# Ask user what to do
echo ""
echo -e "${BLUE}🤔 What would you like to do?${NC}"
echo "1. Merge safe PRs only (recommended)"
echo "2. Merge all PRs"
echo "3. Show detailed info and exit"
echo "4. Exit"

read -p "Choose option (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}🚀 Merging safe PRs...${NC}"
        merged_count=0
        failed_count=0
        
        for pr_number in "${safe_prs[@]}"; do
            if merge_pr "$pr_number"; then
                ((merged_count++))
                sleep 2  # Rate limiting
            else
                ((failed_count++))
            fi
        done
        
        echo ""
        echo -e "${GREEN}📊 Summary: Merged $merged_count PRs, Failed $failed_count PRs${NC}"
        if [ ${#risky_prs[@]} -gt 0 ]; then
            echo -e "${YELLOW}⚠️  ${#risky_prs[@]} risky PRs require manual review${NC}"
        fi
        ;;
    2)
        echo -e "${YELLOW}⚠️  Merging ALL PRs (including risky ones)...${NC}"
        all_prs=("${safe_prs[@]}" "${risky_prs[@]}")
        merged_count=0
        failed_count=0
        
        for pr_number in "${all_prs[@]}"; do
            if merge_pr "$pr_number"; then
                ((merged_count++))
                sleep 2  # Rate limiting
            else
                ((failed_count++))
            fi
        done
        
        echo ""
        echo -e "${GREEN}📊 Summary: Merged $merged_count PRs, Failed $failed_count PRs${NC}"
        ;;
    3)
        echo -e "${BLUE}📋 Detailed PR Information:${NC}"
        echo "$dependabot_prs" | jq -r '.[] | "PR #\(.number): \(.title)\n  Branch: \(.headRefName)\n"'
        ;;
    4)
        echo -e "${BLUE}👋 Exiting...${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac
