// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20, ERC20Permit, ERC20Votes {
    address public governor;

    constructor()
        ERC20("GovernanceToken", "GVT")
        ERC20Permit("GovernanceToken")
    {
        _mint(msg.sender, 10000e18); // mint to deployer (or deployer delegates to self)
    }

    function setGovernor(address _governor) external {
        require(governor == address(0), "Governor already set");
        governor = _governor;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == governor, "Not governor");
        _mint(to, amount);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(
        address owner
    ) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
