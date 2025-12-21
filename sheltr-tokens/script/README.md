# SHELTR Deployment Scripts

**Enterprise-Grade Deployment Automation for Base Network**

**Version**: 3.0.0  
**Last Updated**: December 20, 2025  
**Network**: Base (Coinbase L2)  
**Tool**: Foundry Forge Scripts

---

## 📦 **Overview**

This directory contains production-ready deployment scripts for SHELTR's enterprise blockchain architecture. All scripts are designed for automated, repeatable deployments with comprehensive verification and testing.

---

## 🏗️ **Deployment Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│              SHELTR Deployment Pipeline                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Step 1: DeployEnterpriseArchitecture.s.sol                 │
│  ├── Deploy BaseNetworkOptimization                         │
│  ├── Deploy CoinbaseStakingIntegration                      │
│  ├── Deploy AdyenPayoutIntegration                          │
│  ├── Deploy SHELTRStablecoin                                │
│  └── Deploy SHELTRPaymentDistributor                        │
│                                                               │
│  Step 2: ConfigureEnterpriseSettings.s.sol                  │
│  ├── Set up role-based permissions                          │
│  ├── Configure contract parameters                          │
│  ├── Link contract dependencies                             │
│  └── Initialize system state                                │
│                                                               │
│  Step 3: SetupPartnershipIntegrations.s.sol                 │
│  ├── Configure Adyen API credentials                        │
│  ├── Configure Coinbase Prime credentials                   │
│  ├── Test integration endpoints                             │
│  └── Verify partnership connections                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📄 **Scripts**

### **1. DeployEnterpriseArchitecture.s.sol**

**Purpose**: Main deployment script for SHELTR's complete enterprise architecture

**What It Deploys**:
1. `BaseNetworkOptimization` - Gas optimization and L2 enhancements
2. `CoinbaseStakingIntegration` - Institutional staking (4-6% APY)
3. `AdyenPayoutIntegration` - Virtual card management
4. `SHELTRStablecoin` - Housing fund tracking token
5. `SHELTRPaymentDistributor` - Core 80/15/5 distribution engine

**Usage**:
```bash
# Base Testnet (Sepolia)
forge script script/DeployEnterpriseArchitecture.s.sol:DeployEnterpriseArchitecture \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY

# Base Mainnet
forge script script/DeployEnterpriseArchitecture.s.sol:DeployEnterpriseArchitecture \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

**Environment Variables Required**:
```bash
export PRIVATE_KEY=<deployer_private_key>
export BASESCAN_API_KEY=<basescan_api_key>
export TREASURY_ADDRESS=<treasury_wallet_address>
export EMERGENCY_RECIPIENT=<emergency_wallet_address>
export USDT_ADDRESS=<usdt_contract_address>
export COINBASE_PRIME_ADDRESS=<coinbase_prime_address>
```

**Deployment Steps**:
1. ✅ Validate network configuration
2. ✅ Deploy BaseNetworkOptimization
3. ✅ Deploy CoinbaseStakingIntegration
4. ✅ Deploy AdyenPayoutIntegration
5. ✅ Deploy SHELTRStablecoin
6. ✅ Deploy SHELTRPaymentDistributor
7. ✅ Verify all contracts on Basescan
8. ✅ Log deployment addresses
9. ✅ Generate deployment summary

**Output**:
```
=== SHELTR Enterprise Architecture Deployment ===
Network: Base Testnet (Sepolia)
Deployer: 0x1234...5678
Treasury: 0xabcd...ef01
USDT Address: 0x8335...2913

Deploying BaseNetworkOptimization...
✅ Deployed at: 0x1111...1111

Deploying CoinbaseStakingIntegration...
✅ Deployed at: 0x2222...2222

Deploying AdyenPayoutIntegration...
✅ Deployed at: 0x3333...3333

Deploying SHELTRStablecoin...
✅ Deployed at: 0x4444...4444

Deploying SHELTRPaymentDistributor...
✅ Deployed at: 0x5555...5555

=== Deployment Complete ===
Total Gas Used: 12,345,678
Estimated Cost: $0.12 (Base L2)

Contract Addresses:
- BaseOptimization: 0x1111...1111
- CoinbaseStaking: 0x2222...2222
- AdyenPayout: 0x3333...3333
- SHELTRStablecoin: 0x4444...4444
- PaymentDistributor: 0x5555...5555

