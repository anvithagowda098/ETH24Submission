# EventChain 🎫⛓️

**Next-generation Web3 event management platform with zero-knowledge privacy**

EventChain revolutionizes event ticketing by combining blockchain technology with zero-knowledge proofs, creating a secure, transparent, and fraud-resistant ecosystem for organizers and attendees.

## ✨ Features

### 🎪 For Event Organizers
- **Decentralized Event Creation** - Create events on-chain with immutable records
- **Smart Contract Automation** - Automated ticket sales and revenue distribution
- **Real-time Analytics** - Track sales and attendee engagement
- **Flexible Pricing** - Dynamic pricing models with cryptocurrency payments
- **Anti-fraud Protection** - Built-in mechanisms to prevent ticket counterfeiting

### 🎟️ For Attendees
- **Privacy-First Design** - Zero-knowledge proofs protect personal information
- **NFT Tickets** - Unique, non-transferable digital tickets as NFTs
- **Seamless Experience** - One-click purchasing with Web3 wallets
- **QR Code Verification** - Instant entry validation at events
- **Automatic Refunds** - Smart contract-based refund system for cancelled events

### 🔒 Security & Privacy
- **Zero-Knowledge Proofs** - Prove ticket ownership without revealing identity
- **Non-transferable NFTs** - Prevents scalping and black market sales
- **Hash-based Privacy** - Personal data never stored on-chain
- **Reentrancy Protection** - Secure smart contracts with comprehensive safety checks

## 🏗️ Architecture

```
EventChain/
├── packages/
│   ├── client/          # Next.js Frontend (TypeScript + React)
│   └── contracts/       # Smart Contracts (Solidity + Hardhat)
├── docs/               # Documentation
└── scripts/            # Deployment and utility scripts
```

### Tech Stack

**Frontend**
- Next.js 15 with App Router
- TypeScript for type safety
- TailwindCSS + DaisyUI for modern UI
- Wagmi + RainbowKit for Web3 integration
- React Query for data management
- Framer Motion for animations

**Blockchain**
- Solidity ^0.8.20 smart contracts
- Hardhat development environment
- OpenZeppelin security libraries
- Groth16 zk-SNARKs for privacy
- Polygon network for low-cost transactions

**Privacy & Security**
- SnarkJS for zero-knowledge proof generation
- SHA256 hashing for identity protection
- ERC-721 non-transferable NFTs
- Comprehensive input validation

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- Node.js v20+ 
- Yarn v4+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/eventchain.git
cd eventchain
```

2. **Install dependencies**
```bash
yarn install
```

3. **Set up environment variables**
```bash
# Copy environment templates
cp packages/client/.env.example packages/client/.env.local
cp packages/contracts/.env.example packages/contracts/.env

# Edit the files with your configuration
```

4. **Start local blockchain**
```bash
yarn chain
```

5. **Deploy contracts (new terminal)**
```bash
yarn deploy:local
```

6. **Start the frontend (new terminal)**
```bash
yarn dev
```

7. **Open your browser**
Visit `http://localhost:3000` and connect your Web3 wallet!

## 🌐 Deployment

### Testnet Deployment (Polygon Amoy)

1. **Configure your wallet**
   - Add Polygon Amoy testnet to your wallet
   - Get test MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

2. **Deploy to testnet**
```bash
yarn deploy:testnet
```

3. **Verify contracts**
```bash
yarn verify
```

### Production Deployment

1. **Build the application**
```bash
yarn build
```

2. **Deploy to Vercel/Netlify**
```bash
# Vercel
yarn workspace @eventchain/client vercel

# Or build for static hosting
yarn workspace @eventchain/client export
```

## 🎯 Usage Guide

### Creating an Event

1. **Connect Wallet** - Use MetaMask or any Web3 wallet
2. **Navigate** to "Create Event"
3. **Fill Details** - Event info, date, location, pricing
4. **Deploy** - Sign transaction to create on-chain event
5. **Share** - Get your unique event link

### Purchasing Tickets

1. **Browse Events** - View all available events
2. **Select Event** - Choose your desired event
3. **Enter Details** - Provide identity information (hashed for privacy)
4. **Pay** - Complete purchase with cryptocurrency
5. **Receive NFT** - Get your unique ticket NFT

### Event Entry

1. **Generate QR** - Create entry QR code from your ticket
2. **Scan at Venue** - Organizer scans for instant verification
3. **Zero-Knowledge Proof** - Prove ownership without revealing identity
4. **Enter Event** - Enjoy your event!

## 🔧 Development

### Project Structure

```
packages/
├── client/                 # Frontend Application
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   └── types/            # TypeScript type definitions
│
└── contracts/             # Smart Contracts
    ├── contracts/         # Solidity contracts
    ├── deploy/           # Deployment scripts
    ├── test/             # Contract tests
    └── types/            # Generated contract types
```

### Available Scripts

```bash
# Development
yarn dev              # Start development server
yarn chain            # Start local blockchain
yarn compile          # Compile smart contracts
yarn test             # Run contract tests

# Deployment
yarn deploy:local     # Deploy to local network
yarn deploy:testnet   # Deploy to Polygon Amoy
yarn build            # Build for production

# Code Quality
yarn lint             # Lint all packages
yarn format           # Format code
yarn typecheck        # Type checking
```

### Adding New Features

1. **Smart Contracts** - Add new contracts in `packages/contracts/contracts/`
2. **Frontend Components** - Create components in `packages/client/components/`
3. **Pages** - Add new routes in `packages/client/app/`
4. **Tests** - Write tests in respective `test/` directories

## 🧪 Testing

### Smart Contract Tests
```bash
yarn test
```

### Frontend Testing
```bash
yarn workspace @eventchain/client test
```

### Integration Tests
```bash
yarn test:integration
```

## 📚 Documentation

- [Smart Contract API](./docs/contracts.md)
- [Frontend Components](./docs/components.md)
- [Zero-Knowledge Proofs](./docs/zk-proofs.md)
- [Security Considerations](./docs/security.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Scaffold-ETH 2](https://scaffoldeth.io/) for the amazing development framework
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [SnarkJS](https://github.com/iden3/snarkjs) for zero-knowledge proof implementation
- [Polygon](https://polygon.technology/) for the scalable blockchain infrastructure

## 🔗 Links

- **Website**: [https://eventchain.xyz](https://eventchain.xyz)
- **Documentation**: [https://docs.eventchain.xyz](https://docs.eventchain.xyz)
- **GitHub**: [https://github.com/eventchain/eventchain](https://github.com/eventchain/eventchain)
- **Discord**: [https://discord.gg/eventchain](https://discord.gg/eventchain)
- **Twitter**: [@EventChainXYZ](https://twitter.com/EventChainXYZ)

---

**Built with ❤️ by the EventChain team**
