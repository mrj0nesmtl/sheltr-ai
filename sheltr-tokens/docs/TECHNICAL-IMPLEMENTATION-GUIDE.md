# SHELTR Technical Implementation Guide

## 🚀 Quick Start

### **Prerequisites**
- Foundry installed (`curl -L https://foundry.paradigm.xyz | bash`)
- Node.js 18+ and npm
- Git

### **Setup**
```bash
# Clone repository
git clone <repository-url>
cd sheltr-tokens

# Install dependencies
forge install

# Set environment variables
cp .env.example .env
# Edit .env with your private key and API keys
```

## 📋 Contract Deployment Checklist

### **Pre-Deployment**
- [ ] Environment variables configured
- [ ] Private key secured
- [ ] Base Sepolia testnet ETH for gas
- [ ] API keys for contract verification

### **Deployment Order**
1. **SHELTR Token** - Main governance token
2. **SHELTRTreasury** - Treasury management
3. **SmartFundDistributor** - Donation distribution
4. **HousingFund** - Pooled housing fund
5. **ShelterOperations** - Shelter management
6. **MultiCurrencyDonation** - Multi-currency support
7. **SHELTRS** - Stablecoin
8. **SHELTRGovernance** - Governance system
9. **SHELTRTokenSale** - Token sale contract

## 🔧 Deployment Commands

### **1. Deploy All Contracts**
```bash
# Deploy to Base Sepolia testnet
forge script script/DeploySHELTR.s.sol:DeploySHELTR --rpc-url https://sepolia.base.org --broadcast --verify

# Deploy to Base mainnet (when ready)
forge script script/DeploySHELTR.s.sol:DeploySHELTR --rpc-url https://mainnet.base.org --broadcast --verify
```

### **2. Setup Team Distribution**
```bash
# Update contract addresses in script first
forge script script/SetupTeamDistribution.s.sol:SetupTeamDistribution --rpc-url https://sepolia.base.org --broadcast
```

### **3. Setup Treasury**
```bash
# Update contract addresses in script first
forge script script/SetupTreasury.s.sol:SetupTreasury --rpc-url https://sepolia.base.org --broadcast
```

## 📊 Contract Addresses Template

Create `contracts.json` after deployment:

```json
{
  "sheltrToken": "0x...",
  "sheltrTreasury": "0x...",
  "smartFundDistributor": "0x...",
  "housingFund": "0x...",
  "shelterOperations": "0x...",
  "multiCurrencyDonation": "0x...",
  "sheltrS": "0x...",
  "sheltrGovernance": "0x...",
  "sheltrTokenSale": "0x...",
  "usdcToken": "0x036CbD53842c5426634e7929541eC2318f3dCF7c",
  "deployer": "0x..."
}
```

## 🔐 Security Configuration

### **Access Control Setup**
```solidity
// Authorize treasury managers
treasury.authorizeManager(managerAddress);

// Set up governance founders
governance.updateFounder(joelAddress);
governance.updateFoundingMember(dougAddress);

// Update treasury wallet addresses
treasury.updateReserveFundWallet(reserveWallet);
treasury.updateStrategicPartnershipsWallet(partnershipWallet);
// ... etc for all wallets
```

### **Emergency Controls**
```solidity
// Pause contracts if needed
sheltrToken.pause();
treasury.pause();
governance.pause();

// Emergency withdrawals
treasury.emergencyWithdraw(tokenAddress, recipient, amount);
```

## 📈 Testing Strategy

### **Unit Tests**
```bash
# Run all tests
forge test

# Run specific test file
forge test --match-contract SHELTRTest

# Run with verbose output
forge test -vvv
```

### **Integration Tests**
```bash
# Test donation flow
forge test --match-test testDonationFlow

# Test treasury operations
forge test --match-test testTreasuryOperations

# Test governance
forge test --match-test testGovernance
```

### **Gas Optimization**
```bash
# Check gas usage
forge test --gas-report
```

## 🎯 Key Functions Reference

