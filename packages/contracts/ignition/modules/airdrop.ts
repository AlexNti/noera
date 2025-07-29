import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

export default buildModule("Airdrop", (m) => {
  // Use the deployed token address
  const deployedTokenAddress = "0x58d4cE183E0194a2d6Ca67F22259757e206dfffE";

  // Get the deployed contract instance
  const franekTataToken = m.contractAt("FranekTataToken", deployedTokenAddress);

  // Perform the airdrop
  m.call(franekTataToken, "transfer", [
    "0x0C652C35f5908E9fC0102FEBf7f1c72bEBaaf9f3",
    ethers.parseUnits("10", 18),
  ]);

  return { franekTataToken };
});
