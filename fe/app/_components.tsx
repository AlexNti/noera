"use client";

import {
  getProvider,
  deployEscrowContract,
  getContractBalance,
  approveEscrow,
} from "./_utils";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";

// Navigation Component
export const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Escrow App
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Escrow
            </Link>
            <Link
              href="/wallet"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Wallet
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const ApproveArbiterUI = ({
  contractAddress,
  arbiter,
  account,
  signer,
}: {
  contractAddress: string;
  arbiter: string;
  account: string | null;
  signer: ethers.Signer | null;
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const getBalance = async () => {
      const provider = getProvider();
      if (!provider) return;
      const balance = await getContractBalance({
        provider,
        contractAddress,
      });
      setBalance(balance);
    };
    getBalance();
  }, [contractAddress]);

  const handleApprove = async () => {
    if (!signer) return;

    setIsApproving(true);
    try {
      const res = await approveEscrow({
        contractAddress,
        signer,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="w-full">
      <p className="text-sm text-gray-600 mt-2 text-center">
        Contract Balance: {balance} ETH
      </p>
      <button
        onClick={handleApprove}
        disabled={isApproving || account !== arbiter}
        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isApproving ? "Approving..." : "Approve Contract"}
      </button>
      {account !== arbiter && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          Only the arbiter can approve this contract
        </p>
      )}
    </div>
  );
};

export const Escrow = () => {
  const provider = getProvider();
  const [account, setAccount] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<string>("");
  const [arbiter, setArbiter] = useState<string>("");
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contractAddress, setContractAddress] = useState<string>("");

  const [deployedContract, setDeployedContract] =
    useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (deployedContract) {
      deployedContract.on("Approved", (arbiter: string) => {
        console.log("Approved by arbiter:", arbiter);

        setTimeout(() => {
          setDeployedContract(null);
          setContractAddress("");
        }, 2000);
      });
    }
  }, [deployedContract]);

  useEffect(() => {
    const initAccount = async () => {
      if (!provider) return;
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setSigner(signer);
      setAccount(address);
    };
    initAccount();
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signer) return;

    try {
      const contract = await deployEscrowContract({
        signer,
        arbiter,
        beneficiary,
        value: ethers.parseEther("1"),
      });
      setDeployedContract(contract as ethers.Contract);

      const address = await contract.getAddress();
      setContractAddress(address);
      console.log("Contract deployed at:", address);
      alert(`Contract deployed successfully at: ${address}`);
    } catch (error) {
      console.error("Deployment failed:", error);
      alert("Deployment failed. Check console for details.");
    }
  };

  return (
    <>
      {contractAddress ? (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md flex flex-col gap-6 text-black">
          <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
            <svg
              className="w-7 h-7 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="#bbf7d0"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2l4-4"
              />
            </svg>
            Contract Deployed!
          </h2>
          <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
            <p className="text-green-800 font-semibold">
              Escrow Contract Address:
            </p>
            <p className="text-sm text-gray-700 break-all">{contractAddress}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded border border-blue-200 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01"
                />
              </svg>
              Awaiting Arbiter Approval
            </h3>
            <p className="text-blue-700 text-sm mb-4 text-center">
              The arbiter (<span className="font-mono">{arbiter}</span>) must
              approve the contract to release the funds to the beneficiary.
            </p>
            <ApproveArbiterUI
              contractAddress={contractAddress}
              arbiter={arbiter}
              account={account}
              signer={signer}
            />
          </div>
        </div>
      ) : (
        <form
          className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md flex flex-col gap-6 text-black"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Escrow Setup
          </h2>

          {account && (
            <div className="mb-4 p-3 bg-blue-100 rounded">
              <p className="text-blue-800 text-sm">
                Connected Account: {account}
              </p>
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="beneficiary">
              Beneficiary Address
            </label>
            <input
              id="beneficiary"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="0x..."
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="arbiter">
              Arbiter Address
            </label>
            <input
              id="arbiter"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="0x..."
              value={arbiter}
              onChange={(e) => setArbiter(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Deploy Escrow Contract (1 ETH)
          </button>
        </form>
      )}
    </>
  );
};
