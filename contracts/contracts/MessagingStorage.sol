// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MessageStorage {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    Message[] public messages;
    mapping(address => Message[]) public userMessages;

    event MessageSent(address indexed sender, string content, uint256 timestamp);

    function sendMessage(string memory _content) public {
        Message memory newMessage = Message({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp
        });
        
        messages.push(newMessage);
        userMessages[msg.sender].push(newMessage);
        
        emit MessageSent(msg.sender, _content, block.timestamp);
    }

    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }

    function getUserMessages(address _user) public view returns (Message[] memory) {
        return userMessages[_user];
    }

    function getMessageCount() public view returns (uint256) {
        return messages.length;
    }
}