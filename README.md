# Decentralized Ethereum Messenger

A blockchain-based messaging application built with React, Express.js, and Hardhat that allows users to send immutable messages to a shared chat on the Ethereum blockchain.


    
## Features

- 💬 Persistent on-chain message storage
- 🔒 Wallet authentication using private keys
- ⚡ Real-time message updates
- 📝 Message history visible to all participants

## Tech Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Express.js
- **Blockchain**: Ethereum (Hardhat local network)
- **Smart Contracts**: Solidity

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Git

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/eth-messenger.git
   cd eth-messenger

2. **Install dependencies**:
# Install contract dependencies
cd contracts
npm install

# Install server dependencies
cd ../server
npm install

# Install client dependencies
cd ../client
npm install

# running teh application

1. **start the block chain**:
 cd contracts
 npx hardhat node

 2. **deploy conrtact**:
cd contracts
npx hardhat run scripts/deploy.js --network localhost

 3. **Configure the server**:
 ## in server/index.js edit the following line :
 const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
## run the following commands
 cd server
 node index.js

4. **start frontend**:
## in a new run the following commands
cd client
npm start
