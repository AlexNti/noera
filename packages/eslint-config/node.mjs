import globals from 'globals';
import baseConfig from './index.mjs';

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha, // For tests
      },
    },
    rules: {
      // Node.js specific rules
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
