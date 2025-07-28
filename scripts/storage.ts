import { ethers } from "hardhat";

async function main() {
  const [deployer, second] = await ethers.getSigners();

  console.log("🚀 Deploying StorageSlot contract...");
  console.log(`👤 Deployer address: ${deployer.address}`);
  console.log(`👤 Second address: ${second.address}`);

  // Deploy the StorageSlot contract
  const StorageSlot = await ethers.getContractFactory("StorageSlot");
  const storageSlot = await StorageSlot.deploy();
  await storageSlot.waitForDeployment();

  const contractAddress = await storageSlot.getAddress();
  console.log(`✅ StorageSlot deployed to: ${contractAddress}`);

  // Set some balances
  console.log(`\n🔄 Setting balances...`);
  await storageSlot.setBalance(1000);
  await storageSlot.connect(second).setBalance(2500);

  // Calculate storage slots for mappings
  console.log(`\n🔍 Calculating storage slots for mappings:`);

  // The mapping is at slot 3 (after a=0, b=1, c=2)
  const mappingSlot = 3;

  // Calculate the storage slot for deployer's balance
  const deployerSlot = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256"],
      [deployer.address, mappingSlot]
    )
  );

  // Calculate the storage slot for second account's balance
  const secondSlot = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256"],
      [second.address, mappingSlot]
    )
  );

  console.log(`📊 Mapping base slot: ${mappingSlot}`);
  console.log(`🔑 Deployer slot: ${deployerSlot}`);
  console.log(`🔑 Second account slot: ${secondSlot}`);

  // Read values using getStorageAt
  console.log(`\n📖 Reading values from storage slots:`);

  const deployerValue = await ethers.provider.getStorage(
    contractAddress,
    deployerSlot
  );
  const secondValue = await ethers.provider.getStorage(
    contractAddress,
    secondSlot
  );

  console.log(
    `💰 Deployer value from slot: ${ethers.formatUnits(deployerValue, 0)}`
  );
  console.log(
    `💰 Second account value from slot: ${ethers.formatUnits(secondValue, 0)}`
  );

  // Verify with contract calls
  console.log(`\n✅ Verifying with contract calls:`);
  const deployerBalance = await storageSlot.balances(deployer.address);
  const secondBalance = await storageSlot.balances(second.address);

  console.log(
    `💰 Deployer balance from contract: ${deployerBalance.toString()}`
  );
  console.log(
    `💰 Second account balance from contract: ${secondBalance.toString()}`
  );

  // Show that they match
  console.log(`\n🎯 Verification:`);
  console.log(
    `Deployer: ${ethers.formatUnits(
      deployerValue,
      0
    )} === ${deployerBalance.toString()}`
  );
  console.log(
    `Second: ${ethers.formatUnits(
      secondValue,
      0
    )} === ${secondBalance.toString()}`
  );

  // Demonstrate reading a non-existent key
  const randomAddress = "0x1234567890123456789012345678901234567890";
  const randomSlot = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256"],
      [randomAddress, mappingSlot]
    )
  );

  const randomValue = await ethers.provider.getStorage(
    contractAddress,
    randomSlot
  );
  console.log(`\n🔍 Random address slot: ${randomSlot}`);
  console.log(
    `💰 Random address value: ${ethers.formatUnits(
      randomValue,
      0
    )} (should be 0)`
  );
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
