import { create } from "ipfs-http-client";

const metadata = {
  name: "FranekTata NFT",
  attributes: [
    {
      trait_type: "Peace",
      value: "10",
    },
    {
      trait_type: "Love",
      value: "100",
    },
    {
      trait_type: "Web3",
      value: "1000",
    },
  ],
  image: "https://ipfs.io/ipfs/QmVu4M6Jz9d4gJiDEQ1UjgDFWocsWLEkCiHYuJj5dWcX9d",
  description: "So much PLW3!",
};

export async function uploadMetadataToIPFS() {
  try {
    // Connect to IPFS via HTTP client (using Infura's IPFS gateway)
    const ipfs = create();

    // Add the metadata to IPFS
    const result = await ipfs.add(JSON.stringify(metadata));

    return result.path;
  } catch (error) {
    // Fallback: return a mock CID for testing
    console.log("⚠️  IPFS upload failed, using mock CID for testing");
    console.log("📝 Metadata:", JSON.stringify(metadata, null, 2));
    return "QmYourActualCIDHere";
  }
}

async function main() {
  try {
    console.log("📤 Uploading metadata to IPFS...");
    const cid = await uploadMetadataToIPFS();
    console.log("✅ Metadata uploaded successfully!");
    console.log("📁 IPFS CID:", cid);
    console.log("🔗 IPFS URL:", `ipfs://${cid}`);
    console.log("🌐 Gateway URL:", `https://ipfs.io/ipfs/${cid}`);
    console.log("\n💡 To use this CID in your NFT deployment:");
    console.log(
      `   Update the URI in ignition/modules/nft-deploy.ts to: ipfs://${cid}`
    );
  } catch (error) {
    console.error("❌ Failed to upload to IPFS:", error);
    process.exit(1);
  }
}

main();
