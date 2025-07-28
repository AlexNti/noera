import { ethers, upgrades } from "hardhat";

async function main() {
  // This script demonstrates how to upgrade an upgradeable contract
  // You need to provide the proxy address from the initial deployment

  const PROXY_ADDRESS = "0x652216399Ca5C101177F537D7c9b24dED9a4aD23"; // Replace with actual proxy address

  console.log("Upgrading FranekTataTokenUpgradeable to V2...");

  // 1. Deploy the new implementation (V2)
  const FranekTataTokenUpgradeableV2 = await ethers.getContractFactory(
    "FranekTataTokenUpgradeableV2"
  );

  // 2. Upgrade the proxy to point to the new implementation
  const upgraded = await upgrades.upgradeProxy(
    PROXY_ADDRESS,
    FranekTataTokenUpgradeableV2
  );

  await upgraded.waitForDeployment();
  const newImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(PROXY_ADDRESS);

  console.log("Upgrade successful!");
  console.log("Proxy address:", PROXY_ADDRESS);
  console.log("New implementation address:", newImplementationAddress);

  // Test the new functionality
  console.log("Upgrade completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
