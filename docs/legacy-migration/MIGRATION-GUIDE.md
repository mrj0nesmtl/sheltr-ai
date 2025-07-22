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
