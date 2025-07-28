# EventChain Deployment Guide 🚀

This guide covers deploying EventChain to various environments, from local development to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Testnet Deployment](#testnet-deployment)
- [Mainnet Deployment](#mainnet-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js** v18 or higher
- **Yarn** v3+
- **Git**
- **MetaMask** or compatible Web3 wallet

### Required Accounts

1. **Alchemy Account** - For RPC endpoints
2. **WalletConnect Account** - For wallet connections
3. **Etherscan/Polygonscan Account** - For contract verification
4. **IPFS/Pinata Account** - For metadata storage

## Local Development

### 1. Clone and Install

```bash
git clone https://github.com/your-org/eventchain.git
cd eventchain
yarn install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env
cp packages/nextjs/.env.example packages/nextjs/.env.local

# Edit .env files with your values
```

### 3. Start Local Blockchain

```bash
# Terminal 1: Start Hardhat node
yarn chain
```

### 4. Deploy Contracts

```bash
# Terminal 2: Deploy to local network
yarn deploy
```

### 5. Start Frontend

```bash
# Terminal 3: Start Next.js development server
yarn dev
```

### 6. Access Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testnet Deployment

### Polygon Amoy Testnet

#### 1. Get Test MATIC

- Visit [Polygon Faucet](https://faucet.polygon.technology/)
- Connect your wallet
- Request test MATIC tokens

#### 2. Configure Environment

```bash
# Update .env file
ALCHEMY_API_KEY="your_polygon_amoy_api_key"
DEPLOYER_PRIVATE_KEY="your_wallet_private_key"
POLYGONSCAN_API_KEY="your_polygonscan_api_key"
```

#### 3. Deploy to Testnet

```bash
# Deploy contracts to Polygon Amoy
yarn deploy:testnet

# Verify contracts
yarn verify:testnet
```

#### 4. Update Frontend Configuration

```bash
# Update packages/nextjs/.env.local
NEXT_PUBLIC_EVENTCHAIN_CONTRACT="deployed_contract_address"
NEXT_PUBLIC_VERIFIER_CONTRACT="deployed_verifier_address"
NEXT_PUBLIC_CHAIN_ID="80002"
```

### Ethereum Sepolia Testnet

#### 1. Get Test ETH

- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Request test ETH

#### 2. Deploy

```bash
# Deploy to Sepolia
yarn workspace @eventchain/contracts deploy --network sepolia
```

## Mainnet Deployment

> ⚠️ **WARNING**: Mainnet deployment involves real money. Double-check everything!

### Pre-deployment Checklist

- [ ] Smart contracts audited
- [ ] Comprehensive testing completed
- [ ] Frontend thoroughly tested
- [ ] Gas fees calculated
- [ ] Backup plans in place
- [ ] Team notifications ready

### Polygon Mainnet

#### 1. Prepare Environment

```bash
# Production environment variables
NODE_ENV=production
NEXT_PUBLIC_CHAIN_ID="137"
ALCHEMY_API_KEY="your_polygon_mainnet_api_key"
DEPLOYER_PRIVATE_KEY="your_production_private_key"
```

#### 2. Deploy Contracts

```bash
# Deploy to Polygon mainnet
yarn workspace @eventchain/contracts deploy --network polygon

# Verify contracts
yarn workspace @eventchain/contracts verify --network polygon
```

#### 3. Initialize Contract

```bash
# Run post-deployment initialization
yarn workspace @eventchain/contracts run scripts/initialize.ts --network polygon
```

### Ethereum Mainnet

```bash
# Deploy to Ethereum mainnet
yarn workspace @eventchain/contracts deploy --network mainnet
```

## Frontend Deployment

### Vercel (Recommended)

#### 1. Connect Repository

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Configure build settings:
   - **Framework**: Next.js
   - **Root Directory**: `packages/nextjs`
   - **Build Command**: `yarn build`
   - **Output Directory**: `.next`

#### 2. Environment Variables

Add these in Vercel dashboard:

```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=your_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_EVENTCHAIN_CONTRACT=deployed_address
NEXT_PUBLIC_VERIFIER_CONTRACT=deployed_address
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### 3. Deploy

```bash
# Automatic deployment on push to main
git push origin main
```

### Netlify

#### 1. Build Settings

- **Build command**: `cd packages/nextjs && yarn build && yarn export`
- **Publish directory**: `packages/nextjs/out`

#### 2. Environment Variables

Same as Vercel configuration above.

### AWS Amplify

#### 1. Amplify Configuration

Create `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - yarn install
    build:
      commands:
        - cd packages/nextjs
        - yarn build
  artifacts:
    baseDirectory: packages/nextjs/.next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - packages/nextjs/.next/cache/**/*
```

## Environment Configuration

### Development

```bash
NODE_ENV=development
NEXT_PUBLIC_CHAIN_ID="31337"  # Local hardhat
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Staging/Testnet

```bash
NODE_ENV=staging
NEXT_PUBLIC_CHAIN_ID="80002"  # Polygon Amoy
NEXT_PUBLIC_APP_URL="https://staging.eventchain.xyz"
```

### Production

```bash
NODE_ENV=production
NEXT_PUBLIC_CHAIN_ID="137"    # Polygon Mainnet
NEXT_PUBLIC_APP_URL="https://eventchain.xyz"
```

## Post-Deployment

### 1. Smoke Tests

```bash
# Run basic functionality tests
yarn test:e2e

# Test contract interactions
yarn workspace @eventchain/contracts test:integration
```

### 2. Monitoring Setup

- Set up **Sentry** for error tracking
- Configure **Analytics** (Google Analytics, etc.)
- Set up **Uptime monitoring**
- Configure **Smart contract monitoring**

### 3. Documentation Updates

- Update contract addresses in documentation
- Update API endpoints
- Verify all links and references

## Troubleshooting

### Common Issues

#### Contract Deployment Fails

```bash
# Check gas estimation
yarn workspace @eventchain/contracts run scripts/estimate-gas.ts

# Increase gas limit
yarn deploy --gas-limit 5000000
```

#### Frontend Build Fails

```bash
# Clear Next.js cache
yarn workspace @eventchain/client clean

# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

#### Network Connection Issues

```bash
# Test RPC endpoint
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://polygon-rpc.com
```

### Getting Help

- **Documentation**: Check README.md and wiki
- **Issues**: Search GitHub issues
- **Community**: Join Discord server
- **Support**: Contact maintainers

## Security Considerations

### Smart Contracts

- **Audit contracts** before mainnet deployment
- **Use multisig wallets** for contract ownership
- **Implement timelock** for critical functions
- **Monitor contract activity**

### Frontend

- **Use HTTPS** in production
- **Validate all inputs**
- **Implement CSP headers**
- **Regular dependency updates**

### Infrastructure

- **Secure API keys**
- **Use environment variables**
- **Implement rate limiting**
- **Regular security audits**

---

**Happy Deploying!** 🎉

For more detailed information, refer to the [EventChain Documentation](https://docs.eventchain.xyz).