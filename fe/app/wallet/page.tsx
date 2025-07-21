import { ConnectWallet, TokenBalance } from "./_components";
import { getToken } from "../_actions";
import { Suspense } from "react";
import { cookies } from "next/headers";

export default async function Wallet() {
  const cookieStore = await cookies();
  const address = cookieStore.get("escrow_sing_user_address")?.value || "";
  const token = getToken(address);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Wallet Dashboard
          </h1>
          <ConnectWallet />
          <TokenBalance token={token} />
        </div>
      </div>
    </Suspense>
  );
}
