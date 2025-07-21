import { getAssetTransfers, fetchNativeTransfers } from "@/app/_actions";
import { cookies } from "next/headers";
import { TokenTransactions } from "./_components";
import { Suspense } from "react";

export default async function TokenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const address = cookieStore.get("escrow_sing_user_address")?.value || "";

  const transfers =
    id !== "native"
      ? getAssetTransfers({
          walletAddress: address,
          tokenAddress: id,
        })
      : fetchNativeTransfers({
          walletAddress: address,
        });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TokenTransactions transfers={transfers} walletAddress={address} />
    </Suspense>
  );
}
