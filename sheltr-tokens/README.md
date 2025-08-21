# SHELTR Token Contracts

**SHELTR is a revolutionary dual-token ecosystem for blockchain philanthropy, built on Base network with comprehensive smart contracts for transparent donation distribution and community governance.**

## 🚀 Project Overview

SHELTR implements a sophisticated tokenomics system with:
- **100M SHELTR tokens** total supply
- **80/15/5 SmartFund distribution** (participant/shelter/operations)
- **Dual-token architecture** (SHELTR governance + SHELTR-S stablecoin)
- **3-year staggered capital generation** ($4.85M USD total)
- **Team accountability** with exile voting mechanism
- **Multi-currency support** (CAD, USD, EUR, USDC)

## 📚 Documentation

- [SHELTR Tokenomics Strategy](./docs/SHELTR-TOKENOMICS-STRATEGY.md)
- [Technical Implementation Guide](./docs/TECHNICAL-IMPLEMENTATION-GUIDE.md)
- [Documentation Index](./docs/README.md)

## 🏗️ Smart Contracts

### Core Contracts
- `SHELTR.sol` - Main governance token with team vesting
- `SHELTRTreasury.sol` - Treasury management with sub-accounts
- `SmartFundDistributor.sol` - 80/15/5 donation distribution
- `SHELTRGovernance.sol` - Community governance with founder veto
- `SHELTRS.sol` - USD-pegged stablecoin for participants
- `SHELTRTokenSale.sol` - Token sale with investment limits

### Supporting Contracts
- `HousingFund.sol` - Pooled housing fund with yield generation
- `ShelterOperations.sol` - Shelter management and fee distribution
- `MultiCurrencyDonation.sol` - Multi-currency donation support

## 🔧 Development

This project uses **Foundry** - a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
# Deploy all SHELTR contracts
$ forge script script/DeploySHELTR.s.sol:DeploySHELTR --rpc-url <your_rpc_url> --private-key <your_private_key> --broadcast --verify

# Setup team distribution
$ forge script script/SetupTeamDistribution.s.sol:SetupTeamDistribution --rpc-url <your_rpc_url> --private-key <your_private_key> --broadcast

# Setup treasury allocations
$ forge script script/SetupTreasury.s.sol:SetupTreasury --rpc-url <your_rpc_url> --private-key <your_private_key> --broadcast
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

## 🎯 Project Status

### **Current Phase**: Pre-ICO Development
- **Target Launch**: December 2025
- **Network**: Base (Coinbase L2)
- **Status**: Smart contracts implemented and tested

### **Key Features Implemented**
- ✅ Dual-token architecture (SHELTR + SHELTR-S)
- ✅ 80/15/5 SmartFund distribution
- ✅ Team vesting with exile mechanism
- ✅ Treasury management with sub-accounts
- ✅ Multi-currency donation support
- ✅ Investment limits ($500-$50K)
- ✅ Governance with founder veto power

### **Next Steps**
1. **Security Audits** - Comprehensive smart contract audits
2. **Testnet Deployment** - Base Sepolia testing
3. **Pre-Seed Sale** - Whitelist investor onboarding
4. **Public Launch** - December 2025 token sale

## 🤝 Contributing

This project is part of the Arcana ecosystem for blockchain philanthropy. 

---

*Built with ❤️ for social impact and community empowerment*

**Last Updated**: August 21, 2025
