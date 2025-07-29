import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { buildUrl } from "@/libs/http";
import { cookies } from "next/headers";

const API_KEY = process.env.ALCHEMY_API_KEY;
const url = buildUrl(`/${API_KEY}`);

const provider = new ethers.JsonRpcProvider(url);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const _params = await params;

  const cookieStore = await cookies();
  const holderAddress =
    cookieStore.get("escrow_sing_user_address")?.value || "";
  if (!holderAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const abi = [
    "function getVotes(address) view returns (uint256)",
    "function delegates(address) view returns (address)",
  ];

  const token = new ethers.Contract(_params.id, abi, provider);

  try {
    const votes = await token.getVotes(holderAddress);

    return NextResponse.json({
      votes: ethers.formatEther(votes),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Token does not support ERC20Votes-style governance." },
      { status: 400 }
    );
  }
}
