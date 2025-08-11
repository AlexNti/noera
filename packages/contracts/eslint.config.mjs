import nodeConfig from '@noera/eslint-config/node';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'artifacts/', 'cache/', 'typechain-types/', 'build/'],
  },
  ...nodeConfig,
  {
    files: ['**/*.{js,ts}'],
    // Contracts-specific overrides
    rules: {
      // Allow console.log in contracts (for debugging)
      'no-console': 'off',
    },
  },
];
