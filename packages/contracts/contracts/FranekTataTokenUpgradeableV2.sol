// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract FranekTataTokenUpgradeableV2 is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    // New storage variable for V2
    uint256 public burnRate;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __ERC20_init("FranekTataToken", "FTT");
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();

        // Mint initial supply to the owner
        _mint(initialOwner, 1000000 * 10 ** decimals());
        burnRate = 100; // 1% burn rate (100 basis points)
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // New function in V2
    function setBurnRate(uint256 _burnRate) public onlyOwner {
        require(_burnRate <= 1000, "Burn rate cannot exceed 10%");
        burnRate = _burnRate;
    }

    // Override transfer to add burn mechanism
    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        uint256 burnAmount = (amount * burnRate) / 10000;
        uint256 transferAmount = amount - burnAmount;

        if (burnAmount > 0) {
            _burn(msg.sender, burnAmount);
        }

        return super.transfer(to, transferAmount);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
