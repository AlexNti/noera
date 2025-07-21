"use server";

import {
  TokenBalanceResponse,
  TokenMetadata,
  TokenMetadataResponse,
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

export async function getTokenBalance(address: string) {
  try {
    const url = buildUrl(`/${API_KEY}`);
    const res = await http.post<TokenBalanceResponse>(url, {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getTokenBalances",
      params: [address, ["0x58d4cE183E0194a2d6Ca67F22259757e206dfffE"]],
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

export async function getToken(address: string): Promise<{
  error: string | null;
  data: {
    tokenBalance: string | null;
    tokenMetadata: TokenMetadata | null;
  } | null;
}> {
  const tokenBalances = await getTokenBalance(address);
  if (tokenBalances.error !== null) {
    return { error: tokenBalances.error, data: null };
  }

  const metadata = await getTokenMetadata(
    tokenBalances.data.tokenBalances[0].contractAddress
  );
  if (metadata.error !== null) {
    return { error: metadata.error, data: null };
  }

  const balance = formatUnits(
    tokenBalances.data.tokenBalances[0].tokenBalance,
    metadata.data.decimals
  );

  return {
    error: null,
    data: {
      tokenBalance: balance,
      tokenMetadata: metadata.data,
    },
  };
}
