# Decentralized Ethereum Messenger

![Screenshot 2025-04-05 at 23 51 42](https://github.com/user-attachments/assets/ab73e7a3-c244-4ccc-af1a-ccda223ff12d)

A blockchain-based messaging application built with React, Express.js, and Hardhat that allows users to send immutable messages to a shared chat on the Ethereum blockchain.

## Tech Stack
**!! alL names and avatars are randomly chosen and different user might see different names and avatars**
- **Frontend**: React.js with Material-UI
- **Backend**: Express.js
- **Blockchain**: Ethereum (Hardhat local network)
- **Smart Contracts**: Solidity

## names and avatars
The list of mythical names and emojis can be modified in the **App.js** file. The names and emojis are randomly selected for each user.

Avatars: The app selects avatars from the **public** folder (e.g., default-avatar1.png, default-avatar2.png, etc.). You can add more avatar images to the public folder to increase the variety of avatars.

Color Theme: The app uses a purple color scheme by default. You can modify the themeColors object in the **App.js** file to adjust the colors to your liking.

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Git

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/eth-messenger.git
   cd eth-messenger
    ```
2. **Install dependencies**:
    
# Install contract dependencies
```bash
    cd contracts
    npm install
```
# Install server dependencies
```bash
    cd ../server
    npm install
```

# Install client dependencies
```bash
cd ../client
npm install
```

# running teh application

1. **start the block chain**:
```bash
 cd contracts
 npx hardhat node
```
 2. **deploy conrtact**:
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```
 3. **Configure the server**:
 ## in server/index.js edit the following line :
 ```bash
 const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
 ```
## run the following commands
```bash
 cd server
 node index.js
 ```

4. **start frontend**:
## in a new run the following commands
```bash
cd client
npm start
```
