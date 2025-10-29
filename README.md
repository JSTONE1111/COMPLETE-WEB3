# COMPLETE-WEB3
// ============================================================================
// 🚀 WEB3 PROJECT - COMPLETE FULL-STACK APPLICATION
// ============================================================================
// Project: Blockchain Portfolio & DeFi Platform
// Tech Stack: React + Node.js + Ethereum + Polygon + SIWE
// ============================================================================

/*
PROJECT STRUCTURE:
==================

web3-platform/
├── frontend/                 # React App
│   ├── src/
│   │   ├── components/       # UI Components
│   │   │   ├── WalletConnect.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── TokenSwap.jsx
│   │   │   └── NFTGallery.jsx
│   │   ├── hooks/           # Custom Hooks
│   │   │   ├── useWallet.js
│   │   │   ├── useBalance.js
│   │   │   └── useContract.js
│   │   ├── services/        # API Services
│   │   │   ├── ethereum.js
│   │   │   ├── polygon.js
│   │   │   └── api.js
│   │   ├── utils/           # Utilities
│   │   │   ├── contracts.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public/
│   ├── package.json
│   └── .env
│
├── backend/                  # Node.js API
│   ├── src/
│   │   ├── routes/          # API Routes
│   │   │   ├── auth.js
│   │   │   ├── portfolio.js
│   │   │   └── transactions.js
│   │   ├── services/        # Business Logic
│   │   │   ├── blockchain.js
│   │   │   ├── siwe.js
│   │   │   └── database.js
│   │   ├── middleware/      # Middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/          # Database Models
│   │   │   ├── User.js
│   │   │   └── Transaction.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── smart-contracts/         # Solidity Contracts
│   ├── contracts/
│   │   ├── Token.sol
│   │   └── NFT.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── test/
│   │   └── Token.test.js
│   ├── hardhat.config.js
│   └── .env
│
├── .github/                 # CI/CD
│   └── workflows/
│       ├── frontend.yml
│       ├── backend.yml
│       └── contracts.yml
│
├── docker-compose.yml       # Docker Setup
├── .gitignore
└── README.md
*/

// ============================================================================
// 📦 PACKAGE.JSON - ROOT
// ============================================================================

const rootPackageJson = {
  "name": "web3-platform",
  "version": "1.0.0",
  "description": "Full-stack Web3 blockchain platform",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "smart-contracts"
  ],
  "scripts": {
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm start",
    "dev:backend": "cd backend && npm run dev",
    "dev:contracts": "cd smart-contracts && npx hardhat node",
    "build": "cd frontend && npm run build",
    "deploy:contracts": "cd smart-contracts && npx hardhat run scripts/deploy.js --network polygon",
    "test": "npm run test:backend && npm run test:frontend && npm run test:contracts",
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test",
    "test:contracts": "cd smart-contracts && npx hardhat test"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
};

// ============================================================================
// 📦 PACKAGE.JSON - FRONTEND
// ============================================================================

const frontendPackageJson = {
  "name": "web3-platform-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "ethers": "^6.9.0",
    "wagmi": "^1.4.0",
    "@rainbow-me/rainbowkit": "^1.3.0",
    "viem": "^1.19.0",
    "@tanstack/react-query": "^5.12.0",
    "axios": "^1.6.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
};

// ============================================================================
// 📦 PACKAGE.JSON - BACKEND
// ============================================================================

const backendPackageJson = {
  "name": "web3-platform-backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "express": "^4.18.0",
    "dotenv": "^16.3.0",
    "ethers": "^6.9.0",
    "siwe": "^2.1.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.0",
    "mongoose": "^8.0.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "axios": "^1.6.0",
    "ws": "^8.14.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.0"
  },
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest"
  }
};

// ============================================================================
// 📦 PACKAGE.JSON - SMART CONTRACTS
// ============================================================================

const contractsPackageJson = {
  "name": "web3-platform-contracts",
  "version": "1.0.0",
  "private": true,
  "devDependencies": {
    "hardhat": "^2.19.0",
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "@nomiclabs/hardhat-ethers": "^2.2.0",
    "@nomiclabs/hardhat-etherscan": "^3.1.0",
    "@openzeppelin/contracts": "^5.0.0",
    "chai": "^4.3.0",
    "ethers": "^6.9.0"
  },
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "deploy:local": "hardhat run scripts/deploy.js --network localhost",
    "deploy:mumbai": "hardhat run scripts/deploy.js --network mumbai",
    "deploy:polygon": "hardhat run scripts/deploy.js --network polygon",
    "verify": "hardhat verify --network polygon"
  }
};

// ============================================================================
// 🎨 FRONTEND - App.jsx (MAIN ENTRY)
// ============================================================================

const frontendApp = `
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { polygon, polygonMumbai, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import SwapPage from './pages/SwapPage';
import NFTPage from './pages/NFTPage';
import DashboardPage from './pages/DashboardPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Styles
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, polygonMumbai],
  [
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_PROJECT_ID }),
    publicProvider()
  ]
);

// Configure wallets
const { connectors } = getDefaultWallets({
  appName: 'Web3 Platform',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains
});

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
});

// Create query client
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-900 text-white">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/swap" element={<SwapPage />} />
                  <Route path="/nft" element={<NFTPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
`;

// ============================================================================
// 💼 FRONTEND - WalletConnect Component
// ============================================================================

const walletConnectComponent = `
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useNetwork } from 'wagmi';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { chain } = useNetwork();

  return (
    <div className="wallet-connect">
      <ConnectButton />
      
      {isConnected && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400">Connected Address:</p>
          <p className="font-mono text-sm">{address}</p>
          
          <p className="text-sm text-gray-400 mt-2">Balance:</p>
          <p className="text-xl font-bold">
            {balance?.formatted} {balance?.symbol}
          </p>
          
          <p className="text-sm text-gray-400 mt-2">Network:</p>
          <p className="text-sm">{chain?.name}</p>
        </div>
      )}
    </div>
  );
}
`;

// ============================================================================
// 📊 FRONTEND - Portfolio Component
// ============================================================================

const portfolioComponent = `
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Portfolio() {
  const { address } = useAccount();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetchPortfolio();
    }
  }, [address]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      
      // Fetch from your backend
      const response = await axios.get(
        \`\${import.meta.env.VITE_API_URL}/api/portfolio/\${address}\`
      );
      
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center text-gray-400">
        <p>No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Value */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg">
        <p className="text-sm text-gray-200">Total Portfolio Value</p>
        <p className="text-4xl font-bold mt-2">
          \${portfolio.totalValue.toLocaleString()}
        </p>
        <p className="text-sm mt-2 text-green-300">
          +\${portfolio.dayChange.toFixed(2)} (24h)
        </p>
      </div>

      {/* Token Holdings */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Token Holdings</h3>
        <div className="space-y-4">
          {portfolio.tokens.map((token) => (
            <div key={token.address} className="flex justify-between items-center">
              <div>
                <p className="font-bold">{token.symbol}</p>
                <p className="text-sm text-gray-400">{token.balance} tokens</p>
              </div>
              <div className="text-right">
                <p className="font-bold">\${token.value.toFixed(2)}</p>
                <p className={\`text-sm \${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}\`}>
                  {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Portfolio History</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={portfolio.history}>
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
`;

console.log('✅ Frontend structure created');
console.log('✅ Package.json files defined');
console.log('✅ Main App component ready');
console.log('✅ Wallet connection setup');
console.log('✅ Portfolio component with charts');