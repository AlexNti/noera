"use server";

import {
  TokenBalanceResponse,
  TokenMetadataResponse,
  TokenTransactionsResponse,
} from "./types";
import { formatUnits } from "ethers";
import { http, buildUrl } from "@/libs/http";

const API_KEY = process.env.ALCHEMY_API_KEY;

export const getTokenMetadata = async (address: string) => {
  try {
    const url = buildUrl(`/${API_KEY}`);
    const res = await http.post<TokenMetadataResponse>(url, {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getTokenMetadata",
      params: [address],
    });

    if (res.error) {
      return { error: res.error.message, data: null };
    }

    return { error: null, data: res.data?.result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
};

export async function getTokenBalance({
  walletAddress,
}: {
  walletAddress: string;
}) {
  try {
    const url = buildUrl(`/${API_KEY}`);
    const res = await http.post<TokenBalanceResponse>(url, {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getTokenBalances",
      params: [walletAddress],
    });

    if (res.error !== null) {
      return { error: res.error.message, data: null };
    }

    return { error: null, data: res.data?.result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

export async function getToken({ walletAddress }: { walletAddress: string }) {
  const tokenBalances = await getTokenBalance({ walletAddress });
  if (tokenBalances.error !== null) {
    return { error: tokenBalances.error, data: null };
  }

  const tokens = tokenBalances.data.tokenBalances.filter(
    (token) => token.tokenBalance !== "0"
  );

  try {
    const metadataResults = await Promise.all(
      tokens.map((token) => getTokenMetadata(token.contractAddress))
    );
    const data = tokens.map((token, idx) => {
      const metadata = metadataResults[idx].data;
      if (metadata === null) {
        throw new Error("Token metadata not found");
      }

      const readableBalance = formatUnits(
        token.tokenBalance,
        metadata.decimals
      );

      return {
        contractAddress: token.contractAddress,
        balance: readableBalance,
        metadata,
      };
    });

    const ethRes = await http.post<{ result: string }>(
      buildUrl(`/${API_KEY}`),
      {
        jsonrpc: "2.0",
        id: 2,
        method: "eth_getBalance",
        params: [walletAddress, "latest"],
      }
    );

    const ethHex = ethRes.data?.result ?? "0x0";
    const ethBalance = formatUnits(ethHex, 18);

    const ethToken = {
      contractAddress: "native",
      balance: ethBalance,
      metadata: {
        name: "Sepolia Ether",
        symbol: "ETH",
        decimals: 18,
        logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
      },
    };

    return {
      error: null,
      data: [...data, ethToken],
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

export async function getAssetTransfers({
  walletAddress,
  tokenAddress,
}: {
  walletAddress: string;
  tokenAddress: string;
}) {
  try {
    const url = buildUrl(`/${API_KEY}`);

    const toTransfers = await http.post<TokenTransactionsResponse>(url, {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          toAddress: walletAddress,
          contractAddresses: [tokenAddress],
          category: ["erc20", "erc721", "erc1155"],
          withMetadata: true,
          excludeZeroValue: false,
        },
      ],
    });

    const fromTransfers = await http.post<TokenTransactionsResponse>(url, {
      jsonrpc: "2.0",
      id: 2,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          fromAddress: walletAddress,
          contractAddresses: [tokenAddress],
          category: ["erc20", "erc721", "erc1155"],
          withMetadata: true,
          excludeZeroValue: false,
        },
      ],
    });

    if (toTransfers.error || fromTransfers.error) {
      return {
        error:
          toTransfers.error?.message ||
          fromTransfers.error?.message ||
          "Failed to fetch transfers",
        data: null,
      };
    }

    const allTransfers = [
      ...(toTransfers.data?.result?.transfers || []),
      ...(fromTransfers.data?.result?.transfers || []),
    ].sort((a, b) => parseInt(b.blockNum) - parseInt(a.blockNum));

    return {
      error: null,
      data: {
        transfers: allTransfers,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

export async function fetchNativeTransfers({
  walletAddress,
}: {
  walletAddress: string;
}) {
  try {
    const url = buildUrl(`/${API_KEY}`);

    const [toNative, fromNative] = await Promise.all([
      http.post<TokenTransactionsResponse>(url, {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            toAddress: walletAddress,
            category: ["external"],
            withMetadata: true,
            excludeZeroValue: false,
          },
        ],
      }),
      http.post<TokenTransactionsResponse>(url, {
        jsonrpc: "2.0",
        id: 2,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            fromAddress: walletAddress,
            category: ["external"],
            withMetadata: true,
            excludeZeroValue: false,
          },
        ],
      }),
    ]);

    if (toNative.error || fromNative.error) {
      return {
        error:
          toNative.error?.message ||
          fromNative.error?.message ||
          "Failed to fetch native transfers",
        data: null,
      };
    }

    const allNativeTransfers = [
      ...(toNative.data?.result?.transfers || []),
      ...(fromNative.data?.result?.transfers || []),
    ].sort((a, b) => parseInt(b.blockNum) - parseInt(a.blockNum));

    return {
      error: null,
      data: {
        transfers: allNativeTransfers,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
