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

export type TokenTransactionsResponse = {
  jsonrpc: "2.0";
  id: string | number;
  result: {
    transfers: TokensAssetTransfer[];
    pageKey?: string;
  };
};

type TokensAssetTransfer = {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  erc721TokenId: string | null;
  erc1155Metadata: ERC1155Metadata[] | null;
  tokenId: string | null;
  asset: string;
  category: "external" | "internal" | "erc20" | "erc721" | "erc1155";
  rawContract: {
    value: string;
    address: string | null;
    decimal: string;
  };
};

type ERC1155Metadata = {
  tokenId: string;
  value: string;
};

export interface NFTResponse {
  ownedNfts: NFT[];
  totalCount: number;
  validAt: {
    blockNumber: number;
    blockHash: string;
    blockTimestamp: string;
  };
}

export interface NFT {
  contract: {
    address: string;
    name: string;
    symbol: string;
    totalSupply?: string;
    tokenType: "ERC721" | "ERC1155";
    contractDeployer: string;
    deployedBlockNumber: number;
    spamClassifications: string[];
  };
  tokenId: string;
  tokenType: "ERC721" | "ERC1155";
  name?: string;
  description?: string;
  image?: {
    cachedUrl?: string;
    thumbnailUrl?: string;
    pngUrl?: string;
    contentType?: string;
    size?: number;
    originalUrl?: string;
  };
  raw: {
    tokenUri: string;
    metadata?: {
      name?: string;
      description?: string;
      image?: string;
      attributes?: Array<{
        trait_type: string;
        value: string;
      }>;
    };
  };
  tokenUri: string;
  timeLastUpdated: string;
}