Next Steps:
1. Run ConfigureEnterpriseSettings.s.sol
2. Run SetupPartnershipIntegrations.s.sol
3. Verify all contracts on Basescan
```

---

### **2. ConfigureEnterpriseSettings.s.sol**

**Purpose**: Post-deployment configuration of roles, permissions, and system parameters

**What It Configures**:
1. **Role-Based Access Control**
   - Grant `ADMIN_ROLE` to treasury address
   - Grant `PROCESSOR_ROLE` to backend service
   - Grant `EMERGENCY_ROLE` to emergency multisig
   - Grant specialized roles (MINTER, STAKER, CARD_MANAGER, etc.)

2. **Contract Parameters**
   - Set minimum/maximum deposit amounts
   - Configure APY ranges (4-6%)
   - Set distribution percentages (80/15/5)
   - Configure emergency thresholds

3. **Contract Linking**
   - Link PaymentDistributor to Stablecoin
   - Link PaymentDistributor to AdyenIntegration
   - Link PaymentDistributor to CoinbaseStaking
   - Link Stablecoin to CoinbaseStaking

4. **Initial State**
   - Set initial APY (5.0%)
   - Enable card issuance
   - Enable housing allocations
   - Set emergency recipient

**Usage**:
```bash
forge script script/ConfigureEnterpriseSettings.s.sol:ConfigureEnterpriseSettings \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

**Environment Variables Required**:
```bash
export PRIVATE_KEY=<deployer_private_key>
export BASE_RPC_URL=<base_network_rpc_url>
export ADMIN_ADDRESS=<admin_wallet_address>
export PROCESSOR_ADDRESS=<backend_service_address>
export EMERGENCY_MULTISIG=<emergency_multisig_address>

# Contract addresses from deployment
export PAYMENT_DISTRIBUTOR=<payment_distributor_address>
export SHELTR_STABLECOIN=<sheltr_stablecoin_address>
export ADYEN_INTEGRATION=<adyen_integration_address>
export COINBASE_STAKING=<coinbase_staking_address>
export BASE_OPTIMIZATION=<base_optimization_address>
```

**Configuration Steps**:
1. ✅ Grant ADMIN_ROLE to treasury
2. ✅ Grant PROCESSOR_ROLE to backend
3. ✅ Grant EMERGENCY_ROLE to multisig
4. ✅ Grant MINTER_ROLE to PaymentDistributor
5. ✅ Grant STAKER_ROLE to PaymentDistributor
6. ✅ Grant CARD_MANAGER_ROLE to backend
7. ✅ Set contract parameters
8. ✅ Link contract dependencies
9. ✅ Initialize system state
10. ✅ Verify configuration

**Output**:
```
=== SHELTR Enterprise Settings Configuration ===

Configuring Roles...
✅ ADMIN_ROLE granted to 0xabcd...ef01
✅ PROCESSOR_ROLE granted to 0x1234...5678
✅ EMERGENCY_ROLE granted to 0x9999...9999
✅ MINTER_ROLE granted to PaymentDistributor
✅ STAKER_ROLE granted to PaymentDistributor
✅ CARD_MANAGER_ROLE granted to backend

Configuring Parameters...
✅ Minimum deposit: $1.00 USDT
✅ Maximum deposit: $10,000.00 USDT
✅ Initial APY: 5.00%
✅ Distribution: 80/15/5

Linking Contracts...
✅ PaymentDistributor → Stablecoin
✅ PaymentDistributor → AdyenIntegration
✅ PaymentDistributor → CoinbaseStaking
✅ Stablecoin → CoinbaseStaking

Initializing State...
✅ Card issuance enabled
✅ Housing allocations enabled
✅ Emergency recipient set

=== Configuration Complete ===
```

---

### **3. SetupPartnershipIntegrations.s.sol**

**Purpose**: Configure external API integrations with Adyen and Coinbase Prime

**What It Configures**:
1. **Adyen Integration**
   - Set Adyen API credentials (encrypted)
   - Configure merchant account
   - Set environment (TEST/LIVE)
   - Configure webhook secret
   - Test virtual card creation
   - Verify PCI DSS compliance

2. **Coinbase Prime Integration**
   - Set Coinbase API credentials (encrypted)
   - Configure portfolio ID
   - Set environment (SANDBOX/PRODUCTION)
   - Test staking functionality
   - Verify SOC 2 compliance

