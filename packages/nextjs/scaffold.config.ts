import * as chains from "viem/chains";

// Define Polygon Amoy testnet for EventChain
const polygonAmoy = {
  ...chains.polygonAmoy,
  name: "Polygon Amoy Testnet",
  network: "polygon-amoy",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology"],
    },
    public: {
      http: ["https://rpc-amoy.polygon.technology"],
    },
  },
  blockExplorers: {
    default: {
      name: "PolygonScan",
      url: "https://amoy.polygonscan.com",
    },
  },
} as const;

// Define Polygon Mainnet for production
const polygonMainnet = {
  ...chains.polygon,
  name: "Polygon Mainnet",
  network: "polygon",
} as const;

export type EventChainConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  dApp: {
    name: string;
    description: string;
    url: string;
    icon: string;
  };
};

const scaffoldConfig = {
  // The networks on which EventChain is deployed
  targetNetworks: [polygonAmoy, chains.hardhat, chains.localhost],

  // The interval at which your front-end polls the RPC servers for new data
  pollingInterval: 30000,

  // EventChain Alchemy API key for reliable RPC access
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",

  // EventChain WalletConnect project ID for Web3 modal
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,

  // EventChain dApp metadata
  dApp: {
    name: "EventChain",
    description: "Next-generation Web3 event management platform with zero-knowledge privacy",
    url: "https://eventchain.xyz",
    icon: "https://eventchain.xyz/icon.png",
  },
} as const satisfies EventChainConfig;

export default scaffoldConfig;