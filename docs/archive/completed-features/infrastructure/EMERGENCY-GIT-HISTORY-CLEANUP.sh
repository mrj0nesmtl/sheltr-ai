#!/bin/bash

# ============================================================================
# EMERGENCY: Remove .local-secure-docs from Git History
# ============================================================================
# 
# CRITICAL SECURITY ISSUE:
# - .local-secure-docs was accidentally committed to public GitHub
# - This script removes it from ALL Git history
# - Uses BFG Repo-Cleaner (faster and safer than git filter-branch)
#
# WHAT THIS SCRIPT DOES:
# 1. Installs BFG Repo-Cleaner (if not already installed)
# 2. Creates a fresh mirror clone of the repository
# 3. Removes .local-secure-docs from ALL commits in history
# 4. Cleans up Git objects
# 5. Prepares for force push to GitHub
#
# IMPORTANT:
# - This rewrites Git history (all commit SHAs will change)
# - Requires force push to GitHub
# - Anyone with a clone will need to re-clone
# - Run this script from the project root directory
#
# ============================================================================

set -e  # Exit on any error

echo "============================================================================"
echo "EMERGENCY: Removing .local-secure-docs from Git History"
echo "============================================================================"
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ ERROR: Must run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

echo "✅ Current directory: $(pwd)"
echo ""

# Step 1: Install BFG Repo-Cleaner (if not already installed)
echo "Step 1: Checking for BFG Repo-Cleaner..."
if ! command -v bfg &> /dev/null; then
    echo "BFG not found. Installing via Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "❌ ERROR: Homebrew not installed. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    brew install bfg
    echo "✅ BFG installed successfully"
else
    echo "✅ BFG already installed"
fi
echo ""

# Step 2: Create a backup of current state
echo "Step 2: Creating backup of current state..."
BACKUP_DIR="../sheltr-ai-backup-$(date +%Y%m%d-%H%M%S)"
cp -r . "$BACKUP_DIR"
echo "✅ Backup created at: $BACKUP_DIR"
echo ""

# Step 3: Ensure latest commit removes .local-secure-docs
echo "Step 3: Verifying latest commit removes .local-secure-docs..."
if git ls-tree -r HEAD --name-only | grep -q "^\.local-secure-docs/"; then
    echo "❌ ERROR: .local-secure-docs still exists in HEAD commit"
    echo "   Please commit the removal first:"
    echo "   git rm -r --cached .local-secure-docs"
    echo "   git commit -m 'security: Remove .local-secure-docs from tracking'"
    exit 1
fi
echo "✅ .local-secure-docs removed from HEAD commit"
echo ""

# Step 4: Create a fresh mirror clone
echo "Step 4: Creating fresh mirror clone..."
MIRROR_DIR="../sheltr-ai-mirror-$(date +%Y%m%d-%H%M%S).git"
git clone --mirror . "$MIRROR_DIR"
echo "✅ Mirror clone created at: $MIRROR_DIR"
echo ""

# Step 5: Run BFG to remove .local-secure-docs from history
echo "Step 5: Running BFG to remove .local-secure-docs from ALL commits..."
echo "   This may take a few minutes..."
bfg --delete-folders .local-secure-docs "$MIRROR_DIR"
echo "✅ BFG completed successfully"
echo ""

# Step 6: Clean up Git objects in mirror
echo "Step 6: Cleaning up Git objects..."
cd "$MIRROR_DIR"
git reflog expire --expire=now --all
git gc --prune=now --aggressive
cd - > /dev/null
echo "✅ Git objects cleaned"
echo ""

# Step 7: Verify removal
echo "Step 7: Verifying .local-secure-docs is removed from history..."
cd "$MIRROR_DIR"
if git log --all --pretty=format: --name-only --diff-filter=A | grep -q "^\.local-secure-docs/"; then
    echo "⚠️  WARNING: .local-secure-docs still found in some commits"
    echo "   Manual review may be needed"
else
    echo "✅ .local-secure-docs successfully removed from all commits"
fi
cd - > /dev/null
echo ""

# Step 8: Instructions for force push
echo "============================================================================"
echo "✅ CLEANUP COMPLETE!"
echo "============================================================================"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Review the cleaned repository:"
echo "   cd $MIRROR_DIR"
echo "   git log --all --oneline | head -20"
echo ""
echo "2. If everything looks good, force push to GitHub:"
echo "   cd $(pwd)"
echo "   git remote add mirror $MIRROR_DIR"
echo "   git fetch mirror"
echo "   git reset --hard mirror/main"
echo "   git push origin main --force"
echo ""
echo "3. Notify all team members:"
echo "   - All commit SHAs have changed"
echo "   - Everyone must re-clone the repository"
echo "   - Any open PRs will need to be recreated"
echo ""
echo "4. Verify on GitHub:"
echo "   - Check that .local-secure-docs is not visible"
echo "   - Check repository size has decreased"
echo ""
echo "⚠️  IMPORTANT WARNINGS:"
echo "   - This is a DESTRUCTIVE operation"
echo "   - All commit SHAs will change"
echo "   - Force push will overwrite GitHub history"
echo "   - Make sure you have a backup before proceeding"
echo ""
echo "📁 Backup location: $BACKUP_DIR"
echo "📁 Mirror location: $MIRROR_DIR"
echo ""
echo "============================================================================"

