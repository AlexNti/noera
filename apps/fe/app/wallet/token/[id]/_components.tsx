"use client";

import { getAssetTransfers, revalidateCache } from "@/app/_actions";
import { use } from "react";
import { formatUnits } from "ethers";
import { useState, useEffect } from "react";

import { http } from "@/libs/http";
import { sendToken, delegateVotingPower } from "@/app/_utils";

export const Send = ({ tokenAddress }: { tokenAddress: string }) => {
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transferData, setTransferData] = useState({
    toAddress: "",
    amount: "",
  });

  const handleTransfer = async () => {
    if (!transferData.toAddress || !transferData.amount) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const tx = await sendToken({
        tokenAddress,
        toAddress: transferData.toAddress,
        amount: transferData.amount,
      });
      console.log(tx);
      setShowTransferForm(false);
      setTransferData({ toAddress: "", amount: "" });
      revalidateCache();
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Send Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setShowTransferForm(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer"
          title="Send Token"
        >
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span className="text-sm font-medium text-white group-hover:opacity-100 transition-opacity duration-200">
              Send
            </span>
          </div>
        </button>
      </div>

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 w-full h-full">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setShowTransferForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Transfer Form Content */}
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Send Token
                  </h3>
                  <p className="text-sm text-gray-600">
                    Transfer tokens to another address
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Recipient Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={transferData.toAddress}
                    onChange={(e) =>
                      setTransferData({
                        ...transferData,
                        toAddress: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.0"
                    step="0.000001"
                    value={transferData.amount}
                    onChange={(e) =>
                      setTransferData({
                        ...transferData,
                        amount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowTransferForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={
                    isLoading || !transferData.toAddress || !transferData.amount
                  }
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Send Transfer"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const GovernanceChecker = ({
  tokenAddress,
  walletAddress,
}: {
  tokenAddress: string;
  walletAddress: string;
}) => {
  const [governanceData, setGovernanceData] = useState<{
    hasGovernance: boolean;
    votingPower: string;
    governorAddress?: string;
    delegateAddress?: string;
    isLoading: boolean;
    error?: string;
  }>({
    hasGovernance: false,
    votingPower: "0",
    isLoading: true,
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleDelegateVotingPower = async () => {
    const tx = await delegateVotingPower({
      tokenAddress,
      walletAddress,
    });
    console.log(tx);
  };

  useEffect(() => {
    const checkGovernance = async () => {
      try {
        const response = await http.get(
          `/wallet/token/${tokenAddress}/governance`
        );
        const data = response.data;

        console.log(data);

        const responseData = data as {
          votes: string;
        };

        setGovernanceData({
          hasGovernance: true,
          votingPower: responseData.votes,
          isLoading: false,
          error: undefined,
        });
      } catch {
        setGovernanceData({
          hasGovernance: false,
          votingPower: "0",
          isLoading: false,
          error: "Failed to check governance",
        });
      }
    };

    if (tokenAddress && walletAddress) {
      checkGovernance();
    }
  }, [tokenAddress, walletAddress]);

  // Don't render anything if no governance or still loading
  if (governanceData.isLoading || !governanceData.hasGovernance) {
    return null;
  }

  return (
    <>
      {/* Discrete Governance Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowPopup(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer"
          title="Governance Info"
        >
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm font-medium text-white group-hover:opacity-100 transition-opacity duration-200">
              {parseFloat(governanceData.votingPower) > 0
                ? `${parseFloat(governanceData.votingPower).toFixed(1)} votes`
                : "Governance"}
            </span>
          </div>
        </button>
      </div>

      {/* Governance Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 w-full h-full">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Governance Content */}
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Governance Token
                  </h3>
                  <p className="text-sm text-gray-600">
                    Voting power and delegation
                  </p>
                </div>
              </div>

              {/* Voting Power */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Your Voting Power
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {parseFloat(governanceData.votingPower).toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {parseFloat(governanceData.votingPower) > 0
                    ? "You can participate in governance proposals"
                    : "No voting power available"}
                </div>
              </div>

              {/* Delegate Info */}
              <div className="space-y-3">
                {/* Status */}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Governance Active
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all cursor-pointer">
                  View Proposals
                </button>
                <button
                  onClick={handleDelegateVotingPower}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Delegate Votes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const TokenTransactions = ({
  transfers,
  walletAddress,
}: {
  transfers: ReturnType<typeof getAssetTransfers>;
  walletAddress: string;
}) => {
  const { data, error } = use(transfers);

  if (error) {
    return (
      <div className="text-center bg-red-100 border border-red-300 p-4 rounded-md">
        <p className="text-red-700 font-semibold">Error loading transactions</p>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (!data || data.transfers.length === 0) {
    return (
      <div className="text-center text-gray-500 border border-gray-200 rounded-md p-6">
        <p className="font-semibold text-lg">No transactions found</p>
        <p className="text-sm mt-1">
          This wallet has no matching activity for this token.
        </p>
      </div>
    );
  }

  const formatAddress = (addr: string) => {
    if (!addr) {
      return "Native ETH";
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="p-8">
      <div className="space-y-6">
        {/* Transactions List */}
        <div className="space-y-4">
          {data.transfers.map((tx) => {
            const isIncoming =
              typeof tx.to === "string" &&
              tx.to.toLowerCase() === walletAddress.toLowerCase();
            const symbol = tx.asset || "TOKEN";
            const value = tx.rawContract?.value
              ? formatUnits(
                  tx.rawContract.value,
                  parseInt(tx.rawContract.decimal || "18")
                )
              : tx.value?.toString() || "0";

            return (
              <div
                key={tx.uniqueId}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 relative overflow-hidden w-full"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Transaction Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>

                      {/* Transaction Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-bold text-gray-800">
                            {isIncoming ? "Received" : "Sent"} {symbol}
                          </span>
                          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full border border-purple-200">
                            {tx.category?.toUpperCase() || "TOKEN"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="font-medium">
                            Block #{parseInt(tx.blockNum, 16)}
                          </span>
                          <span className="text-purple-400">•</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {formatAddress(tx.hash)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Value and Direction */}
                    <div className="text-right">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-xl font-bold ${
                            isIncoming ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isIncoming ? "+" : "-"} {value}
                        </span>
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {symbol}
                        </span>
                      </div>

                      <div className="text-xs font-medium mt-2">
                        <span
                          className={`px-3 py-1 rounded-full ${
                            isIncoming
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isIncoming ? "Received" : "Sent"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-bold text-gray-700">From:</span>
                        <span className="ml-2 font-mono text-gray-600">
                          {formatAddress(tx.from)}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-bold text-gray-700">To:</span>
                        <span className="ml-2 font-mono text-gray-600">
                          {formatAddress(tx.to)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TokenTransactions;
