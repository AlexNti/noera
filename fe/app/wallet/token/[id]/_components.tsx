"use client";

import { getAssetTransfers } from "@/app/_actions";
import { use } from "react";
import { formatUnits } from "ethers";

export const TokenTransactions = ({
  transfers,
  walletAddress,
}: {
  transfers: ReturnType<typeof getAssetTransfers>;
  walletAddress: string;
}) => {
  const { data, error } = use(transfers);
  console.log(data);

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
