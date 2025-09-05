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
            <Card.Image
              alt='NFT Example'
              src={nft.image?.cachedUrl}
            />

            {/* NFT Image Container */}
            <Card.Body>
              <Card.Title>{nft.name || `${nft.contract?.name || 'Unknown'} #${nft.tokenId || 'Unknown'}`}</Card.Title>
              <Card.Subtitle>
                <span>{nft.contract?.name || 'Unknown Contract'}</span>
                <Card.Tag>{nft.tokenType || 'Unknown'}</Card.Tag>
              </Card.Subtitle>
              <Card.Description>{nft.description}</Card.Description>
              <div className='space-y-2'>
                {nft.raw?.metadata?.attributes && nft.raw.metadata.attributes.length > 0 && (
                  <Card.Attributes className='mt-2 flex flex-wrap gap-1'>
                    {nft.raw.metadata.attributes.slice(0, 3).map((attr, index) => (
                      <Card.Attribute key={index}>
                        {attr.trait_type}: {attr.value}
                      </Card.Attribute>
                    ))}
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