3. **Integration Testing**
   - Test Adyen card creation endpoint
   - Test Adyen card loading endpoint
   - Test Coinbase staking endpoint
   - Test Coinbase yield calculation
   - Verify end-to-end flow

**Usage**:
```bash
forge script script/SetupPartnershipIntegrations.s.sol:SetupPartnershipIntegrations \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

**Environment Variables Required**:
```bash
export PRIVATE_KEY=<deployer_private_key>
export BASE_RPC_URL=<base_network_rpc_url>

# Adyen credentials (encrypted)
export ADYEN_API_KEY=<encrypted_adyen_api_key>
export ADYEN_MERCHANT_ACCOUNT=<adyen_merchant_account>
export ADYEN_ENVIRONMENT=<TEST_or_LIVE>
export ADYEN_WEBHOOK_SECRET=<webhook_verification_secret>

# Coinbase Prime credentials (encrypted)
export COINBASE_API_KEY=<encrypted_coinbase_api_key>
export COINBASE_API_SECRET=<encrypted_coinbase_api_secret>
export COINBASE_ENVIRONMENT=<SANDBOX_or_PRODUCTION>
export COINBASE_PORTFOLIO_ID=<coinbase_portfolio_id>

# Contract addresses
export ADYEN_INTEGRATION=<adyen_integration_address>
export COINBASE_STAKING=<coinbase_staking_address>
```

**⚠️ Security Warning**:
```
NEVER commit API credentials to version control!
Always use encrypted environment variables.
Store production credentials in secure vault (e.g., AWS Secrets Manager).
```

**Configuration Steps**:
1. ✅ Encrypt Adyen API credentials
2. ✅ Configure Adyen merchant account
3. ✅ Set Adyen environment
4. ✅ Configure webhook verification
5. ✅ Test Adyen virtual card creation
6. ✅ Encrypt Coinbase API credentials
7. ✅ Configure Coinbase portfolio
8. ✅ Set Coinbase environment
9. ✅ Test Coinbase staking
10. ✅ Verify all integrations

**Output**:
```
=== SHELTR Partnership Integrations Setup ===

Configuring Adyen Integration...
✅ API credentials encrypted and stored
✅ Merchant account: SHELTR_MERCHANT_123
✅ Environment: LIVE
✅ Webhook secret configured
✅ Testing virtual card creation...
   ✅ Test card created: **** **** **** 1234
✅ Adyen integration verified

Configuring Coinbase Prime Integration...
✅ API credentials encrypted and stored
✅ Portfolio ID: SHELTR_PORTFOLIO_456
✅ Environment: PRODUCTION
✅ Testing staking functionality...
   ✅ Test stake: $100.00 USDT
   ✅ APY: 5.00%
   ✅ Daily yield: $0.0137
✅ Coinbase integration verified

Running Integration Tests...
✅ End-to-end donation flow
✅ Virtual card loading
✅ Housing fund staking
✅ Yield distribution

=== Integration Setup Complete ===
All partnerships verified and operational!
```

---

## 🔧 **Deployment Workflow**

### **Complete Deployment Process**

```bash
# Step 1: Set up environment variables
export PRIVATE_KEY=<your_private_key>
export BASE_RPC_URL=https://sepolia.base.org
export BASESCAN_API_KEY=<your_basescan_key>
export TREASURY_ADDRESS=<treasury_address>
export EMERGENCY_RECIPIENT=<emergency_address>
export USDT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Step 2: Deploy all contracts
forge script script/DeployEnterpriseArchitecture.s.sol:DeployEnterpriseArchitecture \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY

# Step 3: Configure settings
export PAYMENT_DISTRIBUTOR=<deployed_address>
export SHELTR_STABLECOIN=<deployed_address>
export ADYEN_INTEGRATION=<deployed_address>
export COINBASE_STAKING=<deployed_address>

forge script script/ConfigureEnterpriseSettings.s.sol:ConfigureEnterpriseSettings \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# Step 4: Setup partnerships
export ADYEN_API_KEY=<encrypted_key>
export COINBASE_API_KEY=<encrypted_key>

forge script script/SetupPartnershipIntegrations.s.sol:SetupPartnershipIntegrations \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# Step 5: Verify deployment
forge verify-contract <address> <contract> --chain-id 84532
```

---

## 🧪 **Testing Deployments**

### **Dry Run (No Broadcast)**

```bash
# Test deployment without broadcasting
forge script script/DeployEnterpriseArchitecture.s.sol:DeployEnterpriseArchitecture \
  --rpc-url $BASE_RPC_URL

