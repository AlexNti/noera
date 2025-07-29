import { ethers } from "ethers";
import { abis, bytecodes } from "@noera/contracts";

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
    abis.Escrow,
    bytecodes.Escrow as string,
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
  const contract = new ethers.Contract(contractAddress, abis.Escrow, signer);
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

export const delegateVotingPower = async ({
  tokenAddress,
  walletAddress,
}: {
  tokenAddress: string;
  walletAddress: string;
}) => {
  const provider = getProvider();
  if (!provider) throw new Error("Provider not found");
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    tokenAddress,
    abis.GovernanceToken,
    signer
  );
  const tx = await contract.delegate(walletAddress);
  await tx.wait();
  return tx;
};

export const sendToken = async ({
  tokenAddress,
  toAddress,
  amount,
}: {
  tokenAddress: string;
  toAddress: string;
  amount: string;
}) => {
  const provider = getProvider();
  if (!provider) throw new Error("Provider not found");
  const signer = await provider.getSigner();

  const token = new ethers.Contract(tokenAddress, abis.GovernanceToken, signer);
  const decimals = await token.decimals();
  const amountInUnits = ethers.parseUnits(amount, decimals);

  const tx = await token.transfer(toAddress, amountInUnits);
  await tx.wait();
  return tx;
};
