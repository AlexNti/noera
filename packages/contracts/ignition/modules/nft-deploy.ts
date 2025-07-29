import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FranekosKokosNFT", (m) => {
  const franekBaboNFT = m.contract("FranekosKokosNFT");

  const deployer = m.getAccount(0);

  m.call(franekBaboNFT, "safeMint", [
    deployer,
    "https://tomato-fashionable-chipmunk-694.mypinata.cloud/ipfs/bafkreiggojskp6doarvhlg2wxm5z7ry6wjui6j3o2vwosvqd55hd7j7lyu",
  ]);

  return { franekBaboNFT };
});
