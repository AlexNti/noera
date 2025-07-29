// Export contract types and interfaces
export * from "../typechain-types/contracts";
export * from "../typechain-types/common";

// Import artifacts directly
import escrowArtifact from "../artifacts/contracts/Escrow.sol/Escrow.json";
import franekTataTokenArtifact from "../artifacts/contracts/FranekTataToken.sol/FranekTataToken.json";
import franekTataTokenUpgradeableArtifact from "../artifacts/contracts/FranekTataTokenUpgradeable.sol/FranekTataTokenUpgradeable.json";
import franekTataTokenUpgradeableV2Artifact from "../artifacts/contracts/FranekTataTokenUpgradeableV2.sol/FranekTataTokenUpgradeableV2.json";
import governanceTokenArtifact from "../artifacts/contracts/GovernanceToken.sol/GovernanceToken.json";
import myGovernorArtifact from "../artifacts/contracts/MyGovernor.sol/MyGovernor.json";
import franekekosKokosNFTArtifact from "../artifacts/contracts/FranekekosKokosNFT.sol/FranekekosKokosNFT.json";
import franekosKokosNFTArtifact from "../artifacts/contracts/FranekosKokosNFT.sol/FranekosKokosNFT.json";
import storageSlotArtifact from "../artifacts/contracts/StorageSlot.sol/StorageSlot.json";

// Export simple ABIs
export const abis = {
  Escrow: escrowArtifact.abi,
  FranekTataToken: franekTataTokenArtifact.abi,
  FranekTataTokenUpgradeable: franekTataTokenUpgradeableArtifact.abi,
  FranekTataTokenUpgradeableV2: franekTataTokenUpgradeableV2Artifact.abi,
  GovernanceToken: governanceTokenArtifact.abi,
  MyGovernor: myGovernorArtifact.abi,
  FranekekosKokosNFT: franekekosKokosNFTArtifact.abi,
  FranekosKokosNFT: franekosKokosNFTArtifact.abi,
  StorageSlot: storageSlotArtifact.abi,
};

// Export bytecodes
export const bytecodes = {
  Escrow: escrowArtifact.bytecode,
  FranekTataToken: franekTataTokenArtifact.bytecode,
  FranekTataTokenUpgradeable: franekTataTokenUpgradeableArtifact.bytecode,
  FranekTataTokenUpgradeableV2: franekTataTokenUpgradeableV2Artifact.bytecode,
  GovernanceToken: governanceTokenArtifact.bytecode,
  MyGovernor: myGovernorArtifact.bytecode,
  FranekekosKokosNFT: franekekosKokosNFTArtifact.bytecode,
  FranekosKokosNFT: franekosKokosNFTArtifact.bytecode,
  StorageSlot: storageSlotArtifact.bytecode,
};

// Export factories
export * from "../typechain-types/factories/contracts";
