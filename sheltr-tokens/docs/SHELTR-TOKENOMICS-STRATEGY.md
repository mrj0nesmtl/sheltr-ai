# SHELTR Tokenomics & Contract Strategy Documentation

## 🚀 Executive Summary

SHELTR is launching a comprehensive dual-token ecosystem on Base blockchain with a strategic 100M token supply designed to fund operations, incentivize participation, and drive sustainable growth. The system combines immediate capital generation with long-term operational funding through a sophisticated vesting and treasury management structure.

## 📊 Tokenomics Overview

### **Total Supply: 100,000,000 SHELTR**

| **Allocation** | **Tokens** | **Percentage** | **Release Strategy** |
|----------------|------------|----------------|---------------------|
| **Public Sale** | 50,000,000 | 50% | 33% per year, over 3 years, beginning Dec 2025 |
| **Team & Advisors** | 12,000,000 | 12% | 3-year vesting (Jan 2026) |
| **Reserve Fund** | 5,000,000 | 5% | Immediate access |
| **Strategic Partnerships** | 10,000,000 | 10% | 3-year distribution |
| **SHELTR Operations** | 13,000,000 | 13% | 3-year distribution |
| **Participant Onboarding Rewards** | 10,000,000 | 10% | 3-year distribution |

## 🎯 Business Strategy

### **Phase 1: Capital Generation (Q4 2025-2026)**
- **Pre-Seed Sale**: 3M tokens at $0.05 (50% discount) → $150K USD
- **Public Token Sale**: 100M tokens at $0.10 → **$10M USD total commitment**
- **Year 1 Release**: ~33M tokens → **$1.57M USD actual capital**
- **Reserve Fund Access**: 5M tokens for immediate operations
- **Market Launch**: Direct liquidity injection on Base blockchain

### **Phase 2: Operational Funding (2027-2028)**
- **Sustained Development**: 66M tokens distributed over 2 years
- **Team Retention**: 12M tokens vested to ensure long-term commitment
- **Strategic Growth**: 10M tokens for partnerships and 13M for operations

## 🏗️ Smart Contract Architecture 

### **Core Contracts**

#### **1. SHELTR.sol - Main Governance Token**
```solidity
// 100M total supply with comprehensive vesting system
contract SHELTR is ERC20, ERC20Permit, Ownable, Pausable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    // Team vesting with 3-year schedule starting January 2026
    // Team accountability with exile voting mechanism
    // Automatic token transfer to shelter operations for exiled members
}
```

#### **2. SHELTRTreasury.sol - Treasury Management**
```solidity
// Manages 35M tokens across 10 sub-accounts
contract SHELTRTreasury {
    // Reserve Fund: 5M (Emergency + Liquidity)
    // Strategic Partnerships: 15M (Rewards + Development)
    // Platform Development: 15M (Onboarding + Community + Operations)
}
```

#### **3. SHELTRGovernance.sol - Governance System**
```solidity
// Founder veto power with 3-day window
contract SHELTRGovernance {
    address public founder; // Joel
    address public foundingMember; // Doug (CFO)
    uint256 public constant VETO_WINDOW = 3 days;
}
```

#### **4. SmartFundDistributor.sol - Donation Distribution**
```solidity
// 80/15/5 distribution system
contract SmartFundDistributor {
    // 80% → Participant (immediate USDC)
    // 15% → Housing Fund (pooled with yield)
    // 5% → Shelter Operations (affiliated or platform)
}
```

#### **5. SHELTRS.sol - Stablecoin**
```solidity
// USD-pegged stablecoin for participants
contract SHELTRS {
    // 1:1 USDC backing
    // 100 token welcome bonus
    // Zero volatility for participants
}
```

## 📅 Release Timeline

