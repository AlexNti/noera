import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FranekTataToken", (m) => {
  const franekTataToken = m.contract("FranekTataToken");

  return { franekTataToken };
});