# Simulate with fork
forge script script/DeployEnterpriseArchitecture.s.sol:DeployEnterpriseArchitecture \
  --fork-url $BASE_RPC_URL
```

### **Testnet Deployment**

```bash
# Deploy to Base Sepolia testnet
export BASE_RPC_URL=https://sepolia.base.org
export CHAIN_ID=84532

forge script script/DeployEnterpriseArchitecture.s.sol:DeployEnterpriseArchitecture \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

### **Mainnet Deployment**

```bash
# Deploy to Base mainnet (PRODUCTION)
export BASE_RPC_URL=https://mainnet.base.org
export CHAIN_ID=8453

# ⚠️ IMPORTANT: Double-check all addresses before mainnet deployment!

forge script script/DeployEnterpriseArchitecture.s.sol:DeployEnterpriseArchitecture \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

---

## 📊 **Deployment Costs**

### **Estimated Gas Usage**

| Contract | Gas Used | Cost (Base) | Cost (Ethereum) |
|----------|----------|-------------|-----------------|
| **BaseOptimization** | ~1,500,000 | ~$0.015 | ~$75 |
| **CoinbaseStaking** | ~2,500,000 | ~$0.025 | ~$125 |
| **AdyenIntegration** | ~2,800,000 | ~$0.028 | ~$140 |
| **SHELTRStablecoin** | ~2,200,000 | ~$0.022 | ~$110 |
| **PaymentDistributor** | ~3,000,000 | ~$0.030 | ~$150 |
| **Total** | **~12,000,000** | **~$0.12** | **~$600** |

**Base Network Savings**: **99.98%** compared to Ethereum mainnet! 🎉

---

## 🔐 **Security Checklist**

### **Pre-Deployment**

- [ ] All environment variables set correctly
- [ ] Private key secured (hardware wallet recommended)
- [ ] Treasury address verified
- [ ] Emergency recipient address verified
- [ ] USDT contract address verified for network
- [ ] Coinbase Prime address verified
- [ ] All API credentials encrypted
- [ ] Deployment addresses backed up

### **Post-Deployment**

- [ ] All contracts verified on Basescan
- [ ] Role-based permissions configured
- [ ] Contract parameters validated
- [ ] Integration tests passed
- [ ] Emergency pause functionality tested
- [ ] Deployment addresses documented
- [ ] Multisig setup for emergency role
- [ ] Security audit scheduled

---

## 📚 **Additional Resources**

- [Main README](../README.md) - Project overview
- [Smart Contracts README](../src/README.md) - Contract documentation
- [Foundry Book](https://book.getfoundry.sh/) - Foundry documentation
- [Base Network Docs](https://docs.base.org/) - Base L2 documentation

---

## 🆘 **Troubleshooting**

### **Common Issues**

**1. Deployment Fails with "Insufficient Funds"**
```bash
# Check deployer balance
cast balance $DEPLOYER_ADDRESS --rpc-url $BASE_RPC_URL

# Get testnet ETH from Base faucet
# https://faucet.quicknode.com/base/sepolia
```

**2. Contract Verification Fails**
```bash
# Manually verify contract
forge verify-contract \
  --chain-id 84532 \
  --compiler-version v0.8.24 \
  <contract_address> \
  <contract_name> \
  --etherscan-api-key $BASESCAN_API_KEY
```

**3. Role Grant Fails**
```bash
# Check if deployer has DEFAULT_ADMIN_ROLE
cast call <contract_address> \
  "hasRole(bytes32,address)" \
  0x0000000000000000000000000000000000000000000000000000000000000000 \
  $DEPLOYER_ADDRESS \
  --rpc-url $BASE_RPC_URL
```

---

## 🎯 **Deployment Status**

| Network | Status | Contracts | Date | Verified |
|---------|--------|-----------|------|----------|
| **Base Sepolia** | 🟡 Testing | 5/5 | Dec 2025 | ✅ Yes |
| **Base Mainnet** | 📅 Planned | 0/5 | Q1 2026 | ⏳ Pending |

---

**Built with ❤️ for social impact and community empowerment**

*Automated deployment for enterprise blockchain philanthropy*

---

**Version**: 3.0.0  
**Last Updated**: December 20, 2025  
**Status**: 🟢 Production Ready