### **December 2025 - Public Launch**
```
┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC SALE LAUNCH                       │
├─────────────────────────────────────────────────────────────┤
│ • 50M tokens → Public market                               │
│ • 5M tokens → Reserve Fund (immediate access)              │
│ • Capital raise: $5M+ USD                                  │
│ • Market liquidity established                             │
└─────────────────────────────────────────────────────────────┘
```

### **January 2026 - Team Vesting Begins**
```
┌─────────────────────────────────────────────────────────────┐
│                    TEAM VESTING START                       │
├─────────────────────────────────────────────────────────────┤
│ • 12M tokens → 3-year linear vesting                       │
│ • Team retention and alignment                             │
│ • Monthly releases over 36 months                          │
└─────────────────────────────────────────────────────────────┘
```

### **2026-2028 - Operational Distribution**
```
┌─────────────────────────────────────────────────────────────┐
│                 OPERATIONAL FUNDING                         │
├─────────────────────────────────────────────────────────────┤
│ • Strategic Partnerships: 10M tokens                       │
│ • SHELTR Operations: 13M tokens                            │
│ • Participant Rewards: 10M tokens                          │
│ • Sub-account management through treasury                  │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Team Distribution (12M SHELTR)

### **Leadership Allocation**

#### **Immediate Allocations (No Vesting)**
| **Team Member** | **Allocation** | **Tokens** | **Role** | **Release** |
|-----------------|----------------|------------|----------|-------------|
| **Joel** | 1% | 1,000,000 | Founder & CEO | Immediate |
| **Doug** | 1% | 1,000,000 | CFO | Immediate |
| **Alex** | 1% | 1,000,000 | COO | Immediate |

#### **Vesting Allocations (3-Year Schedule)**
| **Team Member** | **Allocation** | **Tokens** | **Role** | **Vesting** |
|-----------------|----------------|------------|----------|-------------|
| **Sasko** | 1% | 1,000,000 | CTO | 3-year vesting |

| **Courtnal** | 1% | 1,000,000 | Leadership | 3-year vesting |
| **Zaffia** | 1% | 1,000,000 | Leadership | 3-year vesting |
| **Ami** | 1% | 1,000,000 | Leadership | 3-year vesting |
| **Marc** | 1% | 1,000,000 | Leadership | 3-year vesting |
| **Morgan** | 1% | 1,000,000 | Leadership | 3-year vesting |
| **Dominique** | 1% | 1,000,000 | Leadership | 3-year vesting |
| **Sara** | 1% | 1,000,000 | Leadership | 3-year vesting |
| **Sen** | 1% | 1,000,000 | Leadership | 3-year vesting |

### **Vesting Schedule**
- **Start Date**: January 1, 2026
- **Duration**: 3 years (36 months)
- **Cliff**: 30 days
- **Release**: Linear monthly distribution
- **Applicable To**: 10 team members (excluding Joel, Doug, Alex)

### **Immediate Allocations**
- **Joel (Founder)**: 3M SHELTR - Immediate transfer
- **Doug (CFO)**: 1M SHELTR - Immediate transfer
- **Alex (COO)**: 1M SHELTR - Immediate transfer
- **Total Immediate**: 5M SHELTR (5% of total supply)

### **Team Accountability Mechanism**
- **Exile Voting**: Any team member can initiate exile vote
- **Vote Requirements**: Joel (founder) + 2 other team members
- **Automatic Transfer**: Exiled member's remaining tokens → Shelter Operations
- **Protection**: Prevents non-performing team members from retaining tokens
- **Note**: Joel, Doug, and Alex are not subject to exile voting (immediate allocations)

## 🏦 Treasury Management System

### **Main Allocations (35M SHELTR)**

#### **Reserve Fund (5M SHELTR)**
```
┌─────────────────────────────────────────────────────────────┐
│                    RESERVE FUND                             │
├─────────────────────────────────────────────────────────────┤
│ Emergency Fund: 3,000,000 SHELTR (3%)                      │
│ • Crisis management                                         │
│ • Market volatility protection                             │
│ • Emergency operations funding                             │
├─────────────────────────────────────────────────────────────┤
│ Liquidity Reserve: 2,000,000 SHELTR (2%)                   │
│ • Market stability                                          │
│ • DEX liquidity provision                                   │
│ • Price support mechanisms                                  │
└─────────────────────────────────────────────────────────────┘
```

#### **Strategic Partnerships (15M SHELTR)**
```
┌─────────────────────────────────────────────────────────────┐
│                STRATEGIC PARTNERSHIPS                       │
├─────────────────────────────────────────────────────────────┤
│ Partnership Rewards: 10,000,000 SHELTR (10%)               │
│ • Partner incentives                                        │
│ • Collaboration rewards                                     │
│ • Strategic alliance funding                               │
├─────────────────────────────────────────────────────────────┤
│ Partnership Development: 5,000,000 SHELTR (5%)             │
│ • Partnership growth                                        │
│ • Joint venture funding                                     │
│ • Strategic expansion                                       │
└─────────────────────────────────────────────────────────────┘
```

#### **Platform Development (15M SHELTR)**
```
┌─────────────────────────────────────────────────────────────┐
│                 PLATFORM DEVELOPMENT                        │
├─────────────────────────────────────────────────────────────┤
│ Onboarding Rewards: 5,000,000 SHELTR (5%)                  │
│ • New participant incentives                                │
│ • User acquisition programs                                 │
│ • Platform adoption rewards                                │
├─────────────────────────────────────────────────────────────┤
│ Community Rewards: 5,000,000 SHELTR (5%)                   │
│ • Community engagement                                      │
│ • User retention programs                                   │
│ • Community building incentives                             │
├─────────────────────────────────────────────────────────────┤
│ Development Operations: 5,000,000 SHELTR (5%)              │
│ • Platform development                                      │
│ • Technical operations                                      │
│ • Infrastructure maintenance                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Governance & Security

