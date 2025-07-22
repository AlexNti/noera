import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FranekTataNFT", (m) => {
  const franekTataNFT = m.contract("FranekTataNFT");

  const deployer = m.getAccount(0);

  m.call(franekTataNFT, "safeMint", [
    deployer,
    "ipfs://QmVu4M6Jz9d4gJiDEQ1UjgDFWocsWLEkCiHYuJj5dWcX9d",
  ]);

  return { franekTataNFT };
});
