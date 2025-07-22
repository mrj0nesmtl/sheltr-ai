#!/bin/bash
# migrate-valuable-content.sh
# Migrate high-value legacy documentation to new SHELTR-AI structure

echo "🚀 SHELTR-AI Legacy Content Migration"
echo "======================================"

# Create staging directories
echo "📁 Creating staging directories..."
mkdir -p docs/legacy-migration/high-priority
mkdir -p docs/legacy-migration/medium-priority
mkdir -p docs/legacy-migration/reference

echo "✅ Staging directories created"

# High Priority - Documents to migrate and update
echo ""
echo "🏆 Migrating HIGH PRIORITY documents..."

if [ -f "public/docs/technical/whitepaper_final.md" ]; then
    cp "public/docs/technical/whitepaper_final.md" "docs/legacy-migration/high-priority/"
    echo "   ✅ Whitepaper (final version)"
else
    echo "   ⚠️  Whitepaper not found"
fi

if [ -f "public/docs/technical/blockchain.md" ]; then
    cp "public/docs/technical/blockchain.md" "docs/legacy-migration/high-priority/"
    echo "   ✅ Blockchain documentation"
else
    echo "   ⚠️  Blockchain doc not found"
fi

if [ -f "public/docs/core/overview.md" ]; then
    cp "public/docs/core/overview.md" "docs/legacy-migration/high-priority/"
    echo "   ✅ Core overview"
else
    echo "   ⚠️  Core overview not found"
fi

if [ -f "public/docs/core/architecture.md" ]; then
    cp "public/docs/core/architecture.md" "docs/legacy-migration/high-priority/"
    echo "   ✅ Legacy architecture"
else
    echo "   ⚠️  Architecture doc not found"
fi

if [ -f "public/docs/core/rbac.md" ]; then
    cp "public/docs/core/rbac.md" "docs/legacy-migration/high-priority/"
    echo "   ✅ RBAC documentation"
else
    echo "   ⚠️  RBAC doc not found"
fi

if [ -f "public/docs/about/hacking_homelessness.md" ]; then
    cp "public/docs/about/hacking_homelessness.md" "docs/legacy-migration/high-priority/"
    echo "   ✅ Mission & vision document"
else
    echo "   ⚠️  Mission doc not found"
fi

# Medium Priority - Reference documents
echo ""
echo "🔄 Migrating MEDIUM PRIORITY documents..."

if [ -f "public/docs/core/api.md" ]; then
    cp "public/docs/core/api.md" "docs/legacy-migration/medium-priority/"
    echo "   ✅ Legacy API documentation"
fi

if [ -f "public/docs/core/security.md" ]; then
    cp "public/docs/core/security.md" "docs/legacy-migration/medium-priority/"
    echo "   ✅ Security documentation"
fi

if [ -f "public/docs/technical/qr-system.md" ]; then
    cp "public/docs/technical/qr-system.md" "docs/legacy-migration/medium-priority/"
    echo "   ✅ QR system documentation"
fi

if [ -f "public/docs/guides/best-practices.md" ]; then
    cp "public/docs/guides/best-practices.md" "docs/legacy-migration/medium-priority/"
    echo "   ✅ Best practices guide"
fi

# Reference - Technical specs and whitepapers
echo ""
echo "📚 Migrating REFERENCE documents..."

if [ -f "public/docs/technical/whitepaper_en.md" ]; then
    cp "public/docs/technical/whitepaper_en.md" "docs/legacy-migration/reference/"
    echo "   ✅ English whitepaper"
fi

if [ -f "public/docs/technical/whitepaper_fr.md" ]; then
    cp "public/docs/technical/whitepaper_fr.md" "docs/legacy-migration/reference/"
    echo "   ✅ French whitepaper"
fi

if [ -f "public/docs/core/technical.md" ]; then
    cp "public/docs/core/technical.md" "docs/legacy-migration/reference/"
    echo "   ✅ Technical specifications"
fi

if [ -f "public/docs/technical/authentication.md" ]; then
    cp "public/docs/technical/authentication.md" "docs/legacy-migration/reference/"
    echo "   ✅ Authentication documentation"
fi