### **Founder Veto Power**
- **Joel (Founder) + Doug (CFO)** = Veto authority
- **3-day veto window** after proposal passes
- **Community governance** with founder protection
- **Proposal threshold**: 100,000 SHELTR
- **Quorum requirement**: 5,000,000 SHELTR (5%)

### **Access Control**
- **Owner**: Full treasury and contract control
- **Authorized Managers**: Delegated distribution authority
- **Emergency Controls**: Pause functionality and emergency withdrawals
- **Multi-signature**: Critical operations require multiple approvals

## 💰 Revenue Generation Strategy

### **Token Sale Structure**

#### **Pre-Seed Sale (Whitelist Only)**
- **Allocation**: 3M tokens (3% of total supply)
- **Price**: $0.05 per token (50% discount)
- **Vesting**: 12-month vesting with 30-day cliff
- **Investment Limits**: $500 minimum, $50,000 maximum
- **Expected Revenue**: $150K USD

#### **Public Sale**
- **Allocation**: 47M tokens (47% of total supply)
- **Price**: $0.10 per token
- **Delivery**: Staggered over 3 years (33.3% per year)
- **Investment Limits**: $500 minimum, $50,000 maximum
- **Total Commitment**: $4.7M USD
- **Year 1 Revenue**: $1.57M USD (actual capital)

### **Capital Generation Timeline**

#### **Year 1 (December 2025)**
- **Pre-Seed Sale**: 3M tokens × $0.05 = **$150K USD**
- **Public Sale (Year 1)**: ~15.7M tokens × $0.10 = **$1.57M USD**
- **Total Year 1 Capital**: **$1.72M USD**
- **Reserve Fund**: 5M tokens for immediate operations

#### **Year 2 (December 2026)**
- **Public Sale (Year 2)**: ~15.7M tokens × $0.10 = **$1.57M USD**

#### **Year 3 (December 2027)**
- **Public Sale (Year 3)**: ~15.6M tokens × $0.10 = **$1.56M USD**

