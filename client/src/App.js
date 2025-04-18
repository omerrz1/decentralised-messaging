import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, AppBar, Toolbar, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Avatar } from '@mui/material';

// List of mythical names, emojis, and avatars
const mythicalNames = [
  "Zeus 🧑‍⚖️", "Hades ☠️", "Apollo 🌞", "Thor ⚡", "Athena 🦉", 
  "Medusa 🐍", "Cyclops 👁️", "Loki 🦹", "Phoenix 🔥", "Griffin 🦅",
  "Kraken 🐙", "Valkyrie 🛡️", "Merlin 🧙‍♂️", "Fafnir 🐉", "Odin 🦸‍♂️",
  "Sphinx 🦁", "Hydra 🐉", "Cerberus 🐕‍🦺", "Pegasus 🐎", "Banshee 👻"
];

const emojis = ["🧑‍⚖️", "☠️", "🌞", "⚡", "🦉", "🐍", "👁️", "🦹", "🔥", "🦅", "🐙", "🛡️", "🧙‍♂️", "🐉", "🦸‍♂️", "🦁", "🐕‍🦺", "🐎", "👻"];

// List of avatars
const avatars = [
  "/default-avatar1.png",
  "/default-avatar2.png",
  "/default-avatar3.png",
  "/default-avatar4.png",
  "/default-avatar5.png",
  "/default-avatar6.png",
  "/default-avatar7.png",
  "/default-avatar8.png",
  "/default-avatar9.png",
  "/default-avatar10.png"
];

function App() {
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Create a map to persist the mythical names and avatars by wallet address
  const [nameMap, setNameMap] = useState({});
  const [avatarMap, setAvatarMap] = useState({});
  const [hoveredAddress, setHoveredAddress] = useState(null);

  // Random name and avatar generator for mythical names
  const getRandomName = (address) => {
    if (nameMap[address]) {
      return nameMap[address]; // Use the stored name
    }
    const randomName = mythicalNames[Math.floor(Math.random() * mythicalNames.length)];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const fullName = `${randomName} ${emoji}`;

    setNameMap(prevMap => ({ ...prevMap, [address]: fullName }));
    return fullName;
  };

  // Random avatar generator
  const getRandomAvatar = (address) => {
    if (avatarMap[address]) {
      return avatarMap[address]; // Use the stored avatar
    }
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setAvatarMap(prevMap => ({ ...prevMap, [address]: randomAvatar }));
    return randomAvatar;
  };

  // Purple color theme
  const themeColors = {
    primary: '#7b1fa2',
    secondary: '#e1bee7',
    background: '#f3e5f5',
    text: '#4a148c'
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/messages');
      const sortedMessages = response.data.sort((a, b) => 
        parseInt(b.timestamp) - parseInt(a.timestamp) // Convert string timestamps to numbers
      );
      setAllMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }; 
  
  useEffect(() => {
    fetchMessages(); // Initial load
    
    // Check for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = () => {
    if (!privateKey) return;
    
    try {
      const wallet = new ethers.Wallet(privateKey);
      setWalletAddress(wallet.address);
      setIsConnected(true);
    } catch (error) {
      console.error('Invalid private key:', error);
      alert('Invalid private key');
    }
  };

  const sendMessage = async () => {
    if (!newMessage || !isConnected) return;
    
    try {
      const tempMessage = {
        sender: walletAddress,
        content: newMessage,
        timestamp: Math.floor(Date.now() / 1000),
        isOptimistic: true // Temporary flag
      };
      setAllMessages(prev => [tempMessage, ...prev]);
      
      // Send to the blockchain via your backend
      await axios.post('http://localhost:3001/messages/send', {
        content: newMessage,
        privateKey: privateKey
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setAllMessages(prev => prev.filter(msg => !msg.isOptimistic));
    }
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: themeColors.background, minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: themeColors.primary }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
            ETH Mythical Chat
          </Typography>
          {isConnected ? (
            <Typography variant="subtitle1" sx={{ color: themeColors.secondary }}>
              Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                size="small"
                label="Private Key"
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                sx={{ 
                  mr: 1, 
                  backgroundColor: 'white', 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: themeColors.secondary,
                    },
                  }
                }}
              />
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: themeColors.secondary,
                  color: themeColors.text,
                  '&:hover': {
                    backgroundColor: '#ce93d8',
                  }
                }}
                onClick={connectWallet}
              >
                Connect
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            label="Type your message"
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isConnected}
            sx={{ 
              mr: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: themeColors.primary,
                },
              }
            }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={sendMessage}
            disabled={!isConnected || !newMessage}
            sx={{
              backgroundColor: themeColors.primary,
              '&:hover': {
                backgroundColor: '#9c27b0',
              }
            }}
          >
            Send
          </Button>
        </Box>

        {/* Message List - Shows ALL messages */}
        <List sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: `1px solid ${themeColors.secondary}`,
          maxHeight: '60vh',
          overflow: 'auto'
        }}>
          {allMessages.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: themeColors.text, fontSize: '18px' }}>No messages yet...</Typography>
          ) : (
            allMessages.map((message, index) => (
              <ListItem 
                key={index} 
                alignItems="flex-start"
                sx={{
                  backgroundColor: message.sender.toLowerCase() === walletAddress.toLowerCase() 
                    ? themeColors.secondary 
                    : 'white',
                  mb: 1,
                  borderRadius: 2,
                  borderLeft: `4px solid ${themeColors.primary}`,
                  animation: 'fadeInSlideUp 0.5s ease-out forwards'
                }}
              >
                <Box
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer', 
                    '&:hover': { 
                      color: themeColors.primary 
                    }
                  }}
                  onMouseEnter={() => setHoveredAddress(message.sender)}
                  onMouseLeave={() => setHoveredAddress(null)}
                >
                  <Avatar 
                    alt="User Avatar" 
                    src={getRandomAvatar(message.sender)}
                    sx={{ width: 40, height: 40, mr: 2 }} 
                  />
                  <Typography variant="body1" sx={{ fontWeight: 'medium', color: themeColors.text }}>
                    {getRandomName(message.sender)}
                  </Typography>
                  {/* Show wallet address next to the avatar when hovered */}
                  {hoveredAddress === message.sender && (
                    <Typography variant="body2" sx={{ ml: 1, color: themeColors.primary }}>
                      {message.sender.substring(0, 6)}...{message.sender.substring(38)}
                    </Typography>
                  )}
                </Box>

                <ListItemText
                  secondary={
                    <>
                      {/* Show the actual message content here */}
                      <Typography variant="body1" sx={{ color: themeColors.text }}>
                        {message.content}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ 
                          color: themeColors.primary,
                          fontWeight: 'bold'
                        }}
                      >
                        {new Date(message.timestamp * 1000).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Container>
    </Box>
  );
}

export default App;
