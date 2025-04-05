import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, AppBar, Toolbar, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Avatar } from '@mui/material';

// List of mythical names and emojis
const mythicalNames = [
  "Zeus 🧑‍⚖️", "Hades ☠️", "Apollo 🌞", "Thor ⚡", "Athena 🦉", 
  "Medusa 🐍", "Cyclops 👁️", "Loki 🦹", "Phoenix 🔥", "Griffin 🦅",
  "Kraken 🐙", "Valkyrie 🛡️", "Merlin 🧙‍♂️", "Fafnir 🐉", "Odin 🦸‍♂️",
  "Sphinx 🦁", "Hydra 🐉", "Cerberus 🐕‍🦺", "Pegasus 🐎", "Banshee 👻"
];

const emojis = ["🧑‍⚖️", "☠️", "🌞", "⚡", "🦉", "🐍", "👁️", "🦹", "🔥", "🦅", "🐙", "🛡️", "🧙‍♂️", "🐉", "🦸‍♂️", "🦁", "🐕‍🦺", "🐎", "👻"];

function App() {
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Create a map to persist the mythical names by wallet address
  const [nameMap, setNameMap] = useState({});

  // Random name generator for mythical names
  const getRandomName = (address) => {
    // Check if we already have a name stored for this address
    if (nameMap[address]) {
      return nameMap[address]; // Use the stored name
    }

    // If not, generate a random name and store it
    const randomName = mythicalNames[Math.floor(Math.random() * mythicalNames.length)];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const fullName = `${randomName} ${emoji}`;

    // Update the nameMap and persist it
    setNameMap(prevMap => ({ ...prevMap, [address]: fullName }));

    return fullName;
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
  
  // Load messages on start and set up polling
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
      // Immediately show the message locally (optimistic update)
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
      // The polling will soon replace this with the blockchain-confirmed message
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the temporary message if sending failed
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
     
          {allMessages.map((message, index) => (
            <ListItem 
              key={index} 
              alignItems="flex-start"
              sx={{
                backgroundColor: message.sender.toLowerCase() === walletAddress.toLowerCase() 
                  ? themeColors.secondary 
                  : 'white',
                mb: 1,
                borderRadius: 2,
                borderLeft: `4px solid ${themeColors.primary}`
              }}
            >
              <Avatar 
                alt="User Avatar" 
                src="/default-avatar.png"
                sx={{ width: 40, height: 40, mr: 2 }} 
              />
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 'medium',
                        color: themeColors.text,
                        mr: 1,
                        '&:hover': {
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }
                      }}
                      onMouseEnter={() => alert(message.sender)} // Show wallet address on hover
                    >
                      {getRandomName(message.sender)} {/* Consistent Name for Each User */}
                    </Typography>
                    <Typography 
                      component="span"
                      sx={{
                        fontSize: '12px',
                        color: themeColors.primary,
                      }}
                    >
                      {message.sender.toLowerCase() === walletAddress.toLowerCase() 
                        ? 'You' 
                        : `${message.sender.substring(0, 6)}...${message.sender.substring(38)}`}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
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
          ))}
        </List>
      </Container>
    </Box>
  );
}

export default App;