#### **Total 3-Year Capital Raise**
- **Total Commitment**: **$4.85M USD**
- **Actual Capital**: **$4.85M USD** (staggered over 3 years)

### **Sustained Funding (2026-2028)**
- **Team Vesting**: 10M tokens over 3 years (excluding Joel, Doug, Alex)
- **Partnership Development**: 15M tokens for strategic growth
- **Platform Operations**: 15M tokens for development and rewards
- **Public Sale Continuation**: ~$1.57M USD per year (2026-2027)

### **Revenue Streams**
1. **Token Sale Proceeds**: Primary capital generation
2. **Platform Fees**: Ongoing revenue from operations
3. **Partnership Revenue**: Strategic alliance income
4. **DeFi Yield**: Housing fund and liquidity pool returns

## 🎯 Smart Fund Distribution (80/15/5)

### **Donation Flow**
```
┌─────────────────────────────────────────────────────────────┐
│                    DONATION FLOW                            │
├─────────────────────────────────────────────────────────────┤
│ 1. Donor makes donation (CAD/USD/EUR/USDC)                 │
│ 2. MultiCurrencyDonation converts to USDC                  │
│ 3. SmartFundDistributor processes 80/15/5 split            │
│ 4. Funds distributed to respective contracts                │
└─────────────────────────────────────────────────────────────┘
```

### **Distribution Breakdown**
- **80% → Participant**: Immediate USDC to participant wallet
- **15% → Housing Fund**: Pooled with yield generation (6-8% APY)
- **5% → Shelter Operations**: Affiliated shelter or platform operations

## 🚀 Dual Token Ecosystem

### **SHELTR Token (Governance)**
- **Purpose**: Governance and platform utility
- **Supply**: 100M tokens
- **Use Cases**: Voting, staking, platform access

### **SHELTR-S Token (Stablecoin)**
- **Purpose**: Participant stablecoin
- **Backing**: 1:1 USDC reserves
- **Features**: Zero volatility, welcome bonus, gasless transactions

## 📈 Growth Strategy

### **Phase 1: Foundation (2025)**
- Token launch and capital raise
- Platform development and testing
- Initial partnerships and community building

### **Phase 2: Expansion (2026-2027)**
- Platform scaling and feature development
- Strategic partnership expansion
- Community growth and user acquisition

### **Phase 3: Maturity (2028+)**
- Full ecosystem deployment
- DeFi integration and yield optimization
- Global expansion and market leadership

## 🔧 Technical Implementation

### **Deployment Scripts**
- `DeploySHELTR.s.sol`: Main contract deployment
- `SetupTeamDistribution.s.sol`: Team vesting setup
- `SetupTreasury.s.sol`: Treasury allocation setup

### **Key Features**
- **Multi-currency support**: CAD, USD, EUR, USDC
- **Gasless transactions**: ERC20Permit integration
- **Emergency controls**: Pause and emergency withdrawal
- **Transparent events**: All transactions logged
- **Access control**: Role-based permissions

## 📊 Success Metrics

### **Financial Metrics**
- **Capital Raised**: $5M+ from public sale
- **Treasury Management**: 35M tokens allocated efficiently
- **Team Retention**: 15M tokens vested over 3 years
- **Partnership Growth**: 15M tokens for strategic expansion

### **Operational Metrics**
- **Platform Adoption**: User growth and engagement
- **Partnership Success**: Strategic alliance outcomes
- **Community Growth**: Active community members
- **Development Progress**: Platform feature deployment

## 🎯 Conclusion

The SHELTR tokenomics strategy provides a comprehensive framework for sustainable growth, combining immediate capital generation with long-term operational funding. The sophisticated contract architecture ensures transparency, security, and efficient resource allocation while maintaining founder control and community governance.

This strategy positions SHELTR for success in the competitive blockchain philanthropy space while building a sustainable and scalable platform for social impact.

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Author**: SHELTR Development Team  
**Status**: Ready for Implementation
