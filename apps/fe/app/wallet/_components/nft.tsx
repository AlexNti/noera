'use client';

import { getNFTs } from '@/app/_actions';
import { use } from 'react';

import { Card } from '@noera/ui/card';

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
          <Card
            appearance='glass'
            size='md'
            elevation='sm'
            hover='scale'
            interactive
            key={`${nft.contract?.address || 'unknown'}-${nft.tokenId || 'unknown'}`}
          >
            {nft.image?.cachedUrl ? (
              <Card.Image
                alt='NFT Example'
                src={nft.image?.cachedUrl}
              />
            ) : (
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
            )}
            {/* NFT Image Container */}
            <Card.Body>
              <Card.Title>{nft.name || `${nft.contract?.name || 'Unknown'} #${nft.tokenId || 'Unknown'}`}</Card.Title>
              <Card.Subtitle>
                <span>{nft.contract?.name || 'Unknown Contract'}</span>
                <Card.Tag>{nft.tokenType || 'Unknown'}</Card.Tag>
              </Card.Subtitle>
              <Card.Description>{nft.description}</Card.Description>
              <div className='space-y-2'>
                {/* Attributes */}
                {nft.raw?.metadata?.attributes && nft.raw.metadata.attributes.length > 0 && (
                  <Card.Attributes className='mt-2 flex flex-wrap gap-1'>
                    {nft.raw.metadata.attributes.slice(0, 3).map((attr, index) => (
                      <Card.Attribute
                        key={index}
                        className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700'
                      >
                        {attr.trait_type}: {attr.value}
                      </Card.Attribute>
                    ))}
                    {nft.raw.metadata.attributes.length > 3 && (
                      <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700'>
                        +{nft.raw.metadata.attributes.length - 3} more
                      </span>
                    )}
                  </Card.Attributes>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
