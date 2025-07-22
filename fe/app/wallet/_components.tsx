"use client";

import { useState, useEffect, use } from "react";
import { getProvider } from "@/app/_utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getNFTs, getToken } from "@/app/_actions";

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
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {address ? "Wallet Connected" : "Connect Your Wallet"}
        </h2>
        <p className="text-gray-600 text-sm">
          {address
            ? "Your wallet is ready to use"
            : "Connect your MetaMask wallet to get started"}
        </p>
      </div>

      {!address && (
        <button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          onClick={handleConnectWallet}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Connecting...</span>
            </>
          ) : (
            <>
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {address && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Wallet Connected</h3>
              <p className="text-green-700 text-sm font-mono break-all">
                {address}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function TokenBalance({
  token,
}: {
  token: ReturnType<typeof getToken>;
}) {
  const { data, error } = use(token);

  if (error !== null) {
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

  return data.map((token) => (
    <Link
      key={token.contractAddress}
      href={`/wallet/token/${token.contractAddress}`}
      className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg hover:bg-gray-50 transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-out"></div>
      {token.metadata ? (
        <div className="flex items-center space-x-3">
          {token.metadata.logo ? (
            <img
              src={token.metadata.logo}
              alt={`${token.metadata.symbol} logo`}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {token.metadata.symbol.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}

          {/* Token Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">
                  {token.metadata.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {token.metadata.symbol} • {token.metadata.decimals} decimals
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {token.balance !== null ? (
                    <span className="font-mono text-sm">{token.balance}</span>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {token.metadata.symbol}
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
    </Link>
  ));
}

export function NFTs({ nfts }: { nfts: ReturnType<typeof getNFTs> }) {
  const { data, error } = use(nfts);

  if (error !== null) {
    const errorMessage =
      typeof error === "string" ? error : error.message || "Unknown error";
    return (
      <div className="mt-4 text-center text-red-600">Error: {errorMessage}</div>
    );
  }

  if (!data.ownedNfts || data.ownedNfts.length === 0) {
    return (
      <div className="mt-4 text-center">
        <h2 className="text-lg font-semibold mb-1">NFT Collection</h2>
        <div className="text-gray-500 text-sm">No NFTs found</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-black">
        NFT Collection ({data.totalCount || data.ownedNfts.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.ownedNfts.map((nft) => (
          <div
            key={`${nft.contract?.address || "unknown"}-${
              nft.tokenId || "unknown"
            }`}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            {/* NFT Image Container */}
            <div className="relative mb-3">
              {nft.image?.cachedUrl ? (
                <img
                  src={nft.image.cachedUrl}
                  alt={nft.name || `NFT #${nft.tokenId}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden"
                    );
                  }}
                />
              ) : null}
              <div
                className={`w-full h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center ${
                  nft.image?.cachedUrl ? "hidden" : ""
                }`}
              >
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Token ID Badge */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                #{nft.tokenId || "Unknown"}
              </div>
            </div>

            {/* NFT Info */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-sm truncate">
                {nft.name ||
                  `${nft.contract?.name || "Unknown"} #${
                    nft.tokenId || "Unknown"
                  }`}
              </h3>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{nft.contract?.name || "Unknown Contract"}</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {nft.tokenType || "Unknown"}
                </span>
              </div>

              {/* Attributes */}
              {nft.raw?.metadata?.attributes &&
                nft.raw.metadata.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {nft.raw.metadata.attributes
                      .slice(0, 3)
                      .map((attr, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {attr.trait_type}: {attr.value}
                        </span>
                      ))}
                    {nft.raw.metadata.attributes.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        +{nft.raw.metadata.attributes.length - 3} more
                      </span>
                    )}
                  </div>
                )}

              {/* Description */}
              {nft.description && (
                <p className="text-xs text-gray-600 line-clamp-2 mt-2">
                  {nft.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
