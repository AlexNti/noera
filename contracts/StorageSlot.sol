// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract StorageSlot {
    uint256 public a = 42; // slot 0
    address public b = 0x1234567890123456789012345678901234567890; // slot 1
    bool public c = true; // slot 2

    mapping(address => uint256) public balances;

    function setBalance(uint256 amount) public {
        balances[msg.sender] = amount;
    }
}
