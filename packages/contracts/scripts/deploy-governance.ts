import { ethers } from "hardhat";

async function main() {
  const TokenFactory = await ethers.getContractFactory("GovernanceToken");
  const token = await TokenFactory.deploy();
  await token.waitForDeployment();

  const GovernorFactory = await ethers.getContractFactory("MyGovernor");
  const governor = await GovernorFactory.deploy(await token.getAddress());
  await governor.waitForDeployment();

  await token.setGovernor(await governor.getAddress());

  console.log(
    `Governor deployed to ${await governor.getAddress()}`,
    `Token deployed to ${await token.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
