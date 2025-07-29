import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Deploying FranekTataTokenUpgradeable...");

  // Get the contract factory
  const FranekTataTokenUpgradeable = await ethers.getContractFactory(
    "FranekTataTokenUpgradeable"
  );

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy the proxy contract
  const token = await upgrades.deployProxy(
    FranekTataTokenUpgradeable,
    [deployer.address],
    {
      initializer: "initialize",
      kind: "uups",
    }
  );

  await token.waitForDeployment();
  const proxyAddress = await token.getAddress();

  console.log("FranekTataTokenUpgradeable deployed to:", proxyAddress);
  console.log("Proxy address:", proxyAddress);

  // Verify the deployment
  console.log("Deployment successful! Proxy address:", proxyAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