### **SHELTR Token**
```solidity
// Add team member with vesting
sheltrToken.addTeamMember(member, amount, startTime, duration);

// Release vested tokens
sheltrToken.releaseVestedTokens(member);

// Get vested amount
sheltrToken.getVestedAmount(member);

// Team accountability - exile voting
sheltrToken.createExileVote(targetMember);
sheltrToken.voteToExile(voteId);
sheltrToken.isTeamMemberExiled(member);
```

### **SHELTRTreasury**
```solidity
// Initialize treasury
treasury.initializeTreasury(totalAmount);

// Distribute rewards
treasury.distributeOnboardingRewards(recipient, amount);
treasury.distributeCommunityRewards(recipient, amount);
treasury.distributePartnershipRewards(recipient, amount);

// Get balances
treasury.getTreasuryBalances();
```

### **SmartFundDistributor**
```solidity
// Register participant
distributor.registerParticipant(participant, shelter, wallet);

// Process donation
distributor.processDonation(donor, participant, amount);

// Get participant info
distributor.getParticipant(participant);
```

### **SHELTRGovernance**
```solidity
// Create proposal
governance.createProposal(title, description);

// Vote on proposal
governance.vote(proposalId, support);

// Finalize proposal
governance.finalizeProposal(proposalId);

// Veto proposal (founder only)
governance.vetoProposal(proposalId);
```

## 🔄 Multi-Currency Support

### **Supported Currencies**
- **CAD**: Canadian Dollar (CADC token)
- **USD**: US Dollar (USDT token)
- **EUR**: Euro (EURS token)
- **USDC**: Direct USDC donations

### **Exchange Rates**
```solidity
// Update rates (owner only)
multiCurrency.updateExchangeRates(cadRate, eurRate);

// Convert CAD to USD
uint256 usdEquivalent = multiCurrency.convertCADToUSD(cadAmount);

// Convert EUR to USD
uint256 usdEquivalent = multiCurrency.convertEURToUSD(eurAmount);
```

## 🏦 Treasury Management

### **Sub-Account Structure**
```
Treasury (35M SHELTR)
├── Reserve Fund (5M)
│   ├── Emergency Fund (3M)
│   └── Liquidity Reserve (2M)
├── Strategic Partnerships (15M)
│   ├── Partnership Rewards (10M)
│   └── Partnership Development (5M)
└── Platform Development (15M)
    ├── Onboarding Rewards (5M)
    ├── Community Rewards (5M)
    └── Development Operations (5M)
```

### **Distribution Functions**
```solidity
// Authorize manager for specific distributions
treasury.authorizeManager(managerAddress);

// Distribute from specific sub-accounts
treasury.distributeOnboardingRewards(recipient, amount);
treasury.distributeCommunityRewards(recipient, amount);
treasury.distributePartnershipRewards(recipient, amount);

// Emergency fund usage (owner only)
treasury.useEmergencyFund(recipient, amount);
```

## 🎯 Token Sale Implementation

### **Investment Limits**
```solidity
// Get investment limits
(uint256 minInvestment, uint256 maxInvestment) = tokenSale.getInvestmentLimits();
// minInvestment = 500 * 10^6 ($500 USDC)
// maxInvestment = 50,000 * 10^6 ($50,000 USDC)

// Check remaining capacity
uint256 remaining = tokenSale.getRemainingInvestmentCapacity(investor);
```

### **Vesting Schedule**
- **Pre-Seed Tokens**: 12-month vesting with 30-day cliff
- **Public Sale Tokens**: Immediate delivery (no vesting)
- **Future Purchases**: From public allocation (immediate delivery)

### **Sale Phases**
1. **Pre-Seed**: Whitelist only, $0.05 per token, 3M allocation, 12-month vesting
2. **Public**: Open to all, $0.10 per token, 47M allocation, staggered over 3 years
3. **Post-Sale**: Tokens available on exchanges

