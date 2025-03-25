// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Messaging {
    mapping(address => string[]) private messages;

    event MessageSent(address indexed sender, string message);

    function sendMessage(string memory message) public {
        messages[msg.sender].push(message);
        emit MessageSent(msg.sender, message);
    }

    function getMessages() public view returns (string[] memory) {
        return messages[msg.sender];
    }
}
