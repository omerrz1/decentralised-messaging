
BigInt.prototype.toJSON = function() { return this.toString() };
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers'); // Updated import
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Connect to local Hardhat node - Ethers.js v6 syntax
const provider = new ethers.JsonRpcProvider("http://localhost:8545");
const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Replace with your deployed contract address

// ABI - copy this from contracts/artifacts/contracts/MessageStorage.sol/MessageStorage.json
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_content",
        "type": "string"
      }
    ],
    "name": "sendMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllMessages",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "content",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct MessageStorage.Message[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserMessages",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "content",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct MessageStorage.Message[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMessageCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "messages",
    "outputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// API endpoints
app.get('/messages', async (req, res) => {
  try {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const messages = await contract.getAllMessages();
    
    // Convert BigInt to string
    const serializedMessages = messages.map(msg => ({
      sender: msg.sender,
      content: msg.content,
      timestamp: msg.timestamp.toString() // Convert BigInt to string
    }));
    
    res.json(serializedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post('/messages/send', async (req, res) => {
  try {
    const { content, privateKey } = req.body;
    if (!content || !privateKey) {
      return res.status(400).json({ error: "Content and private key are required" });
    }

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    const tx = await contract.sendMessage(content);
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/messages/user/:address', async (req, res) => {
  try {
    const userAddress = req.params.address;
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const messages = await contract.getUserMessages(userAddress);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});