### **Capital Timeline**
- **Year 1**: $1.72M USD (pre-seed + 1/3 public sale)
- **Year 2**: $1.57M USD (1/3 public sale)
- **Year 3**: $1.56M USD (1/3 public sale)
- **Total**: $4.85M USD over 3 years

## 🎯 Governance Implementation

### **Proposal Lifecycle**
1. **Create**: Anyone with 100k SHELTR can create proposal
2. **Vote**: 7-day voting period
3. **Finalize**: Check quorum and results
4. **Veto Window**: 3 days for founder veto
5. **Execute**: After veto window expires

### **Veto Power**
- **Joel (Founder)** can veto any passed proposal
- **Doug (CFO)** can veto any passed proposal
- **3-day window** after proposal passes
- **Community governance** with founder protection

## 👥 Team Accountability System

### **Exile Voting Mechanism**
```solidity
// Initiate exile vote
sheltrToken.createExileVote(targetMember);

// Vote to exile (requires Joel + 2 other members)
sheltrToken.voteToExile(voteId);

// Check exile status
sheltrToken.isTeamMemberExiled(member);
```

### **Exile Process**
1. **Initiation**: Any team member can create exile vote
2. **Voting**: Joel (founder) + 2 other team members required
3. **Execution**: Automatic when conditions met
4. **Token Transfer**: Remaining tokens → Shelter Operations
5. **Status Update**: Member marked as exiled

### **Protection Features**
- **Self-Protection**: Cannot exile yourself
- **Double Voting**: Cannot vote twice on same proposal
- **Automatic Execution**: Triggers when conditions met
- **Token Recovery**: All remaining tokens transferred

## 📊 Monitoring & Analytics

### **Key Metrics to Track**
```solidity
// Treasury balances
treasury.getTreasuryBalances();

// Donation statistics
distributor.getDonationStatistics();

// Governance activity
governance.getProposal(proposalId);

// Team vesting status
sheltrToken.getVestedAmount(member);
```

### **Event Monitoring**
```solidity
// Treasury events
event TokensAllocated(string allocation, uint256 amount);
event TokensDistributed(string wallet, address recipient, uint256 amount);

// Governance events
event ProposalCreated(uint256 proposalId, address proposer, string title);
event ProposalVetoed(uint256 proposalId, address vetoer);

// Donation events
event DonationDistributed(address donor, address participant, uint256 amount);
```

## 🔧 Maintenance & Updates

### **Contract Upgrades**
- All contracts are upgradeable through proxy pattern
- Owner can pause contracts for emergency
- Emergency withdrawal functions available

### **Parameter Updates**
```solidity
// Update governance parameters
governance.updateGovernanceParameters(newThreshold, newPeriod, newQuorum);

// Update treasury allocations
treasury.updateAllocation(newAllocation);

// Update exchange rates
multiCurrency.updateExchangeRates(newCadRate, newEurRate);
```

## 🚨 Emergency Procedures

### **Emergency Pause**
```solidity
// Pause all contracts
sheltrToken.pause();
treasury.pause();
governance.pause();
distributor.pause();
```

### **Emergency Withdrawal**
```solidity
// Withdraw tokens from treasury
treasury.emergencyWithdraw(tokenAddress, recipient, amount);

// Withdraw from specific contracts
housingFund.emergencyWithdraw(tokenAddress, recipient, amount);
shelterOps.emergencyWithdraw(tokenAddress, recipient, amount);
```

### **Recovery Procedures**
```solidity
// Unpause contracts
sheltrToken.unpause();
treasury.unpause();
governance.unpause();
distributor.unpause();

// Update wallet addresses
treasury.updateReserveFundWallet(newWallet);
```

## 📚 Additional Resources

### **Documentation**
- [SHELTR Tokenomics Strategy](./SHELTR-TOKENOMICS-STRATEGY.md)
- [Base Blockchain Documentation](https://docs.base.org/)
- [Foundry Book](https://book.getfoundry.sh/)

### **Support**
- Technical issues: Create GitHub issue
- Security concerns: Contact security team
- General questions: Join Discord community

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Maintainer**: SHELTR Development Team
