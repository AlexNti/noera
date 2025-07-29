import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["hardhat", "ethers"],
  // Copy artifacts and typechain-types to dist
  onSuccess: "cp -r artifacts dist/ && cp -r typechain-types dist/",
});
