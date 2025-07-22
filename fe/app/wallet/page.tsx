import { ConnectWallet, NFTs, TokenBalance } from "@/app/wallet/_components";
import { getNFTs, getToken } from "@/app/_actions";
import { Suspense } from "react";
import { cookies } from "next/headers";

export default async function Wallet() {
  const cookieStore = await cookies();
  const walletAddress =
    cookieStore.get("escrow_sing_user_address")?.value || "";
  const token = getToken({ walletAddress });
  const nfts = getNFTs({ walletAddress });

  //TODO FETCH ALL TOKENS AND ITERATE IN THEIR BALANCES.
  //TODO ADD AUTHENTICATION E.X CLERK.
  //TODO CREATE WALLET SHOULD HAPPEN AS EARLY AS POSSIBLE MAYBE PART OF THE AUTHENTICATION PROCESS.
  //TODO EACH USER THAT DEPPOLYS A CONTRACT WE NEED TO SAVE THEM SOMEWHERE SO WE CAN RETRIEVE THEM AN SEE THEIR PROHGRESS (WE CAN USE USERMETDATA OF CLERK) Or custom postgres this can simplify the escrow componetns
  //TODO ALLOW USERS TO CREATE THEIR OWN TOKENS.

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-4xl mx-auto px-4 mt-10 gap-4 flex flex-col">
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Wallet Dashboard
          </h1>
          <ConnectWallet />
          {walletAddress && <TokenBalance token={token} />}
          {walletAddress && <NFTs nfts={nfts} />}
        </div>
      </div>
    </Suspense>
  );
}
