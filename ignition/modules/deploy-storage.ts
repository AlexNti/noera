import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("StorageSlot", (m) => {
  const storageSlot = m.contract("StorageSlot");

  return { storageSlot };
});
