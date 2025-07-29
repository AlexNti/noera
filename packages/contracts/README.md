# Contracts Package

This package exports compiled smart contract artifacts and TypeScript types for use in other packages.

## Usage

### In another package (e.g., frontend)

1. **Add as dependency:**

   ```json
   {
     "dependencies": {
       "contracts": "workspace:*"
     }
   }
   ```

2. **Import contract factories:**

   ```typescript
   import { Escrow__factory, FranekTataToken__factory } from "contracts";
   import { ethers } from "ethers";

   // Create contract instance
   const escrowContract = Escrow__factory.connect(address, signer);
   ```

3. **Import contract artifacts:**

   ```typescript
   // Dynamic import for artifacts
   const getEscrowABI = async () => {
     const { artifacts } = await import("contracts");
     const escrowArtifact = await artifacts.Escrow();
     return escrowArtifact.default.abi;
   };
   ```

4. **Import contract types:**
   ```typescript
   import { Escrow } from "contracts";
   ```

## Build

```bash
pnpm run build
```

This creates:

- `dist/index.js` - CommonJS bundle
- `dist/index.mjs` - ESM bundle
- `dist/index.d.ts` - TypeScript declarations
- `dist/artifacts/` - Contract artifacts
- `dist/typechain-types/` - TypeScript types

## Development

```bash
pnpm run build:watch  # Watch mode for development
pnpm run compile      # Compile contracts with Hardhat
```
