import { ConnectWallet, TokenBalance } from '@/app/wallet/_components';
import { getNFTs, getToken } from '@/app/_actions';
import { Suspense } from 'react';
import { cookies } from 'next/headers';

import { NFTs } from '@/app/wallet/_components/nft';

export default async function Wallet() {
  const cookieStore = await cookies();
  const walletAddress = cookieStore.get('escrow_sing_user_address')?.value || '';
  const token = getToken({ walletAddress });
  const nfts = getNFTs({ walletAddress });

  //TODO FETCH ALL TOKENS AND ITERATE IN THEIR BALANCES.
  //TODO ADD AUTHENTICATION E.X CLERK.
  //TODO CREATE WALLET SHOULD HAPPEN AS EARLY AS POSSIBLE MAYBE PART OF THE AUTHENTICATION PROCESS.
  //TODO EACH USER THAT DEPPOLYS A CONTRACT WE NEED TO SAVE THEM SOMEWHERE SO WE CAN RETRIEVE THEM AN SEE THEIR PROHGRESS (WE CAN USE USERMETDATA OF CLERK) Or custom postgres this can simplify the escrow componetns
  //TODO ALLOW USERS TO CREATE THEIR OWN TOKENS.
  //TODO Create a proxy solidyt function to allow upgrade.
  //TODO Update the UI to show the burn rate.

  //TODO PRIORITY!!!
  //TODO CREATE A NICE GONVERNCE UI WHERE USERS CAN VODE FOR THEIR TOKENS, FOR EXAMPLE TO INCREASE THE BURN RATE.
  //TODO Lets listen to events when a new proposal is created so we can so the ui uodate.
  //TODO We can lsiten to the cast vote evetns as well.
  //For all of these options, the Governor will be compatible with Tally: users will be able to create proposals, see voting periods and delays following IERC6372
  // , visualize voting power and advocates, navigate proposals, and cast votes.
  //TODO END OF PRIORITY!!!
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='mx-auto mt-10 flex max-w-4xl flex-col gap-4 px-4'>
        <div className='flex flex-col gap-4 rounded-lg p-6'>
          <h1 className='mb-8 text-center text-3xl font-bold text-gray-900'>Wallet Dashboard</h1>
          <ConnectWallet />
          {walletAddress && <TokenBalance token={token} />}
          {walletAddress && <NFTs nfts={nfts} />}
        </div>
      </div>
    </Suspense>
  );
}
