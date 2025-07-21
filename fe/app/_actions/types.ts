export type TokenBalanceResult = {
  address: string;
  tokenBalances: Array<{
    contractAddress: string;
    tokenBalance: string;
  }>;
};

export type TokenBalanceResponse = {
  jsonrpc: string;
  id: string | number;
  result: TokenBalanceResult;
};

export type TokenMetadata = {
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
};

export type TokenMetadataResponse = {
  jsonrpc: string;
  id: string | number;
  result: TokenMetadata;
};