if [ -f "public/docs/technical/database.md" ]; then
    cp "public/docs/technical/database.md" "docs/legacy-migration/reference/"
    echo "   ✅ Database documentation (Supabase reference)"
fi

# Create migration guide
echo ""
echo "📝 Creating migration guide..."

cat > docs/legacy-migration/MIGRATION-GUIDE.md << 'EOF'
# 📋 Legacy Content Migration Guide

This directory contains valuable content from the legacy SHELTR system that should be integrated into the new SHELTR-AI documentation structure.

## 🏆 High Priority Documents

These documents contain core concepts and should be **updated and integrated**:

### `whitepaper_final.md`
- **Target**: `docs/01-overview/whitepaper.md`
- **Action**: Update with new Firebase/FastAPI architecture
- **Key Content**: Mission, vision, SmartFund™ concept

### `blockchain.md`
- **Target**: `docs/02-architecture/blockchain-architecture.md`
- **Action**: Enhance with new token system and smart contracts
- **Key Content**: Verification system, transaction structure

### `overview.md`
- **Target**: `docs/01-overview/legacy-comparison.md`
- **Action**: Use for feature comparison between legacy and new system
- **Key Content**: Feature status, tech stack

### `architecture.md`
- **Target**: `docs/02-architecture/legacy-architecture.md`
- **Action**: Document evolution from Supabase to Firebase
- **Key Content**: System design, navigation patterns

### `rbac.md`
- **Target**: `docs/02-architecture/rbac-evolution.md`
- **Action**: Update for 4-role system (added Participant role)
- **Key Content**: Role definitions, permissions

### `hacking_homelessness.md`
- **Target**: `docs/01-overview/mission-vision.md`
- **Action**: Core mission statement and values
- **Key Content**: Platform philosophy, impact model

## 🔄 Medium Priority Documents

These documents provide **reference material** for new implementation:

- `api.md` → Reference for new FastAPI design
- `security.md` → Security requirements and patterns
- `qr-system.md` → QR code implementation concepts
- `best-practices.md` → Development standards (update for new stack)

## 📚 Reference Documents

These documents provide **historical context** and **technical specifications**:

- `whitepaper_en.md` & `whitepaper_fr.md` → Multi-language versions
- `technical.md` → Legacy technical specifications
- `authentication.md` → Auth patterns (Supabase → Firebase)
- `database.md` → Data structure reference (Supabase → Firestore)

## 🎯 Integration Strategy

### Phase 1: Core Concepts
1. Update whitepaper with new architecture
2. Enhance blockchain documentation with token system
3. Create legacy comparison document

### Phase 2: Technical Details
1. Evolve RBAC documentation for 4-role system
2. Update security documentation for Firebase
3. Enhance QR system with blockchain integration

### Phase 3: Reference & Context
1. Archive legacy technical specifications
2. Create migration notes for architecture changes
3. Update mission/vision documentation

## ⚠️ Important Notes

- **Do not copy directly** - all content needs updating for new architecture
- **Preserve core concepts** - SmartFund™, mission, RBAC principles
- **Update technology references** - Supabase → Firebase, 3-role → 4-role
- **Maintain backwards compatibility** - document what changed and why

## 📞 Questions?

If you need clarification on any legacy content or migration strategy, refer to:
- `docs/09-migration/from-supabase.md` - Technical migration guide
- `SHELTR-AI-IMPLEMENTATION-PLAN.md` - Complete rebuild plan
- Repository restructure plan for dependency changes
EOF

echo "   ✅ Migration guide created"

# Create summary report
echo ""
echo "📊 Migration Summary"
echo "==================="
echo "📁 Staging structure created:"
echo "   📂 docs/legacy-migration/"
echo "      ├── 📂 high-priority/ (documents to migrate & update)"
echo "      ├── 📂 medium-priority/ (reference material)"
echo "      ├── 📂 reference/ (historical context)"
echo "      └── 📄 MIGRATION-GUIDE.md"
echo ""
echo "✅ Legacy content migration complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Review migrated documents in docs/legacy-migration/"
echo "2. Update high-priority docs for new architecture"
echo "3. Integrate content into new documentation structure"
echo "4. Create new repository with clean dependencies"
echo ""
echo "📖 See MIGRATION-GUIDE.md for detailed integration strategy" 