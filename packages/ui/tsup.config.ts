import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    card: 'src/components/card/Card.tsx',
    theme: 'src/theme.css',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  minify: true,
  esbuildOptions(options) {
    options.treeShaking = true;
  },
});
