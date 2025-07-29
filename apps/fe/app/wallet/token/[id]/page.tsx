import { getAssetTransfers, fetchNativeTransfers } from "@/app/_actions";
import { cookies } from "next/headers";
import { TokenTransactions, GovernanceChecker, Send } from "./_components";
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
    <div className="space-y-6">
      {/* Governance Checker - only show for non-native tokens */}
      {id !== "native" && (
        <Suspense fallback={<div>Loading governance...</div>}>
          <GovernanceChecker tokenAddress={id} walletAddress={address} />
        </Suspense>
      )}

      {/* Send Button - only show for non-native tokens */}
      {id !== "native" && (
        <Suspense fallback={<div>Loading send...</div>}>
          <Send tokenAddress={id} />
        </Suspense>
      )}

      {/* Token Transactions */}
      <Suspense fallback={<div>Loading...</div>}>
        <TokenTransactions transfers={transfers} walletAddress={address} />
      </Suspense>
    </div>
  );
}
