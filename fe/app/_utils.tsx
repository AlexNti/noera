import { ethers } from "ethers";
import Escrow from "@/contracts/artifacts/contracts/Escrow.sol/Escrow.json";

let provider: ethers.BrowserProvider | null = null;

export const getProvider = () => {
  if (provider) return provider;
  if (typeof window !== "undefined" && window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
  }
  return provider;
};

const createEscrowFactory = (signer: ethers.Signer) => {
  return new ethers.ContractFactory(
    Escrow.abi as ethers.InterfaceAbi,
    Escrow.bytecode as string,
    signer
  );
};

export const deployEscrowContract = async ({
  signer,
  arbiter,
  beneficiary,
  value,
}: {
  signer: ethers.Signer;
  arbiter: string;
  beneficiary: string;
  value: bigint;
}) => {
  const provider = getProvider();
  if (!provider) throw new Error("Provider not found");

  const factory = createEscrowFactory(signer);

  const contract = await factory.deploy(arbiter, beneficiary, { value });

  await contract.waitForDeployment();

  return contract;
};

export const approveEscrow = async ({
  contractAddress,
  signer,
}: {
  contractAddress: string;
  signer: ethers.Signer;
}) => {
  const contract = new ethers.Contract(contractAddress, Escrow.abi, signer);
  const isApproved = await contract.isApproved();
  if (isApproved) throw new Error("Escrow already approved");
  const tx = await contract.approve();
  await tx.wait();
  return tx;
};

export const getContractBalance = async ({
  provider,
  contractAddress,
}: {
  provider: ethers.BrowserProvider;
  contractAddress: string;
}) => {
  const balance = await provider.getBalance(contractAddress);

  return Number(ethers.formatEther(balance));
};
