"use client";

import { useState, useEffect, use } from "react";
import { getProvider } from "@/app/_utils";
import { useRouter } from "next/navigation";
import { TokenMetadata } from "@/app/_actions/types";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const createCookie = (name: string, value: string): string => {
  if (typeof document === "undefined") return value;

  document.cookie = `${name}=${value}; max-age=3600000; path=/; SameSite=lax`;
  return value;
};

const getUserAddress = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = getProvider();
  if (!provider) throw new Error("Provider not available");

  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return address;
};

export const ConnectWallet = () => {
  const [address, setAddress] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedAddress = getCookie("escrow_sing_user_address");
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  const handleConnectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userAddress = await getUserAddress();
      if (userAddress) {
        setAddress(userAddress);
        createCookie("escrow_sing_user_address", userAddress);
        router.push(`/wallet`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-4">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={handleConnectWallet}
        disabled={isLoading}
      >
        {isLoading
          ? "Connecting..."
          : address
          ? "Wallet Connected"
          : "Connect Wallet"}
      </button>

      {error && <div className="text-red-600 text-sm text-center">{error}</div>}

      {address && (
        <div className="text-gray-700 text-sm">
          Connected Address: <span className="font-mono">{address}</span>
        </div>
      )}
    </div>
  );
};

export function TokenBalance({
  token,
}: {
  token: Promise<{
    error: string | null;
    data: {
      tokenBalance: string | null;
      tokenMetadata: TokenMetadata | null;
    } | null;
  }>;
}) {
  const { data, error } = use(token);

  if (error) {
    return <div className="mt-4 text-center text-red-600">Error: {error}</div>;
  }

  if (!data) {
    return (
      <div className="mt-4 text-center">
        <h2 className="text-lg font-semibold mb-1">Token Balance</h2>
        <div>Loading...</div>
      </div>
    );
  }

  const { tokenBalance, tokenMetadata } = data;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      {tokenMetadata ? (
        <div className="flex items-center space-x-3">
          {tokenMetadata.logo ? (
            <img
              src={tokenMetadata.logo}
              alt={`${tokenMetadata.symbol} logo`}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {tokenMetadata.symbol.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}

          {/* Token Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">
                  {tokenMetadata.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {tokenMetadata.symbol} • {tokenMetadata.decimals} decimals
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {tokenBalance !== null ? (
                    <span className="font-mono text-sm">{tokenBalance}</span>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {tokenMetadata.symbol}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">No metadata available</div>
          </div>
        </div>
      )}
    </div>
  );
}
