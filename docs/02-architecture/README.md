# 🏗️ Technical Architecture

This section contains detailed technical architecture documentation for the SHELTR platform.

## 📋 Contents

### 🏗️ Core Architecture
- **[System Design](./technical/system-design.md)**: Overall system architecture, design patterns, and component relationships
- **[Website Architecture](./technical/website-architecture.md)**: Frontend and backend architecture with Next.js and FastAPI
- **[Project Tree](./PROJECT-TREE.md)**: Complete project structure and file organization

### ⛓️ Blockchain & Technical
- **[Blockchain Architecture](./tokenomics/blockchain.md)**: Smart contract architecture and Web3 integration
- **[Technical Specifications](./technical/)**: Detailed technical specifications and implementation details

### 🪙 Tokenomics & Whitepaper
- **[SHELTR Tokenomics](./tokenomics/sheltr-tokenomics.md)**: Token economics and distribution models
- **[Official Whitepaper](./tokenomics/whitepaper_final.md)**: Complete technical whitepaper and platform overview

### 💳 Payment Infrastructure
- **[Adyen Integration](./payment-rails/adyen-integration.md)**: Advanced payment processing setup
- **[Production Deployment](./payment-rails/production-deployment.md)**: Payment system deployment guide
- **[SHELTR Demo Implementation](./payment-rails/sheltr-demo-implementation.md)**: Demo payment system setup

## 📁 Directory Structure

```
docs/02-architecture/
├── README.md                           # This file - Architecture overview
├── PROJECT-TREE.md                     # Complete project structure
├── technical/                          # Core technical documentation
│   ├── system-design.md               # System architecture & design patterns
│   └── website-architecture.md        # Frontend/backend architecture
├── tokenomics/                         # Blockchain & token documentation
│   ├── blockchain.md                  # Smart contract architecture
│   ├── sheltr-tokenomics.md          # Token economics & distribution
│   └── whitepaper_final.md           # Complete technical whitepaper
└── payment-rails/                      # Payment system documentation
    ├── adyen-integration.md           # Adyen payment processing
    ├── production-deployment.md       # Payment system deployment
    └── sheltr-demo-implementation.md  # Demo payment implementation
```

## 🔗 Related Documentation

- [API Documentation](../03-api/README.md)
- [Development Guide](../04-development/README.md)
- [Deployment Guide](../05-deployment/README.md)
