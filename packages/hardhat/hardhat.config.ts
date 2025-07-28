import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

// EventChain Configuration
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";

// Gas price for deployments
const GAS_PRICE = process.env.GAS_PRICE ? parseInt(process.env.GAS_PRICE) : "auto";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "localhost",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    feeRecipient: {
      default: 1,
    },
  },
  networks: {
    // Local development network
    hardhat: {
      forking: process.env.MAINNET_FORKING_ENABLED === "true" 
        ? {
            url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            enabled: true,
          }
        : undefined,
      allowUnlimitedContractSize: true,
      gas: 12000000,
      blockGasLimit: 12000000,
      gasPrice: 20000000000,
      initialBaseFeePerGas: 0,
      accounts: {
        mnemonic: "test test test test test test test test test test test test junk",
        count: 10,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [DEPLOYER_PRIVATE_KEY],
      gas: 12000000,
      blockGasLimit: 12000000,
      gasPrice: 20000000000,
    },
    
    // Testnets
    polygonAmoy: {
      url: `https://polygon-amoy.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 30000000000, // 30 gwei
      gas: 8000000,
      timeout: 120000,
      chainId: 80002,
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 30000000000,
      gas: 8000000,
      chainId: 80001,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 20000000000,
      gas: 8000000,
      chainId: 11155111,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 20000000000,
      gas: 8000000,
      chainId: 5,
    },
    
    // Mainnets
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 30000000000,
      gas: 8000000,
      timeout: 120000,
      chainId: 137,
    },
    ethereum: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: GAS_PRICE,
      gas: 8000000,
      timeout: 120000,
      chainId: 1,
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 100000000, // 0.1 gwei
      gas: 8000000,
      chainId: 42161,
    },
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 1000000000, // 1 gwei
      gas: 8000000,
      chainId: 10,
    },
    
    // Layer 2 Testnets
    arbitrumSepolia: {
      url: `https://arbitrum-sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 100000000,
      gas: 8000000,
      chainId: 421614,
    },
    optimismSepolia: {
      url: `https://optimism-sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 1000000000,
      gas: 8000000,
      chainId: 11155420,
    },
  },
  
  // Contract verification
  etherscan: {
    apiKey: {
      polygon: POLYGONSCAN_API_KEY,
      polygonAmoy: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
      mainnet: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      arbitrumOne: ETHERSCAN_API_KEY,
      optimisticEthereum: ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
    ],
  },
  
  // Gas reporting
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 30,
    token: "MATIC",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
    showTimeSpent: true,
    showMethodSig: true,
    maxMethodDiff: 10,
  },
  
  // TypeChain configuration
  typechain: {
    outDir: "types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
    externalArtifacts: ["externalArtifacts/*.json"],
    dontOverrideCompile: false,
  },
  
  // Contract size limits
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  
  // Deployment paths
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./deploy",
    deployments: "./deployments",
  },
  
  // External deployments
  external: process.env.HARDHAT_FORK
    ? {
        deployments: {
          hardhat: ["deployments/" + process.env.HARDHAT_FORK],
        },
      }
    : undefined,
    
  // Deployment configuration
  deterministicDeployment: (network: string) => {
    // Skip deterministic deployment for local networks
    if (network === "hardhat" || network === "localhost") {
      return undefined;
    }
    return {
      factory: "0x4e59b44847b379578588920ca78fbf26c0b4956c",
      deployer: "0x3fab184622dc19b6109349b94811493bf2a45362",
      funding: "0x0000000000000000000000000000000000000000",
      signedTx: "0x00",
    };
  },
  
  // Mocha test configuration
  mocha: {
    timeout: 120000,
    reporter: "spec",
    recursive: true,
  },
};

export default config;