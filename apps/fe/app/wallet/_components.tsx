'use client';

import { useState, useEffect, use } from 'react';
import { getProvider } from '@/app/_utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getNFTs, getToken } from '@/app/_actions';

import { Card } from '@noera/ui/card';

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const createCookie = (name: string, value: string): string => {
  if (typeof document === 'undefined') return value;

  document.cookie = `${name}=${value}; max-age=3600000; path=/; SameSite=lax`;
  return value;
};

const getUserAddress = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = getProvider();
  if (!provider) throw new Error('Provider not available');

  await window.ethereum.request({
    method: 'wallet_requestPermissions',
    params: [{ eth_accounts: {} }],
  });

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return address;
};

export const ConnectWallet = () => {
  const [address, setAddress] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedAddress = getCookie('escrow_sing_user_address');
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
        createCookie('escrow_sing_user_address', userAddress);
        router.push(`/wallet`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg'>
      <div className='mb-6 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600'>
          <svg
            className='h-8 w-8 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
            />
          </svg>
        </div>
        <h2 className='mb-2 text-xl font-bold text-gray-900'>{address ? 'Wallet Connected' : 'Connect Your Wallet'}</h2>
        <p className='text-sm text-gray-600'>
          {address ? 'Your wallet is ready to use' : 'Connect your MetaMask wallet to get started'}
        </p>
      </div>

      {!address && (
        <button
          className='flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={handleConnectWallet}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className='h-5 w-5 animate-spin'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg
                className='h-5 w-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      )}

      {error && (
        <div className='mt-4 rounded-lg border border-red-200 bg-red-50 p-3'>
          <div className='flex items-center space-x-2'>
            <svg
              className='h-5 w-5 text-red-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span className='text-sm font-medium text-red-700'>{error}</span>
          </div>
        </div>
      )}

      {address && (
        <div className='mt-6 rounded-lg border border-green-200 bg-green-50 p-4'>
          <div className='flex items-center space-x-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
              <svg
                className='h-5 w-5 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <div className='flex-1'>
              <h3 className='font-semibold text-green-900'>Wallet Connected</h3>
              <p className='break-all font-mono text-sm text-green-700'>{address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function TokenBalance({ token }: { token: ReturnType<typeof getToken> }) {
  const { data, error } = use(token);

  if (error !== null) {
    return <div className='mt-4 text-center text-red-600'>Error: {error}</div>;
  }

  if (!data) {
    return (
      <div className='mt-4 text-center'>
        <h2 className='mb-1 text-lg font-semibold'>Token Balance</h2>
        <div>Loading...</div>
      </div>
    );
  }

  return data.map(token => (
    <Link
      key={token.contractAddress}
      href={`/wallet/token/${token.contractAddress}`}
      className='group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-lg'
    >
      <div className='duration-1500 absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent transition-transform ease-out group-hover:translate-x-full'></div>
      {token.metadata ? (
        <div className='flex items-center space-x-3'>
          {token.metadata.logo ? (
            <img
              src={token.metadata.logo}
              alt={`${token.metadata.symbol} logo`}
              className='h-8 w-8 rounded-full'
            />
          ) : (
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500'>
              <span className='text-xs font-bold text-white'>{token.metadata.symbol.slice(0, 2).toUpperCase()}</span>
            </div>
          )}

          {/* Token Info */}
          <div className='min-w-0 flex-1'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='truncate font-semibold text-gray-900'>{token.metadata.name}</h3>
                <p className='text-sm text-gray-500'>
                  {token.metadata.symbol} • {token.metadata.decimals} decimals
                </p>
              </div>
              <div className='text-right'>
                <div className='font-bold text-gray-900'>
                  {token.balance !== null ? (
                    <span className='font-mono text-sm'>{token.balance}</span>
                  ) : (
                    <span className='text-sm text-gray-400'>N/A</span>
                  )}
                </div>
                <div className='text-xs text-gray-500'>{token.metadata.symbol}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex items-center space-x-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
            <svg
              className='h-4 w-4 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
              />
            </svg>
          </div>
          <div className='flex-1'>
            <div className='text-sm text-gray-500'>No metadata available</div>
          </div>
        </div>
      )}
    </Link>
  ));
}

export function NFTs({ nfts }: { nfts: ReturnType<typeof getNFTs> }) {
  const { data, error } = use(nfts);

  if (error !== null) {
    const errorMessage = typeof error === 'string' ? error : error.message || 'Unknown error';
    return <div className='mt-4 text-center text-red-600'>Error: {errorMessage}</div>;
  }

  if (!data.ownedNfts || data.ownedNfts.length === 0) {
    return (
      <div className='mt-4 text-center'>
        <h2 className='mb-1 text-lg font-semibold'>NFT Collection</h2>
        <div className='text-sm text-gray-500'>No NFTs found</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className='mb-4 text-lg font-semibold text-black'>
        NFT Collection ({data.totalCount || data.ownedNfts.length})
      </h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {data.ownedNfts.map(nft => (
          <div
            key={`${nft.contract?.address || 'unknown'}-${nft.tokenId || 'unknown'}`}
            className='group cursor-pointer rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg'
          >
            {/* NFT Image Container */}
            <div className='relative mb-3'>
              {nft.image?.cachedUrl ? (
                <img
                  src={nft.image.cachedUrl}
                  alt={nft.name || `NFT #${nft.tokenId}`}
                  className='h-32 w-full rounded-lg object-cover'
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div
                className={`flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 ${
                  nft.image?.cachedUrl ? 'hidden' : ''
                }`}
              >
                <svg
                  className='h-12 w-12 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
              </div>

              {/* Token ID Badge */}
              <div className='absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white'>
                #{nft.tokenId || 'Unknown'}
              </div>
            </div>

            {/* NFT Info */}
            <div className='space-y-2'>
              <h3 className='truncate text-sm font-bold text-gray-900'>
                {nft.name || `${nft.contract?.name || 'Unknown'} #${nft.tokenId || 'Unknown'}`}
              </h3>

              <div className='flex items-center justify-between text-xs text-gray-600'>
                <span>{nft.contract?.name || 'Unknown Contract'}</span>
                <span className='rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800'>
                  {nft.tokenType || 'Unknown'}
                </span>
              </div>

              {/* Attributes */}
              {nft.raw?.metadata?.attributes && nft.raw.metadata.attributes.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-1'>
                  {nft.raw.metadata.attributes.slice(0, 3).map((attr, index) => (
                    <span
                      key={index}
                      className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700'
                    >
                      {attr.trait_type}: {attr.value}
                    </span>
                  ))}
                  {nft.raw.metadata.attributes.length > 3 && (
                    <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700'>
                      +{nft.raw.metadata.attributes.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              {nft.description && <p className='mt-2 line-clamp-2 text-xs text-gray-600'>{nft.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
